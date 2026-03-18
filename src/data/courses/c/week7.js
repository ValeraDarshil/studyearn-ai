/**
 * StudyEarn AI — C Programming Course
 * Week 7: Preprocessor, Macros aur Bitwise Operations
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_7 = {
  week: 7,
  title: 'Preprocessor, Macros aur Bitwise — C ka Hidden Power',
  title_en: 'Preprocessor, Macros and Bitwise — The Hidden Power of C',
  description: '#define, #ifdef, macros, bitwise operators — compile se pehle code transform karo aur bits directly manipulate karo!',
  description_en: '#define, #ifdef, macros, bitwise operators — transform code before compilation and manipulate bits directly!',
  xpReward: 240,
  sections: [
    {
      id: 'c-w7-s1',
      title: 'Preprocessor — Compilation se Pehle Kya Hota Hai',
      title_en: 'The Preprocessor — What Happens Before Compilation',
      emoji: '⚙️',
      content: `## C Preprocessor — Compiler ka Gatekeeper!

Compilation se **pehle** preprocessor run hota hai. Source code ko transform karta hai — then compiler ko deta hai.

### Compilation Pipeline

\`\`\`
  Source.c
     │
     ▼
  Preprocessor     ← #include, #define, #ifdef process karo
     │  (produces expanded source)
     ▼
  Compiler         ← C → Assembly
     │
     ▼
  Assembler         ← Assembly → Object code (.o)
     │
     ▼
  Linker            ← .o files + libraries → Executable
     │
     ▼
  Executable        ← Run karo!

gcc -E file.c       ← sirf preprocessor run karo (output dekho!)
gcc -S file.c       ← assembly tak compile karo
\`\`\`

### #include — Header Files Import Karo

\`\`\`c
#include <stdio.h>      // System header — angle brackets
#include <stdlib.h>     // Search in standard include paths
#include <string.h>
#include <math.h>

#include "myheader.h"   // User header — double quotes
#include "utils/helper.h"  // Relative path

// #include literally pastes file contents here!
// stdio.h mein printf ka prototype hai — compiler ko pata hota hai
\`\`\`

### Header Guard — Double Include Prevent Karo

\`\`\`c
// ── myheader.h ──────────────────────────────────────────
#ifndef MYHEADER_H    // agar MYHEADER_H define nahi hai
#define MYHEADER_H    // toh define karo

// ... header content ...
typedef struct { int x, y; } Point;
int add(int a, int b);
#define PI 3.14159f

#endif  // MYHEADER_H

// Bina header guard ke:
// main.c → #include "a.h" → #include "myheader.h"
//        → #include "b.h" → #include "myheader.h"  ← DUPLICATE!
// With guard: second include silently skipped ✅

// Modern alternative (GCC/Clang extension):
#pragma once  // same effect, simpler syntax
\`\`\`

### #define — Constants Define Karo

\`\`\`c
// Symbolic constants — magic numbers avoid karo!
#define PI          3.14159265358979f
#define MAX_SIZE    100
#define BUFFER_SIZE 4096
#define APP_NAME    "StudyEarn C"
#define VERSION     "1.0.0"
#define NEWLINE     '\\n'

// Use karo
float area = PI * r * r;
char name[] = APP_NAME;

// ❌ Bad — magic numbers
if (marks >= 60) printf("Pass\\n");   // 60 kya hai?

// ✅ Good — named constants
#define PASS_MARKS  60
#define MERIT_MARKS 75
if (marks >= PASS_MARKS) printf("Pass\\n");

// Undefine
#undef MAX_SIZE
#define MAX_SIZE 200  // redefine

// Predefined macros
printf("%s\\n", __FILE__);    // current filename
printf("%d\\n", __LINE__);    // current line number
printf("%s\\n", __DATE__);    // compile date "Jan 15 2024"
printf("%s\\n", __TIME__);    // compile time "10:30:00"
printf("%s\\n", __func__);    // current function name (C99)
\`\`\`

### Conditional Compilation — Platform-Specific Code

\`\`\`c
// ── Feature flags ──
#define DEBUG       1   // debugging on
#define ENABLE_LOG  1

#if DEBUG
    #define DBG(fmt, ...) fprintf(stderr, "[DBG %s:%d] " fmt "\\n", __func__, __LINE__, ##__VA_ARGS__)
#else
    #define DBG(fmt, ...) // nothing — zero overhead in release!
#endif

DBG("Value is: %d", x);  // prints in debug, gone in release

// ── Platform detection ──
#ifdef _WIN32
    #define CLEAR_SCREEN "cls"
    #define PATH_SEP '\\\\'
#elif defined(__linux__)
    #define CLEAR_SCREEN "clear"
    #define PATH_SEP '/'
#elif defined(__APPLE__)
    #define CLEAR_SCREEN "clear"
    #define PATH_SEP '/'
#else
    #define CLEAR_SCREEN ""
    #define PATH_SEP '/'
#endif

system(CLEAR_SCREEN);

// ── ifdef / ifndef / elif / endif ──
#ifndef NDEBUG          // agar NDEBUG defined nahi
    // debug code here
#endif

#if defined(WINDOWS) && !defined(UNICODE)
    // Windows ANSI mode
#endif

// ── #error — compile-time error ──
#if BUFFER_SIZE < 64
    #error "BUFFER_SIZE must be at least 64!"
#endif

// ── #warning — compile-time warning ──
#if defined(DEPRECATED_API)
    #warning "This API is deprecated, use new_api() instead"
#endif
\`\`\`

### #pragma — Compiler Directives

\`\`\`c
#pragma once            // header guard (GCC/MSVC/Clang)

#pragma pack(1)         // no struct padding
typedef struct { char a; int b; } Packed;  // 5 bytes, not 8
#pragma pack()          // restore default

#pragma GCC optimize("O3")          // max optimization
#pragma GCC target("avx2")          // use AVX2 instructions

// Suppress warnings
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-variable"
int unused = 5;  // no warning
#pragma GCC diagnostic pop
\`\`\``,

      content_en: `## C Preprocessor — Compiler ka Gatekeeper!

Compilation se **pehle** preprocessor run hota hai. Source code ko transform karta hai — then compiler ko deta hai.

### Compilation Pipeline

\`\`\`
  Source.c
     │
     ▼
  Preprocessor     ← #include, #define, #ifdef process do
     │  (produces expanded source)
     ▼
  Compiler         ← C → Assembly
     │
     ▼
  Assembler         ← Assembly → Object code (.o)
     │
     ▼
  Linker            ← .o files + libraries → Executable
     │
     ▼
  Executable        ← Run do!

gcc -E file.c       ← only preprocessor run do (output dekho!)
gcc -S file.c       ← assembly tak compile do
\`\`\`

### #include — Header Files Import Do

\`\`\`c
#include <stdio.h>      // System header — angle brackets
#include <stdlib.h>     // Search in standard include paths
#include <string.h>
#include <math.h>

#include "myheader.h"   // User header — double quotes
#include "utils/helper.h"  // Relative path

// #include literally pastes file contents here!
// stdio.h in printf ka prototype hai — compiler ko pata hota hai
\`\`\`

### Header Guard — Double Include Prevent Do

\`\`\`c
// ── myheader.h ──────────────────────────────────────────
#ifndef MYHEADER_H    // agar MYHEADER_H define nahi hai
#define MYHEADER_H    // toh define do

// ... header content ...
typedef struct { int x, y; } Point;
int add(int a, int b);
#define PI 3.14159f

#endif  // MYHEADER_H

// Bina header guard ke:
// main.c → #include "a.h" → #include "myheader.h"
//        → #include "b.h" → #include "myheader.h"  ← DUPLICATE!
// With guard: second include silently skipped ✅

// Modern alternative (GCC/Clang extension):
#pragma once  // same effect, simpler syntax
\`\`\`

### #define — Constants Define Do

\`\`\`c
// Symbolic constants — magic numbers avoid do!
#define PI          3.14159265358979f
#define MAX_SIZE    100
#define BUFFER_SIZE 4096
#define APP_NAME    "StudyEarn C"
#define VERSION     "1.0.0"
#define NEWLINE     '\\n'

// Use do
float area = PI * r * r;
char name[] = APP_NAME;

// ❌ Bad — magic numbers
if (marks >= 60) printf("Pass\\n");   // 60 what it is?

// ✅ Good — named constants
#define PASS_MARKS  60
#define MERIT_MARKS 75
if (marks >= PASS_MARKS) printf("Pass\\n");

// Undefine
#undef MAX_SIZE
#define MAX_SIZE 200  // redefine

// Predefined macros
printf("%s\\n", __FILE__);    // current filename
printf("%d\\n", __LINE__);    // current line number
printf("%s\\n", __DATE__);    // compile date "Jan 15 2024"
printf("%s\\n", __TIME__);    // compile time "10:30:00"
printf("%s\\n", __func__);    // current function name (C99)
\`\`\`

### Conditional Compilation — Platform-Specific Code

\`\`\`c
// ── Feature flags ──
#define DEBUG       1   // debugging on
#define ENABLE_LOG  1

#if DEBUG
    #define DBG(fmt, ...) fprintf(stderr, "[DBG %s:%d] " fmt "\\n", __func__, __LINE__, ##__VA_ARGS__)
#else
    #define DBG(fmt, ...) // nothing — zero overhead in release!
#endif

DBG("Value is: %d", x);  // prints in debug, gone in release

// ── Platform detection ──
#ifdef _WIN32
    #define CLEAR_SCREEN "cls"
    #define PATH_SEP '\\\\'
#elif defined(__linux__)
    #define CLEAR_SCREEN "clear"
    #define PATH_SEP '/'
#elif defined(__APPLE__)
    #define CLEAR_SCREEN "clear"
    #define PATH_SEP '/'
#else
    #define CLEAR_SCREEN ""
    #define PATH_SEP '/'
#endif

system(CLEAR_SCREEN);

// ── ifdef / ifndef / elif / endif ──
#ifndef NDEBUG          // agar NDEBUG defined nahi
    // debug code here
#endif

#if defined(WINDOWS) && !defined(UNICODE)
    // Windows ANSI mode
#endif

// ── #error — compile-time error ──
#if BUFFER_SIZE < 64
    #error "BUFFER_SIZE must be at least 64!"
#endif

// ── #warning — compile-time warning ──
#if defined(DEPRECATED_API)
    #warning "This API is deprecated, use new_api() instead"
#endif
\`\`\`

### #pragma — Compiler Directives

\`\`\`c
#pragma once            // header guard (GCC/MSVC/Clang)

#pragma pack(1)         // no struct padding
typedef struct { char a; int b; } Packed;  // 5 bytes, not 8
#pragma pack()          // restore default

#pragma GCC optimize("O3")          // max optimization
#pragma GCC target("avx2")          // use AVX2 instructions

// Suppress warnings
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-variable"
int unused = 5;  // no warning
#pragma GCC diagnostic pop
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ── Build configuration ──
#define APP_NAME    "StudyEarn C"
#define VERSION     "2.0.0"
#define MAX_STUDENTS 200
#define PASS_MARKS   40
#define MERIT_MARKS  75
#define DIST_MARKS   90

// Debug logging — zero cost in release (compile with -DNDEBUG)
#ifndef NDEBUG
  #define DBG(fmt,...) fprintf(stderr,"[DBG %s:%d] " fmt "\\n",__func__,__LINE__,##__VA_ARGS__)
  #define ASSERT(cond) if(!(cond)){fprintf(stderr,"ASSERT FAIL %s:%d: %s\\n",__FILE__,__LINE__,#cond);abort();}
#else
  #define DBG(fmt,...) ((void)0)
  #define ASSERT(cond) ((void)0)
#endif

// ── Utility macros ──
#define MAX(a,b)       ((a)>(b)?(a):(b))
#define MIN(a,b)       ((a)<(b)?(a):(b))
#define ABS(x)         ((x)<0?-(x):(x))
#define CLAMP(v,lo,hi) ((v)<(lo)?(lo):(v)>(hi)?(hi):(v))
#define SWAP(T,a,b)    do{T _t=(a);(a)=(b);(b)=_t;}while(0)
#define ARRAY_SIZE(a)  (sizeof(a)/sizeof((a)[0]))
#define IN_RANGE(v,lo,hi) ((v)>=(lo)&&(v)<=(hi))

// ── String macros ──
#define STR(x)         #x    // stringify
#define CONCAT(a,b)    a##b  // token paste

// ── Grade macro ──
#define GET_GRADE(m) \\
    ((m)>=DIST_MARKS  ? 'O' : \\
     (m)>=MERIT_MARKS ? 'A' : \\
     (m)>=60          ? 'B' : \\
     (m)>=PASS_MARKS  ? 'C' : 'F')

// ── Platform info ──
#ifdef _WIN32
  #define OS_NAME "Windows"
#elif defined(__linux__)
  #define OS_NAME "Linux"
#elif defined(__APPLE__)
  #define OS_NAME "macOS"
#else
  #define OS_NAME "Unknown"
#endif

typedef struct {
    int   id;
    char  name[50];
    float marks;
    char  grade;
} Student;

void printStudentInfo(const Student *s) {
    DBG("Printing student ID=%d", s->id);
    ASSERT(s != NULL);
    printf("%-5d %-20s %6.1f    %c\\n",
           s->id, s->name, s->marks, s->grade);
}

int main() {
    printf("=== %s v%s ===\\n", APP_NAME, VERSION);
    printf("OS: %s | Compiled: %s %s\\n\\n", OS_NAME, __DATE__, __TIME__);

    // ── Macro demos ──
    printf("--- Utility Macros ---\\n");
    printf("MAX(10,20)        = %d\\n", MAX(10, 20));
    printf("MIN(10,20)        = %d\\n", MIN(10, 20));
    printf("ABS(-42)          = %d\\n", ABS(-42));
    printf("CLAMP(150,0,100)  = %d\\n", CLAMP(150, 0, 100));
    printf("CLAMP(-5,0,100)   = %d\\n", CLAMP(-5, 0, 100));

    int a = 5, b = 10;
    printf("Before SWAP: a=%d b=%d\\n", a, b);
    SWAP(int, a, b);
    printf("After  SWAP: a=%d b=%d\\n", a, b);

    int arr[] = {1,2,3,4,5,6,7,8};
    printf("ARRAY_SIZE(arr)   = %lu\\n", ARRAY_SIZE(arr));

    printf("\\n--- Stringify ---\\n");
    printf("STR(MAX_STUDENTS) = %s\\n", STR(MAX_STUDENTS));
    printf("STR(PI formula)   = %s\\n", STR(3.14159 * r * r));

    printf("\\n--- Grade System ---\\n");
    float scores[] = {95, 80, 65, 45, 30};
    printf("%-8s %-6s\\n", "Marks", "Grade");
    for (int i = 0; i < (int)ARRAY_SIZE(scores); i++) {
        printf("%-8.0f  %c\\n", scores[i], GET_GRADE(scores[i]));
    }

    printf("\\n--- Student Report ---\\n");
    Student batch[] = {
        {101,"Rahul",  87.5f, GET_GRADE(87.5f)},
        {102,"Priya",  95.0f, GET_GRADE(95.0f)},
        {103,"Aryan",  55.0f, GET_GRADE(55.0f)},
        {104,"Sneha",  38.0f, GET_GRADE(38.0f)},
    };
    printf("%-5s %-20s %-8s %s\\n","ID","Name","Marks","Grade");
    printf("─────────────────────────────────\\n");
    for (int i = 0; i < (int)ARRAY_SIZE(batch); i++)
        printStudentInfo(&batch[i]);

    printf("\\n__FILE__ = %s\\n", __FILE__);
    printf("__LINE__ = %d\\n", __LINE__);
    printf("__func__ = %s\\n", __func__);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

#define APP_NAME  "StudyEarn"
#define VERSION   "2.0"
#define MAX_SZ    100
#define PASS_MARK 40

#ifndef NDEBUG
  #define DBG(fmt,...) fprintf(stderr,"[%s:%d] " fmt "\\n",__func__,__LINE__,##__VA_ARGS__)
#else
  #define DBG(fmt,...) ((void)0)
#endif

#define MAX(a,b)      ((a)>(b)?(a):(b))
#define CLAMP(v,lo,hi) ((v)<(lo)?(lo):(v)>(hi)?(hi):(v))
#define SWAP(T,a,b)   do{T _t=(a);(a)=(b);(b)=_t;}while(0)
#define ARRAY_SZ(a)   (sizeof(a)/sizeof((a)[0]))
#define GRADE(m)      ((m)>=90?'O':(m)>=75?'A':(m)>=60?'B':(m)>=PASS_MARK?'C':'F')

#ifdef _WIN32
  #define OS "Windows"
#elif defined(__linux__)
  #define OS "Linux"
#else
  #define OS "Unknown"
#endif

int main(){
    printf("%s v%s on %s\\n", APP_NAME, VERSION, OS);
    int a=5,b=10; SWAP(int,a,b);
    printf("Swapped: %d %d\\n",a,b);
    float scores[]={95,80,65,45,30};
    for(int i=0;i<(int)ARRAY_SZ(scores);i++)
        printf("%.0f -> %c\\n", scores[i], GRADE(scores[i]));
    DBG("Done, MAX_SZ=%d", MAX_SZ);
    return 0;
}`,

      task: {
        description: 'Preprocessor practice: (1) Ek "portable_types.h" header banao — #ifdef se Windows/Linux/Mac detect karo, platform-specific types define karo (like uint8_t, uint32_t without stdint.h). Header guard lagao. (2) "Debug logger" macro system banao — LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR macros jo file+line+function automatically include karein. NDEBUG se debug off ho. (3) "Safe math" macro library — SAFE_ADD, SAFE_MUL overflow check ke saath, SAFE_DIV zero check ke saath.',
        description_en: 'Preprocessor practice: (1) Build a "portable_types.h" header — detect Windows/Linux/Mac with #ifdef, define platform-specific types (like uint8_t, uint32_t without stdint.h). Add header guards. (2) Build a "debug logger" macro system — LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR macros that automatically include file+line+function. Disable debug with NDEBUG. (3) "Safe math" macro library — SAFE_ADD, SAFE_MUL with overflow checks, SAFE_DIV with zero check.',
        hint: '#ifdef _WIN32 then __int8, __int32. Header guard: #ifndef FILE_H #define FILE_H ... #endif. Variadic macro: #define LOG(lvl,fmt,...) fprintf(stderr,"[" lvl "] %s:%d: " fmt "\\n",__FILE__,__LINE__,##__VA_ARGS__). SAFE_DIV: #define SAFE_DIV(a,b,r) ((b)!=0?((*(r)=(a)/(b)),1):0)',
        hint_en: '#ifdef _WIN32 then __int8, __int32. Header guard: #ifndef FILE_H #define FILE_H ... #endif. Variadic macro: #define LOG(lvl,fmt,...) fprintf(stderr,"[" lvl "] %s:%d: " fmt "\\n",__FILE__,__LINE__,##__VA_ARGS__). SAFE_DIV: #define SAFE_DIV(a,b,r) ((b)!=0?((*(r)=(a)/(b)),1):0)',
      },
      quiz: [
        {
          q: 'Header guard (#ifndef/#define/#endif) kyun use karte hain?',
          options: [
            'File ko password protect karne ke liye',
            'Ek hi header file ko multiple baar include karne se prevent karo — duplicate type definitions, redefinition errors avoid. #pragma once bhi same kaam karta hai lekin less portable.',
            'Code fast karne ke liye',
            'Compilation error fix karne ke liye',
          ],
          correct: 1,
          explanation: 'Bina guard: main.c includes a.h and b.h, both include types.h → types.h twice! Duplicate struct/typedef = compile error. Guard: pehli baar TYPES_H define hoti hai, doosri baar #ifndef false → skip. #pragma once = simpler alternative, almost all modern compilers support karte hain. Choose one style and be consistent.',
          q_en: 'Why do we use header guards (#ifndef/#define/#endif)?',
          options_en: [
            'To password-protect the file',
            'To prevent a header file from being included more than once — avoids duplicate type definitions and redefinition errors. #pragma once does the same but is less portable.',
            'To speed up the code',
            'To fix compilation errors',
          ],
          explanation_en: 'Without a guard: main.c includes a.h and b.h, both of which include types.h → types.h included twice! Duplicate struct/typedef = compile error. With a guard: the first time TYPES_H is defined; the second time #ifndef is false → skipped. #pragma once is a simpler alternative supported by virtually all modern compilers. Choose one style and be consistent.',
        },
        {
          q: '#define MAX(a,b) ((a)>(b)?(a):(b)) mein extra parentheses kyun hain?',
          options: [
            'Style ke liye',
            'Macro text substitution hai — operator precedence issues prevent karne ke liye. MAX(x+1,y*2) bina parens: x+1>y*2?x+1:y*2 = wrong! Saath parens: ((x+1)>(y*2)?(x+1):(y*2)) = correct.',
            'Compiler requirement hai',
            'Performance improve hoti hai',
          ],
          correct: 1,
          explanation: 'Macro = simple text replacement (not a function!). #define SQ(x) x*x aur SQ(2+3) = 2+3*2+3 = 11 (not 25!). Fix: #define SQ(x) ((x)*(x)). Outer parens: agar macro result kisi expression mein use ho toh — printf("%d", SQ(5)+1) bina outer: (5)*(5)+1 = 26. Max side effect: MAX(i++, j++) mein i ya j do baar increment ho sakta hai!',
          q_en: 'Why are the extra parentheses in #define MAX(a,b) ((a)>(b)?(a):(b)) necessary?',
          options_en: [
            'Just for style',
            'Macros are text substitution — to prevent operator precedence issues. MAX(x+1,y*2) without parens: x+1>y*2?x+1:y*2 = wrong! With parens: ((x+1)>(y*2)?(x+1):(y*2)) = correct.',
            'The compiler requires it',
            'It improves performance',
          ],
          explanation_en: 'Macros = simple text replacement (not functions!). #define SQ(x) x*x and SQ(2+3) = 2+3*2+3 = 11 (not 25!). Fix: #define SQ(x) ((x)*(x)). Outer parens: if the macro result is used in an expression — printf("%d", SQ(5)+1) without outer parens: (5)*(5)+1 = 26 ✅. Side-effect danger: MAX(i++, j++) may increment i or j twice!',
        },
        {
          q: 'Conditional compilation (#ifdef DEBUG) ka real-world use kya hai?',
          options: [
            'Sirf debugging ke liye',
            'Platform-specific code (Windows vs Linux), feature flags, debug vs release builds, API versioning — ek codebase se multiple configurations build karo.',
            'Code comment karne ke liye',
            'Variables declare karne ke liye',
          ],
          correct: 1,
          explanation: 'Real uses: (1) Debug builds: DBG macros, extra logging, assertions — gcc -DDEBUG. (2) Platform: #ifdef _WIN32 Windows API, #elif __linux__ POSIX. (3) Feature flags: #ifdef ENABLE_BLUETOOTH — mobile app mein. (4) API versions: #if API_VERSION >= 2. (5) Testing: #ifdef UNIT_TEST test stubs inject karo. (6) License tiers: features conditionally compile karo.',
          q_en: 'What is the real-world use of conditional compilation (#ifdef DEBUG)?',
          options_en: [
            'Only for debugging',
            'Platform-specific code (Windows vs Linux), feature flags, debug vs release builds, API versioning — build multiple configurations from one codebase.',
            'To comment out code',
            'To declare variables',
          ],
          explanation_en: 'Real uses: (1) Debug builds: DBG macros, extra logging, assertions — gcc -DDEBUG. (2) Platform: #ifdef _WIN32 Windows API, #elif __linux__ POSIX. (3) Feature flags: #ifdef ENABLE_BLUETOOTH in a mobile app. (4) API versions: #if API_VERSION >= 2. (5) Testing: #ifdef UNIT_TEST inject test stubs. (6) License tiers: conditionally compile features.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w7-s2',
      title: 'Advanced Macros aur Variadic Functions',
      title_en: 'Advanced Macros and Variadic Functions',
      emoji: '🔬',
      content: `## Advanced Macros — Power aur Pitfalls!

### Function-like Macros — Advanced Patterns

\`\`\`c
// ── do-while(0) trick — multi-statement macros ──
// ❌ Bad — agar if ke saath use karo toh broken!
#define INIT_BAD(x) x.a=0; x.b=0; x.c=0;
if (flag) INIT_BAD(obj);  // sirf obj.a=0 if ke andar!

// ✅ Good — do-while(0) wraps multiple statements safely
#define INIT(x) do { x.a=0; x.b=0; x.c=0; } while(0)
if (flag) INIT(obj);  // perfect!

// ── Stringify aur Token Pasting ──
#define STR(x)       #x        // x ko string literal banao
#define XSTR(x)      STR(x)    // macro expand karke stringify
#define CONCAT(a,b)  a##b      // two tokens join karo
#define FIELD(s,f)   s.f       // generic field access

// Examples
printf(STR(Hello World));     // "Hello World"
printf(XSTR(MAX_SIZE));       // "100" (expands MAX_SIZE first)

int CONCAT(my, Var) = 42;     // myVar = 42
int CONCAT(arr_, 5)[10];      // arr_5[10]

// ── X-Macro pattern — DRY principle ──
// Define data once, use in multiple places
#define COLORS \\
    X(RED,   0xFF0000) \\
    X(GREEN, 0x00FF00) \\
    X(BLUE,  0x0000FF) \\
    X(WHITE, 0xFFFFFF)

// Generate enum
typedef enum {
    #define X(name, val) COLOR_##name,
    COLORS
    #undef X
    COLOR_COUNT
} Color;

// Generate string array
const char *colorNames[] = {
    #define X(name, val) #name,
    COLORS
    #undef X
};

// Generate value array
const int colorValues[] = {
    #define X(name, val) val,
    COLORS
    #undef X
};

// Usage
printf("%s = 0x%06X\\n", colorNames[COLOR_RED], colorValues[COLOR_RED]);
// "RED = 0xFF0000"
\`\`\`

### Variadic Functions — Variable Arguments!

\`\`\`c
#include <stdarg.h>

// printf jaisi function banao — variable arguments!
// ... = zero ya zyada extra arguments

// ── Basic variadic ──
int mySum(int count, ...) {
    va_list args;
    va_start(args, count);  // initialize — count = last named param

    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += va_arg(args, int);  // next argument lo (type specify karo)
    }

    va_end(args);   // cleanup — ZARURI!
    return sum;
}

// Usage
printf("Sum: %d\\n", mySum(3, 10, 20, 30));  // 60
printf("Sum: %d\\n", mySum(5, 1,2,3,4,5));  // 15

// ── Custom printf-like logger ──
void myLog(const char *level, const char *fmt, ...) {
    printf("[%s] ", level);

    va_list args;
    va_start(args, fmt);
    vprintf(fmt, args);   // vprintf = printf with va_list
    va_end(args);

    printf("\\n");
}

myLog("INFO",  "Server started on port %d", 8080);
myLog("ERROR", "File %s not found (errno=%d)", "data.txt", errno);
myLog("DEBUG", "Processing %d records from %s", 100, "db");
\`\`\`

### Inline Functions — Macro ka Better Alternative

\`\`\`c
// ❌ Macro problems — no type checking, side effects
#define SQUARE(x) ((x)*(x))
SQUARE(i++);  // i incremented twice!

// ✅ Inline function — type safe, no side effects, same speed!
static inline int square(int x) { return x * x; }
static inline float squareF(float x) { return x * x; }

// Compiler decides whether to inline (hint, not mandate)
// Modern compilers inline small functions automatically

// Always inline (GCC extension)
static __attribute__((always_inline)) inline int fastAbs(int x) {
    return x < 0 ? -x : x;
}

// Never inline (for profiling/debugging)
__attribute__((noinline)) void expensiveFunc() { }
\`\`\`

### Compile-time Assertions (C11)

\`\`\`c
#include <assert.h>

// Static assert — compile time check!
_Static_assert(sizeof(int) == 4, "int must be 4 bytes");
_Static_assert(sizeof(long) >= 8, "long must be at least 8 bytes");

// struct size check
typedef struct { int a; char b; int c; } MyStruct;
_Static_assert(sizeof(MyStruct) % 4 == 0, "Struct must be 4-byte aligned");

// C11 macro alias
#define STATIC_ASSERT(cond, msg) _Static_assert(cond, msg)
STATIC_ASSERT(sizeof(void*) >= 4, "Need at least 32-bit pointers");
\`\`\`

### Generic Selection (C11) — Type-based Dispatch

\`\`\`c
// _Generic — compile-time type dispatch!
#define type_name(x) _Generic((x), \\
    int:    "int",           \\
    float:  "float",         \\
    double: "double",        \\
    char:   "char",          \\
    char*:  "string",        \\
    default:"unknown"        \\
)

#define abs_val(x) _Generic((x), \\
    int:    abs,      \\
    float:  fabsf,    \\
    double: fabs      \\
)(x)

// Usage
printf("%s\\n", type_name(42));      // "int"
printf("%s\\n", type_name(3.14f));   // "float"
printf("%s\\n", type_name("hello")); // "string"

printf("%.2f\\n", abs_val(-3.14f));  // 3.14 (calls fabsf)
printf("%d\\n",   abs_val(-42));     // 42   (calls abs)
\`\`\``,

      content_en: `## Advanced Macros — Power and Pitfalls!

### Function-like Macros — Advanced Patterns

\`\`\`c
// ── do-while(0) trick — multi-statement macros ──
// ❌ Bad — agar if ke saath use do toh broken!
#define INIT_BAD(x) x.a=0; x.b=0; x.c=0;
if (flag) INIT_BAD(obj);  // only obj.a=0 if ke andar!

// ✅ Good — do-while(0) wraps multiple statements safely
#define INIT(x) do { x.a=0; x.b=0; x.c=0; } while(0)
if (flag) INIT(obj);  // perfect!

// ── Stringify and Token Pasting ──
#define STR(x)       #x        // x ko string literal build
#define XSTR(x)      STR(x)    // macro expand karke stringify
#define CONCAT(a,b)  a##b      // two tokens join do
#define FIELD(s,f)   s.f       // generic field access

// Examples
printf(STR(Hello World));     // "Hello World"
printf(XSTR(MAX_SIZE));       // "100" (expands MAX_SIZE first)

int CONCAT(my, Var) = 42;     // myVar = 42
int CONCAT(arr_, 5)[10];      // arr_5[10]

// ── X-Macro pattern — DRY principle ──
// Define data once, use in multiple places
#define COLORS \\
    X(RED,   0xFF0000) \\
    X(GREEN, 0x00FF00) \\
    X(BLUE,  0x0000FF) \\
    X(WHITE, 0xFFFFFF)

// Generate enum
typedef enum {
    #define X(name, val) COLOR_##name,
    COLORS
    #undef X
    COLOR_COUNT
} Color;

// Generate string array
const char *colorNames[] = {
    #define X(name, val) #name,
    COLORS
    #undef X
};

// Generate value array
const int colorValues[] = {
    #define X(name, val) val,
    COLORS
    #undef X
};

// Usage
printf("%s = 0x%06X\\n", colorNames[COLOR_RED], colorValues[COLOR_RED]);
// "RED = 0xFF0000"
\`\`\`

### Variadic Functions — Variable Arguments!

\`\`\`c
#include <stdarg.h>

// printf jaisi function build — variable arguments!
// ... = zero or zyada extra arguments

// ── Basic variadic ──
int mySum(int count, ...) {
    va_list args;
    va_start(args, count);  // initialize — count = last named param

    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += va_arg(args, int);  // next argument lo (type specify do)
    }

    va_end(args);   // cleanup — ZARURI!
    return sum;
}

// Usage
printf("Sum: %d\\n", mySum(3, 10, 20, 30));  // 60
printf("Sum: %d\\n", mySum(5, 1,2,3,4,5));  // 15

// ── Custom printf-like logger ──
void myLog(const char *level, const char *fmt, ...) {
    printf("[%s] ", level);

    va_list args;
    va_start(args, fmt);
    vprintf(fmt, args);   // vprintf = printf with va_list
    va_end(args);

    printf("\\n");
}

myLog("INFO",  "Server started on port %d", 8080);
myLog("ERROR", "File %s not found (errno=%d)", "data.txt", errno);
myLog("DEBUG", "Processing %d records from %s", 100, "db");
\`\`\`

### Inline Functions — Macro ka Better Alternative

\`\`\`c
// ❌ Macro problems — no type checking, side effects
#define SQUARE(x) ((x)*(x))
SQUARE(i++);  // i incremented twice!

// ✅ Inline function — type safe, no side effects, same speed!
static inline int square(int x) { return x * x; }
static inline float squareF(float x) { return x * x; }

// Compiler decides whether to inline (hint, not mandate)
// Modern compilers inline small functions automatically

// Always inline (GCC extension)
static __attribute__((always_inline)) inline int fastAbs(int x) {
    return x < 0 ? -x : x;
}

// Never inline (for profiling/debugging)
__attribute__((noinline)) void expensiveFunc() { }
\`\`\`

### Compile-time Assertions (C11)

\`\`\`c
#include <assert.h>

// Static assert — compile time check!
_Static_assert(sizeof(int) == 4, "int must be 4 bytes");
_Static_assert(sizeof(long) >= 8, "long must be at least 8 bytes");

// struct size check
typedef struct { int a; char b; int c; } MyStruct;
_Static_assert(sizeof(MyStruct) % 4 == 0, "Struct must be 4-byte aligned");

// C11 macro alias
#define STATIC_ASSERT(cond, msg) _Static_assert(cond, msg)
STATIC_ASSERT(sizeof(void*) >= 4, "Need at least 32-bit pointers");
\`\`\`

### Generic Selection (C11) — Type-based Dispatch

\`\`\`c
// _Generic — compile-time type dispatch!
#define type_name(x) _Generic((x), \\
    int:    "int",           \\
    float:  "float",         \\
    double: "double",        \\
    char:   "char",          \\
    char*:  "string",        \\
    default:"unknown"        \\
)

#define abs_val(x) _Generic((x), \\
    int:    abs,      \\
    float:  fabsf,    \\
    double: fabs      \\
)(x)

// Usage
printf("%s\\n", type_name(42));      // "int"
printf("%s\\n", type_name(3.14f));   // "float"
printf("%s\\n", type_name("hello")); // "string"

printf("%.2f\\n", abs_val(-3.14f));  // 3.14 (calls fabsf)
printf("%d\\n",   abs_val(-42));     // 42   (calls abs)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdarg.h>
#include <string.h>
#include <time.h>

// ── X-Macro: define HTTP methods once ──
#define HTTP_METHODS \\
    X(GET,    "GET",    "Retrieve resource")  \\
    X(POST,   "POST",   "Create resource")    \\
    X(PUT,    "PUT",    "Update resource")    \\
    X(DELETE, "DELETE", "Delete resource")    \\
    X(PATCH,  "PATCH",  "Partial update")

// Generate enum
typedef enum {
#define X(id, name, desc) HTTP_##id,
    HTTP_METHODS
#undef X
    HTTP_COUNT
} HttpMethod;

// Generate name array
static const char *HTTP_NAME[] = {
#define X(id, name, desc) name,
    HTTP_METHODS
#undef X
};

// Generate desc array
static const char *HTTP_DESC[] = {
#define X(id, name, desc) desc,
    HTTP_METHODS
#undef X
};

// ── Log levels with X-macro ──
#define LOG_LEVELS \\
    L(DEBUG, "DBG", "\\033[36m") \\
    L(INFO,  "INF", "\\033[32m") \\
    L(WARN,  "WRN", "\\033[33m") \\
    L(ERROR, "ERR", "\\033[31m")

typedef enum {
#define L(lvl, abbr, color) LOG_##lvl,
    LOG_LEVELS
#undef L
} LogLevel;

static const char *LOG_ABBR[] = {
#define L(lvl, abbr, color) abbr,
    LOG_LEVELS
#undef L
};

static const char *LOG_COLOR[] = {
#define L(lvl, abbr, color) color,
    LOG_LEVELS
#undef L
};

// ── Variadic logger ──
void vlog(LogLevel lvl, const char *file, int line,
          const char *fmt, ...) {
    time_t t=time(NULL); struct tm *tm=localtime(&t);
    printf("%s[%s %02d:%02d:%02d %s:%d] ",
           LOG_COLOR[lvl], LOG_ABBR[lvl],
           tm->tm_hour, tm->tm_min, tm->tm_sec,
           file, line);
    va_list args; va_start(args, fmt);
    vprintf(fmt, args); va_end(args);
    printf("\\033[0m\\n");
}

#define LOG(lvl, fmt, ...) vlog(lvl, __FILE__, __LINE__, fmt, ##__VA_ARGS__)

// ── Variadic average ──
double average(int count, ...) {
    va_list a; va_start(a, count);
    double sum=0;
    for(int i=0;i<count;i++) sum += va_arg(a, double);
    va_end(a);
    return count > 0 ? sum/count : 0;
}

// ── Variadic string builder ──
char* buildStr(char *buf, size_t sz, int n, ...) {
    va_list a; va_start(a, n);
    buf[0]='\\0';
    for(int i=0;i<n;i++) {
        const char *s=va_arg(a,const char*);
        strncat(buf, s, sz-strlen(buf)-1);
    }
    va_end(a);
    return buf;
}

// ── Inline utility functions ──
static inline int clamp(int v, int lo, int hi) {
    return v<lo?lo:(v>hi?hi:v);
}
static inline float lerp(float a, float b, float t) {
    return a + (b-a)*t;
}
static inline int isPowerOf2(int n) {
    return n>0 && (n&(n-1))==0;
}

int main() {
    printf("=== HTTP Methods (X-Macro) ===\\n");
    for (int i=0;i<HTTP_COUNT;i++)
        printf("HTTP_%-7s | %-7s | %s\\n", HTTP_NAME[i], HTTP_NAME[i], HTTP_DESC[i]);

    printf("\\n=== Variadic Logger ===\\n");
    LOG(LOG_INFO,  "Server started on port %d", 8080);
    LOG(LOG_DEBUG, "Processing %d records", 42);
    LOG(LOG_WARN,  "Memory usage high: %d%%", 87);
    LOG(LOG_ERROR, "File not found: %s", "config.json");

    printf("\\n=== Variadic Functions ===\\n");
    printf("avg(10,20,30)       = %.2f\\n", average(3, 10.0,20.0,30.0));
    printf("avg(1,2,3,4,5)      = %.2f\\n", average(5, 1.0,2.0,3.0,4.0,5.0));

    char buf[200];
    buildStr(buf, sizeof(buf), 4, "Hello", ", ", "World", "!");
    printf("buildStr result     = '%s'\\n", buf);

    printf("\\n=== Inline Functions ===\\n");
    printf("clamp(150,0,100)    = %d\\n", clamp(150,0,100));
    printf("lerp(0,100,0.25f)   = %.1f\\n", lerp(0,100,0.25f));
    printf("isPowerOf2(64)      = %d\\n", isPowerOf2(64));
    printf("isPowerOf2(100)     = %d\\n", isPowerOf2(100));

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdarg.h>

// X-Macro for HTTP status codes
#define HTTP_STATUS \\
    X(200, "OK")           \\
    X(201, "Created")      \\
    X(400, "Bad Request")  \\
    X(404, "Not Found")    \\
    X(500, "Server Error")

const char* httpStatus(int code) {
    switch(code) {
        #define X(c,m) case c: return m;
        HTTP_STATUS
        #undef X
        default: return "Unknown";
    }
}

void myprintf(const char *fmt, ...) {
    va_list a; va_start(a,fmt);
    vprintf(fmt,a); va_end(a);
}

static inline int clamp(int v, int lo, int hi) {
    return v<lo?lo:v>hi?hi:v;
}

int main(){
    printf("%d = %s\\n", 200, httpStatus(200));
    printf("%d = %s\\n", 404, httpStatus(404));
    myprintf("Hello %s, you have %d points!\\n","Rahul",500);
    printf("clamp(150,0,100) = %d\\n", clamp(150,0,100));
    return 0;
}`,

      task: {
        description: 'Advanced macros practice: (1) "Type-generic min/max" — _Generic se float, double, int teeno ke liye kaam karne wala GENERIC_MIN(a,b) aur GENERIC_MAX(a,b) banao. (2) "State machine" X-Macro se — States (IDLE, RUNNING, PAUSED, STOPPED) aur Events (START, STOP, PAUSE, RESUME) define karo, transition table generate karo. (3) "Variadic printf-style" logger banao jo timestamp, level, file:line automatically add kare aur color output kare.',
        description_en: 'Advanced macros practice: (1) "Type-generic min/max" — use _Generic to build GENERIC_MIN(a,b) and GENERIC_MAX(a,b) that work for float, double, and int. (2) "State machine" with X-Macro — define States (IDLE, RUNNING, PAUSED, STOPPED) and Events (START, STOP, PAUSE, RESUME), generate the transition table. (3) Build a variadic printf-style logger that automatically adds timestamp, level, and file:line and outputs colour.',
        hint: '_Generic min: #define GMIN(a,b) _Generic((a), int:imin, float:fminf, double:fmin)(a,b). State machine: 2D array transitions[STATE_COUNT][EVENT_COUNT]. Logger: va_start/va_end + vfprintf.',
        hint_en: '_Generic min: #define GMIN(a,b) _Generic((a), int:imin, float:fminf, double:fmin)(a,b). State machine: 2D array transitions[STATE_COUNT][EVENT_COUNT]. Logger: va_start/va_end + vfprintf.',
      },
      quiz: [
        {
          q: 'Variadic function mein va_end() kyun zaruri hai?',
          options: [
            'Sirf convention',
            'va_end() cleanup karta hai — some architectures mein va_list special resources use karta hai. Bina va_end: memory leak, undefined behavior possible. Always va_start → va_arg → va_end pattern follow karo.',
            'va_end function end karta hai',
            'va_end return value set karta hai',
          ],
          correct: 1,
          explanation: 'va_list implementation platform-dependent hai — kuch architectures (like ARM, x86-64 with register passing) mein va_list actual memory allocate karta hai ya registers save karta hai. va_end() cleanup guarantee karta hai. C standard: "va_end must be called before function returns or calls va_start again". Safe pattern: always use va_end even if you think its a no-op on your platform.',
          q_en: 'Why is va_end() necessary in a variadic function?',
          options_en: [
            'Just convention',
            'va_end() performs cleanup — on some architectures, va_list uses special resources. Without va_end: memory leak or undefined behaviour possible. Always follow the va_start → va_arg → va_end pattern.',
            'va_end ends the function',
            'va_end sets the return value',
          ],
          explanation_en: 'The va_list implementation is platform-dependent — on some architectures (like ARM, x86-64 with register passing) va_list may allocate actual memory or save registers. va_end() guarantees cleanup. C standard: "va_end must be called before the function returns or calls va_start again." Safe pattern: always call va_end, even if it is a no-op on your platform.',
        },
        {
          q: 'X-Macro pattern ka main benefit kya hai?',
          options: [
            'Faster compilation',
            'DRY principle — data ek jagah define karo, multiple representations generate karo (enum, arrays, switch cases) bina duplication ke. Add/remove entry = ek jagah change, sab automatically update.',
            'Smaller executable',
            'Better debugging',
          ],
          correct: 1,
          explanation: 'X-Macro: ek data definition (#define LIST X(a) X(b) X(c)) se multiple uses: enum, string arrays, initialization code. Naya value add karo LIST mein → enum, array, switch sab automatically update. Duplication zero! Real use: error codes (Linux kernel), opcodes, state machines, test case lists.',
          q_en: 'What is the main benefit of the X-Macro pattern?',
          options_en: [
            'Faster compilation',
            'DRY principle — define data once, generate multiple representations (enum, arrays, switch cases) without duplication. Add/remove one entry = one change, everything updates automatically.',
            'Smaller executable',
            'Better debugging',
          ],
          explanation_en: 'X-Macro: from one data definition (#define LIST X(a) X(b) X(c)), generate multiple uses: enums, string arrays, initialisation code. Add a new value to LIST → enum, array, and switch all update automatically. Zero duplication! Real uses: error codes (Linux kernel), opcodes, state machines, test case lists.',
        },
        {
          q: 'Inline function macro se better kyun hai (zyada tar cases mein)?',
          options: [
            'Macros obsolete hain',
            'Inline function: type checking (compiler error on wrong type), no double-evaluation (i++ safe), debuggable, can be profiled, respects scope. Macros: no type check, side effects, can\'t debug inside.',
            'Inline functions faster hain hamesha',
            'Macros zyada portable hain',
          ],
          correct: 1,
          explanation: 'SQUARE(i++) macro: (i++)*(i++) = i incremented twice! inline square(i++): i++ evaluated once, safe. Type check: SQUARE("hello") compiles (macro)! inline square("hello") = compile error. Debugger: macro expanded hoti hai → step through impossible. Inline: normal function stepping. Modern C: macros for constants/conditional compilation, inline functions for small type-safe operations.',
          q_en: 'Why are inline functions better than macros in most cases?',
          options_en: [
            'Macros are obsolete',
            'Inline function: type checking (compiler error on wrong type), no double-evaluation (i++ is safe), debuggable, can be profiled, respects scope. Macros: no type checking, side effects, can\'t step through in debugger.',
            'Inline functions are always faster',
            'Macros are more portable',
          ],
          explanation_en: 'SQUARE(i++) macro: (i++)*(i++) = i incremented twice! inline square(i++): i++ evaluated once, safe. Type check: SQUARE("hello") compiles (macro)! inline square("hello") = compile error. Debugger: macros are expanded → impossible to step through. Inline: steps like a normal function. Modern C: use macros for constants and conditional compilation, inline functions for small type-safe operations.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w7-s3',
      title: 'Bitwise Operations — Bits Directly Manipulate Karo',
      title_en: 'Bitwise Operations — Manipulate Bits Directly',
      emoji: '🔢',
      content: `## Bitwise Operations — Low-Level Power!

C mein directly bits ke saath kaam kar sakte ho — hardware programming, networking, cryptography ke liye essential!

### Number Systems — Revision

\`\`\`
Decimal:  Base 10 (0-9)     — 42   = 4×10 + 2×1
Binary:   Base 2  (0,1)     — 0b101010 = 42
Octal:    Base 8  (0-7)     — 052      = 42
Hex:      Base 16 (0-F)     — 0x2A     = 42

Binary:  42 = 32+8+2 = 0b00101010
           Bit: 7654 3210
                0010 1010
                    ↑
                bit 1 = 1 (value 2)
\`\`\`

### 6 Bitwise Operators

\`\`\`c
unsigned int a = 0b1010;  // 10
unsigned int b = 0b1100;  // 12

// ── AND (&) — dono bits 1 ho toh 1 ──
// 1010
// 1100
// ────
// 1000  = 8
printf("a & b = %d\\n", a & b);  // 8

// ── OR (|) — koi bhi ek bit 1 ho toh 1 ──
// 1010
// 1100
// ────
// 1110  = 14
printf("a | b = %d\\n", a | b);  // 14

// ── XOR (^) — different ho toh 1 ──
// 1010
// 1100
// ────
// 0110  = 6
printf("a ^ b = %d\\n", a ^ b);  // 6

// ── NOT (~) — sab bits flip ──
// ~1010 = 0101...11110101 = -11 (signed) or large unsigned
printf("~a = %d\\n", ~a);  // -11 (two's complement)

// ── Left Shift (<<) — bits left move, zeros right se ──
// 0001010 << 1 = 0010100 = 20 (× 2 !)
printf("a << 1 = %d\\n", a << 1);  // 20  (10 × 2)
printf("a << 2 = %d\\n", a << 2);  // 40  (10 × 4)
printf("1 << 4 = %d\\n", 1 << 4);  // 16  (2^4)

// ── Right Shift (>>) — bits right move ──
// 0001010 >> 1 = 0000101 = 5 (÷ 2 !)
printf("a >> 1 = %d\\n", a >> 1);  // 5   (10 ÷ 2)
printf("a >> 2 = %d\\n", a >> 2);  // 2   (10 ÷ 4, truncated)
\`\`\`

### Bit Manipulation Tricks

\`\`\`c
// ── Bit set, clear, toggle, check ──
int n = 0b10100;  // 20

// Set bit k (make it 1)
int k = 1;
n |= (1 << k);     // n = 0b10110 = 22

// Clear bit k (make it 0)
n &= ~(1 << k);    // n = 0b10100 = 20

// Toggle bit k (flip)
n ^= (1 << k);     // n = 0b10110 = 22

// Check bit k
int isSet = (n >> k) & 1;   // 1 if set, 0 if clear
// OR:
int isSet2 = (n & (1 << k)) != 0;

// ── Power of 2 checks ──
int isPow2 = n > 0 && (n & (n-1)) == 0;
// 8 = 1000, 7 = 0111, 8&7 = 0000 → isPow2!
// 6 = 0110, 5 = 0101, 6&5 = 0100 → not pow2

// ── Count set bits (popcount) ──
int countBits(int n) {
    int count = 0;
    while (n) { count += n & 1; n >>= 1; }
    return count;
}
// OR: __builtin_popcount(n) — GCC built-in, single instruction!

// ── Lowest set bit ──
int lsb = n & (-n);  // isolate lowest 1-bit
// 12 = 1100, -12 = 0100 (two's complement), 1100 & 0100 = 0100 = 4

// ── Swap without temp ──
int x = 5, y = 10;
x ^= y; y ^= x; x ^= y;  // x=10, y=5 (clever but unreadable!)

// ── Multiply/Divide by power of 2 ──
int val = 5;
int mul4  = val << 2;   // 5 * 4 = 20 (faster than *)
int div8  = val >> 3;   // 5 / 8 = 0 (integer)
// Note: arithmetic shift right for signed (compiler-dependent)

// ── Get/Set nibble (4 bits) ──
uint8_t byte = 0xAB;  // 1010 1011
uint8_t hi   = (byte >> 4) & 0x0F;  // 0xA = 10 (high nibble)
uint8_t lo   = byte & 0x0F;          // 0xB = 11 (low nibble)
\`\`\`

### Real-World Bitwise Applications

\`\`\`c
// ── 1. Permission System (Linux-style) ──
#define PERM_READ    04  // 100 binary
#define PERM_WRITE   02  // 010 binary
#define PERM_EXECUTE 01  // 001 binary

int perms = PERM_READ | PERM_WRITE;  // 110 = 6 = rw-
if (perms & PERM_READ)    printf("readable\\n");
if (!(perms & PERM_EXECUTE)) printf("not executable\\n");

// ── 2. Color manipulation (RGB) ──
uint32_t color = 0xFF6366F1;  // ARGB: alpha=FF, r=63, g=66, b=F1

uint8_t alpha = (color >> 24) & 0xFF;  // 0xFF = 255
uint8_t red   = (color >> 16) & 0xFF;  // 0x63 = 99
uint8_t green = (color >>  8) & 0xFF;  // 0x66 = 102
uint8_t blue  =  color        & 0xFF;  // 0xF1 = 241

// Pack back
uint32_t newColor = ((uint32_t)alpha << 24) |
                    ((uint32_t)red   << 16) |
                    ((uint32_t)green <<  8) |
                    blue;

// ── 3. IP Address parsing ──
uint32_t ip = 0xC0A80101;  // 192.168.1.1

printf("%d.%d.%d.%d\\n",
    (ip >> 24) & 0xFF,  // 192
    (ip >> 16) & 0xFF,  // 168
    (ip >>  8) & 0xFF,  // 1
     ip        & 0xFF   // 1
);

// ── 4. State flags in a game ──
#define PLAYER_ALIVE     (1 << 0)  // 0001
#define PLAYER_INVINCIBLE (1 << 1) // 0010
#define PLAYER_JUMPING   (1 << 2)  // 0100
#define PLAYER_ATTACKING (1 << 3)  // 1000

int playerState = PLAYER_ALIVE | PLAYER_JUMPING;  // 0101 = 5

if (playerState & PLAYER_ALIVE)    printf("Player alive\\n");
if (playerState & PLAYER_JUMPING)  printf("Player jumping\\n");
playerState |=  PLAYER_INVINCIBLE;  // add invincible
playerState &= ~PLAYER_JUMPING;     // stop jumping
\`\`\``,

      content_en: `## Bitwise Operations — Low-Level Power!

C in directly bits ke saath kaam kar sakte ho — hardware programming, networking, cryptography ke liye essential!

### Number Systems — Revision

\`\`\`
Decimal:  Base 10 (0-9)     — 42   = 4×10 + 2×1
Binary:   Base 2  (0,1)     — 0b101010 = 42
Octal:    Base 8  (0-7)     — 052      = 42
Hex:      Base 16 (0-F)     — 0x2A     = 42

Binary:  42 = 32+8+2 = 0b00101010
           Bit: 7654 3210
                0010 1010
                    ↑
                bit 1 = 1 (value 2)
\`\`\`

### 6 Bitwise Operators

\`\`\`c
unsigned int a = 0b1010;  // 10
unsigned int b = 0b1100;  // 12

// ── AND (&) — dono bits 1 ho toh 1 ──
// 1010
// 1100
// ────
// 1000  = 8
printf("a & b = %d\\n", a & b);  // 8

// ── OR (|) — koi bhi ek bit 1 ho toh 1 ──
// 1010
// 1100
// ────
// 1110  = 14
printf("a | b = %d\\n", a | b);  // 14

// ── XOR (^) — different ho toh 1 ──
// 1010
// 1100
// ────
// 0110  = 6
printf("a ^ b = %d\\n", a ^ b);  // 6

// ── NOT (~) — sab bits flip ──
// ~1010 = 0101...11110101 = -11 (signed) or large unsigned
printf("~a = %d\\n", ~a);  // -11 (two's complement)

// ── Left Shift (<<) — bits left move, zeros right se ──
// 0001010 << 1 = 0010100 = 20 (× 2 !)
printf("a << 1 = %d\\n", a << 1);  // 20  (10 × 2)
printf("a << 2 = %d\\n", a << 2);  // 40  (10 × 4)
printf("1 << 4 = %d\\n", 1 << 4);  // 16  (2^4)

// ── Right Shift (>>) — bits right move ──
// 0001010 >> 1 = 0000101 = 5 (÷ 2 !)
printf("a >> 1 = %d\\n", a >> 1);  // 5   (10 ÷ 2)
printf("a >> 2 = %d\\n", a >> 2);  // 2   (10 ÷ 4, truncated)
\`\`\`

### Bit Manipulation Tricks

\`\`\`c
// ── Bit set, clear, toggle, check ──
int n = 0b10100;  // 20

// Set bit k (make it 1)
int k = 1;
n |= (1 << k);     // n = 0b10110 = 22

// Clear bit k (make it 0)
n &= ~(1 << k);    // n = 0b10100 = 20

// Toggle bit k (flip)
n ^= (1 << k);     // n = 0b10110 = 22

// Check bit k
int isSet = (n >> k) & 1;   // 1 if set, 0 if clear
// OR:
int isSet2 = (n & (1 << k)) != 0;

// ── Power of 2 checks ──
int isPow2 = n > 0 && (n & (n-1)) == 0;
// 8 = 1000, 7 = 0111, 8&7 = 0000 → isPow2!
// 6 = 0110, 5 = 0101, 6&5 = 0100 → not pow2

// ── Count set bits (popcount) ──
int countBits(int n) {
    int count = 0;
    while (n) { count += n & 1; n >>= 1; }
    return count;
}
// OR: __builtin_popcount(n) — GCC built-in, single instruction!

// ── Lowest set bit ──
int lsb = n & (-n);  // isolate lowest 1-bit
// 12 = 1100, -12 = 0100 (two's complement), 1100 & 0100 = 0100 = 4

// ── Swap without temp ──
int x = 5, y = 10;
x ^= y; y ^= x; x ^= y;  // x=10, y=5 (clever but unreadable!)

// ── Multiply/Divide by power of 2 ──
int val = 5;
int mul4  = val << 2;   // 5 * 4 = 20 (faster than *)
int div8  = val >> 3;   // 5 / 8 = 0 (integer)
// Note: arithmetic shift right for signed (compiler-dependent)

// ── Get/Set nibble (4 bits) ──
uint8_t byte = 0xAB;  // 1010 1011
uint8_t hi   = (byte >> 4) & 0x0F;  // 0xA = 10 (high nibble)
uint8_t lo   = byte & 0x0F;          // 0xB = 11 (low nibble)
\`\`\`

### Real-World Bitwise Applications

\`\`\`c
// ── 1. Permission System (Linux-style) ──
#define PERM_READ    04  // 100 binary
#define PERM_WRITE   02  // 010 binary
#define PERM_EXECUTE 01  // 001 binary

int perms = PERM_READ | PERM_WRITE;  // 110 = 6 = rw-
if (perms & PERM_READ)    printf("readable\\n");
if (!(perms & PERM_EXECUTE)) printf("not executable\\n");

// ── 2. Color manipulation (RGB) ──
uint32_t color = 0xFF6366F1;  // ARGB: alpha=FF, r=63, g=66, b=F1

uint8_t alpha = (color >> 24) & 0xFF;  // 0xFF = 255
uint8_t red   = (color >> 16) & 0xFF;  // 0x63 = 99
uint8_t green = (color >>  8) & 0xFF;  // 0x66 = 102
uint8_t blue  =  color        & 0xFF;  // 0xF1 = 241

// Pack back
uint32_t newColor = ((uint32_t)alpha << 24) |
                    ((uint32_t)red   << 16) |
                    ((uint32_t)green <<  8) |
                    blue;

// ── 3. IP Address parsing ──
uint32_t ip = 0xC0A80101;  // 192.168.1.1

printf("%d.%d.%d.%d\\n",
    (ip >> 24) & 0xFF,  // 192
    (ip >> 16) & 0xFF,  // 168
    (ip >>  8) & 0xFF,  // 1
     ip        & 0xFF   // 1
);

// ── 4. State flags in a game ──
#define PLAYER_ALIVE     (1 << 0)  // 0001
#define PLAYER_INVINCIBLE (1 << 1) // 0010
#define PLAYER_JUMPING   (1 << 2)  // 0100
#define PLAYER_ATTACKING (1 << 3)  // 1000

int playerState = PLAYER_ALIVE | PLAYER_JUMPING;  // 0101 = 5

if (playerState & PLAYER_ALIVE)    printf("Player alive\\n");
if (playerState & PLAYER_JUMPING)  printf("Player jumping\\n");
playerState |=  PLAYER_INVINCIBLE;  // add invincible
playerState &= ~PLAYER_JUMPING;     // stop jumping
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdint.h>
#include <string.h>

// ── Print binary representation ──
void printBin(uint32_t n, int bits) {
    for (int i=bits-1; i>=0; i--) {
        printf("%d", (n>>i)&1);
        if (i%4==0 && i>0) printf(" ");
    }
}

// ── Bit tricks ──
int countBits(uint32_t n) {
    int c=0; while(n){c+=n&1;n>>=1;} return c;
}
int highestBit(uint32_t n) {
    int pos=0; while(n>>=1) pos++; return pos;
}
uint32_t reverseBits(uint32_t n) {
    uint32_t r=0;
    for(int i=0;i<32;i++){r=(r<<1)|(n&1);n>>=1;}
    return r;
}

// ── RGB Color toolkit ──
typedef struct { uint8_t a,r,g,b; } Color;

Color fromHex(uint32_t hex) {
    return (Color){(hex>>24)&0xFF,(hex>>16)&0xFF,(hex>>8)&0xFF,hex&0xFF};
}
uint32_t toHex(Color c) {
    return ((uint32_t)c.a<<24)|((uint32_t)c.r<<16)|((uint32_t)c.g<<8)|c.b;
}
Color blendColors(Color fg, Color bg, float alpha) {
    return (Color){
        255,
        (uint8_t)(fg.r*alpha + bg.r*(1-alpha)),
        (uint8_t)(fg.g*alpha + bg.g*(1-alpha)),
        (uint8_t)(fg.b*alpha + bg.b*(1-alpha)),
    };
}
void printColor(const char *name, Color c) {
    printf("%-15s #%02X%02X%02X%02X  rgb(%3d,%3d,%3d)\\n",
           name, c.a,c.r,c.g,c.b, c.r,c.g,c.b);
}

// ── Bit flags for game entity ──
#define F_ALIVE     (1<<0)
#define F_VISIBLE   (1<<1)
#define F_SOLID     (1<<2)
#define F_MOVABLE   (1<<3)
#define F_ATTACKING (1<<4)
#define F_JUMPING   (1<<5)
#define F_INVINCIBLE (1<<6)

void printFlags(uint8_t f) {
    if(f&F_ALIVE)      printf("ALIVE ");
    if(f&F_VISIBLE)    printf("VISIBLE ");
    if(f&F_SOLID)      printf("SOLID ");
    if(f&F_MOVABLE)    printf("MOVABLE ");
    if(f&F_ATTACKING)  printf("ATTACKING ");
    if(f&F_JUMPING)    printf("JUMPING ");
    if(f&F_INVINCIBLE) printf("INVINCIBLE ");
    printf("(0x%02X)\\n", f);
}

int main() {
    // ── Basic bitwise ──
    printf("=== Bitwise Operations ===\\n");
    uint8_t a=0b10110100, b=0b11001010;
    printf("a   = "); printBin(a,8); printf(" = %d\\n", a);
    printf("b   = "); printBin(b,8); printf(" = %d\\n", b);
    printf("a&b = "); printBin(a&b,8); printf(" = %d\\n", a&b);
    printf("a|b = "); printBin(a|b,8); printf(" = %d\\n", a|b);
    printf("a^b = "); printBin(a^b,8); printf(" = %d\\n", a^b);
    printf("~a  = "); printBin((uint8_t)~a,8); printf(" = %d\\n",(uint8_t)~a);
    printf("a<<2= "); printBin((uint8_t)(a<<2),8); printf(" = %d\\n",(uint8_t)(a<<2));
    printf("a>>2= "); printBin(a>>2,8); printf(" = %d\\n", a>>2);

    // ── Bit tricks ──
    printf("\\n=== Bit Tricks ===\\n");
    uint32_t nums[] = {0,1,4,7,8,15,16,42,255};
    for (int i=0;i<9;i++) {
        uint32_t n=nums[i];
        printf("n=%-4d bits=%d highBit=%d pow2=%s lsb=%d\\n",
               n, countBits(n), highestBit(n),
               (n>0&&(n&(n-1))==0)?"YES":"NO ", n&(-n));
    }

    // ── RGB Color ──
    printf("\\n=== Color Manipulation ===\\n");
    Color violet = fromHex(0xFF6366F1);
    Color amber  = fromHex(0xFFF59E0B);
    printColor("Violet",  violet);
    printColor("Amber",   amber);
    Color blended = blendColors(violet, amber, 0.6f);
    printColor("Blended", blended);

    // ── Game flags ──
    printf("\\n=== Game Entity Flags ===\\n");
    uint8_t player = F_ALIVE | F_VISIBLE | F_SOLID | F_MOVABLE;
    printf("Initial: "); printFlags(player);
    player |= F_JUMPING;
    printf("Jump:    "); printFlags(player);
    player |= F_INVINCIBLE;
    printf("Invince: "); printFlags(player);
    player &= ~F_JUMPING;
    printf("Land:    "); printFlags(player);
    player &= ~F_INVINCIBLE;
    printf("Normal:  "); printFlags(player);

    // ── IP Address ──
    printf("\\n=== IP Parsing ===\\n");
    uint32_t ips[] = {0xC0A80101, 0x7F000001, 0x08080808};
    char *names[]  = {"192.168.1.1","127.0.0.1","8.8.8.8"};
    for(int i=0;i<3;i++) {
        printf("0x%08X = %d.%d.%d.%d (%s)\\n",
               ips[i],
               (ips[i]>>24)&0xFF,(ips[i]>>16)&0xFF,
               (ips[i]>> 8)&0xFF, ips[i]     &0xFF,
               names[i]);
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdint.h>

void printBin(uint8_t n) {
    for(int i=7;i>=0;i--) printf("%d",(n>>i)&1);
    printf(" = %3d", n);
}

int main(){
    uint8_t a=0b10110100, b=0b11001010;
    printf("a   = "); printBin(a); printf("\\n");
    printf("a&b = "); printBin(a&b); printf("\\n");
    printf("a|b = "); printBin(a|b); printf("\\n");
    printf("a^b = "); printBin(a^b); printf("\\n");
    printf("a<<1= "); printBin(a<<1); printf("\\n");

    // Bit tricks
    printf("\\nPow2? ");
    for(int n=0;n<=16;n++)
        if(n>0&&(n&(n-1))==0) printf("%d ",n);
    printf("\\n");

    // RGB
    uint32_t c=0xFF6366F1;
    printf("\\nColor: R=%d G=%d B=%d\\n",(c>>16)&0xFF,(c>>8)&0xFF,c&0xFF);
    return 0;
}`,

      task: {
        description: 'Bitwise practice: (1) "Bit Manipulation Library" banao — setBit(n,k), clearBit(n,k), toggleBit(n,k), getBit(n,k), countOnes(n), reverseBytes(uint32_t), isEven(n) using bitwise only. (2) "Simple Encryption" — XOR cipher: key ke saath string ko encrypt karo, decrypt karo (same function kaam karta hai). (3) "Chess Board" — 8x8 chess board ko 64-bit integer se represent karo. Pawn positions set karo, check karo koi piece hai ya nahi. (4) Gray Code — binary ko Gray code mein convert karo aur wapas.',
        description_en: 'Bitwise practice: (1) Build a "Bit Manipulation Library" — setBit(n,k), clearBit(n,k), toggleBit(n,k), getBit(n,k), countOnes(n), reverseBytes(uint32_t), isEven(n) using only bitwise operators. (2) "Simple Encryption" — XOR cipher: encrypt a string with a key, decrypt it (same function works both ways). (3) "Chess Board" — represent an 8x8 chess board as a 64-bit integer. Set pawn positions, check if a piece is present. (4) Gray Code — convert binary to Gray code and back.',
        hint: 'XOR cipher: for(i) encrypted[i]=str[i]^key[i%keylen]. Chess: uint64_t board; bit = row*8+col; board|=(1ULL<<bit). Gray code: gray=n^(n>>1). Reverse: n=g; while(g>>=1) n^=g.',
        hint_en: 'XOR cipher: for(i) encrypted[i]=str[i]^key[i%keylen]. Chess: uint64_t board; bit=row*8+col; board|=(1ULL<<bit). Gray code: gray=n^(n>>1). Reverse: n=g; while(g>>=1) n^=g.',
      },
      quiz: [
        {
          q: 'n & (n-1) kya karta hai aur iska kya practical use hai?',
          options: [
            'n se 1 subtract karta hai',
            'Lowest set bit clear karta hai. Use: isPowerOf2 (result==0 means pow2), countBits (keep clearing lowest bit until 0), hardware bit manipulation.',
            'n ko half karta hai',
            'n ka complement deta hai',
          ],
          correct: 1,
          explanation: 'n & (n-1): n-1 lowest set bit clear karta hai aur neeche ke sab bits set karta hai. n aur n-1 AND karne se woh lowest bit gone. Uses: (1) isPow2: n&(n-1)==0 iff exactly one bit set. (2) Count bits: loop {n&=(n-1); count++;} — faster than shifting. (3) Remove lowest set bit: classic bit trick! 12=1100, 11=1011, 12&11=1000 (cleared bit 2).',
          q_en: 'What does n & (n-1) do and what is its practical use?',
          options_en: [
            'Subtracts 1 from n',
            'Clears the lowest set bit. Uses: isPowerOf2 (result==0 means pow2), countBits (keep clearing the lowest bit until 0), hardware bit manipulation.',
            'Halves n',
            'Returns the complement of n',
          ],
          explanation_en: 'n & (n-1): n-1 clears the lowest set bit of n and sets all bits below it. ANDing n with n-1 removes that lowest bit. Uses: (1) isPow2: n&(n-1)==0 if and only if exactly one bit is set. (2) Count bits: loop {n&=(n-1); count++;} — faster than shifting. (3) Remove lowest set bit: a classic bit trick! 12=1100, 11=1011, 12&11=1000 (bit 2 cleared).',
        },
        {
          q: 'Left shift (<<) aur multiplication mein kya connection hai?',
          options: [
            'Koi connection nahi',
            'n << k = n × 2^k. Hardware level pe shift operations multiply se faster hain — single clock cycle. Compiler automatically multiplication to shift optimize karta hai powers of 2 ke liye.',
            'Left shift division karta hai',
            'Sirf unsigned integers ke liye kaam karta hai',
          ],
          correct: 1,
          explanation: 'Binary mein left shift = ek position left move = ×2. n<<1 = n×2, n<<2 = n×4, n<<3 = n×8, n<<k = n×2^k. Reverse: right shift n>>k = n÷2^k (integer division). Old days mein: manually use karte the optimization ke liye. Today: compiler automatic shift se optimize karta hai. Still useful: bitmasks (1<<3 = 0b1000 = position 3 ka flag).',
          q_en: 'What is the connection between left shift (<<) and multiplication?',
          options_en: [
            'No connection',
            'n << k = n × 2^k. At the hardware level, shift operations are faster than multiply — single clock cycle. Compilers automatically optimise multiplication to shifts for powers of 2.',
            'Left shift performs division',
            'Only works for unsigned integers',
          ],
          explanation_en: 'In binary, left shift = move one position left = ×2. n<<1 = n×2, n<<2 = n×4, n<<3 = n×8, n<<k = n×2^k. Reverse: right shift n>>k = n÷2^k (integer division). In the old days: used manually for optimisation. Today: compilers automatically optimise multiplications to shifts for powers of 2. Still useful: bitmasks (1<<3 = 0b1000 = flag for position 3).',
        },
        {
          q: 'XOR ka ek unique property kya hai jo encryption mein use hota hai?',
          options: [
            'XOR always returns 1',
            'a ^ b ^ b = a — XOR same value se XOR karo toh original value wapas milti hai. Isliye XOR cipher: encrypt(data, key) = decrypt(encrypted, key) — same function!',
            'XOR commutative nahi hai',
            'XOR sirf same numbers ke saath kaam karta hai',
          ],
          correct: 1,
          explanation: 'XOR self-inverse property: a ^ b ^ b = a ^ 0 = a. Isliye: encrypt = plaintext ^ key. decrypt = ciphertext ^ key = (plaintext^key)^key = plaintext. One-Time Pad (perfect secrecy) bhi XOR use karta hai — agar key truly random aur single-use ho. Swap without temp: x^=y; y^=x; x^=y; (clever lekin modern CPUs pe slower!)',
          q_en: 'What unique property of XOR is used in encryption?',
          options_en: [
            'XOR always returns 1',
            'a ^ b ^ b = a — XOR-ing with the same value twice returns the original. So XOR cipher: encrypt(data, key) = decrypt(encrypted, key) — same function!',
            'XOR is not commutative',
            'XOR only works with identical numbers',
          ],
          explanation_en: 'XOR self-inverse property: a ^ b ^ b = a ^ 0 = a. Therefore: encrypt = plaintext ^ key. decrypt = ciphertext ^ key = (plaintext^key)^key = plaintext. The One-Time Pad (perfect secrecy) also uses XOR — provided the key is truly random and used only once. Swap without a temp variable: x^=y; y^=x; x^=y; (clever, but slower on modern CPUs!)',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w7-s4',
      title: 'Week 7 Project — Bit Manipulation Toolkit + Config System',
      title_en: 'Week 7 Project — Bit Manipulation Toolkit + Config System',
      emoji: '🔧',
      content: `## Week 7 Project — Sab Combine Karo!

Is hafte seekha:
- Preprocessor — #define, conditional compilation, header guards
- Macros — advanced patterns, X-macros, variadic
- Inline functions — type-safe macro alternatives
- Bitwise operations — AND/OR/XOR/NOT/shifts
- Bit manipulation tricks

Ab ek **Complete Configuration & Permission System** banao!

### System Architecture

\`\`\`c
// ── Config file format ──
// [database]
// host=localhost
// port=5432
// max_connections=100
//
// [server]
// port=8080
// debug=true
// log_level=INFO

// ── Permission system (bitwise) ──
// Each resource has bitmask permissions
// Each user has bitmask for each resource type

// ── Build flags ──
#define CONFIG_MAX_SECTIONS  16
#define CONFIG_MAX_KEYS      64
#define CONFIG_MAX_VAL_LEN  256
#define CONFIG_MAX_KEY_LEN   64

// Feature flags
#define FEATURE_LOGGING     (1 << 0)  // 1
#define FEATURE_CACHING     (1 << 1)  // 2
#define FEATURE_COMPRESSION (1 << 2)  // 4
#define FEATURE_ENCRYPTION  (1 << 3)  // 8
#define FEATURE_ALL         0xFF
\`\`\`

### Config Parser Using Macros

\`\`\`c
// Type-safe config value access
#define CONFIG_GET_INT(cfg, sec, key, def) \\
    config_get_int(cfg, sec, key, def)

#define CONFIG_GET_STR(cfg, sec, key, def) \\
    config_get_str(cfg, sec, key, def)

#define CONFIG_GET_BOOL(cfg, sec, key, def) \\
    config_get_bool(cfg, sec, key, def)

// Validation macro
#define VALIDATE_PORT(p) \\
    ((p) >= 1 && (p) <= 65535)
#define VALIDATE_IP(s) \\
    (strlen(s) >= 7 && strstr(s, ".") != NULL)
\`\`\`

### Bitfield Struct — Efficient Storage

\`\`\`c
// Store 8 boolean flags in 1 byte (not 8 bytes!)
typedef struct {
    unsigned isAdmin     : 1;  // 1 bit
    unsigned isActive    : 1;
    unsigned isPremium   : 1;
    unsigned canRead     : 1;
    unsigned canWrite    : 1;
    unsigned canDelete   : 1;
    unsigned canExport   : 1;
    unsigned canImport   : 1;
} UserFlags;  // Total: 1 byte (not 8!)

// Usage
UserFlags f = {0};
f.isActive = 1;
f.canRead  = 1;
f.canWrite = 1;

if (f.canRead) { /* read allowed */ }
printf("UserFlags size: %lu bytes\\n", sizeof(UserFlags));  // 1 byte!

