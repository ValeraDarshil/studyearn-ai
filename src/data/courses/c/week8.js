/**
 * StudyEarn AI — C Programming Course
 * Week 8: Stack, Queue aur Hash Table — Classic Data Structures
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_8 = {
  week: 8,
  title: 'Stack, Queue aur Hash Table — Classic Data Structures',
  title_en: 'Stack, Queue and Hash Table — Classic Data Structures',
  description: 'LIFO stack, FIFO queue, O(1) hash table — interview mein sabse puche jaane wale data structures master karo!',
  description_en: 'LIFO stack, FIFO queue, O(1) hash table — master the data structures most frequently asked about in interviews!',
  xpReward: 260,
  sections: [
    {
      id: 'c-w8-s1',
      title: 'Stack — LIFO Data Structure',
      title_en: 'Stack — LIFO Data Structure',
      emoji: '📚',
      content: `## Stack — Last In, First Out!

Stack = plates ka stack. Jo plate pehle rakhi — woh last mein nikalti hai!
Last In, First Out (LIFO).

### Real-World Uses
\`\`\`
Function call stack   ← main() → func1() → func2() — yahi stack hai!
Undo/Redo systems     ← text editor mein Ctrl+Z
Browser back button   ← visited pages history
Expression evaluation ← 3 + 4 * 2 calculate karna
Balanced parentheses  ← ({[]}) check
Depth-First Search    ← graph traversal
Backtracking          ← maze solving
\`\`\`

### Stack — Array Implementation

\`\`\`c
#define STACK_MAX 1000

typedef struct {
    int  data[STACK_MAX];
    int  top;     // index of top element (-1 = empty)
    int  size;    // current number of elements
} Stack;

void   stack_init  (Stack *s)          { s->top = -1; s->size = 0; }
int    stack_empty (const Stack *s)    { return s->top == -1; }
int    stack_full  (const Stack *s)    { return s->top == STACK_MAX - 1; }
int    stack_size  (const Stack *s)    { return s->size; }
int    stack_peek  (const Stack *s)    { return s->top >= 0 ? s->data[s->top] : -1; }

int stack_push(Stack *s, int val) {
    if (stack_full(s)) return 0;  // overflow!
    s->data[++s->top] = val;
    s->size++;
    return 1;
}

int stack_pop(Stack *s, int *out) {
    if (stack_empty(s)) return 0;  // underflow!
    *out = s->data[s->top--];
    s->size--;
    return 1;
}

// Usage
Stack s;
stack_init(&s);
stack_push(&s, 10);
stack_push(&s, 20);
stack_push(&s, 30);
// Stack: bottom [10, 20, 30] top

int val;
stack_pop(&s, &val);   // val = 30 (LIFO!)
stack_pop(&s, &val);   // val = 20
printf("Peek: %d\\n",  stack_peek(&s));  // 10
\`\`\`

### Dynamic Stack (Linked List)

\`\`\`c
typedef struct StackNode {
    int              data;
    struct StackNode *next;
} StackNode;

typedef struct {
    StackNode *top;
    int        size;
} DynStack;

void dynstack_init(DynStack *s) { s->top = NULL; s->size = 0; }

int dynstack_push(DynStack *s, int val) {
    StackNode *node = (StackNode*)malloc(sizeof(StackNode));
    if (!node) return 0;
    node->data  = val;
    node->next  = s->top;
    s->top      = node;
    s->size++;
    return 1;
}

int dynstack_pop(DynStack *s, int *out) {
    if (!s->top) return 0;
    *out     = s->top->data;
    StackNode *temp = s->top;
    s->top   = s->top->next;
    free(temp);
    s->size--;
    return 1;
}

void dynstack_free(DynStack *s) {
    int dummy;
    while (dynstack_pop(s, &dummy));
}
\`\`\`

### Stack Applications

\`\`\`c
// ── 1. Balanced Parentheses Check ──
int isBalanced(const char *expr) {
    Stack s;
    stack_init(&s);

    for (int i = 0; expr[i]; i++) {
        char c = expr[i];
        if (c == '(' || c == '[' || c == '{') {
            stack_push(&s, c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (stack_empty(&s)) return 0;
            int top;
            stack_pop(&s, &top);
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) return 0;
        }
    }
    return stack_empty(&s);
}

// isBalanced("([]{})")  → 1 (balanced)
// isBalanced("([)]")    → 0 (not balanced)
// isBalanced("{[}")     → 0 (not balanced)

// ── 2. Infix to Postfix Conversion ──
// Infix:   3 + 4 * 2       = 11 (standard)
// Postfix: 3 4 2 * +       = 11 (no precedence needed!)
// Prefix:  + 3 * 4 2       = 11

// Shunting-yard algorithm uses stack
int precedence(char op) {
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

// ── 3. Evaluate Postfix Expression ──
int evalPostfix(const char *expr) {
    Stack s;
    stack_init(&s);

    for (int i = 0; expr[i]; i++) {
        if (isdigit(expr[i])) {
            stack_push(&s, expr[i] - '0');
        } else if (expr[i] != ' ') {
            int b, a;
            stack_pop(&s, &b);
            stack_pop(&s, &a);
            int result;
            switch (expr[i]) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = a / b; break;
                default:  result = 0;
            }
            stack_push(&s, result);
        }
    }
    int result;
    stack_pop(&s, &result);
    return result;
}
// evalPostfix("3 4 2 * +") → 3 + 4*2 = 11
\`\`\``,

      content_en: `## Stack — Last In, First Out!

### Array Stack

\`\`\`c
typedef struct { int data[1000]; int top, size; } Stack;
void init(Stack *s)  { s->top=-1; s->size=0; }
int  push(Stack *s, int v) { if(s->top==999) return 0; s->data[++s->top]=v; s->size++; return 1; }
int  pop (Stack *s, int *o){ if(s->top<0) return 0; *o=s->data[s->top--]; s->size--; return 1; }
int  peek(const Stack *s)  { return s->top>=0 ? s->data[s->top] : -1; }
\`\`\`

### Linked List Stack

\`\`\`c
typedef struct N { int d; struct N *n; } Node;
typedef struct { Node *top; int sz; } DynStack;

void push(DynStack *s, int d) {
    Node *n=malloc(sizeof(*n)); n->d=d; n->n=s->top; s->top=n; s->sz++;
}
int pop(DynStack *s) {
    if(!s->top) return -1;
    int d=s->top->d; Node *t=s->top; s->top=t->n; free(t); s->sz--; return d;
}
\`\`\`

### Applications

\`\`\`c
// Balanced parentheses
int isBalanced(const char *e) {
    Stack s; init(&s);
    for(int i=0;e[i];i++){
        if(e[i]=='('||e[i]=='['||e[i]=='{') push(&s,e[i]);
        else if(e[i]==')'||e[i]==']'||e[i]=='}'){
            int t; if(!pop(&s,&t)) return 0;
            if((e[i]==')'&&t!='(')||(e[i]==']'&&t!='[')||(e[i]=='}'&&t!='{')) return 0;
        }
    }
    return s.top<0;
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_STACK 512

typedef struct {
    int  data[MAX_STACK];
    int  top;
} Stack;

void  sinit(Stack *s)       { s->top=-1; }
int   sempty(Stack *s)      { return s->top<0; }
int   sfull(Stack *s)       { return s->top>=MAX_STACK-1; }
int   speak(Stack *s)       { return s->top>=0?s->data[s->top]:-1; }
int   spush(Stack *s,int v) { if(sfull(s))return 0; s->data[++s->top]=v; return 1; }
int   spop(Stack *s)        { if(sempty(s))return -1; return s->data[s->top--]; }

// ── Balanced brackets ──
int isBalanced(const char *e) {
    Stack s; sinit(&s);
    for(int i=0;e[i];i++) {
        if(e[i]=='('||e[i]=='['||e[i]=='{') spush(&s,e[i]);
        else if(e[i]==')'||e[i]==']'||e[i]=='}') {
            if(sempty(&s)) return 0;
            int t=spop(&s);
            if((e[i]==')'&&t!='(')||(e[i]==']'&&t!='[')||(e[i]=='}'&&t!='{')) return 0;
        }
    }
    return sempty(&s);
}

// ── Evaluate postfix ──
int evalPostfix(const char *expr) {
    Stack s; sinit(&s);
    for(int i=0;expr[i];i++){
        if(isdigit(expr[i])) {
            spush(&s, expr[i]-'0');
        } else if(expr[i]!=' ') {
            int b=spop(&s), a=spop(&s);
            if(expr[i]=='+') spush(&s,a+b);
            else if(expr[i]=='-') spush(&s,a-b);
            else if(expr[i]=='*') spush(&s,a*b);
            else if(expr[i]=='/'&&b) spush(&s,a/b);
        }
    }
    return spop(&s);
}

// ── Next Greater Element ──
void nextGreater(int *arr, int n) {
    Stack s; sinit(&s);
    int *nge = (int*)malloc(n*sizeof(int));
    for(int i=0;i<n;i++) nge[i]=-1;

    for(int i=0;i<n;i++){
        while(!sempty(&s) && arr[speak(&s)] < arr[i]) {
            nge[spop(&s)] = arr[i];
        }
        spush(&s,i);
    }

    printf("Next Greater Elements:\\n");
    for(int i=0;i<n;i++) printf("arr[%d]=%d → %d\\n",i,arr[i],nge[i]);
    free(nge);
}

// ── Stock Span Problem ──
void stockSpan(int *price, int n) {
    Stack s; sinit(&s);
    int *span = (int*)malloc(n*sizeof(int));

    for(int i=0;i<n;i++){
        while(!sempty(&s) && price[speak(&s)] <= price[i]) spop(&s);
        span[i] = sempty(&s) ? i+1 : i-speak(&s);
        spush(&s,i);
    }

    printf("Stock Prices:  "); for(int i=0;i<n;i++) printf("%-4d",price[i]); printf("\\n");
    printf("Span Values:   "); for(int i=0;i<n;i++) printf("%-4d",span[i]);  printf("\\n");
    free(span);
}

int main() {
    // ── Balanced parentheses ──
    printf("=== Balanced Parentheses ===\\n");
    const char *exprs[] = {"([]{})", "([)]", "{[}", "((()))", "}{", ""};
    for(int i=0;exprs[i][0]||i==5;i++) {
        if(i==5)break;
        printf("'%s' → %s\\n", exprs[i], isBalanced(exprs[i])?"✅ Balanced":"❌ Not balanced");
    }

    // ── Postfix evaluation ──
    printf("\\n=== Postfix Evaluation ===\\n");
    const char *pf[] = {"3 4 2 * +", "5 1 2 + 4 * + 3 -", "2 3 * 4 +"};
    for(int i=0;i<3;i++)
        printf("'%s' = %d\\n", pf[i], evalPostfix(pf[i]));

    // ── Next greater element ──
    printf("\\n=== Next Greater Element ===\\n");
    int arr[] = {4,5,2,25,7,8};
    nextGreater(arr, 6);

    // ── Stock span ──
    printf("\\n=== Stock Span Problem ===\\n");
    int prices[] = {100,80,60,70,60,75,85};
    stockSpan(prices, 7);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <ctype.h>

#define SZ 512
typedef struct { int d[SZ]; int t; } Stack;
void sinit(Stack*s){s->t=-1;}
int  sempty(Stack*s){return s->t<0;}
int  spush(Stack*s,int v){if(s->t>=SZ-1)return 0;s->d[++s->t]=v;return 1;}
int  spop(Stack*s){return s->t<0?-1:s->d[s->t--];}
int  speek(Stack*s){return s->t>=0?s->d[s->t]:-1;}

int balanced(const char *e){
    Stack s;sinit(&s);
    for(int i=0;e[i];i++){
        if(e[i]=='('||e[i]=='['||e[i]=='{') spush(&s,e[i]);
        else if(e[i]==')'||e[i]==']'||e[i]=='}'){
            int t=spop(&s);
            if((e[i]==')'&&t!='(')||(e[i]==']'&&t!='[')||(e[i]=='}'&&t!='{'))return 0;
        }
    }
    return sempty(&s);
}

int postfix(const char *e){
    Stack s;sinit(&s);
    for(int i=0;e[i];i++){
        if(isdigit(e[i])) spush(&s,e[i]-'0');
        else if(e[i]!=' '){int b=spop(&s),a=spop(&s);spush(&s,e[i]=='+'?a+b:e[i]=='-'?a-b:e[i]=='*'?a*b:a/b);}
    }
    return spop(&s);
}

int main(){
    printf("([]{}): %s\\n", balanced("([]{})")?"OK":"FAIL");
    printf("([)]:   %s\\n", balanced("([)]")?"OK":"FAIL");
    printf("3 4 2 * + = %d\\n", postfix("3 4 2 * +"));
    return 0;
}`,

      task: {
        description: 'Stack practice: (1) "Reverse a String" using stack — push all chars, then pop to get reversed. (2) "Min Stack" — ek special stack banao jo O(1) mein minimum element return kare (extra stack use karo). (3) "Tower of Hanoi" iterative solution using two stacks — no recursion! (4) "Histogram Largest Rectangle" — stack se largest rectangle in histogram find karo (classic interview problem).',
        description_en: 'Stack practice: (1) "Reverse a String" using a stack — push all chars, then pop to get the reversed string. (2) "Min Stack" — build a special stack that returns the minimum element in O(1) (use an extra stack). (3) "Tower of Hanoi" iterative solution using two stacks — no recursion! (4) "Largest Rectangle in Histogram" — use a stack to find the largest rectangle area (classic interview problem).',
        hint: 'Min Stack: second stack min_stack keeps track of current minimum — push: if val<=min_stack.top push to min_stack; pop: if val==min_stack.top also pop min_stack. Histogram: for each bar, pop while stack.top bar is taller, compute width using indices.',
        hint_en: 'Min Stack: a second stack (min_stack) tracks the current minimum — push: if val<=min_stack.top push to min_stack too; pop: if val==min_stack.top also pop min_stack. Histogram: for each bar, pop while the stack-top bar is taller, compute width using indices.',
      },
      quiz: [
        {
          q: 'Stack overflow aur stack underflow kya hote hain?',
          options: [
            'Same cheez hai',
            'Overflow: full stack mein push karna (array bounds exceed). Underflow: empty stack se pop karna. Dono undefined behavior ya error conditions hain — hamesha check karo!',
            'Sirf recursion se hota hai',
            'Compiler error hai',
          ],
          correct: 1,
          explanation: 'Stack overflow: stack_push on full stack. Program ka call stack overflow (too deep recursion) isi se hota hai — OS kills process with SIGSEGV. Stack underflow: stack_pop on empty stack — garbage value ya crash. Prevention: isfull()/isempty() check before every operation. Dynamic stack (linked list) mein overflow rare hai (jab tak heap available ho).',
          q_en: 'What are stack overflow and stack underflow?',
          options_en: [
            'They are the same thing',
            'Overflow: pushing onto a full stack (exceeds array bounds). Underflow: popping from an empty stack. Both are undefined behaviour or error conditions — always check!',
            'Only happens with recursion',
            'A compiler error',
          ],
          explanation_en: 'Stack overflow: stack_push on a full stack. A program\'s call stack overflowing (too-deep recursion) is this exact issue — the OS kills the process with SIGSEGV. Stack underflow: stack_pop on an empty stack — garbage value or crash. Prevention: check isfull()/isempty() before every operation. With a dynamic stack (linked list), overflow is rare (as long as heap memory is available).',
        },
        {
          q: 'Balanced parentheses check mein stack kyun perfect hai?',
          options: [
            'Stack fast hai',
            'Opening bracket push karo, closing aane pe top se match karo. LIFO property exactly matches nesting — innermost bracket pehle close hona chahiye. Stack naturally is hierarchy track karta hai.',
            'Array se nahi ho sakta',
            'Recursion ka alternative hai',
          ],
          correct: 1,
          explanation: '({[]}) check: ( push → { push → [ push → ] → pop [ match ✓ → } → pop { match ✓ → ) → pop ( match ✓ → empty ✓ balanced. Stack ki LIFO property = nesting ki order. Last opened bracket first close hona chahiye — exactly LIFO. Array se: index track karna complex hoga. Stack mein naturally O(n) time, O(n) space.',
          q_en: 'Why is a stack perfect for checking balanced parentheses?',
          options_en: [
            'Stacks are fast',
            'Push opening brackets; on a closing bracket, pop from the top and check for a match. The LIFO property exactly matches nesting — the innermost bracket must close first. The stack naturally tracks hierarchy.',
            'It cannot be done with an array',
            'It is an alternative to recursion',
          ],
          explanation_en: '({[]}) check: ( push → { push → [ push → ] → pop [ match ✓ → } → pop { match ✓ → ) → pop ( match ✓ → empty ✓ balanced. The LIFO property of a stack = the order of nesting. The last opened bracket must close first — exactly LIFO. With an array you would need complex index tracking. With a stack: naturally O(n) time, O(n) space.',
        },
        {
          q: 'Postfix (RPN) evaluation mein stack kyun use karte hain?',
          options: [
            'Sirf convention hai',
            'Operands stack pe rakho. Operator aane pe top 2 operands pop karo, compute karo, result push karo. No precedence rules needed — order already correct hai postfix mein!',
            'Tree se nahi ho sakta',
            'Stack fastest evaluation deta hai',
          ],
          correct: 1,
          explanation: '"3 4 2 * +" evaluate: 3 push → 4 push → 2 push → * → pop 2,4 compute 4*2=8 push → + → pop 8,3 compute 3+8=11 push → done! Result = 11. Infix "3+4*2" = 11 (same!). Postfix advantage: no parentheses needed, no precedence rules, simple stack-based eval. Compilers use postfix internally!',
          q_en: 'Why do we use a stack for postfix (RPN) evaluation?',
          options_en: [
            'Just convention',
            'Push operands onto the stack. When an operator appears, pop the top 2 operands, compute, push the result. No precedence rules needed — the order is already correct in postfix!',
            'Cannot be done with a tree',
            'Stack gives the fastest evaluation',
          ],
          explanation_en: '"3 4 2 * +" evaluated: push 3 → push 4 → push 2 → * → pop 2,4 compute 4*2=8 push → + → pop 8,3 compute 3+8=11 push → done! Result = 11. Infix "3+4*2" = 11 (same!). Postfix advantage: no parentheses needed, no precedence rules, simple stack-based evaluation. Compilers use postfix internally!',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w8-s2',
      title: 'Queue — FIFO Data Structure',
      title_en: 'Queue — FIFO Data Structure',
      emoji: '🚶',
      content: `## Queue — First In, First Out!

Queue = line mein khade log. Jo pehle aaya, pehle gaya — FIFO!

### Real-World Uses
\`\`\`
CPU Task Scheduling    ← OS process queue
Print Queue           ← printer mein jobs
BFS Graph Traversal   ← shortest path
Message Queue         ← RabbitMQ, Kafka
Keyboard Input Buffer ← keys pressed
Network Packet Queue  ← router buffers
Bank/Hospital Queue   ← service systems
\`\`\`

### Circular Queue — Array se Efficient!

\`\`\`c
#define QUEUE_CAP 8

typedef struct {
    int  data[QUEUE_CAP];
    int  front;   // dequeue position
    int  rear;    // enqueue position
    int  size;
} CircularQueue;

void  queue_init   (CircularQueue *q) { q->front = 0; q->rear = 0; q->size = 0; }
int   queue_empty  (const CircularQueue *q) { return q->size == 0; }
int   queue_full   (const CircularQueue *q) { return q->size == QUEUE_CAP; }
int   queue_size   (const CircularQueue *q) { return q->size; }
int   queue_front  (const CircularQueue *q) { return q->size > 0 ? q->data[q->front] : -1; }
int   queue_back   (const CircularQueue *q) { return q->size > 0 ? q->data[(q->rear-1+QUEUE_CAP)%QUEUE_CAP] : -1; }

int queue_enqueue(CircularQueue *q, int val) {
    if (queue_full(q)) return 0;          // overflow!
    q->data[q->rear] = val;
    q->rear = (q->rear + 1) % QUEUE_CAP;  // wrap around!
    q->size++;
    return 1;
}

int queue_dequeue(CircularQueue *q, int *out) {
    if (queue_empty(q)) return 0;         // underflow!
    *out = q->data[q->front];
    q->front = (q->front + 1) % QUEUE_CAP; // wrap around!
    q->size--;
    return 1;
}

// Why circular? Linear queue se:
// enqueue: rear++
// dequeue: front++
// Problem: rear reaches end but front moved — wasted space!
// Circular: (rear+1) % CAPACITY — wrap around, reuse space!
\`\`\`

### Dynamic Queue — Linked List

\`\`\`c
typedef struct QNode {
    int          data;
    struct QNode *next;
} QNode;

typedef struct {
    QNode *front;  // dequeue end
    QNode *rear;   // enqueue end
    int    size;
} DynQueue;

void dynq_init(DynQueue *q) { q->front = q->rear = NULL; q->size = 0; }

int dynq_enqueue(DynQueue *q, int val) {
    QNode *n = (QNode*)malloc(sizeof(QNode));
    if (!n) return 0;
    n->data = val;
    n->next = NULL;

    if (!q->rear) {          // empty queue
        q->front = q->rear = n;
    } else {
        q->rear->next = n;   // append to rear
        q->rear = n;
    }
    q->size++;
    return 1;
}

int dynq_dequeue(DynQueue *q, int *out) {
    if (!q->front) return 0;
    *out = q->front->data;
    QNode *temp = q->front;
    q->front = q->front->next;
    if (!q->front) q->rear = NULL;  // queue became empty
    free(temp);
    q->size--;
    return 1;
}

void dynq_free(DynQueue *q) {
    int dummy;
    while (dynq_dequeue(q, &dummy));
}
\`\`\`

### Deque — Double-Ended Queue

\`\`\`c
// Deque = insert/delete from BOTH ends!
// Doubly linked list = perfect for deque

typedef struct DNode {
    int           data;
    struct DNode *prev, *next;
} DNode;

typedef struct {
    DNode *front, *rear;
    int    size;
} Deque;

// pushFront, pushBack, popFront, popBack — all O(1)
void deque_pushFront(Deque *d, int val) {
    DNode *n = (DNode*)malloc(sizeof(DNode));
    n->data = val;
    n->prev = NULL;
    n->next = d->front;
    if (d->front) d->front->prev = n;
    else          d->rear = n;
    d->front = n;
    d->size++;
}
void deque_pushBack(Deque *d, int val) {
    DNode *n = (DNode*)malloc(sizeof(DNode));
    n->data = val;
    n->next = NULL;
    n->prev = d->rear;
    if (d->rear) d->rear->next = n;
    else         d->front = n;
    d->rear = n;
    d->size++;
}
\`\`\`

### Priority Queue (Min-Heap based)

\`\`\`c
// Priority Queue: highest priority element first!
// Min-heap: smallest element = highest priority
#define HEAP_MAX 256

typedef struct {
    int  data[HEAP_MAX];
    int  size;
} MinHeap;

void heap_push(MinHeap *h, int val) {
    int i = h->size++;
    h->data[i] = val;
    // Bubble up
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (h->data[i] < h->data[parent]) {
            int temp = h->data[i]; h->data[i] = h->data[parent]; h->data[parent] = temp;
            i = parent;
        } else break;
    }
}

int heap_pop(MinHeap *h) {
    if (h->size == 0) return -1;
    int min = h->data[0];
    h->data[0] = h->data[--h->size];  // move last to root
    // Bubble down
    int i = 0;
    while (1) {
        int l = 2*i+1, r = 2*i+2, smallest = i;
        if (l < h->size && h->data[l] < h->data[smallest]) smallest = l;
        if (r < h->size && h->data[r] < h->data[smallest]) smallest = r;
        if (smallest == i) break;
        int temp = h->data[i]; h->data[i] = h->data[smallest]; h->data[smallest] = temp;
        i = smallest;
    }
    return min;
}
\`\`\``,

      content_en: `## Queue — First In, First Out!

### Circular Queue

\`\`\`c
#define CAP 8
typedef struct { int d[CAP]; int front,rear,sz; } CQ;
void init(CQ*q){q->front=q->rear=q->sz=0;}
int  enq(CQ*q,int v){if(q->sz==CAP)return 0;q->d[q->rear]=v;q->rear=(q->rear+1)%CAP;q->sz++;return 1;}
int  deq(CQ*q,int*o){if(!q->sz)return 0;*o=q->d[q->front];q->front=(q->front+1)%CAP;q->sz--;return 1;}
\`\`\`

### Linked List Queue

\`\`\`c
typedef struct N{int d;struct N*n;}N;
typedef struct{N*front,*rear;int sz;}Q;
void enqueue(Q*q,int v){
    N*n=malloc(sizeof*n);n->d=v;n->n=NULL;
    if(q->rear)q->rear->n=n;else q->front=n;
    q->rear=n;q->sz++;
}
int dequeue(Q*q){
    if(!q->front)return-1;
    int d=q->front->d;N*t=q->front;
    q->front=t->n;if(!q->front)q->rear=NULL;
    free(t);q->sz--;return d;
}
\`\`\`

### Min-Heap (Priority Queue)

\`\`\`c
// push: append + bubble up   O(log n)
// pop:  return min + bubble down O(log n)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ── Circular Queue ──
#define CAP 10
typedef struct { int d[CAP]; int f,r,sz; } CQ;
void cq_init(CQ*q){q->f=q->r=q->sz=0;}
int  cq_full(CQ*q){return q->sz==CAP;}
int  cq_empty(CQ*q){return q->sz==0;}
int  cq_enq(CQ*q,int v){if(cq_full(q))return 0;q->d[q->r]=v;q->r=(q->r+1)%CAP;q->sz++;return 1;}
int  cq_deq(CQ*q,int*o){if(cq_empty(q))return 0;*o=q->d[q->f];q->f=(q->f+1)%CAP;q->sz--;return 1;}
void cq_print(CQ*q){printf("Q[%d]: ",q->sz);for(int i=0;i<q->sz;i++)printf("%d ",q->d[(q->f+i)%CAP]);printf("\\n");}

// ── Min Heap ──
#define HCAP 256
typedef struct { int d[HCAP]; int sz; } Heap;
void h_init(Heap*h){h->sz=0;}
void h_swap(Heap*h,int a,int b){int t=h->d[a];h->d[a]=h->d[b];h->d[b]=t;}

void h_push(Heap*h,int v){
    int i=h->sz++;  h->d[i]=v;
    while(i>0){int p=(i-1)/2;if(h->d[i]<h->d[p]){h_swap(h,i,p);i=p;}else break;}
}

int h_pop(Heap*h){
    if(!h->sz)return -1;
    int m=h->d[0]; h->d[0]=h->d[--h->sz];
    int i=0;
    while(1){int l=2*i+1,r=2*i+2,s=i;
        if(l<h->sz&&h->d[l]<h->d[s])s=l;
        if(r<h->sz&&h->d[r]<h->d[s])s=r;
        if(s==i)break; h_swap(h,i,s); i=s;
    }
    return m;
}

// ── Task Scheduler using Priority Queue ──
typedef struct {
    int  priority;
    char name[30];
    int  duration;
} Task;

typedef struct { Task d[HCAP]; int sz; } TaskHeap;
void th_init(TaskHeap*h){h->sz=0;}
void th_swap(TaskHeap*h,int a,int b){Task t=h->d[a];h->d[a]=h->d[b];h->d[b]=t;}

void th_push(TaskHeap*h,Task t){
    int i=h->sz++;  h->d[i]=t;
    while(i>0){int p=(i-1)/2;if(h->d[i].priority<h->d[p].priority){th_swap(h,i,p);i=p;}else break;}
}

Task th_pop(TaskHeap*h){
    Task m=h->d[0]; h->d[0]=h->d[--h->sz];
    int i=0;
    while(1){int l=2*i+1,r=2*i+2,s=i;
        if(l<h->sz&&h->d[l].priority<h->d[s].priority)s=l;
        if(r<h->sz&&h->d[r].priority<h->d[s].priority)s=r;
        if(s==i)break; th_swap(h,i,s); i=s;
    }
    return m;
}

// ── BFS using Queue ──
#define V 6
int graph[V][V] = {
    {0,1,1,0,0,0},  // 0 connected to 1,2
    {1,0,0,1,1,0},  // 1 connected to 0,3,4
    {1,0,0,0,0,1},  // 2 connected to 0,5
    {0,1,0,0,0,0},  // 3 connected to 1
    {0,1,0,0,0,0},  // 4 connected to 1
    {0,0,1,0,0,0},  // 5 connected to 2
};

void bfs(int start) {
    int visited[V]={0}, order[V], cnt=0;
    CQ q; cq_init(&q);
    cq_enq(&q,start); visited[start]=1;
    printf("BFS from %d: ",start);
    while(!cq_empty(&q)){
        int node; cq_deq(&q,&node);
        order[cnt++]=node;
        for(int i=0;i<V;i++)
            if(graph[node][i]&&!visited[i]){cq_enq(&q,i);visited[i]=1;}
    }
    for(int i=0;i<cnt;i++) printf("%d%s",order[i],i<cnt-1?"→":"");
    printf("\\n");
}

int main(){
    // Circular Queue
    printf("=== Circular Queue ===\\n");
    CQ q; cq_init(&q);
    for(int i=1;i<=5;i++) cq_enq(&q,i*10);
    cq_print(&q);
    int v; cq_deq(&q,&v); printf("Dequeued: %d\\n",v);
    cq_enq(&q,60); cq_enq(&q,70);
    cq_print(&q);

    // Min Heap
    printf("\\n=== Min Heap (Priority Queue) ===\\n");
    Heap h; h_init(&h);
    int vals[]={30,10,50,20,40,5,25};
    for(int i=0;i<7;i++) h_push(&h,vals[i]);
    printf("Sorted extraction: ");
    while(h.sz) printf("%d ",h_pop(&h));
    printf("\\n");

    // Task Scheduler
    printf("\\n=== Task Scheduler ===\\n");
    TaskHeap th; th_init(&th);
    Task tasks[]={
        {3,"Email Processing",  5},
        {1,"Critical Backup",   30},
        {2,"Database Cleanup",  15},
        {1,"Security Patch",    20},
        {4,"Analytics Report",  45},
        {2,"Cache Refresh",     8},
    };
    for(int i=0;i<6;i++) th_push(&th,tasks[i]);
    printf("Execution order:\\n");
    int t=0;
    while(th.sz){
        Task task=th_pop(&th);
        printf("  t=%-3d [P%d] %-20s (%d min)\\n",t,task.priority,task.name,task.duration);
        t+=task.duration;
    }
    printf("Total time: %d min\\n",t);

    // BFS
    printf("\\n=== BFS Traversal ===\\n");
    bfs(0);
    bfs(3);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

#define CAP 16
typedef struct{int d[CAP];int f,r,sz;}CQ;
void init(CQ*q){q->f=q->r=q->sz=0;}
int enq(CQ*q,int v){if(q->sz==CAP)return 0;q->d[q->r]=v;q->r=(q->r+1)%CAP;q->sz++;return 1;}
int deq(CQ*q){if(!q->sz)return-1;int v=q->d[q->f];q->f=(q->f+1)%CAP;q->sz--;return v;}

#define HC 64
typedef struct{int d[HC];int sz;}Heap;
void push(Heap*h,int v){
    int i=h->sz++;h->d[i]=v;
    while(i>0){int p=(i-1)/2;if(h->d[i]<h->d[p]){int t=h->d[i];h->d[i]=h->d[p];h->d[p]=t;i=p;}else break;}
}
int pop(Heap*h){
    int m=h->d[0];h->d[0]=h->d[--h->sz];
    int i=0;
    for(;;){int l=2*i+1,r=2*i+2,s=i;
        if(l<h->sz&&h->d[l]<h->d[s])s=l;
        if(r<h->sz&&h->d[r]<h->d[s])s=r;
        if(s==i)break;int t=h->d[i];h->d[i]=h->d[s];h->d[s]=t;i=s;}
    return m;
}

int main(){
    CQ q;init(&q);
    for(int i=1;i<=5;i++) enq(&q,i*10);
    printf("Queue: ");
    while(q.sz) printf("%d ",deq(&q));
    printf("\\n");

    Heap h={.sz=0};
    int a[]={30,10,50,20,40};
    for(int i=0;i<5;i++) push(&h,a[i]);
    printf("Sorted: ");
    while(h.sz) printf("%d ",pop(&h));
    printf("\\n");
    return 0;
}`,

      task: {
        description: 'Queue practice: (1) "Hot Potato Game" — n players circle mein hain, m count ke baad player eliminate hota hai (circular queue simulate karo). (2) "Level Order Binary Tree" — tree ko BFS se level-by-level print karo (queue use karo). (3) "Sliding Window Maximum" — array mein k-size window ka maximum har position pe nikalo (deque use karo, O(n)). (4) "Process Scheduler" — Round Robin scheduling simulate karo — har process ko time quantum milti hai, done nahi toh queue ke end mein jaata hai.',
        description_en: 'Queue practice: (1) "Hot Potato Game" — n players in a circle, eliminate the player at count m (simulate with circular queue). (2) "Level Order Binary Tree" — print a tree level-by-level using BFS (use a queue). (3) "Sliding Window Maximum" — find the maximum in every k-size window of an array (use a deque, O(n)). (4) "Process Scheduler" — simulate Round Robin scheduling — each process gets a time quantum; if not done, it goes to the end of the queue.',
        hint: 'Hot Potato: dequeue m times rotating, m-th player eliminated. Sliding window max: deque stores indices, remove front if outside window, remove rear while rear element < current. Round Robin: Process{name,burst_time,remaining}, dequeue, reduce remaining, if>0 re-enqueue.',
        hint_en: 'Hot Potato: dequeue m times rotating, the m-th player is eliminated. Sliding window max: deque stores indices, remove front if outside window, remove rear while rear element < current. Round Robin: Process{name,burst_time,remaining}, dequeue, reduce remaining, if >0 re-enqueue.',
      },
      quiz: [
        {
          q: 'Circular queue linear queue se better kyun hai?',
          options: [
            'Circular faster hai',
            'Linear queue: enqueue pe rear++ → rear reaches end lekin front ne items consume kiye → wasted space! Circular: (rear+1)%CAP — rear wrap around karta hai, empty space reuse hoti hai.',
            'Linear queue overflow nahi hoti',
            'Koi difference nahi',
          ],
          correct: 1,
          explanation: 'Linear queue problem: 8-capacity queue. Enqueue 8 times (rear=8). Dequeue 4 times (front=4). Now: 4 empty spaces at start, rear at end — can\'t enqueue even though 4 slots free! Fix: circular — rear = (rear+1)%CAP. When rear reaches end, wraps to 0 (if front has moved). Empty condition: size==0 (not front==rear). Full: size==CAP.',
          q_en: 'Why is a circular queue better than a linear queue?',
          options_en: [
            'Circular is faster',
            'Linear queue: enqueue advances rear → rear reaches the end but front has consumed items → wasted space! Circular: (rear+1)%CAP — rear wraps around, reusing empty slots.',
            'Linear queues never overflow',
            'No difference',
          ],
          explanation_en: 'Linear queue problem: 8-capacity queue. Enqueue 8 times (rear=8). Dequeue 4 times (front=4). Now: 4 empty spaces at the start, rear at the end — can\'t enqueue even though 4 slots are free! Fix: circular — rear=(rear+1)%CAP. When rear reaches the end, it wraps to 0 (if front has moved). Empty condition: size==0 (not front==rear). Full: size==CAP.',
        },
        {
          q: 'Priority Queue aur regular Queue mein kya difference hai?',
          options: [
            'Priority queue faster hai',
            'Regular Queue: FIFO — pehle aaya pehle gaya. Priority Queue: highest priority pehle jaata hai — FIFO only among same priority. OS process scheduling, Dijkstra\'s algorithm, event simulation mein use.',
            'Priority queue sirf sorted data ke liye',
            'Koi functional difference nahi',
          ],
          correct: 1,
          explanation: 'Regular queue: dequeue always returns oldest element. Priority queue: dequeue returns min (min-heap) ya max (max-heap) priority element. Hospital emergency: critical patients pehle — priority queue! OS: high priority processes CPU pehle paate hain. Implementation: binary heap O(log n) insert/delete vs sorted array O(n) insert O(1) delete vs unsorted array O(1) insert O(n) delete.',
          q_en: 'What is the difference between a priority queue and a regular queue?',
          options_en: [
            'Priority queue is faster',
            'Regular Queue: FIFO — first in, first out. Priority Queue: highest priority leaves first — FIFO only among equal-priority items. Used in OS process scheduling, Dijkstra\'s algorithm, event simulation.',
            'Priority queue is only for sorted data',
            'No functional difference',
          ],
          explanation_en: 'Regular queue: dequeue always returns the oldest element. Priority queue: dequeue returns the min (min-heap) or max (max-heap) priority element. Hospital emergency: critical patients first — priority queue! OS: high-priority processes get the CPU first. Implementation: binary heap O(log n) insert/delete vs sorted array O(n) insert O(1) delete vs unsorted array O(1) insert O(n) delete.',
        },
        {
          q: 'BFS (Breadth-First Search) mein queue kyun use karte hain, stack nahi?',
          options: [
            'Queue faster hai',
            'BFS = level by level explore karo. Queue (FIFO): pehle level ke nodes pehle process. Stack (LIFO) se = DFS (depth first) — ek branch ke end tak jaayega pehle. Shortest path ke liye BFS + queue essential.',
            'Stack BFS mein kaam nahi karta',
            'Graph traversal mein queue required hai',
          ],
          correct: 1,
          explanation: 'BFS property: source se pehle 1 edge wale nodes, phir 2 edge, phir 3... Queue FIFO ensure karta hai ki same level ke nodes pehle process hon. Stack LIFO se: ek neighbour ko poori depth tak explore karega pehle = DFS! Shortest path: BFS first time kisi node pe pahunche = shortest path (unweighted graph). Queue guarantee karta hai yeh property.',
          q_en: 'Why do we use a queue for BFS (Breadth-First Search) and not a stack?',
          options_en: [
            'Queue is faster',
            'BFS = explore level by level. Queue (FIFO): first-level nodes are processed first. Stack (LIFO) = DFS — goes to the end of one branch first. Queue + BFS is essential for shortest paths.',
            'Stack does not work for BFS',
            'Graph traversal requires a queue',
          ],
          explanation_en: 'BFS property: first process nodes 1 edge from source, then 2 edges, then 3... Queue FIFO ensures nodes at the same level are processed first. With a stack LIFO: one neighbour is explored to full depth first = DFS! Shortest path: the first time BFS reaches a node = the shortest path (in an unweighted graph). The queue guarantees this property.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w8-s3',
      title: 'Hash Table — O(1) Lookup ka Magic',
      title_en: 'Hash Table — The Magic of O(1) Lookup',
      emoji: '🔑',
      content: `## Hash Table — Dictionary ka C Version!

Python mein dict, Java mein HashMap, C mein — khud banao!
Average case: O(1) insert, delete, lookup. Blazing fast!

### Hash Function — Key to Index!

\`\`\`c
// Simple hash: string → array index
unsigned int hash(const char *key, int tableSize) {
    unsigned int h = 0;
    while (*key) {
        h = h * 31 + *key++;
    }
    return h % tableSize;
}

// Better: djb2 hash (popular, good distribution)
unsigned long djb2(const char *str) {
    unsigned long hash = 5381;
    int c;
    while ((c = *str++)) {
        hash = ((hash << 5) + hash) + c;  // hash * 33 + c
    }
    return hash;
}

// FNV-1a hash (fast, good distribution)
uint32_t fnv1a(const char *str) {
    uint32_t hash = 2166136261u;
    while (*str) {
        hash ^= (uint8_t)*str++;
        hash *= 16777619u;
    }
    return hash;
}
\`\`\`

### Collision Handling — Chaining

\`\`\`c
#define TABLE_SIZE 64  // power of 2 for efficiency

typedef struct Entry {
    char         key[64];
    int          value;
    struct Entry *next;  // chaining for collisions
} Entry;

typedef struct {
    Entry   *buckets[TABLE_SIZE];
    int      count;
    float    loadFactor;  // count / TABLE_SIZE
} HashMap;

void   hm_init  (HashMap *hm) { memset(hm->buckets, 0, sizeof(hm->buckets)); hm->count = 0; }

// Hash function
int hm_hash(const char *key) {
    unsigned long h = 5381;
    while (*key) h = h*33 + *key++;
    return h % TABLE_SIZE;
}

// Insert or update — O(1) average
void hm_set(HashMap *hm, const char *key, int value) {
    int idx = hm_hash(key);
    Entry *e = hm->buckets[idx];

    // Update if exists
    while (e) {
        if (strcmp(e->key, key) == 0) { e->value = value; return; }
        e = e->next;
    }

    // Insert new entry
    Entry *new_e = (Entry*)malloc(sizeof(Entry));
    strncpy(new_e->key, key, 63);
    new_e->value = value;
    new_e->next  = hm->buckets[idx];  // prepend to chain
    hm->buckets[idx] = new_e;
    hm->count++;
    hm->loadFactor = (float)hm->count / TABLE_SIZE;
}

// Lookup — O(1) average
int* hm_get(HashMap *hm, const char *key) {
    int idx = hm_hash(key);
    Entry *e = hm->buckets[idx];
    while (e) {
        if (strcmp(e->key, key) == 0) return &e->value;
        e = e->next;
    }
    return NULL;  // not found
}

// Delete — O(1) average
int hm_delete(HashMap *hm, const char *key) {
    int idx = hm_hash(key);
    Entry **ep = &hm->buckets[idx];
    while (*ep) {
        if (strcmp((*ep)->key, key) == 0) {
            Entry *del = *ep;
            *ep = del->next;
            free(del);
            hm->count--;
            return 1;
        }
        ep = &(*ep)->next;
    }
    return 0;  // not found
}

void hm_free(HashMap *hm) {
    for (int i = 0; i < TABLE_SIZE; i++) {
        Entry *e = hm->buckets[i];
        while (e) { Entry *next = e->next; free(e); e = next; }
        hm->buckets[i] = NULL;
    }
    hm->count = 0;
}
\`\`\`

### Open Addressing — Linear Probing

\`\`\`c
// No linked list — collision pe next empty slot dhundo!
#define OA_SIZE 16

typedef struct {
    char key[64];
    int  value;
    int  occupied;  // 1=valid, 0=empty, -1=deleted
} OAEntry;

typedef struct {
    OAEntry slots[OA_SIZE];
    int     count;
} OAHashMap;

int oa_find_slot(OAHashMap *m, const char *key) {
    int idx = djb2(key) % OA_SIZE;
    int start = idx;
    do {
        if (!m->slots[idx].occupied)      return idx;   // empty slot
        if (m->slots[idx].occupied == 1 &&
            strcmp(m->slots[idx].key, key) == 0)
                                          return idx;   // found!
        idx = (idx + 1) % OA_SIZE;        // linear probe
    } while (idx != start);
    return -1;  // table full
}
\`\`\`

### Hash Table Analysis

\`\`\`
Operation    Average   Worst Case
──────────────────────────────────
Insert        O(1)       O(n)
Delete        O(1)       O(n)
Search        O(1)       O(n)
Space         O(n)       O(n)

Worst case: all keys hash to same bucket = linked list scan
Load factor: count/capacity — keep < 0.7 for good performance
Rehashing: when load factor too high, create bigger table + reinsert all
\`\`\``,

      content_en: `## Hash Table — The C Version of a Dictionary!

### Hash Function

\`\`\`c
// djb2 — popular, good distribution
unsigned long djb2(const char *s) {
    unsigned long h=5381; int c;
    while((c=*s++)) h=h*33+c;
    return h;
}
\`\`\`

### Chaining HashMap

\`\`\`c
#define SZ 64
typedef struct E{char k[64];int v;struct E*n;}E;
typedef struct{E*b[SZ];int cnt;}HM;

void hm_set(HM*m,const char*k,int v){
    int i=djb2(k)%SZ; E*e=m->b[i];
    while(e){if(!strcmp(e->k,k)){e->v=v;return;}e=e->n;}
    E*n=malloc(sizeof*n);strncpy(n->k,k,63);n->v=v;n->n=m->b[i];m->b[i]=n;m->cnt++;
}
int* hm_get(HM*m,const char*k){
    E*e=m->b[djb2(k)%SZ];
    while(e){if(!strcmp(e->k,k))return&e->v;e=e->n;}
    return NULL;
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define TABLE_SZ 128

// ── djb2 hash ──
static uint32_t hash_key(const char *s){
    uint32_t h=5381; while(*s) h=h*33+(uint8_t)*s++;
    return h % TABLE_SZ;
}

typedef struct Entry {
    char         key[64];
    char         val[128];
    int          count;  // for frequency counter
    struct Entry *next;
} Entry;

typedef struct {
    Entry *b[TABLE_SZ];
    int    size;
} HashMap;

HashMap* hm_new() { return (HashMap*)calloc(1,sizeof(HashMap)); }

void hm_set(HashMap *m, const char *k, const char *v) {
    uint32_t i=hash_key(k);
    for(Entry *e=m->b[i];e;e=e->next)
        if(!strcmp(e->key,k)){strncpy(e->val,v,127);return;}
    Entry *e=(Entry*)malloc(sizeof(Entry));
    strncpy(e->key,k,63); strncpy(e->val,v,127);
    e->count=1; e->next=m->b[i]; m->b[i]=e; m->size++;
}

const char* hm_get(HashMap *m, const char *k) {
    for(Entry *e=m->b[hash_key(k)];e;e=e->next)
        if(!strcmp(e->key,k)) return e->val;
    return NULL;
}

int hm_del(HashMap *m, const char *k) {
    uint32_t i=hash_key(k);
    Entry **pp=&m->b[i];
    while(*pp){ if(!strcmp((*pp)->key,k)){Entry*t=*pp;*pp=t->next;free(t);m->size--;return 1;} pp=&(*pp)->next;}
    return 0;
}

// ── Word frequency counter ──
void wc_add(HashMap *m, const char *word) {
    uint32_t i=hash_key(word);
    for(Entry *e=m->b[i];e;e=e->next)
        if(!strcmp(e->key,word)){e->count++;return;}
    Entry *e=(Entry*)malloc(sizeof(Entry));
    strncpy(e->key,word,63); e->val[0]=0; e->count=1;
    e->next=m->b[i]; m->b[i]=e; m->size++;
}

void wc_print(HashMap *m) {
    // Collect all entries
    Entry *all[512]; int n=0;
    for(int i=0;i<TABLE_SZ;i++)
        for(Entry *e=m->b[i];e;e=e->next) if(n<512) all[n++]=e;
    // Sort by count desc
    for(int i=0;i<n-1;i++)
        for(int j=0;j<n-i-1;j++)
            if(all[j]->count<all[j+1]->count){Entry*t=all[j];all[j]=all[j+1];all[j+1]=t;}
    printf("%-20s %s\\n","Word","Count");
    printf("────────────────────────────\\n");
    for(int i=0;i<n&&i<15;i++) printf("%-20s %d\\n",all[i]->key,all[i]->count);
}

void hm_stats(HashMap *m) {
    int empty=0,max_chain=0;
    for(int i=0;i<TABLE_SZ;i++){
        int len=0; for(Entry*e=m->b[i];e;e=e->next)len++;
        if(!len)empty++;
        if(len>max_chain)max_chain=len;
    }
    printf("HashMap: size=%d, buckets=%d, empty=%d, max_chain=%d, load=%.2f\\n",
           m->size, TABLE_SZ, empty, max_chain, (float)m->size/TABLE_SZ);
}

void hm_free(HashMap *m){
    for(int i=0;i<TABLE_SZ;i++){Entry*e=m->b[i],*t;while(e){t=e->next;free(e);e=t;}}
    free(m);
}

int main(){
    // ── Phone book ──
    printf("=== Phone Book ===\\n");
    HashMap *book=hm_new();
    hm_set(book,"Rahul Sharma",  "9876543210");
    hm_set(book,"Priya Patel",   "9876543211");
    hm_set(book,"Aryan Singh",   "9876543212");
    hm_set(book,"Sneha Nair",    "9876543213");
    hm_set(book,"Vikram Rao",    "9876543214");

    const char *names[]={"Rahul Sharma","Priya Patel","Unknown Person"};
    for(int i=0;i<3;i++){
        const char *ph=hm_get(book,names[i]);
        printf("%-20s → %s\\n",names[i],ph?ph:"NOT FOUND");
    }

    hm_set(book,"Rahul Sharma","9999999999");  // update
    printf("Updated: Rahul → %s\\n",hm_get(book,"Rahul Sharma"));
    hm_del(book,"Aryan Singh");
    printf("Deleted: Aryan → %s\\n",hm_get(book,"Aryan Singh")?hm_get(book,"Aryan Singh"):"NOT FOUND");
    hm_stats(book);

    // ── Word frequency ──
    printf("\\n=== Word Frequency Counter ===\\n");
    const char *text="the quick brown fox jumps over the lazy dog the fox was quick and the dog was lazy";
    HashMap *wc=hm_new();
    char buf[32], *p=(char*)text;
    while(sscanf(p,"%31s",buf)==1){
        wc_add(wc,buf);
        p+=strlen(buf)+1;
    }
    wc_print(wc);
    hm_stats(wc);

    hm_free(book); hm_free(wc);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SZ 64
typedef struct E{char k[32];int v;struct E*n;}E;
typedef struct{E*b[SZ];int cnt;}HM;

static unsigned hash(const char*s){unsigned h=5381;while(*s)h=h*33+(unsigned char)*s++;return h%SZ;}

void set(HM*m,const char*k,int v){
    unsigned i=hash(k);E*e=m->b[i];
    while(e){if(!strcmp(e->k,k)){e->v=v;return;}e=e->n;}
    E*n=calloc(1,sizeof*n);strncpy(n->k,k,31);n->v=v;n->n=m->b[i];m->b[i]=n;m->cnt++;
}
int* get(HM*m,const char*k){E*e=m->b[hash(k)];while(e){if(!strcmp(e->k,k))return&e->v;e=e->n;}return NULL;}
int  del(HM*m,const char*k){
    unsigned i=hash(k);E**pp=&m->b[i];
    while(*pp){if(!strcmp((*pp)->k,k)){E*t=*pp;*pp=t->n;free(t);m->cnt--;return 1;}pp=&(*pp)->n;}
    return 0;
}

int main(){
    HM m={0};
    set(&m,"Alice",90);set(&m,"Bob",85);set(&m,"Carol",92);
    int*v=get(&m,"Alice"); printf("Alice: %d\\n",v?*v:-1);
    v=get(&m,"Dave"); printf("Dave: %s\\n",v?"found":"not found");
    del(&m,"Bob");
    v=get(&m,"Bob"); printf("Bob after del: %s\\n",v?"found":"not found");
    printf("Count: %d\\n",m.cnt);
    return 0;
}`,

      task: {
        description: 'Hash Table practice: (1) "Two Sum Problem" — array mein do numbers find karo jinki sum target ho — hash table se O(n). (2) "Group Anagrams" — words ki list lo, anagrams ko group karo — sorted word as key. (3) "LRU Cache" — Least Recently Used cache implement karo (Hash Table + Doubly Linked List). get(key) O(1), put(key,val) O(1) with capacity limit. (4) "Frequency Sort" — array ke elements ko frequency ke hisaab se sort karo (hash table se frequency count karo, then sort).',
        description_en: 'Hash Table practice: (1) "Two Sum Problem" — find two numbers in an array that add up to a target — O(n) using a hash table. (2) "Group Anagrams" — given a list of words, group the anagrams — use the sorted word as the key. (3) "LRU Cache" — implement a Least Recently Used cache (Hash Table + Doubly Linked List). get(key) O(1), put(key,val) O(1) with capacity limit. (4) "Frequency Sort" — sort array elements by frequency (count with hash table, then sort).',
        hint: 'Two Sum: for each num, check if (target-num) exists in hashmap, if yes found, else insert num→index. LRU: doubly linked list for order (most recent=front), hashmap key→node pointer. Evict: remove from list tail + hashmap.',
        hint_en: 'Two Sum: for each num, check if (target-num) exists in the hashmap; if yes, found; otherwise insert num→index. LRU: doubly linked list for order (most recent=front), hashmap key→node pointer. Evict: remove from list tail + hashmap.',
      },
      quiz: [
        {
          q: 'Hash collision kya hai aur chaining se kaise handle karte hain?',
          options: [
            'Program crash karta hai',
            'Do alag keys ka same hash value — same bucket pe dono. Chaining: ek linked list us bucket pe — nayi entry prepend karo. Lookup: bucket mein iterate karke key compare karo.',
            'Hash function change karo',
            'Collision impossible hai',
          ],
          correct: 1,
          explanation: '"apple" aur "orange" dono hash to index 7. Chaining: bucket 7 pe linked list → apple → orange → NULL. Lookup "apple": bucket 7 → iterate → match found. Worst case: sab keys ek bucket mein = O(n). Avoid: good hash function + low load factor (< 0.7). Open addressing: alternative — next empty slot dhundo (no extra memory).',
          q_en: 'What is a hash collision and how is it handled with chaining?',
          options_en: [
            'The program crashes',
            'Two different keys produce the same hash value — both go to the same bucket. Chaining: a linked list at that bucket — prepend the new entry. Lookup: iterate the bucket\'s list and compare keys.',
            'Change the hash function',
            'Collisions are impossible',
          ],
          explanation_en: '"apple" and "orange" both hash to index 7. Chaining: bucket 7 has a linked list → apple → orange → NULL. Looking up "apple": bucket 7 → iterate → match found. Worst case: all keys in one bucket = O(n). Prevention: a good hash function + low load factor (< 0.7). Open addressing: an alternative — find the next empty slot (no extra memory).',
        },
        {
          q: 'Load factor hash table mein kya measure karta hai aur ideal value kya hai?',
          options: [
            'Table ka total size',
            'Load factor = inserted_elements / table_capacity. > 0.7: collisions badhne lagte hain, performance degrade. < 0.3: memory waste. Ideal: 0.5-0.7. Too high → rehash (new bigger table mein sab move karo).',
            'Hash function quality',
            'Memory usage in bytes',
          ],
          correct: 1,
          explanation: 'Load factor = n/m (n elements, m buckets). 0.7 threshold common: chaining 0.7 pe average chain length ≈ 0.7. Open addressing 0.5 pe preferred. Rehashing: new table (2× size), sab elements reinsert. O(n) one-time cost, amortized O(1). Python dict: rehashes at 0.67. Java HashMap: 0.75. C++ unordered_map: 1.0 default.',
          q_en: 'What does the load factor measure in a hash table and what is the ideal value?',
          options_en: [
            'The total size of the table',
            'Load factor = inserted_elements / table_capacity. Above 0.7: collisions increase, performance degrades. Below 0.3: memory wasted. Ideal: 0.5–0.7. Too high → rehash (move everything to a new, larger table).',
            'Hash function quality',
            'Memory usage in bytes',
          ],
          explanation_en: 'Load factor = n/m (n elements, m buckets). 0.7 is a common threshold: at 0.7 with chaining, the average chain length ≈ 0.7. Open addressing prefers 0.5. Rehashing: create a new table (2× size), reinsert all elements. One-time O(n) cost, amortised O(1). Python dict rehashes at 0.67. Java HashMap: 0.75. C++ unordered_map: 1.0 default.',
        },
        {
          q: 'Hash table Array aur Linked List se kab better choice hai?',
          options: [
            'Hamesha hash table',
            'Key-value lookup O(1) chahiye, order matter nahi, keys hain (strings/ints) — hash table. Ordered traversal, range queries — array/BST better. Small data (<10 elements) — array linear scan faster (cache).',
            'Hash table always slower',
            'Linked list better hai lookups ke liye',
          ],
          correct: 1,
          explanation: 'Hash table wins: key-value store, word frequency, cache, deduplication, set membership. Array wins: sorted data needed, range queries (arr[3..7]), sequential access (cache-friendly), very small data. Linked list wins: frequent insert/delete at arbitrary positions, unknown size. Real: Python dict (hash table), database B-tree index (sorted), OS process list (linked list).',
          q_en: 'When is a hash table a better choice than an array or linked list?',
          options_en: [
            'Always a hash table',
            'When you need O(1) key-value lookup, order does not matter, and you have keys (strings/ints) — hash table. Ordered traversal, range queries — array/BST is better. Small data (<10 elements) — array linear scan is faster (cache).',
            'Hash tables are always slower',
            'Linked list is better for lookups',
          ],
          explanation_en: 'Hash table wins: key-value stores, word frequency, caches, deduplication, set membership. Array wins: sorted data needed, range queries (arr[3..7]), sequential access (cache-friendly), very small data. Linked list wins: frequent insert/delete at arbitrary positions, unknown size. Real world: Python dict (hash table), database B-tree index (sorted), OS process list (linked list).',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w8-s4',
      title: 'Month 2 Capstone — Complete Data Structures Library',
      title_en: 'Month 2 Capstone — Complete Data Structures Library',
      emoji: '🏆',
      content: `## Month 2 Capstone — Ek Complete DS Library Banao!

### Month 2 Summary:
\`\`\`
✅ Week 5: struct, union, enum, linked list
✅ Week 6: File I/O, binary files, error handling
✅ Week 7: Preprocessor, macros, bitwise
✅ Week 8: Stack, queue, hash table, priority queue
\`\`\`

### Capstone: studyearn_ds.h — Complete DS Library

\`\`\`c
// ── studyearn_ds.h ──
#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ════════════════════════════════════════════════
// GENERICS using void* pointers
// ════════════════════════════════════════════════

// Generic stack (any type)
typedef struct {
    void  **data;      // array of void pointers
    int     top;
    int     capacity;
    size_t  elemSize;  // size of each element
} GenStack;

GenStack* gs_create(int cap, size_t elemSize) {
    GenStack *s = (GenStack*)malloc(sizeof(GenStack));
    s->data     = (void**)malloc(cap * sizeof(void*));
    s->top      = -1;
    s->capacity = cap;
    s->elemSize = elemSize;
    return s;
}

int gs_push(GenStack *s, const void *elem) {
    if (s->top >= s->capacity-1) {
        // Auto-resize!
        s->capacity *= 2;
        s->data = (void**)realloc(s->data, s->capacity * sizeof(void*));
    }
    void *copy = malloc(s->elemSize);
    memcpy(copy, elem, s->elemSize);
    s->data[++s->top] = copy;
    return 1;
}

int gs_pop(GenStack *s, void *out) {
    if (s->top < 0) return 0;
    memcpy(out, s->data[s->top], s->elemSize);
    free(s->data[s->top--]);
    return 1;
}

void gs_free(GenStack *s) {
    for (int i = 0; i <= s->top; i++) free(s->data[i]);
    free(s->data);
    free(s);
}
\`\`\`

### Generic Queue

\`\`\`c
typedef struct QNode {
    void        *data;
    struct QNode *next;
} QNode;

typedef struct {
    QNode  *front, *rear;
    int     size;
    size_t  elemSize;
} GenQueue;

GenQueue* gq_create(size_t elemSize) {
    GenQueue *q = (GenQueue*)calloc(1, sizeof(GenQueue));
    q->elemSize = elemSize;
    return q;
}

int gq_enqueue(GenQueue *q, const void *elem) {
    QNode *n = (QNode*)malloc(sizeof(QNode));
    n->data   = malloc(q->elemSize);
    memcpy(n->data, elem, q->elemSize);
    n->next   = NULL;
    if (!q->rear) q->front = q->rear = n;
    else { q->rear->next = n; q->rear = n; }
    q->size++;
    return 1;
}

int gq_dequeue(GenQueue *q, void *out) {
    if (!q->front) return 0;
    memcpy(out, q->front->data, q->elemSize);
    QNode *t = q->front;
    q->front = t->next;
    if (!q->front) q->rear = NULL;
    free(t->data); free(t);
    q->size--;
    return 1;
}
\`\`\`

### Month 3 Preview — Trees aur Algorithms!

\`\`\`
Month 3 (Weeks 9-12):

  Week 9:  Binary Search Tree (BST)
    - BST insert, delete, search
    - Inorder, preorder, postorder traversal
    - BST validation, height
    - AVL Tree basics (self-balancing)

  Week 10: Sorting Algorithms (Master Class)
    - Bubble, Selection, Insertion (O(n²))
    - Merge Sort, Quick Sort (O(n log n))
    - Heap Sort, Radix Sort
    - When to use what

  Week 11: Graphs + Advanced Topics
    - Graph representation (adjacency matrix/list)
    - DFS + BFS implementation
    - Dijkstra's shortest path
    - Topological sort

  Week 12: Final Project + Certificate
    - Complete system combining all DS
    - Performance benchmarking
    - Memory profiling
    - Certificate! 🎓
\`\`\``,

      content_en: `## Month 2 Capstone — Build a Complete DS Library!

### Generic Data Structures with void*

\`\`\`c
// Type-agnostic stack
typedef struct { void**data; int top,cap; size_t esz; } GenStack;

GenStack* gs_new(int cap, size_t esz){
    GenStack*s=malloc(sizeof*s);
    s->data=malloc(cap*sizeof(void*));s->top=-1;s->cap=cap;s->esz=esz;
    return s;
}
void gs_push(GenStack*s,const void*e){
    if(s->top>=s->cap-1){s->cap*=2;s->data=realloc(s->data,s->cap*sizeof(void*));}
    void*c=malloc(s->esz);memcpy(c,e,s->esz);s->data[++s->top]=c;
}
int gs_pop(GenStack*s,void*o){
    if(s->top<0)return 0;
    memcpy(o,s->data[s->top],s->esz);free(s->data[s->top--]);return 1;
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>

// ═══════════════════════════════════════════════════════════
// COMPLETE DATA STRUCTURES BENCHMARK
// Stack, Queue, Hash Table performance comparison
// ═══════════════════════════════════════════════════════════

#define N 100000

// ── Time measurement ──
double getTimeMs() {
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec * 1000.0 + ts.tv_nsec / 1e6;
}

// ── Compact Stack ──
typedef struct { int *d; int t,cap; } Stack;
Stack* st_new(int c){Stack*s=malloc(sizeof*s);s->d=malloc(c*4);s->t=-1;s->cap=c;return s;}
void st_push(Stack*s,int v){if(s->t>=s->cap-1){s->cap*=2;s->d=realloc(s->d,s->cap*4);}s->d[++s->t]=v;}
int  st_pop(Stack*s){return s->t<0?-1:s->d[s->t--];}
int  st_peek(Stack*s){return s->t>=0?s->d[s->t]:-1;}
void st_free(Stack*s){free(s->d);free(s);}

// ── Compact Queue ──
typedef struct N{int d;struct N*n;}QN;
typedef struct{QN*f,*r;int sz;}Queue;
void q_init(Queue*q){q->f=q->r=NULL;q->sz=0;}
void q_enq(Queue*q,int v){QN*n=malloc(sizeof*n);n->d=v;n->n=NULL;if(q->r)q->r->n=n;else q->f=n;q->r=n;q->sz++;}
int  q_deq(Queue*q){if(!q->f)return-1;int d=q->f->d;QN*t=q->f;q->f=t->n;if(!q->f)q->r=NULL;free(t);q->sz--;return d;}
void q_free(Queue*q){while(q->f){QN*t=q->f->n;free(q->f);q->f=t;}}

// ── Compact HashMap ──
#define HM_SZ 1024
typedef struct E{int k;int v;struct E*n;}HME;
typedef struct{HME*b[HM_SZ];int cnt;}HMap;
HMap* hm_new(){return calloc(1,sizeof(HMap));}
void  hm_set(HMap*m,int k,int v){
    int i=((uint32_t)k*2654435761u)%HM_SZ;
    for(HME*e=m->b[i];e;e=e->n)if(e->k==k){e->v=v;return;}
    HME*e=malloc(sizeof*e);e->k=k;e->v=v;e->n=m->b[i];m->b[i]=e;m->cnt++;
}
int* hm_get(HMap*m,int k){
    int i=((uint32_t)k*2654435761u)%HM_SZ;
    for(HME*e=m->b[i];e;e=e->n)if(e->k==k)return&e->v;
    return NULL;
}
void hm_free(HMap*m){for(int i=0;i<HM_SZ;i++){HME*e=m->b[i],*t;while(e){t=e->n;free(e);e=t;}}free(m);}

void runBenchmark() {
    double t0,t1;
    printf("%-20s %-12s %-12s\\n","Operation","Time(ms)","Ops/sec");
    printf("──────────────────────────────────────────────\\n");

    // Stack benchmark
    Stack *st=st_new(16); t0=getTimeMs();
    for(int i=0;i<N;i++) st_push(st,i);
    for(int i=0;i<N;i++) st_pop(st);
    t1=getTimeMs()-t0;
    printf("%-20s %-12.2f %-12.0f\\n","Stack push+pop",t1,(2.0*N*1000)/t1);
    st_free(st);

    // Queue benchmark
    Queue q; q_init(&q); t0=getTimeMs();
    for(int i=0;i<N;i++) q_enq(&q,i);
    for(int i=0;i<N;i++) q_deq(&q);
    t1=getTimeMs()-t0;
    printf("%-20s %-12.2f %-12.0f\\n","Queue enq+deq",t1,(2.0*N*1000)/t1);
    q_free(&q);

    // HashMap benchmark
    HMap *hm=hm_new(); t0=getTimeMs();
    for(int i=0;i<N;i++) hm_set(hm,i,i*i);
    int hits=0;
    for(int i=0;i<N;i++) { int*v=hm_get(hm,i); if(v&&*v==i*i) hits++; }
    t1=getTimeMs()-t0;
    printf("%-20s %-12.2f %-12.0f\\n","HashMap set+get",t1,(2.0*N*1000)/t1);
    printf("  Hash map hits: %d/%d (%.1f%%)\\n",hits,N,(float)hits/N*100);
    printf("  HashMap count: %d, load: %.2f\\n",hm->cnt,(float)hm->cnt/HM_SZ);
    hm_free(hm);
}

// ── Practical demo: Expression evaluator ──
int evalExpr(const char *expr) {
    Stack *nums=st_new(64), *ops=st_new(64);
    int prec(int op){return (op=='*'||op=='/')?2:(op=='+'||op=='-')?1:0;}
    void applyOp(){
        int b=st_pop(nums),a=st_pop(nums),op=st_pop(ops);
        st_push(nums,op=='+'?a+b:op=='-'?a-b:op=='*'?a*b:b?a/b:0);
    }
    for(int i=0;expr[i];i++){
        if(expr[i]==' ')continue;
        if(expr[i]>='0'&&expr[i]<='9'){
            int n=0;
            while(expr[i]>='0'&&expr[i]<='9')n=n*10+(expr[i++]-'0');
            st_push(nums,n);i--;
        } else if(expr[i]=='('){st_push(ops,'(');
        } else if(expr[i]==')'){while(st_peek(ops)!='(')applyOp();st_pop(ops);
        } else {while(!st_peek(ops)<0||prec(st_peek(ops))>=prec(expr[i]))applyOp();st_push(ops,expr[i]);}
    }
    while(st_peek(ops)>=0)applyOp();
    int result=st_pop(nums); st_free(nums);st_free(ops); return result;
}

int main(){
    printf("=== Month 2 Capstone: DS Benchmark ===\\n\\n");
    runBenchmark();

    printf("\\n=== Expression Evaluator ===\\n");
    const char *exprs[]={"3+4*2","10-2*3+1","(2+3)*4"};
    int expected[]={11,5,20};
    for(int i=0;i<3;i++){
        int r=evalExpr(exprs[i]);
        printf("%-15s = %-5d %s\\n",exprs[i],r,r==expected[i]?"✅":"❌");
    }

    return 0;
}`,

      codeExample_en: `/* See above — full benchmark and expression evaluator */`,

      task: {
        description: 'Month 2 Final Capstone: (1) "Generic Container Library" — void* based stack, queue, linked list banao jo koi bhi type store kare. Type-safe wrappers macros se. (2) "Mini Database" — hash table + binary file storage combine karo — records insert/update/delete/search karo in-memory (hash table), persist to disk (binary file). (3) "Performance Analyzer" — apni implementations (Stack, Queue, HashMap) ko N elements ke saath benchmark karo — time per operation, memory usage, throughput measure karo.',
        description_en: 'Month 2 Final Capstone: (1) "Generic Container Library" — build void*-based stack, queue, linked list that store any type. Type-safe wrappers via macros. (2) "Mini Database" — combine hash table + binary file storage — insert/update/delete/search records in-memory (hash table), persist to disk (binary file). (3) "Performance Analyzer" — benchmark your implementations (Stack, Queue, HashMap) with N elements — measure time per operation, memory usage, and throughput.',
        hint: 'Generic stack: use memcpy for element copy, sizeof for size. Type-safe wrapper: #define INT_PUSH(s,v) ({int _v=(v); gs_push(s,&_v);}). Benchmark: clock_gettime(CLOCK_MONOTONIC,...) for nanosecond precision. Mini DB: hash table for in-memory, fwrite/fread for disk.',
        hint_en: 'Generic stack: use memcpy for element copy, sizeof for size. Type-safe wrapper: #define INT_PUSH(s,v) ({int _v=(v); gs_push(s,&_v);}). Benchmark: clock_gettime(CLOCK_MONOTONIC,...) for nanosecond precision. Mini DB: hash table for in-memory, fwrite/fread for disk.',
      },
      quiz: [
        {
          q: 'Month 2 mein kaunse major data structures aur concepts cover kiye?',
          options: [
            'Sirf arrays',
            'Struct/Union/Enum, Linked Lists (singly+doubly), File I/O (text+binary), Preprocessor/Macros, Bitwise, Stack, Queue (circular+priority), Hash Table — complete foundation!',
            'Sirf sorting algorithms',
            'Sirf file handling',
          ],
          correct: 1,
          explanation: 'Month 2 = data structures + systems programming: (1) Custom types (struct,union,enum). (2) Dynamic DS (linked list). (3) Persistence (file I/O). (4) Meta-programming (preprocessor,macros). (5) Low-level (bitwise,bitfields). (6) Classic DS (stack,queue,hash table). Month 3 ka plan: trees (BST,AVL), sorting algorithms master class, graphs, final project.',
          q_en: 'Which major data structures and concepts were covered in Month 2?',
          options_en: [
            'Only arrays',
            'Struct/Union/Enum, Linked Lists (singly+doubly), File I/O (text+binary), Preprocessor/Macros, Bitwise, Stack, Queue (circular+priority), Hash Table — complete foundation!',
            'Only sorting algorithms',
            'Only file handling',
          ],
          explanation_en: 'Month 2 = data structures + systems programming: (1) Custom types (struct, union, enum). (2) Dynamic DS (linked list). (3) Persistence (file I/O). (4) Meta-programming (preprocessor, macros). (5) Low-level (bitwise, bitfields). (6) Classic DS (stack, queue, hash table). Month 3 plan: trees (BST, AVL), sorting algorithm master class, graphs, final project.',
        },
        {
          q: 'void* pointers C mein generics ke liye kyun use karte hain?',
          options: [
            'void* pointers sirf NULL ke liye hain',
            'void* = type-less pointer — kisi bhi type ko point kar sakta hai. Generic container (stack, queue) jo koi bhi type store kare. memcpy se elements copy karo. Type safety lost — manually track karo ya macros se wrapper banao.',
            'void* faster hai',
            'C mein generics possible nahi',
          ],
          correct: 1,
          explanation: 'C mein no templates (like C++) ya generics (like Java). void* se workaround: element ka address lo (void*), store karo, memcpy se copy karo. Type check manually: element size pass karo (elemSize = sizeof(int)). Usage: C standard library mein qsort(void *base, size_t n, size_t size, comparator) — same pattern! Trade-off: type safety lost, slight overhead for copying.',
          q_en: 'Why use void* pointers for generics in C?',
          options_en: [
            'void* pointers are only for NULL',
            'void* = typeless pointer — can point to any type. Generic containers (stack, queue) that store any type. Copy elements with memcpy. Type safety is lost — track it manually or use macro wrappers.',
            'void* is faster',
            'Generics are not possible in C',
          ],
          explanation_en: 'C has no templates (like C++) or generics (like Java). The void* workaround: take the address of an element (void*), store it, copy with memcpy. Track types manually: pass element size (elemSize = sizeof(int)). Used in the C standard library: qsort(void *base, size_t n, size_t size, comparator) — same pattern! Trade-off: type safety is lost, slight overhead for copying.',
        },
        {
          q: 'Stack aur Queue ke time complexities compare karo — push/pop vs enqueue/dequeue?',
          options: [
            'Queue O(n) hai',
            'Dono O(1) for all main operations! Array stack: push/pop O(1). Linked list queue: enqueue O(1) (rear pointer), dequeue O(1) (front pointer). Priority queue different: push/pop O(log n) (heap).',
            'Stack O(n) hai',
            'Depends on implementation',
          ],
          correct: 1,
          explanation: 'Array Stack: push = data[++top] O(1). pop = data[top--] O(1). Linked Queue: enqueue = rear->next=new; rear=new O(1). dequeue = temp=front; front=front->next O(1). Key insight: queue ka O(1) enqueue+dequeue REQUIRES tail pointer. Bina tail: enqueue O(n) (traverse to end). Priority Queue: binary heap — push O(log n) bubble up, pop O(log n) bubble down.',
          q_en: 'Compare the time complexities of stack and queue — push/pop vs enqueue/dequeue?',
          options_en: [
            'Queue is O(n)',
            'Both O(1) for all main operations! Array stack: push/pop O(1). Linked list queue: enqueue O(1) (rear pointer), dequeue O(1) (front pointer). Priority queue is different: push/pop O(log n) (heap).',
            'Stack is O(n)',
            'Depends on implementation',
          ],
          explanation_en: 'Array Stack: push = data[++top] O(1). pop = data[top--] O(1). Linked Queue: enqueue = rear->next=new; rear=new O(1). dequeue = temp=front; front=front->next O(1). Key insight: O(1) enqueue + dequeue in a queue REQUIRES a tail pointer. Without a tail: enqueue is O(n) (traverse to end). Priority Queue: binary heap — push O(log n) bubble up, pop O(log n) bubble down.',
        },
      ],
    },
  ],
};