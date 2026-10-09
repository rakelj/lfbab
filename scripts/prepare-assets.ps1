# Copies the illustrations the app uses from LFB's source folder into public/img,
# resized and compressed for the web. Re-run after adding entries to $assets.
#   powershell -ExecutionPolicy Bypass -File scripts\prepare-assets.ps1 [-Source "D:\LFB Asylbarna"]
param([string]$Source = "D:\LFB Asylbarna")

Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot "..\public\img"
New-Item -ItemType Directory -Force $out | Out-Null

# name = output file (without extension), src = path in source folder, w = max width.
# Images with transparency are cropped to their content and saved as PNG; the rest as JPG.
# Keep src paths ASCII: Windows PowerShell 5 reads this file as ANSI, so use * for letters like ø/å
# (files from a Mac may store "å" as two characters, so ? won't match).
$assets = @(
  # Weather check-in
  @{ name = "weather-clear";    src = "slide illustrasjoner\Untitled_Artwork 147 2.png"; w = 1000 },
  @{ name = "weather-sunset";   src = "slide illustrasjoner\Untitled_Artwork 146 2.png"; w = 1000 },
  @{ name = "weather-breaking"; src = "slide illustrasjoner\Untitled_Artwork 148.png";   w = 1000 },
  @{ name = "weather-storm";    src = "slide illustrasjoner\Untitled_Artwork 149.png";   w = 1000 },
  # Emotion cards
  @{ name = "emotion-glad";     src = "kort\illustrasjoner\Untitled_Artwork 114.png"; w = 360 },
  @{ name = "emotion-hopeful";  src = "kort\illustrasjoner\Untitled_Artwork 115.png"; w = 360 },
  @{ name = "emotion-proud";    src = "kort\illustrasjoner\Untitled_Artwork 116.png"; w = 360 },
  @{ name = "emotion-relieved"; src = "kort\illustrasjoner\Untitled_Artwork 117.png"; w = 360 },
  @{ name = "emotion-sad";      src = "kort\illustrasjoner\Untitled_Artwork 119.png"; w = 360 },
  @{ name = "emotion-scared";   src = "kort\illustrasjoner\Untitled_Artwork 120.png"; w = 360 },
  @{ name = "emotion-angry";    src = "kort\illustrasjoner\Untitled_Artwork 121.png"; w = 360 },
  @{ name = "emotion-lonely";   src = "kort\illustrasjoner\Untitled_Artwork 122.png"; w = 360 },
  # Actor cards
  @{ name = "actor-resident";       src = "kort\illustrasjoner\Untitled_Artwork 139.png"; w = 360 },
  @{ name = "actor-family";         src = "kort\illustrasjoner\Untitled_Artwork 140.png"; w = 360 },
  @{ name = "actor-friends";        src = "kort\illustrasjoner\Untitled_Artwork 141.png"; w = 360 },
  @{ name = "actor-school-staff";   src = "kort\illustrasjoner\Untitled_Artwork 142.png"; w = 360 },
  @{ name = "actor-centre-staff";   src = "kort\illustrasjoner\Untitled_Artwork 143.png"; w = 360 },
  @{ name = "actor-doctor";         src = "kort\illustrasjoner\Untitled_Artwork 144.png"; w = 360 },
  @{ name = "actor-psychologist";   src = "kort\illustrasjoner\Untitled_Artwork 145.png"; w = 360 },
  @{ name = "actor-representative"; src = "kort\illustrasjoner\Untitled_Artwork 146.png"; w = 360 },
  # Story: Stille gutt
  @{ name = "story-quiet-1"; src = "Historier\Slides\stillegutt1.png";  w = 1280 },
  @{ name = "story-quiet-2"; src = "Historier\Slides\stillegutt2.png";  w = 1280 },
  @{ name = "story-quiet-3"; src = "Historier\Slides\stillegutt3.png";  w = 1280 },
  @{ name = "story-quiet-4"; src = "Historier\Slides\stilluegutt4.png"; w = 1280 },
  # Line drawings and small illustrations
  @{ name = "icon-phone";       src = "slide illustrasjoner\Untitled_Artwork 106 copy.png";   w = 400 },
  @{ name = "icon-map";         src = "slide illustrasjoner\Untitled_Artwork 106 copy 3.png"; w = 400 },
  @{ name = "icon-interpreter"; src = "slide illustrasjoner\Untitled_Artwork 106 copy 6.png"; w = 600 },
  @{ name = "icon-health";      src = "slide illustrasjoner\Untitled_Artwork 106 copy 5.png"; w = 600 },
  @{ name = "icon-care";        src = "slide illustrasjoner\Untitled_Artwork 106.png";        w = 400 },
  @{ name = "icon-handshake";   src = "slide illustrasjoner\Untitled_Artwork 118.png";        w = 500 },
  @{ name = "health-cycle";     src = "slide illustrasjoner\fysisk og psykisk helse g*r sammen.png"; w = 900 },
  @{ name = "health-figures";   src = "slide illustrasjoner\Untitled_Artwork 146.png";        w = 900 },
  @{ name = "friends";          src = "slide illustrasjoner\Untitled_Artwork 542.png";        w = 700 },
  @{ name = "sunny-tree";       src = "slide illustrasjoner\Untitled_Artwork 545.png";        w = 500 },
  @{ name = "thumbs-up";        src = "slide illustrasjoner\Untitled_Artwork 540.png";        w = 400 },
  @{ name = "logo";             src = "logo 8.png";                                           w = 400 }
)

