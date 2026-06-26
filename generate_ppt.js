const pptxgen = require("pptxgenjs");

// 读取赛程数据
const scheduleData = require('./schedule_fixed.js');

// 创建演示文稿
let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'World Cup 2026';
pres.title = '2026年世界杯赛程';

// 配色方案 - 足球场主题：深绿色 + 白色 + 金色
const colors = {
  primary: "1B5E20",      // 深绿色
  secondary: "4CAF50",    // 草绿色
  accent: "FFC107",       // 金色
  text: "212121",         // 深灰色
  textLight: "FFFFFF",    // 白色
  background: "F5F5F5",   // 浅灰色
  cardBg: "FFFFFF"        // 白色
};

// 创建阴影效果的辅助函数
const makeShadow = () => ({
  type: "outer",
  blur: 8,
  offset: 3,
  angle: 135,
  color: "000000",
  opacity: 0.15
});

// 1. 封面页
function createTitleSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.primary };

  // 主标题
  slide.addText("2026年世界杯", {
    x: 0.5, y: 1.5, w: 9, h: 1.2,
    fontSize: 60, bold: true, color: colors.textLight,
    align: "center", fontFace: "Arial Black"
  });

  // 副标题
  slide.addText("赛程安排", {
    x: 0.5, y: 2.8, w: 9, h: 0.8,
    fontSize: 36, color: colors.accent,
    align: "center", fontFace: "Arial"
  });

  // 主办信息
  slide.addText([
    { text: "🇺🇸 美国 · 🇨🇦 加拿大 · 🇲🇽 墨西哥", options: {} }
  ], {
    x: 0.5, y: 4, w: 9, h: 0.6,
    fontSize: 24, color: colors.textLight,
    align: "center"
  });

  // 日期
  slide.addText("2026年6月12日 - 7月20日", {
    x: 0.5, y: 4.7, w: 9, h: 0.5,
    fontSize: 18, color: colors.secondary,
    align: "center", italic: true
  });
}

// 2. 赛事概览页
function createOverviewSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addText("赛事概览", {
    x: 0.5, y: 0.4, w: 9, h: 0.6,
    fontSize: 36, bold: true, color: colors.primary,
    fontFace: "Arial Black"
  });

  // 统计数据卡片
  const stats = [
    { label: "参赛队伍", value: "48支", icon: "🏆" },
    { label: "比赛场次", value: "104场", icon: "⚽" },
    { label: "主办城市", value: "16个", icon: "🏟️" },
    { label: "比赛天数", value: "39天", icon: "📅" }
  ];

  stats.forEach((stat, idx) => {
    const xPos = 0.8 + (idx * 2.3);
    const yPos = 1.5;

    // 卡片背景
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 2, h: 2,
      fill: { color: colors.cardBg },
      shadow: makeShadow()
    });

    // 图标
    slide.addText(stat.icon, {
      x: xPos, y: yPos + 0.3, w: 2, h: 0.6,
      fontSize: 48, align: "center"
    });

    // 数值
    slide.addText(stat.value, {
      x: xPos, y: yPos + 1, w: 2, h: 0.5,
      fontSize: 32, bold: true, color: colors.primary,
      align: "center"
    });

    // 标签
    slide.addText(stat.label, {
      x: xPos, y: yPos + 1.5, w: 2, h: 0.4,
      fontSize: 14, color: colors.text,
      align: "center"
    });
  });

  // 赛程阶段
  slide.addText("赛程阶段", {
    x: 0.5, y: 4, w: 9, h: 0.5,
    fontSize: 20, bold: true, color: colors.primary
  });

  const phases = [
    "小组赛：6月12日-28日",
    "32强赛：6月29日-7月4日",
    "16强赛：7月5日-8日",
    "1/4决赛：7月10日-12日",
    "半决赛：7月15日-16日",
    "决赛：7月20日"
  ];

  phases.forEach((phase, idx) => {
    slide.addText("▪ " + phase, {
      x: 1, y: 4.6 + (idx * 0.15), w: 8, h: 0.15,
      fontSize: 12, color: colors.text
    });
  });
}

