import type { APIRoute } from 'astro';
import { skillPackages, getPackageById } from '../../data/packages';
import { SKILL_TO_SOURCE } from '../../data/skill-sources';

// 禁用预渲染，使用服务端渲染
export const prerender = false;

interface SkillInfo {
  id: string;
  source: string;
  path: string;
}

// 解析要安装的技能列表
function resolveSkills(packId: string | null, skillIds: string[] | null): SkillInfo[] {
  const skills: SkillInfo[] = [];

  if (packId) {
    // 从技能包获取技能列表
    const pack = getPackageById(packId);
    if (pack) {
      for (const skillId of pack.skills) {
        const source = SKILL_TO_SOURCE[skillId];
        if (source) {
          skills.push({ id: skillId, ...source });
        }
      }
    }
  } else if (skillIds && skillIds.length > 0) {
    // 直接使用技能 ID 列表
    for (const skillId of skillIds) {
      const source = SKILL_TO_SOURCE[skillId];
      if (source) {
        skills.push({ id: skillId, ...source });
      }
    }
  }

  return skills;
}

// 生成安装脚本
function generateInstallScript(skills: SkillInfo[], baseUrl: string, packName?: string): string {
  if (skills.length === 0) {
    return `#!/bin/bash
echo "错误: 没有找到要安装的技能"
exit 1
`;
  }

  const skillDownloads = skills.map(skill => {
    const apiUrl = `${baseUrl}/api/skill-content?source=${skill.source}&path=${skill.path}`;
    return `  download_skill "${skill.id}" "${apiUrl}"`;
  }).join('\n');

  return `#!/bin/bash
# Skills Controller 一键安装脚本
# ${packName ? `技能包: ${packName}` : `技能: ${skills.map(s => s.id).join(', ')}`}
# 生成时间: $(date)

set -e

# 颜色定义
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# 技能安装目录
SKILLS_DIR="\$HOME/.claude/skills"

# 统计变量
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_SKILLS=""

# 检查环境
check_environment() {
  echo -e "\${BLUE}检查环境...\${NC}"

  # 检查 curl
  if ! command -v curl &> /dev/null; then
    echo -e "\${RED}错误: 需要 curl 命令\${NC}"
    exit 1
  fi

  # 检查操作系统
  case "\$(uname -s)" in
    Linux*|Darwin*)
      echo -e "\${GREEN}✓ 操作系统支持\${NC}"
      ;;
    *)
      echo -e "\${YELLOW}警告: 未测试的操作系统，可能存在兼容性问题\${NC}"
      ;;
  esac

  echo ""
}

# 创建目录
setup_directories() {
  echo -e "\${BLUE}创建技能目录...\${NC}"
  mkdir -p "\$SKILLS_DIR"
  echo -e "\${GREEN}✓ 技能目录: \$SKILLS_DIR\${NC}"
  echo ""
}

# 下载单个技能
download_skill() {
  local skill_id="\$1"
  local api_url="\$2"
  local skill_dir="\$SKILLS_DIR/\$skill_id"

  echo -e "\${BLUE}安装: \$skill_id\${NC}"

  # 创建技能目录
  mkdir -p "\$skill_dir"

  # 下载 SKILL.md
  if curl -fsSL "\$api_url" -o "\$skill_dir/SKILL.md" 2>/dev/null; then
    # 验证文件不为空
    if [ -s "\$skill_dir/SKILL.md" ]; then
      echo -e "\${GREEN}  ✓ 成功\${NC}"
      SUCCESS_COUNT=\$((SUCCESS_COUNT + 1))
    else
      echo -e "\${RED}  ✗ 文件为空\${NC}"
      rm -rf "\$skill_dir"
      FAIL_COUNT=\$((FAIL_COUNT + 1))
      FAILED_SKILLS="\$FAILED_SKILLS \$skill_id"
    fi
  else
    echo -e "\${RED}  ✗ 下载失败\${NC}"
    rm -rf "\$skill_dir"
    FAIL_COUNT=\$((FAIL_COUNT + 1))
    FAILED_SKILLS="\$FAILED_SKILLS \$skill_id"
  fi
}

# 显示结果
show_results() {
  echo ""
  echo -e "\${BLUE}========================================\${NC}"
  echo -e "\${BLUE}安装完成\${NC}"
  echo -e "\${BLUE}========================================\${NC}"
  echo ""
  echo -e "\${GREEN}成功: \$SUCCESS_COUNT 个技能\${NC}"

  if [ \$FAIL_COUNT -gt 0 ]; then
    echo -e "\${RED}失败: \$FAIL_COUNT 个技能\${NC}"
    echo -e "\${RED}失败的技能:\$FAILED_SKILLS\${NC}"
  fi

  echo ""
  echo -e "\${YELLOW}技能已安装到: \$SKILLS_DIR\${NC}"
  echo -e "\${YELLOW}请重启 Claude Code 以生效\${NC}"
  echo ""
}

# 主程序
main() {
  echo ""
  echo -e "\${BLUE}========================================\${NC}"
  echo -e "\${BLUE}Skills Controller 一键安装\${NC}"
  echo -e "\${BLUE}========================================\${NC}"
  echo ""

  check_environment
  setup_directories

  echo -e "\${BLUE}开始安装技能...\${NC}"
  echo ""

  # 下载技能
${skillDownloads}

  show_results
}

# 运行主程序
main
`;
}

export const GET: APIRoute = async ({ url }) => {
  const packId = url.searchParams.get('pack');
  const skillIdsParam = url.searchParams.get('skills');
  const skillIds = skillIdsParam ? skillIdsParam.split(',').filter(Boolean) : null;

  // 构建基础 URL
  const baseUrl = `${url.protocol}//${url.host}`;

  // 解析技能列表
  const skills = resolveSkills(packId, skillIds);

  // 获取技能包名称（如果有）
  let packName: string | undefined;
  if (packId) {
    const pack = getPackageById(packId);
    packName = pack?.name;
  }

  // 生成脚本
  const script = generateInstallScript(skills, baseUrl, packName);

  return new Response(script, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-cache'
    }
  });
};
