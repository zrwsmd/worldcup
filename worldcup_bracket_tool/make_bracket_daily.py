# -*- coding: utf-8 -*-
"""
2026世界杯淘汰赛对阵图 - 每日自动更新脚本
=========================================

功能：
  1. 从 openfootball/worldcup.json 拉取最新赛程与比分数据
  2. 自动解析占位符（如 "W74" 表示"第74场胜者"），如果该场比赛已结束，
     自动替换为真实晋级球队名称
  3. 重新生成一份精美的淘汰赛对阵图 PDF，文件名带日期，存放在 output/ 目录下

使用方法：
  1. 确保已安装 Python 3 和依赖库：
       pip install reportlab requests
  2. 将本脚本和同目录下的 WQYZenHei.ttf 字体文件放在一起，不要分开
  3. 直接运行：
       python make_bracket_daily.py
  4. 想要每天自动跑，可以用系统的定时任务：
       Windows: 任务计划程序（Task Scheduler）设置每天执行
                python make_bracket_daily.py
       Mac/Linux: crontab 加一行，例如每天早上8点跑一次
                0 8 * * * /usr/bin/python3 /path/to/make_bracket_daily.py

输出：
  output/2026世界杯淘汰赛对阵图_YYYY-MM-DD.pdf
"""

import json
import os
import sys
import math
import datetime
import urllib.request

# ---------- 依赖检查 ----------
try:
    from reportlab.lib.colors import HexColor
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas
except ImportError:
    print("缺少 reportlab 库，请先运行: pip install reportlab")
    sys.exit(1)

# ---------- 路径配置 ----------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_PATH = os.path.join(SCRIPT_DIR, "WQYZenHei.ttf")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")
DATA_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
DATA_CACHE_PATH = os.path.join(SCRIPT_DIR, "worldcup2026_cache.json")

if not os.path.exists(FONT_PATH):
    print(f"找不到字体文件: {FONT_PATH}")
    print("请将 WQYZenHei.ttf 放在脚本同一目录下。")
    sys.exit(1)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------- 数据获取 ----------
