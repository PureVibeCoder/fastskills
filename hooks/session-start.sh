#!/usr/bin/env bash
# FastSkills SessionStart Hook - 自动注入智能路由器
# Version: 2.0.0

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Read the router skill content
router_skill="${PLUGIN_ROOT}/skills/fastskills-router/SKILL.md"
router_content=$(cat "$router_skill" 2>&1 || echo "Error: Could not read FastSkills router")

# Escape outputs for JSON using pure bash
escape_for_json() {
    local input="$1"
    local output=""
    local i char
    for (( i=0; i<${#input}; i++ )); do
        char="${input:$i:1}"
        case "$char" in
            \\) output+='\\\\' ;;
            '"') output+='\"' ;;
            $'\n') output+='\\n' ;;
            $'\r') output+='\\r' ;;
            $'\t') output+='\\t' ;;
            *) output+="$char" ;;
        esac
    done
    printf '%s' "$output"
}

router_escaped=$(escape_for_json "$router_content")

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
