"""
Fix watermarked images by finding the text bounding box and doing
a FULL gradient fill over the entire rectangle. The text detection
finds the dense cluster of dark pixels (y:220-300 area typically),
excluding wall panel edges (left/right 12%).
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from scipy.ndimage import uniform_filter1d
import os
import sys

def find_text_bbox(img_path):
    """Find the bounding box of the watermark text."""
    img = Image.open(img_path)
    arr = np.array(img, dtype=np.float64)
    h, w = arr.shape[:2]
    gray = np.mean(arr[:, :, :3], axis=2)

    crop_h = int(h * 0.35)

    # Wall zone (bright area, closed to fill text gaps)
    wall_raw = gray[:crop_h] > 170
    wall_zone = ndimage.binary_closing(wall_raw, iterations=30)

    # Dark pixels ON WALL only (not car body)
    dark = (gray[:crop_h] < 80) & wall_zone

    # Row density (smoothed)
    row_counts = dark.sum(axis=1).astype(float)
    smoothed_rows = uniform_filter1d(row_counts, size=25)

    # Find the densest Y band
    peak_y = np.argmax(smoothed_rows)
    if smoothed_rows[peak_y] < 20:
        return None, None, None

    # Expand from peak
    threshold_y = smoothed_rows[peak_y] * 0.15
    y_top = peak_y
    while y_top > 0 and smoothed_rows[y_top] > threshold_y:
        y_top -= 1
    y_bot = peak_y
    while y_bot < crop_h - 1 and smoothed_rows[y_bot] > threshold_y:
        y_bot += 1

    # Column density within the Y band (exclude edges)
    band = dark[y_top:y_bot, :]
    col_counts = band.sum(axis=0).astype(float)
    edge = int(w * 0.12)
    col_counts[:edge] = 0
    col_counts[w - edge:] = 0

    smoothed_cols = uniform_filter1d(col_counts, size=50)
    peak_x = np.argmax(smoothed_cols)
    if smoothed_cols[peak_x] < 3:
        return None, None, None

    threshold_x = max(smoothed_cols[peak_x] * 0.08, 1.0)
    x_left = peak_x
    while x_left > edge and smoothed_cols[x_left] > threshold_x:
        x_left -= 1
    x_right = peak_x
    while x_right < w - edge - 1 and smoothed_cols[x_right] > threshold_x:
        x_right += 1

    return (y_top, y_bot, x_left, x_right), arr, img


def remove_watermark(img_path):
    """Remove watermark by full gradient fill over text bounding box."""
    result = find_text_bbox(img_path)
    bbox, arr, img = result
    if bbox is None:
        return False, "No text bbox found"

    y_top, y_bot, x_left, x_right = bbox
    h, w = arr.shape[:2]

    # Add margin
    margin = 10
    ry1 = max(0, y_top - margin)
    ry2 = min(h, y_bot + margin)
    rx1 = max(0, x_left - margin)
    rx2 = min(w, x_right + margin)

    result_arr = arr.copy()

    for y in range(ry1, ry2):
        # Sample wall color from left (beyond text area)
        sw = 80
        left_sample = arr[y, max(0, rx1 - sw):rx1, :3]
        if len(left_sample) > 0:
            lg = np.mean(left_sample, axis=1)
            bright_l = left_sample[lg > 180]
            lc = np.mean(bright_l, axis=0) if len(bright_l) > 0 else np.array([215., 215., 215.])
        else:
            lc = np.array([215., 215., 215.])

        right_sample = arr[y, rx2:min(w, rx2 + sw), :3]
        if len(right_sample) > 0:
            rg = np.mean(right_sample, axis=1)
            bright_r = right_sample[rg > 180]
            rc = np.mean(bright_r, axis=0) if len(bright_r) > 0 else np.array([215., 215., 215.])
        else:
            rc = np.array([215., 215., 215.])

        span = max(rx2 - rx1 - 1, 1)
        for x in range(rx1, rx2):
            t = (x - rx1) / span
            color = lc * (1 - t) + rc * t
            noise = np.random.normal(0, 0.8, 3)
            result_arr[y, x, :3] = np.clip(color + noise, 0, 255)

    # Selective blur on painted rectangle
    result_img = Image.fromarray(result_arr.astype(np.uint8))
    blurred = result_img.filter(ImageFilter.GaussianBlur(radius=1.5))
    blur_arr = np.array(blurred, dtype=np.float64)

    final_arr = np.array(img, dtype=np.float64)
    final_arr[ry1:ry2, rx1:rx2, :3] = blur_arr[ry1:ry2, rx1:rx2, :3]

    Image.fromarray(final_arr.astype(np.uint8)).save(img_path, quality=95)
    return True, f"y:{ry1}-{ry2} x:{rx1}-{rx2} ({(ry2-ry1)*(rx2-rx1)} px)"


if __name__ == '__main__':
    base = os.path.join(os.path.dirname(__file__), 'public', 'cars')

    if len(sys.argv) > 1:
        files = sys.argv[1:]
    else:
        files = [f'car_{i}.jpg' for i in [2, 3, 4, 5, 6, 8, 10, 11, 12, 14, 16, 17, 19]]

    for fname in files:
        path = os.path.join(base, fname)
        if not os.path.exists(path):
            print(f"SKIP {fname} - not found")
            continue
        success, msg = remove_watermark(path)
        print(f"{'FIXED' if success else 'SKIP'} {fname} - {msg}")
