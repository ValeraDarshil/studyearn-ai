/**
 * StudyEarn AI — C Programming Course
 * Week 3: Functions aur Recursion — Code ko Reusable Banao
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_3 = {
  week: 3,
  title: 'Functions aur Recursion — Code ko Reusable Banao',
  title_en: 'Functions and Recursion — Make Your Code Reusable',
  description: 'Functions likhna, call karna, parameters pass karna, return values, scope, aur recursion — professional C programming ki nींव!',
  description_en: 'Writing functions, calling them, passing parameters, return values, scope, and recursion — the foundation of professional C programming!',
  xpReward: 200,
  sections: [
    {
      id: 'c-w3-s1',
      title: 'Functions — Code ko Modular Banao',
      title_en: 'Functions — Make Your Code Modular',
      emoji: '🔧',
      content: `## Functions — Reusable Code Blocks!

Imagine karo: agar calculator mein addition code 10 jagah likhna pade — ek jagah bug aaya, 10 jagah fix karo! Function se: ek baar likho, kahin se bhi call karo.

### Function ka Basic Structure

\`\`\`c
// Function Declaration (prototype) — ऊपर declare karo
return_type function_name(parameter_type param1, ...);

// Function Definition — actual code
return_type function_name(parameter_type param1, ...) {
    // body
    return value;  // agar return_type void nahi hai
}

// Function Call
result = function_name(argument1, ...);
\`\`\`

### Pehla Function

\`\`\`c
#include <stdio.h>

// ── Function declarations (prototypes) — main() se pehle ──
int add(int a, int b);
float average(float arr[], int n);
void printLine(char ch, int count);
int isEven(int n);

int main() {
    int sum = add(10, 20);
    printf("Sum: %d\\n", sum);  // 30

    printLine('-', 20);
    printf("Is 4 even? %s\\n", isEven(4) ? "Yes" : "No");

    return 0;
}

// ── Function Definitions ──
int add(int a, int b) {
    return a + b;
}

// void = kuch return nahi
void printLine(char ch, int count) {
    for (int i = 0; i < count; i++) printf("%c", ch);
    printf("\\n");
}

int isEven(int n) {
    return n % 2 == 0;  // 1 (true) ya 0 (false)
}
\`\`\`

### Return Types — Kya Return Hoga?

\`\`\`c
// int return karo
int square(int n) {
    return n * n;
}

// float return karo
float celsiusToFahrenheit(float c) {
    return (c * 9.0 / 5.0) + 32;
}

// Multiple return points — early return
int absoluteValue(int n) {
    if (n < 0) return -n;  // negative → positive
    return n;              // already positive
}

// void — kuch return nahi
void greet(char name[]) {
    printf("Hello, %s!\\n", name);
    // no return needed (or just 'return;')
}

// char return
char getGrade(int marks) {
    if (marks >= 90) return 'A';
    if (marks >= 75) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 45) return 'D';
    return 'F';
}
\`\`\`

### Pass by Value — C ka Default

\`\`\`c
// C mein function ko value ki COPY milti hai — original change nahi hoti!
void tryToChange(int x) {
    x = 100;  // sirf local copy change hoti hai
    printf("Inside function: x = %d\\n", x);  // 100
}

int main() {
    int num = 5;
    tryToChange(num);
    printf("After function: num = %d\\n", num);  // 5 — unchanged!
    return 0;
}
// Pass by reference ke liye pointers use karte hain (Week 5 mein)
\`\`\`

### Function Overloading — C mein NAHI hai!

\`\`\`c
// ❌ C mein function overloading nahi hoti (C++ mein hoti hai)
// Alag naam use karo
int    addInt(int a, int b)       { return a + b; }
float  addFloat(float a, float b) { return a + b; }
double addDouble(double a, double b) { return a + b; }

// Ya generic approach: _Generic (C11)
#define add(a, b) _Generic((a), \\
    int:    addInt,           \\
    float:  addFloat,         \\
    double: addDouble         \\
)(a, b)
\`\`\`

### Scope — Variable Kahan Visible Hai?

\`\`\`c
int globalVar = 100;   // Global — poore program mein visible

void func1() {
    int localVar = 10;  // Local — sirf func1 mein
    globalVar = 200;    // Global change kar sakte hain
    printf("%d %d\\n", globalVar, localVar);
}

void func2() {
    // localVar yahan accessible NAHI
    printf("%d\\n", globalVar);  // global = accessible
}

int main() {
    {
        int blockVar = 5;  // Block scope — sirf {} ke andar
        printf("%d\\n", blockVar);
    }
    // blockVar yahan accessible NAHI — compile error!

    for (int i = 0; i < 3; i++) {
        // i sirf loop ke andar
    }
    // i yahan accessible NAHI (C99+)

    return 0;
}
\`\`\`

### Static Variables — Value Yaad Rahti Hai

\`\`\`c
void counter() {
    static int count = 0;  // sirf pehli baar initialize hota hai!
    count++;
    printf("Called %d times\\n", count);
}

int main() {
    counter();  // Called 1 times
    counter();  // Called 2 times
    counter();  // Called 3 times
    return 0;
}
// Static variable function calls ke beech value retain karta hai
\`\`\``,

      content_en: `## Functions — Reusable Code Blocks!

### Basic Structure

\`\`\`c
return_type function_name(type param1, type param2) {
    // body
    return value;
}

int add(int a, int b)           { return a + b; }
float celsiusToF(float c)       { return (c*9.0/5.0)+32; }
void greet(char name[])         { printf("Hello, %s!\\n", name); }
char getGrade(int marks) {
    if (marks >= 90) return 'A';
    if (marks >= 75) return 'B';
    if (marks >= 60) return 'C';
    return 'F';
}
\`\`\`

### Pass by Value

\`\`\`c
void tryToChange(int x) { x = 100; }  // only copy changes!

int main() {
    int num = 5;
    tryToChange(num);
    printf("%d\\n", num);  // still 5 — original unchanged
}
// Use pointers for pass-by-reference (Week 5)
\`\`\`

### Scope

\`\`\`c
int global = 100;       // whole program

void func() {
    int local = 10;     // only inside func
    {
        int block = 5;  // only inside {}
    }
    // block not accessible here
}
\`\`\`

### Static Variables

\`\`\`c
void counter() {
    static int count = 0;  // initialised only once, retains value
    printf("Called %d times\\n", ++count);
}
// counter() → 1, counter() → 2, counter() → 3
\`\`\``,

      codeExample: `#include <stdio.h>
#include <math.h>

// ── Prototypes ──
int    factorial(int n);
int    isPrime(int n);
float  circleArea(float r);
float  triangleArea(float base, float height);
void   printBox(char *title, char *content);
int    max3(int a, int b, int c);
float  power(float base, int exp);

int main() {
    // ── Math Functions demo ──
    printf("=== Math Functions ===\\n");
    for (int i = 0; i <= 7; i++) {
        printf("%d! = %d\\n", i, factorial(i));
    }

    printf("\\n=== Prime Check ===\\n");
    for (int i = 1; i <= 20; i++) {
        if (isPrime(i)) printf("%d ", i);
    }
    printf("\\n");

    // ── Geometry ──
    printf("\\n=== Geometry ===\\n");
    float r = 7.0f;
    printf("Circle (r=%.1f): Area = %.2f\\n", r, circleArea(r));
    printf("Triangle (b=6,h=4): Area = %.2f\\n", triangleArea(6, 4));

    // ── Max of 3 ──
    printf("\\n=== Max of Three ===\\n");
    printf("max(10, 35, 22) = %d\\n", max3(10, 35, 22));
    printf("max(99, 1, 50)  = %d\\n", max3(99, 1, 50));

    // ── Power function ──
    printf("\\n=== Power ===\\n");
    printf("2^10 = %.0f\\n", power(2, 10));
    printf("3^5  = %.0f\\n", power(3, 5));

    return 0;
}

int factorial(int n) {
    if (n < 0) return -1;  // invalid
    if (n <= 1) return 1;
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

float circleArea(float r) {
    return 3.14159f * r * r;
}

float triangleArea(float base, float height) {
    return 0.5f * base * height;
}

int max3(int a, int b, int c) {
    int m = (a > b) ? a : b;
    return (m > c) ? m : c;
}

float power(float base, int exp) {
    float result = 1.0f;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}`,

      codeExample_en: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    int r = 1;
    for (int i = 2; i <= n; i++) r *= i;
    return r;
}
int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i*i <= n; i++) if (n%i==0) return 0;
    return 1;
}
float circleArea(float r) { return 3.14159f * r * r; }
int max3(int a, int b, int c) { int m=a>b?a:b; return m>c?m:c; }

int main() {
    for (int i=0; i<=7; i++) printf("%d! = %d\\n", i, factorial(i));

    printf("Primes: ");
    for (int i=2; i<=30; i++) if(isPrime(i)) printf("%d ", i);
    printf("\\n");

    printf("Circle r=7: %.2f\\n", circleArea(7));
    printf("max(10,35,22) = %d\\n", max3(10,35,22));
    return 0;
}`,

      task: {
        description: 'Functions practice karo: (1) Temperature converter function set banao — celsiusToFahrenheit(float c), fahrenheitToCelsius(float f), celsiusToKelvin(float c). Main mein user se temp aur unit lo, teeno mein convert karke print karo. (2) String utility functions banao — countVowels(char s[]), countWords(char s[]), reverseString(char s[]). (3) "Bank Account" functions — deposit(float balance, float amount), withdraw(float balance, float amount), getInterest(float balance, float rate, int years).',
        description_en: 'Practise functions: (1) Build a temperature converter set — celsiusToFahrenheit(float c), fahrenheitToCelsius(float f), celsiusToKelvin(float c). In main, take a temp and unit, convert to all three and print. (2) Build string utility functions — countVowels(char s[]), countWords(char s[]), reverseString(char s[]). (3) "Bank Account" functions — deposit(float balance, float amount), withdraw(float balance, float amount), getInterest(float balance, float rate, int years).',
        hint: 'Vowels: check if char == \'a\'||\'e\'||\'i\'||\'o\'||\'u\' (lowercase and uppercase). Words: count spaces + 1. Reverse string: swap chars from both ends using a loop. Bank: withdraw mein check karo balance >= amount.',
        hint_en: 'Vowels: check if char == \'a\'||\'e\'||\'i\'||\'o\'||\'u\' (lowercase and uppercase). Words: count spaces + 1. Reverse string: swap chars from both ends using a loop. Bank: in withdraw, check balance >= amount.',
      },
      quiz: [
        {
          q: 'C mein function prototype kya hota hai aur kyun zaroori hai?',
          options: [
            'Function ka doosra naam',
            'Function ka advance declaration — return type, naam, aur parameters ka. Compiler ko pehle se pata hota hai function ke baare mein. Bina prototype ke, agar function main() ke baad define ho toh compile error ya warning aata hai.',
            'Function ka comment',
            'Header file ka naam',
          ],
          correct: 1,
          explanation: 'Prototype: int add(int a, int b); — sirf signature, no body. C compiler top-to-bottom padhta hai. Agar main() mein add() call karo aur definition neeche hai, compiler confuse hoga — implicit int assume karega (dangerous!). Prototype se compiler pehle se jaanta hai. Best practice: sab prototypes file ke top pe likhon.',
          q_en: 'What is a function prototype in C and why is it necessary?',
          options_en: [
            'Another name for the function',
            'An advance declaration — return type, name, and parameters. The compiler knows about the function in advance. Without a prototype, if the function is defined after main(), you get a compile error or warning.',
            'A comment for the function',
            'The name of the header file',
          ],
          explanation_en: 'Prototype: int add(int a, int b); — just the signature, no body. The C compiler reads top-to-bottom. If you call add() in main() but the definition is below, the compiler gets confused — it assumes implicit int (dangerous!). A prototype tells the compiler in advance. Best practice: write all prototypes at the top of the file.',
        },
        {
          q: 'Pass by value mein kya hota hai?',
          options: [
            'Original variable directly function ko milti hai',
            'Function ko variable ki COPY milti hai — function ke andar change hone se original unaffected rehti hai',
            'Function original variable change kar sakta hai',
            'C mein pass by value nahi hota',
          ],
          correct: 1,
          explanation: 'Pass by value: function ko argument ki copy milti hai. int swap(int a, int b) — a aur b original variables ki copies hain. Function ke andar kuch bhi karo — caller ka original unchanged. Original change karne ke liye pointers (pass by reference) chahiye: void swap(int *a, int *b). Yeh Week 5 mein cover hoga.',
          q_en: 'What happens with pass by value?',
          options_en: [
            'The original variable is passed directly to the function',
            'The function receives a COPY of the variable — changes inside the function do not affect the original',
            'The function can change the original variable',
            'C does not have pass by value',
          ],
          explanation_en: 'Pass by value: the function receives a copy of the argument. int swap(int a, int b) — a and b are copies of the original variables. Whatever you do inside the function, the caller\'s originals are unchanged. To change the originals, you need pointers (pass by reference): void swap(int *a, int *b). This is covered in Week 5.',
        },
        {
          q: 'static local variable aur normal local variable mein kya fark hai?',
          options: [
            'Koi fark nahi',
            'Normal local: har function call pe new memory allocate, value reset. Static local: memory persist karti hai — value next call pe bhi yaad rehti hai. Sirf ek baar initialize hoti hai.',
            'Static global scope mein hoti hai',
            'Static variable faster hoti hai',
          ],
          correct: 1,
          explanation: 'Normal local var: stack pe allocate, function return pe destroy. Static local var: static storage mein (like global), lekin scope local — sirf function ke andar accessible. Ek baar initialize, lifetime = program ka lifetime. Use: function call count karna, cache results, state maintain karna.',
          q_en: 'What is the difference between a static local variable and a normal local variable?',
          options_en: [
            'No difference',
            'Normal local: new memory allocated on each call, value reset. Static local: memory persists — value is remembered across calls. Initialised only once.',
            'Static variables have global scope',
            'Static variables are faster',
          ],
          explanation_en: 'Normal local: allocated on the stack, destroyed when the function returns. Static local: stored in static storage (like a global), but scope is local — only accessible inside the function. Initialised once, lifetime = the program\'s lifetime. Uses: counting function calls, caching results, maintaining state.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w3-s2',
      title: 'Recursion — Function Khud ko Call Kare!',
      title_en: 'Recursion — A Function That Calls Itself!',
      emoji: '🌀',
      content: `## Recursion — Magic of Self-Calling Functions!

Recursion = function jo khud ko call kare. Bahut powerful technique hai — kuch problems iterative se zyada elegant solve hoti hain recursion se.

### Recursion ke 2 Must-Have Parts

\`\`\`c
// 1. Base Case    — recursion stop karne ki condition (ZARURI!)
// 2. Recursive Case — problem ko chhota karke khud ko call karo

int factorial(int n) {
    // Base case — stop condition
    if (n <= 1) return 1;

    // Recursive case — problem chhoti karo
    return n * factorial(n - 1);
}

// factorial(4) kaise kaam karta hai:
// factorial(4) = 4 * factorial(3)
//              = 4 * 3 * factorial(2)
//              = 4 * 3 * 2 * factorial(1)
//              = 4 * 3 * 2 * 1
//              = 24
\`\`\`

### Classic Recursion Examples

\`\`\`c
// ── 1. Fibonacci ──
int fibonacci(int n) {
    if (n <= 0) return 0;   // base case 1
    if (n == 1) return 1;   // base case 2
    return fibonacci(n-1) + fibonacci(n-2);
}
// fib(5) = fib(4) + fib(3)
//        = (fib(3)+fib(2)) + (fib(2)+fib(1))
//        = 5

// ── 2. Sum of Natural Numbers ──
int sumN(int n) {
    if (n <= 0) return 0;
    return n + sumN(n - 1);
}
// sumN(5) = 5 + 4 + 3 + 2 + 1 + 0 = 15

// ── 3. Power ──
double power(double base, int exp) {
    if (exp == 0) return 1;      // base case: anything^0 = 1
    if (exp < 0) return 1.0 / power(base, -exp);  // negative exponent
    return base * power(base, exp - 1);
}
// power(2, 4) = 2 * power(2,3) = 2*2*2*2*1 = 16

// ── 4. GCD — Euclidean (elegant!) ──
int gcd(int a, int b) {
    if (b == 0) return a;  // base case
    return gcd(b, a % b);  // recursive: gcd(18,12) → gcd(12,6) → gcd(6,0) → 6
}

// ── 5. Binary Search ──
int binarySearch(int arr[], int low, int high, int target) {
    if (low > high) return -1;  // base case: not found

    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;        // found!
    if (arr[mid] > target)  return binarySearch(arr, low, mid-1, target);
    return binarySearch(arr, mid+1, high, target);
}
\`\`\`

### Tower of Hanoi — Recursion ka Classic Problem

\`\`\`c
// n disks ko A se C pe move karo, B helper hai
// Rule: bada disk chhote pe nahi aayega
void hanoi(int n, char from, char to, char helper) {
    if (n == 1) {
        printf("Move disk 1: %c → %c\\n", from, to);
        return;
    }
    hanoi(n-1, from, helper, to);   // n-1 disks A se B pe
    printf("Move disk %d: %c → %c\\n", n, from, to);
    hanoi(n-1, helper, to, from);   // n-1 disks B se C pe
}

// hanoi(3, 'A', 'C', 'B') output:
// Move disk 1: A → C
// Move disk 2: A → B
// Move disk 1: C → B
// Move disk 3: A → C
// Move disk 1: B → A
// Move disk 2: B → C
// Move disk 1: A → C
\`\`\`

### Recursion vs Iteration — Kab Kya Use Karein?

\`\`\`c
// Factorial — Iteration (usually better for simple cases)
int factIter(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

// Factorial — Recursion (cleaner for some, but function call overhead)
int factRecur(int n) {
    return (n <= 1) ? 1 : n * factRecur(n-1);
}

// Tree traversal, divide and conquer → Recursion natural
// Simple loops, performance critical → Iteration better

/*
Recursion ke drawbacks:
1. Function call overhead (stack frame har call pe)
2. Stack overflow — too deep recursion
3. Fibonacci naive recursion: O(2^n) — very slow!
   fib(40) = 102334155 function calls!
*/
\`\`\`

### Memoization — Recursion ko Fast Banao

\`\`\`c
// Naive fibonacci: O(2^n) — SLOW
// Memoized fibonacci: O(n) — FAST

#define MAX 100
int memo[MAX];  // -1 = not computed yet

int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];  // already computed!
    memo[n] = fibMemo(n-1) + fibMemo(n-2);
    return memo[n];
}

// Initialize:
// for(int i = 0; i < MAX; i++) memo[i] = -1;
\`\`\``,

      content_en: `## Recursion — Magic of Self-Calling Functions!

### Two Required Parts

\`\`\`c
int factorial(int n) {
    if (n <= 1) return 1;              // Base case — stop here
    return n * factorial(n - 1);       // Recursive case
}
// factorial(4): 4 * 3 * 2 * 1 = 24
\`\`\`

### Classic Examples

\`\`\`c
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n-1) + fibonacci(n-2);
}

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

int binarySearch(int arr[], int lo, int hi, int t) {
    if (lo > hi) return -1;
    int mid = (lo+hi)/2;
    if (arr[mid] == t)   return mid;
    if (arr[mid] > t)    return binarySearch(arr, lo, mid-1, t);
    return binarySearch(arr, mid+1, hi, t);
}
\`\`\`

### Tower of Hanoi

\`\`\`c
void hanoi(int n, char from, char to, char via) {
    if (n == 1) { printf("Disk 1: %c→%c\\n", from, to); return; }
    hanoi(n-1, from, via, to);
    printf("Disk %d: %c→%c\\n", n, from, to);
    hanoi(n-1, via, to, from);
}
\`\`\`

### Memoization — Speed up Recursion

\`\`\`c
int memo[100];
int fibFast(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibFast(n-1) + fibFast(n-2);
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <string.h>

// Memoization for fibonacci
int memo[50];

void initMemo() {
    for (int i = 0; i < 50; i++) memo[i] = -1;
}

int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibMemo(n-1) + fibMemo(n-2);
    return memo[n];
}

// Palindrome check (recursive)
int isPalindrome(char s[], int start, int end) {
    if (start >= end) return 1;         // base case
    if (s[start] != s[end]) return 0;   // mismatch
    return isPalindrome(s, start+1, end-1);
}

// Sum of digits (recursive)
int sumDigits(int n) {
    if (n == 0) return 0;
    return (n % 10) + sumDigits(n / 10);
}

// Count occurrences of char in string
int countChar(char s[], char c, int idx) {
    if (s[idx] == '\\0') return 0;
    return (s[idx] == c) + countChar(s, c, idx+1);
}

// Tower of Hanoi with move counter
int moveCount = 0;
void hanoi(int n, char from, char to, char via) {
    if (n == 1) {
        printf("  Move disk 1: %c → %c\\n", from, to);
        moveCount++;
        return;
    }
    hanoi(n-1, from, via, to);
    printf("  Move disk %d: %c → %c\\n", n, from, to);
    moveCount++;
    hanoi(n-1, via, to, from);
}

int main() {
    // ── Fibonacci with memoization ──
    printf("=== Fibonacci (Memoized) ===\\n");
    initMemo();
    for (int i = 0; i <= 15; i++)
        printf("fib(%2d) = %d\\n", i, fibMemo(i));

    // ── Palindrome ──
    printf("\\n=== Palindrome Check ===\\n");
    char words[][20] = {"madam", "racecar", "hello", "level", "world"};
    for (int i = 0; i < 5; i++) {
        int len = strlen(words[i]);
        printf("'%s' — %s\\n", words[i],
            isPalindrome(words[i], 0, len-1) ? "Palindrome ✅" : "Not palindrome ❌");
    }

    // ── Sum of digits ──
    printf("\\n=== Sum of Digits ===\\n");
    int nums[] = {12345, 9999, 100, 87654};
    for (int i = 0; i < 4; i++)
        printf("sumDigits(%d) = %d\\n", nums[i], sumDigits(nums[i]));

    // ── Tower of Hanoi ──
    printf("\\n=== Tower of Hanoi (3 disks) ===\\n");
    moveCount = 0;
    hanoi(3, 'A', 'C', 'B');
    printf("Total moves: %d (formula: 2^n - 1 = %d)\\n", moveCount, (1<<3)-1);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>

int memo[50];
void initMemo() { for(int i=0;i<50;i++) memo[i]=-1; }
int fibFast(int n) {
    if(n<=1) return n;
    if(memo[n]!=-1) return memo[n];
    return memo[n]=fibFast(n-1)+fibFast(n-2);
}

int isPalindrome(char s[], int lo, int hi) {
    if(lo>=hi) return 1;
    return s[lo]==s[hi] && isPalindrome(s,lo+1,hi-1);
}

int sumDigits(int n) { return n==0 ? 0 : n%10+sumDigits(n/10); }

void hanoi(int n, char f, char t, char v) {
    if(n==1){printf("Disk 1: %c→%c\\n",f,t);return;}
    hanoi(n-1,f,v,t);
    printf("Disk %d: %c→%c\\n",n,f,t);
    hanoi(n-1,v,t,f);
}

int main() {
    initMemo();
    printf("Fibonacci: ");
    for(int i=0;i<=10;i++) printf("%d ",fibFast(i));
    printf("\\n");

    char w[]="racecar";
    printf("'%s': %s\\n",w,isPalindrome(w,0,strlen(w)-1)?"Palindrome":"Not");

    printf("sumDigits(12345) = %d\\n", sumDigits(12345));

    printf("\\nHanoi(3):\\n");
    hanoi(3,'A','C','B');
    return 0;
}`,

      task: {
        description: 'Recursion practice: (1) "Digital Root" — jab tak single digit na mile, digits ka sum lete raho (e.g. 9875 → 9+8+7+5=29 → 2+9=11 → 1+1=2). (2) "String Reverse" recursive function banao. (3) "Count Substring" — ek string mein dusra string kitni baar aata hai, recursion se nikalo. (4) "Flatten Number" — nested recursion se 2D pattern (Pascal triangle) print karo. (5) "Power Set" — n elements ke saare subsets print karo (2^n subsets).',
        description_en: 'Practise recursion: (1) "Digital Root" — keep summing digits until a single digit remains (e.g. 9875 → 29 → 11 → 2). (2) Build a recursive string reverse function. (3) "Count Substring" — find how many times a string appears in another, using recursion. (4) Print Pascal triangle using nested recursion. (5) "Power Set" — print all subsets of n elements (2^n subsets).',
        hint: 'Digital root: if(n<10) return n; return digitalRoot(sumDigits(n)). String reverse: swap first and last, then recurse on middle. Memoize fibonacci for comparison of speeds.',
        hint_en: 'Digital root: if(n<10) return n; return digitalRoot(sumDigits(n)). String reverse: swap first and last, then recurse on the middle. Memoize fibonacci and compare speeds.',
      },
      quiz: [
        {
          q: 'Recursion mein base case kyun zaruri hai?',
          options: [
            'Sirf style ke liye',
            'Base case na ho toh function infinite times call hoga — stack overflow aayega. Stack limited memory hai — har function call ek frame push karta hai.',
            'Compiler require karta hai',
            'Performance ke liye',
          ],
          correct: 1,
          explanation: 'Base case = recursion ka exit point. Bina base case ke: factorial(-1) calls factorial(-2) calls factorial(-3)... infinite! Stack = limited memory (usually ~1-8MB). Har recursive call ek stack frame push karta hai (local vars, return address). Stack full → Stack Overflow crash. Rule: hamesha recursion ko chhoti problem ki taraf move karo aur base case ensure karo.',
          q_en: 'Why is a base case essential in recursion?',
          options_en: [
            'Just for style',
            'Without a base case the function calls itself infinitely — causing a stack overflow. The stack is limited memory; every function call pushes a frame onto it.',
            'The compiler requires it',
            'For performance',
          ],
          explanation_en: 'Base case = the exit point of recursion. Without one: factorial(-1) calls factorial(-2) calls factorial(-3)... infinitely! The stack is limited memory (usually ~1-8 MB). Every recursive call pushes a stack frame (local vars, return address). Stack full → stack overflow crash. Rule: always move towards a smaller problem and ensure the base case is reachable.',
        },
        {
          q: 'Memoization recursion mein kya karta hai?',
          options: [
            'Recursion ko iterative mein convert karta hai',
            'Pehle computed results cache karta hai — agar same input dobara aaye toh recalculate nahi karta. Fibonacci O(2^n) → O(n) ho jaata hai.',
            'Memory free karta hai',
            'Stack overflow prevent karta hai',
          ],
          correct: 1,
          explanation: 'Memoization = "remember what you computed". Naive fib(40) = ~2 billion calls! With memo: each fib(n) sirf ek baar compute hota hai — result array mein store. Next time same n aaye → array se return. Time: O(2^n) → O(n). Space: O(n) extra. Dynamic Programming ka foundation hai yeh.',
          q_en: 'What does memoization do in recursion?',
          options_en: [
            'Converts recursion to iteration',
            'Caches previously computed results — if the same input comes again, it does not recompute. Fibonacci goes from O(2^n) to O(n).',
            'Frees memory',
            'Prevents stack overflow',
          ],
          explanation_en: 'Memoization = "remember what you computed". Naive fib(40) ≈ 2 billion calls! With memoisation: each fib(n) is computed only once — the result is stored in an array. Next time the same n appears → return from array. Time: O(2^n) → O(n). Space: O(n) extra. This is the foundation of Dynamic Programming.',
        },
        {
          q: 'Tower of Hanoi n disks ke liye minimum kitne moves chahiye?',
          options: [
            'n moves', 'n² moves',
            '2^n - 1 moves — yeh mathematically proven minimum hai',
            'n! moves',
          ],
          correct: 2,
          explanation: 'Tower of Hanoi: minimum moves = 2^n - 1. n=1: 1 move. n=2: 3 moves. n=3: 7 moves. n=10: 1023 moves. n=64: 18,446,744,073,709,551,615 moves (light speed pe bhi billions of years!). Recursion se proven: T(n) = 2*T(n-1) + 1, T(1) = 1. Solve karo: T(n) = 2^n - 1.',
          q_en: 'What is the minimum number of moves needed for Tower of Hanoi with n disks?',
          options_en: [
            'n moves', 'n² moves',
            '2^n - 1 moves — this is the mathematically proven minimum',
            'n! moves',
          ],
          explanation_en: 'Tower of Hanoi: minimum moves = 2^n - 1. n=1: 1 move. n=2: 3 moves. n=3: 7 moves. n=10: 1023 moves. n=64: 18,446,744,073,709,551,615 moves (would take billions of years even at the speed of light!). Proven by recursion: T(n) = 2*T(n-1) + 1, T(1) = 1. Solving: T(n) = 2^n - 1.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w3-s3',
      title: 'Arrays — Ek Saath Bahut Sara Data Store Karo',
      title_en: 'Arrays — Store Large Amounts of Data at Once',
      emoji: '📊',
      content: `## Arrays — Same Type ka Collection!

100 students ke marks store karne hain? 100 variables? NO! 1 array = done.

### 1D Arrays — Basic

\`\`\`c
// Declaration
int marks[5];              // 5 integers (garbage values initially!)
float prices[10];          // 10 floats
char vowels[5];            // 5 characters

// Declaration + Initialization
int scores[5] = {85, 92, 78, 96, 88};
float pi_digits[] = {3, 1, 4, 1, 5};  // size auto-calculated = 5
int zeros[10] = {0};    // sab 0 ho jaayenge (first 0, rest auto 0)
int all5[5] = {5,5,5,5,5};

// Access — 0-indexed!
printf("%d\\n", scores[0]);  // 85 (first)
printf("%d\\n", scores[4]);  // 88 (last)
printf("%d\\n", scores[5]);  // ❌ UNDEFINED BEHAVIOR! out of bounds

// Modify
scores[2] = 100;
\`\`\`

### Array Traversal — Loop se Karo

\`\`\`c
int arr[] = {10, 20, 30, 40, 50};
int n = 5;  // ya sizeof(arr)/sizeof(arr[0])

// Forward
for (int i = 0; i < n; i++) {
    printf("arr[%d] = %d\\n", i, arr[i]);
}

// Backward
for (int i = n-1; i >= 0; i--) {
    printf("%d ", arr[i]);  // 50 40 30 20 10
}

// ✅ Safer — compute size
int size = sizeof(arr) / sizeof(arr[0]);  // = 5
for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
}
\`\`\`

### Array Operations

\`\`\`c
int arr[] = {64, 34, 25, 12, 22, 11, 90};
int n = sizeof(arr)/sizeof(arr[0]);

// ── Sum aur Average ──
int sum = 0;
for (int i = 0; i < n; i++) sum += arr[i];
float avg = (float)sum / n;

// ── Min aur Max ──
int min = arr[0], max = arr[0];
for (int i = 1; i < n; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
}

// ── Linear Search ──
int target = 25, found = -1;
for (int i = 0; i < n; i++) {
    if (arr[i] == target) { found = i; break; }
}
printf(found != -1 ? "Found at %d\\n" : "Not found\\n", found);

// ── Reverse Array ──
for (int i = 0; i < n/2; i++) {
    int temp  = arr[i];
    arr[i]    = arr[n-1-i];
    arr[n-1-i] = temp;
}

// ── Bubble Sort ──
for (int i = 0; i < n-1; i++) {
    for (int j = 0; j < n-i-1; j++) {
        if (arr[j] > arr[j+1]) {
            int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
        }
    }
}
\`\`\`

### 2D Arrays — Matrix!

\`\`\`c
// Declaration
int matrix[3][4];  // 3 rows, 4 columns

// Declaration + Init
int grid[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Access
printf("%d\\n", grid[1][2]);  // 6 (row 1, col 2)

// Traverse 2D array
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        printf("%d ", grid[i][j]);
    }
    printf("\\n");
}

// Matrix Addition
int A[2][2] = {{1,2},{3,4}};
int B[2][2] = {{5,6},{7,8}};
int C[2][2];

for (int i = 0; i < 2; i++)
    for (int j = 0; j < 2; j++)
        C[i][j] = A[i][j] + B[i][j];

// Matrix Multiplication
int result[2][2] = {{0,0},{0,0}};
for (int i = 0; i < 2; i++)
    for (int j = 0; j < 2; j++)
        for (int k = 0; k < 2; k++)
            result[i][j] += A[i][k] * B[k][j];
\`\`\`

### Arrays aur Functions

\`\`\`c
// Array function ko pass karte waqt — pointer as argument!
// (Arrays automatically decay to pointer)
void printArray(int arr[], int n) {  // int arr[] = int *arr same!
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int findMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max) max = arr[i];
    return max;
}

// IMPORTANT: Arrays pass by reference hote hain!
void doubleAll(int arr[], int n) {
    for (int i = 0; i < n; i++) arr[i] *= 2;  // ORIGINAL change hoga!
}

int main() {
    int nums[] = {3, 1, 4, 1, 5, 9, 2};
    int n = sizeof(nums)/sizeof(nums[0]);

    printArray(nums, n);           // 3 1 4 1 5 9 2
    printf("Max: %d\\n", findMax(nums, n));  // 9
    doubleAll(nums, n);
    printArray(nums, n);           // 6 2 8 2 10 18 4 (CHANGED!)
}
\`\`\``,

      content_en: `## Arrays — Store Large Amounts of Data at Once!

### 1D Arrays

\`\`\`c
int scores[5] = {85, 92, 78, 96, 88};
float prices[] = {9.99, 14.5, 3.0};  // size auto-calculated
int zeros[10] = {0};                  // all zeros

scores[0]; // 85 (first)    scores[4]; // 88 (last)
scores[5]; // ❌ UNDEFINED BEHAVIOR!

int size = sizeof(arr) / sizeof(arr[0]);  // safe size
\`\`\`

### Array Operations

\`\`\`c
// Sum, max, min, linear search, reverse, bubble sort
int sum=0; for(int i=0;i<n;i++) sum+=arr[i];
int max=arr[0]; for(int i=1;i<n;i++) if(arr[i]>max) max=arr[i];

// Reverse
for(int i=0;i<n/2;i++) { int t=arr[i];arr[i]=arr[n-1-i];arr[n-1-i]=t; }
\`\`\`

### 2D Arrays (Matrix)

\`\`\`c
int grid[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
grid[1][2]; // 6

for(int i=0;i<3;i++) {
    for(int j=0;j<3;j++) printf("%d ",grid[i][j]);
    printf("\\n");
}
\`\`\`

### Arrays and Functions

\`\`\`c
// Arrays pass by reference automatically!
void doubleAll(int arr[], int n) {
    for(int i=0;i<n;i++) arr[i]*=2;  // changes ORIGINAL
}
\`\`\``,

      codeExample: `#include <stdio.h>

void printArray(int arr[], int n, char *label) {
    printf("%s: [", label);
    for (int i = 0; i < n; i++)
        printf(i < n-1 ? "%d, " : "%d", arr[i]);
    printf("]\\n");
}

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
            }
}

int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n-1;
    while (lo <= hi) {
        int mid = (lo+hi)/2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target)  lo = mid+1;
        else                    hi = mid-1;
    }
    return -1;
}

// Matrix multiply
void matMul(int A[][3], int B[][3], int C[][3], int n) {
    for (int i=0;i<n;i++) for (int j=0;j<n;j++) {
        C[i][j] = 0;
        for (int k=0;k<n;k++) C[i][j] += A[i][k]*B[k][j];
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90, 45};
    int n = sizeof(arr)/sizeof(arr[0]);

    printArray(arr, n, "Original");
    bubbleSort(arr, n);
    printArray(arr, n, "Sorted ");

    int target = 45;
    int idx = binarySearch(arr, n, target);
    printf("Binary search %d: index %d\\n", target, idx);

    // Stats
    int sum=0, min=arr[0], max=arr[0];
    for (int i=0;i<n;i++) {
        sum += arr[i];
        if(arr[i]<min) min=arr[i];
        if(arr[i]>max) max=arr[i];
    }
    printf("Sum=%d  Avg=%.1f  Min=%d  Max=%d\\n",
           sum, (float)sum/n, min, max);

    // 2D Matrix
    printf("\\n=== Matrix Multiply ===\\n");
    int A[3][3]={{1,2,3},{4,5,6},{7,8,9}};
    int B[3][3]={{9,8,7},{6,5,4},{3,2,1}};
    int C[3][3]={{0}};
    matMul(A,B,C,3);
    printf("A * B =\\n");
    for(int i=0;i<3;i++){
        for(int j=0;j<3;j++) printf("%4d", C[i][j]);
        printf("\\n");
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>

void bubbleSort(int a[], int n) {
    for(int i=0;i<n-1;i++)
        for(int j=0;j<n-i-1;j++)
            if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;}
}

int binarySearch(int a[], int n, int t) {
    int lo=0,hi=n-1;
    while(lo<=hi){int m=(lo+hi)/2;if(a[m]==t)return m;if(a[m]<t)lo=m+1;else hi=m-1;}
    return -1;
}

int main() {
    int arr[]={64,34,25,12,22,11,90,45};
    int n=sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr,n);
    printf("Sorted: ");
    for(int i=0;i<n;i++) printf("%d ",arr[i]);
    printf("\\nSearch 45: index %d\\n", binarySearch(arr,n,45));
    return 0;
}`,

      task: {
        description: 'Arrays deep practice: (1) Implement Selection Sort aur Insertion Sort — dono ka code likho aur compare karo. (2) "2D Tic-Tac-Toe" — 3x3 array mein game banao, X aur O alternate karein, win check karo (rows, columns, diagonals). (3) "Student Grade Manager" — 30 students ke marks store karo, average, highest, lowest, grade distribution nikalo. (4) "Spiral Matrix" — n×n matrix ko spiral order mein fill karo aur print karo.',
        description_en: 'Deep array practice: (1) Implement Selection Sort and Insertion Sort — write both and compare. (2) "2D Tic-Tac-Toe" — build the game in a 3x3 array, X and O alternate, check for wins (rows, columns, diagonals). (3) "Student Grade Manager" — store marks for 30 students, find average, highest, lowest, and grade distribution. (4) "Spiral Matrix" — fill an n×n matrix in spiral order and print it.',
        hint: 'Selection sort: find minimum in remaining, swap to front. Insertion sort: pick element, insert in correct position in sorted part. Tic-Tac-Toe win: check all 3 rows, 3 cols, 2 diagonals. Spiral: use 4 boundaries (top, bottom, left, right) and shrink.',
        hint_en: 'Selection sort: find minimum in remaining, swap to front. Insertion sort: pick element, insert in correct position in the sorted part. Tic-Tac-Toe win: check all 3 rows, 3 cols, 2 diagonals. Spiral: use 4 boundaries (top, bottom, left, right) and shrink them.',
      },
      quiz: [
        {
          q: 'C mein array out-of-bounds access kya hota hai aur kyun dangerous hai?',
          options: [
            'Compiler error deta hai',
            'C mein koi bounds checking nahi — arr[10] ek 5-element array mein silently kisi aur memory ko read/write karega. Undefined behavior, crash, security vulnerability!',
            'Default value return karta hai',
            'Warning deta hai',
          ],
          correct: 1,
          explanation: 'C mein arrays ke baare mein "trust the programmer" philosophy hai — no automatic bounds checking. arr[5] ek 5-element array pe: stack/heap ki kisi aur variable ki memory access karega. Result: garbage value padh sakte ho, dusri variable overwrite ho sakti hai, program crash ho sakta hai. Real security exploits (buffer overflow attacks) isi se hote hain! Always: size track karo, bounds check karo.',
          q_en: 'What is array out-of-bounds access in C and why is it dangerous?',
          options_en: [
            'The compiler gives an error',
            'C has no bounds checking — arr[10] on a 5-element array silently reads/writes some other memory. Undefined behaviour, crash, security vulnerability!',
            'Returns a default value',
            'Gives a warning',
          ],
          explanation_en: 'C follows a "trust the programmer" philosophy for arrays — no automatic bounds checking. arr[5] on a 5-element array: it accesses memory belonging to some other variable on the stack/heap. Result: you might read garbage, overwrite another variable, or crash the program. Real security exploits (buffer overflow attacks) exploit exactly this! Always: track the size and check bounds.',
        },
        {
          q: 'sizeof(arr)/sizeof(arr[0]) kya calculate karta hai?',
          options: [
            'Array ka pehla element',
            'Array mein total elements ki count — total bytes / ek element ke bytes = count. int arr[5]: sizeof=20 bytes, sizeof(int)=4, 20/4=5.',
            'Array ka size bytes mein',
            'Array ka last element',
          ],
          correct: 1,
          explanation: 'sizeof(arr) = total bytes in array (e.g. int arr[5] = 20 bytes). sizeof(arr[0]) = size of one element (int = 4 bytes). 20/4 = 5 elements. Yeh pattern array size hardcode na karne ka best way hai. Note: yeh sirf tab kaam karta hai jab arr ek actual array ho — pointer pe nahi kaam karta (sizeof pointer = 4 ya 8 bytes, array size nahi).',
          q_en: 'What does sizeof(arr)/sizeof(arr[0]) calculate?',
          options_en: [
            'The first element of the array',
            'The total number of elements — total bytes / bytes of one element = count. int arr[5]: sizeof=20 bytes, sizeof(int)=4, 20/4=5.',
            'The size of the array in bytes',
            'The last element of the array',
          ],
          explanation_en: 'sizeof(arr) = total bytes in the array (e.g. int arr[5] = 20 bytes). sizeof(arr[0]) = size of one element (int = 4 bytes). 20/4 = 5 elements. This pattern is the best way to avoid hardcoding the array size. Note: this only works when arr is an actual array — not on a pointer (sizeof pointer = 4 or 8 bytes, not the array size).',
        },
        {
          q: 'Function ko array pass karte waqt kya hota hai — pass by value ya reference?',
          options: [
            'Pass by value — copy milti hai',
            'Pass by reference (pointer) — function ko array ka address milta hai, original elements modify ho sakte hain',
            'Depends on array size',
            'C mein arrays functions ko nahi pass ho sakte',
          ],
          correct: 1,
          explanation: 'Arrays C mein automatically "decay" ho jaate hain — pointer to first element ban jaate hain. void func(int arr[], int n) actually void func(int *arr, int n) hai. Function directly original array memory pe kaam karta hai — changes = permanent! Yahi reason hai ki functions arrays ke elements modify kar sakte hain. Protect karne ke liye: const int arr[] use karo.',
          q_en: 'When you pass an array to a function — pass by value or reference?',
          options_en: [
            'Pass by value — a copy is made',
            'Pass by reference (pointer) — the function receives the address of the array, original elements can be modified',
            'Depends on the array size',
            'Arrays cannot be passed to functions in C',
          ],
          explanation_en: 'Arrays in C automatically "decay" — they become a pointer to the first element. void func(int arr[], int n) is actually void func(int *arr, int n). The function works directly on the original array memory — changes are permanent! That is why functions can modify array elements. To protect: use const int arr[].',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w3-s4',
      title: 'Strings — Text Processing in C',
      title_en: 'Strings — Text Processing in C',
      emoji: '📝',
      content: `## Strings — C mein Text Handle Karna

C mein koi built-in string type nahi! String = char array + null terminator '\\0'.

### String Basics

\`\`\`c
// String = char array ending with '\\0' (null)
char name[] = "Rahul";        // Compiler auto-adds '\\0'
// Internally: ['R','a','h','u','l','\\0'] — 6 chars!

char name2[10] = "Rahul";     // size 10, rest is garbage/zeros
char name3[6]  = {'R','a','h','u','l','\\0'};  // manual

// String aur char array ka fark
char str[] = "Hello";  // string — null terminated
char arr[] = {'H','e','l','l','o'};  // char array — NOT a string!

// Print
printf("%s\\n", name);           // Rahul
printf("Length: %lu\\n", sizeof(name)-1);  // 5 (minus null)

// ❌ GALAT — string directly assign nahi kar sakte
char s[20] = "Hello";
s = "World";  // COMPILE ERROR!

// ✅ SAHI — strcpy use karo
#include <string.h>
strcpy(s, "World");
\`\`\`

### string.h — Important Functions

\`\`\`c
#include <string.h>
#include <ctype.h>

char s1[50] = "Hello";
char s2[50] = "World";
char s3[100];

// ── Length ──
int len = strlen(s1);           // 5 (null count nahi)

// ── Copy ──
strcpy(s3, s1);                  // s3 = "Hello"
strncpy(s3, s1, 3);             // s3 = "Hel" (safer — max 3 chars)

// ── Concatenate (join) ──
strcat(s3, s2);                  // s3 = "HelloWorld"
strncat(s3, s2, 3);             // safer — max 3 chars of s2

// ── Compare ──
int cmp = strcmp(s1, s2);
// < 0: s1 < s2 alphabetically
// 0:   s1 == s2
// > 0: s1 > s2

if (strcmp(s1, s2) == 0) printf("Equal\\n");
else printf("Not equal\\n");

// Case-insensitive compare (non-standard but common)
// strcasecmp(s1, s2);  // Linux
// _stricmp(s1, s2);    // Windows

// ── Search ──
char *pos = strstr(s1, "ll");    // pointer to "ll" in s1, or NULL
char *ch  = strchr(s1, 'l');    // first 'l', or NULL
char *last = strrchr(s1, 'l');  // last 'l', or NULL

// ── Convert ──
int n = atoi("123");            // "123" → 123 (int)
float f = atof("3.14");        // "3.14" → 3.14
char buf[20];
sprintf(buf, "%d", 42);         // int → string "42"
int x; sscanf("100", "%d", &x); // string → int

// ── Case conversion ──
for (int i=0; s1[i]; i++) s1[i] = toupper(s1[i]);  // HELLO
for (int i=0; s1[i]; i++) s1[i] = tolower(s1[i]);  // hello
\`\`\`

### String Character-by-Character Processing

\`\`\`c
char str[] = "Hello, World! 123";

int letters=0, digits=0, spaces=0, special=0;

for (int i = 0; str[i] != '\\0'; i++) {  // or while(str[i])
    if (isalpha(str[i]))      letters++;
    else if (isdigit(str[i])) digits++;
    else if (isspace(str[i])) spaces++;
    else                       special++;
}

// Check character type — ctype.h
isalpha('A');   // 1 (letter)
isdigit('5');   // 1 (digit)
isalnum('a');   // 1 (letter or digit)
isspace(' ');   // 1 (space, tab, newline)
isupper('A');   // 1 (uppercase)
islower('a');   // 1 (lowercase)
ispunct('!');   // 1 (punctuation)
\`\`\`

### Common String Pitfalls

\`\`\`c
// ❌ Buffer Overflow — DANGEROUS
char small[5];
strcpy(small, "Hello World!");  // 12 chars in 5-char buffer → CRASH!

// ✅ Safe
char safe[50];
strncpy(safe, "Hello World!", sizeof(safe)-1);
safe[sizeof(safe)-1] = '\\0';  // ensure null termination

// ❌ String comparison with ==
char a[] = "hello";
char b[] = "hello";
if (a == b) { }   // WRONG! Compares addresses, not content!

// ✅ Correct
if (strcmp(a, b) == 0) { }  // compares content

// ❌ Modifying string literal
char *lit = "hello";  // string literal (read-only memory!)
lit[0] = 'H';         // CRASH — segmentation fault!

// ✅ Correct
char arr[] = "hello";  // copy on stack — modifiable
arr[0] = 'H';          // OK!
\`\`\`

### String Algorithms

\`\`\`c
// Word count
int countWords(char s[]) {
    int count = 0, inWord = 0;
    for (int i = 0; s[i]; i++) {
        if (!isspace(s[i]) && !inWord) { count++; inWord = 1; }
        else if (isspace(s[i]))          inWord = 0;
    }
    return count;
}

// String is palindrome?
int isPalindromeStr(char s[]) {
    int n = strlen(s);
    for (int i = 0; i < n/2; i++)
        if (s[i] != s[n-1-i]) return 0;
    return 1;
}

// Anagram check
int isAnagram(char a[], char b[]) {
    if (strlen(a) != strlen(b)) return 0;
    int freq[256] = {0};
    for (int i=0; a[i]; i++) freq[(unsigned char)a[i]]++;
    for (int i=0; b[i]; i++) {
        if (!freq[(unsigned char)b[i]]) return 0;
        freq[(unsigned char)b[i]]--;
    }
    return 1;
}
\`\`\``,

      content_en: `## Strings — Text Processing in C

In C there is no built-in string type! A string = char array + null terminator '\\0'.

### String Basics

\`\`\`c
char name[] = "Rahul";  // ['R','a','h','u','l','\\0'] — 6 chars
strlen(name);           // 5 (null not counted)

// ❌ Cannot assign directly
s = "World";  // COMPILE ERROR!

// ✅ Use strcpy
strcpy(s, "World");
\`\`\`

### string.h Functions

\`\`\`c
strlen(s);          // length
strcpy(d, s);       // copy s into d
strcat(d, s);       // append s to d
strcmp(a, b);       // compare: 0=equal, <0=a<b, >0=a>b
strstr(s, "ll");    // find substring, returns pointer or NULL
atoi("123");        // "123" → 123
sprintf(buf, "%d", 42);  // int → string
\`\`\`

### Common Pitfalls

\`\`\`c
// ❌ Buffer overflow
char small[5]; strcpy(small, "Hello World!");  // CRASH!

// ❌ Wrong string comparison
if (a == b) { }   // compares addresses, not content!
if (strcmp(a, b) == 0) { }  // ✅ correct

// ❌ Modifying string literal
char *lit = "hello"; lit[0]='H';  // CRASH (read-only memory)
char arr[] = "hello"; arr[0]='H'; // ✅ OK
\`\`\``,

      codeExample: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Caesar cipher encrypt
void caesarEncrypt(char s[], int shift, char result[]) {
    for (int i = 0; s[i]; i++) {
        if (isupper(s[i]))
            result[i] = ((s[i]-'A'+shift)%26)+'A';
        else if (islower(s[i]))
            result[i] = ((s[i]-'a'+shift)%26)+'a';
        else
            result[i] = s[i];
    }
    result[strlen(s)] = '\\0';
}

// Word frequency (simplified — count specific word)
int wordFreq(char text[], char word[]) {
    int count = 0;
    char copy[500]; strcpy(copy, text);
    char *token = strtok(copy, " .,!?");
    while (token) {
        if (strcasecmp(token, word) == 0) count++;
        token = strtok(NULL, " .,!?");
    }
    return count;
}

// Reverse words in sentence
void reverseWords(char s[], char result[]) {
    int n = strlen(s);
    int end = n-1, resIdx = 0;
    while (end >= 0) {
        while (end >= 0 && s[end] == ' ') end--;
        int wordEnd = end;
        while (end >= 0 && s[end] != ' ') end--;
        for (int i = end+1; i <= wordEnd; i++)
            result[resIdx++] = s[i];
        if (end >= 0) result[resIdx++] = ' ';
    }
    result[resIdx] = '\\0';
}

int main() {
    // ── String operations ──
    char str[100];
    printf("String daalo: ");
    fgets(str, sizeof(str), stdin);
    str[strcspn(str, "\\n")] = '\\0';  // remove trailing newline

    printf("Length     : %lu\\n", strlen(str));
    printf("Words      : ");

    int wordCount = 0, inWord = 0;
    int letters=0, digits=0, spaces=0;
    for (int i=0; str[i]; i++) {
        if (!isspace(str[i]) && !inWord) { wordCount++; inWord=1; }
        else if (isspace(str[i])) inWord=0;
        if (isalpha(str[i])) letters++;
        else if (isdigit(str[i])) digits++;
        else if (isspace(str[i])) spaces++;
    }
    printf("%d\\n", wordCount);
    printf("Letters    : %d\\n", letters);
    printf("Digits     : %d\\n", digits);
    printf("Spaces     : %d\\n", spaces);

    // ── Caesar cipher ──
    char encrypted[100], decrypted[100];
    caesarEncrypt(str, 3, encrypted);
    caesarEncrypt(encrypted, -3+26, decrypted);
    printf("\\nOriginal : %s\\n", str);
    printf("Encrypted: %s\\n", encrypted);
    printf("Decrypted: %s\\n", decrypted);

    // ── Palindrome ──
    char lower[100]; strcpy(lower, str);
    for(int i=0;lower[i];i++) lower[i]=tolower(lower[i]);
    int n=strlen(lower), isPalin=1;
    for(int i=0;i<n/2;i++) if(lower[i]!=lower[n-1-i]){isPalin=0;break;}
    printf("\\nPalindrome: %s\\n", isPalin ? "Yes!" : "No");

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

void caesarEncrypt(char s[], int shift, char r[]) {
    for(int i=0;s[i];i++){
        if(isupper(s[i])) r[i]=((s[i]-'A'+shift)%26)+'A';
        else if(islower(s[i])) r[i]=((s[i]-'a'+shift)%26)+'a';
        else r[i]=s[i];
    }
    r[strlen(s)]='\\0';
}

int main() {
    char str[100];
    printf("Enter string: ");
    fgets(str,sizeof(str),stdin);
    str[strcspn(str,"\\n")]='\\0';

    printf("Length: %lu\\n", strlen(str));

    char enc[100]; caesarEncrypt(str,3,enc);
    printf("Caesar+3: %s\\n", enc);

    // Palindrome check
    int n=strlen(str),ok=1;
    for(int i=0;i<n/2;i++) if(tolower(str[i])!=tolower(str[n-1-i])){ok=0;break;}
    printf("Palindrome: %s\\n", ok?"Yes":"No");
    return 0;
}`,

      task: {
        description: 'Strings deep practice: (1) "Password Strength Checker" — password lo, check karo: min 8 chars, uppercase hai, lowercase hai, digit hai, special char hai. Score 0-5 do aur strength batao (Weak/Medium/Strong/Very Strong). (2) "String Compression" — "aaabbbcccc" → "a3b3c4" (run-length encoding). (3) "Anagram Checker" — do strings lo, batao anagram hain ya nahi. (4) "First Non-Repeating Character" find karo string mein.',
        description_en: 'Deep string practice: (1) "Password Strength Checker" — take a password, check: min 8 chars, has uppercase, has lowercase, has digit, has special char. Give a score 0-5 and show strength (Weak/Medium/Strong/Very Strong). (2) "String Compression" — "aaabbbcccc" → "a3b3c4" (run-length encoding). (3) "Anagram Checker" — take two strings, determine if they are anagrams. (4) Find the "First Non-Repeating Character" in a string.',
        hint: 'Password: flag variables set karo for each condition. Compression: while loop, count consecutive same chars. Anagram: sort both strings aur compare, ya freq array use karo. Non-repeating: 2 loops — pehla pass freq count, doosra pass first char with freq==1.',
        hint_en: 'Password: set flag variables for each condition. Compression: while loop, count consecutive identical chars. Anagram: sort both strings and compare, or use a frequency array. Non-repeating: 2 passes — first count frequencies, then find first char with freq==1.',
      },
      quiz: [
        {
          q: 'C mein string comparison ke liye == kyun use nahi kar sakte?',
          options: [
            'Kar sakte hain',
            '== pointers (addresses) compare karta hai — content nahi. "hello"=="hello" false ho sakta hai kyunki dono alag memory locations pe hain. strcmp() use karo content comparison ke liye.',
            '== sirf integers ke liye hai',
            'strcmp slower hai',
          ],
          correct: 1,
          explanation: 'char a[]="hello"; char b[]="hello"; — a aur b alag stack variables hain, alag addresses. a==b = false (address compare). strcmp(a,b)==0 = true (content compare). String literals ke liye compiler same address reuse kar sakta hai (optimization) lekin yeh guaranteed nahi. Rule: ALWAYS strcmp for string content comparison.',
          q_en: 'Why can\'t you use == to compare strings in C?',
          options_en: [
            'You can',
            '== compares pointers (addresses), not content. "hello"=="hello" can be false because both are at different memory locations. Use strcmp() to compare content.',
            '== is only for integers',
            'strcmp is slower',
          ],
          explanation_en: 'char a[]="hello"; char b[]="hello"; — a and b are different stack variables at different addresses. a==b = false (address comparison). strcmp(a,b)==0 = true (content comparison). The compiler may reuse the same address for identical string literals (as an optimisation) but this is not guaranteed. Rule: ALWAYS use strcmp for string content comparison.',
        },
        {
          q: 'strlen() aur sizeof() mein string ke liye kya fark hai?',
          options: [
            'Same hain',
            'strlen() = actual string length (null tak characters, null count nahi). sizeof() = allocated memory size including null and padding. char s[20]="Hi": strlen=2, sizeof=20.',
            'sizeof() faster hai',
            'strlen() total memory batata hai',
          ],
          correct: 1,
          explanation: 'char name[20]="Rahul"; strlen(name)=5 (5 chars). sizeof(name)=20 (total allocated). sizeof(name)-1=19 (for buffer size in strncpy). Important: strlen() ek function hai — O(n) time. sizeof() compile-time constant — O(1). For loops use strlen() once, store result, dont call in loop condition.',
          q_en: 'What is the difference between strlen() and sizeof() for a string?',
          options_en: [
            'They are the same',
            'strlen() = actual string length (characters up to null, null not counted). sizeof() = allocated memory including null and padding. char s[20]="Hi": strlen=2, sizeof=20.',
            'sizeof() is faster',
            'strlen() gives total memory',
          ],
          explanation_en: 'char name[20]="Rahul"; strlen(name)=5 (5 chars). sizeof(name)=20 (total allocated). sizeof(name)-1=19 (useful as buffer size in strncpy). Important: strlen() is a function — O(n) time. sizeof() is a compile-time constant — O(1). For loops, call strlen() once, store the result, don\'t call it in the loop condition.',
        },
        {
          q: 'fgets() vs scanf("%s") string input ke liye — kaunsa better hai?',
          options: [
            'scanf better hai — simpler',
            'fgets() better hai — spaces bhi read karta hai aur buffer size specify kar sakte hain (safe). scanf("%s") spaces pe stop karta hai aur overflow ka risk hai.',
            'Dono same hain',
            'gets() sabse better hai',
          ],
          correct: 1,
          explanation: 'scanf("%s", str): whitespace pe stop. "Hello World" → sirf "Hello". Buffer overflow risk. fgets(str, n, stdin): puri line padhta hai (newline tak), max n-1 chars — safe! gets() NEVER use karo — deprecated, no bounds check. fgets ke baad: str[strcspn(str,"\\n")]="\\0" se trailing newline remove karo.',
          q_en: 'fgets() vs scanf("%s") for string input — which is better?',
          options_en: [
            'scanf is better — simpler',
            'fgets() is better — reads spaces too and lets you specify buffer size (safe). scanf("%s") stops at spaces and risks buffer overflow.',
            'Both are the same',
            'gets() is the best',
          ],
          explanation_en: 'scanf("%s", str): stops at whitespace. "Hello World" → only "Hello". Risk of buffer overflow. fgets(str, n, stdin): reads the whole line (up to newline), max n-1 chars — safe! Never use gets() — deprecated, no bounds check. After fgets: remove the trailing newline with str[strcspn(str,"\\n")]="\\0".',
        },
      ],
    },
  ],
};