// /**
//  * StudyEarn AI — Python Course Data
//  * ─────────────────────────────────────────────────────────────
//  * 12 weeks, ~4 sections per week = 48 sections
//  * Each section has: theory content, code example, a "try it" task, and quiz questions
//  *
//  * Month 1 (Weeks 1-4):  Absolute Beginner
//  * Month 2 (Weeks 5-8):  Intermediate Concepts
//  * Month 3 (Weeks 9-12): Advanced + Real Projects
//  */

// export const PYTHON_COURSE = {
//   language: 'python',
//   languageName: 'Python Programming',
//   emoji: '🐍',
//   tagline: 'From Zero to Hero in 3 Months',
//   totalWeeks: 12,
//   difficulty: 'Beginner → Advanced',
//   description: 'Python is the world\'s most popular language. Used in AI, web dev, data science, automation — yeh sab kuch Python se hota hai.',

//   weeks: [
//     // ═══════════════════════════════════════════════════════
//     // MONTH 1 — ABSOLUTE BEGINNER
//     // ═══════════════════════════════════════════════════════

//     // WEEK 1
//     {
//       week: 1,
//       title: 'Python Basics — Hello World!',
//       description: 'Pehli baar Python likhoge! Basics se start karte hain.',
//       xpReward: 100,
//       sections: [
//         {
//           id: 'py-w1-s1',
//           title: 'Python kya hai aur setup kaise karein',
//           emoji: '🚀',
//           content: `## Python kya hai?

// Python ek programming language hai jo **bahut easy** hai English jaisi. Google, Netflix, Instagram — sabhi Python use karte hain!

// ### Kyun seekhein Python?
// - Syntax bahut simple hai — almost English ki tarah
// - Ek hi language mein AI, web, games sab bana sakte ho
// - Jobs mein **sabse zyada demand** hai

// ### Python Print karna
// Sabse pehla program hota hai "Hello World!" print karna:

// \`\`\`python
// print("Hello World!")
// print("Mera naam Python hai!")
// print("Main 3 months mein pro ban jaunga! 💪")
// \`\`\`

// **Output:**
// \`\`\`
// Hello World!
// Mera naam Python hai!
// Main 3 months mein pro ban jaunga! 💪
// \`\`\`

// ### print() kya karta hai?
// \`print()\` function screen pe kuch bhi dikhata hai. Jo bhi quotes ke beech likhoge — woh screen pe aayega!

// ### Pro Tip 🔥
// Python mein CASE matter karta hai — \`print\` likhna sahi hai, \`Print\` ya \`PRINT\` likhna galat hai!`,
//           codeExample: `# Yeh mera pehla Python program hai!
// print("Namaste Duniya! 🌍")
// print("Python bahut maza deta hai!")
// print("3 months mein main Python pro ban jaunga!")`,
//           analogy: 'Socho tum ek letter likh rahe ho — print() woh postman hai jo tumhara message duniya tak pahunchata hai. Jo bhi tumne quotes ke andar likha, woh exactly waise hi screen pe aayega — bina kisi badlaav ke.',
//           conceptMap: ["print() function", "Strings vs Numbers", "Comments (#)", "Multiple print statements"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `print("Hello World!")
// print("Mera naam Python hai!")`, note: 'Sabse simple print — text quotes ke andar' },
//             { type: 'realworld', label: 'Real-World', code: `print("Welcome to StudyEarn! 🎓")
// print("Aaj ka score:", 100)
// print("Level:", 3)`, note: 'App mein welcome message aur stats dikhana' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — quotes nahi lagaye
// print(Hello)

// # SAHI
// print("Hello")`, note: 'Quotes bhoolna sabse common mistake hai!' },
//             { type: 'edge', label: 'Edge Case', code: `print()           # blank line print karta hai
// print("Line 1")
// print()           # gap
// print("Line 2")`, note: 'Empty print() blank line deta hai — formatting ke liye useful' }
//           ],
//           task: {
//             description: 'Apna naam, sheher aur favorite food — teeno alag alag lines mein print karo!',
//             expectedOutput: null, // free-form task
//             hint: 'Teen alag print() statements use karo — ek naam ke liye, ek sheher ke liye, ek food ke liye',
//           },
//           quiz: [
//             {
//               q: 'Python mein text print karne ke liye kaunsa function use karte hain?',
//               options: ['display()', 'print()', 'show()', 'write()'],
//               correct: 1,
//               explanation: 'print() function Python ka built-in function hai jo output dikhata hai.',
//               wrong_explanations: {
//                 0: 'display() JavaScript ya CSS mein hota hai, Python mein nahi.',
//                 2: 'show() Python mein exist hi nahi karta.',
//                 3: 'write() file mein likhne ke liye hota hai.'
//               },
//             },
//             {
//               q: 'print("Hello") output kya hoga?',
//               options: ['"Hello"', 'Hello', 'hello', 'HELLO'],
//               correct: 1,
//               explanation: 'print() quotes ke bahar wali text print karta hai — bina quotes ke.',
//               wrong_explanations: {
//                 0: `'"Hello"' matlab quotes ke saath — print() quotes hata ke text dikhata hai.`,
//                 2: 'Python case-sensitive hai lekin print() output case nahi badalta.',
//                 3: 'HELLO uppercase nahi hoga — print() exactly wahi dikhata hai.'
//               },
//             },
//             {
//               q: 'Python mein case sensitive hai?',
//               options: ['Haan', 'Nahi', 'Kabhi kabhi', 'Depend karta hai OS pe'],
//               correct: 0,
//               explanation: 'Haan! Python strictly case-sensitive hai. print aur Print different hain.',
//               wrong_explanations: {
//                 1: 'Nahi! Python strictly case-sensitive hai.',
//                 2: 'Kabhi kabhi nahi — hamesha case-sensitive hai.',
//                 3: 'OS se koi fark nahi padta.'
//               },
//             },
//           ],
//         },
//         {
//           id: 'py-w1-s2',
//           title: 'Variables — Data Store Karna',
//           emoji: '📦',
//           content: `## Variables kya hote hain?

// Variable ek **box** ki tarah hai jisme tum data store karte ho. Jaise tum phone mein contact save karte ho — variable bhi waise hi kaam karta hai!

// ### Variable banana
// \`\`\`python
// naam = "Rahul"
// umar = 18
// sheher = "Mumbai"

// print(naam)
// print(umar)
// print(sheher)
// \`\`\`

// ### Types of Data
// Python mein teen main types hain:

// | Type | Example | Kab use karein |
// |------|---------|----------------|
// | String (str) | \`"Hello"\` | Text ke liye |
// | Integer (int) | \`25\` | Whole numbers |
// | Float | \`9.5\` | Decimal numbers |

// ### Variables ko Mix karna
// \`\`\`python
// naam = "Priya"
// score = 95.5

// print("Student:", naam)
// print("Score:", score)
// print(naam, "ka score hai", score)
// \`\`\`

// **Output:**
// \`\`\`
// Student: Priya
// Score: 95.5
// Priya ka score hai 95.5
// \`\`\`

// ### Rules for Variable Names 📝
// - Sirf letters, numbers, underscore (_) allowed
// - Number se start nahi ho sakta
// - No spaces — \`my_name\` sahi, \`my name\` galat`,
//           codeExample: `# Student info store karna
// student_naam = "Arjun"
// student_class = 10
// percentage = 87.5

// print("Naam:", student_naam)
// print("Class:", student_class)
// print("Percentage:", percentage, "%")`,
//           analogy: 'Socho tumhare phone ka contact list — har contact ka ek naam (variable name) hota hai, aur usmein number stored hota hai (value). Jaise tum kisi ka number update karte ho waise hi variable ki value kisi bhi waqt badal sakte ho.',
//           conceptMap: ["Variable declare karna", "Data types (str, int, float)", "Variable update karna", "Naming rules", "f-strings"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `naam = "Rahul"
// umar = 18
// height = 5.9
// print(naam)
// print(umar)
// print(height)`, note: 'Teen alag types — string, int, float' },
//             { type: 'realworld', label: 'Real-World', code: `player_name = "Rahul"
// score = 0
// level = 1
// lives = 3

// score += 100  # point mila!
// print(f"{player_name} ka score: {score}")`, note: 'Game ke variables — real app mein aise data store hota hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — number ko quotes mein likhna
// age = "18"   # yeh string hai, number nahi!

// # SAHI
// age = 18     # ab yeh integer hai
// print(age + 2)  # 20 aayega`, note: '"18" aur 18 alag hain — ek string hai ek number!' },
//             { type: 'edge', label: 'Edge Case', code: `x = 10
// print(type(x))   # <class int>

// x = "hello"      # same variable, type badal gaya!
// print(type(x))   # <class str>`, note: 'Python dynamically typed hai — ek variable ka type badal sakta hai' }
//           ],
//           task: {
//             description: 'Apni info variables mein store karo: naam, age, favourite_subject, percentage. Phir saari info print karo!',
//             expectedOutput: null,
//             hint: '4 variables banao aur har ek ko print karo. String ke liye quotes, numbers ke liye direct value.',
//           },
//           quiz: [
//             {
//               q: 'Python mein variable kaise banate hain?',
//               options: ['var naam = "Rahul"', 'naam = "Rahul"', 'let naam = "Rahul"', 'string naam = "Rahul"'],
//               correct: 1,
//               explanation: 'Python mein seedha naam = value likhte hain — koi keyword nahi chahiye!',
//               wrong_explanations: {
//                 0: '"Rahul" string hai kyunki quotes ke andar hai.',
//                 2: 'Float mein decimal point hota hai — 18 mein nahi.',
//                 3: 'Boolean sirf True ya False hota hai.'
//               },
//             },
//             {
//               q: 'Kaunsa variable name valid nahi hai?',
//               options: ['my_name', 'name1', '_score', '2score'],
//               correct: 3,
//               explanation: 'Variable name number se start nahi ho sakta. "2score" invalid hai.',
//               wrong_explanations: {
//                 0: 'Galat — = assignment hai, == comparison.',
//                 2: 'Nahi — variable naam mein spaces nahi hote.',
//                 3: 'Galat — type() function se type pata chalta hai.'
//               },
//             },
//             {
//               q: '"Hello" kis data type ka example hai?',
//               options: ['Integer', 'Float', 'String', 'Boolean'],
//               correct: 2,
//               explanation: 'Quotes mein likha text String type hota hai.',
//               wrong_explanations: {
//                 0: 'print(naam + umar) TypeError dega — string + int nahi hota.',
//                 2: 'f-string mein {} ke andar variable name hota hai, quotes nahi.',
//                 3: 'display() Python mein nahi hota.'
//               },
//             },
//           ],
//         },
//         {
//           id: 'py-w1-s3',
//           title: 'User Input lena — input()',
//           emoji: '⌨️',
//           content: `## User se Input kaise lein?

// Abhi tak humne hardcode kiya tha. Ab user se data lete hain!

// ### input() function
// \`\`\`python
// naam = input("Apna naam batao: ")
// print("Hello", naam, "! Welcome to Python! 🎉")
// \`\`\`

// Jab yeh run hoga — program ruk jayega aur user se naam maangega!

// ### Numbers as Input
// input() hamesha **String** return karta hai. Number chahiye toh convert karo:

// \`\`\`python
// umar = input("Tumhari age kya hai? ")
// umar = int(umar)  # String ko Integer mein convert karo

// agla_saal = umar + 1
// print("Agle saal tum", agla_saal, "saal ke hoge!")
// \`\`\`

// ### Shortcut — Ek line mein:
// \`\`\`python
// umar = int(input("Age: "))
// score = float(input("Score: "))
// \`\`\`

// ### Practical Example:
// \`\`\`python
// naam = input("Naam: ")
// sheher = input("Sheher: ")
// school = input("School ka naam: ")

// print("\\n=== Student Profile ===")
// print("Naam:", naam)
// print("Sheher:", sheher)
// print("School:", school)
// \`\`\``,
//           codeExample: `# Simple calculator — user se numbers lo
// num1 = float(input("Pehla number: "))
// num2 = float(input("Doosra number: "))

// total = num1 + num2
// print("Dono ka sum:", total)`,
//           analogy: 'Calculator ki tarah socho — tum numbers daalte ho, operations choose karte ho (+, -, *, /), aur answer milta hai. Python ka operator bhi exactly waise hi kaam karta hai, bas tum code mein likhte ho.',
//           conceptMap: ["Arithmetic operators (+, -, *, /)", "Integer division (//) aur modulus (%)", "Power operator (**)", "String concatenation (+)", "Operator precedence"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `a = 10
// b = 3
// print(a + b)   # 13
// print(a - b)   # 7
// print(a * b)   # 30
// print(a / b)   # 3.333...`, note: 'Char basic operators — simple aur seedha' },
//             { type: 'realworld', label: 'Real-World', code: `marks = 450
// total = 500
// percentage = (marks / total) * 100
// print(f"Tumhara percentage: {percentage:.1f}%")

// bill = 1200
// discount = bill * 0.1  # 10% off
// final = bill - discount
// print(f"Pay karo: ₹{final}")`, note: 'Percentage calculator aur bill discount — daily life math' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — string aur number add karna
// age = 20
// print("Age: " + age)   # TypeError!

// # SAHI — str() se convert karo
// print("Age: " + str(age))  # Age: 20
// # YA easier way:
// print(f"Age: {age}")       # Age: 20`, note: 'String aur number seedha add nahi hote — type conversion zaruri hai' },
//             { type: 'edge', label: 'Edge Case', code: `print(10 / 3)    # 3.3333... (float division)
// print(10 // 3)   # 3 (integer division — decimal cut)
// print(10 % 3)    # 1 (remainder — kitna bacha?)
// print(2 ** 10)   # 1024 (2 ki power 10)`, note: '//, % aur ** — yeh teen operators interviews mein bahut aate hain' }
//           ],
//           task: {
//             description: 'User se naam aur favourite number lo. Phir print karo: "[naam] ka favourite number [number] hai aur uska double [2x number] hai!"',
//             expectedOutput: null,
//             hint: 'input() se naam lo (string), int(input()) se number lo, phir number * 2 calculate karo.',
//           },
//           quiz: [
//             {
//               q: 'input() function kaunsa type return karta hai?',
//               options: ['Integer', 'Float', 'String', 'Boolean'],
//               correct: 2,
//               explanation: 'input() hamesha String return karta hai — chahe user number type kare ya text.',
//             },
//             {
//               q: 'User se integer input lene ka sahi tarika kaunsa hai?',
//               options: ['input(int("Age: "))', 'int(input("Age: "))', 'integer(input("Age: "))', 'input("Age: ", int)'],
//               correct: 1,
//               explanation: 'int() bahar aur input() andar — pehle input() se string aata hai, phir int() convert karta hai.',
//             },
//             {
//               q: 'print("Hello", naam) mein naam kya hai?',
//               options: ['String literal', 'Variable', 'Function', 'Keyword'],
//               correct: 1,
//               explanation: 'Quotes ke bahar likha naam ek variable hai jisme value stored hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w1-s4',
//           title: 'Basic Math — Python Calculator',
//           emoji: '🧮',
//           content: `## Python mein Math Operations

// Python ek powerful calculator hai!

// ### Basic Operators
// \`\`\`python
// a = 20
// b = 6

// print(a + b)   # Addition:       26
// print(a - b)   # Subtraction:    14
// print(a * b)   # Multiplication: 120
// print(a / b)   # Division:       3.333...
// print(a // b)  # Floor Division: 3 (decimal hata do)
// print(a % b)   # Modulus:        2 (remainder)
// print(a ** b)  # Power:          64000000
// \`\`\`

// ### Modulus (%) — Super Useful!
// Remainder nikalta hai — **even/odd check** ke liye use hota hai:
// \`\`\`python
// number = 17
// remainder = number % 2

// if remainder == 0:
//     print(number, "even hai")
// else:
//     print(number, "odd hai")
// \`\`\`

// ### f-strings — Clean Printing
// \`\`\`python
// naam = "Vikram"
// marks = 450
// total = 500
// percentage = (marks / total) * 100

// print(f"{naam} ka result:")
// print(f"Marks: {marks}/{total}")
// print(f"Percentage: {percentage:.2f}%")
// \`\`\`

// Output:
// \`\`\`
// Vikram ka result:
// Marks: 450/500
// Percentage: 90.00%
// \`\`\``,
//           codeExample: `# Percentage calculator
// obtained = float(input("Marks obtained: "))
// total = float(input("Total marks: "))

// percentage = (obtained / total) * 100
// print(f"\\nPercentage: {percentage:.2f}%")

// if percentage >= 90:
//     print("Grade: A+ 🏆 Excellent!")
// elif percentage >= 75:
//     print("Grade: A — Great job!")
// elif percentage >= 60:
//     print("Grade: B — Good effort!")
// else:
//     print("Grade: C — Keep trying! 💪")`,
//           analogy: 'Socho tum apne dost se poochh rahe ho \'Kal school chaloge?\' — agar woh haan bole toh kuch hoga, na bole toh kuch aur. Python ka if-else exactly aisa hi kaam karta hai — ek sawaal, do raste.',
//           conceptMap: ["if statement", "else block", "elif (multiple conditions)", "Comparison operators", "Logical operators (and, or, not)"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `age = 18
// if age >= 18:
//     print("Vote de sakte ho!")
// else:
//     print("Abhi wait karo")`, note: 'Simple if-else — ek condition, do outcomes' },
//             { type: 'realworld', label: 'Real-World', code: `score = 75

// if score >= 90:
//     grade = "A"
// elif score >= 75:
//     grade = "B"
// elif score >= 60:
//     grade = "C"
// else:
//     grade = "F"

// print(f"Tumhara grade: {grade}")`, note: 'Grade calculator — multiple elif conditions ka real use' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — indentation nahi ki
// if True:
// print("hello")  # IndentationError!

// # SAHI — 4 spaces (ya Tab) indent karo
// if True:
//     print("hello")  # sahi hai`, note: 'Indentation Python mein mandatory hai — bhoolna nahi!' },
//             { type: 'edge', label: 'Edge Case', code: `# Ek line mein if-else (ternary)
// age = 20
// status = "Adult" if age >= 18 else "Minor"
// print(status)  # Adult

// # Nested conditions
// x = 15
// if x > 10 and x < 20:
//     print("10 aur 20 ke beech hai")`, note: 'Ternary operator aur compound conditions — concise code likhne ke liye' }
//           ],
//           task: {
//             description: 'Simple EMI calculator banao: user se loan amount, interest rate (%), aur years lo. Monthly EMI calculate karo (formula: EMI = (amount * rate/1200) / (1 - (1 + rate/1200)^(-months))). Ya simple karo: total = amount + (amount * rate * years / 100), monthly = total / (years * 12)',
//             expectedOutput: null,
//             hint: 'Simplified version: total_amount = loan + (loan * rate * years / 100), phir monthly = total_amount / (years * 12)',
//           },
//           quiz: [
//             {
//               q: '17 % 5 ka output kya hoga?',
//               options: ['3', '2', '3.4', '0'],
//               correct: 1,
//               explanation: '17 divide by 5 = 3 remainder 2. Modulus (%) sirf remainder deta hai.',
//             },
//             {
//               q: 'f-string mein variable kaise use karte hain?',
//               options: ['f"Hello {naam}"', 'f"Hello naam"', '"Hello" + naam', 'f("Hello", naam)'],
//               correct: 0,
//               explanation: 'f-string mein curly braces {} ke andar variable naam likhte hain.',
//             },
//             {
//               q: '10 // 3 ka result kya hoga?',
//               options: ['3.33', '3', '4', '1'],
//               correct: 1,
//               explanation: 'Floor division (//) decimal part hata deta hai — 10/3 = 3.33, floor = 3.',
//             },
//           ],
//         },
//       ],
//     },

