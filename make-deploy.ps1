$paths = @(
  "app", "lib", "prisma", "public",
  "package.json", "package-lock.json",
  "next.config.mjs", "tsconfig.json",
  "tailwind.config.ts", "postcss.config.js",
  ".env.example"
)

$existing = $paths | Where-Object { Test-Path $_ }
if ($existing.Count -eq 0) { Write-Error "هیچ موردی پیدا نشد."; exit 1 }

$dest = "checkhub-deploy.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }
Compress-Archive -Path $existing -DestinationPath $dest -Force
Write-Host "✅ ساخته شد: $dest"
