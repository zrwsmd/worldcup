const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'World Cup 2026';
pres.title = '2026年FIFA世界杯介绍';

// 配色方案
const colors = {
  primary: "1B5E20",      // 深绿
  secondary: "4CAF50",    // 草绿
  accent: "FFC107",       // 金色
  red: "E53935",          // 红色
  blue: "1E88E5",         // 蓝色
  text: "212121",
  textLight: "FFFFFF",
  background: "F5F5F5",
  cardBg: "FFFFFF"
};

const makeShadow = () => ({
  type: "outer",
  blur: 8,
  offset: 3,
  angle: 135,
  color: "000000",
  opacity: 0.15
});

// 1. 震撼封面
function createCoverSlide() {
  let slide = pres.addSlide();

  // 渐变背景效果 - 使用深色底
  slide.background = { color: colors.primary };

  // 顶部装饰条
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.3,
    fill: { color: colors.accent }
  });

  // 大标题
  slide.addText("2026", {
    x: 0.5, y: 1.2, w: 9, h: 1,
    fontSize: 88, bold: true, color: colors.textLight,
    align: "center", fontFace: "Arial Black",
    charSpacing: 8
  });

  slide.addText("FIFA世界杯", {
    x: 0.5, y: 2.2, w: 9, h: 0.8,
    fontSize: 48, bold: true, color: colors.accent,
    align: "center", fontFace: "Arial Black"
  });

  // 足球图标
  slide.addText("⚽", {
    x: 0.5, y: 3.2, w: 9, h: 0.8,
    fontSize: 64, align: "center"
  });

  // 主办国标志
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2, y: 4.2, w: 6, h: 0.8,
    fill: { color: colors.cardBg, transparency: 20 }
  });

  slide.addText("🇺🇸 美国  ·  🇨🇦 加拿大  ·  🇲🇽 墨西哥", {
    x: 2, y: 4.3, w: 6, h: 0.6,
    fontSize: 22, color: colors.textLight, bold: true,
    align: "center"
  });

  // 底部日期
  slide.addText("2026年6月12日 - 7月20日", {
    x: 0.5, y: 5.1, w: 9, h: 0.4,
    fontSize: 16, color: colors.secondary, italic: true,
    align: "center"
  });
}

// 2. 历史性时刻
function createHistorySlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题区域
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1,
    fill: { color: colors.primary }
  });

  slide.addText("🏆 历史性时刻", {
    x: 0.5, y: 0.25, w: 9, h: 0.5,
    fontSize: 40, bold: true, color: colors.textLight,
    fontFace: "Arial Black"
  });

  // 三大亮点卡片
  const highlights = [
    {
      icon: "🌍",
      title: "首次三国联办",
      desc: "美国、加拿大、墨西哥\n联合承办世界杯\n跨越北美洲",
      color: colors.blue
    },
    {
      icon: "👥",
      title: "48支球队",
      desc: "从32队扩军到48队\n更多国家参与\n更多精彩对决",
      color: colors.red
    },
    {
      icon: "🎯",
      title: "104场比赛",
      desc: "史上最多场次\n39天足球盛宴\n16座城市同庆",
      color: colors.accent
    }
  ];

  highlights.forEach((item, idx) => {
    const xPos = 0.5 + (idx * 3.15);
    const yPos = 1.5;

    // 卡片背景
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 2.9, h: 3.2,
      fill: { color: colors.cardBg },
      shadow: makeShadow()
    });

    // 顶部彩色条
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 2.9, h: 0.15,
      fill: { color: item.color }
    });

    // 图标
    slide.addText(item.icon, {
      x: xPos, y: yPos + 0.4, w: 2.9, h: 0.8,
      fontSize: 72, align: "center"
    });

    // 标题
    slide.addText(item.title, {
      x: xPos + 0.2, y: yPos + 1.3, w: 2.5, h: 0.5,
      fontSize: 22, bold: true, color: item.color,
      align: "center"
    });

    // 描述
    slide.addText(item.desc, {
      x: xPos + 0.2, y: yPos + 1.9, w: 2.5, h: 1.1,
      fontSize: 13, color: colors.text,
      align: "center", valign: "top"
    });
  });
}

