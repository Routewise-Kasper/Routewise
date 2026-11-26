#!/usr/bin/env python3
"""NodesNews 兜底配图生成器：Gemini 不可用时，用代码生成抽象、科技感的配图。

用法：
    python3 tools/gen_image.py <输出文件.jpg> --style nodes|flow|rings|wave|bars --seed <任意文字> [--tint blue|teal|violet|amber]

- 风格与站内 Gemini 配图一致：深色背景、冷色光、柔和辉光、胶片颗粒、暗角，无文字。
- 同一个 seed 永远生成同一张图；换 seed 或 style 就是不同的图。
- 只依赖 numpy 和 Pillow。
"""
import argparse
import hashlib
import math

import numpy as np
from PIL import Image, ImageFilter

W, H = 1600, 900
TINTS = {
    'blue': ((0.55, 0.72, 1.0), (0.04, 0.06, 0.10)),
    'teal': ((0.50, 0.95, 0.92), (0.03, 0.07, 0.08)),
    'violet': ((0.72, 0.66, 1.0), (0.06, 0.05, 0.11)),
    'amber': ((1.0, 0.62, 0.32), (0.08, 0.05, 0.04)),
}


def rng_from(seed):
    return np.random.default_rng(int(hashlib.sha256(seed.encode()).hexdigest()[:16], 16))


def splat(buf, xs, ys, vals, radius=0):
    xs = np.asarray(xs).astype(int)
    ys = np.asarray(ys).astype(int)
    vals = np.broadcast_to(np.asarray(vals, dtype=float), xs.shape)
    ok = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
    xs, ys, vals = xs[ok], ys[ok], vals[ok]
    np.add.at(buf, (ys, xs), vals)
    if radius:
        for dx in range(-radius, radius + 1):
            for dy in range(-radius, radius + 1):
                if dx or dy:
                    np.add.at(buf, (np.clip(ys + dy, 0, H - 1), np.clip(xs + dx, 0, W - 1)), vals * 0.35)


def line(buf, x0, y0, x1, y1, v, steps=None):
    steps = steps or int(max(abs(x1 - x0), abs(y1 - y0))) + 1
    t = np.linspace(0, 1, steps)
    splat(buf, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, np.full(steps, v))


def style_nodes(r):
    buf = np.zeros((H, W))
    n = 70
    pts = np.c_[r.uniform(0, W, n), r.uniform(0, H, n)]
    pts[:, 1] = H * 0.5 + (pts[:, 1] - H * 0.5) * 0.8
    for i in range(n):
        d = np.hypot(*(pts - pts[i]).T)
        for j in np.argsort(d)[1:4]:
            line(buf, *pts[i], *pts[j], 0.18 * r.uniform(0.4, 1))
    hub = pts[r.integers(n)]
    for p in pts[r.choice(n, 8, replace=False)]:
        line(buf, *hub, *p, 0.45)
    splat(buf, pts[:, 0], pts[:, 1], r.uniform(2, 6, n), radius=2)
    dust = 6000
    splat(buf, r.uniform(0, W, dust), r.uniform(0, H, dust), r.uniform(0.05, 0.4, dust))
    return buf


def style_flow(r):
    buf = np.zeros((H, W))
    k = 900
    y0 = r.uniform(H * 0.2, H * 0.8, k)
    amp = r.uniform(40, 220, k)
    ph = r.uniform(0, math.tau, k)
    fx = r.uniform(0.002, 0.005)
    xs = np.linspace(-50, W + 50, 900)
    focus = r.uniform(0.55, 0.8) * W
    for i in range(k):
        squeeze = np.exp(-((xs - focus) / (W * 0.35)) ** 2)
        ys = y0[i] + (amp[i] * np.sin(xs * fx + ph[i])) * (1 - 0.85 * squeeze) + (H / 2 - y0[i]) * squeeze * 0.9
        splat(buf, xs, ys, np.full(xs.size, 0.012 + 0.03 * squeeze))
    return buf


