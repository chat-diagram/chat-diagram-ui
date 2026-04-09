import mermaid from "mermaid";

export class DiagramEngine {
  // 1. 基础状态
  private scale = 1;
  private translate = { x: 0, y: 0 };
  private container: HTMLElement | null = null;
  
  // 2. 业务属性
  public selectedNodes = new Set<string>();
  public currentDsl: string = "";
  public svgContent: string = "";

  // 3. 外部通知回调
  private onUpdate: (state: any) => void;

  constructor(onUpdate: (state: any) => void) {
    this.onUpdate = onUpdate;
    
    // 初始化 Mermaid 配置
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose", // 允许执行注入的 click call
    });

    // 挂载全局回调，确保 Mermaid 渲染出的 SVG 能触发引擎内的逻辑
    (window as any).onNodeSelect = (nodeId: string) => {
      this.handleExternalSelect(nodeId);
    };
  }

  // 绑定 DOM 容器（在 useEffect 中调用）
  public attach(el: HTMLElement) {
    this.container = el;
  }

  // 核心：异步渲染并注入逻辑
  public async render(dsl: string) {
    if (!dsl || dsl === this.currentDsl) return;
    this.currentDsl = dsl;

    try {
      // 第一步：正则注入点击事件指令
    //   const processedDsl = injectMermaidClickEvents(dsl, "onNodeSelect");

      // 第二步：调用 Mermaid 渲染 WASM
      const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaid.render(id, dsl);

      // 第三步：更新内容并通知 UI
      this.svgContent = svg;
      this.notify();
    } catch (e) {
      console.error("Mermaid渲染失败:", e);
    }
  }

  // 处理来自 SVG 内部点击的回调
  private handleExternalSelect(nodeId: string) {
    // 简单的单选逻辑，如果是 Shift 连选可以自行扩展
    this.selectedNodes = new Set([nodeId]);
    this.notify();
  }

  // 缩放逻辑（继承你之前的实现）
  public handleZoom(delta: number, clientX: number, clientY: number) {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const oldScale = this.scale;
    this.scale = Math.min(5, Math.max(0.1, this.scale * delta));

    this.translate.x = mouseX - (mouseX - this.translate.x) * (this.scale / oldScale);
    this.translate.y = mouseY - (mouseY - this.translate.y) * (this.scale / oldScale);
    this.notify();
  }

  // 平移逻辑
  public handlePan(dx: number, dy: number) {
    this.translate.x -= dx;
    this.translate.y -= dy;
    this.notify();
  }

  // 获取选中内容的上下文（发给后端）
  public getSelectionContext() {
    if (!this.container) return [];
    return Array.from(this.selectedNodes).map(id => {
      const node = this.container?.querySelector(`#${id}`);
      return {
        id,
        text: node?.textContent?.trim() || "",
        // 这里可以根据 currentDsl 判断图表类型
        type: this.currentDsl.split('\n')[0].trim() 
      };
    });
  }

  private notify() {
    this.onUpdate({
      transform: { ...this.translate, scale: this.scale },
      selected: new Set(this.selectedNodes),
      svgContent: this.svgContent
    });
  }

  // 销毁时清理全局变量
  public destroy() {
    delete (window as any).onNodeSelect;
  }
}