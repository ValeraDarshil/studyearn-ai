/**
 * StudyEarn AI — Python Course English Translations
 * Single file for ALL 48 sections (Weeks 1-12)
 *
 * Structure per section:
 *   title_en       — English section title
 *   content_en     — English theory content (full for W1-4, partial for W5-12)
 *   codeExample_en — English code comments/example (Week 1-4 only)
 *   task_en        — English task description + hint
 *   quiz_en        — English quiz questions array (replaces quiz for EN)
 *
 * applyEnglishTranslations() merges these into section objects
 * AND patches quiz questions with q_en/options_en/explanation_en
 */

// ─── WEEK 1 ────────────────────────────────────────────────────
const W1 = {
  'py-w1-s1': {
    title_en: 'What is Python and How to Set It Up',
    richContent_en: [
      {
            "type": "concept",
            "heading": "What is Python?",
            "body": "Python is a programming language — a way to give instructions to a computer. It is so simple it almost reads like English. Google, Netflix, Instagram — they all use Python."
      },
      {
            "type": "analogy",
            "text": "Think of a computer as a worker who only understands their own language. Python is the dictionary that lets you give it instructions — simple, clear, and powerful."
      },
      {
            "type": "concept",
            "heading": "Your first program",
            "body": "print() is a function that displays anything on the screen. Whatever you write inside the quotes — that is exactly what appears."
      },
      {
            "type": "snippet",
            "label": "Run it and see",
            "code": "print(\"Hello World!\")\nprint(\"My name is Python!\")\nprint(\"I will become a pro in 3 months! 💪\")",
            "expectedOutput": "Hello World!\nMy name is Python!\nI will become a pro in 3 months! 💪"
      },
      {
            "type": "concept",
            "heading": "Numbers with print()",
            "body": "Not just text — numbers work too. And you can print multiple things at once:"
      },
      {
            "type": "snippet",
            "label": "Numbers and text together",
            "code": "print(42)\nprint(3.14)\nprint(\"Score:\", 100)",
            "expectedOutput": "42\n3.14\nScore: 100"
      },
      {
            "type": "mistake",
            "wrong": "Print(\"Hello\")",
            "right": "print(\"Hello\")",
            "why": "Python is case-sensitive — Print (capital P) does not exist. Always use lowercase print."
      },
      {
            "type": "mistake",
            "wrong": "print('Hello\")",
            "right": "print(\"Hello\")",
            "why": "Opening and closing quotes must match — both single or both double."
      },
      {
            "type": "checkpoint",
            "question": "What will print(\"2 + 2\") output?",
            "options": [
                  "4",
                  "\"2 + 2\"",
                  "2 + 2",
                  "Error"
            ],
            "correct": 2,
            "explanation": "Anything inside quotes is printed literally — no calculation happens. \"2 + 2\" is a string, not a math expression."
      }
],
    content_en: `## What is Python?

Python is a programming language that is **very easy** to learn — almost like English. Google, Netflix, Instagram — they all use Python!

### Why Learn Python?
- Syntax is very simple — almost like English
- Build AI, web apps, games — all in one language
- **Highest job demand** in the tech industry

### Python Print Statement
The very first program is printing "Hello World!":

\`\`\`python
print("Hello World!")
print("My name is Python!")
print("I will become a Python pro in 3 months! 💪")
\`\`\`

**Output:**
\`\`\`
Hello World!
My name is Python!
I will become a Python pro in 3 months! 💪
\`\`\`

### What does print() do?
The \`print()\` function displays anything on the screen. Whatever you write inside the quotes — that appears on screen!

### Pro Tip 🔥
Python is CASE-SENSITIVE — \`print\` is correct, \`Print\` or \`PRINT\` will cause an error!`,
    codeExample_en: `# This is my first Python program!
print("Hello World! 🌍")
print("Python is really fun!")
print("I will become a Python pro in 3 months!")`,
    task_en: { description: 'Print your name, city and favorite food — each on a separate line!', hint: 'Use three separate print() statements — one for name, one for city, one for food', starterCode_en: `print("Hello, ???!")
print("I am from ???")
print("My favourite food is ???")`,},
    quiz_en: [
      { q: 'Which function is used to print text in Python?', options: ['display()', 'print()', 'show()', 'write()'], correct: 1, explanation: "print() is Python's built-in function that displays output on the screen." },
      { q: 'What will be the output of print("Hello")?', options: ['"Hello"', 'Hello', 'hello', 'HELLO'], correct: 1, explanation: 'print() displays the text without quotes — just the content inside.' },
      { q: 'Is Python case-sensitive?', options: ['Yes', 'No', 'Sometimes', 'Depends on OS'], correct: 0, explanation: 'Yes! Python is strictly case-sensitive. print and Print are completely different.' },
    ],
  },
  'py-w1-s2': {
    title_en: 'Variables — Storing Data',
    richContent_en: [
      {
            "type": "concept",
            "heading": "What is a variable?",
            "body": "A variable is a labelled box. Create a box, give it a name, put anything inside. Later, just use the name to get it back."
      },
      {
            "type": "analogy",
            "text": "You save contacts in your phone, right? \"Rahul — 98765\" — the name is the variable name, the number is the value. Search \"Rahul\" and you get the number. Python variables work exactly the same way."
      },
      {
            "type": "snippet",
            "label": "Create and use a variable",
            "code": "name = \"Rahul\"\nage = 18\nprint(name)\nprint(age)",
            "expectedOutput": "Rahul\n18"
      },
      {
            "type": "concept",
            "heading": "Three main data types",
            "body": "Python has three common types: String (text, inside quotes), Integer (whole number), Float (decimal number)."
      },
      {
            "type": "snippet",
            "label": "See all three types",
            "code": "student_name = \"Priya\"     # String\nstudent_age  = 17          # Integer\nstudent_gpa  = 9.2         # Float\n\nprint(student_name)\nprint(student_age)\nprint(student_gpa)",
            "expectedOutput": "Priya\n17\n9.2"
      },
      {
            "type": "concept",
            "heading": "Updating a variable",
            "body": "You can change a variable's value any time — just assign again:"
      },
      {
            "type": "snippet",
            "label": "Update a value",
            "code": "score = 0\nprint(\"Start:\", score)\n\nscore = 100\nprint(\"After game:\", score)\n\nscore = score + 50\nprint(\"Bonus earned:\", score)",
            "expectedOutput": "Start: 0\nAfter game: 100\nBonus earned: 150"
      },
      {
            "type": "mistake",
            "wrong": "2score = 100",
            "right": "score2 = 100",
            "why": "Variable names cannot start with a number. Start with a letter or underscore."
      },
      {
            "type": "mistake",
            "wrong": "student name = \"Rahul\"",
            "right": "student_name = \"Rahul\"",
            "why": "No spaces in variable names — use underscore (_) instead."
      },
      {
            "type": "checkpoint",
            "question": "x = 5, then x = x + 3 — what is x now?",
            "options": [
                  "5",
                  "3",
                  "8",
                  "Error"
            ],
            "correct": 2,
            "explanation": "x = x + 3 means: calculate right side first (5 + 3 = 8), then store 8 in x."
      }
],
    content_en: `## What are Variables?

A variable is like a **box** where you store data. Just like you save contacts in your phone — a variable works the same way!

### Creating a Variable
\`\`\`python
name = "Rahul"
age = 18
city = "Mumbai"

print(name)
print(age)
print(city)
\`\`\`

### Types of Data
Python has three main types:

| Type | Example | When to use |
|------|---------|-------------|
| String (str) | \`"Hello"\` | For text |
| Integer (int) | \`25\` | Whole numbers |
| Float | \`9.5\` | Decimal numbers |

### Mixing Variables
\`\`\`python
name = "Priya"
score = 95.5

print("Student:", name)
print("Score:", score)
print(name, "scored", score)
\`\`\`

**Output:**
\`\`\`
Student: Priya
Score: 95.5
Priya scored 95.5
\`\`\`

### Rules for Variable Names 📝
- Only letters, numbers, underscore (_) allowed
- Cannot start with a number
- No spaces — \`my_name\` is valid, \`my name\` is not`,
    codeExample_en: `# Student info storage
student_name = "Arjun"
student_class = 10
percentage = 87.5

print("Name:", student_name)
print("Class:", student_class)
print("Percentage:", percentage, "%")`,
    task_en: { description: 'Store your info in variables: name, age, favourite_subject, percentage. Then print all of them!', hint: 'Create 4 variables and print each one. Use quotes for strings, direct value for numbers.', starterCode_en: `name = "???"
age = ???
favourite_subject = "???"
percentage = ???

print("Name:", name)
print("Age:", age)
print("Subject:", favourite_subject)
print("Percentage:", percentage)`,},
    quiz_en: [
      { q: 'How do you create a variable in Python?', options: ['var naam = "Rahul"', 'naam = "Rahul"', 'let naam = "Rahul"', 'string naam = "Rahul"'], correct: 1, explanation: 'In Python, you just write name = value directly — no keyword needed!' },
      { q: 'Which variable name is NOT valid?', options: ['my_name', 'name1', '_score', '2score'], correct: 3, explanation: 'Variable names cannot start with a number. "2score" is invalid.' },
      { q: 'What data type is "Hello"?', options: ['Integer', 'Float', 'String', 'Boolean'], correct: 2, explanation: 'Text written inside quotes is of String type.' },
    ],
  },
  'py-w1-s3': {
    title_en: 'Getting User Input — input()',
    richContent_en: [
      {
            "type": "concept",
            "heading": "Make your program interactive",
            "body": "Until now you wrote values directly in the code. With input(), the program pauses and asks the user — the user types, the value comes in."
      },
      {
            "type": "snippet",
            "label": "Basic input — try it",
            "code": "# input() will open a prompt box in the browser\nname = input(\"Enter your name: \")\nprint(\"Hello\", name, \"! Welcome! 🎉\")",
            "expectedOutput": "(A prompt box will appear — type your name)"
      },
      {
            "type": "concept",
            "heading": "Important: input() always returns a String",
            "body": "This is the most common source of confusion. Whether the user types \"25\" or \"hello\" — both are Strings. If you need a number, you must convert it:"
      },
      {
            "type": "snippet",
            "label": "Number input — convert with int()",
            "code": "age = int(input(\"What is your age? \"))\nnext_year = age + 1\nprint(f\"Next year you will be {next_year} years old!\")",
            "expectedOutput": "(Type a number — result will calculate)"
      },
      {
            "type": "snippet",
            "label": "Float input — for decimal numbers",
            "code": "score = float(input(\"Your score (0-10): \"))\npercentage = score * 10\nprint(f\"Percentage: {percentage}%\")",
            "expectedOutput": "(Enter a decimal like 8.5)"
      },
      {
            "type": "mistake",
            "wrong": "age = input(\"Age: \")\nprint(age + 1)",
            "right": "age = int(input(\"Age: \"))\nprint(age + 1)",
            "why": "input() gives a string — \"25\" + 1 will throw a TypeError. Convert with int() first."
      },
      {
            "type": "concept",
            "heading": "f-strings — cleaner printing",
            "body": "With f\"...\" you can put variables directly inside {} — no need to join with +:"
      },
      {
            "type": "snippet",
            "label": "f-string magic",
            "code": "name = input(\"Name: \")\ncity = input(\"City: \")\nprint(f\"{name} is from {city} — welcome! 🙌\")",
            "expectedOutput": "(Enter name and city — combined print)"
      },
      {
            "type": "checkpoint",
            "question": "age = input(\"Age: \") — user types \"20\". What is the type of age?",
            "options": [
                  "Integer (20)",
                  "String (\"20\")",
                  "Float (20.0)",
                  "Depends on user"
            ],
            "correct": 1,
            "explanation": "input() always returns a String — even if the user types a number. \"20\" is a string, 20 is an integer."
      }
],
    content_en: `## How to Get Input from the User?

So far we hardcoded values. Now let's get data from the user!

### The input() Function
\`\`\`python
name = input("Enter your name: ")
print("Hello", name, "! Welcome to Python! 🎉")
\`\`\`

When this runs — the program pauses and waits for the user to type their name!

### Numbers as Input
input() always returns a **String**. To get a number, you need to convert it:

\`\`\`python
age = input("What is your age? ")
age = int(age)  # Convert String to Integer

next_year = age + 1
print("Next year you will be", next_year, "years old!")
\`\`\`

### Shortcut — In One Line:
\`\`\`python
age = int(input("Age: "))
score = float(input("Score: "))
\`\`\`

### Practical Example:
\`\`\`python
name = input("Name: ")
city = input("City: ")
school = input("School name: ")

print("\\n=== Student Profile ===")
print("Name:", name)
print("City:", city)
print("School:", school)
\`\`\``,
    codeExample_en: `# Simple calculator — get numbers from user
num1 = float(input("First number: "))
num2 = float(input("Second number: "))

total = num1 + num2
print("Sum of both:", total)`,
    task_en: { description: "Get the user's name and favourite number. Then print: \"[name]'s favourite number is [number] and its double is [2x number]!\"", hint: 'Get name using input() (string), number using int(input()), then calculate number * 2', starterCode_en: `name   = input("Your name: ")
number = int(input("Favourite number: "))
double = ???

print(f"{name}'s favourite number is {number}!")
print(f"Its double is: {???}")`,},
    quiz_en: [
      { q: 'What type does input() always return?', options: ['Integer', 'Float', 'String', 'Boolean'], correct: 2, explanation: 'input() always returns a String — even if the user types a number.' },
      { q: 'What is the correct way to get an integer input from the user?', options: ['input(int("Age: "))', 'int(input("Age: "))', 'integer(input("Age: "))', 'input("Age: ", int)'], correct: 1, explanation: 'int() wraps input() — first input() gets the string, then int() converts it.' },
      { q: 'In print("Hello", name), what is name?', options: ['String literal', 'Variable', 'Function', 'Keyword'], correct: 1, explanation: 'name written outside quotes is a variable that holds a value.' },
    ],
  },
  'py-w1-s4': {
    title_en: 'Basic Math — Python as a Calculator',
    richContent_en: [
      {
            "type": "concept",
            "heading": "Python is a calculator too",
            "body": "+ - * / are basic. Python has three more powerful operators that come up in interviews."
      },
      {
            "type": "snippet",
            "label": "All operators at once — run it",
            "code": "a = 17\nb = 5\n\nprint(\"Add:     \", a + b)   # 22\nprint(\"Subtract:\", a - b)   # 12\nprint(\"Multiply:\", a * b)   # 85\nprint(\"Divide:  \", a / b)   # 3.4\nprint(\"Floor:   \", a // b)  # 3  (drop decimal)\nprint(\"Modulus: \", a % b)   # 2  (remainder)\nprint(\"Power:   \", a ** b)  # 1419857",
            "expectedOutput": "Add:      22\nSubtract: 12\nMultiply: 85\nDivide:   3.4\nFloor:    3\nModulus:  2\nPower:    1419857"
      },
      {
            "type": "concept",
            "heading": "% (modulus) — remainder only",
            "body": "17 % 5 = 2 because 17 = 5×3 + 2. Commonly used to check even/odd — if number % 2 == 0 then it is even."
      },
      {
            "type": "snippet",
            "label": "Even/Odd checker — classic % use",
            "code": "number = 42\nif number % 2 == 0:\n    print(f\"{number} is even\")\nelse:\n    print(f\"{number} is odd\")",
            "expectedOutput": "42 is even"
      },
      {
            "type": "concept",
            "heading": "f-string formatting",
            "body": "{value:.2f} means \"show 2 decimal places\" — essential for percentages and money."
      },
      {
            "type": "snippet",
            "label": "Percentage calculator — real example",
            "code": "name     = \"Vikram\"\nmarks    = 450\ntotal    = 500\npercent  = (marks / total) * 100\n\nprint(f\"{name}'s result:\")\nprint(f\"Marks:      {marks}/{total}\")\nprint(f\"Percentage: {percent:.2f}%\")",
            "expectedOutput": "Vikram's result:\nMarks:      450/500\nPercentage: 90.00%"
      },
      {
            "type": "mistake",
            "wrong": "print(\"2 + 2\")",
            "right": "print(2 + 2)",
            "why": "\"2 + 2\" is inside quotes — it is a string. For calculation, write outside quotes."
      },
      {
            "type": "mistake",
            "wrong": "result = 10 / 0",
            "right": "if b != 0:\n    result = a / b",
            "why": "Dividing by zero gives ZeroDivisionError. Always check in real code."
      },
      {
            "type": "checkpoint",
            "question": "What will 17 % 5 output?",
            "options": [
                  "3",
                  "2",
                  "3.4",
                  "0"
            ],
            "correct": 1,
            "explanation": "Divide 17 by 5: 5×3=15, remainder = 17-15 = 2. Modulus gives only the remainder."
      }
],
    content_en: `## Math Operations in Python

Python is a powerful calculator!

### Basic Operators
\`\`\`python
a = 20
b = 6

print(a + b)   # Addition:       26
print(a - b)   # Subtraction:    14
print(a * b)   # Multiplication: 120
print(a / b)   # Division:       3.333...
print(a // b)  # Floor Division: 3 (removes decimal)
print(a % b)   # Modulus:        2 (remainder)
print(a ** b)  # Power:          64000000
\`\`\`

### Modulus (%) — Super Useful!
Gets the remainder — used to check **even/odd**:
\`\`\`python
number = 17
if number % 2 == 0:
    print(number, "is even")
else:
    print(number, "is odd")
\`\`\`

### f-strings — Clean Printing
\`\`\`python
name = "Vikram"
marks = 450
total = 500
percentage = (marks / total) * 100

print(f"{name}'s result:")
print(f"Marks: {marks}/{total}")
print(f"Percentage: {percentage:.2f}%")
\`\`\``,
    codeExample_en: `# Percentage calculator
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
    task_en: { description: 'Build a simple EMI calculator: get loan amount, interest rate (%), and years. Formula: total = amount + (amount * rate * years / 100), monthly = total / (years * 12)', hint: 'total_amount = loan + (loan * rate * years / 100), then monthly = total_amount / (years * 12)', starterCode_en: `loan  = float(input("Loan amount: "))
years = int(input("Years: "))

total_payable = loan + (loan * 0.1 * years)
monthly_emi   = total_payable / (years * 12)

print(f"Loan:          {loan:,.0f}")
print(f"Total payable: {total_payable:,.0f}")
print(f"Monthly EMI:   {monthly_emi:,.0f}")`,},
    quiz_en: [
      { q: 'What will 17 % 5 output?', options: ['3', '2', '3.4', '0'], correct: 1, explanation: '17 divided by 5 = 3 remainder 2. Modulus (%) only returns the remainder.' },
      { q: 'How do you use a variable in an f-string?', options: ['f"Hello {name}"', 'f"Hello name"', '"Hello" + name', 'f("Hello", name)'], correct: 0, explanation: 'In f-strings, write the variable name inside curly braces {}.' },
      { q: 'What will 10 // 3 return?', options: ['3.33', '3', '4', '1'], correct: 1, explanation: 'Floor division (//) removes the decimal part — 10/3 = 3.33, floor = 3.' },
    ],
  },
};

// ─── WEEKS 2-4 ─────────────────────────────────────────────────
const W2_4 = {
  'py-w2-s1': {
    title_en: 'if / elif / else — Decision Making',
    content_en: `## Conditions — Teach Python to Think!

In real life we check conditions: "If it rains, take an umbrella." Python does exactly the same!

### Basic if-else
\`\`\`python
temperature = 38

if temperature > 37.5:
    print("🤒 You have a fever! Visit the doctor.")
else:
    print("✅ Temperature is normal.")
\`\`\`

### elif — Multiple Conditions
\`\`\`python
score = int(input("Enter your score (0-100): "))

if score >= 90:    print("🏆 Outstanding! A+ Grade")
elif score >= 80:  print("🎉 Excellent! A Grade")
elif score >= 70:  print("👍 Good! B Grade")
elif score >= 60:  print("📚 Average. C Grade")
else:              print("💪 Keep working. Fail")
\`\`\`

### Comparison Operators
| Operator | Meaning |
|----------|---------|
| == | equal to |
| != | not equal |
| > | greater than |
| < | less than |
| >= | greater or equal |

### Logical Operators
\`\`\`python
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed!")
\`\`\``,
    codeExample_en: `# Grade checker based on marks
marks = int(input("Enter your marks (0-100): "))

if marks >= 90:
    print("Grade: A+ — Outstanding! 🏆")
elif marks >= 75:
    print("Grade: A — Excellent work!")
elif marks >= 60:
    print("Grade: B — Good effort!")
elif marks >= 40:
    print("Grade: C — Keep improving!")
else:
    print("Grade: F — Study harder! 💪")`,
    task_en: { description: 'Build a BMI calculator. Take weight (kg) and height (cm). Calculate BMI = weight / (height/100)². Show: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (>=30).', hint: 'height_m = height / 100. BMI = weight / (height_m ** 2). Use if/elif/else to show category.' },
    quiz_en: [
      { q: 'What is the correct syntax for checking multiple conditions?', options: ['if/else if/else', 'if/elif/else', 'if/elseif/else', 'if/or/else'], correct: 1, explanation: 'Python uses elif (not "else if"). It checks conditions in order and runs the first True block.' },
      { q: 'What does the "and" operator do?', options: ['Returns True if either is True', 'Returns True only if BOTH are True', 'Combines two numbers', 'Checks equality'], correct: 1, explanation: '"and" requires both conditions to be True. "or" requires at least one.' },
      { q: 'What happens if no if/elif is True and there is no else?', options: ['Error occurs', 'Nothing — code continues normally', 'Program stops', 'Returns False'], correct: 1, explanation: 'If no condition matches and there is no else, Python skips the entire if block and continues.' },
    ],
  },
  'py-w2-s2': {
    title_en: 'Loops — Repeating Tasks',
    content_en: `## Loops — Make Python Do Repetitive Work!

### for Loop
\`\`\`python
for i in range(1, 6):
    print(i)  # Prints 1 to 5

fruits = ["apple", "mango", "banana"]
for fruit in fruits:
    print("I like", fruit)
\`\`\`

### range() Function
\`\`\`python
range(5)         # 0, 1, 2, 3, 4
range(1, 6)      # 1, 2, 3, 4, 5
range(0, 10, 2)  # 0, 2, 4, 6, 8
range(10, 0, -1) # 10, 9, 8...1
\`\`\`

### while Loop
\`\`\`python
count = 1
while count <= 5:
    print("Count:", count)
    count += 1

while True:
    answer = input("Type 'quit' to exit: ")
    if answer == 'quit':
        break
    print("You typed:", answer)
\`\`\`

### break and continue
\`\`\`python
for i in range(10):
    if i == 5:
        break       # Stop at 5
    print(i)        # 0,1,2,3,4

for i in range(10):
    if i % 2 == 0:
        continue    # Skip even
    print(i)        # 1,3,5,7,9
\`\`\``,
    codeExample_en: `# Sum calculator using a loop
total = 0
count = 0

print("Enter numbers (type 0 to finish):")
while True:
    num = float(input("Number: "))
    if num == 0:
        break
    total += num
    count += 1

if count > 0:
    print(f"Sum: {total}")
    print(f"Average: {total/count:.2f}")`,
    task_en: { description: 'Build a multiplication table generator. Ask the user for a number and how many rows. Print the full table. Example: 5 × 1 = 5 ... 5 × 10 = 50.', hint: "Use for loop with range(1, rows+1). Print: f'{num} × {i} = {num*i}'" },
    quiz_en: [
      { q: 'What does range(2, 10, 3) produce?', options: ['2, 5, 8', '2, 4, 6, 8', '3, 6, 9', '2,3,4,5,6,7,8,9'], correct: 0, explanation: 'range(start, stop, step) = 2, 5, 8 — starts at 2, adds 3 each time, stops before 10.' },
      { q: 'What does break do inside a loop?', options: ['Pauses the loop', 'Skips current iteration', 'Exits the loop immediately', 'Restarts the loop'], correct: 2, explanation: 'break exits the entire loop immediately. continue skips only the current iteration.' },
      { q: 'When does a while loop stop?', options: ['After fixed iterations', 'When condition becomes False', 'When break is used', 'Both B and C'], correct: 3, explanation: 'A while loop stops when: condition becomes False, or break is executed.' },
    ],
  },
  'py-w2-s3': {
    title_en: 'Lists — Storing Collections of Data',
    content_en: `## Lists — Store Multiple Items in One Variable!

### Creating and Accessing Lists
\`\`\`python
students = ["Rahul", "Priya", "Arjun", "Neha"]

print(students[0])    # Rahul (first item)
print(students[-1])   # Neha (last item)
print(students[1:3])  # ['Priya', 'Arjun']
\`\`\`

### Modifying Lists
\`\`\`python
numbers = [10, 20, 30]
numbers.append(40)       # Add to end
numbers.insert(1, 15)    # Insert at index 1
numbers.remove(20)       # Remove by value
numbers.pop()            # Remove last item
print(len(numbers))      # Length
\`\`\`

### Useful Operations
\`\`\`python
marks = [85, 92, 78, 96, 88]

print(max(marks))     # 96
print(min(marks))     # 78
print(sum(marks))     # 439
print(sorted(marks))  # [78, 85, 88, 92, 96]
\`\`\`

### List Comprehension
\`\`\`python
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

even = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\``,
    codeExample_en: `# Shopping list manager
shopping = []

shopping.append("Milk")
shopping.append("Bread")
shopping.append("Eggs")
shopping.append("Butter")

print("Shopping list:", shopping)
print("Total items:", len(shopping))
print("First item:", shopping[0])
print("Sorted:", sorted(shopping))`,
    task_en: { description: "Create a student grade manager. Store 5 students' marks. Calculate: average, highest mark, lowest mark, how many passed (>=40), print all sorted highest to lowest.", hint: 'sum(marks)/len(marks) for average. marks.index(max(marks)) gives the index of highest mark.' },
    quiz_en: [
      { q: 'What is the index of the last item in a 5-element list?', options: ['5', '4', '-1', 'Both B and C'], correct: 3, explanation: 'Last element is at index 4 (length-1) OR -1 (negative indexing). Both work!' },
      { q: 'What is the difference between append() and insert()?', options: ['No difference', 'append() adds to end, insert() adds at a specific position', 'insert() adds to end', 'append() is faster'], correct: 1, explanation: 'append(item) always adds to the end. insert(index, item) adds at the specified position.' },
      { q: 'What does [x**2 for x in range(3)] produce?', options: ['[1, 4, 9]', '[0, 1, 4]', '[0, 1, 2]', '[1, 2, 3]'], correct: 1, explanation: 'range(3) = 0,1,2. Squaring: 0,1,4. Result: [0, 1, 4].' },
    ],
  },
  'py-w2-s4': {
    title_en: 'Functions — Writing Reusable Code',
    content_en: `## Functions — Write Once, Use Many Times!

### Creating a Function
\`\`\`python
def greet(name):
    print(f"Hello, {name}! Welcome!")

greet("Rahul")   # Hello, Rahul! Welcome!
greet("Priya")   # Hello, Priya! Welcome!
\`\`\`

### Parameters and Return Values
\`\`\`python
def calculate_grade(marks, total=100):
    percentage = (marks / total) * 100
    if percentage >= 90:   return "A+"
    elif percentage >= 80: return "A"
    elif percentage >= 70: return "B"
    else:                  return "C"

grade = calculate_grade(85)
print("Grade:", grade)  # Grade: B
\`\`\`

### Multiple Return Values
\`\`\`python
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)/len(numbers)

low, high, avg = get_stats([85, 92, 78, 96])
print(f"Low:{low}, High:{high}, Avg:{avg:.1f}")
\`\`\`

### Default Parameters & *args
\`\`\`python
def power(base, exp=2):
    return base ** exp

print(power(4))     # 16
print(power(2, 8))  # 256

def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3, 4, 5))  # 15
\`\`\``,
    codeExample_en: `# Temperature converter with functions
def celsius_to_fahrenheit(c):
    return (c * 9/5) + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5/9

temp = float(input("Enter temperature: "))
unit = input("Is it Celsius or Fahrenheit? (C/F): ").upper()

if unit == 'C':
    print(f"{temp}°C = {celsius_to_fahrenheit(temp):.1f}°F")
elif unit == 'F':
    print(f"{temp}°F = {fahrenheit_to_celsius(temp):.1f}°C")`,
    task_en: { description: 'Build a calculator with separate functions: add(a,b), subtract(a,b), multiply(a,b), divide(a,b). Create a main calculator() function with a menu loop.', hint: 'divide() should check if b==0 first. Return an error string if so.' },
    quiz_en: [
      { q: 'What does "return" do in a function?', options: ['Prints a value', 'Sends a value back to caller and exits the function', 'Repeats the function', 'Stops the program'], correct: 1, explanation: 'return sends a value back and immediately exits the function.' },
      { q: 'What is a default parameter?', options: ['Always required', 'Has a pre-set value used when no argument is passed', 'The first parameter', 'A global variable'], correct: 1, explanation: 'Default parameters are optional — they use their default value if the caller does not provide one.' },
      { q: 'What does *args allow?', options: ['Only two arguments', 'Passing any number of arguments', 'Keyword arguments only', 'Returning multiple values'], correct: 1, explanation: '*args collects all extra positional arguments into a tuple.' },
    ],
  },
  'py-w3-s1': {
    title_en: 'String Methods — Text Manipulation',
    content_en: `## String Methods — Full Control Over Text!

### Common Methods
\`\`\`python
text = "  Hello, Python World!  "
print(text.strip())    # Remove whitespace
print(text.lower())    # lowercase
print(text.upper())    # UPPERCASE
print(text.title())    # Title Case

s = "Python is amazing and Python is fun"
print(s.count("Python"))            # 2
print(s.replace("Python", "Coding"))
\`\`\`

### Split and Join
\`\`\`python
csv = "Rahul,25,Mumbai,Engineer"
parts = csv.split(",")
# ['Rahul', '25', 'Mumbai', 'Engineer']

words = ["Python", "is", "awesome"]
print(" ".join(words))  # Python is awesome
\`\`\`

### f-string Formatting
\`\`\`python
name = "Arjun"
score = 95.567

print(f"{name:>15}")     # Right-align 15 chars
print(f"{score:.2f}")    # 95.57
print(f"{1000000:,}")    # 1,000,000
print(f"{0.75:.0%}")     # 75%
\`\`\``,
    codeExample_en: `# String operations demo
name = input("Enter your full name: ")

print(f"Original: {name}")
print(f"Uppercase: {name.upper()}")
print(f"Lowercase: {name.lower()}")
print(f"Character count: {len(name)}")
print(f"Words: {len(name.split())}")
print(f"Reversed: {name[::-1]}")
print(f"Contains 'a': {'a' in name.lower()}")`,
    task_en: { description: "Build a text analyzer. User enters a paragraph. Display: total characters, total words, total sentences (count '.'), most common word, text in UPPERCASE, reversed text.", hint: 'words = text.split() for word count. text[::-1] reverses a string.' },
    quiz_en: [
      { q: 'What does "hello world".split() return?', options: ['"hello", "world"', "['hello', 'world']", '("hello", "world")', '"hello world"'], correct: 1, explanation: 'split() on whitespace returns a list of words: ["hello", "world"].' },
      { q: 'What does " ".join(["a","b","c"]) return?', options: ['"abc"', '"a b c"', '["a","b","c"]', '"a,b,c"'], correct: 1, explanation: 'join() connects list items with the separator. " ".join(...) = "a b c".' },
      { q: 'What does f"{3.14159:.2f}" output?', options: ['3.14159', '3.14', '3.1', '3.142'], correct: 1, explanation: ':.2f = float with 2 decimal places. 3.14159 → 3.14.' },
    ],
  },
  'py-w3-s2': {
    title_en: 'Dictionaries — Key-Value Data Storage',
    content_en: `## Dictionaries — Store Data with Labels!

### Creating and Accessing
\`\`\`python
student = {
    "name": "Rahul",
    "age": 20,
    "marks": 85
}

print(student["name"])              # Rahul
print(student.get("phone", "N/A"))  # N/A if missing
\`\`\`

### Modifying
\`\`\`python
student["email"] = "rahul@gmail.com"  # Add
student["age"] = 21                   # Update
del student["marks"]                  # Delete

print(student.keys())    # All keys
print(student.values())  # All values
print(student.items())   # Key-value pairs
\`\`\`

### Looping
\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

### Nested Dictionaries
\`\`\`python
school = {
    "10A": {"students": 30, "teacher": "Mrs. Sharma"},
    "10B": {"students": 28, "teacher": "Mr. Verma"}
}
print(school["10A"]["teacher"])  # Mrs. Sharma
\`\`\``,
    codeExample_en: `# Student report card
student = {
    "name": "Priya",
    "roll": "A-101",
    "subjects": {
        "Math": 92,
        "Science": 88,
        "English": 95,
        "Hindi": 85
    }
}

total = sum(student["subjects"].values())
avg = total / len(student["subjects"])
print(f"Student: {student['name']}")
print(f"Average: {avg:.1f}%")
for sub, mark in student["subjects"].items():
    print(f"  {sub}: {mark}")`,
    task_en: { description: 'Build a phone book app. Store 5 contacts (name → number). Add: search by name, add new contact, delete contact, display all sorted by name.', hint: 'sorted(phone_book.keys()) for alphabetical order. Use dict[key] to access/modify.' },
    quiz_en: [
      { q: 'What is the difference between dict["key"] and dict.get("key")?', options: ['No difference', 'dict["key"] raises KeyError if missing; .get() returns None or default', '.get() is slower', 'dict["key"] only works for strings'], correct: 1, explanation: '.get("key", default) safely returns a default if the key does not exist.' },
      { q: 'What does .items() return?', options: ['Only keys', 'Only values', 'Key-value pairs as tuples', 'Length of dictionary'], correct: 2, explanation: '.items() returns key-value pairs: dict_items([(key1,val1), ...]).' },
      { q: 'Can dictionary values be lists or other dicts?', options: ['No, only strings', 'Yes, any Python object', 'Only lists', 'Only numbers'], correct: 1, explanation: 'Dictionary values can be any Python object — strings, lists, other dicts, functions, etc.' },
    ],
  },
  'py-w3-s3': {
    title_en: 'File Handling — Saving Data Permanently',
    content_en: `## File Handling — Save Data So It Persists!

### Reading and Writing
\`\`\`python
with open("notes.txt", "w") as file:
    file.write("Python is awesome!\\n")
    file.write("I am learning file handling.")

with open("notes.txt", "r") as file:
    content = file.read()
    print(content)

with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())
\`\`\`

### File Modes
| Mode | Meaning |
|------|---------|
| "r"  | Read (default) |
| "w"  | Write (overwrites) |
| "a"  | Append (adds to end) |

### Working with CSV
\`\`\`python
import csv

with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Marks"])
    writer.writerow(["Rahul", 85])

with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["Name"], row["Marks"])
\`\`\``,
    codeExample_en: `# Simple note saver
filename = "my_notes.txt"

def save_note(note):
    with open(filename, "a") as f:
        f.write(note + "\\n")
    print("Note saved!")

def read_all_notes():
    try:
        with open(filename, "r") as f:
            notes = f.readlines()
        print(f"Total notes: {len(notes)}")
        for i, note in enumerate(notes, 1):
            print(f"{i}. {note.strip()}")
    except FileNotFoundError:
        print("No notes yet!")

save_note("Learn Python every day")
save_note("Practice makes perfect")
read_all_notes()`,
    task_en: { description: "Build a diary app. User can: (1) Write a new entry (append with date/time), (2) Read all entries, (3) Search by keyword. Save to 'diary.txt'.", hint: "Use 'a' mode for appending. from datetime import datetime. datetime.now().strftime('%Y-%m-%d %H:%M') for timestamp." },
    quiz_en: [
      { q: 'What is the "with" statement used for in file handling?', options: ['Opening multiple files', 'Automatically closing file after use', 'Writing faster', 'Reading faster'], correct: 1, explanation: '"with open(...) as f:" automatically closes the file when the block ends — even if an error occurs.' },
      { q: 'What does "a" mode do that "w" mode does not?', options: ['Creates new file', 'Appends without erasing existing content', 'Reads the file', 'Nothing different'], correct: 1, explanation: '"w" overwrites everything. "a" adds new content to the end while keeping existing content.' },
      { q: 'What does csv.DictReader return for each row?', options: ['A list', 'A dictionary with headers as keys', 'A tuple', 'A string'], correct: 1, explanation: 'DictReader treats the first row as headers and returns each row as a dict: {"Name": "Rahul"}.' },
    ],
  },
  'py-w3-s4': {
    title_en: 'Error Handling — Preventing Crashes',
    content_en: `## Error Handling — Make Your Programs Robust!

### try-except
\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print("Result:", result)
except ValueError:
    print("❌ Please enter a valid number!")
except ZeroDivisionError:
    print("❌ Cannot divide by zero!")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
else:
    print("✅ No errors!")
finally:
    print("Program finished.")
\`\`\`

### Common Exceptions
| Exception | When it occurs |
|-----------|---------------|
| ValueError | Wrong type conversion |
| TypeError | Wrong type for operation |
| IndexError | List index out of range |
| KeyError | Dict key not found |
| FileNotFoundError | File does not exist |
| ZeroDivisionError | Division by zero |

### Raising Custom Errors
\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    return age

try:
    set_age(-5)
except ValueError as e:
    print(f"Error: {e}")
\`\`\``,
    codeExample_en: `# Safe file reader with error handling
def read_file_safely(filename):
    try:
        with open(filename, 'r') as f:
            content = f.read()
            print(f"File content ({len(content)} chars):")
            print(content)
    except FileNotFoundError:
        print(f"❌ File '{filename}' not found!")
    except PermissionError:
        print(f"❌ No permission to read '{filename}'!")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    else:
        print("✅ File read successfully!")
    finally:
        print("Done attempting to read file.")

read_file_safely("test.txt")
read_file_safely("nonexistent.txt")`,
    task_en: { description: 'Build a robust calculator that handles: division by zero, invalid input (letters), unsupported operations. Show friendly error for each case. Ask if user wants to try again.', hint: 'Wrap int(input()) in try-except ValueError. Check for b==0 before dividing. while True loop with break for retry.' },
    quiz_en: [
      { q: 'When does the "finally" block execute?', options: ['Only when error occurs', 'Only when no error occurs', 'Always, regardless of errors', 'Never automatically'], correct: 2, explanation: '"finally" always runs — perfect for cleanup like closing files or connections.' },
      { q: 'Difference between except Exception and except ValueError?', options: ['No difference', 'except ValueError only catches that; except Exception catches all', 'except Exception is faster', 'except ValueError catches more'], correct: 1, explanation: 'Be specific first (except ValueError), then general (except Exception) as fallback.' },
      { q: 'What does "raise" do?', options: ['Prints error message', 'Deliberately triggers an exception', 'Stops the program', 'Ignores the error'], correct: 1, explanation: '"raise" lets you deliberately trigger an exception for input validation.' },
    ],
  },
  'py-w4-s1': {
    title_en: 'Classes and Objects — OOP Basics',
    content_en: `## Object-Oriented Programming — Model the Real World!

### Class Basics
\`\`\`python
class Student:
    def __init__(self, name, age, marks):
        self.name  = name
        self.age   = age
        self.marks = marks

    def get_grade(self):
        if self.marks >= 90:   return "A+"
        elif self.marks >= 80: return "A"
        else:                  return "B or below"

    def introduce(self):
        print(f"Hi, I am {self.name}!")
        print(f"Grade: {self.get_grade()}")

s1 = Student("Rahul", 20, 85)
s1.introduce()
\`\`\`

### Class vs Instance Variables
\`\`\`python
class BankAccount:
    bank_name = "StudyEarn Bank"  # shared by all

    def __init__(self, owner, balance=0):
        self.owner   = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Balance: ₹{self.balance}")

acc = BankAccount("Rahul", 1000)
acc.deposit(500)
\`\`\``,
    codeExample_en: `class Rectangle:
    def __init__(self, width, height):
        self.width  = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height

    def describe(self):
        print(f"Rectangle: {self.width} x {self.height}")
        print(f"Area: {self.area()}")
        print(f"Perimeter: {self.perimeter()}")
        print(f"Is square: {self.is_square()}")

r1 = Rectangle(5, 3)
r2 = Rectangle(4, 4)
r1.describe()
r2.describe()`,
    task_en: { description: "Create a Library class. Attributes: library_name, books (list). Methods: add_book(title, author), remove_book(title), search_book(keyword), display_all(), total_books(). Test with 5 books.", hint: "Each book: {'title': '...', 'author': '...'}. search_book() checks if keyword is in title or author." },
    quiz_en: [
      { q: 'What is __init__ in a class?', options: ['A regular method', 'Constructor — called automatically when object is created', 'A class variable', 'A static method'], correct: 1, explanation: '__init__ initializes the instance attributes when you create a new object.' },
      { q: 'What does "self" represent?', options: ['The class itself', 'The current instance (object)', 'A global variable', 'Optional parameter'], correct: 1, explanation: '"self" refers to the specific object. When s1.introduce() is called, self IS s1.' },
      { q: 'Class variable vs instance variable?', options: ['No difference', 'Class vars shared by all; instance vars unique per object', 'Instance vars are faster', 'Class vars cannot change'], correct: 1, explanation: 'Class variables (outside __init__) are shared. Instance variables (self.x) are unique per object.' },
    ],
  },
  'py-w4-s2': {
    title_en: "Modules & Libraries — Python's Superpower",
    codeExample_en: `import math
import random
from datetime import datetime

# math module
print(f"Pi: {math.pi:.4f}")
print(f"Square root of 144: {math.sqrt(144)}")
print(f"Ceiling of 4.2: {math.ceil(4.2)}")

# random module
lucky = random.randint(1, 100)
print(f"Lucky number: {lucky}")

items = ["Python", "Java", "JavaScript", "C++"]
print(f"Random choice: {random.choice(items)}")

# datetime
now = datetime.now()
print(f"Today: {now.strftime('%d %B %Y')}")
print(f"Time: {now.strftime('%H:%M:%S')}")`,
    task_en: { description: "Build a 'Lucky Numbers' lottery app. Generate 6 unique numbers (1-49). User picks 6 numbers. Show how many match. Prize: 6=Jackpot!, 5=₹1 Lakh, 4=₹10K, 3=₹1K.", hint: 'random.sample(range(1,50), 6) generates 6 unique numbers. set(winning) & set(user) finds matches.' },
    quiz_en: [
      { q: 'Difference between "import math" and "from math import sqrt"?', options: ['No difference', '"import math" imports whole module; "from...import" imports only what specified', '"from...import" is slower', '"import math" only for built-ins'], correct: 1, explanation: '"import math" → use math.sqrt(). "from math import sqrt" → use sqrt() directly.' },
      { q: 'What does random.sample(range(1,50), 6) do?', options: ['Returns one number', 'Returns 6 unique random numbers from 1-49', 'Returns sorted sequence', 'Returns sorted list'], correct: 1, explanation: 'random.sample() returns unique items — no repetition. Perfect for lottery numbers.' },
      { q: 'How do you create your own module?', options: ['Using a command', 'Save functions in .py file and import it', 'Using module keyword', 'Only with pip'], correct: 1, explanation: 'Any .py file is a module! Save as mymodule.py, then import mymodule.' },
    ],
  },
  'py-w4-s3': {
    title_en: 'Month 1 Project — Student Management System',
    codeExample_en: `import csv, os
from datetime import datetime

students = []

def add_student():
    name  = input("Name: ").strip()
    roll  = input("Roll: ").strip()
    marks = float(input("Marks (0-100): "))
    grade = get_grade(marks)
    students.append({"name": name, "roll": roll, "marks": marks, "grade": grade})
    print(f"✅ {name} added! Grade: {grade}")

def get_grade(marks):
    if marks >= 90: return "A+"
    elif marks >= 80: return "A"
    elif marks >= 70: return "B"
    elif marks >= 60: return "C"
    return "F"

def show_all():
    if not students:
        print("No students."); return
    sorted_list = sorted(students, key=lambda s: s["marks"], reverse=True)
    for i, s in enumerate(sorted_list, 1):
        print(f"{i}. {s['name']} — {s['marks']} ({s['grade']})")

def statistics():
    if not students: return
    marks = [s["marks"] for s in students]
    top = max(students, key=lambda s: s["marks"])
    print(f"Average: {sum(marks)/len(marks):.1f}")
    print(f"Topper: {top['name']} ({top['marks']})")`,
    task_en: { description: 'Complete the Student Management System with all functions: add, view, search, update, delete, statistics, save/load CSV. Test with 10 students.', hint: 'Main menu: while True loop. CSV save: csv.DictWriter. Load at start with os.path.exists() check.' },
    quiz_en: [
      { q: 'Best data structure for students with multiple attributes?', options: ['Simple list of names', 'List of dictionaries', 'Single string', 'Only variables'], correct: 1, explanation: 'List of dicts is perfect: [{"name":"Rahul","marks":85}]. Access with student["name"].' },
      { q: 'How to find student with highest marks?', options: ['max(students)', 'max(students, key=lambda s: s["marks"])', 'students.max("marks")', 'sorted(students)[-1]'], correct: 1, explanation: 'max() with key function uses marks as comparison criterion.' },
      { q: 'What to do before loading CSV on start?', options: ['Always try to load', 'Check if file exists with os.path.exists()', 'Create file first', 'Nothing special'], correct: 1, explanation: 'os.path.exists() prevents FileNotFoundError on first run.' },
    ],
  },
  'py-w4-s4': {
    title_en: 'Week 4 Review + Month 2 Preview',
    codeExample_en: `# Month 1 complete recap
name = "Python Learner"
skills = ["Variables", "Loops", "Functions", "OOP", "Files"]

def skill_report(name, skills):
    print(f"\\n{'='*40}")
    print(f"  Student: {name}")
    print(f"  Month 1 Skills ({len(skills)} learned):")
    for i, skill in enumerate(skills, 1):
        print(f"    {i}. ✅ {skill}")
    print(f"{'='*40}")
    print("  Ready for Month 2! 🚀")

skill_report(name, skills)

# Month 2 preview
month2 = {
    "Week 5": "Regular Expressions",
    "Week 6": "Web Scraping",
    "Week 7": "APIs & JSON",
    "Week 8": "Pandas & Data Analysis"
}

print("\\nMonth 2 Coming Up:")
for week, topic in month2.items():
    print(f"  {week}: {topic}")`,
    task_en: { description: 'Final Month 1 challenge! Extend Student Management System with OOP: Student class and Classroom class. Methods: class_average(), top_students(n), students_at_risk() (marks<40), export_report() to CSV.', hint: 'class Classroom: def __init__(self): self.students = []. Methods work on self.students list.' },
    quiz_en: [
      { q: 'Which topic is NOT in Month 1?', options: ['Functions and Classes', 'Web Scraping and APIs', 'File Handling and CSV', 'Loops and Conditions'], correct: 1, explanation: 'Web Scraping and APIs are Month 2 topics.' },
      { q: 'Main advantage of OOP for Student Management System?', options: ['Runs faster', 'Code is organized into logical objects, easier to extend', 'Uses less memory', 'No advantage'], correct: 1, explanation: 'OOP groups related data and behavior. Adding features means just adding methods to Student class.' },
      { q: 'How to import only sqrt from math?', options: ['import sqrt from math', 'from math import sqrt', 'math.import(sqrt)', 'include math.sqrt'], correct: 1, explanation: '"from math import sqrt" so you can call sqrt(16) directly.' },
    ],
  },
};

