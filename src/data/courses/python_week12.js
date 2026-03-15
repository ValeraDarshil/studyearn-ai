/**
 * StudyEarn AI — Python Week 12
 * Topic: Final Capstone Project — Everything Together!
 * Month 3 Finale + Course Completion!
 */

export const PYTHON_WEEK_12 = {
  week: 12,
  title: 'Final Capstone — Pura Python Ek Project Mein!',
  description: '3 mahine ki learning ek real-world project mein lagao. Certificate earn karo! 🎓',
  xpReward: 500,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w12-s1',
      title: 'Course Recap — Teen Mahine Ka Safar',
      emoji: '🗺️',
      content: `## Teen Mahine Ka Safar — Kya Seekha Tumne!

Bhai/Behen, seriously — 3 mahine mein yeh sab seekha tumne. Proud ho apne aap par!

### Month 1 — Foundation ✅
\`\`\`
Week 1: Variables, Input/Output, Basic Math
Week 2: Conditions (if/elif), Loops (for/while), Lists
Week 3: Strings, Dictionaries, File Handling, Errors
Week 4: OOP (Classes), Modules, Month 1 Project
\`\`\`

### Month 2 — Intermediate ✅
\`\`\`
Week 5: Regular Expressions — Text Pattern Matching
Week 6: Web Scraping — BeautifulSoup + requests
Week 7: APIs — REST APIs, JSON, Real-world data
Week 8: Pandas + Matplotlib — Data Analysis + Visualization
\`\`\`

### Month 3 — Advanced ✅
\`\`\`
Week 9:  Django — Web Application Framework
Week 10: Machine Learning — scikit-learn, Classification, Regression
Week 11: Automation — Files, Excel, Emails, Scheduling
Week 12: FINAL CAPSTONE PROJECT ← Tum yahan ho!
\`\`\`

### Ab Tum Kya Kya Kar Sakte Ho:
\`\`\`python
# Web apps banana
import django

# Real data fetch karna
import requests

# Data analyze karna
import pandas as pd

# AI models banana
from sklearn.ensemble import RandomForestClassifier

# Automation
import shutil, openpyxl, smtplib

# Beautiful reports
import matplotlib.pyplot as plt
\`\`\`

### Career Opportunities After This Course:
- 🐍 Python Developer (₹4-8 LPA fresher)
- 📊 Data Analyst (₹4-10 LPA)
- 🤖 ML Engineer (₹6-15 LPA)
- 🌐 Django Developer (₹4-8 LPA)
- ⚙️ Automation Engineer (₹4-7 LPA)

**Aage seekhne ke liye:**
- Advanced Django (REST API, Authentication)
- Deep Learning (TensorFlow, PyTorch)
- Data Science (Kaggle competitions)
- FastAPI (Modern Python APIs)`,
      codeExample: `# Ek chhoti sa review — sabse important concepts ek jagah

# ─ OOP ─
class PythonStudent:
    def __init__(self, naam, months_studied):
        self.naam = naam
        self.months = months_studied
        self.skills = []
    
    def add_skill(self, skill):
        self.skills.append(skill)
        return self
    
    def show_profile(self):
        print(f"\\n{'='*40}")
        print(f"  👤 {self.naam}")
        print(f"  📅 {self.months} months of Python")
        print(f"  🛠️  Skills ({len(self.skills)}):")
        for s in self.skills:
            print(f"     ✓ {s}")
        print(f"{'='*40}")

# ─ Method chaining ─
student = PythonStudent("Aap", 3)
for skill in ["OOP", "Web Scraping", "APIs", "Pandas", "Django", "ML", "Automation"]:
    student.add_skill(skill)

student.show_profile()

# ─ Lambda + sorted ─
skills_by_length = sorted(student.skills, key=lambda x: len(x))
print("\\nSkills by name length:", skills_by_length)

# ─ List comprehension ─
advanced_skills = [s for s in student.skills if len(s) > 4]
print("Advanced skills:", advanced_skills)

# ─ Dictionary comprehension ─
skill_levels = {skill: "Intermediate" for skill in student.skills}
skill_levels["OOP"] = "Advanced"
print("\\nSkill Levels:", skill_levels)`,
      task: {
        description: 'Apna personal Python learning recap banao! Ek Python script likho jo: (1) Teen mahine mein seekhe concepts ki dictionary banao with examples, (2) Har concept ke liye ek mini example run karo, (3) Apna "Python Journey Report" generate karo — text + stats. Pride feel karo! 🎉',
        expectedOutput: null,
        hint: 'concepts = {"Week 1": ["variables", "loops", "functions"], ...}. Har concept ke liye len() count karo. f-string se formatted report print karo.',
      },
      quiz: [
        {
          q: 'Teen mahine ke Python course mein kaunsa Month 2 topic tha?',
          options: ['Django Web Framework', 'Machine Learning', 'Regular Expressions + Web Scraping + APIs + Pandas', 'Automation Scripts'],
          correct: 2,
          explanation: 'Month 2: Week 5 (Regex), Week 6 (Web Scraping), Week 7 (APIs), Week 8 (Pandas + Matplotlib).',
        },
        {
          q: 'Python mein list comprehension ka example kya hai?',
          options: ['[for x in list]', '[x*2 for x in numbers if x > 0]', 'list(comprehension)', 'for x: append(list)'],
          correct: 1,
          explanation: '[expression for item in iterable if condition] — ek line mein filtered aur transformed list banana.',
        },
        {
          q: 'Aage Python mein kya seekhna chahiye Data Science ke liye?',
          options: ['PHP', 'TensorFlow + Deep Learning + Kaggle', 'WordPress', 'Java'],
          correct: 1,
          explanation: 'scikit-learn ke baad TensorFlow/PyTorch deep learning ke liye. Kaggle pe real datasets se practice. Yahi roadmap hai Data Scientist banne ka.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w12-s2',
      title: 'Capstone Project — Student Management System 2.0',
      emoji: '🚀',
      content: `## Capstone Project — Sab Kuch Ek Mein!

Tumne Month 1 mein simple Student Management System banaya tha. Ab usi ko 10x powerful banao sabhi concepts use karke!

### Project: EduTrack Pro

**Features (har feature ek Month ka use karta hai):**

\`\`\`
EduTrack Pro
├── 🗄️  Database (Month 1 — File Handling/JSON)
│   └── Students, subjects, marks, attendance
│
├── 📊 Analytics Dashboard (Month 2 — Pandas + Matplotlib)
│   ├── Class performance trends
│   ├── Subject-wise comparison charts
│   └── Top/bottom students
│
├── 🌐 Web Interface (Month 3 — Django)
│   ├── Student registration form
│   ├── Marks entry
│   └── Report cards view
│
├── 🤖 AI Grade Predictor (Month 3 — ML)
│   ├── Attendance + previous marks → predicted grade
│   └── "At risk" students identify karo
│
└── ⚙️  Automation (Month 3 — Automation)
    ├── Monthly PDF/Excel report generate
    └── Parents ko result email karo
\`\`\`

### Core Data Structure:
\`\`\`python
import json
import pandas as pd
from datetime import datetime

# Student record
student = {
    "id": "STU001",
    "naam": "Rahul Kumar",
    "class": "10A",
    "contact": {
        "phone": "9876543210",
        "email": "parent@gmail.com",
        "address": "Mumbai"
    },
    "academics": {
        "subjects": ["Math", "Science", "English", "Hindi", "CS"],
        "marks": {
            "unit_test_1": {"Math": 85, "Science": 90, "English": 78},
            "mid_term": {"Math": 88, "Science": 85, "English": 82},
            "unit_test_2": {"Math": 92, "Science": 88, "English": 86},
        },
        "attendance": {
            "2024-01": 24,
            "2024-02": 20,
            "2024-03": 23,
        }
    }
}
\`\`\``,
      codeExample: `import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

class EduTrackPro:
    def __init__(self, data_file='edutrack_data.json'):
        self.data_file = data_file
        self.students = self._load_data()
    
    def _load_data(self):
        try:
            with open(self.data_file) as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def _save_data(self):
        with open(self.data_file, 'w') as f:
            json.dump(self.students, f, indent=2)
    
    def add_student(self, sid, naam, class_name, email):
        self.students[sid] = {
            'naam': naam, 'class': class_name,
            'email': email, 'marks': {}, 'attendance': {}
        }
        self._save_data()
        print(f"Student {naam} added ✅")
    
    def add_marks(self, sid, exam, subject, marks):
        if sid not in self.students:
            print("Student not found!"); return
        if exam not in self.students[sid]['marks']:
            self.students[sid]['marks'][exam] = {}
        self.students[sid]['marks'][exam][subject] = marks
        self._save_data()
    
    def get_report_card(self, sid):
        if sid not in self.students:
            return None
        s = self.students[sid]
        print(f"\\n{'='*50}")
        print(f"  REPORT CARD — {s['naam']} ({s['class']})")
        print(f"{'='*50}")
        for exam, subjects in s['marks'].items():
            print(f"\\n{exam}:")
            total = 0
            for sub, mark in subjects.items():
                print(f"  {sub:<12} {mark:>3}/100  {'█'*int(mark/10)}")
                total += mark
            avg = total / len(subjects) if subjects else 0
            print(f"  Average: {avg:.1f}%")
        print(f"{'='*50}")

# Demo
tracker = EduTrackPro()
tracker.add_student("STU001", "Rahul Kumar", "10A", "parent@gmail.com")
tracker.add_marks("STU001", "Unit Test 1", "Math", 85)
tracker.add_marks("STU001", "Unit Test 1", "Science", 92)
tracker.add_marks("STU001", "Unit Test 1", "English", 78)
tracker.add_marks("STU001", "Mid Term", "Math", 88)
tracker.add_marks("STU001", "Mid Term", "Science", 85)
tracker.get_report_card("STU001")`,
      task: {
        description: 'EduTrackPro mein yeh methods add karo: (1) analytics_dashboard() — matplotlib se 3 charts: class average trend, subject comparison bar chart, attendance pie chart, (2) identify_at_risk() — 75% se kam attendance ya 60% se kam average wale students, (3) generate_excel_report() — openpyxl se formatted report. Demo data se test karo!',
        expectedOutput: null,
        hint: 'pandas DataFrame banao students se. groupby se averages nikalo. plt.subplots(1,3) se 3 charts. at_risk = [s for s in students if avg < 60 or attendance < 75].',
      },
      quiz: [
        {
          q: 'Capstone project mein kaunse Month 2 concept use hota hai?',
          options: ['Django', 'Pandas + Matplotlib for analytics', 'Machine Learning', 'smtplib'],
          correct: 1,
          explanation: 'Month 2 ka main tool Pandas (data analysis) + Matplotlib (visualization) hai — analytics dashboard ke liye perfect.',
        },
        {
          q: 'JSON file ke saath save/load karne ka faida kya hai database se compare karke?',
          options: ['Faster', 'Setup nahi chahiye — seedha file system pe, beginner ke liye simple', 'More secure', 'Larger data handle karta hai'],
          correct: 1,
          explanation: 'Small projects ke liye JSON perfect hai — koi database setup nahi, seedha file mein. Production mein MongoDB/PostgreSQL use karo.',
        },
        {
          q: 'EduTrack Pro mein ML kab use hoga?',
          options: ['Data store karne ke liye', 'Student ki predicted grade/at-risk prediction ke liye', 'Excel report ke liye', 'Email bhejne ke liye'],
          correct: 1,
          explanation: 'ML = attendance + previous marks se final grade predict karna. "At risk" students ko pehle identify karo taaki help mil sake.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w12-s3',
      title: 'Capstone Part 2 — ML + Automation Add Karo',
      emoji: '🤖',
      content: `## Capstone Phase 2 — AI aur Automation!

### ML Grade Predictor add karo EduTrack mein:

\`\`\`python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

class GradePredictor:
    def __init__(self):
        self.model = None
        self.trained = False
    
    def prepare_features(self, student_data):
        """Student data se ML features nikalo"""
        features = []
        for sid, s in student_data.items():
            marks = s.get('marks', {})
            attendance = s.get('attendance', {})
            
            all_marks = []
            for exam_marks in marks.values():
                all_marks.extend(exam_marks.values())
            
            avg_marks = np.mean(all_marks) if all_marks else 0
            total_days = sum(attendance.values()) if attendance else 0
            
            features.append({
                'avg_marks': avg_marks,
                'attendance_days': total_days,
                'num_exams': len(marks),
                'id': sid
            })
        return features
    
    def train(self, features, labels):
        """Model train karo"""
        X = [[f['avg_marks'], f['attendance_days'], f['num_exams']] for f in features]
        X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2)
        
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X_train, y_train)
        self.trained = True
        
        from sklearn.metrics import accuracy_score
        score = accuracy_score(y_test, self.model.predict(X_test))
        print(f"Grade Predictor trained! Accuracy: {score*100:.1f}%")
        
        joblib.dump(self.model, 'grade_predictor.pkl')
    
    def predict(self, avg_marks, attendance, num_exams):
        if not self.trained:
            self.model = joblib.load('grade_predictor.pkl')
        pred = self.model.predict([[avg_marks, attendance, num_exams]])[0]
        return pred
\`\`\`

### Complete Automation Flow:
\`\`\`python
import schedule
import time

def automated_monthly_tasks():
    """Har mahine automatically run ho"""
    print("Running monthly automation...")
    
    tracker = EduTrackPro()
    
    # 1. Excel report generate karo
    tracker.generate_excel_report()
    
    # 2. At-risk students identify karo
    at_risk = tracker.identify_at_risk()
    
    # 3. Parents ko emails bhejo
    for student_id in at_risk:
        tracker.send_alert_email(student_id)
    
    print(f"Monthly tasks complete! {len(at_risk)} alerts sent.")

# Daily 8 AM pe run karo
schedule.every().month.do(automated_monthly_tasks)
\`\`\``,
      codeExample: `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import json

# Grade predictor with synthetic training data
class SmartGradePredictor:
    
    def generate_training_data(self, n=300):
        """Training data generate karo"""
        np.random.seed(42)
        
        avg_marks = np.random.uniform(30, 100, n)
        attendance = np.random.uniform(50, 100, n)
        study_hours = np.random.uniform(1, 8, n)
        
        # Grade logic
        score = avg_marks * 0.6 + attendance * 0.2 + study_hours * 3
        grades = []
        for s in score:
            if s > 80: grades.append('A+')
            elif s > 70: grades.append('A')
            elif s > 60: grades.append('B')
            elif s > 50: grades.append('C')
            else: grades.append('F')
        
        return pd.DataFrame({
            'avg_marks': avg_marks,
            'attendance_pct': attendance,
            'study_hours': study_hours,
        }), grades
    
    def train(self):
        X, y = self.generate_training_data()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        joblib.dump(self.model, 'grade_model.pkl')
        print("Model trained aur saved ✅")
    
    def predict_student(self, avg, attendance, study_hours):
        try:
            model = joblib.load('grade_model.pkl')
        except:
            self.train()
            model = joblib.load('grade_model.pkl')
        
        features = pd.DataFrame([[avg, attendance, study_hours]],
                                  columns=['avg_marks', 'attendance_pct', 'study_hours'])
        grade = model.predict(features)[0]
        probs = model.predict_proba(features)[0]
        classes = model.classes_
        
        print(f"\\nGrade Prediction:")
        print(f"  Predicted Grade: {grade}")
        for cls, prob in sorted(zip(classes, probs), key=lambda x: -x[1])[:3]:
            print(f"  {cls}: {prob*100:.1f}%")
        
        return grade

predictor = SmartGradePredictor()
predictor.train()
print("\\nStudent 1 (High performer):")
predictor.predict_student(avg=88, attendance=95, study_hours=6)
print("\\nStudent 2 (Struggling):")
predictor.predict_student(avg=45, attendance=60, study_hours=2)`,
      task: {
        description: 'EduTrack Pro ka final version complete karo with sab features: JSON database, pandas analytics, matplotlib charts, ML grade predictor, Excel report generation. Minimum 5 students ka data add karo aur pura system test karo end-to-end — add student → marks enter → analytics dekho → grade predict karo → Excel report generate karo!',
        expectedOutput: null,
        hint: 'Har class ko alag file mein rakho (edutrack.py, analytics.py, ml_predictor.py, report_gen.py). main.py mein sab import karo. CLI menu se user interact kare.',
      },
      quiz: [
        {
          q: 'Production app mein JSON file ki jagah kya use karna chahiye?',
          options: ['Text file', 'SQLite ya PostgreSQL database', 'Excel file', 'CSV file'],
          correct: 1,
          explanation: 'JSON small projects ke liye theek hai. Production mein SQLite (small apps), PostgreSQL/MongoDB (large apps) use karo — better querying, concurrent access, ACID properties.',
        },
        {
          q: 'joblib.load() se model load karne ke baad kya zaroori hai?',
          options: ['Model retrain karo', 'Same feature format mein data dena jo training mein tha', 'Scaler manually apply karna', 'Model validate karna'],
          correct: 1,
          explanation: 'Saved model expects same features in same order. Agar training mein StandardScaler use kiya tha toh scaler bhi save karo aur predict karte waqt use karo.',
        },
        {
          q: 'Capstone project portfolio mein add karne ka sahi tarika?',
          options: ['Sirf code share karo', 'GitHub pe upload karo with README.md, screenshots, installation guide', 'ZIP file share karo', 'Code print karke do'],
          correct: 1,
          explanation: 'GitHub repo with: README.md (project description, features, how to run), screenshots, requirements.txt. Recruiters directly GitHub dekhte hain!',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w12-s4',
      title: 'Course Complete! Certificate + Aage Ka Raasta',
      emoji: '🎓',
      content: `## 🎉 CONGRATULATIONS! Python Course Complete!

Tumne kar diya! 3 mahine, 12 weeks, 48 sections — Python mein NOOB se PRO!

### Final Checklist — Sabhi Projects Complete Hone Chahiye:
\`\`\`
Month 1 Projects:
  ✅ Student Management System (Week 4)
  
Month 2 Projects:
  ✅ Form Validator (Regex) (Week 5)
  ✅ Price Tracker (Web Scraping) (Week 6)
  ✅ News Aggregator (APIs) (Week 7)
  ✅ Sales Dashboard (Pandas) (Week 8)
  
Month 3 Projects:
  ✅ Blog App (Django) (Week 9)
  ✅ Loan Approval ML (Week 10)
  ✅ Automation Suite (Week 11)
  ✅ EduTrack Pro Capstone (Week 12) ← LAST ONE!
\`\`\`

### Certificate Download Karo! 🏆
Upar "Certificate" button click karo aur download karo.

Share karo:
- LinkedIn profile mein add karo
- Resume mein mention karo
- Friends ko flex karo! 😄

### Next Steps — Kya Seekhna Hai Aage:

**For Web Development:**
\`\`\`bash
pip install djangorestframework  # REST APIs
pip install fastapi uvicorn      # Modern API framework
\`\`\`

**For Data Science:**
\`\`\`bash
pip install tensorflow keras     # Deep Learning
pip install torch torchvision    # PyTorch
# Kaggle.com pe competitions join karo!
\`\`\`

**For Automation:**
\`\`\`bash
pip install selenium             # Browser automation
pip install playwright           # Modern browser control
\`\`\`

**Resources:**
- 📚 Python docs: docs.python.org
- 🏆 Practice: leetcode.com, hackerrank.com
- 📊 Data Science: kaggle.com
- 🌐 Projects: github.com explore karo
- 💼 Jobs: internshala.com, naukri.com, linkedin.com

---

### Ek Last Message: 💜

**Yeh course finish karna chhota kaam nahi hai.** Lakhs log start karte hain, bahut kam complete karte hain. Tum unme se ho jo complete kiya.

Ab real projects banao. GitHub pe daalo. LinkedIn update karo. Apply karo jobs mein.

**Python sirf ek language nahi hai — yeh tumhara career tool hai. Use it! 🚀**

*— StudyEarn AI Team*`,
      codeExample: `# Final Python celebration script!

import random
from datetime import datetime

def celebrate_completion():
    achievements = [
        "12 weeks of consistent learning",
        "48+ coding sections completed",
        "8 real projects built",
        "Regex, Web Scraping, APIs mastered",
        "Pandas & Data Visualization learned",
        "Django web app created",
        "ML model trained and deployed",
        "Automation scripts written",
    ]

    quotes = [
        "Code is like humor. When you have to explain it, it's bad. — Cory House",
        "First, solve the problem. Then, write the code. — John Johnson",
        "Experience is the name everyone gives to their mistakes. — Oscar Wilde",
        "The best way to predict the future is to implement it. — David Heinemeier Hansson",
    ]

    print("\\n" + "🎉 " * 20)
    print("\\n  ██████╗  ██████╗ ███╗  ██╗███████╗ ██╗")
    print("  ██╔══██╗██╔═══██╗████╗ ██║██╔════╝ ██║")
    print("  ██║  ██║██║   ██║██╔██╗██║█████╗   ██║")
    print("  ██║  ██║██║   ██║██║╚████║██╔══╝   ╚═╝")
    print("  ██████╔╝╚██████╔╝██║ ╚███║███████╗ ██╗")
    print("  ╚═════╝  ╚═════╝ ╚═╝  ╚══╝╚══════╝ ╚═╝")
    print()
    print(f"  Python Programming — COURSE COMPLETE!")
    print(f"  {datetime.now().strftime('%d %B %Y')}")
    print("\\n" + "🏆 " * 20)
    
    print("\\n📋 Your Achievements:")
    for i, achievement in enumerate(achievements, 1):
        print(f"  {i}. ✅ {achievement}")
    
    print("\\n💡 Inspiration:")
    print(f'  "{random.choice(quotes)}"')
    
    print("\\n🚀 Next Steps:")
    next_steps = [
        "GitHub pe ek project upload karo aaj",
        "LinkedIn pe Python certificate add karo",
        "Ek real problem solve karo Python se",
        "Kaggle pe pehla competition join karo",
        "Django REST API banao portfolio ke liye",
    ]
    for step in next_steps:
        print(f"  → {step}")
    
    print("\\n" + "⭐ " * 20)
    print("\\n  You did it! Ab duniya dekhegi! 💪")
    print("\\n" + "⭐ " * 20)

celebrate_completion()`,
      task: {
        description: 'FINAL TASK: EduTrack Pro ka poora capstone project complete karo with ALL features working. Phir: (1) ek requirements.txt banao (pip freeze > requirements.txt), (2) ek README.md likho project ke baare mein, (3) celebration script run karo. COURSE COMPLETE! 🎓',
        expectedOutput: null,
        hint: 'pip freeze > requirements.txt terminal mein. README.md mein: Project name, Features list, How to install, How to run, Screenshots description. Phir celebrate karo!',
      },
      quiz: [
        {
          q: 'requirements.txt kya hota hai?',
          options: ['Project description file', 'Saari dependencies aur unki versions ki list — doosre computer pe same setup ke liye', 'License file', 'Installation guide'],
          correct: 1,
          explanation: 'requirements.txt mein saari pip packages hoti hain. "pip install -r requirements.txt" se koi bhi same environment recreate kar sakta hai.',
        },
        {
          q: 'GitHub pe project daalne ka pehla step?',
          options: ['pip install github', 'git init → git add . → git commit → git push', 'Upload directly', 'Email se share karo'],
          correct: 1,
          explanation: 'git init (local repo), git add . (stage files), git commit -m "message" (save), git remote add origin URL, git push origin main (GitHub pe upload).',
        },
        {
          q: 'Python developer job ke liye sabse important kya hai?',
          options: ['Certificates', 'Portfolio projects on GitHub + problem solving skills', 'Degree', 'Social media followers'],
          correct: 1,
          explanation: 'Recruiters GitHub portfolio dekhte hain. Real projects jo working hain, clean code, README — yeh sab zyada matter karta hai degree se.',
        },
      ],
    },
  ],
};