$jpg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$jpgParams = New-Object Drawing.Imaging.EncoderParameters 1
$jpgParams.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 82L

# Bounding box of pixels with alpha > 8, scanned through LockBits for speed.
function Get-ContentBounds([Drawing.Bitmap]$bmp) {
  $rect = New-Object Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
  $data = $bmp.LockBits($rect, "ReadOnly", "Format32bppArgb")
  $bytes = New-Object byte[] ($data.Stride * $bmp.Height)
  [Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  $bmp.UnlockBits($data)
  $minX = $bmp.Width; $minY = $bmp.Height; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    $row = $y * $data.Stride
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
      if ($bytes[$row + $x * 4 + 3] -gt 8) {
        if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt 0) { return $rect }
  $pad = 12
  $x0 = [Math]::Max(0, $minX - $pad); $y0 = [Math]::Max(0, $minY - $pad)
  $x1 = [Math]::Min($bmp.Width, $maxX + $pad); $y1 = [Math]::Min($bmp.Height, $maxY + $pad)
  return New-Object Drawing.Rectangle $x0, $y0, ($x1 - $x0), ($y1 - $y0)
}

foreach ($a in $assets) {
  $path = (Get-Item -Path (Join-Path $Source $a.src) -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
  if (-not $path) { Write-Warning "Missing: $($a.src)"; continue }
  $src = [Drawing.Bitmap]::FromFile($path)
  $transparent = ($src.PixelFormat -band [Drawing.Imaging.PixelFormat]::Alpha) -ne 0 -and $src.GetPixel(1, 1).A -lt 255
  $crop = if ($transparent) { Get-ContentBounds $src } else { New-Object Drawing.Rectangle 0, 0, $src.Width, $src.Height }
  $scale = [Math]::Min(1.0, $a.w / $crop.Width)
  $w = [int]($crop.Width * $scale); $h = [int]($crop.Height * $scale)
  $fmt = if ($transparent) { [Drawing.Imaging.PixelFormat]::Format32bppArgb } else { [Drawing.Imaging.PixelFormat]::Format24bppRgb }
  $dst = New-Object Drawing.Bitmap $w, $h, $fmt
  $g = [Drawing.Graphics]::FromImage($dst)
  $g.InterpolationMode = "HighQualityBicubic"; $g.PixelOffsetMode = "HighQuality"; $g.SmoothingMode = "HighQuality"
  $g.DrawImage($src, (New-Object Drawing.Rectangle 0, 0, $w, $h), $crop, "Pixel")
  $g.Dispose(); $src.Dispose()
  if ($transparent) {
    $file = Join-Path $out "$($a.name).png"; $dst.Save($file, [Drawing.Imaging.ImageFormat]::Png)
  } else {
    $file = Join-Path $out "$($a.name).jpg"; $dst.Save($file, $jpg, $jpgParams)
  }
  $dst.Dispose()
  "{0,-28} {1,5}x{2,-5} {3,5} KB" -f (Split-Path $file -Leaf), $w, $h, [int]((Get-Item $file).Length / 1KB)
}