// ─── WEEKS 5-12: Title + Task + Quiz (full) ───────────────────
const W5_12 = {
  'py-w5-s1': {
    title_en: 'Regex Basics — Writing Patterns',
    content_en: `## Regular Expressions — Superpower Text Search!

Regex is a mini-language that finds patterns in text. Like searching on Google — but far more powerful!

### Why Learn Regex?
- Validate phone numbers
- Check emails (correct format or not)
- Find special characters in passwords
- Extract data from log files

### The re module
\`\`\`python
import re

# Different re functions
text = "Hello! My name is Rahul. I am 20 years old. Email: rahul@gmail.com"

# findall — list of all matches
words = re.findall(r'\\b[A-Z][a-z]+\\b', text)
print("Capitalized words:", words)

# search — first match
email = re.search(r'[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}', text)
if email:
    print("Email found:", email.group())

# match — from start of string
if re.match(r'Hello', text):
    print("Starts with Hello!")

# fullmatch — entire string must match
print(re.fullmatch(r'\\d{10}', "9876543210"))  # valid phone
\`\`\`

### Common Regex Patterns
\`\`\`
Pattern     Matches
.           Any single character
\\d          A digit (0-9)
\\w          A word character (a-z, A-Z, 0-9, _)
\\s          Whitespace (space, tab)
+           One or more
*           Zero or more
?           Zero or one (optional)
{3}         Exactly 3 times
{2,5}       2 to 5 times
^           Start of string
$           End of string
[aeiou]     Any vowel
[^0-9]      Not a digit
\`\`\`

### Practical: Phone + Email Extraction
\`\`\`python
import re

text = """Contact us:
- Support: support@company.com
- Sales: 9876543210
- HR: hr@company.org or 8765432109
"""

emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}', text)
phones = re.findall(r'[6-9]\\d{9}', text)

print("Emails found:", emails)
print("Phones found:", phones)
\`\`\``,
    codeExample_en: `import re

text = "Contact: john@email.com, phone: 9876543210, code: ABC-123"

# Find email
email = re.findall(r'[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}', text)
print("Emails:", email)

# Find phone numbers
phones = re.findall(r'\\d{10}', text)
print("Phones:", phones)

# Find codes like ABC-123
codes = re.findall(r'[A-Z]{3}-\\d{3}', text)
print("Codes:", codes)

# re.search — find first match
match = re.search(r'\\d+', text)
if match:
    print("First number found:", match.group())`,
    task_en: { description: 'Find all email addresses and phone numbers in a given text using regex. Use re.findall() with appropriate patterns.', hint: 'Email: r"[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}". Phone: r"\\d{10}"' },
    quiz_en: [
      { q: 'What does re.findall() return?', options: ['First match only', 'A list of all matches', 'True or False', 'A match object'], correct: 1, explanation: 're.findall() returns a list of all non-overlapping matches.' },
      { q: 'What does \\d match in regex?', options: ['Any letter', 'Any digit (0-9)', 'Any whitespace', 'Any character'], correct: 1, explanation: '\\d matches any single digit. \\d+ matches one or more digits.' },
      { q: 'What does the "+" quantifier mean?', options: ['Match zero or once', 'Match one or more times', 'Match exactly once', 'Match zero or more'], correct: 1, explanation: '+ means "one or more". * means "zero or more". ? means "zero or one".' },
    ],
  },
  'py-w5-s2': {
    title_en: 'Character Classes and Groups',
    content_en: `## Character Classes — Custom Patterns!

### [ ] — Custom Character Set
\`\`\`python
import re

# [abc] = a or b or c (any one)
# [a-z] = lowercase a to z
# [A-Z] = uppercase A to Z
# [0-9] = digits (same as \\d)
# [^abc] = NOT a, b, or c

text = "Hello World 123"

print(re.findall(r'[aeiou]', text))      # vowels only
print(re.findall(r'[A-Z][a-z]+', text))  # Capitalized words
print(re.findall(r'[^a-zA-Z ]', text))   # non-alpha, non-space
\`\`\`

### Groups — ( ) — Extract Parts
\`\`\`python
import re

# Groups extract different parts separately
date_text = "My birthday is 15-08-1998"
match = re.search(r'(\\d{2})-(\\d{2})-(\\d{4})', date_text)

if match:
    day   = match.group(1)
    month = match.group(2)
    year  = match.group(3)
    print(f"Day: {day}, Month: {month}, Year: {year}")
\`\`\`

### Named Groups
\`\`\`python
import re

log = "2024-01-15 09:23:45 ERROR Database timeout"
pattern = r'(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) (?P<level>\\w+)'

match = re.search(pattern, log)
if match:
    print("Date:", match.group('date'))
    print("Level:", match.group('level'))
\`\`\`

### Alternation — | — OR
\`\`\`python
# Match multiple patterns
pattern = r'dog|cat|bird'
text = "I have a cat and a dog"
print(re.findall(pattern, text))  # ['cat', 'dog']
\`\`\``,
    codeExample_en: `import re

# Character classes
text = "Hello World 123 !@#"

letters = re.findall(r'[a-zA-Z]+', text)
print("Letters:", letters)

digits = re.findall(r'[0-9]+', text)
print("Digits:", digits)

# Groups — capture specific parts
dates = "2024-03-15, 2023-12-25, 2025-01-01"
pattern = r'(\\d{4})-(\\d{2})-(\\d{2})'
matches = re.findall(pattern, dates)
for year, month, day in matches:
    print(f"Year:{year} Month:{month} Day:{day}")

# Named groups
ip = "192.168.1.100"
p = r'(?P<a>\\d+)\\.(?P<b>\\d+)\\.(?P<c>\\d+)\\.(?P<d>\\d+)'
m = re.match(p, ip)
if m: print(f"IP parts: {m.group('a')}, {m.group('b')}")`,
    task_en: { description: 'Build a password strength checker using regex. Check for: uppercase, lowercase, digit, special character, minimum 8 chars. Show which criteria are missing.', hint: 'Use separate re.search(): r"[A-Z]" for uppercase, r"\\d" for digit, r"[!@#$%]" for special chars.' },
    quiz_en: [
      { q: 'What does [a-zA-Z0-9] match?', options: ['Only uppercase', 'Only lowercase', 'Any letter or digit', 'Only digits'], correct: 2, explanation: '[a-zA-Z0-9] = any uppercase letter OR lowercase letter OR digit.' },
      { q: 'What do parentheses () do in regex?', options: ['Make pattern optional', 'Create a capturing group', 'Match literal brackets', 'Repeat the pattern'], correct: 1, explanation: 'Parentheses create a group — you can capture and extract specific parts of the match.' },
      { q: 'What does [^abc] match?', options: ['a, b, or c', 'Any character EXCEPT a, b, c', 'The string "abc"', 'Nothing'], correct: 1, explanation: '^ inside [] means negation — match anything NOT in the set.' },
    ],
  },
  'py-w5-s3': {
    title_en: 're.sub() and re.split() — Modifying Text',
    content_en: `## re.sub() — Replace Patterns in Text!

### re.sub() — Find & Replace on Steroids
\`\`\`python
import re

# Basic replace
text = "Hello   World   Python"
clean = re.sub(r'\\s+', ' ', text)  # Multiple spaces → single space
print(clean)  # "Hello World Python"

# Hide sensitive data
phone_text = "Call me at 9876543210 or 8765432109"
hidden = re.sub(r'[6-9]\\d{9}', 'XXXXX', phone_text)
print(hidden)  # "Call me at XXXXX or XXXXX"

# Replace with function
def censor_word(match):
    word = match.group()
    return word[0] + '*' * (len(word)-2) + word[-1]

text = "I love Python and Python loves me"
result = re.sub(r'Python', censor_word, text)
print(result)
\`\`\`

### re.split() — Split by Pattern
\`\`\`python
import re

# Split by multiple delimiters
text = "apple,banana;cherry|grape mango"
fruits = re.split(r'[,;| ]+', text)
print(fruits)  # ['apple', 'banana', 'cherry', 'grape', 'mango']

# Split sentence into sentences
paragraph = "Hello! How are you? I am fine. Good."
sentences = re.split(r'[.!?]+', paragraph)
print([s.strip() for s in sentences if s.strip()])
\`\`\`

### re.compile() — Reuse Patterns
\`\`\`python
import re

# Compile once, use many times — faster!
phone_pattern = re.compile(r'[6-9]\\d{9}')

texts = [
    "Call Rahul at 9876543210",
    "Email only — no phone",
    "Priya: 8765432109",
]

for text in texts:
    phones = phone_pattern.findall(text)
    if phones:
        print(f"Found: {phones}")
\`\`\``,
    codeExample_en: `import re

# re.sub() — find and replace
text = "Hello   World,  this  has   extra   spaces"
clean = re.sub(r'\\s+', ' ', text)
print("Cleaned:", clean)

# Remove special characters
messy = "H3ll0 W0rld! @#$%"
letters_only = re.sub(r'[^a-zA-Z ]', '', messy)
print("Letters only:", letters_only)

# re.split() — split on pattern
data = "one,two;three|four five"
parts = re.split(r'[,;| ]+', data)
print("Parts:", parts)

# Replace phone formats
phones = "Call 9876-543-210 or (987) 654-3210"
normalized = re.sub(r'[\\s\\-\\(\\)]', '', phones)
print("Normalized:", normalized)`,
    task_en: { description: 'Build a text sanitizer: replace multiple spaces with one, remove special characters, normalize phone formats to XXX-XXX-XXXX.', hint: 're.sub(r"\\s+", " ", text) for spaces. r"[^a-zA-Z0-9 ]" removes special chars.' },
    quiz_en: [
      { q: 'What does re.sub(pattern, replacement, text) do?', options: ['Finds first match', 'Replaces all matches with replacement', 'Splits text', 'Validates text'], correct: 1, explanation: 're.sub() replaces ALL occurrences of the pattern with the replacement string.' },
      { q: 'What does re.split(r"[,;]", text) do?', options: ['Splits only on commas', 'Splits on commas or semicolons', 'Splits on all special chars', 'Finds commas and semicolons'], correct: 1, explanation: '[,;] is a character class matching comma or semicolon. re.split() splits on any match.' },
      { q: 'What does \\s+ match?', options: ['One space', 'One or more whitespace characters', 'Special characters', 'Digits'], correct: 1, explanation: '\\s matches any whitespace (space, tab, newline). + means one or more.' },
    ],
  },
  'py-w5-s4': {
    title_en: 'Week 5 Project — Form Validator',
    content_en: `## Week 5 Project — Complete Form Validator!

Build a form validator like real websites use — powered by regex!

### What to Validate:
1. **Name** — letters and spaces only, 2–50 chars
2. **Email** — valid format (user@domain.com)
3. **Phone** — Indian mobile (starts 6–9, 10 digits)
4. **Password** — 8+ chars, uppercase, digit, special char
5. **Date of Birth** — DD/MM/YYYY format, must be 18+
6. **Pin Code** — Indian 6-digit pin

### Architecture:
\`\`\`python
class FormValidator:
    def validate_name(self, name) → (bool, message)
    def validate_email(self, email) → (bool, message)
    def validate_phone(self, phone) → (bool, message)
    def validate_password(self, pwd) → (bool, strength_score)
    def validate_dob(self, dob) → (bool, message)
    def validate_all(self, form_data) → {field: (valid, msg)}
\`\`\`

### Password Strength Scoring:
\`\`\`python
def check_strength(password):
    score = 0
    checks = {
        "8+ characters":      len(password) >= 8,
        "Uppercase letter":   bool(re.search(r'[A-Z]', password)),
        "Lowercase letter":   bool(re.search(r'[a-z]', password)),
        "Digit":              bool(re.search(r'\\d', password)),
        "Special character":  bool(re.search(r'[!@#$%^&*]', password)),
    }
    for check, passed in checks.items():
        if passed:
            score += 1
        print(f"  {'✅' if passed else '❌'} {check}")
    return score
\`\`\``,
    codeExample_en: `import re

def validate_form(data):
    errors = []

    # Name validation
    if not re.match(r'^[A-Za-z ]{2,50}$', data.get('name', '')):
        errors.append("Name: only letters and spaces, 2-50 chars")

    # Email validation
    if not re.match(r'^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$', data.get('email', '')):
        errors.append("Email: invalid format")

    # Phone validation (10 digits)
    if not re.match(r'^[6-9]\\d{9}$', data.get('phone', '')):
        errors.append("Phone: must be 10 digits starting with 6-9")

    # Pincode validation
    if not re.match(r'^[1-9]\\d{5}$', data.get('pincode', '')):
        errors.append("Pincode: must be 6 digits, not starting with 0")

    return errors

# Test
form_data = {"name": "Rahul Kumar", "email": "rahul@gmail.com",
             "phone": "9876543210", "pincode": "400001"}
errors = validate_form(form_data)
if errors:
    print("Validation errors:"); [print(f"  ❌ {e}") for e in errors]
else:
    print("✅ Form is valid!")`,
    task_en: { description: 'Complete form validator: validate name, email, phone, date of birth, and PIN code. Show specific error messages for each invalid field.', hint: 'Name: r"^[A-Za-z ]{2,50}$". Pincode: r"^[1-9]\\d{5}$". DOB: r"^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$"' },
    quiz_en: [
      { q: 'What does ^ mean at the start of a regex pattern?', options: ['Match anywhere', 'Match at the start of string', 'Negate the pattern', 'Optional match'], correct: 1, explanation: '^  at the start means "must match from the beginning of the string". $ means "end of string".' },
      { q: 'What does {2,50} mean in regex?', options: ['Match 2 to 50 times', 'Match exactly 25 times', 'Match 2 or 50 times only', 'Skip 2 to 50 chars'], correct: 0, explanation: '{min,max} is a quantifier — match between min and max repetitions.' },
      { q: 'Which function checks if the ENTIRE string matches a pattern?', options: ['re.search()', 're.findall()', 're.match()', 're.fullmatch()'], correct: 3, explanation: 're.fullmatch() requires the entire string to match. re.match() only checks from the start.' },
    ],
  },
  'py-w6-s1': {
    title_en: 'requests Library — Sending HTTP Requests',
    content_en: `## requests — Use the Internet from Python!

The \`requests\` library lets Python talk directly to the internet — fetch data from any website!

### Install:
\`\`\`bash
pip install requests
\`\`\`

### Basic GET Request
\`\`\`python
import requests

# Fetch data from a website
response = requests.get("https://api.github.com")
print("Status:", response.status_code)  # 200 = success!
print("Content-Type:", response.headers['content-type'])

# JSON data
data = response.json()
print("GitHub API:", data['current_user_url'])
\`\`\`

### Response Object
\`\`\`python
response = requests.get("https://httpbin.org/get")

print(response.status_code)  # 200
print(response.ok)            # True if 200-299
print(response.text)          # Raw HTML/text
print(response.json())        # Parse JSON
print(response.headers)       # Response headers
print(response.url)           # Final URL
\`\`\`

### Query Parameters
\`\`\`python
import requests

# Pass parameters in URL
params = {
    'q':    'Python tutorial',
    'lang': 'en',
    'page': 1,
}
# Becomes: https://httpbin.org/get?q=Python+tutorial&lang=en&page=1
response = requests.get("https://httpbin.org/get", params=params)
print(response.url)
\`\`\`

### Error Handling
\`\`\`python
import requests

try:
    response = requests.get("https://api.example.com/data", timeout=5)
    response.raise_for_status()  # Raises error for 4xx/5xx
    data = response.json()
    print("Success:", data)
except requests.Timeout:
    print("❌ Request timed out!")
except requests.HTTPError as e:
    print(f"❌ HTTP Error: {e}")
except requests.ConnectionError:
    print("❌ No internet connection!")
\`\`\``,
    codeExample_en: `import requests

# Simple GET request
response = requests.get("https://httpbin.org/get")
print("Status:", response.status_code)  # 200 = OK
print("Content type:", response.headers['Content-Type'])

# Get JSON data
data = response.json()
print("Your IP:", data['origin'])

# With parameters
params = {'search': 'python', 'limit': 5}
r = requests.get("https://httpbin.org/get", params=params)
print("URL with params:", r.url)

# Error handling
try:
    r = requests.get("https://api.example.com/data", timeout=5)
    r.raise_for_status()  # Raises exception for 4xx/5xx
    print(r.json())
except requests.exceptions.Timeout:
    print("Request timed out!")
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")`,
    task_en: { description: 'Use the REST Countries API to display info about any country the user enters: capital, population, area, currencies, languages.', hint: 'requests.get(f"https://restcountries.com/v3.1/name/{country}"). Response is a list — take [0].' },
    quiz_en: [
      { q: 'What does response.status_code == 200 mean?', options: ['Error occurred', 'Request was successful', 'Redirected', 'Not found'], correct: 1, explanation: '200 OK = success. 404 = Not Found. 500 = Server Error. 401 = Unauthorized.' },
      { q: 'What does response.json() return?', options: ['String of JSON', 'Python dict or list parsed from JSON', 'Raw bytes', 'HTML content'], correct: 1, explanation: '.json() parses the JSON response body into a Python dictionary or list.' },
      { q: 'What does raise_for_status() do?', options: ['Prints the status code', 'Raises an exception for 4xx/5xx responses', 'Returns the status', 'Retries the request'], correct: 1, explanation: 'raise_for_status() raises an HTTPError exception if the response status is 4xx or 5xx.' },
    ],
  },
  'py-w6-s2': {
    title_en: 'BeautifulSoup — Parsing HTML',
    content_en: `## BeautifulSoup — Extract Meaning from HTML!

Use \`requests\` to fetch HTML, then \`BeautifulSoup\` to extract data from it!

### Install:
\`\`\`bash
pip install beautifulsoup4 lxml
\`\`\`

### Basic HTML Parsing
\`\`\`python
from bs4 import BeautifulSoup

html = """
<html>
<body>
  <h1 id="title">StudyEarn</h1>
  <p class="desc">Learn Python!</p>
  <a href="https://studyearnai.tech">Visit us</a>
  <ul>
    <li>Python</li>
    <li>JavaScript</li>
    <li>C Programming</li>
  </ul>
</body>
</html>
"""

soup = BeautifulSoup(html, 'lxml')

# Find elements
print(soup.find('h1').text)                  # StudyEarn
print(soup.find('p', class_='desc').text)    # Learn Python!
print(soup.find('a')['href'])                # URL
print([li.text for li in soup.find_all('li')])
\`\`\`

### Real Page Scraping
\`\`\`python
import requests
from bs4 import BeautifulSoup

response = requests.get("https://quotes.toscrape.com")
soup = BeautifulSoup(response.text, 'lxml')

# Extract all quotes
quotes = soup.find_all('div', class_='quote')
for quote in quotes[:3]:
    text   = quote.find('span', class_='text').text
    author = quote.find('small', class_='author').text
    tags   = [t.text for t in quote.find_all('a', class_='tag')]
    print(f'"{text}" — {author}')
    print(f"Tags: {tags}\\n")
\`\`\`

### CSS Selectors
\`\`\`python
# select() uses CSS selectors — more flexible
soup.select('div.quote')           # class
soup.select('#main-content')       # id
soup.select('ul > li')             # direct child
soup.select('a[href]')             # has attribute
soup.select('h2 + p')              # adjacent sibling
\`\`\``,
    codeExample_en: `import requests
from bs4 import BeautifulSoup

url = "https://books.toscrape.com/"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all book articles
books = soup.select("article.product_pod")
print(f"Found {len(books)} books on this page")

# Extract details
for book in books[:3]:
    title = book.find("h3").find("a")["title"]
    price = book.select_one(".price_color").text
    rating = book.find("p", class_="star-rating")["class"][1]
    print(f"Title: {title}")
    print(f"Price: {price}, Rating: {rating}\\n")`,
    task_en: { description: 'Scrape books.toscrape.com — get first 20 books with title, price, rating. Save to CSV. Find cheapest and most expensive.', hint: 'soup.select("article.product_pod") gets books. price = article.select_one(".price_color").text' },
    quiz_en: [
      { q: 'What is BeautifulSoup used for?', options: ['Making HTTP requests', 'Parsing and navigating HTML/XML', 'Storing scraped data', 'Automating browsers'], correct: 1, explanation: 'BeautifulSoup parses HTML documents and provides methods to navigate and search the DOM tree.' },
      { q: 'What is the difference between find() and select()?', options: ['No difference', 'find() returns first match; select() uses CSS selectors and returns a list', 'select() is faster', 'find() uses CSS selectors'], correct: 1, explanation: 'find() returns first element matching tag/attrs. select() uses CSS selectors and returns a list.' },
      { q: 'What does soup.select("article.product_pod") do?', options: ['Finds articles only', 'Finds all article elements with class product_pod', 'Finds product_pod class only', 'Selects the first article'], correct: 1, explanation: 'CSS selector "article.product_pod" = article elements that have the class product_pod.' },
    ],
  },
  'py-w6-s3': {
    title_en: 'Scraping Ethics and Pagination',
    content_en: `## Responsible Scraping — Do it the Right Way!

### robots.txt — Check the Rules
\`\`\`python
import requests

# Always check robots.txt first
response = requests.get("https://books.toscrape.com/robots.txt")
print(response.text)
# If "Disallow: /" — do not scrape!
\`\`\`

### Rate Limiting — Do Not Overload Servers
\`\`\`python
import time
import requests
from bs4 import BeautifulSoup

def scrape_with_respect(urls, delay=1.0):
    """Scrape with polite delay between requests"""
    results = []
    for i, url in enumerate(urls):
        print(f"Scraping {i+1}/{len(urls)}: {url}")
        try:
            response = requests.get(url, timeout=10)
            results.append(response.text)
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(delay)  # Wait between requests!
    return results
\`\`\`

### Headers — Identify Yourself
\`\`\`python
headers = {
    'User-Agent': 'MyBot/1.0 (educational project; contact@email.com)',
    'Accept-Language': 'en-US,en;q=0.9',
}
response = requests.get(url, headers=headers)
\`\`\`

### Advanced — Handling Pagination
\`\`\`python
import requests
from bs4 import BeautifulSoup
import time

def scrape_all_pages(base_url, max_pages=5):
    all_items = []
    
    for page in range(1, max_pages + 1):
        url = f"{base_url}/page/{page}"
        response = requests.get(url)
        
        if response.status_code != 200:
            break
            
        soup = BeautifulSoup(response.text, 'lxml')
        items = soup.find_all('article')
        
        if not items:
            break
            
        all_items.extend(items)
        print(f"Page {page}: {len(items)} items found")
        time.sleep(0.5)
    
    return all_items
\`\`\`

### Ethical Scraping Checklist ✅
1. Check \`robots.txt\`
2. Add delay between requests (min 0.5s)
3. Use descriptive User-Agent
4. Do not scrape private data
5. Cache data — don't repeat requests
6. Respect the site's terms of service`,
    codeExample_en: `import requests, time
from bs4 import BeautifulSoup

def scrape_page(page_num):
    url = f"https://books.toscrape.com/catalogue/page-{page_num}.html"
    response = requests.get(url)
    if response.status_code != 200:
        return []
    soup = BeautifulSoup(response.text, 'html.parser')
    books = []
    for article in soup.select("article.product_pod"):
        books.append({
            'title': article.find("h3").find("a")["title"],
            'price': article.select_one(".price_color").text,
            'rating': article.find("p", class_="star-rating")["class"][1]
        })
    return books

# Scrape first 3 pages with polite delay
all_books = []
for page in range(1, 4):
    print(f"Scraping page {page}...")
    books = scrape_page(page)
    all_books.extend(books)
    time.sleep(1)  # Be polite — 1 second delay

print(f"\\nTotal books scraped: {len(all_books)}")`,
    task_en: { description: 'Scrape 5 pages from books.toscrape.com. Get all books, categorize by rating, show top 10 highest-rated.', hint: 'Loop for page in range(1,6). time.sleep(1) between requests. Sort by rating.' },
    quiz_en: [
      { q: 'Why add time.sleep() between scraping requests?', options: ['Makes code faster', 'Respects server limits and prevents getting banned', 'Required by Python', 'Prevents errors'], correct: 1, explanation: 'Rapid requests can overload servers and get your IP blocked. A 1-2 second delay is polite.' },
      { q: 'What should you check before scraping a website?', options: ['Nothing, scraping is always fine', 'robots.txt file and Terms of Service', 'Only the homepage', 'Server response time'], correct: 1, explanation: 'robots.txt specifies what bots can/cannot access. ToS may explicitly prohibit scraping.' },
      { q: 'How do you handle pagination in scraping?', options: ['Scrape only one page', 'Loop through page numbers changing the URL', 'Use a special library', 'Click next button'], correct: 1, explanation: 'Identify the URL pattern (page-1, page-2...) and loop through pages, collecting data from each.' },
    ],
  },
  'py-w6-s4': {
    title_en: 'Week 6 Project — Price Tracker',
    content_en: `## Week 6 Project — Price Comparison Tool!

Build a real price tracking tool like e-commerce apps!

### Target Site: books.toscrape.com
(Use this for practice — real sites require permission to scrape)

### Features:
1. Search books by category
2. Price comparison (top 10 cheapest)
3. Rating filter (4+ stars only)
4. Save results to CSV
5. Price history tracking (run daily)

### Project Structure:
\`\`\`python
class BookPriceTracker:
    def __init__(self):
        self.base_url = "https://books.toscrape.com"
        self.session  = requests.Session()
        self.session.headers.update({
            'User-Agent': 'BookTracker/1.0 (educational)'
        })
    
    def get_categories(self) → dict
    def scrape_category(self, category_url) → list[dict]
    def filter_by_rating(self, books, min_rating=4) → list
    def sort_by_price(self, books) → list
    def save_to_csv(self, books, filename) → None
    def track_prices(self) → None  # Save with timestamp
\`\`\`

### Data Structure per Book:
\`\`\`python
book = {
    "title":       "A Light in the Attic",
    "price":       51.77,
    "rating":      3,
    "available":   True,
    "url":         "https://...",
    "scraped_at":  "2024-01-15 09:30:00",
}
\`\`\``,
    codeExample_en: `import requests, csv, time
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_all_books(max_pages=5):
    all_books = []
    for page in range(1, max_pages+1):
        url = f"https://books.toscrape.com/catalogue/page-{page}.html"
        r = requests.get(url)
        if r.status_code != 200: break
        soup = BeautifulSoup(r.text, 'html.parser')
        for a in soup.select("article.product_pod"):
            price_str = a.select_one(".price_color").text.replace("£","").strip()
            all_books.append({
                'title': a.find("h3").find("a")["title"],
                'price': float(price_str),
                'rating': a.find("p",class_="star-rating")["class"][1],
                'scraped_at': datetime.now().strftime("%Y-%m-%d")
            })
        time.sleep(0.5)
    return all_books

books = scrape_all_books()
print(f"Scraped {len(books)} books")
prices = [b['price'] for b in books]
print(f"Cheapest: £{min(prices):.2f}")
print(f"Most expensive: £{max(prices):.2f}")
print(f"Average: £{sum(prices)/len(prices):.2f}")`,
    task_en: { description: 'Complete price tracker for books.toscrape.com. Scrape all pages, save to CSV with timestamp, show price distribution and category analysis.', hint: 'Save with csv.DictWriter. Compare prices between runs using saved CSV.' },
    quiz_en: [
      { q: 'Why save scraped data with a timestamp?', options: ['No reason', 'To track price/content changes over time', 'Required by CSV format', 'To sort data'], correct: 1, explanation: 'Timestamps let you compare data across runs and track how prices or content change over time.' },
      { q: 'What is the best approach for a price tracker?', options: ['Scrape once', 'Run regularly and compare with previous data to detect changes', 'Manual checking', 'Screenshot comparison'], correct: 1, explanation: 'A real price tracker runs on a schedule, compares with stored data, and alerts when prices change.' },
      { q: 'How do you handle a website changing its HTML structure?', options: ['The code breaks permanently', 'Update your CSS selectors/tags to match the new structure', 'Use a different website', 'Nothing can be done'], correct: 1, explanation: 'When a website changes structure, update your selectors. This is normal maintenance for scrapers.' },
    ],
  },
  'py-w7-s1': {
    title_en: 'What are APIs — REST API Basics',
    content_en: `## APIs — The Internet's Power Socket!

API = Application Programming Interface. It is a website or service's "backdoor" that provides data directly to your code!

### Real Life Analogy
A restaurant waiter works like an API:
- You (client) place an order
- The waiter (API) takes your request to the kitchen (server)
- The kitchen (server) prepares your food (data)
- The waiter (API) brings it back to you

### HTTP Methods
\`\`\`
GET    — Retrieve data (read)
POST   — Send data (create)
PUT    — Replace data (update)
PATCH  — Partially update
DELETE — Delete data
\`\`\`

### REST API Structure
\`\`\`
https://api.example.com/v1/users/123
         └── base URL  version resource id
\`\`\`

### First API Call
\`\`\`python
import requests

# Free API — no key needed!
response = requests.get("https://api.agify.io?name=Rahul")
data = response.json()
print(data)
# {"name": "Rahul", "age": 35, "count": 12345}

# Another free API
joke = requests.get("https://official-joke-api.appspot.com/random_joke")
j = joke.json()
print(f"{j['setup']}\\n{j['punchline']}")
\`\`\`

### API Keys
Most APIs need authentication:
\`\`\`python
import requests

API_KEY = "your_key_here"

# Option 1: Query parameter
response = requests.get(
    "https://api.example.com/data",
    params={"apikey": API_KEY}
)

# Option 2: Header (more secure)
response = requests.get(
    "https://api.example.com/data",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
\`\`\`

### Status Codes
\`\`\`
200 OK          — Success!
201 Created     — Resource created
400 Bad Request — Your request has an error
401 Unauthorized— API key missing/wrong
404 Not Found   — Resource doesn't exist
429 Too Many    — Rate limit exceeded
500 Server Error— Their problem, not yours
\`\`\``,
    codeExample_en: `import requests

def get_country_info(country_name):
    url = f"https://restcountries.com/v3.1/name/{country_name}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()[0]
        print(f"Country: {data['name']['common']}")
        print(f"Capital: {data.get('capital', ['N/A'])[0]}")
        print(f"Population: {data['population']:,}")
        print(f"Region: {data['region']}")
        currencies = data.get('currencies', {})
        for code, info in currencies.items():
            print(f"Currency: {info['name']} ({code})")
    else:
        print(f"Country not found: {country_name}")

get_country_info("India")
get_country_info("Japan")`,
    task_en: { description: 'Build a world explorer: user enters country name, show: capital, population, area, currencies, languages, neighbouring countries.', hint: 'Keys: name.common, capital[0], population, area, currencies, languages, borders' },
    quiz_en: [
      { q: 'What does REST stand for?', options: ['Remote Execution Service Technology', 'Representational State Transfer', 'Request-Response State Technology', 'Real-time Event Streaming Transfer'], correct: 1, explanation: 'REST = Representational State Transfer. It is an architectural style for web APIs using HTTP.' },
      { q: 'What does a 404 status code mean?', options: ['Success', 'Resource Not Found', 'Server Error', 'Unauthorized'], correct: 1, explanation: '404 = Not Found. The endpoint or resource you requested does not exist.' },
      { q: 'What is an API endpoint?', options: ['A programming language', 'A specific URL that accepts requests and returns data', 'A type of database', 'A web browser'], correct: 1, explanation: 'An endpoint is a specific URL (e.g., /api/users/123) that handles a particular type of request.' },
    ],
  },
  'py-w7-s2': {
    title_en: 'JSON Deep Dive — Handling Complex Data',
    content_en: `## JSON — The Language of APIs!

Almost all modern APIs send data in JSON format. Understand it deeply!

### Nested JSON Navigation
\`\`\`python
import requests

response = requests.get("https://api.github.com/repos/python/cpython")
repo = response.json()

# Nested data access
print("Name:",        repo['name'])
print("Stars:",       repo['stargazers_count'])
print("Language:",    repo['language'])
print("Owner login:", repo['owner']['login'])  # Nested!
print("Topics:",      repo.get('topics', []))  # Safe access
\`\`\`

### Working with Lists in JSON
\`\`\`python
import requests

# GitHub — list of repositories
response = requests.get("https://api.github.com/users/torvalds/repos")
repos = response.json()

print(f"Found {len(repos)} repos\\n")
for repo in repos[:5]:
    name        = repo['name']
    stars       = repo['stargazers_count']
    description = repo.get('description', 'No description')
    print(f"★{stars:5d}  {name}")
    print(f"         {description[:60]}\\n")
\`\`\`

### Saving JSON to File
\`\`\`python
import requests
import json
from datetime import datetime

def fetch_and_save(url, filename):
    response = requests.get(url)
    data     = response.json()
    
    # Add metadata
    data['_fetched_at'] = datetime.now().isoformat()
    
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved to {filename}")

# Load later
with open(filename) as f:
    data = json.load(f)
\`\`\`

### JSON Flattening
\`\`\`python
# Deeply nested → flat dictionary
def flatten(obj, prefix=''):
    result = {}
    for key, val in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if isinstance(val, dict):
            result.update(flatten(val, full_key))
        else:
            result[full_key] = val
    return result
\`\`\``,
    codeExample_en: `import requests, json

# Fetch users from JSONPlaceholder
users = requests.get("https://jsonplaceholder.typicode.com/users").json()
print(f"Total users: {len(users)}")

for user in users[:3]:
    print(f"\\nName: {user['name']}")
    print(f"Email: {user['email']}")
    print(f"City: {user['address']['city']}")
    print(f"Company: {user['company']['name']}")

# Save to JSON file
with open("users.json", "w") as f:
    json.dump(users, f, indent=2)
print("\\nSaved to users.json")

# Load from JSON file
with open("users.json", "r") as f:
    loaded = json.load(f)
print(f"Loaded {len(loaded)} users from file")`,
    task_en: { description: 'Fetch users from JSONPlaceholder (/users). For each user show: name, email, company, city. Then fetch their posts and show post count per user.', hint: 'GET /users for list. GET /posts?userId={id} for user posts. Count with len().' },
    quiz_en: [
      { q: 'What is JSON?', options: ['A programming language', 'A lightweight data format for exchanging information', 'A type of database', 'A Python library'], correct: 1, explanation: 'JSON (JavaScript Object Notation) is a text format for storing and exchanging data — readable by humans and machines.' },
      { q: 'What does json.dumps() do?', options: ['Reads JSON from file', 'Converts Python object to JSON string', 'Parses JSON string to Python', 'Saves JSON to file'], correct: 1, explanation: 'json.dumps() = Python → JSON string. json.loads() = JSON string → Python. json.dump/load for files.' },
      { q: 'How do you access nested JSON like {"address": {"city": "Mumbai"}}?', options: ['data["address,city"]', 'data["address"]["city"]', 'data.address.city', 'data["address.city"]'], correct: 1, explanation: 'Chain square brackets for nested dicts: data["address"]["city"].' },
    ],
  },
  'py-w7-s3': {
    title_en: 'POST Requests — Sending Data to APIs',
    content_en: `## POST Requests — Send Data to APIs!

GET fetches data. POST sends data (to create something).

### Basic POST Request
\`\`\`python
import requests

# httpbin.org is a testing API
response = requests.post(
    "https://httpbin.org/post",
    json={                      # Python dict → JSON automatically
        "name":    "Rahul",
        "course":  "Python",
        "score":   95,
    }
)
data = response.json()
print("Sent:", data['json'])    # Echo back what we sent
\`\`\`

### POST with Form Data
\`\`\`python
import requests

# Old-style form submission (not JSON)
response = requests.post(
    "https://httpbin.org/post",
    data={                      # Form data — not json=
        "username": "rahul",
        "password": "secret123",
    }
)
print(response.json()['form'])
\`\`\`

### REST API — Full CRUD
\`\`\`python
import requests

BASE = "https://jsonplaceholder.typicode.com"

# CREATE — POST
new_post = {
    "title":  "My First Post",
    "body":   "Python is amazing!",
    "userId": 1,
}
r = requests.post(f"{BASE}/posts", json=new_post)
print("Created:", r.json())

# READ — GET
r = requests.get(f"{BASE}/posts/1")
print("Post:", r.json()['title'])

# UPDATE — PUT
r = requests.put(f"{BASE}/posts/1", json={"title": "Updated Title"})
print("Updated:", r.json())

# DELETE
r = requests.delete(f"{BASE}/posts/1")
print("Deleted, status:", r.status_code)  # 200
\`\`\`

### Session — Maintain Login
\`\`\`python
import requests

session = requests.Session()

# Login once
session.post("https://httpbin.org/post", data={"user": "me"})

# All subsequent requests keep the session
r1 = session.get("https://httpbin.org/cookies")
r2 = session.get("https://httpbin.org/headers")
\`\`\``,
    codeExample_en: `import requests

BASE = "https://jsonplaceholder.typicode.com"

# GET — Read posts
posts = requests.get(f"{BASE}/posts?_limit=3").json()
print(f"Fetched {len(posts)} posts")

# POST — Create new post
new_post = {"title": "My Python Post", "body": "Learning APIs is fun!", "userId": 1}
r = requests.post(f"{BASE}/posts", json=new_post)
print(f"\\nCreated: {r.status_code}")
print(f"New post ID: {r.json()['id']}")

# PUT — Full update
updated = {"id": 1, "title": "Updated Title", "body": "New content", "userId": 1}
r = requests.put(f"{BASE}/posts/1", json=updated)
print(f"\\nUpdated: {r.status_code}")

# DELETE
r = requests.delete(f"{BASE}/posts/1")
print(f"\\nDeleted: {r.status_code}")`,
    task_en: { description: 'Use JSONPlaceholder: GET all posts, create a new post (POST), update it (PUT/PATCH), delete it (DELETE). Show response status codes for each.', hint: 'POST to /posts with json={...}. PUT for full update, PATCH for partial. DELETE /posts/{id}.' },
    quiz_en: [
      { q: 'What HTTP method is used to CREATE a new resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 1, explanation: 'POST creates new resources. GET reads, PUT/PATCH updates, DELETE removes.' },
      { q: 'What is the difference between PUT and PATCH?', options: ['No difference', 'PUT replaces the entire resource; PATCH updates only specified fields', 'PATCH is faster', 'PUT is for files only'], correct: 1, explanation: 'PUT sends the complete new version. PATCH sends only the fields you want to change.' },
      { q: 'What status code indicates a resource was successfully created?', options: ['200 OK', '201 Created', '204 No Content', '200 or 201'], correct: 1, explanation: '201 Created = new resource was successfully created. 200 = general success. 204 = success, no response body.' },
    ],
  },
  'py-w7-s4': {
    title_en: 'Week 7 Project — News Aggregator',
    content_en: `## Week 7 Project — Multi-Source News Aggregator!

Fetch data from real news APIs and build an aggregator!

### Free News APIs:
1. **NewsAPI.org** — Free tier: 100 requests/day, account required
2. **GNews API** — Free: 10 requests/day
3. **Hacker News** — Completely free, no key!

### Project Features:
1. Fetch top stories from Hacker News API
2. Filter by keyword / category
3. Display with title, score, comments
4. Save favourites to JSON
5. CLI interface with search

### Hacker News API (Free, No Key):
\`\`\`
Base URL: https://hacker-news.firebaseio.com/v0

Endpoints:
  /topstories.json    — IDs of top 500 stories
  /item/{id}.json     — Full story details
  /user/{id}.json     — User info
  /newstories.json    — Latest stories
  /askstories.json    — Ask HN posts
\`\`\`

### Expected Output:
\`\`\`
🔥 Top 10 HN Stories — Python
────────────────────────────────────────
1. ★ 342  Ask HN: What Python projects did you build?
         💬 127 comments | 2 hours ago

2. ★ 287  Python 3.13 Released — New Features Overview
         💬 89 comments  | 5 hours ago
\`\`\``,
    codeExample_en: `import requests

BASE = "https://hacker-news.firebaseio.com/v0"

def get_top_stories(limit=10):
    ids = requests.get(f"{BASE}/topstories.json").json()[:limit]
    stories = []
    for story_id in ids:
        item = requests.get(f"{BASE}/item/{story_id}.json").json()
        if item and item.get('type') == 'story':
            stories.append({
                'title': item.get('title', 'No title'),
                'score': item.get('score', 0),
                'by': item.get('by', 'unknown'),
                'comments': item.get('descendants', 0)
            })
    return stories

stories = get_top_stories(5)
print("Top Hacker News Stories:\\n")
for i, s in enumerate(stories, 1):
    print(f"{i}. {s['title']}")
    print(f"   Score: {s['score']} | By: {s['by']} | Comments: {s['comments']}\\n")`,
    task_en: { description: 'Build a news aggregator using Hacker News API. Fetch top/best/new stories. Show title, score, author, comments. Add search by keyword in title.', hint: 'GET /v0/topstories.json for IDs. Then /v0/item/{id}.json for each story. Filter with keyword in title.' },
    quiz_en: [
      { q: 'What is a REST API rate limit?', options: ['Maximum response size', 'Maximum number of requests allowed in a time period', 'Maximum URL length', 'Maximum JSON depth'], correct: 1, explanation: 'Rate limits prevent abuse. Common: 100 requests/hour (free tier). Always check API documentation.' },
      { q: 'How do you efficiently fetch multiple items from an API?', options: ['One request per item (always)', 'Use batch endpoints if available, otherwise loop with delays', 'Download everything at once', 'Use multithreading always'], correct: 1, explanation: 'Use batch endpoints when available. Otherwise loop with polite delays. Avoid unnecessary requests.' },
      { q: 'What should you do with your API key?', options: ['Share it publicly', 'Store in environment variables, never in code', 'Put it in comments', 'Post on GitHub'], correct: 1, explanation: 'Never hardcode API keys. Use os.environ["KEY"] or python-dotenv. Keys in code can be stolen from GitHub.' },
    ],
  },
  'py-w8-s1': {
    title_en: 'Pandas Basics — Understanding DataFrames',
    content_en: `## Pandas — Python's Excel on Steroids!

Pandas is the most powerful library for data analysis. Used everywhere in Data Science and AI!

### Install:
\`\`\`bash
pip install pandas openpyxl
\`\`\`

### Creating a DataFrame
\`\`\`python
import pandas as pd

# From a dictionary
data = {
    'name':    ['Rahul', 'Priya', 'Arjun', 'Neha'],
    'class':   [10, 11, 10, 12],
    'math':    [85, 92, 78, 95],
    'science': [90, 88, 82, 97],
}
df = pd.DataFrame(data)
print(df)
\`\`\`

### Basic Operations
\`\`\`python
# Explore
print(df.shape)       # (4, 4) — rows × columns
print(df.dtypes)      # column types
print(df.describe())  # statistics
print(df.head(2))     # first 2 rows
print(df.tail(2))     # last 2 rows

# Access
print(df['name'])              # column
print(df[['name', 'math']])    # multiple columns
print(df.iloc[0])              # row by index
print(df.loc[0, 'name'])       # specific cell

# Filter
toppers = df[df['math'] >= 90]
class10 = df[df['class'] == 10]
print(toppers[['name', 'math']])
\`\`\`

### Aggregation
\`\`\`python
print(df['math'].mean())   # Average
print(df['math'].max())    # Maximum
print(df['math'].min())    # Minimum
print(df['math'].sum())    # Total
print(df.groupby('class')['math'].mean())  # Average by class
\`\`\`

### Adding Columns
\`\`\`python
df['total']   = df['math'] + df['science']
df['average'] = df['total'] / 2
df['grade']   = df['average'].apply(
    lambda x: 'A+' if x >= 90 else 'A' if x >= 80 else 'B'
)
\`\`\``,
    codeExample_en: `import pandas as pd
import numpy as np

# Create a DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 22, 28, 35],
    'score': [88, 75, 92, 68, 95],
    'city': ['Mumbai', 'Delhi', 'Mumbai', 'Bangalore', 'Delhi']
}
df = pd.DataFrame(data)

print(df.head())         # First 5 rows
print(df.describe())     # Statistics
print(df.dtypes)         # Data types

# Filtering
high_scorers = df[df['score'] >= 85]
mumbai = df[df['city'] == 'Mumbai']

# Groupby
city_avg = df.groupby('city')['score'].mean()
print(city_avg)`,
    task_en: { description: 'Load a student dataset (50 rows). Analyze: class average, gender comparison, top 5, pass percentage, subject-wise averages.', hint: 'df.groupby("gender")["percentage"].mean() for gender. df[df["percentage"]>=60].shape[0] for pass count.' },
    quiz_en: [
      { q: 'What is a Pandas DataFrame?', options: ['A Python list', 'A 2D labeled data structure like a spreadsheet', 'A dictionary', 'A NumPy array'], correct: 1, explanation: 'DataFrame is Pandas\' main data structure — rows and columns with labels, like a spreadsheet or SQL table.' },
      { q: 'What does df[df["score"] >= 85] do?', options: ['Selects column "score"', 'Filters rows where score is 85 or higher', 'Counts rows with score 85', 'Sorts by score'], correct: 1, explanation: 'Boolean indexing — creates a True/False mask and returns only rows where condition is True.' },
      { q: 'What does df.groupby("city")["score"].mean() return?', options: ['Overall mean score', 'Mean score for each city', 'Cities with high scores', 'Total score per city'], correct: 1, explanation: 'groupby() splits data by city, then .mean() calculates the average score for each group.' },
    ],
  },
  'py-w8-s2': {
    title_en: 'Data Cleaning — Fixing Messy Data',
    content_en: `## Data Cleaning — The Most Important Skill in Real Data!

Real data is ALWAYS messy — null values, duplicates, wrong formats, typos. Cleaning it is essential!

### Handling Missing Values
\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'name':  ['Rahul', 'Priya', None, 'Neha'],
    'score': [85, np.nan, 78, 92],
    'city':  ['Mumbai', 'Delhi', 'Mumbai', None],
})

print(df.isnull().sum())    # Count nulls per column
print(df.isnull().any())    # Which columns have nulls

# Options:
df['score'].fillna(df['score'].mean(), inplace=True)  # Fill with mean
df['city'].fillna('Unknown', inplace=True)            # Fill with default
df.dropna(subset=['name'], inplace=True)              # Drop rows where name is null
\`\`\`

### Removing Duplicates
\`\`\`python
df = pd.DataFrame({
    'name':  ['Rahul', 'Priya', 'Rahul', 'Arjun'],
    'score': [85, 92, 85, 78],
})

print(df.duplicated())           # Which rows are duplicate?
df.drop_duplicates(inplace=True) # Remove duplicates
\`\`\`

### Fixing Data Types
\`\`\`python
df['score']   = pd.to_numeric(df['score'], errors='coerce')
df['date']    = pd.to_datetime(df['date'], format='%d/%m/%Y')
df['name']    = df['name'].str.strip().str.title()    # clean whitespace, title case
df['email']   = df['email'].str.lower()              # lowercase
\`\`\`

### Outlier Detection
\`\`\`python
# Using IQR method
Q1  = df['score'].quantile(0.25)
Q3  = df['score'].quantile(0.75)
IQR = Q3 - Q1

outliers = df[(df['score'] < Q1 - 1.5*IQR) | (df['score'] > Q3 + 1.5*IQR)]
print(f"Outliers found: {len(outliers)}")
clean_df = df[~df.index.isin(outliers.index)]
\`\`\``,
    codeExample_en: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Alice', 'Eve'],
    'age': [25, None, 22, 25, 35],
    'salary': [50000, 60000, 45000, 50000, 999999]
})

# Check missing values
print(df.isnull().sum())

# Fill missing values
df['name'] = df['name'].fillna('Unknown')
df['age'] = df['age'].fillna(df['age'].median())

# Remove duplicates
df = df.drop_duplicates()
print(f"After dedup: {len(df)} rows")

# Handle outliers
q99 = df['salary'].quantile(0.99)
df.loc[df['salary'] > q99, 'salary'] = df['salary'].median()

print(df)`,
    task_en: { description: 'Create messy employee data (missing values, duplicates, outliers). Clean: fill missing, remove duplicates, handle outliers, fix types, save clean version.', hint: 'df["col"].fillna(df["col"].median()) for numeric. df["col"].fillna("Unknown") for strings.' },
    quiz_en: [
      { q: 'What does df.isnull().sum() show?', options: ['Total missing values', 'Missing count per column', 'Rows with any missing value', 'Percentage missing'], correct: 1, explanation: 'isnull() creates a True/False mask. .sum() counts True values per column = missing count per column.' },
      { q: 'What is the difference between fillna() and dropna()?', options: ['No difference', 'fillna() replaces missing values; dropna() removes rows with missing values', 'dropna() is faster', 'fillna() removes rows'], correct: 1, explanation: 'fillna() fills gaps with a value. dropna() deletes rows (or columns) containing missing values.' },
      { q: 'When should you use median instead of mean for filling missing values?', options: ['Always use mean', 'When data has outliers — median is more robust', 'Always use median', 'When data has no outliers'], correct: 1, explanation: 'Median is unaffected by extreme values. If salary has a ₹10 crore outlier, mean is skewed — median is safer.' },
    ],
  },
  'py-w8-s3': {
    title_en: 'Data Visualization — Creating Graphs with Matplotlib',
    content_en: `## Matplotlib — Visualise Your Data!

### Install:
\`\`\`bash
pip install matplotlib seaborn
\`\`\`

### Basic Plots
\`\`\`python
import matplotlib.pyplot as plt
import pandas as pd

subjects = ['Math', 'Science', 'English', 'Hindi', 'CS']
scores   = [85, 92, 78, 88, 95]

# Bar chart
plt.figure(figsize=(10, 6))
plt.bar(subjects, scores, color=['#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#FF9800'])
plt.title('Student Subject Scores', fontsize=14, fontweight='bold')
plt.ylabel('Marks')
plt.ylim(0, 100)
for i, score in enumerate(scores):
    plt.text(i, score + 1, str(score), ha='center', fontweight='bold')
plt.tight_layout()
plt.savefig('scores.png', dpi=150)
plt.show()
\`\`\`

### Multiple Plot Types
\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 1. Line chart
x = range(1, 13)
axes[0,0].plot(x, np.random.randint(50, 100, 12), 'b-o', linewidth=2)
axes[0,0].set_title('Monthly Performance')

# 2. Pie chart
axes[0,1].pie([30, 25, 20, 15, 10], labels=['Python','JS','C','Java','Other'],
              autopct='%1.0f%%', startangle=90)
axes[0,1].set_title('Language Popularity')

# 3. Scatter plot
axes[1,0].scatter(np.random.rand(50)*100, np.random.rand(50)*100,
                  c='purple', alpha=0.6, s=100)
axes[1,0].set_title('Study Time vs Score')

# 4. Histogram
axes[1,1].hist(np.random.normal(70, 15, 200), bins=20, color='orange', edgecolor='black')
axes[1,1].set_title('Score Distribution')

plt.tight_layout()
plt.savefig('dashboard.png', dpi=150, bbox_inches='tight')
plt.show()
\`\`\``,
    codeExample_en: `import matplotlib.pyplot as plt
import numpy as np

months = ['Jan','Feb','Mar','Apr','May','Jun']
sales = [12000, 15000, 13500, 18000, 16500, 21000]
expenses = [8000, 9000, 8500, 11000, 10000, 12000]

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Line chart
axes[0].plot(months, sales, 'b-o', label='Sales', linewidth=2)
axes[0].plot(months, expenses, 'r--s', label='Expenses', linewidth=2)
axes[0].set_title('Sales vs Expenses')
axes[0].set_ylabel('Amount (₹)')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Bar chart
profit = [s-e for s,e in zip(sales, expenses)]
colors = ['green' if p > 0 else 'red' for p in profit]
axes[1].bar(months, profit, color=colors)
axes[1].set_title('Monthly Profit')
axes[1].set_ylabel('Profit (₹)')

plt.tight_layout()
plt.savefig('sales_chart.png', dpi=150)
plt.show()`,
    task_en: { description: 'Create a 4-chart sales dashboard: monthly revenue (line), product sales (bar), category distribution (pie), employee performance (scatter).', hint: 'plt.subplots(2,2,figsize=(14,10)). axes[0,0] for top-left chart. fig.suptitle() for overall title.' },
    quiz_en: [
      { q: 'What does plt.subplots(2, 2) create?', options: ['One chart', '2 charts side by side', 'A 2x2 grid of 4 charts', '2 rows of charts'], correct: 2, explanation: 'subplots(rows, cols) creates a grid. (2,2) = 4 charts arranged in 2 rows and 2 columns.' },
      { q: 'When should you use a pie chart?', options: ['For trends over time', 'For showing parts of a whole (percentages)', 'For comparing many items', 'For correlation'], correct: 1, explanation: 'Pie charts show proportions/percentages. Use them when parts add up to 100% and you have few categories.' },
      { q: 'What does plt.tight_layout() do?', options: ['Makes the chart bigger', 'Automatically adjusts spacing to prevent overlapping', 'Adds a title', 'Saves the figure'], correct: 1, explanation: 'tight_layout() automatically adjusts subplot parameters so labels and titles do not overlap.' },
    ],
  },
  'py-w8-s4': {
    title_en: 'Month 2 Capstone — Sales Data Dashboard',
    content_en: `## Month 2 Capstone Project — Complete Data Analytics!

Month 2 grand finale — build a real data analytics project worthy of your portfolio!

### Project: E-Commerce Sales Analyser

**Generate or download a dataset:**
- 1000+ orders
- Multiple products
- Multiple customers
- 6+ months of data

### Analysis Requirements:
1. **Sales trends** — monthly, weekly patterns
2. **Top products** — by revenue and by units sold
3. **Customer segments** — high/mid/low value
4. **Geographic analysis** — sales by region
5. **Profitability** — revenue vs cost
6. **Predictive** — simple forecast for next month

### Dashboard Output:
\`\`\`
📊 E-Commerce Analytics Dashboard
══════════════════════════════════
Period: Jan–Jun 2024

💰 Revenue Summary:
  Total Revenue:  ₹45,23,450
  Total Orders:   1,247
  Avg Order Value:₹3,627

📦 Top 5 Products:
  1. Laptop    ₹18,45,000  (41 units)
  2. Phone     ₹12,30,000  (82 units)
  ...

📈 Monthly Trend:
  Jan: ████████  ₹6.2L
  Feb: ██████    ₹4.8L
  ...
\`\`\``,
    codeExample_en: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Generate sales dataset
np.random.seed(42)
n = 500
df = pd.DataFrame({
    'month': np.random.choice(['Jan','Feb','Mar','Apr','May','Jun'], n),
    'product': np.random.choice(['Laptop','Phone','Tablet','Watch'], n),
    'region': np.random.choice(['North','South','East','West'], n),
    'units': np.random.randint(1, 20, n),
    'price': np.random.uniform(5000, 50000, n).round(0)
})
df['revenue'] = df['units'] * df['price']

print("=== SALES DASHBOARD ===")
print(f"Total Revenue: ₹{df['revenue'].sum():,.0f}")
print(f"Avg Order Value: ₹{df['revenue'].mean():,.0f}")

top_product = df.groupby('product')['revenue'].sum().idxmax()
print(f"Top Product: {top_product}")

region_perf = df.groupby('region')['revenue'].sum().sort_values(ascending=False)
print("\\nRegion Performance:")
print(region_perf)`,
    task_en: { description: 'Build complete sales analysis: generate 12-month data, analyze by product/month/region, create 4 visualizations, export Excel report.', hint: 'df["revenue"].sum() for total. df.groupby("product")["revenue"].sum().idxmax() for top product.' },
    quiz_en: [
      { q: 'What does df.groupby("product")["revenue"].sum() return?', options: ['Total revenue', 'Revenue per product', 'Product list', 'Revenue sorted'], correct: 1, explanation: 'groupby("product") splits by product, .sum() totals the revenue for each product — returns a Series.' },
      { q: 'What is the advantage of pandas over plain Python lists for data analysis?', options: ['Faster syntax', 'Built-in aggregation, filtering, and analysis functions optimized for large data', 'Uses less memory', 'More readable code'], correct: 1, explanation: 'Pandas provides vectorized operations, groupby, merge, pivot — all optimized for tabular data at scale.' },
      { q: 'What does df.describe() show?', options: ['Column names and types', 'Statistical summary: count, mean, std, min, quartiles, max', 'First 5 rows', 'Missing values'], correct: 1, explanation: 'describe() shows count, mean, std, min, 25%, 50%, 75%, max for all numeric columns.' },
    ],
  },
  'py-w9-s1': {
    title_en: 'Django Setup and First Project',
    content_en: `## Django — Python's #1 Web Framework!

Instagram, Pinterest, Disqus — all built with Django. Learn how!

### Install:
\`\`\`bash
pip install django
django-admin --version  # Check version
\`\`\`

### Create a New Project:
\`\`\`bash
django-admin startproject myblog
cd myblog
python manage.py startapp posts   # Create an app
python manage.py runserver        # Start dev server → http://127.0.0.1:8000
\`\`\`

### Project Structure:
\`\`\`
myblog/
├── manage.py          ← Command-line tool
├── myblog/
│   ├── settings.py    ← Configuration
│   ├── urls.py        ← URL routing
│   └── wsgi.py        ← Production server
└── posts/             ← Your app
    ├── models.py      ← Database tables
    ├── views.py       ← Business logic
    ├── urls.py        ← App URLs
    └── templates/     ← HTML files
\`\`\`

### Django MVT Pattern:
\`\`\`
Browser → URL Router → View → Model (DB) → Template → Browser
            urls.py   views.py models.py   .html
\`\`\`

### Your First View:
\`\`\`python
# posts/views.py
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return HttpResponse("<h1>Welcome to My Blog! 🎉</h1>")

def about(request):
    context = {'title': 'About Us', 'author': 'StudyEarn'}
    return render(request, 'about.html', context)
\`\`\`

### Connect URLs:
\`\`\`python
# posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('',       views.home,  name='home'),
    path('about/', views.about, name='about'),
]

# myblog/urls.py (main)
from django.urls import path, include
urlpatterns = [
    path('', include('posts.urls')),
]
\`\`\``,
    codeExample_en: `# posts/views.py — Create the first view
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return HttpResponse("<h1>Welcome to My Blog! 🎉</h1>")

def about(request):
    context = {
        'name': 'Rahul Kumar',
        'skills': ['Python', 'Django', 'React'],
        'experience': 2,
    }
    return render(request, 'posts/about.html', context)

# posts/urls.py — URL routing
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
]

# myblog/urls.py — Main URL file mein include karo
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls')),  # posts app ke URLs
]`,
    task_en: { description: 'Create Django project "mystudysite" with "pages" app. Build 3 pages: home (welcome + your name), about (your info), contact (contact form HTML). Configure all URLs.', hint: 'django-admin startproject → startapp → add to INSTALLED_APPS → views.py functions → urls.py routes' },
    quiz_en: [
      { q: 'What command creates a new Django app?', options: ['django-admin createapp', 'python manage.py startapp', 'django new app', 'pip install app'], correct: 1, explanation: 'python manage.py startapp appname creates a new app with models, views, urls files.' },
      { q: "What is Django's MVT pattern?", options: ['Model-View-Template', 'Module-Variable-Type', 'Main-View-Transfer', 'Model-Variable-Template'], correct: 0, explanation: 'MVT = Model (database), View (logic), Template (HTML). Django\'s version of MVC.' },
      { q: 'What does render(request, template, context) do?', options: ['Sends HTTP request', 'Renders HTML template with context data and returns HTTP response', 'Creates database entry', 'Redirects to URL'], correct: 1, explanation: 'render() combines a template with context dict to produce an HTTP response with HTML.' },
    ],
  },
  'py-w9-s2': {
    title_en: 'Django Models — Database Tables with Python',
    content_en: `## Models — Use a Database Without Writing SQL!

In Django you write Python classes — Django generates the SQL automatically!

### Defining a Model:
\`\`\`python
# posts/models.py
from django.db import models

class Post(models.Model):
    title      = models.CharField(max_length=200)
    content    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author     = models.CharField(max_length=100, default='Admin')
    published  = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
\`\`\`

### Run Migrations:
\`\`\`bash
python manage.py makemigrations   # Generate SQL
python manage.py migrate          # Apply to database
\`\`\`

### Django ORM — Query the Database:
\`\`\`python
# Create
Post.objects.create(title="Hello World", content="My first post!")

# Read
all_posts      = Post.objects.all()
published      = Post.objects.filter(published=True)
recent_5       = Post.objects.order_by('-created_at')[:5]
post           = Post.objects.get(id=1)

# Update
post.title = "Updated Title"
post.save()
Post.objects.filter(published=False).update(published=True)

# Delete
post.delete()
Post.objects.filter(title="Old").delete()

# Complex queries
from django.db.models import Q
results = Post.objects.filter(
    Q(title__icontains='python') | Q(content__icontains='python')
)
\`\`\`

### Relationships:
\`\`\`python
class Comment(models.Model):
    post    = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author  = models.CharField(max_length=100)
    content = models.TextField()

# Usage
post = Post.objects.get(id=1)
post.comments.all()   # All comments for this post
\`\`\``,
    codeExample_en: `# posts/models.py — Blog models
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='posts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

# posts/views.py — ORM use karo
from django.shortcuts import render
from .models import Post, Category

def post_list(request):
    posts = Post.objects.filter(is_published=True)
    categories = Category.objects.all()
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': categories,
    })

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    post.views += 1
    post.save()
    return render(request, 'posts/detail.html', {'post': post})`,
    task_en: { description: 'Create 3 models: Category, Post (FK to Category), Comment (FK to Post). Run migrations. Use Django shell to create data and practice ORM queries.', hint: 'makemigrations → migrate → shell. from posts.models import Post → Post.objects.create(...)' },
    quiz_en: [
      { q: 'What does makemigrations do?', options: ['Updates database', 'Creates migration files detecting model changes', 'Runs the server', 'Tests models'], correct: 1, explanation: 'makemigrations detects changes in models.py and creates migration files. migrate applies them to DB.' },
      { q: 'What does Post.objects.filter(is_published=True) return?', options: ['One post', 'QuerySet of all published posts', 'True or False', 'Count of posts'], correct: 1, explanation: 'filter() returns a QuerySet (lazy list) of all matching objects. get() returns exactly one.' },
      { q: 'What does on_delete=models.CASCADE do in ForeignKey?', options: ['Protects parent from deletion', 'When parent is deleted, child records are deleted too', 'Sets FK to NULL', 'Raises an error'], correct: 1, explanation: 'CASCADE = if Category is deleted, all its Posts are also deleted automatically.' },
    ],
  },
  'py-w9-s3': {
    title_en: 'Django Templates and Admin Panel',
    content_en: `## Templates — Django's HTML Engine!

### Template Setup:
\`\`\`python
# In settings.py — TEMPLATES config:
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],  # Global templates folder
    'APP_DIRS': True,                  # Also look in app/templates/
    ...
}]
\`\`\`

### Base Template (templates/base.html):
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Blog{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">Home</a>
        <a href="{% url 'about' %}">About</a>
    </nav>

    <main>
        {% block content %}{% endblock %}
    </main>
</body>
</html>
\`\`\`

### Child Template (templates/home.html):
\`\`\`html
{% extends 'base.html' %}

{% block title %}Home — My Blog{% endblock %}

{% block content %}
<h1>Latest Posts</h1>

{% for post in posts %}
    <article>
        <h2>{{ post.title }}</h2>
        <p>{{ post.content|truncatewords:30 }}</p>
        <small>{{ post.created_at|date:"d M Y" }}</small>
        <a href="{% url 'post_detail' post.id %}">Read More →</a>
    </article>
{% empty %}
    <p>No posts yet!</p>
{% endfor %}
{% endblock %}
\`\`\`

### Template Tags & Filters:
\`\`\`
{{ variable }}              — Output a variable
{{ text|truncatewords:20 }} — Filter
{% for item in list %}      — Loop
{% if condition %}          — Condition
{% url 'name' %}            — Reverse URL
{% extends 'base.html' %}   — Inheritance
{% block name %}{% endblock %}— Block
{% include 'nav.html' %}    — Include partial
\`\`\`

### Django Admin:
\`\`\`python
# posts/admin.py
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display  = ['title', 'author', 'published', 'created_at']
    list_filter   = ['published', 'created_at']
    search_fields = ['title', 'content']
\`\`\`
\`\`\`bash
python manage.py createsuperuser  # Create admin account
# Visit: http://127.0.0.1:8000/admin/
\`\`\``,
    codeExample_en: `# Complete blog app with templates

# posts/views.py
from django.shortcuts import render, get_object_or_404
from .models import Post, Category

def post_list(request):
    category_slug = request.GET.get('category')
    posts = Post.objects.filter(is_published=True)
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': Category.objects.all(),
        'current_category': category_slug,
    })

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk, is_published=True)
    post.views += 1
    post.save()
    related = Post.objects.filter(
        category=post.category,
        is_published=True
    ).exclude(pk=pk)[:3]
    return render(request, 'posts/detail.html', {
        'post': post,
        'related_posts': related,
    })

# posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
]`,
    task_en: { description: 'Build blog with templates: base.html (navbar), list.html (posts as cards with category filter), detail.html (full post + related posts). Register models in admin.', hint: 'templates/ at project root. Add to DIRS in settings.py. {% block content %}{% endblock %} in base.html.' },
    quiz_en: [
      { q: 'How do you use a URL in Django templates?', options: ['"http://localhost/post/1"', '{% url "post_detail" post.pk %}', '{{ url post_detail }}', 'href="/post/1"'], correct: 1, explanation: '{% url "view_name" args %} generates URLs by view name — if URL changes, templates update automatically.' },
      { q: 'What does {% extends "base.html" %} do?', options: ['Copies all of base.html', 'Makes the template inherit from base.html', 'Imports base.html', 'Includes base.html content'], correct: 1, explanation: 'extends lets a child template inherit the layout from a parent template, filling in {% block %} areas.' },
      { q: 'What does {{ post.content|truncatewords:30 }} do?', options: ['Shows 30th word', 'Shows first 30 words then ...', 'Truncates to 30 chars', 'Repeats 30 times'], correct: 1, explanation: 'Filters in Django templates format output. truncatewords:30 shows first 30 words + ellipsis.' },
    ],
  },
  'py-w9-s4': {
    title_en: 'Week 9 Project — Full Blog with Forms',
    content_en: `## Week 9 Project — Full Featured Blog!

Now build a complete blog with forms, user input, database — everything!

### Django Forms:
\`\`\`python
# posts/forms.py
from django import forms
from .models import Post, Comment

class PostForm(forms.ModelForm):
    class Meta:
        model  = Post
        fields = ['title', 'content', 'published']
        widgets = {
            'title':   forms.TextInput(attrs={'class': 'form-control'}),
            'content': forms.Textarea(attrs={'rows': 10}),
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model  = Comment
        fields = ['author', 'content']
\`\`\`

### View with Form Handling:
\`\`\`python
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return redirect('post_detail', pk=post.id)
    else:
        form = PostForm()
    return render(request, 'create_post.html', {'form': form})
\`\`\`

### Search Functionality:
\`\`\`python
def post_list(request):
    query = request.GET.get('q', '')
    posts = Post.objects.filter(published=True)
    
    if query:
        from django.db.models import Q
        posts = posts.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )
    
    return render(request, 'home.html', {
        'posts': posts,
        'query': query,
    })
\`\`\``,
    codeExample_en: `# Complete blog views
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from .models import Post, Category, Comment
from .forms import PostForm, CommentForm

def post_list(request):
    query = request.GET.get('q', '')
    category_slug = request.GET.get('category', '')
    posts = Post.objects.filter(is_published=True)
    if query:
        posts = posts.filter(Q(title__icontains=query) | Q(content__icontains=query))
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': Category.objects.all(),
        'query': query,
    })

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.views += 1
    post.save()
    comments = post.comments.all()
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            Comment.objects.create(
                post=post,
                author_name=form.cleaned_data['author_name'],
                text=form.cleaned_data['text'],
            )
            return redirect('post_detail', pk=pk)
    else:
        form = CommentForm()
    return render(request, 'posts/detail.html', {
        'post': post, 'comments': comments, 'form': form
    })

def create_post(request):
    form = PostForm(request.POST or None)
    if form.is_valid():
        post = form.save()
        return redirect('post_detail', pk=post.pk)
    return render(request, 'posts/create.html', {'form': form})`,
    task_en: { description: 'Complete blog: post list with search + category filter, post detail with comment form, create post form. Add 5 real posts. Test all features.', hint: 'Q objects: Q(title__icontains=q) | Q(content__icontains=q). Add related_name="comments" to Comment FK.' },
    quiz_en: [
      { q: 'Why is {% csrf_token %} required in forms?', options: ['For styling', 'Protects against Cross-Site Request Forgery attacks', 'For form validation', 'For database connection'], correct: 1, explanation: 'CSRF token prevents malicious sites from making requests on behalf of your users.' },
      { q: 'What does form.is_valid() check?', options: ['If form was submitted', 'If all fields pass validation rules', 'If form has errors', 'If form has data'], correct: 1, explanation: 'is_valid() runs all validators and returns True only if all fields pass. After this, form.cleaned_data is safe to use.' },
      { q: 'What do Q objects allow in Django ORM?', options: ['Only AND queries', 'Complex OR/AND queries with | and & operators', 'Only exact matches', 'Subqueries only'], correct: 1, explanation: 'Q objects enable complex queries: Q(title__icontains=q) | Q(content__icontains=q) = search in title OR content.' },
    ],
  },
  'py-w10-s1': {
    title_en: 'What is ML — Types and Concepts',
    content_en: `## Machine Learning — Teach Computers to Learn!

ML means teaching a computer using examples — without explicit programming!

### 3 Types of ML:
\`\`\`
1. Supervised Learning    → Learn from Data + Labels
   Examples: Spam detection, price prediction

2. Unsupervised Learning  → Data only, find patterns yourself
   Examples: Customer clustering, anomaly detection

3. Reinforcement Learning → Learn by trial and error (reward/punishment)
   Examples: Game-playing AI, robotics
\`\`\`

### The ML Workflow:
\`\`\`
Data → Clean → Features → Split → Train → Evaluate → Deploy
\`\`\`

### scikit-learn — Python's ML Library
\`\`\`bash
pip install scikit-learn
\`\`\`

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# 1. Load data
iris = load_iris()
X, y = iris.data, iris.target

# 2. Split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Train model
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

# 4. Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy*100:.1f}%")
\`\`\`

### Classification vs Regression:
\`\`\`
Classification  → Predict a CATEGORY  (spam/not spam, iris species)
Regression      → Predict a NUMBER    (house price, temperature)
\`\`\``,
    codeExample_en: `from sklearn.datasets import load_iris, load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

def compare_models(dataset_name='iris'):
    # Dataset load karo
    if dataset_name == 'iris':
        data = load_iris()
    else:
        data = load_wine()

    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # Multiple models compare karo
    models = {
        'KNN (k=3)': KNeighborsClassifier(n_neighbors=3),
        'KNN (k=5)': KNeighborsClassifier(n_neighbors=5),
        'KNN (k=7)': KNeighborsClassifier(n_neighbors=7),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
    }

    print(f"\\\\nDataset: {dataset_name} | {len(X)} samples | {X.shape[1]} features")
    print(f"Classes: {data.target_names}")
    print(f"Train: {len(X_train)}, Test: {len(X_test)}")
    print("\\\\n" + "="*45)
    print(f"{'Model':<20} {'Accuracy':>10} {'Result':>10}")
    print("="*45)

    for name, model in models.items():
        model.fit(X_train_s, y_train)
        acc = accuracy_score(y_test, model.predict(X_test_s))
        bar = "█" * int(acc * 20)
        print(f"{name:<20} {acc*100:>9.1f}% {bar}")

compare_models('iris')
compare_models('wine')`,
    task_en: { description: 'Build a survival predictor (200 passengers: age, fare, class, gender → survived). Use RandomForestClassifier. Show accuracy, feature importance, predict 5 new passengers.', hint: 'from sklearn.ensemble import RandomForestClassifier. pd.get_dummies() for gender. model.feature_importances_' },
    quiz_en: [
      { q: 'What is Supervised Learning?', options: ['Learning without labels', 'Learning from labeled data (input-output pairs)', 'Learning by trial and error', 'Unsupervised clustering'], correct: 1, explanation: 'Supervised learning uses labeled data — you provide both features (X) and correct answers (y) for training.' },
      { q: 'What does train_test_split with test_size=0.2 do?', options: ['20% for training, 80% for test', '80% for training, 20% for test', '20 samples for test', 'Random 20 samples'], correct: 1, explanation: 'test_size=0.2 = 20% test data, 80% training data. Standard practice.' },
      { q: 'Why use StandardScaler?', options: ['To sort data', 'To bring all features to same scale, preventing bias', 'To fill missing values', 'To encode labels'], correct: 1, explanation: 'Without scaling, features with large values dominate. StandardScaler normalizes all features equally.' },
    ],
  },
  'py-w10-s2': {
    title_en: 'Regression — Predicting Numbers',
    content_en: `## Regression — Predict Continuous Values!

Classification predicts a category (spam/not spam). Regression predicts a number (price, temperature).

### Linear Regression:
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Simple example: study hours → exam score
np.random.seed(42)
hours = np.random.uniform(1, 10, 100)
scores = 6 * hours + 20 + np.random.normal(0, 5, 100)  # with noise

X = hours.reshape(-1, 1)  # Must be 2D
y = scores

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"R² Score: {r2_score(y_test, y_pred):.3f}")  # 1.0 = perfect
print(f"RMSE:     {mean_squared_error(y_test, y_pred)**0.5:.2f}")

# Predict new value
new_hours = np.array([[7.5]])
print(f"7.5 hours study → predicted score: {model.predict(new_hours)[0]:.1f}")
\`\`\`

### Multiple Features:
\`\`\`python
# Predict house price from multiple features
data = {
    'size_sqft': [800, 1200, 1500, 2000, 2500],
    'bedrooms':  [2,   3,    3,    4,    5   ],
    'location':  [1,   2,    1,    3,    2   ],  # 1=suburb, 2=city, 3=prime
    'price_lakh':[45,  75,   80,   120,  150 ],
}
df = pd.DataFrame(data)

X = df[['size_sqft', 'bedrooms', 'location']]
y = df['price_lakh']

model = LinearRegression()
model.fit(X, y)

# Predict
new_house = [[1800, 3, 2]]
print(f"Predicted price: ₹{model.predict(new_house)[0]:.1f} lakhs")
\`\`\``,
    codeExample_en: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler

# Student score predictor
np.random.seed(42)
n = 300

df = pd.DataFrame({
    'study_hours': np.random.uniform(1, 10, n),
    'sleep_hours': np.random.uniform(4, 10, n),
    'prev_score': np.random.uniform(40, 100, n),
    'attendance_pct': np.random.uniform(50, 100, n),
    'tuition': np.random.choice([0, 1], n),
})

df['final_score'] = (
    df['study_hours'] * 5 +
    df['sleep_hours'] * 2 +
    df['prev_score'] * 0.4 +
    df['attendance_pct'] * 0.2 +
    df['tuition'] * 8 +
    np.random.normal(0, 3, n)
).clip(0, 100).round(1)

X = df.drop('final_score', axis=1)
y = df['final_score']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_tr = scaler.fit_transform(X_train)
X_te = scaler.transform(X_test)

models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=1.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
}