def fetch_latest_data():
    """从 GitHub 拉取最新赛程数据；失败则尝试使用本地缓存。"""
    try:
        req = urllib.request.Request(
            DATA_URL,
            headers={"User-Agent": "Mozilla/5.0 (WorldCupBracketBot/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read()
        data = json.loads(raw)
        # 缓存一份，以防下次网络失败时还能用旧数据兜底
        with open(DATA_CACHE_PATH, "wb") as f:
            f.write(raw)
        print("✓ 已从网络获取最新赛程数据")
        return data
    except Exception as e:
        print(f"⚠ 网络获取失败（{e}），尝试使用本地缓存...")
        if os.path.exists(DATA_CACHE_PATH):
            with open(DATA_CACHE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            print("✓ 已使用本地缓存数据（可能不是最新）")
            return data
        else:
            print("✗ 没有可用的本地缓存，脚本无法继续。请检查网络连接。")
            sys.exit(1)


# ---------- 中文队名映射 ----------
FLAGS_CN = {
    'South Africa': '南非', 'Canada': '加拿大', 'Germany': '德国', 'Paraguay': '巴拉圭',
    'Netherlands': '荷兰', 'Morocco': '摩洛哥', 'Brazil': '巴西', 'Japan': '日本',
    'France': '法国', 'Sweden': '瑞典', 'Ivory Coast': '科特迪瓦', 'Norway': '挪威',
    'Mexico': '墨西哥', 'Ecuador': '厄瓜多尔', 'England': '英格兰', 'DR Congo': '刚果(金)',
    'USA': '美国', 'Bosnia & Herzegovina': '波黑', 'Belgium': '比利时', 'Senegal': '塞内加尔',
    'Portugal': '葡萄牙', 'Croatia': '克罗地亚', 'Spain': '西班牙', 'Austria': '奥地利',
    'Switzerland': '瑞士', 'Algeria': '阿尔及利亚', 'Argentina': '阿根廷', 'Cape Verde': '佛得角',
    'Colombia': '哥伦比亚', 'Ghana': '加纳', 'Australia': '澳大利亚', 'Egypt': '埃及',
    'Serbia': '塞尔维亚', 'Ukraine': '乌克兰', 'Poland': '波兰', 'Romania': '罗马尼亚',
    'Chile': '智利', 'Venezuela': '委内瑞拉', 'Honduras': '洪都拉斯', 'Costa Rica': '哥斯达黎加',
    'Cameroon': '喀麦隆', 'Nigeria': '尼日利亚', 'Mali': '马里', 'Congo DR': '刚果(金)',
    'Indonesia': '印度尼西亚', 'Saudi Arabia': '沙特阿拉伯', 'Iraq': '伊拉克', 'Oman': '阿曼',
    'Qatar': '卡塔尔', 'Uruguay': '乌拉圭', 'Jordan': '约旦', 'Uzbekistan': '乌兹别克斯坦',
    'New Zealand': '新西兰', 'Haiti': '海地', 'Turkey': '土耳其', 'Tunisia': '突尼斯',
    'Iran': '伊朗', 'Cape Verde Islands': '佛得角',
}


def cn_name(team):
    """英文队名转中文，找不到就原样返回。"""
    return FLAGS_CN.get(team, team)


def fmt_date(datestr):
    y, mo, d = datestr.split('-')
    return f"{int(mo)}月{int(d)}日"


def match_winner(m):
    """
    判断一场比赛的胜者英文队名。
    没有比分或者还没出结果，返回 None。
    """
    score = m.get('score')
    if not score:
        return None
    team1, team2 = m.get('team1'), m.get('team2')
    if not team1 or not team2:
        return None
    # 占位符还没解析出真实队伍，无法判断胜者
    if (team1.startswith('W') and team1[1:].isdigit()) or \
       (team1.startswith('L') and team1[1:].isdigit()) or \
       (team2.startswith('W') and team2[1:].isdigit()) or \
       (team2.startswith('L') and team2[1:].isdigit()):
        return None

    # 点球大战
    if 'p' in score:
        p1, p2 = score['p']
        return team1 if p1 > p2 else team2
    # 加时赛
    if 'et' in score:
        e1, e2 = score['et']
        if e1 != e2:
            return team1 if e1 > e2 else team2
    # 常规时间
    if 'ft' in score:
        f1, f2 = score['ft']
        if f1 != f2:
            return team1 if f1 > f2 else team2
    return None


def match_loser(m):
    """判断负者（用于季军赛 L101/L102 占位符解析）。"""
    winner = match_winner(m)
    if winner is None:
        return None
    team1, team2 = m.get('team1'), m.get('team2')
    return team2 if winner == team1 else team1


def resolve_placeholders(matches_by_num):
    """
    多轮遍历，把 'W74'/'L101' 这种占位符替换成真实队名（如果对应场次已结束）。
    由于淘汰赛是分层结构，胜者会一层层往后传，所以要循环多次直到不再变化。
    """
    changed = True
    rounds = 0
    while changed and rounds < 10:
        changed = False
        rounds += 1
        for num, m in matches_by_num.items():
            for key in ('team1', 'team2'):
                val = m.get(key)
                if not val:
                    continue
                if val.startswith('W') and val[1:].isdigit():
                    ref_num = int(val[1:])
                    ref_match = matches_by_num.get(ref_num)
                    if ref_match:
                        winner = match_winner(ref_match)
                        if winner:
                            m[key] = winner
                            changed = True
                elif val.startswith('L') and val[1:].isdigit():
                    ref_num = int(val[1:])
                    ref_match = matches_by_num.get(ref_num)
                    if ref_match:
                        loser = match_loser(ref_match)
                        if loser:
                            m[key] = loser
                            changed = True
    return matches_by_num


def team_label(team, num, slot):
    """
    返回用于显示的队伍标签。
    team: 当前字段值（可能已经被解析成真实队名，也可能还是占位符）
    num: 当前比赛编号（仅用于兜底显示）
    slot: 'team1' 或 'team2'，决定占位符提示文字
    """
    if team is None:
        return '待定'
    if team.startswith('W') and team[1:].isdigit():
        return f'第{team[1:]}场胜者'
    if team.startswith('L') and team[1:].isdigit():
        return f'第{team[1:]}场负者'
    return cn_name(team)


def match_score_str(m):
    sc = m.get('score')
    if not sc:
        return None, None, None  # (sc1, sc2, note)
    sc1 = sc2 = note = None
    if 'ft' in sc:
        sc1, sc2 = sc['ft']
    if 'et' in sc and ('ft' not in sc or sc['et'] != sc.get('ft')):
        sc1, sc2 = sc['et']
        note = '加时'
    if 'p' in sc:
        p1, p2 = sc['p']
        note = f"点球 {p1}-{p2}"
    return sc1, sc2, note


def is_match_done(m):
    return match_winner(m) is not None or (m.get('score') and 'ft' in m.get('score', {}))


# ============================================================
#                       PDF 绘制部分
# ============================================================

def build_pdf(bracket, output_path, data_as_of_date):
    pdfmetrics.registerFont(TTFont('NotoSC', FONT_PATH))
    pdfmetrics.registerFont(TTFont('NotoSC-Bold', FONT_PATH))

    PAGE_W, PAGE_H = 1600, 950
    c = canvas.Canvas(output_path, pagesize=(PAGE_W, PAGE_H))

    BG1 = (10, 77, 46)
    BG2 = (15, 92, 53)
    GOLD = HexColor('#ffd700')
    GOLD_LIGHT = HexColor('#ffed4e')
    WHITE = HexColor('#ffffff')
    CARD_BG = HexColor('#14633c')
    CARD_BORDER = HexColor('#2e8b57')
    DONE_BORDER = HexColor('#ffd700')
    TEXT_GRAY = HexColor('#cfe8d8')
    LINE_COLOR = HexColor('#5fae7a')

    def draw_bg():
        steps = 60
        for i in range(steps):
            t = i / steps
            factor = math.sin(t * math.pi) * 0.5 + 0.5
            r = BG1[0] + (BG2[0]-BG1[0])*factor
            g = BG1[1] + (BG2[1]-BG1[1])*factor
            b = BG1[2] + (BG2[2]-BG1[2])*factor
            c.setFillColorRGB(r/255, g/255, b/255)
            y0 = PAGE_H * i / steps
            c.rect(0, y0, PAGE_W, PAGE_H/steps + 1, fill=1, stroke=0)

    draw_bg()

    # 标题
    c.setFont('NotoSC-Bold', 34)
    c.setFillColor(GOLD)
    c.drawCentredString(PAGE_W/2, PAGE_H - 50, "2026年世界杯 淘汰赛对阵图")

    c.setFont('NotoSC', 14)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W/2, PAGE_H - 75,
                         f"数据截至 {data_as_of_date} · 数据来源 openfootball/worldcup.json")

    # 图例
    leg_y = PAGE_H - 105
    c.setFont('NotoSC', 11)
    c.setFillColor(CARD_BG)
    c.setStrokeColor(DONE_BORDER)
    c.setLineWidth(1.6)
    c.roundRect(PAGE_W/2 - 190, leg_y-9, 16, 16, 3, fill=1, stroke=1)
    c.setFillColor(WHITE)
    c.drawString(PAGE_W/2 - 168, leg_y-5, "已结束比赛")

    c.setFillColor(CARD_BG)
    c.setStrokeColor(CARD_BORDER)
    c.setLineWidth(1.0)
    c.roundRect(PAGE_W/2 - 60, leg_y-9, 16, 16, 3, fill=1, stroke=1)
    c.setFillColor(WHITE)
    c.drawString(PAGE_W/2 - 38, leg_y-5, "未开始 / 待定对阵")

    TOP_MARGIN = 180
    BOTTOM_MARGIN = 40
    CARD_W = 168
    CARD_H = 54

    col_x = {}
    col_width = 190
    start_x_left = 40
    for i in range(5):
        col_x[i] = start_x_left + i*col_width + CARD_W/2
    final_x = col_x[4]
    col_x_right = {i: PAGE_W - (start_x_left + i*col_width + CARD_W/2) for i in range(4)}

    usable_h = PAGE_H - TOP_MARGIN - BOTTOM_MARGIN

    def draw_match_card(cx, cy, m, w=CARD_W, h=CARD_H):
        t1, t2 = m.get('team1'), m.get('team2')
        num = m['_num']
        l1 = team_label(t1, num, 'team1')
        l2 = team_label(t2, num, 'team2')
        sc1, sc2, note = match_score_str(m)
        done = sc1 is not None

        x0, y0 = cx - w/2, cy - h/2
        border = DONE_BORDER if done else CARD_BORDER
        c.setFillColor(CARD_BG)
        c.setStrokeColor(border)
        c.setLineWidth(1.6 if done else 1.0)
        c.roundRect(x0, y0, w, h, 6, fill=1, stroke=1)

        c.setFont('NotoSC', 7)
        c.setFillColor(TEXT_GRAY)
        c.drawString(x0+5, y0+h-9, f"第{num}场")
        c.drawRightString(x0+w-5, y0+h-9, fmt_date(m['date']))

        row1_y, row2_y = y0 + h - 23, y0 + 8

        def fit(s, maxlen=11):
            return s if len(s) <= maxlen else s[:maxlen-1] + '…'

        c.setFont('NotoSC', 10.5)
        c.setFillColor(WHITE)
        c.drawString(x0+8, row1_y, fit(l1))
        c.drawString(x0+8, row2_y, fit(l2))

        if done:
            c.setFont('NotoSC-Bold', 11)
            c.setFillColor(GOLD)
            c.drawRightString(x0+w-8, row1_y, str(sc1))
            c.drawRightString(x0+w-8, row2_y, str(sc2))
        else:
            c.setFont('NotoSC', 9)
            c.setFillColor(TEXT_GRAY)
            c.drawRightString(x0+w-8, row1_y, '-')
            c.drawRightString(x0+w-8, row2_y, '-')

        if note:
            c.setFont('NotoSC', 7)
            c.setFillColor(GOLD_LIGHT)
            c.drawCentredString(cx, y0 - 9, note)

    def connector(x1, y1, x2, y2):
        c.setStrokeColor(LINE_COLOR)
        c.setLineWidth(1.2)
        midx = (x1+x2)/2
        c.line(x1, y1, midx, y1)
        c.line(midx, y1, midx, y2)
        c.line(midx, y2, x2, y2)

    r32 = bracket['Round of 32']
    r16 = bracket['Round of 16']
    qf = bracket['Quarter-final']
    sf = bracket['Semi-final']
    final = bracket['Final'][0]
    third = bracket['Match for third place'][0]

    left_r32, right_r32 = r32[0:8], r32[8:16]
    left_r16, right_r16 = r16[0:4], r16[4:8]
    left_qf, right_qf = qf[0:2], qf[2:4]
    left_sf, right_sf = sf[0], sf[1]

    n = 8
    slot_h = usable_h / n
    y_positions_r32 = [PAGE_H - BOTTOM_MARGIN - slot_h*(i+0.5) for i in range(n)]

    for i, m in enumerate(left_r32):
        draw_match_card(col_x[0], y_positions_r32[i], m)
    for i, m in enumerate(right_r32):
        draw_match_card(col_x_right[0], y_positions_r32[i], m)

    def pair_y(positions):
        return [(positions[2*i]+positions[2*i+1])/2 for i in range(len(positions)//2)]

    y_r16 = pair_y(y_positions_r32)
    for i, m in enumerate(left_r16):
        connector(col_x[0]+CARD_W/2, y_positions_r32[2*i], col_x[1]-CARD_W/2, y_r16[i])
        connector(col_x[0]+CARD_W/2, y_positions_r32[2*i+1], col_x[1]-CARD_W/2, y_r16[i])
        draw_match_card(col_x[1], y_r16[i], m)
    for i, m in enumerate(right_r16):
        connector(col_x_right[0]-CARD_W/2, y_positions_r32[2*i], col_x_right[1]+CARD_W/2, y_r16[i])
        connector(col_x_right[0]-CARD_W/2, y_positions_r32[2*i+1], col_x_right[1]+CARD_W/2, y_r16[i])
        draw_match_card(col_x_right[1], y_r16[i], m)

    y_qf = pair_y(y_r16)
    for i, m in enumerate(left_qf):
        connector(col_x[1]+CARD_W/2, y_r16[2*i], col_x[2]-CARD_W/2, y_qf[i])
        connector(col_x[1]+CARD_W/2, y_r16[2*i+1], col_x[2]-CARD_W/2, y_qf[i])
        draw_match_card(col_x[2], y_qf[i], m)
    for i, m in enumerate(right_qf):
        connector(col_x_right[1]-CARD_W/2, y_r16[2*i], col_x_right[2]+CARD_W/2, y_qf[i])
        connector(col_x_right[1]-CARD_W/2, y_r16[2*i+1], col_x_right[2]+CARD_W/2, y_qf[i])
        draw_match_card(col_x_right[2], y_qf[i], m)

    y_sf = pair_y(y_qf)
    connector(col_x[2]+CARD_W/2, y_qf[0], col_x[3]-CARD_W/2, y_sf[0])
    connector(col_x[2]+CARD_W/2, y_qf[1], col_x[3]-CARD_W/2, y_sf[0])
    draw_match_card(col_x[3], y_sf[0], left_sf)

    connector(col_x_right[2]-CARD_W/2, y_qf[0], col_x_right[3]+CARD_W/2, y_sf[0])
    connector(col_x_right[2]-CARD_W/2, y_qf[1], col_x_right[3]+CARD_W/2, y_sf[0])
    draw_match_card(col_x_right[3], y_sf[0], right_sf)

    final_y = y_sf[0]
    connector(col_x[3]+CARD_W/2, y_sf[0], final_x-(CARD_W+20)/2, final_y)
    connector(col_x_right[3]-CARD_W/2, y_sf[0], final_x+(CARD_W+20)/2, final_y)
    draw_match_card(final_x, final_y, final, w=CARD_W+20, h=CARD_H+12)

    c.setFont('NotoSC-Bold', 13)
    c.setFillColor(GOLD)
    c.drawCentredString(final_x, final_y + CARD_H/2 + 28, "🏆 决赛")

    third_y = final_y - 140
    draw_match_card(final_x, third_y, third)
    c.setFont('NotoSC', 11)
    c.setFillColor(TEXT_GRAY)
    c.drawCentredString(final_x, third_y + CARD_H/2 + 14, "季军赛")

    round_labels = ['32强赛', '16强赛', '8强赛', '半决赛']
    label_y = PAGE_H - 95
    for i in range(4):
        c.setFont('NotoSC-Bold', 13)
        c.setFillColor(GOLD_LIGHT)
        c.drawCentredString(col_x[i], label_y, round_labels[i])
        c.drawCentredString(col_x_right[i], label_y, round_labels[i])
        c.setStrokeColor(GOLD_LIGHT)
        c.setLineWidth(1)
        lw = 50
        c.line(col_x[i]-lw/2, label_y-8, col_x[i]+lw/2, label_y-8)
        c.line(col_x_right[i]-lw/2, label_y-8, col_x_right[i]+lw/2, label_y-8)

    c.setFont('NotoSC', 9)
    c.setFillColor(TEXT_GRAY)
    c.drawCentredString(PAGE_W/2, 18, "注：'第N场胜者/负者' 表示该位置由对应场次比赛结果决定，尚未产生具体球队")

    c.showPage()
    c.save()


# ============================================================
#                          主流程
# ============================================================

def main():
    today_str = datetime.date.today().strftime('%Y-%m-%d')
    print(f"=== 2026世界杯淘汰赛对阵图 自动更新 ({today_str}) ===")

    data = fetch_latest_data()
    matches = data['matches']
    for i, m in enumerate(matches, 1):
        m['_num'] = i

    matches_by_num = {m['_num']: m for m in matches}
    resolve_placeholders(matches_by_num)

    KO_ROUNDS = ['Round of 32', 'Round of 16', 'Quarter-final',
                 'Semi-final', 'Match for third place', 'Final']
    bracket = {r: [m for m in matches if m.get('round') == r] for r in KO_ROUNDS}

    missing = [r for r in KO_ROUNDS if len(bracket[r]) == 0]
    if missing:
        print(f"⚠ 警告：以下轮次数据为空（可能赛程尚未排出）: {missing}")

    output_filename = f"2026世界杯淘汰赛对阵图_{today_str}.pdf"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    build_pdf(bracket, output_path, today_str)

    print(f"✓ PDF 已生成: {output_path}")

    # 统计一下目前进度，方便确认数据是否在更新
    done_count = sum(1 for r in KO_ROUNDS for m in bracket[r] if is_match_done(m))
    total_count = sum(len(bracket[r]) for r in KO_ROUNDS)
    print(f"  当前已结束比赛: {done_count} / {total_count}")


if __name__ == "__main__":
    main()