// 3. 三国联办介绍
function createHostCountriesSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: colors.primary }
  });

  slide.addText("🌎 三国联办盛事", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 36, bold: true, color: colors.textLight,
    fontFace: "Arial Black"
  });

  // 三国信息卡片
  const countries = [
    {
      flag: "🇺🇸",
      name: "美国",
      cities: "11座城市",
      matches: "60场比赛",
      highlight: "包括决赛",
      color: "1E3A8A"
    },
    {
      flag: "🇨🇦",
      name: "加拿大",
      cities: "2座城市",
      matches: "13场比赛",
      highlight: "多伦多、温哥华",
      color: "DC2626"
    },
    {
      flag: "🇲🇽",
      name: "墨西哥",
      cities: "3座城市",
      matches: "13场比赛",
      highlight: "墨西哥城、瓜达拉哈拉",
      color: "15803D"
    }
  ];

  countries.forEach((country, idx) => {
    const yPos = 1.3 + (idx * 1.35);

    // 国家卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: yPos, w: 8.4, h: 1.1,
      fill: { color: colors.cardBg },
      shadow: makeShadow()
    });

    // 左侧彩色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: yPos, w: 0.2, h: 1.1,
      fill: { color: country.color }
    });

    // 国旗
    slide.addText(country.flag, {
      x: 1.2, y: yPos + 0.15, w: 0.8, h: 0.8,
      fontSize: 56, align: "center"
    });

    // 国家名
    slide.addText(country.name, {
      x: 2.2, y: yPos + 0.25, w: 1.5, h: 0.6,
      fontSize: 28, bold: true, color: country.color
    });

    // 城市数
    slide.addText(`📍 ${country.cities}`, {
      x: 4, y: yPos + 0.3, w: 1.8, h: 0.5,
      fontSize: 16, color: colors.text
    });

    // 比赛数
    slide.addText(`⚽ ${country.matches}`, {
      x: 6, y: yPos + 0.3, w: 1.5, h: 0.5,
      fontSize: 16, color: colors.text
    });

    // 亮点
    slide.addText(`✨ ${country.highlight}`, {
      x: 7.7, y: yPos + 0.3, w: 1.3, h: 0.5,
      fontSize: 14, color: colors.accent, italic: true
    });
  });
}

// 4. 赛事数据可视化
function createStatisticsSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: colors.primary }
  });

  slide.addText("📊 赛事规模", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 36, bold: true, color: colors.textLight,
    fontFace: "Arial Black"
  });

  // 左侧大数字展示
  const bigStats = [
    { number: "48", label: "支参赛队伍", icon: "🏴" },
    { number: "104", label: "场精彩比赛", icon: "⚽" },
    { number: "16", label: "座主办城市", icon: "🏟️" }
  ];

  bigStats.forEach((stat, idx) => {
    const yPos = 1.4 + (idx * 1.25);

    // 背景卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 4, h: 1,
      fill: { color: colors.cardBg },
      shadow: makeShadow()
    });

    // 图标
    slide.addText(stat.icon, {
      x: 0.8, y: yPos + 0.15, w: 0.7, h: 0.7,
      fontSize: 48, align: "center"
    });

    // 大数字
    slide.addText(stat.number, {
      x: 1.7, y: yPos + 0.1, w: 1.5, h: 0.8,
      fontSize: 56, bold: true, color: colors.accent,
      fontFace: "Arial Black"
    });

    // 标签
    slide.addText(stat.label, {
      x: 3.3, y: yPos + 0.3, w: 1.1, h: 0.5,
      fontSize: 18, color: colors.text
    });
  });

  // 右侧信息块
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.4, w: 4, h: 3.75,
    fill: { color: colors.primary },
    shadow: makeShadow()
  });

  slide.addText("赛程安排", {
    x: 5.5, y: 1.7, w: 3.4, h: 0.5,
    fontSize: 24, bold: true, color: colors.accent
  });

  const schedule = [
    "小组赛：6月12日-28日",
    "32强赛：6月29日-7月4日",
    "16强赛：7月5日-8日",
    "1/4决赛：7月10日-12日",
    "半决赛：7月15日-16日",
    "决赛：7月20日"
  ];

  schedule.forEach((phase, idx) => {
    slide.addText(`▪ ${phase}`, {
      x: 5.7, y: 2.4 + (idx * 0.4), w: 3.2, h: 0.35,
      fontSize: 15, color: colors.textLight
    });
  });

  // 底部提示
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 4.8, w: 4, h: 0.35,
    fill: { color: colors.accent }
  });

  slide.addText("决赛地点：纽约/新泽西", {
    x: 5.2, y: 4.82, w: 4, h: 0.3,
    fontSize: 14, bold: true, color: colors.text,
    align: "center"
  });
}