print("Student Score Prediction Models\\\\n" + "="*50)
for name, model in models.items():
    model.fit(X_tr, y_train)
    preds = model.predict(X_te)
    print(f"{name:<22} R²={r2_score(y_test, preds):.3f}  MAE={mean_absolute_error(y_test, preds):.2f}")

# Predict new student
new_student = scaler.transform([[7, 8, 75, 90, 1]])
rf = models['Random Forest']
pred = rf.predict(new_student)[0]
print(f"\\\\nNew student prediction: {pred:.1f}/100")`,
    task_en: { description: 'Build a house price predictor with: area, bedrooms, bathrooms, age, floors, distance, amenities. Use RandomForestRegressor. Show R², top 3 features, actual vs predicted.', hint: 'rf.feature_importances_ for importance. pd.DataFrame({"Actual": y_test[:10].values, "Predicted": preds[:10].round(1)})' },
    quiz_en: [
      { q: 'What does an R² score of 0.85 mean?', options: ['85% errors', '85% data points correct', 'Model explains 85% of variance', '85% accuracy'], correct: 2, explanation: 'R² = variance explained. 0.85 = model explains 85% of the variation in the target. 1.0 = perfect.' },
      { q: 'What is the difference between MAE and RMSE?', options: ['No difference', 'RMSE penalizes large errors more severely due to squaring', 'MAE is more accurate', 'RMSE is always smaller'], correct: 1, explanation: 'MAE = average absolute error. RMSE squares errors first, so big errors have more weight.' },
      { q: 'When should you use regression vs classification?', options: ['Always use classification', 'Regression for continuous numbers; classification for categories', 'Always use regression', 'Depends on data size'], correct: 1, explanation: 'Regression predicts continuous values (price, temperature). Classification predicts categories (spam/not spam).' },
    ],
  },
  'py-w10-s3': {
    title_en: 'Clustering and Model Saving',
    content_en: `## Clustering and Model Saving!

