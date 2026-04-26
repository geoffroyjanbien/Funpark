Add-Type -AssemblyName System.Drawing

$imagePath = "c:\Users\geoff\Desktop\dev\Funpark\client\src\assets\funpark.jpg"
$bitmap = New-Object System.Drawing.Bitmap($imagePath)

Write-Host "Image dimensions: $($bitmap.Width)x$($bitmap.Height)"
Write-Host ""

# Sample colors from different horizontal positions (letters F, u, n, p, a, r, k)
# Assuming text is centered, sample from middle height and spread across width
$height = [int]($bitmap.Height / 2)
$positions = @(
    @{Letter="F"; X=[int]($bitmap.Width * 0.15)},
    @{Letter="u"; X=[int]($bitmap.Width * 0.25)},
    @{Letter="n"; X=[int]($bitmap.Width * 0.35)},
    @{Letter="p"; X=[int]($bitmap.Width * 0.45)},
    @{Letter="a"; X=[int]($bitmap.Width * 0.55)},
    @{Letter="r"; X=[int]($bitmap.Width * 0.65)},
    @{Letter="k"; X=[int]($bitmap.Width * 0.75)}
)

foreach ($pos in $positions) {
    $pixel = $bitmap.GetPixel($pos.X, $height)
    $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
    Write-Host "$($pos.Letter): $hex (R:$($pixel.R) G:$($pixel.G) B:$($pixel.B)) at position ($($pos.X), $height)"
}

$bitmap.Dispose()
