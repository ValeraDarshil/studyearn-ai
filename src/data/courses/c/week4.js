/**
 * StudyEarn AI — C Programming Course
 * Week 4: Pointers aur Memory — C ka Superpower!
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_4 = {
  week: 4,
  title: 'Pointers aur Memory — C ka Superpower!',
  title_en: 'Pointers and Memory — The Superpower of C!',
  description: 'Pointers, memory addresses, dynamic memory allocation — yeh samajh liya toh C ka asli power unlock ho jaayega!',
  description_en: 'Pointers, memory addresses, dynamic memory allocation — once you understand this, the real power of C is unlocked!',
  xpReward: 250,
  sections: [
    {
      id: 'c-w4-s1',
      title: 'Pointers — Memory ka Address Store Karo',
      title_en: 'Pointers — Store the Address of Memory',
      emoji: '🎯',
      content: `## Pointers — C ka Most Powerful Feature!

Pointer = ek variable jo kisi DOOSRE variable ka **memory address** store karta hai.

Samjho: Apne ghar ka address kisi ko diya — woh seedha aa sakta hai, sab kuch change kar sakta hai. Yahi pointer karta hai!

### Memory Model — Kaise Kaam Karta Hai

\`\`\`
Computer Memory (RAM):
Address | Value
───────────────
1000    |  25     ← int x = 25
1004    |  1000   ← int *p = &x (p stores address of x)
1008    |  ...
\`\`\`

### Pointer Basics

\`\`\`c
int x = 25;

// & operator = address of
printf("x ka address: %p\\n", (void*)&x);  // e.g. 0x7fff1234

// Pointer declare aur use karo
int *p;      // p = int ka pointer (int ke address store karega)
p = &x;      // p mein x ka address store karo

printf("p ki value (address): %p\\n", (void*)p);   // x ka address
printf("*p (value at address): %d\\n", *p);          // 25 — x ki value!

// * = dereference operator — address pe jaake value lo
*p = 100;    // x ki value 25 → 100
printf("x ab: %d\\n", x);  // 100!

// Ek likhna mein
int *q = &x;  // declare + initialize together
\`\`\`

### Pointer Types — Har Type ka Alag Pointer

\`\`\`c
int    x = 10;    int    *pi = &x;  // int pointer
float  f = 3.14f; float  *pf = &f;  // float pointer
double d = 9.99;  double *pd = &d;  // double pointer
char   c = 'A';   char   *pc = &c;  // char pointer

// void pointer — any type point kar sakta hai
void *vp = &x;   // generic pointer
vp = &f;          // type change kar sakte hain
// *vp nahi kar sakte directly — pehle cast karo
int val = *(int*)vp;

// NULL pointer — kisi ko point nahi karta
int *null_p = NULL;   // initialize safely
if (null_p == NULL) printf("Pointer is NULL\\n");
// *null_p access mat karo — SEGFAULT!
\`\`\`

### Pointer Arithmetic

\`\`\`c
int arr[] = {10, 20, 30, 40, 50};
int *p = arr;  // arr ka naam = address of first element

printf("%d\\n", *p);       // 10 — arr[0]
printf("%d\\n", *(p+1));   // 20 — arr[1]
printf("%d\\n", *(p+2));   // 30 — arr[2]

p++;           // p ab arr[1] point karta hai
printf("%d\\n", *p);  // 20

// p+1 = p ka address + sizeof(int) = next int ka address
// int: +1 = +4 bytes
// char: +1 = +1 byte
// double: +1 = +8 bytes

// Array traversal with pointer
for (int *ptr = arr; ptr < arr+5; ptr++) {
    printf("%d ", *ptr);  // 10 20 30 40 50
}

// Difference between pointers
int *start = arr;
int *end   = arr + 4;
printf("Elements between: %ld\\n", end - start);  // 4
\`\`\`

### Pointers aur Functions — Pass by Reference!

\`\`\`c
// ❌ Pass by value — original change nahi hoga
void swapWrong(int a, int b) {
    int temp = a; a = b; b = temp;
    // sirf copies swap hote hain
}

// ✅ Pass by pointer — original change HOGA
void swapCorrect(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// ✅ Multiple return values via pointers!
void minMax(int arr[], int n, int *min, int *max) {
    *min = *max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
    }
}

int main() {
    int a = 5, b = 10;
    printf("Before: a=%d b=%d\\n", a, b);
    swapCorrect(&a, &b);
    printf("After:  a=%d b=%d\\n", a, b);  // a=10 b=5

    int arr[] = {3,1,4,1,5,9,2,6};
    int mn, mx;
    minMax(arr, 8, &mn, &mx);
    printf("Min=%d Max=%d\\n", mn, mx);
}
\`\`\`

### Double Pointer — Pointer ka Pointer

\`\`\`c
int x   = 42;
int *p  = &x;    // p points to x
int **pp = &p;   // pp points to p

printf("%d\\n", x);    // 42
printf("%d\\n", *p);   // 42
printf("%d\\n", **pp); // 42 — dereference twice!

// Use: 2D dynamic arrays, function mein pointer modify karna
void allocate(int **p, int size) {
    *p = (int*)malloc(size * sizeof(int));
}
int *arr;
allocate(&arr, 10);  // arr mein memory allocate hogi
\`\`\``,

      content_en: `## Pointers — The Most Powerful Feature of C!

A pointer = a variable that stores the **memory address** of another variable.

### Pointer Basics

\`\`\`c
int x = 25;
int *p = &x;   // p stores the address of x

printf("%p\\n", (void*)p);  // address of x
printf("%d\\n", *p);         // 25 — value at that address

*p = 100;  // x is now 100 — changed through pointer!
\`\`\`

### Pointer Arithmetic

\`\`\`c
int arr[] = {10,20,30,40,50};
int *p = arr;

*(p+0); // 10    *(p+1); // 20    *(p+2); // 30
p++;    // now points to arr[1]

for(int *ptr=arr; ptr<arr+5; ptr++) printf("%d ", *ptr);
\`\`\`

### Pass by Pointer — Modify Originals

\`\`\`c
void swap(int *a, int *b) {
    int t=*a; *a=*b; *b=t;
}

void minMax(int a[], int n, int *min, int *max) {
    *min=*max=a[0];
    for(int i=1;i<n;i++){
        if(a[i]<*min)*min=a[i];
        if(a[i]>*max)*max=a[i];
    }
}
\`\`\`

### Double Pointer

\`\`\`c
int x=42, *p=&x, **pp=&p;
printf("%d\\n", **pp);  // 42
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>

// Swap using pointers
void swap(int *a, int *b) {
    int temp = *a; *a = *b; *b = temp;
}

// Selection sort using pointer manipulation
void selectionSort(int *arr, int n) {
    for (int i = 0; i < n-1; i++) {
        int *minPtr = arr + i;  // pointer to minimum element
        for (int j = i+1; j < n; j++) {
            if (*(arr+j) < *minPtr) minPtr = arr+j;
        }
        if (minPtr != arr+i) swap(arr+i, minPtr);
    }
}

// Print array using pointer
void printArr(int *arr, int n, char *label) {
    printf("%s: ", label);
    for (int *p = arr; p < arr+n; p++) printf("%d ", *p);
    printf("\\n");
}

// Reverse using pointers
void reverseArr(int *arr, int n) {
    int *lo = arr, *hi = arr+n-1;
    while (lo < hi) { swap(lo++, hi--); }
}

// Count occurrences using pointer
int countOccurrence(int *arr, int n, int val) {
    int count = 0;
    for (int *p = arr; p < arr+n; p++)
        if (*p == val) count++;
    return count;
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 64, 90, 25};
    int n = sizeof(arr)/sizeof(arr[0]);

    printArr(arr, n, "Original");

    // Count before sort
    printf("64 appears: %d times\\n", countOccurrence(arr, n, 64));
    printf("25 appears: %d times\\n", countOccurrence(arr, n, 25));

    selectionSort(arr, n);
    printArr(arr, n, "Sorted  ");

    reverseArr(arr, n);
    printArr(arr, n, "Reversed");

    // Pointer demo
    printf("\\n=== Pointer Demo ===\\n");
    int x = 42;
    int *p = &x;
    int **pp = &p;

    printf("x   = %d\\n", x);
    printf("*p  = %d\\n", *p);
    printf("**pp= %d\\n", **pp);

    *p = 100;
    printf("After *p=100: x=%d\\n", x);

    **pp = 999;
    printf("After **pp=999: x=%d\\n", x);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

void swap(int *a, int *b) { int t=*a;*a=*b;*b=t; }

void sortPtr(int *arr, int n) {
    for(int i=0;i<n-1;i++) {
        int *mn=arr+i;
        for(int j=i+1;j<n;j++) if(*(arr+j)<*mn) mn=arr+j;
        if(mn!=arr+i) swap(arr+i,mn);
    }
}

int main() {
    int arr[]={64,34,25,12,22,11,90};
    int n=sizeof(arr)/sizeof(arr[0]);

    sortPtr(arr,n);
    printf("Sorted: ");
    for(int *p=arr;p<arr+n;p++) printf("%d ",*p);
    printf("\\n");

    int x=42,*p=&x,**pp=&p;
    printf("x=%d *p=%d **pp=%d\\n",x,*p,**pp);
    **pp=999; printf("After **pp=999: x=%d\\n",x);
    return 0;
}`,

      task: {
        description: 'Pointers practice: (1) Pointer se teen numbers lo, maximum aur minimum do alag pointers mein store karo (minMax function). (2) "Merge Sort" using pointers implement karo. (3) String reverse karo using only pointers (no indexing []). (4) "Pointer Quiz" — bina run kiye predict karo output: int a=5,b=10; int *p=&a; *p=*p+b; p=&b; *p=*p-a; printf("%d %d",a,b);',
        description_en: 'Practise pointers: (1) Using pointers, take three numbers and store the maximum and minimum in two separate pointers (minMax function). (2) Implement Merge Sort using pointers. (3) Reverse a string using only pointers (no [] indexing). (4) "Pointer Quiz" — predict the output without running: int a=5,b=10; int *p=&a; *p=*p+b; p=&b; *p=*p-a; printf("%d %d",a,b);',
        hint: 'Pointer string reverse: char *lo=str, *hi=str+strlen(str)-1; while(lo<hi){char t=*lo;*lo=*hi;*hi=t;lo++;hi--;} Pointer quiz answer: *p=5+10=15 (a=15), p=&b, *p=10-15=-5 (b=-5).',
        hint_en: 'Pointer string reverse: char *lo=str, *hi=str+strlen(str)-1; while(lo<hi){char t=*lo;*lo=*hi;*hi=t;lo++;hi--;} Pointer quiz answer: *p=5+10=15 (a=15), p=&b, *p=10-15=-5 (b=-5).',
      },
      quiz: [
        {
          q: '* operator pointer ke context mein kya karta hai?',
          options: [
            'Multiply karta hai hamesha',
            'Declaration mein (*p): pointer variable declare karta hai. Expression mein (*p): dereference — pointer ki address pe jaake value access karta hai.',
            'Sirf multiply karta hai',
            'Address leta hai',
          ],
          correct: 1,
          explanation: '* ka context-dependent meaning: 1) int *p — declaration: p ek pointer hai. 2) *p = 10 — dereference: p ki address pe jaake 10 store karo. 3) int x = *p — dereference: p ki address se value padhke x mein store karo. & = "address of". * = "value at address". Yeh C ka fundamental concept hai.',
          q_en: 'What does the * operator do in the context of pointers?',
          options_en: [
            'Always multiplies',
            'In declaration (*p): declares a pointer variable. In an expression (*p): dereferences — goes to the address in the pointer and accesses the value.',
            'Only multiplies',
            'Takes an address',
          ],
          explanation_en: '* has context-dependent meaning: 1) int *p — declaration: p is a pointer. 2) *p = 10 — dereference: go to the address in p and store 10 there. 3) int x = *p — dereference: read the value at p\'s address and store it in x. & = "address of". * = "value at address". This is a fundamental C concept.',
        },
        {
          q: 'NULL pointer kya hai aur isko dereference karne se kya hoga?',
          options: [
            'NULL = 0 address, dereference karne se 0 milega',
            'NULL = kisi ko point nahi karta (address 0). Dereference karne se Segmentation Fault aayega — OS crash karega program ko.',
            'NULL sirf strings ke liye hai',
            'NULL pointer koi bhi value ho sakti hai',
          ],
          correct: 1,
          explanation: 'NULL = (void*)0 — kisi valid memory ka address nahi. *NULL_ptr karne se OS hardware-level protection trigger karta hai: "address 0 pe access not allowed" → SIGSEGV signal → program crash. Always check: if(ptr != NULL) before dereferencing. Function se pointer return karte waqt NULL return karo failure indicate karne ke liye.',
          q_en: 'What is a NULL pointer and what happens if you dereference it?',
          options_en: [
            'NULL = address 0, dereferencing gives 0',
            'NULL = points to nothing (address 0). Dereferencing causes a Segmentation Fault — the OS crashes the program.',
            'NULL is only for strings',
            'A NULL pointer can hold any value',
          ],
          explanation_en: 'NULL = (void*)0 — not a valid memory address. Dereferencing a NULL ptr triggers an OS hardware-level protection: "access to address 0 not allowed" → SIGSEGV signal → program crash. Always check: if(ptr != NULL) before dereferencing. When returning a pointer from a function, return NULL to indicate failure.',
        },
        {
          q: 'int *p = arr aur arr ke beech kya connection hai?',
          options: [
            'Koi connection nahi',
            'Array naam arr already arr[0] ka address hai — p = &arr[0] ke barabar. *(p+i) == arr[i] == *(arr+i). Arrays aur pointers C mein closely related hain.',
            'p arr ki copy hai',
            'arr aur p same memory use karte hain',
          ],
          correct: 1,
          explanation: 'Array-pointer duality: arr ek pointer constant hai — arr[0] ka address. arr[i] internally *(arr+i) hai! int *p=arr mein p flexible pointer hai (reassign kar sakte), arr fixed (array ka address). p++ kar sakte, arr++ nahi kar sakte (compile error). *(p+i) aur p[i] — dono same hain! Yeh C mein pointer notation aur array notation interchangeable kyun hain.',
          q_en: 'What is the connection between int *p = arr and arr?',
          options_en: [
            'No connection',
            'The array name arr is already the address of arr[0] — equivalent to &arr[0]. *(p+i) == arr[i] == *(arr+i). Arrays and pointers are closely related in C.',
            'p is a copy of arr',
            'arr and p use the same memory',
          ],
          explanation_en: 'Array-pointer duality: arr is a pointer constant — the address of arr[0]. arr[i] is internally *(arr+i)! With int *p=arr, p is a flexible pointer (can be reassigned); arr is fixed (you cannot do arr++, compile error). *(p+i) and p[i] are identical! This is why pointer notation and array notation are interchangeable in C.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w4-s2',
      title: 'Dynamic Memory — malloc, calloc, realloc, free',
      title_en: 'Dynamic Memory — malloc, calloc, realloc, free',
      emoji: '🧠',
      content: `## Dynamic Memory Allocation — Runtime pe Memory Lo!

Static allocation: compile time pe decide hota hai (int arr[100])
Dynamic allocation: runtime pe decide karo — exactly kitna chahiye!

### Stack vs Heap

\`\`\`
MEMORY LAYOUT:
───────────────────────
   Stack (top)          ← Local variables, function calls
   ↓ grows down
   
   (free space)
   
   ↑ grows up
   Heap                 ← malloc/calloc se memory yahan aati hai
───────────────────────
   Data Segment         ← Global, static variables
   Text Segment         ← Program code
───────────────────────

Stack: fast, auto-managed, limited (~1-8MB)
Heap:  slower, manual management, large (GBs available)
\`\`\`

### malloc — Memory Allocate Karo

\`\`\`c
#include <stdlib.h>

// malloc(size_in_bytes) → void pointer ya NULL (failure pe)
int *arr = (int*)malloc(5 * sizeof(int));

if (arr == NULL) {
    printf("Memory allocation failed!\\n");
    return 1;
}

// Use karo
for (int i = 0; i < 5; i++) arr[i] = (i+1) * 10;
for (int i = 0; i < 5; i++) printf("%d ", arr[i]);

// FREE karna ZARURI hai! Memory leak nahi chahiye!
free(arr);
arr = NULL;  // dangling pointer avoid karne ke liye

// ❌ malloc ke baad value garbage hoti hai!
int *p = (int*)malloc(sizeof(int));
printf("%d\\n", *p);  // garbage value!

// ✅ Initialize karo
*p = 0;
\`\`\`

### calloc — Zeroed Memory

\`\`\`c
// calloc(count, size_per_element) → allocate + ZERO initialize
int *arr = (int*)calloc(5, sizeof(int));
// Sab 0 se initialize ho jaayenge

// malloc vs calloc:
// malloc: faster, garbage values
// calloc: slightly slower (zeroing), clean values

// Use case
int *scoreBoard = (int*)calloc(100, sizeof(int));
// 100 scores, sab 0 se start — perfect!
\`\`\`

### realloc — Memory Resize Karo

\`\`\`c
int *arr = (int*)malloc(3 * sizeof(int));
arr[0]=1; arr[1]=2; arr[2]=3;

// Aur bada chahiye!
arr = (int*)realloc(arr, 6 * sizeof(int));
if (arr == NULL) { /* handle error */ }
arr[3]=4; arr[4]=5; arr[5]=6;

