# Archive Markdown docs into ./archived_docs
$files = @(
    'VISUAL_SUMMARY.md',
    'REQUIREMENT_VERIFICATION.md',
    'QUICK_START.md',
    'QUICK_REFERENCE_GUIDE.md',
    'PROJECT_SUMMARY.md',
    'LEARNING_CHECKLIST.md',
    'IMPLEMENTATION_CHECKLIST.md',
    'FEATURES_IMPLEMENTED.md',
    'DOCUMENTATION_INDEX.md',
    'DEPLOYMENT_GUIDE.md',
    'CODE_SIMPLIFICATION_SUMMARY.md'
)
$archiveDir = Join-Path -Path $PSScriptRoot -ChildPath '..\archived_docs'
if (-not (Test-Path $archiveDir)) { New-Item -ItemType Directory -Path $archiveDir | Out-Null }

foreach ($f in $files) {
    $src = Join-Path -Path $PSScriptRoot -ChildPath "..\$f"
    if (Test-Path $src) {
        Write-Output "Archiving: $f"
        Move-Item -Path $src -Destination $archiveDir -Force
    } else {
        Write-Output "Not found (skipping): $f"
    }
}
Write-Output "Done. Archived files (if present) moved to: $archiveDir"