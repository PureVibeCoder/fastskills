/**
 * 模态框工具函数
 * 提取自 index.astro 和 packager.ts 中的重复逻辑
 */

export interface ModalConfig {
  id: string;
  title: string;
  content: string;
  onClose?: () => void;
}

/**
 * 创建并显示模态框
 * @param config 模态框配置
 * @returns 模态框元素和关闭函数
 */
export function createModal(config: ModalConfig): {
  modal: HTMLElement;
  close: () => void;
} {
  const modalHtml = `
    <div class="modal-overlay" id="${config.id}">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${config.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${config.content}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById(config.id) as HTMLElement;
  const closeBtn = modal?.querySelector('.modal-close');

  const close = () => {
    modal?.remove();
    config.onClose?.();
  };

  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  return { modal, close };
}

/**
 * 创建技能详情模态框内容
 */
export function createSkillDetailContent(skill: {
  name: string;
  description: string;
  triggers: string;
}): string {
  return `
    <div class="skill-detail-name">${skill.name}</div>
    <p class="skill-detail-description">${skill.description}</p>
    <div class="skill-detail-triggers">
      <h4>触发词：</h4>
      <p>${skill.triggers}</p>
    </div>
  `;
}

/**
 * 创建技能包选择列表内容
 */
export function createPackListContent(packs: Array<{
  key: string;
  name: string;
  description: string;
}>): string {
  const packButtons = packs.map(pack => `
    <button class="pack-button" data-pack="${pack.key}">
      <div class="pack-name">${pack.name}</div>
      <div class="pack-description">${pack.description}</div>
    </button>
  `).join('');

  return `
    <p class="modal-description">选择要下载的技能包：</p>
    <div class="pack-list">${packButtons}</div>
  `;
}