Labels are not available — the model finds groups on its own.

### K-Means Clustering:
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Customer segmentation
data = {
    'age':            [25, 35, 45, 22, 50, 28, 38, 52, 23, 42],
    'annual_income':  [40, 80, 120, 30, 90, 55, 95, 110, 35, 85],
    'spending_score': [70, 60, 30, 80, 40, 65, 50, 20, 85, 55],
}
df = pd.DataFrame(data)

# Standardise features
scaler = StandardScaler()
X      = scaler.fit_transform(df)

# Find optimal K using the Elbow method
inertias = []
for k in range(1, 8):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)
# Plot inertias to find the "elbow"

# Train with optimal K
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(X)

print(df.groupby('cluster').mean().round(1))
\`\`\`

### Saving and Loading Models:
\`\`\`python
import joblib
from sklearn.ensemble import RandomForestClassifier

# Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model to file
joblib.dump(model, 'my_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("✅ Model saved!")

# Load and use later — no retraining needed
loaded_model  = joblib.load('my_model.pkl')
loaded_scaler = joblib.load('scaler.pkl')

new_data    = [[25, 5, 3, 2]]
scaled_data = loaded_scaler.transform(new_data)
prediction  = loaded_model.predict(scaled_data)
print(f"Prediction: {prediction[0]}")
\`\`\``,
    codeExample_en: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

