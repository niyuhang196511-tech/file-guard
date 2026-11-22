[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateSet('msi', 'nsis')]
    [string]$Kind,
    [Parameter(Mandatory)]
    [string]$ArtifactDirectory,
    [string]$Python = 'python',
    [switch]$CheckDesktop
)

$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT' -or $env:GITHUB_ACTIONS -ne 'true' -or
    $env:RUNNER_ENVIRONMENT -ne 'github-hosted' -or -not $env:RUNNER_TEMP) {
    throw 'Installer smoke tests require a fresh GitHub-hosted Windows runner.'
}

function Invoke-Installer([string]$Path, [string]$Arguments) {
    $process = Start-Process -FilePath $Path -ArgumentList $Arguments -WindowStyle Hidden -Wait -PassThru
    try {
        return $process.ExitCode
    } finally {
        $process.Dispose()
    }
}

function Test-InstalledDesktop([string]$App, [string]$Engine, [string]$Workspace, [string]$Interpreter) {
    $data = Join-Path $Workspace 'Data'
    $database = Join-Path $data 'fileguard.db'
    $previousData = $env:FILEGUARD_DATA
    $appProcess = $null
    $failure = $null
    # Read the background startup audit without creating or updating a database.
    $checkAudit = @'
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

try:
    with closing(sqlite3.connect(Path(sys.argv[1]).as_uri() + "?mode=ro", uri=True, timeout=1)) as db:
        started = db.execute(
            "SELECT 1 FROM audit WHERE action=? AND note=?",
            ("\u5f15\u64ce\u542f\u52a8", "\u540e\u53f0\u542f\u52a8"),
        ).fetchone()
except sqlite3.Error:
    started = None
sys.exit(0 if started else 1)
'@

    try {
        try {
            $env:FILEGUARD_DATA = $data
            $desktopOptions = @{
                FilePath = $App
                ArgumentList = '--background'
                WorkingDirectory = $Workspace
                WindowStyle = 'Hidden'
                PassThru = $true
            }
            $appProcess = Start-Process @desktopOptions
        } finally {
            $env:FILEGUARD_DATA = $previousData
        }
        $childFilter = "ParentProcessId = $($appProcess.Id) AND Name = 'fileguard-engine.exe'"
        $deadline = [DateTime]::UtcNow.AddSeconds(60)
        $started = $false
        do {
            if ($appProcess.HasExited) {
                throw "Installed desktop exited early (code $($appProcess.ExitCode))."
            }
            $children = @(Get-CimInstance Win32_Process -Filter $childFilter -OperationTimeoutSec 10)
            foreach ($child in $children) {
                if ($child.ExecutablePath -ne $Engine) {
                    throw "Unexpected installed desktop child path '$($child.ExecutablePath)' (expected '$Engine')."
                }
            }
            if ($children.Count -eq 1 -and (Test-Path -LiteralPath $database -PathType Leaf)) {
                $checkAudit | & $Interpreter - $database
                if ($LASTEXITCODE -eq 0) {
                    $started = $true
                    break
                }
            }
            Start-Sleep -Milliseconds 500
        } while ([DateTime]::UtcNow -lt $deadline)
        if (-not $started) {
            throw "Desktop PID $($appProcess.Id) did not start '$Engine' and log a background startup in '$database'."
        }
        Write-Host "Installed desktop started its sidecar at $Engine."
    } catch {
        $failure = $_
    } finally {
        if ($null -ne $appProcess) {
            try {
                if (-not $appProcess.HasExited) {
                    $appProcess.Kill()
                    if (-not $appProcess.WaitForExit(10000)) {
                        throw "Installed desktop PID $($appProcess.Id) did not exit."
                    }
                }
                $deadline = [DateTime]::UtcNow.AddSeconds(20)
                do {
                    $remaining = @(Get-CimInstance Win32_Process -Filter "Name = 'fileguard-engine.exe'" -OperationTimeoutSec 10 |
                        Where-Object ExecutablePath -EQ $Engine)
                    if ($remaining.Count -eq 0) { break }
                    Start-Sleep -Milliseconds 500
                } while ([DateTime]::UtcNow -lt $deadline)
                if ($remaining.Count -ne 0) {
                    throw "Installed engine processes did not shut down: $($remaining.ProcessId -join ', ')."
                }
            } catch {
                if ($null -eq $failure) { $failure = $_ } else { Write-Warning $_.Exception.Message }
            } finally {
                $appProcess.Dispose()
            }
        }
    }
    if ($null -ne $failure) { throw $failure }
}

