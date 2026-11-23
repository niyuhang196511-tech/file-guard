param(
    [Parameter(Mandatory)]
    [ValidateSet('Venv', 'RecordAdmin')]
    [string]$Mode
)

$ErrorActionPreference = 'Stop'
$project = Split-Path $PSScriptRoot -Parent
$venv = Join-Path $project '.venv'
$venvPython = Join-Path $venv 'Scripts\python.exe'

function Test-Python312([string]$Executable, [string[]]$Arguments) {
    $ErrorActionPreference = 'SilentlyContinue'
    & $Executable @Arguments -c 'import sys; sys.exit(sys.version_info[:2] != (3, 12))' *> $null
    return $?
}

$python = $null
$pythonArgs = @()
if (Test-Path -LiteralPath $venvPython -PathType Leaf) {
    if (-not (Test-Python312 $venvPython @())) {
        throw 'The project .venv does not run Python 3.12. Rename .venv and run setup again.'
    }
    if ($Mode -eq 'Venv') { exit 0 }
    $python = $venvPython
} else {
    $hasUv = Get-Command uv -ErrorAction SilentlyContinue
    if ($hasUv) {
        if ($Mode -eq 'Venv') {
            & uv venv --python 3.12 --seed $venv
            exit $LASTEXITCODE
        }
        $uvPython = (& uv python find 3.12 2>$null)
        if ($uvPython -and (Test-Path -LiteralPath $uvPython -PathType Leaf) -and (Test-Python312 $uvPython @())) {
            $python = $uvPython
            $pythonArgs = @()
        }
    }

    if (-not $python) {
        $candidates = @(@('python3.12.exe'), @('py.exe', '-3.12'), @('python.exe'))
        foreach ($candidate in $candidates) {
            $command = Get-Command -Name $candidate[0] -CommandType Application -ErrorAction SilentlyContinue |
                Select-Object -First 1
            if (-not $command) { continue }
            $arguments = @($candidate | Select-Object -Skip 1)
            if (Test-Python312 $command.Source $arguments) {
                $python = $command.Source
                $pythonArgs = $arguments
                break
            }
        }
    }
    if (-not $python) {
        throw 'Install Python 3.12 and make python3.12.exe, py.exe, uv, or python.exe available on PATH.'
    }
}

if ($Mode -eq 'Venv') {
    & $python @pythonArgs -m venv $venv
    exit $LASTEXITCODE
}

Push-Location -LiteralPath $project
try {
    & $python @pythonArgs -m engine.main --record-admin
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
