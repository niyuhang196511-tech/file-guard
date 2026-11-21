$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"
Set-Location (Split-Path $PSScriptRoot -Parent)
function Check-Step([string]$Name) { if ($LASTEXITCODE -ne 0) { throw "$Name failed ($LASTEXITCODE)" } }
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) { throw "Install Rust stable x64 MSVC and Visual Studio C++ Build Tools." }
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) { throw "Install Node.js 22 or later." }
if (-not (Test-Path ".venv\Scripts\python.exe")) {
    $usePython = $false
    if (Get-Command python -ErrorAction SilentlyContinue) {
        python -c "import sys; sys.exit(0 if sys.version_info[:2] == (3,12) else 1)"
        $usePython = $LASTEXITCODE -eq 0
    }
    if ($usePython) { python -m venv .venv } else { py -3.12 -m venv .venv }
    Check-Step "Python 3.12 virtual environment"
}
$py = ".venv\Scripts\python.exe"
& $py -m pip install -r requirements.txt "pyinstaller>=6.12,<7"
Check-Step "Python packages"
& $py -m unittest discover -s tests -v
Check-Step "Engine regression tests"
& $py -m PyInstaller --noconfirm --clean --onefile --console --name fileguard-engine --paths . --add-data "engine/schema.sql;engine" --collect-all openpyxl --collect-all docx --collect-all pptx --collect-all pypdf --collect-all yaml --collect-submodules watchdog engine/main.py
Check-Step "Engine packaging"
& $py scripts/check-engine.py --engine dist/fileguard-engine.exe
Check-Step "Packaged engine protocol and restore"
New-Item -ItemType Directory -Force src-tauri/binaries | Out-Null
Copy-Item dist/fileguard-engine.exe src-tauri/binaries/fileguard-engine-x86_64-pc-windows-msvc.exe -Force
npm.cmd install --no-audit --no-fund
Check-Step "Tauri CLI"
npm.cmd run typecheck
Check-Step "TypeScript"
node --test tests/test-ledger.cjs
Check-Step "Ledger reconciliation tests"
npm.cmd run build:ui
Check-Step "Chinese interface"
npm.cmd run tauri -- build
Check-Step "Desktop build"
$release = "src-tauri/target/release"
$version = (Get-Content -Raw -Encoding UTF8 src-tauri/tauri.conf.json | ConvertFrom-Json).version
$out = "release/$version"
New-Item -ItemType Directory -Force $out | Out-Null
$staging = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
$portable = Join-Path $staging "FileGuard-Portable-x64"
New-Item -ItemType Directory -Path $portable -Force | Out-Null
try {
    Copy-Item "$release/fileguard.exe" "$portable/FileGuard.exe"
    Copy-Item dist/fileguard-engine.exe $portable
    Copy-Item "FileGuard-RecordAdmin.cmd" $portable
    New-Item -ItemType File -Path "$portable/portable.flag" | Out-Null
    $archive = "$out/FileGuard-Portable-x64.zip"
    Compress-Archive -Path $portable -DestinationPath $archive -Force
    $packages = @((Get-Item $archive))
    foreach ($pattern in @("$release/bundle/nsis/*_${version}_*.exe", "$release/bundle/msi/*_${version}_*.msi")) {
        $matchesForVersion = @(Get-ChildItem -File -Path $pattern)
        if ($matchesForVersion.Count -ne 1) { throw "Expected one $pattern package, found $($matchesForVersion.Count)." }
        $packages += Copy-Item -Path $matchesForVersion[0].FullName -Destination $out -Force -PassThru
    }
    $checksums = foreach ($file in $packages) {
        $hash = (Get-FileHash -Algorithm SHA256 -Path $file.FullName).Hash.ToLowerInvariant()
        "$hash  $($file.Name)"
    }
    $checksums | Set-Content -Path "$out/SHA256SUMS.txt" -Encoding ASCII
    $checksums
} finally {
    Remove-Item -LiteralPath $staging -Recurse -Force
}
