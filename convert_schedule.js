// 转换世界杯赛程数据的脚本
const fs = require('fs');

// 国家名中文翻译
const countryNames = {
    'Mexico': '墨西哥',
    'South Africa': '南非',
    'South Korea': '韩国',
    'Czech Republic': '捷克',
    'Canada': '加拿大',
    'Bosnia & Herzegovina': '波黑',
    'Qatar': '卡塔尔',
    'Switzerland': '瑞士',
    'Brazil': '巴西',
    'Morocco': '摩洛哥',
    'Haiti': '海地',
    'Scotland': '苏格兰',
    'USA': '美国',
    'Paraguay': '巴拉圭',
    'Australia': '澳大利亚',
    'Turkey': '土耳其',
    'Germany': '德国',
    'Curaçao': '库拉索',
    'Ivory Coast': '科特迪瓦',
    'Ecuador': '厄瓜多尔',
    'Netherlands': '荷兰',
    'Japan': '日本',
    'Sweden': '瑞典',
    'Tunisia': '突尼斯',
    'Belgium': '比利时',
    'Egypt': '埃及',
    'Iran': '伊朗',
    'New Zealand': '新西兰',
    'Spain': '西班牙',
    'Cape Verde': '佛得角',
    'Saudi Arabia': '沙特阿拉伯',
    'Uruguay': '乌拉圭',
    'France': '法国',
    'Senegal': '塞内加尔',
    'Iraq': '伊拉克',
    'Norway': '挪威',
    'Argentina': '阿根廷',
    'Algeria': '阿尔及利亚',
    'Austria': '奥地利',
    'Jordan': '约旦',
    'Portugal': '葡萄牙',
    'DR Congo': '刚果民主共和国',
    'Uzbekistan': '乌兹别克斯坦',
    'Colombia': '哥伦比亚',
    'England': '英格兰',
    'Croatia': '克罗地亚',
    'Ghana': '加纳',
    'Panama': '巴拿马'
};

// 国家名到国旗emoji的映射
const countryFlags = {
    'Mexico': '🇲🇽',
    'South Africa': '🇿🇦',
    'South Korea': '🇰🇷',
    'Czech Republic': '🇨🇿',
    'Canada': '🇨🇦',
    'Bosnia & Herzegovina': '🇧🇦',
    'Qatar': '🇶🇦',
    'Switzerland': '🇨🇭',
    'Brazil': '🇧🇷',
    'Morocco': '🇲🇦',
    'Haiti': '🇭🇹',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'USA': '🇺🇸',
    'Paraguay': '🇵🇾',
    'Australia': '🇦🇺',
    'Turkey': '🇹🇷',
    'Germany': '🇩🇪',
    'Curaçao': '🇨🇼',
    'Ivory Coast': '🇨🇮',
    'Ecuador': '🇪🇨',
    'Netherlands': '🇳🇱',
    'Japan': '🇯🇵',
    'Sweden': '🇸🇪',
    'Tunisia': '🇹🇳',
    'Belgium': '🇧🇪',
    'Egypt': '🇪🇬',
    'Iran': '🇮🇷',
    'New Zealand': '🇳🇿',
    'Spain': '🇪🇸',
    'Cape Verde': '🇨🇻',
    'Saudi Arabia': '🇸🇦',
    'Uruguay': '🇺🇾',
    'France': '🇫🇷',
    'Senegal': '🇸🇳',
    'Iraq': '🇮🇶',
    'Norway': '🇳🇴',
    'Argentina': '🇦🇷',
    'Algeria': '🇩🇿',
    'Austria': '🇦🇹',
    'Jordan': '🇯🇴',
    'Portugal': '🇵🇹',
    'DR Congo': '🇨🇩',
    'Uzbekistan': '🇺🇿',
    'Colombia': '🇨🇴',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Croatia': '🇭🇷',
    'Ghana': '🇬🇭',
    'Panama': '🇵🇦'
};