// 3. 小组赛页面（按组）
function createGroupStageSlides() {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  groups.forEach(group => {
    const groupMatches = scheduleData.filter(m => m.group === `${group}组` && m.stage === "group");

    if (groupMatches.length === 0) return;

    let slide = pres.addSlide();
    slide.background = { color: colors.background };

    // 标题栏
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.8,
      fill: { color: colors.primary }
    });

    slide.addText(`小组赛 - ${group}组`, {
      x: 0.5, y: 0.15, w: 9, h: 0.5,
      fontSize: 32, bold: true, color: colors.textLight,
      fontFace: "Arial Black"
    });

    // 比赛列表
    groupMatches.forEach((match, idx) => {
      const yPos = 1.2 + (idx * 0.65);

      // 比赛卡片背景
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 9, h: 0.6,
        fill: { color: colors.cardBg },
        line: { color: colors.secondary, width: 1 }
      });

      // 日期和时间
      slide.addText(`${match.date} ${match.time}`, {
        x: 0.7, y: yPos + 0.1, w: 1.8, h: 0.4,
        fontSize: 11, color: colors.text, bold: true
      });

      // 主队
      slide.addText(match.homeTeam, {
        x: 2.7, y: yPos + 0.1, w: 2, h: 0.4,
        fontSize: 12, color: colors.text, align: "right"
      });

      // VS 或比分
      if (match.score) {
        slide.addText(match.score, {
          x: 4.8, y: yPos + 0.1, w: 0.8, h: 0.4,
          fontSize: 14, color: colors.accent, bold: true, align: "center"
        });
      } else {
        slide.addText("VS", {
          x: 4.8, y: yPos + 0.1, w: 0.8, h: 0.4,
          fontSize: 11, color: colors.text, align: "center"
        });
      }

      // 客队
      slide.addText(match.awayTeam, {
        x: 5.7, y: yPos + 0.1, w: 2, h: 0.4,
        fontSize: 12, color: colors.text, align: "left"
      });

      // 场馆
      slide.addText(`📍 ${match.venue}`, {
        x: 7.8, y: yPos + 0.1, w: 1.5, h: 0.4,
        fontSize: 10, color: colors.text
      });
    });
  });
}

