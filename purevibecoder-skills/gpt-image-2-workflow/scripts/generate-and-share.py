#!/usr/bin/env python3
"""GPT-image-2 (官方渠道) 生图 + 保存 + 分享帖文案 一键脚本
用法: python3 generate-and-share.py "你的提示词" [比例] [文件名前缀] [分辨率档] [质量]

分辨率档（新增重要参数）:
  1k - 1024 基准，省钱日常够用
  2k - 2048 基准，适合海报 / 高清需求（默认）
  4k - 3840 基准，仅支持 16:9 / 9:16 / 2:1 / 1:2 / 21:9 / 9:21

4K 不支持的比例会自动降级为 2K:
  - ❌ 1:1 × 4k（3840² = 14.7M 超上限）
  - ❌ 3:2 / 2:3 × 4k（3840×2560 = 9.83M 超上限）
  - ❌ 4:3 / 3:4 × 4k（3840×2880 = 11.06M 超上限）
  - ❌ 5:4 / 4:5 × 4k（3840×3072 = 11.80M 超上限）
"""
import os, sys, time, requests
from pathlib import Path
from datetime import datetime
from PIL import Image
from io import BytesIO

API_KEY = os.environ.get("APIMART_API_KEY")
if not API_KEY:
    import re
    base = Path("/Users/marovole/HermesWork")
    poll_src = base / "poll_apimart.py"
    if poll_src.exists():
        src = poll_src.read_text()
        m = re.search(r'API_KEY\s*=\s*["\']([^"\']+)["\']', src)
        if m:
            API_KEY = m.group(1)

BASE = Path("/Users/marovole/HermesWork")
MODEL_OFFICIAL = "gpt-image-2-official"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
BASE_URL = "https://api.apimart.ai"

# 4K 支持的比例白名单（受 OpenAI 单图总像素上限 8,294,400 限制）
RESOLUTION_4K_SUPPORTED = {
    "16:9", "9:16", "2:1", "1:2", "21:9", "9:21"
}
RESOLUTION_2K_SUPPORTED = {
    "1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5",
    "16:9", "9:16", "2:1", "1:2", "21:9", "9:21"
}
ALL_RATIOS = {
    "1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5",
    "16:9", "9:16", "2:1", "1:2", "21:9", "9:21"
}


def resolve_resolution(size: str, requested: str) -> tuple[str, str]:
    """
    自动解析 resolution 配置。
    返回 (实际使用的 resolution, 说明日志)。
    """
    if size not in ALL_RATIOS:
        # 未知比例，用 1k 保底
        return "1k", f"⚠️ 未知比例 {size}，自动使用 1k 保底"
    
    req = requested.lower().strip()
    if req == "4k":
        if size in RESOLUTION_4K_SUPPORTED:
            return "4k", f"✅ 4K 输出启用（{size}）"
        else:
            fallback_reason = {
                "1:1": "3840² = 14.7M > 8,294,400 像素上限",
                "3:2": "3840×2560 = 9.83M > 8,294,400 像素上限",
                "2:3": "3840×2560 = 9.83M > 8,294,400 像素上限",
                "4:3": "3840×2880 = 11.06M > 8,294,400 像素上限",
                "3:4": "3840×2880 = 11.06M > 8,294,400 像素上限",
                "5:4": "3840×3072 = 11.80M > 8,294,400 像素上限",
                "4:5": "3840×3072 = 11.80M > 8,294,400 像素上限",
            }
            reason = fallback_reason.get(size, "超出 OpenAI 单图总像素上限 8,294,400")
            return "2k", f"⚠️ {size} 不支持 4K（{reason}），自动降级为 2K"
    elif req == "2k":
        return "2k", f"✅ 2K 输出（{size}）"
    elif req == "1k":
        return "1k", f"✅ 1K 输出（{size}）"
    else:
        return "2k", f"⚠️ 未识别的分辨率档 {req}，默认使用 2K"


def generate_image(prompt: str, size: str = "4:5", resolution: str = "2k", quality: str = "high") -> bytes:
    """提交异步任务，轮询至完成，返回图片 bytes。"""
    actual_resolution, log_msg = resolve_resolution(size, resolution)
    print(f"[resolution] {log_msg}")

    submit = requests.post(
        f"{BASE_URL}/v1/images/generations",
        headers=HEADERS,
        json={
            "model": MODEL_OFFICIAL,
            "prompt": prompt,
            "size": size,
            "resolution": actual_resolution,
            "quality": quality,
            "n": 1,
        },
        timeout=60,
    )
    submit.raise_for_status()
    task_id = submit.json()["data"][0]["task_id"]
    print(f"[submitted] task_id={task_id}, model={MODEL_OFFICIAL}, size={size}, resolution={actual_resolution}, quality={quality}")

    for i in range(40):
        time.sleep(5)
        poll = requests.get(
            f"{BASE_URL}/v1/tasks/{task_id}",
            headers={"Authorization": f"Bearer {API_KEY}"},
            timeout=30,
        )
        poll.raise_for_status()
        data = poll.json()["data"]
        status = data.get("status")
        if status == "completed":
            url = data["result"]["images"][0]["url"][0]
            img = requests.get(url, timeout=60)
            img.raise_for_status()
            print(f"[done] downloaded {len(img.content)} bytes")
            return img.content
        if status == "failed":
            raise RuntimeError(data)
        print(f"[poll {i+1}] {status} ...")

    raise TimeoutError("Image generation timed out")


