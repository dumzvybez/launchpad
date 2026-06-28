#!/usr/bin/env python3
"""
Fast escape of ${ inside template literals using regex.
We find all backtick-delimited template literals and escape ${ -> \\${ inside them.
"""
import re

for filepath in [
    "/home/z/my-project/src/lib/lessons-compact.ts",
    "/home/z/my-project/src/lib/lessons-generator.ts",
]:
    with open(filepath) as f:
        content = f.read()

    # Match template literals: `...` with no unescaped backticks inside
    # We use a non-greedy match and handle escaped backticks
    pattern = re.compile(r'`((?:[^`\\]|\\.)*)`', re.DOTALL)

    def escape_inside(m):
        body = m.group(1)
        # Escape ${ -> \\${ (but only if not already escaped)
        # First, protect already-escaped \${
        body = body.replace('\\${', '\x00ESCAPED\x00')
        # Escape remaining ${
        body = body.replace('${', '\\${')
        # Restore already-escaped
        body = body.replace('\x00ESCAPED\x00', '\\${')
        return '`' + body + '`'

    new_content = pattern.sub(escape_inside, content)
    with open(filepath, "w") as f:
        f.write(new_content)
    unescaped = len(re.findall(r'(?<!\\)\$\{', new_content))
    print(f"Processed {filepath} — remaining unescaped ${{: {unescaped}")
