#!/usr/bin/env bash
# FastSkills SessionStart Hook - 自动注入智能路由器
# Version: 2.1.0 - Performance optimized

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Router skill file path
router_skill="${PLUGIN_ROOT}/skills/fastskills-router/SKILL.md"

# Escape file content for JSON embedding
# Uses jq (fastest) > python3 (fallback) > sed (last resort)
escape_for_json() {
    local file="$1"
    if command -v jq &>/dev/null; then
        # jq: fastest option, strips surrounding quotes
        jq -Rs '.' < "$file" | sed 's/^"//;s/"$//'
    elif command -v python3 &>/dev/null; then
        # Python fallback
        python3 -c "import json,sys; print(json.dumps(sys.stdin.read())[1:-1])" < "$file"
    else
        # sed fallback (no external deps)
        sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\t/\\t/g' < "$file" | awk '{printf "%s\\n", $0}' | sed 's/\\n$//'
    fi
}

router_escaped=$(escape_for_json "$router_skill")

# Output context injection as JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<FASTSKILLS_SYSTEM priority=\"ABSOLUTE\">\\n\\n🚀 FastSkills V2.0 已激活\\n\\n以下是完整的 FastSkills 路由器技能。你必须严格遵循此协议：\\n\\n${router_escaped}\\n\\n</FASTSKILLS_SYSTEM>"
  }
}
EOF

exit 0