// 场馆中文翻译
const venueNames = {
    'Mexico City': '墨西哥城',
    'Guadalajara (Zapopan)': '瓜达拉哈拉',
    'Toronto': '多伦多',
    'Los Angeles (Inglewood)': '洛杉矶',
    'San Francisco Bay Area (Santa Clara)': '旧金山湾区',
    'Vancouver': '温哥华',
    'New York/New Jersey (East Rutherford)': '纽约/新泽西',
    'Boston (Foxborough)': '波士顿',
    'Seattle': '西雅图',
    'Atlanta': '亚特兰大',
    'Houston': '休斯顿',
    'Dallas (Arlington)': '达拉斯',
    'Monterrey (Guadalupe)': '蒙特雷',
    'Kansas City': '堪萨斯城',
    'Miami (Miami Gardens)': '迈阿密',
    'Philadelphia': '费城'
};

// 将UTC时间转换为北京时间
function convertToBeijingTime(dateStr, timeStr) {
    // 解析时间字符串，例如 "13:00 UTC-6"
    const timeMatch = timeStr.match(/(\d+):(\d+)\s+UTC([+-]\d+)/);
    if (!timeMatch) return '待定';

    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const utcOffset = parseInt(timeMatch[3]);

    // 北京时间是 UTC+8
    const beijingOffset = 8;
    const hourDiff = beijingOffset - utcOffset;

    const date = new Date(dateStr + 'T00:00:00');
    date.setHours(hours + hourDiff);
    date.setMinutes(minutes);

    // 格式化为 HH:MM
    const bjHours = date.getHours().toString().padStart(2, '0');
    const bjMinutes = date.getMinutes().toString().padStart(2, '0');

    return `${bjHours}:${bjMinutes}`;
}

// 获取赛事阶段标识
function getStage(round) {
    if (round.includes('Matchday')) return 'group';
    if (round === 'Round of 32') return 'round32';
    if (round === 'Round of 16') return 'round16';
    if (round === 'Quarter-final') return 'quarter';
    if (round === 'Semi-final') return 'semi';
    if (round === 'Match for third place') return 'third';
    if (round === 'Final') return 'final';
    return 'group';
}

// 获取中文小组名
function getChineseGroup(group) {
    if (!group) return '';
    if (group.startsWith('Group ')) {
        return group.replace('Group ', '') + '组';
    }
    if (group === 'Round of 32') return '32强赛';
    if (group === 'Round of 16') return '16强赛';
    if (group === 'Quarter-final') return '1/4决赛';
    if (group === 'Semi-final') return '半决赛';
    if (group === 'Match for third place') return '三四名决赛';
    if (group === 'Final') return '决赛';
    return group;
}

// 读取JSON文件
const jsonData = JSON.parse(fs.readFileSync('worldcup2026.json', 'utf8'));

// 转换数据
const scheduleData = jsonData.matches.map(match => {
    const homeTeamName = countryNames[match.team1] || match.team1;
    const awayTeamName = countryNames[match.team2] || match.team2;
    const homeTeam = countryFlags[match.team1] ? `${countryFlags[match.team1]} ${homeTeamName}` : homeTeamName;
    const awayTeam = countryFlags[match.team2] ? `${countryFlags[match.team2]} ${awayTeamName}` : awayTeamName;
    const time = match.time ? convertToBeijingTime(match.date, match.time) : '待定';
    const stage = getStage(match.round);
    const venue = venueNames[match.ground] || match.ground;
    const group = getChineseGroup(match.group || match.round);

    return {
        date: match.date,
        time: time,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        venue: venue,
        group: group,
        stage: stage,
        score: match.score ? `${match.score.ft[0]}-${match.score.ft[1]}` : null
    };
});

// 输出JavaScript数组格式
console.log('const scheduleData = ' + JSON.stringify(scheduleData, null, 4) + ';');
