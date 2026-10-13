#!/usr/bin/env python3
"""Optional offline CSS selector audit for USER-OWNED source ZIP files.

Requires: pip install beautifulsoup4 soupsieve
Usage:
    python tools/verify_dom.py --home-zip design/raw/社区.zip --post-zip design/raw/html.zip
Does not print page text, user IDs, post titles or image URLs.
"""
import argparse
import json
from pathlib import Path
from zipfile import ZipFile

try:
    from bs4 import BeautifulSoup
except ImportError as exc:
    raise SystemExit("请安装 beautifulsoup4 和 soupsieve: python -m pip install beautifulsoup4 soupsieve") from exc

p = argparse.ArgumentParser()
p.add_argument('--home-zip', type=Path, required=True)
p.add_argument('--post-zip', type=Path, required=True)
a = p.parse_args()
registry=json.loads((Path(__file__).resolve().parents[1]/'tests'/'fixtures'/'selectors.json').read_text(encoding='utf-8'))
any_mismatch=False
for page, archive in [('home',a.home_zip),('post',a.post_zip)]:
    with ZipFile(archive) as z:
        names=[name for name in z.namelist() if name.lower().endswith('.html')]
        if len(names)!=1:raise SystemExit(f'{archive}: 预期恰好一份 HTML，实际 {len(names)} 份')
        soup=BeautifulSoup(z.read(names[0]).decode('utf-8','replace'),'html.parser')
    print(f'[{page}] {len(registry["pages"][page]["selectors"])} selectors')
    for key, item in registry['pages'][page]['selectors'].items():
        actual=len(soup.select(item['selector']))
        expected=item['snapshot_count']
        flag='OK' if actual==expected else 'MISMATCH'
        if actual!=expected:any_mismatch=True
        print(f'  {flag:8s} {key:18s} {actual}/{expected}')
if any_mismatch:
    raise SystemExit('离线计数与当前提供的快照不同：请复核 HTML 解析器差异或源文件更新')
print('两份源快照的选择器验证完成；这不是线上浏览器功能测试。')