//     // WEEK 2
//     {
//       week: 2,
//       title: 'Decisions — If/Else Conditions',
//       description: 'Python ko sochna sikhao — conditions aur decision making!',
//       xpReward: 120,
//       sections: [
//         {
//           id: 'py-w2-s1',
//           title: 'if / elif / else — Decision Making',
//           emoji: '🤔',
//           content: `## Conditions — Python ko Sochna Sikhao!

// Real life mein hum conditions check karte hain: "Agar rain ho toh umbrella lao." Python bhi yahi karta hai!

// ### Basic if-else
// \`\`\`python
// temperature = 38

// if temperature > 37.5:
//     print("🤒 Fever hai! Doctor ke paas jao.")
// else:
//     print("✅ Temperature normal hai.")
// \`\`\`

// ### elif — Multiple Conditions
// \`\`\`python
// score = int(input("Score batao (0-100): "))

// if score >= 90:
//     print("🏆 Outstanding! A+ Grade")
// elif score >= 80:
//     print("🎉 Excellent! A Grade")
// elif score >= 70:
//     print("👍 Good! B Grade")
// elif score >= 60:
//     print("📚 Average. C Grade")
// else:
//     print("💪 Mehnat karo. Fail")
// \`\`\`

// ### Comparison Operators
// | Operator | Matlab |
// |----------|--------|
// | == | equal to |
// | != | not equal |
// | > | greater than |
// | < | less than |
// | >= | greater or equal |
// | <= | less or equal |

// ### Logical Operators
// \`\`\`python
// umar = 20
// citizen = True

// # and — dono conditions true honi chahiye
// if umar >= 18 and citizen == True:
//     print("Vote de sakte ho! 🗳️")

// # or — koi bhi ek true ho
// if umar < 13 or umar > 60:
//     print("Special discount!")
// \`\`\``,
//           codeExample: `# Login system banao
// correct_username = "admin"
// correct_password = "python123"

// username = input("Username: ")
// password = input("Password: ")

// if username == correct_username and password == correct_password:
//     print("✅ Login successful! Welcome!")
// elif username == correct_username:
//     print("❌ Wrong password!")
// else:
//     print("❌ Username not found!")`,
//           analogy: 'Socho tum apne 30 dosto ko WhatsApp message bhejne ho — ek ek karke manually bhejoge? Nahi na! Loop bolta hai \'yeh kaam X baar kar\' — computer automatically repeat karta rehta hai.',
//           conceptMap: ["for loop", "range() function", "while loop", "break aur continue", "Nested loops"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `for i in range(5):
//     print(f"Count: {i}")
// # Output: 0, 1, 2, 3, 4`, note: 'range(5) = 0 se 4 tak — 5 baar loop chalta hai' },
//             { type: 'realworld', label: 'Real-World', code: `students = ["Rahul", "Priya", "Amit"]
// for student in students:
//     print(f"Good morning, {student}! 🎓")

// # Attendance bhi
// for i, name in enumerate(students, 1):
//     print(f"{i}. {name}")`, note: 'Student list pe loop — real school management system mein aisa hota hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — infinite loop!
// count = 0
// while count < 5:
//     print(count)
//     # count++ nahi kiya — kabhi khatam nahi hoga!

// # SAHI
// count = 0
// while count < 5:
//     print(count)
//     count += 1  # yeh zaruri hai!`, note: 'While loop mein counter update karna mat bhoolna — warna program hang ho jayega' },
//             { type: 'edge', label: 'Edge Case', code: `for i in range(10):
//     if i == 3:
//         continue  # 3 skip karo
//     if i == 7:
//         break     # 7 pe ruk jao
//     print(i)
// # Output: 0 1 2 4 5 6`, note: 'break = loop band karo, continue = is iteration skip karo' }
//           ],
//           task: {
//             description: 'Movie ticket price calculator: Adult (18+) = ₹200, Senior (60+) = ₹100, Child (under 18) = ₹120. User se age lo aur ticket price print karo. Bonus: Weekend pe ₹50 extra — user se weekday/weekend bhi poocho!',
//             expectedOutput: null,
//             hint: 'Pehle age check karo elif chain se, phir ticket price set karo variable mein, phir weekday/weekend ke liye extra add karo.',
//           },
//           quiz: [
//             {
//               q: 'Python mein "equal to" check karne ka operator kaunsa hai?',
//               options: ['=', '==', '===', 'equals'],
//               correct: 1,
//               explanation: '= assignment ke liye hai, == comparison ke liye. Confusion mat karna!',
//             },
//             {
//               q: '"and" operator kab True return karta hai?',
//               options: ['Koi bhi ek true ho', 'Dono conditions true hon', 'Dono false hon', 'Kabhi nahi'],
//               correct: 1,
//               explanation: '"and" sirf tab True hota hai jab DONO conditions True hon.',
//             },
//             {
//               q: 'if ke baad kya likhte hain Python mein?',
//               options: ['{}', 'then', ':', 'do'],
//               correct: 2,
//               explanation: 'Python mein if condition ke baad colon (:) likhte hain, aur body indented hoti hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w2-s2',
//           title: 'Loops — Kaam Repeat Karna',
//           emoji: '🔄',
//           content: `## Loops — Boring Kaam Machine Se Karao!

// 100 baar "Hello" print karna hai? Loop se ek line mein hoga!

// ### for loop — Count karke repeat karo
// \`\`\`python
// # 5 baar print karo
// for i in range(5):
//     print(f"Loop number: {i}")
// \`\`\`
// Output:
// \`\`\`
// Loop number: 0
// Loop number: 1
// Loop number: 2
// Loop number: 3
// Loop number: 4
// \`\`\`

// ### range() samjho
// \`\`\`python
// range(5)       # 0, 1, 2, 3, 4
// range(1, 6)    # 1, 2, 3, 4, 5
// range(1, 10, 2) # 1, 3, 5, 7, 9 (step=2)
// \`\`\`

// ### while loop — Condition true ho tab tak chalo
// \`\`\`python
// count = 1
// while count <= 5:
//     print(f"Count: {count}")
//     count += 1  # count = count + 1
// \`\`\`

// ### Practical — Tables Print Karo
// \`\`\`python
// num = int(input("Kaunsi table chahiye? "))
// print(f"\\n=== {num} ki Table ===")

// for i in range(1, 11):
//     result = num * i
//     print(f"{num} × {i} = {result}")
// \`\`\`

// ### break aur continue
// \`\`\`python
// # break — loop rok do
// for i in range(10):
//     if i == 5:
//         break  # 5 aate hi stop
//     print(i)  # 0 1 2 3 4

// # continue — ek step skip karo
// for i in range(10):
//     if i % 2 == 0:
//         continue  # even skip karo
//     print(i)  # 1 3 5 7 9
// \`\`\``,
//           codeExample: `# Multiplication table generator
// num = int(input("Table of: "))

// print(f"\\n{'='*25}")
// print(f"   Table of {num}")
// print(f"{'='*25}")

// for i in range(1, 13):
//     print(f"  {num:2d} × {i:2d} = {num*i:3d}")

// print(f"{'='*25}")`,
//           analogy: 'Functions ek recipe ki tarah hain — ek baar recipe likhlo (define karo), phir jitni baar chaaho use karo (call karo). Biryani banana seekha ek baar, phir 100 baar bana sakte ho — code dobara likhne ki zarurat nahi.',
//           conceptMap: ["Function define karna (def)", "Parameters aur arguments", "Return values", "Default parameters", "Scope (local vs global)"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `def greet(name):
//     return f"Hello, {name}!"

// result = greet("Rahul")
// print(result)  # Hello, Rahul!
// print(greet("Priya"))  # Hello, Priya!`, note: 'Simple function — ek baar define, baar baar use' },
//             { type: 'realworld', label: 'Real-World', code: `def calculate_grade(marks, total=100):
//     percent = (marks / total) * 100
//     if percent >= 90: return "A"
//     elif percent >= 75: return "B"
//     elif percent >= 60: return "C"
//     else: return "F"

// print(calculate_grade(85))   # B
// print(calculate_grade(45, 50))  # A (45/50 = 90%)`, note: 'Default parameter total=100 — agar nahi diya toh 100 use hoga automatically' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — return ke baad print karna
// def add(a, b):
//     return a + b
//     print("Done")  # yeh kabhi nahi chalega!

// # GALAT — return bhool gaye
// def multiply(a, b):
//     result = a * b  # sirf calculate kiya, return nahi kiya

// print(multiply(3, 4))  # None aayega!`, note: 'return ke baad code nahi chalta, aur return bhoolne pe None milta hai' },
//             { type: 'edge', label: 'Edge Case', code: `def power(base, exp=2):  # default exp=2
//     return base ** exp

// print(power(3))     # 9 (3^2)
// print(power(3, 3))  # 27 (3^3)

// # Multiple return values
// def min_max(lst):
//     return min(lst), max(lst)

// lo, hi = min_max([3,1,4,1,5,9])
// print(lo, hi)  # 1 9`, note: 'Python mein multiple values return ho sakti hain — tuple ki form mein' }
//           ],
//           task: {
//             description: 'Number guessing game banao! Computer 1-100 ke beech ek secret number rakhe (hardcode karo pehle). User guess kare. Agar zyada ho toh "Kam karo!", kam ho toh "Zyada karo!", sahi ho toh "Sahi! X attempts mein guessa!" — while loop use karo!',
//             expectedOutput: null,
//             hint: 'secret = 42 set karo. attempts counter rakho. while True loop chalao. input lo, compare karo, break karo jab sahi ho.',
//           },
//           quiz: [
//             {
//               q: 'range(2, 10, 3) kya generate karega?',
//               options: ['2, 5, 8', '2, 4, 6, 8, 10', '3, 6, 9', '2, 3, 4...9'],
//               correct: 0,
//               explanation: 'Start=2, Stop=10 (exclusive), Step=3. So: 2, 5, 8.',
//             },
//             {
//               q: 'Loop se bahar nikalne ke liye kaunsa keyword use karte hain?',
//               options: ['exit', 'stop', 'break', 'end'],
//               correct: 2,
//               explanation: '"break" statement loop ko turant rok deta hai.',
//             },
//             {
//               q: 'while loop kab chalta rehta hai?',
//               options: ['Ek baar', 'Hamesha', 'Jab tak condition True ho', 'Jab tak condition False ho'],
//               correct: 2,
//               explanation: 'while loop condition True rehne tak chalta hai — False hote hi ruk jaata hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w2-s3',
//           title: 'Lists — Data Collection Banana',
//           emoji: '📋',
//           content: `## Lists — Multiple Values Ek Jagah!

// Variable mein ek value. List mein **multiple values** — jaise student roster!

// ### List banana
// \`\`\`python
// # Empty list
// students = []

// # Values ke saath
// fruits = ["apple", "mango", "banana", "grapes"]
// marks = [85, 92, 78, 95, 88]
// mixed = ["Rahul", 18, 9.5, True]  # Mix bhi ho sakta hai!
// \`\`\`

// ### List Access — Indexing
// \`\`\`python
// fruits = ["apple", "mango", "banana"]
// #           0         1        2      (index)

// print(fruits[0])   # apple (pehla)
// print(fruits[1])   # mango (doosra)
// print(fruits[-1])  # banana (aakhri)
// \`\`\`

// ### List Operations
// \`\`\`python
// marks = [85, 92, 78]

// marks.append(95)        # End mein add karo → [85,92,78,95]
// marks.insert(0, 100)    # Position 0 pe insert → [100,85,92,78,95]
// marks.remove(78)        # Value remove karo → [100,85,92,95]
// marks.pop()             # Aakhri remove karo
// marks.sort()            # Sort karo
// marks.reverse()         # Ulta karo

// print(len(marks))       # Length
// print(max(marks))       # Maximum value
// print(min(marks))       # Minimum value
// print(sum(marks))       # Total
// \`\`\`

// ### List Loop
// \`\`\`python
// students = ["Rahul", "Priya", "Arjun", "Neha"]

// for student in students:
//     print(f"Hello {student}! 👋")
// \`\`\``,
//           codeExample: `# Student marks manager
// students = []
// marks = []

// n = int(input("Kitne students: "))

// for i in range(n):
//     name = input(f"Student {i+1} naam: ")
//     mark = float(input(f"{name} ke marks: "))
//     students.append(name)
//     marks.append(mark)

// print("\\n=== Results ===")
// for i in range(len(students)):
//     status = "PASS ✅" if marks[i] >= 40 else "FAIL ❌"
//     print(f"{students[i]}: {marks[i]} — {status}")

// print(f"\\nClass Average: {sum(marks)/len(marks):.2f}")
// print(f"Highest: {max(marks)} ({students[marks.index(max(marks))]})")`,
//           analogy: 'List ek dabbi ki tarah hai jisme kai cheezein rakh sakte ho — pehli cheez slot 0 mein, doosri slot 1 mein, aur aage. Bilkul jaise fridge ke drawers — pehla drawer index 0, doosra index 1.',
//           conceptMap: ["List create karna", "Indexing (0 se start)", "List methods (append, remove, sort)", "Slicing", "List comprehension"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `fruits = ["apple", "banana", "mango"]
// print(fruits[0])   # apple
// print(fruits[-1])  # mango (last element)
// fruits.append("guava")
// print(len(fruits))  # 4`, note: 'Index 0 se start, -1 matlab last element' },
//             { type: 'realworld', label: 'Real-World', code: `shopping_cart = []
// shopping_cart.append("Shirt")
// shopping_cart.append("Jeans")
// shopping_cart.append("Shoes")

// for item in shopping_cart:
//     print(f"✓ {item}")

// print(f"Total items: {len(shopping_cart)}")`, note: 'E-commerce cart — real apps mein lists aise hi use hoti hain' },
//             { type: 'mistake', label: 'Common Mistake', code: `items = ["a", "b", "c"]

// # GALAT — index 3 exist nahi karta (0,1,2 hain)
// print(items[3])  # IndexError!

// # SAHI — last item
// print(items[2])   # c
// print(items[-1])  # c (easier way)`, note: 'IndexError sabse common error hai — list 0 se shuru hoti hai, len() se nahi' },
//             { type: 'edge', label: 'Edge Case', code: `nums = [1, 2, 3, 4, 5]
// print(nums[1:4])   # [2, 3, 4] slicing
// print(nums[::-1])  # [5, 4, 3, 2, 1] reverse

// # List comprehension — compact way
// squares = [x**2 for x in range(5)]
// print(squares)  # [0, 1, 4, 9, 16]`, note: 'Slicing aur list comprehension — yeh Python ki special powers hain' }
//           ],
//           analogy: 'Socho ek dabba jisme numbered slots hain — slot 0, 1, 2, 3... Tum kisi bhi slot mein directly jaake cheez rakh ya nikal sakte ho. Python list bilkul aisi hai.',
//           conceptMap: ["List create karna", "Indexing (0 se start)", "List methods (append, remove, sort)", "Slicing", "List comprehension"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `fruits = ["apple", "banana", "mango"]
// print(fruits[0])    # apple
// print(fruits[-1])   # mango
// fruits.append("guava")
// print(len(fruits))  # 4`, note: 'Index 0 se start — pehla element [0] pe' },
//             { type: 'realworld', label: 'Real-World', code: `cart = []
// cart.append("Shirt")
// cart.append("Jeans")
// cart.sort()
// for item in cart:
//     print(f"checkmark {item}")
// print(f"Total: {len(cart)} items")`, note: 'Shopping cart — real e-commerce apps lists aise use karti hain' },
//             { type: 'mistake', label: 'Common Mistake', code: `items = ["a", "b", "c"]
// print(items[3])   # IndexError!
// # SAHI
// print(items[2])   # c
// print(items[-1])  # c`, note: '3 items mein indices 0,1,2 hote hain — 3 nahi!' },
//             { type: 'edge', label: 'Edge Case', code: `nums = [1, 2, 3, 4, 5]
// print(nums[1:4])    # [2, 3, 4]
// print(nums[::-1])   # [5, 4, 3, 2, 1]
// squares = [x**2 for x in range(5)]
// print(squares)  # [0, 1, 4, 9, 16]`, note: 'Slicing aur list comprehension — Python ki most-used features' }
//           ],
//           task: {
//             description: '5 numbers user se lo list mein. Phir print karo: original list, sorted list, reversed list, sum, average, max aur min.',
//             expectedOutput: null,
//             hint: 'Loop mein 5 baar input() se numbers lo aur append() karo. Phir sort(), reverse() use karo. sum()/len() se average nikalo.',
//           },
//           quiz: [
//             {
//               q: 'list = [10, 20, 30] mein list[-1] kya return karega?',
//               options: ['10', '20', '30', 'Error'],
//               correct: 2,
//               explanation: 'Negative index list ke end se count karta hai. -1 matlab aakhri element = 30.',
//             },
//             {
//               q: 'List mein nayi value end mein add karne ke liye?',
//               options: ['list.add()', 'list.push()', 'list.append()', 'list.insert()'],
//               correct: 2,
//               explanation: 'append() end mein add karta hai. insert() specific position pe.',
//             },
//             {
//               q: 'len([1, 2, 3, 4, 5]) kya return karega?',
//               options: ['4', '5', '6', '0'],
//               correct: 1,
//               explanation: 'len() list ki length return karta hai — total elements ki count = 5.',
//             },
//           ],
//         },
//         {
//           id: 'py-w2-s4',
//           title: 'Functions — Reusable Code Banana',
//           emoji: '⚙️',
//           content: `## Functions — Code Ek Baar Likho, Baar Baar Use Karo!

// Function ek recipe ki tarah hai — ek baar likho, jab chahiye tab use karo!

// ### Function define karna
// \`\`\`python
// def greet():
//     print("Namaste! 🙏")
//     print("Welcome to Python!")

// # Function call karo
// greet()
// greet()
// greet()  # 3 baar same code run hoga!
// \`\`\`

// ### Parameters — Input dena Function ko
// \`\`\`python
// def greet(naam):
//     print(f"Namaste {naam}! 🙏")
//     print(f"Python seekhna kaisa lag raha hai, {naam}?")

// greet("Rahul")
// greet("Priya")
// greet("Arjun")
// \`\`\`

// ### Return — Function se Value Wapas Lena
// \`\`\`python
// def add(a, b):
//     result = a + b
//     return result

// total = add(10, 20)
// print(f"10 + 20 = {total}")  # 30

// # Directly use bhi kar sakte ho
// print(add(5, 7))  # 12
// \`\`\`

// ### Default Parameters
// \`\`\`python
// def greet(naam, language="Python"):
//     print(f"Hello {naam}! {language} seekh rahe ho? 🔥")

// greet("Rahul")              # Hello Rahul! Python seekh rahe ho?
// greet("Priya", "JavaScript") # Hello Priya! JavaScript seekh rahe ho?
// \`\`\`

// ### Practical Example — Calculator Function
// \`\`\`python
// def calculate(a, b, operation):
//     if operation == "+": return a + b
//     elif operation == "-": return a - b
//     elif operation == "*": return a * b
//     elif operation == "/": return a / b if b != 0 else "Error: Divide by zero!"
//     else: return "Invalid operation"

// print(calculate(10, 5, "+"))  # 15
// print(calculate(20, 4, "/"))  # 5.0
// \`\`\``,
//           codeExample: `# BMI Calculator function
// def calculate_bmi(weight_kg, height_m):
//     bmi = weight_kg / (height_m ** 2)
//     return round(bmi, 2)

