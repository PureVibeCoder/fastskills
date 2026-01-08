export function createListSkillsHandler(loader, engine) {
    return async function listSkills() {
        const activeSkills = await loader.getLoadedSkillInfo();
        const availableCount = engine.getSkillCount();
        return {
            active: activeSkills,
            available: availableCount,
            message: activeSkills.length > 0
                ? `当前已加载 ${activeSkills.length} 个技能，共有 ${availableCount} 个可用技能`
                : `当前没有已加载的技能，共有 ${availableCount} 个可用技能`
        };
    };
}
//# sourceMappingURL=list-skills.js.map