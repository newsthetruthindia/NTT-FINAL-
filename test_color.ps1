Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('d:\NTT_WEBSITE\ntt-frontend\public\icon-512.png')
$pixel = $img.GetPixel(10, 10)
Write-Output "Pixel color at (10,10): A=$($pixel.A), R=$($pixel.R), G=$($pixel.G), B=$($pixel.B)"
$img.Dispose()
