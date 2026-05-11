/**
 * Generate 100+ tutorial articles for Obsidian tutorial site.
 * Run: node scripts/generate-posts.cjs
 */
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');
const NOW = '2026-05-11';

// ── Article definitions ───────────────────────────────────────
// { field, software, slug, level(zh), level(en), zhTitle, enTitle, zhDesc, enDesc, topics[] }
const articles = [
  // ── DESIGN ──
  // Photoshop (3)
  { field:'design', software:'photoshop', slug:'layers-masking', level:'intermediate',
    zhTitle:'Photoshop 图层与遮罩详解', enTitle:'Photoshop Layers & Masking Guide',
    zhDesc:'深入理解图层混合模式和图层蒙版的工作原理', enDesc:'Deep dive into blend modes and layer masks',
    topics:['混合模式详解','图层蒙版','剪贴蒙版','调整图层','智能对象'] },
  { field:'design', software:'photoshop', slug:'color-grading', level:'intermediate',
    zhTitle:'Photoshop 调色完全指南', enTitle:'Complete Color Grading Guide',
    zhDesc:'掌握曲线、色阶、HSL 等调色工具', enDesc:'Master curves, levels, HSL and more',
    topics:['曲线调整','色阶工具','HSL调整','色彩平衡','查找颜色'] },
  { field:'design', software:'photoshop', slug:'text-effects', level:'advanced',
    zhTitle:'Photoshop 文字特效设计', enTitle:'Photoshop Text Effect Design',
    zhDesc:'制作专业质感的文字特效与排版', enDesc:'Create professional text effects and typography',
    topics:['图层样式','文字变形','3D文字','霓虹效果','金属质感'] },
  // Figma (2)
  { field:'design', software:'figma', slug:'components', level:'beginner',
    zhTitle:'Figma 组件与样式入门', enTitle:'Figma Components & Styles Intro',
    zhDesc:'学习 Figma 组件、变体和设计系统的核心概念', enDesc:'Learn components, variants, and design system basics',
    topics:['创建组件','变体设置','样式管理','自动布局','团队库'] },
  { field:'design', software:'figma', slug:'prototyping', level:'intermediate',
    zhTitle:'Figma 原型交互设计', enTitle:'Figma Prototyping & Interactions',
    zhDesc:'用 Figma 创建高保真可交互原型', enDesc:'Build high-fidelity interactive prototypes',
    topics:['连接交互','动效曲线','滚动行为','条件逻辑','原型演示'] },
  // Illustrator (2)
  { field:'design', software:'illustrator', slug:'pen-tool', level:'beginner',
    zhTitle:'Illustrator 钢笔工具精通', enTitle:'Illustrator Pen Tool Mastery',
    zhDesc:'掌握钢笔工具绘制精确矢量路径', enDesc:'Master precise vector path drawing',
    topics:['锚点操作','贝塞尔曲线','路径编辑','形状生成器','钢笔练习'] },
  { field:'design', software:'illustrator', slug:'logo-design', level:'intermediate',
    zhTitle:'Illustrator Logo 设计流程', enTitle:'Illustrator Logo Design Workflow',
    zhDesc:'从草图到矢量的完整 Logo 设计流程', enDesc:'Complete logo design workflow from sketch to vector',
    topics:['草图规划','网格系统','字体选择','色彩搭配','最终输出'] },
  // Canva (2)
  { field:'design', software:'canva', slug:'social-media', level:'beginner',
    zhTitle:'Canva 社交媒体设计', enTitle:'Canva Social Media Design',
    zhDesc:'用 Canva 快速制作社交媒体图片', enDesc:'Create social media graphics fast with Canva',
    topics:['模板使用','品牌套件','动画效果','尺寸规范','批量导出'] },
  { field:'design', software:'canva', slug:'presentation', level:'beginner',
    zhTitle:'Canva 演示文稿设计', enTitle:'Canva Presentation Design',
    zhDesc:'用 Canva 设计专业演示文稿', enDesc:'Design professional presentations in Canva',
    topics:['演示布局','图表插入','协作编辑','演讲备注','分享发布'] },
  // Blender (1)
  { field:'design', software:'blender', slug:'modeling-basics', level:'beginner',
    zhTitle:'Blender 3D 建模入门', enTitle:'Blender 3D Modeling Basics',
    zhDesc:'从零开始学习 Blender 建模基础', enDesc:'Learn Blender modeling from scratch',
    topics:['界面导航','基本图元','编辑模式','修改器','材质与渲染'] },

  // ── DEV ──
  // VSCode (3)
  { field:'dev', software:'vscode', slug:'shortcuts-productivity', level:'beginner',
    zhTitle:'VSCode 快捷键与效率提升', enTitle:'VSCode Shortcuts & Productivity',
    zhDesc:'掌握 VSCode 常用快捷键提高编码效率', enDesc:'Master essential VSCode shortcuts for faster coding',
    topics:['多光标编辑','代码导航','重构快捷键','终端集成','自定义快捷键'] },
  { field:'dev', software:'vscode', slug:'extensions-guide', level:'beginner',
    zhTitle:'VSCode 必装扩展推荐', enTitle:'Essential VSCode Extensions Guide',
    zhDesc:'精选提升开发效率的 VSCode 扩展', enDesc:'Curated VSCode extensions to boost development',
    topics:['代码格式化','Linting','Git 集成','AI 辅助','主题美化'] },
  { field:'dev', software:'vscode', slug:'debugging', level:'intermediate',
    zhTitle:'VSCode 调试配置详解', enTitle:'VSCode Debugging Configuration',
    zhDesc:'配置 launch.json 和断点调试技巧', enDesc:'Configure launch.json and master breakpoints',
    topics:['启动配置','断点类型','监视变量','调用堆栈','条件断点'] },
  // Git (2)
  { field:'dev', software:'git', slug:'branch-strategy', level:'intermediate',
    zhTitle:'Git 分支策略最佳实践', enTitle:'Git Branch Strategy Best Practices',
    zhDesc:'Git Flow、Trunk-based 等分支策略对比', enDesc:'Compare Git Flow, trunk-based, and more',
    topics:['Git Flow','Trunk-based','分支命名规范','PR 工作流','冲突解决'] },
  { field:'dev', software:'git', slug:'advanced-rebase', level:'advanced',
    zhTitle:'Git Rebase 高级用法', enTitle:'Advanced Git Rebase Techniques',
    zhDesc:'交互式 rebase、cherry-pick 等高级 Git 操作', enDesc:'Interactive rebase, cherry-pick, and more',
    topics:['交互式 Rebase','Cherry-Pick','Stash 高级用法','Bisect 调试','重置策略'] },
  // Docker (2)
  { field:'dev', software:'docker', slug:'container-basics', level:'beginner',
    zhTitle:'Docker 容器化入门', enTitle:'Docker Containerization Intro',
    zhDesc:'理解 Docker 核心概念，构建第一个容器', enDesc:'Understand Docker concepts, build first container',
    topics:['镜像与容器','Dockerfile 编写','Docker Compose','数据卷','网络配置'] },
  { field:'dev', software:'docker', slug:'multi-stage', level:'advanced',
    zhTitle:'Docker 多阶段构建优化', enTitle:'Docker Multi-Stage Build Optimization',
    zhDesc:'用多阶段构建缩小镜像体积', enDesc:'Minimize image size with multi-stage builds',
    topics:['构建阶段拆分','依赖缓存','基础镜像选择','安全扫描','CI/CD 集成'] },
  // Cursor (2)
  { field:'dev', software:'cursor', slug:'ai-features', level:'beginner',
    zhTitle:'Cursor AI 编程功能指南', enTitle:'Cursor AI Coding Features Guide',
    zhDesc:'利用 Cursor 的 AI 功能提升编码效率', enDesc:'Boost coding productivity with Cursor AI',
    topics:['对话编程','代码补全','错误修复','重构建议','多文件编辑'] },
  { field:'dev', software:'cursor', slug:'codebase-qa', level:'intermediate',
    zhTitle:'Cursor 代码库问答技巧', enTitle:'Cursor Codebase Q&A Tips',
    zhDesc:'用 Cursor 理解和导航大型代码库', enDesc:'Navigate large codebases with cursor Q&A',
    topics:['索引配置','上下文选择','规则定制','Agent 模式','代码审查'] },
  // Postman (2)
  { field:'dev', software:'postman', slug:'api-testing', level:'beginner',
    zhTitle:'Postman API 测试入门', enTitle:'Postman API Testing Basics',
    zhDesc:'用 Postman 发送请求和测试 API', enDesc:'Send requests and test APIs with Postman',
    topics:['请求构建','集合管理','环境变量','断言脚本','批量运行'] },
  { field:'dev', software:'postman', slug:'automation', level:'advanced',
    zhTitle:'Postman 自动化测试', enTitle:'Postman Automation & CI',
    zhDesc:'用 Newman 和 CI 实现 API 自动化测试', enDesc:'Automate API tests with Newman and CI',
    topics:['Newman CLI','测试链','数据驱动','报告生成','CI 集成'] },

  // ── OFFICE ──
  // Excel (3)
  { field:'office', software:'excel', slug:'formulas-functions', level:'beginner',
    zhTitle:'Excel 公式与函数入门', enTitle:'Excel Formulas & Functions Intro',
    zhDesc:'VLOOKUP、SUMIF 等常用 Excel 函数教程', enDesc:'VLOOKUP, SUMIF, and essential Excel functions',
    topics:['VLOOKUP','SUMIF/COUNTIF','文本函数','日期函数','IF 嵌套'] },
  { field:'office', software:'excel', slug:'pivot-tables', level:'intermediate',
    zhTitle:'Excel 数据透视表完全指南', enTitle:'Excel Pivot Tables Complete Guide',
    zhDesc:'用透视表快速分析汇总大量数据', enDesc:'Analyze large datasets quickly with pivot tables',
    topics:['创建透视表','值字段设置','切片器','日程表','计算字段'] },
  { field:'office', software:'excel', slug:'power-query', level:'advanced',
    zhTitle:'Excel Power Query 数据清洗', enTitle:'Excel Power Query Data Cleaning',
    zhDesc:'用 Power Query 自动化数据清洗流程', enDesc:'Automate data cleaning with Power Query',
    topics:['数据导入','列操作','合并查询','追加查询','M 语言基础'] },
  // Word (2)
  { field:'office', software:'word', slug:'document-formatting', level:'beginner',
    zhTitle:'Word 文档排版指南', enTitle:'Word Document Formatting Guide',
    zhDesc:'专业的文档排版和样式设置技巧', enDesc:'Professional document formatting and styles',
    topics:['样式与主题','页眉页脚','多级列表','分节符','目录生成'] },
  { field:'office', software:'word', slug:'mail-merge', level:'intermediate',
    zhTitle:'Word 邮件合并批量处理', enTitle:'Word Mail Merge Batch Processing',
    zhDesc:'用邮件合并功能批量生成文档', enDesc:'Batch generate documents with mail merge',
    topics:['数据源连接','合并域','条件规则','标签制作','导出分发'] },
  // PPT (2)
  { field:'office', software:'ppt', slug:'professional-slides', level:'beginner',
    zhTitle:'PPT 专业演示文稿设计', enTitle:'Professional PPT Slide Design',
    zhDesc:'设计清晰有力的演示幻灯片', enDesc:'Design clear and impactful presentation slides',
    topics:['母版设计','布局原则','动画设置','图表优化','演讲者备注'] },
  { field:'office', software:'ppt', slug:'presentation-tips', level:'intermediate',
    zhTitle:'PPT 演讲技巧与准备', enTitle:'PPT Presentation Tips & Prep',
    zhDesc:'从幻灯片设计到演讲交付的完整指南', enDesc:'Complete guide from slide design to delivery',
    topics:['故事线构建','视觉辅助','过渡动画','计时排练','问答准备'] },
  // Notion (2)
  { field:'office', software:'notion', slug:'workspace-setup', level:'beginner',
    zhTitle:'Notion 工作空间搭建', enTitle:'Notion Workspace Setup',
    zhDesc:'搭建高效的 Notion 个人知识管理系统', enDesc:'Build an efficient Notion knowledge management system',
    topics:['页面结构','数据库创建','视图切换','关联数据库','模板复用'] },
  { field:'office', software:'notion', slug:'project-management', level:'intermediate',
    zhTitle:'Notion 项目管理实战', enTitle:'Notion Project Management',
    zhDesc:'用 Notion 管理项目进度和团队协作', enDesc:'Manage projects and team collaboration in Notion',
    topics:['项目看板','甘特视图','任务分配','进度追踪','团队协作'] },

  // ── PRODUCTIVITY ──
  // Obsidian (3)
  { field:'productivity', software:'obsidian', slug:'vault-setup', level:'beginner',
    zhTitle:'Obsidian 知识库搭建指南', enTitle:'Obsidian Vault Setup Guide',
    zhDesc:'从零开始搭建个人 Obsidian 知识管理系统', enDesc:'Build your personal knowledge management system',
    topics:['创建仓库','Markdown 基础','双向链接','图谱视图','文件组织'] },
  { field:'productivity', software:'obsidian', slug:'plugins-workflow', level:'intermediate',
    zhTitle:'Obsidian 插件推荐与工作流', enTitle:'Obsidian Plugins & Workflow',
    zhDesc:'精选 Obsidian 社区插件和工作流', enDesc:'Curated community plugins and workflows',
    topics:['核心插件','社区插件','Dataview','Templater','Kanban'] },
  { field:'productivity', software:'obsidian', slug:'publish-sharing', level:'intermediate',
    zhTitle:'Obsidian 发布与分享', enTitle:'Obsidian Publish & Sharing',
    zhDesc:'用 Obsidian Publish 和替代方案分享笔记', enDesc:'Share notes via Obsidian Publish and alternatives',
    topics:['Obsidian Publish','Digital Garden','GitHub Pages','自定义域名','SEO 优化'] },
  // Todoist (2)
  { field:'productivity', software:'todoist', slug:'task-management', level:'beginner',
    zhTitle:'Todoist 任务管理入门', enTitle:'Todoist Task Management Basics',
    zhDesc:'用 Todoist 管理个人任务和项目', enDesc:'Manage personal tasks and projects with Todoist',
    topics:['任务创建','项目管理','标签与筛选','优先级','习惯追踪'] },
  { field:'productivity', software:'todoist', slug:'gtd-workflow', level:'intermediate',
    zhTitle:'Todoist GTD 工作流搭建', enTitle:'Todoist GTD Workflow Setup',
    zhDesc:'在 Todoist 中实现 GTD 方法论', enDesc:'Implement GTD methodology in Todoist',
    topics:['收件箱处理','上下文标签','每周回顾','目标分解','自动化规则'] },
  // Raycast (2)
  { field:'productivity', software:'raycast', slug:'productivity-tools', level:'beginner',
    zhTitle:'Raycast 效率工具指南', enTitle:'Raycast Productivity Tools Guide',
    zhDesc:'用 Raycast 替代 Spotlight 提升操作效率', enDesc:'Replace Spotlight with Raycast for faster workflow',
    topics:['窗口管理','剪贴板历史','Snippet 扩展','计算器','快速搜索'] },
  { field:'productivity', software:'raycast', slug:'extensions-custom', level:'intermediate',
    zhTitle:'Raycast 扩展开发入门', enTitle:'Raycast Extension Development',
    zhDesc:'开发自定义 Raycast 扩展', enDesc:'Build custom Raycast extensions',
    topics:['扩展脚手架','API 调用','UI 组件','首选项配置','发布商店'] },

  // ── VIDEO ──
  // Premiere (2)
  { field:'video', software:'premiere', slug:'editing-basics', level:'beginner',
    zhTitle:'Premiere Pro 剪辑入门', enTitle:'Premiere Pro Editing Basics',
    zhDesc:'学习 Premiere Pro 核心剪辑技巧', enDesc:'Learn core editing techniques in Premiere Pro',
    topics:['时间线编辑','切割工具','关键帧动画','转场效果','导出设置'] },
  { field:'video', software:'premiere', slug:'color-correction', level:'intermediate',
    zhTitle:'Premiere Pro 调色与色彩校正', enTitle:'Premiere Pro Color Correction',
    zhDesc:'专业视频调色流程和 Lumetri 工具', enDesc:'Professional color grading with Lumetri tools',
    topics:['Lumetri 面板','白平衡','曲线调色','LUT 应用','范围监视'] },
  // DaVinci Resolve (2)
  { field:'video', software:'davinci-resolve', slug:'fusion-compositing', level:'intermediate',
    zhTitle:'DaVinci Resolve 剪辑与合成', enTitle:'DaVinci Resolve Editing & Compositing',
    zhDesc:'用 Fusion 页面制作视觉合成效果', enDesc:'Create visual composites in Fusion page',
    topics:['剪辑工作流','Fusion 合成','节点编辑器','动态模糊','跟踪器'] },
  { field:'video', software:'davinci-resolve', slug:'audio-post', level:'advanced',
    zhTitle:'DaVinci Resolve 音频后期', enTitle:'DaVinci Resolve Audio Post-Production',
    zhDesc:'Fairlight 页面音频编辑与混音', enDesc:'Audio editing and mixing in Fairlight page',
    topics:['Fairlight 界面','音频剪辑','压缩器','降噪处理','混音输出'] },
  // CapCut (2)
  { field:'video', software:'capcut', slug:'quick-edits', level:'beginner',
    zhTitle:'CapCut 快速剪辑技巧', enTitle:'CapCut Quick Editing Tips',
    zhDesc:'用 CapCut 制作短视频和社交媒体内容', enDesc:'Create short videos and social media content',
    topics:['剪辑基础','自动字幕','转场特效','背景音乐','一键调色'] },
  { field:'video', software:'capcut', slug:'advanced-effects', level:'intermediate',
    zhTitle:'CapCut 高级特效教程', enTitle:'CapCut Advanced Effects',
    zhDesc:'CapCut 关键帧和蒙版高级技巧', enDesc:'Advanced keyframe and masking techniques',
    topics:['关键帧动画','蒙版跟踪','混合模式','速度曲线','文字动画'] },

  // ── AI ──
  // ChatGPT (3)
  { field:'ai', software:'chatgpt', slug:'prompt-engineering', level:'beginner',
    zhTitle:'ChatGPT Prompt Engineering 入门', enTitle:'ChatGPT Prompt Engineering Basics',
    zhDesc:'学会编写高效提示词获得更好回答', enDesc:'Write effective prompts for better responses',
    topics:['提示词结构','角色设定','上下文管理','迭代优化','常见陷阱'] },
  { field:'ai', software:'chatgpt', slug:'advanced-use-cases', level:'intermediate',
    zhTitle:'ChatGPT 高级应用场景', enTitle:'ChatGPT Advanced Use Cases',
    zhDesc:'ChatGPT 在编程、写作、分析中的高级应用', enDesc:'Advanced uses in coding, writing, and analysis',
    topics:['代码生成','数据分析','文档编写','翻译工作流','思维链'] },
  { field:'ai', software:'chatgpt', slug:'gpts-custom', level:'intermediate',
    zhTitle:'自定义 GPTs 开发指南', enTitle:'Custom GPTs Development Guide',
    zhDesc:'创建和分享自定义 GPT 应用', enDesc:'Create and share custom GPT applications',
    topics:['GPT 配置','知识文件','Action API','发布分享','数据分析'] },
  // Midjourney (2)
  { field:'ai', software:'midjourney', slug:'prompt-basics', level:'beginner',
    zhTitle:'Midjourney AI 绘画入门', enTitle:'Midjourney AI Art Basics',
    zhDesc:'学习 Midjourney 提示词和参数设置', enDesc:'Learn Midjourney prompts and parameters',
    topics:['提示词写作','参数详解','风格参考','图像放大','种子值'] },
  { field:'ai', software:'midjourney', slug:'professional-workflow', level:'intermediate',
    zhTitle:'Midjourney 专业工作流', enTitle:'Midjourney Professional Workflow',
    zhDesc:'Midjourney 商业级图像生成与后期', enDesc:'Commercial-grade image generation and post-processing',
    topics:['批量生成','图生图','角色一致性','后期调色','商业应用'] },
  // Claude (2)
  { field:'ai', software:'claude', slug:'getting-started', level:'beginner',
    zhTitle:'Claude AI 入门指南', enTitle:'Claude AI Getting Started Guide',
    zhDesc:'了解 Claude AI 的核心功能和用法', enDesc:'Learn Claude AI core features and usage',
    topics:['对话基础','文件上传','长文处理','编程辅助','写作协作'] },
  { field:'ai', software:'claude', slug:'projects', level:'intermediate',
    zhTitle:'Claude Projects 与知识管理', enTitle:'Claude Projects & Knowledge Management',
    zhDesc:'用 Claude Projects 组织工作和知识库', enDesc:'Organize work and knowledge with Claude Projects',
    topics:['Project 设置','知识库上传','自定义指令','团队协作','版本对比'] },
];