// def get_category(bmi):
//     if bmi < 18.5:
//         return "Underweight 😟"
//     elif bmi < 25:
//         return "Normal ✅"
//     elif bmi < 30:
//         return "Overweight ⚠️"
//     else:
//         return "Obese 🔴"

// weight = float(input("Weight (kg): "))
// height = float(input("Height (meters): "))

// bmi = calculate_bmi(weight, height)
// category = get_category(bmi)

// print(f"\\nBMI: {bmi}")
// print(f"Category: {category}")`,
//           analogy: 'Dictionary ek actual dictionary ki tarah hai — alag dict mein word dhundho, meaning milti hai. Python dict mein \'word\' = key aur \'meaning\' = value. Sirf word se directly meaning milti hai — poori book nahi padni.',
//           conceptMap: ["Dictionary create karna", "Key-value pairs", "Dict methods (get, keys, values)", "Nested dictionaries", "Dict comprehension"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `student = {
//     "name": "Rahul",
//     "age": 20,
//     "grade": "A"
// }
// print(student["name"])   # Rahul
// print(student.get("age"))  # 20`, note: 'Key se directly value access — O(1) speed' },
//             { type: 'realworld', label: 'Real-World', code: `user_profile = {
//     "username": "rahul_22",
//     "xp": 1250,
//     "level": 5,
//     "badges": ["First Code", "7-Day Streak"],
// }

// user_profile["xp"] += 50  # XP badha
// print(f"Level {user_profile['level']}: {user_profile['xp']} XP")`, note: 'User profile data — exactly aise hi apps backend mein store karta hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `d = {"name": "Rahul"}

// # GALAT — exist nahi karta
// print(d["age"])  # KeyError!

// # SAHI — .get() use karo
// print(d.get("age"))         # None (no error)
// print(d.get("age", 0))     # 0 (default value)`, note: '.get() use karo direct [] ki jagah — KeyError se bachoge' },
//             { type: 'edge', label: 'Edge Case', code: `# Nested dict — dict ke andar dict
// school = {
//     "class_10": {"students": 40, "teacher": "Mr. Sharma"},
//     "class_11": {"students": 35, "teacher": "Ms. Gupta"},
// }
// print(school["class_10"]["teacher"])  # Mr. Sharma

// # All keys aur values
// for key, val in school.items():
//     print(key, "->", val["students"], "students")`, note: 'Nested dicts real databases ki tarah kaam karte hain' }
//           ],
//           analogy: 'Dictionary ek actual dictionary ki tarah — word (key) se seedha meaning (value) milti hai. Poori book nahi padni — seedha word dhundho, meaning lo.',
//           conceptMap: ["Dictionary create karna", "Key-value pairs", "Dict methods (get, keys, values)", "Nested dictionaries", "Dict comprehension"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `student = {
//     "name": "Rahul",
//     "age": 20,
//     "grade": "A"
// }
// print(student["name"])
// print(student.get("marks"))  # None, no KeyError`, note: '.get() safer hai direct [] se' },
//             { type: 'realworld', label: 'Real-World', code: `profile = {
//     "username": "rahul_22",
//     "xp": 1250,
//     "level": 5,
//     "badges": ["First Code"],
// }
// profile["xp"] += 50
// profile["badges"].append("Quiz Master")
// print(f"Level {profile['level']}: {profile['xp']} XP")`, note: 'User profile — apps backend mein exactly aisa data hota hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `d = {"name": "Rahul"}
// print(d["age"])      # KeyError!
// # SAHI
// print(d.get("age"))       # None
// print(d.get("age", 0))   # 0 default`, note: '.get() use karo — KeyError se bachne ka ek hi tarika' },
//             { type: 'edge', label: 'Edge Case', code: `school = {
//     "class_10": {"students": 40, "teacher": "Mr. Sharma"},
// }
// print(school["class_10"]["teacher"])
// for cls, info in school.items():
//     print(f"{cls}: {info['students']} students")`, note: 'Nested dicts — real JSON APIs bilkul aisa structure use karte hain' }
//           ],
//           task: {
//             description: 'Temperature converter functions banao: celsius_to_fahrenheit(c), fahrenheit_to_celsius(f), celsius_to_kelvin(c). Formulas: F = (C × 9/5) + 32, K = C + 273.15. User se temperature aur unit lo, phir dono conversions print karo!',
//             expectedOutput: null,
//             hint: 'Teen alag functions banao return ke saath. Main code mein user se input lo aur sahi function call karo.',
//           },
//           quiz: [
//             {
//               q: 'Function define karne ka keyword kya hai?',
//               options: ['function', 'func', 'def', 'define'],
//               correct: 2,
//               explanation: 'Python mein "def" keyword se function define karte hain.',
//             },
//             {
//               q: 'Function se value return karne ke liye?',
//               options: ['send', 'output', 'return', 'give'],
//               correct: 2,
//               explanation: '"return" statement function se value wapas bhejta hai caller ko.',
//             },
//             {
//               q: 'Default parameter kya karta hai?',
//               options: ['Parameter mandatory banata hai', 'Parameter optional banata hai', 'Parameter delete karta hai', 'Error deta hai'],
//               correct: 1,
//               explanation: 'Default value dene se parameter optional ho jaata hai — call karte waqt nahi dena padta.',
//             },
//           ],
//         },
//       ],
//     },

//     // WEEK 3
//     {
//       week: 3,
//       title: 'Strings & Dictionaries',
//       description: 'Text manipulation aur key-value data structures seekhein',
//       xpReward: 130,
//       sections: [
//         {
//           id: 'py-w3-s1',
//           title: 'String Methods — Text Manipulation',
//           emoji: '✂️',
//           content: `## Strings — Text ke Saath Khelna!

// Python mein strings bahut powerful hain. Unhe manipulate karna bahut asaan hai.

// ### Important String Methods
// \`\`\`python
// text = "  Hello Python World!  "

// print(text.strip())      # "Hello Python World!" — spaces hata do
// print(text.upper())      # "  HELLO PYTHON WORLD!  "
// print(text.lower())      # "  hello python world!  "
// print(text.title())      # "  Hello Python World!  "

// sentence = "Python is amazing"
// print(sentence.replace("amazing", "awesome"))
// print(sentence.split(" "))  # ['Python', 'is', 'amazing']
// print(len(sentence))         # 18
// print(sentence.count("n"))   # 2
// print(sentence.startswith("Python"))  # True
// print(sentence.find("is"))   # 7 (index)
// \`\`\`

// ### String Slicing
// \`\`\`python
// name = "StudyEarn"
// #       012345678

// print(name[0:5])    # Study (0 to 4)
// print(name[5:])     # Earn  (5 to end)
// print(name[:5])     # Study (start to 4)
// print(name[-4:])    # Earn  (last 4)
// print(name[::-1])   # nraEyduS (reverse!)
// \`\`\`

// ### f-strings Advanced
// \`\`\`python
// naam = "rahul kumar"
// marks = 456
// total = 500

// # Clean formatting
// print(f"{naam.title()}")         # Rahul Kumar
// print(f"{marks}/{total}")        # 456/500
// print(f"{marks/total*100:.1f}%") # 91.2%
// print(f"{'='*30}")               # ====...==== (30 equal signs)
// \`\`\``,
//           codeExample: `# Username validator
// def validate_username(username):
//     username = username.strip()
    
//     if len(username) < 3:
//         return False, "Too short! Minimum 3 characters."
//     if len(username) > 20:
//         return False, "Too long! Maximum 20 characters."
//     if not username.replace("_", "").isalnum():
//         return False, "Only letters, numbers, underscore allowed!"
//     if username[0].isdigit():
//         return False, "Cannot start with a number!"
    
//     return True, f"Username '{username}' is valid! ✅"

// user = input("Enter username: ")
// valid, message = validate_username(user)
// print(message)`,
//           analogy: 'Socho ek blueprint — ek hi blueprint se hazaron ghar bana sakte ho. Python mein class woh blueprint hai, aur har ghar ek object. Blueprint ek baar banao, objects jitne chaaho banao.',
//           conceptMap: ["Class define karna", "__init__ method", "Attributes aur methods", "Object create karna", "self keyword"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `class Dog:
//     def __init__(self, name, breed):
//         self.name = name
//         self.breed = breed
    
//     def bark(self):
//         return f"{self.name} says: Woof!"

// dog1 = Dog("Tommy", "Labrador")
// print(dog1.bark())  # Tommy says: Woof!`, note: 'Class = blueprint, dog1 = object. self matlab "yeh specific object"' },
//             { type: 'realworld', label: 'Real-World', code: `class BankAccount:
//     def __init__(self, owner, balance=0):
//         self.owner = owner
//         self.balance = balance
    
//     def deposit(self, amount):
//         self.balance += amount
//         return f"Deposited ₹{amount}. Balance: ₹{self.balance}"
    
//     def withdraw(self, amount):
//         if amount > self.balance:
//             return "Insufficient funds!"
//         self.balance -= amount
//         return f"₹{amount} withdrawn."

// acc = BankAccount("Rahul", 5000)
// print(acc.deposit(2000))
// print(acc.withdraw(10000))`, note: 'Real bank account — OOP se data aur logic ek saath rakho' },
//             { type: 'mistake', label: 'Common Mistake', code: `class Car:
//     def __init__(self, brand):
//         self.brand = brand
    
//     def info():
//         # GALAT — self nahi likha!
//         print(self.brand)  # NameError

// # SAHI
//     def info(self):  # self hamesha pehla parameter
//         print(self.brand)`, note: 'self bhoolna sabse common OOP mistake hai — har method mein pehla parameter self hona chahiye' },
//             { type: 'edge', label: 'Edge Case', code: `class Counter:
//     count = 0  # class variable — sabhi objects share karte hain
    
//     def __init__(self):
//         Counter.count += 1
//         self.id = Counter.count  # instance variable — har object ka alag

// c1 = Counter()
// c2 = Counter()
// c3 = Counter()
// print(Counter.count)  # 3
// print(c1.id, c2.id, c3.id)  # 1 2 3`, note: 'Class variable vs instance variable — ek shared hota hai, ek har object ka apna' }
//           ],
//           analogy: 'Socho ek blueprint — ek hi blueprint se hazaron ghar bana sakte ho. Python mein class blueprint hai, object us blueprint se bana ghar. Ek baar banao, baar baar use karo.',
//           conceptMap: ["Class define karna", "__init__ method", "Attributes aur methods", "Object create karna", "self keyword"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `class Dog:
//     def __init__(self, name):
//         self.name = name
//     def bark(self):
//         return f"{self.name} says: Woof!"

// dog1 = Dog("Tommy")
// print(dog1.bark())`, note: 'Class = blueprint, dog1 = object, self = yeh specific object' },
//             { type: 'realworld', label: 'Real-World', code: `class BankAccount:
//     def __init__(self, owner, balance=0):
//         self.owner = owner
//         self.balance = balance
//     def deposit(self, amount):
//         self.balance += amount
//         return f"Balance: {self.balance}"
//     def withdraw(self, amount):
//         if amount > self.balance:
//             return "Insufficient funds!"
//         self.balance -= amount
//         return f"Done"

// acc = BankAccount("Rahul", 5000)
// print(acc.deposit(2000))`, note: 'Real bank logic — OOP se data aur logic ek jagah' },
//             { type: 'mistake', label: 'Common Mistake', code: `class Car:
//     def __init__(self, brand):
//         self.brand = brand
//     def info():        # GALAT - self nahi!
//         print(self.brand)
//     def info(self):    # SAHI
//         print(self.brand)`, note: 'self bhoolna sabse common OOP mistake' },
//             { type: 'edge', label: 'Edge Case', code: `class Counter:
//     count = 0
//     def __init__(self):
//         Counter.count += 1
//         self.id = Counter.count
// c1 = Counter()
// c2 = Counter()
// print(Counter.count)   # 2
// print(c1.id, c2.id)    # 1 2`, note: 'Class variable shared, instance variable alag alag' }
//           ],
//           task: {
//             description: 'Password strength checker banao. User se password lo. Check karo: length (8+), uppercase letter hai, lowercase hai, digit hai, special char (@#$! etc) hai. Har check ke liye score +1. "Weak/Medium/Strong/Very Strong" print karo.',
//             expectedOutput: null,
//             hint: 'any(c.isupper() for c in password) uppercase check karta hai. any(c.isdigit() for c in password) digit check karta hai.',
//           },
//           quiz: [
//             {
//               q: '"hello world".title() kya return karega?',
//               options: ['HELLO WORLD', 'Hello World', 'hello world', 'Hello world'],
//               correct: 1,
//               explanation: 'title() har word ka pehla letter uppercase karta hai.',
//             },
//             {
//               q: '"python"[::-1] kya hoga?',
//               options: ['python', 'nohtyp', 'error', 'p'],
//               correct: 1,
//               explanation: '[::-1] string ko reverse karta hai — step -1 matlab ulta chalna.',
//             },
//             {
//               q: '"Hello Python".split() kya return karega?',
//               options: ['"Hello", "Python"', "['Hello', 'Python']", 'Hello Python', 'Error'],
//               correct: 1,
//               explanation: 'split() string ko spaces par split karke list return karta hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w3-s2',
//           title: 'Dictionaries — Key-Value Data',
//           emoji: '📚',
//           content: `## Dictionaries — Real World Data Store Karna!

// Dictionary ek actual dictionary jaisa hai — word: definition (key: value)!

// ### Dictionary banana
// \`\`\`python
// # Student record
// student = {
//     "naam": "Rahul Kumar",
//     "age": 18,
//     "marks": 92.5,
//     "city": "Delhi",
//     "hobbies": ["cricket", "coding", "music"]
// }

// print(student["naam"])    # Rahul Kumar
// print(student["marks"])   # 92.5
// print(student["hobbies"]) # ['cricket', 'coding', 'music']
// \`\`\`

// ### Dictionary Methods
// \`\`\`python
// person = {"naam": "Priya", "age": 20}

// # Add/Update
// person["email"] = "priya@gmail.com"
// person["age"] = 21  # Update existing

// # Access safely
// city = person.get("city", "Unknown")  # KeyError nahi aayega!

// # Delete
// del person["email"]
// removed = person.pop("age")

// # Iterate
// for key, value in person.items():
//     print(f"{key}: {value}")

// print(person.keys())    # all keys
// print(person.values())  # all values
// \`\`\`

// ### Practical — Phone Book
// \`\`\`python
// contacts = {
//     "Rahul": "9876543210",
//     "Priya": "9123456789",
//     "Arjun": "9000000000"
// }

// name = input("Kaun ka number chahiye? ")

// if name in contacts:
//     print(f"{name} ka number: {contacts[name]}")
// else:
//     print(f"{name} contacts mein nahi hai!")
// \`\`\``,
//           codeExample: `# Student grade book
// grade_book = {}

// n = int(input("Students count: "))
// for i in range(n):
//     name = input(f"Student {i+1}: ")
//     marks = float(input(f"Marks: "))
//     grade_book[name] = marks

// print("\\n=== Grade Report ===")
// for name, marks in grade_book.items():
//     if marks >= 90: grade = "A+"
//     elif marks >= 80: grade = "A"
//     elif marks >= 70: grade = "B"
//     elif marks >= 60: grade = "C"
//     else: grade = "F"
//     print(f"{name}: {marks} → Grade {grade}")`,
//           analogy: 'Inheritance matlab \'baap ka maal beta ko milega\'. Parent class mein jo kuch bhi hai — properties aur methods — woh automatically child class mein aa jaata hai. Fir child apni extra cheezein bhi add kar sakta hai.',
//           conceptMap: ["Inheritance (class Child(Parent))", "super() function", "Method overriding", "Multiple inheritance", "isinstance() check"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `class Animal:
//     def __init__(self, name):
//         self.name = name
    
//     def speak(self):
//         return f"{self.name} makes a sound"

// class Dog(Animal):  # Animal se inherit kiya
//     def speak(self):  # override kiya
//         return f"{self.name} says Woof!"

// d = Dog("Tommy")
// print(d.speak())  # Tommy says Woof!`, note: 'Dog ne Animal ka __init__ liya, aur speak() override kiya' },
//             { type: 'realworld', label: 'Real-World', code: `class User:
//     def __init__(self, name, email):
//         self.name = name
//         self.email = email
    
//     def greet(self):
//         return f"Hello, {self.name}!"

// class PremiumUser(User):
//     def __init__(self, name, email, plan):
//         super().__init__(name, email)  # parent init call
//         self.plan = plan
    
//     def greet(self):
//         return f"Welcome back, {self.name}! ({self.plan} plan)"

// pu = PremiumUser("Rahul", "r@r.com", "Pro")
// print(pu.greet())`, note: 'SaaS apps mein exactly aisa User → PremiumUser hierarchy hoti hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `class Parent:
//     def __init__(self, x):
//         self.x = x

// class Child(Parent):
//     def __init__(self, x, y):
//         # GALAT — super() call nahi kiya!
//         self.y = y  # self.x nahi milega!

//     # SAHI
//     def __init__(self, x, y):
//         super().__init__(x)  # parent ka init call karo
//         self.y = y`, note: 'super().__init__() bhoolna — parent ke attributes set nahi honge' },
//             { type: 'edge', label: 'Edge Case', code: `class A:
//     def hello(self):
//         return "A"

// class B(A):
//     def hello(self):
//         return "B + " + super().hello()

// class C(B):
//     def hello(self):
//         return "C + " + super().hello()

// print(C().hello())  # C + B + A
// # MRO: Method Resolution Order`, note: 'MRO — Python left to right, depth first chain follow karta hai' }
//           ],
//           analogy: 'Inheritance matlab baap ka maal beta ko milega. Parent class ke properties aur methods child ko automatically milte hain. Child apni extra cheezein bhi add kar sakta hai.',
//           conceptMap: ["Inheritance class Child(Parent)", "super() function", "Method overriding", "isinstance() check", "MRO"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `class Animal:
//     def __init__(self, name):
//         self.name = name
//     def speak(self):
//         return f"{self.name} makes a sound"

// class Dog(Animal):
//     def speak(self):
//         return f"{self.name} says Woof!"

// d = Dog("Tommy")
// print(d.speak())`, note: 'Dog ne Animal ka __init__ inherit kiya, speak() override kiya' },
//             { type: 'realworld', label: 'Real-World', code: `class User:
//     def __init__(self, name, email):
//         self.name = name
//         self.email = email
//     def greet(self):
//         return f"Hello, {self.name}!"

// class PremiumUser(User):
//     def __init__(self, name, email, plan):
//         super().__init__(name, email)
//         self.plan = plan
//     def greet(self):
//         return f"Welcome, {self.name}! ({self.plan})"

