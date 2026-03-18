/**
 * StudyEarn AI — C Programming Course
 * Week 10: Sorting Algorithms Master Class
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_10 = {
  week: 10,
  title: 'Sorting Algorithms — Master Class',
  title_en: 'Sorting Algorithms — Master Class',
  description: 'Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix — har sorting algorithm samjho, compare karo, kab kya use karein!',
  description_en: 'Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix — understand every sorting algorithm, compare them, and know when to use which!',
  xpReward: 280,
  sections: [
    {
      id: 'c-w10-s1',
      title: 'O(n²) Sorts — Bubble, Selection, Insertion',
      title_en: 'O(n²) Sorts — Bubble, Selection, Insertion',
      emoji: '🫧',
      content: `## O(n²) Sorting Algorithms — Simple lekin Slow!

Beginner-friendly sorts hain — samajhne mein aasaan, lekin large data ke liye slow.

### Why Study O(n²)?
\`\`\`
✅ Interview mein concept clearly explain karna padta hai
✅ Small arrays (<50 elements) ke liye actually fast hain (cache friendly)
✅ Insertion sort: almost-sorted data ke liye O(n) — practical!
✅ Hybrid sorts (TimSort) internally Insertion sort use karte hain
\`\`\`

### Bubble Sort — Adjacent Elements Compare aur Swap

\`\`\`c
// Each pass: largest element "bubbles up" to end
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;  // optimization flag
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap
                int temp  = arr[j];
                arr[j]    = arr[j+1];
                arr[j+1]  = temp;
                swapped   = 1;
            }
        }
        if (!swapped) break;  // already sorted — early exit!
    }
}

// Pass 1: [64,34,25,12,22] → [34,25,12,22,64]  ← 64 bubbled up
// Pass 2: [34,25,12,22,64] → [25,12,22,34,64]  ← 34 bubbled up
// Pass 3: [25,12,22,34,64] → [12,22,25,34,64]  ← sorted!

// Time:  O(n²) worst/avg, O(n) best (sorted input with flag)
// Space: O(1) — in-place
// Stable: YES (equal elements maintain relative order)
\`\`\`

### Selection Sort — Minimum Element Select karo

\`\`\`c
// Each pass: minimum of remaining unsorted part find karo, swap to front
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        if (minIdx != i) {
            int temp      = arr[i];
            arr[i]        = arr[minIdx];
            arr[minIdx]   = temp;
        }
    }
}

// Pass 1: [64,25,12,22,11] → min=11 at idx 4 → swap → [11,25,12,22,64]
// Pass 2: [11,25,12,22,64] → min=12 at idx 2 → swap → [11,12,25,22,64]
// Pass 3: [11,12,25,22,64] → min=22 at idx 3 → swap → [11,12,22,25,64]
// Pass 4: [11,12,22,25,64] → min=25 at idx 3 → no swap → done!

// Time:  O(n²) always (no early exit possible)
// Space: O(1) — in-place
// Stable: NO (swap can change relative order of equal elements)
// Advantage: minimum number of swaps (exactly n-1 swaps worst case)
\`\`\`

### Insertion Sort — Card Game ki tarah!

\`\`\`c
// Think of sorting cards: pick next card, insert at correct position
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];   // "picked card"
        int j   = i - 1;

        // Shift all larger elements one position right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;   // insert at correct position
    }
}

// i=1: key=34, [64|34,25,12,22] → shift 64 → [34,64,25,12,22]
// i=2: key=25, [34,64|25,12,22] → shift 64,34 → [25,34,64,12,22]
// i=3: key=12, shift 64,34,25 → [12,25,34,64,22]
// i=4: key=22, shift 64,34,25 → [12,22,25,34,64] ✓

// Time:  O(n²) worst, O(n) best (already sorted!)
// Space: O(1)
// Stable: YES
// Best for: small arrays, nearly-sorted data, online sorting
\`\`\`

### Shell Sort — Insertion Sort ka Improved Version

\`\`\`c
// Gap sequence se compare karo — elements pehle se "partially sorted"
void shellSort(int arr[], int n) {
    // Start with large gap, reduce to 1
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j    = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j     -= gap;
            }
            arr[j] = temp;
        }
    }
}
// Time: O(n log²n) with good gap sequence
// Better than simple O(n²) in practice
\`\`\`

### Comparison — When to Use What

\`\`\`
Sort        Best    Average  Worst   Space  Stable  Notes
──────────────────────────────────────────────────────────────────
Bubble      O(n)    O(n²)    O(n²)   O(1)   ✅Yes   Educational only
Selection   O(n²)   O(n²)    O(n²)   O(1)   ❌No    Min swaps
Insertion   O(n)    O(n²)    O(n²)   O(1)   ✅Yes   Best for small/nearly sorted
Shell       O(n lg) O(n^1.3) O(n²)   O(1)   ❌No    Practical improvement
──────────────────────────────────────────────────────────────────
Rule of thumb: n < 50 → Insertion Sort, n >= 50 → use O(n log n)
\`\`\``,

      content_en: `## O(n²) Sorting Algorithms — Simple but Slow!

Beginner-friendly sorts hain — samajhne in aasaan, but large data ke liye slow.

### Why Study O(n²)?
\`\`\`
✅ Interview in concept clearly explain karna padta hai
✅ Small arrays (<50 elements) ke liye actually fast hain (cache friendly)
✅ Insertion sort: almost-sorted data ke liye O(n) — practical!
✅ Hybrid sorts (TimSort) internally Insertion sort use karte hain
\`\`\`

### Bubble Sort — Adjacent Elements Compare and Swap

\`\`\`c
// Each pass: largest element "bubbles up" to end
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;  // optimization flag
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap
                int temp  = arr[j];
                arr[j]    = arr[j+1];
                arr[j+1]  = temp;
                swapped   = 1;
            }
        }
        if (!swapped) break;  // already sorted — early exit!
    }
}

// Pass 1: [64,34,25,12,22] → [34,25,12,22,64]  ← 64 bubbled up
// Pass 2: [34,25,12,22,64] → [25,12,22,34,64]  ← 34 bubbled up
// Pass 3: [25,12,22,34,64] → [12,22,25,34,64]  ← sorted!

// Time:  O(n²) worst/avg, O(n) best (sorted input with flag)
// Space: O(1) — in-place
// Stable: YES (equal elements maintain relative order)
\`\`\`

### Selection Sort — Minimum Element Select do

\`\`\`c
// Each pass: minimum of remaining unsorted part find do, swap to front
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        if (minIdx != i) {
            int temp      = arr[i];
            arr[i]        = arr[minIdx];
            arr[minIdx]   = temp;
        }
    }
}

// Pass 1: [64,25,12,22,11] → min=11 at idx 4 → swap → [11,25,12,22,64]
// Pass 2: [11,25,12,22,64] → min=12 at idx 2 → swap → [11,12,25,22,64]
// Pass 3: [11,12,25,22,64] → min=22 at idx 3 → swap → [11,12,22,25,64]
// Pass 4: [11,12,22,25,64] → min=25 at idx 3 → no swap → done!

// Time:  O(n²) always (no early exit possible)
// Space: O(1) — in-place
// Stable: NO (swap can change relative order of equal elements)
// Advantage: minimum number of swaps (exactly n-1 swaps worst case)
\`\`\`

### Insertion Sort — Card Game ki tarah!

\`\`\`c
// Think of sorting cards: pick next card, insert at correct position
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];   // "picked card"
        int j   = i - 1;

        // Shift all larger elements one position right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;   // insert at correct position
    }
}

// i=1: key=34, [64|34,25,12,22] → shift 64 → [34,64,25,12,22]
// i=2: key=25, [34,64|25,12,22] → shift 64,34 → [25,34,64,12,22]
// i=3: key=12, shift 64,34,25 → [12,25,34,64,22]
// i=4: key=22, shift 64,34,25 → [12,22,25,34,64] ✓

// Time:  O(n²) worst, O(n) best (already sorted!)
// Space: O(1)
// Stable: YES
// Best for: small arrays, nearly-sorted data, online sorting
\`\`\`

### Shell Sort — Insertion Sort ka Improved Version

\`\`\`c
// Gap sequence se compare do — elements pehle se "partially sorted"
void shellSort(int arr[], int n) {
    // Start with large gap, reduce to 1
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j    = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j     -= gap;
            }
            arr[j] = temp;
        }
    }
}
// Time: O(n log²n) with good gap sequence
// Better than simple O(n²) in practice
\`\`\`

### Comparison — When to Use What

\`\`\`
Sort        Best    Average  Worst   Space  Stable  Notes
──────────────────────────────────────────────────────────────────
Bubble      O(n)    O(n²)    O(n²)   O(1)   ✅Yes   Educational only
Selection   O(n²)   O(n²)    O(n²)   O(1)   ❌No    Min swaps
Insertion   O(n)    O(n²)    O(n²)   O(1)   ✅Yes   Best for small/nearly sorted
Shell       O(n lg) O(n^1.3) O(n²)   O(1)   ❌No    Practical improvement
──────────────────────────────────────────────────────────────────
Rule of thumb: n < 50 → Insertion Sort, n >= 50 → use O(n log n)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define N 12

void printArr(int a[],int n,const char*label){
    printf("%-20s: ",label);
    for(int i=0;i<n;i++) printf("%3d",a[i]);
    printf("\\n");
}

void bubble(int a[],int n){
    int cmp=0,swp=0;
    for(int i=0;i<n-1;i++){
        int sw=0;
        for(int j=0;j<n-i-1;j++){
            cmp++;
            if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;sw=1;swp++;}
        }
        if(!sw)break;
    }
    printf("  comparisons=%-5d swaps=%d\\n",cmp,swp);
}

void selection(int a[],int n){
    int cmp=0,swp=0;
    for(int i=0;i<n-1;i++){
        int m=i;
        for(int j=i+1;j<n;j++){cmp++;if(a[j]<a[m])m=j;}
        if(m!=i){int t=a[i];a[i]=a[m];a[m]=t;swp++;}
    }
    printf("  comparisons=%-5d swaps=%d\\n",cmp,swp);
}

void insertion(int a[],int n){
    int cmp=0,swp=0;
    for(int i=1;i<n;i++){
        int k=a[i],j=i-1;
        while(j>=0&&(cmp++,a[j]>k)){a[j+1]=a[j];j--;swp++;}
        a[j+1]=k;
    }
    printf("  comparisons=%-5d swaps=%d\\n",cmp,swp);
}

void shell(int a[],int n){
    for(int gap=n/2;gap>0;gap/=2)
        for(int i=gap;i<n;i++){
            int t=a[i],j=i;
            while(j>=gap&&a[j-gap]>t){a[j]=a[j-gap];j-=gap;}
            a[j]=t;
        }
}

// Test stability
typedef struct { int key; char name[10]; } Item;
void stableCheck(){
    Item items[]={{3,"Alice"},{1,"Bob"},{3,"Carol"},{2,"Dave"},{1,"Eve"}};
    int n=5;
    // Insertion sort (stable)
    for(int i=1;i<n;i++){
        Item k=items[i]; int j=i-1;
        while(j>=0&&items[j].key>k.key){items[j+1]=items[j];j--;}
        items[j+1]=k;
    }
    printf("Stable sort result: ");
    for(int i=0;i<n;i++) printf("[%d:%s] ",items[i].key,items[i].name);
    printf("\\n(Bob before Eve, Alice before Carol — stability preserved)\\n");
}

int main(){
    int orig[]={64,34,25,12,22,11,90,45,78,35,60,18};

    int a[N]; // working copy

    printf("=== O(n²) Sorting Comparison (n=%d) ===\\n\\n",N);
    printArr(orig,N,"Original");
    printf("\\n");

    // Bubble Sort
    memcpy(a,orig,sizeof(orig));
    printf("Bubble Sort:\\n");
    printArr(a,N,"  Before"); bubble(a,N);
    printArr(a,N,"  After ");

    // Selection Sort
    memcpy(a,orig,sizeof(orig));
    printf("\\nSelection Sort:\\n");
    printArr(a,N,"  Before"); selection(a,N);
    printArr(a,N,"  After ");

    // Insertion Sort
    memcpy(a,orig,sizeof(orig));
    printf("\\nInsertion Sort:\\n");
    printArr(a,N,"  Before"); insertion(a,N);
    printArr(a,N,"  After ");

    // Shell Sort
    memcpy(a,orig,sizeof(orig));
    printf("\\nShell Sort:\\n");
    printArr(a,N,"  Before"); shell(a,N);
    printArr(a,N,"  After ");

    // Nearly sorted — insertion sort shines!
    printf("\\n=== Nearly Sorted Array (Insertion Sort advantage) ===\\n");
    int nearly[]={1,2,3,5,4,6,7,8,10,9,11,12};
    memcpy(a,nearly,sizeof(nearly));
    printArr(a,N,"Nearly sorted");
    printf("Insertion: ");
    insertion(a,N);

    // Stability test
    printf("\\n=== Stability Test ===\\n");
    stableCheck();

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>

void bubble(int a[],int n){
    for(int i=0;i<n-1;i++){int sw=0;for(int j=0;j<n-i-1;j++)if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;sw=1;}if(!sw)break;}
}
void selection(int a[],int n){
    for(int i=0;i<n-1;i++){int m=i;for(int j=i+1;j<n;j++)if(a[j]<a[m])m=j;if(m!=i){int t=a[i];a[i]=a[m];a[m]=t;}}
}
void insertion(int a[],int n){
    for(int i=1;i<n;i++){int k=a[i],j=i-1;while(j>=0&&a[j]>k){a[j+1]=a[j];j--;}a[j+1]=k;}
}
void print(int a[],int n){for(int i=0;i<n;i++)printf("%d ",a[i]);printf("\\n");}

int main(){
    int orig[]={64,34,25,12,22,11,90},n=7,a[7];
    memcpy(a,orig,sizeof(orig)); bubble(a,n);    printf("Bubble:    "); print(a,n);
    memcpy(a,orig,sizeof(orig)); selection(a,n); printf("Selection: "); print(a,n);
    memcpy(a,orig,sizeof(orig)); insertion(a,n); printf("Insertion: "); print(a,n);
    return 0;
}`,

      task: {
        description: 'O(n²) sorts deep practice: (1) "Visualize Bubble Sort" — har pass ke baad array print karo, swaps count karo, "already sorted" detection dikhao. (2) "Cocktail Shaker Sort" — bidirectional bubble sort implement karo (forward + backward passes). (3) "Insertion Sort on Linked List" — linked list pe insertion sort karo (no array). (4) "Benchmark" — 1000 random elements pe teeno sorts run karo, time measure karo (clock()).',
        description_en: 'O(n²) sorts deep practice: (1) "Visualize Bubble Sort" — print the array after every pass, count swaps, show "already sorted" detection. (2) "Cocktail Shaker Sort" — implement bidirectional bubble sort (forward + backward passes). (3) "Insertion Sort on Linked List" — run insertion sort on a linked list (no array). (4) "Benchmark" — run all three sorts on 1000 random elements and measure time with clock().',
        hint: 'Cocktail shaker: flag left and right boundaries, shrink after each pass. Linked list insertion sort: maintain sorted prefix, for each new node find insertion point. clock(): double t = (double)(clock()-start)/CLOCKS_PER_SEC.',
        hint_en: 'Cocktail shaker: track left and right boundaries, shrink after each pass. Linked list insertion sort: maintain a sorted prefix, find the insertion point for each new node. clock(): double t = (double)(clock()-start)/CLOCKS_PER_SEC.',
      },
      quiz: [
        {
          q: 'Insertion Sort ko "almost sorted" array ke liye kyun prefer karte hain?',
          options: [
            'Hamesha fastest hai',
            'Almost sorted mein: har element almost correct position pe hai. Inner while loop zyada nahi chalti — O(n) total comparisons + O(n) shifts. Practically fastest for this input. TimSort yahi use karta hai!',
            'Stable hai isliye',
            'Memory efficient hai',
          ],
          correct: 1,
          explanation: 'Insertion sort best case: already sorted array mein inner while never executes → O(n) total. Each element shifted 0-1 positions. "K-sorted" array (each element at most k positions from final): O(nk) time. TimSort (Python/Java default) uses insertion sort for small runs (<64 elements) specifically because of this property.',
          q_en: 'Why is Insertion Sort preferred for almost-sorted arrays?',
          options_en: [
            'It is always the fastest',
            'In an almost-sorted array, each element is nearly in the right position. The inner while loop runs very little — O(n) total comparisons + O(n) shifts. Practically fastest for this input. TimSort uses this!',
            'Because it is stable',
            'Because it is memory-efficient',
          ],
          explanation_en: 'Insertion sort best case: on an already-sorted array the inner while never executes → O(n) total. Each element is shifted 0–1 positions. "K-sorted" array (each element at most k positions from final): O(nk) time. TimSort (Python/Java default) uses insertion sort for small runs (< 64 elements) specifically because of this property.',
        },
        {
          q: 'Stable sort kya hota hai aur kyun important hai?',
          options: [
            'Fast sort hai',
            'Stable sort: equal key wale elements ka relative order maintain hota hai. Important: multi-key sorting mein — pehle name se sort karo, phir age se stable sort karo → age by age, same age mein name order preserved.',
            'In-place sort hai',
            'O(n) sort hai',
          ],
          correct: 1,
          explanation: 'Example: [{Alice,3},{Bob,1},{Carol,3},{Dave,1}] sort by number. Stable: [{Bob,1},{Dave,1},{Alice,3},{Carol,3}] — Bob before Dave (original order), Alice before Carol. Unstable: could be [{Dave,1},{Bob,1},{Carol,3},{Alice,3}] — order scrambled. Stable sorts: Merge Sort, Insertion Sort, TimSort. Unstable: Quick Sort, Heap Sort, Selection Sort.',
          q_en: 'What is a stable sort and why does it matter?',
          options_en: [
            'A fast sort',
            'Stable sort: the relative order of elements with equal keys is preserved. Important for multi-key sorting — first sort by name, then stable-sort by age → age-by-age, same-age name order preserved.',
            'An in-place sort',
            'An O(n) sort',
          ],
          explanation_en: 'Example: [{Alice,3},{Bob,1},{Carol,3},{Dave,1}] sorted by number. Stable: [{Bob,1},{Dave,1},{Alice,3},{Carol,3}] — Bob before Dave (original order), Alice before Carol. Unstable: could be [{Dave,1},{Bob,1},{Carol,3},{Alice,3}] — order scrambled. Stable sorts: Merge Sort, Insertion Sort, TimSort. Unstable: Quick Sort, Heap Sort, Selection Sort.',
        },
        {
          q: 'Selection Sort ka ek unique advantage kya hai jo aur sorts mein nahi?',
          options: [
            'Fastest hai',
            'Minimum number of swaps — exactly n-1 swaps worst case (vs Bubble: O(n²) swaps). Jab swap operation expensive ho (large objects, disk I/O), Selection Sort win karta hai.',
            'Stable hai',
            'Best case O(n) hai',
          ],
          correct: 1,
          explanation: 'Selection sort: exactly one swap per pass = maximum n-1 swaps total. Bubble sort: O(n²) swaps worst case. When swapping is expensive (e.g., swapping large struct objects, disk sectors, tape storage) selection sort wins despite same O(n²) comparisons. Practical: sorting large records where comparison is cheap but move is expensive.',
          q_en: 'What is a unique advantage of Selection Sort that other sorts lack?',
          options_en: [
            'It is the fastest',
            'Minimum number of swaps — exactly n-1 swaps worst case (vs Bubble: O(n²) swaps). When swapping is expensive (large objects, disk I/O), Selection Sort wins.',
            'It is stable',
            'O(n) best case',
          ],
          explanation_en: 'Selection sort: exactly one swap per pass = maximum n-1 swaps total. Bubble sort: O(n²) swaps worst case. When swapping is expensive (e.g., swapping large struct objects, disk sectors, tape storage), selection sort wins despite the same O(n²) comparisons. Practical: sorting large records where comparison is cheap but moving is expensive.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w10-s2',
      title: 'O(n log n) Sorts — Merge Sort aur Quick Sort',
      title_en: 'O(n log n) Sorts — Merge Sort and Quick Sort',
      emoji: '⚡',
      content: `## O(n log n) — Professional Sorting!

Ye algorithms large datasets ke liye use hote hain — real applications mein.

### Merge Sort — Divide and Conquer

\`\`\`c
// Split → Sort halves → Merge
// Guaranteed O(n log n) — best, worst, average same!

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];  // <= for stability!
        else               arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L); free(R);
}

void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;  // base case: 1 element

    int mid = left + (right - left) / 2;  // avoid overflow!
    mergeSort(arr, left,  mid);
    mergeSort(arr, mid+1, right);
    merge(arr, left, mid, right);
}
// Call: mergeSort(arr, 0, n-1);

// Visualization:
// [38,27,43,3,9,82,10]
// Split: [38,27,43,3] [9,82,10]
// Split: [38,27] [43,3] [9,82] [10]
// Split: [38][27] [43][3] [9][82] [10]
// Merge: [27,38] [3,43] [9,82] [10]
// Merge: [3,27,38,43] [9,10,82]
// Merge: [3,9,10,27,38,43,82] ✓

// Time:  O(n log n) always
// Space: O(n) — needs auxiliary array
// Stable: YES
// Best for: linked lists, external sorting, stability needed
\`\`\`

### Quick Sort — Most Used in Practice!

\`\`\`c
// Pivot choose karo → partition → recursively sort both sides

int partition(int arr[], int low, int high) {
    int pivot = arr[high];  // last element as pivot
    int i = low - 1;        // smaller elements boundary

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp  = arr[i];
            arr[i]    = arr[j];
            arr[j]    = temp;
        }
    }
    // Put pivot in correct position
    int temp    = arr[i+1];
    arr[i+1]    = arr[high];
    arr[high]   = temp;
    return i + 1;  // pivot index
}

void quickSort(int arr[], int low, int high) {
    if (low >= high) return;
    int pi = partition(arr, low, high);
    quickSort(arr, low,    pi - 1);  // left of pivot
    quickSort(arr, pi + 1, high);    // right of pivot
}

// Visualization with pivot=10:
// [10,7,8,9,1,5] pivot=5
// j=0: 10>5, skip
// j=1: 7>5, skip
// j=2: 8>5, skip
// j=3: 9>5, skip
// j=4: 1<=5, swap → i=0, [1,7,8,9,10,5]
// Place pivot: [1,5,8,9,10,7]  ← 5 in position!
// Recurse on [1] and [8,9,10,7]
\`\`\`

### Quick Sort — Pivot Strategies

\`\`\`c
// Strategy 1: Last element (simple but bad for sorted input)
int pivot = arr[high];  // O(n²) on sorted array!

// Strategy 2: First element
int pivot = arr[low];   // also bad for sorted array

// Strategy 3: Random pivot (much better!)
int randIdx = low + rand() % (high - low + 1);
int temp    = arr[randIdx]; arr[randIdx] = arr[high]; arr[high] = temp;
int pivot   = arr[high];
// Expected O(n log n), astronomically unlikely worst case

// Strategy 4: Median of Three (best in practice)
int mid   = low + (high - low) / 2;
// Sort low, mid, high
if (arr[low] > arr[mid])  { int t=arr[low];  arr[low]=arr[mid];  arr[mid]=t;  }
if (arr[low] > arr[high]) { int t=arr[low];  arr[low]=arr[high]; arr[high]=t; }
if (arr[mid] > arr[high]) { int t=arr[mid];  arr[mid]=arr[high]; arr[high]=t; }
// arr[mid] is now median → swap to high-1 as pivot
int pivot = arr[mid];

// 3-way partition (Dutch National Flag) — handles duplicates efficiently
void quickSort3Way(int arr[], int lo, int hi) {
    if (lo >= hi) return;
    int lt = lo, gt = hi, i = lo;
    int pivot = arr[lo];
    while (i <= gt) {
        if      (arr[i] < pivot) { SWAP(arr[lt++], arr[i++]); }
        else if (arr[i] > pivot) { SWAP(arr[i],    arr[gt--]); }
        else                     { i++; }
    }
    // arr[lo..lt-1] < pivot, arr[lt..gt] == pivot, arr[gt+1..hi] > pivot
    quickSort3Way(arr, lo, lt-1);
    quickSort3Way(arr, gt+1, hi);
}
\`\`\`

### Merge vs Quick — Deep Comparison

\`\`\`
Feature         Merge Sort      Quick Sort
────────────────────────────────────────────────────────────
Time (avg)      O(n log n)      O(n log n)
Time (worst)    O(n log n) ✅   O(n²) — bad pivot ❌
Time (best)     O(n log n)      O(n log n)
Space           O(n) ❌         O(log n) ✅ (stack)
Stable          Yes ✅          No ❌
Cache friendly  Poor ❌         Excellent ✅ (in-place)
Real speed      Slower          2-3x faster in practice!
Best for        Linked lists    Arrays, in-place sorting
                External sort   Most real applications
                Stability needed
────────────────────────────────────────────────────────────
Winner: QuickSort for most cases (cache + in-place advantage)
        MergeSort for stability or linked lists
\`\`\``,

      content_en: `## O(n log n) — Professional Sorting!

Ye algorithms large datasets ke liye use hote hain — real applications mein.

### Merge Sort — Divide and Conquer

\`\`\`c
// Split → Sort halves → Merge
// Guaranteed O(n log n) — best, worst, average same!

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];  // <= for stability!
        else               arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L); free(R);
}

void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;  // base case: 1 element

    int mid = left + (right - left) / 2;  // avoid overflow!
    mergeSort(arr, left,  mid);
    mergeSort(arr, mid+1, right);
    merge(arr, left, mid, right);
}
// Call: mergeSort(arr, 0, n-1);

// Visualization:
// [38,27,43,3,9,82,10]
// Split: [38,27,43,3] [9,82,10]
// Split: [38,27] [43,3] [9,82] [10]
// Split: [38][27] [43][3] [9][82] [10]
// Merge: [27,38] [3,43] [9,82] [10]
// Merge: [3,27,38,43] [9,10,82]
// Merge: [3,9,10,27,38,43,82] ✓

// Time:  O(n log n) always
// Space: O(n) — needs auxiliary array
// Stable: YES
// Best for: linked lists, external sorting, stability needed
\`\`\`

### Quick Sort — Most Used in Practice!

\`\`\`c
// Pivot choose do → partition → recursively sort both sides

int partition(int arr[], int low, int high) {
    int pivot = arr[high];  // last element as pivot
    int i = low - 1;        // smaller elements boundary

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp  = arr[i];
            arr[i]    = arr[j];
            arr[j]    = temp;
        }
    }
    // Put pivot in correct position
    int temp    = arr[i+1];
    arr[i+1]    = arr[high];
    arr[high]   = temp;
    return i + 1;  // pivot index
}

void quickSort(int arr[], int low, int high) {
    if (low >= high) return;
    int pi = partition(arr, low, high);
    quickSort(arr, low,    pi - 1);  // left of pivot
    quickSort(arr, pi + 1, high);    // right of pivot
}

// Visualization with pivot=10:
// [10,7,8,9,1,5] pivot=5
// j=0: 10>5, skip
// j=1: 7>5, skip
// j=2: 8>5, skip
// j=3: 9>5, skip
// j=4: 1<=5, swap → i=0, [1,7,8,9,10,5]
// Place pivot: [1,5,8,9,10,7]  ← 5 in position!
// Recurse on [1] and [8,9,10,7]
\`\`\`

### Quick Sort — Pivot Strategies

\`\`\`c
// Strategy 1: Last element (simple but bad for sorted input)
int pivot = arr[high];  // O(n²) on sorted array!

// Strategy 2: First element
int pivot = arr[low];   // also bad for sorted array

// Strategy 3: Random pivot (much better!)
int randIdx = low + rand() % (high - low + 1);
int temp    = arr[randIdx]; arr[randIdx] = arr[high]; arr[high] = temp;
int pivot   = arr[high];
// Expected O(n log n), astronomically unlikely worst case

// Strategy 4: Median of Three (best in practice)
int mid   = low + (high - low) / 2;
// Sort low, mid, high
if (arr[low] > arr[mid])  { int t=arr[low];  arr[low]=arr[mid];  arr[mid]=t;  }
if (arr[low] > arr[high]) { int t=arr[low];  arr[low]=arr[high]; arr[high]=t; }
if (arr[mid] > arr[high]) { int t=arr[mid];  arr[mid]=arr[high]; arr[high]=t; }
// arr[mid] is now median → swap to high-1 as pivot
int pivot = arr[mid];

// 3-way partition (Dutch National Flag) — handles duplicates efficiently
void quickSort3Way(int arr[], int lo, int hi) {
    if (lo >= hi) return;
    int lt = lo, gt = hi, i = lo;
    int pivot = arr[lo];
    while (i <= gt) {
        if      (arr[i] < pivot) { SWAP(arr[lt++], arr[i++]); }
        else if (arr[i] > pivot) { SWAP(arr[i],    arr[gt--]); }
        else                     { i++; }
    }
    // arr[lo..lt-1] < pivot, arr[lt..gt] == pivot, arr[gt+1..hi] > pivot
    quickSort3Way(arr, lo, lt-1);
    quickSort3Way(arr, gt+1, hi);
}
\`\`\`

### Merge vs Quick — Deep Comparison

\`\`\`
Feature         Merge Sort      Quick Sort
────────────────────────────────────────────────────────────
Time (avg)      O(n log n)      O(n log n)
Time (worst)    O(n log n) ✅   O(n²) — bad pivot ❌
Time (best)     O(n log n)      O(n log n)
Space           O(n) ❌         O(log n) ✅ (stack)
Stable          Yes ✅          No ❌
Cache friendly  Poor ❌         Excellent ✅ (in-place)
Real speed      Slower          2-3x faster in practice!
Best for        Linked lists    Arrays, in-place sorting
                External sort   Most real applications
                Stability needed
────────────────────────────────────────────────────────────
Winner: QuickSort for most cases (cache + in-place advantage)
        MergeSort for stability or linked lists
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// ── Merge Sort ──
void merge(int a[],int l,int m,int r){
    int n1=m-l+1,n2=r-m;
    int *L=malloc(n1*4),*R=malloc(n2*4);
    for(int i=0;i<n1;i++)L[i]=a[l+i];
    for(int i=0;i<n2;i++)R[i]=a[m+1+i];
    int i=0,j=0,k=l;
    while(i<n1&&j<n2)a[k++]=L[i]<=R[j]?L[i++]:R[j++];
    while(i<n1)a[k++]=L[i++];
    while(j<n2)a[k++]=R[j++];
    free(L);free(R);
}
void mergeSort(int a[],int l,int r){
    if(l>=r)return;
    int m=l+(r-l)/2;
    mergeSort(a,l,m);mergeSort(a,m+1,r);merge(a,l,m,r);
}

// ── Quick Sort (random pivot) ──
void swap_(int*a,int*b){int t=*a;*a=*b;*b=t;}
int partition(int a[],int lo,int hi){
    int ri=lo+rand()%(hi-lo+1); swap_(&a[ri],&a[hi]);
    int piv=a[hi],i=lo-1;
    for(int j=lo;j<hi;j++) if(a[j]<=piv)swap_(&a[++i],&a[j]);
    swap_(&a[i+1],&a[hi]);
    return i+1;
}
void quickSort(int a[],int lo,int hi){
    if(lo>=hi)return;
    int p=partition(a,lo,hi);
    quickSort(a,lo,p-1);quickSort(a,p+1,hi);
}

// ── 3-way Quick Sort (for duplicates) ──
void quick3(int a[],int lo,int hi){
    if(lo>=hi)return;
    int lt=lo,gt=hi,i=lo,piv=a[lo];
    while(i<=gt){
        if(a[i]<piv)     swap_(&a[lt++],&a[i++]);
        else if(a[i]>piv)swap_(&a[i],&a[gt--]);
        else             i++;
    }
    quick3(a,lo,lt-1);quick3(a,gt+1,hi);
}

void printArr(int a[],int n,const char*l){
    printf("%-14s: ",l);
    for(int i=0;i<n;i++)printf("%3d",a[i]);
    printf("\\n");
}

// ── Performance benchmark ──
double benchmark(void(*sortFn)(int*,int,int),int*orig,int n){
    int*a=malloc(n*4);
    memcpy(a,orig,n*4);
    clock_t s=clock();
    sortFn(a,0,n-1);
    double t=(double)(clock()-s)/CLOCKS_PER_SEC*1000;
    free(a);
    return t;
}

int main(){
    srand(42);
    int orig[]={38,27,43,3,9,82,10,64,34,25,12,22,11,90,45,78};
    int n=sizeof(orig)/sizeof(orig[0]);
    int a[16];

    printf("=== O(n log n) Sorts (n=%d) ===\\n\\n",n);
    printArr(orig,n,"Original");

    memcpy(a,orig,sizeof(orig));
    mergeSort(a,0,n-1);
    printArr(a,n,"Merge Sort");

    memcpy(a,orig,sizeof(orig));
    quickSort(a,0,n-1);
    printArr(a,n,"Quick Sort");

    // Duplicates test — 3-way wins!
    printf("\\n=== 3-way Quick Sort (many duplicates) ===\\n");
    int dups[]={3,1,4,1,5,9,2,6,5,3,5,9,7,9,3,2,3,8};
    int nd=sizeof(dups)/sizeof(dups[0]);
    int d[18]; memcpy(d,dups,sizeof(dups));
    printArr(d,nd,"Before");
    quick3(d,0,nd-1);
    printArr(d,nd,"After 3-way");

    // Large benchmark
    printf("\\n=== Performance Benchmark ===\\n");
    int sizes[]={1000,10000,100000};
    for(int s=0;s<3;s++){
        int sz=sizes[s];
        int*data=malloc(sz*4);
        for(int i=0;i<sz;i++) data[i]=rand()%sz;

        printf("n=%-8d ",sz);
        printf("MergeSort: %6.2fms  ",benchmark(mergeSort,data,sz));
        printf("QuickSort: %6.2fms\\n",benchmark(quickSort,data,sz));
        free(data);
    }

    // Sorted input — quick sort danger
    printf("\\n=== Sorted Input Test (Quick worst case risk) ===\\n");
    int sorted[100]; for(int i=0;i<100;i++) sorted[i]=i;
    int sc[100];
    memcpy(sc,sorted,sizeof(sorted));
    printf("Random pivot QS on sorted[100]: ");
    quickSort(sc,0,99);
    printf("OK (random pivot saves us!)\\n");

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void merge(int a[],int l,int m,int r){
    int n1=m-l+1,n2=r-m;
    int*L=malloc(n1*4),*R=malloc(n2*4);
    for(int i=0;i<n1;i++)L[i]=a[l+i];
    for(int i=0;i<n2;i++)R[i]=a[m+1+i];
    int i=0,j=0,k=l;
    while(i<n1&&j<n2)a[k++]=L[i]<=R[j]?L[i++]:R[j++];
    while(i<n1)a[k++]=L[i++];
    while(j<n2)a[k++]=R[j++];
    free(L);free(R);
}
void ms(int a[],int l,int r){if(l>=r)return;int m=l+(r-l)/2;ms(a,l,m);ms(a,m+1,r);merge(a,l,m,r);}

void sw(int*a,int*b){int t=*a;*a=*b;*b=t;}
int part(int a[],int lo,int hi){int p=a[hi],i=lo-1;for(int j=lo;j<hi;j++)if(a[j]<=p)sw(&a[++i],&a[j]);sw(&a[i+1],&a[hi]);return i+1;}
void qs(int a[],int lo,int hi){if(lo>=hi)return;int p=part(a,lo,hi);qs(a,lo,p-1);qs(a,p+1,hi);}

void pr(int a[],int n){for(int i=0;i<n;i++)printf("%d ",a[i]);printf("\\n");}

int main(){
    int a[]={38,27,43,3,9,82,10,64},n=8,b[8];
    memcpy(b,a,sizeof(a)); ms(b,0,n-1); printf("Merge: "); pr(b,n);
    memcpy(b,a,sizeof(a)); qs(b,0,n-1); printf("Quick: "); pr(b,n);
    return 0;
}`,

      task: {
        description: 'Merge & Quick sort practice: (1) "Merge K Sorted Arrays" — k sorted arrays ko ek sorted array mein merge karo (min-heap use karo). (2) "QuickSelect" — array mein kth smallest element O(n) average mein find karo (quick sort partition use karo, full sort mat karo). (3) "External Sort Simulation" — large file sort karo: 100 chunks mein split karo, har chunk sort karo, phir k-way merge karo. (4) "Sort stability verify karo" — struct array pe stable vs unstable sort ka difference demonstrate karo.',
        description_en: 'Merge & Quick sort practice: (1) "Merge K Sorted Arrays" — merge k sorted arrays into one sorted array (use a min-heap). (2) "QuickSelect" — find the kth smallest element in O(n) average (use quick sort partitioning, don\'t fully sort). (3) "External Sort Simulation" — sort a large file: split into 100 chunks, sort each chunk, then k-way merge. (4) "Verify sort stability" — demonstrate the difference between stable vs unstable sort on a struct array.',
        hint: 'QuickSelect: after partition, if pi==k return arr[pi], elif k<pi recurse left only, else recurse right only. Merge K arrays: min-heap of (value, array_idx, element_idx). External sort: sort chunks in memory, merge using k-way merge with priority queue.',
        hint_en: 'QuickSelect: after partition, if pi==k return arr[pi]; if k<pi recurse left only; else recurse right only. Merge K arrays: min-heap of (value, array_idx, element_idx). External sort: sort chunks in memory, merge using k-way merge with priority queue.',
      },
      quiz: [
        {
          q: 'Merge Sort Quick Sort se practically slower kyun hai despite same O(n log n)?',
          options: [
            'Complexity wrong calculate ki',
            'Cache behavior: Quick Sort in-place — adjacent memory access → CPU cache efficient. Merge Sort: auxiliary array allocate karta hai → cache misses zyada. Constant factor: Quick Sort ~2-3x faster in practice.',
            'Merge Sort O(n²) hai actually',
            'Quick Sort zyada memory use karta hai',
          ],
          correct: 1,
          explanation: 'O(n log n) = same asymptotic, but constant factors differ. Quick Sort: works directly on input array (in-place), sequential memory access → L1/L2 cache hits. Merge Sort: copy to auxiliary arrays, merge back → scattered memory access → cache misses. Memory allocation (malloc/free) overhead bhi hai. Real benchmark: Quick Sort typically 1.5-3x faster on modern CPUs. Exception: linked lists, external sorting → Merge Sort wins.',
          q_en: 'Why is Merge Sort practically slower than Quick Sort despite the same O(n log n)?',
          options_en: [
            'The complexity is calculated wrong',
            'Cache behaviour: Quick Sort is in-place — adjacent memory access → CPU cache-friendly. Merge Sort allocates auxiliary arrays → more cache misses. Constant factor: Quick Sort is ~2–3× faster in practice.',
            'Merge Sort is actually O(n²)',
            'Quick Sort uses more memory',
          ],
          explanation_en: 'O(n log n) = same asymptotic complexity, but constant factors differ. Quick Sort: works directly on the input array (in-place), sequential memory access → L1/L2 cache hits. Merge Sort: copies to auxiliary arrays, merges back → scattered memory access → cache misses. malloc/free overhead adds up too. Real benchmark: Quick Sort is typically 1.5–3× faster on modern CPUs. Exceptions: linked lists, external sorting → Merge Sort wins.',
        },
        {
          q: 'Quick Sort ka worst case O(n²) kab hota hai aur kaise avoid karein?',
          options: [
            'Random input pe',
            'Already sorted ya reverse sorted input pe (pivot always min/max → unbalanced partitions). Fix: random pivot ya median-of-3. Worst case O(n²) practically impossible with randomization.',
            'Duplicate elements pe',
            'Large arrays pe',
          ],
          correct: 1,
          explanation: 'Worst case: pivot always = min or max → one partition empty, other = n-1. [1,2,3,4,5] with last element pivot: [1,2,3,4] and [5] → T(n) = T(n-1) + O(n) = O(n²). Solutions: (1) Random pivot: O(n²) expected with probability 1/n! — astronomically unlikely. (2) Median-of-3: even more robust. (3) 3-way partitioning: handles duplicates. Production: use introsort (hybrid quick+heap+insertion) for guaranteed O(n log n).',
          q_en: 'When does Quick Sort hit O(n²) worst case and how do you avoid it?',
          options_en: [
            'On random input',
            'On already sorted or reverse-sorted input (pivot always min/max → unbalanced partitions). Fix: random pivot or median-of-3. With randomisation, worst case is practically impossible.',
            'With duplicate elements',
            'On large arrays',
          ],
          explanation_en: 'Worst case: pivot always = min or max → one partition empty, other = n-1. [1,2,3,4,5] with last element as pivot: [1,2,3,4] and [5] → T(n) = T(n-1) + O(n) = O(n²). Solutions: (1) Random pivot: O(n²) expected with probability 1/n! — astronomically unlikely. (2) Median-of-3: even more robust. (3) 3-way partitioning: handles duplicates. Production: use introsort (hybrid quick+heap+insertion) for guaranteed O(n log n).',
        },
        {
          q: 'mid = left + (right - left) / 2 kyun likhte hain (left + right) / 2 ki jagah?',
          options: [
            'Same hai dono',
            'Integer overflow prevent karne ke liye. (left + right) overflow kar sakta hai jab dono large hain (e.g., INT_MAX/2 + INT_MAX/2 > INT_MAX). left + (right-left)/2 = same result, no overflow.',
            'Readability ke liye',
            'Compiler optimization ke liye',
          ],
          correct: 1,
          explanation: 'Classic bug: left=1000000000, right=2000000000. left+right = 3000000000 > INT_MAX (2147483647) → integer overflow → negative number → wrong mid → array out of bounds! Fix: mid = left + (right-left)/2. Equivalent mathematically, no overflow. This bug was famously found in Java\'s standard library Arrays.binarySearch in 2006 (Joshua Bloch blog post)!',
          q_en: 'Why write mid = left + (right - left) / 2 instead of (left + right) / 2?',
          options_en: [
            'They are the same',
            'To prevent integer overflow. (left + right) can overflow when both are large (e.g., INT_MAX/2 + INT_MAX/2 > INT_MAX). left + (right-left)/2 gives the same result with no overflow.',
            'For readability',
            'For compiler optimisation',
          ],
          explanation_en: 'Classic bug: left=1,000,000,000, right=2,000,000,000. left+right = 3,000,000,000 > INT_MAX (2,147,483,647) → integer overflow → negative number → wrong mid → array out of bounds! Fix: mid = left + (right-left)/2. Mathematically equivalent, no overflow. This exact bug was famously found in Java\'s standard library Arrays.binarySearch in 2006 (Joshua Bloch blog post)!',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w10-s3',
      title: 'Heap Sort, Counting Sort aur Radix Sort',
      title_en: 'Heap Sort, Counting Sort and Radix Sort',
      emoji: '🚀',
      content: `## Advanced Sorts — Special Cases mein Fastest!

### Heap Sort — In-place O(n log n) Guaranteed!

\`\`\`c
// Heap = complete binary tree with heap property
// Max-Heap: parent >= children

// "Heapify" — subtree ko max-heap banao
void heapify(int arr[], int n, int i) {
    int largest = i;       // root
    int left    = 2*i + 1;
    int right   = 2*i + 2;

    if (left  < n && arr[left]  > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        int temp      = arr[i];
        arr[i]        = arr[largest];
        arr[largest]  = temp;
        heapify(arr, n, largest);  // fix affected subtree
    }
}

void heapSort(int arr[], int n) {
    // Step 1: Build max-heap — O(n)
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Step 2: Extract max one by one — O(n log n)
    for (int i = n - 1; i > 0; i--) {
        int temp  = arr[0];    // max is at root
        arr[0]    = arr[i];    // move to end
        arr[i]    = temp;
        heapify(arr, i, 0);    // fix heap (size reduced by 1)
    }
}
// Time:  O(n log n) — always (best, worst, avg same!)
// Space: O(1) — in-place!
// Stable: NO
// Advantage over QuickSort: guaranteed O(n log n), no O(n²) worst case
// Disadvantage: poor cache performance, constant factor high
\`\`\`

### Counting Sort — O(n+k) for Small Integer Ranges

\`\`\`c
// Works when: elements are integers in known range [0, k]
// Example: sort exam scores (0-100)

void countingSort(int arr[], int n, int maxVal) {
    int *count  = (int*)calloc(maxVal + 1, sizeof(int));
    int *output = (int*)malloc(n * sizeof(int));

    // Step 1: Count occurrences
    for (int i = 0; i < n; i++)
        count[arr[i]]++;

    // Step 2: Prefix sum (for stable sort)
    for (int i = 1; i <= maxVal; i++)
        count[i] += count[i-1];

    // Step 3: Build output (right to left for stability)
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    // Step 4: Copy back
    for (int i = 0; i < n; i++)
        arr[i] = output[i];

    free(count); free(output);
}

// Example: Sort [4,2,2,8,3,3,1]
// count: [0,1,2,2,1,0,0,0,1]  (count[x] = how many times x appears)
// prefix:[0,1,3,5,6,6,6,6,7]  (where each element should go)
// Output: [1,2,2,3,3,4,8] ✓

// Time:  O(n + k) where k = range of values
// Space: O(n + k)
// Stable: YES
// FASTEST when k = O(n)! (e.g., sort n students by score 0-100)
\`\`\`

### Radix Sort — Digit by Digit Sort!

\`\`\`c
// Sort numbers by each digit (LSD = Least Significant Digit first)
// Uses counting sort as subroutine on each digit

// Counting sort on digit d (0=units, 1=tens, 2=hundreds...)
void countingSortByDigit(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};

    // Count occurrences of each digit
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    // Prefix sum
    for (int i = 1; i < 10; i++)
        count[i] += count[i-1];

    // Build output (right to left for stability)
    for (int i = n-1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (int i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];

    // Sort by each digit: units, tens, hundreds...
    for (int exp = 1; max/exp > 0; exp *= 10)
        countingSortByDigit(arr, n, exp);
}

// Example: Sort [170,45,75,90,802,24,2,66]
// Pass 1 (units):  [170,90,802,2,24,45,75,66]  sort by last digit
// Pass 2 (tens):   [802,2,24,45,66,170,75,90]  sort by 2nd digit
// Pass 3 (hundreds):[2,24,45,66,75,90,170,802]  sorted!

// Time:  O(d * (n + k)) where d=digits, k=10 for decimal = O(n)!
// Space: O(n + k)
// Stable: YES (if counting sort is stable)
// AMAZING when: many numbers, fixed digit count
\`\`\`

### Sorting Algorithm Master Summary

\`\`\`
Algorithm      Time(avg)     Time(best) Time(worst)  Space  Stable  Notes
─────────────────────────────────────────────────────────────────────────────
Bubble         O(n²)         O(n)       O(n²)        O(1)   ✅   Educational
Selection      O(n²)         O(n²)      O(n²)        O(1)   ❌   Min swaps
Insertion      O(n²)         O(n)       O(n²)        O(1)   ✅   Small/nearly sorted
Shell          O(n^1.3)      O(n log n) O(n²)        O(1)   ❌   Practical improvement
─────────────────────────────────────────────────────────────────────────────
Merge Sort     O(n log n)    O(n log n) O(n log n)   O(n)   ✅   Linked lists, stable
Quick Sort     O(n log n)    O(n log n) O(n²)        O(lg)  ❌   Arrays, fastest avg
Heap Sort      O(n log n)    O(n log n) O(n log n)   O(1)   ❌   Guaranteed O(n log n)
─────────────────────────────────────────────────────────────────────────────
Counting Sort  O(n+k)        O(n+k)     O(n+k)       O(k)   ✅   Small int range
Radix Sort     O(d(n+k))     O(d(n+k))  O(d(n+k))    O(n+k) ✅   Fixed-width integers
Bucket Sort    O(n+k)        O(n)       O(n²)        O(n)   ✅   Uniform distribution
─────────────────────────────────────────────────────────────────────────────
stdlib qsort() → IntroSort (Quick+Heap+Insertion hybrid) — best of all worlds!
\`\`\``,

      content_en: `## Advanced Sorts — Special Cases in Fastest!

### Heap Sort — In-place O(n log n) Guaranteed!

\`\`\`c
// Heap = complete binary tree with heap property
// Max-Heap: parent >= children

// "Heapify" — subtree ko max-heap build
void heapify(int arr[], int n, int i) {
    int largest = i;       // root
    int left    = 2*i + 1;
    int right   = 2*i + 2;

    if (left  < n && arr[left]  > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        int temp      = arr[i];
        arr[i]        = arr[largest];
        arr[largest]  = temp;
        heapify(arr, n, largest);  // fix affected subtree
    }
}

void heapSort(int arr[], int n) {
    // Step 1: Build max-heap — O(n)
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Step 2: Extract max one by one — O(n log n)
    for (int i = n - 1; i > 0; i--) {
        int temp  = arr[0];    // max is at root
        arr[0]    = arr[i];    // move to end
        arr[i]    = temp;
        heapify(arr, i, 0);    // fix heap (size reduced by 1)
    }
}
// Time:  O(n log n) — always (best, worst, avg same!)
// Space: O(1) — in-place!
// Stable: NO
// Advantage over QuickSort: guaranteed O(n log n), no O(n²) worst case
// Disadvantage: poor cache performance, constant factor high
\`\`\`

### Counting Sort — O(n+k) for Small Integer Ranges

\`\`\`c
// Works when: elements are integers in known range [0, k]
// Example: sort exam scores (0-100)

void countingSort(int arr[], int n, int maxVal) {
    int *count  = (int*)calloc(maxVal + 1, sizeof(int));
    int *output = (int*)malloc(n * sizeof(int));

    // Step 1: Count occurrences
    for (int i = 0; i < n; i++)
        count[arr[i]]++;

    // Step 2: Prefix sum (for stable sort)
    for (int i = 1; i <= maxVal; i++)
        count[i] += count[i-1];

    // Step 3: Build output (right to left for stability)
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    // Step 4: Copy back
    for (int i = 0; i < n; i++)
        arr[i] = output[i];

    free(count); free(output);
}

// Example: Sort [4,2,2,8,3,3,1]
// count: [0,1,2,2,1,0,0,0,1]  (count[x] = how many times x appears)
// prefix:[0,1,3,5,6,6,6,6,7]  (where each element should go)
// Output: [1,2,2,3,3,4,8] ✓

// Time:  O(n + k) where k = range of values
// Space: O(n + k)
// Stable: YES
// FASTEST when k = O(n)! (e.g., sort n students by score 0-100)
\`\`\`

### Radix Sort — Digit by Digit Sort!

\`\`\`c
// Sort numbers by each digit (LSD = Least Significant Digit first)
// Uses counting sort as subroutine on each digit

// Counting sort on digit d (0=units, 1=tens, 2=hundreds...)
void countingSortByDigit(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};

    // Count occurrences of each digit
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    // Prefix sum
    for (int i = 1; i < 10; i++)
        count[i] += count[i-1];

    // Build output (right to left for stability)
    for (int i = n-1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (int i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];

    // Sort by each digit: units, tens, hundreds...
    for (int exp = 1; max/exp > 0; exp *= 10)
        countingSortByDigit(arr, n, exp);
}

// Example: Sort [170,45,75,90,802,24,2,66]
// Pass 1 (units):  [170,90,802,2,24,45,75,66]  sort by last digit
// Pass 2 (tens):   [802,2,24,45,66,170,75,90]  sort by 2nd digit
// Pass 3 (hundreds):[2,24,45,66,75,90,170,802]  sorted!

// Time:  O(d * (n + k)) where d=digits, k=10 for decimal = O(n)!
// Space: O(n + k)
// Stable: YES (if counting sort is stable)
// AMAZING when: many numbers, fixed digit count
\`\`\`

### Sorting Algorithm Master Summary

\`\`\`
Algorithm      Time(avg)     Time(best) Time(worst)  Space  Stable  Notes
─────────────────────────────────────────────────────────────────────────────
Bubble         O(n²)         O(n)       O(n²)        O(1)   ✅   Educational
Selection      O(n²)         O(n²)      O(n²)        O(1)   ❌   Min swaps
Insertion      O(n²)         O(n)       O(n²)        O(1)   ✅   Small/nearly sorted
Shell          O(n^1.3)      O(n log n) O(n²)        O(1)   ❌   Practical improvement
─────────────────────────────────────────────────────────────────────────────
Merge Sort     O(n log n)    O(n log n) O(n log n)   O(n)   ✅   Linked lists, stable
Quick Sort     O(n log n)    O(n log n) O(n²)        O(lg)  ❌   Arrays, fastest avg
Heap Sort      O(n log n)    O(n log n) O(n log n)   O(1)   ❌   Guaranteed O(n log n)
─────────────────────────────────────────────────────────────────────────────
Counting Sort  O(n+k)        O(n+k)     O(n+k)       O(k)   ✅   Small int range
Radix Sort     O(d(n+k))     O(d(n+k))  O(d(n+k))    O(n+k) ✅   Fixed-width integers
Bucket Sort    O(n+k)        O(n)       O(n²)        O(n)   ✅   Uniform distribution
─────────────────────────────────────────────────────────────────────────────
stdlib qsort() → IntroSort (Quick+Heap+Insertion hybrid) — best of all worlds!
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// ── Heap Sort ──
void heapify(int a[],int n,int i){
    int lg=i,l=2*i+1,r=2*i+2;
    if(l<n&&a[l]>a[lg])lg=l;
    if(r<n&&a[r]>a[lg])lg=r;
    if(lg!=i){int t=a[i];a[i]=a[lg];a[lg]=t;heapify(a,n,lg);}
}
void heapSort(int a[],int n){
    for(int i=n/2-1;i>=0;i--)heapify(a,n,i);
    for(int i=n-1;i>0;i--){int t=a[0];a[0]=a[i];a[i]=t;heapify(a,i,0);}
}

// ── Counting Sort ──
void countSort(int a[],int n,int k){
    int *c=calloc(k+1,4),*out=malloc(n*4);
    for(int i=0;i<n;i++)c[a[i]]++;
    for(int i=1;i<=k;i++)c[i]+=c[i-1];
    for(int i=n-1;i>=0;i--)out[--c[a[i]]]=a[i];
    memcpy(a,out,n*4);free(c);free(out);
}

// ── Radix Sort ──
void csortDigit(int a[],int n,int exp){
    int *out=malloc(n*4),c[10]={0};
    for(int i=0;i<n;i++)c[(a[i]/exp)%10]++;
    for(int i=1;i<10;i++)c[i]+=c[i-1];
    for(int i=n-1;i>=0;i--)out[--c[(a[i]/exp)%10]]=a[i];
    memcpy(a,out,n*4);free(out);
}
void radixSort(int a[],int n){
    int mx=a[0];for(int i=1;i<n;i++)if(a[i]>mx)mx=a[i];
    for(int e=1;mx/e>0;e*=10)csortDigit(a,n,e);
}

// ── Merge Sort (for comparison) ──
void merge(int a[],int l,int m,int r){
    int n1=m-l+1,n2=r-m;
    int*L=malloc(n1*4),*R=malloc(n2*4);
    for(int i=0;i<n1;i++)L[i]=a[l+i];
    for(int i=0;i<n2;i++)R[i]=a[m+1+i];
    int i=0,j=0,k=l;
    while(i<n1&&j<n2)a[k++]=L[i]<=R[j]?L[i++]:R[j++];
    while(i<n1)a[k++]=L[i++];while(j<n2)a[k++]=R[j++];
    free(L);free(R);
}
void ms(int a[],int l,int r){if(l>=r)return;int m=l+(r-l)/2;ms(a,l,m);ms(a,m+1,r);merge(a,l,m,r);}

void pr(int a[],int n,const char*lb){
    printf("%-14s: ",lb);
    for(int i=0;i<n;i++)printf("%4d",a[i]);
    printf("\\n");
}

double bm(void(*fn)(int*,int),int*orig,int n){
    int*a=malloc(n*4);memcpy(a,orig,n*4);
    clock_t s=clock();fn(a,n);
    double t=(double)(clock()-s)/CLOCKS_PER_SEC*1000;
    free(a);return t;
}
void ms_wrap(int*a,int n){ms(a,0,n-1);}
void hs_wrap(int*a,int n){heapSort(a,n);}
void rs_wrap(int*a,int n){radixSort(a,n);}
void cs_wrap(int*a,int n){countSort(a,n,1000);}

int main(){
    int orig[]={170,45,75,90,802,24,2,66,35,61};
    int n=sizeof(orig)/sizeof(orig[0]);
    int a[10];

    printf("=== Advanced Sorts (n=%d) ===\\n\\n",n);
    pr(orig,n,"Original");

    memcpy(a,orig,sizeof(orig)); heapSort(a,n);  pr(a,n,"Heap Sort");
    memcpy(a,orig,sizeof(orig)); radixSort(a,n); pr(a,n,"Radix Sort");
    memcpy(a,orig,sizeof(orig)); countSort(a,n,802); pr(a,n,"Counting Sort");

    // Student scores — counting sort ideal!
    printf("\\n=== Student Scores (Counting Sort ideal) ===\\n");
    int scores[]={87,45,92,61,78,55,92,38,71,88,92,45};
    int ns=sizeof(scores)/sizeof(scores[0]);
    int sc[12]; memcpy(sc,scores,sizeof(scores));
    pr(sc,ns,"Before");
    countSort(sc,ns,100);
    pr(sc,ns,"After ");

    // Grade distribution after sort
    int gradeA=0,gradeB=0,gradeC=0,gradeF=0;
    for(int i=0;i<ns;i++){
        if(sc[i]>=90)gradeA++;
        else if(sc[i]>=75)gradeB++;
        else if(sc[i]>=60)gradeC++;
        else gradeF++;
    }
    printf("Grades: A=%d B=%d C=%d F=%d\\n",gradeA,gradeB,gradeC,gradeF);

    // Large benchmark
    printf("\\n=== Performance Benchmark (random data) ===\\n");
    int sizes[]={100000,500000,1000000};
    for(int s=0;s<3;s++){
        int sz=sizes[s];
        int*data=malloc(sz*4);
        for(int i=0;i<sz;i++) data[i]=rand()%1000;
        printf("n=%-8d  MergeSort:%6.1fms  HeapSort:%6.1fms  RadixSort:%6.1fms  CountSort:%6.1fms\\n",
               sz,bm(ms_wrap,data,sz),bm(hs_wrap,data,sz),bm(rs_wrap,data,sz),bm(cs_wrap,data,sz));
        free(data);
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void heapify(int a[],int n,int i){int lg=i,l=2*i+1,r=2*i+2;if(l<n&&a[l]>a[lg])lg=l;if(r<n&&a[r]>a[lg])lg=r;if(lg!=i){int t=a[i];a[i]=a[lg];a[lg]=t;heapify(a,n,lg);}}
void heapSort(int a[],int n){for(int i=n/2-1;i>=0;i--)heapify(a,n,i);for(int i=n-1;i>0;i--){int t=a[0];a[0]=a[i];a[i]=t;heapify(a,i,0);}}
void radixSort(int a[],int n){
    int mx=a[0];for(int i=1;i<n;i++)if(a[i]>mx)mx=a[i];
    for(int e=1;mx/e>0;e*=10){
        int*o=malloc(n*4),c[10]={0};
        for(int i=0;i<n;i++)c[(a[i]/e)%10]++;
        for(int i=1;i<10;i++)c[i]+=c[i-1];
        for(int i=n-1;i>=0;i--)o[--c[(a[i]/e)%10]]=a[i];
        memcpy(a,o,n*4);free(o);
    }
}
void pr(int a[],int n){for(int i=0;i<n;i++)printf("%d ",a[i]);printf("\\n");}

int main(){
    int a[]={170,45,75,90,802,24,2,66},n=8,b[8];
    memcpy(b,a,sizeof(a)); heapSort(b,n);  printf("Heap:  "); pr(b,n);
    memcpy(b,a,sizeof(a)); radixSort(b,n); printf("Radix: "); pr(b,n);
    return 0;
}`,

      task: {
        description: 'Advanced sorts practice: (1) "IntroSort" implement karo — Quick Sort jo automatically Heap Sort pe switch kare jab depth > 2*log(n) (worst case prevention). (2) "TimSort simplified" — small arrays pe Insertion Sort, large pe Merge Sort, real Python/Java approach. (3) "Sort strings by length" — strings ko length ke hisaab se counting sort se sort karo. (4) "Bucket Sort" — floating point numbers [0,1) ko sort karo bucket sort se.',
        description_en: 'Advanced sorts practice: (1) Implement "IntroSort" — Quick Sort that automatically switches to Heap Sort when depth > 2*log(n) (worst-case prevention). (2) "TimSort simplified" — Insertion Sort for small arrays, Merge Sort for large, the real Python/Java approach. (3) "Sort strings by length" — sort strings by their length using counting sort. (4) "Bucket Sort" — sort floating-point numbers in [0,1) using bucket sort.',
        hint: 'IntroSort: void introsort(a, lo, hi, depth_limit) { if(size<16) insertion; if(depth==0) heapsort; else quicksort then recurse with depth-1 }. Bucket sort: n buckets, each [i/n, (i+1)/n), insert, sort each bucket, concatenate.',
        hint_en: 'IntroSort: void introsort(a, lo, hi, depth_limit) { if(size<16) insertion; if(depth==0) heapsort; else quicksort then recurse with depth-1 }. Bucket sort: n buckets, each covering [i/n, (i+1)/n), insert, sort each bucket with insertion sort, concatenate.',
      },
      quiz: [
        {
          q: 'Counting Sort kab use karna appropriate hai aur kab nahi?',
          options: [
            'Hamesha best hai',
            'Appropriate: integers, small known range k=O(n) — e.g., marks (0-100), ages. NOT appropriate: floating point, strings, very large range (k >> n → O(k) space dominant), negative numbers (need offset).',
            'Sirf sorted input ke liye',
            'Large arrays ke liye nahi',
          ],
          correct: 1,
          explanation: 'Counting sort O(n+k): k = range. If k=100 (scores), n=1000000 students → O(n+100)=O(n) ✓. If k=1000000000 (arbitrary int), n=100 → O(1B) space! Not practical. For negative: offset = min_value. For floats: multiply and truncate (loses precision). Best cases: ages, grades, small codes, character frequencies.',
          q_en: 'When is Counting Sort appropriate and when is it not?',
          options_en: [
            'Always the best',
            'Appropriate: integers, small known range k=O(n) — e.g., marks (0-100), ages. NOT appropriate: floating point, strings, very large range (k >> n → O(k) space dominates), negative numbers (need offset).',
            'Only for sorted input',
            'Not for large arrays',
          ],
          explanation_en: 'Counting sort O(n+k): k = range. If k=100 (scores), n=1,000,000 students → O(n+100)=O(n) ✓. If k=1,000,000,000 (arbitrary int), n=100 → O(1B) space! Not practical. For negatives: add offset = min_value. For floats: multiply and truncate (loses precision). Best cases: ages, grades, small codes, character frequencies.',
        },
        {
          q: 'Heap Sort Quick Sort se kyun prefer nahi karte despite O(1) space aur guaranteed O(n log n)?',
          options: [
            'Heap Sort wrong hai',
            'Cache performance: Heap Sort access pattern non-sequential (parent/child jumps). Quick Sort sequential access. Modern CPU mein: cache miss = 100x slower than cache hit. Heap Sort 2-5x slower in practice despite same Big-O.',
            'Heap Sort O(n²) hai',
            'Implementation complex hai',
          ],
          correct: 1,
          explanation: 'Big-O ignores constant factors and memory hierarchy. Heap Sort: parent i → children 2i+1, 2i+2. Large heaps: jumping around → cache misses constantly. Quick Sort: partition moves elements sequentially → cache-friendly. Modern CPU cache: L1 ~4ns, L2 ~12ns, RAM ~100ns. Random access = RAM speed. Sequential = L1 cache speed. 25x difference! When to use Heap: when guaranteed O(n log n) + O(1) space critical (embedded systems).',
          q_en: 'Why is Heap Sort not preferred over Quick Sort despite O(1) space and guaranteed O(n log n)?',
          options_en: [
            'Heap Sort is wrong',
            'Cache performance: Heap Sort access pattern is non-sequential (parent/child jumps). Quick Sort uses sequential access. On modern CPUs: a cache miss is 100× slower than a cache hit. Heap Sort is 2–5× slower in practice despite the same Big-O.',
            'Heap Sort is O(n²)',
            'The implementation is complex',
          ],
          explanation_en: 'Big-O ignores constant factors and the memory hierarchy. Heap Sort: parent i → children 2i+1, 2i+2. For large heaps: jumping around → constant cache misses. Quick Sort: partitioning moves elements sequentially → cache-friendly. Modern CPU cache: L1 ~4ns, L2 ~12ns, RAM ~100ns. Random access = RAM speed. Sequential access = L1 cache speed. 25× difference! When to use Heap Sort: when guaranteed O(n log n) + O(1) space is critical (embedded systems).',
        },
        {
          q: 'Radix Sort comparison-based sorting ki comparison-lower-bound O(n log n) se kaise bachta hai?',
          options: [
            'Radix Sort comparisons karta hai',
            'Radix Sort non-comparison based hai — elements directly compare nahi karta, digits/bits ke basis pe buckets mein rakhta hai. Comparison lower bound O(n log n) sirf comparison sorts pe apply hota hai.',
            'O(n log n) lower bound wrong hai',
            'Radix Sort slow hai actually',
          ],
          correct: 1,
          explanation: 'Information theory proof: comparison sort ko distinguish n! permutations karna hota hai. Decision tree height >= log2(n!) = O(n log n). Lower bound applies ONLY to comparison-based sorts. Counting Sort, Radix Sort, Bucket Sort = non-comparison sorts — they exploit structure of keys (integer values, digits). Trade-off: they need additional assumptions about input (bounded integers, fixed digit width).',
          q_en: 'How does Radix Sort escape the O(n log n) comparison-based lower bound?',
          options_en: [
            'Radix Sort makes comparisons',
            'Radix Sort is non-comparison-based — it does not directly compare elements; it places them in buckets based on digits/bits. The O(n log n) lower bound only applies to comparison sorts.',
            'The O(n log n) lower bound is wrong',
            'Radix Sort is actually slow',
          ],
          explanation_en: 'Information-theory proof: a comparison sort must distinguish n! permutations. Decision tree height >= log2(n!) = O(n log n). The lower bound applies ONLY to comparison-based sorts. Counting Sort, Radix Sort, Bucket Sort = non-comparison sorts — they exploit the structure of the keys (integer values, digit positions). Trade-off: they require additional assumptions about the input (bounded integers, fixed digit width).',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w10-s4',
      title: 'Week 10 Project — Complete Sorting Benchmark Suite',
      title_en: 'Week 10 Project — Complete Sorting Benchmark Suite',
      emoji: '📊',
      content: `## Week 10 Project — Sorting Master Banao!

### Project: Comprehensive Sort Analyzer

\`\`\`c
// Test harness for ALL sorting algorithms:
// - Correctness verification
// - Performance measurement
// - Multiple input patterns
// - Comparison count tracking
// - Memory usage estimation

typedef struct {
    char   name[30];
    void   (*sortFn)(int*, int);
    long   comparisons;
    long   swaps;
    double timeMs;
    int    stable;
    int    inPlace;
} SortStats;

// Input patterns to test:
typedef enum {
    RANDOM,          // uniform random
    SORTED,          // already sorted (best case for some)
    REVERSE_SORTED,  // worst case for naive Quick Sort
    NEARLY_SORTED,   // 5% elements out of place
    FEW_UNIQUE,      // many duplicates (3-way QS shines)
    PIPE_ORGAN,      // 1,2,3,...,n/2,n/2,...,3,2,1 (adversarial)
} InputPattern;
\`\`\`

### Sorting Decision Tree

\`\`\`
Sort karni hai?
  │
  ├─ n < 50?
  │    └── Insertion Sort ✅
  │
  ├─ Stability required?
  │    ├── Yes → Merge Sort (linked list) / TimSort (array)
  │    └── No  → Quick Sort (random pivot)
  │
  ├─ Guaranteed O(n log n) needed?
  │    └── Heap Sort / Merge Sort
  │
  ├─ Integers, small range?
  │    └── Counting Sort (fastest!)
  │
  ├─ Integers, fixed digits?
  │    └── Radix Sort
  │
  └─ General purpose?
       └── stdlib qsort() / IntroSort
\`\`\`

### stdlib qsort() — C Standard Library

\`\`\`c
#include <stdlib.h>

// Comparator: negative if a<b, 0 if equal, positive if a>b
int cmpInt(const void *a, const void *b) {
    return *(int*)a - *(int*)b;   // ascending
}
int cmpIntDesc(const void *a, const void *b) {
    return *(int*)b - *(int*)a;   // descending
}
int cmpStr(const void *a, const void *b) {
    return strcmp(*(char**)a, *(char**)b);
}
int cmpStruct(const void *a, const void *b) {
    Student *sa = (Student*)a, *sb = (Student*)b;
    return sb->marks - sa->marks;  // sort by marks descending
}

// Usage
qsort(arr, n, sizeof(int), cmpInt);
qsort(strings, n, sizeof(char*), cmpStr);
qsort(students, n, sizeof(Student), cmpStruct);

// bsearch — binary search on sorted array!
int key = 42;
int *found = (int*)bsearch(&key, arr, n, sizeof(int), cmpInt);
if (found) printf("Found: %d at index %ld\\n", *found, found - arr);
\`\`\`

### Month 3 Progress

\`\`\`
Month 3 (Weeks 9-12):
  ✅ Week 9:  Binary Trees, BST, AVL Tree
  ✅ Week 10: Sorting Algorithms Master Class
  📚 Week 11: Graphs — DFS, BFS, Dijkstra, TopSort (next!)
  📚 Week 12: Final Project + Certificate 🎓

Learned in Weeks 9-10:
  - Tree traversals (4 types)
  - BST operations O(log n)
  - AVL self-balancing O(log n) guaranteed
  - 8 sorting algorithms from O(n²) to O(n)
  - Stability, in-place, cache performance
  - Decision making: when to use which
\`\`\``,

      content_en: `## Week 10 Project — Sorting Master Build!

### Project: Comprehensive Sort Analyzer

\`\`\`c
// Test harness for ALL sorting algorithms:
// - Correctness verification
// - Performance measurement
// - Multiple input patterns
// - Comparison count tracking
// - Memory usage estimation

typedef struct {
    char   name[30];
    void   (*sortFn)(int*, int);
    long   comparisons;
    long   swaps;
    double timeMs;
    int    stable;
    int    inPlace;
} SortStats;

// Input patterns to test:
typedef enum {
    RANDOM,          // uniform random
    SORTED,          // already sorted (best case for some)
    REVERSE_SORTED,  // worst case for naive Quick Sort
    NEARLY_SORTED,   // 5% elements out of place
    FEW_UNIQUE,      // many duplicates (3-way QS shines)
    PIPE_ORGAN,      // 1,2,3,...,n/2,n/2,...,3,2,1 (adversarial)
} InputPattern;
\`\`\`

### Sorting Decision Tree

\`\`\`
Sort karni hai?
  │
  ├─ n < 50?
  │    └── Insertion Sort ✅
  │
  ├─ Stability required?
  │    ├── Yes → Merge Sort (linked list) / TimSort (array)
  │    └── No  → Quick Sort (random pivot)
  │
  ├─ Guaranteed O(n log n) needed?
  │    └── Heap Sort / Merge Sort
  │
  ├─ Integers, small range?
  │    └── Counting Sort (fastest!)
  │
  ├─ Integers, fixed digits?
  │    └── Radix Sort
  │
  └─ General purpose?
       └── stdlib qsort() / IntroSort
\`\`\`

### stdlib qsort() — C Standard Library

\`\`\`c
#include <stdlib.h>

// Comparator: negative if a<b, 0 if equal, positive if a>b
int cmpInt(const void *a, const void *b) {
    return *(int*)a - *(int*)b;   // ascending
}
int cmpIntDesc(const void *a, const void *b) {
    return *(int*)b - *(int*)a;   // descending
}
int cmpStr(const void *a, const void *b) {
    return strcmp(*(char**)a, *(char**)b);
}
int cmpStruct(const void *a, const void *b) {
    Student *sa = (Student*)a, *sb = (Student*)b;
    return sb->marks - sa->marks;  // sort by marks descending
}

// Usage
qsort(arr, n, sizeof(int), cmpInt);
qsort(strings, n, sizeof(char*), cmpStr);
qsort(students, n, sizeof(Student), cmpStruct);

// bsearch — binary search on sorted array!
int key = 42;
int *found = (int*)bsearch(&key, arr, n, sizeof(int), cmpInt);
if (found) printf("Found: %d at index %ld\\n", *found, found - arr);
\`\`\`

### Month 3 Progress

\`\`\`
Month 3 (Weeks 9-12):
  ✅ Week 9:  Binary Trees, BST, AVL Tree
  ✅ Week 10: Sorting Algorithms Master Class
  📚 Week 11: Graphs — DFS, BFS, Dijkstra, TopSort (next!)
  📚 Week 12: Final Project + Certificate 🎓

Learned in Weeks 9-10:
  - Tree traversals (4 types)
  - BST operations O(log n)
  - AVL self-balancing O(log n) guaranteed
  - 8 sorting algorithms from O(n²) to O(n)
  - Stability, in-place, cache performance
  - Decision making: when to use which
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// ── All sorts ──
void insertion(int a[],int n){for(int i=1;i<n;i++){int k=a[i],j=i-1;while(j>=0&&a[j]>k){a[j+1]=a[j];j--;}a[j+1]=k;}}
void heapify(int a[],int n,int i){int l=2*i+1,r=2*i+2,m=i;if(l<n&&a[l]>a[m])m=l;if(r<n&&a[r]>a[m])m=r;if(m!=i){int t=a[i];a[i]=a[m];a[m]=t;heapify(a,n,m);}}
void heapSort(int a[],int n){for(int i=n/2-1;i>=0;i--)heapify(a,n,i);for(int i=n-1;i>0;i--){int t=a[0];a[0]=a[i];a[i]=t;heapify(a,i,0);}}
void merge(int a[],int l,int m,int r){int n1=m-l+1,n2=r-m;int*L=malloc(n1*4),*R=malloc(n2*4);for(int i=0;i<n1;i++)L[i]=a[l+i];for(int i=0;i<n2;i++)R[i]=a[m+1+i];int i=0,j=0,k=l;while(i<n1&&j<n2)a[k++]=L[i]<=R[j]?L[i++]:R[j++];while(i<n1)a[k++]=L[i++];while(j<n2)a[k++]=R[j++];free(L);free(R);}
void ms(int a[],int l,int r){if(l>=r)return;int m=l+(r-l)/2;ms(a,l,m);ms(a,m+1,r);merge(a,l,m,r);}
void sw(int*a,int*b){int t=*a;*a=*b;*b=t;}
int part(int a[],int lo,int hi){int ri=lo+rand()%(hi-lo+1);sw(&a[ri],&a[hi]);int p=a[hi],i=lo-1;for(int j=lo;j<hi;j++)if(a[j]<=p)sw(&a[++i],&a[j]);sw(&a[i+1],&a[hi]);return i+1;}
void qs(int a[],int lo,int hi){if(lo>=hi)return;int p=part(a,lo,hi);qs(a,lo,p-1);qs(a,p+1,hi);}
void countSort(int a[],int n,int k){int*c=calloc(k+1,4),*o=malloc(n*4);for(int i=0;i<n;i++)c[a[i]]++;for(int i=1;i<=k;i++)c[i]+=c[i-1];for(int i=n-1;i>=0;i--)o[--c[a[i]]]=a[i];memcpy(a,o,n*4);free(c);free(o);}
void radix(int a[],int n){int mx=a[0];for(int i=1;i<n;i++)if(a[i]>mx)mx=a[i];for(int e=1;mx/e>0;e*=10){int*o=malloc(n*4),c[10]={0};for(int i=0;i<n;i++)c[(a[i]/e)%10]++;for(int i=1;i<10;i++)c[i]+=c[i-1];for(int i=n-1;i>=0;i--)o[--c[(a[i]/e)%10]]=a[i];memcpy(a,o,n*4);free(o);}}

// ── Wrappers ──
void ms_w(int*a,int n){ms(a,0,n-1);}
void qs_w(int*a,int n){qs(a,0,n-1);}

// ── Verify sorted ──
int isSorted(int*a,int n){for(int i=1;i<n;i++)if(a[i]<a[i-1])return 0;return 1;}

// ── Generate patterns ──
void genRandom (int*a,int n){for(int i=0;i<n;i++)a[i]=rand()%1000;}
void genSorted  (int*a,int n){for(int i=0;i<n;i++)a[i]=i;}
void genReverse (int*a,int n){for(int i=0;i<n;i++)a[i]=n-i;}
void genNearlySorted(int*a,int n){
    for(int i=0;i<n;i++)a[i]=i;
    for(int i=0;i<n/20;i++){int x=rand()%n,y=rand()%n;int t=a[x];a[x]=a[y];a[y]=t;}
}
void genDups(int*a,int n){for(int i=0;i<n;i++)a[i]=rand()%5;}

// ── Benchmark ──
typedef struct{const char*name;void(*fn)(int*,int);}Sort;

double runBench(Sort s,int*orig,int n,int verify){
    int*a=malloc(n*4);memcpy(a,orig,n*4);
    clock_t st=clock();
    s.fn(a,n);
    double t=(double)(clock()-st)/CLOCKS_PER_SEC*1000;
    if(verify&&!isSorted(a,n))printf("WRONG! ");
    free(a); return t;
}

int main(){
    srand(42);
    Sort sorts[]={
        {"Insertion",insertion},{"Merge",ms_w},
        {"Quick(rand)",qs_w},{"Heap",heapSort},
        {"Counting",countSort},{"Radix",radix}
    };
    int ns=6;

    // Small n: all patterns
    printf("=== Small Arrays (n=20): Correctness ===\\n");
    int small[20]; genRandom(small,20);
    for(int i=0;i<ns;i++){
        int a[20]; memcpy(a,small,sizeof(small));
        if(strcmp(sorts[i].name,"Counting")==0)countSort(a,20,999);
        else sorts[i].fn(a,20);
        printf("%-15s: %s\\n",sorts[i].name,isSorted(a,20)?"✅ OK":"❌ FAIL");
    }

    // Large benchmark
    typedef struct{const char*name;void(*gen)(int*,int);}Pat;
    Pat pats[]={{"Random",genRandom},{"Sorted",genSorted},
                {"Reverse",genReverse},{"Nearly",genNearlySorted},{"Dups(5)",genDups}};
    int np=5,N=50000;

    printf("\\n=== Benchmark n=%d (time in ms) ===\\n",N);
    printf("%-15s","Pattern");
    for(int i=0;i<ns;i++) printf("%-14s",sorts[i].name);
    printf("\\n%s\\n","─────────────────────────────────────────────────────────────────────────────");

    int*orig=malloc(N*4);
    for(int p=0;p<np;p++){
        pats[p].gen(orig,N);
        printf("%-15s",pats[p].name);
        for(int i=0;i<ns;i++){
            double t;
            if(strcmp(sorts[i].name,"Counting")==0){
                int*a=malloc(N*4);memcpy(a,orig,N*4);
                clock_t s=clock();countSort(a,N,N);
                t=(double)(clock()-s)/CLOCKS_PER_SEC*1000;free(a);
            } else {
                t=runBench(sorts[i],orig,N,0);
            }
            printf("%-14.1f",t);
        }
        printf("\\n");
    }
    free(orig);

    // stdlib qsort + bsearch demo
    printf("\\n=== stdlib qsort + bsearch ===\\n");
    int arr[]={64,34,25,12,22,11,90,45};int na=8;
    int cmpI(const void*a,const void*b){return *(int*)a-*(int*)b;}
    qsort(arr,na,sizeof(int),cmpI);
    printf("Sorted: ");for(int i=0;i<na;i++)printf("%d ",arr[i]);printf("\\n");
    int key=22,*fp=(int*)bsearch(&key,arr,na,sizeof(int),cmpI);
    printf("bsearch(%d): %s\\n",key,fp?"Found":"Not found");

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

void hs(int a[],int n){/* heapSort */}
void ms(int a[],int l,int r){/* mergeSort */}
void qs(int a[],int lo,int hi){/* quickSort */}