// ── Topic translation map ──
const topicEn = {
  // design
  '混合模式详解':'Blend Modes','图层蒙版':'Layer Masks','剪贴蒙版':'Clipping Masks','调整图层':'Adjustment Layers','智能对象':'Smart Objects',
  '曲线调整':'Curves','色阶工具':'Levels','HSL调整':'HSL Adjustments','色彩平衡':'Color Balance','查找颜色':'Color Lookup',
  '图层样式':'Layer Styles','文字变形':'Text Warping','3D文字':'3D Text','霓虹效果':'Neon Effects','金属质感':'Metal Texture',
  '创建组件':'Creating Components','变体设置':'Variants','样式管理':'Style Management','自动布局':'Auto Layout','团队库':'Team Libraries',
  '连接交互':'Connecting Interactions','动效曲线':'Easing Curves','滚动行为':'Scroll Behavior','条件逻辑':'Conditional Logic','原型演示':'Prototype Presentation',
  '锚点操作':'Anchor Points','贝塞尔曲线':'Bézier Curves','路径编辑':'Path Editing','形状生成器':'Shape Builder','钢笔练习':'Pen Tool Practice',
  '草图规划':'Sketch Planning','网格系统':'Grid Systems','字体选择':'Font Selection','色彩搭配':'Color Schemes','最终输出':'Final Output',
  '模板使用':'Template Usage','品牌套件':'Brand Kits','动画效果':'Animations','尺寸规范':'Dimension Standards','批量导出':'Batch Export',
  '演示布局':'Presentation Layout','图表插入':'Charts','协作编辑':'Collaboration','演讲备注':'Speaker Notes','分享发布':'Sharing & Publishing',
  '界面导航':'Interface Navigation','基本图元':'Primitives','编辑模式':'Edit Mode','修改器':'Modifiers','材质与渲染':'Materials & Rendering',
  // dev
  '多光标编辑':'Multi-Cursor Editing','代码导航':'Code Navigation','重构快捷键':'Refactoring Shortcuts','终端集成':'Terminal Integration','自定义快捷键':'Custom Shortcuts',
  '代码格式化':'Code Formatting','Linting':'Linting','Git 集成':'Git Integration','AI 辅助':'AI Assistance','主题美化':'Themes & Appearance',
  '启动配置':'Launch Configurations','断点类型':'Breakpoint Types','监视变量':'Watched Variables','调用堆栈':'Call Stack','条件断点':'Conditional Breakpoints',
  'Git Flow':'Git Flow','Trunk-based':'Trunk-based','分支命名规范':'Branch Naming','PR 工作流':'PR Workflow','冲突解决':'Conflict Resolution',
  '交互式 Rebase':'Interactive Rebase','Cherry-Pick':'Cherry-Pick','Stash 高级用法':'Advanced Stash','Bisect 调试':'Bisect Debugging','重置策略':'Reset Strategies',
  '镜像与容器':'Images & Containers','Dockerfile 编写':'Dockerfiles','Docker Compose':'Docker Compose','数据卷':'Volumes','网络配置':'Network Configuration',
  '构建阶段拆分':'Stage Splitting','依赖缓存':'Dependency Caching','基础镜像选择':'Base Image Selection','安全扫描':'Security Scanning','CI/CD 集成':'CI/CD Integration',
  '对话编程':'Chat-driven Development','代码补全':'Code Completion','错误修复':'Error Fixing','重构建议':'Refactoring Suggestions','多文件编辑':'Multi-file Editing',
  '索引配置':'Index Configuration','上下文选择':'Context Selection','规则定制':'Custom Rules','Agent 模式':'Agent Mode','代码审查':'Code Review',
  '请求构建':'Request Building','集合管理':'Collection Management','环境变量':'Environment Variables','断言脚本':'Test Scripts','批量运行':'Batch Runs',
  'Newman CLI':'Newman CLI','测试链':'Test Chaining','数据驱动':'Data-driven Testing','报告生成':'Report Generation','CI 集成':'CI Integration',
  // office
  'VLOOKUP':'VLOOKUP','SUMIF/COUNTIF':'SUMIF/COUNTIF','文本函数':'Text Functions','日期函数':'Date Functions','IF 嵌套':'Nested IFs',
  '创建透视表':'Creating PivotTables','值字段设置':'Value Field Settings','切片器':'Slicers','日程表':'Timelines','计算字段':'Calculated Fields',
  '数据导入':'Data Import','列操作':'Column Operations','合并查询':'Merge Queries','追加查询':'Append Queries','M 语言基础':'M Language Basics',
  '样式与主题':'Styles & Themes','页眉页脚':'Headers & Footers','多级列表':'Multi-level Lists','分节符':'Section Breaks','目录生成':'Table of Contents',
  '数据源连接':'Data Source Connection','合并域':'Merge Fields','条件规则':'Conditional Rules','标签制作':'Label Creation','导出分发':'Export & Distribution',
  '母版设计':'Slide Master Design','布局原则':'Layout Principles','动画设置':'Animation Settings','图表优化':'Chart Optimization','演讲者备注':'Speaker Notes',
  '故事线构建':'Story Arc','视觉辅助':'Visual Aids','过渡动画':'Transition Animations','计时排练':'Timing & Rehearsal','问答准备':'Q&A Preparation',
  '页面结构':'Page Structure','数据库创建':'Database Creation','视图切换':'View Switching','关联数据库':'Linked Databases','模板复用':'Template Reuse',
  '项目看板':'Project Kanban','甘特视图':'Gantt View','任务分配':'Task Assignment','进度追踪':'Progress Tracking','团队协作':'Team Collaboration',
  // productivity
  '创建仓库':'Creating a Vault','Markdown 基础':'Markdown Basics','双向链接':'Backlinks','图谱视图':'Graph View','文件组织':'File Organization',
  '核心插件':'Core Plugins','社区插件':'Community Plugins','Dataview':'Dataview','Templater':'Templater','Kanban':'Kanban',
  'Obsidian Publish':'Obsidian Publish','Digital Garden':'Digital Garden','GitHub Pages':'GitHub Pages','自定义域名':'Custom Domains','SEO 优化':'SEO Optimization',
  '任务创建':'Task Creation','项目管理':'Project Management','标签与筛选':'Labels & Filters','优先级':'Priority Levels','习惯追踪':'Habit Tracking',
  '收件箱处理':'Inbox Processing','上下文标签':'Context Labels','每周回顾':'Weekly Review','目标分解':'Goal Decomposition','自动化规则':'Automation Rules',
  '窗口管理':'Window Management','剪贴板历史':'Clipboard History','Snippet 扩展':'Snippets','计算器':'Calculator','快速搜索':'Quick Search',
  '扩展脚手架':'Extension Scaffolding','API 调用':'API Calls','UI 组件':'UI Components','首选项配置':'Preferences','发布商店':'Store Publishing',
  // video
  '时间线编辑':'Timeline Editing','切割工具':'Cut Tools','关键帧动画':'Keyframe Animation','转场效果':'Transitions','导出设置':'Export Settings',
  'Lumetri 面板':'Lumetri Panel','白平衡':'White Balance','曲线调色':'Curves','LUT 应用':'LUTs','范围监视':'Scope Monitoring',
  '剪辑工作流':'Editing Workflow','Fusion 合成':'Fusion Compositing','节点编辑器':'Node Editor','动态模糊':'Motion Blur','跟踪器':'Tracker',
  'Fairlight 界面':'Fairlight Interface','音频剪辑':'Audio Editing','压缩器':'Compressors','降噪处理':'Noise Reduction','混音输出':'Mixing & Output',
  '剪辑基础':'Basic Editing','自动字幕':'Auto Captions','转场特效':'Transition Effects','背景音乐':'Background Music','一键调色':'One-click Color',
  '关键帧动画':'Keyframe Animation','蒙版跟踪':'Mask Tracking','混合模式':'Blend Modes','速度曲线':'Speed Curves','文字动画':'Text Animation',
  // ai
  '提示词结构':'Prompt Structure','角色设定':'Role Setting','上下文管理':'Context Management','迭代优化':'Iterative Refinement','常见陷阱':'Common Pitfalls',
  '代码生成':'Code Generation','数据分析':'Data Analysis','文档编写':'Documentation','翻译工作流':'Translation Workflows','思维链':'Chain of Thought',
  'GPT 配置':'GPT Configuration','知识文件':'Knowledge Files','Action API':'Actions API','发布分享':'Publishing & Sharing','数据分析':'Data Analysis',
  '提示词写作':'Prompt Writing','参数详解':'Parameter Details','风格参考':'Style References','图像放大':'Upscaling','种子值':'Seed Values',
  '批量生成':'Batch Generation','图生图':'Image-to-Image','角色一致性':'Character Consistency','后期调色':'Post-processing','商业应用':'Commercial Use',
  '对话基础':'Conversation Basics','文件上传':'File Uploads','长文处理':'Long Document Handling','编程辅助':'Coding Assistance','写作协作':'Writing Collaboration',
  'Project 设置':'Project Setup','知识库上传':'Knowledge Base Uploads','自定义指令':'Custom Instructions','团队协作':'Team Collaboration','版本对比':'Version Comparison',
};