# Mall customer segmentation
np.random.seed(42)
n = 300

df = pd.DataFrame({
    'age': np.random.randint(18, 70, n),
    'income_k': np.random.randint(15, 150, n),
    'spending_score': np.random.randint(1, 100, n),
    'visits_per_month': np.random.randint(1, 20, n),
})

scaler = StandardScaler()
X = scaler.fit_transform(df)

# Optimal clusters
print("Finding optimal clusters...")
inertias = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append((k, km.inertia_))
    print(f"  k={k}: inertia={km.inertia_:.0f}")

# Use k=4
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['segment'] = kmeans.fit_predict(X)

# Segment names assign karo based on profile
segment_profiles = df.groupby('segment').mean().round(1)
print("\\\\nCluster Profiles:")
print(segment_profiles)

# Name them
names = {0: "Young Budget", 1: "High Earner VIP", 2: "Senior Casual", 3: "Young Spender"}
df['segment_name'] = df['segment'].map(names)
print("\\\\nSegment Distribution:")
print(df['segment_name'].value_counts())

# Save model
joblib.dump(kmeans, 'customer_segmentation.pkl')
joblib.dump(scaler, 'customer_scaler.pkl')
print("\\\\nModel saved!")

# Predict new customer
new_customer = scaler.transform([[25, 80, 75, 15]])
segment = kmeans.predict(new_customer)[0]
print(f"New customer segment: {names[segment]}")`,
    task_en: { description: 'Cluster students by performance. Use K=3. Name each cluster meaningfully (e.g., "Achiever", "Average", "At Risk"). Save the model. Predict 3 new students.', hint: 'Name clusters based on groupby mean profiles. joblib.dump(model, "cluster.pkl"). scaler.transform() before predict.' },
    quiz_en: [
      { q: 'What type of learning is K-Means?', options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Semi-supervised'], correct: 1, explanation: 'K-Means is unsupervised — no labels needed. It finds patterns and groups in data on its own.' },
      { q: 'What does joblib.dump() do?', options: ['Dumps data to database', 'Saves trained model to a file for later use', 'Deletes the model', 'Evaluates the model'], correct: 1, explanation: 'joblib.dump(model, "file.pkl") serializes the trained model to disk so you can load and use it later.' },
      { q: 'Why must you transform new data with the same scaler used in training?', options: ['No reason', 'To prevent data leakage and ensure consistent scaling', 'To make it faster', 'To add more features'], correct: 1, explanation: 'The model learned with specific scale. Using a different scaler on new data = wrong scale = wrong predictions.' },
    ],
  },
  'py-w10-s4': {
    title_en: 'Week 10 Project — Complete ML Pipeline',
    content_en: `## Week 10 Project — End-to-End ML Pipeline!