def style_rings(r):
    buf = np.zeros((H, W))
    cx, cy = W * r.uniform(0.4, 0.6), H * r.uniform(0.42, 0.58)
    for i in range(40):
        rad = 30 * 1.12 ** i
        th = np.linspace(0, math.tau, int(rad * 3) + 60)
        gap = r.uniform(0, math.tau)
        keep = np.abs(np.angle(np.exp(1j * (th - gap)))) > r.uniform(0.2, 1.2)
        splat(buf, cx + rad * np.cos(th[keep]) * 1.15, cy + rad * np.sin(th[keep]) * 0.8, np.full(keep.sum(), 0.6 / (1 + i * 0.08)))
    m = 3000
    a, d = r.uniform(0, math.tau, m), r.uniform(20, 900, m) ** 1.1
    splat(buf, cx + d * np.cos(a), cy + d * np.sin(a) * 0.7, r.uniform(0.1, 0.8, m))
    return buf


def style_wave(r):
    buf = np.zeros((H, W))
    rows, cols = 46, 120
    f1, f2 = r.uniform(0.02, 0.05), r.uniform(0.05, 0.12)
    for j in range(rows):
        z = j / rows
        yb = H * 0.35 + z ** 1.6 * H * 0.75
        xs = np.linspace(-200, W + 200, cols * 8)
        spread = 0.6 + z * 0.9
        x = W / 2 + (xs - W / 2) * spread
        h = 60 * (1 - z * 0.5) * np.sin(xs * f1 * 0.1 + j * f2) * np.cos(xs * 0.003 + j * 0.2)
        splat(buf, x, yb + h, np.full(xs.size, 0.09 + 0.25 * z))
    return buf


def style_bars(r):
    buf = np.zeros((H, W))
    for _ in range(260):
        y = r.uniform(0, H)
        x = r.uniform(-100, W)
        ln = r.uniform(40, 520)
        v = r.uniform(0.15, 0.9) * (1 - abs(y - H / 2) / H)
        for k in range(r.integers(2, 6)):
            line(buf, x, y + k, x + ln, y + k, v * 0.5)
    return buf


STYLES = {'nodes': style_nodes, 'flow': style_flow, 'rings': style_rings, 'wave': style_wave, 'bars': style_bars}


def render(style, seed, tint):
    r = rng_from(f'{style}:{seed}')
    base = STYLES[style](r)
    img = Image.fromarray(np.clip(base * 255, 0, 255).astype(np.uint8))
    glow1 = np.asarray(img.filter(ImageFilter.GaussianBlur(3)), dtype=float) / 255
    glow2 = np.asarray(img.filter(ImageFilter.GaussianBlur(18)), dtype=float) / 255
    glow3 = np.asarray(img.filter(ImageFilter.GaussianBlur(70)), dtype=float) / 255
    lum = np.clip(base, 0, 1) * 0.9 + glow1 * 1.6 + glow2 * 2.2 + glow3 * 3.0
    lum = 1 - np.exp(-lum * 1.4)  # tone map
    light, dark = TINTS[tint]
    yy, xx = np.mgrid[0:H, 0:W]
    vign = 1 - 0.75 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.62)) ** 2)
    vign = np.clip(vign, 0.15, 1)
    rgb = np.empty((H, W, 3))
    for c in range(3):
        core = lum ** 1.6  # 高光偏白
        rgb[..., c] = dark[c] + lum * light[c] * 0.95 + core * (1 - light[c]) * 0.6
    rgb *= vign[..., None]
    rgb += r.normal(0, 0.022, (H, W))[..., None]  # 颗粒
    return Image.fromarray(np.clip(rgb * 255, 0, 255).astype(np.uint8))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--style', choices=STYLES, default='nodes')
    ap.add_argument('--seed', default='routewise')
    ap.add_argument('--tint', choices=TINTS, default='blue')
    a = ap.parse_args()
    render(a.style, a.seed, a.tint).save(a.out, 'JPEG', quality=84, optimize=True, progressive=True)
    print('saved', a.out)