$artifact = Get-Item -LiteralPath $ArtifactDirectory
if ($artifact -isnot [IO.DirectoryInfo]) { throw 'ArtifactDirectory must be a folder.' }
$pattern = if ($Kind -eq 'msi') { '*.msi' } else { '*-setup.exe' }
$installers = @(Get-ChildItem -LiteralPath $artifact.FullName -Recurse -File -Filter $pattern)
if ($installers.Count -ne 1) {
    throw "Expected one $pattern installer in '$($artifact.FullName)', found $($installers.Count)."
}
$installer = $installers[0]
$checksums = Join-Path $installer.DirectoryName 'SHA256SUMS.txt'
$checksumPattern = '^([a-f0-9]{64})  ' + [regex]::Escape($installer.Name) + '$'
$expected = @(Get-Content -LiteralPath $checksums | ForEach-Object {
    if ($_ -match $checksumPattern) { $Matches[1] }
})
if ($expected.Count -ne 1 -or
    (Get-FileHash -LiteralPath $installer.FullName -Algorithm SHA256).Hash -ne $expected[0]) {
    throw "SHA-256 verification failed for '$($installer.Name)'."
}

# MSI and NSIS identify previous installations through these product registrations.
foreach ($hive in @('HKCU:\', 'HKLM:\')) {
    foreach ($software in @('Software', 'Software\WOW6432Node')) {
        $registry = Join-Path $hive "$software\Microsoft\Windows\CurrentVersion\Uninstall"
        if (Test-Path -LiteralPath $registry) {
            foreach ($entry in Get-ChildItem -LiteralPath $registry) {
                if ($entry.GetValue('DisplayName') -eq 'FileGuard') {
                    throw "FileGuard is already registered under '$($entry.Name)'."
                }
            }
        }
    }
}
if (Get-Process -Name FileGuard,fileguard-engine -ErrorAction SilentlyContinue) {
    throw 'FileGuard is already running.'
}

$runnerTemp = Get-Item -LiteralPath $env:RUNNER_TEMP
if ($runnerTemp -isnot [IO.DirectoryInfo]) { throw 'RUNNER_TEMP must be a folder.' }
$scratch = Join-Path $runnerTemp.FullName ("fileguard-install-$Kind-" + [guid]::NewGuid().ToString('N'))
$install = Join-Path $scratch 'FileGuard Install'
New-Item -ItemType Directory -Path $scratch | Out-Null
if (Test-Path -LiteralPath $install) { throw "Install folder already exists: '$install'." }
Write-Host "Installer smoke workspace: $scratch"

$appPath = Join-Path $install 'fileguard.exe'
$enginePath = Join-Path $install 'fileguard-engine.exe'
$adminPath = Join-Path $install 'FileGuard-RecordAdmin.cmd'
$installedFiles = @($appPath, $enginePath, $adminPath)
$installLog = Join-Path $scratch 'install.log'
$uninstallLog = Join-Path $scratch 'uninstall.log'
$msiexec = Join-Path $env:SystemRoot 'System32\msiexec.exe'
$nsisUninstaller = Join-Path $install 'uninstall.exe'
$installed = $false
$failure = $null
$env:PYTHONUTF8 = '1'

try {
    if ($Kind -eq 'msi') {
        $arguments = '/i "{0}" INSTALLDIR="{1}" /qn /norestart /l*v "{2}"' -f $installer.FullName, $install, $installLog
        $result = Invoke-Installer $msiexec $arguments
    } else {
        # NSIS consumes the rest of its command line as the unquoted /D value.
        $result = Invoke-Installer $installer.FullName "/S /D=$install"
    }
    if ($result -ne 0) {
        throw "$Kind installation exited with code $result (workspace '$scratch')."
    }
    $installed = $true
    foreach ($file in $installedFiles) {
        if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
            throw "Installer is missing expected file '$file'."
        }
    }
    if (Test-Path -LiteralPath (Join-Path $install 'portable.flag')) {
        throw 'Installed program unexpectedly contains portable.flag.'
    }
    & $Python (Join-Path $PSScriptRoot 'check-engine.py') --engine $enginePath
    if ($LASTEXITCODE -ne 0) {
        throw "Installed engine protocol check exited with code $LASTEXITCODE."
    }
    if ($CheckDesktop) {
        Test-InstalledDesktop $appPath $enginePath $scratch $Python
    }
} catch {
    $failure = $_
} finally {
    try {
        if ($Kind -eq 'msi') {
            $arguments = '/x "{0}" /qn /norestart /l*v "{1}"' -f $installer.FullName, $uninstallLog
            $result = Invoke-Installer $msiexec $arguments
            # 1605 means the failed installation never registered its product.
            if ($result -ne 0 -and ($installed -or $result -ne 1605)) {
                throw "MSI removal exited with code $result (log '$uninstallLog')."
            }
        } elseif (Test-Path -LiteralPath $nsisUninstaller -PathType Leaf) {
            $result = Invoke-Installer $nsisUninstaller '/S'
            if ($result -ne 0) { throw "NSIS removal exited with code $result." }
        } elseif ($installed) {
            throw "NSIS uninstaller is missing at '$nsisUninstaller'."
        }
        foreach ($file in $installedFiles + $nsisUninstaller) {
            if (Test-Path -LiteralPath $file) { throw "Installed file remains after uninstall: '$file'." }
        }
    } catch {
        if ($null -eq $failure) { $failure = $_ } else { Write-Warning $_.Exception.Message }
    }
}
if ($null -ne $failure) { throw $failure }
Write-Host "$Kind install, installed engine protocol and uninstall passed."
