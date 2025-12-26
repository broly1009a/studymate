# Script to fix all dynamic route params for Next.js 15

$files = Get-ChildItem -Path "src\app\api" -Filter "route.ts" -Recurse | Where-Object {
    $_.DirectoryName -match '\[.*\]'
}

$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Pattern 1: { params }: { params: { id: string } }
    if ($content -match '\{ params \}: \{ params: \{ id: string \} \}') {
        $content = $content -replace '\{ params \}: \{ params: \{ id: string \} \}', '{ params }: { params: Promise<{ id: string }> }'
        $modified = $true
    }
    
    # Pattern 2: { params }: { params: { slug: string } }
    if ($content -match '\{ params \}: \{ params: \{ slug: string \} \}') {
        $content = $content -replace '\{ params \}: \{ params: \{ slug: string \} \}', '{ params }: { params: Promise<{ slug: string }> }'
        $modified = $true
    }
    
    # Pattern 3: Add await params after connectDB() for id
    if ($content -match 'await connectDB\(\);\s*\n\s*const \w+Id = params\.id;') {
        $content = $content -replace '(await connectDB\(\);)\s*\n(\s*)(const \w+Id = params\.id;)', "`$1`n`$2const { id } = await params;`n`$2`$3"
        $content = $content -replace 'params\.id', 'id'
        $modified = $true
    }
    
    # Pattern 4: Add await params after connectDB() for slug
    if ($content -match 'await connectDB\(\);\s*\n\s*const \w+ = params\.slug;') {
        $content = $content -replace '(await connectDB\(\);)\s*\n(\s*)(const \w+ = params\.slug;)', "`$1`n`$2const { slug } = await params;`n`$2`$3"
        $content = $content -replace 'params\.slug', 'slug'
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
        $count++
    }
}

Write-Host "`nTotal files fixed: $count"