// 4. 淘汰赛页面
function createKnockoutSlides() {
  const stages = [
    { key: "round32", title: "32强淘汰赛", emoji: "🎯" },
    { key: "round16", title: "16强淘汰赛", emoji: "⚡" },
    { key: "quarter", title: "1/4决赛", emoji: "🔥" },
    { key: "semi", title: "半决赛", emoji: "💫" },
    { key: "third", title: "三四名决赛", emoji: "🥉" },
    { key: "final", title: "决赛", emoji: "🏆" }
  ];

  stages.forEach(stage => {
    const matches = scheduleData.filter(m => m.stage === stage.key);

    if (matches.length === 0) return;

    let slide = pres.addSlide();
    slide.background = { color: colors.background };

    // 标题栏
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9,
      fill: { color: stage.key === "final" ? colors.accent : colors.primary }
    });

    slide.addText(`${stage.emoji} ${stage.title}`, {
      x: 0.5, y: 0.2, w: 9, h: 0.5,
      fontSize: 36, bold: true, color: stage.key === "final" ? colors.text : colors.textLight,
      fontFace: "Arial Black"
    });

    // 比赛列表
    const matchesPerPage = stage.key === "round32" ? 8 : matches.length;
    const displayMatches = matches.slice(0, matchesPerPage);

    displayMatches.forEach((match, idx) => {
      const yPos = 1.3 + (idx * 0.55);

      // 比赛卡片
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 9, h: 0.5,
        fill: { color: colors.cardBg },
        shadow: makeShadow()
      });

      // 左侧装饰条
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 0.08, h: 0.5,
        fill: { color: stage.key === "final" ? colors.accent : colors.secondary }
      });

      // 日期时间
      slide.addText(`${match.date} ${match.time}`, {
        x: 0.8, y: yPos + 0.08, w: 1.5, h: 0.35,
        fontSize: 11, color: colors.text, bold: true
      });

      // 对阵
      slide.addText(`${match.homeTeam} VS ${match.awayTeam}`, {
        x: 2.5, y: yPos + 0.08, w: 4.5, h: 0.35,
        fontSize: 13, color: colors.text, bold: stage.key === "final"
      });

      // 场馆
      slide.addText(`📍 ${match.venue}`, {
        x: 7.2, y: yPos + 0.08, w: 2, h: 0.35,
        fontSize: 11, color: colors.text
      });
    });

    // 如果是32强赛且有更多比赛，添加提示
    if (stage.key === "round32" && matches.length > matchesPerPage) {
      slide.addText(`...更多比赛请查看完整赛程`, {
        x: 0.5, y: 5.3, w: 9, h: 0.3,
        fontSize: 12, color: colors.text, italic: true, align: "center"
      });
    }
  });

  // 如果32强赛有超过8场，创建第二页
  const round32Matches = scheduleData.filter(m => m.stage === "round32");
  if (round32Matches.length > 8) {
    let slide = pres.addSlide();
    slide.background = { color: colors.background };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9,
      fill: { color: colors.primary }
    });

    slide.addText(`🎯 32强淘汰赛（续）`, {
      x: 0.5, y: 0.2, w: 9, h: 0.5,
      fontSize: 36, bold: true, color: colors.textLight,
      fontFace: "Arial Black"
    });

    const remainingMatches = round32Matches.slice(8);
    remainingMatches.forEach((match, idx) => {
      const yPos = 1.3 + (idx * 0.55);

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 9, h: 0.5,
        fill: { color: colors.cardBg },
        shadow: makeShadow()
      });

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yPos, w: 0.08, h: 0.5,
        fill: { color: colors.secondary }
      });

      slide.addText(`${match.date} ${match.time}`, {
        x: 0.8, y: yPos + 0.08, w: 1.5, h: 0.35,
        fontSize: 11, color: colors.text, bold: true
      });

      slide.addText(`${match.homeTeam} VS ${match.awayTeam}`, {
        x: 2.5, y: yPos + 0.08, w: 4.5, h: 0.35,
        fontSize: 13, color: colors.text
      });

      slide.addText(`📍 ${match.venue}`, {
        x: 7.2, y: yPos + 0.08, w: 2, h: 0.35,
        fontSize: 11, color: colors.text
      });
    });
  }
}

// 5. 结束页
function createEndSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.primary };

  slide.addText("🏆", {
    x: 0.5, y: 1.5, w: 9, h: 1,
    fontSize: 80, align: "center"
  });

  slide.addText("期待精彩赛事", {
    x: 0.5, y: 2.7, w: 9, h: 0.8,
    fontSize: 44, bold: true, color: colors.textLight,
    align: "center", fontFace: "Arial Black"
  });

  slide.addText("2026年世界杯", {
    x: 0.5, y: 3.6, w: 9, h: 0.6,
    fontSize: 28, color: colors.accent,
    align: "center"
  });

  slide.addText("让我们一起见证足球的荣耀时刻", {
    x: 0.5, y: 4.5, w: 9, h: 0.4,
    fontSize: 16, color: colors.secondary,
    align: "center", italic: true
  });
}

// 生成所有页面
console.log("正在生成PPT...");
createTitleSlide();
createOverviewSlide();
createGroupStageSlides();
createKnockoutSlides();
createEndSlide();

// 保存文件
pres.writeFile({ fileName: "2026世界杯赛程.pptx" })
  .then(() => {
    console.log("✅ PPT生成成功: 2026世界杯赛程.pptx");
  })
  .catch(err => {
    console.error("❌ 生成失败:", err);
  });
