/**
 * StudyEarn AI — Python Course Data
 * ─────────────────────────────────────────────────────────────
 * 12 weeks, ~4 sections per week = 48 sections
 * Each section has: theory content, code example, a "try it" task, and quiz questions
 *
 * Month 1 (Weeks 1-4):  Absolute Beginner
 * Month 2 (Weeks 5-8):  Intermediate Concepts
 * Month 3 (Weeks 9-12): Advanced + Real Projects
 */

export const PYTHON_COURSE = {
  language: 'python',
  languageName: 'Python Programming',
  emoji: '🐍',
  tagline: 'From Zero to Hero in 3 Months',
  totalWeeks: 12,
  difficulty: 'Beginner → Advanced',
  description: 'Python is the world\'s most popular language. Used in AI, web dev, data science, automation — yeh sab kuch Python se hota hai.',

  weeks: [
    // ═══════════════════════════════════════════════════════
    // MONTH 1 — ABSOLUTE BEGINNER
    // ═══════════════════════════════════════════════════════

    // WEEK 1
    {
      week: 1,
      title: 'Python Basics — Hello World!',
      description: 'Pehli baar Python likhoge! Basics se start karte hain.',
      xpReward: 100,
      sections: [
        {
          id: 'py-w1-s1',
          title: 'Python kya hai aur setup kaise karein',
          emoji: '🚀',
          content: `## Python kya hai?

Python ek programming language hai jo **bahut easy** hai English jaisi. Google, Netflix, Instagram — sabhi Python use karte hain!

### Kyun seekhein Python?
- Syntax bahut simple hai — almost English ki tarah
- Ek hi language mein AI, web, games sab bana sakte ho
- Jobs mein **sabse zyada demand** hai

### Python Print karna
Sabse pehla program hota hai "Hello World!" print karna:

\`\`\`python
print("Hello World!")
print("Mera naam Python hai!")
print("Main 3 months mein pro ban jaunga! 💪")
\`\`\`

**Output:**
\`\`\`
Hello World!
Mera naam Python hai!
Main 3 months mein pro ban jaunga! 💪
\`\`\`

### print() kya karta hai?
\`print()\` function screen pe kuch bhi dikhata hai. Jo bhi quotes ke beech likhoge — woh screen pe aayega!

### Pro Tip 🔥
Python mein CASE matter karta hai — \`print\` likhna sahi hai, \`Print\` ya \`PRINT\` likhna galat hai!`,
          codeExample: `# Yeh mera pehla Python program hai!
print("Namaste Duniya! 🌍")
print("Python bahut maza deta hai!")
print("3 months mein main Python pro ban jaunga!")`,
          task: {
            description: 'Apna naam, sheher aur favorite food — teeno alag alag lines mein print karo!',
            expectedOutput: null, // free-form task
            hint: 'Teen alag print() statements use karo — ek naam ke liye, ek sheher ke liye, ek food ke liye',
          },
          quiz: [
            {
              q: 'Python mein text print karne ke liye kaunsa function use karte hain?',
              options: ['display()', 'print()', 'show()', 'write()'],
              correct: 1,
              explanation: 'print() function Python ka built-in function hai jo output dikhata hai.',
            },
            {
              q: 'print("Hello") output kya hoga?',
              options: ['"Hello"', 'Hello', 'hello', 'HELLO'],
              correct: 1,
              explanation: 'print() quotes ke bahar wali text print karta hai — bina quotes ke.',
            },
            {
              q: 'Python mein case sensitive hai?',
              options: ['Haan', 'Nahi', 'Kabhi kabhi', 'Depend karta hai OS pe'],
              correct: 0,
              explanation: 'Haan! Python strictly case-sensitive hai. print aur Print different hain.',
            },
          ],
        },
        {
          id: 'py-w1-s2',
          title: 'Variables — Data Store Karna',
          emoji: '📦',
          content: `## Variables kya hote hain?

Variable ek **box** ki tarah hai jisme tum data store karte ho. Jaise tum phone mein contact save karte ho — variable bhi waise hi kaam karta hai!

### Variable banana
\`\`\`python
naam = "Rahul"
umar = 18
sheher = "Mumbai"

print(naam)
print(umar)
print(sheher)
\`\`\`

### Types of Data
Python mein teen main types hain:

| Type | Example | Kab use karein |
|------|---------|----------------|
| String (str) | \`"Hello"\` | Text ke liye |
| Integer (int) | \`25\` | Whole numbers |
| Float | \`9.5\` | Decimal numbers |

### Variables ko Mix karna
\`\`\`python
naam = "Priya"
score = 95.5

print("Student:", naam)
print("Score:", score)
print(naam, "ka score hai", score)
\`\`\`

**Output:**
\`\`\`
Student: Priya
Score: 95.5
Priya ka score hai 95.5
\`\`\`

### Rules for Variable Names 📝
- Sirf letters, numbers, underscore (_) allowed
- Number se start nahi ho sakta
- No spaces — \`my_name\` sahi, \`my name\` galat`,
          codeExample: `# Student info store karna
student_naam = "Arjun"
student_class = 10
percentage = 87.5

print("Naam:", student_naam)
print("Class:", student_class)
print("Percentage:", percentage, "%")`,
          task: {
            description: 'Apni info variables mein store karo: naam, age, favourite_subject, percentage. Phir saari info print karo!',
            expectedOutput: null,
            hint: '4 variables banao aur har ek ko print karo. String ke liye quotes, numbers ke liye direct value.',
          },
          quiz: [
            {
              q: 'Python mein variable kaise banate hain?',
              options: ['var naam = "Rahul"', 'naam = "Rahul"', 'let naam = "Rahul"', 'string naam = "Rahul"'],
              correct: 1,
              explanation: 'Python mein seedha naam = value likhte hain — koi keyword nahi chahiye!',
            },
            {
              q: 'Kaunsa variable name valid nahi hai?',
              options: ['my_name', 'name1', '_score', '2score'],
              correct: 3,
              explanation: 'Variable name number se start nahi ho sakta. "2score" invalid hai.',
            },
            {
              q: '"Hello" kis data type ka example hai?',
              options: ['Integer', 'Float', 'String', 'Boolean'],
              correct: 2,
              explanation: 'Quotes mein likha text String type hota hai.',
            },
          ],
        },
        {
          id: 'py-w1-s3',
          title: 'User Input lena — input()',
          emoji: '⌨️',
          content: `## User se Input kaise lein?

Abhi tak humne hardcode kiya tha. Ab user se data lete hain!

### input() function
\`\`\`python
naam = input("Apna naam batao: ")
print("Hello", naam, "! Welcome to Python! 🎉")
\`\`\`

Jab yeh run hoga — program ruk jayega aur user se naam maangega!

### Numbers as Input
input() hamesha **String** return karta hai. Number chahiye toh convert karo:

\`\`\`python
umar = input("Tumhari age kya hai? ")
umar = int(umar)  # String ko Integer mein convert karo

agla_saal = umar + 1
print("Agle saal tum", agla_saal, "saal ke hoge!")
\`\`\`

### Shortcut — Ek line mein:
\`\`\`python
umar = int(input("Age: "))
score = float(input("Score: "))
\`\`\`

### Practical Example:
\`\`\`python
naam = input("Naam: ")
sheher = input("Sheher: ")
school = input("School ka naam: ")

print("\\n=== Student Profile ===")
print("Naam:", naam)
print("Sheher:", sheher)
print("School:", school)
\`\`\``,
          codeExample: `# Simple calculator — user se numbers lo
num1 = float(input("Pehla number: "))
num2 = float(input("Doosra number: "))

total = num1 + num2
print("Dono ka sum:", total)`,
          task: {
            description: 'User se naam aur favourite number lo. Phir print karo: "[naam] ka favourite number [number] hai aur uska double [2x number] hai!"',
            expectedOutput: null,
            hint: 'input() se naam lo (string), int(input()) se number lo, phir number * 2 calculate karo.',
          },
          quiz: [
            {
              q: 'input() function kaunsa type return karta hai?',
              options: ['Integer', 'Float', 'String', 'Boolean'],
              correct: 2,
              explanation: 'input() hamesha String return karta hai — chahe user number type kare ya text.',
            },
            {
              q: 'User se integer input lene ka sahi tarika kaunsa hai?',
              options: ['input(int("Age: "))', 'int(input("Age: "))', 'integer(input("Age: "))', 'input("Age: ", int)'],
              correct: 1,
              explanation: 'int() bahar aur input() andar — pehle input() se string aata hai, phir int() convert karta hai.',
            },
            {
              q: 'print("Hello", naam) mein naam kya hai?',
              options: ['String literal', 'Variable', 'Function', 'Keyword'],
              correct: 1,
              explanation: 'Quotes ke bahar likha naam ek variable hai jisme value stored hai.',
            },
          ],
        },
        {
          id: 'py-w1-s4',
          title: 'Basic Math — Python Calculator',
          emoji: '🧮',
          content: `## Python mein Math Operations

Python ek powerful calculator hai!

### Basic Operators
\`\`\`python
a = 20
b = 6

print(a + b)   # Addition:       26
print(a - b)   # Subtraction:    14
print(a * b)   # Multiplication: 120
print(a / b)   # Division:       3.333...
print(a // b)  # Floor Division: 3 (decimal hata do)
print(a % b)   # Modulus:        2 (remainder)
print(a ** b)  # Power:          64000000
\`\`\`

### Modulus (%) — Super Useful!
Remainder nikalta hai — **even/odd check** ke liye use hota hai:
\`\`\`python
number = 17
remainder = number % 2

if remainder == 0:
    print(number, "even hai")
else:
    print(number, "odd hai")
\`\`\`

### f-strings — Clean Printing
\`\`\`python
naam = "Vikram"
marks = 450
total = 500
percentage = (marks / total) * 100

print(f"{naam} ka result:")
print(f"Marks: {marks}/{total}")
print(f"Percentage: {percentage:.2f}%")
\`\`\`

Output:
\`\`\`
Vikram ka result:
Marks: 450/500
Percentage: 90.00%
\`\`\``,
          codeExample: `# Percentage calculator
obtained = float(input("Marks obtained: "))
total = float(input("Total marks: "))

percentage = (obtained / total) * 100
print(f"\\nPercentage: {percentage:.2f}%")

if percentage >= 90:
    print("Grade: A+ 🏆 Excellent!")
elif percentage >= 75:
    print("Grade: A — Great job!")
elif percentage >= 60:
    print("Grade: B — Good effort!")
else:
    print("Grade: C — Keep trying! 💪")`,
          task: {
            description: 'Simple EMI calculator banao: user se loan amount, interest rate (%), aur years lo. Monthly EMI calculate karo (formula: EMI = (amount * rate/1200) / (1 - (1 + rate/1200)^(-months))). Ya simple karo: total = amount + (amount * rate * years / 100), monthly = total / (years * 12)',
            expectedOutput: null,
            hint: 'Simplified version: total_amount = loan + (loan * rate * years / 100), phir monthly = total_amount / (years * 12)',
          },
          quiz: [
            {
              q: '17 % 5 ka output kya hoga?',
              options: ['3', '2', '3.4', '0'],
              correct: 1,
              explanation: '17 divide by 5 = 3 remainder 2. Modulus (%) sirf remainder deta hai.',
            },
            {
              q: 'f-string mein variable kaise use karte hain?',
              options: ['f"Hello {naam}"', 'f"Hello naam"', '"Hello" + naam', 'f("Hello", naam)'],
              correct: 0,
              explanation: 'f-string mein curly braces {} ke andar variable naam likhte hain.',
            },
            {
              q: '10 // 3 ka result kya hoga?',
              options: ['3.33', '3', '4', '1'],
              correct: 1,
              explanation: 'Floor division (//) decimal part hata deta hai — 10/3 = 3.33, floor = 3.',
            },
          ],
        },
      ],
    },

    // WEEK 2
    {
      week: 2,
      title: 'Decisions — If/Else Conditions',
      description: 'Python ko sochna sikhao — conditions aur decision making!',
      xpReward: 120,
      sections: [
        {
          id: 'py-w2-s1',
          title: 'if / elif / else — Decision Making',
          emoji: '🤔',
          content: `## Conditions — Python ko Sochna Sikhao!

Real life mein hum conditions check karte hain: "Agar rain ho toh umbrella lao." Python bhi yahi karta hai!

### Basic if-else
\`\`\`python
temperature = 38

if temperature > 37.5:
    print("🤒 Fever hai! Doctor ke paas jao.")
else:
    print("✅ Temperature normal hai.")
\`\`\`

### elif — Multiple Conditions
\`\`\`python
score = int(input("Score batao (0-100): "))

if score >= 90:
    print("🏆 Outstanding! A+ Grade")
elif score >= 80:
    print("🎉 Excellent! A Grade")
elif score >= 70:
    print("👍 Good! B Grade")
elif score >= 60:
    print("📚 Average. C Grade")
else:
    print("💪 Mehnat karo. Fail")
\`\`\`

### Comparison Operators
| Operator | Matlab |
|----------|--------|
| == | equal to |
| != | not equal |
| > | greater than |
| < | less than |
| >= | greater or equal |
| <= | less or equal |

### Logical Operators
\`\`\`python
umar = 20
citizen = True

# and — dono conditions true honi chahiye
if umar >= 18 and citizen == True:
    print("Vote de sakte ho! 🗳️")

# or — koi bhi ek true ho
if umar < 13 or umar > 60:
    print("Special discount!")
\`\`\``,
          codeExample: `# Login system banao
correct_username = "admin"
correct_password = "python123"

username = input("Username: ")
password = input("Password: ")

if username == correct_username and password == correct_password:
    print("✅ Login successful! Welcome!")
elif username == correct_username:
    print("❌ Wrong password!")
else:
    print("❌ Username not found!")`,
          task: {
            description: 'Movie ticket price calculator: Adult (18+) = ₹200, Senior (60+) = ₹100, Child (under 18) = ₹120. User se age lo aur ticket price print karo. Bonus: Weekend pe ₹50 extra — user se weekday/weekend bhi poocho!',
            expectedOutput: null,
            hint: 'Pehle age check karo elif chain se, phir ticket price set karo variable mein, phir weekday/weekend ke liye extra add karo.',
          },
          quiz: [
            {
              q: 'Python mein "equal to" check karne ka operator kaunsa hai?',
              options: ['=', '==', '===', 'equals'],
              correct: 1,
              explanation: '= assignment ke liye hai, == comparison ke liye. Confusion mat karna!',
            },
            {
              q: '"and" operator kab True return karta hai?',
              options: ['Koi bhi ek true ho', 'Dono conditions true hon', 'Dono false hon', 'Kabhi nahi'],
              correct: 1,
              explanation: '"and" sirf tab True hota hai jab DONO conditions True hon.',
            },
            {
              q: 'if ke baad kya likhte hain Python mein?',
              options: ['{}', 'then', ':', 'do'],
              correct: 2,
              explanation: 'Python mein if condition ke baad colon (:) likhte hain, aur body indented hoti hai.',
            },
          ],
        },
        {
          id: 'py-w2-s2',
          title: 'Loops — Kaam Repeat Karna',
          emoji: '🔄',
          content: `## Loops — Boring Kaam Machine Se Karao!

100 baar "Hello" print karna hai? Loop se ek line mein hoga!

### for loop — Count karke repeat karo
\`\`\`python
# 5 baar print karo
for i in range(5):
    print(f"Loop number: {i}")
\`\`\`
Output:
\`\`\`
Loop number: 0
Loop number: 1
Loop number: 2
Loop number: 3
Loop number: 4
\`\`\`

### range() samjho
\`\`\`python
range(5)       # 0, 1, 2, 3, 4
range(1, 6)    # 1, 2, 3, 4, 5
range(1, 10, 2) # 1, 3, 5, 7, 9 (step=2)
\`\`\`

### while loop — Condition true ho tab tak chalo
\`\`\`python
count = 1
while count <= 5:
    print(f"Count: {count}")
    count += 1  # count = count + 1
\`\`\`

### Practical — Tables Print Karo
\`\`\`python
num = int(input("Kaunsi table chahiye? "))
print(f"\\n=== {num} ki Table ===")

for i in range(1, 11):
    result = num * i
    print(f"{num} × {i} = {result}")
\`\`\`

### break aur continue
\`\`\`python
# break — loop rok do
for i in range(10):
    if i == 5:
        break  # 5 aate hi stop
    print(i)  # 0 1 2 3 4

# continue — ek step skip karo
for i in range(10):
    if i % 2 == 0:
        continue  # even skip karo
    print(i)  # 1 3 5 7 9
\`\`\``,
          codeExample: `# Multiplication table generator
num = int(input("Table of: "))

print(f"\\n{'='*25}")
print(f"   Table of {num}")
print(f"{'='*25}")

for i in range(1, 13):
    print(f"  {num:2d} × {i:2d} = {num*i:3d}")

print(f"{'='*25}")`,
          task: {
            description: 'Number guessing game banao! Computer 1-100 ke beech ek secret number rakhe (hardcode karo pehle). User guess kare. Agar zyada ho toh "Kam karo!", kam ho toh "Zyada karo!", sahi ho toh "Sahi! X attempts mein guessa!" — while loop use karo!',
            expectedOutput: null,
            hint: 'secret = 42 set karo. attempts counter rakho. while True loop chalao. input lo, compare karo, break karo jab sahi ho.',
          },
          quiz: [
            {
              q: 'range(2, 10, 3) kya generate karega?',
              options: ['2, 5, 8', '2, 4, 6, 8, 10', '3, 6, 9', '2, 3, 4...9'],
              correct: 0,
              explanation: 'Start=2, Stop=10 (exclusive), Step=3. So: 2, 5, 8.',
            },
            {
              q: 'Loop se bahar nikalne ke liye kaunsa keyword use karte hain?',
              options: ['exit', 'stop', 'break', 'end'],
              correct: 2,
              explanation: '"break" statement loop ko turant rok deta hai.',
            },
            {
              q: 'while loop kab chalta rehta hai?',
              options: ['Ek baar', 'Hamesha', 'Jab tak condition True ho', 'Jab tak condition False ho'],
              correct: 2,
              explanation: 'while loop condition True rehne tak chalta hai — False hote hi ruk jaata hai.',
            },
          ],
        },
        {
          id: 'py-w2-s3',
          title: 'Lists — Data Collection Banana',
          emoji: '📋',
          content: `## Lists — Multiple Values Ek Jagah!

Variable mein ek value. List mein **multiple values** — jaise student roster!

### List banana
\`\`\`python
# Empty list
students = []

# Values ke saath
fruits = ["apple", "mango", "banana", "grapes"]
marks = [85, 92, 78, 95, 88]
mixed = ["Rahul", 18, 9.5, True]  # Mix bhi ho sakta hai!
\`\`\`

### List Access — Indexing
\`\`\`python
fruits = ["apple", "mango", "banana"]
#           0         1        2      (index)

print(fruits[0])   # apple (pehla)
print(fruits[1])   # mango (doosra)
print(fruits[-1])  # banana (aakhri)
\`\`\`

### List Operations
\`\`\`python
marks = [85, 92, 78]

marks.append(95)        # End mein add karo → [85,92,78,95]
marks.insert(0, 100)    # Position 0 pe insert → [100,85,92,78,95]
marks.remove(78)        # Value remove karo → [100,85,92,95]
marks.pop()             # Aakhri remove karo
marks.sort()            # Sort karo
marks.reverse()         # Ulta karo

print(len(marks))       # Length
print(max(marks))       # Maximum value
print(min(marks))       # Minimum value
print(sum(marks))       # Total
\`\`\`

### List Loop
\`\`\`python
students = ["Rahul", "Priya", "Arjun", "Neha"]

for student in students:
    print(f"Hello {student}! 👋")
\`\`\``,
          codeExample: `# Student marks manager
students = []
marks = []

n = int(input("Kitne students: "))

for i in range(n):
    name = input(f"Student {i+1} naam: ")
    mark = float(input(f"{name} ke marks: "))
    students.append(name)
    marks.append(mark)

print("\\n=== Results ===")
for i in range(len(students)):
    status = "PASS ✅" if marks[i] >= 40 else "FAIL ❌"
    print(f"{students[i]}: {marks[i]} — {status}")

print(f"\\nClass Average: {sum(marks)/len(marks):.2f}")
print(f"Highest: {max(marks)} ({students[marks.index(max(marks))]})")`,
          task: {
            description: '5 numbers user se lo list mein. Phir print karo: original list, sorted list, reversed list, sum, average, max aur min.',
            expectedOutput: null,
            hint: 'Loop mein 5 baar input() se numbers lo aur append() karo. Phir sort(), reverse() use karo. sum()/len() se average nikalo.',
          },
          quiz: [
            {
              q: 'list = [10, 20, 30] mein list[-1] kya return karega?',
              options: ['10', '20', '30', 'Error'],
              correct: 2,
              explanation: 'Negative index list ke end se count karta hai. -1 matlab aakhri element = 30.',
            },
            {
              q: 'List mein nayi value end mein add karne ke liye?',
              options: ['list.add()', 'list.push()', 'list.append()', 'list.insert()'],
              correct: 2,
              explanation: 'append() end mein add karta hai. insert() specific position pe.',
            },
            {
              q: 'len([1, 2, 3, 4, 5]) kya return karega?',
              options: ['4', '5', '6', '0'],
              correct: 1,
              explanation: 'len() list ki length return karta hai — total elements ki count = 5.',
            },
          ],
        },
        {
          id: 'py-w2-s4',
          title: 'Functions — Reusable Code Banana',
          emoji: '⚙️',
          content: `## Functions — Code Ek Baar Likho, Baar Baar Use Karo!

Function ek recipe ki tarah hai — ek baar likho, jab chahiye tab use karo!

### Function define karna
\`\`\`python
def greet():
    print("Namaste! 🙏")
    print("Welcome to Python!")

# Function call karo
greet()
greet()
greet()  # 3 baar same code run hoga!
\`\`\`

### Parameters — Input dena Function ko
\`\`\`python
def greet(naam):
    print(f"Namaste {naam}! 🙏")
    print(f"Python seekhna kaisa lag raha hai, {naam}?")

greet("Rahul")
greet("Priya")
greet("Arjun")
\`\`\`

### Return — Function se Value Wapas Lena
\`\`\`python
def add(a, b):
    result = a + b
    return result

total = add(10, 20)
print(f"10 + 20 = {total}")  # 30

# Directly use bhi kar sakte ho
print(add(5, 7))  # 12
\`\`\`

### Default Parameters
\`\`\`python
def greet(naam, language="Python"):
    print(f"Hello {naam}! {language} seekh rahe ho? 🔥")

greet("Rahul")              # Hello Rahul! Python seekh rahe ho?
greet("Priya", "JavaScript") # Hello Priya! JavaScript seekh rahe ho?
\`\`\`

### Practical Example — Calculator Function
\`\`\`python
def calculate(a, b, operation):
    if operation == "+": return a + b
    elif operation == "-": return a - b
    elif operation == "*": return a * b
    elif operation == "/": return a / b if b != 0 else "Error: Divide by zero!"
    else: return "Invalid operation"

print(calculate(10, 5, "+"))  # 15
print(calculate(20, 4, "/"))  # 5.0
\`\`\``,
          codeExample: `# BMI Calculator function
def calculate_bmi(weight_kg, height_m):
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 2)

def get_category(bmi):
    if bmi < 18.5:
        return "Underweight 😟"
    elif bmi < 25:
        return "Normal ✅"
    elif bmi < 30:
        return "Overweight ⚠️"
    else:
        return "Obese 🔴"

weight = float(input("Weight (kg): "))
height = float(input("Height (meters): "))

bmi = calculate_bmi(weight, height)
category = get_category(bmi)

print(f"\\nBMI: {bmi}")
print(f"Category: {category}")`,
          task: {
            description: 'Temperature converter functions banao: celsius_to_fahrenheit(c), fahrenheit_to_celsius(f), celsius_to_kelvin(c). Formulas: F = (C × 9/5) + 32, K = C + 273.15. User se temperature aur unit lo, phir dono conversions print karo!',
            expectedOutput: null,
            hint: 'Teen alag functions banao return ke saath. Main code mein user se input lo aur sahi function call karo.',
          },
          quiz: [
            {
              q: 'Function define karne ka keyword kya hai?',
              options: ['function', 'func', 'def', 'define'],
              correct: 2,
              explanation: 'Python mein "def" keyword se function define karte hain.',
            },
            {
              q: 'Function se value return karne ke liye?',
              options: ['send', 'output', 'return', 'give'],
              correct: 2,
              explanation: '"return" statement function se value wapas bhejta hai caller ko.',
            },
            {
              q: 'Default parameter kya karta hai?',
              options: ['Parameter mandatory banata hai', 'Parameter optional banata hai', 'Parameter delete karta hai', 'Error deta hai'],
              correct: 1,
              explanation: 'Default value dene se parameter optional ho jaata hai — call karte waqt nahi dena padta.',
            },
          ],
        },
      ],
    },

    // WEEK 3
    {
      week: 3,
      title: 'Strings & Dictionaries',
      description: 'Text manipulation aur key-value data structures seekhein',
      xpReward: 130,
      sections: [
        {
          id: 'py-w3-s1',
          title: 'String Methods — Text Manipulation',
          emoji: '✂️',
          content: `## Strings — Text ke Saath Khelna!

Python mein strings bahut powerful hain. Unhe manipulate karna bahut asaan hai.

### Important String Methods
\`\`\`python
text = "  Hello Python World!  "

print(text.strip())      # "Hello Python World!" — spaces hata do
print(text.upper())      # "  HELLO PYTHON WORLD!  "
print(text.lower())      # "  hello python world!  "
print(text.title())      # "  Hello Python World!  "

sentence = "Python is amazing"
print(sentence.replace("amazing", "awesome"))
print(sentence.split(" "))  # ['Python', 'is', 'amazing']
print(len(sentence))         # 18
print(sentence.count("n"))   # 2
print(sentence.startswith("Python"))  # True
print(sentence.find("is"))   # 7 (index)
\`\`\`

### String Slicing
\`\`\`python
name = "StudyEarn"
#       012345678

print(name[0:5])    # Study (0 to 4)
print(name[5:])     # Earn  (5 to end)
print(name[:5])     # Study (start to 4)
print(name[-4:])    # Earn  (last 4)
print(name[::-1])   # nraEyduS (reverse!)
\`\`\`

### f-strings Advanced
\`\`\`python
naam = "rahul kumar"
marks = 456
total = 500

# Clean formatting
print(f"{naam.title()}")         # Rahul Kumar
print(f"{marks}/{total}")        # 456/500
print(f"{marks/total*100:.1f}%") # 91.2%
print(f"{'='*30}")               # ====...==== (30 equal signs)
\`\`\``,
          codeExample: `# Username validator
def validate_username(username):
    username = username.strip()
    
    if len(username) < 3:
        return False, "Too short! Minimum 3 characters."
    if len(username) > 20:
        return False, "Too long! Maximum 20 characters."
    if not username.replace("_", "").isalnum():
        return False, "Only letters, numbers, underscore allowed!"
    if username[0].isdigit():
        return False, "Cannot start with a number!"
    
    return True, f"Username '{username}' is valid! ✅"

user = input("Enter username: ")
valid, message = validate_username(user)
print(message)`,
          task: {
            description: 'Password strength checker banao. User se password lo. Check karo: length (8+), uppercase letter hai, lowercase hai, digit hai, special char (@#$! etc) hai. Har check ke liye score +1. "Weak/Medium/Strong/Very Strong" print karo.',
            expectedOutput: null,
            hint: 'any(c.isupper() for c in password) uppercase check karta hai. any(c.isdigit() for c in password) digit check karta hai.',
          },
          quiz: [
            {
              q: '"hello world".title() kya return karega?',
              options: ['HELLO WORLD', 'Hello World', 'hello world', 'Hello world'],
              correct: 1,
              explanation: 'title() har word ka pehla letter uppercase karta hai.',
            },
            {
              q: '"python"[::-1] kya hoga?',
              options: ['python', 'nohtyp', 'error', 'p'],
              correct: 1,
              explanation: '[::-1] string ko reverse karta hai — step -1 matlab ulta chalna.',
            },
            {
              q: '"Hello Python".split() kya return karega?',
              options: ['"Hello", "Python"', "['Hello', 'Python']", 'Hello Python', 'Error'],
              correct: 1,
              explanation: 'split() string ko spaces par split karke list return karta hai.',
            },
          ],
        },
        {
          id: 'py-w3-s2',
          title: 'Dictionaries — Key-Value Data',
          emoji: '📚',
          content: `## Dictionaries — Real World Data Store Karna!

Dictionary ek actual dictionary jaisa hai — word: definition (key: value)!

### Dictionary banana
\`\`\`python
# Student record
student = {
    "naam": "Rahul Kumar",
    "age": 18,
    "marks": 92.5,
    "city": "Delhi",
    "hobbies": ["cricket", "coding", "music"]
}

print(student["naam"])    # Rahul Kumar
print(student["marks"])   # 92.5
print(student["hobbies"]) # ['cricket', 'coding', 'music']
\`\`\`

### Dictionary Methods
\`\`\`python
person = {"naam": "Priya", "age": 20}

# Add/Update
person["email"] = "priya@gmail.com"
person["age"] = 21  # Update existing

# Access safely
city = person.get("city", "Unknown")  # KeyError nahi aayega!

# Delete
del person["email"]
removed = person.pop("age")

# Iterate
for key, value in person.items():
    print(f"{key}: {value}")

print(person.keys())    # all keys
print(person.values())  # all values
\`\`\`

### Practical — Phone Book
\`\`\`python
contacts = {
    "Rahul": "9876543210",
    "Priya": "9123456789",
    "Arjun": "9000000000"
}

name = input("Kaun ka number chahiye? ")

if name in contacts:
    print(f"{name} ka number: {contacts[name]}")
else:
    print(f"{name} contacts mein nahi hai!")
\`\`\``,
          codeExample: `# Student grade book
grade_book = {}

n = int(input("Students count: "))
for i in range(n):
    name = input(f"Student {i+1}: ")
    marks = float(input(f"Marks: "))
    grade_book[name] = marks

print("\\n=== Grade Report ===")
for name, marks in grade_book.items():
    if marks >= 90: grade = "A+"
    elif marks >= 80: grade = "A"
    elif marks >= 70: grade = "B"
    elif marks >= 60: grade = "C"
    else: grade = "F"
    print(f"{name}: {marks} → Grade {grade}")`,
          task: {
            description: 'Mini shopping cart banao using dictionary. Items aur price hardcode karo (5 items). User item name aur quantity lo, cart mein add karo. "done" type karne par total bill print karo itemwise aur grand total.',
            expectedOutput: null,
            hint: 'menu = {"apple": 50, "mango": 80} type dictionary banao. cart = {} empty cart rakho. Loop mein input lo, cart mein add karo.',
          },
          quiz: [
            {
              q: 'Dictionary mein value access karne ka sahi tarika?',
              options: ['dict.key', 'dict[key]', 'dict->key', 'dict.get[key]'],
              correct: 1,
              explanation: 'dict[key] se value access karte hain. dict.get(key) bhi use kar sakte hain safely.',
            },
            {
              q: '"key" in dict kya check karta hai?',
              options: ['Value exist karta hai ya nahi', 'Key exist karta hai ya nahi', 'Dictionary empty hai ya nahi', 'Key ka type'],
              correct: 1,
              explanation: '"in" operator dictionary mein key ki existence check karta hai.',
            },
            {
              q: 'dict.items() kya return karta hai?',
              options: ['Sirf keys', 'Sirf values', 'Key-value pairs', 'Dictionary length'],
              correct: 2,
              explanation: 'items() (key, value) tuples ki list return karta hai — for loop mein use hota hai.',
            },
          ],
        },
        {
          id: 'py-w3-s3',
          title: 'File Handling — Data Save Karna',
          emoji: '💾',
          content: `## Files — Data Permanently Save Karna!

Program band hone par data save rehna chahiye? Files use karo!

### File Write karna
\`\`\`python
# 'w' = write mode (naya file ya overwrite)
with open("notes.txt", "w") as file:
    file.write("Meri pehli Python file!\\n")
    file.write("Python bahut maza deta hai!\\n")

print("File save ho gayi! ✅")
\`\`\`

### File Read karna
\`\`\`python
with open("notes.txt", "r") as file:
    content = file.read()   # Sab kuch ek saath
    print(content)

# Line by line
with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())
\`\`\`

### Append — File mein Add karna
\`\`\`python
# 'a' = append mode (existing file ke end mein add karo)
with open("notes.txt", "a") as file:
    file.write("Naya note add kiya!\\n")
\`\`\`

### Practical — Student Database
\`\`\`python
import json  # JSON format ke liye

def save_students(students):
    with open("students.json", "w") as f:
        json.dump(students, f, indent=2)

def load_students():
    try:
        with open("students.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

students = load_students()
naam = input("New student naam: ")
marks = float(input("Marks: "))
students[naam] = marks
save_students(students)
print(f"{naam} saved! Total students: {len(students)}")
\`\`\``,
          codeExample: `# Simple diary app
import datetime

def add_entry(text):
    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    with open("diary.txt", "a") as f:
        f.write(f"\\n[{date}]\\n{text}\\n{'─'*40}")
    print("Entry saved! ✅")

def read_diary():
    try:
        with open("diary.txt", "r") as f:
            print(f.read())
    except FileNotFoundError:
        print("Diary empty hai! Kuch likho pehle.")

while True:
    choice = input("\\n1. Write  2. Read  3. Exit: ")
    if choice == "1":
        entry = input("Aaj kya hua: ")
        add_entry(entry)
    elif choice == "2":
        read_diary()
    elif choice == "3":
        break`,
          task: {
            description: 'To-do list app banao with file storage. User tasks add kar sake, list dekh sake, task complete mark kar sake (❌ se ✅), aur program band karke dobara open karne par tasks remain karein!',
            expectedOutput: null,
            hint: 'tasks ko list mein rakho aur JSON se save/load karo. Har task ek dict ho: {"task": "...", "done": False}.',
          },
          quiz: [
            {
              q: 'File append mode ke liye kaunsa character use karte hain?',
              options: ["'w'", "'r'", "'a'", "'x'"],
              correct: 2,
              explanation: "'a' append mode hai — existing file ke end mein add karta hai bina delete kiye.",
            },
            {
              q: '"with open()" ka faida kya hai?',
              options: ['Fast hota hai', 'File automatically close ho jaata hai', 'Large files handle karta hai', 'Errors nahi aate'],
              correct: 1,
              explanation: '"with" block ke baad file automatically close ho jaata hai — manually close nahi karna padta.',
            },
            {
              q: 'JSON file save karne ke liye kaunsa function?',
              options: ['json.write()', 'json.save()', 'json.dump()', 'json.store()'],
              correct: 2,
              explanation: 'json.dump() Python object ko JSON format mein file mein likhta hai.',
            },
          ],
        },
        {
          id: 'py-w3-s4',
          title: 'Error Handling — Crash se Bacho!',
          emoji: '🛡️',
          content: `## Error Handling — Professional Code Likhna!

Program crash ho toh user ko achha nahi lagta. Errors handle karo gracefully!

### try-except
\`\`\`python
try:
    num = int(input("Number: "))
    result = 100 / num
    print(f"100 / {num} = {result}")
except ValueError:
    print("❌ Invalid! Number enter karo text nahi.")
except ZeroDivisionError:
    print("❌ Zero se divide nahi kar sakte!")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
\`\`\`

### else aur finally
\`\`\`python
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("❌ File nahi mili!")
else:
    print("✅ File successfully read!")
    print(content)
finally:
    print("(Yeh hamesha run hoga)")
    # Cleanup code yahan
\`\`\`

### Custom Errors Raise Karna
\`\`\`python
def check_age(age):
    if age < 0:
        raise ValueError("Age negative nahi ho sakti!")
    if age > 150:
        raise ValueError("Itna bada age? Sure ho?")
    return f"Age {age} valid hai ✅"

try:
    print(check_age(-5))
except ValueError as e:
    print(f"Error: {e}")
\`\`\`

### Robust Input Loop
\`\`\`python
while True:
    try:
        age = int(input("Age batao: "))
        if age < 0 or age > 120:
            raise ValueError("Invalid range")
        break  # Valid input mila, loop tod do
    except ValueError:
        print("❌ Valid age batao (0-120). Try again!")

print(f"Age recorded: {age} ✅")
\`\`\``,
          codeExample: `# Safe calculator with error handling
def safe_calculator():
    while True:
        try:
            a = float(input("First number: "))
            op = input("Operator (+, -, *, /): ").strip()
            b = float(input("Second number: "))
            
            if op == "+": result = a + b
            elif op == "-": result = a - b
            elif op == "*": result = a * b
            elif op == "/":
                if b == 0:
                    raise ZeroDivisionError("Zero se divide nahi!")
                result = a / b
            else:
                raise ValueError(f"Invalid operator: {op}")
            
            print(f"Result: {a} {op} {b} = {result:.4f} ✅")
            
        except ValueError as e:
            print(f"❌ Invalid input: {e}")
        except ZeroDivisionError as e:
            print(f"❌ Math error: {e}")
        
        again = input("\\nAur calculate? (y/n): ")
        if again.lower() != 'y':
            break

safe_calculator()`,
          task: {
            description: 'Robust age calculator banao. User se DOB lo (YYYY-MM-DD format). Calculate karo exact age in years, months, days. Handle karo: wrong format, future date, invalid month/day. Use datetime module!',
            expectedOutput: null,
            hint: 'from datetime import datetime. datetime.strptime(dob, "%Y-%m-%d") se parse karo. today - birth_date se timedelta milega. try-except mein ValueError catch karo.',
          },
          quiz: [
            {
              q: 'try-except mein "finally" block kab run hota hai?',
              options: ['Sirf success pe', 'Sirf error pe', 'Hamesha — success aur error dono pe', 'Kabhi nahi'],
              correct: 2,
              explanation: '"finally" block hamesha run hota hai — chahe error aaye ya na aaye. Cleanup ke liye perfect!',
            },
            {
              q: 'ZeroDivisionError kab aata hai?',
              options: ['Invalid string', 'Zero se divide karne par', 'File na milne par', 'Memory full hone par'],
              correct: 1,
              explanation: 'Kisi bhi number ko 0 se divide karne par ZeroDivisionError aata hai.',
            },
            {
              q: '"raise" keyword kya karta hai?',
              options: ['Error ignore karta hai', 'Manually error throw karta hai', 'Program restart karta hai', 'Error log karta hai'],
              correct: 1,
              explanation: '"raise" se hum apni marzi ka error manually throw kar sakte hain.',
            },
          ],
        },
      ],
    },

    // WEEK 4 (abbreviated for space — same pattern continues)
    {
      week: 4,
      title: 'OOP — Object Oriented Programming',
      description: 'Classes aur objects se real-world problems model karna',
      xpReward: 150,
      sections: [
        {
          id: 'py-w4-s1',
          title: 'Classes aur Objects — OOP Basics',
          emoji: '🏗️',
          content: `## OOP — Real World Ko Code Mein Laao!

OOP matlab har cheez ek "object" hai — jaise real life mein!

### Class banana
\`\`\`python
class Student:
    def __init__(self, naam, marks):
        self.naam = naam      # Instance variable
        self.marks = marks
        self.grade = self._calculate_grade()
    
    def _calculate_grade(self):
        if self.marks >= 90: return "A+"
        elif self.marks >= 80: return "A"
        elif self.marks >= 70: return "B"
        else: return "C"
    
    def introduce(self):
        print(f"Main {self.naam} hun. Mera grade {self.grade} hai!")
    
    def study(self, hours):
        self.marks = min(100, self.marks + hours * 2)
        print(f"{self.naam} ne {hours} ghante padha. New marks: {self.marks}")

# Object banana
s1 = Student("Rahul", 75)
s2 = Student("Priya", 92)

s1.introduce()   # Main Rahul hun. Mera grade B hai!
s2.introduce()   # Main Priya hun. Mera grade A+ hai!

s1.study(5)      # Rahul ne 5 ghante padha. New marks: 85
\`\`\`

### Inheritance — Properties Inherit Karna
\`\`\`python
class Person:
    def __init__(self, naam, age):
        self.naam = naam
        self.age = age
    
    def greet(self):
        print(f"Namaste! Main {self.naam} hun, {self.age} saal ka.")

class Teacher(Person):   # Person se inherit kar raha hai
    def __init__(self, naam, age, subject):
        super().__init__(naam, age)  # Parent ka __init__ call karo
        self.subject = subject
    
    def teach(self):
        print(f"{self.naam} {self.subject} padha rahe hain!")

t = Teacher("Mr. Sharma", 35, "Python")
t.greet()   # Inherited method!
t.teach()
\`\`\``,
          codeExample: `# Bank Account simulation
class BankAccount:
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self.__balance = initial_balance  # Private!
        self.transactions = []
    
    def deposit(self, amount):
        if amount <= 0:
            print("❌ Invalid amount!")
            return
        self.__balance += amount
        self.transactions.append(f"+{amount}")
        print(f"✅ ₹{amount} deposited. Balance: ₹{self.__balance}")
    
    def withdraw(self, amount):
        if amount > self.__balance:
            print("❌ Insufficient balance!")
            return
        self.__balance -= amount
        self.transactions.append(f"-{amount}")
        print(f"✅ ₹{amount} withdrawn. Balance: ₹{self.__balance}")
    
    def get_balance(self):
        return self.__balance

account = BankAccount("Rahul", 1000)
account.deposit(500)
account.withdraw(200)
print(f"Current balance: ₹{account.get_balance()}")`,
          task: {
            description: 'Library system banao with classes: Book (title, author, copies), Library (name, books list). Methods: add_book(), borrow_book(title), return_book(title), available_books(). Proper error handling karo if book not found ya copies=0.',
            expectedOutput: null,
            hint: 'Do classes banao. Library mein books list rakho. borrow_book mein copies check karo pehle.',
          },
          quiz: [
            {
              q: '__init__ method kab call hota hai?',
              options: ['Manually call karna padta hai', 'Object create hone par automatically', 'Program start hone par', 'import karne par'],
              correct: 1,
              explanation: '__init__ constructor hai — object create (instantiate) karte waqt automatically call hota hai.',
            },
            {
              q: '"self" parameter kya represent karta hai?',
              options: ['Class itself', 'Current object (instance)', 'Parent class', 'Module'],
              correct: 1,
              explanation: '"self" current object instance ko refer karta hai — har instance method mein pehla parameter hota hai.',
            },
            {
              q: 'Inheritance ke liye kaunsa keyword?',
              options: ['extends', 'inherits', 'class Child(Parent):', 'import Parent'],
              correct: 2,
              explanation: 'class ChildClass(ParentClass): — parenthesis mein parent class ka naam likhte hain.',
            },
          ],
        },
        {
          id: 'py-w4-s2', title: 'Modules & Libraries — Python ki Power!', emoji: '📦',
          content: `## Modules — Python ki Superpower!

Puri duniya ne Python ke liye tools banaye hain — use karo!

### Built-in Modules
\`\`\`python
import math
import random
import datetime
import os

print(math.pi)            # 3.14159...
print(math.sqrt(16))      # 4.0
print(math.factorial(5))  # 120

print(random.randint(1, 6))     # Dice roll!
print(random.choice(["A", "B", "C"]))  # Random element

now = datetime.datetime.now()
print(now.strftime("%d %B %Y, %H:%M"))
\`\`\`

### pip — External Libraries Install Karna
Terminal mein:
\`\`\`bash
pip install requests  # Website se data fetch karo
pip install pandas    # Data analysis
pip install pygame    # Games banana
\`\`\`

### requests — Website ka Data Fetch Karo
\`\`\`python
import requests

response = requests.get("https://api.github.com/users/python")
data = response.json()
print("GitHub Python org followers:", data["followers"])
\`\`\`

### Apna Module banana
\`\`\`python
# calculator.py file mein likho:
def add(a, b): return a + b
def subtract(a, b): return a - b
PI = 3.14159

# main.py mein use karo:
import calculator
print(calculator.add(5, 3))
print(calculator.PI)
\`\`\``,
          codeExample: `import random
import datetime

# Fun Quiz Game
questions = [
    {"q": "Python inventor ka naam?", "a": "guido"},
    {"q": "Python ka latest major version?", "a": "3"},
    {"q": "print ka alternative function?", "a": "write"},
]

random.shuffle(questions)
score = 0

print("🐍 Python Quiz Time!\\n")
for i, item in enumerate(questions[:3]):
    answer = input(f"Q{i+1}: {item['q']}\\n> ").lower().strip()
    if answer == item['a']:
        print("✅ Correct! +10 XP\\n")
        score += 10
    else:
        print(f"❌ Galat. Answer: {item['a']}\\n")

now = datetime.datetime.now().strftime("%H:%M")
print(f"Score: {score}/30 at {now}")`,
          task: {
            description: 'Weather simulator banao using random module — fake weather app! Random temperature (15-45°C), random weather (sunny/cloudy/rainy/stormy), random humidity (30-90%). 7-day forecast print karo with emojis. datetime se actual dates use karo!',
            expectedOutput: null,
            hint: 'weather_types = ["☀️ Sunny", "⛅ Cloudy", "🌧️ Rainy", "⛈️ Stormy"]. random.choice() se select karo. datetime.timedelta(days=i) se dates calculate karo.',
          },
          quiz: [
            {
              q: 'Python mein module import kaise karte hain?',
              options: ['include module', 'import module', 'require module', 'use module'],
              correct: 1,
              explanation: '"import module_name" se module import karte hain Python mein.',
            },
            {
              q: 'random.randint(1, 10) kya return karta hai?',
              options: ['1 se 9 random', '1 se 10 random (both inclusive)', '0 se 10', '1 se 10 (exclusive)'],
              correct: 1,
              explanation: 'randint BOTH endpoints include karta hai — 1 aur 10 dono possible hain.',
            },
            {
              q: 'External library install karne ka command?',
              options: ['python install', 'pip install', 'npm install', 'get install'],
              correct: 1,
              explanation: 'pip Python ka package manager hai — "pip install package_name" se install karte hain.',
            },
          ],
        },
        {
          id: 'py-w4-s3', title: 'Month 1 Project — Student Management System', emoji: '🏆',
          content: `## Month 1 Final Project — Student Management System!

Sabhi concepts use karke ek complete system banao!

### Features jo banane hain:
1. Students add karna (naam, marks, subjects)
2. List dekhna (all students)
3. Search karna by name
4. Marks update karna
5. Remove student
6. Statistics (average, highest, lowest)
7. File mein save/load (data persist karna)
8. Grade calculate karna automatically

### Architecture:
\`\`\`
StudentManagementSystem
├── Student class (naam, marks, grade property)
├── Database class (load/save JSON)
└── UI (menu-driven input)
\`\`\`

### Start Here:
\`\`\`python
import json

class Student:
    def __init__(self, naam, marks):
        self.naam = naam
        self.marks = marks
    
    @property
    def grade(self):
        if self.marks >= 90: return "A+"
        elif self.marks >= 80: return "A"
        elif self.marks >= 70: return "B"
        elif self.marks >= 60: return "C"
        else: return "F"
    
    def to_dict(self):
        return {"naam": self.naam, "marks": self.marks}

# Aage likho...
\`\`\`

**Is project ko complete karo aur submit karo — Certificate mile ga aur 200 XP!** 🎓`,
          codeExample: `# Month 1 Project Starter Code
import json
import os

class Student:
    def __init__(self, naam, marks):
        self.naam = naam
        self.marks = float(marks)
    
    @property  
    def grade(self):
        if self.marks >= 90: return "A+"
        elif self.marks >= 80: return "A"
        elif self.marks >= 70: return "B"
        elif self.marks >= 60: return "C"
        else: return "F"
    
    def to_dict(self):
        return {"naam": self.naam, "marks": self.marks}

class StudentDB:
    def __init__(self, filename="students.json"):
        self.filename = filename
        self.students = self.load()
    
    def load(self):
        try:
            with open(self.filename) as f:
                data = json.load(f)
                return [Student(s["naam"], s["marks"]) for s in data]
        except: return []
    
    def save(self):
        with open(self.filename, "w") as f:
            json.dump([s.to_dict() for s in self.students], f, indent=2)
    
    def add(self, naam, marks):
        self.students.append(Student(naam, marks))
        self.save()
    
    def find(self, naam):
        return next((s for s in self.students if s.naam.lower() == naam.lower()), None)

# Main menu — tum complete karo!
db = StudentDB()
print("Student Management System")`,
          task: {
            description: 'Upar diya starter code use karke PURA system complete karo — saare 8 features implement karo. Ek menu-driven CLI app banana hai jo properly kaam kare!',
            expectedOutput: null,
            hint: 'While True loop mein menu print karo. Input se choice lo. Har option ke liye alag function banao.',
          },
          quiz: [
            {
              q: '@property decorator kya karta hai?',
              options: ['Method ko private banata hai', 'Method ko attribute ki tarah access karne deta hai', 'Method ko static banata hai', 'Method ko delete karta hai'],
              correct: 1,
              explanation: '@property se method ko bina () ke attribute jaisa access kar sakte hain — s.grade bhi chalega (s.grade() nahi).',
            },
            {
              q: 'JSON mein list of objects save karne ke liye?',
              options: ['json.dump(list, file)', 'json.save(list)', 'file.write(list)', 'json.export(list)'],
              correct: 0,
              explanation: 'json.dump(data, file_object) se Python object ko JSON file mein write karte hain.',
            },
            {
              q: 'next() function kya karta hai?',
              options: ['Next iteration pe jaata hai', 'Iterator ka pehla matching element return karta hai', 'List ka next element return karta hai', 'Loop advance karta hai'],
              correct: 1,
              explanation: 'next(iterator, default) — pehla matching element return karta hai, nahi mila toh default.',
            },
          ],
        },
        {
          id: 'py-w4-s4', title: 'Week 4 Review + Month 2 Preview', emoji: '🔭',
          content: `## Month 1 Complete! Ab kya seekhenge?

### Month 1 Recap — Tumne Seekha:
- ✅ Variables, Data Types, Input/Output
- ✅ Conditions (if/elif/else)
- ✅ Loops (for, while)
- ✅ Lists aur Dictionaries
- ✅ Functions aur Modules
- ✅ File Handling
- ✅ Error Handling
- ✅ OOP Basics

### Month 2 — Kya Aayega? 🔥
- **Week 5**: Regular Expressions (text patterns match karna)
- **Week 6**: Web Scraping (websites se data nikalna)
- **Week 7**: APIs (real data aur services connect karna)
- **Week 8**: Data Analysis with Pandas aur Matplotlib

### Month 3 — Advanced 🚀
- **Week 9**: Django Web Framework
- **Week 10**: Machine Learning Basics
- **Week 11**: Automation Scripts
- **Week 12**: Final Capstone Project

### Real Practice karo:
1. Apna month 1 project aur polish karo
2. Python.org ke beginner exercises try karo
3. Kaggle ke free Python course mein participate karo

**Next week se intermediate level shuru! 💪**`,
          codeExample: `# Month 2 Preview — Regex taste karo!
import re

text = "Call me at 9876543210 or 7890123456"
phones = re.findall(r'\\d{10}', text)
print("Phones found:", phones)

# Web request taste karo
# import requests
# r = requests.get("https://api.github.com")
# print(r.status_code)  # 200 = success!`,
          task: {
            description: 'Month 1 ka celebration! Apna best project choose karo aur isko beautify karo: clear menu, better output formatting, color aur emojis, proper error messages. Phir isko GitHub pe upload karo (free account banao) aur link share karo!',
            expectedOutput: null,
            hint: 'GitHub mein new repository banao, README.md file add karo apne project ke baare mein, aur code upload karo. Yeh tumhari coding portfolio ka pehla step hai!',
          },
          quiz: [
            {
              q: 'Month 2 mein kaunsa concept seekhenge web data ke liye?',
              options: ['Machine Learning', 'Web Scraping', 'Game Development', 'Mobile Apps'],
              correct: 1,
              explanation: 'Month 2 Week 6 mein Web Scraping seekhenge — websites se automatically data nikalna!',
            },
            {
              q: 'Regex ka full form kya hai?',
              options: ['Regular Extension', 'Regular Expression', 'Repeated Expression', 'Runtime Expression'],
              correct: 1,
              explanation: 'Regex = Regular Expression — text mein patterns dhundhne ka powerful tool!',
            },
            {
              q: 'GitHub kis kaam aata hai programmers ke liye?',
              options: ['Games khelne ke liye', 'Code store aur share karne ke liye', 'Movies dekhne ke liye', 'Documents banane ke liye'],
              correct: 1,
              explanation: 'GitHub code ka cloud storage hai + version control + portfolio showcase — every programmer use karta hai!',
            },
          ],
        },
      ],
    },
  ],
};

import { PYTHON_MONTH_2 } from './python_month2.js';
import { PYTHON_MONTH_3 } from './python_month3.js';
PYTHON_COURSE.weeks = [...PYTHON_COURSE.weeks, ...PYTHON_MONTH_2, ...PYTHON_MONTH_3];

export default PYTHON_COURSE;