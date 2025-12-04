
Add-Type -AssemblyName System.Drawing

$path = "c:\Users\jorge\Desktop\react-native-destkop\windows\tocororo\Assets\LargeTile.scale-400.png"

Write-Host "Procesando: $path"

# Cargar imagen actual (que es 800x800)
$img = [System.Drawing.Image]::FromFile($path)

# Redimensionar a 1240x1240 (requerido por Windows)
$newWidth = 1240
$newHeight = 1240

$bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graph = [System.Drawing.Graphics]::FromImage($bmp)

# Usar interpolación baja para no añadir "ruido" que aumente el tamaño
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

$graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
$img.Dispose()
$graph.Dispose()

# Guardar comprimiendo
# Para comprimir PNG en .NET System.Drawing no es fácil ajustar "calidad" como en JPG.
# El truco es reducir la profundidad de color si es necesario, pero eso es complejo en PowerShell puro.
# Vamos a intentar guardar tal cual, a ver si al ser un escalado simple de una imagen ya pequeña, el tamaño se mantiene bajo.
# Si no, tendremos que usar un truco: guardar como JPG temporalmente para perder calidad y luego convertir a PNG.

$tempJpg = $path + ".temp.jpg"
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
# Calidad 50% para asegurar tamaño bajo
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 50)
$bmp.Save($tempJpg, $codec, $encoderParams)
$bmp.Dispose()

# Ahora convertir ese JPG (que ya es pequeño y "feo") de nuevo a PNG
$imgJpg = [System.Drawing.Image]::FromFile($tempJpg)
$tempPng = $path + ".optimized.png"
$imgJpg.Save($tempPng, [System.Drawing.Imaging.ImageFormat]::Png)
$imgJpg.Dispose()
Remove-Item $tempJpg

$newSize = (Get-Item $tempPng).Length
Write-Host "Nuevo tamaño (1240x1240): $newSize bytes"

if ($newSize -lt 204800) {
    Write-Host "¡Éxito! La imagen es 1240x1240 y pesa menos de 204KB."
    Move-Item -Path $tempPng -Destination $path -Force
} else {
    Write-Host "Aún es muy grande ($newSize bytes). Se requiere intervención manual con herramienta externa."
    # Si falla, borrar el temporal
    if (Test-Path $tempPng) { Remove-Item $tempPng }
}