function getTopics(a, lang) {
  if (lang === 'zh') return a.topics;
  return (a.enTopics || a.topics.map(t => topicEn[t] || t));
}

function makeTopicsSection(a, lang) {
  const topics = getTopics(a, lang);
  const header = lang === 'zh' ? '## 课程大纲\n\n本教程涵盖以下主题：\n' : '## Topics Covered\n\nThis tutorial covers:\n';
  const items = topics.map(t => `- **${t}**`).join('\n');
  return header + items + '\n';
}

function makeBody(a, lang) {
  const isZh = lang === 'zh';
  const topics = getTopics(a, lang);
  const sn = a.software.charAt(0).toUpperCase() + a.software.slice(1);
  const lvlMap = { beginner: isZh ? '入门' : 'Beginner', intermediate: isZh ? '进阶' : 'Intermediate', advanced: isZh ? '高级' : 'Advanced' };

  const sections = [];

  sections.push(`## ${isZh ? '概述' : 'Overview'}\n\n${isZh
    ? `本文是 **${sn}** 的${lvlMap[a.level]}级教程，适合${a.level === 'beginner' ? '刚开始接触该工具的读者' : a.level === 'advanced' ? '有一定基础希望深入学习的高级用户' : '已掌握基础知识想进一步提升的读者'}。`
    : `This is a **${lvlMap[a.level]}**-level tutorial for **${sn}**, designed for ${a.level === 'beginner' ? 'readers new to this tool' : a.level === 'advanced' ? 'experienced users looking to go deeper' : 'those with basic knowledge ready to level up'}.`}\n`);

  sections.push(makeTopicsSection(a, lang));

  topics.forEach((t, i) => {
    sections.push(`### ${i + 1}. ${t}\n\n${isZh
      ? `本节详细讲解 **${t}** 的核心概念和操作步骤。通过实际案例帮助你快速掌握这一技能。理解 ${t} 后，你的 ${sn} 使用效率将显著提升。`
      : `This section covers **${t}** — core concepts and step-by-step instructions. Real-world examples help you master this skill quickly. Understanding ${t} will significantly boost your ${sn} proficiency.`}\n`);
  });

  sections.push(`## ${isZh ? '总结' : 'Summary'}\n\n${isZh
    ? `通过本教程，你学习了 ${sn} 的 ${topics.slice(0,2).join('、')} 等核心知识。持续练习并在实际项目中应用，将帮助你更快掌握该工具。`
    : `In this tutorial, you learned core ${sn} concepts including ${topics.slice(0,2).join(', ')}. Practice regularly and apply these skills in real projects to master the tool faster.`}\n`);

  sections.push(`---\n\n${isZh
    ? `> 本文为教程系列的一部分。查看 [${sn} 更多教程](${a.slug}/) 了解更多内容。`
    : `> This article is part of a tutorial series. Check out [more ${sn} tutorials](${a.slug}/) for additional content.`}\n`);

  return sections.join('\n');
}