// pu = PremiumUser("Rahul", "r@r.com", "Pro")
// print(pu.greet())`, note: 'SaaS apps mein User to PremiumUser hierarchy exactly aisi hoti hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `class Child(Parent):
//     def __init__(self, x, y):
//         # GALAT
//         self.y = y   # self.x nahi milega!
//         # SAHI
//         super().__init__(x)
//         self.y = y`, note: 'super().__init__() bhoolna — parent attributes set nahi honge' },
//             { type: 'edge', label: 'Edge Case', code: `class A:
//     def hello(self): return "A"
// class B(A):
//     def hello(self): return "B+" + super().hello()
// class C(B):
//     def hello(self): return "C+" + super().hello()
// print(C().hello())  # C+B+A`, note: 'MRO — Method Resolution Order — Python chain follow karta hai' }
//           ],
//           task: {
//             description: 'Mini shopping cart banao using dictionary. Items aur price hardcode karo (5 items). User item name aur quantity lo, cart mein add karo. "done" type karne par total bill print karo itemwise aur grand total.',
//             expectedOutput: null,
//             hint: 'menu = {"apple": 50, "mango": 80} type dictionary banao. cart = {} empty cart rakho. Loop mein input lo, cart mein add karo.',
//           },
//           quiz: [
//             {
//               q: 'Dictionary mein value access karne ka sahi tarika?',
//               options: ['dict.key', 'dict[key]', 'dict->key', 'dict.get[key]'],
//               correct: 1,
//               explanation: 'dict[key] se value access karte hain. dict.get(key) bhi use kar sakte hain safely.',
//             },
//             {
//               q: '"key" in dict kya check karta hai?',
//               options: ['Value exist karta hai ya nahi', 'Key exist karta hai ya nahi', 'Dictionary empty hai ya nahi', 'Key ka type'],
//               correct: 1,
//               explanation: '"in" operator dictionary mein key ki existence check karta hai.',
//             },
//             {
//               q: 'dict.items() kya return karta hai?',
//               options: ['Sirf keys', 'Sirf values', 'Key-value pairs', 'Dictionary length'],
//               correct: 2,
//               explanation: 'items() (key, value) tuples ki list return karta hai — for loop mein use hota hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w3-s3',
//           title: 'File Handling — Data Save Karna',
//           emoji: '💾',
//           content: `## Files — Data Permanently Save Karna!

// Program band hone par data save rehna chahiye? Files use karo!

// ### File Write karna
// \`\`\`python
// # 'w' = write mode (naya file ya overwrite)
// with open("notes.txt", "w") as file:
//     file.write("Meri pehli Python file!\\n")
//     file.write("Python bahut maza deta hai!\\n")

// print("File save ho gayi! ✅")
// \`\`\`

// ### File Read karna
// \`\`\`python
// with open("notes.txt", "r") as file:
//     content = file.read()   # Sab kuch ek saath
//     print(content)

// # Line by line
// with open("notes.txt", "r") as file:
//     for line in file:
//         print(line.strip())
// \`\`\`

// ### Append — File mein Add karna
// \`\`\`python
// # 'a' = append mode (existing file ke end mein add karo)
// with open("notes.txt", "a") as file:
//     file.write("Naya note add kiya!\\n")
// \`\`\`

// ### Practical — Student Database
// \`\`\`python
// import json  # JSON format ke liye

// def save_students(students):
//     with open("students.json", "w") as f:
//         json.dump(students, f, indent=2)

// def load_students():
//     try:
//         with open("students.json", "r") as f:
//             return json.load(f)
//     except FileNotFoundError:
//         return {}

// students = load_students()
// naam = input("New student naam: ")
// marks = float(input("Marks: "))
// students[naam] = marks
// save_students(students)
// print(f"{naam} saved! Total students: {len(students)}")
// \`\`\``,
//           codeExample: `# Simple diary app
// import datetime

// def add_entry(text):
//     date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
//     with open("diary.txt", "a") as f:
//         f.write(f"\\n[{date}]\\n{text}\\n{'─'*40}")
//     print("Entry saved! ✅")

// def read_diary():
//     try:
//         with open("diary.txt", "r") as f:
//             print(f.read())
//     except FileNotFoundError:
//         print("Diary empty hai! Kuch likho pehle.")

// while True:
//     choice = input("\\n1. Write  2. Read  3. Exit: ")
//     if choice == "1":
//         entry = input("Aaj kya hua: ")
//         add_entry(entry)
//     elif choice == "2":
//         read_diary()
//     elif choice == "3":
//         break`,
//           analogy: 'File handling ek notebook ki tarah hai — pehle open karo, phir likho ya padho, phir band karo. Notebook band karna mat bhoolna — warna data corrupt ho sakta hai!',
//           conceptMap: ["File open karna (open())", "Read modes (r, w, a)", "with statement", "Read aur write operations", "Exception handling with files"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `# File mein likhna
// with open("notes.txt", "w") as f:
//     f.write("Hello File!\\n")
//     f.write("Python maza deta hai!")

// # File padhna
// with open("notes.txt", "r") as f:
//     content = f.read()
//     print(content)`, note: 'with open() best practice hai — automatically file close ho jaati hai' },
//             { type: 'realworld', label: 'Real-World', code: `import json

// # User data save karna
// user_data = {"name": "Rahul", "score": 1250, "level": 5}

// with open("user.json", "w") as f:
//     json.dump(user_data, f, indent=2)

// # Wapas load karna
// with open("user.json", "r") as f:
//     loaded = json.load(f)
//     print(f"Welcome back, {loaded['name']}! Score: {loaded['score']}")`, note: 'JSON file = game save system. Apps data aise hi persist karte hain' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — with ke bina
// f = open("data.txt", "w")
// f.write("some data")
// # agar error aaye toh file kabhi close nahi hogi!

// # SAHI — with use karo
// with open("data.txt", "w") as f:
//     f.write("some data")
// # automatically close — chahe error aaye ya na aaye`, note: 'with statement use karo — file automatically aur safely close hogi' },
//             { type: 'edge', label: 'Edge Case', code: `# Line by line padhna (badi files ke liye)
// with open("bigfile.txt", "r") as f:
//     for line in f:  # ek ek line, memory efficient
//         print(line.strip())

// # Append mode — existing data preserve
// with open("log.txt", "a") as f:
//     f.write("New entry\\n")  # purana data nahi jayega`, note: '"a" mode = append, "w" mode = overwrite. "a" se purana data safe rehta hai' }
//           ],
//           analogy: 'File handling ek notebook ki tarah — open karo, likho ya padho, band karo. Notebook band karna mat bhoolna — warna data safe nahi rahega!',
//           conceptMap: ["open() function", "File modes r w a", "with statement", "read aur write operations", "JSON files"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `with open("notes.txt", "w") as f:
//     f.write("Hello File!\\n")
//     f.write("Python rocks!")
// with open("notes.txt", "r") as f:
//     print(f.read())`, note: 'with open() best practice — auto close hoti hai' },
//             { type: 'realworld', label: 'Real-World', code: `import json
// user = {"name": "Rahul", "score": 1250}
// with open("user.json", "w") as f:
//     json.dump(user, f, indent=2)
// with open("user.json", "r") as f:
//     loaded = json.load(f)
//     print(f"Welcome, {loaded['name']}!")`, note: 'JSON file = game save system — apps data aise persist karte hain' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT
// f = open("data.txt", "w")
// f.write("data")
// # error aaye toh file close nahi hogi!
// # SAHI
// with open("data.txt", "w") as f:
//     f.write("data")`, note: 'with use karo hamesha — auto close guaranteed' },
//             { type: 'edge', label: 'Edge Case', code: `with open("big.txt") as f:
//     for line in f:          # memory efficient
//         print(line.strip())

// with open("log.txt", "a") as f:
//     f.write("entry\\n")     # append, no overwrite`, note: '"a" append karta hai, "w" overwrite — dhyan se choose karo' }
//           ],
//           task: {
//             description: 'To-do list app banao with file storage. User tasks add kar sake, list dekh sake, task complete mark kar sake (❌ se ✅), aur program band karke dobara open karne par tasks remain karein!',
//             expectedOutput: null,
//             hint: 'tasks ko list mein rakho aur JSON se save/load karo. Har task ek dict ho: {"task": "...", "done": False}.',
//           },
//           quiz: [
//             {
//               q: 'File append mode ke liye kaunsa character use karte hain?',
//               options: ["'w'", "'r'", "'a'", "'x'"],
//               correct: 2,
//               explanation: "'a' append mode hai — existing file ke end mein add karta hai bina delete kiye.",
//             },
//             {
//               q: '"with open()" ka faida kya hai?',
//               options: ['Fast hota hai', 'File automatically close ho jaata hai', 'Large files handle karta hai', 'Errors nahi aate'],
//               correct: 1,
//               explanation: '"with" block ke baad file automatically close ho jaata hai — manually close nahi karna padta.',
//             },
//             {
//               q: 'JSON file save karne ke liye kaunsa function?',
//               options: ['json.write()', 'json.save()', 'json.dump()', 'json.store()'],
//               correct: 2,
//               explanation: 'json.dump() Python object ko JSON format mein file mein likhta hai.',
//             },
//           ],
//         },
//         {
//           id: 'py-w3-s4',
//           title: 'Error Handling — Crash se Bacho!',
//           emoji: '🛡️',
//           content: `## Error Handling — Professional Code Likhna!

// Program crash ho toh user ko achha nahi lagta. Errors handle karo gracefully!

// ### try-except
// \`\`\`python
// try:
//     num = int(input("Number: "))
//     result = 100 / num
//     print(f"100 / {num} = {result}")
// except ValueError:
//     print("❌ Invalid! Number enter karo text nahi.")
// except ZeroDivisionError:
//     print("❌ Zero se divide nahi kar sakte!")
// except Exception as e:
//     print(f"❌ Unexpected error: {e}")
// \`\`\`

// ### else aur finally
// \`\`\`python
// try:
//     file = open("data.txt", "r")
//     content = file.read()
// except FileNotFoundError:
//     print("❌ File nahi mili!")
// else:
//     print("✅ File successfully read!")
//     print(content)
// finally:
//     print("(Yeh hamesha run hoga)")
//     # Cleanup code yahan
// \`\`\`

// ### Custom Errors Raise Karna
// \`\`\`python
// def check_age(age):
//     if age < 0:
//         raise ValueError("Age negative nahi ho sakti!")
//     if age > 150:
//         raise ValueError("Itna bada age? Sure ho?")
//     return f"Age {age} valid hai ✅"

// try:
//     print(check_age(-5))
// except ValueError as e:
//     print(f"Error: {e}")
// \`\`\`

// ### Robust Input Loop
// \`\`\`python
// while True:
//     try:
//         age = int(input("Age batao: "))
//         if age < 0 or age > 120:
//             raise ValueError("Invalid range")
//         break  # Valid input mila, loop tod do
//     except ValueError:
//         print("❌ Valid age batao (0-120). Try again!")

// print(f"Age recorded: {age} ✅")
// \`\`\``,
//           codeExample: `# Safe calculator with error handling
// def safe_calculator():
//     while True:
//         try:
//             a = float(input("First number: "))
//             op = input("Operator (+, -, *, /): ").strip()
//             b = float(input("Second number: "))
            
//             if op == "+": result = a + b
//             elif op == "-": result = a - b
//             elif op == "*": result = a * b
//             elif op == "/":
//                 if b == 0:
//                     raise ZeroDivisionError("Zero se divide nahi!")
//                 result = a / b
//             else:
//                 raise ValueError(f"Invalid operator: {op}")
            
//             print(f"Result: {a} {op} {b} = {result:.4f} ✅")
            
//         except ValueError as e:
//             print(f"❌ Invalid input: {e}")
//         except ZeroDivisionError as e:
//             print(f"❌ Math error: {e}")
        
//         again = input("\\nAur calculate? (y/n): ")
//         if again.lower() != 'y':
//             break

// safe_calculator()`,
//           analogy: 'Exception handling ek safety net ki tarah hai — jaise trapeze artists ke neeche net hoti hai. Program toh chal raha hai, lekin agar kuch galat ho jaaye, toh crash nahi hoga — net pakad legi.',
//           conceptMap: ["try-except block", "Common exceptions (ValueError, TypeError, KeyError)", "finally block", "Custom exceptions", "raise statement"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `try:
//     num = int(input("Number daalo: "))
//     result = 10 / num
//     print(f"Result: {result}")
// except ValueError:
//     print("Yeh number nahi hai!")
// except ZeroDivisionError:
//     print("Zero se divide nahi kar sakte!")`, note: 'Alag alag exceptions ke liye alag except blocks — precise error handling' },
//             { type: 'realworld', label: 'Real-World', code: `import json

// def load_user(filename):
//     try:
//         with open(filename) as f:
//             return json.load(f)
//     except FileNotFoundError:
//         print("User file nahi mili — new user banao")
//         return {"name": "Guest", "score": 0}
//     except json.JSONDecodeError:
//         print("Corrupt file — resetting...")
//         return {"name": "Guest", "score": 0}

// user = load_user("user.json")
// print(f"Hello, {user['name']}!")`, note: 'Production apps mein har file operation mein exception handling hoti hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — sab kuch ek saath pakadna
// try:
//     risky_code()
// except Exception:  # bahut broad!
//     pass  # silently fail — debug impossible!

// # SAHI — specific exceptions pakdo
// try:
//     risky_code()
// except ValueError as e:
//     print(f"Value error: {e}")
// except FileNotFoundError as e:
//     print(f"File missing: {e}")`, note: 'bare except ya except Exception bad practice hai — specific errors pakdo' },
//             { type: 'edge', label: 'Edge Case', code: `def divide(a, b):
//     try:
//         return a / b
//     except ZeroDivisionError:
//         raise ValueError("b zero nahi ho sakta!") from None
//     finally:
//         print("Division attempt kiya")  # hamesha chalta hai

// try:
//     print(divide(10, 0))
// except ValueError as e:
//     print(f"Error: {e}")`, note: 'finally hamesha chalta hai — cleanup code ke liye. raise se custom error throw karo' }
//           ],
//           analogy: 'Exception handling ek safety net — jaise trapeze artists ke neeche net hoti hai. Program crash nahi hoga, error gracefully handle hogi.',
//           conceptMap: ["try-except block", "Common exceptions", "finally block", "Custom exceptions", "raise statement"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `try:
//     num = int(input("Number: "))
//     print(10 / num)
// except ValueError:
//     print("Number nahi hai!")
// except ZeroDivisionError:
//     print("Zero se divide nahi!")`, note: 'Specific exceptions pakado — precise handling' },
//             { type: 'realworld', label: 'Real-World', code: `import json
// def load_user(f):
//     try:
//         with open(f) as fp:
//             return json.load(fp)
//     except FileNotFoundError:
//         return {"name": "Guest"}
//     except json.JSONDecodeError:
//         return {"name": "Guest"}
// print(load_user("user.json"))`, note: 'Production code mein file ops mein hamesha exception handling hoti hai' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — too broad
// try:
//     code()
// except Exception:
//     pass   # silently fail!
// # SAHI
// try:
//     code()
// except ValueError as e:
//     print(f"Error: {e}")`, note: 'bare except avoid karo — specific pakdo warna debug impossible' },
//             { type: 'edge', label: 'Edge Case', code: `def divide(a, b):
//     try:
//         return a / b
//     except ZeroDivisionError:
//         raise ValueError("b zero nahi") from None
//     finally:
//         print("Attempt done")  # always runs
// try:
//     print(divide(10, 0))
// except ValueError as e:
//     print(e)`, note: 'finally = cleanup, raise = custom error throw karo' }
//           ],
//           task: {
//             description: 'Robust age calculator banao. User se DOB lo (YYYY-MM-DD format). Calculate karo exact age in years, months, days. Handle karo: wrong format, future date, invalid month/day. Use datetime module!',
//             expectedOutput: null,
//             hint: 'from datetime import datetime. datetime.strptime(dob, "%Y-%m-%d") se parse karo. today - birth_date se timedelta milega. try-except mein ValueError catch karo.',
//           },
//           quiz: [
//             {
//               q: 'try-except mein "finally" block kab run hota hai?',
//               options: ['Sirf success pe', 'Sirf error pe', 'Hamesha — success aur error dono pe', 'Kabhi nahi'],
//               correct: 2,
//               explanation: '"finally" block hamesha run hota hai — chahe error aaye ya na aaye. Cleanup ke liye perfect!',
//             },
//             {
//               q: 'ZeroDivisionError kab aata hai?',
//               options: ['Invalid string', 'Zero se divide karne par', 'File na milne par', 'Memory full hone par'],
//               correct: 1,
//               explanation: 'Kisi bhi number ko 0 se divide karne par ZeroDivisionError aata hai.',
//             },
//             {
//               q: '"raise" keyword kya karta hai?',
//               options: ['Error ignore karta hai', 'Manually error throw karta hai', 'Program restart karta hai', 'Error log karta hai'],
//               correct: 1,
//               explanation: '"raise" se hum apni marzi ka error manually throw kar sakte hain.',
//             },
//           ],
//         },
//       ],
//     },

//     // WEEK 4 (abbreviated for space — same pattern continues)
//     {
//       week: 4,
//       title: 'OOP — Object Oriented Programming',
//       description: 'Classes aur objects se real-world problems model karna',
//       xpReward: 150,
//       sections: [
//         {
//           id: 'py-w4-s1',
//           title: 'Classes aur Objects — OOP Basics',
//           emoji: '🏗️',
//           content: `## OOP — Real World Ko Code Mein Laao!

// OOP matlab har cheez ek "object" hai — jaise real life mein!

// ### Class banana
// \`\`\`python
// class Student:
//     def __init__(self, naam, marks):
//         self.naam = naam      # Instance variable
//         self.marks = marks
//         self.grade = self._calculate_grade()
    
//     def _calculate_grade(self):
//         if self.marks >= 90: return "A+"
//         elif self.marks >= 80: return "A"
//         elif self.marks >= 70: return "B"
//         else: return "C"
    
//     def introduce(self):
//         print(f"Main {self.naam} hun. Mera grade {self.grade} hai!")
    
//     def study(self, hours):
//         self.marks = min(100, self.marks + hours * 2)
//         print(f"{self.naam} ne {hours} ghante padha. New marks: {self.marks}")

// # Object banana
// s1 = Student("Rahul", 75)
// s2 = Student("Priya", 92)

// s1.introduce()   # Main Rahul hun. Mera grade B hai!
// s2.introduce()   # Main Priya hun. Mera grade A+ hai!

// s1.study(5)      # Rahul ne 5 ghante padha. New marks: 85
// \`\`\`

// ### Inheritance — Properties Inherit Karna
// \`\`\`python
// class Person:
//     def __init__(self, naam, age):
//         self.naam = naam
//         self.age = age
    
//     def greet(self):
//         print(f"Namaste! Main {self.naam} hun, {self.age} saal ka.")

// class Teacher(Person):   # Person se inherit kar raha hai
//     def __init__(self, naam, age, subject):
//         super().__init__(naam, age)  # Parent ka __init__ call karo
//         self.subject = subject
    
//     def teach(self):
//         print(f"{self.naam} {self.subject} padha rahe hain!")

// t = Teacher("Mr. Sharma", 35, "Python")
// t.greet()   # Inherited method!
// t.teach()
// \`\`\``,
//           codeExample: `# Bank Account simulation
// class BankAccount:
//     def __init__(self, owner, initial_balance=0):
//         self.owner = owner
//         self.__balance = initial_balance  # Private!
//         self.transactions = []
    
//     def deposit(self, amount):
//         if amount <= 0:
//             print("❌ Invalid amount!")
//             return
//         self.__balance += amount
//         self.transactions.append(f"+{amount}")
//         print(f"✅ ₹{amount} deposited. Balance: ₹{self.__balance}")
    
//     def withdraw(self, amount):
//         if amount > self.__balance:
//             print("❌ Insufficient balance!")
//             return
//         self.__balance -= amount
//         self.transactions.append(f"-{amount}")
//         print(f"✅ ₹{amount} withdrawn. Balance: ₹{self.__balance}")
    
//     def get_balance(self):
//         return self.__balance

