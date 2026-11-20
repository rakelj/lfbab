# Make one Excel file per language for the translation agency, from the text
# sheet. Usage (the sheet fetched as JSON, see README "Text sync"):
#   python3 scripts/export-xlsx.py <sheet.json> <out-dir>
# Leaves out retired rows (IKKE I BRUK), texts shown to staff in Norwegian
# only, values that are not translated, and demo-only texts. The Key column
# must not be changed: it is how the translations find their way back.
import json, re, sys, os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.protection import SheetProtection

LANGS = {
    'en': ('English', False), 'ar': ('Arabic', True), 'prs': ('Dari', True), 'fa': ('Farsi (Persian)', True),
    'ps': ('Pashto', True), 'ru': ('Russian', False), 'so': ('Somali', False), 'es': ('Spanish (Latin America)', False),
    'ti': ('Tigrinya', False), 'tr': ('Turkish', False), 'uk': ('Ukrainian', False),
}
SECTIONS = [
    ('common', 'Buttons and labels'), ('lang', 'Language screen'), ('nav', 'Buttons and labels'), ('sound', 'Read-aloud'),
    ('film', 'Intro film'), ('intro', 'Introduction'), ('orgchart', 'Introduction: drawing of who is responsible'),
    ('hub', 'Topic overview'), ('help', 'Help window ("Do you need help?")'), ('staff', 'Show to staff'),
    ('q', 'Questions (shared)'), ('step', 'Shared'), ('rights', 'Shared'), ('ch1', 'Topic: Your representative'),
    ('ch2', 'Topic: Body and mind'), ('ch3', 'Topic: What do you like to do?'), ('activity', 'Topic: What do you like to do?'),
    ('story', 'The two stories (Hamlin and Elias)'), ('emotion', 'Emotion cards'), ('actor', 'Actor cards'),
    ('helpers', 'Who can help me?'), ('game', 'Practice: who can help?'), ('x.centre', 'Topic: Your rights at the reception centre'),
    ('x.money', 'Topic: Money and school'), ('x.safety', 'Topic: Safety'), ('x.cws', 'Topic: Child welfare'),
    ('x.complain', 'Topic: How to complain'), ('closing', 'Closing screen'), ('about', 'About the app'), ('footer', 'Footer'),
]

def section(key):
    for prefix, name in SECTIONS:
        if key == prefix or key.startswith(prefix + '.'):
            return name
    return 'Other'

def skip(key, ctx):
    return (ctx.startswith('IKKE I BRUK') or re.search(r'NORWEGIAN only|Do not translate|same in all languages', ctx, re.I)
            or key.startswith('settings.'))

def clean(ctx):
    return re.sub(r'^(DRAFT, needs LFB review\.?|PLACEHOLDER,? ?)\s*', '', ctx).strip()

INSTRUCTIONS = [
    ('About the app', 'A free, anonymous web app for young people aged 15–18 who live alone at asylum reception centres in Norway, made by Landsforeningen for barnevernsbarn (LFB). It explains their rights and who can help them.'),
    ('What to translate', 'Translate the Norwegian text in column D into the language column (yellow). Everything has been approved by LFB in Norwegian.'),
    ('Do not change', 'Do not change the Key column or the order of the rows. The key is how the translation is put back into the app.'),
    ('Placeholders', 'Keep words in curly brackets exactly as they are, for example {name}, {number}, {n}, {title}, {total}. The app fills them in (for example {name} becomes Hamlin or Elias, {number} a phone number).'),
    ('Names and numbers', 'Keep phone numbers (116 111, 113, 112), e-mail and web addresses, and the names UDI, Bufdir, LFB, Statsforvalteren, Alarmtelefonen and TOLK as they are. Hamlin and Elias are names: write them in your alphabet if needed.'),
    ('Tone', 'Simple, warm, everyday language for teenagers who may read poorly. Short sentences. Speak to the reader as "you" (informal). Many texts are also read aloud, so they should sound natural when spoken.'),
    ('Length', 'Buttons and labels (see the Context column) must stay short. Other texts may be a little longer than the Norwegian when needed.'),
    ('Context', 'The Context column (in English) says where the text is shown. The Section column says which part of the app it belongs to.'),
    ('Questions', 'Write questions or comments in the Comment column. Do not write them in the translation column.'),
]

def main(src, out):
    values = json.load(open(src))['values']
    head = values[0]
    col = {h: i for i, h in enumerate(head)}
    rows = []
    for r in values[1:]:
        r = r + [''] * len(head)
        key, ctx = r[col['key']].strip(), r[col['context']].strip()
        if not key or skip(key, ctx):
            continue
        rows.append(dict(key=key, ctx=clean(ctx), no=r[col['no']], en=r[col['en']], section=section(key)))
    words = sum(len(re.findall(r'\S+', r['no'])) for r in rows)
    os.makedirs(out, exist_ok=True)
    for code, (name, rtl) in LANGS.items():
        wb = Workbook()
        info = wb.active
        info.title = 'Instructions'
        info['A1'] = f'LFB rights app – translation into {name}'
        info['A1'].font = Font(bold=True, size=14)
        info['A2'] = f'{len(rows)} texts, about {words} Norwegian words.'
        for i, (h, t) in enumerate(INSTRUCTIONS, start=4):
            info.cell(i, 1, h).font = Font(bold=True)
            info.cell(i, 2, t).alignment = Alignment(wrap_text=True, vertical='top')
        info.column_dimensions['A'].width = 20
        info.column_dimensions['B'].width = 100

        ws = wb.create_sheet('Texts')
        cols = ['Key', 'Section', 'Context', 'Norwegian (source)']
        if code != 'en':
            cols.append('English (reference)')
        cols += [name, 'Comment']
        ws.append(cols)
        for r in rows:
            line = [r['key'], r['section'], r['ctx'], r['no']]
            if code != 'en':
                line.append(r['en'])
            line += ['', '']
            ws.append(line)
        widths = {'Key': 28, 'Section': 26, 'Context': 40, 'Norwegian (source)': 60, 'English (reference)': 50, name: 60, 'Comment': 30}
        grey = PatternFill('solid', fgColor='EEEEEE')
        yellow = PatternFill('solid', fgColor='FFF6CC')
        target = cols.index(name) + 1
        for c, title in enumerate(cols, start=1):
            letter = ws.cell(1, c).column_letter
            ws.column_dimensions[letter].width = widths[title]
            ws.cell(1, c).font = Font(bold=True)
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.alignment = Alignment(wrap_text=True, vertical='top')
            row[0].fill = grey
            row[target - 1].fill = yellow
            if rtl:
                row[target - 1].alignment = Alignment(wrap_text=True, vertical='top', horizontal='right', readingOrder=2)
        ws.freeze_panes = 'B2'
        ws.auto_filter.ref = ws.dimensions
        wb.move_sheet('Texts', offset=-1)
        wb.active = 0
        wb.save(os.path.join(out, f'LFB-rettighetsapp-{code}-{name.split(" ")[0]}.xlsx'))
    print(f'{len(rows)} texts, {words} words, {len(LANGS)} files in {out}')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