// 5. 小组赛介绍
function createGroupStageSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: colors.primary }
  });

  slide.addText("🎯 小组赛阶段", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 36, bold: true, color: colors.textLight,
    fontFace: "Arial Black"
  });

  // 小组分布
  slide.addText("12个小组，每组4支球队", {
    x: 0.8, y: 1.2, w: 8.4, h: 0.4,
    fontSize: 22, bold: true, color: colors.primary
  });

  // 小组标签展示
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const groupColors = [colors.red, colors.blue, colors.accent, colors.secondary];

  groups.forEach((group, idx) => {
    const row = Math.floor(idx / 6);
    const col = idx % 6;
    const xPos = 1.2 + (col * 1.4);
    const yPos = 2 + (row * 1.5);

    // 小组圆形背景
    slide.addShape(pres.shapes.OVAL, {
      x: xPos, y: yPos, w: 1, h: 1,
      fill: { color: groupColors[idx % 4] },
      shadow: makeShadow()
    });

    // 小组字母
    slide.addText(`${group}组`, {
      x: xPos, y: yPos + 0.3, w: 1, h: 0.4,
      fontSize: 24, bold: true, color: colors.textLight,
      align: "center"
    });
  });

  // 晋级规则
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.6, w: 8.4, h: 0.9,
    fill: { color: colors.cardBg },
    line: { color: colors.accent, width: 2 }
  });

  slide.addText("晋级规则", {
    x: 1, y: 4.75, w: 8, h: 0.3,
    fontSize: 16, bold: true, color: colors.accent
  });

  slide.addText("每组前2名 + 8个成绩最好的小组第3名晋级32强淘汰赛", {
    x: 1, y: 5.05, w: 8, h: 0.3,
    fontSize: 14, color: colors.text
  });
}

// 6. 比赛场馆
function createVenuesSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: colors.primary }
  });

  slide.addText("🏟️ 比赛场馆", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 36, bold: true, color: colors.textLight,
    fontFace: "Arial Black"
  });

  // 场馆分类
  const venues = [
    {
      country: "🇺🇸 美国",
      color: "1E3A8A",
      cities: [
        "洛杉矶", "纽约/新泽西", "达拉斯", "旧金山湾区",
        "波士顿", "亚特兰大", "迈阿密", "费城",
        "西雅图", "休斯顿", "堪萨斯城"
      ]
    },
    {
      country: "🇨🇦 加拿大",
      color: "DC2626",
      cities: ["多伦多", "温哥华"]
    },
    {
      country: "🇲🇽 墨西哥",
      color: "15803D",
      cities: ["墨西哥城", "瓜达拉哈拉", "蒙特雷"]
    }
  ];

  let currentY = 1.3;

  venues.forEach((venue, idx) => {
    // 国家标题
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: currentY, w: 8.4, h: 0.5,
      fill: { color: venue.color }
    });

    slide.addText(venue.country, {
      x: 1, y: currentY + 0.05, w: 8, h: 0.4,
      fontSize: 20, bold: true, color: colors.textLight
    });

    currentY += 0.6;

    // 城市标签
    const citiesPerRow = 4;
    const rows = Math.ceil(venue.cities.length / citiesPerRow);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < citiesPerRow; col++) {
        const cityIdx = row * citiesPerRow + col;
        if (cityIdx >= venue.cities.length) break;

        const xPos = 1 + (col * 2.05);
        const yPos = currentY + (row * 0.45);

        slide.addShape(pres.shapes.RECTANGLE, {
          x: xPos, y: yPos, w: 1.9, h: 0.4,
          fill: { color: colors.cardBg },
          line: { color: venue.color, width: 1 }
        });

        slide.addText(venue.cities[cityIdx], {
          x: xPos + 0.1, y: yPos + 0.05, w: 1.7, h: 0.3,
          fontSize: 12, color: colors.text, align: "center"
        });
      }
    }

    currentY += (rows * 0.45) + 0.3;
  });
}