In the real world, ML is not just training a model — you build an entire pipeline!

### Complete Pipeline Steps:
\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# 1. Column-specific preprocessing
numeric_features     = ['age', 'income', 'score']
categorical_features = ['city', 'education']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(),    numeric_features),
    ('cat', OneHotEncoder(), categorical_features),
])

# 2. Build pipeline (preprocessing + model)
pipeline = Pipeline([
    ('prep',  preprocessor),
    ('model', RandomForestClassifier(n_estimators=100)),
])

# 3. Cross-validate (5-fold)
scores = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {scores.mean()*100:.1f}% ± {scores.std()*100:.1f}%")

# 4. Train final model
pipeline.fit(X_train, y_train)

# 5. Save complete pipeline
import joblib
joblib.dump(pipeline, 'full_pipeline.pkl')
\`\`\`

### Project: Student Performance Predictor
Build a model that predicts whether a student will pass or fail based on:
- Attendance percentage
- Assignment scores
- Previous exam scores
- Study hours per week
- Extracurricular activities`,
    codeExample_en: `import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import joblib

np.random.seed(42)
n = 500

# Loan dataset
df = pd.DataFrame({
    'age': np.random.randint(21, 65, n),
    'income': np.random.randint(200000, 2000000, n),
    'loan_amount': np.random.randint(100000, 5000000, n),
    'credit_score': np.random.randint(300, 900, n),
    'employment_years': np.random.randint(0, 30, n),
    'existing_loans': np.random.randint(0, 5, n),
    'assets': np.random.randint(0, 10000000, n),
})

# Approval logic (business rules)
df['approved'] = (
    (df['credit_score'] >= 650) &
    (df['income'] >= df['loan_amount'] * 0.4) &
    (df['existing_loans'] <= 2) &
    (df['employment_years'] >= 1)
).astype(int)

# Add noise (real world mein sab rules nahi hote)
noise_idx = np.random.choice(n, int(n*0.1), replace=False)
df.loc[noise_idx, 'approved'] = 1 - df.loc[noise_idx, 'approved']

X = df.drop('approved', axis=1)
y = df['approved']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline with preprocessing
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)
preds = pipeline.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, preds, target_names=['Rejected', 'Approved']))

# Save
joblib.dump(pipeline, 'loan_predictor.pkl')

# Predict new applicant
def predict_loan(age, income, loan, credit, emp_years, loans, assets):
    pipeline = joblib.load('loan_predictor.pkl')
    data = pd.DataFrame([[age, income, loan, credit, emp_years, loans, assets]],
                         columns=X.columns)
    result = pipeline.predict(data)[0]
    prob = pipeline.predict_proba(data)[0][1]
    print(f"Decision: {'APPROVED ✅' if result else 'REJECTED ❌'}")
    print(f"Approval probability: {prob*100:.1f}%")

predict_loan(35, 800000, 1500000, 720, 8, 1, 2000000)`,
    task_en: { description: 'Loan predictor CLI: accept inputs (age, income, loan, credit score, employment, loans, assets), predict Approved/Rejected, show probability %, explain rejection reason.', hint: 'predict_proba() for probability. Check individual thresholds manually and collect reasons list.' },
    quiz_en: [
      { q: 'What is the main benefit of sklearn Pipeline?', options: ['Faster training', 'Chains preprocessing + model, prevents data leakage', 'Better accuracy', 'Handles missing values'], correct: 1, explanation: 'Pipeline ensures preprocessing is applied consistently in training and prediction, preventing leakage.' },
      { q: 'What does predict_proba() return for binary classification?', options: ['Single prediction', '[P(class_0), P(class_1)] for each sample', 'Confidence 0-100', 'Boolean array'], correct: 1, explanation: 'predict_proba() returns probability for each class. For binary: [P(reject), P(approve)] — sums to 1.0.' },
      { q: 'What is overfitting?', options: ['Model is too simple', 'Model performs well on training data but poorly on new data', 'Model trains too slowly', 'Model uses too many features'], correct: 1, explanation: 'Overfitting = model memorizes training data instead of learning patterns. Use cross-validation to detect it.' },
    ],
  },
  'py-w11-s1': {
    title_en: 'File System Automation',
    content_en: `## os and shutil — Full Control of the File System!

### os module — File System Operations:
\`\`\`python
import os
import shutil
from pathlib import Path

# Current directory
print(os.getcwd())

# List files
files = os.listdir('.')
print(files)

# Path operations
print(os.path.exists('myfile.txt'))
print(os.path.isfile('myfile.txt'))
print(os.path.isdir('myfolder'))
print(os.path.getsize('myfile.txt'))   # bytes
print(os.path.splitext('photo.jpg'))   # ('photo', '.jpg')
\`\`\`

### Creating and Deleting:
\`\`\`python
os.makedirs('parent/child/grandchild', exist_ok=True)  # Create nested dirs
os.remove('file.txt')           # Delete file
os.rmdir('empty_folder')        # Delete empty folder
shutil.rmtree('full_folder')    # Delete folder with contents!
\`\`\`

### Copying and Moving:
\`\`\`python
shutil.copy('source.txt', 'dest.txt')       # Copy file
shutil.copy2('source.txt', 'dest.txt')      # Copy with metadata
shutil.copytree('src_folder', 'dst_folder') # Copy entire folder
shutil.move('old_path', 'new_path')         # Move or rename
\`\`\`

### pathlib — Modern File Paths:
\`\`\`python
from pathlib import Path

p = Path('.')
print(list(p.glob('*.py')))         # All Python files
print(list(p.rglob('*.txt')))       # All .txt files recursively

file = Path('data/report.csv')
print(file.parent)    # data
print(file.stem)      # report
print(file.suffix)    # .csv
print(file.exists())  # True/False
\`\`\`

### Walking a Directory Tree:
\`\`\`python
import os

for root, dirs, files in os.walk('.'):
    level = root.replace('.', '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    for file in files:
        print(f'{indent}  {file}')
\`\`\``,
    codeExample_en: `import os
import shutil
from pathlib import Path
from datetime import datetime

def smart_file_organizer(source_dir='.', dest_dir='organized'):
    """Organise files by type and date"""
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
    
    print("\\\\n=== Organization Complete ===")
    for cat, count in stats.items():
        if count > 0:
            print(f"  {cat}: {count} files")

# Demo run
print("File Organizer Demo")
print("(Real use mein apna downloads folder path dena)")
smart_file_organizer('.', 'demo_organized')`,
    task_en: { description: 'Build a duplicate file finder using MD5 hashing. Show: duplicates found, space wasted, offer to delete or move to "duplicates" folder.', hint: 'hashlib.md5(f.read()).hexdigest(). Store as {hash: [file_paths]}. More than 1 path = duplicate.' },
    quiz_en: [
      { q: 'What does Path.rglob("*.pdf") do?', options: ['Finds PDFs in current folder only', 'Finds PDFs recursively in all subfolders', 'Deletes PDF files', 'Counts PDF files'], correct: 1, explanation: 'rglob = recursive glob. Searches current directory AND all nested subdirectories.' },
      { q: 'What is the purpose of file hashing for duplicate detection?', options: ['Makes files smaller', 'Creates a unique fingerprint of file contents for comparison', 'Encrypts files', 'Speeds up file reading'], correct: 1, explanation: 'MD5 hash produces a unique fingerprint. Same hash = identical content, regardless of filename.' },
      { q: 'Difference between shutil.copy() and shutil.copy2()?', options: ['No difference', 'copy2() preserves metadata (timestamps) while copy() does not', 'copy2() is faster', 'copy() copies folders'], correct: 1, explanation: 'copy2() copies file content AND metadata (creation/modification timestamps). copy() copies content only.' },
    ],
  },
  'py-w11-s2': {
    title_en: 'Excel Automation — Reports with openpyxl',
    content_en: `## Excel Automation — Create and Edit Excel Files with Python!

### Install:
\`\`\`bash
pip install openpyxl pandas xlsxwriter
\`\`\`

### Create an Excel File:
\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Student Report"

# Write data
ws['A1'] = "Student Report"
ws['A2'] = "Name"
ws['B2'] = "Score"
ws['C2'] = "Grade"

data = [
    ("Rahul Kumar", 87, "A"),
    ("Priya Patel", 95, "A+"),
    ("Arjun Singh", 72, "B"),
]

for row, (name, score, grade) in enumerate(data, start=3):
    ws[f'A{row}'] = name
    ws[f'B{row}'] = score
    ws[f'C{row}'] = grade

# Style the header
header_font = Font(bold=True, size=12, color="FFFFFF")
header_fill = PatternFill("solid", fgColor="4472C4")

for cell in ws['2:2']:
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = Alignment(horizontal='center')

# Column width
ws.column_dimensions['A'].width = 20
ws.column_dimensions['B'].width = 10

wb.save("student_report.xlsx")
print("✅ Excel file created!")
\`\`\`

### Read Excel with pandas:
\`\`\`python
import pandas as pd

df = pd.read_excel('report.xlsx', sheet_name='Student Report')
print(df.head())
print(df.describe())
df.to_excel('cleaned_report.xlsx', index=False)
\`\`\``,
    codeExample_en: `import openpyxl
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
    task_en: { description: 'Build an attendance register: 30 students, 20 days. Calculate percentage per student, highlight <75% in red, add daily summary sheet, include a chart.', hint: 'cell.fill = PatternFill(fgColor="FF0000"). ws2 = wb.create_sheet("Summary"). percentage = present_count/20*100' },
    quiz_en: [
      { q: 'When should you use openpyxl vs pandas for Excel?', options: ['Always pandas', 'openpyxl for formatting/charts; pandas for data analysis', 'Always openpyxl', 'No difference'], correct: 1, explanation: 'Use openpyxl for rich formatting, charts, cell styles. Use pandas for analysis, then openpyxl for final formatting.' },
      { q: 'What does wb.create_sheet("Summary") do?', options: ['Creates a new workbook', 'Creates a new sheet tab in the workbook', 'Opens Summary.xlsx', 'Deletes existing sheet'], correct: 1, explanation: 'create_sheet() adds a new worksheet tab to the existing workbook.' },
      { q: 'What does PatternFill(fgColor="FF0000") do?', options: ['Changes font color to red', 'Fills cell background with red color', 'Adds red border', 'Makes text bold and red'], correct: 1, explanation: 'PatternFill sets the cell background (fill) color. FF0000 is the hex code for red.' },
    ],
  },
  'py-w11-s3': {
    title_en: 'Email Automation — Sending Emails with Python',
    content_en: `## Email Automation — Send Emails with Python!

### smtplib — Built-in Email Library:
\`\`\`python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, body, from_email, password):
    msg = MIMEMultipart()
    msg['From']    = from_email
    msg['To']      = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))
    
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.starttls()
        smtp.login(from_email, password)
        smtp.send_message(msg)
    
    print(f"✅ Email sent to {to_email}")
\`\`\`

### Gmail Setup:
1. Enable 2-factor authentication on Gmail
2. Generate an App Password (Google Account → Security → App Passwords)
3. Use App Password instead of your actual password

### HTML Email:
\`\`\`python
html_body = """
<html>
<body>
  <h2 style="color: #4472C4;">Monthly Report</h2>
  <p>Dear <strong>{name}</strong>,</p>
  <p>Your score this month: <strong style="color: green;">{score}%</strong></p>
  <table border="1" style="border-collapse: collapse;">
    <tr><th>Subject</th><th>Score</th></tr>
    {rows}
  </table>
</body>
</html>
"""
\`\`\`

### Bulk Email with Personalisation:
\`\`\`python
students = [
    {"name": "Rahul", "email": "rahul@gmail.com", "score": 87},
    {"name": "Priya", "email": "priya@gmail.com", "score": 95},
]

for student in students:
    body = f"""
    <h3>Hello {student['name']}!</h3>
    <p>Your score: {student['score']}%</p>
    """
    send_email(
        to_email=student['email'],
        subject=f"Report — {student['name']}",
        body=body,
        from_email=YOUR_EMAIL,
        password=APP_PASSWORD,
    )
    time.sleep(1)  # Avoid spam detection
\`\`\``,
    codeExample_en: `import smtplib
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
        
        print(f"\\\\n📧 Email for: {student['email']}")
        print(f"   Subject: Exam Results — {grade} Grade")
        print(f"   {pct}% | {'PASS ✅' if pct >= 40 else 'FAIL ❌'}")
    
    print("\\\\n(Real use ke liye smtplib se Gmail App Password se send karo)")

demo_email_automation()`,
    task_en: { description: 'Build a birthday reminder: read CSV (name, email, birthday). Check today\'s birthdays and print personalized HTML emails with name, age, and a fun message.', hint: 'datetime.now().strftime("%m-%d") for today. age = current_year - birth_year. HTML template with f-strings.' },
    quiz_en: [
      { q: 'Why use an App Password for Gmail instead of your regular password?', options: ['App Password is more secure', 'Google blocks regular password for 2FA-enabled accounts in scripts', 'Faster authentication', 'Required for all emails'], correct: 1, explanation: 'With 2FA enabled, regular password does not work for third-party apps. App Password is a special 16-char password for one app.' },
      { q: 'What is MIMEMultipart used for?', options: ['Multiple recipients', 'Creating emails with multiple parts: text + HTML + attachments', 'Faster delivery', 'Large attachments'], correct: 1, explanation: 'MIME = email format standard. MIMEMultipart allows combining text, HTML, and file attachments in one email.' },
      { q: 'Why add time.sleep() when sending bulk emails?', options: ['Email format requirement', 'Avoids spam filters and respects server rate limits', 'Required by Python', 'Prevents memory issues'], correct: 1, explanation: 'Rapid sending triggers spam filters. A 1-second delay is polite and helps stay within Gmail\'s daily limits.' },
    ],
  },
  'py-w11-s4': {
    title_en: 'Week 11 Project — Complete Automation Suite',
    content_en: `## Week 11 Project — Office Automation Suite!

Build a complete automation tool that handles real company/school tasks!

### Project Features:
\`\`\`
Automation Suite
├── 1. File Organiser
│   ├── Organise Downloads folder by type + date
│   └── Find and report duplicate files
│
├── 2. Report Generator
│   ├── Read student data from CSV
│   ├── Create Excel report with charts
│   └── Send individual emails with grades
│
├── 3. Backup System
│   ├── Compress folders into zip archives
│   ├── Timestamp-based backup naming
│   └── Keep only last N backups (auto-clean)
│
└── 4. File Monitor
    ├── Watch a folder for new files
    └── Auto-process on arrival
\`\`\`

### ZIP Backup System:
\`\`\`python
import shutil
from datetime import datetime
from pathlib import Path

def create_backup(source_dir, backup_dir, keep_last=5):
    source    = Path(source_dir)
    backup    = Path(backup_dir)
    backup.mkdir(exist_ok=True)
    
    timestamp   = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f"backup_{source.name}_{timestamp}"
    
    # Create zip
    archive = shutil.make_archive(
        backup / backup_name, 'zip', source
    )
    print(f"✅ Backup created: {archive}")
    
    # Keep only last N backups
    backups = sorted(backup.glob('*.zip'))
    for old in backups[:-keep_last]:
        old.unlink()
        print(f"🗑️  Removed old backup: {old.name}")
\`\`\``,
    codeExample_en: `import os, shutil, csv
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
        print("\\\\n=== Automation Log ===")
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
    task_en: { description: 'Build AutomationSuite class: organize_files(), generate_excel_report(), email_notifier(). Create main() that runs all three in sequence.', hint: 'CSV with csv.DictReader. HTML with f-strings. main() calls all three methods in order.' },
    quiz_en: [
      { q: 'What is the advantage of using a class for an automation suite?', options: ['Runs faster', 'Groups related methods and shared state, easy to extend', 'Uses less memory', 'No advantage'], correct: 1, explanation: 'A class bundles related automation methods with shared state (log, config). Easy to add new methods.' },
      { q: 'What does the schedule library allow?', options: ['Scheduling job interviews', 'Running Python functions automatically at specified times', 'Managing file schedules', 'Calendar integration'], correct: 1, explanation: 'schedule.every().day.at("09:00").do(func) runs func every day at 9am — like cron jobs in pure Python.' },
      { q: 'Why use logging instead of print() in automation scripts?', options: ['logging is faster', 'Logs persist to file with timestamps and severity levels', 'print() does not work in scripts', 'logging is standard'], correct: 1, explanation: 'Logging saves to file, includes timestamps, and supports levels (INFO/WARNING/ERROR) for filtering.' },
    ],
  },
  'py-w12-s1': {
    title_en: 'Course Recap — A Three-Month Journey',
    content_en: `## Three Months of Learning — What You Achieved!

Seriously — you learned all of this in 3 months. Be proud of yourself!

### Month 1 — Foundation ✅
\`\`\`
Week 1: Variables, Input/Output, Basic Math
Week 2: Conditions (if/elif), Loops (for/while), Lists
Week 3: Strings, Dictionaries, File Handling
Week 4: OOP, Classes, Modules, Error Handling
\`\`\`

### Month 2 — Intermediate ✅
\`\`\`
Week 5:  Regular Expressions
Week 6:  Web Scraping (requests + BeautifulSoup)
Week 7:  APIs (REST, JSON, GET/POST)
Week 8:  Data Analysis (Pandas, Matplotlib)
\`\`\`

### Month 3 — Advanced ✅
\`\`\`
Week 9:  Django Web Framework
Week 10: Machine Learning (scikit-learn)
Week 11: Automation (os, shutil, Excel, Email)
Week 12: Final Capstone Project
\`\`\`

### Skills You Have Now:
\`\`\`python
skills = {
    "Languages":     ["Python 3.10+"],
    "Web":           ["Django", "requests", "BeautifulSoup"],
    "Data":          ["Pandas", "NumPy", "Matplotlib"],
    "ML":            ["scikit-learn", "joblib"],
    "Automation":    ["os", "shutil", "openpyxl", "smtplib"],
    "Concepts":      ["OOP", "APIs", "Regex", "SQL (Django ORM)"],
    "Tools":         ["pip", "venv", "Git basics"],
}
\`\`\`

### What You Can Build Now:
1. ✅ Web scraper for any website
2. ✅ REST API client (connect to any service)
3. ✅ Data analysis dashboard
4. ✅ Django website with database
5. ✅ ML model that makes predictions
6. ✅ Office automation tools
7. ✅ Bulk email sender`,
    codeExample_en: `# A quick review — all the most important concepts in one place

# ─ OOP ─
class PythonStudent:
    def __init__(self, naam, months_studied):
        self.name = naam
        self.months = months_studied
        self.skills = []
    
    def add_skill(self, skill):
        self.skills.append(skill)
        return self
    
    def show_profile(self):
        print(f"\\\\n{'='*40}")
        print(f"  👤 {self.name}")
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
print("\\\\nSkills by name length:", skills_by_length)

# ─ List comprehension ─
advanced_skills = [s for s in student.skills if len(s) > 4]
print("Advanced skills:", advanced_skills)

# ─ Dictionary comprehension ─
skill_levels = {skill: "Intermediate" for skill in student.skills}
skill_levels["OOP"] = "Advanced"
print("\\\\nSkill Levels:", skill_levels)`,
    task_en: { description: 'Create a Python recap script: dictionary of all concepts by week, count per month, generate a "Python Journey Report" as a text file.', hint: 'concepts = {"Week 1": ["variables", "loops"], ...}. Count with len(). Write to "report.txt".' },
    quiz_en: [
      { q: 'Which was NOT covered in Month 2?', options: ['Regular Expressions', 'Web Scraping', 'Django Web Framework', 'Pandas & Matplotlib'], correct: 2, explanation: 'Django is Month 3 (Week 9). Month 2: Regex, Web Scraping, APIs, Pandas.' },
      { q: 'What is list comprehension?', options: ['[for x in list]', '[x*2 for x in numbers if x > 0]', 'list(comprehension)', 'for x: append(list)'], correct: 1, explanation: '[expression for item in iterable if condition] — creates a filtered/transformed list in one line.' },
      { q: 'What should you learn next for Data Science?', options: ['PHP', 'TensorFlow + Deep Learning + Kaggle competitions', 'WordPress', 'Java'], correct: 1, explanation: 'After scikit-learn: TensorFlow/PyTorch for deep learning. Kaggle for real datasets and competitions.' },
    ],
  },
  'py-w12-s2': {
    title_en: 'Capstone Project — Student Management System 2.0',
    content_en: `## Capstone Project — Put It All Together!

In Month 1 you built a simple Student Management System. Now make it 10× more powerful using all the skills!

### Project: EduTrack Pro

**Features (each feature uses one month's skills):**

\`\`\`
EduTrack Pro
├── 🗄️  Database (Month 1 — File Handling)
│   ├── JSON-based persistent storage
│   └── CRUD operations for students
│
├── 📊 Analytics (Month 2 — Pandas + Matplotlib)
│   ├── Grade distribution chart
│   ├── Subject-wise performance
│   └── Monthly progress tracking
│
├── 🌐 Web API (Month 3 — Django)
│   ├── REST API: GET /students, POST /add, etc.
│   └── Web dashboard
│
├── 🤖 ML Predictor (Month 3 — scikit-learn)
│   ├── Predict final grade from current performance
│   └── At-risk student alert system
│
└── 📧 Reports (Month 3 — Automation)
    ├── Auto-generate Excel report
    └── Email progress reports to parents
\`\`\`

### Week 12 Goal:
Build this complete system in stages:
1. Core CRUD operations (Day 1-2)
2. Analytics dashboard (Day 3-4)
3. Django web interface (Day 5-6)
4. ML grade predictor (Day 7-8)
5. Auto-report generation (Day 9-10)`,
    codeExample_en: `import json
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
            'name': naam, 'class': class_name,
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
        print(f"\\\\n{'='*50}")
        print(f"  REPORT CARD — {s['naam']} ({s['class']})")
        print(f"{'='*50}")
        for exam, subjects in s['marks'].items():
            print(f"\\\\n{exam}:")
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
    task_en: { description: 'Build EduTrack Pro: JSON database, pandas analytics (3 charts), ML grade predictor, Excel report. Test end-to-end with 5 students.', hint: 'pandas DataFrame from students. plt.subplots(1,3). at_risk = [s for s in students if avg < 60].' },
    quiz_en: [
      { q: 'For a small project, what is the advantage of JSON over a full database?', options: ['JSON is faster', 'No setup needed — works directly with files', 'More secure', 'Handles more data'], correct: 1, explanation: 'JSON file requires no installation, no server, no schema. Perfect for small projects and learning.' },
      { q: 'What does plt.subplots(1, 3) create?', options: ['1 chart', '3 charts stacked vertically', '3 charts side by side in a row', '3 separate windows'], correct: 2, explanation: 'subplots(rows, cols) = (1, 3) creates 1 row, 3 columns = 3 charts side by side.' },
      { q: 'What is the benefit of ML for a student management system?', options: ['Faster data entry', 'Predict at-risk students before final exams based on patterns', 'Auto-generate reports', 'Prettier charts'], correct: 1, explanation: 'ML can identify students likely to fail based on attendance + mid-term scores — enabling early intervention.' },
    ],
  },
  'py-w12-s3': {
    title_en: 'Capstone Part 2 — Adding ML + Automation',
    content_en: `## Capstone Part 2 — Adding ML + Automation!

### Add an ML Grade Predictor to EduTrack:

\`\`\`python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

class GradePredictor:
    def __init__(self):
        self.model   = None
        self.classes = ['F', 'C', 'B', 'A', 'A+']
    
    def train(self, student_data):
        """Train on historical data"""
        # Features: attendance, assignment_avg, midterm
        X = [[s['attendance'], s['assignments'], s['midterm']]
             for s in student_data]
        y = [s['final_grade'] for s in student_data]
        
        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X, y)
        joblib.dump(self.model, 'grade_model.pkl')
        print("✅ Model trained and saved!")
    
    def predict(self, attendance, assignments, midterm):
        """Predict final grade for a student"""
        if not self.model:
            self.model = joblib.load('grade_model.pkl')
        
        features   = [[attendance, assignments, midterm]]
        prediction = self.model.predict(features)[0]
        proba      = self.model.predict_proba(features)[0]
        confidence = max(proba) * 100
        
        return prediction, confidence
\`\`\`

### Auto-Report Generation:
\`\`\`python
import openpyxl
import smtplib
from datetime import datetime

def generate_and_email_report(student, email_config):
    """Create Excel report and email it"""
    
    # 1. Generate Excel
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = f"Report — {student['name']}"
    
    ws['A1'] = f"Progress Report: {student['name']}"
    ws['A2'] = f"Generated: {datetime.now().strftime('%d %b %Y')}"
    # ... add data, charts, formatting
    
    filename = f"report_{student['name'].replace(' ', '_')}.xlsx"
    wb.save(filename)
    
    # 2. Email it
    # ... attach and send
    print(f"📧 Report emailed to {student['email']}")
\`\`\``,
    codeExample_en: `import numpy as np
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
        
        print(f"\\\\nGrade Prediction:")
        print(f"  Predicted Grade: {grade}")
        for cls, prob in sorted(zip(classes, probs), key=lambda x: -x[1])[:3]:
            print(f"  {cls}: {prob*100:.1f}%")
        
        return grade

predictor = SmartGradePredictor()
predictor.train()
print("\\\\nStudent 1 (High performer):")
predictor.predict_student(avg=88, attendance=95, study_hours=6)
print("\\\\nStudent 2 (Struggling):")
predictor.predict_student(avg=45, attendance=60, study_hours=2)`,
    task_en: { description: 'Complete EduTrack Pro: SmartGradePredictor class, generate_excel_report(), send_alert_email() for at-risk students. Test the full pipeline.', hint: 'Save model with joblib. Keep features consistent between training and prediction. Same scaler for transform.' },
    quiz_en: [
      { q: 'What does joblib.load() allow you to do?', options: ['Load a Python module', 'Use a previously trained model without retraining', 'Load a database', 'Import a CSV file'], correct: 1, explanation: 'joblib.load() deserializes a saved model — you get the exact trained model back without any retraining.' },
      { q: 'In a complete ML pipeline, what is the correct order?', options: ['Predict → Train → Clean', 'Load → Clean → Split → Train → Evaluate → Save', 'Train → Split → Clean', 'Save → Train → Load'], correct: 1, explanation: 'Correct ML workflow: Load data → Clean → Split train/test → Train → Evaluate → Save model → Deploy.' },
      { q: 'What makes a "production-ready" ML model different from a notebook experiment?', options: ['More accuracy', 'Error handling, input validation, logging, saved model file', 'More data', 'Faster code'], correct: 1, explanation: 'Production ML needs: try-except, input validation, a saved model file, logging, and consistent preprocessing.' },
    ],
  },
  'py-w12-s4': {
    title_en: 'Course Complete! Certificate and Next Steps',
    content_en: `## 🎉 CONGRATULATIONS! Python Course Complete!

You did it! 3 months, 12 weeks, 48 sections — from Python NOOB to PRO!

### Final Checklist — Make Sure All Projects Are Complete:
\`\`\`
Month 1 Projects:
  ✅ Student Management System (Week 4)

Month 2 Projects:
  ✅ Form Validator (Regex) (Week 5)
  ✅ Price Tracker (Web Scraping) (Week 6)
  ✅ News Aggregator (APIs) (Week 7)
  ✅ Sales Analytics Dashboard (Week 8)

Month 3 Projects:
  ✅ Django Blog (Week 9)
  ✅ ML Pipeline (Week 10)
  ✅ Automation Suite (Week 11)
  ✅ EduTrack Pro — Capstone (Week 12)
\`\`\`

### What is Next? Your Roadmap:

**Path 1 — Web Development:**
\`\`\`
Django REST Framework → React Frontend → Docker → AWS/GCP
\`\`\`

**Path 2 — Data Science / AI:**
\`\`\`
NumPy advanced → TensorFlow/PyTorch → Deep Learning → LLMs
\`\`\`

**Path 3 — Automation / DevOps:**
\`\`\`
Advanced scripting → Ansible/Terraform → CI/CD → Cloud automation
\`\`\`

### Keep Practising:
- **LeetCode** — Python algorithm challenges (start Easy)
- **Kaggle** — Real datasets for ML practice
- **GitHub** — Upload all your projects
- **FastAPI** — Modern Python web API framework
- **Discord/Communities** — Python India, r/learnpython

### You are now a Python Developer! 🐍🚀
Keep building. Keep learning. The journey has just begun!`,
    codeExample_en: `# Final Python celebration script!

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

    print("\\\\n" + "🎉 " * 20)
    print("\\\\n  ██████╗  ██████╗ ███╗  ██╗███████╗ ██╗")
    print("  ██╔══██╗██╔═══██╗████╗ ██║██╔════╝ ██║")
    print("  ██║  ██║██║   ██║██╔██╗██║█████╗   ██║")
    print("  ██║  ██║██║   ██║██║╚████║██╔══╝   ╚═╝")
    print("  ██████╔╝╚██████╔╝██║ ╚███║███████╗ ██╗")
    print("  ╚═════╝  ╚═════╝ ╚═╝  ╚══╝╚══════╝ ╚═╝")
    print()
    print(f"  Python Programming — COURSE COMPLETE!")
    print(f"  {datetime.now().strftime('%d %B %Y')}")
    print("\\\\n" + "🏆 " * 20)
    
    print("\\\\n📋 Your Achievements:")
    for i, achievement in enumerate(achievements, 1):
        print(f"  {i}. ✅ {achievement}")
    
    print("\\\\n💡 Inspiration:")
    print(f'  "{random.choice(quotes)}"')
    
    print("\\\\n🚀 Next Steps:")
    next_steps = [
        "GitHub pe ek project upload karo aaj",
        "LinkedIn pe Python certificate add karo",
        "Ek real problem solve karo Python se",
        "Kaggle pe pehla competition join karo",
        "Django REST API banao portfolio ke liye",
    ]
    for step in next_steps:
        print(f"  → {step}")
    
    print("\\\\n" + "⭐ " * 20)
    print("\\\\n  You did it! Ab duniya dekhegi! 💪")
    print("\\\\n" + "⭐ " * 20)

celebrate_completion()`,
    task_en: { description: 'FINAL TASK: Complete EduTrack Pro with all features. Create requirements.txt and README.md. Run the celebration script. YOU DID IT!', hint: 'pip freeze > requirements.txt in terminal. README: Project name, Features, Install instructions, How to run.' },
    quiz_en: [
      { q: 'What is requirements.txt used for?', options: ['Project description', 'List of all dependencies so others can recreate the environment', 'License file', 'Installation guide'], correct: 1, explanation: '"pip install -r requirements.txt" installs all listed packages — anyone can recreate your exact environment.' },
      { q: 'First step to upload a project to GitHub?', options: ['pip install github', 'git init → git add . → git commit → git push', 'Upload directly', 'Email the files'], correct: 1, explanation: 'git init → git add . → git commit -m "message" → git remote add origin URL → git push origin main.' },
      { q: 'What matters most for getting a Python developer job?', options: ['Certificates only', 'GitHub portfolio with real working projects + problem solving skills', 'Degree only', 'Social media followers'], correct: 1, explanation: 'Recruiters check GitHub. Working projects with clean code and a README matter more than certificates alone.' },
    ],
  },
};