// account = BankAccount("Rahul", 1000)
// account.deposit(500)
// account.withdraw(200)
// print(f"Current balance: ₹{account.get_balance()}")`,
//           analogy: 'Decorator ek gift wrapper ki tarah hai — gift (function) same rehta hai andar, bas upar se extra wrapping (extra functionality) add ho jaati hai. Gift kholta hai toh original gift milta hai, lekin presentation better ho gayi.',
//           conceptMap: ["Decorator syntax (@)", "First-class functions", "Closure concept", "functools.wraps", "Practical decorators (timing, logging)"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `def my_decorator(func):
//     def wrapper():
//         print("Pehle yeh")
//         func()
//         print("Baad mein yeh")
//     return wrapper

// @my_decorator
// def say_hello():
//     print("Hello!")

// say_hello()
// # Pehle yeh
// # Hello!
// # Baad mein yeh`, note: '@my_decorator = say_hello = my_decorator(say_hello) — shorthand hai' },
//             { type: 'realworld', label: 'Real-World', code: `import time

// def timer(func):
//     def wrapper(*args, **kwargs):
//         start = time.time()
//         result = func(*args, **kwargs)
//         end = time.time()
//         print(f"{func.__name__} laga: {end-start:.4f}s")
//         return result
//     return wrapper

// @timer
// def slow_search(n):
//     return sum(range(n))

// print(slow_search(1000000))`, note: 'Performance profiling decorator — real apps mein slow functions detect karne ke liye' },
//             { type: 'mistake', label: 'Common Mistake', code: `from functools import wraps

// def decorator(func):
//     # GALAT — wraps nahi lagaya
//     def wrapper(*args, **kwargs):
//         return func(*args, **kwargs)
//     return wrapper  # func ka naam kho gaya!

//     # SAHI
//     @wraps(func)  # original function info preserve karo
//     def wrapper(*args, **kwargs):
//         return func(*args, **kwargs)
//     return wrapper`, note: '@wraps(func) lagana zaruri hai — warna debugging mein function ka naam kho jaata hai' },
//             { type: 'edge', label: 'Edge Case', code: `def repeat(n):
//     def decorator(func):
//         def wrapper(*args, **kwargs):
//             for _ in range(n):
//                 func(*args, **kwargs)
//         return wrapper
//     return decorator

// @repeat(3)  # parameter wala decorator!
// def greet(name):
//     print(f"Hello, {name}!")

// greet("Rahul")  # 3 baar print hoga`, note: 'Decorator factory — decorator ko bhi parameters de sakte ho' }
//           ],
//           analogy: 'Decorator ek gift wrapper — gift same rehta hai andar, packaging better ho jaati hai. Function same kaam karta hai, decorator upar se extra functionality deta hai.',
//           conceptMap: ["Decorator syntax @", "First-class functions", "Closure", "functools.wraps", "Timer aur logging decorators"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `def my_decorator(func):
//     def wrapper():
//         print("Pehle")
//         func()
//         print("Baad mein")
//     return wrapper

// @my_decorator
// def say_hello():
//     print("Hello!")

// say_hello()`, note: '@decorator = say_hello = my_decorator(say_hello) shorthand' },
//             { type: 'realworld', label: 'Real-World', code: `import time
// def timer(func):
//     def wrapper(*args, **kwargs):
//         start = time.time()
//         result = func(*args, **kwargs)
//         print(f"{func.__name__}: {time.time()-start:.4f}s")
//         return result
//     return wrapper

// @timer
// def slow_fn(n):
//     return sum(range(n))
// print(slow_fn(1000000))`, note: 'Performance timer — slow functions detect karne ke liye' },
//             { type: 'mistake', label: 'Common Mistake', code: `from functools import wraps
// def decorator(func):
//     # GALAT — no wraps
//     def wrapper(*a, **kw):
//         return func(*a, **kw)
//     return wrapper

//     # SAHI
//     @wraps(func)
//     def wrapper(*a, **kw):
//         return func(*a, **kw)
//     return wrapper`, note: '@wraps(func) lagao — function name preserve hoga' },
//             { type: 'edge', label: 'Edge Case', code: `def repeat(n):
//     def decorator(func):
//         def wrapper(*a, **kw):
//             for _ in range(n): func(*a, **kw)
//         return wrapper
//     return decorator

// @repeat(3)
// def greet(name):
//     print(f"Hello, {name}!")
// greet("Rahul")  # 3 baar`, note: 'Parametrized decorator — decorator ko bhi arguments de sakte ho' }
//           ],
//           task: {
//             description: 'Library system banao with classes: Book (title, author, copies), Library (name, books list). Methods: add_book(), borrow_book(title), return_book(title), available_books(). Proper error handling karo if book not found ya copies=0.',
//             expectedOutput: null,
//             hint: 'Do classes banao. Library mein books list rakho. borrow_book mein copies check karo pehle.',
//           },
//           quiz: [
//             {
//               q: '__init__ method kab call hota hai?',
//               options: ['Manually call karna padta hai', 'Object create hone par automatically', 'Program start hone par', 'import karne par'],
//               correct: 1,
//               explanation: '__init__ constructor hai — object create (instantiate) karte waqt automatically call hota hai.',
//             },
//             {
//               q: '"self" parameter kya represent karta hai?',
//               options: ['Class itself', 'Current object (instance)', 'Parent class', 'Module'],
//               correct: 1,
//               explanation: '"self" current object instance ko refer karta hai — har instance method mein pehla parameter hota hai.',
//             },
//             {
//               q: 'Inheritance ke liye kaunsa keyword?',
//               options: ['extends', 'inherits', 'class Child(Parent):', 'import Parent'],
//               correct: 2,
//               explanation: 'class ChildClass(ParentClass): — parenthesis mein parent class ka naam likhte hain.',
//             },
//           ],
//         },
//         {
//           id: 'py-w4-s2', title: 'Modules & Libraries — Python ki Power!', emoji: '📦',
//           content: `## Modules — Python ki Superpower!

// Puri duniya ne Python ke liye tools banaye hain — use karo!

// ### Built-in Modules
// \`\`\`python
// import math
// import random
// import datetime
// import os

// print(math.pi)            # 3.14159...
// print(math.sqrt(16))      # 4.0
// print(math.factorial(5))  # 120

// print(random.randint(1, 6))     # Dice roll!
// print(random.choice(["A", "B", "C"]))  # Random element

// now = datetime.datetime.now()
// print(now.strftime("%d %B %Y, %H:%M"))
// \`\`\`

// ### pip — External Libraries Install Karna
// Terminal mein:
// \`\`\`bash
// pip install requests  # Website se data fetch karo
// pip install pandas    # Data analysis
// pip install pygame    # Games banana
// \`\`\`

// ### requests — Website ka Data Fetch Karo
// \`\`\`python
// import requests

// response = requests.get("https://api.github.com/users/python")
// data = response.json()
// print("GitHub Python org followers:", data["followers"])
// \`\`\`

// ### Apna Module banana
// \`\`\`python
// # calculator.py file mein likho:
// def add(a, b): return a + b
// def subtract(a, b): return a - b
// PI = 3.14159

// # main.py mein use karo:
// import calculator
// print(calculator.add(5, 3))
// print(calculator.PI)
// \`\`\``,
//           codeExample: `import random
// import datetime

// # Fun Quiz Game
// questions = [
//     {"q": "Python inventor ka naam?", "a": "guido"},
//     {"q": "Python ka latest major version?", "a": "3"},
//     {"q": "print ka alternative function?", "a": "write"},
// ]

// random.shuffle(questions)
// score = 0

// print("🐍 Python Quiz Time!\\n")
// for i, item in enumerate(questions[:3]):
//     answer = input(f"Q{i+1}: {item['q']}\\n> ").lower().strip()
//     if answer == item['a']:
//         print("✅ Correct! +10 XP\\n")
//         score += 10
//     else:
//         print(f"❌ Galat. Answer: {item['a']}\\n")

// now = datetime.datetime.now().strftime("%H:%M")
// print(f"Score: {score}/30 at {now}")`,
//           analogy: 'Python ki standard library ek bhari puri dukaan ki tarah hai — tum kuch bhi kharidna chahte ho, woh wahan milega. import karna matlab \'dukaan se ek shelf apne ghar la lena\'.',
//           conceptMap: ["import statement", "Standard library (os, sys, math, random)", "pip aur third-party packages", "Virtual environments", "__name__ == \"__main__\""],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `import math
// import random

// print(math.pi)           # 3.14159...
// print(math.sqrt(144))    # 12.0
// print(random.randint(1, 100))  # random number
// print(random.choice(["Rock", "Paper", "Scissors"]))`, note: 'math aur random — sab already installed hain, bas import karo' },
//             { type: 'realworld', label: 'Real-World', code: `import os
// import json
// from datetime import datetime

// # Current directory files list
// files = os.listdir(".")
// print("Files:", files)

// # Current time
// now = datetime.now()
// print(f"Aaj: {now.strftime('%d/%m/%Y %H:%M')}")

// # Config file banana
// config = {"version": "1.0", "debug": False}
// with open("config.json", "w") as f:
//     json.dump(config, f)`, note: 'Real app ka typical setup — os, datetime, json sab ek saath' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — wildcard import
// from math import *  # sab kuch import — conflicts ho sakte hain!

// # GALAT — circular import
// # file_a.py: import file_b
// # file_b.py: import file_a  # infinite loop!

// # SAHI — specific import
// from math import sqrt, pi
// from datetime import datetime, timedelta`, note: 'from module import * avoid karo — namespace pollute hota hai aur conflicts aate hain' },
//             { type: 'edge', label: 'Edge Case', code: `# __name__ trick — module vs script
// def main():
//     print("Main function chal raha hai")

// if __name__ == "__main__":
//     main()
// # Directly run karo — chalega
// # import karo — nahi chalega

// # Alias import
// import numpy as np  # long name ko short karo
// import pandas as pd`, note: '__name__ == "__main__" professional Python code mein hamesha hota hai' }
//           ],
//           analogy: 'Python standard library ek bhari puri dukaan — import karna matlab shelf apne ghar lana. Sab kuch pehle se available, bas import karo.',
//           conceptMap: ["import statement", "Standard library os math random", "pip packages", "Virtual environments", "__name__ check"],
//           examples: [
//             { type: 'basic', label: 'Basic Example', code: `import math
// import random
// print(math.pi)
// print(math.sqrt(144))
// print(random.randint(1, 100))
// print(random.choice(["Rock","Paper","Scissors"]))`, note: 'math aur random already installed — sirf import karo' },
//             { type: 'realworld', label: 'Real-World', code: `import os
// from datetime import datetime
// import json

// print(os.listdir("."))
// now = datetime.now()
// print(now.strftime("%d/%m/%Y %H:%M"))
// with open("config.json", "w") as f:
//     json.dump({"v": "1.0"}, f)`, note: 'Real app setup — os, datetime, json sab ek saath' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT
// from math import *   # namespace pollute!
// # GALAT — circular
// # a.py import b, b.py import a

// # SAHI
// from math import sqrt, pi
// from datetime import datetime`, note: 'wildcard import avoid karo — conflicts aate hain' },
//             { type: 'edge', label: 'Edge Case', code: `def main():
//     print("Script chal raha!")

// if __name__ == "__main__":
//     main()
// # Direct run = chalega
// # import = nahi chalega`, note: '__name__ == "__main__" professional Python ka standard pattern' }
//           ],
//           task: {
//             description: 'Weather simulator banao using random module — fake weather app! Random temperature (15-45°C), random weather (sunny/cloudy/rainy/stormy), random humidity (30-90%). 7-day forecast print karo with emojis. datetime se actual dates use karo!',
//             expectedOutput: null,
//             hint: 'weather_types = ["☀️ Sunny", "⛅ Cloudy", "🌧️ Rainy", "⛈️ Stormy"]. random.choice() se select karo. datetime.timedelta(days=i) se dates calculate karo.',
//           },
//           quiz: [
//             {
//               q: 'Python mein module import kaise karte hain?',
//               options: ['include module', 'import module', 'require module', 'use module'],
//               correct: 1,
//               explanation: '"import module_name" se module import karte hain Python mein.',
//             },
//             {
//               q: 'random.randint(1, 10) kya return karta hai?',
//               options: ['1 se 9 random', '1 se 10 random (both inclusive)', '0 se 10', '1 se 10 (exclusive)'],
//               correct: 1,
//               explanation: 'randint BOTH endpoints include karta hai — 1 aur 10 dono possible hain.',
//             },
//             {
//               q: 'External library install karne ka command?',
//               options: ['python install', 'pip install', 'npm install', 'get install'],
//               correct: 1,
//               explanation: 'pip Python ka package manager hai — "pip install package_name" se install karte hain.',
//             },
//           ],
//         },
//         {
//           id: 'py-w4-s3', title: 'Month 1 Project — Student Management System', emoji: '🏆',
//           content: `## Month 1 Final Project — Student Management System!

// Sabhi concepts use karke ek complete system banao!

// ### Features jo banane hain:
// 1. Students add karna (naam, marks, subjects)
// 2. List dekhna (all students)
// 3. Search karna by name
// 4. Marks update karna
// 5. Remove student
// 6. Statistics (average, highest, lowest)
// 7. File mein save/load (data persist karna)
// 8. Grade calculate karna automatically

// ### Architecture:
// \`\`\`
// StudentManagementSystem
// ├── Student class (naam, marks, grade property)
// ├── Database class (load/save JSON)
// └── UI (menu-driven input)
// \`\`\`

// ### Start Here:
// \`\`\`python
// import json

// class Student:
//     def __init__(self, naam, marks):
//         self.naam = naam
//         self.marks = marks
    
//     @property
//     def grade(self):
//         if self.marks >= 90: return "A+"
//         elif self.marks >= 80: return "A"
//         elif self.marks >= 70: return "B"
//         elif self.marks >= 60: return "C"
//         else: return "F"
    
//     def to_dict(self):
//         return {"naam": self.naam, "marks": self.marks}

// # Aage likho...
// \`\`\`

// **Is project ko complete karo aur submit karo — Certificate mile ga aur 200 XP!** 🎓`,
//           codeExample: `# Month 1 Project Starter Code
// import json
// import os

// class Student:
//     def __init__(self, naam, marks):
//         self.naam = naam
//         self.marks = float(marks)
    
//     @property  
//     def grade(self):
//         if self.marks >= 90: return "A+"
//         elif self.marks >= 80: return "A"
//         elif self.marks >= 70: return "B"
//         elif self.marks >= 60: return "C"
//         else: return "F"
    
//     def to_dict(self):
//         return {"naam": self.naam, "marks": self.marks}

// class StudentDB:
//     def __init__(self, filename="students.json"):
//         self.filename = filename
//         self.students = self.load()
    
//     def load(self):
//         try:
//             with open(self.filename) as f:
//                 data = json.load(f)
//                 return [Student(s["naam"], s["marks"]) for s in data]
//         except: return []
    
//     def save(self):
//         with open(self.filename, "w") as f:
//             json.dump([s.to_dict() for s in self.students], f, indent=2)
    
//     def add(self, naam, marks):
//         self.students.append(Student(naam, marks))
//         self.save()
    
//     def find(self, naam):
//         return next((s for s in self.students if s.naam.lower() == naam.lower()), None)

// # Main menu — tum complete karo!
// db = StudentDB()
// print("Student Management System")`,
//           analogy: 'Month 1 ka project ek exam ki tarah hai — jo seekha woh apply karo. Variables, loops, functions, OOP, file handling — sab ek saath use honga. Yeh woh moment hai jab real learning hoti hai.',
//           conceptMap: ["Project planning", "Data structures choose karna", "Function design", "File persistence", "CLI interface banana"],
//           examples: [
//             { type: 'basic', label: 'Core Structure', code: `students = []  # list of dicts

// def add_student(name, marks):
//     students.append({
//         "name": name,
//         "marks": marks,
//         "grade": get_grade(marks)
//     })

// def get_grade(marks):
//     if marks >= 90: return "A"
//     elif marks >= 75: return "B"
//     elif marks >= 60: return "C"
//     else: return "F"`, note: 'Core data structure aur functions — yahan se shuru karo' },
//             { type: 'realworld', label: 'Complete Flow', code: `import json

// def save_data(filename="students.json"):
//     with open(filename, "w") as f:
//         json.dump(students, f, indent=2)

// def load_data(filename="students.json"):
//     try:
//         with open(filename) as f:
//             return json.load(f)
//     except FileNotFoundError:
//         return []

// def display_all():
//     for s in sorted(students, key=lambda x: x["marks"], reverse=True):
//         print(f"{s['name']:20} | {s['marks']}% | {s['grade']}")`, note: 'Save/load + sorted display — yeh sab features ek real app mein hote hain' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT — sab kuch ek function mein
// def do_everything():
//     # 200 lines ka monster function
//     pass

// # SAHI — single responsibility
// def add_student(name, marks): ...
// def delete_student(name): ...
// def search_student(name): ...
// def display_report(): ...
// def save_data(): ...`, note: 'Ek function = ek kaam. Chhote focused functions = clean, testable code' },
//             { type: 'edge', label: 'Bonus Feature', code: `# Statistics add karo
// def get_stats():
//     if not students:
//         return "No students yet!"
//     marks_list = [s["marks"] for s in students]
//     return {
//         "total": len(students),
//         "average": sum(marks_list) / len(marks_list),
//         "highest": max(marks_list),
//         "lowest": min(marks_list),
//         "pass_rate": len([m for m in marks_list if m >= 60]) / len(marks_list) * 100
//     }

// stats = get_stats()
// print(f"Class average: {stats['average']:.1f}%")`, note: 'Statistics feature — list comprehension + math sab ek saath use ho raha hai' }
//           ],
//           analogy: 'Month 1 project ek exam — jo seekha sab apply karo. Variables, loops, functions, OOP, files sab ek saath. Yahi real learning hai.',
//           conceptMap: ["Project planning", "Data structures", "Function design", "File persistence", "CLI interface"],
//           examples: [
//             { type: 'basic', label: 'Core Structure', code: `students = []

// def add_student(name, marks):
//     students.append({
//         "name": name, "marks": marks,
//         "grade": get_grade(marks)
//     })

// def get_grade(m):
//     if m >= 90: return "A"
//     elif m >= 75: return "B"
//     elif m >= 60: return "C"
//     else: return "F"`, note: 'Core structure — yahan se shuru karo project' },
//             { type: 'realworld', label: 'Complete Flow', code: `import json
// def save_data():
//     with open("students.json","w") as f:
//         json.dump(students, f, indent=2)
// def load_data():
//     try:
//         with open("students.json") as f:
//             return json.load(f)
//     except FileNotFoundError:
//         return []
// def display_all():
//     for s in sorted(students,key=lambda x:x["marks"],reverse=True):
//         print(f"{s['name']:20} | {s['marks']}%")`, note: 'Save, load, sorted display — real app features' },
//             { type: 'mistake', label: 'Common Mistake', code: `# GALAT
// def do_everything():
//     # 200 lines
//     pass
// # SAHI
// def add_student(n,m): ...
// def delete_student(n): ...
// def display_report(): ...`, note: 'Ek function = ek kaam. Single responsibility principle' },
//             { type: 'edge', label: 'Bonus Feature', code: `def get_stats():
//     if not students: return {}
//     m = [s["marks"] for s in students]
//     return {
//         "avg": sum(m)/len(m),
//         "top": max(m),
//         "pass": len([x for x in m if x>=60])/len(m)*100
//     }
// stats = get_stats()
// if stats:
//     print(f"Avg: {stats['avg']:.1f}%")`, note: 'Stats feature — list comprehension + math ek saath' }
//           ],
//           task: {
//             description: 'Upar diya starter code use karke PURA system complete karo — saare 8 features implement karo. Ek menu-driven CLI app banana hai jo properly kaam kare!',
//             expectedOutput: null,
//             hint: 'While True loop mein menu print karo. Input se choice lo. Har option ke liye alag function banao.',
//           },
//           quiz: [
//             {
//               q: '@property decorator kya karta hai?',
//               options: ['Method ko private banata hai', 'Method ko attribute ki tarah access karne deta hai', 'Method ko static banata hai', 'Method ko delete karta hai'],
//               correct: 1,
//               explanation: '@property se method ko bina () ke attribute jaisa access kar sakte hain — s.grade bhi chalega (s.grade() nahi).',
//             },
//             {
//               q: 'JSON mein list of objects save karne ke liye?',
//               options: ['json.dump(list, file)', 'json.save(list)', 'file.write(list)', 'json.export(list)'],
//               correct: 0,
//               explanation: 'json.dump(data, file_object) se Python object ko JSON file mein write karte hain.',
//             },
//             {
//               q: 'next() function kya karta hai?',
//               options: ['Next iteration pe jaata hai', 'Iterator ka pehla matching element return karta hai', 'List ka next element return karta hai', 'Loop advance karta hai'],
//               correct: 1,
//               explanation: 'next(iterator, default) — pehla matching element return karta hai, nahi mila toh default.',
//             },
//           ],
//         },
//         {
//           id: 'py-w4-s4', title: 'Week 4 Review + Month 2 Preview', emoji: '🔭',
//           content: `## Month 1 Complete! Ab kya seekhenge?

