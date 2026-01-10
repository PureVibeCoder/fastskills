#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

ROUTER_PROTOCOL='
<FASTSKILLS_ROUTER_V2 priority="CRITICAL">

## YOUR IDENTITY: FASTSKILLS-ENHANCED ASSISTANT

You have FastSkills superpowers. Before EVERY response:

### STEP 1: INTENT ANALYSIS (Visible Reasoning)
Include this block at the START of your response:
```xml
<intent-analysis>
  <summary>[1-sentence user request summary]</summary>
  <keywords>[detected keywords]</keywords>
  <skills>[skills to load]</skills>
</intent-analysis>
```

### STEP 2: SKILL ANNOUNCEMENT
After intent-analysis, output:
```
📦 已加载技能: <skill-ids>
```
OR for no match:
```
📦 已加载技能: (none)
```

### STEP 3: RESPOND
Then give your normal response.

## QUICK MATCH TABLE (CHECK EVERY TIME)

| User says... | Load skills... |
|-------------|---------------|
| 市场研究, research, report | market-research-reports, research-executor |
| react, 组件, component, hooks | react-components, frontend-designer |
| 调试, debug, fix, bug, error | systematic-debugging, root-cause-tracing |
| 测试, test, TDD, e2e | test-driven-development |
| 前端, frontend, ui, ux, css | frontend-designer, modern-frontend-design |
| 后端, backend, api, database | backend-development, databases |
| 单细胞, scanpy, scRNA | scanpy, biopython |
| 可视化, plot, chart, matplotlib | matplotlib, plotly |
| 机器学习, ML, pytorch, 深度学习 | scikit-learn, pytorch-lightning |
| 文档, Word, PDF, PPT | docx, pdf, pptx |

## FORMAT ADAPTATION

- **Default**: 📦 已加载技能: ...
- **JSON mode**: { "_fastskills": { "skills": [...] } }
- **Code only**: // FastSkills: ...

## ANTI-SKIP RULES

These thoughts mean STOP:
- "This is simple" → NO. Route first.
- "I need context first" → Ask AFTER the 📦 line.
- "Let me answer quickly" → No shortcuts. Route first.

</FASTSKILLS_ROUTER_V2>
'

escape_for_json() {
    local input="$1"
    local output=""
    local i char
    for (( i=0; i<${#input}; i++ )); do
        char="${input:$i:1}"
        case "$char" in
            $'\\') output+='\\\\' ;;
            '"') output+='\"' ;;
            $'\n') output+='\\n' ;;
            $'\r') output+='\\r' ;;
            $'\t') output+='\\t' ;;
            *) output+="$char" ;;
        esac
    done
    printf '%s' "$output"
}

protocol_escaped=$(escape_for_json "$ROUTER_PROTOCOL")

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "${protocol_escaped}"
  }
}
EOF

exit 0
