Add-Type -AssemblyName System.Drawing
foreach($name in @('banner-1.jpg', 'banner-2.jpg', 'banner-3.jpg')) {
    $img = [System.Drawing.Bitmap]::FromFile("public/assets/home/homeheaderimages/$name")
    $w = $img.Width
    $h = $img.Height
    
    $minY = $h; $maxY = 0; $minX = $w; $maxX = 0
    for ($y = 0; $y -lt $h; $y += 2) {
        for ($x = 0; $x -lt $w; $x += 2) {
            $c = $img.GetPixel($x, $y)
            if ($c.R -gt 15 -or $c.G -gt 15 -or $c.B -gt 15) {
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    Write-Host "$name bounds: X=$minX to $maxX, Y=$minY to $maxY (Content Size: $($maxX-$minX) x $($maxY-$minY))"
    $img.Dispose()
}