// 7. 赛事亮点
function createHighlightsSlide() {
  let slide = pres.addSlide();
  slide.background = { color: colors.background };

  // 标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: colors.accent }
  });

  slide.addText("✨ 赛事亮点", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 36, bold: true, color: colors.text,
    fontFace: "Arial Black"
  });

  // 亮点卡片
  const highlights = [
    {
      emoji: "🌟",
      title: "群星闪耀",
      content: "梅西、内马尔、姆巴佩等超级巨星\n可能的最后一届世界杯\n新生代球星崛起"
    },
    {
      emoji: "🔥",
      title: "激烈竞争",
      content: "48支球队同台竞技\n更多黑马机会\n传统强队对抗"
    },
    {
      emoji: "🎊",
      title: "文化盛宴",
      content: "北美三国文化交融\n多元化观赛体验\n足球嘉年华"
    },
    {
      emoji: "📺",
      title: "全球瞩目",
      content: "预计50亿观众观看\n史上最大规模世界杯\n全新观赛科技"
    }
  ];

  highlights.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = 0.7 + (col * 4.6);
    const yPos = 1.4 + (row * 1.8);

    // 卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 4.3, h: 1.5,
      fill: { color: colors.cardBg },
      shadow: makeShadow()
    });

    // Emoji图标背景
    slide.addShape(pres.shapes.OVAL, {
      x: xPos + 0.3, y: yPos + 0.2, w: 0.7, h: 0.7,
      fill: { color: colors.accent, transparency: 80 }
    });

    // Emoji
    slide.addText(item.emoji, {
      x: xPos + 0.3, y: yPos + 0.25, w: 0.7, h: 0.6,
      fontSize: 36, align: "center"
    });

    // 标题
    slide.addText(item.title, {
      x: xPos + 1.2, y: yPos + 0.3, w: 2.8, h: 0.4,
      fontSize: 22, bold: true, color: colors.primary
    });

    // 内容
    slide.addText(item.content, {
      x: xPos + 0.3, y: yPos + 0.85, w: 3.7, h: 0.6,
      fontSize: 12, color: colors.text, valign: "top"
    });
  });
}

// 8. 结束页 - 期待
function createEndSlide() {
  let slide = pres.addSlide();

  // 渐变背景效果
  slide.background = { color: colors.primary };

  // 顶部装饰
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.5,
    fill: { color: colors.accent }
  });

  // 大奖杯
  slide.addText("🏆", {
    x: 0.5, y: 1.3, w: 9, h: 1.2,
    fontSize: 96, align: "center"
  });

  // 主标题
  slide.addText("让我们共同期待", {
    x: 0.5, y: 2.7, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: colors.textLight,
    align: "center", fontFace: "Arial Black"
  });

  // 副标题
  slide.addText("2026年FIFA世界杯", {
    x: 0.5, y: 3.5, w: 9, h: 0.6,
    fontSize: 32, color: colors.accent,
    align: "center", bold: true
  });

  // 足球装饰
  slide.addText("⚽  ⚽  ⚽", {
    x: 0.5, y: 4.3, w: 9, h: 0.4,
    fontSize: 28, align: "center"
  });

  // 底部标语
  slide.addText("足球，连接世界", {
    x: 0.5, y: 4.9, w: 9, h: 0.4,
    fontSize: 18, color: colors.secondary,
    align: "center", italic: true
  });
}

// 生成所有幻灯片
console.log("正在生成2026世界杯介绍PPT...");

createCoverSlide();
createHistorySlide();
createHostCountriesSlide();
createStatisticsSlide();
createGroupStageSlide();
createVenuesSlide();
createHighlightsSlide();
createEndSlide();

// 保存文件
pres.writeFile({ fileName: "2026世界杯介绍.pptx" })
  .then(() => {
    console.log("✅ PPT生成成功: 2026世界杯介绍.pptx");
  })
  .catch(err => {
    console.error("❌ 生成失败:", err);
  });
