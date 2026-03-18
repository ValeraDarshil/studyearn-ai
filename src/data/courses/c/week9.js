/**
 * StudyEarn AI — C Programming Course
 * Week 9: Binary Search Tree aur AVL Tree — Tree Data Structures
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_9 = {
  week: 9,
  title: 'Binary Trees aur BST — Tree Data Structures',
  title_en: 'Binary Trees and BST — Tree Data Structures',
  description: 'Binary tree, BST insert/delete/search, tree traversals, AVL self-balancing tree — hierarchical data efficiently manage karo!',
  description_en: 'Binary tree, BST insert/delete/search, tree traversals, AVL self-balancing tree — manage hierarchical data efficiently!',
  xpReward: 270,
  sections: [
    {
      id: 'c-w9-s1',
      title: 'Binary Tree — Basics aur Traversals',
      title_en: 'Binary Tree — Basics and Traversals',
      emoji: '🌳',
      content: `## Binary Tree — Hierarchical Data Structure!

Tree = hierarchical structure jisme ek node ke maximum 2 children hote hain.

### Why Trees?
\`\`\`
Real World Uses:
  File System        ← folders/files hierarchy
  HTML DOM           ← webpage element tree
  Organization Chart ← company hierarchy
  Decision Trees     ← AI/ML
  Expression Trees   ← compiler (3+4*2)
  Database Indexes   ← B-trees for fast lookup
  Huffman Coding     ← file compression
\`\`\`

### Tree Terminology

\`\`\`
        [10]          ← Root (koi parent nahi)
       /    \\
     [5]   [15]       ← Internal nodes
    /   \\    \\
  [3]  [7]  [20]     ← Leaf nodes (koi child nahi)

Root     = topmost node (10)
Leaf     = node with no children (3, 7, 20)
Height   = longest root-to-leaf path = 2
Depth    = distance from root (10=0, 5=1, 3=2)
Level    = set of nodes at same depth
Parent   = node above (5 is parent of 3, 7)
Child    = node below (3, 7 are children of 5)
Subtree  = node + all descendants
\`\`\`

### Binary Tree Node

\`\`\`c
typedef struct BTNode {
    int            data;
    struct BTNode *left;
    struct BTNode *right;
} BTNode;

// Create node
BTNode* newNode(int data) {
    BTNode *n = (BTNode*)malloc(sizeof(BTNode));
    n->data  = data;
    n->left  = NULL;
    n->right = NULL;
    return n;
}

// Build manually
BTNode *root    = newNode(1);
root->left      = newNode(2);
root->right     = newNode(3);
root->left->left  = newNode(4);
root->left->right = newNode(5);
//      1
//    /   \\
//   2     3
//  / \\
// 4   5
\`\`\`

### Tree Traversals — 4 Ways to Visit All Nodes

\`\`\`c
// ── 1. Inorder (Left → Root → Right) ──
// BST mein: sorted order mein print karta hai!
void inorder(BTNode *root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}
// Output for BST: 3 5 7 10 15 20 (sorted!)

// ── 2. Preorder (Root → Left → Right) ──
// Tree copy/serialize ke liye useful
void preorder(BTNode *root) {
    if (!root) return;
    printf("%d ", root->data);   // root FIRST
    preorder(root->left);
    preorder(root->right);
}

// ── 3. Postorder (Left → Right → Root) ──
// Tree delete karne ke liye useful
void postorder(BTNode *root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);   // root LAST
    // free(root) yahan safe hai!
}

// ── 4. Level Order (BFS) ── Queue use karo!
void levelOrder(BTNode *root) {
    if (!root) return;
    // Queue (from Week 8)
    BTNode *queue[1000];
    int front = 0, rear = 0;
    queue[rear++] = root;

    while (front < rear) {
        BTNode *curr = queue[front++];
        printf("%d ", curr->data);
        if (curr->left)  queue[rear++] = curr->left;
        if (curr->right) queue[rear++] = curr->right;
    }
}
// Output:  1 2 3 4 5  (level by level)
\`\`\`

### Tree Properties — Useful Functions

\`\`\`c
// Height of tree — O(n)
int height(BTNode *root) {
    if (!root) return -1;  // empty tree height = -1
    int lh = height(root->left);
    int rh = height(root->right);
    return 1 + (lh > rh ? lh : rh);
}

// Count nodes — O(n)
int countNodes(BTNode *root) {
    if (!root) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

// Count leaf nodes
int countLeaves(BTNode *root) {
    if (!root) return 0;
    if (!root->left && !root->right) return 1;  // leaf!
    return countLeaves(root->left) + countLeaves(root->right);
}

// Sum of all nodes
int sumTree(BTNode *root) {
    if (!root) return 0;
    return root->data + sumTree(root->left) + sumTree(root->right);
}

// Mirror/Invert tree
BTNode* mirror(BTNode *root) {
    if (!root) return NULL;
    BTNode *temp  = root->left;
    root->left    = mirror(root->right);
    root->right   = mirror(temp);
    return root;
}

// Check if two trees are identical
int isIdentical(BTNode *a, BTNode *b) {
    if (!a && !b) return 1;
    if (!a || !b) return 0;
    return a->data == b->data &&
           isIdentical(a->left,  b->left) &&
           isIdentical(a->right, b->right);
}

// Free entire tree
void freeTree(BTNode *root) {
    if (!root) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}
\`\`\`

### Iterative Traversal (Stack se)

\`\`\`c
// Iterative inorder — no recursion
void inorderIter(BTNode *root) {
    // Use our Stack from Week 8
    BTNode *stack[1000];
    int top = -1;
    BTNode *curr = root;

    while (curr || top >= 0) {
        // Go as far left as possible
        while (curr) {
            stack[++top] = curr;
            curr = curr->left;
        }
        // Pop and process
        curr = stack[top--];
        printf("%d ", curr->data);
        // Move to right subtree
        curr = curr->right;
    }
}
\`\`\``,

      content_en: `## Binary Tree — Hierarchical Data!

### Node and Traversals

\`\`\`c
typedef struct N { int d; struct N *l,*r; } Node;
Node* nn(int d){ Node*n=malloc(sizeof*n); n->d=d;n->l=n->r=NULL; return n; }

void inorder (Node*r){ if(!r)return; inorder(r->l); printf("%d ",r->d); inorder(r->r); }
void preorder (Node*r){ if(!r)return; printf("%d ",r->d); preorder(r->l); preorder(r->r); }
void postorder(Node*r){ if(!r)return; postorder(r->l); postorder(r->r); printf("%d ",r->d); }

// Level order (BFS with queue)
void levelOrder(Node*r){
    Node*q[1000]; int f=0,b=0;
    q[b++]=r;
    while(f<b){ Node*c=q[f++]; printf("%d ",c->d); if(c->l)q[b++]=c->l; if(c->r)q[b++]=c->r; }
}
\`\`\`

### Properties

\`\`\`c
int height(Node*r)    { if(!r)return -1; int l=height(r->l),ri=height(r->r); return 1+(l>ri?l:ri); }
int count (Node*r)    { return r ? 1+count(r->l)+count(r->r) : 0; }
int leaves(Node*r)    { if(!r)return 0; if(!r->l&&!r->r)return 1; return leaves(r->l)+leaves(r->r); }
void freeTree(Node*r) { if(!r)return; freeTree(r->l); freeTree(r->r); free(r); }
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct BTNode {
    int data;
    struct BTNode *left, *right;
} BTNode;

BTNode* nn(int d){ BTNode*n=malloc(sizeof*n); n->data=d; n->left=n->right=NULL; return n; }

// Traversals
void inorder  (BTNode*r){ if(!r)return; inorder(r->left); printf("%d ",r->data); inorder(r->right); }
void preorder (BTNode*r){ if(!r)return; printf("%d ",r->data); preorder(r->left); preorder(r->right); }
void postorder(BTNode*r){ if(!r)return; postorder(r->left); postorder(r->right); printf("%d ",r->data); }

void levelOrder(BTNode *root) {
    if(!root) return;
    BTNode *q[1024]; int f=0,b=0;
    q[b++]=root;
    int level=0;
    while(f<b){
        int sz=b-f; // nodes at this level
        printf("L%d: ",level++);
        for(int i=0;i<sz;i++){
            BTNode *c=q[f++];
            printf("%d ",c->data);
            if(c->left)  q[b++]=c->left;
            if(c->right) q[b++]=c->right;
        }
        printf("\\n");
    }
}

int height(BTNode*r)   { if(!r)return -1; int l=height(r->left),ri=height(r->right); return 1+(l>ri?l:ri); }
int count(BTNode*r)    { return r?1+count(r->left)+count(r->right):0; }
int leaves(BTNode*r)   { if(!r)return 0; if(!r->left&&!r->right)return 1; return leaves(r->left)+leaves(r->right); }
int sum(BTNode*r)      { return r?r->data+sum(r->left)+sum(r->right):0; }
int diameter(BTNode*r) {
    if(!r)return 0;
    int lh=height(r->left)+1, rh=height(r->right)+1;
    int throughRoot=lh+rh;
    int leftD=diameter(r->left), rightD=diameter(r->right);
    return throughRoot>leftD?(throughRoot>rightD?throughRoot:rightD):(leftD>rightD?leftD:rightD);
}

// Print tree visually
void printTree(BTNode *root, int space) {
    if(!root) return;
    space += 4;
    printTree(root->right, space);
    printf("\\n");
    for(int i=4;i<space;i++) printf(" ");
    printf("%d\\n", root->data);
    printTree(root->left, space);
}

// Check if balanced
int isBalanced(BTNode *r) {
    if(!r) return 1;
    int lh=height(r->left), rh=height(r->right);
    int diff=lh-rh; if(diff<0)diff=-diff;
    return diff<=1 && isBalanced(r->left) && isBalanced(r->right);
}

// Path from root to node
int findPath(BTNode *r, int target, int *path, int pathLen) {
    if(!r) return 0;
    path[pathLen]=r->data;
    if(r->data==target) { printf("Path: "); for(int i=0;i<=pathLen;i++) printf("%d ",path[i]); printf("\\n"); return 1; }
    return findPath(r->left,target,path,pathLen+1) || findPath(r->right,target,path,pathLen+1);
}

void freeTree(BTNode*r){ if(!r)return; freeTree(r->left); freeTree(r->right); free(r); }

int main(){
    //        10
    //       /  \\
    //      5    20
    //     / \\    \\
    //    3   7   25
    //   /
    //  1
    BTNode *root=nn(10);
    root->left=nn(5); root->right=nn(20);
    root->left->left=nn(3); root->left->right=nn(7);
    root->right->right=nn(25);
    root->left->left->left=nn(1);

    printf("=== Binary Tree ===\\n");
    printTree(root,0);

    printf("\\nInorder:   "); inorder(root);
    printf("\\nPreorder:  "); preorder(root);
    printf("\\nPostorder: "); postorder(root);
    printf("\\n\\n");

    printf("=== Level Order ===\\n");
    levelOrder(root);

    printf("\\n=== Properties ===\\n");
    printf("Height   : %d\\n", height(root));
    printf("Nodes    : %d\\n", count(root));
    printf("Leaves   : %d\\n", leaves(root));
    printf("Sum      : %d\\n", sum(root));
    printf("Diameter : %d\\n", diameter(root));
    printf("Balanced : %s\\n", isBalanced(root)?"Yes":"No");

    int path[100];
    printf("\\n=== Paths ===\\n");
    findPath(root,1,path,0);
    findPath(root,7,path,0);
    findPath(root,25,path,0);

    freeTree(root);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

typedef struct N{int d;struct N*l,*r;}N;
N* nn(int d){N*n=malloc(sizeof*n);n->d=d;n->l=n->r=NULL;return n;}

void inorder(N*r){if(!r)return;inorder(r->l);printf("%d ",r->d);inorder(r->r);}
void preorder(N*r){if(!r)return;printf("%d ",r->d);preorder(r->l);preorder(r->r);}

int height(N*r){if(!r)return -1;int l=height(r->l),ri=height(r->r);return 1+(l>ri?l:ri);}
int count(N*r){return r?1+count(r->l)+count(r->r):0;}
void freeT(N*r){if(!r)return;freeT(r->l);freeT(r->r);free(r);}

int main(){
    N*root=nn(10);root->l=nn(5);root->r=nn(20);
    root->l->l=nn(3);root->l->r=nn(7);root->r->r=nn(25);
    printf("Inorder: "); inorder(root); printf("\\n");
    printf("Height=%d Nodes=%d\\n",height(root),count(root));
    freeT(root); return 0;
}`,

      task: {
        description: 'Binary Tree practice: (1) "Tree Serialization" — tree ko string mein convert karo (preorder + NULL markers), phir wapas reconstruct karo. (2) "Lowest Common Ancestor" (LCA) — do nodes ka lowest common ancestor find karo. (3) "Maximum Path Sum" — tree mein kisi bhi node se kisi bhi node tak ka maximum sum path find karo. (4) "Zigzag Level Order" — alternate levels alternate direction mein print karo.',
        description_en: 'Binary Tree practice: (1) "Tree Serialization" — convert a tree to a string (preorder + NULL markers), then reconstruct it. (2) "Lowest Common Ancestor" (LCA) — find the lowest common ancestor of two nodes. (3) "Maximum Path Sum" — find the maximum sum path from any node to any node in the tree. (4) "Zigzag Level Order" — print alternate levels in alternate directions.',
        hint: 'Serialize: preorder traversal, NULL→"# ", split on space to deserialize. LCA: if root==p||root==q return root; recurse both sides; if both non-null → root is LCA. Zigzag: use two stacks or deque, flip direction each level.',
        hint_en: 'Serialize: preorder traversal, NULL→"# ", split on space to deserialize. LCA: if root==p||root==q return root; recurse both sides; if both non-null → root is LCA. Zigzag: use two stacks or a deque, flip direction each level.',
      },
      quiz: [
        {
          q: 'Inorder traversal BST ka special property kya deliver karta hai?',
          options: [
            'Koi special property nahi',
            'BST ka inorder traversal hamesha sorted (ascending) order mein nodes visit karta hai — Left < Root < Right property ki wajah se.',
            'Fastest traversal hai',
            'Sirf leaf nodes visit karta hai',
          ],
          correct: 1,
          explanation: 'BST property: left subtree < root < right subtree. Inorder = Left → Root → Right. Isliye: pehle saare chhote values (left), phir root, phir saare bade values (right) — sorted! Practical use: BST se sorted array nikalna = O(n) inorder traversal. Binary search tree ka naam isi property se hai.',
          q_en: 'What special property does inorder traversal deliver for a BST?',
          options_en: [
            'No special property',
            'Inorder traversal of a BST always visits nodes in sorted (ascending) order — because of the Left < Root < Right property.',
            'It is the fastest traversal',
            'It only visits leaf nodes',
          ],
          explanation_en: 'BST property: left subtree < root < right subtree. Inorder = Left → Root → Right. So: first all smaller values (left), then root, then all larger values (right) — sorted! Practical use: extracting a sorted array from a BST = O(n) inorder traversal. This is why it is called a binary search tree.',
        },
        {
          q: 'Tree height aur depth mein kya difference hai?',
          options: [
            'Same cheez hai',
            'Height: kisi node se neeche longest path (leaves tak). Depth: root se us node tak distance. Root ki height = tree ki height. Leaf ki depth = tree ki height.',
            'Depth hamesha zyada hoti hai',
            'Height recursive calculate nahi hoti',
          ],
          correct: 1,
          explanation: 'Height of node = longest path from node to any leaf below it. Leaf ki height = 0. Depth of node = path length from root to node. Root ki depth = 0. Tree ki height = root ki height = maximum depth of any leaf. Example: root=10, height=3 (4 levels). Node 5, depth=1. Node 1, depth=3, height=0 (leaf).',
          q_en: 'What is the difference between tree height and depth?',
          options_en: [
            'They are the same',
            'Height: longest path downward from a node (to leaves). Depth: distance from the root to that node. Root\'s height = tree\'s height. A leaf\'s depth = tree\'s height.',
            'Depth is always greater',
            'Height is not calculated recursively',
          ],
          explanation_en: 'Height of a node = the length of the longest path from that node down to any leaf. A leaf\'s height = 0. Depth of a node = the path length from the root to that node. Root\'s depth = 0. Tree\'s height = root\'s height = maximum depth of any leaf. Example: root=10, height=3 (4 levels). Node 5, depth=1. Node 1, depth=3, height=0 (leaf).',
        },
        {
          q: 'Level Order traversal ke liye queue kyun use karte hain?',
          options: [
            'Queue fast hai',
            'Level order = BFS (same as graph BFS). Queue FIFO ensures same-level nodes pehle process hote hain. Current level ke nodes enqueue hote hain, unke children bhi — next level ready hoti hai.',
            'Stack se level order nahi ho sakta',
            'Recursion se level order nahi hota',
          ],
          correct: 1,
          explanation: 'Level order = breadth-first. Queue mein root daalo. Dequeue karo → print karo → left aur right children enqueue karo. Next iteration: level 1 ke nodes process. Unke children enqueue = level 2. FIFO ensures order. Stack se? LIFO = DFS (depth first) — level order nahi milega. Recursion se level order: complex (need level parameter ya queue internally).',
          q_en: 'Why do we use a queue for level order traversal?',
          options_en: [
            'Queue is fast',
            'Level order = BFS. Queue FIFO ensures same-level nodes are processed first. Current level nodes are enqueued, their children too — the next level is ready.',
            'Stack cannot do level order',
            'Recursion cannot do level order',
          ],
          explanation_en: 'Level order = breadth-first. Add root to queue. Dequeue → print → enqueue left and right children. Next iteration: process level-1 nodes. Their children are enqueued = level 2 ready. FIFO ensures correct order. With a stack? LIFO = DFS (depth first) — not level order. Recursion for level order: complex (needs a level parameter or an internal queue).',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w9-s2',
      title: 'Binary Search Tree — Search, Insert, Delete',
      title_en: 'Binary Search Tree — Search, Insert, Delete',
      emoji: '🔍',
      content: `## BST — Ordered Binary Tree!

BST Rule: har node ke liye —
- Left subtree mein saari values CHHOTI hoti hain
- Right subtree mein saari values BADI hoti hain

### BST Insert

\`\`\`c
typedef struct BST {
    int        data;
    struct BST *left, *right;
} BST;

BST* bst_insert(BST *root, int val) {
    if (!root) return newNode(val);    // empty spot mila!

    if (val < root->data)
        root->left  = bst_insert(root->left,  val);
    else if (val > root->data)
        root->right = bst_insert(root->right, val);
    // val == root->data: duplicate, ignore

    return root;
}

// Build BST
BST *tree = NULL;
int values[] = {50, 30, 70, 20, 40, 60, 80};
for (int i = 0; i < 7; i++)
    tree = bst_insert(tree, values[i]);
//        50
//       /  \\
//     30    70
//    / \\   / \\
//   20 40 60 80
\`\`\`

### BST Search — O(log n) average

\`\`\`c
BST* bst_search(BST *root, int val) {
    if (!root || root->data == val) return root;
    if (val < root->data) return bst_search(root->left,  val);
    return                       bst_search(root->right, val);
}

// Iterative search (faster — no recursion overhead)
BST* bst_searchIter(BST *root, int val) {
    while (root) {
        if (val == root->data) return root;
        root = (val < root->data) ? root->left : root->right;
    }
    return NULL;
}

// Min and Max — O(h)
BST* bst_min(BST *root) {
    while (root && root->left) root = root->left;
    return root;  // leftmost node
}
BST* bst_max(BST *root) {
    while (root && root->right) root = root->right;
    return root;  // rightmost node
}

// Floor and Ceiling
BST* bst_floor(BST *root, int val) {   // largest value <= val
    if (!root) return NULL;
    if (root->data == val) return root;
    if (root->data > val)  return bst_floor(root->left, val);
    BST *right = bst_floor(root->right, val);
    return right ? right : root;
}

BST* bst_ceil(BST *root, int val) {    // smallest value >= val
    if (!root) return NULL;
    if (root->data == val) return root;
    if (root->data < val)  return bst_ceil(root->right, val);
    BST *left = bst_ceil(root->left, val);
    return left ? left : root;
}
\`\`\`

### BST Delete — 3 Cases

\`\`\`c
BST* bst_delete(BST *root, int val) {
    if (!root) return NULL;

    if (val < root->data) {
        root->left  = bst_delete(root->left,  val);
    } else if (val > root->data) {
        root->right = bst_delete(root->right, val);
    } else {
        // Found! 3 cases:

        // Case 1: Leaf node (no children)
        if (!root->left && !root->right) {
            free(root);
            return NULL;
        }

        // Case 2: One child
        if (!root->left) {
            BST *temp = root->right;
            free(root);
            return temp;
        }
        if (!root->right) {
            BST *temp = root->left;
            free(root);
            return temp;
        }

        // Case 3: Two children
        // Find inorder successor (smallest in right subtree)
        BST *successor = bst_min(root->right);
        root->data  = successor->data;         // copy successor data
        root->right = bst_delete(root->right, successor->data); // delete successor
    }
    return root;
}
\`\`\`

### BST Validation

\`\`\`c
// Check if tree is valid BST
int isValidBST(BST *root, int min, int max) {
    if (!root) return 1;
    if (root->data <= min || root->data >= max) return 0;
    return isValidBST(root->left,  min, root->data) &&
           isValidBST(root->right, root->data, max);
}
// Call: isValidBST(root, INT_MIN, INT_MAX)

// Kth smallest element
int kthSmallest(BST *root, int *k) {
    if (!root) return -1;
    int left = kthSmallest(root->left, k);
    if (*k == 0) return left;
    if (--(*k) == 0) return root->data;
    return kthSmallest(root->right, k);
}

// Count nodes in range [lo, hi]
int countRange(BST *root, int lo, int hi) {
    if (!root) return 0;
    if (root->data < lo) return countRange(root->right, lo, hi);
    if (root->data > hi) return countRange(root->left,  lo, hi);
    return 1 + countRange(root->left, lo, hi) + countRange(root->right, lo, hi);
}
\`\`\`

### BST Complexity

\`\`\`
Operation    Average    Worst (skewed)
─────────────────────────────────────────
Search       O(log n)   O(n)
Insert       O(log n)   O(n)
Delete       O(log n)   O(n)
Min/Max      O(log n)   O(n)
Inorder      O(n)       O(n)

Worst case: sorted input → skewed tree (linked list!)
[1]→[2]→[3]→[4]→[5]  ← insert 1,2,3,4,5 → right-skewed!
Solution: AVL tree / Red-Black tree (self-balancing)
\`\`\``,

      content_en: `## BST — Ordered Binary Tree!

### Insert and Search

\`\`\`c
typedef struct BST { int d; struct BST *l,*r; } BST;

BST* insert(BST*r,int v){
    if(!r) return nn(v);
    if(v<r->d) r->l=insert(r->l,v);
    else if(v>r->d) r->r=insert(r->r,v);
    return r;
}
BST* search(BST*r,int v){
    while(r){ if(v==r->d)return r; r=v<r->d?r->l:r->r; }
    return NULL;
}
BST* minNode(BST*r){ while(r&&r->l)r=r->l; return r; }
\`\`\`

### Delete (3 Cases)

\`\`\`c
BST* del(BST*r,int v){
    if(!r) return NULL;
    if(v<r->d){r->l=del(r->l,v);return r;}
    if(v>r->d){r->r=del(r->r,v);return r;}
    // Found:
    if(!r->l){BST*t=r->r;free(r);return t;}  // 0 or 1 child
    if(!r->r){BST*t=r->l;free(r);return t;}
    BST*s=minNode(r->r);    // 2 children: inorder successor
    r->d=s->d; r->r=del(r->r,s->d); return r;
}
\`\`\`

### Validation

\`\`\`c
int isValid(BST*r,int mn,int mx){
    if(!r)return 1;
    if(r->d<=mn||r->d>=mx)return 0;
    return isValid(r->l,mn,r->d) && isValid(r->r,r->d,mx);
}
// isValid(root, INT_MIN, INT_MAX)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct BST {
    int data;
    struct BST *left, *right;
} BST;

BST* nn(int d){ BST*n=malloc(sizeof*n); n->data=d; n->left=n->right=NULL; return n; }

BST* insert(BST*r,int v){
    if(!r) return nn(v);
    if(v<r->data) r->left=insert(r->left,v);
    else if(v>r->data) r->right=insert(r->right,v);
    return r;
}

BST* minNode(BST*r){ while(r&&r->left)r=r->left; return r; }
BST* maxNode(BST*r){ while(r&&r->right)r=r->right; return r; }

BST* search(BST*r,int v){
    while(r){ if(v==r->data)return r; r=v<r->data?r->left:r->right; }
    return NULL;
}

BST* del(BST*r,int v){
    if(!r)return NULL;
    if(v<r->data){r->left=del(r->left,v);return r;}
    if(v>r->data){r->right=del(r->right,v);return r;}
    if(!r->left){BST*t=r->right;free(r);return t;}
    if(!r->right){BST*t=r->left;free(r);return t;}
    BST*s=minNode(r->right);
    r->data=s->data;
    r->right=del(r->right,s->data);
    return r;
}

void inorder(BST*r){ if(!r)return; inorder(r->left); printf("%d ",r->data); inorder(r->right); }
int height(BST*r){ if(!r)return -1; int l=height(r->left),ri=height(r->right); return 1+(l>ri?l:ri); }
int count(BST*r){ return r?1+count(r->left)+count(r->right):0; }

int isValid(BST*r,int mn,int mx){
    if(!r)return 1;
    if(r->data<=mn||r->data>=mx)return 0;
    return isValid(r->left,mn,r->data)&&isValid(r->right,r->data,mx);
}

// Range sum
int rangeSum(BST*r,int lo,int hi){
    if(!r)return 0;
    if(r->data<lo) return rangeSum(r->right,lo,hi);
    if(r->data>hi) return rangeSum(r->left,lo,hi);
    return r->data+rangeSum(r->left,lo,hi)+rangeSum(r->right,lo,hi);
}

// Kth smallest
int kth(BST*r,int*k){
    if(!r)return -1;
    int l=kth(r->left,k);
    if(*k==0)return l;
    if(--(*k)==0)return r->data;
    return kth(r->right,k);
}

void freeT(BST*r){ if(!r)return; freeT(r->left); freeT(r->right); free(r); }

void printBox(const char*title){ printf("\\n=== %s ===\\n",title); }

int main(){
    BST *tree=NULL;
    int vals[]={50,30,70,20,40,60,80,10,25,35,45};
    int n=sizeof(vals)/sizeof(vals[0]);

    printBox("BST Build + Inorder");
    for(int i=0;i<n;i++) tree=insert(tree,vals[i]);
    printf("Inorder (sorted): "); inorder(tree); printf("\\n");
    printf("Height: %d, Nodes: %d\\n",height(tree),count(tree));
    printf("Min: %d, Max: %d\\n",minNode(tree)->data,maxNode(tree)->data);
    printf("Valid BST: %s\\n",isValid(tree,INT_MIN,INT_MAX)?"Yes":"No");

    printBox("Search");
    int targets[]={40,99,20,55};
    for(int i=0;i<4;i++){
        BST*found=search(tree,targets[i]);
        printf("Search %d: %s\\n",targets[i],found?"Found":"Not found");
    }

    printBox("Delete Operations");
    printf("Before: "); inorder(tree); printf("\\n");
    tree=del(tree,20);  // leaf
    printf("Del 20 (leaf):  "); inorder(tree); printf("\\n");
    tree=del(tree,30);  // one child
    printf("Del 30 (1child):"); inorder(tree); printf("\\n");
    tree=del(tree,50);  // two children (root!)
    printf("Del 50 (2child):"); inorder(tree); printf("\\n");

    printBox("Range Queries");
    printf("Sum [20,60]  = %d\\n",rangeSum(tree,20,60));
    printf("Sum [60,100] = %d\\n",rangeSum(tree,60,100));
    int k=3;
    printf("3rd smallest = %d\\n",kth(tree,&k));

    freeT(tree);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct B{int d;struct B*l,*r;}B;
B* nn(int d){B*n=malloc(sizeof*n);n->d=d;n->l=n->r=NULL;return n;}
B* ins(B*r,int v){if(!r)return nn(v);if(v<r->d)r->l=ins(r->l,v);else if(v>r->d)r->r=ins(r->r,v);return r;}
B* mn(B*r){while(r&&r->l)r=r->l;return r;}
B* del(B*r,int v){
    if(!r)return NULL;
    if(v<r->d){r->l=del(r->l,v);return r;}
    if(v>r->d){r->r=del(r->r,v);return r;}
    if(!r->l){B*t=r->r;free(r);return t;}
    if(!r->r){B*t=r->l;free(r);return t;}
    B*s=mn(r->r);r->d=s->d;r->r=del(r->r,s->d);return r;
}
void io(B*r){if(!r)return;io(r->l);printf("%d ",r->d);io(r->r);}
int valid(B*r,int lo,int hi){if(!r)return 1;if(r->d<=lo||r->d>=hi)return 0;return valid(r->l,lo,r->d)&&valid(r->r,r->d,hi);}

int main(){
    B*t=NULL;
    int v[]={50,30,70,20,40,60,80};
    for(int i=0;i<7;i++) t=ins(t,v[i]);
    printf("Sorted: "); io(t); printf("\\n");
    printf("Valid: %d\\n",valid(t,-2147483648,2147483647));
    t=del(t,30); printf("Del 30: "); io(t); printf("\\n");
    return 0;
}`,

      task: {
        description: 'BST practice: (1) "BST from sorted array" — sorted array se balanced BST banao (middle element root). (2) "Convert BST to Sorted Linked List" — BST ke nodes ko sorted doubly linked list mein convert karo (in-place, no extra memory). (3) "Two Sum in BST" — BST mein do nodes find karo jinki sum = target. (4) "BST Iterator" — BST ke liye iterator implement karo: next() aur hasNext() functions jo inorder traversal kare O(1) average time mein.',
        description_en: 'BST practice: (1) "BST from sorted array" — build a balanced BST from a sorted array (middle element as root). (2) "Convert BST to Sorted Linked List" — convert BST nodes into a sorted doubly linked list (in-place, no extra memory). (3) "Two Sum in BST" — find two nodes whose sum equals a target. (4) "BST Iterator" — implement an iterator for BST: next() and hasNext() functions performing inorder traversal in O(1) average time.',
        hint: 'Sorted array to BST: mid=lo+(hi-lo)/2; root=arr[mid]; root->left=build(arr,lo,mid-1); root->right=build(arr,mid+1,hi). Two Sum: convert to array (inorder), then two pointer. Iterator: stack-based, push leftmost path on init, push right subtree on next().',
        hint_en: 'Sorted array to BST: mid=lo+(hi-lo)/2; root=arr[mid]; root->left=build(arr,lo,mid-1); root->right=build(arr,mid+1,hi). Two Sum: convert to array (inorder), then two pointers. Iterator: stack-based, push leftmost path on init, push right subtree path on next().',
      },
      quiz: [
        {
          q: 'BST delete mein "two children" case mein inorder successor kyun use karte hain?',
          options: [
            'Sirf convention',
            'Inorder successor = right subtree ka minimum = node se thoda bada value. Isko root ki jagah rakho toh BST property maintain rehti hai — left subtree sab chhote, right subtree sab bade.',
            'Inorder predecessor se nahi hota',
            'Random node choose karo',
          ],
          correct: 1,
          explanation: 'Delete node X (two children): X ki jagah inorder successor S rakho (ya inorder predecessor bhi kaam karta). S = X ke right subtree ka minimum = X se just bada value. S ki jagah pe: left subtree sab < S (kyunki S > X > left subtree), right subtree sab > S (S was minimum of right). BST property preserved! Phir S ko delete karo (S ke paas at most one child — right child — kyunki S minimum hai left child nahi hoga).',
          q_en: 'In BST deletion with two children, why do we use the inorder successor?',
          options_en: [
            'Just convention',
            'Inorder successor = minimum of right subtree = value just greater than node. Placing it at root maintains BST property — left subtree all smaller, right subtree all larger.',
            'Inorder predecessor does not work',
            'Choose a random node',
          ],
          explanation_en: 'Delete node X (two children): replace X with inorder successor S (or inorder predecessor also works). S = minimum of X\'s right subtree = value just greater than X. At S\'s position: left subtree all < S (since S > X > left subtree), right subtree all > S (S was the minimum of the right). BST property preserved! Then delete S (S has at most one child — a right child — because S is the minimum so it has no left child).',
        },
        {
          q: 'Sorted input BST mein kyun worst case O(n) deta hai?',
          options: [
            'Algorithm wrong hai',
            'Sorted input (1,2,3,4,5) → right-skewed tree — har node ke sirf ek right child. Height = n-1. Search O(n) = linked list scan. Fix: AVL/Red-Black tree (self-balancing).',
            'BST sorted input handle nahi kar sakta',
            'Memory issue hoti hai',
          ],
          correct: 1,
          explanation: 'Insert 1,2,3,4,5 in BST: 1 is root. 2>1 → right of 1. 3>2 → right of 2. 4>3 → right of 3. 5>4 → right of 4. Result: 1→2→3→4→5 (right chain). Height = n-1 = 4. Search 5: visit 1,2,3,4,5 = O(n)! Same for reverse sorted → left-skewed. Real fix: randomize input OR use self-balancing BST (AVL, Red-Black).',
          q_en: 'Why does sorted input give worst-case O(n) for a BST?',
          options_en: [
            'The algorithm is wrong',
            'Sorted input (1,2,3,4,5) → right-skewed tree — each node has only one right child. Height = n-1. Search O(n) = like a linked list scan. Fix: AVL/Red-Black tree (self-balancing).',
            'BST cannot handle sorted input',
            'There is a memory issue',
          ],
          explanation_en: 'Insert 1,2,3,4,5 into a BST: 1 is root. 2>1 → right of 1. 3>2 → right of 2. 4>3 → right of 3. 5>4 → right of 4. Result: 1→2→3→4→5 (right chain). Height = n-1 = 4. Search for 5: visit 1,2,3,4,5 = O(n)! Same for reverse-sorted input → left-skewed. Real fix: randomise input OR use a self-balancing BST (AVL, Red-Black).',
        },
        {
          q: 'BST vs Hash Table — kab kaunsa use karein?',
          options: [
            'Hamesha Hash Table — O(1) faster hai',
            'BST: sorted order, range queries (20 se 50 tak), min/max, predecessor/successor. Hash: fast lookup O(1), no ordering needed. Range queries: BST wins. Random lookup: Hash wins.',
            'BST hamesha better hai',
            'Koi practical difference nahi',
          ],
          correct: 1,
          explanation: 'BST strengths: (1) Sorted iteration (inorder). (2) Range queries O(log n). (3) Floor/Ceiling/Predecessor/Successor. (4) Kth smallest. Hash Table strengths: (1) O(1) average lookup/insert/delete. (2) No ordering overhead. Real world: database index = B-tree (BST variant, better cache). Python dict = hash table. Range queries in DB = use B-tree index.',
          q_en: 'BST vs Hash Table — when to use which?',
          options_en: [
            'Always Hash Table — O(1) is faster',
            'BST: sorted order, range queries (20 to 50), min/max, predecessor/successor. Hash: fast O(1) lookup, no ordering needed. Range queries: BST wins. Random lookup: Hash wins.',
            'BST is always better',
            'No practical difference',
          ],
          explanation_en: 'BST strengths: (1) Sorted iteration (inorder). (2) Range queries O(log n). (3) Floor/Ceiling/Predecessor/Successor. (4) Kth smallest. Hash Table strengths: (1) O(1) average lookup/insert/delete. (2) No ordering overhead. Real world: database index = B-tree (a BST variant, better cache performance). Python dict = hash table. Range queries in DB = use B-tree index.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w9-s3',
      title: 'AVL Tree — Self-Balancing BST',
      title_en: 'AVL Tree — Self-Balancing BST',
      emoji: '⚖️',
      content: `## AVL Tree — Balance Guaranteed!

BST worst case O(n) — skewed tree. AVL tree: **height difference ≤ 1** always maintained → O(log n) guaranteed!

### Balance Factor

\`\`\`c
// Balance Factor = height(left) - height(right)
// AVL property: balance factor ∈ {-1, 0, 1} for EVERY node

typedef struct AVL {
    int        data;
    struct AVL *left, *right;
    int        height;  // cache height for O(1) access
} AVL;

int avl_height(AVL *n) { return n ? n->height : -1; }
int avl_bf(AVL *n) { return n ? avl_height(n->left) - avl_height(n->right) : 0; }

void avl_updateHeight(AVL *n) {
    if (!n) return;
    int lh = avl_height(n->left);
    int rh = avl_height(n->right);
    n->height = 1 + (lh > rh ? lh : rh);
}
\`\`\`

### Rotations — Imbalance Fix karo!

\`\`\`c
// ── Right Rotation ──
//       y                x
//      / \\      →       / \\
//     x   T3           T1   y
//    / \\                   / \\
//   T1  T2               T2  T3
AVL* rotateRight(AVL *y) {
    AVL *x  = y->left;
    AVL *T2 = x->right;

    x->right = y;    // rotation
    y->left  = T2;

    avl_updateHeight(y);  // y pehle (neeche hai ab)
    avl_updateHeight(x);  // x baad mein
    return x;             // new root
}

// ── Left Rotation ──
//     x                  y
//    / \\       →        / \\
//   T1   y              x   T3
//       / \\           / \\
//      T2  T3         T1  T2
AVL* rotateLeft(AVL *x) {
    AVL *y  = x->right;
    AVL *T2 = y->left;

    y->left  = x;    // rotation
    x->right = T2;

    avl_updateHeight(x);
    avl_updateHeight(y);
    return y;             // new root
}

// ── 4 Imbalance Cases ──
AVL* avl_balance(AVL *node) {
    avl_updateHeight(node);
    int bf = avl_bf(node);

    // Left Heavy (bf > 1)
    if (bf > 1) {
        if (avl_bf(node->left) < 0)
            node->left = rotateLeft(node->left);  // Left-Right case
        return rotateRight(node);                  // Left-Left case
    }

    // Right Heavy (bf < -1)
    if (bf < -1) {
        if (avl_bf(node->right) > 0)
            node->right = rotateRight(node->right); // Right-Left case
        return rotateLeft(node);                     // Right-Right case
    }

    return node;  // already balanced
}
\`\`\`

### AVL Insert

\`\`\`c
AVL* avl_insert(AVL *root, int val) {
    // Step 1: Normal BST insert
    if (!root) {
        AVL *n = (AVL*)malloc(sizeof(AVL));
        n->data = val; n->left = n->right = NULL; n->height = 0;
        return n;
    }

    if (val < root->data)
        root->left  = avl_insert(root->left,  val);
    else if (val > root->data)
        root->right = avl_insert(root->right, val);
    else
        return root;  // duplicate

    // Step 2: Rebalance going back up
    return avl_balance(root);
}

// AVL Delete
AVL* avl_delete(AVL *root, int val) {
    if (!root) return NULL;

    if (val < root->data)
        root->left  = avl_delete(root->left,  val);
    else if (val > root->data)
        root->right = avl_delete(root->right, val);
    else {
        if (!root->left || !root->right) {
            AVL *temp = root->left ? root->left : root->right;
            free(root);
            return temp;
        }
        // Two children: inorder successor
        AVL *succ = root->right;
        while (succ->left) succ = succ->left;
        root->data  = succ->data;
        root->right = avl_delete(root->right, succ->data);
    }
    return avl_balance(root);
}
\`\`\`

### AVL vs BST — When to Use?

\`\`\`
Feature           BST         AVL Tree
─────────────────────────────────────────────
Search            O(h)        O(log n) ✅
Insert            O(h)        O(log n) ✅
Delete            O(h)        O(log n) ✅
Height (worst)    O(n) ❌     O(log n) ✅
Implementation    Simple      Complex
Overhead          Low         Rotation cost
Space             O(n)        O(n) + height field

h = height (log n avg, n worst for BST)

Use BST: simple use case, random input guaranteed
Use AVL: need guaranteed O(log n), sorted/sequential input possible
Use Red-Black: most standard library implementations (C++ map, Java TreeMap)
\`\`\``,

      content_en: `## AVL Tree — Balance Always Guaranteed!

### Balance Factor and Rotations

\`\`\`c
typedef struct AVL { int d; struct AVL *l,*r; int h; } AVL;
int ht(AVL*n){ return n?n->h:-1; }
int bf(AVL*n){ return n?ht(n->l)-ht(n->r):0; }
void updH(AVL*n){ if(n){int l=ht(n->l),r=ht(n->r);n->h=1+(l>r?l:r);} }

AVL* rotR(AVL*y){ AVL*x=y->l,*T=x->r; x->r=y;y->l=T; updH(y);updH(x); return x; }
AVL* rotL(AVL*x){ AVL*y=x->r,*T=y->l; y->l=x;x->r=T; updH(x);updH(y); return y; }

AVL* bal(AVL*n){
    updH(n); int b=bf(n);
    if(b>1) { if(bf(n->l)<0)n->l=rotL(n->l); return rotR(n); }
    if(b<-1){ if(bf(n->r)>0)n->r=rotR(n->r); return rotL(n); }
    return n;
}
\`\`\`

### AVL Insert

\`\`\`c
AVL* ins(AVL*r,int v){
    if(!r){AVL*n=malloc(sizeof*n);n->d=v;n->l=n->r=NULL;n->h=0;return n;}
    if(v<r->d)r->l=ins(r->l,v);
    else if(v>r->d)r->r=ins(r->r,v);
    else return r;
    return bal(r);
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>

typedef struct AVL {
    int data, height;
    struct AVL *left, *right;
} AVL;

int ht(AVL*n){return n?n->height:-1;}
int bf(AVL*n){return n?ht(n->left)-ht(n->right):0;}
void updH(AVL*n){if(n){int l=ht(n->left),r=ht(n->right);n->height=1+(l>r?l:r);}}

AVL* rotR(AVL*y){ AVL*x=y->left,*T=x->right; x->right=y;y->left=T; updH(y);updH(x); return x; }
AVL* rotL(AVL*x){ AVL*y=x->right,*T=y->left; y->left=x;x->right=T; updH(x);updH(y); return y; }

AVL* bal(AVL*n){
    updH(n); int b=bf(n);
    if(b>1){if(bf(n->left)<0)n->left=rotL(n->left);return rotR(n);}
    if(b<-1){if(bf(n->right)>0)n->right=rotR(n->right);return rotL(n);}
    return n;
}

AVL* ins(AVL*r,int v){
    if(!r){AVL*n=malloc(sizeof*n);n->data=v;n->left=n->right=NULL;n->height=0;return n;}
    if(v<r->data)r->left=ins(r->left,v);
    else if(v>r->data)r->right=ins(r->right,v);
    else return r;
    return bal(r);
}

AVL* del(AVL*r,int v){
    if(!r)return NULL;
    if(v<r->data){r->left=del(r->left,v);}
    else if(v>r->data){r->right=del(r->right,v);}
    else{
        if(!r->left||!r->right){AVL*t=r->left?r->left:r->right;free(r);return t;}
        AVL*s=r->right;while(s->left)s=s->left;
        r->data=s->data;r->right=del(r->right,s->data);
    }
    return bal(r);
}

void inorder(AVL*r){if(!r)return;inorder(r->left);printf("%d(bf=%d) ",r->data,bf(r));inorder(r->right);}
int count(AVL*r){return r?1+count(r->left)+count(r->right):0;}
void freeT(AVL*r){if(!r)return;freeT(r->left);freeT(r->right);free(r);}

// Verify AVL property
int isAVL(AVL*r){
    if(!r)return 1;
    int b=bf(r); if(b<-1||b>1)return 0;
    return isAVL(r->left)&&isAVL(r->right);
}

int main(){
    printf("=== AVL Tree Demo ===\\n");
    AVL *tree=NULL;

    // Insert sorted sequence (BST nightmare, AVL handles!)
    printf("\\nInserting 1..10 (sorted — BST worst case):\\n");
    for(int i=1;i<=10;i++){
        tree=ins(tree,i);
        printf("After ins(%2d): height=%d, nodes=%d, AVL=%s\\n",
               i, ht(tree), count(tree), isAVL(tree)?"✅":"❌");
    }

    printf("\\nInorder (with balance factors):\\n");
    inorder(tree); printf("\\n");

    printf("\\nHeight of AVL tree (sorted input): %d\\n", ht(tree));
    printf("Height of naive BST (sorted input): %d (=n-1=9)\\n", 9);
    printf("AVL saves ~%d levels!\\n", 9-ht(tree));

    printf("\\n=== Delete Operations ===\\n");
    for(int v : {5,3,8,1}){
        tree=del(tree,v);
        printf("Del %d: inorder= ",v); inorder(tree); printf("(AVL=%s)\\n",isAVL(tree)?"✅":"❌");
    }

    freeT(tree);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>

typedef struct A{int d,h;struct A*l,*r;}A;
int ht(A*n){return n?n->h:-1;}
int bf(A*n){return n?ht(n->l)-ht(n->r):0;}
void uh(A*n){if(n){int l=ht(n->l),r=ht(n->r);n->h=1+(l>r?l:r);}}
A* rR(A*y){A*x=y->l,*T=x->r;x->r=y;y->l=T;uh(y);uh(x);return x;}
A* rL(A*x){A*y=x->r,*T=y->l;y->l=x;x->r=T;uh(x);uh(y);return y;}
A* bal(A*n){uh(n);int b=bf(n);if(b>1){if(bf(n->l)<0)n->l=rL(n->l);return rR(n);}if(b<-1){if(bf(n->r)>0)n->r=rR(n->r);return rL(n);}return n;}
A* ins(A*r,int v){if(!r){A*n=malloc(sizeof*n);n->d=v;n->l=n->r=NULL;n->h=0;return n;}if(v<r->d)r->l=ins(r->l,v);else if(v>r->d)r->r=ins(r->r,v);else return r;return bal(r);}
void io(A*r){if(!r)return;io(r->l);printf("%d ",r->d);io(r->r);}

int main(){
    A*t=NULL;
    printf("Sorted insert (AVL handles gracefully):\\n");
    for(int i=1;i<=8;i++){t=ins(t,i);printf("h=%d ",ht(t));}
    printf("\\nInorder: ");io(t);printf("\\n");
    return 0;
}`,

      task: {
        description: 'AVL Tree practice: (1) "AVL Visualizer" — tree ko 2D format mein print karo showing balance factors. (2) "Self-Balancing Word Dictionary" — AVL tree pe words store karo, prefix search implement karo. (3) "Performance Comparison" — BST vs AVL worst case: sorted 1000 elements insert karo, search karo, times compare karo. (4) "AVL to Array" — AVL tree ko sorted array mein convert karo, phir wapas balanced AVL banao.',
        description_en: 'AVL Tree practice: (1) "AVL Visualizer" — print the tree in 2D format showing balance factors. (2) "Self-Balancing Word Dictionary" — store words in an AVL tree, implement prefix search. (3) "Performance Comparison" — BST vs AVL worst case: insert 1000 sorted elements, search, compare times. (4) "AVL to Array" — convert an AVL tree to a sorted array, then rebuild a balanced AVL from it.',
        hint: 'Visualizer: recursive print with indentation (right subtree first, then root, then left). Prefix search: inorder traversal, check strncmp(word, prefix, len). Performance: clock() for timing. Array to AVL: sorted_to_avl(arr, 0, n-1) recursive.',
        hint_en: 'Visualizer: recursive print with indentation (right subtree first, then root, then left). Prefix search: inorder traversal, check strncmp(word, prefix, len). Performance: clock() for timing. Array to AVL: sorted_to_avl(arr, 0, n-1) recursive.',
      },
      quiz: [
        {
          q: 'AVL rotation mein heights update karne ka order kyun matter karta hai?',
          options: [
            'Order matter nahi karta',
            'Rotation ke baad: pehle neeche wale node ki height update karo, phir upar wale ki. Galat order se parent ki height wrong hogi — balance check fail!',
            'Sirf root ki height update karo',
            'Heights auto-update hoti hain',
          ],
          correct: 1,
          explanation: 'Right rotation: y becomes child of x. y ki height update karo (new subtree ke basis pe), phir x ki update karo (y ki updated height use hogi). Galat order: x pehle update → y ki height stale use hogi → x ki height wrong → balance factor wrong → wrong rotation ya missed imbalance! Rule: always update from bottom to top.',
          q_en: 'Why does the order of height updates matter in AVL rotations?',
          options_en: [
            'Order does not matter',
            'After rotation: update the lower node\'s height first, then the upper node\'s. Wrong order means the parent\'s height will be incorrect — balance check fails!',
            'Only update the root\'s height',
            'Heights update automatically',
          ],
          explanation_en: 'Right rotation: y becomes child of x. Update y\'s height first (based on its new subtree), then update x\'s (using y\'s updated height). Wrong order: update x first → x uses y\'s stale height → x\'s height is wrong → wrong balance factor → wrong or missed rotation! Rule: always update from bottom to top.',
        },
        {
          q: 'Left-Right (LR) case mein 2 rotations kyun karne padte hain?',
          options: [
            'Ek rotation kaafi nahi hoti always',
            'LR case: left child right-heavy hai. Single right rotation se zigzag shape nahi solve hoti. Pehle left rotation (left child pe) = LL case mein convert, phir right rotation. 2 rotations = guaranteed fix.',
            'Performance ke liye',
            'AVL property require karta hai 2 rotations',
          ],
          correct: 1,
          explanation: 'LL case (left child left-heavy): single right rotation fixes it. LR case (left child right-heavy): node-leftchild-rightgrandchild = zigzag shape. One rotation can\'t fix this. Solution: first left-rotate left child (converts to LL case), then right-rotate root. Similarly RL case: right-rotate right child, then left-rotate root. These 4 cases cover all possible imbalances.',
          q_en: 'Why are 2 rotations needed in the Left-Right (LR) case?',
          options_en: [
            'One rotation is never enough',
            'LR case: left child is right-heavy. A single right rotation cannot resolve the zigzag shape. First do a left rotation (on the left child) = converts to LL case, then do a right rotation. 2 rotations = guaranteed fix.',
            'For performance',
            'AVL property requires 2 rotations',
          ],
          explanation_en: 'LL case (left child is left-heavy): single right rotation fixes it. LR case (left child is right-heavy): node-leftchild-rightgrandchild = zigzag shape. One rotation cannot fix this. Solution: first left-rotate the left child (converts to LL case), then right-rotate the root. Similarly for the RL case: right-rotate the right child, then left-rotate the root. These 4 cases cover all possible imbalances.',
        },
        {
          q: 'AVL tree mein height O(log n) kyun guaranteed hai?',
          options: [
            'Coincidence hai',
            'AVL property: har node ka balance factor -1,0,1. Mathematically proven: n nodes ke liye minimum height = floor(log2(n)). Maximum height ≤ 1.44 * log2(n). Always O(log n)!',
            'Sirf balanced input ke liye',
            'Rotations se height kam hoti hai',
          ],
          correct: 1,
          explanation: 'AVL height proof: Nh = minimum nodes in AVL tree of height h. N0=1, N1=2, Nh=Nh-1+Nh-2+1 (like Fibonacci). Nh ≈ φ^h / √5. Inverting: h ≤ 1.44 * log2(n+2). So height always O(log n), never O(n)! This is the mathematical guarantee that makes AVL useful. Insertions/deletions maintain this through rotations.',
          q_en: 'Why is the height of an AVL tree guaranteed to be O(log n)?',
          options_en: [
            'It is a coincidence',
            'AVL property: each node\'s balance factor is -1, 0, or 1. Mathematically proven: for n nodes, minimum height = floor(log2(n)). Maximum height ≤ 1.44 * log2(n). Always O(log n)!',
            'Only for balanced input',
            'Rotations reduce height',
          ],
          explanation_en: 'AVL height proof: let Nh = minimum nodes in an AVL tree of height h. N0=1, N1=2, Nh=Nh-1+Nh-2+1 (Fibonacci-like). Nh ≈ φ^h / √5. Inverting: h ≤ 1.44 * log2(n+2). So the height is always O(log n), never O(n)! This is the mathematical guarantee that makes AVL trees useful. Insertions and deletions maintain this property through rotations.',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w9-s4',
      title: 'Week 9 Project — Complete BST-based Dictionary',
      title_en: 'Week 9 Project — Complete BST-based Dictionary',
      emoji: '📖',
      content: `## Week 9 Project — BST se Real Dictionary Banao!

Is hafte seekha:
- Binary tree basics, traversals (inorder, preorder, postorder, level order)
- BST insert, search, delete, validation
- AVL tree — self-balancing, guaranteed O(log n)

### Project: StudyEarn Dictionary

\`\`\`c
// ── Word entry ──
typedef struct {
    char  word[50];
    char  meaning[200];
    char  example[200];
    char  partOfSpeech[20];  // noun, verb, adjective...
    int   frequency;          // how often used
} DictEntry;

// ── AVL-based dictionary ──
typedef struct DictNode {
    DictEntry        entry;
    int              height;
    struct DictNode *left, *right;
} DictNode;

// ── Features ──
// 1. Add word     — O(log n) insert
// 2. Search word  — O(log n) exact match
// 3. Auto-suggest — O(k) prefix search
// 4. Delete word  — O(log n) delete
// 5. List all     — O(n) inorder (sorted!)
// 6. Stats        — word count, height
// 7. Save/Load    — binary file (from Week 6!)
\`\`\`

### Prefix Search (Auto-suggest)

\`\`\`c
void autoSuggest(DictNode *root, const char *prefix, int *count) {
    if (!root || *count >= 10) return;  // max 10 suggestions

    // Inorder traversal — alphabetical order!
    autoSuggest(root->left, prefix, count);

    if (strncmp(root->entry.word, prefix, strlen(prefix)) == 0) {
        printf("  %d. %s\\n", ++(*count), root->entry.word);
    }
    // Optimization: if word > prefix alphabetically and no common prefix, skip right
    if (strcmp(root->entry.word, prefix) > 0 &&
        strncmp(root->entry.word, prefix, strlen(prefix)) != 0) {
        // No more matches possible in right subtree if prefix doesn't match
    }

    autoSuggest(root->right, prefix, count);
}
\`\`\`

### Persistence — File Save/Load

\`\`\`c
// Save dictionary to binary file
void saveDict(DictNode *root, FILE *fp) {
    if (!root) {
        // Write NULL marker
        int marker = -1;
        fwrite(&marker, sizeof(int), 1, fp);
        return;
    }
    // Write entry
    fwrite(&root->entry, sizeof(DictEntry), 1, fp);
    saveDict(root->left,  fp);
    saveDict(root->right, fp);
}

// Load dictionary from binary file (preorder reconstruction)
DictNode* loadDict(FILE *fp) {
    int marker;
    fread(&marker, sizeof(int), 1, fp);
    if (marker == -1) return NULL;

    DictEntry entry;
    // marker is actually first bytes of DictEntry
    memcpy(&entry, &marker, sizeof(int));
    fread((char*)&entry + sizeof(int),
          sizeof(DictEntry) - sizeof(int), 1, fp);

    DictNode *node = createDictNode(entry);
    node->left  = loadDict(fp);
    node->right = loadDict(fp);
    return node;
}
\`\`\`

### Month 3 Progress

\`\`\`
Month 3 (Weeks 9-12):
  ✅ Week 9:  Binary Trees, BST, AVL Tree
  📚 Week 10: Sorting Algorithms Master Class (next!)
  📚 Week 11: Graphs — DFS, BFS, Dijkstra
  📚 Week 12: Final Project + Certificate 🎓
\`\`\``,

      content_en: `## Week 9 Project — Build a BST-based Dictionary!

### Dictionary Structure

\`\`\`c
typedef struct {
    char word[50], meaning[200], pos[20];
    int  frequency;
} DictEntry;

typedef struct DNode {
    DictEntry e; int h;
    struct DNode *l,*r;
} DNode;
// All dictionary operations: O(log n)!
\`\`\`

### Prefix Search (Auto-suggest)

\`\`\`c
void suggest(DNode *r, const char *p, int *cnt) {
    if(!r||*cnt>=10) return;
    suggest(r->l, p, cnt);
    if(!strncmp(r->e.word, p, strlen(p)))
        printf("%d. %s\\n", ++(*cnt), r->e.word);
    suggest(r->r, p, cnt);
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    char word[50];
    char meaning[150];
    char pos[15];   // noun/verb/adj
    int  freq;
} Word;

typedef struct DN {
    Word data; int h;
    struct DN *l,*r;
} DN;

int ht(DN*n){return n?n->h:-1;}
int bf(DN*n){return n?ht(n->l)-ht(n->r):0;}
void uh(DN*n){if(n){int l=ht(n->l),r=ht(n->r);n->h=1+(l>r?l:r);}}

DN* rotR(DN*y){DN*x=y->l,*T=x->r;x->r=y;y->l=T;uh(y);uh(x);return x;}
DN* rotL(DN*x){DN*y=x->r,*T=y->l;y->l=x;x->r=T;uh(x);uh(y);return y;}
DN* bal(DN*n){uh(n);int b=bf(n);if(b>1){if(bf(n->l)<0)n->l=rotL(n->l);return rotR(n);}if(b<-1){if(bf(n->r)>0)n->r=rotR(n->r);return rotL(n);}return n;}

DN* ins(DN*r,Word w){
    if(!r){DN*n=malloc(sizeof*n);n->data=w;n->l=n->r=NULL;n->h=0;return n;}
    int c=strcmp(w.word,r->data.word);
    if(c<0)r->l=ins(r->l,w);
    else if(c>0)r->r=ins(r->r,w);
    else{r->data.freq++;return r;}  // duplicate: increment frequency
    return bal(r);
}

DN* search(DN*r,const char*w){
    if(!r)return NULL;
    int c=strcmp(w,r->data.word);
    if(!c)return r;
    return c<0?search(r->l,w):search(r->r,w);
}

// Print word entry
void printWord(const Word*w){
    printf("\\n📖 %s (%s)\\n",w->word,w->pos);
    printf("   Meaning: %s\\n",w->meaning);
    printf("   Freq: %d\\n",w->freq);
}

// Inorder: all words sorted
void listAll(DN*r){
    if(!r)return;
    listAll(r->l);
    printf("  %-15s (%s)\\n",r->data.word,r->data.pos);
    listAll(r->r);
}

// Prefix autocomplete
void suggest(DN*r,const char*p,int*cnt){
    if(!r||*cnt>=8)return;
    suggest(r->l,p,cnt);
    if(!strncmp(r->data.word,p,strlen(p))){
        printf("  %d. %-15s — %s\\n",++(*cnt),r->data.word,r->data.meaning);
    }
    suggest(r->r,p,cnt);
}

// Most frequent words
void mostFreq(DN*r,Word*top,int*n,int maxN){
    if(!r)return;
    mostFreq(r->l,top,n,maxN);
    if(*n<maxN){top[(*n)++]=r->data;}
    else{
        int minIdx=0;
        for(int i=1;i<maxN;i++) if(top[i].freq<top[minIdx].freq) minIdx=i;
        if(r->data.freq>top[minIdx].freq) top[minIdx]=r->data;
    }
    mostFreq(r->r,top,n,maxN);
}

int countWords(DN*r){return r?1+countWords(r->l)+countWords(r->r):0;}
void freeT(DN*r){if(!r)return;freeT(r->l);freeT(r->r);free(r);}

int main(){
    DN *dict=NULL;
    Word words[]={
        {"algorithm",  "Step-by-step procedure",          "noun", 95},
        {"array",      "Ordered collection of elements",  "noun", 88},
        {"balance",    "State of equality",               "noun", 72},
        {"binary",     "Related to base-2 number system", "adj",  81},
        {"compiler",   "Program that translates code",    "noun", 67},
        {"data",       "Raw facts and figures",           "noun", 99},
        {"debug",      "Find and fix errors in code",     "verb", 85},
        {"function",   "Reusable block of code",          "noun", 93},
        {"hash",       "Convert data to fixed-size value","noun", 78},
        {"integer",    "Whole number without decimals",   "noun", 90},
        {"loop",       "Repeated execution of code",      "noun", 88},
        {"memory",     "Computer storage space",          "noun", 96},
        {"null",       "Absence of value or pointer",     "noun", 84},
        {"operator",   "Symbol for an operation",         "noun", 75},
        {"pointer",    "Variable storing memory address", "noun", 87},
        {"queue",      "FIFO data structure",             "noun", 70},
        {"recursion",  "Function calling itself",         "noun", 82},
        {"stack",      "LIFO data structure",             "noun", 71},
        {"tree",       "Hierarchical data structure",     "noun", 79},
        {"variable",   "Named storage location",          "noun", 94},
    };
    int n=sizeof(words)/sizeof(words[0]);
    for(int i=0;i<n;i++) dict=ins(dict,words[i]);

    printf("=== StudyEarn CS Dictionary ===\\n");
    printf("Words: %d | Tree height: %d\\n\\n",countWords(dict),ht(dict));

    // Search
    const char *lookups[]={"pointer","recursion","xyz"};
    printf("=== Word Lookup ===\\n");
    for(int i=0;i<3;i++){
        DN*found=search(dict,lookups[i]);
        if(found) printWord(&found->data);
        else printf("\\n❌ '%s' not found\\n",lookups[i]);
    }

    // Autocomplete
    printf("\\n=== Autocomplete ===\\n");
    const char *prefixes[]={"st","re","po"};
    for(int i=0;i<3;i++){
        printf("Words starting with '%s':\\n",prefixes[i]);
        int cnt=0; suggest(dict,prefixes[i],&cnt);
        if(!cnt) printf("  (none)\\n");
    }

    // All words sorted
    printf("\\n=== All Words (sorted) ===\\n");
    listAll(dict);

    // Most frequent
    printf("\\n=== Top 5 Most Frequent Words ===\\n");
    Word top[5]; int tn=0;
    mostFreq(dict,top,&tn,5);
    // Simple sort by frequency
    for(int i=0;i<tn-1;i++)
        for(int j=0;j<tn-i-1;j++)
            if(top[j].freq<top[j+1].freq){Word t=top[j];top[j]=top[j+1];top[j+1]=t;}
    for(int i=0;i<tn;i++) printf("  #%d %-12s (freq=%d)\\n",i+1,top[i].word,top[i].freq);

    freeT(dict);
    return 0;
}`,

      codeExample_en: `/* See above — full dictionary with AVL tree */`,

      task: {
        description: 'Week 9 Final Project — Dictionary upgrade karo: (1) "Spell Checker" — word dictionary mein nahi hai toh closest words suggest karo (edit distance ≤ 2). (2) "Word Relations" — synonyms aur antonyms store karo (second AVL tree ya linked list as value). (3) "Frequency Analytics" — word usage frequency track karo, top 10 words print karo, histogram banao. (4) "File Import/Export" — dictionary ko CSV file mein save/load karo.',
        description_en: 'Week 9 Final Project — Upgrade the dictionary: (1) "Spell Checker" — if a word is not in the dictionary, suggest the closest words (edit distance ≤ 2). (2) "Word Relations" — store synonyms and antonyms (a second AVL tree or a linked list as the value). (3) "Frequency Analytics" — track word usage frequency, print the top 10 words, draw a histogram. (4) "File Import/Export" — save/load the dictionary to/from a CSV file.',
        hint: 'Edit distance: dynamic programming dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i]!=b[j])). Inorder traversal with min-edit-distance check on each word. Frequency: increment on each lookup. CSV: fprintf(fp,"%s,%s,%s,%d\\n",word,meaning,pos,freq).',
        hint_en: 'Edit distance: dynamic programming dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i]!=b[j])). Run inorder traversal with min-edit-distance check on each word. Frequency: increment on each lookup. CSV: fprintf(fp,"%s,%s,%s,%d\\n",word,meaning,pos,freq).',
      },
      quiz: [
        {
          q: 'BST se "kth smallest element" efficiently kaise nikalte hain?',
          options: [
            'Array mein copy karo phir sort karo',
            'Inorder traversal karo (gives sorted order), ek counter rakho, kth element pe stop karo — O(h+k) time. Ya: augmented BST mein har node mein left subtree size store karo — O(log n).',
            'Level order traversal use karo',
            'Binary search apply karo',
          ],
          correct: 1,
          explanation: 'Simple O(h+k): inorder traversal — sorted order mein visit. Counter decrement karo har visit pe, 0 hone pe return. Average O(k + log n). Optimized O(log n): augmented BST — each node stores left subtree size. Compare k with left_size+1: equal=found, less=go left, greater=go right, adjust k. Real: C++ order_statistics_tree (policy-based DS) uses this.',
          q_en: 'How do you efficiently find the kth smallest element in a BST?',
          options_en: [
            'Copy to array then sort',
            'Do inorder traversal (gives sorted order), keep a counter, stop at the kth element — O(h+k) time. Or: augmented BST storing left subtree size in each node — O(log n).',
            'Use level order traversal',
            'Apply binary search',
          ],
          explanation_en: 'Simple O(h+k): inorder traversal — visits in sorted order. Decrement a counter on each visit; return when it hits 0. Average O(k + log n). Optimised O(log n): augmented BST — each node stores its left subtree size. Compare k with left_size+1: equal=found, less=go left, greater=go right and adjust k. Real world: C++ order_statistics_tree (policy-based DS) uses this approach.',
        },
        {
          q: 'Prefix search (autocomplete) ke liye BST efficient hai? Better alternative kya hai?',
          options: [
            'BST best hai prefix ke liye',
            'BST prefix search O(n) worst case — poora tree scan karna pad sakta hai. Better: Trie (prefix tree) — O(m) search jahan m = prefix length. Spell checkers, search engines Trie use karte hain.',
            'Hash table better hai',
            'Prefix search tree mein nahi hoti',
          ],
          correct: 1,
          explanation: 'BST prefix search: sorted property se kuch prune kar sakte, lekin worst case O(n). Trie: har character ek node. "ca" prefix: root → c → a → sab children words. O(m) to reach prefix node, O(k) to collect all k matches. Memory trade-off: Trie uses more memory. Real: Google search = Trie variant. Autocomplete in IDEs = Trie. Our BST dict = good for exact lookup, less ideal for prefix.',
          q_en: 'Is a BST efficient for prefix search (autocomplete)? What is a better alternative?',
          options_en: [
            'BST is the best for prefix search',
            'BST prefix search is O(n) worst case — may need to scan the entire tree. Better: Trie (prefix tree) — O(m) search where m = prefix length. Spell checkers and search engines use Tries.',
            'Hash table is better',
            'Prefix search does not work in trees',
          ],
          explanation_en: 'BST prefix search: the sorted property allows some pruning, but worst case is O(n). Trie: each character is a node. "ca" prefix: root → c → a → all children are words. O(m) to reach the prefix node, O(k) to collect all k matches. Memory trade-off: Tries use more memory. Real world: Google search = Trie variant. IDE autocomplete = Trie. Our BST dictionary = great for exact lookup, less ideal for prefix search.',
        },
        {
          q: 'Tree ko binary file mein serialize/deserialize karne ka best approach kya hai?',
          options: [
            'Level order mein save karo',
            'Preorder traversal best hai — root pehle save hota hai, NULL markers ke saath reconstruct exact same tree hoti hai. Level order mein NULL handling complex hoti hai.',
            'Inorder mein save karo',
            'Postorder mein save karo',
          ],
          correct: 1,
          explanation: 'Preorder serialize: root → left → right. NULL ke liye special marker (-1 ya separate byte). Deserialize: first read = root, recursively build left, then right. Exact same structure reconstruct hoti hai! Inorder: BST reconstruct possible lekin shape lost (multiple BSTs same inorder). Postorder: last value = root, complex parsing. Preorder = simplest, most natural for trees.',
          q_en: 'What is the best approach to serialize/deserialize a tree to/from a binary file?',
          options_en: [
            'Save in level order',
            'Preorder traversal is the best — root is saved first; with NULL markers, the exact same tree can be reconstructed. Level order makes NULL handling complex.',
            'Save in inorder',
            'Save in postorder',
          ],
          explanation_en: 'Preorder serialize: root → left → right. Use a special marker (-1 or a separate byte) for NULL. Deserialize: first read = root, then recursively build left, then right. Exact same structure is reconstructed! Inorder: BST reconstruction is possible but shape is lost (multiple BSTs can share the same inorder). Postorder: last value = root, complex parsing. Preorder = simplest and most natural for trees.',
        },
      ],
    },
  ],
};