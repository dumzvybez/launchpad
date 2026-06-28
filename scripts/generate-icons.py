#!/usr/bin/env python3
"""
Render the Launchpad favicon using the EXACT same SVG paths as the splash screen,
at native resolution for each size (no downscaling).

At small sizes (16x16, 32x32), gradients become muddy noise — so we use a
solid bright color (the middle of the gradient: violet #E879F9) which stays
crisp and recognizable as a tab icon.

At larger sizes (192+, 512), we keep the full gradient — it looks premium
on home screens and PWA install.
"""

import os
from PIL import Image, ImageDraw

OUT_DIR = "/home/z/my-project/public/icons"
os.makedirs(OUT_DIR, exist_ok=True)

# Splash screen SVG paths (in viewBox 0 0 512 512)
PATHS = [
    "M 96 320 L 256 200 L 416 320 L 416 360 L 256 240 L 96 360 Z",
    "M 136 220 L 256 140 L 376 220 L 376 260 L 256 180 L 136 260 Z",
    "M 176 120 L 256 80 L 336 120 L 336 160 L 256 120 L 176 160 Z",
]

# Brand colors (from splash gradient stops)
TEAL = (45, 212, 191, 255)
VIOLET = (232, 121, 249, 255)
AMBER = (252, 211, 77, 255)
BG_DARK = (13, 17, 23, 255)


def parse_path(path_str):
    """Parse 'M x y L x y L x y Z ...' into a list of (x, y) tuples."""
    tokens = path_str.replace(",", " ").split()
    points = []
    i = 0
    while i < len(tokens):
        cmd = tokens[i]
        i += 1
        if cmd == "M" or cmd == "L":
            x = float(tokens[i]); y = float(tokens[i + 1])
            points.append((x, y))
            i += 2
        elif cmd == "Z":
            pass
        else:
            # Unknown — skip
            pass
    return points


def scale_points(points, scale, offset_x=0, offset_y=0):
    return [(p[0] * scale + offset_x, p[1] * scale + offset_y) for p in points]


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(4))


def gradient_at(x, y, size):
    """Diagonal gradient from teal (bottom-left) -> violet (middle) -> amber (top-right)."""
    t = (x + y) / (size + size)
    if t < 0.5:
        return lerp_color(TEAL, VIOLET, t * 2)
    return lerp_color(VIOLET, AMBER, (t - 0.5) * 2)


def draw_rounded_rect(draw, size, radius, margin, fill):
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=fill,
    )


