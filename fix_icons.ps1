Add-Type -AssemblyName System.Drawing

function Pad-Image($filePath, $size) {
    $original = [System.Drawing.Bitmap]::FromFile($filePath)
    $padded = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($padded)
    
    # Use high quality interpolation
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphics.Clear([System.Drawing.Color]::FromArgb(255, 140, 0, 0))
    $scale = 0.65
    $w = [int]($size * $scale)
    $h = [int]($size * $scale)
    $x = [int](($size - $w) / 2)
    $y = [int](($size - $h) / 2)
    
    $graphics.DrawImage($original, $x, $y, $w, $h)
    
    $original.Dispose()
    $padded.Save("$filePath.new", [System.Drawing.Imaging.ImageFormat]::Png)
    $padded.Dispose()
    $graphics.Dispose()
    
    Remove-Item $filePath -Force
    Rename-Item "$filePath.new" (Split-Path $filePath -Leaf)
}

Pad-Image 'd:\NTT_WEBSITE\ntt-frontend\public\icon-512.png' 512
Pad-Image 'd:\NTT_WEBSITE\ntt-frontend\public\icon-192.png' 192