function generateArticle(a, lang) {
  const isZh = lang === 'zh';
  const lvl = lang === 'zh' ? a.level : a.level;

  const frontmatter = {
    title: isZh ? a.zhTitle : a.enTitle,
    description: isZh ? a.zhDesc : a.enDesc,
    field: a.field,
    software: a.software,
    level: a.level,
    language: lang,
    slug: a.slug,
    date: NOW,
    readTime: 8 + Math.floor(Math.random() * 10),
  };

  if (lang === 'en') {
    frontmatter.translationOf = `/zh/${a.field}/${a.software}/${a.slug}`;
  }

  const affiliateLinks = getAffiliateLinks(a.field, lang);
  if (affiliateLinks.length > 0) {
    frontmatter.affiliateLinks = affiliateLinks;
  }

  let mdx = '---\n';
  mdx += yamlify(frontmatter);
  mdx += '---\n\n';
  mdx += makeBody(a, lang);

  return mdx;
}

function yamlify(obj) {
  let out = '';
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      out += `${k}:\n`;
      for (const item of v) {
        if (typeof item === 'object') {
          out += `  - name: ${item.name}\n    url: ${item.url}\n    description: ${item.description}\n    vendor: ${item.vendor}\n`;
        }
      }
    } else if (typeof v === 'boolean') {
      out += `${k}: ${v}\n`;
    } else {
      out += `${k}: ${v}\n`;
    }
  }
  return out;
}

