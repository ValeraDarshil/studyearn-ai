/**
 * StudyEarn AI — C Programming Course
 * Week 2: Control Flow — if/else, switch, loops
 * Hinglish + English bilingual, 4 sections, fully detailed
 */

export const C_WEEK_2 = {
  week: 2,
  title: 'Control Flow — Program ko Direction Do',
  title_en: 'Control Flow — Give Your Program Direction',
  description: 'if/else, switch, for, while, do-while — program ko decisions lena aur repeat karna sikhao!',
  description_en: 'if/else, switch, for, while, do-while — teach your program to make decisions and repeat actions!',
  xpReward: 180,
  sections: [
    {
      id: 'c-w2-s1',
      title: 'if / else — Decisions Lena',
      title_en: 'if / else — Making Decisions',
      emoji: '🔀',
      content: `## if / else — Program ko Sochna Sikhao!

Real life mein hum roz decisions lete hain:
- "Agar rain ho → umbrella lo, warna mat lo"
- "Agar marks 90+ → A grade, 75+ → B grade..."

C mein yahi kaam if/else karta hai!

### Basic if / else

\`\`\`c
// Syntax
if (condition) {
    // jab condition true ho
} else {
    // jab condition false ho
}

// Example
int marks = 75;
if (marks >= 60) {
    printf("Pass! ✅\\n");
} else {
    printf("Fail! ❌\\n");
}
\`\`\`

### if / else if / else — Multiple Conditions

\`\`\`c
int marks = 82;

if (marks >= 90) {
    printf("Grade: A — Excellent!\\n");
} else if (marks >= 75) {
    printf("Grade: B — Good!\\n");
} else if (marks >= 60) {
    printf("Grade: C — Average\\n");
} else if (marks >= 45) {
    printf("Grade: D — Below Average\\n");
} else {
    printf("Grade: F — Fail\\n");
}
// Output: Grade: B — Good!
\`\`\`

### Nested if — if ke andar if

\`\`\`c
int age = 20;
int hasID = 1;  // 1 = true

if (age >= 18) {
    if (hasID) {
        printf("Entry allowed ✅\\n");
    } else {
        printf("Age ok but ID required ⚠️\\n");
    }
} else {
    printf("Too young, entry denied ❌\\n");
}
\`\`\`

### Ternary Operator — Short if/else

\`\`\`c
// condition ? value_if_true : value_if_false
int marks = 75;
char *result = (marks >= 60) ? "Pass" : "Fail";
printf("Result: %s\\n", result);

// Ek aur example
int a = 10, b = 20;
int max = (a > b) ? a : b;
printf("Max: %d\\n", max);  // 20

// Nested ternary (avoid karo — unreadable)
// char *grade = marks>=90 ? "A" : marks>=75 ? "B" : "C";
\`\`\`

### Common Mistakes

\`\`\`c
// ❌ GALAT — = aur == confuse mat karo!
int x = 5;
if (x = 10) {    // assignment, not comparison! x becomes 10, always true
    printf("This always prints!\\n");
}

// ✅ SAHI
if (x == 10) {   // comparison
    printf("x is 10\\n");
}

// ❌ GALAT — floating point exact comparison
float f = 0.1 + 0.2;
if (f == 0.3) {   // floating point precision issue!
    printf("Equal\\n");  // might NOT print!
}

// ✅ SAHI — tolerance ke saath compare karo
#include <math.h>
if (fabs(f - 0.3) < 0.0001) {
    printf("Approximately equal\\n");
}
\`\`\`

### Logical Operators with if

\`\`\`c
int age = 20, income = 30000;
int hasDegree = 1;

// && = AND — dono conditions true honi chahiye
if (age >= 21 && income >= 25000) {
    printf("Loan approved\\n");
}

// || = OR — koi bhi ek true ho
if (hasDegree || income >= 50000) {
    printf("Job eligible\\n");
}

// ! = NOT
int isBlocked = 0;
if (!isBlocked) {
    printf("Account active\\n");
}

// Complex condition
if ((age >= 18 && age <= 60) && (income > 0 || hasDegree)) {
    printf("Eligible for scheme\\n");
}
\`\`\``,

      content_en: `## if / else — Teach Your Program to Think!

### Basic if / else

\`\`\`c
if (condition) {
 // when condition is true
} else {
 // when condition is false
}

int marks = 75;
if (marks >= 60) {
 printf("Pass! ✅\\n");
} else {
 printf("Fail! ❌\\n");
}
\`\`\`

### if / else if / else

\`\`\`c
int marks = 82;
if (marks >= 90) printf("Grade: A\\n");
else if (marks >= 75) printf("Grade: B\\n");
else if (marks >= 60) printf("Grade: C\\n");
else if (marks >= 45) printf("Grade: D\\n");
else printf("Grade: F\\n");
\`\`\`

### Ternary Operator

\`\`\`c
int marks = 75;
char *result = (marks >= 60) ? "Pass" : "Fail";
int max = (a > b) ? a : b;
\`\`\`

### Common Mistakes

\`\`\`c
// ❌ = vs == confusion
if (x = 10) { } // assignment — always true!
if (x == 10) { } // comparison ✅

// ❌ Floating point exact comparison
if (f == 0.3) { } // unreliable!
if (fabs(f-0.3) < 0.0001) // use tolerance ✅
\`\`\``,

      codeExample: `#include <stdio.h>

int main() {
    // ── ATM System simulation ──
    int pin;
    float balance = 10000.0f;
    float amount;
    int correctPin = 1234;

    printf("=== StudyEarn ATM ===\\n");
    printf("PIN daalo: ");
    scanf("%d", &pin);

    if (pin != correctPin) {
        printf("❌ Galat PIN! Access denied.\\n");
        return 1;  // error se exit
    }

    printf("✅ PIN sahi hai!\\n");
    printf("Balance: Rs %.2f\\n\\n", balance);

    printf("Kitna withdraw karna hai: Rs ");
    scanf("%f", &amount);

    if (amount <= 0) {
        printf("❌ Invalid amount!\\n");
    } else if (amount > balance) {
        printf("❌ Insufficient balance!\\n");
        printf("   Available: Rs %.2f\\n", balance);
    } else if (amount > 50000) {
        printf("❌ Daily limit exceeded (max Rs 50,000)!\\n");
    } else {
        balance -= amount;
        printf("✅ Rs %.2f successfully withdrawn!\\n", amount);
        printf("   Remaining balance: Rs %.2f\\n", balance);

        // Extra check
        if (balance < 1000) {
            printf("⚠️  Warning: Low balance!\\n");
        }
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    int pin;
    float balance = 10000.0f;
    float amount;
    int correctPin = 1234;

    printf("=== StudyEarn ATM ===\\n");
    printf("Enter PIN: ");
    scanf("%d", &pin);

    if (pin != correctPin) {
        printf("❌ Wrong PIN! Access denied.\\n");
        return 1;
    }

    printf("✅ PIN correct!\\n");
    printf("Balance: Rs %.2f\\n\\n", balance);

    printf("Amount to withdraw: Rs ");
    scanf("%f", &amount);

    if (amount <= 0) {
        printf("❌ Invalid amount!\\n");
    } else if (amount > balance) {
        printf("❌ Insufficient balance! Available: Rs %.2f\\n", balance);
    } else if (amount > 50000) {
        printf("❌ Daily limit exceeded (max Rs 50,000)!\\n");
    } else {
        balance -= amount;
        printf("✅ Rs %.2f withdrawn successfully!\\n", amount);
        printf("   Remaining balance: Rs %.2f\\n", balance);
        if (balance < 1000) printf("⚠️  Warning: Low balance!\\n");
    }

    return 0;
}`,

      task: {
        description: 'if/else practice: (1) "Electricity Bill Calculator" banao — units use karo (int), slabs ke hisaab se bill calculate karo: 0-100 units = Rs 2/unit, 101-200 = Rs 3/unit, 201-300 = Rs 5/unit, 300+ = Rs 7/unit. Total bill print karo. (2) "Triangle Type Checker" — 3 sides lo (float), valid triangle check karo (sum of any 2 sides > third side), phir type batao: Equilateral (sab equal), Isosceles (2 equal), Scalene (sab different).',
        description_en: 'Practise if/else: (1) Build an "Electricity Bill Calculator" — take units used (int), calculate the bill by slab: 0-100 units = Rs 2/unit, 101-200 = Rs 3/unit, 201-300 = Rs 5/unit, 300+ = Rs 7/unit. Print total bill. (2) "Triangle Type Checker" — take 3 sides (float), check if valid triangle (sum of any 2 sides > third side), then classify: Equilateral (all equal), Isosceles (2 equal), Scalene (all different).',
        hint: 'Electricity slabs: if(units<=100) bill=units*2; else if(units<=200) bill=100*2+(units-100)*3; — har slab ka pichla amount bhi add karo! Triangle validity: a+b>c && b+c>a && a+c>b.',
        hint_en: 'Electricity slabs: if(units<=100) bill=units*2; else if(units<=200) bill=100*2+(units-100)*3; — add the previous slab amounts too! Triangle validity: a+b>c && b+c>a && a+c>b.',
      },
      quiz: [
        {
          q: 'if (x = 5) aur if (x == 5) mein kya fark hai?',
          options: [
            'Koi fark nahi',
            'x = 5 assignment hai (x ko 5 assign karo, always true), x == 5 comparison hai (x 5 ke equal hai?). Yeh C ka most common bug hai!',
            'x = 5 comparison hai',
            'Dono same kaam karte hain',
          ],
          correct: 1,
          explanation: '= single equals = assignment (value store karo). == double equals = comparison (equal hai?). if(x = 5) mein: x ko 5 assign karo, phir 5 (non-zero = true) check karo — hamesha true! if(x == 5) mein: x ki value 5 se compare karo. Yeh C ka #1 beginner mistake hai. Tip: "Yoda style" — if(5 == x) likhne se accidentally assignment ho hi nahi sakta.',
          q_en: 'What is the difference between if (x = 5) and if (x == 5)?',
          options_en: [
            'No difference',
            'x = 5 is assignment (assign 5 to x — always true), x == 5 is comparison (is x equal to 5?). This is C\'s most common bug!',
            'x = 5 is a comparison',
            'Both do the same thing',
          ],
          explanation_en: '= single equals = assignment (store a value). == double equals = comparison (are they equal?). if(x = 5): assigns 5 to x, then checks 5 (non-zero = true) — always true! if(x == 5): compares x\'s value against 5. This is C\'s #1 beginner mistake. Tip: "Yoda style" — writing if(5 == x) makes it impossible to accidentally assign.',
        },
        {
          q: 'Ternary operator (a > b) ? a : b kya karta hai?',
          options: [
            'a aur b ka sum return karta hai',
            'Agar a > b true hai toh a return karo, warna b return karo — short if/else hai yeh',
            'a aur b compare karta hai aur 0 ya 1 return karta hai',
            'Error deta hai',
          ],
          correct: 1,
          explanation: 'Ternary operator: condition ? value_if_true : value_if_false. (a>b)?a:b = maximum of a and b. Yeh short form hai: if(a>b) return a; else return b; Ek line mein likhne ke liye useful hai, lekin complex logic ke liye regular if/else zyada readable hai.',
          q_en: 'What does the ternary operator (a > b) ? a : b do?',
          options_en: [
            'Returns the sum of a and b',
            'If a > b is true, return a; otherwise return b — it is a short if/else',
            'Compares a and b and returns 0 or 1',
            'Gives an error',
          ],
          explanation_en: 'Ternary operator: condition ? value_if_true : value_if_false. (a>b)?a:b = the maximum of a and b. It is shorthand for: if(a>b) return a; else return b; Useful for writing in one line, but for complex logic a regular if/else is more readable.',
        },
        {
          q: 'C mein else if ka main use kya hai?',
          options: [
            'Nested loops ke liye',
            'Multiple mutually exclusive conditions check karne ke liye — sirf ek branch run hogi, pehli true condition ka. Sab alag alag if likhne se better aur efficient.',
            'Function call ke liye',
            'Variables declare karne ke liye',
          ],
          correct: 1,
          explanation: 'else if chain: conditions sequentially check hoti hain, pehli true condition ka block run hota hai, baaki skip. Agar sab alag alag if likhein, toh sab check honge — unnecessary work. Grade system mein: marks=82 ke liye marks>=90 false hai → marks>=75 check hoga → true → "B grade" print → baki skip.',
          q_en: 'What is the main use of else if in C?',
          options_en: [
            'For nested loops',
            'To check multiple mutually exclusive conditions — only one branch runs, the first true one. Better and more efficient than separate if statements.',
            'For function calls',
            'To declare variables',
          ],
          explanation_en: 'An else if chain checks conditions sequentially and runs only the first true block, skipping the rest. Writing all separate if statements checks every one — unnecessary work. In a grade system: for marks=82, marks>=90 is false → check marks>=75 → true → print "B grade" → skip the rest.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w2-s2',
      title: 'switch Statement — Menu-driven Programs',
      title_en: 'switch Statement — Menu-driven Programs',
      emoji: '🎛️',
      content: `## switch — Multiple Fixed Options ke liye!

Jab ek variable ki kai fixed values check karni ho toh switch if/else se cleaner hota hai.

### Basic switch Syntax

\`\`\`c
switch (expression) {
    case value1:
        // jab expression == value1
        break;      // ← ZARURI! bina break ke fall-through hoga
    case value2:
        // jab expression == value2
        break;
    case value3:
        // jab expression == value3
        break;
    default:
        // jab koi case match na ho (optional lekin best practice)
        break;
}
\`\`\`

### Example — Day of Week

\`\`\`c
int day = 3;

switch (day) {
    case 1: printf("Monday\\n");    break;
    case 2: printf("Tuesday\\n");   break;
    case 3: printf("Wednesday\\n"); break;
    case 4: printf("Thursday\\n");  break;
    case 5: printf("Friday\\n");    break;
    case 6: printf("Saturday\\n");  break;
    case 7: printf("Sunday\\n");    break;
    default: printf("Invalid day\\n"); break;
}
// Output: Wednesday
\`\`\`

### Fall-through — break na likho toh kya hoga?

\`\`\`c
int x = 2;

switch (x) {
    case 1:
        printf("One\\n");
        // break nahi! fall-through →
    case 2:
        printf("Two\\n");
        // break nahi! fall-through →
    case 3:
        printf("Three\\n");
        break;
    case 4:
        printf("Four\\n");
        break;
}
// Output:
// Two    ← case 2 match hua
// Three  ← fall-through! break nahi tha case 2 mein
// (case 4 nahi print hoga — case 3 mein break tha)
\`\`\`

### Intentional Fall-through (Useful!)

\`\`\`c
int month = 4;

switch (month) {
    case 1: case 3: case 5: case 7:
    case 8: case 10: case 12:
        printf("31 days\\n");
        break;
    case 4: case 6: case 9: case 11:
        printf("30 days\\n");
        break;
    case 2:
        printf("28 or 29 days\\n");
        break;
    default:
        printf("Invalid month\\n");
}
\`\`\`

### char ke saath switch

\`\`\`c
char grade;
printf("Grade daalo (A/B/C/D/F): ");
scanf(" %c", &grade);

switch (grade) {
    case 'A':
    case 'a':
        printf("Excellent! 90+ marks\\n");
        break;
    case 'B':
    case 'b':
        printf("Good! 75-89 marks\\n");
        break;
    case 'C':
    case 'c':
        printf("Average. 60-74 marks\\n");
        break;
    case 'F':
    case 'f':
        printf("Fail. Below 60\\n");
        break;
    default:
        printf("Invalid grade\\n");
}
\`\`\`

### switch vs if/else — Kab Kya Use Karein?

\`\`\`
switch:                     if/else:
─────────────────────────   ──────────────────────────────
Fixed integer/char values   Ranges (marks >= 60)
Menu systems                Float comparisons
State machines              Complex boolean conditions
More readable for many      Only 2-3 options
fixed options               String comparisons (C switch mein nahi)
\`\`\``,

      content_en: `## switch — For Multiple Fixed Options!

### Basic switch Syntax

\`\`\`c
switch (expression) {
 case value1:
 // when expression == value1
 break; // ← REQUIRED! without break, fall-through occurs
 case value2:
 // when expression == value2
 break;
 default:
 break;
}
\`\`\`

### Fall-through — What happens without break?

\`\`\`c
int x = 2;
switch (x) {
 case 2:
 printf("Two\\n");
 // no break! falls through →
 case 3:
 printf("Three\\n");
 break;
}
// Output: Two
// Three ← fall-through!
\`\`\`

### Intentional Fall-through

\`\`\`c
switch (month) {
 case 4: case 6: case 9: case 11:
 printf("30 days\\n"); break;
 case 2:
 printf("28 or 29 days\\n"); break;
 default:
 printf("31 days\\n");
}
\`\`\`

### switch vs if/else

\`\`\`
switch: fixed integer/char values, menus, many fixed options
if/else: ranges, float comparisons, complex boolean logic
\`\`\``,

      codeExample: `#include <stdio.h>

int main() {
    int choice;
    float num1, num2, result;

    printf("╔═══════════════════════════╗\\n");
    printf("║    STUDYEARN CALCULATOR   ║\\n");
    printf("╠═══════════════════════════╣\\n");
    printf("║  1. Addition   (+)        ║\\n");
    printf("║  2. Subtraction (-)       ║\\n");
    printf("║  3. Multiplication (*)    ║\\n");
    printf("║  4. Division   (/)        ║\\n");
    printf("║  5. Modulo     (%%)        ║\\n");
    printf("╚═══════════════════════════╝\\n");

    printf("\\nOperation choose karo (1-5): ");
    scanf("%d", &choice);

    printf("Pehla number: ");
    scanf("%f", &num1);
    printf("Doosra number: ");
    scanf("%f", &num2);

    printf("\\n");

    switch (choice) {
        case 1:
            result = num1 + num2;
            printf("%.2f + %.2f = %.2f\\n", num1, num2, result);
            break;

        case 2:
            result = num1 - num2;
            printf("%.2f - %.2f = %.2f\\n", num1, num2, result);
            break;

        case 3:
            result = num1 * num2;
            printf("%.2f × %.2f = %.2f\\n", num1, num2, result);
            break;

        case 4:
            if (num2 == 0) {
                printf("❌ Error: Zero se divide nahi kar sakte!\\n");
            } else {
                result = num1 / num2;
                printf("%.2f ÷ %.2f = %.2f\\n", num1, num2, result);
            }
            break;

        case 5:
            if ((int)num2 == 0) {
                printf("❌ Error: Zero se modulo nahi ho sakta!\\n");
            } else {
                printf("%.0f %% %.0f = %d\\n", num1, num2, (int)num1 % (int)num2);
            }
            break;

        default:
            printf("❌ Invalid choice! 1-5 mein se choose karo.\\n");
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    int choice;
    float num1, num2, result;

    printf("=== STUDYEARN CALCULATOR ===\\n");
    printf("1. Addition\\n2. Subtraction\\n");
    printf("3. Multiplication\\n4. Division\\n5. Modulo\\n");
    printf("\\nChoose operation (1-5): ");
    scanf("%d", &choice);

    printf("First number:  "); scanf("%f", &num1);
    printf("Second number: "); scanf("%f", &num2);
    printf("\\n");

    switch (choice) {
        case 1: printf("%.2f + %.2f = %.2f\\n", num1, num2, num1+num2); break;
        case 2: printf("%.2f - %.2f = %.2f\\n", num1, num2, num1-num2); break;
        case 3: printf("%.2f * %.2f = %.2f\\n", num1, num2, num1*num2); break;
        case 4:
            if (num2 == 0) printf("❌ Cannot divide by zero!\\n");
            else printf("%.2f / %.2f = %.2f\\n", num1, num2, num1/num2);
            break;
        case 5:
            printf("%.0f %% %.0f = %d\\n", num1, num2, (int)num1%(int)num2);
            break;
        default:
            printf("❌ Invalid choice!\\n");
    }

    return 0;
}`,

      task: {
        description: 'switch practice: (1) "Student Grade System" — user se subject code lo (1=Math, 2=Science, 3=English, 4=Hindi, 5=Computer), phir us subject ke marks lo, grade calculate karo aur subject ka naam print karo. (2) "Day Type Checker" — day number lo (1-7), switch se batao: weekday hai ya weekend, aur uss din ka naam. (3) "Roman Numeral" converter — 1 se 10 tak integers ko Roman numerals mein convert karo switch se.',
        description_en: 'Practise switch: (1) "Student Grade System" — take a subject code (1=Math, 2=Science, 3=English, 4=Hindi, 5=Computer), then take marks, calculate the grade and print the subject name. (2) "Day Type Checker" — take a day number (1-7), use switch to say: weekday or weekend, and the name of the day. (3) "Roman Numeral" converter — convert integers 1 to 10 into Roman numerals using switch.',
        hint: 'Grade system: switch se subject naam aur input lo, phir if/else se grade calculate karo. Fall-through: case 6: case 7: printf("Weekend"); Roman: case 1: printf("I"); case 4: printf("IV"); case 5: printf("V"); etc.',
        hint_en: 'Grade system: use switch for subject name and input, then if/else to calculate grade. Fall-through: case 6: case 7: printf("Weekend"); Roman: case 1: printf("I"); case 4: printf("IV"); case 5: printf("V"); etc.',
      },
      quiz: [
        {
          q: 'switch statement mein break kyun zaruri hai?',
          options: [
            'Sirf style ke liye',
            'Bina break ke "fall-through" hota hai — matching case ke baad sab agle cases bhi run hote hain jab tak break na mile. Zyada tar yeh unintended bug hota hai.',
            'break se program exit hota hai',
            'Compiler error aata hai bina break ke',
          ],
          correct: 1,
          explanation: 'switch mein fall-through: ek case match hone ke baad, break nahi hai toh sab agle cases bhi execute hote hain (conditions check kiye bina). Yeh usually bug hota hai, lekin kabhi kabhi intentional bhi hota hai (jaise multiple cases ek hi block ke liye). Hamesha break lagao jab tak intentionally fall-through na chahiye ho.',
          q_en: 'Why is break necessary in a switch statement?',
          options_en: [
            'Just for style',
            'Without break, "fall-through" occurs — after the matching case, all subsequent cases also run until a break is found. This is usually an unintended bug.',
            'break exits the program',
            'The compiler gives an error without break',
          ],
          explanation_en: 'Fall-through in switch: after a matching case, if there is no break, all subsequent cases execute too (without checking conditions). This is usually a bug, but sometimes intentional (e.g. multiple cases sharing one block). Always add break unless you intentionally want fall-through.',
        },
        {
          q: 'switch statement mein default kab use karte hain?',
          options: [
            'Default variable declare karne ke liye',
            'Jab koi bhi case match na ho tab execute hota hai — error handling, invalid input ke liye. Optional hai lekin best practice hai.',
            'Default hamesha pehle likhna chahiye',
            'Sirf string values ke liye',
          ],
          correct: 1,
          explanation: 'default: jab expression ki value kisi bhi case se match nahi karti. Calculator mein: user ne 6 type kiya (invalid) → default case run hoga "Invalid choice!" print karega. Best practice: hamesha default rakho — unexpected input gracefully handle hogi. Position: traditionally last mein, lekin kahi bhi rakh sakte hain.',
          q_en: 'When do we use default in a switch statement?',
          options_en: [
            'To declare a default variable',
            'It executes when no case matches — for error handling and invalid input. It is optional but best practice.',
            'default must always be written first',
            'Only for string values',
          ],
          explanation_en: "default: runs when the expression's value doesn't match any case. In a calculator: user typed 6 (invalid) → default case runs and prints \"Invalid choice!\". Best practice: always include default — it handles unexpected input gracefully. Position: traditionally last, but can be placed anywhere.",
        },
        {
          q: 'C mein switch kaunse data types ke saath kaam karta hai?',
          options: [
            'Sirf int',
            'Integer types (int, short, long, char) aur enums. Float, double, string ke saath NAHI kaam karta.',
            'Sab data types',
            'Sirf char',
          ],
          correct: 1,
          explanation: 'switch sirf integer-compatible types ke saath kaam karta hai: int, short, long, char, enum. Float/double nahi — kyunki floating point exact equality bohot risky hai. String nahi — C strings pointers hain, direct comparison nahi hoti. Strings ke liye: if-else with strcmp() use karo.',
          q_en: 'Which data types does switch work with in C?',
          options_en: [
            'Only int',
            'Integer types (int, short, long, char) and enums. NOT float, double, or strings.',
            'All data types',
            'Only char',
          ],
          explanation_en: 'switch only works with integer-compatible types: int, short, long, char, enum. Not float/double — because floating-point exact equality is very unreliable. Not strings — C strings are pointers and cannot be compared directly. For strings: use if-else with strcmp().',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w2-s3',
      title: 'Loops — for, while, do-while',
      title_en: 'Loops — for, while, do-while',
      emoji: '🔄',
      content: `## Loops — Repetition ka Power!

Ek kaam baar baar karna hai? Loop use karo!
Bina loop ke: printf("1\\n"); printf("2\\n"); ... 100 baar likhna padega.
Loop se: ek hi baar likho, 100 baar chale!

### for Loop — Jab Count Pata Ho

\`\`\`c
// Syntax
for (initialization; condition; update) {
    // body
}

// 1 se 10 tak print karo
for (int i = 1; i <= 10; i++) {
    printf("%d ", i);
}
// Output: 1 2 3 4 5 6 7 8 9 10

// Count down
for (int i = 10; i >= 1; i--) {
    printf("%d ", i);
}
// Output: 10 9 8 7 6 5 4 3 2 1

// Step 2 se
for (int i = 0; i <= 20; i += 2) {
    printf("%d ", i);
}
// Output: 0 2 4 6 8 10 12 14 16 18 20

// Nested for loop — multiplication table
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        printf("%d×%d=%-3d ", i, j, i*j);
    }
    printf("\\n");
}
\`\`\`

### while Loop — Jab Count Pata Na Ho

\`\`\`c
// Syntax
while (condition) {
    // body (jab tak condition true ho)
}

// User 0 type kare tab tak numbers lo
int num;
int sum = 0;
printf("Numbers daalo (0 se stop): \\n");
while (1) {  // infinite loop
    scanf("%d", &num);
    if (num == 0) break;  // exit
    sum += num;
}
printf("Sum: %d\\n", sum);

// Digits count karo
int n = 12345;
int count = 0;
while (n > 0) {
    n /= 10;     // last digit hata do
    count++;
}
printf("Digits: %d\\n", count);  // 5
\`\`\`

### do-while Loop — Kam se Kam Ek Baar

\`\`\`c
// Syntax — condition BAAD mein check hoti hai
do {
    // body (at least once chalega)
} while (condition);

// Password system
char password[20];
do {
    printf("Password daalo: ");
    scanf("%s", password);

    if (strcmp(password, "secret123") != 0) {
        printf("Galat password! Try again.\\n");
    }
} while (strcmp(password, "secret123") != 0);

printf("Login successful!\\n");
\`\`\`

### break aur continue

\`\`\`c
// break — loop se bahar niklo
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;     // 5 pe stop
    printf("%d ", i);
}
// Output: 1 2 3 4

// continue — iss iteration skip karo
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;  // even numbers skip
    printf("%d ", i);
}
// Output: 1 3 5 7 9

// Nested loop mein break — sirf inner loop se nikalta hai!
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) break;  // sirf inner loop break
        printf("(%d,%d) ", i, j);
    }
}
// Output: (1,1) (2,1) (3,1)
\`\`\`

### Teen Loops ka Comparison

\`\`\`
for loop:       Jab iterations ki count pehle se pata ho (1 to n)
while loop:     Jab condition pe depend karo, count pata nahi
do-while loop:  Jab body kam se kam ek baar chalani ho (menu, login)
\`\`\``,

      content_en: `## Loops — The Power of Repetition!

### for Loop — When You Know were Count

\`\`\`c
for (initialization; condition; update) {
 // body
}

for (int i = 1; i <= 10; i++) printf("%d ", i); // 1 to 10
for (int i = 10; i >= 1; i--) printf("%d ", i); // countdown
for (int i = 0; i <= 20; i += 2) printf("%d ", i); // even numbers

// Nested — multiplication table
for (int i = 1; i <= 3; i++) {
 for (int j = 1; j <= 3; j++)
 printf("%d×%d=%-3d ", i, j, i*j);
 printf("\\n");
}
\`\`\`

### while Loop — When Count is Unknown

\`\`\`c
while (condition) { /* body */ }

int n = 12345, count = 0;
while (n > 0) { n /= 10; count++; }
printf("Digits: %d\\n", count); // 5
\`\`\`

### do-while — At Least Once

\`\`\`c
do {
 // runs at least once
} while (condition);
\`\`\`

### break and continue

\`\`\`c
for (int i=1; i<=10; i++) {
 if (i==5) break; // stop at 5: 1 2 3 4
}

for (int i=1; i<=10; i++) {
 if (i%2==0) continue; // skip evens: 1 3 5 7 9
}
\`\`\``,

      codeExample: `#include <stdio.h>

int main() {
    int n;
    printf("Table kitne tak chahiye? ");
    scanf("%d", &n);

    // ── Multiplication Table ──
    printf("\\n=== %d ka Pahada ===\\n", n);
    for (int i = 1; i <= 10; i++) {
        printf("%d × %2d = %3d\\n", n, i, n * i);
    }

    // ── Sum of digits ──
    printf("\\n=== Digit Sum ===\\n");
    int num;
    printf("Koi number daalo: ");
    scanf("%d", &num);

    int original = num;
    int digitSum = 0;
    while (num > 0) {
        digitSum += num % 10;  // last digit
        num /= 10;             // remove last digit
    }
    printf("Sum of digits of %d = %d\\n", original, digitSum);

    // ── Number Guessing Game ──
    printf("\\n=== Number Guessing Game ===\\n");
    int secret = 42;
    int guess;
    int attempts = 0;

    do {
        printf("Guess (1-100): ");
        scanf("%d", &guess);
        attempts++;

        if (guess < secret)       printf("Too low!  ↑\\n");
        else if (guess > secret)  printf("Too high! ↓\\n");
        else                      printf("🎉 Correct! %d attempts mein guess kiya!\\n", attempts);

    } while (guess != secret);

    // ── Pattern printing ──
    printf("\\n=== Star Pattern ===\\n");
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    int n;
    printf("Print table for which number? ");
    scanf("%d", &n);

    printf("\\n=== Multiplication Table of %d ===\\n", n);
    for (int i = 1; i <= 10; i++)
        printf("%d x %2d = %3d\\n", n, i, n*i);

    printf("\\n=== Digit Sum ===\\n");
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    int orig = num, sum = 0;
    while (num > 0) { sum += num % 10; num /= 10; }
    printf("Sum of digits of %d = %d\\n", orig, sum);

    printf("\\n=== Number Guessing Game ===\\n");
    int secret = 42, guess, attempts = 0;
    do {
        printf("Guess (1-100): "); scanf("%d", &guess); attempts++;
        if      (guess < secret) printf("Too low!\\n");
        else if (guess > secret) printf("Too high!\\n");
        else printf("Correct! Guessed in %d attempts!\\n", attempts);
    } while (guess != secret);

    printf("\\n=== Star Pattern ===\\n");
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) printf("* ");
        printf("\\n");
    }

    return 0;
}`,

      task: {
        description: 'Loops practice: (1) Prime numbers nikalo — 2 se 100 tak saare prime numbers print karo. (2) Fibonacci series — user se n lo, n terms ki Fibonacci series print karo (0,1,1,2,3,5,8...). (3) "Pattern Program" — user se size lo, uska naam wala diamond/pyramid banao nested loops se. (4) "Reverse a Number" — user se number lo (while loop), uska reverse print karo (e.g. 12345 → 54321).',
        description_en: 'Practise loops: (1) Find primes — print all prime numbers from 2 to 100. (2) Fibonacci series — take n from the user, print n terms of the Fibonacci series (0,1,1,2,3,5,8...). (3) "Pattern Program" — take a size, build a diamond/pyramid using nested loops. (4) "Reverse a Number" — take a number (while loop), print its reverse (e.g. 12345 → 54321).',
        hint: 'Prime: for each n, check if any number from 2 to n-1 divides it (better: to sqrt(n)). Fibonacci: prev=0, curr=1, next=prev+curr. Reverse: while(n>0) { rev=rev*10 + n%10; n/=10; }',
        hint_en: 'Prime: for each n, check if any number from 2 to n-1 divides it (better: up to sqrt(n)). Fibonacci: prev=0, curr=1, next=prev+curr. Reverse: while(n>0) { rev=rev*10 + n%10; n/=10; }',
      },
      quiz: [
        {
          q: 'for, while, do-while mein se kaunsa loop body hamesha kam se kam ek baar run karega?',
          options: [
            'for loop',
            'while loop',
            'do-while loop — condition loop ke BAAD check hoti hai, isliye body pehli baar zaroor run hogi',
            'Teeno hamesha ek baar run karte hain',
          ],
          correct: 2,
          explanation: 'do-while: body → condition check. Isliye body kam se kam ek baar chalti hai, chahe condition false bhi ho. for/while: pehle condition check → tab body. Agar condition initially false hai, for/while loop body bilkul nahi chalegi. Use case: menus (user ko ek option dikhana zaruri hai), login retry systems.',
          q_en: 'Which loop will always run the body at least once?',
          options_en: [
            'for loop',
            'while loop',
            'do-while loop — the condition is checked AFTER the body, so the body runs at least once',
            'All three always run once',
          ],
          explanation_en: 'do-while: body → check condition. So the body runs at least once, even if the condition is false. for/while: check condition → then body. If the condition is initially false, the for/while body never runs. Use cases: menus (need to show the user an option at least once), login retry systems.',
        },
        {
          q: 'C mein infinite loop kaise banate hain aur use kaise exit karo?',
          options: [
            'while(true) se infinite loop banta hai aur exit nahi hota',
            'while(1) { ... if(condition) break; } — 1 hamesha true hai, break se exit karo specific condition pe',
            'for(;;) se infinite loop nahi banta',
            'Infinite loop banani hi nahi chahiye',
          ],
          correct: 1,
          explanation: 'C mein true/false (C99 se pehle) ke liye 1/0 use karte hain. while(1) ya for(;;) dono infinite loops hain. break se exit karo jab zaruri ho. Use cases: game loops, server loops, menu systems. Warning: hamesha ek exit condition honi chahiye warna program hang ho jaata hai!',
          q_en: 'How do you create an infinite loop in C and how do you exit it?',
          options_en: [
            'while(true) creates an infinite loop and there is no exit',
            'while(1) { ... if(condition) break; } — 1 is always true, use break to exit on a specific condition',
            'for(;;) does not create an infinite loop',
            'Infinite loops should never be created',
          ],
          explanation_en: 'In C (before C99), 1/0 are used for true/false. while(1) and for(;;) are both infinite loops. Use break to exit when needed. Use cases: game loops, server loops, menu systems. Warning: always have an exit condition, otherwise the program hangs!',
        },
        {
          q: 'break aur continue mein kya fark hai?',
          options: [
            'Koi fark nahi — dono loop band karte hain',
            'break = loop se completely bahar niklo. continue = sirf current iteration skip karo, loop continue rehta hai.',
            'continue = loop band karo, break = next iteration pe jao',
            'Sirf while loops mein kaam karte hain',
          ],
          correct: 1,
          explanation: 'break: loop se exit — baaki iterations nahi chalenge. continue: current iteration ka baaki code skip karo aur next iteration pe jao — loop continue rehta hai. Example: even numbers skip karne ke liye continue, kisi condition pe poora loop band karne ke liye break.',
          q_en: 'What is the difference between break and continue?',
          options_en: [
            'No difference — both stop the loop',
            'break = exit the loop completely. continue = skip only the current iteration, the loop continues.',
            'continue = stop the loop, break = go to the next iteration',
            'They only work in while loops',
          ],
          explanation_en: 'break: exits the loop — remaining iterations do not run. continue: skips the rest of the current iteration and moves to the next one — the loop continues. Example: use continue to skip even numbers, use break to stop the entire loop on a condition.',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w2-s4',
      title: 'Week 2 Project — Number Games aur Patterns',
      title_en: 'Week 2 Project — Number Games and Patterns',
      emoji: '🏗️',
      content: `## Week 2 Project — Sab Combine Karo!

Is hafte seekha:
- if/else — decisions
- switch — menu systems
- for loop — counted repetition
- while loop — condition-based
- do-while — at least once
- break/continue

Ab ek complete **interactive menu-driven program** banao!

### Project: StudyEarn Number Workshop

\`\`\`
Menu:
1. Check Even/Odd aur Positive/Negative
2. Prime Number Check
3. Fibonacci Series generate karo
4. Reverse karo number
5. Armstrong Number Check
6. Star Patterns print karo
7. Exit
\`\`\`

### Important Concepts Review

\`\`\`c
// Armstrong Number — har digit ka cube sum = number khud
// Example: 153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 ✅
int isArmstrong(int n) {
    int original = n;
    int sum = 0;
    while (n > 0) {
        int digit = n % 10;
        sum += digit * digit * digit;
        n /= 10;
    }
    return sum == original;
}

// Prime Number Check
int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++) {  // sqrt(n) tak check karo
        if (n % i == 0) return 0;        // divisible = not prime
    }
    return 1;  // prime!
}

// Reverse Number
int reverseNum(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}
\`\`\`

### GCD aur LCM (Bonus)

\`\`\`c
// GCD — Euclidean Algorithm (elegant aur efficient!)
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// LCM = (a * b) / GCD(a, b)
int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;  // overflow avoid karne ke liye
}

// Example
printf("GCD(12, 18) = %d\\n", gcd(12, 18));  // 6
printf("LCM(4, 6)   = %d\\n", lcm(4, 6));    // 12
\`\`\`

### Star Patterns — Nested Loops ka Magic

\`\`\`c
// Pattern 1: Right Triangle
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) printf("* ");
    printf("\\n");
}
// *
// * *
// * * *
// * * * *
// * * * * *

// Pattern 2: Inverted Triangle
for (int i = 5; i >= 1; i--) {
    for (int j = 1; j <= i; j++) printf("* ");
    printf("\\n");
}

// Pattern 3: Pyramid
int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n-i; j++) printf(" ");  // spaces
    for (int j = 1; j <= 2*i-1; j++) printf("*"); // stars
    printf("\\n");
}
//     *
//    ***
//   *****
//  *******
// *********
\`\`\``,

      content_en: `## Week 2 Project — Combine Everything!

This week covered: if/else, switch, for, while, do-while, break/continue.

Now build a complete **interactive menu-driven program**!

### Key Concepts Review

\`\`\`c
// Armstrong Number: sum of cubes of digits == number
// 153 = 1³ + 5³ + 3³ = 153 ✅
int isArmstrong(int n) {
 int orig=n, sum=0;
 while(n>0) { int d=n%10; sum+=d*d*d; n/=10; }
 return sum==orig;
}

// Prime — check up to sqrt(n)
int isPrime(int n) {
 if(n<=1) return 0;
 for(int i=2; i*i<=n; i++) if(n%i==0) return 0;
 return 1;
}

// GCD — Euclidean Algorithm
int gcd(int a, int b) {
 while(b) { int t=b; b=a%b; a=t; }
 return a;
}
\`\`\`

### Star Patterns

\`\`\`c
// Pyramid
for(int i=1; i<=n; i++) {
 for(int j=1; j<=n-i; j++) printf(" ");
 for(int j=1; j<=2*i-1; j++) printf("*");
 printf("\\n");
}
\`\`\``,

      codeExample: `#include <stdio.h>

// ── Helper functions ──
int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

int isArmstrong(int n) {
    int orig = n, sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d * d;
        n /= 10;
    }
    return sum == orig;
}

int reverseNum(int n) {
    int rev = 0;
    while (n > 0) { rev = rev*10 + n%10; n /= 10; }
    return rev;
}

void printPyramid(int rows) {
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= rows-i; j++) printf(" ");
        for (int j = 1; j <= 2*i-1; j++) printf("*");
        printf("\\n");
    }
}

int main() {
    int choice, num;

    do {
        printf("\\n╔══════════════════════════════╗\\n");
        printf("║   NUMBER WORKSHOP MENU       ║\\n");
        printf("╠══════════════════════════════╣\\n");
        printf("║ 1. Even/Odd + Positive check ║\\n");
        printf("║ 2. Prime Number check        ║\\n");
        printf("║ 3. Fibonacci Series          ║\\n");
        printf("║ 4. Reverse a number          ║\\n");
        printf("║ 5. Armstrong check           ║\\n");
        printf("║ 6. Star Pyramid              ║\\n");
        printf("║ 7. EXIT                      ║\\n");
        printf("╚══════════════════════════════╝\\n");
        printf("Choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Number: "); scanf("%d", &num);
                printf("%d is %s and %s\\n", num,
                    (num % 2 == 0) ? "EVEN" : "ODD",
                    (num > 0) ? "POSITIVE" : (num < 0) ? "NEGATIVE" : "ZERO");
                break;

            case 2:
                printf("Number: "); scanf("%d", &num);
                printf("%d is %s\\n", num, isPrime(num) ? "PRIME ✅" : "NOT PRIME ❌");
                break;

            case 3: {
                int n;
                printf("How many terms: "); scanf("%d", &n);
                int a=0, b=1;
                printf("Fibonacci: ");
                for (int i=0; i<n; i++) {
                    printf("%d ", a);
                    int temp = a + b;
                    a = b; b = temp;
                }
                printf("\\n");
                break;
            }

            case 4:
                printf("Number: "); scanf("%d", &num);
                printf("Reverse of %d = %d\\n", num, reverseNum(num));
                break;

            case 5:
                printf("Number: "); scanf("%d", &num);
                printf("%d is %s\\n", num, isArmstrong(num) ? "ARMSTRONG ✅" : "NOT ARMSTRONG ❌");
                break;

            case 6: {
                int rows;
                printf("Rows (1-10): "); scanf("%d", &rows);
                printPyramid(rows);
                break;
            }

            case 7:
                printf("\\n👋 Bye! Keep coding!\\n");
                break;

            default:
                printf("❌ Invalid! 1-7 mein choose karo.\\n");
        }

    } while (choice != 7);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int isPrime(int n) {
    if(n<=1) return 0;
    for(int i=2; i*i<=n; i++) if(n%i==0) return 0;
    return 1;
}
int isArmstrong(int n) {
    int orig=n,sum=0;
    while(n>0){int d=n%10;sum+=d*d*d;n/=10;}
    return sum==orig;
}
int reverseNum(int n) {
    int rev=0;
    while(n>0){rev=rev*10+n%10;n/=10;}
    return rev;
}
void printPyramid(int rows) {
    for(int i=1;i<=rows;i++){
        for(int j=1;j<=rows-i;j++) printf(" ");
        for(int j=1;j<=2*i-1;j++) printf("*");
        printf("\\n");
    }
}

int main() {
    int choice, num;
    do {
        printf("\\n=== NUMBER WORKSHOP ===\\n");
        printf("1.Even/Odd  2.Prime  3.Fibonacci\\n");
        printf("4.Reverse   5.Armstrong  6.Pyramid  7.Exit\\n");
        printf("Choice: "); scanf("%d",&choice);

        switch(choice) {
            case 1: scanf("%d",&num);
                printf("%d: %s, %s\\n",num,num%2?"ODD":"EVEN",num>0?"POS":num<0?"NEG":"ZERO"); break;
            case 2: scanf("%d",&num);
                printf("%d: %s\\n",num,isPrime(num)?"PRIME":"NOT PRIME"); break;
            case 3: {int n,a=0,b=1; scanf("%d",&n);
                for(int i=0;i<n;i++){printf("%d ",a);int t=a+b;a=b;b=t;} printf("\\n"); break;}
            case 4: scanf("%d",&num);
                printf("Reverse: %d\\n",reverseNum(num)); break;
            case 5: scanf("%d",&num);
                printf("%d: %s\\n",num,isArmstrong(num)?"ARMSTRONG":"NOT"); break;
            case 6: {int r; scanf("%d",&r); printPyramid(r); break;}
            case 7: printf("Bye!\\n"); break;
            default: printf("Invalid!\\n");
        }
    } while(choice!=7);
    return 0;
}`,

      task: {
        description: 'Week 2 Final Project — Number Workshop upgrade karo: (1) Menu mein add karo: "Perfect Number Check" (number = sum of its proper divisors, e.g. 6 = 1+2+3), (2) "Palindrome Check" — number aur string dono ke liye, (3) "All Armstrong numbers 1-1000 nikalo", (4) "Pascal Triangle" — user se rows lo aur Pascal triangle print karo (nested loops + combinations), (5) "GCD aur LCM" calculator add karo.',
        description_en: 'Week 2 Final Project — Upgrade the Number Workshop: (1) Add "Perfect Number Check" (number = sum of its proper divisors, e.g. 6 = 1+2+3), (2) "Palindrome Check" — for both numbers and strings, (3) "Find all Armstrong numbers from 1 to 1000", (4) "Pascal Triangle" — take rows from user and print it (nested loops + combinations), (5) Add a "GCD and LCM" calculator.',
        hint: 'Perfect number: sum=0; for(i=1;i<n;i++) if(n%i==0) sum+=i; return sum==n. Palindrome number: reverse karo aur compare karo. Pascal: C(n,k) = C(n-1,k-1) + C(n-1,k), ya factorial formula use karo.',
        hint_en: 'Perfect number: sum=0; for(i=1;i<n;i++) if(n%i==0) sum+=i; return sum==n. Palindrome number: reverse it and compare. Pascal: C(n,k) = C(n-1,k-1) + C(n-1,k), or use the factorial formula.',
      },
      quiz: [
        {
          q: 'Armstrong number kya hota hai? 153 example se samjhao.',
          options: [
            'Wo number jo prime bhi ho aur palindrome bhi',
            '153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 — jis number ki har digit ka cube sum = woh number khud. Yeh 3-digit Armstrong number hai.',
            'Reverse karne pe same rahta hai',
            'Sirf even numbers hote hain',
          ],
          correct: 1,
          explanation: '3-digit Armstrong (narcissistic) number: n = a³ + b³ + c³ jahan abc digits hain. 153: 1³+5³+3³ = 1+125+27 = 153 ✅. 370: 3³+7³+0³ = 27+343+0 = 370 ✅. 4-digit ke liye 4th power use hoti hai. Code: while(n>0){d=n%10; sum+=d*d*d; n/=10;} return sum==original.',
          q_en: 'What is an Armstrong number? Explain with the example of 153.',
          options_en: [
            'A number that is both prime and a palindrome',
            '153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 — a number where the sum of the cubes of each digit equals the number itself. This is a 3-digit Armstrong number.',
            'A number that remains the same when reversed',
            'Only even numbers',
          ],
          explanation_en: '3-digit Armstrong (narcissistic) number: n = a³ + b³ + c³ where abc are the digits. 153: 1³+5³+3³ = 1+125+27 = 153 ✅. 370: 3³+7³+0³ = 27+343+0 = 370 ✅. For 4-digit numbers the 4th power is used. Code: while(n>0){d=n%10; sum+=d*d*d; n/=10;} return sum==original.',
        },
        {
          q: 'Prime check mein i*i <= n kyun use karte hain i <= n/2 ki jagah?',
          options: [
            'Dono same hain',
            'i*i <= n matlab i <= sqrt(n) tak check karo. Agar n mein sqrt(n) se bada factor hai, toh uska corresponding chhota factor pehle hi mil chuka hoga. Isliye sqrt(n) tak kaafi hai — zyada efficient!',
            'i*i overflow hota hai',
            'n/2 galat answer deta hai',
          ],
          correct: 1,
          explanation: 'Optimization: agar n=36 prime nahi, toh 36=2×18=3×12=4×9=6×6. Notice: 6 ke baad factors repeat hone lagte hain. sqrt(36)=6. Isliye sqrt(n) tak check karna kaafi hai. i<=n/2 se zyada iterations — slow. i*i<=n se sqrt(n) tak — faster. Large numbers pe yeh difference bahut bada hota hai!',
          q_en: 'In prime checking, why use i*i <= n instead of i <= n/2?',
          options_en: [
            'Both are the same',
            'i*i <= n means check only up to sqrt(n). If n has a factor larger than sqrt(n), its corresponding smaller factor would already have been found. So checking up to sqrt(n) is enough — and much more efficient!',
            'i*i causes overflow',
            'n/2 gives the wrong answer',
          ],
          explanation_en: 'Optimisation: if n=36 is not prime, then 36=2×18=3×12=4×9=6×6. Notice: factors repeat after 6. sqrt(36)=6. So checking up to sqrt(n) is sufficient. i<=n/2 means more iterations — slow. i*i<=n goes up to sqrt(n) — faster. For large numbers this difference is enormous!',
        },
        {
          q: 'do-while loop menu systems ke liye kyun best choice hai?',
          options: [
            'Fastest loop hai',
            'Menu kam se kam ek baar dikhana zaruri hai — do-while body pehle run karta hai phir condition check karta hai. User "exit" choose kare tab tak loop chalti rehti hai.',
            'while loop menu mein kaam nahi karta',
            'do-while zyada memory efficient hai',
          ],
          correct: 1,
          explanation: 'Menu systems ke liye: pehle options dikhao (body), phir user ka choice check karo (condition). Agar while(choice != 7) likhein, toh choice undefined hogi pehle — undefined behavior! do-while guarantee karta hai ki menu ek baar dikhega, user input loge, phir check karoge. Bilkul sahi pattern hai menu ke liye.',
          q_en: 'Why is a do-while loop the best choice for menu systems?',
          options_en: [
            'It is the fastest loop',
            'The menu must be shown at least once — do-while runs the body first then checks the condition. The loop continues until the user chooses "exit".',
            'while loops do not work for menus',
            'do-while is more memory efficient',
          ],
          explanation_en: "For menu systems: show the options first (body), then check the user's choice (condition). If you write while(choice != 7), choice is undefined at first — undefined behaviour! do-while guarantees the menu is shown once, you get user input, then you check. It is exactly the right pattern for a menu.",
        },
      ],
    },
  ],
};