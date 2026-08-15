Add-Type -AssemblyName System.Drawing
$original = [System.Drawing.Image]::FromFile('d:\NTT_WEBSITE\ntt-frontend\public\icon-512.png')
$newSize = 512
$padded = New-Object System.Drawing.Bitmap($newSize, $newSize)
$graphics = [System.Drawing.Graphics]::FromImage($padded)
$graphics.Clear([System.Drawing.Color]::FromArgb(255, 140, 0, 0)) # Red background #8c0000
$scale = 0.6
$w = [int]($original.Width * $scale)
$h = [int]($original.Height * $scale)
$x = [int](($newSize - $w) / 2)
$y = [int](($newSize - $h) / 2)
$graphics.DrawImage($original, $x, $y, $w, $h)
$padded.Save('d:\NTT_WEBSITE\ntt-frontend\public\icon-512-padded.png', [System.Drawing.Imaging.ImageFormat]::Png)
$original.Dispose()
$padded.Dispose()
$graphics.Dispose()
