/**
 * StudyEarn AI — Python Week 1 English Translations
 * This file patches Week 1 sections with English content at runtime.
 * Applied in python.js after PYTHON_COURSE is defined.
 */

export const PYTHON_WEEK1_EN = {
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
    task_en: {
      description: 'Print your name, city and favorite food — each on a separate line!',
      hint: 'Use three separate print() statements — one for name, one for city, one for food',
    },
    quiz_en: [
      {
        q: 'Which function is used to print text in Python?',
        options: ['display()', 'print()', 'show()', 'write()'],
        correct: 1,
        explanation: "print() is Python's built-in function that displays output on the screen.",
      },
      {
        q: 'What will be the output of print("Hello")?',
        options: ['"Hello"', 'Hello', 'hello', 'HELLO'],
        correct: 1,
        explanation: 'print() displays the text without quotes — just the content inside.',
      },
      {
        q: 'Is Python case-sensitive?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on OS'],
        correct: 0,
        explanation: 'Yes! Python is strictly case-sensitive. print and Print are completely different.',
      },
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
    task_en: {
      description: 'Store your info in variables: name, age, favourite_subject, percentage. Then print all of them!',
      hint: 'Create 4 variables and print each one. Use quotes for strings, direct value for numbers.',
    },
    quiz_en: [
      {
        q: 'How do you create a variable in Python?',
        options: ['var naam = "Rahul"', 'naam = "Rahul"', 'let naam = "Rahul"', 'string naam = "Rahul"'],
        correct: 1,
        explanation: 'In Python, you just write name = value directly — no keyword needed!',
      },
      {
        q: 'Which variable name is NOT valid?',
        options: ['my_name', 'name1', '_score', '2score'],
        correct: 3,
        explanation: 'Variable names cannot start with a number. "2score" is invalid.',
      },
      {
        q: 'What data type is "Hello"?',
        options: ['Integer', 'Float', 'String', 'Boolean'],
        correct: 2,
        explanation: 'Text written inside quotes is of String type.',
      },
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
    task_en: {
      description: 'Get the user\'s name and favourite number. Then print: "[name]\'s favourite number is [number] and its double is [2x number]!"',
      hint: 'Get name using input() (string), number using int(input()), then calculate number * 2',
    },
    quiz_en: [
      {
        q: 'What type does input() always return?',
        options: ['Integer', 'Float', 'String', 'Boolean'],
        correct: 2,
        explanation: 'input() always returns a String — even if the user types a number.',
      },
      {
        q: 'What is the correct way to get an integer input from the user?',
        options: ['input(int("Age: "))', 'int(input("Age: "))', 'integer(input("Age: "))', 'input("Age: ", int)'],
        correct: 1,
        explanation: 'int() wraps input() — first input() gets the string, then int() converts it.',
      },
      {
        q: 'In print("Hello", name), what is name?',
        options: ['String literal', 'Variable', 'Function', 'Keyword'],
        correct: 1,
        explanation: 'name written outside quotes is a variable that holds a value.',
      },
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
remainder = number % 2

if remainder == 0:
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
\`\`\`

Output:
\`\`\`
Vikram's result:
Marks: 450/500
Percentage: 90.00%
\`\`\``,
    task_en: {
      description: 'Build a simple EMI calculator: get loan amount, interest rate (%), and years from the user. Calculate monthly EMI. Formula: total = amount + (amount * rate * years / 100), monthly = total / (years * 12)',
      hint: 'Simplified: total_amount = loan + (loan * rate * years / 100), then monthly = total_amount / (years * 12)',
    },
    quiz_en: [
      {
        q: 'What will 17 % 5 output?',
        options: ['3', '2', '3.4', '0'],
        correct: 1,
        explanation: '17 divided by 5 = 3 remainder 2. Modulus (%) only returns the remainder.',
      },
      {
        q: 'How do you use a variable in an f-string?',
        options: ['f"Hello {name}"', 'f"Hello name"', '"Hello" + name', 'f("Hello", name)'],
        correct: 0,
        explanation: 'In f-strings, write the variable name inside curly braces {}.',
      },
      {
        q: 'What will 10 // 3 return?',
        options: ['3.33', '3', '4', '1'],
        correct: 1,
        explanation: 'Floor division (//) removes the decimal part — 10/3 = 3.33, floor = 3.',
      },
    ],
  },
};

// Apply English translations to course weeks
export function applyEnglishTranslations(courseWeeks, translationMap) {
  return courseWeeks.map(week => ({
    ...week,
    sections: week.sections.map(section => {
      const trans = translationMap[section.id];
      if (!trans) return section;
      return { ...section, ...trans };
    }),
  }));
}