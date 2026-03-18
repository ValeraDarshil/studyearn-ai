/**
 * StudyEarn AI — C Programming Course
 * Week 5: Structures, Unions aur Enums — Custom Data Types
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_5 = {
  week: 5,
  title: 'Structures, Unions aur Enums — Apne Data Types Banao',
  title_en: 'Structures, Unions and Enums — Create Your Own Data Types',
  description: 'struct se complex data types banao, union se memory share karo, enum se named constants banao — professional C code ki neenv!',
  description_en: 'Build complex data types with struct, share memory with union, create named constants with enum — the foundation of professional C code!',
  xpReward: 220,
  sections: [
    {
      id: 'c-w5-s1',
      title: 'struct — Custom Data Types Banao',
      title_en: 'struct — Build Custom Data Types',
      emoji: '🏗️',
      content: `## struct — Related Data ko Ek Jagah Rakho!

Abhi tak: ek student ke liye alag alag variables — name, age, marks, grade.
struct se: sab kuch ek unit mein! Jaise real world mein ek "Student" hota hai.

### Basic struct

\`\`\`c
// struct define karo
struct Student {
    int   rollNo;
    char  name[50];
    float marks;
    char  grade;
    int   age;
};

// Variable declare karo
struct Student s1;
struct Student s2 = {101, "Rahul", 85.5f, 'A', 20};  // initialize

// Access — dot operator
s1.rollNo = 102;
strcpy(s1.name, "Priya");
s1.marks = 92.0f;
s1.grade = 'A';
s1.age   = 19;

printf("%d %s %.1f %c\\n", s1.rollNo, s1.name, s1.marks, s1.grade);
\`\`\`

### typedef — Cleaner Syntax

\`\`\`c
// Without typedef — har baar 'struct' likhna padta hai
struct Student s1;

// With typedef — shorter!
typedef struct {
    int   rollNo;
    char  name[50];
    float marks[5];
    float average;
    char  grade;
} Student;

Student s1;              // ✅ no 'struct' keyword needed
Student s2 = {0};        // zero-initialize sab kuch

// Named struct + typedef — self-referential structures ke liye zaruri (linked list)
typedef struct Node {
    int         data;
    struct Node *next;  // khud ko point karna — typedef pehle complete nahi hoti
} Node;
\`\`\`

### struct Memory Layout aur Padding

\`\`\`c
typedef struct {
    char  a;    // 1 byte
    // 3 bytes padding (compiler adds for alignment!)
    int   b;    // 4 bytes
    char  c;    // 1 byte
    // 3 bytes padding
    float d;    // 4 bytes
} Padded;  // Total: 16 bytes (not 10!)

typedef struct {
    int   b;    // 4 bytes
    float d;    // 4 bytes
    char  a;    // 1 byte
    char  c;    // 1 byte
    // 2 bytes padding
} Packed;  // Total: 12 bytes — reordering saves memory!

printf("Padded: %lu bytes\\n", sizeof(Padded));  // 16
printf("Packed: %lu bytes\\n", sizeof(Packed));  // 12

// Force no padding (gcc extension)
typedef struct __attribute__((packed)) {
    char a; int b; char c; float d;
} NoPad;  // exactly 10 bytes (careful — unaligned access can be slow!)
\`\`\`

### Nested Structures

\`\`\`c
typedef struct {
    int day, month, year;
} Date;

typedef struct {
    float latitude;
    float longitude;
} Location;

typedef struct {
    char     name[50];
    Date     birthDate;
    Date     enrollDate;
    Location hometown;
    float    gpa;
} Student;

Student s;
s.birthDate.day   = 15;
s.birthDate.month = 8;
s.birthDate.year  = 2003;
s.hometown.latitude  = 19.076f;   // Mumbai
s.hometown.longitude = 72.877f;

printf("Born: %d/%d/%d\\n",
    s.birthDate.day,
    s.birthDate.month,
    s.birthDate.year);
\`\`\`

### Array of Structures

\`\`\`c
typedef struct {
    int   roll;
    char  name[40];
    float marks;
} Student;

Student class[50];  // 50 students ka array
int count = 0;

// Add student
class[count].roll  = 101;
strcpy(class[count].name, "Rahul");
class[count].marks = 88.5f;
count++;

// Loop through all
for (int i = 0; i < count; i++) {
    printf("%d. %s — %.1f\\n", class[i].roll, class[i].name, class[i].marks);
}

// Sort by marks (qsort)
int cmpMarks(const void *a, const void *b) {
    Student *sa = (Student*)a;
    Student *sb = (Student*)b;
    return (sb->marks - sa->marks) > 0 ? 1 : -1;  // descending
}
qsort(class, count, sizeof(Student), cmpMarks);
\`\`\`

### Structures aur Functions

\`\`\`c
typedef struct { int x, y; } Point;
typedef struct { Point center; float radius; } Circle;

// Pass by value — copy milti hai (large struct ke liye inefficient!)
float circleArea(Circle c) {
    return 3.14159f * c.radius * c.radius;
}

// Pass by pointer — efficient! (recommended for large structs)
float circleAreaPtr(const Circle *c) {
    return 3.14159f * c->radius * c->radius;
}

// Return struct by value
Point midpoint(Point p1, Point p2) {
    Point mid;
    mid.x = (p1.x + p2.x) / 2;
    mid.y = (p1.y + p2.y) / 2;
    return mid;
}

// Usage
Circle c = {{0, 0}, 5.0f};
printf("Area: %.2f\\n", circleAreaPtr(&c));

Point a = {0, 0}, b = {10, 8};
Point m = midpoint(a, b);
printf("Midpoint: (%d, %d)\\n", m.x, m.y);  // (5, 4)
\`\`\`

### struct Assignment aur Comparison

\`\`\`c
Student s1 = {101, "Rahul", 85.5f};
Student s2 = s1;  // ✅ Shallow copy — OK for simple structs

s2.roll = 102;   // s1.roll unchanged (copy!)
strcpy(s2.name, "Priya");

// ❌ Direct comparison nahi kar sakte
if (s1 == s2) { }  // COMPILE ERROR!

// ✅ Field by field compare karo
if (s1.roll == s2.roll && strcmp(s1.name, s2.name) == 0) {
    printf("Same student\\n");
}

// Ya memcmp (sirf POD structs ke liye — padding issues)
if (memcmp(&s1, &s2, sizeof(Student)) == 0) {
    printf("Identical\\n");
}
\`\`\``,

      content_en: `## struct — Related Data to Ek Jagah Rakho!

Abhi tak: ek student for separately variables — name, age, marks, grade.
struct se: all some ek unit mein! Like real world in ek "Student" it is.

### Basic struct

\`\`\`c
// struct define do
struct Student {
 int rollNo;
 char name[50];
 float marks;
 char grade;
 int age;
};

// Variable declare do
struct Student s1;
struct Student s2 = {101, "Rahul", 85.5f, 'A', 20}; // initialize

// Access — dot operator
s1.rollNo = 102;
strcpy(s1.name, "Priya");
s1.marks = 92.0f;
s1.grade = 'A';
s1.age = 19;

printf("%d %s %.1f %c\\n", s1.rollNo, s1.name, s1.marks, s1.grade);
\`\`\`

### typedef — Cleaner Syntax

\`\`\`c
// Without typedef — every time 'struct' you have to write
struct Student s1;

// With typedef — shorter!
typedef struct {
 int rollNo;
 char name[50];
 float marks[5];
 float average;
 char grade;
} Student;

Student s1; // ✅ no 'struct' keyword needed
Student s2 = {0}; // zero-initialize all some

// Named struct + typedef — self-referential structures for necessary (linked list)
typedef struct Node {
 int data;
 struct Node *next; // khud to point to do — typedef first complete not hoti
} Node;
\`\`\`

### struct Memory Layout and Padding

\`\`\`c
typedef struct {
 char a; // 1 byte
 // 3 bytes padding (compiler adds for alignment!)
 int b; // 4 bytes
 char c; // 1 byte
 // 3 bytes padding
 float d; // 4 bytes
} Padded; // Total: 16 bytes (not 10!)

typedef struct {
 int b; // 4 bytes
 float d; // 4 bytes
 char a; // 1 byte
 char c; // 1 byte
 // 2 bytes padding
} Packed; // Total: 12 bytes — reordering saves memory!

printf("Padded: %lu bytes\\n", sizeof(Padded)); // 16
printf("Packed: %lu bytes\\n", sizeof(Packed)); // 12

// Force no padding (gcc extension)
typedef struct __attribute__((packed)) {
 char a; int b; char c; float d;
} NoPad; // exactly 10 bytes (careful — unaligned access can be slow!)
\`\`\`

### Nested Structures

\`\`\`c
typedef struct {
 int day, month, year;
} Date;

typedef struct {
 float latitude;
 float longitude;
} Location;

typedef struct {
 char name[50];
 Date birthDate;
 Date enrollDate;
 Location hometown;
 float gpa;
} Student;

Student s;
s.birthDate.day = 15;
s.birthDate.month = 8;
s.birthDate.year = 2003;
s.hometown.latitude = 19.076f; // Mumbai
s.hometown.longitude = 72.877f;

printf("Born: %d/%d/%d\\n",
 s.birthDate.day,
 s.birthDate.month,
 s.birthDate.year);
\`\`\`

### Array of Structures

\`\`\`c
typedef struct {
 int roll;
 char name[40];
 float marks;
} Student;

Student class[50]; // 50 students's array
int count = 0;

// Add student
class[count].roll = 101;
strcpy(class[count].name, "Rahul");
class[count].marks = 88.5f;
count++;

// Loop through all
for (int i = 0; i < count; i++) {
 printf("%d. %s — %.1f\\n", class[i].roll, class[i].name, class[i].marks);
}

// Sort by marks (qsort)
int cmpMarks(const void *a, const void *b) {
 Student *sa = (Student*)a;
 Student *sb = (Student*)b;
 return (sb->marks - sa->marks) > 0 ? 1 : -1; // descending
}
qsort(class, count, sizeof(Student), cmpMarks);
\`\`\`

### Structures and Functions

\`\`\`c
typedef struct { int x, y; } Point;
typedef struct { Point center; float radius; } Circle;

// Pass by value — copy milti is (large struct for inefficient!)
float circleArea(Circle c) {
 return 3.14159f * c.radius * c.radius;
}

// Pass by pointer — efficient! (recommended for large structs)
float circleAreaPtr(const Circle *c) {
 return 3.14159f * c->radius * c->radius;
}

// Return struct by value
Point midpoint(Point p1, Point p2) {
 Point mid;
 mid.x = (p1.x + p2.x) / 2;
 mid.y = (p1.y + p2.y) / 2;
 return mid;
}

// Usage
Circle c = {{0, 0}, 5.0f};
printf("Area: %.2f\\n", circleAreaPtr(&c));

Point a = {0, 0}, b = {10, 8};
Point m = midpoint(a, b);
printf("Midpoint: (%d, %d)\\n", m.x, m.y); // (5, 4)
\`\`\`

### struct Assignment and Comparison

\`\`\`c
Student s1 = {101, "Rahul", 85.5f};
Student s2 = s1; // ✅ Shallow copy — OK for simple structs

s2.roll = 102; // s1.roll unchanged (copy!)
strcpy(s2.name, "Priya");

// ❌ Direct comparison not kar sakte
if (s1 == s2) { } // COMPILE ERROR!

// ✅ Field by field compare do
if (s1.roll == s2.roll && strcmp(s1.name, s2.name) == 0) {
 printf("Same student\\n");
}

// Ya memcmp (only POD structs for — padding issues)
if (memcmp(&s1, &s2, sizeof(Student)) == 0) {
 printf("Identical\\n");
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

// ── Date structure ──
typedef struct {
    int day, month, year;
} Date;

// ── Address structure ──
typedef struct {
    char street[60];
    char city[30];
    char state[20];
    int  pincode;
} Address;

// ── Student structure ──
typedef struct {
    int     rollNo;
    char    name[50];
    float   marks[5];
    float   total;
    float   percentage;
    char    grade;
    Date    dob;
    Address addr;
} Student;

char *SUBJECTS[] = {"Math", "Physics", "Chemistry", "English", "CS"};

void calcGrade(Student *s) {
    s->total = 0;
    for (int i = 0; i < 5; i++) s->total += s->marks[i];
    s->percentage = s->total / 5.0f;
    if      (s->percentage >= 90) s->grade = 'A';
    else if (s->percentage >= 75) s->grade = 'B';
    else if (s->percentage >= 60) s->grade = 'C';
    else if (s->percentage >= 45) s->grade = 'D';
    else                          s->grade = 'F';
}

void printStudent(const Student *s) {
    printf("╔══════════════════════════════════════╗\\n");
    printf("║ Roll: %-5d  %-26s║\\n", s->rollNo, s->name);
    printf("╠══════════════════════════════════════╣\\n");
    printf("║ DOB: %02d/%02d/%04d                      ║\\n",
           s->dob.day, s->dob.month, s->dob.year);
    printf("║ City: %-32s║\\n", s->addr.city);
    printf("╠══════════════════════════════════════╣\\n");
    for (int i = 0; i < 5; i++)
        printf("║ %-12s: %5.1f                   ║\\n", SUBJECTS[i], s->marks[i]);
    printf("╠══════════════════════════════════════╣\\n");
    printf("║ Total: %-6.1f  Avg: %-5.1f  Grade: %c  ║\\n",
           s->total, s->percentage, s->grade);
    printf("╚══════════════════════════════════════╝\\n");
}

int cmpByPct(const void *a, const void *b) {
    const Student *sa = (const Student*)a;
    const Student *sb = (const Student*)b;
    if (sb->percentage > sa->percentage) return 1;
    if (sb->percentage < sa->percentage) return -1;
    return 0;
}

int main() {
    Student batch[] = {
        {101, "Rahul Sharma",  {85, 78, 90, 88, 92}, 0, 0, 0, {15, 8, 2003}, {"MG Road", "Mumbai", "MH", 400001}},
        {102, "Priya Patel",   {92, 95, 88, 91, 97}, 0, 0, 0, {22, 3, 2004}, {"SG Hwy",  "Surat",  "GJ", 395007}},
        {103, "Aryan Singh",   {70, 65, 72, 68, 75}, 0, 0, 0, {10, 1, 2003}, {"Civil Lines","Delhi","DL", 110001}},
        {104, "Sneha Nair",    {88, 82, 85, 90, 87}, 0, 0, 0, {5,  7, 2004}, {"MG Road", "Kochi",  "KL", 682001}},
        {105, "Vikram Rao",    {55, 60, 50, 65, 58}, 0, 0, 0, {18, 11,2002}, {"Banjara Hills","Hyd","TS",500034}},
    };
    int n = sizeof(batch) / sizeof(batch[0]);

    // Calculate grades
    for (int i = 0; i < n; i++) calcGrade(&batch[i]);

    // Print all
    printf("\\n=== STUDENT BATCH REPORT ===\\n\\n");
    for (int i = 0; i < n; i++) printStudent(&batch[i]);

    // Sort by percentage
    qsort(batch, n, sizeof(Student), cmpByPct);

    printf("\\n=== RANKING ===\\n");
    for (int i = 0; i < n; i++)
        printf("#%d %-20s %.1f%% (Grade %c)\\n",
               i+1, batch[i].name, batch[i].percentage, batch[i].grade);

    // Stats
    float sum = 0, maxP = 0, minP = 100;
    int pass = 0;
    for (int i = 0; i < n; i++) {
        sum += batch[i].percentage;
        if (batch[i].percentage > maxP) maxP = batch[i].percentage;
        if (batch[i].percentage < minP) minP = batch[i].percentage;
        if (batch[i].percentage >= 45) pass++;
    }
    printf("\\nClass Avg: %.1f%%  Max: %.1f%%  Min: %.1f%%\\n",
           sum/n, maxP, minP);
    printf("Pass: %d/%d  Fail: %d/%d\\n", pass, n, n-pass, n);

    // Memory size
    printf("\\nstruct Student size: %lu bytes\\n", sizeof(Student));
    printf("Array of %d students: %lu bytes\\n", n, n*sizeof(Student));

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { int day, month, year; } Date;

typedef struct {
    int   rollNo;
    char  name[50];
    float marks[5];
    float pct;
    char  grade;
    Date  dob;
} Student;

void calc(Student *s) {
    float t=0;
    for(int i=0;i<5;i++) t+=s->marks[i];
    s->pct=t/5;
    s->grade = s->pct>=90?'A':s->pct>=75?'B':s->pct>=60?'C':s->pct>=45?'D':'F';
}

int cmpDesc(const void *a, const void *b) {
    return ((Student*)b)->pct > ((Student*)a)->pct ? 1 : -1;
}

int main() {
    Student batch[] = {
        {101,"Rahul",{85,78,90,88,92},0,0,{15,8,2003}},
        {102,"Priya",{92,95,88,91,97},0,0,{22,3,2004}},
        {103,"Aryan",{70,65,72,68,75},0,0,{10,1,2003}},
    };
    int n = sizeof(batch)/sizeof(batch[0]);
    for(int i=0;i<n;i++) calc(&batch[i]);
    qsort(batch,n,sizeof(Student),cmpDesc);
    printf("Ranking:\\n");
    for(int i=0;i<n;i++)
        printf("#%d %s %.1f%% %c\\n",i+1,batch[i].name,batch[i].pct,batch[i].grade);
    return 0;
}`,

      task: {
        description: 'struct practice: (1) "Library System" banao — Book struct (isbn, title[80], author[50], price, year, isAvailable) aur Library struct (Book *books, int count, int capacity). Functions: addBook(), searchByTitle(), searchByAuthor(), sortByPrice(), displayAll(), mostExpensive(). (2) "Complex Number Calculator" — Complex struct {float real, imag;} banao, add, subtract, multiply, magnitude, conjugate functions likho. (3) "Linked Date" — Date struct banao jo kal aur kal ka din bhi calculate kar sake (month/year rollover handle karo).',
        description_en: 'struct practice: (1) Build a "Library System" — Book struct (isbn, title[80], author[50], price, year, isAvailable) and Library struct (Book *books, int count, int capacity). Functions: addBook(), searchByTitle(), searchByAuthor(), sortByPrice(), displayAll(), mostExpensive(). (2) "Complex Number Calculator" — build a Complex struct {float real, imag;}, write add, subtract, multiply, magnitude, conjugate functions. (3) "Linked Date" — build a Date struct that can also compute tomorrow and yesterday (handle month/year rollovers).',
        hint: 'Library dynamic array: malloc + realloc jaisa Week 4 mein. Search: loop aur strstr se partial match. Complex multiply: (a+bi)*(c+di)=(ac-bd)+(ad+bc)i. Date rollover: days_in_month[] array rakho, leap year check karo.',
        hint_en: 'Library dynamic array: malloc + realloc as in Week 4. Search: loop with strstr for partial match. Complex multiply: (a+bi)*(c+di)=(ac-bd)+(ad+bc)i. Date rollover: keep a days_in_month[] array, check for leap years.',
      },
      quiz: [
        {
          q: 'struct mein memory padding kyun hoti hai?',
          options: [
            'Compiler bug hai',
            'CPU alignment requirement — modern CPUs int 4-byte, double 8-byte boundaries pe efficiently access karte hain. Padding se performance better hoti hai. Reorder fields to minimise padding.',
            'Extra security ke liye',
            'Koi reason nahi',
          ],
          correct: 1,
          explanation: 'Hardware alignment: CPUs data ko aligned addresses se efficiently read karte hain. char 1 byte ke baad int 4-byte boundary pe hona chahiye — compiler 3 bytes padding add karta hai. sizeof(struct) >= sum of fields. Fix: fields ko largest to smallest order mein rakho. __attribute__((packed)) se force no padding — but performance hit.',
          q_en: 'Why does padding occur in structs?',
          options_en: [
            'It is a compiler bug',
            'CPU alignment requirement — modern CPUs efficiently access int at 4-byte boundaries, double at 8-byte. Padding improves performance. Reorder fields to minimise it.',
            'For extra security',
            'No reason',
          ],
          explanation_en: 'Hardware alignment: CPUs read data efficiently from aligned addresses. A char followed by an int needs a 4-byte boundary — the compiler adds 3 bytes of padding. sizeof(struct) >= sum of all fields. Fix: order fields from largest to smallest. __attribute__((packed)) forces no padding — but at a performance cost.',
        },
        {
          q: 'Large struct function ko pass karte waqt by value ya by pointer use karein?',
          options: [
            'Hamesha by value',
            'By pointer — large struct copy karna (by value) expensive hai. Pointer = sirf 4/8 bytes copy. const keyword lagao agar modify nahi karna: void func(const Student *s).',
            'Koi fark nahi',
            'By value faster hai',
          ],
          correct: 1,
          explanation: 'struct Student = 100+ bytes. By value: poori copy stack pe — slow, more memory. By pointer: sirf 8 bytes (pointer size) — fast. Rule: small structs (2-3 fields) by value OK. Large structs always by pointer. Read-only: const Student *s. Modifiable: Student *s. Return by value small structs OK (compiler optimizes with RVO).',
          q_en: 'When passing a large struct to a function, should you use by value or by pointer?',
          options_en: [
            'Always by value',
            'By pointer — copying a large struct (by value) is expensive. A pointer = only 4/8 bytes copied. Use const if you are not modifying it: void func(const Student *s).',
            'No difference',
            'By value is faster',
          ],
          explanation_en: 'struct Student = 100+ bytes. By value: the entire copy goes on the stack — slow, uses more memory. By pointer: only 8 bytes (pointer size) — fast. Rule: small structs (2–3 fields) are fine by value. Large structs should always use a pointer. Read-only: const Student *s. Modifiable: Student *s. Returning small structs by value is fine (compiler optimises with RVO).',
        },
        {
          q: 'typedef struct {} Name; aur struct Name {} mein kya difference hai?',
          options: [
            'Same hain',
            'typedef struct {} Name: variable declare karne ke liye sirf "Name" use kar sakte. struct Name {}: har jagah "struct Name" likhna padega. typedef cleaner code deta hai.',
            'typedef faster compile hota hai',
            'struct Name {} recommended hai',
          ],
          correct: 1,
          explanation: 'Without typedef: struct Student s1; (verbose). With typedef: Student s1; (clean). Self-referential structs mein dono combine karte hain: typedef struct Node { int d; struct Node *next; } Node; — andar struct Node use karo (typedef abhi complete nahi), bahar Node use karo. Modern C: typedef preferred hai.',
          q_en: 'What is the difference between typedef struct {} Name; and struct Name {}?',
          options_en: [
            'They are the same',
            'typedef struct {} Name: you can declare variables with just "Name". struct Name {}: you must write "struct Name" everywhere. typedef gives cleaner code.',
            'typedef compiles faster',
            'struct Name {} is recommended',
          ],
          explanation_en: 'Without typedef: struct Student s1; (verbose). With typedef: Student s1; (clean). For self-referential structs, combine both: typedef struct Node { int d; struct Node *next; } Node; — use struct Node inside (typedef not yet complete), and Node outside. In modern C, typedef is preferred.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w5-s2',
      title: 'Union aur Enum — Memory Share aur Named Constants',
      title_en: 'Union and Enum — Shared Memory and Named Constants',
      emoji: '🔄',
      content: `## Union — Ek Memory, Multiple Types!

Union struct jaisa hota hai lekin **sabhi members ek hi memory share karte hain**.

### Union Basics

\`\`\`c
union Data {
    int   i;
    float f;
    char  str[20];
};
// sizeof(union Data) = sizeof(largest member) = 20

union Data d;
d.i = 42;
printf("int: %d\\n", d.i);      // 42
printf("float: %f\\n", d.f);    // garbage! (memory reinterpreted)

d.f = 3.14f;
printf("float: %f\\n", d.f);    // 3.14
printf("int: %d\\n", d.i);      // garbage! (float bits as int)

// Sirf LAST assigned member valid hota hai!
\`\`\`

### union ka Real Use — Tagged Union (Variant Type)

\`\`\`c
typedef enum {
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING,
} DataType;

typedef struct {
    DataType type;    // which field is valid
    union {
        int   i;
        float f;
        char  s[50];
    } value;
} Variant;

Variant v;

v.type    = TYPE_INT;
v.value.i = 42;

// Safe access — check type first!
void printVariant(const Variant *v) {
    switch (v->type) {
        case TYPE_INT:    printf("int: %d\\n",   v->value.i); break;
        case TYPE_FLOAT:  printf("float: %.2f\\n", v->value.f); break;
        case TYPE_STRING: printf("str: %s\\n",   v->value.s); break;
    }
}
\`\`\`

### union for Type Punning (Low-level)

\`\`\`c
// Float ke bits check karo as integer
union FloatInt {
    float f;
    int   i;
};

union FloatInt fi;
fi.f = 3.14f;
printf("Float bits as int: 0x%08X\\n", fi.i);  // IEEE 754 representation

// Endianness check
union {
    int  i;
    char bytes[4];
} endian;

endian.i = 1;
if (endian.bytes[0] == 1)
    printf("Little-endian (x86, ARM)\\n");
else
    printf("Big-endian (some network, old MIPS)\\n");
\`\`\`

### enum — Named Constants!

\`\`\`c
// Without enum — magic numbers (bad!)
int status = 2;  // 2 kya hai? koi nahi jaanta

// With enum — readable!
typedef enum {
    STATUS_PENDING = 0,
    STATUS_ACTIVE  = 1,
    STATUS_BLOCKED = 2,
    STATUS_DELETED = 3,
} UserStatus;

UserStatus user = STATUS_ACTIVE;

if (user == STATUS_ACTIVE) {
    printf("User is active\\n");
}

// Default values — 0 se start, har baar +1
typedef enum {
    MON = 1,  // start from 1
    TUE, WED, THU, FRI,  // 2, 3, 4, 5
    SAT, SUN              // 6, 7
} Weekday;

// Custom values
typedef enum {
    HTTP_OK       = 200,
    HTTP_CREATED  = 201,
    HTTP_NOT_FOUND = 404,
    HTTP_ERROR    = 500,
} HttpStatus;
\`\`\`

### enum with switch — Perfect Combo

\`\`\`c
typedef enum { NORTH, SOUTH, EAST, WEST } Direction;

void move(Direction dir, int *x, int *y) {
    switch (dir) {
        case NORTH: (*y)++; break;
        case SOUTH: (*y)--; break;
        case EAST:  (*x)++; break;
        case WEST:  (*x)--; break;
    }
}

// String to enum
Direction strToDir(const char *s) {
    if (strcmp(s, "NORTH") == 0) return NORTH;
    if (strcmp(s, "SOUTH") == 0) return SOUTH;
    if (strcmp(s, "EAST")  == 0) return EAST;
    if (strcmp(s, "WEST")  == 0) return WEST;
    return -1;  // invalid
}

// enum to string
const char* dirToStr(Direction d) {
    static const char *names[] = {"NORTH","SOUTH","EAST","WEST"};
    return names[d];
}
\`\`\`

### Bit Flags with enum

\`\`\`c
// Each flag = power of 2 (single bit)
typedef enum {
    PERM_NONE    = 0,        // 0000
    PERM_READ    = 1 << 0,  // 0001 = 1
    PERM_WRITE   = 1 << 1,  // 0010 = 2
    PERM_EXECUTE = 1 << 2,  // 0100 = 4
    PERM_ALL     = PERM_READ | PERM_WRITE | PERM_EXECUTE,  // 0111 = 7
} Permission;

int userPerms = PERM_READ | PERM_WRITE;  // 0011 = 3

// Check permission
if (userPerms & PERM_READ)    printf("Can read\\n");
if (userPerms & PERM_WRITE)   printf("Can write\\n");
if (userPerms & PERM_EXECUTE) printf("Can execute\\n");

// Add permission
userPerms |= PERM_EXECUTE;

// Remove permission
userPerms &= ~PERM_WRITE;

// Toggle permission
userPerms ^= PERM_READ;
\`\`\``,

      content_en: `## Union — Ek Memory, Multiple Types!

Union struct jaisa it is but **allhi members ek memory share we do**.

### Union Basics

\`\`\`c
union Data {
 int i;
 float f;
 char str[20];
};
// sizeof(union Data) = sizeof(largest member) = 20

union Data d;
d.i = 42;
printf("int: %d\\n", d.i); // 42
printf("float: %f\\n", d.f); // garbage! (memory reinterpreted)

d.f = 3.14f;
printf("float: %f\\n", d.f); // 3.14
printf("int: %d\\n", d.i); // garbage! (float bits as int)

// Only LAST assigned member valid it is!
\`\`\`

### union's Real Use — Tagged Union (Variant Type)

\`\`\`c
typedef enum {
 TYPE_INT,
 TYPE_FLOAT,
 TYPE_STRING,
} DataType;

typedef struct {
 DataType type; // which field is valid
 union {
 int i;
 float f;
 char s[50];
 } value;
} Variant;

Variant v;

v.type = TYPE_INT;
v.value.i = 42;

// Safe access — check type first!
void printVariant(const Variant *v) {
 switch (v->type) {
 case TYPE_INT: printf("int: %d\\n", v->value.i); break;
 case TYPE_FLOAT: printf("float: %.2f\\n", v->value.f); break;
 case TYPE_STRING: printf("str: %s\\n", v->value.s); break;
 }
}
\`\`\`

### union for Type Punning (Low-level)

\`\`\`c
// Float's bits check do as integer
union FloatInt {
 float f;
 int i;
};

union FloatInt fi;
fi.f = 3.14f;
printf("Float bits as int: 0x%08X\\n", fi.i); // IEEE 754 representation

// Endianness check
union {
 int i;
 char bytes[4];
} endian;

endian.i = 1;
if (endian.bytes[0] == 1)
 printf("Little-endian (x86, ARM)\\n");
else
 printf("Big-endian (some network, old MIPS)\\n");
\`\`\`

### enum — Named Constants!

\`\`\`c
// Without enum — magic numbers (bad!)
int status = 2; // 2 what it is? any not jaanta

// With enum — readable!
typedef enum {
 STATUS_PENDING = 0,
 STATUS_ACTIVE = 1,
 STATUS_BLOCKED = 2,
 STATUS_DELETED = 3,
} UserStatus;

UserStatus user = STATUS_ACTIVE;

if (user == STATUS_ACTIVE) {
 printf("User is active\\n");
}

// Default values — 0 from start, every time +1
typedef enum {
 MON = 1, // start from 1
 TUE, WED, THU, FRI, // 2, 3, 4, 5
 SAT, SUN // 6, 7
} Weekday;

// Custom values
typedef enum {
 HTTP_OK = 200,
 HTTP_CREATED = 201,
 HTTP_NOT_FOUND = 404,
 HTTP_ERROR = 500,
} HttpStatus;
\`\`\`

### enum with switch — Perfect Combo

\`\`\`c
typedef enum { NORTH, SOUTH, EAST, WEST } Direction;

void move(Direction dir, int *x, int *y) {
 switch (dir) {
 case NORTH: (*y)++; break;
 case SOUTH: (*y)--; break;
 case EAST: (*x)++; break;
 case WEST: (*x)--; break;
 }
}

// String to enum
Direction strToDir(const char *s) {
 if (strcmp(s, "NORTH") == 0) return NORTH;
 if (strcmp(s, "SOUTH") == 0) return SOUTH;
 if (strcmp(s, "EAST") == 0) return EAST;
 if (strcmp(s, "WEST") == 0) return WEST;
 return -1; // invalid
}

// enum to string
const char* dirToStr(Direction d) {
 static const char *names[] = {"NORTH","SOUTH","EAST","WEST"};
 return names[d];
}
\`\`\`

### Bit Flags with enum

\`\`\`c
// Each flag = power of 2 (single bit)
typedef enum {
 PERM_NONE = 0, // 0000
 PERM_READ = 1 << 0, // 0001 = 1
 PERM_WRITE = 1 << 1, // 0010 = 2
 PERM_EXECUTE = 1 << 2, // 0100 = 4
 PERM_ALL = PERM_READ | PERM_WRITE | PERM_EXECUTE, // 0111 = 7
} Permission;

int userPerms = PERM_READ | PERM_WRITE; // 0011 = 3

// Check permission
if (userPerms & PERM_READ) printf("Can read\\n");
if (userPerms & PERM_WRITE) printf("Can write\\n");
if (userPerms & PERM_EXECUTE) printf("Can execute\\n");

// Add permission
userPerms |= PERM_EXECUTE;

// Remove permission
userPerms &= ~PERM_WRITE;

// Toggle permission
userPerms ^= PERM_READ;
\`\`\``,

      codeExample: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// ── Variant type using tagged union ──
typedef enum {
    T_INT, T_FLOAT, T_STRING, T_BOOL
} VarType;

typedef struct {
    VarType type;
    union {
        int    i;
        float  f;
        char   s[64];
        int    b;  // 0=false, 1=true
    } val;
    char name[32];
} Variable;

void setInt   (Variable *v, char *n, int   x) { strcpy(v->name,n); v->type=T_INT;    v->val.i=x; }
void setFloat (Variable *v, char *n, float x) { strcpy(v->name,n); v->type=T_FLOAT;  v->val.f=x; }
void setString(Variable *v, char *n, char *x) { strcpy(v->name,n); v->type=T_STRING; strncpy(v->val.s,x,63); }
void setBool  (Variable *v, char *n, int   x) { strcpy(v->name,n); v->type=T_BOOL;   v->val.b=x; }

void printVar(const Variable *v) {
    printf("%-12s = ", v->name);
    switch(v->type) {
        case T_INT:    printf("%-20d (int)\\n",      v->val.i); break;
        case T_FLOAT:  printf("%-20.4f (float)\\n",  v->val.f); break;
        case T_STRING: printf("%-20s (string)\\n",   v->val.s); break;
        case T_BOOL:   printf("%-20s (bool)\\n",     v->val.b ? "true":"false"); break;
    }
}

// ── Permission system using enum + bit flags ──
typedef enum {
    ROLE_GUEST  = 0,
    ROLE_USER   = 1,
    ROLE_MOD    = 2,
    ROLE_ADMIN  = 3,
} Role;

typedef enum {
    P_NONE    = 0,
    P_VIEW    = 1 << 0,   // 1
    P_POST    = 1 << 1,   // 2
    P_EDIT    = 1 << 2,   // 4
    P_DELETE  = 1 << 3,   // 8
    P_MANAGE  = 1 << 4,   // 16
    P_ALL     = (1<<5)-1, // 31 — all bits set
} Perm;

typedef struct {
    char name[30];
    Role role;
    int  permissions;
} User;

const char* roleName(Role r) {
    switch(r) {
        case ROLE_GUEST: return "Guest";
        case ROLE_USER:  return "User";
        case ROLE_MOD:   return "Moderator";
        case ROLE_ADMIN: return "Admin";
        default:         return "Unknown";
    }
}

void checkPerms(const User *u) {
    printf("%-12s [%-10s]: ", u->name, roleName(u->role));
    if (u->permissions & P_VIEW)   printf("VIEW ");
    if (u->permissions & P_POST)   printf("POST ");
    if (u->permissions & P_EDIT)   printf("EDIT ");
    if (u->permissions & P_DELETE) printf("DELETE ");
    if (u->permissions & P_MANAGE) printf("MANAGE ");
    printf("\\n");
}

int main() {
    // ── Variant variables ──
    Variable vars[5];
    setInt   (&vars[0], "rollNo",   101);
    setFloat (&vars[1], "gpa",      8.75f);
    setString(&vars[2], "name",     "Rahul Sharma");
    setBool  (&vars[3], "isPremium",1);
    setFloat (&vars[4], "balance",  5250.75f);

    printf("=== Variable Store ===\\n");
    for (int i = 0; i < 5; i++) printVar(&vars[i]);

    // ── Permission system ──
    printf("\\n=== Permission System ===\\n");
    User users[] = {
        {"Alice",   ROLE_ADMIN, P_ALL},
        {"Bob",     ROLE_MOD,   P_VIEW | P_POST | P_EDIT | P_DELETE},
        {"Charlie", ROLE_USER,  P_VIEW | P_POST},
        {"Dave",    ROLE_GUEST, P_VIEW},
    };
    int nu = sizeof(users)/sizeof(users[0]);
    for (int i = 0; i < nu; i++) checkPerms(&users[i]);

    // ── Endianness check ──
    printf("\\n=== System Info ===\\n");
    union { int i; char b[4]; } end;
    end.i = 1;
    printf("Endianness: %s\\n", end.b[0] ? "Little-endian (x86/ARM)" : "Big-endian");
    printf("sizeof int: %lu, float: %lu, pointer: %lu\\n",
           sizeof(int), sizeof(float), sizeof(void*));

    // ── Union memory demo ──
    printf("\\n=== Union Memory Demo ===\\n");
    union { int i; float f; unsigned char b[4]; } u;
    u.f = 3.14f;
    printf("3.14f as bytes: ");
    for (int i = 0; i < 4; i++) printf("%02X ", u.b[i]);
    printf("(IEEE 754)\\n");

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>

typedef enum { T_INT,T_FLOAT,T_STR } VType;
typedef struct {
    VType t;
    union { int i; float f; char s[64]; } v;
    char name[32];
} Var;

void printVar(const Var *x){
    printf("%-10s = ",x->name);
    switch(x->t){
        case T_INT:   printf("%d\\n",  x->v.i); break;
        case T_FLOAT: printf("%.2f\\n",x->v.f); break;
        case T_STR:   printf("%s\\n",  x->v.s); break;
    }
}

typedef enum { P_READ=1,P_WRITE=2,P_EXEC=4 } Perm;

int main(){
    Var vs[3]={
        {T_INT,  {.i=42},    "count"},
        {T_FLOAT,{.f=3.14f}, "pi"},
        {T_STR,  {.s="hi"},  "greeting"},
    };
    for(int i=0;i<3;i++) printVar(&vs[i]);

    int p=P_READ|P_WRITE;
    printf("\\nPerms: ");
    if(p&P_READ)  puts("READ");
    if(p&P_WRITE) puts("WRITE");
    if(p&P_EXEC)  puts("EXEC");
    return 0;
}`,

      task: {
        description: 'Union & Enum practice: (1) "JSON-like Variant" banao — koi bhi type store kare (int, float, bool, string, null), aur print karo type ke saath. (2) "State Machine" — Traffic light simulation: enum States {RED, YELLOW, GREEN}, enum Events {TIMER, EMERGENCY}, transition table banao aur simulate karo. (3) "Network Packet" — union se header parse karo: 4 bytes ko IPv4 address ke 4 octets mein alag karo, display karo dot notation mein.',
        description_en: 'Union & Enum practice: (1) Build a "JSON-like Variant" — store any type (int, float, bool, string, null) and print it with its type. (2) "State Machine" — Traffic light simulation: enum States {RED, YELLOW, GREEN}, enum Events {TIMER, EMERGENCY}, build a transition table and simulate it. (3) "Network Packet" — use a union to parse a header: split 4 bytes into 4 IPv4 octets and display in dot notation.',
        hint: 'State machine: int transitions[3][2] = {{YELLOW,RED},{GREEN,YELLOW},{RED,RED}}. IPv4 union: union{unsigned int ip; unsigned char octets[4];}. Bit flags: combine with | check with &.',
        hint_en: 'State machine: int transitions[3][2] = {{YELLOW,RED},{GREEN,YELLOW},{RED,RED}}. IPv4 union: union{unsigned int ip; unsigned char octets[4];}. Bit flags: combine with | and check with &.',
      },
      quiz: [
        {
          q: 'union mein sabhi members ek hi memory share karte hain — practically iska kya matlab hai?',
          options: [
            'Sab members ek hi time pe valid hain',
            'Sirf LAST assigned member valid hota hai. Dusre member read karo toh memory reinterpret hoti hai — garbage ya implementation-defined value milti hai.',
            'Members automatically convert hote hain',
            'Union struct se fast hai',
          ],
          correct: 1,
          explanation: 'union Data {int i; float f;}; ek memory block hai. d.i=10 karo — memory mein 10 ka binary store. Phir d.f padho — same bytes ko float ke roop mein interpret kiya jaayega — meaningless! Tagged union (struct + union + enum type tag) se safe access: check type first, tab access karo. Yeh C mein type-safe variant ka pattern hai.',
          q_en: 'All members of a union share the same memory — what does this mean practically?',
          options_en: [
            'All members are valid at the same time',
            'Only the LAST assigned member is valid. Reading another member reinterprets the memory — you get garbage or an implementation-defined value.',
            'Members are automatically converted',
            'union is faster than struct',
          ],
          explanation_en: 'union Data {int i; float f;}; is one memory block. Do d.i=10 — the binary of 10 is stored. Then read d.f — the same bytes are interpreted as a float — meaningless! Use a tagged union (struct + union + enum type tag) for safe access: check the type first, then access. This is C\'s pattern for a type-safe variant.',
        },
        {
          q: 'enum ke values automatically kya hote hain agar explicitly assign na karo?',
          options: [
            'Sab 0 hote hain',
            'Pehla 0, phir har ek +1. Custom start: MON=1 likho toh TUE=2, WED=3... automatically.',
            'Random values',
            'Sab -1 hote hain',
          ],
          correct: 1,
          explanation: 'enum default: pehla value 0, phir sequentially +1. enum Day {MON,TUE,WED} = MON=0,TUE=1,WED=2. Custom: enum Day {MON=1,TUE,WED} = MON=1,TUE=2,WED=3. Kisi bhi point pe reset: enum {A,B,C=10,D,E} = A=0,B=1,C=10,D=11,E=12. Enum values integers hain — switch mein perfectly use karo.',
          q_en: 'What values does enum assign automatically if not specified explicitly?',
          options_en: [
            'All 0',
            'First is 0, then each subsequent one is +1. Custom start: write MON=1 then TUE=2, WED=3 automatically.',
            'Random values',
            'All -1',
          ],
          explanation_en: 'enum default: first value is 0, then sequentially +1. enum Day {MON,TUE,WED} = MON=0,TUE=1,WED=2. Custom: enum Day {MON=1,TUE,WED} = MON=1,TUE=2,WED=3. Reset at any point: enum {A,B,C=10,D,E} = A=0,B=1,C=10,D=11,E=12. Enum values are integers — use them perfectly in switch statements.',
        },
        {
          q: 'Bit flags ke liye enum kyun use karte hain?',
          options: [
            'Sirf style ke liye',
            'Multiple boolean states ek integer mein efficiently store karo. PERM_READ|PERM_WRITE = ek int mein dono. Check: if(p & PERM_READ). Memory efficient + type safe + readable.',
            'Bit flags ke liye array better hai',
            'Compiler optimization ke liye',
          ],
          correct: 1,
          explanation: 'Bit flags: har flag = ek bit (power of 2). PERM_READ=1(001), PERM_WRITE=2(010), PERM_EXEC=4(100). Combine: p = READ|WRITE = 3(011). Check: p & READ = non-zero (has READ). Remove: p &= ~WRITE (clear bit 1). Toggle: p ^= EXEC. Yeh Linux file permissions (rwxr-xr-x), network flags, game state sab mein use hota hai.',
          q_en: 'Why use enum for bit flags?',
          options_en: [
            'Just for style',
            'Store multiple boolean states efficiently in one integer. PERM_READ|PERM_WRITE = both in one int. Check: if(p & PERM_READ). Memory-efficient + type-safe + readable.',
            'An array is better for bit flags',
            'For compiler optimisation',
          ],
          explanation_en: 'Bit flags: each flag = one bit (power of 2). PERM_READ=1(001), PERM_WRITE=2(010), PERM_EXEC=4(100). Combine: p = READ|WRITE = 3(011). Check: p & READ = non-zero (has READ). Remove: p &= ~WRITE (clear bit 1). Toggle: p ^= EXEC. Used in Linux file permissions (rwxr-xr-x), network flags, game state, and much more.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w5-s3',
      title: 'Linked List — Dynamic Data Structure',
      title_en: 'Linked List — Dynamic Data Structure',
      emoji: '⛓️',
      content: `## Linked List — Pointer-based Dynamic Data!

Array mein limitation: fixed size, insert/delete mein shift karna padta hai.
Linked List mein: dynamic size, O(1) insert/delete at any position (with pointer)!

### Singly Linked List — Basics

\`\`\`c
typedef struct Node {
    int          data;
    struct Node *next;  // pointer to next node
} Node;

// Create node
Node* createNode(int data) {
    Node *n = (Node*)malloc(sizeof(Node));
    if (!n) { perror("malloc"); exit(1); }
    n->data = data;
    n->next = NULL;
    return n;
}

// Print list
void printList(Node *head) {
    Node *curr = head;
    while (curr != NULL) {
        printf("%d", curr->data);
        if (curr->next) printf(" → ");
        curr = curr->next;
    }
    printf(" → NULL\\n");
}

// Length
int length(Node *head) {
    int count = 0;
    for (Node *curr = head; curr; curr = curr->next) count++;
    return count;
}
\`\`\`

### Insert Operations

\`\`\`c
// Insert at beginning — O(1)
Node* insertFront(Node *head, int data) {
    Node *n = createNode(data);
    n->next = head;
    return n;  // new head!
}

// Insert at end — O(n)
Node* insertEnd(Node *head, int data) {
    Node *n = createNode(data);
    if (!head) return n;  // empty list
    Node *curr = head;
    while (curr->next) curr = curr->next;  // go to last
    curr->next = n;
    return head;
}

// Insert at position — O(n)
Node* insertAt(Node *head, int data, int pos) {
    if (pos == 0) return insertFront(head, data);
    Node *n = createNode(data);
    Node *curr = head;
    for (int i = 0; i < pos-1 && curr->next; i++)
        curr = curr->next;
    n->next    = curr->next;
    curr->next = n;
    return head;
}

// Insert in sorted order
Node* insertSorted(Node *head, int data) {
    Node *n = createNode(data);
    if (!head || data <= head->data) {
        n->next = head;
        return n;
    }
    Node *curr = head;
    while (curr->next && curr->next->data < data)
        curr = curr->next;
    n->next    = curr->next;
    curr->next = n;
    return head;
}
\`\`\`

### Delete Operations

\`\`\`c
// Delete by value — O(n)
Node* deleteNode(Node *head, int val) {
    if (!head) return NULL;

    // Deleting head
    if (head->data == val) {
        Node *temp = head->next;
        free(head);
        return temp;
    }

    // Find node before target
    Node *curr = head;
    while (curr->next && curr->next->data != val)
        curr = curr->next;

    if (curr->next) {  // found
        Node *temp = curr->next;
        curr->next = temp->next;
        free(temp);
    }
    return head;
}

// Delete entire list — O(n)
void freeList(Node *head) {
    Node *curr = head;
    while (curr) {
        Node *next = curr->next;
        free(curr);
        curr = next;
    }
}
\`\`\`

### Search aur Reverse

\`\`\`c
// Search — O(n)
Node* search(Node *head, int val) {
    for (Node *curr = head; curr; curr = curr->next)
        if (curr->data == val) return curr;
    return NULL;
}

// Reverse — O(n), O(1) space
Node* reverseList(Node *head) {
    Node *prev = NULL, *curr = head, *next = NULL;
    while (curr) {
        next       = curr->next;  // save next
        curr->next = prev;        // reverse link
        prev       = curr;        // move prev
        curr       = next;        // move curr
    }
    return prev;  // new head
}

// Detect cycle (Floyd's algorithm)
int hasCycle(Node *head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;  // cycle!
    }
    return 0;
}
\`\`\`

### Doubly Linked List

\`\`\`c
typedef struct DNode {
    int          data;
    struct DNode *prev;
    struct DNode *next;
} DNode;

DNode* createDNode(int data) {
    DNode *n = (DNode*)malloc(sizeof(DNode));
    n->data = data;
    n->prev = n->next = NULL;
    return n;
}

// Insert after node — O(1) with pointer!
void insertAfter(DNode *node, int data) {
    DNode *n = createDNode(data);
    n->prev  = node;
    n->next  = node->next;
    if (node->next) node->next->prev = n;
    node->next = n;
}

// Delete node — O(1) with pointer!
DNode* deleteNode(DNode *head, DNode *node) {
    if (node->prev) node->prev->next = node->next;
    if (node->next) node->next->prev = node->prev;
    if (head == node) head = node->next;
    free(node);
    return head;
}

// Print forward and backward
void printForward (DNode *head) { while (head) { printf("%d ",head->data); head=head->next; } }
void printBackward(DNode *tail) { while (tail) { printf("%d ",tail->data); tail=tail->prev; } }
\`\`\``,

      content_en: `## Linked List — Pointer-based Dynamic Data!

Array in limitation: fixed size, insert/delete in shift to do padta hai.
Linked List mein: dynamic size, O(1) insert/delete at any position (with pointer)!

### Singly Linked List — Basics

\`\`\`c
typedef struct Node {
 int data;
 struct Node *next; // pointer to next node
} Node;

// Create node
Node* createNode(int data) {
 Node *n = (Node*)malloc(sizeof(Node));
 if (!n) { perror("malloc"); exit(1); }
 n->data = data;
 n->next = NULL;
 return n;
}

// Print list
void printList(Node *head) {
 Node *curr = head;
 while (curr != NULL) {
 printf("%d", curr->data);
 if (curr->next) printf(" → ");
 curr = curr->next;
 }
 printf(" → NULL\\n");
}

// Length
int length(Node *head) {
 int count = 0;
 for (Node *curr = head; curr; curr = curr->next) count++;
 return count;
}
\`\`\`

### Insert Operations

\`\`\`c
// Insert at beginning — O(1)
Node* insertFront(Node *head, int data) {
 Node *n = createNode(data);
 n->next = head;
 return n; // new head!
}

// Insert at end — O(n)
Node* insertEnd(Node *head, int data) {
 Node *n = createNode(data);
 if (!head) return n; // empty list
 Node *curr = head;
 while (curr->next) curr = curr->next; // go to last
 curr->next = n;
 return head;
}

// Insert at position — O(n)
Node* insertAt(Node *head, int data, int pos) {
 if (pos == 0) return insertFront(head, data);
 Node *n = createNode(data);
 Node *curr = head;
 for (int i = 0; i < pos-1 && curr->next; i++)
 curr = curr->next;
 n->next = curr->next;
 curr->next = n;
 return head;
}

// Insert in sorted order
Node* insertSorted(Node *head, int data) {
 Node *n = createNode(data);
 if (!head || data <= head->data) {
 n->next = head;
 return n;
 }
 Node *curr = head;
 while (curr->next && curr->next->data < data)
 curr = curr->next;
 n->next = curr->next;
 curr->next = n;
 return head;
}
\`\`\`

### Delete Operations

\`\`\`c
// Delete by value — O(n)
Node* deleteNode(Node *head, int val) {
 if (!head) return NULL;

 // Deleting head
 if (head->data == val) {
 Node *temp = head->next;
 free(head);
 return temp;
 }

 // Find node before target
 Node *curr = head;
 while (curr->next && curr->next->data != val)
 curr = curr->next;

 if (curr->next) { // found
 Node *temp = curr->next;
 curr->next = temp->next;
 free(temp);
 }
 return head;
}

// Delete entire list — O(n)
void freeList(Node *head) {
 Node *curr = head;
 while (curr) {
 Node *next = curr->next;
 free(curr);
 curr = next;
 }
}
\`\`\`

### Search and Reverse

\`\`\`c
// Search — O(n)
Node* search(Node *head, int val) {
 for (Node *curr = head; curr; curr = curr->next)
 if (curr->data == val) return curr;
 return NULL;
}

// Reverse — O(n), O(1) space
Node* reverseList(Node *head) {
 Node *prev = NULL, *curr = head, *next = NULL;
 while (curr) {
 next = curr->next; // save next
 curr->next = prev; // reverse link
 prev = curr; // move prev
 curr = next; // move curr
 }
 return prev; // new head
}

// Detect cycle (Floyd's algorithm)
int hasCycle(Node *head) {
 Node *slow = head, *fast = head;
 while (fast && fast->next) {
 slow = slow->next;
 fast = fast->next->next;
 if (slow == fast) return 1; // cycle!
 }
 return 0;
}
\`\`\`

### Doubly Linked List

\`\`\`c
typedef struct DNode {
 int data;
 struct DNode *prev;
 struct DNode *next;
} DNode;

DNode* createDNode(int data) {
 DNode *n = (DNode*)malloc(sizeof(DNode));
 n->data = data;
 n->prev = n->next = NULL;
 return n;
}

// Insert after node — O(1) with pointer!
void insertAfter(DNode *node, int data) {
 DNode *n = createDNode(data);
 n->prev = node;
 n->next = node->next;
 if (node->next) node->next->prev = n;
 node->next = n;
}

// Delete node — O(1) with pointer!
DNode* deleteNode(DNode *head, DNode *node) {
 if (node->prev) node->prev->next = node->next;
 if (node->next) node->next->prev = node->prev;
 if (head == node) head = node->next;
 free(node);
 return head;
}

// Print forward and backward
void printForward (DNode *head) { while (head) { printf("%d ",head->data); head=head->next; } }
void printBackward(DNode *tail) { while (tail) { printf("%d ",tail->data); tail=tail->prev; } }
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* newNode(int d){ Node *n=(Node*)malloc(sizeof(Node)); n->data=d; n->next=NULL; return n; }

Node* pushFront(Node *h, int d){ Node *n=newNode(d); n->next=h; return n; }
Node* pushBack (Node *h, int d){
    Node *n=newNode(d);
    if(!h) return n;
    Node *c=h; while(c->next) c=c->next;
    c->next=n; return h;
}

Node* deleteVal(Node *h, int v){
    if(!h) return NULL;
    if(h->data==v){Node *t=h->next;free(h);return t;}
    Node *c=h;
    while(c->next && c->next->data!=v) c=c->next;
    if(c->next){Node *t=c->next;c->next=t->next;free(t);}
    return h;
}

Node* reverse(Node *h){
    Node *p=NULL,*c=h,*n;
    while(c){n=c->next;c->next=p;p=c;c=n;}
    return p;
}

Node* merge(Node *a, Node *b){      // merge two sorted lists
    if(!a) return b;
    if(!b) return a;
    if(a->data<=b->data){ a->next=merge(a->next,b); return a; }
    else                 { b->next=merge(a,b->next); return b; }
}

// Find middle (Floyd's slow/fast)
Node* middle(Node *h){
    Node *s=h,*f=h;
    while(f->next && f->next->next){ s=s->next; f=f->next->next; }
    return s;
}

// Merge sort
Node* mergeSort(Node *h){
    if(!h||!h->next) return h;
    Node *mid  = middle(h);
    Node *half = mid->next;
    mid->next  = NULL;
    return merge(mergeSort(h), mergeSort(half));
}

void print(Node *h, char *label){
    printf("%-12s: ",label);
    while(h){ printf("%d",h->data); if(h->next)printf("→"); h=h->next; }
    printf("→NULL\\n");
}

int hasCycle(Node *h){
    Node *s=h,*f=h;
    while(f&&f->next){ s=s->next;f=f->next->next; if(s==f) return 1; }
    return 0;
}

void freeList(Node *h){ Node *t; while(h){t=h->next;free(h);h=t;} }

int main(){
    Node *list = NULL;

    // Build list: 5→3→8→1→9→2→7
    int vals[]={5,3,8,1,9,2,7};
    for(int i=0;i<7;i++) list=pushBack(list,vals[i]);
    print(list,"Original");

    list=pushFront(list,0);
    print(list,"pushFront 0");

    list=deleteVal(list,8);
    print(list,"delete 8");

    list=reverse(list);
    print(list,"reversed");

    list=mergeSort(list);
    print(list,"sorted");

    printf("Middle: %d\\n", middle(list)->data);
    printf("Has cycle: %s\\n", hasCycle(list)?"Yes":"No");

    // Merge two sorted lists
    Node *a=NULL, *b=NULL;
    int as[]={1,3,5,7}; for(int i=0;i<4;i++) a=pushBack(a,as[i]);
    int bs[]={2,4,6,8}; for(int i=0;i<4;i++) b=pushBack(b,bs[i]);
    print(a,"List A");
    print(b,"List B");
    Node *merged=merge(a,b);
    print(merged,"Merged");

    freeList(list);
    freeList(merged);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node{int d;struct Node*n;}Node;
Node*nn(int d){Node*x=(Node*)malloc(sizeof(Node));x->d=d;x->n=NULL;return x;}
Node*pf(Node*h,int d){Node*x=nn(d);x->n=h;return x;}
Node*pb(Node*h,int d){Node*x=nn(d);if(!h)return x;Node*c=h;while(c->n)c=c->n;c->n=x;return h;}
Node*rev(Node*h){Node*p=NULL,*c=h,*n;while(c){n=c->n;c->n=p;p=c;c=n;}return p;}
void pr(Node*h,char*l){printf("%-8s: ",l);while(h){printf("%d%s",h->d,h->n?"→":"");h=h->n;}printf("→NULL\\n");}

int main(){
    Node*list=NULL;
    for(int i=5;i>=1;i--) list=pf(list,i*2);
    pr(list,"orig");
    list=rev(list);
    pr(list,"rev");
    Node*c=list;while(c){Node*t=c->n;free(c);c=t;}
    return 0;
}`,

      task: {
        description: 'Linked List practice: (1) "Stack using Linked List" implement karo — push, pop, peek, isEmpty, size, print all operations. O(1) push/pop. (2) "Queue using Linked List" — enqueue, dequeue, front, isEmpty. O(1) both ends. (3) "Palindrome Check using Linked List" — linked list mein words/numbers store karo, palindrome hai ya nahi check karo (reverse compare). (4) "Intersection of Two Lists" — do linked lists ka pehla common node find karo.',
        description_en: 'Linked List practice: (1) Implement a "Stack using Linked List" — push, pop, peek, isEmpty, size, print all operations. O(1) push/pop. (2) "Queue using Linked List" — enqueue, dequeue, front, isEmpty. O(1) both ends. (3) "Palindrome Check using Linked List" — store words/numbers in a linked list, check if it is a palindrome. (4) "Intersection of Two Lists" — find the first common node of two linked lists.',
        hint: 'Stack: push at front (O(1)), pop at front (O(1)). Queue: enqueue at back (O(1) with tail pointer!), dequeue at front. Palindrome: copy to array, compare. Intersection: get lengths, advance longer list, walk together.',
        hint_en: 'Stack: push at front O(1), pop at front O(1). Queue: enqueue at back O(1) with a tail pointer!, dequeue at front. Palindrome: copy to array, compare. Intersection: get lengths, advance the longer list, then walk together.',
      },
      quiz: [
        {
          q: 'Linked list aur array mein kab kya use karein?',
          options: [
            'Hamesha array — faster hai',
            'Array: random access O(1), contiguous memory (cache friendly), size known. Linked list: frequent insert/delete in middle O(1), dynamic size, no contiguous memory needed.',
            'Hamesha linked list — flexible hai',
            'Koi difference nahi performance mein',
          ],
          correct: 1,
          explanation: 'Array: arr[i] = O(1) direct access. Insert/delete middle = O(n) shift. Cache-friendly (contiguous). Linked list: access index i = O(n) traverse. Insert/delete with pointer = O(1). NOT cache-friendly (scattered memory). Real rule: array use karo jab random access zyada ho. Linked list jab insert/delete frequently ho middle mein.',
          q_en: 'When should you use a linked list vs an array?',
          options_en: [
            'Always array — it is faster',
            'Array: O(1) random access, contiguous memory (cache-friendly), known size. Linked list: O(1) insert/delete in middle, dynamic size, no contiguous memory needed.',
            'Always linked list — it is flexible',
            'No performance difference',
          ],
          explanation_en: 'Array: arr[i] = O(1) direct access. Insert/delete in middle = O(n) shift. Cache-friendly (contiguous memory). Linked list: accessing index i = O(n) traversal. Insert/delete with a pointer = O(1). NOT cache-friendly (scattered memory). Real rule: use arrays when random access dominates. Use linked lists when frequent insert/delete in the middle is needed.',
        },
        {
          q: 'Linked list ko reverse karte waqt teen pointers (prev, curr, next) kyun chahiye?',
          options: [
            'Sirf style ke liye',
            'curr->next = prev se pehla link reverse hota hai, lekin next node ka address lost ho jaata! Isliye pehle next = curr->next save karo, phir reverse karo, phir aage badhao.',
            'Do pointers kaafi hain',
            'Teen se faster hota hai',
          ],
          correct: 1,
          explanation: 'Step by step: (1) next = curr->next (save agle node ka address — warna lost!). (2) curr->next = prev (reverse the link). (3) prev = curr (prev ek aage badha). (4) curr = next (curr ek aage badha). Bina step 1 ke: curr->next = prev karne ke baad agle node ka address permanently lost — list broken!',
          q_en: 'Why do you need three pointers (prev, curr, next) to reverse a linked list?',
          options_en: [
            'Just for style',
            'curr->next = prev reverses the first link, but the next node\'s address is lost! So first save next = curr->next, then reverse, then advance.',
            'Two pointers are enough',
            'Three makes it faster',
          ],
          explanation_en: 'Step by step: (1) next = curr->next (save the next node\'s address — otherwise it is lost!). (2) curr->next = prev (reverse the link). (3) prev = curr (advance prev). (4) curr = next (advance curr). Without step 1: after curr->next = prev, the next node\'s address is permanently lost — the list is broken!',
        },
        {
          q: 'Floyd\'s cycle detection algorithm (tortoise and hare) kaise kaam karta hai?',
          options: [
            'Poori list copy karke check karta hai',
            'Slow pointer ek step, fast pointer do steps. Cycle hai toh dono milenge (fast gap karta rehta hai, slow follow karta hai). No cycle: fast NULL pe pahunch jaata hai.',
            'Visited nodes array mein track karta hai',
            'Recursive traversal use karta hai',
          ],
          correct: 1,
          explanation: 'Tortoise (slow): 1 step per iteration. Hare (fast): 2 steps. No cycle: fast reaches NULL. Cycle: fast is "lapping" slow inside the cycle — woh milenge. Proof: agar cycle length C hai, toh fast slow se C steps aage aata hai per C iterations — they must meet. Space: O(1) — no extra memory! Uses: linked list, general cycle detection in any sequence.',
          q_en: 'How does Floyd\'s cycle detection algorithm (tortoise and hare) work?',
          options_en: [
            'It copies the whole list and checks',
            'Slow pointer: one step, fast pointer: two steps. If there is a cycle, they will meet (fast laps slow). No cycle: fast reaches NULL.',
            'It tracks visited nodes in an array',
            'It uses recursive traversal',
          ],
          explanation_en: 'Tortoise (slow): 1 step per iteration. Hare (fast): 2 steps. No cycle: fast reaches NULL. Cycle: fast is lapping slow inside the loop — they must meet. Proof: if the cycle length is C, fast gains C steps over slow per C iterations — they must meet. Space: O(1) — no extra memory! Uses: linked lists, general cycle detection in any sequence.',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w5-s4',
      title: 'Week 5 Project — Employee Management System',
      title_en: 'Week 5 Project — Employee Management System',
      emoji: '👔',
      content: `## Week 5 Project — Sab Kuch Combine!

Is hafte seekha:
- struct — complex data types
- union + enum — flexible types, bit flags
- Linked list — dynamic data structure

Ab ek complete **Employee Management System** banao!

### System Architecture

\`\`\`c
// ── Enums ──
typedef enum { DEPT_TECH, DEPT_HR, DEPT_SALES, DEPT_FINANCE } Department;
typedef enum { ROLE_INTERN, ROLE_JUNIOR, ROLE_SENIOR, ROLE_LEAD, ROLE_MANAGER } Role;
typedef enum { EMP_FULL_TIME, EMP_PART_TIME, EMP_CONTRACT } EmpType;

// ── Structures ──
typedef struct { char street[60]; char city[30]; int pin; } Address;
typedef struct { int day, month, year; } Date;

typedef struct {
    int        id;
    char       name[60];
    char       email[60];
    Department dept;
    Role       role;
    EmpType    type;
    float      salary;
    Date       joinDate;
    Address    addr;
    int        skills;  // bit flags — SKILL_C | SKILL_PYTHON etc
} Employee;

typedef struct EmpNode {
    Employee         emp;
    struct EmpNode  *next;
} EmpNode;

typedef struct {
    EmpNode *head;
    int      count;
    int      nextId;
} EmpList;

// ── Skill bit flags ──
typedef enum {
    SKILL_C       = 1 << 0,  // 1
    SKILL_CPP     = 1 << 1,  // 2
    SKILL_PYTHON  = 1 << 2,  // 4
    SKILL_JAVA    = 1 << 3,  // 8
    SKILL_JS      = 1 << 4,  // 16
    SKILL_SQL     = 1 << 5,  // 32
    SKILL_LINUX   = 1 << 6,  // 64
} Skill;
\`\`\`

### Functions to Implement

\`\`\`c
// CRUD
void     addEmployee(EmpList *list, Employee e);
Employee* findById(EmpList *list, int id);
int      updateSalary(EmpList *list, int id, float newSalary);
int      deleteEmployee(EmpList *list, int id);

// Query
void filterByDept(EmpList *list, Department dept);
void filterBySkill(EmpList *list, Skill skill);
void filterBySalaryRange(EmpList *list, float min, float max);

// Analytics
void showStats(EmpList *list);
Employee* highestPaid(EmpList *list);
float avgSalary(EmpList *list, Department dept);
void salaryHistogram(EmpList *list);

// Display
void printEmployee(const Employee *e);
void printAllEmployees(EmpList *list);
const char* deptName(Department d);
const char* roleName(Role r);
\`\`\`

### Salary Hike Logic

\`\`\`c
// Role-based hike
float calcHike(const Employee *e) {
    float pct;
    switch (e->role) {
        case ROLE_MANAGER: pct = 0.15f; break;
        case ROLE_LEAD:    pct = 0.12f; break;
        case ROLE_SENIOR:  pct = 0.10f; break;
        case ROLE_JUNIOR:  pct = 0.08f; break;
        default:           pct = 0.05f; break;
    }
    return e->salary * pct;
}

void applyAnnualHike(EmpList *list) {
    EmpNode *curr = list->head;
    while (curr) {
        float hike = calcHike(&curr->emp);
        curr->emp.salary += hike;
        curr = curr->next;
    }
}
\`\`\``,

      content_en: `## Week 5 Project — Sab Kuch Combine!

This week covered:
- struct — complex data types
- union + enum — flexible types, bit flags
- Linked list — dynamic data structure

Now let's build a complete **Employee Management System** build!

### System Architecture

\`\`\`c
// ── Enums ──
typedef enum { DEPT_TECH, DEPT_HR, DEPT_SALES, DEPT_FINANCE } Department;
typedef enum { ROLE_INTERN, ROLE_JUNIOR, ROLE_SENIOR, ROLE_LEAD, ROLE_MANAGER } Role;
typedef enum { EMP_FULL_TIME, EMP_PART_TIME, EMP_CONTRACT } EmpType;

// ── Structures ──
typedef struct { char street[60]; char city[30]; int pin; } Address;
typedef struct { int day, month, year; } Date;

typedef struct {
 int id;
 char name[60];
 char email[60];
 Department dept;
 Role role;
 EmpType type;
 float salary;
 Date joinDate;
 Address addr;
 int skills; // bit flags — SKILL_C | SKILL_PYTHON etc
} Employee;

typedef struct EmpNode {
 Employee emp;
 struct EmpNode *next;
} EmpNode;

typedef struct {
 EmpNode *head;
 int count;
 int nextId;
} EmpList;

// ── Skill bit flags ──
typedef enum {
 SKILL_C = 1 << 0, // 1
 SKILL_CPP = 1 << 1, // 2
 SKILL_PYTHON = 1 << 2, // 4
 SKILL_JAVA = 1 << 3, // 8
 SKILL_JS = 1 << 4, // 16
 SKILL_SQL = 1 << 5, // 32
 SKILL_LINUX = 1 << 6, // 64
} Skill;
\`\`\`

### Functions to Implement

\`\`\`c
// CRUD
void addEmployee(EmpList *list, Employee e);
Employee* findById(EmpList *list, int id);
int updateSalary(EmpList *list, int id, float newSalary);
int deleteEmployee(EmpList *list, int id);

// Query
void filterByDept(EmpList *list, Department dept);
void filterBySkill(EmpList *list, Skill skill);
void filterBySalaryRange(EmpList *list, float min, float max);

// Analytics
void showStats(EmpList *list);
Employee* highestPaid(EmpList *list);
float avgSalary(EmpList *list, Department dept);
void salaryHistogram(EmpList *list);

// Display
void printEmployee(const Employee *e);
void printAllEmployees(EmpList *list);
const char* deptName(Department d);
const char* roleName(Role r);
\`\`\`

### Salary Hike Logic

\`\`\`c
// Role-based hike
float calcHike(const Employee *e) {
 float pct;
 switch (e->role) {
 case ROLE_MANAGER: pct = 0.15f; break;
 case ROLE_LEAD: pct = 0.12f; break;
 case ROLE_SENIOR: pct = 0.10f; break;
 case ROLE_JUNIOR: pct = 0.08f; break;
 default: pct = 0.05f; break;
 }
 return e->salary * pct;
}

void applyAnnualHike(EmpList *list) {
 EmpNode *curr = list->head;
 while (curr) {
 float hike = calcHike(&curr->emp);
 curr->emp.salary += hike;
 curr = curr->next;
 }
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { DEPT_TECH, DEPT_HR, DEPT_SALES, DEPT_FINANCE } Dept;
typedef enum { ROLE_INTERN, ROLE_JUNIOR, ROLE_SENIOR, ROLE_LEAD, ROLE_MGR } Role;
typedef enum { SK_C=1<<0,SK_PY=1<<1,SK_JS=1<<2,SK_SQL=1<<3,SK_LINUX=1<<4 } Skill;

typedef struct {
    int   id;
    char  name[50];
    Dept  dept;
    Role  role;
    float salary;
    int   skills;
} Emp;

typedef struct Node { Emp e; struct Node *next; } Node;
typedef struct { Node *head; int count, nextId; } EmpDB;

const char *deptStr[] = {"Tech","HR","Sales","Finance"};
const char *roleStr[] = {"Intern","Junior","Senior","Lead","Manager"};

EmpDB* createDB(){ EmpDB *d=(EmpDB*)malloc(sizeof(EmpDB)); d->head=NULL; d->count=0; d->nextId=1001; return d; }

void addEmp(EmpDB *db, Emp e){
    e.id = db->nextId++;
    Node *n=(Node*)malloc(sizeof(Node));
    n->e=e; n->next=db->head;
    db->head=n; db->count++;
}

void printSkills(int s){
    if(s&SK_C)     printf("C ");
    if(s&SK_PY)    printf("Python ");
    if(s&SK_JS)    printf("JS ");
    if(s&SK_SQL)   printf("SQL ");
    if(s&SK_LINUX) printf("Linux ");
}

void printEmp(const Emp *e){
    printf("ID:%-5d %-20s %-8s %-7s Rs%-9.0f Skills:", e->id, e->name,
           deptStr[e->dept], roleStr[e->role], e->salary);
    printSkills(e->skills); printf("\\n");
}

void printAll(EmpDB *db){
    printf("\\n%-5s %-20s %-8s %-7s %-12s %s\\n",
           "ID","Name","Dept","Role","Salary","Skills");
    printf("%s\\n","──────────────────────────────────────────────────────────");
    for(Node *c=db->head; c; c=c->next) printEmp(&c->e);
    printf("Total: %d employees\\n", db->count);
}

void stats(EmpDB *db){
    if(!db->count){puts("No employees");return;}
    float sum=0,maxS=0,minS=1e9f;
    Dept deptCnt[4]={0};
    for(Node *c=db->head;c;c=c->next){
        sum+=c->e.salary;
        if(c->e.salary>maxS) maxS=c->e.salary;
        if(c->e.salary<minS) minS=c->e.salary;
        deptCnt[c->e.dept]++;
    }
    printf("\\n=== Stats ===\\n");
    printf("Total: %d | Avg: Rs%.0f | Max: Rs%.0f | Min: Rs%.0f\\n",
           db->count, sum/db->count, maxS, minS);
    printf("By Dept: ");
    for(int i=0;i<4;i++) printf("%s:%d ",deptStr[i],deptCnt[i]);
    printf("\\n");
}

void annualHike(EmpDB *db){
    float rates[]={0.05f,0.08f,0.10f,0.12f,0.15f};
    for(Node *c=db->head;c;c=c->next)
        c->e.salary *= (1.0f + rates[c->e.role]);
    puts("Annual hike applied!");
}

void freeDB(EmpDB *db){
    Node *c=db->head,*t;
    while(c){t=c->next;free(c);c=t;}
    free(db);
}

int main(){
    EmpDB *db=createDB();

    // Add employees
    Emp data[]={
        {0,"Rahul Sharma",  DEPT_TECH,  ROLE_SENIOR, 80000, SK_C|SK_PY|SK_LINUX},
        {0,"Priya Patel",   DEPT_TECH,  ROLE_LEAD,   95000, SK_JS|SK_SQL|SK_LINUX},
        {0,"Aryan Singh",   DEPT_HR,    ROLE_JUNIOR, 45000, 0},
        {0,"Sneha Nair",    DEPT_SALES, ROLE_SENIOR, 65000, SK_SQL},
        {0,"Vikram Rao",    DEPT_TECH,  ROLE_MGR,   120000, SK_C|SK_PY|SK_JS|SK_SQL|SK_LINUX},
        {0,"Anita Desai",   DEPT_FINANCE,ROLE_JUNIOR,50000, SK_SQL},
        {0,"Ravi Kumar",    DEPT_TECH,  ROLE_INTERN, 25000, SK_C|SK_PY},
    };
    for(int i=0;i<7;i++) addEmp(db, data[i]);

    printAll(db);
    stats(db);

    printf("\\n--- After Annual Hike ---\\n");
    annualHike(db);
    stats(db);

    freeDB(db);
    return 0;
}`,

      codeExample_en: `/* See above — same code with English context */`,

      task: {
        description: 'Employee System extend karo: (1) "Department Transfer" function — employee ka department change karo, salary adjust karo (different depts ke alag pay scales). (2) "Performance Rating" — enum {POOR, AVERAGE, GOOD, EXCELLENT}, har employee ko rating do, hike accordingly calculate karo. (3) "Org Chart" — manager-employee relationships store karo (doubly linked list ya tree), department ka org chart print karo. (4) "Search and Filter" — multiple criteria se filter karo (salary range + department + skill combo).',
        description_en: 'Extend the Employee System: (1) "Department Transfer" function — change an employee\'s department, adjust salary (different pay scales per dept). (2) "Performance Rating" — enum {POOR, AVERAGE, GOOD, EXCELLENT}, assign a rating to each employee, calculate hike accordingly. (3) "Org Chart" — store manager-employee relationships (doubly linked list or tree), print the department org chart. (4) "Search and Filter" — filter by multiple criteria (salary range + department + skill combination).',
        hint: 'Multi-criteria filter: function pointer array ya combined condition. Org chart: add managerId field to Emp, build tree from list. Performance hike: poor=0, avg=5%, good=10%, excellent=15%.',
        hint_en: 'Multi-criteria filter: function pointer array or a combined condition. Org chart: add a managerId field to Emp, build a tree from the list. Performance hike: poor=0%, avg=5%, good=10%, excellent=15%.',
      },
      quiz: [
        {
          q: 'Linked list mein merge sort kyun array sort se alag implement karta hai?',
          options: [
            'Merge sort linked list mein nahi hoti',
            'Array mein middle random access se O(1) milta hai. Linked list mein O(n) traversal karna padta hai. Lekin merge step O(1) extra space mein hoti hai — no auxiliary array needed!',
            'Quicksort linked list ke liye better hai',
            'Complexity same hoti hai',
          ],
          correct: 1,
          explanation: 'Array merge sort: middle = arr[n/2] O(1). Linked list: middle find karne ke liye Floyd\'s slow/fast pointer O(n). Merge step: array ko extra O(n) space chahiye. Linked list merge: sirf pointers reassign karo — O(1) space! Overall time: both O(n log n). Quicksort linked list mein poor — random pivot access O(n), partition inefficient.',
          q_en: 'Why is merge sort implemented differently for a linked list than for an array?',
          options_en: [
            'Merge sort does not work on linked lists',
            'In an array, the middle is O(1) via random access. In a linked list, you need O(n) traversal. But the merge step needs no auxiliary array — O(1) extra space!',
            'Quicksort is better for linked lists',
            'The complexity is the same',
          ],
          explanation_en: 'Array merge sort: middle = arr[n/2] in O(1). Linked list: finding the middle requires Floyd\'s slow/fast pointer — O(n). Merge step: arrays need O(n) extra space. Linked list merge: just reassign pointers — O(1) space! Overall time: O(n log n) for both. Quicksort on a linked list is poor — random pivot access is O(n) and partitioning is inefficient.',
        },
        {
          q: 'struct mein linked list ke liye struct Node *next kyun likhte hain — typedef naam kyun use nahi kar sakte andar?',
          options: [
            'Compiler limitation',
            'typedef complete hone se pehle struct ke andar woh naam exist nahi karta. struct Node* use karo (tag name) — compiler pehle se jaanta hai iss name ka. typedef ke baad bahar Node* OK hai.',
            'Pointer different syntax hai',
            'Koi reason nahi — Node* bhi kaam karta hai',
          ],
          correct: 1,
          explanation: 'typedef struct Node { int d; Node *next; } Node; — ERROR! typedef processing tab complete hogi jab } Node; likha jaayega — andar Node pehle se exist nahi karta. Fix: typedef struct Node { int d; struct Node *next; } Node; — struct Node andar use karo (tag name, immediately available), Node* bahar use karo (after typedef complete).',
          q_en: 'Why do you write struct Node *next inside a linked list struct instead of the typedef name?',
          options_en: [
            'A compiler limitation',
            'The typedef name does not exist yet when you are inside the struct. Use struct Node* (the tag name) — the compiler already knows it. Node* is fine outside after the typedef is complete.',
            'Pointers have different syntax',
            'No reason — Node* works too',
          ],
          explanation_en: 'typedef struct Node { int d; Node *next; } Node; — ERROR! The typedef is only complete when } Node; is reached — inside, Node does not yet exist. Fix: typedef struct Node { int d; struct Node *next; } Node; — use struct Node inside (tag name, immediately available), and Node* outside (after the typedef is complete).',
        },
        {
          q: 'Singly vs Doubly linked list — real world mein kab kaunsa use karein?',
          options: [
            'Hamesha singly — simpler',
            'Singly: memory efficient (one pointer), traversal forward only, stack/queue. Doubly: backward traversal, O(1) delete with pointer, browser history, music playlist, LRU cache.',
            'Hamesha doubly — more features',
            'Koi practical difference nahi',
          ],
          correct: 1,
          explanation: 'Singly linked list: 1 pointer per node — less memory. Stack (LIFO), simple queue. Delete: O(n) — need previous node. Doubly: 2 pointers — more memory. Browser history (back/forward), text editor (undo/redo), music player, LRU cache. Delete O(1) with pointer to node. Circular doubly: OS process scheduling (round-robin).',
          q_en: 'Singly vs doubly linked list — when do you use each in the real world?',
          options_en: [
            'Always singly — simpler',
            'Singly: memory-efficient (one pointer), forward traversal only, stacks/queues. Doubly: backward traversal, O(1) delete with a pointer, browser history, music playlists, LRU cache.',
            'Always doubly — more features',
            'No practical difference',
          ],
          explanation_en: 'Singly linked list: 1 pointer per node — less memory. Stacks (LIFO), simple queues. Delete: O(n) — needs the previous node. Doubly: 2 pointers — more memory. Browser history (back/forward), text editors (undo/redo), music players, LRU cache. Delete O(1) with a pointer to the node. Circular doubly: OS process scheduling (round-robin).',
        },
      ],
    },
  ],
};