// ─── Merge all sections ────────────────────────────────────────
export const PYTHON_ALL_EN = { ...W1, ...W2_4, ...W5_12 };

/**
 * Apply English translations to course weeks.
 * - Merges title_en, content_en, codeExample_en, task_en directly on section
 * - Patches each quiz question with q_en, options_en, explanation_en from quiz_en array
 */
export function applyEnglishTranslations(courseWeeks, translationMap) {
  return courseWeeks.map(week => ({
    ...week,
    sections: week.sections.map(section => {
      const trans = translationMap[section.id];
      if (!trans) return section;

      // 1. Patch quiz questions — add _en fields to each question
      let patchedQuiz = section.quiz;
      if (trans.quiz_en && Array.isArray(trans.quiz_en) && section.quiz) {
        patchedQuiz = section.quiz.map((q, i) => {
          const enQ = trans.quiz_en[i];
          if (!enQ) return q;
          return {
            ...q,
            q_en: enQ.q,
            options_en: enQ.options,
            explanation_en: enQ.explanation,
          };
        });
      }

      // 2. Patch task — merge task_en.description and task_en.hint into task object
      let patchedTask = section.task;
      if (trans.task_en && section.task) {
        patchedTask = {
          ...section.task,
          description_en: trans.task_en.description,
          hint_en: trans.task_en.hint,
          ...(trans.task_en.starterCode_en ? { starterCode_en: trans.task_en.starterCode_en } : {}),
        };
      }

      // 3. Spread all trans fields (title_en, content_en, codeExample_en)
      // but exclude task_en and quiz_en (already handled above)
      const { quiz_en: _q, task_en: _t, ...restTrans } = trans;
      return {
        ...section,
        ...restTrans,
        quiz: patchedQuiz,
        task: patchedTask,
      };
    }),
  }));
}