// ### Month 1 Recap — Tumne Seekha:
// - ✅ Variables, Data Types, Input/Output
// - ✅ Conditions (if/elif/else)
// - ✅ Loops (for, while)
// - ✅ Lists aur Dictionaries
// - ✅ Functions aur Modules
// - ✅ File Handling
// - ✅ Error Handling
// - ✅ OOP Basics

// ### Month 2 — Kya Aayega? 🔥
// - **Week 5**: Regular Expressions (text patterns match karna)
// - **Week 6**: Web Scraping (websites se data nikalna)
// - **Week 7**: APIs (real data aur services connect karna)
// - **Week 8**: Data Analysis with Pandas aur Matplotlib

// ### Month 3 — Advanced 🚀
// - **Week 9**: Django Web Framework
// - **Week 10**: Machine Learning Basics
// - **Week 11**: Automation Scripts
// - **Week 12**: Final Capstone Project

// ### Real Practice karo:
// 1. Apna month 1 project aur polish karo
// 2. Python.org ke beginner exercises try karo
// 3. Kaggle ke free Python course mein participate karo

// **Next week se intermediate level shuru! 💪**`,
//           codeExample: `# Month 2 Preview — Regex taste karo!
// import re

// text = "Call me at 9876543210 or 7890123456"
// phones = re.findall(r'\\d{10}', text)
// print("Phones found:", phones)

// # Web request taste karo
// # import requests
// # r = requests.get("https://api.github.com")
// # print(r.status_code)  # 200 = success!`,
//           analogy: 'Month 1 review ek milestone ki tarah hai — peeche dekho kitna seekha, aage dekho kya aane wala hai. Jaise long drive mein fuel check karte ho aur map dekhte ho.',
//           conceptMap: ["Month 1 concepts recap", "Quiz aur self-assessment", "Month 2 preview (APIs, Web scraping)", "Learning path visualization", "Certificate milestone"],
//           examples: [
//             { type: 'basic', label: 'Month 1 Recap', code: `# Tumne yeh sab seekha:
// concepts = [
//     "print() aur input()",
//     "Variables aur data types",
//     "if-elif-else",
//     "for aur while loops",
//     "Functions aur return",
//     "Lists aur Dictionaries",
//     "OOP — Classes aur Objects",
//     "File handling",
//     "Exception handling",
//     "Modules aur imports",
// ]

// print(f"Total concepts: {len(concepts)}")
// for i, c in enumerate(concepts, 1):
//     print(f"  {i}. ✓ {c}")`, note: '10 major concepts in 1 month — ek beginner ke liye bahut badi achievement hai!' },
//             { type: 'realworld', label: 'Month 2 Preview', code: `# Agle mahine kya seekhoge:
// month_2 = {
//     "Week 5": "APIs aur requests library",
//     "Week 6": "Web scraping (BeautifulSoup)",
//     "Week 7": "Database (SQLite)",
//     "Week 8": "Flask web framework basics",
// }

// for week, topic in month_2.items():
//     print(f"📚 {week}: {topic}")

// print("\\nReal-world projects banane shuru hoga! 🚀")`, note: 'Month 2 mein practical, job-relevant skills aayengi — APIs, databases, web!' },
//             { type: 'mistake', label: 'What to Avoid in Month 2', code: `# Month 2 mein yeh mistakes mat karna:

// # 1. Copy-paste karna bina samjhe
// # 2. Syntax ratta lagana — logic samjho
// # 3. Projects skip karna
// # 4. Stack Overflow se seedha copy
// # 5. Ek topic pe stuck rehna — aage badho

// # Sahi approach:
// # - Concepts samjho, phir khud likho
// # - Errors ko daro mat — debug karo
// # - Chhota project har week banao`, note: 'Learning style month 2 mein shift hogi — theory se practical ki taraf' },
//             { type: 'edge', label: 'Self Assessment', code: `# Khud test karo — bina dekhte likho:
// # 1. Fibonacci series print karo (loop se)
// # 2. List mein se duplicates hatao
// # 3. Dictionary se sabse zyada value wala key nikalo
// # 4. File mein student data save karo

// # Agar yeh sab likh sake bina hint ke —
// # tum Month 2 ke liye ready ho! 💪

// # Challenge:
// def fibonacci(n):
//     a, b = 0, 1
//     for _ in range(n):
//         print(a, end=" ")
//         a, b = b, a + b`, note: 'Self-assessment sabse honest feedback deta hai — actually try karo' }
//           ],
//           task: {
//             description: 'Month 1 ka celebration! Apna best project choose karo aur isko beautify karo: clear menu, better output formatting, color aur emojis, proper error messages. Phir isko GitHub pe upload karo (free account banao) aur link share karo!',
//             expectedOutput: null,
//             hint: 'GitHub mein new repository banao, README.md file add karo apne project ke baare mein, aur code upload karo. Yeh tumhari coding portfolio ka pehla step hai!',
//           },
//           quiz: [
//             {
//               q: 'Month 2 mein kaunsa concept seekhenge web data ke liye?',
//               options: ['Machine Learning', 'Web Scraping', 'Game Development', 'Mobile Apps'],
//               correct: 1,
//               explanation: 'Month 2 Week 6 mein Web Scraping seekhenge — websites se automatically data nikalna!',
//             },
//             {
//               q: 'Regex ka full form kya hai?',
//               options: ['Regular Extension', 'Regular Expression', 'Repeated Expression', 'Runtime Expression'],
//               correct: 1,
//               explanation: 'Regex = Regular Expression — text mein patterns dhundhne ka powerful tool!',
//             },
//             {
//               q: 'GitHub kis kaam aata hai programmers ke liye?',
//               options: ['Games khelne ke liye', 'Code store aur share karne ke liye', 'Movies dekhne ke liye', 'Documents banane ke liye'],
//               correct: 1,
//               explanation: 'GitHub code ka cloud storage hai + version control + portfolio showcase — every programmer use karta hai!',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// // Month 2 weeks imported in index.js

// // Translations applied in index.js

