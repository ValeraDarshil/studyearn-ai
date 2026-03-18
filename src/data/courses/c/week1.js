/**
 * StudyEarn AI — C Programming Course
 * Week 1: C Ka Introduction — Computer Science ka Foundation
 * Hinglish + English bilingual, 4 sections, fully detailed
 */

export const C_WEEK_1 = {
  week: 1,
  title: 'C Ka Introduction — Computer Science ka Foundation',
  title_en: 'Introduction to C — The Foundation of Computer Science',
  description: 'C programming kya hai, kyun seekhein, aur apna pehla program likho — Hello World se shuru karo!',
  description_en: 'What is C programming, why learn it, and write your first program — start with Hello World!',
  xpReward: 150,
  sections: [
    {
      id: 'c-w1-s1',
      title: 'C Kya Hai aur Kyun Seekhein?',
      title_en: 'What is C and Why Learn It?',
      emoji: '⚙️',
      content: `## C Programming — Har Language ki Maa!

**C** duniya ki sabse important programming language hai. 1972 mein Dennis Ritchie ne banai thi — aur aaj bhi equally powerful hai!

### C Kyun Seekhein?

\`\`\`
C sikhne ke baad:
  ✅ Computer memory kaise kaam karta hai — samajh aayega
  ✅ Python, Java, C++, JavaScript — sab aasaan ho jaayenge
  ✅ Operating systems, embedded systems, games — sab C mein
  ✅ Competitive programming mein sabse fast language
  ✅ FAANG interviews mein bohot kaam aata hai
\`\`\`

### C Kahan Use Hota Hai?

\`\`\`c
// C se bane famous cheezein:
Linux Kernel         ← poora Linux OS C mein likha hai
Windows (core)       ← Microsoft ka OS bhi C use karta hai
Python Interpreter   ← CPython C mein bana hai!
Git                  ← version control tool
MySQL, PostgreSQL    ← databases C mein hain
Arduino/Raspberry Pi ← embedded programming
Game Engines         ← low-level game development
\`\`\`

### C vs Other Languages

\`\`\`
Language    Speed    Memory Control    Learning
─────────────────────────────────────────────────
C           ⚡⚡⚡⚡⚡   Manual (you decide)   Moderate
C++         ⚡⚡⚡⚡     Manual + OOP        Hard
Java        ⚡⚡⚡       Automatic (GC)      Moderate
Python      ⚡⚡         Automatic (GC)      Easy
JavaScript  ⚡⚡⚡       Automatic (GC)      Easy
─────────────────────────────────────────────────
C fastest + most control, but more responsibility!
\`\`\`

### C ka Basic Structure

\`\`\`c
// Yeh ek complete C program hai
#include <stdio.h>      // Header file — stdio = standard input/output

int main() {            // main() — program yahan se shuru hota hai
    printf("Hello!");   // output print karo
    return 0;           // 0 matlab "program successfully completed"
}
\`\`\`

**Har line ka matlab:**

| Line | Matlab |
|------|--------|
| \`#include <stdio.h>\` | printf/scanf use karne ke liye zaruri library |
| \`int main()\` | Program ka starting point — hamesha yahi hota hai |
| \`printf("...")\` | Screen pe text print karo |
| \`return 0;\` | OS ko batao program theek se chala |

### Compilation Process — C kaise Kaam Karta Hai

\`\`\`
Source Code (.c file)
      ↓
  Preprocessor    → #include, #define process karo
      ↓
   Compiler       → C code → Assembly code
      ↓
   Assembler      → Assembly → Machine code (.o file)
      ↓
    Linker         → Libraries attach karo → Executable (.exe/.out)
      ↓
  Execution       → CPU directly run karta hai!
\`\`\`

Python mein sirf type karo aur run karo — C mein **pehle compile** karna padta hai. Yahi C ko itna fast banata hai!`,

      content_en: `## C Programming — The Mother of All Languages!

**C** is the most important programming language in the world. Created by Dennis Ritchie in 1972 — and still equally powerful today!

### Why Learn C?

\`\`\`
After learning C:
  ✅ Understand how computer memory actually works
  ✅ Python, Java, C++, JavaScript — all become easier
  ✅ Operating systems, embedded systems, games — all use C
  ✅ Fastest language for competitive programming
  ✅ Very useful in FAANG interviews
\`\`\`

### Where is C Used?

\`\`\`c
// Famous things built in C:
Linux Kernel         ← entire Linux OS written in C
Windows (core)       ← Microsoft's OS uses C too
Python Interpreter   ← CPython is written in C!
Git                  ← version control tool
MySQL, PostgreSQL    ← databases are in C
Arduino/Raspberry Pi ← embedded programming
Game Engines         ← low-level game development
\`\`\`

### C's Basic Structure

\`\`\`c
#include <stdio.h>      // Header file — stdio = standard input/output

int main() {            // main() — program starts here
    printf("Hello!");   // print output to screen
    return 0;           // 0 means "program completed successfully"
}
\`\`\`

### Compilation Process

\`\`\`
Source Code (.c file)
      ↓
  Preprocessor    → process #include, #define
      ↓
   Compiler       → C code → Assembly
      ↓
   Assembler      → Assembly → Machine code (.o)
      ↓
    Linker         → attach libraries → Executable
      ↓
  Execution       → CPU runs it directly!
\`\`\`

In Python you just type and run — in C you **compile first**. This is what makes C so fast!`,

      codeExample: `#include <stdio.h>

int main() {
    // ── C ka pehla program ──
    printf("Namaste Duniya!\\n");
    printf("Main C programming seekh raha hoon!\\n");
    printf("\\n");

    // Kuch interesting facts
    printf("=== C ke baare mein Interesting Facts ===\\n");
    printf("1. C 1972 mein banai gayi thi\\n");
    printf("2. Linux kernel 97%% C mein likha hai\\n");
    printf("3. Python interpreter bhi C mein bana hai!\\n");
    printf("4. C fastest language hai (Python se ~50x faster)\\n");
    printf("5. FAANG interviews mein C bahut valuable hai\\n");

    printf("\\nC seekhna shuru karo — foundation strong hogi!\\n");

    return 0;  // 0 = program successfully completed
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    // ── First C program ──
    printf("Hello World!\\n");
    printf("I am learning C programming!\\n");
    printf("\\n");

    // Some interesting facts
    printf("=== Interesting Facts About C ===\\n");
    printf("1. C was created in 1972\\n");
    printf("2. Linux kernel is 97%% written in C\\n");
    printf("3. The Python interpreter is also built in C!\\n");
    printf("4. C is the fastest language (~50x faster than Python)\\n");
    printf("5. C is very valuable in FAANG interviews\\n");

    printf("\\nStart learning C — build a strong foundation!\\n");

    return 0;
}`,

      task: {
        description: 'Apna pehla C program banao: (1) #include <stdio.h> aur main() se shuru karo, (2) printf() se apna naam, city, aur favourite subject print karo, (3) Ek alag line mein "C Programming Seekhna Shuru Kiya!" print karo, (4) \\n use karo har line ke baad naya line ke liye, (5) return 0; se program end karo. Output mein kam se kam 5 lines honi chahiye.',
        description_en: 'Build your first C program: (1) Start with #include <stdio.h> and main(), (2) Use printf() to print your name, city, and favourite subject, (3) Print "Started Learning C Programming!" on a separate line, (4) Use \\n after each line for a new line, (5) End the program with return 0;. Output should have at least 5 lines.',
        hint: '#include <stdio.h> zaruri hai printf ke liye. printf("Hello\\n") mein \\n naya line banata hai. main() function ka return type int hona chahiye aur return 0; se end karo.',
        hint_en: '#include <stdio.h> is required for printf. In printf("Hello\\n"), \\n creates a new line. The main() function must have return type int and end with return 0;',
      },
      quiz: [
        {
          q: 'C program mein #include <stdio.h> kyun likhte hain?',
          options: [
            'Program ko fast banane ke liye',
            'printf() aur scanf() jaise input/output functions use karne ke liye — stdio = standard input/output',
            'main() function define karne ke liye',
            'Variables declare karne ke liye',
          ],
          correct: 1,
          explanation: '#include <stdio.h> ek header file hai jo stdio (standard input/output) library ko include karta hai. Bina iske printf() aur scanf() jaise functions available nahi honge. Jaise recipe mein ingredients ki list chahiye, waise hi program ko functions ki list chahiye.',
          q_en: 'Why do we write #include <stdio.h> in a C program?',
          options_en: [
            'To make the program faster',
            'To use input/output functions like printf() and scanf() — stdio = standard input/output',
            'To define the main() function',
            'To declare variables',
          ],
          explanation_en: '#include <stdio.h> is a header file that includes the stdio (standard input/output) library. Without it, functions like printf() and scanf() are not available. Just as a recipe needs a list of ingredients, a program needs a list of functions.',
        },
        {
          q: 'C program mein return 0; ka kya matlab hai?',
          options: [
            'Program restart karo',
            'Program ko 0 seconds mein run karo',
            'Operating system ko signal deta hai ki program successfully complete hua — 0 = success, non-zero = error',
            'Memory ko 0 se initialize karo',
          ],
          correct: 2,
          explanation: 'return 0; main() function se 0 value OS ko return karta hai. 0 matlab "program theek se chala, koi error nahi". Non-zero value (jaise return 1;) matlab "koi error aaya". Yeh convention universal hai — Unix/Linux/Windows sab mein.',
          q_en: 'What does return 0; mean in a C program?',
          options_en: [
            'Restart the program',
            'Run the program in 0 seconds',
            'Signals to the OS that the program completed successfully — 0 = success, non-zero = error',
            'Initialize memory to 0',
          ],
          explanation_en: 'return 0; returns the value 0 from main() to the OS. 0 means "program ran correctly, no errors". A non-zero value (like return 1;) means "an error occurred". This convention is universal — used in Unix/Linux/Windows.',
        },
        {
          q: 'C aur Python mein sabse bada execution difference kya hai?',
          options: [
            'Python mein semicolons hote hain',
            'C compiled language hai — pehle compile hota hai phir run. Python interpreted hai — line by line directly run hoti hai. Isliye C bahut faster hai.',
            'C mein loops nahi hote',
            'Python zyada popular hai',
          ],
          correct: 1,
          explanation: 'C = compiled language. Pehle pure code ko machine language mein translate kiya jaata hai (compile), phir CPU seedha woh machine code run karta hai — blazing fast! Python = interpreted. Ek interpreter har line padhta hai aur run karta hai — flexible but slower. C Python se ~50x faster ho sakta hai.',
          q_en: 'What is the biggest execution difference between C and Python?',
          options_en: [
            'Python uses semicolons',
            'C is compiled — first compiled then run. Python is interpreted — runs line by line directly. This is why C is much faster.',
            'C does not have loops',
            'Python is more popular',
          ],
          explanation_en: 'C = compiled language. The entire code is first translated to machine language (compiled), then the CPU runs that machine code directly — blazing fast! Python = interpreted. An interpreter reads and runs each line one at a time — flexible but slower. C can be ~50x faster than Python.',
        },
      ],
    },

    // ── SECTION 2 ─────────────────────────────────────────────────────
    {
      id: 'c-w1-s2',
      title: 'Variables aur Data Types — Data Store Karna',
      title_en: 'Variables and Data Types — Storing Data',
      emoji: '📦',
      content: `## Variables — Computer ki Memory mein Boxes!

Variable = ek naam wala box jisme data store hota hai.

### C ke Main Data Types

\`\`\`c
// ── Integer Types ────────────────────────────────────────
int    age    = 21;          // -2 billion to +2 billion (4 bytes)
short  score  = 100;         // -32768 to +32767 (2 bytes)
long   big    = 1000000L;    // bahut bada number (8 bytes)

// Unsigned — sirf positive numbers
unsigned int marks = 95;    // 0 to 4 billion
unsigned char grade = 'A';  // 0 to 255

// ── Float Types ──────────────────────────────────────────
float  pi     = 3.14f;       // 6-7 decimal digits (4 bytes)
double salary = 75000.50;    // 15-16 decimal digits (8 bytes) ← prefer this

// ── Character Type ───────────────────────────────────────
char   letter = 'A';         // single character (1 byte)
char   grade  = 'B';
// Note: 'A' aur "A" alag hain! char ke liye single quotes

// ── Boolean (C99+) ───────────────────────────────────────
#include <stdbool.h>
bool isStudent = true;
bool isPremium = false;

// Bina stdbool.h ke: 0 = false, non-zero = true
int isLoggedIn = 1;  // 1 = true
int isEmpty    = 0;  // 0 = false
\`\`\`

### Memory Sizes — Kitne Bytes?

\`\`\`c
#include <stdio.h>

int main() {
    printf("char   = %lu bytes\\n", sizeof(char));    // 1
    printf("short  = %lu bytes\\n", sizeof(short));   // 2
    printf("int    = %lu bytes\\n", sizeof(int));     // 4
    printf("long   = %lu bytes\\n", sizeof(long));    // 8
    printf("float  = %lu bytes\\n", sizeof(float));   // 4
    printf("double = %lu bytes\\n", sizeof(double));  // 8
    return 0;
}
\`\`\`

### printf() Format Specifiers — Print Kaise Karo

\`\`\`c
int    age    = 21;
float  gpa    = 9.2f;
double salary = 50000.75;
char   grade  = 'A';

printf("Age: %d\\n",     age);     // %d = integer
printf("GPA: %.1f\\n",  gpa);     // %f = float, .1 = 1 decimal place
printf("Salary: %.2lf\\n", salary); // %lf = double
printf("Grade: %c\\n",  grade);   // %c = character
printf("Name: %s\\n",   "Rahul"); // %s = string

// Ek saath multiple values
printf("Student: %s, Age: %d, GPA: %.2f\\n", "Priya", 20, 8.9f);
\`\`\`

### Variable Naming Rules

\`\`\`c
// ✅ Valid variable names
int age;
float monthly_salary;   // underscore allowed
int studentCount;       // camelCase
int _temp;              // underscore se shuru ho sakta hai
int value2;             // numbers allowed (not at start)

// ❌ Invalid variable names
int 2value;    // number se shuru nahi ho sakta
int my-name;   // hyphen nahi allowed
int int;       // reserved keyword use nahi kar sakte
int my name;   // space nahi allowed

// Best practice: meaningful names
int s = 85;           // ❌ unclear
int studentScore = 85; // ✅ clear
\`\`\`

### Constants — Value Change Nahi Hogi

\`\`\`c
// Method 1: const keyword
const float PI = 3.14159f;
const int MAX_SIZE = 100;

// Method 2: #define (preprocessor)
#define PI 3.14159
#define MAX_STUDENTS 50
#define PASS_MARKS 40

// Use
float area = PI * radius * radius;
\`\`\``,

      content_en: `## Variables — Boxes in Computer Memory!

A variable = a named box where data is stored.

### C's Main Data Types

\`\`\`c
// ── Integer Types ────────────────────────────────────────
int    age    = 21;          // -2 billion to +2 billion (4 bytes)
short  score  = 100;         // -32768 to +32767 (2 bytes)
long   big    = 1000000L;    // very large number (8 bytes)

// Unsigned — positive numbers only
unsigned int marks = 95;    // 0 to 4 billion

// ── Float Types ──────────────────────────────────────────
float  pi     = 3.14f;       // 6-7 decimal digits (4 bytes)
double salary = 75000.50;    // 15-16 decimal digits (8 bytes) ← prefer this

// ── Character Type ───────────────────────────────────────
char letter = 'A';           // single character (1 byte)
// Note: 'A' and "A" are different! single quotes for char

// ── Boolean (C99+) ───────────────────────────────────────
#include <stdbool.h>
bool isStudent = true;
bool isPremium = false;
// Without stdbool.h: 0 = false, non-zero = true
\`\`\`

### printf() Format Specifiers

\`\`\`c
int    age    = 21;
float  gpa    = 9.2f;
double salary = 50000.75;
char   grade  = 'A';

printf("Age:    %d\\n",     age);
printf("GPA:    %.1f\\n",  gpa);
printf("Salary: %.2lf\\n", salary);
printf("Grade:  %c\\n",    grade);
printf("Name:   %s\\n",    "Rahul");

// Multiple values at once
printf("Student: %s, Age: %d, GPA: %.2f\\n", "Priya", 20, 8.9f);
\`\`\`

### Constants

\`\`\`c
const float PI       = 3.14159f;
const int   MAX_SIZE = 100;

#define PI           3.14159
#define MAX_STUDENTS 50
\`\`\``,

      codeExample: `#include <stdio.h>

int main() {
    // ── Alag alag data types declare karo ──
    int    age          = 20;
    float  gpa          = 8.75f;
    double scholarship  = 25000.50;
    char   grade        = 'A';
    int    isEnrolled   = 1;  // 1 = true

    // ── Student card print karo ──
    printf("╔══════════════════════════════╗\\n");
    printf("║     STUDENT INFORMATION      ║\\n");
    printf("╠══════════════════════════════╣\\n");
    printf("║ Name       : Rahul Sharma    ║\\n");
    printf("║ Age        : %d years         ║\\n", age);
    printf("║ Grade      : %c               ║\\n", grade);
    printf("║ GPA        : %.2f / 10.00    ║\\n", gpa);
    printf("║ Scholarship: Rs %.2lf   ║\\n", scholarship);
    printf("║ Enrolled   : %s              ║\\n", isEnrolled ? "Yes" : "No");
    printf("╚══════════════════════════════╝\\n");

    // ── sizeof demo ──
    printf("\\n--- Memory Usage ---\\n");
    printf("int    uses %lu bytes\\n", sizeof(int));
    printf("float  uses %lu bytes\\n", sizeof(float));
    printf("double uses %lu bytes\\n", sizeof(double));
    printf("char   uses %lu bytes\\n", sizeof(char));

    // ── Arithmetic ──
    printf("\\n--- Quick Math ---\\n");
    int a = 17, b = 5;
    printf("%d + %d = %d\\n", a, b, a + b);
    printf("%d - %d = %d\\n", a, b, a - b);
    printf("%d * %d = %d\\n", a, b, a * b);
    printf("%d / %d = %d\\n", a, b, a / b);   // integer division!
    printf("%d %% %d = %d\\n", a, b, a % b);  // modulo (remainder)

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    // ── Declare different data types ──
    int    age         = 20;
    float  gpa         = 8.75f;
    double scholarship = 25000.50;
    char   grade       = 'A';
    int    isEnrolled  = 1;

    // ── Print student card ──
    printf("╔══════════════════════════════╗\\n");
    printf("║     STUDENT INFORMATION      ║\\n");
    printf("╠══════════════════════════════╣\\n");
    printf("║ Age        : %d years         ║\\n", age);
    printf("║ Grade      : %c               ║\\n", grade);
    printf("║ GPA        : %.2f / 10.00    ║\\n", gpa);
    printf("║ Scholarship: Rs %.2lf   ║\\n", scholarship);
    printf("║ Enrolled   : %s              ║\\n", isEnrolled ? "Yes" : "No");
    printf("╚══════════════════════════════╝\\n");

    // ── sizeof demo ──
    printf("\\n--- Memory Usage ---\\n");
    printf("int    uses %lu bytes\\n", sizeof(int));
    printf("float  uses %lu bytes\\n", sizeof(float));
    printf("double uses %lu bytes\\n", sizeof(double));
    printf("char   uses %lu bytes\\n", sizeof(char));

    // ── Arithmetic ──
    printf("\\n--- Quick Math ---\\n");
    int a = 17, b = 5;
    printf("%d / %d = %d (integer division!)\\n", a, b, a / b);
    printf("%d %% %d = %d (remainder)\\n",        a, b, a % b);

    return 0;
}`,

      task: {
        description: 'Variable practice karo: (1) Apne baare mein ek "profile card" banao — naam (string literal), age (int), height in cm (float), favourite number (int), GPA (double), initial of name (char). (2) Saari values printf() se print karo correct format specifiers ke saath (%d, %f, %lf, %c, %s). (3) int aur float mein division ka fark dikhao: 7/2 vs 7.0/2.0. (4) sizeof() se har variable ka size print karo.',
        description_en: 'Practise variables: (1) Build a "profile card" about yourself — name (string literal), age (int), height in cm (float), favourite number (int), GPA (double), initial of name (char). (2) Print all values with printf() using correct format specifiers (%d, %f, %lf, %c, %s). (3) Show the difference between int and float division: 7/2 vs 7.0/2.0. (4) Print the size of each variable using sizeof().',
        hint: 'Float ke liye printf mein %f ya %.2f use karo (2 decimal places). Double ke liye %lf. Char ke liye %c. Integer division: 7/2 = 3 (decimal chhut jaata hai!). Float division: 7.0/2.0 = 3.5.',
        hint_en: 'For float use %f or %.2f in printf (2 decimal places). For double use %lf. For char use %c. Integer division: 7/2 = 3 (decimal is dropped!). Float division: 7.0/2.0 = 3.5.',
      },
      quiz: [
        {
          q: 'C mein int aur float mein division ka kya fark hota hai? 7/2 aur 7.0/2.0 ka result kya hoga?',
          options: [
            'Dono 3.5 return karenge',
            '7/2 = 3 (integer division — decimal drop hota hai), 7.0/2.0 = 3.500000 (float division — decimal preserve hota hai)',
            '7/2 = 3.5, 7.0/2.0 = 4',
            'Dono error denge',
          ],
          correct: 1,
          explanation: 'C mein integer division: 7/2 = 3 (fractional part silently discard hota hai — truncation). Float division: 7.0/2.0 = 3.5. Yeh C ka ek common bug hai! Agar decimal result chahiye, ek operand float/double hona chahiye: (float)7/2 = 3.5 ya 7.0/2 = 3.5.',
          q_en: 'What is the difference between int and float division in C? What will 7/2 and 7.0/2.0 return?',
          options_en: [
            'Both return 3.5',
            '7/2 = 3 (integer division — decimal is dropped), 7.0/2.0 = 3.500000 (float division — decimal is preserved)',
            '7/2 = 3.5, 7.0/2.0 = 4',
            'Both will give errors',
          ],
          explanation_en: 'In C, integer division: 7/2 = 3 (the fractional part is silently discarded — truncation). Float division: 7.0/2.0 = 3.5. This is a common C bug! If you need a decimal result, one operand must be float/double: (float)7/2 = 3.5 or 7.0/2 = 3.5.',
        },
        {
          q: 'C mein char variable mein single ya double quotes use karte hain?',
          options: [
            'Double quotes — char grade = "A";',
            'Single quotes — char grade = \'A\'; (single char ke liye) aur double quotes strings ke liye "Hello"',
            'Koi bhi use kar sakte hain',
            'Char mein quotes nahi lagte',
          ],
          correct: 1,
          explanation: 'C mein: Single quotes \'A\' = ek character (char type). Double quotes "A" = string literal (char array). char grade = \'A\'; ✅ sahi. char grade = "A"; ❌ galat — type mismatch. Yeh difference yaad rakhna bahut important hai!',
          q_en: 'Do you use single or double quotes for a char variable in C?',
          options_en: [
            'Double quotes — char grade = "A";',
            'Single quotes — char grade = \'A\'; (for a single char) and double quotes for strings "Hello"',
            'Either can be used',
            'char does not need quotes',
          ],
          explanation_en: 'In C: Single quotes \'A\' = one character (char type). Double quotes "A" = string literal (char array). char grade = \'A\'; ✅ correct. char grade = "A"; ❌ wrong — type mismatch. This difference is very important to remember!',
        },
        {
          q: 'float aur double mein kya fark hai? Kab kaunsa use karein?',
          options: [
            'Koi fark nahi',
            'float = 4 bytes (6-7 decimal digits precision), double = 8 bytes (15-16 digits). Scientific calculations mein double prefer karo — zyada accurate hai.',
            'double sirf negative numbers ke liye hai',
            'float zyada accurate hai',
          ],
          correct: 1,
          explanation: 'float: 4 bytes, ~7 significant digits. double: 8 bytes, ~15 significant digits. Rule of thumb: jab tak memory constraint na ho, double use karo — zyada precise hai. float ke liye literal mein f lagaao: 3.14f. double ke liye: 3.14 (kuch nahi).',
          q_en: 'What is the difference between float and double? When should you use each?',
          options_en: [
            'No difference',
            'float = 4 bytes (6-7 decimal digits precision), double = 8 bytes (15-16 digits). Prefer double for scientific calculations — more accurate.',
            'double is only for negative numbers',
            'float is more accurate',
          ],
          explanation_en: 'float: 4 bytes, ~7 significant digits. double: 8 bytes, ~15 significant digits. Rule of thumb: unless you have a memory constraint, use double — it is more precise. For float literals, add f: 3.14f. For double: 3.14 (nothing extra).',
        },
      ],
    },

    // ── SECTION 3 ─────────────────────────────────────────────────────
    {
      id: 'c-w1-s3',
      title: 'Input lena — scanf() aur User Interaction',
      title_en: 'Taking Input — scanf() and User Interaction',
      emoji: '⌨️',
      content: `## scanf() — User se Input Lo!

\`printf()\` = output (screen pe dikhao)
\`scanf()\`  = input (user se lao)

### Basic scanf() Syntax

\`\`\`c
#include <stdio.h>

int main() {
    int age;
    printf("Apni age daalo: ");
    scanf("%d", &age);          // &age = age ka address (IMPORTANT!)
    printf("Tumhari age: %d\\n", age);
    return 0;
}
\`\`\`

⚠️ **& (ampersand) bohot important hai!**
\`scanf("%d", &age)\` → &age matlab "age variable ka memory address"
Bina & ke program crash ho sakta hai ya galat values aayegi!

### Alag Alag Types ka Input

\`\`\`c
int    num;
float  price;
double salary;
char   grade;
char   name[50];  // string ke liye char array

scanf("%d",   &num);       // integer
scanf("%f",   &price);     // float
scanf("%lf",  &salary);    // double (lf = long float)
scanf("%c",   &grade);     // single character
scanf("%s",   name);       // string (& nahi lagta array mein!)
\`\`\`

### Multiple Inputs Ek Saath

\`\`\`c
int age;
float gpa;
char grade;

// Method 1: Alag alag
printf("Age: ");    scanf("%d", &age);
printf("GPA: ");    scanf("%f", &gpa);
printf("Grade: ");  scanf(" %c", &grade);  // space before %c!

// Method 2: Ek hi scanf (space/enter se separate)
scanf("%d %f %c", &age, &gpa, &grade);
// User type karo: 20 8.5 A (then Enter)
\`\`\`

### scanf() ke Common Mistakes

\`\`\`c
// ❌ GALAT — & bhool gaye
int x;
scanf("%d", x);   // CRASH ya garbage value!

// ✅ SAHI
scanf("%d", &x);

// ❌ GALAT — char se pehle space nahi
char c;
scanf("%c", &c);  // Pichla Enter character le lega!

// ✅ SAHI — space se previous whitespace flush hoga
scanf(" %c", &c);

// ❌ GALAT — string ke liye
char name[50];
scanf("%s", &name);  // technically works but redundant

// ✅ SAHI
scanf("%s", name);   // array ka naam already address hai

// ❌ GALAT — buffer overflow risk
char small[5];
scanf("%s", small);  // agar user 10 chars type kare → crash!

// ✅ SAHI — width limit do
scanf("%49s", name);  // max 49 chars + null terminator
\`\`\`

### Input Validation Pattern

\`\`\`c
int age;
printf("Age (1-150): ");
scanf("%d", &age);

if (age < 1 || age > 150) {
    printf("Invalid age!\\n");
} else {
    printf("Valid age: %d\\n", age);
}
\`\`\``,

      content_en: `## scanf() — Get Input from the User!

\`printf()\` = output (show on screen)
\`scanf()\`  = input (receive from user)

### Basic scanf() Syntax

\`\`\`c
#include <stdio.h>

int main() {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);         // &age = address of age (IMPORTANT!)
    printf("Your age: %d\\n", age);
    return 0;
}
\`\`\`

⚠️ **& (ampersand) is very important!**
\`scanf("%d", &age)\` → &age means "the memory address of the age variable"
Without & the program may crash or produce garbage values!

### Input for Different Types

\`\`\`c
int    num;
float  price;
double salary;
char   grade;
char   name[50];

scanf("%d",   &num);
scanf("%f",   &price);
scanf("%lf",  &salary);   // lf = long float for double
scanf("%c",   &grade);
scanf("%s",   name);      // no & needed for arrays!
\`\`\`

### Common scanf() Mistakes

\`\`\`c
// ❌ WRONG — forgot &
scanf("%d", x);    // CRASH or garbage!

// ✅ CORRECT
scanf("%d", &x);

// ❌ WRONG — no space before %c
scanf("%c", &c);   // picks up previous Enter!

// ✅ CORRECT
scanf(" %c", &c);  // space flushes previous whitespace

// ✅ CORRECT — limit string width
scanf("%49s", name);  // max 49 chars + null terminator
\`\`\``,

      codeExample: `#include <stdio.h>

int main() {
    // ── Variables declare karo ──
    char  name[50];
    int   age;
    float gpa;
    char  grade;
    int   rollNo;

    // ── User se input lo ──
    printf("╔═══════════════════════════════╗\\n");
    printf("║    STUDENT REGISTRATION FORM  ║\\n");
    printf("╚═══════════════════════════════╝\\n\\n");

    printf("Roll Number daalo : ");
    scanf("%d", &rollNo);

    printf("Apna naam daalo  : ");
    scanf("%s", name);

    printf("Age daalo        : ");
    scanf("%d", &age);

    printf("GPA daalo (0-10) : ");
    scanf("%f", &gpa);

    printf("Grade daalo (A-F): ");
    scanf(" %c", &grade);  // space before %c — important!

    // ── Result print karo ──
    printf("\\n╔═══════════════════════════════╗\\n");
    printf("║       REGISTRATION COMPLETE   ║\\n");
    printf("╠═══════════════════════════════╣\\n");
    printf("║ Roll No : %-20d ║\\n", rollNo);
    printf("║ Name    : %-20s ║\\n", name);
    printf("║ Age     : %-20d ║\\n", age);
    printf("║ GPA     : %-20.2f ║\\n", gpa);
    printf("║ Grade   : %-20c ║\\n", grade);
    printf("╚═══════════════════════════════╝\\n");

    // ── Pass/Fail check ──
    if (gpa >= 5.0) {
        printf("\\n✅ Status: PASS - Congratulations %s!\\n", name);
    } else {
        printf("\\n❌ Status: FAIL - Better luck next time %s!\\n", name);
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

int main() {
    char  name[50];
    int   age;
    float gpa;
    char  grade;
    int   rollNo;

    printf("=== STUDENT REGISTRATION FORM ===\\n\\n");

    printf("Enter Roll Number : ");
    scanf("%d", &rollNo);

    printf("Enter Name        : ");
    scanf("%s", name);

    printf("Enter Age         : ");
    scanf("%d", &age);

    printf("Enter GPA (0-10)  : ");
    scanf("%f", &gpa);

    printf("Enter Grade (A-F) : ");
    scanf(" %c", &grade);  // space before %c — important!

    printf("\\n=== REGISTRATION COMPLETE ===\\n");
    printf("Roll No : %d\\n",   rollNo);
    printf("Name    : %s\\n",   name);
    printf("Age     : %d\\n",   age);
    printf("GPA     : %.2f\\n", gpa);
    printf("Grade   : %c\\n",   grade);

    if (gpa >= 5.0) {
        printf("\\nStatus: PASS - Congratulations %s!\\n", name);
    } else {
        printf("\\nStatus: FAIL - Better luck next time %s!\\n", name);
    }

    return 0;
}`,

      task: {
        description: 'scanf() practice karo: (1) Ek "Calculator" program banao — user se 2 numbers (float) lo aur +, -, *, / ke results print karo (division by zero check karo!). (2) Ek "BMI Calculator" banao — weight (kg) aur height (meters) lo, BMI = weight/(height*height) calculate karo, result aur category print karo (Underweight/Normal/Overweight).',
        description_en: 'Practise scanf(): (1) Build a "Calculator" program — take 2 numbers (float) from the user and print the results of +, -, *, / (check for division by zero!). (2) Build a "BMI Calculator" — take weight (kg) and height (meters), calculate BMI = weight/(height*height), print the result and category (Underweight/Normal/Overweight).',
        hint: 'Float input ke liye: scanf("%f", &num). Division by zero: if(b != 0) printf("%f", a/b); else printf("Error!"). BMI categories: < 18.5 = Underweight, 18.5-24.9 = Normal, >= 25 = Overweight.',
        hint_en: 'For float input: scanf("%f", &num). Division by zero: if(b != 0) printf("%f", a/b); else printf("Error!"). BMI categories: < 18.5 = Underweight, 18.5-24.9 = Normal, >= 25 = Overweight.',
      },
      quiz: [
        {
          q: 'scanf("%d", age) mein kya problem hai?',
          options: [
            'Koi problem nahi',
            '& missing hai — scanf ko variable ka memory address chahiye, value nahi. Sahi: scanf("%d", &age). Bina & ke garbage value ya crash.',
            '%d galat format specifier hai',
            'age variable declare nahi tha',
          ],
          correct: 1,
          explanation: 'scanf() ko variable ka memory address chahiye taaki woh wahan value store kar sake. &age = "age ki memory location". Bina & ke, age ki current value (garbage) ko address maanke wahan write karne ki koshish karega — undefined behavior, crash, ya galat output.',
          q_en: 'What is wrong with scanf("%d", age)?',
          options_en: [
            'Nothing wrong',
            '& is missing — scanf needs the memory address of the variable, not its value. Correct: scanf("%d", &age). Without & you get garbage values or a crash.',
            '%d is the wrong format specifier',
            'The age variable was not declared',
          ],
          explanation_en: 'scanf() needs the memory address of the variable so it can store the value there. &age = "the memory location of age". Without &, it treats the current (garbage) value of age as an address and tries to write there — undefined behaviour, crash, or wrong output.',
        },
        {
          q: 'char input ke liye scanf(" %c", &c) mein space kyun important hai?',
          options: [
            'Sirf style ke liye',
            'Space se pehle ka koi bhi whitespace (newline/space/tab) flush ho jaata hai. Bina space ke pichle input ka Enter character read ho jaata hai — galat result!',
            'C ka rule hai',
            'Double quotes mein space chahiye',
          ],
          correct: 1,
          explanation: 'Jab user previous input ke baad Enter dabata hai, woh \'\\n\' (newline) input buffer mein reh jaata hai. Agli scanf(" %c") mein space pehle sab whitespace skip kar deta hai aur actual character padhta hai. Bina space ke: scanf("%c") seedha \'\\n\' le leta hai — user ka actual character nahi!',
          q_en: 'Why is the space in scanf(" %c", &c) important?',
          options_en: [
            'Just for style',
            'The space flushes any preceding whitespace (newline/space/tab). Without it, the Enter from the previous input is read — wrong result!',
            'It is a C rule',
            'A space is needed inside double quotes',
          ],
          explanation_en: "When the user presses Enter after previous input, a '\\n' (newline) stays in the input buffer. The space before %c in scanf skips all whitespace and reads the actual character. Without the space: scanf(\"%c\") immediately reads the '\\n' — not the user's actual character!",
        },
        {
          q: 'String input ke liye scanf("%s", name) mein & kyun nahi lagate?',
          options: [
            'Bug hai, lagana chahiye',
            'Array ka naam already ek pointer/address hota hai — name already &name[0] ke equivalent hai. Isliye & redundant hai.',
            'Strings ke liye alag syntax hai',
            '%s automatically & handle kar leta hai',
          ],
          correct: 1,
          explanation: 'C mein array ka naam uske pehle element ka address hota hai. char name[50] mein, name == &name[0] == memory address of first character. Isliye scanf("%s", name) aur scanf("%s", &name[0]) same hain. &name technically ek pointer-to-array hai jo generally kaam karta hai lekin semantically different hai.',
          q_en: 'Why do we not add & for string input in scanf("%s", name)?',
          options_en: [
            'It is a bug, we should add it',
            'An array name is already a pointer/address — name is equivalent to &name[0]. So & is redundant.',
            'Strings have a different syntax',
            '%s handles & automatically',
          ],
          explanation_en: 'In C, an array name is the address of its first element. For char name[50], name == &name[0] == the memory address of the first character. So scanf("%s", name) and scanf("%s", &name[0]) are the same. &name is technically a pointer-to-array which generally works but is semantically different.',
        },
      ],
    },

    // ── SECTION 4 ─────────────────────────────────────────────────────
    {
      id: 'c-w1-s4',
      title: 'Operators aur Expressions — Calculations karo',
      title_en: 'Operators and Expressions — Perform Calculations',
      emoji: '🔢',
      content: `## Operators — C ke Calculation Tools!

### Arithmetic Operators

\`\`\`c
int a = 17, b = 5;

printf("%d\\n", a + b);   // 22  — Addition
printf("%d\\n", a - b);   // 12  — Subtraction
printf("%d\\n", a * b);   // 85  — Multiplication
printf("%d\\n", a / b);   // 3   — Division (integer — decimal drops!)
printf("%d\\n", a % b);   // 2   — Modulo (remainder)

// Float division
float x = 17.0f, y = 5.0f;
printf("%.2f\\n", x / y); // 3.40 — float division preserves decimal

// Power (C mein ** operator nahi) — math.h use karo
#include <math.h>
double result = pow(2, 10);  // 2^10 = 1024
double sqrtVal = sqrt(144);  // √144 = 12
\`\`\`

### Relational (Comparison) Operators

\`\`\`c
int a = 10, b = 20;

printf("%d\\n", a == b);  // 0 (false) — equal?
printf("%d\\n", a != b);  // 1 (true)  — not equal?
printf("%d\\n", a > b);   // 0 (false) — greater?
printf("%d\\n", a < b);   // 1 (true)  — less?
printf("%d\\n", a >= 10); // 1 (true)  — greater or equal?
printf("%d\\n", a <= 9);  // 0 (false) — less or equal?

// C mein true = 1, false = 0
// (Python ki tarah True/False nahi — stdbool.h ke bina)
\`\`\`

### Logical Operators

\`\`\`c
int age = 20, marks = 75;

// && = AND (dono true ho tab true)
if (age >= 18 && marks >= 60) {
    printf("Eligible for admission\\n");
}

// || = OR (koi bhi ek true ho tab true)
if (marks >= 90 || age <= 16) {
    printf("Special scholarship eligible\\n");
}

// ! = NOT (opposite)
int isLoggedIn = 0;
if (!isLoggedIn) {
    printf("Please login first\\n");
}
\`\`\`

### Assignment Operators

\`\`\`c
int x = 10;

x += 5;   // x = x + 5 = 15  (same as x = x + 5)
x -= 3;   // x = x - 3 = 12
x *= 2;   // x = x * 2 = 24
x /= 4;   // x = x / 4 = 6
x %= 4;   // x = x % 4 = 2
\`\`\`

### Increment / Decrement

\`\`\`c
int i = 5;

i++;     // Post-increment: i becomes 6
++i;     // Pre-increment:  i becomes 7
i--;     // Post-decrement: i becomes 6
--i;     // Pre-decrement:  i becomes 5

// IMPORTANT difference:
int a = 5;
int b = a++;  // b = 5 (old value), THEN a = 6
int c = ++a;  // a = 7 FIRST, then c = 7

printf("a=%d b=%d c=%d\\n", a, b, c);  // a=7 b=5 c=7
\`\`\`

### Bitwise Operators (Advanced)

\`\`\`c
// Used in embedded systems, low-level programming
int a = 12;  // binary: 1100
int b = 10;  // binary: 1010

printf("%d\\n", a & b);   // 8  = 1000 (AND)
printf("%d\\n", a | b);   // 14 = 1110 (OR)
printf("%d\\n", a ^ b);   // 6  = 0110 (XOR)
printf("%d\\n", ~a);      // -13 (NOT — flips all bits)
printf("%d\\n", a << 1);  // 24 = 11000 (left shift = *2)
printf("%d\\n", a >> 1);  // 6  = 0110  (right shift = /2)
\`\`\`

### Operator Precedence (BODMAS jaisa)

\`\`\`c
// Precedence (high to low):
// 1. ()  parentheses
// 2. ++, --  increment/decrement
// 3. *, /, %  multiplication, division, modulo
// 4. +, -  addition, subtraction
// 5. <, >, <=, >=  relational
// 6. ==, !=  equality
// 7. &&  logical AND
// 8. ||  logical OR
// 9. =, +=, -= etc  assignment

int result = 2 + 3 * 4;       // 14 (not 20!)
int result2 = (2 + 3) * 4;    // 20 — parentheses first
int result3 = 10 > 5 && 3 < 7; // 1 (true)
\`\`\``,

      content_en: `## Operators — C ke Calculation Tools!

### Arithmetic Operators

\`\`\`c
int a = 17, b = 5;

printf("%d\\n", a + b);   // 22  — Addition
printf("%d\\n", a - b);   // 12  — Subtraction
printf("%d\\n", a * b);   // 85  — Multiplication
printf("%d\\n", a / b);   // 3   — Division (integer — decimal drops!)
printf("%d\\n", a % b);   // 2   — Modulo (remainder)

// Float division
float x = 17.0f, y = 5.0f;
printf("%.2f\\n", x / y); // 3.40 — float division preserves decimal

// Power (C in ** operator nahi) — math.h use do
#include <math.h>
double result = pow(2, 10);  // 2^10 = 1024
double sqrtVal = sqrt(144);  // √144 = 12
\`\`\`

### Relational (Comparison) Operators

\`\`\`c
int a = 10, b = 20;

printf("%d\\n", a == b);  // 0 (false) — equal?
printf("%d\\n", a != b);  // 1 (true)  — not equal?
printf("%d\\n", a > b);   // 0 (false) — greater?
printf("%d\\n", a < b);   // 1 (true)  — less?
printf("%d\\n", a >= 10); // 1 (true)  — greater or equal?
printf("%d\\n", a <= 9);  // 0 (false) — less or equal?

// C in true = 1, false = 0
// (Python ki tarah True/False nahi — stdbool.h ke bina)
\`\`\`

### Logical Operators

\`\`\`c
int age = 20, marks = 75;

// && = AND (dono true ho tab true)
if (age >= 18 && marks >= 60) {
    printf("Eligible for admission\\n");
}

// || = OR (koi bhi ek true ho tab true)
if (marks >= 90 || age <= 16) {
    printf("Special scholarship eligible\\n");
}

// ! = NOT (opposite)
int isLoggedIn = 0;
if (!isLoggedIn) {
    printf("Please login first\\n");
}
\`\`\`

### Assignment Operators

\`\`\`c
int x = 10;

x += 5;   // x = x + 5 = 15  (same as x = x + 5)
x -= 3;   // x = x - 3 = 12
x *= 2;   // x = x * 2 = 24
x /= 4;   // x = x / 4 = 6
x %= 4;   // x = x % 4 = 2
\`\`\`

### Increment / Decrement

\`\`\`c
int i = 5;

i++;     // Post-increment: i becomes 6
++i;     // Pre-increment:  i becomes 7
i--;     // Post-decrement: i becomes 6
--i;     // Pre-decrement:  i becomes 5

// IMPORTANT difference:
int a = 5;
int b = a++;  // b = 5 (old value), THEN a = 6
int c = ++a;  // a = 7 FIRST, then c = 7

printf("a=%d b=%d c=%d\\n", a, b, c);  // a=7 b=5 c=7
\`\`\`

### Bitwise Operators (Advanced)

\`\`\`c
// Used in embedded systems, low-level programming
int a = 12;  // binary: 1100
int b = 10;  // binary: 1010

printf("%d\\n", a & b);   // 8  = 1000 (AND)
printf("%d\\n", a | b);   // 14 = 1110 (OR)
printf("%d\\n", a ^ b);   // 6  = 0110 (XOR)
printf("%d\\n", ~a);      // -13 (NOT — flips all bits)
printf("%d\\n", a << 1);  // 24 = 11000 (left shift = *2)
printf("%d\\n", a >> 1);  // 6  = 0110  (right shift = /2)
\`\`\`

### Operator Precedence (BODMAS jaisa)

\`\`\`c
// Precedence (high to low):
// 1. ()  parentheses
// 2. ++, --  increment/decrement
// 3. *, /, %  multiplication, division, modulo
// 4. +, -  addition, subtraction
// 5. <, >, <=, >=  relational
// 6. ==, !=  equality
// 7. &&  logical AND
// 8. ||  logical OR
// 9. =, +=, -= etc  assignment

int result = 2 + 3 * 4;       // 14 (not 20!)
int result2 = (2 + 3) * 4;    // 20 — parentheses first
int result3 = 10 > 5 && 3 < 7; // 1 (true)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <math.h>

int main() {
    // ── Simple Calculator ──
    float a, b;
    printf("=== C Calculator ===\\n");
    printf("Pehla number: "); scanf("%f", &a);
    printf("Doosra number: "); scanf("%f", &b);

    printf("\\n--- Results ---\\n");
    printf("%.2f + %.2f = %.2f\\n", a, b, a + b);
    printf("%.2f - %.2f = %.2f\\n", a, b, a - b);
    printf("%.2f * %.2f = %.2f\\n", a, b, a * b);

    if (b != 0)
        printf("%.2f / %.2f = %.2f\\n", a, b, a / b);
    else
        printf("Division: ERROR (zero se divide nahi kar sakte!)\\n");

    if ((int)b != 0)
        printf("%.0f %% %.0f = %.0f\\n", a, b, fmod(a, b));

    printf("\\n--- Math Functions ---\\n");
    printf("%.2f ka square root = %.4f\\n", a, sqrt(a));
    printf("%.2f ^ 2 = %.2f\\n", a, pow(a, 2));

    // ── Increment/Decrement demo ──
    printf("\\n--- Increment Demo ---\\n");
    int x = 10;
    printf("x = %d\\n", x);
    printf("x++ = %d (pehle print, phir increment)\\n", x++);
    printf("x ab = %d\\n", x);
    printf("++x = %d (pehle increment, phir print)\\n", ++x);
    printf("x ab = %d\\n", x);

    // ── Logical operators ──
    printf("\\n--- Eligibility Check ---\\n");
    int age, marks;
    printf("Age: "); scanf("%d", &age);
    printf("Marks: "); scanf("%d", &marks);

    if (age >= 18 && marks >= 60)
        printf("✅ Admission ke liye eligible ho!\\n");
    else if (age >= 18 || marks >= 80)
        printf("⚠️  Partly eligible — conditions check karo\\n");
    else
        printf("❌ Eligible nahi ho abhi\\n");

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <math.h>

int main() {
    float a, b;
    printf("=== C Calculator ===\\n");
    printf("First number:  "); scanf("%f", &a);
    printf("Second number: "); scanf("%f", &b);

    printf("\\n--- Results ---\\n");
    printf("%.2f + %.2f = %.2f\\n", a, b, a + b);
    printf("%.2f - %.2f = %.2f\\n", a, b, a - b);
    printf("%.2f * %.2f = %.2f\\n", a, b, a * b);

    if (b != 0)
        printf("%.2f / %.2f = %.2f\\n", a, b, a / b);
    else
        printf("Division: ERROR (cannot divide by zero!)\\n");

    printf("\\n--- Math Functions ---\\n");
    printf("sqrt(%.2f) = %.4f\\n", a, sqrt(a));
    printf("%.2f ^ 2   = %.2f\\n", a, pow(a, 2));

    printf("\\n--- Increment Demo ---\\n");
    int x = 10;
    printf("x++  = %d (print first, then increment)\\n", x++);
    printf("x now = %d\\n", x);
    printf("++x  = %d (increment first, then print)\\n", ++x);

    return 0;
}`,

      task: {
        description: 'Operators practice: (1) "Grade Calculator" banao — user se 5 subjects ke marks (int) lo, average calculate karo, grade assign karo (A: 90+, B: 75+, C: 60+, D: 45+, F: below 45), pass/fail bhi batao. (2) "Temperature Converter" banao — user Celsius dega, Fahrenheit aur Kelvin mein convert karo. Formula: F = (C * 9/5) + 32, K = C + 273.15. (3) Post-increment aur pre-increment ka fark code likh ke prove karo.',
        description_en: 'Practise operators: (1) Build a "Grade Calculator" — take marks (int) for 5 subjects, calculate the average, assign a grade (A: 90+, B: 75+, C: 60+, D: 45+, F: below 45), and show pass/fail. (2) Build a "Temperature Converter" — user gives Celsius, convert to Fahrenheit and Kelvin. Formula: F = (C * 9/5) + 32, K = C + 273.15. (3) Prove the difference between post-increment and pre-increment by writing code.',
        hint: 'Average: (m1+m2+m3+m4+m5)/5. Grade mein if-else if chain use karo, highest se check karo. Temperature: float use karo integer division avoid karne ke liye — 9.0/5 ya (float)9/5. Post vs pre: int a=5; int b=a++; int c=++a; print karke dekho.',
        hint_en: 'Average: (m1+m2+m3+m4+m5)/5. Use an if-else if chain for grades, checking from highest first. Temperature: use float to avoid integer division — 9.0/5 or (float)9/5. Post vs pre: int a=5; int b=a++; int c=++a; print and observe.',
      },
      quiz: [
        {
          q: 'int a = 5; printf("%d", a++); ke baad a ki value kya hogi aur printf kya print karega?',
          options: [
            'Printf: 6, a: 6',
            'Printf: 5, a: 6 — post-increment pehle current value use karta hai, phir increment hota hai',
            'Printf: 5, a: 5',
            'Compile error',
          ],
          correct: 1,
          explanation: 'Post-increment (a++): pehle current value (5) use hoti hai expression mein, PHIR a increment hoti hai. Isliye printf("%d", a++) = 5 print karta hai, lekin us ke baad a = 6 ho jaata hai. Pre-increment (++a) mein: pehle a increment hoga (6), phir expression mein 6 use hoga.',
          q_en: 'After int a = 5; printf("%d", a++); what will printf print and what will the value of a be?',
          options_en: [
            'Printf: 6, a: 6',
            'Printf: 5, a: 6 — post-increment uses the current value first, then increments',
            'Printf: 5, a: 5',
            'Compile error',
          ],
          explanation_en: 'Post-increment (a++): the current value (5) is used in the expression FIRST, THEN a is incremented. So printf("%d", a++) prints 5, but after that a = 6. Pre-increment (++a): a is incremented first (to 6), then 6 is used in the expression.',
        },
        {
          q: 'C mein 7 % 3 ka result kya hoga?',
          options: ['2.33', '2 — remainder (bakhi) jab 7 ko 3 se divide karo', '3', '0'],
          correct: 1,
          explanation: '% modulo operator hai — division ke baad remainder (bakhi) deta hai. 7 / 3 = 2 remainder 1. Wait — 7 = 3*2 + 1, isliye 7%3 = 1. Useful: even/odd check (n%2==0 toh even), circular indexing, last digit nikalna (n%10).',
          q_en: 'What will 7 % 3 return in C?',
          options_en: ['2.33', '1 — the remainder when 7 is divided by 3', '3', '0'],
          explanation_en: '% is the modulo operator — it gives the remainder after division. 7 / 3 = 2 with remainder 1. So 7%3 = 1. Useful for: even/odd check (n%2==0 means even), circular indexing, getting the last digit (n%10).',
        },
        {
          q: 'int result = 2 + 3 * 4; mein result ki value kya hogi?',
          options: ['20 — left se right calculate hoga', '14 — * ka precedence + se zyada hai, isliye 3*4=12 pehle, phir 2+12=14', '24', 'Compile error'],
          correct: 1,
          explanation: 'C mein operator precedence BODMAS/PEMDAS jaisi hai. * (multiplication) ka precedence + (addition) se zyada hai. Isliye: 2 + (3 * 4) = 2 + 12 = 14. Agar 20 chahiye: (2 + 3) * 4 = 20. Parentheses use karo jab unsure ho — code readable bhi hoga!',
          q_en: 'What will the value of result be in int result = 2 + 3 * 4;?',
          options_en: ['20 — calculated left to right', '14 — * has higher precedence than +, so 3*4=12 first, then 2+12=14', '24', 'Compile error'],
          explanation_en: 'C follows BODMAS/PEMDAS-style operator precedence. * (multiplication) has higher precedence than + (addition). So: 2 + (3 * 4) = 2 + 12 = 14. If you want 20: (2 + 3) * 4 = 20. Use parentheses when unsure — it also makes code more readable!',
        },
      ],
    },
  ],
};