// Packed struct with bitfields
typedef struct {
    uint32_t year   : 12;  // 0-4095
    uint32_t month  : 4;   // 0-15
    uint32_t day    : 5;   // 0-31
    uint32_t hour   : 5;   // 0-31
    uint32_t minute : 6;   // 0-63
    // Total: 32 bits = 4 bytes (compressed date+time!)
} PackedDateTime;
\`\`\`

### Month 2 Summary

\`\`\`
Month 2 (Weeks 5-8) Summary:
  ✅ Week 5: Structures, Unions, Enums, Linked Lists
  ✅ Week 6: File I/O, Binary files, Error Handling
  ✅ Week 7: Preprocessor, Macros, Bitwise Operations
  📚 Week 8: Stack, Queue, Hash Table (next!)

Skills gained:
  - Custom data types (struct, union, enum)
  - Dynamic data structures (linked list)
  - File persistence (text + binary)
  - Error handling best practices
  - Preprocessor meta-programming
  - Low-level bit manipulation
  - Bitfields for memory efficiency
\`\`\``,

      content_en: `## Week 7 Project — Sab Combine Do!

Is hafte seekha:
- Preprocessor — #define, conditional compilation, header guards
- Macros — advanced patterns, X-macros, variadic
- Inline functions — type-safe macro alternatives
- Bitwise operations — AND/OR/XOR/NOT/shifts
- Bit manipulation tricks

Ab ek **Complete Configuration & Permission System** build!

### System Architecture

\`\`\`c
// ── Config file format ──
// [database]
// host=localhost
// port=5432
// max_connections=100
//
// [server]
// port=8080
// debug=true
// log_level=INFO

// ── Permission system (bitwise) ──
// Each resource has bitmask permissions
// Each user has bitmask for each resource type

// ── Build flags ──
#define CONFIG_MAX_SECTIONS  16
#define CONFIG_MAX_KEYS      64
#define CONFIG_MAX_VAL_LEN  256
#define CONFIG_MAX_KEY_LEN   64

// Feature flags
#define FEATURE_LOGGING     (1 << 0)  // 1
#define FEATURE_CACHING     (1 << 1)  // 2
#define FEATURE_COMPRESSION (1 << 2)  // 4
#define FEATURE_ENCRYPTION  (1 << 3)  // 8
#define FEATURE_ALL         0xFF
\`\`\`

### Config Parser Using Macros

\`\`\`c
// Type-safe config value access
#define CONFIG_GET_INT(cfg, sec, key, def) \\
    config_get_int(cfg, sec, key, def)

#define CONFIG_GET_STR(cfg, sec, key, def) \\
    config_get_str(cfg, sec, key, def)

#define CONFIG_GET_BOOL(cfg, sec, key, def) \\
    config_get_bool(cfg, sec, key, def)

// Validation macro
#define VALIDATE_PORT(p) \\
    ((p) >= 1 && (p) <= 65535)
#define VALIDATE_IP(s) \\
    (strlen(s) >= 7 && strstr(s, ".") != NULL)
\`\`\`

### Bitfield Struct — Efficient Storage

\`\`\`c
// Store 8 boolean flags in 1 byte (not 8 bytes!)
typedef struct {
    unsigned isAdmin     : 1;  // 1 bit
    unsigned isActive    : 1;
    unsigned isPremium   : 1;
    unsigned canRead     : 1;
    unsigned canWrite    : 1;
    unsigned canDelete   : 1;
    unsigned canExport   : 1;
    unsigned canImport   : 1;
} UserFlags;  // Total: 1 byte (not 8!)

// Usage
UserFlags f = {0};
f.isActive = 1;
f.canRead  = 1;
f.canWrite = 1;

if (f.canRead) { /* read allowed */ }
printf("UserFlags size: %lu bytes\\n", sizeof(UserFlags));  // 1 byte!

// Packed struct with bitfields
typedef struct {
    uint32_t year   : 12;  // 0-4095
    uint32_t month  : 4;   // 0-15
    uint32_t day    : 5;   // 0-31
    uint32_t hour   : 5;   // 0-31
    uint32_t minute : 6;   // 0-63
    // Total: 32 bits = 4 bytes (compressed date+time!)
} PackedDateTime;
\`\`\`

### Month 2 Summary

\`\`\`
Month 2 (Weeks 5-8) Summary:
  ✅ Week 5: Structures, Unions, Enums, Linked Lists
  ✅ Week 6: File I/O, Binary files, Error Handling
  ✅ Week 7: Preprocessor, Macros, Bitwise Operations
  📚 Week 8: Stack, Queue, Hash Table (next!)

Skills gained:
  - Custom data types (struct, union, enum)
  - Dynamic data structures (linked list)
  - File persistence (text + binary)
  - Error handling best practices
  - Preprocessor meta-programming
  - Low-level bit manipulation
  - Bitfields for memory efficiency
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <ctype.h>

// ── Build config ──
#define APP_NAME       "StudyEarn Config"
#define VERSION        "1.0.0"
#define MAX_ENTRIES    64
#define MAX_KLEN       32
#define MAX_VLEN       128
#define MAX_FEATURES   8

// ── Feature flags ──
#define FEAT_LOG    (1<<0)
#define FEAT_CACHE  (1<<1)
#define FEAT_COMP   (1<<2)
#define FEAT_ENC    (1<<3)
#define FEAT_AUDIT  (1<<4)

static const char *FEAT_NAMES[] = {
    "Logging","Caching","Compression","Encryption","Audit"
};

// ── Macros ──
#define FEAT_HAS(flags,f)  (((flags)&(f))!=0)
#define FEAT_ADD(flags,f)  ((flags)|=(f))
#define FEAT_DEL(flags,f)  ((flags)&=~(f))
#define FEAT_TOG(flags,f)  ((flags)^=(f))

#define MAX(a,b)    ((a)>(b)?(a):(b))
#define MIN(a,b)    ((a)<(b)?(a):(b))
#define CLAMP(v,lo,hi) MAX(lo,MIN(hi,v))
#define ARRAY_SZ(a) (sizeof(a)/sizeof((a)[0]))

#ifndef NDEBUG
  #define DBG(fmt,...) fprintf(stderr,"[DBG %s:%d] " fmt "\\n",__func__,__LINE__,##__VA_ARGS__)
#else
  #define DBG(fmt,...) ((void)0)
#endif

// ── Config entry ──
typedef struct {
    char key[MAX_KLEN];
    char val[MAX_VLEN];
} Entry;

typedef struct {
    Entry entries[MAX_ENTRIES];
    int   count;
} Config;

// ── Config functions ──
Config* cfg_create() {
    Config *c=(Config*)calloc(1,sizeof(Config));
    DBG("Config created");
    return c;
}

int cfg_set(Config *c, const char *k, const char *v) {
    if(!c||!k||!v) return 0;
    // update existing
    for(int i=0;i<c->count;i++) {
        if(strcmp(c->entries[i].key,k)==0) {
            strncpy(c->entries[i].val,v,MAX_VLEN-1);
            return 1;
        }
    }
    if(c->count>=MAX_ENTRIES) return 0;
    strncpy(c->entries[c->count].key,k,MAX_KLEN-1);
    strncpy(c->entries[c->count].val,v,MAX_VLEN-1);
    c->count++;
    return 1;
}

const char* cfg_get(const Config *c, const char *k, const char *def) {
    for(int i=0;i<c->count;i++)
        if(strcmp(c->entries[i].key,k)==0)
            return c->entries[i].val;
    return def;
}

int    cfg_int (const Config *c, const char *k, int    d){ const char *v=cfg_get(c,k,NULL); return v?atoi(v):d; }
float  cfg_flt (const Config *c, const char *k, float  d){ const char *v=cfg_get(c,k,NULL); return v?(float)atof(v):d; }
int    cfg_bool(const Config *c, const char *k, int    d){ const char *v=cfg_get(c,k,NULL); if(!v)return d; return strcmp(v,"true")==0||strcmp(v,"1")==0; }

void cfg_print(const Config *c) {
    printf("Config (%d entries):\\n", c->count);
    for(int i=0;i<c->count;i++)
        printf("  %-20s = %s\\n", c->entries[i].key, c->entries[i].val);
}

// ── Bitfield for user perms ──
typedef struct {
    unsigned isAdmin  : 1;
    unsigned isActive : 1;
    unsigned isPremium: 1;
    unsigned canRead  : 1;
    unsigned canWrite : 1;
    unsigned canDel   : 1;
    unsigned canExp   : 1;
    unsigned canImp   : 1;
} Perms;  // 1 byte!

void printPerms(const char *name, Perms p) {
    printf("%-15s [%s%s%s%s%s%s%s%s]\\n", name,
        p.isAdmin?"ADM ":"    ",
        p.isActive?"ACT ":"    ",
        p.isPremium?"PRE ":"    ",
        p.canRead?"R":"_", p.canWrite?"W":"_",
        p.canDel?"D":"_", p.canExp?"X":"_", p.canImp?"I":"_");
}

// ── Packed date ──
typedef struct {
    uint16_t year  : 12;
    uint16_t month : 4;
    uint8_t  day   : 5;
    uint8_t  hour  : 5;
    uint8_t  minute: 6;
} PDate;  // 5 bytes vs 20 bytes for separate ints!

int main() {
    printf("=== %s v%s ===\\n\\n", APP_NAME, VERSION);

    // ── Config demo ──
    Config *cfg = cfg_create();
    cfg_set(cfg, "host",     "localhost");
    cfg_set(cfg, "port",     "8080");
    cfg_set(cfg, "debug",    "true");
    cfg_set(cfg, "max_conn", "100");
    cfg_set(cfg, "app_name", APP_NAME);
    cfg_set(cfg, "version",  VERSION);

    cfg_print(cfg);
    printf("\\nhost = %s\\n",   cfg_get(cfg,"host","?"));
    printf("port = %d\\n",     cfg_int(cfg,"port",80));
    printf("debug = %s\\n",    cfg_bool(cfg,"debug",0)?"true":"false");
    printf("max_conn = %d\\n", cfg_int(cfg,"max_conn",10));

    // ── Feature flags ──
    printf("\\n=== Feature Flags ===\\n");
    uint8_t features = FEAT_LOG | FEAT_CACHE;
    for(int i=0;i<5;i++)
        printf("%-14s: %s\\n", FEAT_NAMES[i], FEAT_HAS(features,1<<i)?"ON":"OFF");

    FEAT_ADD(features, FEAT_ENC);
    FEAT_DEL(features, FEAT_CACHE);
    printf("\\nAfter update:\\n");
    for(int i=0;i<5;i++)
        printf("%-14s: %s\\n", FEAT_NAMES[i], FEAT_HAS(features,1<<i)?"ON":"OFF");

    // ── Permissions ──
    printf("\\n=== User Permissions ===\\n");
    printf("sizeof(Perms) = %lu byte(s)\\n\\n", sizeof(Perms));
    Perms admin  = {1,1,1,1,1,1,1,1};
    Perms user   = {0,1,0,1,1,0,0,0};
    Perms guest  = {0,1,0,1,0,0,0,0};
    Perms banned = {0,0,0,0,0,0,0,0};
    printPerms("Admin",  admin);
    printPerms("User",   user);
    printPerms("Guest",  guest);
    printPerms("Banned", banned);

    // ── Packed date ──
    printf("\\n=== Packed DateTime ===\\n");
    PDate d = {2024,3,15,10,30};
    printf("Date: %04d-%02d-%02d %02d:%02d\\n",
           d.year, d.month, d.day, d.hour, d.minute);
    printf("sizeof(PDate)  = %lu bytes (vs %lu for separate ints)\\n",
           sizeof(PDate), 5*sizeof(int));

    free(cfg);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#define MAX_E 32
typedef struct { char k[32]; char v[64]; } Entry;
typedef struct { Entry e[MAX_E]; int n; } Cfg;

Cfg* new_cfg(){ return (Cfg*)calloc(1,sizeof(Cfg)); }
void set(Cfg*c,const char*k,const char*v){
    for(int i=0;i<c->n;i++) if(!strcmp(c->e[i].k,k)){strncpy(c->e[i].v,v,63);return;}
    if(c->n<MAX_E){strncpy(c->e[c->n].k,k,31);strncpy(c->e[c->n].v,v,63);c->n++;}
}
const char* get(const Cfg*c,const char*k,const char*d){
    for(int i=0;i<c->n;i++) if(!strcmp(c->e[i].k,k)) return c->e[i].v;
    return d;
}

typedef struct { unsigned r:1,w:1,x:1,admin:1; } Perms;

int main(){
    Cfg*c=new_cfg();
    set(c,"host","localhost"); set(c,"port","8080"); set(c,"debug","true");
    printf("host=%s port=%s\\n", get(c,"host","?"), get(c,"port","?"));

    Perms admin={1,1,1,1}, user={1,1,0,0}, guest={1,0,0,0};
    printf("admin: r=%d w=%d x=%d\\n",admin.r,admin.w,admin.x);
    printf("user:  r=%d w=%d x=%d\\n",user.r,user.w,user.x);
    printf("sizeof(Perms)=%lu\\n",sizeof(Perms));
    free(c); return 0;
}`,

      task: {
        description: 'Week 7 Final Project — Complete Permission + Config System: (1) Config file parse karo — "key=value" format text file padho, cfg_load() banao. (2) INI file format support — [section] headers ke saath: cfg_get_section() banao. (3) Bitfield permissions ko file mein save/load karo (binary). (4) "Feature toggle system" — runtime pe features enable/disable karo, config file mein save karo. (5) "Bitmask calculator" — user se bitwise operations karwao interactively.',
        description_en: 'Week 7 Final Project — Complete Permission + Config System: (1) Parse a config file — read a "key=value" text file, build cfg_load(). (2) Add INI file format support — with [section] headers: build cfg_get_section(). (3) Save/load bitfield permissions to a binary file. (4) "Feature toggle system" — enable/disable features at runtime and save to config file. (5) "Bitmask calculator" — let the user perform bitwise operations interactively.',
        hint: 'Config load: fgets each line, skip # comments, sscanf(line,"%[^=]=%[^\\n]",k,v). INI sections: if(line[0]==\'[\') parse section name, prefix keys with "section.". Binary perms: fwrite(&perms,sizeof(Perms),1,fp). Feature toggle: update uint8_t, save to file.',
        hint_en: 'Config load: fgets each line, skip # comments, sscanf(line,"%[^=]=%[^\\n]",k,v). INI sections: if(line[0]==\'[\') parse section name, prefix keys with "section.". Binary perms: fwrite(&perms,sizeof(Perms),1,fp). Feature toggle: update uint8_t, save to file.',
      },
      quiz: [
        {
          q: 'Bitfield struct ka main advantage kya hai?',
          options: [
            'Faster execution',
            'Memory efficiency — multiple boolean/small values ek word mein pack karo. 8 bool flags = 8 bytes normally, bitfield mein = 1 byte! Embedded systems, network packets, OS kernel structures mein critical.',
            'Type safety',
            'Easier debugging',
          ],
          correct: 1,
          explanation: 'Bitfield: struct mein member ke baad ": n" likho — n bits allocate. Bool flags: normally int per bool = 4 bytes × 8 = 32 bytes. Bitfield: 8 bits = 1 byte! OS kernel: process flags, file mode bits. Network: TCP header bitfields. Embedded: sensor data packing. Trade-off: bit-level access slower than byte-level, no address-of operator on bitfield members.',
          q_en: 'What is the main advantage of a bitfield struct?',
          options_en: [
            'Faster execution',
            'Memory efficiency — pack multiple boolean/small values into one word. 8 bool flags = 8 bytes normally, bitfield = 1 byte! Critical for embedded systems, network packets, OS kernel structures.',
            'Type safety',
            'Easier debugging',
          ],
          explanation_en: 'Bitfield: write ": n" after a struct member — allocates n bits. Bool flags: normally int per bool = 4 bytes × 8 = 32 bytes. Bitfield: 8 bits = 1 byte! OS kernel: process flags, file mode bits. Networking: TCP header bitfields. Embedded: sensor data packing. Trade-off: bit-level access is slower than byte-level, and you cannot take the address of a bitfield member.',
        },
        {
          q: 'Preprocessor macros aur functions mein compilation time pe kya difference hota hai?',
          options: [
            'Koi difference nahi',
            'Macros: preprocessor stage pe TEXT substitution hoti hai — compiler ko pehle. Functions: compile stage pe. Macros no overhead (inline substitution), but no type check, no address-of, can cause issues with side effects.',
            'Functions faster compile hoti hain',
            'Macros binary mein nahi hote',
          ],
          correct: 1,
          explanation: 'Timeline: Source → Preprocessor (macros expand) → Compiler (functions compile) → Linker → Executable. Macro SQUARE(x): compiler dekhta hai ((x)*(x)) not SQUARE. Function square(): compiler dekhta hai actual function. Performance: macros = always inlined. Functions = maybe inlined (inline hint). Modern: inline keyword + compiler = best of both worlds. Macros best for: constants, conditional compilation, code generation.',
          q_en: 'What is the compilation-time difference between preprocessor macros and functions?',
          options_en: [
            'No difference',
            'Macros: TEXT substitution at the preprocessor stage — before the compiler sees it. Functions: at the compile stage. Macros have no overhead (inline substitution) but no type checking, no address-of, and side-effect issues.',
            'Functions compile faster',
            'Macros do not appear in the binary',
          ],
          explanation_en: 'Timeline: Source → Preprocessor (macros expand) → Compiler (functions compile) → Linker → Executable. Macro SQUARE(x): the compiler sees ((x)*(x)), not SQUARE. Function square(): the compiler sees an actual function call. Performance: macros = always inlined. Functions = maybe inlined (inline hint). Modern: inline keyword + compiler = best of both worlds. Best use for macros: constants, conditional compilation, code generation.',
        },
        {
          q: 'Two\'s complement mein negative number kaise represent hota hai?',
          options: [
            'Pehla bit sign bit hai bas',
            'Flip all bits (one\'s complement) + 1 add karo. -5: 5=0000 0101 → flip=1111 1010 → +1=1111 1011. Benefit: addition/subtraction same hardware, single zero representation.',
            'Pehla bit 1 matlab negative',
            'XOR se calculate hota hai',
          ],
          correct: 1,
          explanation: 'Two\'s complement: most modern systems use this. -n = ~n + 1. -1 = ~0+1 = 11111111. Range: int8 = -128 to +127 (not -127). Why popular: (1) Single zero (sign-magnitude had +0 and -0). (2) Addition same circuit works for positive and negative. (3) Overflow wraps predictably. Bitwise trick: n & (-n) = lowest set bit uses two\'s complement property!',
          q_en: 'How is a negative number represented in two\'s complement?',
          options_en: [
            'The first bit is just a sign bit',
            'Flip all bits (one\'s complement) + add 1. -5: 5=0000 0101 → flip=1111 1010 → +1=1111 1011. Benefit: addition/subtraction uses the same hardware, single zero representation.',
            'The first bit being 1 means negative',
            'Calculated with XOR',
          ],
          explanation_en: 'Two\'s complement: used on virtually all modern systems. -n = ~n + 1. -1 = ~0+1 = 11111111. Range: int8 = -128 to +127 (not -127). Why it is popular: (1) Single zero (sign-magnitude had +0 and -0). (2) The same addition circuit works for both positive and negative numbers. (3) Overflow wraps predictably. Bit trick: n & (-n) = lowest set bit uses the two\'s complement property!',
        },
      ],
    },
  ],
};