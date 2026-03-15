/**
 * StudyEarn AI — Python Weeks 2-12 English Translations
 * Applied via applyEnglishTranslations() in python.js
 */

export const PYTHON_WEEKS2_12_EN = {

  // ── WEEK 2 ──────────────────────────────────────────────────
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

if score >= 90:
    print("🏆 Outstanding! A+ Grade")
elif score >= 80:
    print("🎉 Excellent! A Grade")
elif score >= 70:
    print("👍 Good! B Grade")
elif score >= 60:
    print("📚 Average. C Grade")
else:
    print("💪 Keep working. Fail")
\`\`\`

### Comparison Operators
| Operator | Meaning |
|----------|---------|
| == | equal to |
| != | not equal |
| > | greater than |
| < | less than |
| >= | greater or equal |
| <= | less or equal |

### Logical Operators
\`\`\`python
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed!")

if age < 13 or age > 60:
    print("Special discount available!")
\`\`\``,
    task_en: { description: "Build a BMI calculator. Take weight (kg) and height (cm) from the user. Calculate BMI = weight / (height/100)^2. Show result: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (>=30).", hint: "BMI = weight / (height_m ** 2). Convert cm to meters: height_m = height / 100." },
    quiz_en: [
      { q: 'What is the correct syntax for checking multiple conditions?', options: ['if/else if/else', 'if/elif/else', 'if/elseif/else', 'if/or/else'], correct: 1, explanation: 'Python uses elif (not else if). It checks multiple conditions in order and executes the first one that is True.' },
      { q: 'What does the "and" operator do?', options: ['Returns True if either condition is True', 'Returns True only if BOTH conditions are True', 'Combines two numbers', 'Checks equality'], correct: 1, explanation: '"and" requires both conditions to be True. "or" requires at least one to be True.' },
      { q: 'What will happen if no if/elif condition is True and there is no else?', options: ['Error occurs', 'Nothing happens — code continues', 'Program stops', 'Returns False'], correct: 1, explanation: 'If no condition matches and there is no else block, Python simply skips the entire if statement and continues.' },
    ],
  },

  'py-w2-s2': {
    title_en: 'Loops — Repeating Tasks',
    content_en: `## Loops — Make Python Do Repetitive Work!

Instead of writing the same code 100 times, use a loop!

### for Loop
\`\`\`python
# Print 1 to 5
for i in range(1, 6):
    print(i)

# Loop through a list
fruits = ["apple", "mango", "banana"]
for fruit in fruits:
    print("I like", fruit)
\`\`\`

### range() Function
\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 6)     # 1, 2, 3, 4, 5
range(0, 10, 2) # 0, 2, 4, 6, 8 (step of 2)
range(10, 0, -1)# 10, 9, 8...1 (countdown)
\`\`\`

### while Loop
\`\`\`python
count = 1
while count <= 5:
    print("Count:", count)
    count += 1  # count = count + 1

# While with user input
while True:
    answer = input("Type 'quit' to exit: ")
    if answer == 'quit':
        break
    print("You typed:", answer)
\`\`\`

### break and continue
\`\`\`python
# break — exit loop immediately
for i in range(10):
    if i == 5:
        break  # Stop when i is 5
    print(i)  # Prints 0,1,2,3,4

# continue — skip current iteration
for i in range(10):
    if i % 2 == 0:
        continue  # Skip even numbers
    print(i)  # Prints 1,3,5,7,9
\`\`\``,
    task_en: { description: "Build a multiplication table generator. Ask the user for a number and how many rows. Print the full multiplication table. Example: if user enters 5 and 10, print 5×1=5 to 5×10=50.", hint: "Use a for loop with range(1, rows+1). Print: f'{num} × {i} = {num*i}'" },
    quiz_en: [
      { q: 'What does range(2, 10, 3) produce?', options: ['2, 5, 8', '2, 4, 6, 8', '3, 6, 9', '2, 3, 4, 5, 6, 7, 8, 9'], correct: 0, explanation: 'range(start, stop, step) = 2, 5, 8 — starts at 2, adds 3 each time, stops before 10.' },
      { q: 'What does break do inside a loop?', options: ['Pauses the loop', 'Skips current iteration', 'Exits the loop immediately', 'Restarts the loop'], correct: 2, explanation: 'break exits the entire loop immediately. continue skips only the current iteration and continues the loop.' },
      { q: 'When does a while loop stop?', options: ['After a fixed number of iterations', 'When its condition becomes False', 'When break is used', 'Both B and C'], correct: 3, explanation: 'A while loop stops when: (1) its condition becomes False naturally, or (2) a break statement is executed.' },
    ],
  },

  'py-w2-s3': {
    title_en: 'Lists — Storing Collections of Data',
    content_en: `## Lists — Store Multiple Items in One Variable!

Instead of creating separate variables for each item, use a list!

### Creating and Accessing Lists
\`\`\`python
students = ["Rahul", "Priya", "Arjun", "Neha"]

print(students[0])   # Rahul (index starts at 0)
print(students[-1])  # Neha (last item)
print(students[1:3]) # ['Priya', 'Arjun'] (slice)
\`\`\`

### Modifying Lists
\`\`\`python
numbers = [10, 20, 30, 40, 50]

numbers.append(60)       # Add to end: [10,20,30,40,50,60]
numbers.insert(2, 25)    # Insert at index 2
numbers.remove(20)       # Remove by value
numbers.pop()            # Remove last item
numbers.pop(0)           # Remove first item

print(len(numbers))      # Length of list
\`\`\`

### Useful List Operations
\`\`\`python
marks = [85, 92, 78, 96, 88]

print(max(marks))    # 96
print(min(marks))    # 78
print(sum(marks))    # 439
print(sorted(marks)) # [78, 85, 88, 92, 96]

marks.sort()         # Sort in place
marks.reverse()      # Reverse in place
marks.count(85)      # How many times 85 appears
\`\`\`

### List Comprehension
\`\`\`python
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

even = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\``,
    task_en: { description: "Create a student grade manager. Store 5 students' marks in a list. Calculate: average, highest mark (with student rank), lowest mark, how many students passed (>=40), print all marks sorted from highest to lowest.", hint: "Use sum(marks)/len(marks) for average. marks.index(max(marks)) gives the index of the highest mark." },
    quiz_en: [
      { q: 'What is the index of the last item in a list of 5 elements?', options: ['5', '4', '-1', 'Both B and C'], correct: 3, explanation: 'Last element index is 4 (length-1) or -1 (negative indexing). Both work in Python!' },
      { q: 'What is the difference between append() and insert()?', options: ['No difference', 'append() adds to end, insert() adds at a specific position', 'insert() adds to end', 'append() is faster'], correct: 1, explanation: 'append(item) always adds to the end. insert(index, item) adds at the specified position.' },
      { q: 'What does [x**2 for x in range(3)] produce?', options: ['[1, 4, 9]', '[0, 1, 4]', '[0, 1, 2]', '[1, 2, 3]'], correct: 1, explanation: 'range(3) = 0, 1, 2. Squaring each: 0²=0, 1²=1, 2²=4. Result: [0, 1, 4].' },
    ],
  },

  'py-w2-s4': {
    title_en: 'Functions — Writing Reusable Code',
    content_en: `## Functions — Write Once, Use Many Times!

A function is a block of code that you can call whenever needed — no need to repeat yourself!

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
    elif percentage >= 60: return "C"
    else:                  return "F"

grade = calculate_grade(85)
print("Grade:", grade)  # Grade: B
\`\`\`

### Multiple Return Values
\`\`\`python
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)/len(numbers)

low, high, avg = get_stats([85, 92, 78, 96, 88])
print(f"Low: {low}, High: {high}, Avg: {avg:.1f}")
\`\`\`

### Default Parameters & *args
\`\`\`python
def power(base, exp=2):  # Default exponent is 2
    return base ** exp

print(power(4))    # 16 (4²)
print(power(2, 8)) # 256 (2⁸)

def total(*numbers):  # Accept any number of args
    return sum(numbers)

print(total(1, 2, 3, 4, 5))  # 15
\`\`\``,
    task_en: { description: "Build a simple calculator with functions. Create separate functions: add(a, b), subtract(a, b), multiply(a, b), divide(a, b). Then create a main calculator() function that asks the user for two numbers and an operation, calls the appropriate function, and displays the result.", hint: "divide() function should check if b==0 to avoid division by zero error. Return an error message instead." },
    quiz_en: [
      { q: 'What does "return" do in a function?', options: ['Prints a value', 'Sends a value back to the caller and exits the function', 'Repeats the function', 'Stops the program'], correct: 1, explanation: 'return sends a value back to wherever the function was called and immediately exits the function.' },
      { q: 'What is a default parameter?', options: ['A parameter that is always required', 'A parameter with a pre-set value used when no argument is passed', 'The first parameter', 'A global variable'], correct: 1, explanation: 'Default parameters have a value assigned in the function definition. They are used when the caller does not provide that argument.' },
      { q: 'What does *args allow?', options: ['Only two arguments', 'Passing any number of arguments', 'Keyword arguments only', 'Returning multiple values'], correct: 1, explanation: '*args collects all extra positional arguments into a tuple, allowing you to pass any number of arguments to a function.' },
    ],
  },

  // ── WEEK 3 ──────────────────────────────────────────────────
  'py-w3-s1': {
    title_en: 'String Methods — Text Manipulation',
    content_en: `## String Methods — Full Control Over Text!

Strings in Python come with powerful built-in methods.

### Common String Methods
\`\`\`python
text = "  Hello, Python World!  "

print(text.strip())      # Remove whitespace from both ends
print(text.lower())      # "  hello, python world!  "
print(text.upper())      # "  HELLO, PYTHON WORLD!  "
print(text.title())      # "  Hello, Python World!  "

sentence = "Python is amazing and Python is fun"
print(sentence.count("Python"))     # 2
print(sentence.find("amazing"))     # 10 (index)
print(sentence.replace("Python", "Coding"))
\`\`\`

### Split and Join
\`\`\`python
csv_data = "Rahul,25,Mumbai,Engineer"
parts = csv_data.split(",")
# ['Rahul', '25', 'Mumbai', 'Engineer']

words = ["Python", "is", "awesome"]
result = " ".join(words)
# "Python is awesome"
\`\`\`

### String Checking
\`\`\`python
print("hello".isalpha())   # True (only letters)
print("123".isnumeric())   # True (only numbers)
print("  ".isspace())      # True (only spaces)
print("Hello".startswith("He"))  # True
print("Hello".endswith("lo"))    # True
\`\`\`

### f-strings (Advanced Formatting)
\`\`\`python
name = "Arjun"
score = 95.567

print(f"{name:>15}")        # Right-align in 15 chars
print(f"{score:.2f}")       # 95.57 (2 decimal places)
print(f"{1000000:,}")       # 1,000,000 (comma separator)
print(f"{0.75:.0%}")        # 75% (percentage)
\`\`\``,
    task_en: { description: "Build a text analyzer. Ask the user to enter a paragraph. Display: total characters, total words, total sentences (count '.'), most common word, text in UPPERCASE, reversed text, and whether it contains the word 'Python'.", hint: "words = text.split() for word count. Use a loop or Counter from collections for most common word. text[::-1] reverses a string." },
    quiz_en: [
      { q: 'What does "hello world".split() return?', options: ['"hello", "world"', "['hello', 'world']", '("hello", "world")', '"hello world"'], correct: 1, explanation: 'split() without arguments splits on whitespace and returns a list of words: ["hello", "world"].' },
      { q: 'What does " ".join(["a", "b", "c"]) return?', options: ['"abc"', '"a b c"', '["a", "b", "c"]', '"a,b,c"'], correct: 1, explanation: 'join() connects list items with the specified separator string. " ".join(...) = "a b c".' },
      { q: 'What does f"{3.14159:.2f}" output?', options: ['3.14159', '3.14', '3.1', '3.142'], correct: 1, explanation: ':.2f means format as float with 2 decimal places. 3.14159 rounded to 2 decimals = 3.14.' },
    ],
  },

  'py-w3-s2': {
    title_en: 'Dictionaries — Key-Value Data Storage',
    content_en: `## Dictionaries — Store Data with Labels!

A dictionary stores data as key-value pairs — like a real dictionary where every word has a definition.

### Creating and Accessing
\`\`\`python
student = {
    "name": "Rahul",
    "age": 20,
    "marks": 85,
    "city": "Mumbai"
}

print(student["name"])          # Rahul
print(student.get("age"))       # 20
print(student.get("phone", "N/A"))  # N/A (default if missing)
\`\`\`

### Modifying Dictionaries
\`\`\`python
student["email"] = "rahul@gmail.com"  # Add new key
student["age"] = 21                   # Update existing key
del student["city"]                   # Delete a key

print(student.keys())    # All keys
print(student.values())  # All values
print(student.items())   # All key-value pairs
\`\`\`

### Looping Through Dictionaries
\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

### Nested Dictionaries
\`\`\`python
school = {
    "class_10A": {
        "students": 30,
        "teacher": "Mrs. Sharma",
        "avg_score": 78.5
    },
    "class_10B": {
        "students": 28,
        "teacher": "Mr. Verma",
        "avg_score": 82.1
    }
}

print(school["class_10A"]["teacher"])  # Mrs. Sharma
\`\`\``,
    task_en: { description: "Build a phone book application. Store at least 5 contacts (name → phone number). Add features: search by name, add new contact, delete contact, display all contacts sorted by name.", hint: "Use a dict where keys are names and values are phone numbers. sorted(phone_book.keys()) gives alphabetically sorted names." },
    quiz_en: [
      { q: 'What is the difference between dict["key"] and dict.get("key")?', options: ['No difference', 'dict["key"] raises KeyError if missing; .get() returns None or a default', '.get() is slower', 'dict["key"] only works for strings'], correct: 1, explanation: 'dict["key"] raises a KeyError if the key does not exist. .get("key", default) safely returns None or a custom default value.' },
      { q: 'What does .items() return?', options: ['Only keys', 'Only values', 'Key-value pairs as tuples', 'Length of dictionary'], correct: 2, explanation: '.items() returns all key-value pairs as tuples: dict_items([(key1, val1), (key2, val2)...])' },
      { q: 'Can dictionary values be lists or other dictionaries?', options: ['No, only strings and numbers', 'Yes, any Python object', 'Only lists', 'Only numbers'], correct: 1, explanation: 'Dictionary values can be any Python object — strings, numbers, lists, other dicts, functions, etc.' },
    ],
  },

  'py-w3-s3': {
    title_en: 'File Handling — Saving Data Permanently',
    content_en: `## File Handling — Save Data So It Persists!

Variables lose their data when the program ends. Files let you save data permanently!

### Reading and Writing Files
\`\`\`python
# Write to a file
with open("notes.txt", "w") as file:
    file.write("Python is awesome!\\n")
    file.write("I am learning file handling.")

# Read entire file
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)

# Read line by line
with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())
\`\`\`

### File Modes
| Mode | Meaning |
|------|---------|
| "r"  | Read (default) |
| "w"  | Write (overwrites existing) |
| "a"  | Append (adds to end) |
| "r+" | Read and Write |

### Working with CSV Files
\`\`\`python
import csv

# Write CSV
with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Marks", "Grade"])
    writer.writerow(["Rahul", 85, "A"])
    writer.writerow(["Priya", 92, "A+"])

# Read CSV
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["Name"], row["Marks"])
\`\`\``,
    task_en: { description: "Build a simple diary application. User can: (1) Write a new entry (appended with date/time), (2) Read all past entries, (3) Search entries by keyword. Save everything to 'diary.txt'.", hint: "Use 'a' mode for appending. Import datetime: from datetime import datetime. datetime.now().strftime('%Y-%m-%d %H:%M') for timestamp." },
    quiz_en: [
      { q: 'What is the "with" statement used for in file handling?', options: ['Opening multiple files', 'Automatically closing the file after use', 'Writing faster', 'Reading faster'], correct: 1, explanation: '"with open(...) as f:" automatically closes the file when the block ends — even if an error occurs. Best practice!' },
      { q: 'What does "a" mode do that "w" mode does not?', options: ['Creates a new file', 'Appends to end without erasing existing content', 'Reads the file', 'Nothing different'], correct: 1, explanation: '"w" mode overwrites everything. "a" (append) mode adds new content to the end while keeping existing content.' },
      { q: 'What does csv.DictReader return for each row?', options: ['A list', 'A dictionary with column headers as keys', 'A tuple', 'A string'], correct: 1, explanation: 'DictReader treats the first row as headers and returns each subsequent row as a dictionary: {"Name": "Rahul", "Marks": "85"}.' },
    ],
  },

  'py-w3-s4': {
    title_en: 'Error Handling — Preventing Crashes',
    content_en: `## Error Handling — Make Your Programs Robust!

Every program encounters errors. Good programmers handle them gracefully!

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
    print("✅ No errors occurred!")
finally:
    print("Program finished.")  # Always runs
\`\`\`

### Common Exception Types
| Exception | When it occurs |
|-----------|---------------|
| ValueError | Wrong data type conversion |
| TypeError | Wrong type for operation |
| IndexError | List index out of range |
| KeyError | Dictionary key not found |
| FileNotFoundError | File does not exist |
| ZeroDivisionError | Division by zero |

### Raising Custom Errors
\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    if age > 150:
        raise ValueError(f"Age {age} is unrealistic")
    return age

try:
    set_age(-5)
except ValueError as e:
    print(f"Error: {e}")
\`\`\``,
    task_en: { description: "Build a robust calculator that handles all errors: division by zero, invalid input (letters instead of numbers), unsupported operations. Show a friendly error message for each case and ask if the user wants to try again.", hint: "Wrap int(input()) in try-except ValueError. Check for division by zero before dividing. Use a while True loop with break to allow retry." },
    quiz_en: [
      { q: 'When does the "finally" block execute?', options: ['Only when an error occurs', 'Only when no error occurs', 'Always, whether or not an error occurred', 'Never automatically'], correct: 2, explanation: '"finally" always runs — whether the try block succeeded, failed, or even if there was a return statement. Perfect for cleanup.' },
      { q: 'What is the difference between except Exception and except ValueError?', options: ['No difference', 'except ValueError only catches that specific error; except Exception catches all', 'except Exception is faster', 'except ValueError catches more errors'], correct: 1, explanation: 'except ValueError catches only ValueError. except Exception catches all exceptions. Be specific first, then general as a fallback.' },
      { q: 'What does "raise" do?', options: ['Prints an error message', 'Deliberately triggers an exception', 'Stops the program', 'Ignores the error'], correct: 1, explanation: '"raise" lets you deliberately trigger an exception. Useful for input validation — raise ValueError if business rules are violated.' },
    ],
  },

  // ── WEEK 4 ──────────────────────────────────────────────────
  'py-w4-s1': {
    title_en: 'Classes and Objects — OOP Basics',
    content_en: `## Object-Oriented Programming — Model the Real World!

OOP lets you create custom data types that bundle data and behavior together.

### Class Basics
\`\`\`python
class Student:
    def __init__(self, name, age, marks):
        self.name  = name   # Instance attributes
        self.age   = age
        self.marks = marks

    def get_grade(self):
        if self.marks >= 90: return "A+"
        elif self.marks >= 80: return "A"
        elif self.marks >= 70: return "B"
        else: return "C"

    def introduce(self):
        print(f"Hi, I am {self.name}, aged {self.age}.")
        print(f"My marks are {self.marks} — Grade: {self.get_grade()}")

# Creating objects
s1 = Student("Rahul", 20, 85)
s2 = Student("Priya", 19, 92)

s1.introduce()
s2.introduce()
print(s1.get_grade())
\`\`\`

### Class vs Instance Variables
\`\`\`python
class BankAccount:
    bank_name = "StudyEarn Bank"  # Class variable (shared)

    def __init__(self, owner, balance=0):
        self.owner   = owner    # Instance variable
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited ₹{amount}. Balance: ₹{self.balance}")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds!")
        else:
            self.balance -= amount
            print(f"Withdrawn ₹{amount}. Balance: ₹{self.balance}")

acc = BankAccount("Rahul", 1000)
acc.deposit(500)
acc.withdraw(200)
\`\`\``,
    task_en: { description: "Create a Library class that manages books. Attributes: library_name, books (list). Methods: add_book(title, author), remove_book(title), search_book(keyword), display_all(), total_books(). Test with at least 5 books.", hint: "Each book can be a dict: {'title': '...', 'author': '...'}. search_book() should check if keyword is in title or author name." },
    quiz_en: [
      { q: 'What is __init__ in a class?', options: ['A regular method', 'A constructor — automatically called when an object is created', 'A class variable', 'A static method'], correct: 1, explanation: '__init__ is the constructor method. It runs automatically when you create a new object and initializes the instance attributes.' },
      { q: 'What does "self" represent?', options: ['The class itself', 'The current instance (object) of the class', 'A global variable', 'A parameter name that is optional'], correct: 1, explanation: '"self" refers to the specific object being used. When you call s1.introduce(), self IS s1 inside the method.' },
      { q: 'What is the difference between a class variable and an instance variable?', options: ['No difference', 'Class variables are shared by all objects; instance variables are unique per object', 'Instance variables are faster', 'Class variables cannot be changed'], correct: 1, explanation: 'Class variables (defined outside __init__) are shared by all instances. Instance variables (self.x) are unique to each object.' },
    ],
  },

  'py-w4-s2': {
    title_en: 'Modules & Libraries — Python\'s Superpower',
    content_en: `## Modules — Extend Python's Capabilities!

Python's standard library and third-party packages let you do almost anything.

### Importing Modules
\`\`\`python
import math
import random
import datetime
import os

# math module
print(math.pi)           # 3.14159...
print(math.sqrt(144))    # 12.0
print(math.ceil(4.2))    # 5
print(math.floor(4.9))   # 4

# random module
print(random.randint(1, 100))     # Random integer 1-100
print(random.choice(["a","b","c"])) # Random item
numbers = [1,2,3,4,5]
random.shuffle(numbers)           # Shuffle in place
\`\`\`

### datetime Module
\`\`\`python
from datetime import datetime, timedelta

now = datetime.now()
print(now.strftime("%d %B %Y, %H:%M"))  # 15 March 2025, 14:30

# Date arithmetic
tomorrow = now + timedelta(days=1)
last_week = now - timedelta(weeks=1)

# Calculate age
birth = datetime(2000, 5, 15)
age_days = (datetime.now() - birth).days
print(f"Age: {age_days // 365} years")
\`\`\`

### Installing External Packages
\`\`\`bash
pip install requests   # HTTP requests
pip install pandas     # Data analysis
pip install flask      # Web framework
\`\`\`

\`\`\`python
# Creating your own module
# Save as "myutils.py"
def greet(name):
    return f"Hello, {name}!"

# In another file:
import myutils
print(myutils.greet("Rahul"))
\`\`\``,
    task_en: { description: "Build a 'Lucky Numbers' app using the random module. Generate 6 unique lottery numbers between 1-49. Calculate how many match the user's 6 chosen numbers. Show the prize level: 6 match = Jackpot!, 5 = ₹1 Lakh, 4 = ₹10K, 3 = ₹1K.", hint: "random.sample(range(1, 50), 6) generates 6 unique numbers. Use set intersection: set(winning) & set(user_numbers) to find matches." },
    quiz_en: [
      { q: 'What is the difference between "import math" and "from math import sqrt"?', options: ['No difference', '"import math" imports the whole module; "from...import" imports only what you specify', '"from...import" is slower', '"import math" only works for built-in modules'], correct: 1, explanation: '"import math" → use math.sqrt(). "from math import sqrt" → use sqrt() directly. "from math import *" imports everything (not recommended).' },
      { q: 'What does random.sample(range(1,50), 6) do?', options: ['Returns one random number', 'Returns 6 unique random numbers from 1-49', 'Returns numbers in sequence', 'Returns a sorted list'], correct: 1, explanation: 'random.sample() returns a list of unique items without repetition. Perfect for lottery numbers or shuffling.' },
      { q: 'How do you create your own reusable module?', options: ['Using a special command', 'Save functions in a .py file and import it', 'Using the module keyword', 'Only possible with pip'], correct: 1, explanation: 'Any .py file is a module! Save functions in mymodule.py, then "import mymodule" or "from mymodule import function_name".' },
    ],
  },

  'py-w4-s3': {
    title_en: 'Month 1 Project — Student Management System',
    content_en: `## Month 1 Project — Put Everything Together!

Build a complete Student Management System using everything learned in Month 1!

### Project Features
\`\`\`
Student Management System
├── Add Student (name, roll, marks, subject)
├── View All Students (sorted by marks)
├── Search Student (by name or roll number)
├── Update Marks
├── Delete Student
├── Statistics (average, topper, fail count)
└── Save/Load from CSV file
\`\`\`

### Starter Structure
\`\`\`python
import csv
import os
from datetime import datetime

students = []  # List of dicts

def add_student():
    name  = input("Name: ").strip()
    roll  = input("Roll number: ").strip()
    marks = float(input("Marks (out of 100): "))
    students.append({
        "name": name, "roll": roll,
        "marks": marks,
        "grade": get_grade(marks),
        "added": datetime.now().strftime("%Y-%m-%d")
    })
    save_to_csv()
    print(f"✅ {name} added!")

def get_grade(marks):
    if marks >= 90: return "A+"
    elif marks >= 80: return "A"
    elif marks >= 70: return "B"
    elif marks >= 60: return "C"
    else: return "F"

def show_statistics():
    if not students:
        print("No students found."); return
    marks_list = [s["marks"] for s in students]
    topper = max(students, key=lambda s: s["marks"])
    fails  = [s for s in students if s["marks"] < 40]
    print(f"Total: {len(students)} | Average: {sum(marks_list)/len(marks_list):.1f}")
    print(f"Topper: {topper['name']} ({topper['marks']})")
    print(f"Failed: {len(fails)} students")
\`\`\``,
    task_en: { description: "Complete the Student Management System! Implement all functions: add_student(), view_all(), search_student(), update_marks(), delete_student(), show_statistics(), save_to_csv(), load_from_csv(). Create a menu loop so users can choose operations. Test with at least 10 students.", hint: "Main menu: while True: print options, take input, call function. CSV save: use csv.DictWriter. Load at program start with os.path.exists() check." },
    quiz_en: [
      { q: 'What is the best data structure to store a collection of students with multiple attributes?', options: ['A simple list of names', 'A list of dictionaries', 'A single string', 'Only variables'], correct: 1, explanation: 'A list of dicts is perfect: [{"name": "Rahul", "marks": 85}, ...]. Access attributes with student["name"].' },
      { q: 'How do you find the student with the highest marks using max()?', options: ['max(students)', 'max(students, key=lambda s: s["marks"])', 'students.max("marks")', 'sorted(students)[-1]'], correct: 1, explanation: 'max(students, key=lambda s: s["marks"]) uses the marks as the comparison key to find the student with highest marks.' },
      { q: 'What should you do before loading from CSV on program start?', options: ['Always try to load', 'Check if file exists with os.path.exists()', 'Create the file first', 'Nothing special'], correct: 1, explanation: 'os.path.exists("file.csv") prevents FileNotFoundError when running the program for the first time when no CSV exists yet.' },
    ],
  },

  'py-w4-s4': {
    title_en: 'Week 4 Review + Month 2 Preview',
    content_en: `## Month 1 Complete — What You've Achieved! 🎉

Congratulations! In one month you've gone from zero to writing real Python programs!

### Month 1 Skills Recap
\`\`\`python
# Variables and Data Types
name = "Python Learner"
age  = 18
score = 95.5
is_enrolled = True

# Conditions
if score >= 90:
    grade = "A+"
elif score >= 80:
    grade = "A"
else:
    grade = "B or below"

# Loops
for i in range(1, 6):
    print(f"Week {i} complete!")

# Lists and Dicts
skills = ["Python", "OOP", "File Handling"]
profile = {"name": name, "skills": skills, "grade": grade}

# Functions
def summarize(profile):
    print(f"Student: {profile['name']}")
    print(f"Grade: {profile['grade']}")
    print(f"Skills: {', '.join(profile['skills'])}")

summarize(profile)
\`\`\`

### Month 2 Preview — What's Coming!
\`\`\`
Month 2 — Intermediate Level:
  Week 5: Regular Expressions — Pattern matching in text
  Week 6: Web Scraping — Extract data from websites
  Week 7: APIs — Connect to real-world data sources
  Week 8: Pandas & Data Analysis — Analyze data professionally
\`\`\`

### Your Python Journey So Far:
- ✅ Variables, Data Types, Operators
- ✅ Conditions (if/elif/else)
- ✅ Loops (for, while)
- ✅ Functions with parameters and return values
- ✅ Lists and Dictionaries
- ✅ String manipulation
- ✅ File handling (read/write CSV)
- ✅ Error handling (try/except)
- ✅ OOP (Classes, Objects)
- ✅ Modules and Libraries
- ✅ Real Project: Student Management System`,
    task_en: { description: "Final challenge for Month 1! Extend your Student Management System with OOP: Create a Student class and a Classroom class. Classroom manages a list of Student objects. Add methods: class_average(), top_students(n), students_at_risk() (marks < 40), export_report() to CSV.", hint: "class Student: def __init__(self, name, roll, marks). class Classroom: def __init__(self): self.students = []. Methods use self.students list." },
    quiz_en: [
      { q: 'Which of these is NOT covered in Month 1?', options: ['Functions and Classes', 'Web Scraping and APIs', 'File Handling and CSV', 'Loops and Conditions'], correct: 1, explanation: 'Web Scraping and APIs are Month 2 topics. Month 1 covers Python fundamentals: variables, conditions, loops, functions, OOP, file handling.' },
      { q: 'What is the main advantage of using OOP for the Student Management System?', options: ['It runs faster', 'Code is organized into logical objects, easier to extend and maintain', 'Uses less memory', 'No advantage'], correct: 1, explanation: 'OOP groups related data and behavior together. Adding new features (like GPA calculation) means just adding a method to the Student class.' },
      { q: 'How do you import only the sqrt function from the math module?', options: ['import sqrt from math', 'from math import sqrt', 'math.import(sqrt)', 'include math.sqrt'], correct: 1, explanation: '"from math import sqrt" imports only sqrt, so you can call sqrt(16) directly instead of math.sqrt(16).' },
    ],
  },

  // ── WEEKS 5-12: Title + Minimal EN content ────────────────────
  // (Full content same as Hinglish — only title and task translated)

  'py-w5-s1': { title_en: 'Regex Basics — Writing Patterns',
    task_en: { description: 'Find all email addresses and phone numbers in a given text using regex. Use re.findall() with appropriate patterns.', hint: 'Email pattern: r"[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}". Phone pattern: r"\\d{10}"' } },
  'py-w5-s2': { title_en: 'Character Classes and Groups',
    task_en: { description: 'Build a password strength checker using regex. Check for: uppercase, lowercase, digit, special character, minimum 8 chars. Show which criteria are missing.', hint: 'Use separate patterns: re.search(r"[A-Z]", pwd) for uppercase, re.search(r"\\d", pwd) for digit etc.' } },
  'py-w5-s3': { title_en: 're.sub() and re.split() — Modifying Text',
    task_en: { description: 'Build a text sanitizer: replace multiple spaces with one, remove special characters, censor profanity (replace with ***), normalize phone number formats to XXX-XXX-XXXX.', hint: 're.sub(r"\\s+", " ", text) for multiple spaces. re.sub(r"[^a-zA-Z0-9 ]", "", text) removes special chars.' } },
  'py-w5-s4': { title_en: 'Week 5 Project — Form Validator',
    task_en: { description: 'Complete form validator: validate name, email, phone, date of birth, and PIN code using regex. Show specific error messages for each invalid field.', hint: 'Name: r"^[A-Za-z ]{2,50}$". Pincode: r"^[1-9]\\d{5}$". DOB: r"^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$"' } },

  'py-w6-s1': { title_en: 'requests Library — Sending HTTP Requests',
    task_en: { description: 'Use the REST Countries API to display information about any country the user enters. Show: capital, population, area, currencies, languages.', hint: 'requests.get(f"https://restcountries.com/v3.1/name/{country}"). Response is a list — take first element [0].' } },
  'py-w6-s2': { title_en: 'BeautifulSoup — Parsing HTML',
    task_en: { description: 'Scrape books.toscrape.com — get the first 20 books with title, price, and rating. Save to CSV. Find the cheapest and most expensive book.', hint: 'soup.select("article.product_pod") gets books. title = article.find("h3").find("a")["title"]. price = article.select_one(".price_color").text' } },
  'py-w6-s3': { title_en: 'Scraping Ethics and Advanced Techniques',
    task_en: { description: 'Scrape multiple pages from books.toscrape.com (at least 5 pages). Get all books, categorize by rating, show the top 10 highest-rated books.', hint: 'Next page URL pattern: https://books.toscrape.com/catalogue/page-{n}.html. Loop for n in range(1, 6).' } },
  'py-w6-s4': { title_en: 'Week 6 Project — Price Tracker',
    task_en: { description: 'Build a complete price tracker for books.toscrape.com. Scrape all pages, save data to CSV with timestamp, show price distribution and category analysis.', hint: 'Use requests + BeautifulSoup for each page. Track price changes between runs by comparing with saved CSV.' } },

  'py-w7-s1': { title_en: 'What are APIs — REST API Basics',
    task_en: { description: 'Build a world explorer: user enters a country name, fetch data from REST Countries API, display comprehensive info including flag emoji, neighbours, and timezone.', hint: 'Base URL: https://restcountries.com/v3.1/name/{country}. Keys: name.common, capital, population, flags.png, borders, timezones' } },
  'py-w7-s2': { title_en: 'JSON Deep Dive — Handling Complex Data',
    task_en: { description: 'Fetch data from JSONPlaceholder API (/users). For each user display: name, email, company name, city. Then fetch their posts and show post count per user.', hint: 'GET /users returns a list. Each user has: name, email, company.name, address.city. GET /posts?userId={id} for their posts.' } },
  'py-w7-s3': { title_en: 'POST Requests — Sending Data to APIs',
    task_en: { description: 'Use JSONPlaceholder to simulate a blog system: GET all posts, create a new post (POST), update a post (PUT/PATCH), delete a post (DELETE). Show response status codes.', hint: 'Base URL: https://jsonplaceholder.typicode.com. POST to /posts with json={"title":"...", "body":"...", "userId":1}' } },
  'py-w7-s4': { title_en: 'Week 7 Project — News Aggregator',
    task_en: { description: 'Build a news aggregator using Hacker News API. Fetch top/best/new stories. Show title, score, author, comment count. Add search by keyword in title.', hint: 'GET https://hacker-news.firebaseio.com/v0/topstories.json for IDs. Then GET /v0/item/{id}.json for each story.' } },

  'py-w8-s1': { title_en: 'Pandas Basics — Understanding DataFrames',
    task_en: { description: 'Load a student dataset (create it with 50 rows of random data). Analyze: class average, gender comparison, top 5 students, pass percentage, subject-wise averages.', hint: 'df.groupby("gender")["percentage"].mean() for gender comparison. df[df["percentage"]>=60].shape[0] for pass count.' } },
  'py-w8-s2': { title_en: 'Data Cleaning — Fixing Messy Data',
    task_en: { description: 'Create a messy employee dataset (with missing values, duplicates, salary outliers). Clean it: fill missing values, remove duplicates, handle outliers, fix data types, and save the clean version.', hint: 'df["salary"].quantile(0.99) for 99th percentile outlier threshold. df.loc[df["salary"]>threshold, "salary"] = df["salary"].median()' } },
  'py-w8-s3': { title_en: 'Data Visualization — Creating Graphs with Matplotlib',
    task_en: { description: 'Create a sales dashboard with 4 charts in one figure: (1) monthly revenue line chart, (2) product sales bar chart, (3) category pie chart, (4) employee performance scatter plot.', hint: 'plt.subplots(2, 2, figsize=(14,10)) for 4 charts. axes[0,0], axes[0,1] etc for individual plots. fig.suptitle() for overall title.' } },
  'py-w8-s4': { title_en: 'Month 2 Capstone — Sales Data Dashboard',
    task_en: { description: 'Build a complete sales analysis system: generate 12 months of sales data, analyze by product/month/region, create visualizations, export an Excel report.', hint: 'df["revenue"].sum() for total. df.groupby("product")["revenue"].sum().idxmax() for top product.' } },

  'py-w9-s1': { title_en: 'Django Setup and First Project',
    task_en: { description: 'Create a Django project "mystudysite" with a "pages" app. Build 3 pages: home (welcome + your name), about (your info), contact (a contact form in HTML).', hint: 'django-admin startproject → startapp pages → add to INSTALLED_APPS → create views → configure urls.py' } },
  'py-w9-s2': { title_en: 'Django Models — Database Tables with Python',
    task_en: { description: 'Create 3 models for a blog: Category, Post (with FK to Category), Comment (with FK to Post). Run migrations. Use Django shell to create sample data and practice ORM queries.', hint: 'python manage.py makemigrations → migrate → shell. from posts.models import Post → Post.objects.create(...)' } },
  'py-w9-s3': { title_en: 'Django Templates and Admin Panel',
    task_en: { description: 'Build a complete blog with templates: base.html (navbar), list.html (posts as cards with category filter), detail.html (full post + related posts). Register all models in admin and add sample content.', hint: 'templates/ folder at project root. Add to DIRS in settings.py. Use {% block content %}{% endblock %} in base.html.' } },
  'py-w9-s4': { title_en: 'Week 9 Project — Full Blog with Forms',
    task_en: { description: 'Complete the blog with forms: post list with search and category filter, post detail with comment form, new post creation form. Add 5 real posts with content.', hint: 'Q objects for OR search: Q(title__icontains=q) | Q(content__icontains=q). Add related_name="comments" to Comment FK.' } },

  'py-w10-s1': { title_en: 'What is ML — Types and Concepts',
    task_en: { description: 'Build a Titanic-style survival predictor with a synthetic dataset (200 passengers: age, fare, class, gender → survived). Use RandomForestClassifier. Show accuracy, feature importance, and predictions for 5 new passengers.', hint: 'from sklearn.ensemble import RandomForestClassifier. pd.get_dummies() for gender encoding. model.feature_importances_ for importance.' } },
  'py-w10-s2': { title_en: 'Regression — Predicting Numbers',
    task_en: { description: 'Build a house price predictor with: area, bedrooms, bathrooms, age, floors, parking, distance from city, amenities score. Use RandomForestRegressor. Show R² score, top 3 important features, actual vs predicted comparison.', hint: 'rf.feature_importances_ for importance. pd.DataFrame({"Actual": y_test[:10].values, "Predicted": preds[:10].round(1)}) for comparison.' } },
  'py-w10-s3': { title_en: 'Clustering and Model Saving',
    task_en: { description: 'Cluster students by performance: study_hours, sleep, attendance, extracurricular, final_score. Use K=3 clusters. Name each cluster meaningfully. Save the model. Predict segments for 3 new students.', hint: 'Name clusters based on groupby mean profiles. joblib.dump(model, "student_cluster.pkl"). Always scaler.transform() before predict.' } },
  'py-w10-s4': { title_en: 'Week 10 Project — Complete ML Pipeline',
    task_en: { description: 'Build a loan approval predictor with a CLI: accept user inputs (age, income, loan amount, credit score, employment years, loans, assets), predict Approved/Rejected, show probability %, and if rejected explain which factor was the main reason.', hint: 'predict_proba() for probability. For rejection reasons check individual thresholds manually and collect reasons list.' } },

  'py-w11-s1': { title_en: 'File System Automation — Managing Files Automatically',
    task_en: { description: 'Build a duplicate file finder. Scan a folder for files with identical content (use MD5 hashing). Show: how many duplicates found, total space wasted, and offer to delete or move to a "duplicates" folder.', hint: 'import hashlib. def get_hash(file): with open(file,"rb") as f: return hashlib.md5(f.read()).hexdigest(). Store as {hash: [paths]}.' } },
  'py-w11-s2': { title_en: 'Excel Automation — Creating Reports with openpyxl',
    task_en: { description: 'Build an attendance register in Excel: 30 students, 20 school days. Generate random attendance (P/A). Calculate each student\'s percentage, highlight below 75% in red, add a daily summary, include a chart.', hint: 'Nested loop: rows=students, cols=days. cell.fill = PatternFill(fgColor="FF0000") for red. ws2 = wb.create_sheet("Summary") for second sheet.' } },
  'py-w11-s3': { title_en: 'Email Automation — Sending Emails with Python',
    task_en: { description: 'Build a birthday reminder system. Read a CSV (name, email, birthday YYYY-MM-DD). Check which birthdays are today and print a personalized HTML email for each with their name, age they are turning, and a fun message.', hint: 'datetime.now().strftime("%m-%d") for today. Compare with birthday month-day. age = current_year - birth_year.' } },
  'py-w11-s4': { title_en: 'Week 11 Project — Complete Automation Suite',
    task_en: { description: 'Build an AutomationSuite class with methods: organize_files(), generate_excel_report(), email_notifier(). Create a main() function that runs all three in sequence using sample data.', hint: 'Read CSV with csv.DictReader. HTML template with f-strings. main() calls suite.organize_files(), suite.generate_excel_report(), suite.email_notifier().' } },

  'py-w12-s1': { title_en: 'Course Recap — A Three-Month Journey',
    task_en: { description: 'Create a Python learning recap script: build a dictionary of all concepts learned by week, count concepts per month, generate a formatted "Python Journey Report" as a text file.', hint: 'concepts = {"Week 1": ["variables", "loops"], ...}. Count with len(). f-strings for formatted report. Write to file with open("report.txt", "w").' } },
  'py-w12-s2': { title_en: 'Capstone Project — Student Management System 2.0',
    task_en: { description: 'Build EduTrack Pro with all features: JSON database, pandas analytics (3 charts: trends, comparison, attendance), ML grade predictor, Excel report. Test with at least 5 students end-to-end.', hint: 'pandas DataFrame from students dict. plt.subplots(1,3) for 3 charts. at_risk = [s for s in students if avg < 60 or attendance < 75].' } },
  'py-w12-s3': { title_en: 'Capstone Part 2 — Adding ML + Automation',
    task_en: { description: 'Complete EduTrack Pro with: SmartGradePredictor class (train on synthetic data, predict grade), generate_excel_report(), send_alert_email() for at-risk students. Test the full pipeline.', hint: 'Save model with joblib. Keep features consistent between training and prediction. Use same scaler for transform.' } },
  'py-w12-s4': { title_en: 'Course Complete! Certificate and Next Steps',
    task_en: { description: 'FINAL TASK: Complete EduTrack Pro with all features working. Create requirements.txt (pip freeze > requirements.txt) and README.md. Run the celebration script. COURSE COMPLETE!', hint: 'pip freeze > requirements.txt in terminal. README.md: Project name, Features, How to install, How to run. Then celebrate!' } },
};

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