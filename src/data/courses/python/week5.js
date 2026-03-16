/**
 * StudyEarn AI — Python Week 5
 * Topic: Regular Expressions (Regex)
 * Month 2 start — Intermediate level
 */

export const PYTHON_WEEK_5 = {
  week: 5,
  title: 'Regular Expressions — Text Pattern Matching',
  description: 'Text mein patterns dhundho — phone numbers, emails, passwords sab validate karo!',
  xpReward: 160,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w5-s1',
      title: 'Regex Basics — Patterns Likhna',
      emoji: '🔍',
      content: `## Regular Expressions — Superpower Text Search!

Regex ek mini-language hai jo text mein patterns dhundti hai. Jaise Google mein search karte ho — but zyada powerful!

### Kyun Seekhein Regex?
- Phone numbers validate karo
- Emails check karo (sahi format hai ya nahi)
- Passwords mein digits/special chars dhundho
- Log files se data nikalo
- Text clean karo

### Basic Setup
\`\`\`python
import re  # re = regular expressions module

text = "Mera phone number hai 9876543210"

# Search karo
match = re.search(r'\\d{10}', text)  # \\d = digit, {10} = exactly 10
if match:
    print("Phone mila:", match.group())  # 9876543210
\`\`\`

### Core Regex Symbols
| Symbol | Matlab | Example |
|--------|--------|---------|
| \\d | Any digit (0-9) | \\d\\d\\d = "123" |
| \\w | Word char (letter/digit/_) | \\w+ = "hello_123" |
| \\s | Whitespace (space/tab) | \\s+ = "   " |
| . | Any character | h.t = "hat", "hot" |
| ^ | Start of string | ^Hello = starts with Hello |
| $ | End of string | world$ = ends with world |

### Quantifiers — Kitni Baar?
\`\`\`python
# + = 1 ya zyada
# * = 0 ya zyada
# ? = 0 ya 1 (optional)
# {n} = exactly n
# {n,m} = n se m tak

import re

text = "aaa bb c dddd"

print(re.findall(r'a+', text))    # ['aaa']
print(re.findall(r'\\w+', text))   # ['aaa', 'bb', 'c', 'dddd']
print(re.findall(r'\\w{2}', text)) # ['aa', 'bb', 'dd']
\`\`\`

### re.findall() — Saare Matches Nikalo
\`\`\`python
import re

text = "Rahul: 9876543210, Priya: 8765432109, Arjun: 7654321098"

phones = re.findall(r'\\d{10}', text)
print("Found phones:", phones)
# ['9876543210', '8765432109', '7654321098']
\`\`\``,
      codeExample: `import re

# Different re functions try karo
text = "Hello! Mera naam Rahul hai. I am 20 years old. Email: rahul@gmail.com"

# findall — list of all matches
words = re.findall(r'\\b[A-Z][a-z]+\\b', text)
print("Capitalized words:", words)

# Numbers dhundho
numbers = re.findall(r'\\d+', text)
print("Numbers:", numbers)

# Email pattern
emails = re.findall(r'\\w+@\\w+\\.\\w+', text)
print("Emails:", emails)

# search — pehla match
first_word = re.search(r'\\w+', text)
print("First word:", first_word.group())`,
      task: {
        description: 'Ek paragraph text mein se: (1) saare phone numbers nikalo (10 digit), (2) saare email addresses nikalo, (3) saare capitalized words nikalo. Apna khud ka test text banao aur teeno patterns apply karo!',
        expectedOutput: null,
        hint: 'Phone: r"\\d{10}", Email: r"\\w+@\\w+\\.\\w+", Capitalized: r"\\b[A-Z][a-z]+"',
      },
      quiz: [
        {
          q: '\\d regex mein kya match karta hai?',
          options: ['Koi bhi character', 'Sirf digits 0-9', 'Letters only', 'Whitespace'],
          correct: 1,
          explanation: '\\d = digit — 0 se 9 tak koi bhi ek number. \\d{10} = exactly 10 digits.',
        },
        {
          q: 're.findall() kya return karta hai?',
          options: ['Sirf pehla match', 'Saare matches ki list', 'True/False', 'Match object'],
          correct: 1,
          explanation: 'findall() text mein saare matches dhundh ke list mein return karta hai.',
        },
        {
          q: 'Pattern r"\\d+" ka matlab kya hai?',
          options: ['Exactly ek digit', 'Ek ya zyada digits', 'Zero ya ek digit', 'Exactly 2 digits'],
          correct: 1,
          explanation: '+ quantifier = "1 ya zyada" — so \\d+ ek ya zyada consecutive digits match karta hai.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w5-s2',
      title: 'Character Classes aur Groups',
      emoji: '🎯',
      content: `## Character Classes — Custom Patterns!

### [ ] — Custom Character Set
\`\`\`python
import re

# [abc] = a ya b ya c koi bhi
# [a-z] = lowercase a to z
# [A-Z] = uppercase A to Z
# [0-9] = digits (same as \\d)
# [^abc] = NOT a, b, ya c

text = "Hello World 123"

print(re.findall(r'[aeiou]', text))    # ['e', 'o', 'o']
print(re.findall(r'[A-Z]', text))      # ['H', 'W']
print(re.findall(r'[^a-z\\s]', text))  # ['H', 'W', '1', '2', '3']
\`\`\`

### Groups ( ) — Capture Karo
\`\`\`python
import re

# Date format: DD-MM-YYYY
date = "Aaj ki date hai 25-12-2024"

match = re.search(r'(\\d{2})-(\\d{2})-(\\d{4})', date)
if match:
    print("Full match:", match.group(0))   # 25-12-2024
    print("Day:", match.group(1))          # 25
    print("Month:", match.group(2))        # 12
    print("Year:", match.group(3))         # 2024
\`\`\`

### | — OR Operator
\`\`\`python
import re

text = "I love cats and dogs but not snakes"

# cats ya dogs dhundho
animals = re.findall(r'cats|dogs', text)
print(animals)  # ['cats', 'dogs']
\`\`\`

### Named Groups — Readable Code
\`\`\`python
import re

log = "ERROR 2024-01-15 Database connection failed"

pattern = r'(?P<level>\\w+) (?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<msg>.+)'
match = re.search(pattern, log)

if match:
    print("Level:", match.group('level'))   # ERROR
    print("Date:", match.group('date'))     # 2024-01-15
    print("Message:", match.group('msg'))   # Database connection...
\`\`\``,
      codeExample: `import re

# Indian mobile number validator
def validate_indian_mobile(number):
    # Indian mobile: starts with 6,7,8,9 followed by 9 digits
    pattern = r'^[6-9]\\d{9}$'
    cleaned = re.sub(r'[\\s\\-\\+91]', '', number)  # Remove spaces, dashes, +91
    
    if re.match(pattern, cleaned):
        return True, f"Valid Indian number: {cleaned}"
    return False, f"Invalid number: {number}"

test_numbers = [
    "9876543210",
    "+91 98765 43210",
    "08765432109",    # starts with 0 — invalid
    "1234567890",     # starts with 1 — invalid
    "7654-321-098",
]

for num in test_numbers:
    valid, msg = validate_indian_mobile(num)
    icon = "✅" if valid else "❌"
    print(f"{icon} {msg}")`,
      task: {
        description: 'Email validator banao using regex. Valid email rules: (1) letters/numbers/dots/underscores before @, (2) domain name after @, (3) dot ke baad 2-4 letter extension (like .com, .in, .org). Test karo 5 valid aur 5 invalid emails ke saath!',
        expectedOutput: null,
        hint: 'Pattern: r"^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,4}$" — ^ start, $ end anchors use karo.',
      },
      quiz: [
        {
          q: '[A-Za-z0-9] kya match karta hai?',
          options: ['Sirf uppercase letters', 'Sirf lowercase', 'Koi bhi letter ya digit', 'Sirf digits'],
          correct: 2,
          explanation: '[A-Za-z0-9] = A-Z uppercase + a-z lowercase + 0-9 digits — koi bhi alphanumeric character.',
        },
        {
          q: 'match.group(1) kya return karta hai?',
          options: ['Poora match', 'Pehli captured group', 'Doosri group', 'Index 1 ka character'],
          correct: 1,
          explanation: 'group(0) = full match, group(1) = pehla () group, group(2) = doosra () group.',
        },
        {
          q: 'r"^Hello$" kya match karega?',
          options: ['"Hello World"', '"Say Hello"', 'Sirf "Hello"', '"hello"'],
          correct: 2,
          explanation: '^ = start, $ = end. So ^Hello$ sirf exact string "Hello" match karega — kuch aur nahi.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w5-s3',
      title: 're.sub() aur re.split() — Text Modify Karna',
      emoji: '✂️',
      content: `## re.sub() — Pattern ko Replace Karo!

### re.sub() — Find & Replace on Steroids
\`\`\`python
import re

# Basic replace
text = "Hello   World   Python"
clean = re.sub(r'\\s+', ' ', text)  # Multiple spaces → single space
print(clean)  # "Hello World Python"

# Sensitive data chhupao
phone_text = "Call me at 9876543210 or 8765432109"
masked = re.sub(r'\\d{10}', 'XXXXXXXXXX', phone_text)
print(masked)  # "Call me at XXXXXXXXXX or XXXXXXXXXX"

# HTML tags hataao
html = "<h1>Hello</h1> <p>World</p>"
plain = re.sub(r'<[^>]+>', '', html)
print(plain)  # "Hello  World"
\`\`\`

### Function as Replacement
\`\`\`python
import re

# Har word ka pehla letter uppercase karo
def capitalize_word(match):
    return match.group().capitalize()

text = "hello world python programming"
result = re.sub(r'\\b\\w+\\b', capitalize_word, text)
print(result)  # "Hello World Python Programming"
\`\`\`

### re.split() — Pattern Pe Split Karo
\`\`\`python
import re

# Multiple delimiters se split karo
text = "apple,banana;cherry:mango|grape"
fruits = re.split(r'[,;:|]', text)
print(fruits)  # ['apple', 'banana', 'cherry', 'mango', 'grape']

# Whitespace se split (multiple spaces bhi handle karo)
sentence = "Hello   World    Python"
words = re.split(r'\\s+', sentence)
print(words)  # ['Hello', 'World', 'Python']
\`\`\`

### Practical — Data Cleaning
\`\`\`python
import re

def clean_data(text):
    # Extra whitespace hataao
    text = re.sub(r'\\s+', ' ', text).strip()
    # Special characters hataao (letters, digits, spaces raho)
    text = re.sub(r'[^\\w\\s]', '', text)
    # Multiple spaces again clean karo
    text = re.sub(r'\\s+', ' ', text)
    return text

messy = "  Hello!!!   World???   Python... is    GREAT!!! "
print(clean_data(messy))  # "Hello World Python is GREAT"
\`\`\``,
      codeExample: `import re

# Log file parser — real world use case!
log_data = """
2024-01-15 09:23:45 ERROR Database timeout after 30s
2024-01-15 09:24:12 INFO User rahul@gmail.com logged in
2024-01-15 09:25:01 WARNING Memory usage at 85%
2024-01-15 09:26:33 ERROR Connection refused: port 5432
2024-01-15 09:27:00 INFO File upload completed: 2.3MB
"""

# Pattern to extract log entries
pattern = r'(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2}) (\\w+) (.+)'

errors = []
warnings = []
info = []

for line in log_data.strip().split('\\n'):
    match = re.search(pattern, line)
    if match:
        date, time, level, msg = match.groups()
        entry = f"[{time}] {msg}"
        if level == 'ERROR': errors.append(entry)
        elif level == 'WARNING': warnings.append(entry)
        else: info.append(entry)

print(f"ERRORS ({len(errors)}):")
for e in errors: print(f"  {e}")
print(f"\\nWARNINGS ({len(warnings)}):")
for w in warnings: print(f"  {w}")`,
      task: {
        description: 'Text sanitizer function banao: (1) Phone numbers ko "***-***-****" se replace karo, (2) Email addresses ko "user@***.***" se replace karo, (3) Credit card numbers (16 digit groups) ko "****-****-****-****" se replace karo. Privacy protect karo!',
        expectedOutput: null,
        hint: 're.sub() use karo har replacement ke liye alag alag. Phone: r"\\d{10}", Email: r"[\\w.]+@[\\w.]+", CC: r"\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}"',
      },
      quiz: [
        {
          q: 're.sub(pattern, repl, text) kya karta hai?',
          options: ['Pattern dhundta hai', 'Pattern ko repl se replace karta hai', 'Pattern split karta hai', 'Pattern count karta hai'],
          correct: 1,
          explanation: 're.sub() = substitute — text mein pattern ko repl string se replace karta hai.',
        },
        {
          q: 're.split(r"[,;]", "a,b;c") kya return karega?',
          options: ["['a,b;c']", "['a', 'b', 'c']", "['a', ',', 'b', ';', 'c']", 'Error'],
          correct: 1,
          explanation: 'split() comma ya semicolon pe split karega — result: ["a", "b", "c"].',
        },
        {
          q: 're.sub(r"\\s+", " ", "hello   world") kya return karega?',
          options: ['"hello   world"', '"helloworld"', '"hello world"', 'Error'],
          correct: 2,
          explanation: '\\s+ = one or more whitespace. Multiple spaces ko single space se replace karo — "hello world".',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w5-s4',
      title: 'Week 5 Project — Form Validator',
      emoji: '🏆',
      content: `## Week 5 Project — Complete Form Validator!

Real websites jo form validation karte hain — wahi banao regex se!

### Kya Validate Karna Hai:
1. **Name** — sirf letters aur spaces, 2-50 chars
2. **Email** — valid format (user@domain.com)
3. **Phone** — Indian mobile (6-9 se start, 10 digits)
4. **Password** — 8+ chars, ek uppercase, ek digit, ek special char
5. **Pincode** — 6 digit Indian pincode
6. **Date of Birth** — DD/MM/YYYY format, valid age 13-120

### Architecture:
\`\`\`python
class FormValidator:
    def __init__(self):
        self.errors = []
    
    def validate_name(self, name): ...
    def validate_email(self, email): ...
    def validate_phone(self, phone): ...
    def validate_password(self, password): ...
    def validate_pincode(self, pin): ...
    def validate_dob(self, dob): ...
    def validate_all(self, form_data): ...
    def get_report(self): ...
\`\`\`

### Password Strength Check:
\`\`\`python
import re

def check_password_strength(password):
    checks = {
        'length': len(password) >= 8,
        'uppercase': bool(re.search(r'[A-Z]', password)),
        'lowercase': bool(re.search(r'[a-z]', password)),
        'digit': bool(re.search(r'\\d', password)),
        'special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password)),
    }
    score = sum(checks.values())
    strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score]
    return checks, strength
\`\`\`

**Is project ko complete karo — +200 XP! 🔥**`,
      codeExample: `import re
from datetime import datetime

class FormValidator:
    def __init__(self):
        self.errors = {}
    
    def validate_email(self, email):
        pattern = r'^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,6}$'
        if not re.match(pattern, email):
            self.errors['email'] = "Invalid email format"
            return False
        return True
    
    def validate_phone(self, phone):
        cleaned = re.sub(r'[\\s\\-\\+]', '', phone)
        cleaned = re.sub(r'^91', '', cleaned)
        pattern = r'^[6-9]\\d{9}$'
        if not re.match(pattern, cleaned):
            self.errors['phone'] = "Invalid Indian mobile number"
            return False
        return True
    
    def validate_password(self, pwd):
        issues = []
        if len(pwd) < 8: issues.append("8+ chars chahiye")
        if not re.search(r'[A-Z]', pwd): issues.append("ek uppercase letter chahiye")
        if not re.search(r'\\d', pwd): issues.append("ek digit chahiye")
        if not re.search(r'[!@#$%]', pwd): issues.append("ek special char (!@#$%) chahiye")
        if issues:
            self.errors['password'] = ", ".join(issues)
            return False
        return True

# Test karo
v = FormValidator()
print(v.validate_email("rahul@gmail.com"))   # True
print(v.validate_phone("+91 98765 43210"))   # True
print(v.validate_password("Pass@123"))       # True
print(v.errors)`,
      task: {
        description: 'Upar diya FormValidator complete karo — saare 6 validators implement karo (name, email, phone, password, pincode, DOB). Phir ek test_form() function likho jo ek complete registration form validate kare aur detailed error report de!',
        expectedOutput: null,
        hint: 'Name: r"^[A-Za-z ]{2,50}$", Pincode: r"^[1-9]\\d{5}$", DOB: r"^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$"',
      },
      quiz: [
        {
          q: 'r"^[6-9]\\d{9}$" kya validate karta hai?',
          options: ['Koi bhi 10 digit number', '6-9 se start hone wala 10 digit number', '6 ya 9 se start wala number', 'Sirf 6 digit number'],
          correct: 1,
          explanation: '^[6-9] = starts with 6,7,8, or 9. \\d{9} = followed by 9 more digits. $ = end. Total 10 digits.',
        },
        {
          q: 'Password mein uppercase check karne ka sahi pattern?',
          options: ['r"[A-Z]+"', 're.search(r"[A-Z]", pwd)', 'r"[a-z]"', 're.match(r"[A-Z]", pwd)'],
          correct: 1,
          explanation: 're.search() poori string mein dhundta hai. re.match() sirf start se match karta hai — password ke liye search sahi hai.',
        },
        {
          q: 're.sub(r"[\\s\\-\\+]", "", "+91 987-654-3210") kya dega?',
          options: ['"+91987-654-3210"', '"919876543210"', '"9876543210"', '"91 987 654 3210"'],
          correct: 1,
          explanation: 'Spaces, dashes, + hata dega: +91 987-654-3210 → 919876543210.',
        },
      ],
    },
  ],
};