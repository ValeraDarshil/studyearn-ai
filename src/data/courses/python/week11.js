/**
 * StudyEarn AI — Python Week 11
 * Topic: Automation — Boring Kaam Python Se Karao!
 */

export const PYTHON_WEEK_11 = {
  week: 11,
  title: 'Automation — Boring Kaam Python Se Karao!',
  description: 'Files organize karo, emails bhejo, Excel automate karo, browser control karo — sab Python se!',
  xpReward: 230,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w11-s1',
      title: 'File System Automation — Files Automatically Manage Karo',
      emoji: '📁',
      content: `## os aur shutil — File System Ka Full Control!

### os module — File System Operations:
\`\`\`python
import os
import shutil
from pathlib import Path

# Current directory
print(os.getcwd())

# Files list karo
files = os.listdir('.')
print(files)

# Path check
print(os.path.exists('myfile.txt'))
print(os.path.isfile('data.csv'))
print(os.path.isdir('downloads/'))
print(os.path.getsize('file.txt'))  # Size in bytes

# Folder banao
os.makedirs('output/reports', exist_ok=True)

# File operations
shutil.copy('source.txt', 'backup/source.txt')
shutil.move('old_name.txt', 'new_name.txt')
os.remove('unwanted.txt')
shutil.rmtree('empty_folder')  # Folder delete

# Path join (OS-independent)
path = os.path.join('users', 'rahul', 'documents', 'file.txt')
print(path)  # users/rahul/documents/file.txt
\`\`\`

### pathlib — Modern File Handling:
\`\`\`python
from pathlib import Path

p = Path('downloads')

# Saare PDF files dhundho
pdfs = list(p.glob('*.pdf'))
print(f"Found {len(pdfs)} PDFs")

# Recursively dhundho (subfolders bhi)
all_images = list(p.rglob('*.jpg')) + list(p.rglob('*.png'))

# File info
for f in pdfs:
    print(f.name, f.suffix, f.stat().st_size)
\`\`\`

### File Organizer Script:
\`\`\`python
import shutil
from pathlib import Path

def organize_downloads(folder='downloads'):
    folder = Path(folder)
    
    categories = {
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        'Documents': ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.pptx'],
        'Videos': ['.mp4', '.avi', '.mkv', '.mov'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac'],
        'Code': ['.py', '.js', '.html', '.css', '.java', '.cpp'],
        'Archives': ['.zip', '.rar', '.7z', '.tar'],
    }
    
    moved = 0
    for file in folder.iterdir():
        if file.is_file():
            ext = file.suffix.lower()
            for category, extensions in categories.items():
                if ext in extensions:
                    dest = folder / category
                    dest.mkdir(exist_ok=True)
                    shutil.move(str(file), str(dest / file.name))
                    moved += 1
                    break
    
    print(f"Organized {moved} files!")
\`\`\``,
      codeExample: `import os
import shutil
from pathlib import Path
from datetime import datetime

def smart_file_organizer(source_dir='.', dest_dir='organized'):
    """Files ko type aur date ke hisaab se organize karo"""
    source = Path(source_dir)
    dest = Path(dest_dir)
    
    categories = {
        'images': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        'documents': ['.pdf', '.docx', '.txt', '.xlsx'],
        'code': ['.py', '.js', '.html', '.css', '.ts'],
        'videos': ['.mp4', '.avi', '.mkv'],
        'others': [],
    }
    
    stats = {cat: 0 for cat in categories}
    
    for file in source.iterdir():
        if file.is_dir() or file.name.startswith('.'):
            continue
        
        ext = file.suffix.lower()
        category = 'others'
        
        for cat, exts in categories.items():
            if ext in exts:
                category = cat
                break
        
        # Date-based subfolder (YYYY-MM)
        mod_time = datetime.fromtimestamp(file.stat().st_mtime)
        month_folder = mod_time.strftime('%Y-%m')
        
        target_dir = dest / category / month_folder
        target_dir.mkdir(parents=True, exist_ok=True)
        
        target = target_dir / file.name
        # Duplicate handle karo
        counter = 1
        while target.exists():
            target = target_dir / f"{file.stem}_{counter}{file.suffix}"
            counter += 1
        
        shutil.copy2(str(file), str(target))
        stats[category] += 1
        print(f"  Moved: {file.name} → {category}/{month_folder}/")
    
    print("\\n=== Organization Complete ===")
    for cat, count in stats.items():
        if count > 0:
            print(f"  {cat}: {count} files")

# Demo run
print("File Organizer Demo")
print("(Real use mein apna downloads folder path dena)")
smart_file_organizer('.', 'demo_organized')`,
      task: {
        description: 'Duplicate file finder banao. Ek folder mein duplicate files dhundho (same content, different names) — MD5 hash use karo comparison ke liye. Show karo: kitni duplicates, total space wasted, aur user ko choice do ki delete karein ya move to "duplicates" folder.',
        expectedOutput: null,
        hint: 'import hashlib. def get_hash(file): with open(file,"rb") as f: return hashlib.md5(f.read()).hexdigest(). Sab files ke hashes dict mein store karo {hash: [file_paths]}. Jo hashes mein 1 se zyada files hain woh duplicates hain.',
      },
      quiz: [
        {
          q: 'Path.rglob("*.pdf") kya karta hai?',
          options: ['Sirf current folder mein PDFs', 'Current + saare subfolders mein PDFs recursively', 'PDF files delete karta hai', 'PDF files count karta hai'],
          correct: 1,
          explanation: 'rglob = recursive glob. Saare nested subfolders mein bhi pattern match karta hai. glob sirf current folder mein.',
        },
        {
          q: 'shutil.copy2() aur shutil.copy() mein kya fark hai?',
          options: ['Koi fark nahi', 'copy2 metadata (timestamps) bhi copy karta hai', 'copy2 faster hai', 'copy2 folders copy karta hai'],
          correct: 1,
          explanation: 'copy2 file content + metadata (creation time, modification time) copy karta hai. copy sirf content copy karta hai.',
        },
        {
          q: 'os.makedirs("a/b/c", exist_ok=True) kya karta hai?',
          options: ['Sirf "a" folder banata hai', 'a, b, c sab folders banata hai — already exist karo toh error nahi', 'Folders delete karta hai', 'Folder check karta hai'],
          correct: 1,
          explanation: 'makedirs nested folders banata hai. exist_ok=True matlab agar folder pehle se hai toh FileExistsError nahi aayega.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w11-s2',
      title: 'Excel Automation — openpyxl se Reports Banao',
      emoji: '📊',
      content: `## Excel Automation — Python se Excel Files Banao aur Edit Karo!

### Install karo:
\`\`\`bash
pip install openpyxl pandas xlsxwriter
\`\`\`

### Excel File Banao:
\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Sales Report"

# Headers
headers = ['Student', 'Math', 'Science', 'English', 'Total', 'Grade']
for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.font = Font(bold=True, color='FFFFFF', size=12)
    cell.fill = PatternFill(fill_type='solid', fgColor='4472C4')
    cell.alignment = Alignment(horizontal='center')

# Data add karo
students = [
    ('Rahul', 85, 90, 75),
    ('Priya', 92, 88, 95),
    ('Arjun', 78, 82, 70),
]

for row, (name, math, sci, eng) in enumerate(students, 2):
    total = math + sci + eng
    grade = 'A+' if total >= 270 else 'A' if total >= 240 else 'B'
    ws.append([name, math, sci, eng, total, grade])

# Column widths
for col in range(1, 7):
    ws.column_dimensions[get_column_letter(col)].width = 15

# Save karo
wb.save('student_report.xlsx')
print("Excel file created! ✅")
\`\`\`

### Excel Read karna:
\`\`\`python
import openpyxl
import pandas as pd

# Method 1: openpyxl
wb = openpyxl.load_workbook('data.xlsx')
ws = wb.active

for row in ws.iter_rows(min_row=2, values_only=True):
    print(row)

# Method 2: Pandas (easier!)
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')
print(df.head())

# Multiple sheets
df_dict = pd.read_excel('data.xlsx', sheet_name=None)  # All sheets
for sheet_name, df in df_dict.items():
    print(f"Sheet: {sheet_name}, Rows: {len(df)}")
\`\`\`

### Charts Excel mein:
\`\`\`python
from openpyxl.chart import BarChart, Reference

chart = BarChart()
chart.title = "Student Scores"
chart.y_axis.title = "Score"

data = Reference(ws, min_col=2, max_col=4, min_row=1, max_row=ws.max_row)
categories = Reference(ws, min_col=1, min_row=2, max_row=ws.max_row)

chart.add_data(data, titles_from_data=True)
chart.set_categories(categories)

ws.add_chart(chart, "H2")
wb.save('report_with_chart.xlsx')
\`\`\``,
      codeExample: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, numbers
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference
import random

def create_sales_report():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Monthly Sales"

    # Title
    ws.merge_cells('A1:F1')
    title_cell = ws['A1']
    title_cell.value = "MONTHLY SALES REPORT — Q1 2024"
    title_cell.font = Font(bold=True, size=14, color='FFFFFF')
    title_cell.fill = PatternFill(fill_type='solid', fgColor='1F4E79')
    title_cell.alignment = Alignment(horizontal='center', vertical='center')
    ws.row_dimensions[1].height = 30

    # Headers
    headers = ['Product', 'Jan', 'Feb', 'Mar', 'Q1 Total', 'Growth %']
    products = ['Laptop', 'Phone', 'Tablet', 'Earbuds', 'Watch', 'Camera']

    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=2, column=col, value=header)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = PatternFill(fill_type='solid', fgColor='2E75B6')
        cell.alignment = Alignment(horizontal='center')

    # Data
    for r, product in enumerate(products, 3):
        jan = random.randint(50, 200)
        feb = random.randint(50, 200)
        mar = random.randint(50, 200)
        total = jan + feb + mar
        growth = round(((mar - jan) / jan) * 100, 1)

        row_data = [product, jan, feb, mar, total, growth]
        for col, val in enumerate(row_data, 1):
            cell = ws.cell(row=r, column=col, value=val)
            cell.alignment = Alignment(horizontal='center')
            if r % 2 == 0:
                cell.fill = PatternFill(fill_type='solid', fgColor='DEEAF1')

    # Column widths
    widths = [15, 10, 10, 10, 12, 12]
    for i, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = width

    wb.save('sales_report.xlsx')
    print("Sales report created: sales_report.xlsx ✅")

create_sales_report()`,
      task: {
        description: 'Attendance register banao in Excel: 30 students, 20 school days. Random attendance generate karo (P/A). Phir calculate karo: har student ki attendance %, 75% se kam wale highlight karo red mein, total present/absent per day, aur ek summary sheet add karo. Chart bhi add karo!',
        expectedOutput: null,
        hint: 'Nested loop: rows = students, cols = days. cell.fill = PatternFill(fgColor="FF0000") se red. ws2 = wb.create_sheet("Summary") se doosri sheet. Percentage calculate: present_count/20*100.',
      },
      quiz: [
        {
          q: 'openpyxl.load_workbook() kab use karte hain?',
          options: ['Naya file banane ke liye', 'Existing Excel file open karne ke liye', 'CSV read karne ke liye', 'File delete karne ke liye'],
          correct: 1,
          explanation: 'Workbook() = naya file create. load_workbook("file.xlsx") = existing file open karna editing ke liye.',
        },
        {
          q: 'ws.merge_cells("A1:F1") kya karta hai?',
          options: ['A1 se F1 tak cells delete karta hai', 'A1 se F1 tak saari cells ek badi cell mein merge karta hai', 'A1 ki value F1 mein copy karta hai', 'A1 ko F1 se link karta hai'],
          correct: 1,
          explanation: 'merge_cells multiple cells ko ek badi cell mein combine karta hai — title banane ke liye useful!',
        },
        {
          q: 'pandas.read_excel() ka faida openpyxl ke upar?',
          options: ['Faster hai', 'DataFrame return karta hai — directly analysis kar sakte hain', 'Charts support karta hai', 'Better formatting'],
          correct: 1,
          explanation: 'pd.read_excel() seedha DataFrame deta hai — analysis, filtering, statistics sab turant kar sakte ho. openpyxl zyada control deta hai formatting aur creation ke liye.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w11-s3',
      title: 'Email Automation — Python se Emails Bhejo',
      emoji: '📧',
      content: `## Email Automation — Bulk Emails Python Se!

### smtplib — Built-in Email Library:
\`\`\`python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def send_email(to_email, subject, body, attachment=None):
    # Gmail ke liye App Password use karo
    # (Settings → Security → 2FA → App Passwords)
    sender = "your_email@gmail.com"
    password = "your_app_password"  # .env se lo!

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))  # HTML email!

    # Attachment (optional)
    if attachment:
        with open(attachment, 'rb') as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={attachment}')
            msg.attach(part)

    # Send karo
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender, password)
        server.send_message(msg)
    
    print(f"Email sent to {to_email} ✅")
\`\`\`

### HTML Email Template:
\`\`\`python
def create_result_email(student_name, marks, percentage, grade):
    return f"""
    <html>
    <body style="font-family: Arial; padding: 20px;">
        <h2 style="color: #6366f1;">📊 Exam Results</h2>
        <p>Dear <strong>{student_name}</strong>,</p>
        <p>Your exam results:</p>
        <table style="border-collapse: collapse; width: 300px;">
            <tr style="background: #6366f1; color: white;">
                <th style="padding: 10px;">Subject</th>
                <th>Marks</th>
            </tr>
            {"".join(f'<tr><td style="padding:8px;border:1px solid #ddd">{s}</td><td style="text-align:center">{m}</td></tr>' for s, m in marks.items())}
        </table>
        <p><strong>Percentage: {percentage}% | Grade: {grade}</strong></p>
        <p style="color: {'green' if percentage >= 75 else 'red'}">
            {'Congratulations! 🎉' if percentage >= 75 else 'Work harder! 💪'}
        </p>
    </body>
    </html>
    """
\`\`\`

### Bulk Email with CSV:
\`\`\`python
import csv

def send_bulk_emails(csv_file):
    with open(csv_file) as f:
        reader = csv.DictReader(f)
        for row in reader:
            body = f"Hello {row['name']}, your score is {row['score']}"
            send_email(row['email'], "Your Results", body)
            time.sleep(1)  # Spam se bachao!
\`\`\``,
      codeExample: `import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# DEMO MODE: Actually send nahi karega — structure dikhayega
def demo_email_automation():
    
    students = [
        {'name': 'Rahul Kumar', 'email': 'rahul@example.com', 'math': 85, 'science': 90, 'english': 78},
        {'name': 'Priya Sharma', 'email': 'priya@example.com', 'math': 92, 'science': 88, 'english': 95},
        {'name': 'Arjun Singh', 'email': 'arjun@example.com', 'math': 65, 'science': 70, 'english': 60},
    ]
    
    for student in students:
        total = student['math'] + student['science'] + student['english']
        pct = round(total / 300 * 100, 1)
        grade = 'A+' if pct >= 90 else 'A' if pct >= 80 else 'B' if pct >= 70 else 'C' if pct >= 60 else 'F'
        
        html_body = f"""
        <html><body style="font-family:Arial;max-width:500px;margin:auto;padding:20px">
        <div style="background:#6366f1;color:white;padding:15px;border-radius:8px;text-align:center">
            <h2>Exam Results 📊</h2>
        </div>
        <div style="padding:20px;border:1px solid #eee;border-radius:8px;margin-top:10px">
            <p>Dear <strong>{student['name']}</strong>,</p>
            <p>Aapke exam results ready hain:</p>
            <table style="width:100%;border-collapse:collapse">
                <tr style="background:#f0f0f0"><th style="padding:8px">Subject</th><th>Marks</th><th>Status</th></tr>
                <tr><td style="padding:8px;border-top:1px solid #eee">Mathematics</td><td style="text-align:center">{student['math']}/100</td><td style="text-align:center">{'✅' if student['math']>=40 else '❌'}</td></tr>
                <tr style="background:#f9f9f9"><td style="padding:8px">Science</td><td style="text-align:center">{student['science']}/100</td><td style="text-align:center">{'✅' if student['science']>=40 else '❌'}</td></tr>
                <tr><td style="padding:8px;border-top:1px solid #eee">English</td><td style="text-align:center">{student['english']}/100</td><td style="text-align:center">{'✅' if student['english']>=40 else '❌'}</td></tr>
            </table>
            <div style="background:{'#dcfce7' if pct>=60 else '#fee2e2'};padding:10px;border-radius:6px;margin-top:15px;text-align:center">
                <strong>Total: {total}/300 | {pct}% | Grade: {grade}</strong>
            </div>
        </div>
        </body></html>
        """
        
        print(f"\\n📧 Email for: {student['email']}")
        print(f"   Subject: Exam Results — {grade} Grade")
        print(f"   {pct}% | {'PASS ✅' if pct >= 40 else 'FAIL ❌'}")
    
    print("\\n(Real use ke liye smtplib se Gmail App Password se send karo)")

demo_email_automation()`,
      task: {
        description: 'Birthday reminder system banao! CSV file mein (naam, email, birthday: YYYY-MM-DD). Script daily run ho (simulate karo) aur aaj jo birthdays hain unhe personalized HTML email bhejo with: naam, age kitna hua, fun message. Test mode mein console pe print karo, production mein actually bhejo.',
        expectedOutput: null,
        hint: 'datetime.now().strftime("%m-%d") se aaj ka month-day nikalo. CSV mein birthday ka month-day compare karo. age = current_year - birth_year. HTML template f-string se banao.',
      },
      quiz: [
        {
          q: 'Gmail ke liye App Password kyun chahiye regular password ki jagah?',
          options: ['App Password zyada secure hai', 'Google 2FA enable hone par regular password scripts se kaam nahi karta', 'Faster authentication', 'Multiple accounts ke liye'],
          correct: 1,
          explanation: '2-Factor Authentication ke saath regular password third-party apps se kaam nahi karta. App Password ek special 16-char password hai sirf ek app ke liye — safer!',
        },
        {
          q: 'MIMEMultipart ka use kyun karte hain?',
          options: ['Multiple recipients ke liye', 'Text + HTML + Attachment — multiple parts ek email mein', 'Faster delivery ke liye', 'Large emails ke liye'],
          correct: 1,
          explanation: 'MIME = email format standard. MIMEMultipart se ek email mein text, HTML, aur attachments sab ek saath bhej sakte hain.',
        },
        {
          q: 'time.sleep(1) bulk emails mein kyun zaroori hai?',
          options: ['Email format ke liye', 'Spam filter se bachne aur server rate limit avoid karne ke liye', 'Authentication ke liye', 'Memory save karne ke liye'],
          correct: 1,
          explanation: 'Ek second delay dene se spam filter trigger nahi hota aur Gmail ka rate limit (100 emails/day free) properly manage hota hai.',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w11-s4',
      title: 'Week 11 Project — Complete Automation Suite',
      emoji: '🏆',
      content: `## Week 11 Project — Office Automation Suite!

Ek complete automation tool banao jo company/school ke kaam automate kare!

### Project Features:
\`\`\`
Automation Suite
├── 1. File Organizer
│   ├── Downloads folder organize karo by type + date
│   └── Duplicate files dhundho aur report do
│
├── 2. Report Generator
│   ├── CSV data → Formatted Excel report
│   ├── Charts add karo automatically
│   └── Summary statistics sheet
│
├── 3. Email Notifier  
│   ├── Results email bhejo (HTML formatted)
│   ├── CSV se bulk email
│   └── Attachment support
│
└── 4. Scheduler (bonus)
    ├── schedule library se daily jobs
    └── Log file maintain karo
\`\`\`

### Schedule Library:
\`\`\`bash
pip install schedule
\`\`\`

\`\`\`python
import schedule
import time
import logging

logging.basicConfig(
    filename='automation.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

def daily_report():
    logging.info("Generating daily report...")
    # report generation code
    logging.info("Report generated!")

def weekly_backup():
    logging.info("Running weekly backup...")
    # backup code

# Schedule karo
schedule.every().day.at("09:00").do(daily_report)
schedule.every().monday.at("08:00").do(weekly_backup)
schedule.every(30).minutes.do(lambda: logging.info("Heartbeat"))

print("Scheduler running...")
while True:
    schedule.run_pending()
    time.sleep(60)
\`\`\`

**Complete karo — +300 XP! 🔥**`,
      codeExample: `import os, shutil, csv
from pathlib import Path
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

class AutomationSuite:
    def __init__(self, work_dir='.'):
        self.work_dir = Path(work_dir)
        self.log = []
    
    def _log(self, msg):
        timestamp = datetime.now().strftime('%H:%M:%S')
        entry = f"[{timestamp}] {msg}"
        self.log.append(entry)
        print(entry)
    
    def organize_files(self, folder):
        folder = Path(folder)
        categories = {
            'Images': ['.jpg','.png','.gif','.webp'],
            'Docs': ['.pdf','.docx','.txt','.xlsx'],
            'Code': ['.py','.js','.html','.css'],
            'Videos': ['.mp4','.avi','.mkv'],
        }
        moved = 0
        for f in folder.iterdir():
            if f.is_file():
                for cat, exts in categories.items():
                    if f.suffix.lower() in exts:
                        dest = folder / cat
                        dest.mkdir(exist_ok=True)
                        shutil.move(str(f), str(dest / f.name))
                        moved += 1
                        break
        self._log(f"Organized {moved} files in {folder}")
    
    def generate_excel_report(self, data, output_file):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Report"
        if not data: return
        headers = list(data[0].keys())
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.font = Font(bold=True, color='FFFFFF')
            cell.fill = PatternFill(fill_type='solid', fgColor='6366F1')
            cell.alignment = Alignment(horizontal='center')
        for row, record in enumerate(data, 2):
            for col, key in enumerate(headers, 1):
                ws.cell(row=row, column=col, value=record[key])
        wb.save(output_file)
        self._log(f"Excel report saved: {output_file}")
    
    def print_summary(self):
        print("\\n=== Automation Log ===")
        for entry in self.log:
            print(f"  {entry}")

# Demo
suite = AutomationSuite()
sample_data = [
    {'Name': 'Rahul', 'Score': 85, 'Grade': 'A'},
    {'Name': 'Priya', 'Score': 92, 'Grade': 'A+'},
    {'Name': 'Arjun', 'Score': 70, 'Grade': 'B'},
]
suite.generate_excel_report(sample_data, 'student_report.xlsx')
suite.print_summary()`,
      task: {
        description: 'AutomationSuite mein email_notifier() method add karo. CSV file padhega (naam, email, score, grade) aur har student ko HTML result email bhejega (demo mode mein print karo). Phir ek main() function likho jo: (1) Organize files, (2) CSV se Excel report banao, (3) Results emails print/send karo — ek hi script se sab kuch!',
        expectedOutput: null,
        hint: 'CSV read karo csv.DictReader se. HTML template f-string se banao. main() mein suite.organize_files(), suite.generate_excel_report(), suite.email_notifier() call karo sequence mein.',
      },
      quiz: [
        {
          q: 'schedule.every().day.at("09:00").do(func) kya karta hai?',
          options: ['Func ek baar run karta hai', 'Har roz 9 baje func automatically run hoga', 'Func 9 second baad run hoga', '9 baar run karega'],
          correct: 1,
          explanation: 'schedule library cron-like scheduling deta hai. .do(func) batata hai kaunsi function run karni hai.',
        },
        {
          q: 'Logging module kyun use karte hain print() ki jagah?',
          options: ['Faster hai', 'File mein save hota hai, timestamps automatic, levels filter kar sakte hain', 'Colors support karta hai', 'Multiple languages'],
          correct: 1,
          explanation: 'Logging = professional debugging. File mein persist hota hai, timestamp automatic, ERROR/WARNING/INFO levels alag alag filter kar sakte hain production mein.',
        },
        {
          q: 'Path.iterdir() aur os.listdir() mein kya fark hai?',
          options: ['Koi fark nahi', 'iterdir() Path objects return karta hai, listdir() strings', 'iterdir() faster hai', 'listdir() hidden files bhi dikhata hai'],
          correct: 1,
          explanation: 'iterdir() Path objects return karta hai — directly .name, .suffix, .stat() use kar sakte ho. listdir() sirf filename strings deta hai.',
        },
      ],
    },
  ],
};