"""改文件后核对 Markdown 受保护部分是否原样。

改编自 op7418/Humanizer-zh tests/check_structure.py（MIT, Copyright (c) 2026 歸藏）。
改动：有序步骤只核对编号序列，步骤正文允许按改稿规则修改；代码块内的行不再被当成标题或步骤。

用法：python3 check_structure.py <原文件> <改后文件>
全部一致返回 0，否则返回 1 并列出不一致的项。
"""

import argparse
import json
import re
from pathlib import Path


FENCE = re.compile(r"^```[^\n]*\n.*?^```[ \t]*$", re.M | re.S)


def protected_parts(text):
    frontmatter = re.match(r"\A---\n.*?\n---\n", text, re.S)
    # 代码块里的 "# 注释"、"1. " 不算标题和步骤，先去掉再找其余部分
    prose = FENCE.sub("", text)
    return {
        "frontmatter": frontmatter.group(0) if frontmatter else None,
        "fenced_code": FENCE.findall(text),
        "inline_code": re.findall(r"(?<!`)`([^`\n]+)`(?!`)", prose),
        "headings": re.findall(r"^#{1,6} .+$", prose, re.M),
        "link_targets": re.findall(r"\]\(([^\n)]+)\)", prose),
        "table_rows": re.findall(r"^\|.*\|$", prose, re.M),
        "ordered_step_numbers": re.findall(r"^(\d+)\. ", prose, re.M),
        "explicit_ids": re.findall(r'<[^>]+\bid="[^"]+"[^>]*>', prose),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("edited", type=Path)
    args = parser.parse_args()
    before = protected_parts(args.source.read_text(encoding="utf-8"))
    after = protected_parts(args.edited.read_text(encoding="utf-8"))
    checks = {key: before[key] == after[key] for key in before}
    failed = {key: {"原文": before[key], "改后": after[key]} for key, ok in checks.items() if not ok}
    print(json.dumps({"preserved": checks, "passed": not failed, "diff": failed}, ensure_ascii=False, indent=2))
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