// Chota karo (rare but possible)
arr = (int*)realloc(arr, 2 * sizeof(int));

free(arr);  // hamesha!

// ✅ Safe realloc pattern
int *temp = (int*)realloc(arr, new_size * sizeof(int));
if (temp == NULL) {
    free(arr);  // original free karo
    return NULL;
}
arr = temp;  // ab safe hai reassign karna
\`\`\`

### Dynamic String

\`\`\`c
#include <string.h>

// String ka exact size allocate karo
char *name = "Rahul Sharma";
char *copy = (char*)malloc(strlen(name) + 1);  // +1 for null
strcpy(copy, name);
printf("%s\\n", copy);
free(copy);

// strdup — malloc + strcpy ek saath (POSIX)
char *dup = strdup(name);  // allocates + copies
// free(dup) zaruri hai!
\`\`\`

### Memory Errors — Common Mistakes

\`\`\`c
// ❌ 1. Memory Leak — free nahi kiya!
void leaky() {
    int *p = (int*)malloc(100 * sizeof(int));
    // use karo...
    // free(p); ← bhool gaye! memory wasted forever
}

// ❌ 2. Dangling Pointer — freed memory use karna
int *p = (int*)malloc(sizeof(int));
*p = 42;
free(p);
printf("%d\\n", *p);  // UNDEFINED BEHAVIOR!

// ✅ Fix: NULL set karo after free
free(p);
p = NULL;

// ❌ 3. Double Free — ek memory do baar free karna
free(p);
free(p);  // CRASH — undefined behavior

// ❌ 4. Buffer Overflow
int *arr = (int*)malloc(5 * sizeof(int));
arr[5] = 10;  // out of bounds! heap corruption

// ❌ 5. Stack overflow — too much local
void bad() {
    int huge[1000000];  // ~4MB on stack → Stack Overflow!
}

// ✅ Use heap instead
void good() {
    int *huge = (int*)malloc(1000000 * sizeof(int));
    // use...
    free(huge);
}
\`\`\`

### Valgrind — Memory Errors Detect Karo

\`\`\`bash
# Compile
gcc -g program.c -o program

# Run with Valgrind (Linux/Mac)
valgrind --leak-check=full ./program

# Output mein dikheha:
# "definitely lost: 40 bytes in 1 blocks" → memory leak
# "Invalid read of size 4" → out of bounds access
\`\`\``,

      content_en: `## Dynamic Memory Allocation — Allocate Memory at Runtime!

### Stack vs Heap

\`\`\`
Stack: fast, auto-managed, limited (~1–8 MB), local variables
Heap:  manual, large (GBs), malloc/calloc memory goes here
\`\`\`

### malloc, calloc, realloc, free

\`\`\`c
// malloc — allocate raw memory (garbage values)
int *arr = (int*)malloc(5 * sizeof(int));
if(!arr) { puts("failed"); return 1; }
// use... then:
free(arr); arr = NULL;

// calloc — allocate + zero-initialise
int *scores = (int*)calloc(100, sizeof(int));

// realloc — resize existing allocation
int *temp = (int*)realloc(arr, 10*sizeof(int));
if(!temp){ free(arr); return 1; }  // safe pattern
arr = temp;
\`\`\`

### Common Errors

\`\`\`c
// Memory leak — forgot to free
void leaky() { int *p=(int*)malloc(100*4); /* no free */ }

// Dangling pointer — using freed memory
free(p); *p=42;    // UNDEFINED BEHAVIOR

// Double free
free(p); free(p);  // CRASH

// Buffer overflow
int *a=(int*)malloc(5*4); a[5]=1; // heap corruption!
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Dynamic array that grows automatically
typedef struct {
    int *data;
    int size;
    int capacity;
} DynamicArray;

DynamicArray* createArray(int initial) {
    DynamicArray *arr = (DynamicArray*)malloc(sizeof(DynamicArray));
    arr->data     = (int*)malloc(initial * sizeof(int));
    arr->size     = 0;
    arr->capacity = initial;
    return arr;
}

void push(DynamicArray *arr, int val) {
    if (arr->size == arr->capacity) {
        // Double the capacity
        arr->capacity *= 2;
        arr->data = (int*)realloc(arr->data, arr->capacity * sizeof(int));
        printf("  [Resized to capacity: %d]\\n", arr->capacity);
    }
    arr->data[arr->size++] = val;
}

int pop(DynamicArray *arr) {
    if (arr->size == 0) { printf("Empty!\\n"); return -1; }
    return arr->data[--arr->size];
}

void printDynArr(DynamicArray *arr) {
    printf("Array [size=%d, cap=%d]: ", arr->size, arr->capacity);
    for (int i = 0; i < arr->size; i++) printf("%d ", arr->data[i]);
    printf("\\n");
}

void destroyArray(DynamicArray *arr) {
    free(arr->data);
    free(arr);
}

// Dynamic string array
char** readStrings(int n) {
    char **strs = (char**)malloc(n * sizeof(char*));
    for (int i = 0; i < n; i++) {
        char temp[100];
        printf("String %d: ", i+1);
        scanf("%s", temp);
        strs[i] = (char*)malloc((strlen(temp)+1) * sizeof(char));
        strcpy(strs[i], temp);
    }
    return strs;
}

void freeStrings(char **strs, int n) {
    for (int i = 0; i < n; i++) free(strs[i]);
    free(strs);
}

int main() {
    printf("=== Dynamic Array Demo ===\\n");
    DynamicArray *arr = createArray(4);  // start with capacity 4

    printf("Pushing 10 elements (capacity starts at 4):\\n");
    for (int i = 1; i <= 10; i++) {
        push(arr, i * 10);
        printDynArr(arr);
    }

    printf("\\nPopping:\\n");
    while (arr->size > 0) {
        printf("Popped: %d\\n", pop(arr));
    }

    destroyArray(arr);
    printf("Memory freed!\\n");

    // Memory size demo
    printf("\\n=== Memory Sizes ===\\n");
    int n;
    printf("Kitne integers allocate karein? ");
    scanf("%d", &n);

    int *dynamic = (int*)calloc(n, sizeof(int));
    printf("Allocated %d integers = %d bytes\\n", n, n*(int)sizeof(int));

    for (int i = 0; i < n; i++) dynamic[i] = i*i;
    printf("Squares: ");
    for (int i = 0; i < n; i++) printf("%d ", dynamic[i]);
    printf("\\n");

    free(dynamic);
    dynamic = NULL;

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Dynamic array
typedef struct { int *data; int size, cap; } DA;

DA* create(int c) {
    DA *a=(DA*)malloc(sizeof(DA));
    a->data=(int*)malloc(c*4); a->size=0; a->cap=c;
    return a;
}
void push(DA *a, int v) {
    if(a->size==a->cap){a->cap*=2;a->data=(int*)realloc(a->data,a->cap*4);}
    a->data[a->size++]=v;
}
void destroy(DA *a){free(a->data);free(a);}

int main() {
    DA *arr=create(2);
    for(int i=1;i<=8;i++) push(arr,i*10);
    printf("Size=%d Cap=%d\\n",arr->size,arr->cap);
    for(int i=0;i<arr->size;i++) printf("%d ",arr->data[i]);
    printf("\\n");
    destroy(arr);
    return 0;
}`,

      task: {
        description: 'Dynamic memory practice: (1) "Dynamic Stack" implement karo — push, pop, peek, isEmpty, isFull functions with dynamic resizing. (2) "Matrix ke dimensions runtime pe lo" — user se rows aur cols lo, 2D array dynamically allocate karo (int **), matrix fill karo, print karo, transpose karo, free karo. (3) "String Tokenizer" — user se sentence lo, dynamically allocate karo, words split karo aur each word alag dynamically allocated array mein store karo.',
        description_en: 'Dynamic memory practice: (1) Implement a "Dynamic Stack" — push, pop, peek, isEmpty, isFull with dynamic resizing. (2) "Matrix with runtime dimensions" — take rows and cols from the user, dynamically allocate a 2D array (int **), fill the matrix, print, transpose, and free it. (3) "String Tokenizer" — take a sentence, dynamically allocate it, split into words, store each word in a separate dynamically allocated array.',
        hint: '2D dynamic: int **mat=(int**)malloc(rows*sizeof(int*)); for(i) mat[i]=(int*)malloc(cols*sizeof(int)). Free: for(i) free(mat[i]); free(mat). Stack: use realloc to double when full.',
        hint_en: '2D dynamic: int **mat=(int**)malloc(rows*sizeof(int*)); for(i) mat[i]=(int*)malloc(cols*sizeof(int)). Free: for(i) free(mat[i]); free(mat). Stack: use realloc to double capacity when full.',
      },
      quiz: [
        {
          q: 'malloc aur calloc mein kya main fark hai?',
          options: [
            'Koi fark nahi',
            'malloc(n) — n bytes allocate, garbage values. calloc(count, size) — count*size bytes allocate + sab zero se initialize. calloc slightly slower.',
            'malloc sirf integers ke liye',
            'calloc nahi use karna chahiye',
          ],
          correct: 1,
          explanation: 'malloc: raw memory, garbage values — agar use se pehle initialize karna ho toh thoda faster. calloc: zero-initialized — scoreboards, arrays jo 0 se shuru hote hain ke liye perfect. calloc(n, s) internally malloc(n*s) + memset(0) jaisa hai. Both return void* or NULL on failure.',
          q_en: 'What is the main difference between malloc and calloc?',
          options_en: [
            'No difference',
            'malloc(n) — allocate n bytes, garbage values. calloc(count, size) — allocate count*size bytes + zero-initialise all. calloc is slightly slower.',
            'malloc is only for integers',
            'calloc should not be used',
          ],
          explanation_en: 'malloc: raw memory, garbage values — slightly faster if you initialise before use. calloc: zero-initialised — perfect for scoreboards and arrays that start at 0. calloc(n, s) is essentially like malloc(n*s) + memset(0). Both return void* or NULL on failure.',
        },
        {
          q: 'Memory leak kya hota hai aur isse kyun avoid karna chahiye?',
          options: [
            'Variable delete ho jaata hai',
            'malloc se allocate memory ko free nahi kiya — program terminate hone tak woh memory "occupied" rehti hai. Long-running programs mein RAM khatam ho jaata hai.',
            'Memory overwrite ho jaata hai',
            'Sirf C++ mein hota hai',
          ],
          correct: 1,
          explanation: 'Memory leak: heap pe allocate memory ka pointer lost ho jaaya — free karne ka koi way nahi raha. Server programs (jo din-raat chalte hain) mein: 1KB leak per request, 1M requests/day = 1GB/day leak → server crash! Tools: Valgrind, AddressSanitizer detect karte hain. Rule: every malloc = one free. RAII pattern use karo (C++ mein easier, C mein manual).',
          q_en: 'What is a memory leak and why should it be avoided?',
          options_en: [
            'A variable gets deleted',
            'Memory allocated with malloc is never freed — it stays "occupied" until the program terminates. In long-running programs, RAM eventually runs out.',
            'Memory gets overwritten',
            'Only happens in C++',
          ],
          explanation_en: 'Memory leak: the pointer to heap-allocated memory is lost — there is no way to free it. In server programs (running 24/7): 1 KB leak per request, 1M requests/day = 1 GB/day leak → server crash! Tools: Valgrind, AddressSanitizer can detect them. Rule: every malloc has exactly one free. Use the RAII pattern (easier in C++, manual in C).',
        },
        {
          q: 'free(p) ke baad p ko NULL kyun set karte hain?',
          options: [
            'Sirf style ke liye',
            'Dangling pointer prevent karne ke liye — free ke baad p abhi bhi purana address store karta hai. *p access karna undefined. NULL set karne ke baad *p immediately segfault karega — easily detectable.',
            'Memory free hoti hai NULL se',
            'free() automatically NULL set karta hai',
          ],
          correct: 1,
          explanation: 'free(p): memory OS ko wapas karta hai, p ka value change nahi hota — dangling pointer! free ke baad *p: undefined behavior — kabhi garbage padhega, kabhi crash. p=NULL ke baad: agar accidentally *p karo toh immediate segfault — debugging easy. Double free bhi prevent hoti hai: free(NULL) safe hai (no-op), free(dangling_ptr) crash.',
          q_en: 'Why do we set p to NULL after free(p)?',
          options_en: [
            'Just for style',
            'To prevent a dangling pointer — after free, p still holds the old address. Accessing *p is undefined. After setting to NULL, *p immediately segfaults — easily detectable.',
            'Setting to NULL frees memory',
            'free() automatically sets NULL',
          ],
          explanation_en: 'free(p): returns memory to the OS, does not change p\'s value — dangling pointer! After free, *p: undefined behaviour — sometimes garbage, sometimes crash. After p=NULL: if you accidentally access *p, you get an immediate segfault — easy to debug. Also prevents double-free: free(NULL) is safe (a no-op), free(dangling_ptr) crashes.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w4-s3',
      title: 'Pointer to Functions aur Advanced Patterns',
      title_en: 'Pointers to Functions and Advanced Patterns',
      emoji: '🚀',
      content: `## Function Pointers — Functions bhi Pointer ho Sakte Hain!

C mein functions bhi memory mein hote hain — unka address le sakte ho aur pointer se call kar sakte ho!

### Function Pointer Basics

\`\`\`c
// Syntax: return_type (*pointer_name)(param_types)
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

// Function pointer declare
int (*operation)(int, int);

// Assign
operation = add;          // function ka naam = address
operation = &add;         // same — & optional

// Call
int result = operation(10, 5);   // add(10,5) = 15
result = (*operation)(10, 5);    // same — explicit dereference
\`\`\`

### Function Pointer Array — Dispatch Table

\`\`\`c
// Calculator using function pointer array
int add(int a, int b) { return a+b; }
int sub(int a, int b) { return a-b; }
int mul(int a, int b) { return a*b; }
int dvd(int a, int b) { return b ? a/b : 0; }

int (*ops[4])(int, int) = {add, sub, mul, dvd};
char *opNames[] = {"Add", "Sub", "Mul", "Div"};

for (int i = 0; i < 4; i++) {
    printf("%s(10, 3) = %d\\n", opNames[i], ops[i](10, 3));
}
\`\`\`

### qsort — stdlib ka Powerful Sort (Function Pointer!)

\`\`\`c
#include <stdlib.h>

// Comparator function
int compareInt(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);   // ascending
    // return (*(int*)b - *(int*)a); // descending
}

int compareStr(const void *a, const void *b) {
    return strcmp(*(char**)a, *(char**)b);
}

int arr[] = {64, 34, 25, 12, 22, 11, 90};
int n = sizeof(arr)/sizeof(arr[0]);

qsort(arr, n, sizeof(int), compareInt);
// Now arr is sorted!
\`\`\`

### Callbacks — Higher-Order Functions

\`\`\`c
// apply function to each element
void forEach(int *arr, int n, void (*callback)(int)) {
    for (int i = 0; i < n; i++) callback(arr[i]);
}

// filter function — return new array
int* filter(int *arr, int n, int (*predicate)(int), int *outSize) {
    int *result = (int*)malloc(n * sizeof(int));
    *outSize = 0;
    for (int i = 0; i < n; i++) {
        if (predicate(arr[i])) result[(*outSize)++] = arr[i];
    }
    return result;
}

// map function — transform each element
int* map(int *arr, int n, int (*transform)(int)) {
    int *result = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) result[i] = transform(arr[i]);
    return result;
}

// Usage
void printVal(int x)  { printf("%d ", x); }
int  isEven(int x)    { return x % 2 == 0; }
int  square(int x)    { return x * x; }
int  doubleIt(int x)  { return x * 2; }

int arr[] = {1,2,3,4,5,6,7,8};
int n = 8;

printf("All: ");     forEach(arr, n, printVal);
int sz;
int *evens = filter(arr, n, isEven, &sz);
printf("\\nEvens: "); forEach(evens, sz, printVal);
int *squares = map(arr, n, square);
printf("\\nSquares: "); forEach(squares, n, printVal);
free(evens); free(squares);
\`\`\`

### typedef — Function Pointer Names Clean Karo

\`\`\`c
// Without typedef — ugly!
int (*op)(int, int);
void apply(int (*func)(int, int), int a, int b) { }

// With typedef — clean!
typedef int (*BinaryOp)(int, int);
typedef void (*Callback)(int);

BinaryOp op = add;
void apply(BinaryOp func, int a, int b) {
    printf("Result: %d\\n", func(a, b));
}
\`\`\`

### Pointer to Struct (Preview — Week 5 mein detail mein)

\`\`\`c
typedef struct {
    char name[50];
    int age;
    float gpa;
} Student;

Student s = {"Rahul", 20, 8.5f};
Student *sp = &s;

// Access members
printf("%s\\n", s.name);     // dot notation
printf("%s\\n", sp->name);   // arrow notation (pointer ke liye)
printf("%s\\n", (*sp).name); // same as above

// Arrow operator sp->name = (*sp).name
sp->age = 21;
sp->gpa = 9.0f;
\`\`\``,

      content_en: `## Function Pointers — Functions Can Be Pointers Too!

### Basics

\`\`\`c
int add(int a, int b) { return a+b; }
int sub(int a, int b) { return a-b; }

int (*op)(int, int) = add;
printf("%d\\n", op(10, 5));  // 15

// Array of function pointers
int (*ops[])(int,int) = {add, sub};
ops[0](10,5);  // 15     ops[1](10,5);  // 5
\`\`\`

### qsort with Function Pointer

\`\`\`c
int cmpAsc(const void *a, const void *b) {
    return *(int*)a - *(int*)b;
}
qsort(arr, n, sizeof(int), cmpAsc);
\`\`\`

### Callbacks (Higher-Order Functions)

\`\`\`c
void forEach(int *a, int n, void (*cb)(int)) {
    for(int i=0;i<n;i++) cb(a[i]);
}
int* map(int *a, int n, int (*f)(int)) {
    int *r=(int*)malloc(n*4);
    for(int i=0;i<n;i++) r[i]=f(a[i]);
    return r;
}

void print(int x) { printf("%d ",x); }
int  sq(int x)    { return x*x; }

forEach(arr, n, print);
int *squares = map(arr, n, sq);
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef int (*IntOp)(int, int);
typedef int (*IntPred)(int);
typedef void (*IntCallback)(void);

// Operations
int add(int a,int b){return a+b;}
int sub(int a,int b){return a-b;}
int mul(int a,int b){return a*b;}
int dvd(int a,int b){return b?a/b:0;}
int mod(int a,int b){return b?a%b:0;}

// Predicates
int isEven(int x)  {return x%2==0;}
int isOdd(int x)   {return x%2!=0;}
int isPos(int x)   {return x>0;}
int isPrime(int x) {
    if(x<2)return 0;
    for(int i=2;i*i<=x;i++) if(x%i==0)return 0;
    return 1;
}

// Transformations
int square(int x) {return x*x;}
int cube(int x)   {return x*x*x;}
int negate(int x) {return -x;}
int abs_val(int x){return x<0?-x:x;}

// Higher-order functions
void forEach(int *a,int n,void(*cb)(int)){
    for(int i=0;i<n;i++) cb(a[i]);
}
int* filter(int *a,int n,IntPred pred,int *sz){
    int *r=(int*)malloc(n*sizeof(int)); *sz=0;
    for(int i=0;i<n;i++) if(pred(a[i])) r[(*sz)++]=a[i];
    return r;
}
int* mapArr(int *a,int n,int(*f)(int)){
    int *r=(int*)malloc(n*sizeof(int));
    for(int i=0;i<n;i++) r[i]=f(a[i]);
    return r;
}
int reduce(int *a,int n,int init,IntOp f){
    int acc=init;
    for(int i=0;i<n;i++) acc=f(acc,a[i]);
    return acc;
}

void printInt(int x){printf("%d ",x);}

int main(){
    int arr[]={1,2,3,4,5,6,7,8,9,10};
    int n=10;

    // Function pointer table
    IntOp ops[]={add,sub,mul,dvd,mod};
    char *opNames[]={"add","sub","mul","div","mod"};
    printf("=== Operation Table ===\\n");
    for(int i=0;i<5;i++)
        printf("10 %s 3 = %d\\n", opNames[i], ops[i](10,3));

    // Higher-order operations
    printf("\\n=== Array: "); forEach(arr,n,printInt); printf("===\\n");

    int sz;
    int *evens=filter(arr,n,isEven,&sz);
    printf("Evens  (%d): ",sz); forEach(evens,sz,printInt); printf("\\n");

    int *primes=filter(arr,n,isPrime,&sz);
    printf("Primes (%d): ",sz); forEach(primes,sz,printInt); printf("\\n");

    int *sq=mapArr(arr,n,square);
    printf("Squares: "); forEach(sq,n,printInt); printf("\\n");

    int sum=reduce(arr,n,0,add);
    int prod=reduce(arr,5,1,mul);
    printf("Sum=%-5d Product(1-5)=%d\\n",sum,prod);

    // qsort with different comparators
    int data[]={5,2,8,1,9,3,7,4,6};
    int dn=9;
    int asc(const void*a,const void*b){return *(int*)a-*(int*)b;}
    int desc(const void*a,const void*b){return *(int*)b-*(int*)a;}
    qsort(data,dn,sizeof(int),asc);
    printf("\\nAsc : "); forEach(data,dn,printInt); printf("\\n");
    qsort(data,dn,sizeof(int),desc);
    printf("Desc: "); forEach(data,dn,printInt); printf("\\n");

    free(evens); free(primes); free(sq);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

int add(int a,int b){return a+b;}
int isEven(int x){return x%2==0;}
int square(int x){return x*x;}

void forEach(int *a,int n,void(*f)(int)){for(int i=0;i<n;i++)f(a[i]);}
int* mapArr(int *a,int n,int(*f)(int)){
    int *r=(int*)malloc(n*4);
    for(int i=0;i<n;i++) r[i]=f(a[i]);
    return r;
}
void printInt(int x){printf("%d ",x);}

int cmpAsc(const void*a,const void*b){return *(int*)a-*(int*)b;}

int main(){
    int arr[]={5,3,8,1,9,2,7,4,6};
    int n=9;

    qsort(arr,n,sizeof(int),cmpAsc);
    printf("Sorted: "); forEach(arr,n,printInt); printf("\\n");

    int *sq=mapArr(arr,n,square);
    printf("Squares: "); forEach(sq,n,printInt); printf("\\n");
    free(sq);
    return 0;
}`,

      task: {
        description: 'Function pointers advanced practice: (1) "Plugin System" banao — 5 different math operations (sin, cos, sqrt, log, pow2) ke function pointers ek array mein store karo, user menu se choose kare, dynamic dispatch karo. (2) "Generic Sort" — int, float, char arrays ke liye ek sort function likho jo comparator function pointer le. (3) "Event System" simulation — events register karo (onClick, onLoad, onError) aur trigger karo. (4) qsort se string array alphabetically sort karo.',
        description_en: 'Advanced function pointer practice: (1) Build a "Plugin System" — store function pointers for 5 math operations (sin, cos, sqrt, log, pow2) in an array, let the user choose from a menu, and do dynamic dispatch. (2) "Generic Sort" — write one sort function that takes a comparator function pointer and works for int, float, and char arrays. (3) "Event System" simulation — register events (onClick, onLoad, onError) and trigger them. (4) Sort a string array alphabetically with qsort.',
        hint: 'qsort strings: int cmpStr(const void*a,const void*b){return strcmp(*(char**)a,*(char**)b);}. Event system: struct Event{char name[20]; void(*handler)();}; array of events. Generic sort: void gsort(void *arr, int n, int size, int(*cmp)(void*,void*)).',
        hint_en: 'qsort strings: int cmpStr(const void*a,const void*b){return strcmp(*(char**)a,*(char**)b);}. Event system: struct Event{char name[20]; void(*handler)();}; array of events. Generic sort: void gsort(void *arr, int n, int size, int(*cmp)(void*,void*)).',
      },
      quiz: [
        {
          q: 'qsort comparator function int cmp(const void *a, const void *b) mein negative, 0, positive return kyun karte hain?',
          options: [
            'Sirf convention hai',
            'Negative = a should come before b (a < b). Zero = equal. Positive = a should come after b (a > b). qsort yahi information use karta hai elements arrange karne ke liye.',
            'qsort sirf 0 ya 1 accept karta hai',
            'Return value matter nahi karta',
          ],
          correct: 1,
          explanation: 'qsort comparator contract: <0 means a before b, 0 means equal, >0 means a after b. int cmp: return *(int*)a - *(int*)b gives ascending. Simple subtraction trick kaam karta hai integers ke liye (overflow avoid karo large numbers mein). Descending: b-a. Strings: strcmp() directly return karo. Custom struct: specific field compare karo.',
          q_en: 'Why does the qsort comparator return negative, 0, or positive?',
          options_en: [
            'Just convention',
            'Negative = a comes before b (a < b). Zero = equal. Positive = a comes after b (a > b). qsort uses this to arrange elements.',
            'qsort only accepts 0 or 1',
            'The return value does not matter',
          ],
          explanation_en: 'qsort comparator contract: <0 means a before b, 0 means equal, >0 means a after b. int cmp: return *(int*)a - *(int*)b gives ascending order. The subtraction trick works for integers (be careful of overflow with very large numbers). Descending: b-a. Strings: return strcmp() directly. Custom structs: compare a specific field.',
        },
        {
          q: 'Function pointer ka main real-world use kya hai?',
          options: [
            'Sirf academic purpose',
            'Callbacks (event handlers, sort comparators), plugins, strategy pattern, dispatch tables — runtime pe decide karo kaunsa function call karna hai. Yeh C mein polymorphism ka tarika hai.',
            'Sirf qsort ke liye',
            'Memory save karne ke liye',
          ],
          correct: 1,
          explanation: 'Function pointers real world mein: (1) qsort, bsearch (standard library). (2) Signal handlers: signal(SIGINT, handler). (3) Plugin systems: dynamically loaded .so files. (4) GUI frameworks: onClick, onKeyPress callbacks. (5) OS kernel: interrupt handlers. (6) State machines: transition functions. Essentially jab runtime pe function choose karna ho — polymorphism without OOP.',
          q_en: 'What is the main real-world use of function pointers?',
          options_en: [
            'Only academic',
            'Callbacks (event handlers, sort comparators), plugins, strategy pattern, dispatch tables — decide at runtime which function to call. This is how C achieves polymorphism.',
            'Only for qsort',
            'To save memory',
          ],
          explanation_en: 'Function pointers in the real world: (1) qsort, bsearch (standard library). (2) Signal handlers: signal(SIGINT, handler). (3) Plugin systems: dynamically loaded .so files. (4) GUI frameworks: onClick, onKeyPress callbacks. (5) OS kernel: interrupt handlers. (6) State machines: transition functions. Essentially: whenever you need to choose a function at runtime — polymorphism without OOP.',
        },
        {
          q: 'Arrow operator (->) kab use karte hain?',
          options: [
            'Hamesha dot operator ki jagah',
            'Jab struct ka pointer ho tab: ptr->member = (*ptr).member. Dot operator jab direct struct variable ho. Arrow = pointer se member access.',
            'Strings ke liye',
            'Array access ke liye',
          ],
          correct: 1,
          explanation: 'Student s; s.name ✅ (direct). Student *p=&s; p->name ✅ (pointer). (*p).name bhi same hai lekin arrow zyada readable. Arrow = deref + member access ek step mein. Linked lists, trees, dynamic structs mein hamesha arrow use hoga kyunki woh pointer-based hain.',
          q_en: 'When do we use the arrow operator (->)?',
          options_en: [
            'Always instead of the dot operator',
            'When you have a pointer to a struct: ptr->member = (*ptr).member. The dot operator is for direct struct variables. Arrow = member access through a pointer.',
            'For strings',
            'For array access',
          ],
          explanation_en: 'Student s; s.name ✅ (direct struct). Student *p=&s; p->name ✅ (pointer to struct). (*p).name is the same but arrow is more readable. Arrow = dereference + member access in one step. In linked lists, trees, and dynamic structs you will always use arrow because they are pointer-based.',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w4-s4',
      title: 'Month 1 Capstone — Complete C Foundation Project',
      title_en: 'Month 1 Capstone — Complete C Foundation Project',
      emoji: '🏆',
      content: `## Month 1 Complete! — Sab Kuch Ek Project Mein!

### Teen Hafte ka Summary:

\`\`\`
Week 1: C basics, variables, data types, printf/scanf, operators
Week 2: Control flow — if/else, switch, for/while/do-while loops
Week 3: Functions, recursion, arrays, strings
Week 4: Pointers, dynamic memory, function pointers

Ab yeh sab combine karo ek COMPLETE SYSTEM mein!
\`\`\`

### Capstone: Student Management System

\`\`\`c
// Features:
// 1. Add students (dynamic array — grows as needed)
// 2. Display all students
// 3. Search by name or roll number
// 4. Sort by name / marks / roll number
// 5. Calculate statistics (avg, max, min, pass/fail)
// 6. Delete student
// 7. Update marks
// 8. Save to file (basic)

// Core structures aur functions:
typedef struct {
    int    rollNo;
    char   name[50];
    float  marks[5];    // 5 subjects
    float  total;
    float  percentage;
    char   grade;
} Student;

typedef struct {
    Student *students;  // dynamic array
    int      count;
    int      capacity;
} Database;

// Functions needed:
Database* createDB(int initial);
void      addStudent(Database *db, Student s);
void      displayAll(Database *db);
Student*  searchByRoll(Database *db, int roll);
Student*  searchByName(Database *db, char *name);
void      sortBy(Database *db, char *field);
void      calcStats(Database *db);
void      deleteStudent(Database *db, int roll);
void      freeDB(Database *db);

// Grade calculation
char calcGrade(float pct) {
    if (pct >= 90) return 'A';
    if (pct >= 75) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 45) return 'D';
    return 'F';
}

// Total aur percentage
void calcTotals(Student *s, int subjects) {
    s->total = 0;
    for (int i = 0; i < subjects; i++) s->total += s->marks[i];
    s->percentage = s->total / subjects;
    s->grade = calcGrade(s->percentage);
}
\`\`\`

### Month 1 Quick Reference

\`\`\`c
// ── Basics ──
printf("%-10s %5.2f\\n", name, value);  // formatted output
scanf(" %c", &ch);   // char input (space to flush)

// ── Control Flow ──
if(c1&&c2) {} else if(c3||c4) {} else {}
switch(x){case 1: break; default:}
for(int i=0;i<n;i++) {}
while(cond) { if(exit_cond) break; if(skip) continue; }

// ── Functions ──
int func(int a, int *b) { *b = 10; return a; }  // modify via pointer
void arr_func(int arr[], int n) {}  // array = pointer

// ── Pointers ──
int *p = &x;     // point to x
*p = 100;        // dereference — change x
p++;             // next int in memory
int **pp = &p;   // double pointer

// ── Memory ──
int *d = (int*)malloc(n*sizeof(int));
if(!d) { /* error */ }
// use d[i] or *(d+i)
free(d); d = NULL;

// ── Recursion ──
int fact(int n) { return n<=1 ? 1 : n*fact(n-1); }

// ── String ──
strlen, strcpy, strcat, strcmp, strstr, sprintf, sscanf
fgets(buf, sizeof(buf), stdin);
buf[strcspn(buf,"\\n")] = '\\0';  // remove newline

// ── qsort ──
int cmp(const void *a, const void *b){ return *(int*)a-*(int*)b; }
qsort(arr, n, sizeof(int), cmp);
\`\`\`

### Month 2 Preview — Structures, Files, aur aur!

\`\`\`
Month 2 (Weeks 5-8):
  Week 5: Structures aur Unions — Custom Data Types
  Week 6: File I/O — Disk pe Data Save/Load karo
  Week 7: Preprocessor, Enums, Bitfields
  Week 8: Linked Lists — Dynamic Data Structure

Month 3 (Weeks 9-12):
  Week 9:  Stacks aur Queues
  Week 10: Trees aur Graphs
  Week 11: Sorting aur Searching Algorithms
  Week 12: Final Project — Complete System
\`\`\``,

      content_en: `## Month 1 Complete! — Everything in One Project!

### Three-Week Summary:
- **Week 1:** Variables, data types, printf/scanf, operators
- **Week 2:** Control flow — if/else, switch, for/while/do-while
- **Week 3:** Functions, recursion, arrays, strings
- **Week 4:** Pointers, dynamic memory, function pointers

### Capstone: Student Management System

\`\`\`c
typedef struct {
    int rollNo; char name[50];
    float marks[5], total, percentage;
    char grade;
} Student;

typedef struct {
    Student *students;
    int count, capacity;
} Database;
\`\`\`

### Month 1 Quick Reference

\`\`\`c
// Pointers
int *p=&x; *p=100; p++;
int *d=(int*)malloc(n*4); free(d); d=NULL;

// Strings
fgets(buf,sizeof(buf),stdin);
buf[strcspn(buf,"\\n")]='\\0';

// qsort
int cmp(const void*a,const void*b){return *(int*)a-*(int*)b;}
qsort(arr,n,sizeof(int),cmp);
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_SUBJECTS 5
#define SUBJECTS     5
char *SUBJECT_NAMES[] = {"Math","Physics","Chemistry","English","CS"};

typedef struct {
    int   rollNo;
    char  name[50];
    float marks[MAX_SUBJECTS];
    float total, percentage;
    char  grade;
} Student;

typedef struct {
    Student *data;
    int count, capacity;
} DB;

DB* createDB() {
    DB *db = (DB*)malloc(sizeof(DB));
    db->data = (Student*)malloc(4 * sizeof(Student));
    db->count = 0; db->capacity = 4;
    return db;
}

void calcStudent(Student *s) {
    s->total = 0;
    for (int i = 0; i < SUBJECTS; i++) s->total += s->marks[i];
    s->percentage = s->total / SUBJECTS;
    if (s->percentage >= 90) s->grade = 'A';
    else if (s->percentage >= 75) s->grade = 'B';
    else if (s->percentage >= 60) s->grade = 'C';
    else if (s->percentage >= 45) s->grade = 'D';
    else s->grade = 'F';
}

void addStudent(DB *db) {
    if (db->count == db->capacity) {
        db->capacity *= 2;
        db->data = (Student*)realloc(db->data, db->capacity * sizeof(Student));
    }
    Student s;
    printf("Roll No: "); scanf("%d", &s.rollNo);
    printf("Name: "); scanf(" %49[^\\n]", s.name);
    for (int i = 0; i < SUBJECTS; i++) {
        printf("%s marks: ", SUBJECT_NAMES[i]);
        scanf("%f", &s.marks[i]);
    }
    calcStudent(&s);
    db->data[db->count++] = s;
    printf("✅ Student added!\\n");
}

void displayAll(DB *db) {
    if (!db->count) { printf("No students!\\n"); return; }
    printf("\\n%-5s %-15s ", "Roll", "Name");
    for (int i = 0; i < SUBJECTS; i++) printf("%-8s", SUBJECT_NAMES[i]);
    printf("%-8s %-6s %s\\n", "Total", "Pct%", "Gr");
    printf("%s\\n", "──────────────────────────────────────────────────────────");

    for (int i = 0; i < db->count; i++) {
        Student *s = &db->data[i];
        printf("%-5d %-15s ", s->rollNo, s->name);
        for (int j = 0; j < SUBJECTS; j++) printf("%-8.1f", s->marks[j]);
        printf("%-8.1f %-6.1f %c\\n", s->total, s->percentage, s->grade);
    }
}

int cmpByPct(const void *a, const void *b) {
    return (int)(((Student*)b)->percentage - ((Student*)a)->percentage);
}

void showStats(DB *db) {
    if (!db->count) return;
    float sum=0, maxP=0, minP=100;
    int passCount=0;
    for (int i=0;i<db->count;i++) {
        Student *s=&db->data[i];
        sum+=s->percentage;
        if(s->percentage>maxP) maxP=s->percentage;
        if(s->percentage<minP) minP=s->percentage;
        if(s->percentage>=45) passCount++;
    }
    printf("\\n=== Statistics ===\\n");
    printf("Total: %d | Pass: %d | Fail: %d\\n",db->count,passCount,db->count-passCount);
    printf("Avg: %.1f%% | Max: %.1f%% | Min: %.1f%%\\n",sum/db->count,maxP,minP);
    qsort(db->data,db->count,sizeof(Student),cmpByPct);
    printf("Topper: %s (%.1f%%)\\n",db->data[0].name,db->data[0].percentage);
}

int main() {
    DB *db = createDB();
    int choice;
    do {
        printf("\\n╔══════════════════════════════╗\\n");
        printf("║  STUDENT MANAGEMENT SYSTEM   ║\\n");
        printf("╠══════════════════════════════╣\\n");
        printf("║ 1. Add Student               ║\\n");
        printf("║ 2. Display All               ║\\n");
        printf("║ 3. Statistics                ║\\n");
        printf("║ 4. Exit                      ║\\n");
        printf("╚══════════════════════════════╝\\n");
        printf("Choice: "); scanf("%d", &choice);
        switch(choice) {
            case 1: addStudent(db); break;
            case 2: displayAll(db); break;
            case 3: showStats(db); break;
            case 4: printf("Goodbye!\\n"); break;
            default: printf("Invalid!\\n");
        }
    } while (choice != 4);

    free(db->data); free(db);
    return 0;
}`,

      codeExample_en: `/* See above — same code with English prompts */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int rollNo; char name[50];
    float marks[5], total, pct; char grade;
} Student;

typedef struct { Student *data; int count, cap; } DB;

DB* createDB(){ DB*d=(DB*)malloc(sizeof(DB)); d->data=(Student*)malloc(4*sizeof(Student)); d->count=0;d->cap=4; return d; }

void calc(Student *s){s->total=0;for(int i=0;i<5;i++)s->total+=s->marks[i];s->pct=s->total/5;s->grade=s->pct>=90?'A':s->pct>=75?'B':s->pct>=60?'C':s->pct>=45?'D':'F';}

void add(DB *db){if(db->count==db->cap){db->cap*=2;db->data=(Student*)realloc(db->data,db->cap*sizeof(Student));}Student s;printf("Roll: ");scanf("%d",&s.rollNo);printf("Name: ");scanf(" %49[^\\n]",s.name);for(int i=0;i<5;i++){printf("Subject %d: ",i+1);scanf("%f",&s.marks[i]);}calc(&s);db->data[db->count++]=s;}

void display(DB *db){for(int i=0;i<db->count;i++){Student *s=&db->data[i];printf("%d %s %.1f%% %c\\n",s->rollNo,s->name,s->pct,s->grade);}}

int main(){DB *db=createDB();add(db);add(db);display(db);free(db->data);free(db);return 0;}`,

      task: {
        description: 'Month 1 Capstone — Complete Student Management System upgrade karo: (1) Search functionality add karo (binary search after sort), (2) File save/load add karo — students ko text file mein save karo aur load karo, (3) Grade distribution histogram print karo (A: ███, B: ████ etc), (4) Top 3 aur Bottom 3 students nikalo, (5) Subject-wise topper nikalo, (6) Command-line arguments support karo (argc, argv).',
        description_en: 'Month 1 Capstone — Upgrade the complete Student Management System: (1) Add search functionality (binary search after sorting), (2) Add file save/load — save students to a text file and load them back, (3) Print a grade distribution histogram (A: ███, B: ████ etc), (4) Find the top 3 and bottom 3 students, (5) Find the subject-wise topper, (6) Add command-line argument support (argc, argv).',
        hint: 'File save: FILE *f=fopen("students.txt","w"); fprintf(f,"%d %s ...",s.rollNo,s.name,...); fclose(f). Load: fscanf. Histogram: count each grade, print that many # chars. argc/argv: int main(int argc, char *argv[]).',
        hint_en: 'File save: FILE *f=fopen("students.txt","w"); fprintf(f,"%d %s ...",s.rollNo,s.name,...); fclose(f). Load: fscanf. Histogram: count each grade, print that many # chars. argc/argv: int main(int argc, char *argv[]).',
      },
      quiz: [
        {
          q: 'C mein memory management manually karna kyun important hai?',
          options: [
            'Zaruri nahi — OS handle karta hai',
            'C mein garbage collector nahi — unfreed heap memory program lifetime bhar "used" rehti hai. Memory leak, fragmentation, performance degradation. Manual control = power aur responsibility.',
            'Sirf embedded systems ke liye',
            'C automatically sab free kar deta hai',
          ],
          correct: 1,
          explanation: 'C philosophy: "trust the programmer". No GC overhead — isliye C fastest. Lekin responsibility bhi: every malloc → one free. Tools: Valgrind, AddressSanitizer, clang-tidy. Modern C patterns: RAII-like cleanup, arena allocators. Industry mein: C code 30+ saal chalti hai (Linux kernel, embedded) — memory bugs = real disasters.',
          q_en: 'Why is manually managing memory in C important?',
          options_en: [
            'Not necessary — the OS handles it',
            'C has no garbage collector — unfreed heap memory stays "used" for the program\'s lifetime. Memory leaks, fragmentation, performance degradation. Manual control = power and responsibility.',
            'Only for embedded systems',
            'C automatically frees everything',
          ],
          explanation_en: 'C philosophy: "trust the programmer". No GC overhead — that is why C is the fastest. But with great power comes great responsibility: every malloc → exactly one free. Tools: Valgrind, AddressSanitizer, clang-tidy. Modern C patterns: RAII-like cleanup, arena allocators. In industry: C code runs for 30+ years (Linux kernel, embedded) — memory bugs = real disasters.',
        },
        {
          q: 'Pointer aur array mein fundamental difference kya hai C mein?',
          options: [
            'Koi fark nahi',
            'Array: compile-time fixed size, stack mein, naam = const pointer to first element. Pointer: runtime flexible, kisi bhi memory point kar sakta hai, reassign ho sakta hai, sizeof() array vs pointer different return karta hai.',
            'Pointer sirf heap ke liye hai',
            'Array faster hai hamesha',
          ],
          correct: 1,
          explanation: 'Array: int arr[5] — stack pe 20 bytes fixed. arr ka naam = constant pointer, arr++ invalid. sizeof(arr)=20. Pointer: int *p — 4/8 bytes (pointer size). p++ valid. sizeof(p)=4/8. Dono []  notation use kar sakte: arr[i] == *(arr+i) == p[i] == *(p+i). Key difference: sizeof aur reassignability. Function parameter mein arr[] = *arr — size info lost!',
          q_en: 'What is the fundamental difference between a pointer and an array in C?',
          options_en: [
            'No difference',
            'Array: compile-time fixed size, on the stack, name = const pointer to first element. Pointer: flexible at runtime, can point to any memory, can be reassigned, sizeof() returns different values for array vs pointer.',
            'Pointers are only for the heap',
            'Arrays are always faster',
          ],
          explanation_en: 'Array: int arr[5] — fixed 20 bytes on the stack. The array name is a constant pointer, arr++ is invalid. sizeof(arr)=20. Pointer: int *p — 4/8 bytes (pointer size). p++ is valid. sizeof(p)=4/8. Both can use [] notation: arr[i] == *(arr+i) == p[i] == *(p+i). Key differences: sizeof and reassignability. In a function parameter, arr[] = *arr — size info is lost!',
        },
        {
          q: 'Month 1 complete karne ke baad C mein kya seekh liya?',
          options: [
            'Sirf Hello World',
            'Complete C foundation: syntax, variables, control flow, functions, recursion, arrays, strings, pointers, dynamic memory, function pointers — professional C code likhne ke liye ready!',
            'Sirf loops',
            'Sirf pointers',
          ],
          correct: 1,
          explanation: 'Month 1 foundation: (1) Basic syntax, I/O, data types. (2) Decision making aur loops. (3) Functions, recursion, scope. (4) Arrays, strings, processing. (5) Pointers — C ka superpower. (6) Dynamic memory — runtime flexibility. (7) Function pointers — callbacks, higher-order. Ab Month 2 mein structures, file I/O, linked lists — real-world C programming shuru!',
          q_en: 'What has been learned in C after completing Month 1?',
          options_en: [
            'Just Hello World',
            'Complete C foundation: syntax, variables, control flow, functions, recursion, arrays, strings, pointers, dynamic memory, function pointers — ready to write professional C code!',
            'Just loops',
            'Just pointers',
          ],
          explanation_en: 'Month 1 foundation: (1) Basic syntax, I/O, data types. (2) Decision making and loops. (3) Functions, recursion, scope. (4) Arrays, strings, processing. (5) Pointers — C\'s superpower. (6) Dynamic memory — runtime flexibility. (7) Function pointers — callbacks, higher-order. Now Month 2: structures, file I/O, linked lists — real-world C programming begins!',
        },
      ],
    },
  ],
};