int cmpAsc(const void*a,const void*b){return *(int*)a-*(int*)b;}
int cmpDesc(const void*a,const void*b){return *(int*)b-*(int*)a;}

typedef struct{char name[20];float gpa;}Student;
int cmpGPA(const void*a,const void*b){
    return ((Student*)b)->gpa > ((Student*)a)->gpa ? 1:-1;
}

int main(){
    int arr[]={64,34,25,12,22,11,90,45};int n=8;
    qsort(arr,n,sizeof(int),cmpAsc);
    printf("Sorted:  "); for(int i=0;i<n;i++) printf("%d ",arr[i]); printf("\\n");

    int key=25,*p=(int*)bsearch(&key,arr,n,sizeof(int),cmpAsc);
    printf("bsearch(%d): %s\\n",key,p?"Found":"Not found");

    Student students[]={{"Rahul",8.5f},{"Priya",9.2f},{"Aryan",7.8f},{"Sneha",9.0f}};
    int ns=4;
    qsort(students,ns,sizeof(Student),cmpGPA);
    printf("By GPA: ");
    for(int i=0;i<ns;i++) printf("%s(%.1f) ",students[i].name,students[i].gpa);
    printf("\\n");
    return 0;
}`,

      task: {
        description: 'Week 10 Final Project — Complete Sort Analyzer: (1) "Adaptive Sort" implement karo — input pattern detect karo (sorted, nearly sorted, random, many duplicates) aur automatically best algorithm choose karo. (2) "Sort Visualizer" — har step pe array state print karo (ASCII bar chart). (3) "Real-world data sort" — student records ko multiple keys se sort karo (primary: department, secondary: marks descending, tertiary: name alphabetical). (4) "Binary Search variants" — lower bound, upper bound, count occurrences implement karo.',
        description_en: 'Week 10 Final Project — Complete Sort Analyzer: (1) Implement "Adaptive Sort" — detect the input pattern (sorted, nearly sorted, random, many duplicates) and automatically choose the best algorithm. (2) "Sort Visualizer" — print the array state at each step (ASCII bar chart). (3) "Real-world data sort" — sort student records by multiple keys (primary: department, secondary: marks descending, tertiary: name alphabetical). (4) "Binary Search variants" — implement lower bound, upper bound, count occurrences.',
        hint: 'Adaptive: check if sorted (O(n) scan), check inversions count, check unique count. Multi-key qsort: compare dept first, if equal compare marks, if equal compare name. Lower bound: first position where arr[pos]>=key. Upper bound: first position where arr[pos]>key. Count = upper-lower.',
        hint_en: 'Adaptive: O(n) scan to check if sorted, count inversions, count unique values. Multi-key qsort: compare dept first; if equal, compare marks; if equal, compare name. Lower bound: first position where arr[pos]>=key. Upper bound: first position where arr[pos]>key. Count = upper - lower.',
      },
      quiz: [
        {
          q: 'IntroSort kya hai aur standard library sorts mein kyun use hota hai?',
          options: [
            'Naya simple sort hai',
            'Hybrid: Quick Sort (average fast) + Heap Sort (worst case fallback) + Insertion Sort (small arrays). Depth > 2*log(n) pe Quick Sort → Heap Sort switch. n < 16 pe Insertion Sort. Best of all worlds!',
            'Quick Sort ka variant hai sirf',
            'Merge Sort + Counting Sort combination hai',
          ],
          correct: 1,
          explanation: 'IntroSort (David Musser, 1997): Quick Sort ka cache friendliness + guaranteed O(n log n) without memory overhead. Algorithm: (1) if n <= 16: insertion sort. (2) if depth_limit reached: heap sort. (3) else: randomized quick sort. Used in: C++ std::sort, Python sorted() (via TimSort which is different but similarly hybrid), Java Arrays.sort for primitives (dual-pivot quicksort), .NET Array.Sort.',
          q_en: 'What is IntroSort and why is it used in standard library sorts?',
          options_en: [
            'A new simple sort',
            'Hybrid: Quick Sort (fast average) + Heap Sort (worst-case fallback) + Insertion Sort (small arrays). When depth > 2*log(n), Quick Sort switches to Heap Sort. Insertion Sort for n < 16. Best of all worlds!',
            'Just a variant of Quick Sort',
            'A Merge Sort + Counting Sort combination',
          ],
          explanation_en: 'IntroSort (David Musser, 1997): Quick Sort\'s cache friendliness + guaranteed O(n log n) without memory overhead. Algorithm: (1) if n <= 16: insertion sort. (2) if depth_limit reached: heap sort. (3) else: randomised quick sort. Used in: C++ std::sort, Python sorted() (via TimSort, which is different but similarly hybrid), Java Arrays.sort for primitives (dual-pivot quicksort), .NET Array.Sort.',
        },
        {
          q: 'Binary search (bsearch) sirf sorted arrays pe kyun kaam karta hai?',
          options: [
            'Limitation hai',
            'Binary search mid point check karta hai: agar target > mid → right half, warna left half. Unsorted mein: target left ya right mein ho sakta hai — half eliminate karna wrong hoga.',
            'Speed ke liye',
            'Memory ke liye',
          ],
          correct: 1,
          explanation: 'Binary search assumes: "agar arr[mid] < target toh target right side mein hai". Sorted array mein: true. Unsorted mein: arr[mid]=5, target=3, right side mein 3 ho sakta hai → missed! O(log n) vs linear O(n) because of this sorted assumption. Always: sort first (O(n log n)), then binary search (O(log n) per query). For multiple queries: sorting pays off.',
          q_en: 'Why does binary search (bsearch) only work on sorted arrays?',
          options_en: [
            'It is a limitation',
            'Binary search checks the midpoint: if target > mid → right half, else left half. On unsorted data: the target could be in either half — eliminating one half would be wrong.',
            'For speed',
            'For memory',
          ],
          explanation_en: 'Binary search assumes: "if arr[mid] < target, target is in the right half." On a sorted array: true. On unsorted data: arr[mid]=5, target=3, but 3 could be in the right half → missed! O(log n) vs linear O(n) because of this sorted assumption. Always: sort first (O(n log n)), then binary search (O(log n) per query). For multiple queries: the sorting cost pays off.',
        },
        {
          q: 'Sorting algorithm choose karne ka main criteria kya hona chahiye?',
          options: [
            'Hamesha fastest algorithm',
            'Input size (n), data type (int/float/struct), stability required?, memory available?, input pattern (sorted/random/duplicates?), number of sorts (one-time vs repeated). Context matters!',
            'Hamesha Merge Sort',
            'Hamesha stdlib qsort()',
          ],
          correct: 1,
          explanation: 'Decision factors: (1) n < 50 → Insertion Sort wins. (2) Integer, small range → Counting Sort O(n). (3) Stability needed → Merge/TimSort. (4) Memory constraint → Heap Sort O(1). (5) Nearly sorted → Insertion Sort O(n). (6) Many duplicates → 3-way Quick Sort. (7) General purpose → qsort(). Real engineering: profile first, optimize later. premature optimization is the root of all evil (Knuth).',
          q_en: 'What should be the main criteria for choosing a sorting algorithm?',
          options_en: [
            'Always the fastest algorithm',
            'Input size (n), data type (int/float/struct), stability required?, memory available?, input pattern (sorted/random/duplicates?), number of sorts (one-time vs repeated). Context matters!',
            'Always Merge Sort',
            'Always stdlib qsort()',
          ],
          explanation_en: 'Decision factors: (1) n < 50 → Insertion Sort wins. (2) Integer, small range → Counting Sort O(n). (3) Stability needed → Merge/TimSort. (4) Memory constraint → Heap Sort O(1). (5) Nearly sorted → Insertion Sort O(n). (6) Many duplicates → 3-way Quick Sort. (7) General purpose → qsort(). Real engineering: profile first, optimise later. "Premature optimisation is the root of all evil" (Knuth).',
        },
      ],
    },
  ],
};