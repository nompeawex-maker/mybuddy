from PIL import Image, ImageDraw, ImageFont, ImageFilter


OUT = "assets/line-confirm-old.png"
W, H = 1080, 2400


def font(path, size):
    return ImageFont.truetype(path, size)


FONT = "C:/Windows/Fonts/tahoma.ttf"
FONT_BOLD = "C:/Windows/Fonts/tahomabd.ttf"


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def centered(draw, box, text, fnt, fill, spacing=10):
    lines = wrap_text(draw, text, fnt, box[2] - box[0])
    total = sum(draw.textbbox((0, 0), line, font=fnt)[3] for line in lines) + spacing * (len(lines) - 1)
    y = box[1] + ((box[3] - box[1]) - total) / 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=fnt)
        x = box[0] + ((box[2] - box[0]) - (bbox[2] - bbox[0])) / 2
        draw.text((x, y), line, font=fnt, fill=fill)
        y += (bbox[3] - bbox[1]) + spacing


def wrap_text(draw, text, fnt, max_width):
    words = text.split(" ")
    lines = []
    current = ""
    for word in words:
        trial = word if not current else current + " " + word
        if draw.textlength(trial, font=fnt) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


img = Image.new("RGB", (W, H), "#eaf5ff")
px = img.load()
for y in range(H):
    t = y / (H - 1)
    if t < 0.55:
        u = t / 0.55
        top = (232, 255, 243)
        mid = (234, 245, 255)
        c = tuple(int(top[i] * (1 - u) + mid[i] * u) for i in range(3))
    else:
        u = (t - 0.55) / 0.45
        mid = (234, 245, 255)
        bot = (247, 251, 255)
        c = tuple(int(mid[i] * (1 - u) + bot[i] * u) for i in range(3))
    for x in range(W):
        px[x, y] = c

shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow)
sd.rounded_rectangle((70, 245, 1010, 2165), radius=76, fill=(30, 76, 120, 52))
shadow = shadow.filter(ImageFilter.GaussianBlur(34))
img = Image.alpha_composite(img.convert("RGBA"), shadow)
draw = ImageDraw.Draw(img)

card = (70, 230, 1010, 2140)
rounded(draw, card, 76, "#ffffff")

draw.rectangle((70, 230, 1010, 390), fill="#ffffff")
draw.line((70, 390, 1010, 390), fill="#e5edf5", width=2)
rounded(draw, (112, 263, 204, 355), 46, "#ecfff4")
draw.text((139, 258), "‹", font=font(FONT_BOLD, 82), fill="#06c755")
centered(draw, (250, 260, 830, 355), "LINE Login", font(FONT_BOLD, 48), "#132033")

# brand row
rounded(draw, (247, 500, 415, 668), 50, "#06c755")
centered(draw, (247, 500, 415, 668), "LINE", font(FONT_BOLD, 40), "#ffffff")
centered(draw, (440, 520, 535, 648), "→", font(FONT_BOLD, 66), "#9aa8ba")
rounded(draw, (565, 500, 733, 668), 50, "#168cff")

# simple white heart mark
heart_layer = Image.new("RGBA", (168, 168), (0, 0, 0, 0))
hd = ImageDraw.Draw(heart_layer)
hd.ellipse((36, 38, 88, 90), fill="#ffffff")
hd.ellipse((80, 38, 132, 90), fill="#ffffff")
hd.polygon([(34, 72), (134, 72), (84, 132)], fill="#ffffff")
img.alpha_composite(heart_layer, (565, 500))
draw = ImageDraw.Draw(img)
draw.text((680, 604), "+", font=font(FONT_BOLD, 56), fill="#ffffff")

title = "อนุญาตให้ MyBuddy+ เข้าสู่ระบบด้วย LINE"
centered(draw, (125, 750, 955, 930), title, font(FONT_BOLD, 58), "#101828", spacing=16)
body = "MyBuddy+ จะใช้ข้อมูลพื้นฐานจากบัญชี LINE เพื่อเข้าสู่ระบบและดูแลประสบการณ์ของคุณให้ต่อเนื่อง"
centered(draw, (140, 945, 940, 1130), body, font(FONT_BOLD, 36), "#667085", spacing=14)

list_box = (125, 1185, 955, 1508)
rounded(draw, list_box, 48, "#f4fbf7")
items = [
    "ชื่อโปรไฟล์และรูปโปรไฟล์",
    "ใช้สำหรับยืนยันตัวตนในแอป",
    "ไม่โพสต์ข้อความแทนคุณ",
]
y = 1234
for text in items:
    draw.ellipse((166, y, 224, y + 58), fill="#06c755")
    centered(draw, (166, y - 2, 224, y + 58), "✓", font(FONT_BOLD, 34), "#ffffff")
    draw.text((255, y + 4), text, font=font(FONT_BOLD, 36), fill="#344054")
    y += 98

rounded(draw, (125, 1595, 955, 1734), 42, "#06c755")
centered(draw, (125, 1595, 955, 1734), "อนุญาตและเข้าสู่ระบบ", font(FONT_BOLD, 46), "#ffffff")
rounded(draw, (125, 1780, 955, 1918), 42, "#ffffff", outline="#dbeafe", width=4)
centered(draw, (125, 1780, 955, 1918), "ยกเลิก", font(FONT_BOLD, 46), "#075adf")

img.convert("RGB").save(OUT, quality=95)
print(OUT)
