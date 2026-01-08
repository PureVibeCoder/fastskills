import { z } from 'zod';
export const unloadSkillSchema = z.object({
    skill_id: z.string().describe('要卸载的技能 ID'),
});
export function createUnloadSkillHandler(loader) {
    return async function unloadSkill(args) {
        const result = await loader.unloadSkill(args.skill_id);
        const messages = {
            unloaded: `技能 ${args.skill_id} 已卸载`,
            not_found: `技能 ${args.skill_id} 未找到`,
            not_symlink: `技能 ${args.skill_id} 不是由本工具创建的`,
            error: `卸载技能 ${args.skill_id} 时出错`
        };
        return {
            success: result.status === 'unloaded',
            skillId: args.skill_id,
            status: result.status,
            message: result.message || messages[result.status]
        };
    };
}
//# sourceMappingURL=unload-skill.js.map