def render_icon(size, *, use_gradient=True, bg=True, maskable=False):
    """
    Render the Launchpad logo at the given size using the exact splash SVG paths.

    - use_gradient: if True, sample gradient per-pixel (good for 192+). If False,
      use a single bright color (violet) which stays crisp at 16/32.
    - bg: if True, draw the rounded-rect dark background.
    - maskable: if True, add safe-zone padding (background fills entire canvas).
    """
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    if bg:
        bg_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(bg_img)
        if maskable:
            # Full-bleed background for maskable
            bg_draw.rectangle([0, 0, size, size], fill=BG_DARK)
        else:
            margin = max(1, size // 16)
            radius = max(2, size // 5)
            draw_rounded_rect(bg_draw, size, radius, margin, BG_DARK)
        img = Image.alpha_composite(img, bg_img)

    # Scale paths from 512 viewBox to target size, centered
    # Original paths occupy roughly x: 96-416, y: 80-360 — center of mass ~256, 220
    # We want to scale to fill ~70% of canvas, centered.
    scale = size / 512.0

    # Center the logo group: bounding box center of paths is around (256, 220)
    # After scaling, center is at (256*scale, 220*scale). We want it at (size/2, size/2).
    # So offset = (size/2 - 256*scale, size/2 - 220*scale)
    # But for small sizes, scale up slightly for visibility
    if size <= 32:
        # Boost scale for small icons so logo fills more of the canvas
        scale = (size * 0.85) / 320.0  # 320 = approx path width
    elif size <= 192:
        scale = (size * 0.80) / 320.0

    offset_x = size / 2 - 256 * scale
    offset_y = size / 2 - 220 * scale

    if use_gradient and size >= 96:
        # Per-pixel gradient rendering — render paths into a mask, then composite gradient
        mask = Image.new("L", (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        for path_str in PATHS:
            pts = parse_path(path_str)
            scaled = [(p[0] * scale + offset_x, p[1] * scale + offset_y) for p in pts]
            mask_draw.polygon(scaled, fill=255)

        # Build gradient image
        grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        grad_pixels = grad.load()
        for y in range(size):
            for x in range(size):
                m = mask.getpixel((x, y))
                if m > 0:
                    c = gradient_at(x, y, size)
                    grad_pixels[x, y] = c
        img = Image.alpha_composite(img, grad)
    else:
        # Solid color — use violet (middle of gradient) for crispness at small sizes
        draw = ImageDraw.Draw(img)
        # Slightly thicker at small sizes for visibility
        for path_str in PATHS:
            pts = parse_path(path_str)
            scaled = [(p[0] * scale + offset_x, p[1] * scale + offset_y) for p in pts]
            draw.polygon(scaled, fill=VIOLET)

    return img


# Generate all sizes needed for favicons + PWA manifest
# Favicons: 16, 32 (must be crisp)
# PWA manifest: 72, 96, 128, 144, 152, 192, 384, 512 + maskable 192, 512
# Apple touch: 180
# Logo: 1024

sizes_solid = [16, 32]  # Crisp solid color
sizes_gradient = [72, 96, 128, 144, 152, 180, 192, 384, 512, 1024]  # Full gradient

for s in sizes_solid:
    img = render_icon(s, use_gradient=False, bg=True)
    img.save(f"{OUT_DIR}/favicon-{s}.png")
    print(f"Generated favicon-{s}.png (solid, crisp)")

for s in sizes_gradient:
    img = render_icon(s, use_gradient=True, bg=True)
    if s == 1024:
        img.save(f"{OUT_DIR}/logo-1024.png")
        img.save(f"{OUT_DIR}/logo-large.png")
        print(f"Generated logo-1024.png / logo-large.png")
    elif s == 180:
        img.save(f"{OUT_DIR}/apple-touch-icon.png")
        print(f"Generated apple-touch-icon.png (180x180)")
    else:
        img.save(f"{OUT_DIR}/icon-{s}.png")
        print(f"Generated icon-{s}.png")

# Maskable variants (full-bleed background, safe zone padding)
for s in [192, 512]:
    img = render_icon(s, use_gradient=True, bg=True, maskable=True)
    img.save(f"{OUT_DIR}/icon-{s}-maskable.png")
    print(f"Generated icon-{s}-maskable.png")

# Copy small favicons to /public root (Next.js convention)
img16 = render_icon(16, use_gradient=False, bg=True)
img16.save("/home/z/my-project/public/favicon-16.png")
img16.save("/home/z/my-project/public/favicon-32.png".replace("32", "16"))  # ensure 16 exists

img32 = render_icon(32, use_gradient=False, bg=True)
img32.save("/home/z/my-project/public/favicon-32.png")

# ICO — multi-size embedded
img16.save(
    "/home/z/my-project/public/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
)
print("Generated favicon.ico (multi-size)")

# Also save the SVG logo (vector, matches splash exactly) for inline use
svg = '''<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2DD4BF" />
      <stop offset="50%" stop-color="#E879F9" />
      <stop offset="100%" stop-color="#FCD34D" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="#0D1117" />
  <path d="M 96 320 L 256 200 L 416 320 L 416 360 L 256 240 L 96 360 Z" fill="url(#logo-grad)" />
  <path d="M 136 220 L 256 140 L 376 220 L 376 260 L 256 180 L 136 260 Z" fill="url(#logo-grad)" />
  <path d="M 176 120 L 256 80 L 336 120 L 336 160 L 256 120 L 176 160 Z" fill="url(#logo-grad)" />
</svg>'''
with open(f"{OUT_DIR}/logo.svg", "w") as f:
    f.write(svg)
with open("/home/z/my-project/public/logo.svg", "w") as f:
    f.write(svg)
print("Generated logo.svg")

print("\n✓ All icons rendered — identical branding to splash screen")