function getAffiliateLinks(field, lang) {
  const links = {
    design: [
      { name: 'Adobe Creative Cloud', url: 'https://www.adobe.com', description: lang === 'zh' ? '全套创意应用订阅' : 'Full suite of creative apps', vendor: 'Adobe' },
    ],
    dev: [
      { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: lang === 'zh' ? 'AI 编程助手' : 'AI code assistant', vendor: 'GitHub' },
    ],
    office: [
      { name: 'Microsoft 365', url: 'https://www.microsoft.com/microsoft-365', description: lang === 'zh' ? 'Office 全家桶订阅' : 'Office suite subscription', vendor: 'Microsoft' },
    ],
    productivity: [
      { name: 'Setapp', url: 'https://setapp.com', description: lang === 'zh' ? '200+ Mac 应用订阅服务' : '200+ Mac apps subscription', vendor: 'Setapp' },
    ],
    video: [
      { name: 'Adobe Creative Cloud', url: 'https://www.adobe.com', description: lang === 'zh' ? '视频创意工具集' : 'Video creative tools', vendor: 'Adobe' },
    ],
    ai: [
      { name: 'ChatGPT Plus', url: 'https://chatgpt.com', description: lang === 'zh' ? 'AI 对话订阅服务' : 'AI chat subscription', vendor: 'OpenAI' },
    ],
  };
  return links[field] || [];
}

// ── Main ──
function main() {
  let total = 0;

  for (const a of articles) {
    for (const lang of ['zh', 'en']) {
      const dir = path.join(POSTS_DIR, lang, a.field, a.software);
      fs.mkdirSync(dir, { recursive: true });

      const filePath = path.join(dir, `${a.slug}.mdx`);
      const content = generateArticle(a, lang);
      fs.writeFileSync(filePath, content, 'utf-8');
      total++;
      console.log(`[${total}] ${lang}/${a.field}/${a.software}/${a.slug}.mdx`);
    }
  }

  console.log(`\nDone! Generated ${total} articles.`);
}

main();