def check_resolution(img_bytes: bytes, size: str, expected_resolution: str) -> dict:
    """
    出图后检查图片实际分辨率。
    返回检查结果字典。"""
    try:
        img = Image.open(BytesIO(img_bytes))
        w, h = img.size
        total_pixels = w * h
        
        # 预期分辨率参考
        expected_info = {
            "4k": {"max_side": 3840, "max_total": 8294400},
            "2k": {"max_side": 2048, "max_total": None},  # 2k 没有严格的总像素上限
            "1k": {"max_side": 1024, "max_total": None},
        }
        
        exp = expected_info.get(expected_resolution, expected_info["2k"])
        max_side = exp["max_side"]
        max_total = exp.get("max_total")
        
        # 判断是否达标
        side_check = max(w, h) >= max_side * 0.5  # 至少达到预期的一半
        total_check = (max_total is None) or (total_pixels >= max_total * 0.5)
        
        result = {
            "width": w,
            "height": h,
            "total_pixels": total_pixels,
            "max_side": max(w, h),
            "expected_resolution": expected_resolution,
            "expected_max_side": max_side,
            "side_check_passed": side_check,
            "total_check_passed": total_check,
            "passed": side_check and total_check,
            "format": img.format,
            "mode": img.mode,
        }
        
        if result["passed"]:
            result["verdict"] = f"✅ 分辨率检查通过：{w}×{h}，约 {total_pixels:,} 像素"
        else:
            result["verdict"] = f"⚠️ 分辨率可能未达标：{w}×{h}，仅约 {total_pixels:,} 像素（预期 {expected_resolution} 应接近 {max_side} 基准）"
        
        return result
    except Exception as e:
        return {
            "error": str(e),
            "passed": False,
            "verdict": f"❌ 分辨率检查失败：{e}"
        }


def save_work(prompt: str, img_bytes: bytes, prefix: str, resolution_info: dict = None) -> tuple[str, str]:
    """保存图片 + 提示词 + 分享帖文案到推文专用文件夹"""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    base_dir = Path("/Users/marovole/HermesWork")
    posts_dir = base_dir / "x-posts"
    posts_dir.mkdir(parents=True, exist_ok=True)
    
    date_str = datetime.now().strftime("%Y%m%d")
    folder_name = f"{date_str}-{prefix}"
    out_dir = posts_dir / folder_name
    out_dir.mkdir(parents=True, exist_ok=True)

    img_path = out_dir / f"{prefix}_{ts}.png"
    prompt_path = out_dir / f"{prefix}_{ts}.prompt.txt"
    share_path = out_dir / f"{prefix}_{ts}.share.md"
    check_path = out_dir / f"{prefix}_{ts}.check.md"

    img_path.write_bytes(img_bytes)
    prompt_path.write_text(prompt)

    # 分享帖文案
    share_text = f"""# 配图分享

核心思路：
• 
• 
• 

完整 Prompt：
---
{prompt}
---

#GPTimage2 #提示词工程 #AIart
"""
    share_path.write_text(share_text)

    # 检查结果
    if resolution_info:
        check_text = f"""# 出图质量检查

## 分辨率验证
{resolution_info.get('verdict', '未执行')}

"""
        if "width" in resolution_info:
            check_text += f"""- 实际尺寸：{resolution_info['width']}×{resolution_info['height']}
- 总像素：{resolution_info['total_pixels']:,}
- 最大边长：{resolution_info['max_side']}
- 预期档位：{resolution_info['expected_resolution']}
- 图片格式：{resolution_info.get('format', 'unknown')}
- 色彩模式：{resolution_info.get('mode', 'unknown')}
"""
        if "error" in resolution_info:
            check_text += f"\n- 错误：{resolution_info['error']}\n"
        check_path.write_text(check_text)
        print(f"[saved] check   -> {check_path}")

    print(f"[saved] image   -> {img_path}")
    print(f"[saved] prompt  -> {prompt_path}")
    print(f"[saved] share   -> {share_path}")
    print(f"[folder]        -> {out_dir}")
    return str(img_path), str(prompt_path)


def main():
    prompt = sys.argv[1] if len(sys.argv) > 1 else "A dark minimalist tech card"
    size = sys.argv[2] if len(sys.argv) > 2 else "4:5"
    prefix = sys.argv[3] if len(sys.argv) > 3 else "gen"
    resolution = sys.argv[4] if len(sys.argv) > 4 else "2k"  # 默认 2k，绝不用 1k
    quality = sys.argv[5] if len(sys.argv) > 5 else "high"

    # 前置检查
    actual_res, _ = resolve_resolution(size, resolution)
    print(f"[config] prompt length={len(prompt)} chars, size={size}, resolution={actual_res}, quality={quality}")
    
    img_bytes = generate_image(prompt, size=size, resolution=resolution, quality=quality)
    
    # 出图后分辨率检查
    check_result = check_resolution(img_bytes, size, actual_res)
    print(check_result.get("verdict", ""))
    
    save_work(prompt, img_bytes, prefix, resolution_info=check_result)


if __name__ == "__main__":
    main()
