#!/usr/bin/env node
/**
 * Skills Controller CLI
 *
 * 命令行工具，用于管理 Claude Code 技能包
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import {
  validatePath,
  validateFileForRead,
  validateBundleName,
  validateSkillBundle,
  sanitizePathForLog,
  PathTraversalError,
} from "./validation.js";

interface SkillBundle {
  name: string;
  version: string;
  description: string;
  author: string;
  skills: Array<{
    name: string;
    source: string;
    path?: string;
    plugin_id?: string;
    description: string;
    triggers?: string[];
    always_active?: boolean;
  }>;
  includes: Array<{
    source: string;
    target: string;
    merge?: boolean;
    overwrite?: boolean;
  }>;
}

const COMMANDS = {
  init: "初始化项目，选择技能包",
  install: "安装指定的技能包",
  list: "列出可用的技能包",
  active: "显示当前激活的技能",
  help: "显示帮助信息",
};

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   Skills Controller CLI                       ║
║           智能技能编排控制器 - Claude Code 增强              ║
╚═══════════════════════════════════════════════════════════════╝

用法: skillscontroller <command> [options]

命令:
${Object.entries(COMMANDS)
  .map(([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`)
  .join("\n")}

示例:
  skillscontroller init                  # 交互式初始化
  skillscontroller install fullstack-react  # 安装 React 全栈包
  skillscontroller list                  # 列出可用技能包
`);
}

async function listBundles(bundlesDir: string) {
  console.log("\n📦 可用技能包:\n");

  const files = fs.readdirSync(bundlesDir).filter((f) => f.endsWith(".yaml"));

  for (const file of files) {
    try {
      // Validate file path security
      const filePath = validateFileForRead(bundlesDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // Parse and validate YAML with schema
      const rawBundle = yaml.parse(content);
      const bundle = validateSkillBundle(rawBundle);

      console.log(`  ┌─ ${bundle.name} (v${bundle.version})`);
      console.log(`  │  ${bundle.description.split("\n")[0]}`);
      console.log(`  │  技能: ${bundle.skills.map((s) => s.name).join(", ")}`);
      console.log(`  └─ 作者: ${bundle.author}\n`);
    } catch (error) {
      // Safe error logging - don't expose full path
      console.error(`  ⚠ 跳过无效技能包: ${sanitizePathForLog(file)}`);
    }
  }
}

async function installBundle(bundleName: string, bundlesDir: string, targetDir: string) {
  // Validate bundle name to prevent path traversal
  try {
    validateBundleName(bundleName);
  } catch (error) {
    console.error("❌ 无效的技能包名称");
    process.exit(1);
  }

  // Validate bundle path stays within bundles directory
  let bundlePath: string;
  try {
    bundlePath = validatePath(bundlesDir, `${bundleName}.yaml`);
  } catch (error) {
    console.error("❌ 无效的技能包路径");
    process.exit(1);
  }

  if (!fs.existsSync(bundlePath)) {
    console.error(`❌ 技能包 "${bundleName}" 不存在`);
    console.log("\n运行 'skillscontroller list' 查看可用技能包");
    process.exit(1);
  }

  const content = fs.readFileSync(bundlePath, "utf-8");
  // Parse and validate YAML with schema
  const rawBundle = yaml.parse(content);
  let bundle: ReturnType<typeof validateSkillBundle>;
  try {
    bundle = validateSkillBundle(rawBundle);
  } catch (error) {
    console.error("❌ 技能包格式无效");
    process.exit(1);
  }

  console.log(`\n🚀 安装技能包: ${bundle.name} v${bundle.version}\n`);

  // 创建 .claude 目录
  const claudeDir = path.join(targetDir, ".claude");
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log("  ✓ 创建 .claude/ 目录");
  }

  // 创建 skills 目录
  const skillsDir = path.join(claudeDir, "skills");
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  // 安装技能
  console.log("\n📥 安装技能:\n");

  // Base directory for local skills (parent of bundles dir)
  const skillsBaseDir = path.resolve(bundlesDir, "..");

  for (const skill of bundle.skills) {
    if (skill.source === "local" && skill.path) {
      try {
        // Validate source path - must stay within skills base directory
        const srcPath = validateFileForRead(skillsBaseDir, skill.path);

        // Validate destination path - must stay within skillsDir
        const destPath = validatePath(skillsDir, skill.name);

        if (fs.existsSync(srcPath)) {
          // Copy skill directory
          fs.cpSync(srcPath, destPath, { recursive: true });
          console.log(`  ✓ ${skill.name} (本地)`);
        } else {
          console.log(`  ⚠ ${skill.name} (技能文件不存在)`);
        }
      } catch (error) {
        if (error instanceof PathTraversalError) {
          // Don't expose path details in error
          console.log(`  ⚠ ${skill.name} (路径验证失败)`);
        } else {
          console.log(`  ⚠ ${skill.name} (安装失败)`);
        }
      }
    } else if (skill.source === "plugin") {
      console.log(`  ✓ ${skill.name} (插件: ${skill.plugin_id})`);
    }
  }

  // 生成技能索引
  const indexPath = path.join(skillsDir, "index.json");
  const index = {
    bundle: bundle.name,
    version: bundle.version,
    installed_at: new Date().toISOString(),
    skills: bundle.skills.map((s) => ({
      name: s.name,
      description: s.description,
      triggers: s.triggers || [],
      always_active: s.always_active || false,
    })),
  };

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log("\n  ✓ 生成技能索引");

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      ✅ 安装完成!                             ║
╠═══════════════════════════════════════════════════════════════╣
║  技能包: ${bundle.name.padEnd(49)} ║
║  技能数: ${String(bundle.skills.length).padEnd(49)} ║
║                                                               ║
║  启动 Claude Code 即可使用增强功能:                          ║
║  $ claude                                                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
}

async function showActive(targetDir: string) {
  const indexPath = path.join(targetDir, ".claude", "skills", "index.json");

  if (!fs.existsSync(indexPath)) {
    console.log("\n⚠ 当前项目未安装技能包");
    console.log("运行 'skillscontroller init' 开始安装\n");
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    当前技能配置                               ║
╚═══════════════════════════════════════════════════════════════╝

  技能包: ${index.bundle} v${index.version}
  安装时间: ${index.installed_at}

  已安装技能:
${index.skills.map((s: any) => `    • ${s.name}${s.always_active ? " (始终激活)" : ""}`).join("\n")}
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  const bundlesDir = path.join(__dirname, "..", "bundles");
  const targetDir = process.cwd();

  switch (command) {
    case "init":
    case "install":
      const bundleName = args[1] || "fullstack-react";
      await installBundle(bundleName, bundlesDir, targetDir);
      break;

    case "list":
      await listBundles(bundlesDir);
      break;

    case "active":
      await showActive(targetDir);
      break;

    case "help":
    default:
      printHelp();
  }
}

main().catch(console.error);
