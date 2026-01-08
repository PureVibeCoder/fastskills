import { z } from 'zod';
export const loadSkillsSchema = z.object({
    skills: z.array(z.string()).describe('要加载的技能 ID 列表'),
});
export function createLoadSkillsHandler(loader, engine) {
    return async function loadSkills(args) {
        const results = [];
        for (const skillId of args.skills) {
            const skill = engine.getSkillById(skillId);
            if (!skill) {
                results.push({
                    skillId,
                    status: 'not_found',
                    error: `技能 ${skillId} 不存在于索引中`
                });
                continue;
            }
            const result = await loader.loadSkill(skillId, skill.path);
            results.push({ ...result, skillId });
        }
        const loaded = results.filter(r => r.status === 'loaded');
        const alreadyLoaded = results.filter(r => r.status === 'already_loaded' || r.status === 'already_exists');
        const failed = results.filter(r => r.status === 'not_found' || r.status === 'error');
        return {
            success: failed.length === 0,
            loaded: loaded.map(r => r.skillId),
            already_loaded: alreadyLoaded.map(r => r.skillId),
            failed: failed.map(r => ({ skillId: r.skillId, error: r.error })),
            message: loaded.length > 0
                ? `已加载 ${loaded.length} 个技能，Claude Code 将自动检测`
                : alreadyLoaded.length > 0
                    ? `${alreadyLoaded.length} 个技能已经加载`
                    : '没有新技能被加载'
        };
    };
}
//# sourceMappingURL=load-skills.js.map