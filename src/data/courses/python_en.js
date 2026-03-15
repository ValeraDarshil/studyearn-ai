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
    task_en: { description: 'Print your name, city and favorite food — each on a separate line!', hint: 'Use three separate print() statements — one for name, one for city, one for food' },
    quiz_en: [
      { q: 'Which function is used to print text in Python?', options: ['display()', 'print()', 'show()', 'write()'], correct: 1, explanation: "print() is Python's built-in function that displays output on the screen." },
      { q: 'What will be the output of print("Hello")?', options: ['"Hello"', 'Hello', 'hello', 'HELLO'], correct: 1, explanation: 'print() displays the text without quotes — just the content inside.' },
      { q: 'Is Python case-sensitive?', options: ['Yes', 'No', 'Sometimes', 'Depends on OS'], correct: 0, explanation: 'Yes! Python is strictly case-sensitive. print and Print are completely different.' },
    ],
  },
  'py-w1-s2': {
    title_en: 'Variables — Storing Data',
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
    task_en: { description: 'Store your info in variables: name, age, favourite_subject, percentage. Then print all of them!', hint: 'Create 4 variables and print each one. Use quotes for strings, direct value for numbers.' },
    quiz_en: [
      { q: 'How do you create a variable in Python?', options: ['var naam = "Rahul"', 'naam = "Rahul"', 'let naam = "Rahul"', 'string naam = "Rahul"'], correct: 1, explanation: 'In Python, you just write name = value directly — no keyword needed!' },
      { q: 'Which variable name is NOT valid?', options: ['my_name', 'name1', '_score', '2score'], correct: 3, explanation: 'Variable names cannot start with a number. "2score" is invalid.' },
      { q: 'What data type is "Hello"?', options: ['Integer', 'Float', 'String', 'Boolean'], correct: 2, explanation: 'Text written inside quotes is of String type.' },
    ],
  },
  'py-w1-s3': {
    title_en: 'Getting User Input — input()',
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
    task_en: { description: "Get the user's name and favourite number. Then print: \"[name]'s favourite number is [number] and its double is [2x number]!\"", hint: 'Get name using input() (string), number using int(input()), then calculate number * 2' },
    quiz_en: [
      { q: 'What type does input() always return?', options: ['Integer', 'Float', 'String', 'Boolean'], correct: 2, explanation: 'input() always returns a String — even if the user types a number.' },
      { q: 'What is the correct way to get an integer input from the user?', options: ['input(int("Age: "))', 'int(input("Age: "))', 'integer(input("Age: "))', 'input("Age: ", int)'], correct: 1, explanation: 'int() wraps input() — first input() gets the string, then int() converts it.' },
      { q: 'In print("Hello", name), what is name?', options: ['String literal', 'Variable', 'Function', 'Keyword'], correct: 1, explanation: 'name written outside quotes is a variable that holds a value.' },
    ],
  },
  'py-w1-s4': {
    title_en: 'Basic Math — Python as a Calculator',
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
    task_en: { description: 'Build a simple EMI calculator: get loan amount, interest rate (%), and years. Formula: total = amount + (amount * rate * years / 100), monthly = total / (years * 12)', hint: 'total_amount = loan + (loan * rate * years / 100), then monthly = total_amount / (years * 12)' },
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
    task_en: { description: 'Create Django project "mystudysite" with "pages" app. Build 3 pages: home (welcome + your name), about (your info), contact (contact form HTML). Configure all URLs.', hint: 'django-admin startproject → startapp → add to INSTALLED_APPS → views.py functions → urls.py routes' },
    quiz_en: [
      { q: 'What command creates a new Django app?', options: ['django-admin createapp', 'python manage.py startapp', 'django new app', 'pip install app'], correct: 1, explanation: 'python manage.py startapp appname creates a new app with models, views, urls files.' },
      { q: "What is Django's MVT pattern?", options: ['Model-View-Template', 'Module-Variable-Type', 'Main-View-Transfer', 'Model-Variable-Template'], correct: 0, explanation: 'MVT = Model (database), View (logic), Template (HTML). Django\'s version of MVC.' },
      { q: 'What does render(request, template, context) do?', options: ['Sends HTTP request', 'Renders HTML template with context data and returns HTTP response', 'Creates database entry', 'Redirects to URL'], correct: 1, explanation: 'render() combines a template with context dict to produce an HTTP response with HTML.' },
    ],
  },
  'py-w9-s2': {
    title_en: 'Django Models — Database Tables with Python',
    task_en: { description: 'Create 3 models: Category, Post (FK to Category), Comment (FK to Post). Run migrations. Use Django shell to create data and practice ORM queries.', hint: 'makemigrations → migrate → shell. from posts.models import Post → Post.objects.create(...)' },
    quiz_en: [
      { q: 'What does makemigrations do?', options: ['Updates database', 'Creates migration files detecting model changes', 'Runs the server', 'Tests models'], correct: 1, explanation: 'makemigrations detects changes in models.py and creates migration files. migrate applies them to DB.' },
      { q: 'What does Post.objects.filter(is_published=True) return?', options: ['One post', 'QuerySet of all published posts', 'True or False', 'Count of posts'], correct: 1, explanation: 'filter() returns a QuerySet (lazy list) of all matching objects. get() returns exactly one.' },
      { q: 'What does on_delete=models.CASCADE do in ForeignKey?', options: ['Protects parent from deletion', 'When parent is deleted, child records are deleted too', 'Sets FK to NULL', 'Raises an error'], correct: 1, explanation: 'CASCADE = if Category is deleted, all its Posts are also deleted automatically.' },
    ],
  },
  'py-w9-s3': {
    title_en: 'Django Templates and Admin Panel',
    task_en: { description: 'Build blog with templates: base.html (navbar), list.html (posts as cards with category filter), detail.html (full post + related posts). Register models in admin.', hint: 'templates/ at project root. Add to DIRS in settings.py. {% block content %}{% endblock %} in base.html.' },
    quiz_en: [
      { q: 'How do you use a URL in Django templates?', options: ['"http://localhost/post/1"', '{% url "post_detail" post.pk %}', '{{ url post_detail }}', 'href="/post/1"'], correct: 1, explanation: '{% url "view_name" args %} generates URLs by view name — if URL changes, templates update automatically.' },
      { q: 'What does {% extends "base.html" %} do?', options: ['Copies all of base.html', 'Makes the template inherit from base.html', 'Imports base.html', 'Includes base.html content'], correct: 1, explanation: 'extends lets a child template inherit the layout from a parent template, filling in {% block %} areas.' },
      { q: 'What does {{ post.content|truncatewords:30 }} do?', options: ['Shows 30th word', 'Shows first 30 words then ...', 'Truncates to 30 chars', 'Repeats 30 times'], correct: 1, explanation: 'Filters in Django templates format output. truncatewords:30 shows first 30 words + ellipsis.' },
    ],
  },
  'py-w9-s4': {
    title_en: 'Week 9 Project — Full Blog with Forms',
    task_en: { description: 'Complete blog: post list with search + category filter, post detail with comment form, create post form. Add 5 real posts. Test all features.', hint: 'Q objects: Q(title__icontains=q) | Q(content__icontains=q). Add related_name="comments" to Comment FK.' },
    quiz_en: [
      { q: 'Why is {% csrf_token %} required in forms?', options: ['For styling', 'Protects against Cross-Site Request Forgery attacks', 'For form validation', 'For database connection'], correct: 1, explanation: 'CSRF token prevents malicious sites from making requests on behalf of your users.' },
      { q: 'What does form.is_valid() check?', options: ['If form was submitted', 'If all fields pass validation rules', 'If form has errors', 'If form has data'], correct: 1, explanation: 'is_valid() runs all validators and returns True only if all fields pass. After this, form.cleaned_data is safe to use.' },
      { q: 'What do Q objects allow in Django ORM?', options: ['Only AND queries', 'Complex OR/AND queries with | and & operators', 'Only exact matches', 'Subqueries only'], correct: 1, explanation: 'Q objects enable complex queries: Q(title__icontains=q) | Q(content__icontains=q) = search in title OR content.' },
    ],
  },
  'py-w10-s1': {
    title_en: 'What is ML — Types and Concepts',
    task_en: { description: 'Build a survival predictor (200 passengers: age, fare, class, gender → survived). Use RandomForestClassifier. Show accuracy, feature importance, predict 5 new passengers.', hint: 'from sklearn.ensemble import RandomForestClassifier. pd.get_dummies() for gender. model.feature_importances_' },
    quiz_en: [
      { q: 'What is Supervised Learning?', options: ['Learning without labels', 'Learning from labeled data (input-output pairs)', 'Learning by trial and error', 'Unsupervised clustering'], correct: 1, explanation: 'Supervised learning uses labeled data — you provide both features (X) and correct answers (y) for training.' },
      { q: 'What does train_test_split with test_size=0.2 do?', options: ['20% for training, 80% for test', '80% for training, 20% for test', '20 samples for test', 'Random 20 samples'], correct: 1, explanation: 'test_size=0.2 = 20% test data, 80% training data. Standard practice.' },
      { q: 'Why use StandardScaler?', options: ['To sort data', 'To bring all features to same scale, preventing bias', 'To fill missing values', 'To encode labels'], correct: 1, explanation: 'Without scaling, features with large values dominate. StandardScaler normalizes all features equally.' },
    ],
  },
  'py-w10-s2': {
    title_en: 'Regression — Predicting Numbers',
    task_en: { description: 'Build a house price predictor with: area, bedrooms, bathrooms, age, floors, distance, amenities. Use RandomForestRegressor. Show R², top 3 features, actual vs predicted.', hint: 'rf.feature_importances_ for importance. pd.DataFrame({"Actual": y_test[:10].values, "Predicted": preds[:10].round(1)})' },
    quiz_en: [
      { q: 'What does an R² score of 0.85 mean?', options: ['85% errors', '85% data points correct', 'Model explains 85% of variance', '85% accuracy'], correct: 2, explanation: 'R² = variance explained. 0.85 = model explains 85% of the variation in the target. 1.0 = perfect.' },
      { q: 'What is the difference between MAE and RMSE?', options: ['No difference', 'RMSE penalizes large errors more severely due to squaring', 'MAE is more accurate', 'RMSE is always smaller'], correct: 1, explanation: 'MAE = average absolute error. RMSE squares errors first, so big errors have more weight.' },
      { q: 'When should you use regression vs classification?', options: ['Always use classification', 'Regression for continuous numbers; classification for categories', 'Always use regression', 'Depends on data size'], correct: 1, explanation: 'Regression predicts continuous values (price, temperature). Classification predicts categories (spam/not spam).' },
    ],
  },
  'py-w10-s3': {
    title_en: 'Clustering and Model Saving',
    task_en: { description: 'Cluster students by performance. Use K=3. Name each cluster meaningfully (e.g., "Achiever", "Average", "At Risk"). Save the model. Predict 3 new students.', hint: 'Name clusters based on groupby mean profiles. joblib.dump(model, "cluster.pkl"). scaler.transform() before predict.' },
    quiz_en: [
      { q: 'What type of learning is K-Means?', options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Semi-supervised'], correct: 1, explanation: 'K-Means is unsupervised — no labels needed. It finds patterns and groups in data on its own.' },
      { q: 'What does joblib.dump() do?', options: ['Dumps data to database', 'Saves trained model to a file for later use', 'Deletes the model', 'Evaluates the model'], correct: 1, explanation: 'joblib.dump(model, "file.pkl") serializes the trained model to disk so you can load and use it later.' },
      { q: 'Why must you transform new data with the same scaler used in training?', options: ['No reason', 'To prevent data leakage and ensure consistent scaling', 'To make it faster', 'To add more features'], correct: 1, explanation: 'The model learned with specific scale. Using a different scaler on new data = wrong scale = wrong predictions.' },
    ],
  },
  'py-w10-s4': {
    title_en: 'Week 10 Project — Complete ML Pipeline',
    task_en: { description: 'Loan predictor CLI: accept inputs (age, income, loan, credit score, employment, loans, assets), predict Approved/Rejected, show probability %, explain rejection reason.', hint: 'predict_proba() for probability. Check individual thresholds manually and collect reasons list.' },
    quiz_en: [
      { q: 'What is the main benefit of sklearn Pipeline?', options: ['Faster training', 'Chains preprocessing + model, prevents data leakage', 'Better accuracy', 'Handles missing values'], correct: 1, explanation: 'Pipeline ensures preprocessing is applied consistently in training and prediction, preventing leakage.' },
      { q: 'What does predict_proba() return for binary classification?', options: ['Single prediction', '[P(class_0), P(class_1)] for each sample', 'Confidence 0-100', 'Boolean array'], correct: 1, explanation: 'predict_proba() returns probability for each class. For binary: [P(reject), P(approve)] — sums to 1.0.' },
      { q: 'What is overfitting?', options: ['Model is too simple', 'Model performs well on training data but poorly on new data', 'Model trains too slowly', 'Model uses too many features'], correct: 1, explanation: 'Overfitting = model memorizes training data instead of learning patterns. Use cross-validation to detect it.' },
    ],
  },
  'py-w11-s1': {
    title_en: 'File System Automation',
    task_en: { description: 'Build a duplicate file finder using MD5 hashing. Show: duplicates found, space wasted, offer to delete or move to "duplicates" folder.', hint: 'hashlib.md5(f.read()).hexdigest(). Store as {hash: [file_paths]}. More than 1 path = duplicate.' },
    quiz_en: [
      { q: 'What does Path.rglob("*.pdf") do?', options: ['Finds PDFs in current folder only', 'Finds PDFs recursively in all subfolders', 'Deletes PDF files', 'Counts PDF files'], correct: 1, explanation: 'rglob = recursive glob. Searches current directory AND all nested subdirectories.' },
      { q: 'What is the purpose of file hashing for duplicate detection?', options: ['Makes files smaller', 'Creates a unique fingerprint of file contents for comparison', 'Encrypts files', 'Speeds up file reading'], correct: 1, explanation: 'MD5 hash produces a unique fingerprint. Same hash = identical content, regardless of filename.' },
      { q: 'Difference between shutil.copy() and shutil.copy2()?', options: ['No difference', 'copy2() preserves metadata (timestamps) while copy() does not', 'copy2() is faster', 'copy() copies folders'], correct: 1, explanation: 'copy2() copies file content AND metadata (creation/modification timestamps). copy() copies content only.' },
    ],
  },
  'py-w11-s2': {
    title_en: 'Excel Automation — Reports with openpyxl',
    task_en: { description: 'Build an attendance register: 30 students, 20 days. Calculate percentage per student, highlight <75% in red, add daily summary sheet, include a chart.', hint: 'cell.fill = PatternFill(fgColor="FF0000"). ws2 = wb.create_sheet("Summary"). percentage = present_count/20*100' },
    quiz_en: [
      { q: 'When should you use openpyxl vs pandas for Excel?', options: ['Always pandas', 'openpyxl for formatting/charts; pandas for data analysis', 'Always openpyxl', 'No difference'], correct: 1, explanation: 'Use openpyxl for rich formatting, charts, cell styles. Use pandas for analysis, then openpyxl for final formatting.' },
      { q: 'What does wb.create_sheet("Summary") do?', options: ['Creates a new workbook', 'Creates a new sheet tab in the workbook', 'Opens Summary.xlsx', 'Deletes existing sheet'], correct: 1, explanation: 'create_sheet() adds a new worksheet tab to the existing workbook.' },
      { q: 'What does PatternFill(fgColor="FF0000") do?', options: ['Changes font color to red', 'Fills cell background with red color', 'Adds red border', 'Makes text bold and red'], correct: 1, explanation: 'PatternFill sets the cell background (fill) color. FF0000 is the hex code for red.' },
    ],
  },
  'py-w11-s3': {
    title_en: 'Email Automation — Sending Emails with Python',
    task_en: { description: 'Build a birthday reminder: read CSV (name, email, birthday). Check today\'s birthdays and print personalized HTML emails with name, age, and a fun message.', hint: 'datetime.now().strftime("%m-%d") for today. age = current_year - birth_year. HTML template with f-strings.' },
    quiz_en: [
      { q: 'Why use an App Password for Gmail instead of your regular password?', options: ['App Password is more secure', 'Google blocks regular password for 2FA-enabled accounts in scripts', 'Faster authentication', 'Required for all emails'], correct: 1, explanation: 'With 2FA enabled, regular password does not work for third-party apps. App Password is a special 16-char password for one app.' },
      { q: 'What is MIMEMultipart used for?', options: ['Multiple recipients', 'Creating emails with multiple parts: text + HTML + attachments', 'Faster delivery', 'Large attachments'], correct: 1, explanation: 'MIME = email format standard. MIMEMultipart allows combining text, HTML, and file attachments in one email.' },
      { q: 'Why add time.sleep() when sending bulk emails?', options: ['Email format requirement', 'Avoids spam filters and respects server rate limits', 'Required by Python', 'Prevents memory issues'], correct: 1, explanation: 'Rapid sending triggers spam filters. A 1-second delay is polite and helps stay within Gmail\'s daily limits.' },
    ],
  },
  'py-w11-s4': {
    title_en: 'Week 11 Project — Complete Automation Suite',
    task_en: { description: 'Build AutomationSuite class: organize_files(), generate_excel_report(), email_notifier(). Create main() that runs all three in sequence.', hint: 'CSV with csv.DictReader. HTML with f-strings. main() calls all three methods in order.' },
    quiz_en: [
      { q: 'What is the advantage of using a class for an automation suite?', options: ['Runs faster', 'Groups related methods and shared state, easy to extend', 'Uses less memory', 'No advantage'], correct: 1, explanation: 'A class bundles related automation methods with shared state (log, config). Easy to add new methods.' },
      { q: 'What does the schedule library allow?', options: ['Scheduling job interviews', 'Running Python functions automatically at specified times', 'Managing file schedules', 'Calendar integration'], correct: 1, explanation: 'schedule.every().day.at("09:00").do(func) runs func every day at 9am — like cron jobs in pure Python.' },
      { q: 'Why use logging instead of print() in automation scripts?', options: ['logging is faster', 'Logs persist to file with timestamps and severity levels', 'print() does not work in scripts', 'logging is standard'], correct: 1, explanation: 'Logging saves to file, includes timestamps, and supports levels (INFO/WARNING/ERROR) for filtering.' },
    ],
  },
  'py-w12-s1': {
    title_en: 'Course Recap — A Three-Month Journey',
    task_en: { description: 'Create a Python recap script: dictionary of all concepts by week, count per month, generate a "Python Journey Report" as a text file.', hint: 'concepts = {"Week 1": ["variables", "loops"], ...}. Count with len(). Write to "report.txt".' },
    quiz_en: [
      { q: 'Which was NOT covered in Month 2?', options: ['Regular Expressions', 'Web Scraping', 'Django Web Framework', 'Pandas & Matplotlib'], correct: 2, explanation: 'Django is Month 3 (Week 9). Month 2: Regex, Web Scraping, APIs, Pandas.' },
      { q: 'What is list comprehension?', options: ['[for x in list]', '[x*2 for x in numbers if x > 0]', 'list(comprehension)', 'for x: append(list)'], correct: 1, explanation: '[expression for item in iterable if condition] — creates a filtered/transformed list in one line.' },
      { q: 'What should you learn next for Data Science?', options: ['PHP', 'TensorFlow + Deep Learning + Kaggle competitions', 'WordPress', 'Java'], correct: 1, explanation: 'After scikit-learn: TensorFlow/PyTorch for deep learning. Kaggle for real datasets and competitions.' },
    ],
  },
  'py-w12-s2': {
    title_en: 'Capstone Project — Student Management System 2.0',
    task_en: { description: 'Build EduTrack Pro: JSON database, pandas analytics (3 charts), ML grade predictor, Excel report. Test end-to-end with 5 students.', hint: 'pandas DataFrame from students. plt.subplots(1,3). at_risk = [s for s in students if avg < 60].' },
    quiz_en: [
      { q: 'For a small project, what is the advantage of JSON over a full database?', options: ['JSON is faster', 'No setup needed — works directly with files', 'More secure', 'Handles more data'], correct: 1, explanation: 'JSON file requires no installation, no server, no schema. Perfect for small projects and learning.' },
      { q: 'What does plt.subplots(1, 3) create?', options: ['1 chart', '3 charts stacked vertically', '3 charts side by side in a row', '3 separate windows'], correct: 2, explanation: 'subplots(rows, cols) = (1, 3) creates 1 row, 3 columns = 3 charts side by side.' },
      { q: 'What is the benefit of ML for a student management system?', options: ['Faster data entry', 'Predict at-risk students before final exams based on patterns', 'Auto-generate reports', 'Prettier charts'], correct: 1, explanation: 'ML can identify students likely to fail based on attendance + mid-term scores — enabling early intervention.' },
    ],
  },
  'py-w12-s3': {
    title_en: 'Capstone Part 2 — Adding ML + Automation',
    task_en: { description: 'Complete EduTrack Pro: SmartGradePredictor class, generate_excel_report(), send_alert_email() for at-risk students. Test the full pipeline.', hint: 'Save model with joblib. Keep features consistent between training and prediction. Same scaler for transform.' },
    quiz_en: [
      { q: 'What does joblib.load() allow you to do?', options: ['Load a Python module', 'Use a previously trained model without retraining', 'Load a database', 'Import a CSV file'], correct: 1, explanation: 'joblib.load() deserializes a saved model — you get the exact trained model back without any retraining.' },
      { q: 'In a complete ML pipeline, what is the correct order?', options: ['Predict → Train → Clean', 'Load → Clean → Split → Train → Evaluate → Save', 'Train → Split → Clean', 'Save → Train → Load'], correct: 1, explanation: 'Correct ML workflow: Load data → Clean → Split train/test → Train → Evaluate → Save model → Deploy.' },
      { q: 'What makes a "production-ready" ML model different from a notebook experiment?', options: ['More accuracy', 'Error handling, input validation, logging, saved model file', 'More data', 'Faster code'], correct: 1, explanation: 'Production ML needs: try-except, input validation, a saved model file, logging, and consistent preprocessing.' },
    ],
  },
  'py-w12-s4': {
    title_en: 'Course Complete! Certificate and Next Steps',
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

      // Patch quiz questions — add _en fields to each question
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

      // Merge everything — spread trans (gets title_en, content_en, codeExample_en, task_en)
      // but use patchedQuiz (not quiz_en array directly)
      const { quiz_en: _removed, ...transWithoutQuizEn } = trans;
      return {
        ...section,
        ...transWithoutQuizEn,
        quiz: patchedQuiz,
      };
    }),
  }));
}