// // Weeks 5-12 and translations are merged in python/index.js




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

          // ── New: rich content with inline snippets + mistake blocks ──
          richContent: [
            {
              type: 'concept',
              heading: 'Python kya hai?',
              body: 'Python ek programming language hai — computer se baat karne ka tarika. Itni simple hai ki almost English jaisi lagti hai. Google, Netflix, Instagram — sab Python use karte hain!',
            },
            {
              type: 'analogy',
              text: 'Socho computer ek kaam karne wala banda hai jo sirf apni boli samajhta hai. Python woh dictionary hai jisse tum usse seedhe instructions de sakte ho — bilkul asan, clear, aur powerful.',
            },
            {
              type: 'concept',
              heading: 'Tumhara pehla program',
              body: 'print() ek function hai jo kuch bhi screen pe dikhata hai. Jo bhi quotes ke andar likhoge — wahi screen pe aayega.',
            },
            {
              type: 'snippet',
              label: 'Chalao aur dekho',
              code: 'print("Namaste Duniya!")\nprint("Mera naam Python hai!")\nprint("3 mahine mein pro ban jaunga! 💪")',
              expectedOutput: 'Namaste Duniya!\nMera naam Python hai!\n3 mahine mein pro ban jaunga! 💪',
            },
            {
              type: 'concept',
              heading: 'print() ke saath numbers bhi',
              body: 'Sirf text nahi — numbers bhi seedhe print ho sakte hain. Aur ek saath kai cheezein bhi print kar sakte ho:',
            },
            {
              type: 'snippet',
              label: 'Numbers aur text ek saath',
              code: 'print(42)\nprint(3.14)\nprint("Score:", 100)',
              expectedOutput: '42\n3.14\nScore: 100',
            },
            {
              type: 'mistake',
              wrong: 'Print("Namaste")',
              right: 'print("Namaste")',
              why: 'Python case-sensitive hai — Print (bada P) Python nahi pehchanta. Hamesha chhota print likhna.',
            },
            {
              type: 'mistake',
              wrong: "print('Namaste\")",
              right: 'print("Namaste")',
              why: 'Shuruaat aur ant ke quotes match karne chahiye — dono single (\') ya dono double (\").',
            },
            {
              type: 'checkpoint',
              question: 'print("2 + 2") ka output kya hoga?',
              options: ['4', '"2 + 2"', '2 + 2', 'Galati (Error)'],
              correct: 2,
              explanation: 'Quotes ke andar jo bhi likha ho woh seedha print hota hai — koi calculation nahi hoti. "2 + 2" ek string hai, number nahi.',
            },
          ],

          // Legacy fields — still used by existing code
          content: `## Python kya hai?\n\nPython ek programming language hai jo **bahut easy** hai English jaisi. Google, Netflix, Instagram — sabhi Python use karte hain!\n\n### Kyun seekhein Python?\n- Syntax bahut simple hai — almost English ki tarah\n- Ek hi language mein AI, web, games sab bana sakte ho\n- Jobs mein **sabse zyada demand** hai\n\n### Python Print karna\nSabse pehla program hota hai "Hello World!" print karna:\n\n\`\`\`python\nprint("Hello World!")\nprint("Mera naam Python hai!")\nprint("Main 3 months mein pro ban jaunga! 💪")\n\`\`\`\n\n### print() kya karta hai?\n\`print()\` function screen pe kuch bhi dikhata hai. Jo bhi quotes ke beech likhoge — woh screen pe aayega!\n\n### Pro Tip 🔥\nPython mein CASE matter karta hai — \`print\` likhna sahi hai, \`Print\` ya \`PRINT\` likhna galat hai!`,

          codeExample: `# Apna pehla Python program — ??? ki jagah apna naam likho!\nprint("Hello, ???!")\nprint("Main ??? se hun")\nprint("Mera favourite number ??? hai")`,

          task: {
            description: 'Apna naam, sheher aur pasandida khaana — teeno alag alag lines mein print karo! ??? ki jagah apni asli info daalo.',
            hint: 'Teen alag print() statements use karo — ek naam ke liye, ek sheher ke liye, ek khaane ke liye',
            starterCode: 'print("Mera naam ??? hai")\nprint("Main ??? mein rehta/rehti hun")\nprint("Mujhe ??? bahut pasand hai")',
          },

          quiz: [
            {
              q: 'Python mein text screen pe dikhane ke liye kaunsa function use karte hain?',
              options: ['display()', 'print()', 'show()', 'write()'],
              correct: 1,
              explanation: 'print() Python ka built-in function hai jo kuch bhi screen pe dikha deta hai.',
              wrong_explanations: {
                0: 'display() JavaScript mein hota hai, Python mein yeh nahi chalta.',
                2: 'show() naam ka koi Python function nahi hota.',
                3: 'write() files mein likhne ke kaam aata hai, screen pe nahi.',
              },
            },
            {
              q: 'print("Namaste") ka output kya hoga?',
              options: ['"Namaste"', 'Namaste', 'namaste', 'Galati (Error)'],
              correct: 1,
              explanation: 'print() quotes ke andar wali cheez bina quotes ke print karta hai.',
              wrong_explanations: {
                0: 'Quotes output mein nahi aate — sirf andar wala text aata hai.',
                2: 'Python exactly waise hi print karta hai jaise tune likha — bada N bada N hi rahega.',
                3: 'Yeh sahi syntax hai — koi galati nahi aayegi.',
              },
            },
            {
              q: 'Python mein Print("Namaste") likhne se kya hoga?',
              options: ['Namaste print hoga', 'Galati (Error) aayegi', '"Namaste" print hoga', 'Kuch nahi hoga'],
              correct: 1,
              explanation: 'Python case-sensitive hai. Print (bada P) Python nahi pehchanta — NameError aata hai.',
              wrong_explanations: {
                0: 'Python Print naam ke function ko nahi jaanta — isliye nahi chalega.',
                2: 'Bade P ki wajah se galati aati hai, output nahi.',
                3: 'Galati zaroor aayegi — program chup nahi rehta.',
              },
            },
          ],
        },

        {
          id: 'py-w1-s2',
          title: 'Variables — Data Store Karna',
          emoji: '📦',

          richContent: [
            {
              type: 'concept',
              heading: 'Variable kya hota hai?',
              body: 'Variable ek labelled dabbe ki tarah hai. Dabbe ko naam do, koi bhi value rakh do. Baad mein sirf naam se nikaalo — itna hi simple hai.',
            },
            {
              type: 'analogy',
              text: 'Phone mein contacts save karte ho na? "Rahul — 98765" — "Rahul" variable ka naam hai, "98765" uski value hai. Jab bhi "Rahul" dhundho, number turant mil jaata hai. Python ke variables bilkul aise hi kaam karte hain.',
            },
            {
              type: 'snippet',
              label: 'Variable banao aur use karo',
              code: 'naam = "Rahul"\numar = 18\nprint(naam)\nprint(umar)',
              expectedOutput: 'Rahul\n18',
            },
            {
              type: 'concept',
              heading: 'Teen mukhya data types',
              body: 'Python mein teen aam types hain: String (text, quotes ke andar), Integer (poora number), Float (decimal wala number).',
            },
            {
              type: 'snippet',
              label: 'Teeno types ek saath dekho',
              code: 'student_naam = "Priya"     # String\nstudent_umar = 17          # Integer\nstudent_gpa  = 9.2         # Float\n\nprint(student_naam)\nprint(student_umar)\nprint(student_gpa)',
              expectedOutput: 'Priya\n17\n9.2',
            },
            {
              type: 'concept',
              heading: 'Variable ki value badalna',
              body: 'Variable ki value kabhi bhi badal sakte ho — sirf dobara assign karo, pehli value apne aap hatt jaati hai:',
            },
            {
              type: 'snippet',
              label: 'Value update karo',
              code: 'praaptank = 0\nprint("Shuruaat:", praaptank)\n\npraaptank = 100\nprint("Khel ke baad:", praaptank)\n\npraaptank = praaptank + 50\nprint("Bonus mila:", praaptank)',
              expectedOutput: 'Shuruaat: 0\nKhel ke baad: 100\nBonus mila: 150',
            },
            {
              type: 'mistake',
              wrong: '2score = 100',
              right: 'score2 = 100',
              why: 'Variable ka naam number se shuru nahi ho sakta. Hamesha letter ya underscore se shuru karo.',
            },
            {
              type: 'mistake',
              wrong: 'student naam = "Rahul"',
              right: 'student_naam = "Rahul"',
              why: 'Variable ke naam mein khali jagah (space) nahi hoti — underscore (_) lagao space ki jagah.',
            },
            {
              type: 'checkpoint',
              question: 'x = 5 hai, phir x = x + 3 likhte hain. Ab x ki value kya hogi?',
              options: ['5', '3', '8', 'Galati (Error)'],
              correct: 2,
              explanation: 'Pehle daayein taraf calculate hota hai: 5 + 3 = 8. Phir 8 x mein store ho jaata hai.',
            },
          ],

          content: `## Variables kya hote hain?\n\nVariable ek **box** ki tarah hai jisme tum data store karte ho. Jaise tum phone mein contact save karte ho — variable bhi waise hi kaam karta hai!\n\n### Variable banana\n\`\`\`python\nnaam = "Rahul"\numar = 18\nsheher = "Mumbai"\n\nprint(naam)\nprint(umar)\nprint(sheher)\n\`\`\`\n\n### Types of Data\nPython mein teen main types hain:\n\n| Type | Example | Kab use karein |\n|------|---------|----------------|\n| String (str) | \`"Hello"\` | Text ke liye |\n| Integer (int) | \`25\` | Whole numbers |\n| Float | \`9.5\` | Decimal numbers |\n\n### Variables ko Mix karna\n\`\`\`python\nnaam = "Priya"\nscore = 95.5\n\nprint("Student:", naam)\nprint("Score:", score)\nprint(naam, "ka score hai", score)\n\`\`\``,

          codeExample: `# ??? ki jagah apni real info daal do!\nstudent_naam   = "???"\nstudent_umar   = ???\npasand_subject = "???"\n\nprint("Naam:", student_naam)\nprint("Umar:", student_umar)\nprint("Pasand Vishay:", pasand_subject)`,

          task: {
            description: 'Apna profile banao — naam, umar, pasandida_subject, percentage — 4 variables. Phir saari info print karo. ??? ki jagah apni asli values daalo.',
            hint: '4 variables banao. Text ke liye quotes zaroori hain — naam = "Rahul", umar = 18 (numbers ke liye quotes nahi).',
            starterCode: 'naam = "???"\numar = ???\npasandida_subject = "???"\npercentage = ???\n\nprint("Naam:", naam)\nprint("Umar:", umar)\nprint("Subject:", pasandida_subject)\nprint("Percentage:", percentage)',
          },

          quiz: [
            {
              q: 'naam = "Rahul" mein "Rahul" kaunse type ka data hai?',
              options: ['Integer', 'Float', 'String', 'Boolean'],
              correct: 2,
              explanation: 'Quotes ke andar jo bhi likha ho — woh String hota hai. "Rahul" text hai, isliye String.',
              wrong_explanations: {
                0: 'Integer poore numbers hote hain jaise 5, 100 — quotes ke bina.',
                1: 'Float decimal wale numbers hote hain jaise 9.5 — quotes ke bina.',
                3: 'Boolean sirf True ya False hota hai.',
              },
            },
            {
              q: 'Kaunsa variable naam sahi nahi hai?',
              options: ['mera_score', 'score1', '_temp', '1naam'],
              correct: 3,
              explanation: 'Variable ka naam number se shuru nahi ho sakta. 1naam galat hai — naam1 sahi hota.',
              wrong_explanations: {
                0: 'mera_score sahi hai — underscore allowed hai.',
                1: 'score1 sahi hai — end mein number allowed hai.',
                2: '_temp sahi hai — underscore se shuru kar sakte hain.',
              },
            },
            {
              q: 'umar = 17 mein 17 kaunse type ka hai?',
              options: ['String', 'Float', 'Integer', 'Boolean'],
              correct: 2,
              explanation: 'Quotes ke bina poora number = Integer. 17 mein na decimal hai na quotes — Integer hai.',
              wrong_explanations: {
                0: 'String ke liye quotes chahiye — "17" string hota, 17 nahi.',
                1: 'Float mein decimal hota hai — 17.0 float hota.',
                3: 'Boolean sirf True ya False hota hai.',
              },
            },
          ],
        },

        {
          id: 'py-w1-s3',
          title: 'User Input lena — input()',
          emoji: '⌨️',

          richContent: [
            {
              type: 'concept',
              heading: 'Program ko interactive banao',
              body: 'Abhi tak sab values tune khud code mein likhi thi. input() se program seedha user se pooch sakta hai — program ruk jaata hai, user likhta hai, value aa jaati hai.',
            },
            {
              type: 'snippet',
              label: 'Basic input — chalao aur dekho',
              code: '# input() ek prompt box kholega — apna naam likho\nnaam = input("Apna naam batao: ")\nprint("Namaste", naam, "! Swagat hai! 🎉")',
              expectedOutput: '(Prompt box aayega — apna naam type karo)',
            },
            {
              type: 'concept',
              heading: 'Zaroori baat: input() hamesha String deta hai',
              body: 'Yeh sabse zyada hone wali galat-fehmi hai. Chahe user "25" likhe ya "namaste" — dono String aate hain. Agar number chahiye toh badalna padega:',
            },
            {
              type: 'snippet',
              label: 'Number input — int() se badlo',
              code: 'umar = int(input("Tumhari umar kitni hai? "))\nagla_saal = umar + 1\nprint(f"Agle saal tum {agla_saal} saal ke honge!")',
              expectedOutput: '(Apni umar likho — hisaab ho jaayega)',
            },
            {
              type: 'snippet',
              label: 'Float input — dasamlav numbers ke liye',
              code: 'ank = float(input("Tumhara ank (0-10): "))\npratishat = ank * 10\nprint(f"Pratishat: {pratishat}%")',
              expectedOutput: '(Jaise 8.5 daalo — pratishat niklega)',
            },
            {
              type: 'mistake',
              wrong: 'umar = input("Umar: ")\nprint(umar + 1)',
              right: 'umar = int(input("Umar: "))\nprint(umar + 1)',
              why: 'input() string deta hai — "25" + 1 nahi hoga, TypeError aata hai. Pehle int() se badlo.',
            },
            {
              type: 'concept',
              heading: 'f-strings — saaf aur asan printing',
              body: 'f"..." mein {} ke andar variable seedha daal do — + se jodhne ki zarurat hi nahi:',
            },
            {
              type: 'snippet',
              label: 'f-string ka kamal',
              code: 'naam = input("Apna naam: ")\nsheher = input("Sheher: ")\nprint(f"{naam} {sheher} se hai — swagat! 🙌")',
              expectedOutput: '(Naam aur sheher dalo — dono ek saath print honge)',
            },
            {
              type: 'checkpoint',
              question: 'umar = input("Umar: ") — user "20" likhta hai. umar ka type kya hoga?',
              options: ['Integer (20)', 'String ("20")', 'Float (20.0)', 'User pe nirbhar'],
              correct: 1,
              explanation: 'input() hamesha String deta hai — chahe user number likhe ya kuch bhi. "20" string hai, 20 integer.',
            },
          ],

          content: `## User se Input kaise lein?\n\nAbhi tak humne hardcode kiya tha. Ab user se data lete hain!\n\n### input() function\n\`\`\`python\nnaam = input("Apna naam batao: ")\nprint("Hello", naam, "! Welcome to Python! 🎉")\n\`\`\`\n\n### Numbers as Input\ninput() hamesha **String** return karta hai. Number chahiye toh convert karo:\n\n\`\`\`python\numar = int(input("Tumhari age kya hai? "))\nagla_saal = umar + 1\nprint("Agle saal tum", agla_saal, "saal ke hoge!")\n\`\`\``,

          codeExample: `# ??? ki jagah apna prompt likho, aur hisaab poora karo\nnaam       = input("???")\numar       = int(input("???"))\n\n# Ek mazedar hisaab — kitne din zinda reh chuke ho!\ndin_zinda  = umar * 365\nprint(f"{naam}, tum ab tak {din_zinda} din zinda reh chuke ho! 🎂")`,

          task: {
            description: 'User se naam aur pasandida sankhya lo. Phir print karo: "[naam] ki pasandida sankhya [sankhya] hai, aur uska dugna [2x] hai!"',
            hint: 'naam = input(...), sankhya = int(input(...)), phir dugna = sankhya * 2',
            starterCode: 'naam    = input("Apna naam: ")\nsankhya = int(input("Pasandida sankhya: "))\ndugna   = ???\n\nprint(f"{naam} ki pasandida sankhya {sankhya} hai!")\nprint(f"Uska dugna hai: {dugna}")',
          },

          quiz: [
            {
              q: 'input() function kaunsa type return karta hai?',
              options: ['Integer', 'Float', 'String', 'User pe nirbhar'],
              correct: 2,
              explanation: 'input() hamesha String return karta hai — chahe user number type kare ya koi bhi text.',
              wrong_explanations: {
                0: 'Integer nahi milta — chahe user 42 likhe, "42" string milegi.',
                1: 'Float bhi nahi — float() se badalna padta hai.',
                3: 'Nahi — hamesha String milti hai, kuch bhi likho.',
              },
            },
            {
              q: 'User se integer (poora number) lene ka sahi tarika kaunsa hai?',
              options: ['input(int("Umar: "))', 'int(input("Umar: "))', 'integer(input("Umar: "))', 'input("Umar: ", int)'],
              correct: 1,
              explanation: 'int() bahar aur input() andar — pehle input() se string milti hai, phir int() usse number mein badal deta hai.',
              wrong_explanations: {
                0: 'Yeh galat hai — int() ke andar sirf "Umar: " string hai, woh user se kuch nahi maangega.',
                2: 'integer() naam ka koi Python function nahi — sirf int() hota hai.',
                3: 'input() mein sirf ek cheez hoti hai — prompt wali string.',
              },
            },
            {
              q: 'f"Namaste {naam}" mein {naam} ki jagah kya aayega?',
              options: ['{naam} jaisa likha hai', 'naam variable ki value', 'String "naam"', 'Galati (Error)'],
              correct: 1,
              explanation: 'f-string mein {} ke andar variable ki asli value aati hai — jo us waqt variable mein stored ho.',
              wrong_explanations: {
                0: 'Curly braces {} output mein nahi dikhte — woh sirf jagah reserved karte hain.',
                2: '"naam" text nahi aayega — variable ki value aayegi.',
                3: 'Koi galati nahi — yeh sahi f-string likhne ka tarika hai.',
              },
            },
          ],
        },

        {
          id: 'py-w1-s4',
          title: 'Basic Math — Python Calculator',
          emoji: '🧮',

          richContent: [
            {
              type: 'concept',
              heading: 'Python ek calculator bhi hai',
              body: '+ - * / toh basic hain. Python mein teen aur khaas operators hain jo interviews mein aksar aate hain — zaroor seekho.',
            },
            {
              type: 'snippet',
              label: 'Sab operators ek saath — chalao',
              code: 'a = 17\nb = 5\n\nprint("Jod:      ", a + b)   # 22\nprint("Ghatao:   ", a - b)   # 12\nprint("Guno:     ", a * b)   # 85\nprint("Bhago:    ", a / b)   # 3.4\nprint("Poora:    ", a // b)  # 3  (dasamlav hata do)\nprint("Shesh:    ", a % b)   # 2  (baaki bachta)\nprint("Ghaath:   ", a ** b)  # 17^5 = 1419857',
              expectedOutput: 'Jod:       22\nGhatao:    12\nGuno:      85\nBhago:     3.4\nPoora:     3\nShesh:     2\nGhaath:    1419857',
            },
            {
              type: 'concept',
              heading: '% (shesh/modulus) — sirf baaki',
              body: '17 % 5 = 2 isliye kyunki 17 = 5×3 + 2. Yeh operator even/odd check karne ke liye bahut kaam aata hai — agar number % 2 == 0 toh even.',
            },
            {
              type: 'snippet',
              label: 'Even/Odd pehchano — % ka asli use',
              code: 'number = 42\nif number % 2 == 0:\n    print(f"{number} even (jugal) hai")\nelse:\n    print(f"{number} odd (ek) hai")',
              expectedOutput: '42 jugal (even) hai',
            },
            {
              type: 'concept',
              heading: 'f-strings mein sundar formatting',
              body: '{value:.2f} ka matlab hai "sirf 2 dasamlav dikhao" — percentage aur paisa dikhane ke liye zaroori.',
            },
            {
              type: 'snippet',
              label: 'Percentage calculator — asli misaal',
              code: 'naam     = "Vikram"\nanks     = 450\nkul_ank  = 500\npratishat = (anks / kul_ank) * 100\n\nprint(f"{naam} ka natija:")\nprint(f"Ank:        {anks}/{kul_ank}")\nprint(f"Pratishat:  {pratishat:.2f}%")',
              expectedOutput: 'Vikram ka natija:\nAnk:        450/500\nPratishat:  90.00%',
            },
            {
              type: 'mistake',
              wrong: 'print("2 + 2")',
              right: 'print(2 + 2)',
              why: '"2 + 2" quotes ke andar hai — string hai, hisaab nahi hoga. Hisaab ke liye quotes ke bahar likhna.',
            },
            {
              type: 'mistake',
              wrong: 'jawab = 10 / 0',
              right: 'if b != 0:\n    jawab = a / b',
              why: 'Shoonya se bhaagna ZeroDivisionError deta hai. Asli code mein hamesha check karo.',
            },
            {
              type: 'checkpoint',
              question: '17 % 5 ka output kya hoga?',
              options: ['3', '2', '3.4', '0'],
              correct: 1,
              explanation: '17 ko 5 se bhago: 5×3=15, baaki = 17-15 = 2. Modulus sirf baaki (remainder) deta hai.',
            },
          ],

          content: `## Python mein Math Operations\n\nPython ek powerful calculator hai!\n\n### Basic Operators\n\`\`\`python\na = 20\nb = 6\n\nprint(a + b)   # 26\nprint(a - b)   # 14\nprint(a * b)   # 120\nprint(a / b)   # 3.333...\nprint(a // b)  # 3 (floor division)\nprint(a % b)   # 2 (remainder)\nprint(a ** b)  # power\n\`\`\`\n\n### f-strings\n\`\`\`python\nnaam = "Vikram"\nmarks = 450\ntotal = 500\npercentage = (marks / total) * 100\nprint(f"{naam} ka result: {percentage:.2f}%")\n\`\`\``,

          codeExample: `# Bakshish hisaab — ??? ki jagah apna code likho\nbill       = float(input("Bill raashi (₹): "))\nbakshish_p = float(input("Bakshish (%) kitni deni hai: "))\n\nbakshish = ???\nkul      = ???\n\nprint(f"\\nBill:      ₹{bill:.2f}")\nprint(f"Bakshish:  ₹{bakshish:.2f}")\nprint(f"Kul Total: ₹{kul:.2f}")`,

          task: {
            description: 'EMI hisaab karo: user se loan raashi aur saal lo. Kul = raashi + (raashi × 0.1 × saal), Maasik = kul ÷ (saal × 12). ??? fill karo.',
            hint: 'kul_rakam = udhaar + (udhaar * 0.1 * saal), phir maasik_emi = kul_rakam / (saal * 12). {variable:,.0f} se saaf number dikhega.',
            starterCode: 'udhaar     = float(input("Loan raashi (₹): "))\nsaal       = int(input("Kitne saal ke liye: "))\n\nkul_rakam  = udhaar + (udhaar * 0.1 * saal)\nmaasik_emi = ???\n\nprint(f"\\nLoan:       ₹{udhaar:,.0f}")\nprint(f"Kul Rakam:  ₹{kul_rakam:,.0f}")\nprint(f"Maasik EMI: ₹{maasik_emi:,.0f}")',
          },

          quiz: [
            {
              q: '17 % 5 ka jawab kya hoga?',
              options: ['3', '2', '3.4', '0'],
              correct: 1,
              explanation: '17 ko 5 se bhago: 5×3=15, baaki = 2. Modulus (%) sirf baaki (remainder) deta hai.',
              wrong_explanations: {
                0: '3 poore bhaag (17//5) ka jawab hai — modulus alag hota hai.',
                2: '3.4 seedhe bhaag (17/5) ka jawab hai — modulus sirf baaki deta hai.',
                3: 'Shoonya tab hota jab poori tarah divide ho — 17 mein 5 se poora nahi jaata.',
              },
            },
            {
              q: 'f"Natija: {pratishat:.2f}%" mein :.2f kya karta hai?',
              options: ['Kul 2 ank dikhata hai', 'Sirf 2 dasamlav dikhata hai', 'Float mein badal deta hai', 'Galati deta hai'],
              correct: 1,
              explanation: ':.2f ek format specifier hai — f matlab float, .2 matlab 2 dasamlav ke baad.',
              wrong_explanations: {
                0: 'Kul 2 ank nahi — sirf 2 dasamlav tak.',
                2: 'Float mein badalna alag hota hai — float() ya int() se karte hain.',
                3: 'Yeh sahi Python tarika hai — koi galati nahi.',
              },
            },
            {
              q: '10 // 3 ka jawab kya hoga?',
              options: ['3.33', '3', '4', '1'],
              correct: 1,
              explanation: 'Poora bhaag (//) dasamlav hata deta hai — 10/3 = 3.33, poora = 3.',
              wrong_explanations: {
                0: '3.33 seedhe bhaag (10/3) ka jawab hai — // poora deta hai.',
                2: '4 oopar ka round hota — poora 3 hai kyunki neeche gol karte hain.',
                3: '1 shesh (10%3) ka jawab hoga — poora bhaag alag hota hai.',
              },
            },
          ],
        },
      ],
    },


    // WEEK 2
    {
      week: 2,
      title: 'Faisle aur Loops',
      description: 'Python ko sochna aur doharana sikhao!',
      xpReward: 120,
      sections: [
        {
          id: 'py-w2-s1',
          title: 'if / elif / else — Faisla Karna',
          emoji: '🤔',

          richContent: [
            {
              type: 'concept',
              heading: 'Python ko sochna sikhao',
              body: 'Asli zindagi mein hum roz conditions check karte hain — "Agar baarish ho toh chhaata lo." Python bhi bilkul yehi karta hai. if-else se program alag alag situations mein alag kaam karta hai.',
            },
            {
              type: 'analogy',
              text: 'Socho tum ATM pe ho. Machine check karti hai: "Kya balance kaafi hai?" — Haan toh paisa niklega, Nahi toh "Kam balance" dikhega. if-else exactly aisa hi kaam karta hai.',
            },
            {
              type: 'snippet',
              label: 'Pehla if-else — chalao dekho',
              code: 'taapman = 38\n\nif taapman > 37.5:\n    print("Bukhaar hai! Doctor ke paas jao.")\nelse:\n    print("Taapman theek hai.")',
              expectedOutput: 'Bukhaar hai! Doctor ke paas jao.',
            },
            {
              type: 'concept',
              heading: 'elif — kai conditions ek saath',
              body: 'Sirf do raste nahi — kai choices bhi ho sakti hain. elif se ek ke baad ek conditions check hoti hain:',
            },
            {
              type: 'snippet',
              label: 'Grade calculator — elif chain dekho',
              code: 'ank = 85\n\nif ank >= 90:\n    print("Zabardast! A+ Grade")\nelif ank >= 80:\n    print("Bahut acha! A Grade")\nelif ank >= 70:\n    print("Theek hai! B Grade")\nelif ank >= 60:\n    print("Aur mehnat karo. C Grade")\nelse:\n    print("Haar mat maano. Fail")',
              expectedOutput: 'Bahut acha! A Grade',
            },
            {
              type: 'concept',
              heading: 'and / or — do conditions ek saath',
              body: 'and: dono conditions sachi honi chahiye. or: koi bhi ek sachi ho kaafi hai.',
            },
            {
              type: 'snippet',
              label: 'and aur or ka farak dekho',
              code: 'umar = 20\nnagrik = True\n\nif umar >= 18 and nagrik == True:\n    print("Aap vote de sakte hain!")\n\nif umar < 13 or umar > 60:\n    print("Special chhuut milegi!")',
              expectedOutput: 'Aap vote de sakte hain!',
            },
            {
              type: 'mistake',
              wrong: 'if umar = 18:\n    print("Baligha ho")',
              right: 'if umar == 18:\n    print("Baligha ho")',
              why: 'Ek = sirf value assign karta hai. Comparison ke liye hamesha == (double equal) use karo.',
            },
            {
              type: 'mistake',
              wrong: 'if umar > 18\n    print("Baligha")',
              right: 'if umar > 18:\n    print("Baligha")',
              why: 'if ke baad colon (:) zaroori hai aur andar wala code 4 spaces andar hona chahiye.',
            },
            {
              type: 'checkpoint',
              question: 'umar = 20. "if umar >= 18 and umar < 60:" — kya yeh sach hoga?',
              options: ['Haan, dono sach hain', 'Nahi, pehli galat hai', 'Nahi, doosri galat hai', 'Dono galat hain'],
              correct: 0,
              explanation: '20 >= 18 sach hai aur 20 < 60 bhi sach hai. and mein dono zaroori hain — toh poora sach hai.',
            },
          ],

          content: `## Conditions kya hain?\n\nif-else se program sochta hai aur alag alag kaam karta hai!`,

          codeExample: `# Login system — ??? fill karo\nsahi_user = "admin"\nsahi_pass = "python123"\n\nuser = input("Username: ")\npassword = input("Password: ")\n\nif user == sahi_user and password == ???:\n    print("Login ho gaya! Swagat hai!")\nelif user == ???:\n    print("Password galat hai!")\nelse:\n    print("Username nahi mila!")`,

          task: {
            description: 'Movie ticket price calculator: Baligha (18+) = 200 rupay, Buzurg (60+) = 100 rupay, Bachcha (18 se kam) = 120 rupay. User se umar lo aur ticket price batao.',
            hint: 'Pehle buzurg (60+) check karo — warna 60+ wale "adult" mein aa jaenge. Phir baligha, phir bachcha.',
            starterCode: 'umar = int(input("Aapki umar: "))\n\nif umar >= 60:\n    ticket = ???\nelif umar >= 18:\n    ticket = ???\nelse:\n    ticket = ???\n\nprint(f"Aapka ticket: {ticket} rupay")',
          },

          quiz: [
            {
              q: 'Python mein barabar check karne ka sahi operator kaunsa hai?',
              options: ['=', '==', '===', 'equals'],
              correct: 1,
              explanation: '= sirf value assign karta hai. == se tulna (comparison) hoti hai. Dono bilkul alag hain!',
              wrong_explanations: {
                0: '= assignment ke liye hai — if x = 5 likhoge toh galati aayegi.',
                2: '=== JavaScript mein hota hai — Python mein nahi.',
                3: 'equals() naam ka Python mein koi operator nahi.',
              },
            },
            {
              q: '"and" operator kab sach (True) deta hai?',
              options: ['Koi bhi ek sach ho', 'Dono conditions sach hon', 'Dono galat hon', 'Kabhi nahi'],
              correct: 1,
              explanation: 'and sirf tab True deta hai jab DONO conditions True hon — ek bhi False toh poora False.',
              wrong_explanations: {
                0: 'Yeh "or" ki baat hai — and mein dono zaroori hain.',
                2: 'Dono galat hone pe False milega.',
                3: 'Haan milta hai — sirf dono sach hone pe.',
              },
            },
            {
              q: 'if ke baad kya likhna zaroori hai Python mein?',
              options: ['{}', 'then', ':', 'do'],
              correct: 2,
              explanation: 'Python mein if condition ke baad colon (:) zaroori hai — yeh Python ka block shuru karne ka tarika hai.',
              wrong_explanations: {
                0: '{} JavaScript aur C mein hote hain — Python mein nahi.',
                1: 'then JavaScript mein hota hai — Python mein nahi.',
                3: 'do Python mein koi keyword nahi.',
              },
            },
          ],
        },

        {
          id: 'py-w2-s2',
          title: 'Loops — Kaam Baar Baar Karna',
          emoji: '🔄',

          richContent: [
            {
              type: 'concept',
              heading: 'Loop kya hota hai?',
              body: '100 baar "Namaste" print karna hai? Loop se yeh ek hi jagah se hoga. Loop ek kaam ko baar baar karta rehta hai — jab tak tum kaho.',
            },
            {
              type: 'analogy',
              text: 'Socho tumhe apni class ke 40 bacchon ko ek hi message dena hai. Ek ek karke 40 baar likhoge? Ya ek likhke machine se 40 copies nikalo? Loop woh machine hai — ek kaam baar baar, bina thake.',
            },
            {
              type: 'snippet',
              label: 'for loop — ginti ke saath',
              code: 'for i in range(5):\n    print(f"Loop number: {i}")\n\nprint("Khatam!")',
              expectedOutput: 'Loop number: 0\nLoop number: 1\nLoop number: 2\nLoop number: 3\nLoop number: 4\nKhatam!',
            },
            {
              type: 'concept',
              heading: 'range() kaise kaam karta hai',
              body: 'range(5) matlab 0 se 4 tak. range(1,6) matlab 1 se 5 tak. range(1,10,2) matlab 1,3,5,7,9 — har doosra number.',
            },
            {
              type: 'snippet',
              label: 'Pahada — loop ka asli use',
              code: 'num = 5\nprint(f"=== {num} ka Pahada ===")\n\nfor i in range(1, 11):\n    print(f"{num} x {i} = {num * i}")',
              expectedOutput: '=== 5 ka Pahada ===\n5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
            },
            {
              type: 'concept',
              heading: 'while loop — jab tak condition sach ho',
              body: 'for loop ginti karta hai. while loop condition check karta hai — jab tak sach ho, tab tak chalta rehta hai.',
            },
            {
              type: 'snippet',
              label: 'while loop — counter wala',
              code: 'ginti = 1\nwhile ginti <= 5:\n    print(f"Ginti: {ginti}")\n    ginti += 1\n\nprint("Ho gaya!")',
              expectedOutput: 'Ginti: 1\nGinti: 2\nGinti: 3\nGinti: 4\nGinti: 5\nHo gaya!',
            },
            {
              type: 'mistake',
              wrong: 'ginti = 1\nwhile ginti <= 5:\n    print(ginti)\n    # ginti badhana bhool gaye!',
              right: 'ginti = 1\nwhile ginti <= 5:\n    print(ginti)\n    ginti += 1',
              why: 'Counter update karna bhoolne se loop kabhi khatam nahi hota — program hang ho jaata hai. Ctrl+C dabao band karne ke liye.',
            },
            {
              type: 'mistake',
              wrong: 'for i in range(5):\nprint(i)',
              right: 'for i in range(5):\n    print(i)',
              why: 'Loop ke andar ka code 4 spaces andar (indent) hona zaroori hai — warna IndentationError aayega.',
            },
            {
              type: 'checkpoint',
              question: 'range(2, 10, 3) kaunse numbers dega?',
              options: ['2, 5, 8', '2, 4, 6, 8, 10', '3, 6, 9', '2, 3, 4, 5, 6, 7, 8, 9'],
              correct: 0,
              explanation: 'Start=2, Step=3: 2 phir 5 phir 8 phir 11 — lekin 11 range se bahar hai toh ruk gaye. Jawab: 2, 5, 8.',
            },
          ],

          content: `## Loops kya hain?\n\nLoop se baar baar kaam machine se karao!`,

          codeExample: `# Pahada generator — ??? fill karo\nnum = int(input("Kaunsa pahada chahiye? "))\n\nprint(f"\\n{'='*20}")\nprint(f"   {num} ka Pahada")\nprint(f"{'='*20}")\n\nfor i in range(1, ???):\n    print(f"  {num} x {i} = {???}")\n\nprint(f"{'='*20}")`,

          task: {
            description: 'Number guessing game! Secret number 42 hai. User guess kare — zyada ho toh "Kam karo!", kam ho toh "Zyada karo!", sahi ho toh "Shabash! X tries mein pakda!"',
            hint: 'secret = 42. tries = 0. while True loop mein input lo, tries badhao. Sahi pe break karo.',
            starterCode: 'secret = 42\ntries = 0\n\nwhile True:\n    guess = int(input("Andaza karo (1-100): "))\n    tries += 1\n\n    if guess > secret:\n        print("Kam karo!")\n    elif guess < secret:\n        print("Zyada karo!")\n    else:\n        print(f"Shabash! {???} tries mein pakda!")\n        ???',
          },

          quiz: [
            {
              q: 'range(2, 10, 3) kya dega?',
              options: ['2, 5, 8', '2, 4, 6, 8, 10', '3, 6, 9', '2, 3, 4...9'],
              correct: 0,
              explanation: 'Start=2, Step=3: 2, 5, 8 — aur 11 range se bahar toh ruk gaye.',
              wrong_explanations: {
                1: 'Yeh range(2,11,2) hota — step 2 ke saath.',
                2: 'Yeh range(3,10,3) hota — 3 se shuru.',
                3: 'Yeh range(2,10) hota — koi step nahi.',
              },
            },
            {
              q: 'Loop se turant bahar nikalne ke liye kaunsa keyword?',
              options: ['exit', 'stop', 'break', 'end'],
              correct: 2,
              explanation: '"break" loop ko turant rokta hai — baaki iterations nahi chaltein.',
              wrong_explanations: {
                0: 'exit() poora program band karta hai — sirf loop nahi.',
                1: 'stop naam ka Python mein koi keyword nahi.',
                3: 'end Python mein koi keyword nahi.',
              },
            },
            {
              q: 'while loop kab tak chalta rehta hai?',
              options: ['Sirf ek baar', 'Hamesha', 'Jab tak condition sach ho', 'Jab tak condition galat ho'],
              correct: 2,
              explanation: 'while loop tab tak chalta hai jab tak condition True ho — False hote hi band ho jaata hai.',
              wrong_explanations: {
                0: 'Ek baar ke liye for loop bhi kaam karta hai — range(1).',
                1: 'Hamesha sirf while True: mein — warna condition pe depend karta hai.',
                3: 'Ulta — False hone pe ruk jaata hai, sach hone pe chalta hai.',
              },
            },
          ],
        },

        {
          id: 'py-w2-s3',
          title: 'Lists — Data Ek Jagah Rakhna',
          emoji: '📋',

          richContent: [
            {
              type: 'concept',
              heading: 'List kya hoti hai?',
              body: 'Variable mein sirf ek value hoti hai. List mein kai values ek saath rakh sakte ho — jaise ek numbered dabba jisme kai cheezein numbered order mein hain.',
            },
            {
              type: 'analogy',
              text: 'Socho class ka attendance register — ek book mein sab bacchon ke naam numbered order mein. Pehla naam number 0 pe, doosra 1 pe, aakhri -1 pe. Python ki list bilkul aisa hi register hai.',
            },
            {
              type: 'snippet',
              label: 'List banao aur use karo',
              code: 'phal = ["seb", "aam", "kela", "angoor"]\n\nprint(phal[0])    # pehla\nprint(phal[1])    # doosra\nprint(phal[-1])   # aakhri\nprint(len(phal))  # kitne hain total',
              expectedOutput: 'seb\naam\nangoor\n4',
            },
            {
              type: 'concept',
              heading: 'List mein cheezein daalna aur nikalna',
              body: 'List ke baad mein bhi cheezein jod sakte ho, nikal sakte ho, sort bhi kar sakte ho:',
            },
            {
              type: 'snippet',
              label: 'List operations — sab ek jagah',
              code: 'ank = [85, 92, 78]\n\nank.append(95)      # aakhir mein jodo\nank.insert(0, 100)  # shuruaat mein daalo\nank.remove(78)      # yeh value hataao\nank.sort()          # chhote se bade karo\n\nprint(ank)\nprint("Sabse zyada:", max(ank))\nprint("Sabse kam:", min(ank))\nprint("Kul:", sum(ank))',
              expectedOutput: '[85, 92, 95, 100]\nSabse zyada: 100\nSabse kam: 85\nKul: 372',
            },
            {
              type: 'concept',
              heading: 'List ke saath loop',
              body: 'for loop se list ke har item pe kaam kar sakte ho — ek ek karke:',
            },
            {
              type: 'snippet',
              label: 'Har student ko greet karo',
              code: 'chhatra = ["Rahul", "Priya", "Arjun", "Neha"]\n\nfor naam in chhatra:\n    print(f"Namaste {naam}!")',
              expectedOutput: 'Namaste Rahul!\nNamaste Priya!\nNamaste Arjun!\nNamaste Neha!',
            },
            {
              type: 'mistake',
              wrong: 'phal = ["seb", "aam", "kela"]\nprint(phal[3])',
              right: 'phal = ["seb", "aam", "kela"]\nprint(phal[2])  # ya phal[-1]',
              why: '3 items hain — indices 0, 1, 2 tak hote hain. 3 ka index nahi hota — IndexError aayega.',
            },
            {
              type: 'mistake',
              wrong: 'ank = [85, 92, 78]\nank.add(95)',
              right: 'ank = [85, 92, 78]\nank.append(95)',
              why: 'List mein add() nahi hota. Aakhir mein jodne ke liye append() use karo.',
            },
            {
              type: 'checkpoint',
              question: 'suchi = [10, 20, 30]. suchi[-1] kya dega?',
              options: ['10', '20', '30', 'Galati (Error)'],
              correct: 2,
              explanation: '-1 index hamesha aakhri element deta hai — 3 items mein aakhri = 30.',
            },
          ],

          content: `## Lists — Kai Values Ek Saath!\n\nList mein multiple values rakh sakte hain.`,

          codeExample: `# Chhatra ank manager — ??? fill karo\nchhatra = []\nank = []\n\nn = int(input("Kitne chhatra hain: "))\n\nfor i in range(n):\n    naam = input(f"Chhatra {i+1} ka naam: ")\n    marks = float(input(f"{naam} ke ank: "))\n    chhatra.???(naam)\n    ank.???(marks)\n\nprint("\\n=== Natija ===")\nfor i in range(len(chhatra)):\n    sthiti = "PASS" if ank[i] >= 40 else "FAIL"\n    print(f"{chhatra[i]}: {ank[i]} — {sthiti}")\n\nprint(f"\\nKaksha Ausat: {sum(ank)/len(ank):.2f}")`,

          task: {
            description: '5 numbers user se lo list mein. Phir print karo: asli list, sorted list, ulti list, kul (sum), ausat (average), sabse zyada aur sabse kam.',
            hint: 'Loop mein 5 baar input() se numbers lo aur append() karo. sorted(suchi) se sorted list. sum()/len() se ausat.',
            starterCode: 'suchi = []\n\nfor i in range(5):\n    num = float(input(f"Number {i+1}: "))\n    suchi.???(num)\n\nprint(f"Asli: {suchi}")\nprint(f"Sorted: {sorted(suchi)}")\nprint(f"Ulti: {suchi[::-1]}")\nprint(f"Kul: {sum(suchi)}")\nprint(f"Ausat: {sum(suchi)/len(suchi):.2f}")\nprint(f"Zyada: {max(suchi)}")\nprint(f"Kam: {min(suchi)}")',
          },

          quiz: [
            {
              q: 'suchi = [10, 20, 30]. suchi[-1] kya return karega?',
              options: ['10', '20', '30', 'Galati'],
              correct: 2,
              explanation: '-1 index hamesha aakhri element deta hai — 3 items mein aakhri = 30.',
              wrong_explanations: {
                0: '10 pehle index (0) pe hai.',
                1: '20 doosre index (1) pe hai.',
                3: '-1 valid index hai Python mein — koi galati nahi.',
              },
            },
            {
              q: 'List mein aakhir mein nayi value jodne ke liye?',
              options: ['suchi.add()', 'suchi.push()', 'suchi.append()', 'suchi.insert()'],
              correct: 2,
              explanation: 'append() hamesha aakhir mein jodta hai. insert(0, value) shuruaat mein dalta hai.',
              wrong_explanations: {
                0: 'add() list mein nahi hota — set mein hota hai.',
                1: 'push() JavaScript mein hota hai — Python mein nahi.',
                3: 'insert() specific jagah ke liye hota hai — aakhir ke liye append() better hai.',
              },
            },
            {
              q: 'len(["a", "b", "c", "d", "e"]) kya dega?',
              options: ['4', '5', '6', '0'],
              correct: 1,
              explanation: 'len() list mein total items ki ginti deta hai — 5 items hain toh 5.',
              wrong_explanations: {
                0: '4 hota agar 4 items hote.',
                2: '6 nahi — sirf 5 items hain.',
                3: '0 khali list ke liye hota.',
              },
            },
          ],
        },

        {
          id: 'py-w2-s4',
          title: 'Functions — Reusable Code Banana',
          emoji: '⚙️',

          richContent: [
            {
              type: 'concept',
              heading: 'Function kya hota hai?',
              body: 'Function ek naamzad kaam ka tarika hai. Ek baar likho, jab chahiye tab baar baar use karo — code dobara likhne ki zarurat nahi.',
            },
            {
              type: 'analogy',
              text: 'Function ek recipe ki tarah hai. Biryani banana seekha ek baar — ab jab bhi chahiye, wahi recipe follow karo. Recipe dobara likhne ki zarurat nahi. Python mein function bhi aisa hi hai.',
            },
            {
              type: 'snippet',
              label: 'Pehla function — define aur call karo',
              code: 'def greet():\n    print("Namaste!")\n    print("Python seekhna kaisa lag raha hai?")\n\ngreet()\ngreet()\ngreet()',
              expectedOutput: 'Namaste!\nPython seekhna kaisa lag raha hai?\nNamaste!\nPython seekhna kaisa lag raha hai?\nNamaste!\nPython seekhna kaisa lag raha hai?',
            },
            {
              type: 'concept',
              heading: 'Parameters — function ko data dena',
              body: 'Parameters se function ko alag alag input de sakte ho — har baar alag data:',
            },
            {
              type: 'snippet',
              label: 'Parameter wala function',
              code: 'def namaste(naam):\n    print(f"Namaste {naam}!")\n    print(f"Kya haal hai, {naam}?")\n\nnamaste("Rahul")\nnamaste("Priya")',
              expectedOutput: 'Namaste Rahul!\nKya haal hai, Rahul?\nNamaste Priya!\nKya haal hai, Priya?',
            },
            {
              type: 'concept',
              heading: 'return — function se jawab lena',
              body: 'return se function apna jawab wapas bhejta hai — jo tum variable mein pakad sakte ho:',
            },
            {
              type: 'snippet',
              label: 'return wala function',
              code: 'def jodo(a, b):\n    jawab = a + b\n    return jawab\n\nresult = jodo(10, 20)\nprint(f"10 + 20 = {result}")\nprint(jodo(5, 7))',
              expectedOutput: '10 + 20 = 30\n12',
            },
            {
              type: 'mistake',
              wrong: 'def calculator(a, b):\n    result = a + b\n    return result\n    print("Done!")  # yeh kabhi nahi chalega',
              right: 'def calculator(a, b):\n    print("Hisaab ho gaya!")\n    result = a + b\n    return result',
              why: 'return ke baad ka code kabhi nahi chalta. print() pehle likho, return hamesha function ka aakhri kaam hona chahiye.',
            },
            {
              type: 'mistake',
              wrong: 'def greet(naam):\n    print(f"Namaste {naam}")\n\nprint(greet("Rahul"))',
              right: 'def greet(naam):\n    print(f"Namaste {naam}")\n\ngreet("Rahul")',
              why: 'greet() kuch return nahi karta — print(greet()) likhoge toh "None" bhi print hoga. Seedha greet() call karo.',
            },
            {
              type: 'checkpoint',
              question: 'def jodo(a, b): return a + b — jodo(3, 4) ka jawab kya hoga?',
              options: ['34', '7', 'None', 'Galati'],
              correct: 1,
              explanation: 'a=3, b=4. a + b = 7. return 7 wapas bhejta hai.',
            },
          ],

          content: `## Functions — Reusable Code!\n\nEk baar likho, baar baar use karo.`,

          codeExample: `# BMI Calculator — ??? fill karo\ndef bmi_nikalo(wajan, unchai):\n    bmi = wajan / (unchai ** 2)\n    return ???\n\ndef category_batao(bmi):\n    if bmi < 18.5:\n        return "Kam Wajan"\n    elif bmi < 25:\n        return "Theek Hai"\n    elif bmi < 30:\n        return "Thoda Zyada"\n    else:\n        return "Bahut Zyada"\n\nwajan = float(input("Wajan (kg): "))\nunchai = float(input("Unchai (meter): "))\n\nbmi = ???(wajan, unchai)\ncategory = ???(bmi)\n\nprint(f"BMI: {bmi}")\nprint(f"Sthiti: {category}")`,

          task: {
            description: 'Temperature converter functions banao: celsius_se_fahrenheit(c), fahrenheit_se_celsius(f). Formulas: F = (C x 9/5) + 32, C = (F - 32) x 5/9. User se temperature aur unit lo, dono conversions print karo.',
            hint: 'Do alag functions banao — har ek mein return likhna. Main code mein input lo aur sahi function call karo.',
            starterCode: 'def celsius_se_fahrenheit(c):\n    return ???\n\ndef fahrenheit_se_celsius(f):\n    return ???\n\ntemp = float(input("Temperature: "))\nunit = input("Unit (C/F): ").upper()\n\nif unit == "C":\n    print(f"Fahrenheit: {celsius_se_fahrenheit(temp):.2f}")\nelse:\n    print(f"Celsius: {???:.2f}")',
          },

          quiz: [
            {
              q: 'Function define karne ka keyword kya hai?',
              options: ['function', 'func', 'def', 'define'],
              correct: 2,
              explanation: 'Python mein "def" se function define hota hai — phir naam, phir brackets, phir colon.',
              wrong_explanations: {
                0: 'function JavaScript mein use hota hai — Python mein def.',
                1: 'func Python mein valid keyword nahi.',
                3: 'define Python mein valid keyword nahi.',
              },
            },
            {
              q: 'Function se value wapas bhejne ke liye?',
              options: ['send', 'output', 'return', 'give'],
              correct: 2,
              explanation: '"return" function se value bahar bhejta hai — jo call karne wala pakad sakta hai.',
              wrong_explanations: {
                0: 'send Python mein function ke liye valid nahi.',
                1: 'output Python mein valid keyword nahi.',
                3: 'give Python mein valid keyword nahi.',
              },
            },
            {
              q: 'Default parameter kya kaam karta hai?',
              options: ['Parameter zaroori banata hai', 'Parameter optional banata hai', 'Parameter delete karta hai', 'Galati deta hai'],
              correct: 1,
              explanation: 'Default value dene se parameter optional ho jaata hai — call karte waqt na dena padhe toh default use hoti hai.',
              wrong_explanations: {
                0: 'Zaroori banane ke liye sirf parameter likhte hain — default nahi dete.',
                2: 'Delete nahi karta — sirf optional banata hai.',
                3: 'Galati nahi — yeh sahi Python tarika hai.',
              },
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

// Month 2 weeks imported in index.js

// Translations applied in index.js

// Weeks 5-12 and translations are merged in python/index.js