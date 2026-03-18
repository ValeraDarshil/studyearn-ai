/**
 * StudyEarn AI — C Programming Course
 * Week 11: Graphs — DFS, BFS, Dijkstra, Topological Sort
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_11 = {
  week: 11,
  title: 'Graphs — Networks ka C mein Implementation',
  title_en: 'Graphs — Implementing Networks in C',
  description: 'Graph representation, DFS, BFS, Dijkstra shortest path, topological sort — real-world network problems C mein solve karo!',
  description_en: 'Graph representation, DFS, BFS, Dijkstra shortest path, topological sort — solve real-world network problems in C!',
  xpReward: 290,
  sections: [
    {
      id: 'c-w11-s1',
      title: 'Graph Basics — Representation aur Traversal',
      title_en: 'Graph Basics — Representation and Traversal',
      emoji: '🕸️',
      content: `## Graph — Nodes aur Edges ka Network!

Tree = special graph (no cycles, connected). Graph = general — cycles ho sakti hain, disconnected bhi ho sakta hai.

### Real-World Graph Examples
\`\`\`
Social Network     ← users = nodes, friendships = edges
Google Maps        ← cities = nodes, roads = edges (weighted)
Internet           ← computers = nodes, cables = edges
Flight Routes      ← airports = nodes, flights = edges
Dependency Graph   ← tasks = nodes, dependencies = edges
Circuit Board      ← components = nodes, wires = edges
\`\`\`

### Graph Types
\`\`\`
Directed (Digraph):   edges have direction (A → B ≠ B → A)
Undirected:           edges bidirectional (A — B = B — A)
Weighted:             edges have cost/distance
Unweighted:           all edges equal
Cyclic:               has cycles
Acyclic (DAG):        Directed Acyclic Graph — no cycles
Connected:            path exists between every pair
Disconnected:         some nodes unreachable from others
\`\`\`

### Representation 1: Adjacency Matrix

\`\`\`c
#define V 6  // number of vertices

// matrix[i][j] = 1 if edge from i to j
int matrix[V][V] = {0};

void addEdge(int matrix[][V], int u, int v) {
    matrix[u][v] = 1;
    matrix[v][u] = 1;  // undirected — both directions
}

// Weighted graph
int wMatrix[V][V];
void addWeightedEdge(int m[][V], int u, int v, int w) {
    m[u][v] = w;
    m[v][u] = w;  // undirected
}

// Print matrix
void printMatrix(int m[][V]) {
    printf("   ");
    for (int i = 0; i < V; i++) printf("%3d", i);
    printf("\\n");
    for (int i = 0; i < V; i++) {
        printf("%2d:", i);
        for (int j = 0; j < V; j++)
            printf("%3d", m[i][j]);
        printf("\\n");
    }
}

// Complexity:
// Space: O(V²) — dense graphs ke liye OK
// addEdge: O(1)
// Check edge (u,v): O(1) — matrix[u][v]
// Get all neighbors: O(V) — scan row
// Bad for sparse graphs (many zeros wasted)
\`\`\`

### Representation 2: Adjacency List (Preferred!)

\`\`\`c
// Each vertex ka linked list — only stores actual edges!
#define MAXV 100

typedef struct Node {
    int           vertex;
    int           weight;   // for weighted graphs
    struct Node  *next;
} Node;

typedef struct {
    Node  *head[MAXV];  // array of linked lists
    int    V;            // number of vertices
    int    E;            // number of edges
    int    directed;     // 0=undirected, 1=directed
} Graph;

Graph* createGraph(int V, int directed) {
    Graph *g = (Graph*)malloc(sizeof(Graph));
    g->V = V; g->E = 0; g->directed = directed;
    for (int i = 0; i < V; i++) g->head[i] = NULL;
    return g;
}

void addEdge(Graph *g, int u, int v, int w) {
    // Add u → v
    Node *n = (Node*)malloc(sizeof(Node));
    n->vertex = v; n->weight = w;
    n->next = g->head[u];
    g->head[u] = n;
    g->E++;

    if (!g->directed) {
        // Add v → u (undirected)
        Node *m = (Node*)malloc(sizeof(Node));
        m->vertex = u; m->weight = w;
        m->next = g->head[v];
        g->head[v] = m;
    }
}

void printGraph(Graph *g) {
    for (int i = 0; i < g->V; i++) {
        printf("%d: ", i);
        for (Node *n = g->head[i]; n; n = n->next)
            printf("→%d(%d) ", n->vertex, n->weight);
        printf("\\n");
    }
}

void freeGraph(Graph *g) {
    for (int i = 0; i < g->V; i++) {
        Node *curr = g->head[i];
        while (curr) { Node *t = curr->next; free(curr); curr = t; }
    }
    free(g);
}

// Complexity:
// Space: O(V + E) — much better for sparse graphs!
// addEdge: O(1)
// Check edge (u,v): O(degree(u))
// Get all neighbors: O(degree(v))
\`\`\`

### DFS — Depth First Search

\`\`\`c
// Explore as deep as possible before backtracking
// Uses recursion (implicit stack) or explicit stack

int visited[MAXV];

void dfs(Graph *g, int v) {
    visited[v] = 1;
    printf("%d ", v);

    for (Node *n = g->head[v]; n; n = n->next) {
        if (!visited[n->vertex])
            dfs(g, n->vertex);
    }
}

// Iterative DFS — explicit stack
void dfsIter(Graph *g, int start) {
    int stack[MAXV], top = -1;
    memset(visited, 0, sizeof(visited));

    stack[++top] = start;
    while (top >= 0) {
        int v = stack[top--];
        if (visited[v]) continue;
        visited[v] = 1;
        printf("%d ", v);
        // Push all unvisited neighbors
        for (Node *n = g->head[v]; n; n = n->next)
            if (!visited[n->vertex])
                stack[++top] = n->vertex;
    }
}

// DFS Applications:
// - Detect cycles
// - Find connected components
// - Topological sort
// - Path finding
// - Maze solving
\`\`\`

### BFS — Breadth First Search

\`\`\`c
// Explore level by level — shortest path (unweighted)!
void bfs(Graph *g, int start) {
    int queue[MAXV], front = 0, rear = 0;
    memset(visited, 0, sizeof(visited));

    visited[start] = 1;
    queue[rear++] = start;

    while (front < rear) {
        int v = queue[front++];
        printf("%d ", v);

        for (Node *n = g->head[v]; n; n = n->next) {
            if (!visited[n->vertex]) {
                visited[n->vertex] = 1;
                queue[rear++] = n->vertex;
            }
        }
    }
}

// BFS Shortest Path (unweighted)
int bfsShortestPath(Graph *g, int src, int dst, int *path) {
    int queue[MAXV], front = 0, rear = 0;
    int dist[MAXV], parent[MAXV];
    memset(dist, -1, sizeof(dist));
    memset(parent, -1, sizeof(parent));

    dist[src] = 0;
    queue[rear++] = src;

    while (front < rear) {
        int v = queue[front++];
        if (v == dst) break;
        for (Node *n = g->head[v]; n; n = n->next) {
            if (dist[n->vertex] == -1) {
                dist[n->vertex] = dist[v] + 1;
                parent[n->vertex] = v;
                queue[rear++] = n->vertex;
            }
        }
    }

    if (dist[dst] == -1) return -1;  // no path

    // Reconstruct path
    int pathLen = 0, curr = dst;
    while (curr != -1) { path[pathLen++] = curr; curr = parent[curr]; }
    // Reverse path
    for (int i=0; i<pathLen/2; i++) {
        int t = path[i]; path[i] = path[pathLen-1-i]; path[pathLen-1-i] = t;
    }
    return pathLen;
}
\`\`\``,

      content_en: `## Graph — Nodes and Edges ka Network!

Tree = special graph (no cycles, connected). Graph = general — cycles ho sakti hain, disconnected bhi ho sakta hai.

### Real-World Graph Examples
\`\`\`
Social Network     ← users = nodes, friendships = edges
Google Maps        ← cities = nodes, roads = edges (weighted)
Internet           ← computers = nodes, cables = edges
Flight Routes      ← airports = nodes, flights = edges
Dependency Graph   ← tasks = nodes, dependencies = edges
Circuit Board      ← components = nodes, wires = edges
\`\`\`

### Graph Types
\`\`\`
Directed (Digraph):   edges have direction (A → B ≠ B → A)
Undirected:           edges bidirectional (A — B = B — A)
Weighted:             edges have cost/distance
Unweighted:           all edges equal
Cyclic:               has cycles
Acyclic (DAG):        Directed Acyclic Graph — no cycles
Connected:            path exists between every pair
Disconnected:         some nodes unreachable from others
\`\`\`

### Representation 1: Adjacency Matrix

\`\`\`c
#define V 6  // number of vertices

// matrix[i][j] = 1 if edge from i to j
int matrix[V][V] = {0};

void addEdge(int matrix[][V], int u, int v) {
    matrix[u][v] = 1;
    matrix[v][u] = 1;  // undirected — both directions
}

// Weighted graph
int wMatrix[V][V];
void addWeightedEdge(int m[][V], int u, int v, int w) {
    m[u][v] = w;
    m[v][u] = w;  // undirected
}

// Print matrix
void printMatrix(int m[][V]) {
    printf("   ");
    for (int i = 0; i < V; i++) printf("%3d", i);
    printf("\\n");
    for (int i = 0; i < V; i++) {
        printf("%2d:", i);
        for (int j = 0; j < V; j++)
            printf("%3d", m[i][j]);
        printf("\\n");
    }
}

// Complexity:
// Space: O(V²) — dense graphs ke liye OK
// addEdge: O(1)
// Check edge (u,v): O(1) — matrix[u][v]
// Get all neighbors: O(V) — scan row
// Bad for sparse graphs (many zeros wasted)
\`\`\`

### Representation 2: Adjacency List (Preferred!)

\`\`\`c
// Each vertex ka linked list — only stores actual edges!
#define MAXV 100

typedef struct Node {
    int           vertex;
    int           weight;   // for weighted graphs
    struct Node  *next;
} Node;

typedef struct {
    Node  *head[MAXV];  // array of linked lists
    int    V;            // number of vertices
    int    E;            // number of edges
    int    directed;     // 0=undirected, 1=directed
} Graph;

Graph* createGraph(int V, int directed) {
    Graph *g = (Graph*)malloc(sizeof(Graph));
    g->V = V; g->E = 0; g->directed = directed;
    for (int i = 0; i < V; i++) g->head[i] = NULL;
    return g;
}

void addEdge(Graph *g, int u, int v, int w) {
    // Add u → v
    Node *n = (Node*)malloc(sizeof(Node));
    n->vertex = v; n->weight = w;
    n->next = g->head[u];
    g->head[u] = n;
    g->E++;

    if (!g->directed) {
        // Add v → u (undirected)
        Node *m = (Node*)malloc(sizeof(Node));
        m->vertex = u; m->weight = w;
        m->next = g->head[v];
        g->head[v] = m;
    }
}

void printGraph(Graph *g) {
    for (int i = 0; i < g->V; i++) {
        printf("%d: ", i);
        for (Node *n = g->head[i]; n; n = n->next)
            printf("→%d(%d) ", n->vertex, n->weight);
        printf("\\n");
    }
}

void freeGraph(Graph *g) {
    for (int i = 0; i < g->V; i++) {
        Node *curr = g->head[i];
        while (curr) { Node *t = curr->next; free(curr); curr = t; }
    }
    free(g);
}

// Complexity:
// Space: O(V + E) — much better for sparse graphs!
// addEdge: O(1)
// Check edge (u,v): O(degree(u))
// Get all neighbors: O(degree(v))
\`\`\`

### DFS — Depth First Search

\`\`\`c
// Explore as deep as possible before backtracking
// Uses recursion (implicit stack) or explicit stack

int visited[MAXV];

void dfs(Graph *g, int v) {
    visited[v] = 1;
    printf("%d ", v);

    for (Node *n = g->head[v]; n; n = n->next) {
        if (!visited[n->vertex])
            dfs(g, n->vertex);
    }
}

// Iterative DFS — explicit stack
void dfsIter(Graph *g, int start) {
    int stack[MAXV], top = -1;
    memset(visited, 0, sizeof(visited));

    stack[++top] = start;
    while (top >= 0) {
        int v = stack[top--];
        if (visited[v]) continue;
        visited[v] = 1;
        printf("%d ", v);
        // Push all unvisited neighbors
        for (Node *n = g->head[v]; n; n = n->next)
            if (!visited[n->vertex])
                stack[++top] = n->vertex;
    }
}

// DFS Applications:
// - Detect cycles
// - Find connected components
// - Topological sort
// - Path finding
// - Maze solving
\`\`\`

### BFS — Breadth First Search

\`\`\`c
// Explore level by level — shortest path (unweighted)!
void bfs(Graph *g, int start) {
    int queue[MAXV], front = 0, rear = 0;
    memset(visited, 0, sizeof(visited));

    visited[start] = 1;
    queue[rear++] = start;

    while (front < rear) {
        int v = queue[front++];
        printf("%d ", v);

        for (Node *n = g->head[v]; n; n = n->next) {
            if (!visited[n->vertex]) {
                visited[n->vertex] = 1;
                queue[rear++] = n->vertex;
            }
        }
    }
}

// BFS Shortest Path (unweighted)
int bfsShortestPath(Graph *g, int src, int dst, int *path) {
    int queue[MAXV], front = 0, rear = 0;
    int dist[MAXV], parent[MAXV];
    memset(dist, -1, sizeof(dist));
    memset(parent, -1, sizeof(parent));

    dist[src] = 0;
    queue[rear++] = src;

    while (front < rear) {
        int v = queue[front++];
        if (v == dst) break;
        for (Node *n = g->head[v]; n; n = n->next) {
            if (dist[n->vertex] == -1) {
                dist[n->vertex] = dist[v] + 1;
                parent[n->vertex] = v;
                queue[rear++] = n->vertex;
            }
        }
    }

    if (dist[dst] == -1) return -1;  // no path

    // Reconstruct path
    int pathLen = 0, curr = dst;
    while (curr != -1) { path[pathLen++] = curr; curr = parent[curr]; }
    // Reverse path
    for (int i=0; i<pathLen/2; i++) {
        int t = path[i]; path[i] = path[pathLen-1-i]; path[pathLen-1-i] = t;
    }
    return pathLen;
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXV 10

typedef struct Node { int v,w; struct Node*next; } Node;
typedef struct { Node*head[MAXV]; int V,E,dir; } Graph;

Graph* newGraph(int V,int dir){
    Graph*g=(Graph*)calloc(1,sizeof(Graph));g->V=V;g->dir=dir;return g;
}
void addEdge(Graph*g,int u,int v,int w){
    Node*n=malloc(sizeof*n);n->v=v;n->w=w;n->next=g->head[u];g->head[u]=n;g->E++;
    if(!g->dir){Node*m=malloc(sizeof*m);m->v=u;m->w=w;m->next=g->head[v];g->head[v]=m;}
}

int vis[MAXV];

void dfs(Graph*g,int v,int depth){
    vis[v]=1;
    for(int i=0;i<depth;i++) printf("  ");
    printf("→ %d\\n",v);
    for(Node*n=g->head[v];n;n=n->next)
        if(!vis[n->v]) dfs(g,n->v,depth+1);
}

void bfs(Graph*g,int s){
    int q[MAXV],dist[MAXV],par[MAXV],f=0,r=0;
    memset(vis,0,sizeof(vis));
    memset(dist,-1,sizeof(dist));
    memset(par,-1,sizeof(par));
    vis[s]=1;dist[s]=0;q[r++]=s;
    printf("BFS from %d: ",s);
    while(f<r){
        int v=q[f++]; printf("%d ",v);
        for(Node*n=g->head[v];n;n=n->next){
            if(!vis[n->v]){vis[n->v]=1;dist[n->v]=dist[v]+1;par[n->v]=v;q[r++]=n->v;}
        }
    }
    printf("\\n");
    printf("Distances: ");
    for(int i=0;i<g->V;i++) printf("%d:%d ",i,dist[i]);
    printf("\\n");
}

int hasCycle(Graph*g,int v,int parent){
    vis[v]=1;
    for(Node*n=g->head[v];n;n=n->next){
        if(!vis[n->v]){if(hasCycle(g,n->v,v))return 1;}
        else if(n->v!=parent) return 1;
    }
    return 0;
}

int countComponents(Graph*g){
    memset(vis,0,sizeof(vis));
    int count=0;
    for(int i=0;i<g->V;i++)
        if(!vis[i]){count++;dfs(g,i,0);}
    return count;
}

void freeGraph(Graph*g){
    for(int i=0;i<g->V;i++){Node*c=g->head[i];while(c){Node*t=c->next;free(c);c=t;}}
    free(g);
}

int main(){
    // Social network graph
    //  0-Rahul  1-Priya  2-Aryan  3-Sneha  4-Vikram  5-Anita
    Graph *social = newGraph(6,0);
    addEdge(social,0,1,1); addEdge(social,0,2,1);
    addEdge(social,1,3,1); addEdge(social,2,3,1);
    addEdge(social,3,4,1); addEdge(social,4,5,1);
    char *names[]={"Rahul","Priya","Aryan","Sneha","Vikram","Anita"};

    printf("=== Social Network Graph ===\\n");
    printf("Adjacency List:\\n");
    for(int i=0;i<6;i++){
        printf("%-8s(%d): ",names[i],i);
        for(Node*n=social->head[i];n;n=n->next) printf("→%s ",names[n->v]);
        printf("\\n");
    }

    printf("\\nDFS from Rahul(0):\\n");
    memset(vis,0,sizeof(vis));
    dfs(social,0,0);

    printf("\\nBFS from Rahul(0):\\n");
    bfs(social,0);

    memset(vis,0,sizeof(vis));
    printf("\\nCycle exists: %s\\n",hasCycle(social,0,-1)?"Yes":"No");

    // Disconnected graph
    printf("\\n=== Disconnected Graph ===\\n");
    Graph *g2=newGraph(6,0);
    addEdge(g2,0,1,1);addEdge(g2,1,2,1);  // component 1
    addEdge(g2,3,4,1);                      // component 2
    // 5 is isolated                         // component 3
    memset(vis,0,sizeof(vis));
    printf("Components: %d\\n",countComponents(g2));

    freeGraph(social); freeGraph(g2);
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MV 8
typedef struct N{int v,w;struct N*n;}N;
typedef struct{N*h[MV];int V,dir;}G;
G* newG(int V,int d){G*g=calloc(1,sizeof(G));g->V=V;g->dir=d;return g;}
void ae(G*g,int u,int v,int w){N*n=malloc(sizeof*n);n->v=v;n->w=w;n->n=g->h[u];g->h[u]=n;if(!g->dir){N*m=malloc(sizeof*m);m->v=u;m->w=w;m->n=g->h[v];g->h[v]=m;}}
int vis[MV];
void dfs(G*g,int v){vis[v]=1;printf("%d ",v);for(N*n=g->h[v];n;n=n->n)if(!vis[n->v])dfs(g,n->v);}
void bfs(G*g,int s){int q[MV],f=0,r=0;memset(vis,0,sizeof(vis));vis[s]=1;q[r++]=s;while(f<r){int v=q[f++];printf("%d ",v);for(N*n=g->h[v];n;n=n->n)if(!vis[n->v]){vis[n->v]=1;q[r++]=n->v;}}}

int main(){
    G*g=newG(6,0);
    ae(g,0,1,1);ae(g,0,2,1);ae(g,1,3,1);ae(g,2,3,1);ae(g,3,4,1);ae(g,4,5,1);
    printf("DFS: ");memset(vis,0,sizeof(vis));dfs(g,0);printf("\\n");
    printf("BFS: ");bfs(g,0);printf("\\n");
    return 0;
}`,

      task: {
        description: 'Graph basics practice: (1) "Friend Suggestions" — BFS se 2-hop friends find karo (friends of friends jo direct friend nahi hain). (2) "Cycle Detection" directed graph mein — DFS + color marking (WHITE/GRAY/BLACK) use karo. (3) "Number of Islands" — 2D grid mein 1s aur 0s hain, connected 1s groups count karo (DFS/BFS). (4) "Bipartite Check" — graph bipartite hai ya nahi BFS se check karo (2-colorable).',
        description_en: 'Graph basics practice: (1) "Friend Suggestions" — use BFS to find 2-hop friends (friends of friends who are not direct friends). (2) "Cycle Detection" in a directed graph — use DFS + color marking (WHITE/GRAY/BLACK). (3) "Number of Islands" — count groups of connected 1s in a 2D grid of 1s and 0s (DFS/BFS). (4) "Bipartite Check" — use BFS to check if a graph is bipartite (2-colorable).',
        hint: 'Bipartite: BFS se nodes ko 2 colors mein paint karo. If neighbor same color → not bipartite. Islands: for each unvisited 1, DFS se entire island mark karo, count++. Directed cycle: DFS mein recursion stack track karo (vis[v]==2 = in current path).',
        hint_en: 'Bipartite: use BFS to paint nodes in 2 colours. If a neighbour has the same colour → not bipartite. Islands: for each unvisited 1, mark the entire island with DFS, count++. Directed cycle: track the recursion stack in DFS (vis[v]==2 = in current path).',
      },
      quiz: [
        {
          q: 'Adjacency Matrix aur Adjacency List mein kab kaunsa prefer karein?',
          options: [
            'Hamesha Matrix',
            'Matrix: dense graphs (E ≈ V²), O(1) edge check, O(V²) space. List: sparse graphs (E << V²), O(V+E) space. Real networks (social, web) mein sparse → List preferred.',
            'Hamesha List',
            'Same performance',
          ],
          correct: 1,
          explanation: 'Dense graph (V=100, E=~9000): matrix 100×100=10000 cells — OK. Sparse graph (V=1M, E=5M): matrix 1M×1M = 1TB RAM! List: O(V+E) = 6M entries — manageable. Real social networks: billion users, few hundred friends each — sparse → list. Game grid, circuit board — dense → matrix acceptable.',
          q_en: 'When should you prefer an Adjacency Matrix vs an Adjacency List?',
          options_en: [
            'Always Matrix',
            'Matrix: dense graphs (E ≈ V²), O(1) edge check, O(V²) space. List: sparse graphs (E << V²), O(V+E) space. Real networks (social, web) are sparse → List preferred.',
            'Always List',
            'Same performance',
          ],
          explanation_en: 'Dense graph (V=100, E≈9000): matrix 100×100=10,000 cells — fine. Sparse graph (V=1M, E=5M): matrix 1M×1M = 1 TB RAM! List: O(V+E) = 6M entries — manageable. Real social networks: billions of users, a few hundred friends each — sparse → use a list. Game grids, circuit boards — dense → matrix is acceptable.',
        },
        {
          q: 'DFS aur BFS mein kab kaunsa use karein?',
          options: [
            'BFS hamesha better',
            'BFS: shortest path (unweighted), level-order traversal, closeness. DFS: cycle detection, topological sort, connected components, maze solving (backtracking). Both O(V+E) time.',
            'DFS hamesha faster',
            'Koi difference nahi',
          ],
          correct: 1,
          explanation: 'BFS: breadth-wise explore → naturally finds shortest path in unweighted graph. DFS: depth-wise → good for exhaustive search, backtracking. Memory: BFS queue can be O(V) large (wide graphs). DFS stack O(h) where h=height. Practical: BFS for GPS shortest path (unweighted), DFS for game solving, maze solving, dependency resolution.',
          q_en: 'When should you use DFS vs BFS?',
          options_en: [
            'BFS is always better',
            'BFS: shortest path (unweighted), level-order, closeness. DFS: cycle detection, topological sort, connected components, maze solving. Both O(V+E) time.',
            'DFS is always faster',
            'No difference',
          ],
          explanation_en: 'BFS: explores breadth-wise → naturally finds shortest path in an unweighted graph. DFS: goes depth-wise → good for exhaustive search, backtracking. Memory: BFS queue can be O(V) large (wide graphs). DFS stack O(h) where h=height. Practical: BFS for GPS shortest path (unweighted), DFS for game solving, maze solving, dependency resolution.',
        },
        {
          q: 'Graph mein "connected components" kya hote hain aur kaise count karte hain?',
          options: [
            'Nodes ki total count',
            'Connected component = set of nodes jahan har node se har doosre node tak path hai. Count: har unvisited node se DFS/BFS run karo, ek DFS = ek component. Total DFS calls = components.',
            'Edges ki count',
            'Maximum path length',
          ],
          correct: 1,
          explanation: 'Disconnected graph: kuch nodes doosron se reachable nahi. Each isolated group = component. Algorithm: visited array, for each unvisited node: DFS from it (marks entire component), count++. Real uses: social network clustering, image segmentation, circuit connectivity check. Undirected: DFS/BFS. Directed: Strongly Connected Components (Kosaraju\'s, Tarjan\'s algorithm).',
          q_en: 'What are "connected components" in a graph and how do you count them?',
          options_en: [
            'The total count of nodes',
            'A connected component = set of nodes where every node can reach every other node. Count: run DFS/BFS from every unvisited node; one DFS = one component. Total DFS calls = number of components.',
            'The count of edges',
            'The maximum path length',
          ],
          explanation_en: 'Disconnected graph: some nodes are not reachable from others. Each isolated group = one component. Algorithm: visited array; for each unvisited node, run DFS from it (marks the entire component), count++. Real uses: social network clustering, image segmentation, circuit connectivity checks. Undirected: DFS/BFS. Directed: Strongly Connected Components (Kosaraju\'s or Tarjan\'s algorithm).',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w11-s2',
      title: "Dijkstra's Algorithm — Shortest Path",
      title_en: "Dijkstra's Algorithm — Shortest Path",
      emoji: '🗺️',
      content: `## Dijkstra's Shortest Path — GPS ka Algorithm!

Weighted graph mein shortest path kaise nikaalein? Dijkstra's algorithm!

### Algorithm Logic

\`\`\`
Greedy approach:
1. Start node ka distance = 0, sab others = ∞
2. Min-distance unvisited node lo
3. Uske saare neighbors update karo:
   if dist[u] + weight(u,v) < dist[v]:
       dist[v] = dist[u] + weight(u,v)
       parent[v] = u
4. Node ko "visited" mark karo
5. Repeat jab tak sab nodes visited
\`\`\`

### Implementation

\`\`\`c
#define INF 999999
#define MAXV 100

typedef struct {
    int  dist[MAXV];    // shortest distance from src
    int  parent[MAXV];  // previous node in shortest path
    int  visited[MAXV];
    int  V;
} DijkResult;

// Find unvisited node with minimum distance — O(V)
int minDist(int dist[], int visited[], int V) {
    int min = INF, minIdx = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v]; minIdx = v;
        }
    }
    return minIdx;
}

// Dijkstra on adjacency matrix — O(V²)
DijkResult dijkstra(int graph[][MAXV], int V, int src) {
    DijkResult r;
    r.V = V;
    for (int i = 0; i < V; i++) {
        r.dist[i]    = INF;
        r.visited[i] = 0;
        r.parent[i]  = -1;
    }
    r.dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDist(r.dist, r.visited, V);
        if (u == -1) break;  // disconnected graph
        r.visited[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!r.visited[v] &&
                graph[u][v] &&
                r.dist[u] + graph[u][v] < r.dist[v]) {
                r.dist[v]   = r.dist[u] + graph[u][v];
                r.parent[v] = u;
            }
        }
    }
    return r;
}

// Print shortest path from src to dst
void printPath(DijkResult *r, int src, int dst) {
    if (r->dist[dst] == INF) {
        printf("No path from %d to %d\\n", src, dst);
        return;
    }
    // Reconstruct path
    int path[MAXV], len = 0, curr = dst;
    while (curr != -1) { path[len++] = curr; curr = r->parent[curr]; }
    printf("Path %d→%d (dist=%d): ", src, dst, r->dist[dst]);
    for (int i = len-1; i >= 0; i--)
        printf("%d%s", path[i], i > 0 ? "→" : "\\n");
}
\`\`\`

### Optimized Dijkstra with Min-Heap — O((V+E) log V)

\`\`\`c
// Min-heap based priority queue for Dijkstra
typedef struct {
    int dist;
    int vertex;
} HeapNode;

typedef struct {
    HeapNode *data;
    int       size;
    int       capacity;
} MinHeap;

MinHeap* createMinHeap(int cap) {
    MinHeap *h = malloc(sizeof(MinHeap));
    h->data = malloc(cap * sizeof(HeapNode));
    h->size = 0; h->capacity = cap;
    return h;
}

void swap(HeapNode *a, HeapNode *b) { HeapNode t=*a; *a=*b; *b=t; }

void heapifyUp(MinHeap *h, int i) {
    while (i > 0) {
        int p = (i-1)/2;
        if (h->data[i].dist < h->data[p].dist) { swap(&h->data[i], &h->data[p]); i=p; }
        else break;
    }
}

void heapifyDown(MinHeap *h, int i) {
    int smallest = i, l = 2*i+1, r = 2*i+2;
    if (l < h->size && h->data[l].dist < h->data[smallest].dist) smallest = l;
    if (r < h->size && h->data[r].dist < h->data[smallest].dist) smallest = r;
    if (smallest != i) { swap(&h->data[i], &h->data[smallest]); heapifyDown(h, smallest); }
}

void push(MinHeap *h, int dist, int v) {
    h->data[h->size] = (HeapNode){dist, v};
    heapifyUp(h, h->size++);
}

HeapNode pop(MinHeap *h) {
    HeapNode top = h->data[0];
    h->data[0] = h->data[--h->size];
    heapifyDown(h, 0);
    return top;
}

// O((V+E) log V) — much faster for sparse graphs!
void dijkstraFast(Graph *g, int src, int *dist, int *parent) {
    for (int i = 0; i < g->V; i++) { dist[i] = INF; parent[i] = -1; }
    dist[src] = 0;

    MinHeap *h = createMinHeap(g->V * g->V);
    push(h, 0, src);

    while (h->size > 0) {
        HeapNode curr = pop(h);
        int u = curr.vertex;
        if (curr.dist > dist[u]) continue;  // stale entry

        for (Node *n = g->head[u]; n; n = n->next) {
            int v = n->vertex, w = n->weight;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                push(h, dist[v], v);
            }
        }
    }
    free(h->data); free(h);
}
\`\`\`

### Dijkstra Limitations

\`\`\`
✅ Works: Non-negative edge weights
❌ Fails: Negative edge weights → use Bellman-Ford
❌ Fails: Negative cycles → undefined (infinite negative loop)

For negative weights: Bellman-Ford O(VE)
For all-pairs shortest paths: Floyd-Warshall O(V³)
\`\`\``,

      content_en: `## Dijkstra's Shortest Path — GPS ka Algorithm!

Weighted graph in shortest path kaise nikaalein? Dijkstra's algorithm!

### Algorithm Logic

\`\`\`
Greedy approach:
1. Start node ka distance = 0, sab others = ∞
2. Min-distance unvisited node lo
3. Uske saare neighbors update do:
   if dist[u] + weight(u,v) < dist[v]:
       dist[v] = dist[u] + weight(u,v)
       parent[v] = u
4. Node ko "visited" mark do
5. Repeat jab tak sab nodes visited
\`\`\`

### Implementation

\`\`\`c
#define INF 999999
#define MAXV 100

typedef struct {
    int  dist[MAXV];    // shortest distance from src
    int  parent[MAXV];  // previous node in shortest path
    int  visited[MAXV];
    int  V;
} DijkResult;

// Find unvisited node with minimum distance — O(V)
int minDist(int dist[], int visited[], int V) {
    int min = INF, minIdx = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v]; minIdx = v;
        }
    }
    return minIdx;
}

// Dijkstra on adjacency matrix — O(V²)
DijkResult dijkstra(int graph[][MAXV], int V, int src) {
    DijkResult r;
    r.V = V;
    for (int i = 0; i < V; i++) {
        r.dist[i]    = INF;
        r.visited[i] = 0;
        r.parent[i]  = -1;
    }
    r.dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDist(r.dist, r.visited, V);
        if (u == -1) break;  // disconnected graph
        r.visited[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!r.visited[v] &&
                graph[u][v] &&
                r.dist[u] + graph[u][v] < r.dist[v]) {
                r.dist[v]   = r.dist[u] + graph[u][v];
                r.parent[v] = u;
            }
        }
    }
    return r;
}

// Print shortest path from src to dst
void printPath(DijkResult *r, int src, int dst) {
    if (r->dist[dst] == INF) {
        printf("No path from %d to %d\\n", src, dst);
        return;
    }
    // Reconstruct path
    int path[MAXV], len = 0, curr = dst;
    while (curr != -1) { path[len++] = curr; curr = r->parent[curr]; }
    printf("Path %d→%d (dist=%d): ", src, dst, r->dist[dst]);
    for (int i = len-1; i >= 0; i--)
        printf("%d%s", path[i], i > 0 ? "→" : "\\n");
}
\`\`\`

### Optimized Dijkstra with Min-Heap — O((V+E) log V)

\`\`\`c
// Min-heap based priority queue for Dijkstra
typedef struct {
    int dist;
    int vertex;
} HeapNode;

typedef struct {
    HeapNode *data;
    int       size;
    int       capacity;
} MinHeap;

MinHeap* createMinHeap(int cap) {
    MinHeap *h = malloc(sizeof(MinHeap));
    h->data = malloc(cap * sizeof(HeapNode));
    h->size = 0; h->capacity = cap;
    return h;
}

void swap(HeapNode *a, HeapNode *b) { HeapNode t=*a; *a=*b; *b=t; }

void heapifyUp(MinHeap *h, int i) {
    while (i > 0) {
        int p = (i-1)/2;
        if (h->data[i].dist < h->data[p].dist) { swap(&h->data[i], &h->data[p]); i=p; }
        else break;
    }
}

void heapifyDown(MinHeap *h, int i) {
    int smallest = i, l = 2*i+1, r = 2*i+2;
    if (l < h->size && h->data[l].dist < h->data[smallest].dist) smallest = l;
    if (r < h->size && h->data[r].dist < h->data[smallest].dist) smallest = r;
    if (smallest != i) { swap(&h->data[i], &h->data[smallest]); heapifyDown(h, smallest); }
}

void push(MinHeap *h, int dist, int v) {
    h->data[h->size] = (HeapNode){dist, v};
    heapifyUp(h, h->size++);
}

HeapNode pop(MinHeap *h) {
    HeapNode top = h->data[0];
    h->data[0] = h->data[--h->size];
    heapifyDown(h, 0);
    return top;
}

// O((V+E) log V) — much faster for sparse graphs!
void dijkstraFast(Graph *g, int src, int *dist, int *parent) {
    for (int i = 0; i < g->V; i++) { dist[i] = INF; parent[i] = -1; }
    dist[src] = 0;

    MinHeap *h = createMinHeap(g->V * g->V);
    push(h, 0, src);

    while (h->size > 0) {
        HeapNode curr = pop(h);
        int u = curr.vertex;
        if (curr.dist > dist[u]) continue;  // stale entry

        for (Node *n = g->head[u]; n; n = n->next) {
            int v = n->vertex, w = n->weight;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                push(h, dist[v], v);
            }
        }
    }
    free(h->data); free(h);
}
\`\`\`

### Dijkstra Limitations

\`\`\`
✅ Works: Non-negative edge weights
❌ Fails: Negative edge weights → use Bellman-Ford
❌ Fails: Negative cycles → undefined (infinite negative loop)

For negative weights: Bellman-Ford O(VE)
For all-pairs shortest paths: Floyd-Warshall O(V³)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXV 8
#define INF  99999

// City names
char *cities[] = {"Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad","Pune","Jaipur"};

// Dijkstra on adjacency matrix
void dijkstra(int g[][MAXV], int V, int src, int *dist, int *par) {
    int vis[MAXV]={0};
    for(int i=0;i<V;i++){dist[i]=INF;par[i]=-1;}
    dist[src]=0;

    for(int c=0;c<V-1;c++){
        int u=-1;
        for(int i=0;i<V;i++) if(!vis[i]&&(u==-1||dist[i]<dist[u]))u=i;
        if(u==-1||dist[u]==INF) break;
        vis[u]=1;
        for(int v=0;v<V;v++)
            if(g[u][v]&&!vis[v]&&dist[u]+g[u][v]<dist[v]){
                dist[v]=dist[u]+g[u][v]; par[v]=u;
            }
    }
}

void printPath(int *par, int *dist, int src, int dst) {
    if(dist[dst]==INF){printf("No route\\n");return;}
    int path[MAXV],len=0,curr=dst;
    while(curr!=-1){path[len++]=curr;curr=par[curr];}
    printf("Route: ");
    for(int i=len-1;i>=0;i--) printf("%s%s",cities[path[i]],i>0?" → ":"");
    printf("  (Distance: %d km)\\n",dist[dst]);
}

int main(){
    // Distance matrix (km, 0 = no direct route)
    int g[MAXV][MAXV]={
    //  Mum  Del  Blr  Che  Kol  Hyd  Pun  Jai
        {0,  1415, 981,1338,2054, 711, 149, 1176}, // Mumbai
        {1415,  0, 2150,2180,1500,1575,1413,  268}, // Delhi
        {981,2150,   0,  346,1871, 575,1153, 2082}, // Bangalore
        {1338,2180, 346,  0, 1659, 626,1437, 2228}, // Chennai
        {2054,1500,1871,1659,   0,1495,1905, 1768}, // Kolkata
        {711,1575, 575, 626,1495,   0, 562,  1243}, // Hyderabad
        {149,1413,1153,1437,1905, 562,   0,  1165}, // Pune
        {1176, 268,2082,2228,1768,1243,1165,    0}, // Jaipur
    };

    printf("=== India Route Finder (Dijkstra) ===\\n\\n");

    int dist[MAXV], par[MAXV];
    int src = 0;  // Mumbai

    dijkstra(g, MAXV, src, dist, par);

    printf("Shortest distances from %s:\\n", cities[src]);
    printf("%-15s %8s  %s\\n", "City", "Dist(km)", "Shortest Route");
    printf("──────────────────────────────────────────────────────\\n");
    for(int i=0;i<MAXV;i++){
        if(i==src) continue;
        printf("%-15s %8d  ", cities[i], dist[i]);
        int path[MAXV],len=0,curr=i;
        while(curr!=-1){path[len++]=curr;curr=par[curr];}
        for(int j=len-1;j>=0;j--) printf("%s%s",cities[path[j]],j>0?"→":"");
        printf("\\n");
    }

    printf("\\n=== Specific Routes ===\\n");
    printf("Mumbai → Kolkata: "); printPath(par,dist,src,4);
    printf("Mumbai → Jaipur:  "); printPath(par,dist,src,7);

    // All pairs shortest path
    printf("\\n=== Distance Matrix (Dijkstra all sources) ===\\n");
    printf("%-12s","");
    for(int i=0;i<MAXV;i++) printf("%-7.3s",cities[i]);
    printf("\\n");
    for(int s=0;s<MAXV;s++){
        int d[MAXV],p[MAXV];
        dijkstra(g,MAXV,s,d,p);
        printf("%-12.6s",cities[s]);
        for(int t=0;t<MAXV;t++) printf("%-7d",d[t]);
        printf("\\n");
    }
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#define V 5
#define INF 99999

void dijk(int g[][V],int src,int*d,int*p){
    int vis[V]={0};
    for(int i=0;i<V;i++){d[i]=INF;p[i]=-1;}
    d[src]=0;
    for(int c=0;c<V-1;c++){
        int u=-1;
        for(int i=0;i<V;i++)if(!vis[i]&&(u==-1||d[i]<d[u]))u=i;
        if(u==-1)break; vis[u]=1;
        for(int v=0;v<V;v++)
            if(g[u][v]&&!vis[v]&&d[u]+g[u][v]<d[v]){d[v]=d[u]+g[u][v];p[v]=u;}
    }
}
int main(){
    int g[V][V]={{0,10,0,0,5},{0,0,1,0,2},{0,0,0,4,0},{0,0,0,0,0},{0,3,9,2,0}};
    int d[V],p[V];
    dijk(g,0,d,p);
    printf("Dist from 0: ");
    for(int i=0;i<V;i++) printf("%d:%d ",i,d[i]);
    printf("\\n");
    return 0;
}`,

      task: {
        description: "Dijkstra practice: (1) 'Network Routing' simulate karo — routers graph mein hain, packet ko source se destination tak shortest latency path find karo. (2) 'Bellman-Ford' implement karo — negative weights support karo, negative cycle detect karo. (3) 'Floyd-Warshall' implement karo — all-pairs shortest paths O(V³). (4) 'A* Search' implement karo — heuristic ke saath Dijkstra (Manhattan distance ya Euclidean).",
        description_en: "Dijkstra practice: (1) Simulate 'Network Routing' — routers are nodes in a graph, find the shortest latency path for a packet from source to destination. (2) Implement 'Bellman-Ford' — support negative weights and detect negative cycles. (3) Implement 'Floyd-Warshall' — all-pairs shortest paths O(V³). (4) Implement 'A* Search' — Dijkstra with a heuristic (Manhattan or Euclidean distance).",
        hint: "Bellman-Ford: V-1 rounds, each round relax all edges. Negative cycle: if V-th round still relaxes, cycle exists. Floyd-Warshall: for k in 0..V: for i: for j: dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j]). A*: priority = g+h where g=actual cost, h=heuristic estimate.",
        hint_en: 'Bellman-Ford: V-1 rounds, each round relax all edges. Negative cycle: if the V-th round still relaxes, a cycle exists. Floyd-Warshall: for k in 0..V: for i: for j: dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j]). A*: priority = g+h where g=actual cost, h=heuristic estimate.',
      },
      quiz: [
        {
          q: "Dijkstra's algorithm negative weights ke saath kyun fail ho jaata hai?",
          options: [
            'Implementation bug hai',
            "Greedy assumption: visited node ko dobara update nahi karte. Negative edge se: already-visited node ka distance future mein aur chhota ho sakta hai — missed! Bellman-Ford V-1 rounds mein sab edges relaxes karta hai — negative weights handle karta hai.",
            "Dijkstra sirf undirected graphs ke liye hai",
            "O(V²) complexity ki wajah se",
          ],
          correct: 1,
          explanation: "Example: 0→1 (weight=5), 0→2 (weight=3), 2→1 (weight=-10). Dijkstra visits 2 first (dist=3), marks visited. Then visits 1 with dist=5. But through 2: 3+(-10)=-7 which is better! Dijkstra won't find this because 1 is already visited. Fix: Bellman-Ford relaxes all edges V-1 times, allowing negative updates. Negative cycle: Bellman-Ford detects it in V-th pass.",
          q_en: "Why does Dijkstra's algorithm fail with negative weights?",
          options_en: [
            'It is an implementation bug',
            "Greedy assumption: we don't re-update visited nodes. With a negative edge: an already-visited node's distance could become smaller later — missed! Bellman-Ford relaxes all edges V-1 times — handles negative weights.",
            "Dijkstra is only for undirected graphs",
            "Due to O(V²) complexity",
          ],
          explanation_en: "Example: 0→1 (weight=5), 0→2 (weight=3), 2→1 (weight=-10). Dijkstra visits 2 first (dist=3), marks visited. Then visits 1 with dist=5. But through 2: 3+(-10)=-7, which is better! Dijkstra misses this because 1 is already marked visited. Fix: Bellman-Ford relaxes all edges V-1 times, allowing negative updates. Negative cycle: detected in the V-th pass of Bellman-Ford.",
        },
        {
          q: 'Min-heap se Dijkstra O(V²) se O((V+E)logV) kaise ho jaata hai?',
          options: [
            'Min-heap magic karta hai',
            'O(V²): har iteration mein V nodes scan karo min find karne ke liye. Min-heap: O(1) min extract + O(logV) insert. Sparse graphs (E<<V²) mein: O((V+E)logV) << O(V²). Dense graphs: similar.',
            'Min-heap sirf space save karta hai',
            'Complexity same rehti hai',
          ],
          correct: 1,
          explanation: 'Simple Dijkstra: find min = O(V) × V times = O(V²). Min-heap: extract min = O(logV), insert/update = O(logV). Total: O((V+E)logV). For sparse graph E=O(V): O(V logV). For dense E=O(V²): O(V² logV) — worse than simple! Rule: sparse → heap, dense → simple. Most real graphs sparse → heap version preferred.',
          q_en: 'How does a min-heap improve Dijkstra from O(V²) to O((V+E)logV)?',
          options_en: [
            'Min-heap is magic',
            'O(V²): scan V nodes to find the minimum in each iteration. Min-heap: O(1) min extract + O(logV) insert. For sparse graphs (E<<V²): O((V+E)logV) << O(V²). Similar for dense graphs.',
            'Min-heap only saves space',
            'Complexity stays the same',
          ],
          explanation_en: 'Simple Dijkstra: find min = O(V) × V times = O(V²). Min-heap: extract min = O(logV), insert/update = O(logV). Total: O((V+E)logV). For a sparse graph E=O(V): O(V logV). For a dense graph E=O(V²): O(V² logV) — worse than simple! Rule: sparse → heap, dense → simple. Most real graphs are sparse → heap version preferred.',
        },
        {
          q: 'Floyd-Warshall aur Dijkstra mein main difference kya hai?',
          options: [
            'Same algorithm hai',
            'Dijkstra: single source, all destinations. O((V+E)logV). Floyd-Warshall: all sources, all destinations (all-pairs). O(V³). Negative weights bhi handle karta hai (no negative cycles). V>1000 pe impractical.',
            'Floyd-Warshall faster hai',
            'Dijkstra only for undirected',
          ],
          correct: 1,
          explanation: 'Dijkstra: one source, find shortest to all. Run V times for all-pairs = O(V*(V+E)logV). Floyd-Warshall: single DP — dist[i][j] = min over all intermediate k. O(V³) but simpler code. Negative weights: OK (no negative cycle). V=1000: 10^9 ops — borderline. V=10000: 10^12 — impractical. Use case: small dense graphs, or when negative weights exist.',
          q_en: 'What is the main difference between Floyd-Warshall and Dijkstra?',
          options_en: [
            'They are the same algorithm',
            'Dijkstra: single source, all destinations. O((V+E)logV). Floyd-Warshall: all sources, all destinations (all-pairs). O(V³). Also handles negative weights (no negative cycles). Impractical for V>1000.',
            'Floyd-Warshall is faster',
            'Dijkstra is only for undirected graphs',
          ],
          explanation_en: 'Dijkstra: one source, find shortest to all. Run V times for all-pairs = O(V*(V+E)logV). Floyd-Warshall: single DP — dist[i][j] = min over all intermediate k. O(V³) but simpler code. Negative weights: OK (no negative cycle). V=1000: 10⁹ ops — borderline. V=10000: 10¹² — impractical. Use cases: small dense graphs, or when negative weights exist.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w11-s3',
      title: 'Topological Sort aur Advanced Graph Algorithms',
      title_en: 'Topological Sort and Advanced Graph Algorithms',
      emoji: '📐',
      content: `## Topological Sort — Task Scheduling!

DAG (Directed Acyclic Graph) mein nodes ko aise order mein arrange karo ki har edge u→v mein u, v se pehle aaye.

### Real-World Uses
\`\`\`
Build systems      ← compile A before B (A depends on B)
Course prerequisites ← Math pehle, then Physics
Package manager   ← npm/pip install order
Task scheduling   ← dependency-respecting order
\`\`\`

### Topological Sort — DFS Based (Kahn's Algorithm variant)

\`\`\`c
// Method 1: DFS + finish time stack
int topoStack[MAXV], topoTop = -1;
int visited[MAXV];

void topoDFS(Graph *g, int v) {
    visited[v] = 1;
    for (Node *n = g->head[v]; n; n = n->next)
        if (!visited[n->vertex])
            topoDFS(g, n->vertex);
    topoStack[++topoTop] = v;  // push after all descendants
}

void topologicalSort(Graph *g) {
    memset(visited, 0, sizeof(visited));
    topoTop = -1;
    for (int v = 0; v < g->V; v++)
        if (!visited[v]) topoDFS(g, v);

    printf("Topological Order: ");
    while (topoTop >= 0) printf("%d ", topoStack[topoTop--]);
    printf("\\n");
}

// Method 2: Kahn's BFS (in-degree based)
void kahnTopSort(Graph *g) {
    int inDegree[MAXV] = {0};
    // Calculate in-degrees
    for (int v = 0; v < g->V; v++)
        for (Node *n = g->head[v]; n; n = n->next)
            inDegree[n->vertex]++;

    // Queue: all nodes with in-degree 0
    int queue[MAXV], front = 0, rear = 0;
    for (int v = 0; v < g->V; v++)
        if (inDegree[v] == 0) queue[rear++] = v;

    int count = 0;
    printf("Kahn's Topological Order: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        count++;
        for (Node *n = g->head[u]; n; n = n->next) {
            if (--inDegree[n->vertex] == 0)
                queue[rear++] = n->vertex;
        }
    }
    printf("\\n");
    if (count != g->V) printf("CYCLE DETECTED! Not a DAG.\\n");
}
\`\`\`

### Minimum Spanning Tree — Prim's Algorithm

\`\`\`c
// MST: minimum weight tree that connects all vertices
// Use case: cheapest way to connect all cities with roads

void primMST(int graph[][MAXV], int V) {
    int parent[MAXV];   // MST parent
    int key[MAXV];      // minimum weight edge for each vertex
    int inMST[MAXV];    // is vertex in MST?

    for (int i = 0; i < V; i++) {
        key[i] = INF; inMST[i] = 0;
    }
    key[0] = 0; parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        // Find min key vertex not in MST
        int u = -1;
        for (int v = 0; v < V; v++)
            if (!inMST[v] && (u == -1 || key[v] < key[u]))
                u = v;

        inMST[u] = 1;

        // Update adjacent vertices
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v]    = graph[u][v];
            }
        }
    }

    // Print MST
    int totalCost = 0;
    printf("MST edges:\\n");
    for (int i = 1; i < V; i++) {
        printf("  %d - %d (weight: %d)\\n", parent[i], i, graph[parent[i]][i]);
        totalCost += graph[parent[i]][i];
    }
    printf("Total MST cost: %d\\n", totalCost);
}
\`\`\`

### Strongly Connected Components (Kosaraju's)

\`\`\`c
// SCC: maximal set where every node reachable from every other
// Kosaraju's: 2-pass DFS

// Pass 1: DFS on original graph, push finish order to stack
// Pass 2: DFS on TRANSPOSE graph in reverse finish order
// Each DFS in pass 2 = one SCC

void dfsFinish(Graph *g, int v, int *finish, int *finTop) {
    visited[v] = 1;
    for (Node *n = g->head[v]; n; n = n->next)
        if (!visited[n->vertex])
            dfsFinish(g, n->vertex, finish, finTop);
    finish[++(*finTop)] = v;
}

Graph* transposeGraph(Graph *g) {
    Graph *t = createGraph(g->V, 1);  // directed
    for (int v = 0; v < g->V; v++)
        for (Node *n = g->head[v]; n; n = n->next)
            addEdge(t, n->vertex, v, 1);  // reverse edge
    return t;
}

int kosarajuSCC(Graph *g) {
    int finish[MAXV], finTop = -1;
    memset(visited, 0, sizeof(visited));
    // Pass 1
    for (int v = 0; v < g->V; v++)
        if (!visited[v]) dfsFinish(g, v, finish, &finTop);

    // Pass 2 on transpose
    Graph *tr = transposeGraph(g);
    memset(visited, 0, sizeof(visited));
    int sccCount = 0;
    while (finTop >= 0) {
        int v = finish[finTop--];
        if (!visited[v]) {
            printf("SCC %d: ", ++sccCount);
            // DFS on transpose
            // (simplified — print component)
            dfsFinish(tr, v, finish, &finTop);  // reuse for printing
            printf("\\n");
        }
    }
    freeGraph(tr);
    return sccCount;
}
\`\`\``,

      content_en: `## Topological Sort — Task Scheduling!

DAG (Directed Acyclic Graph) in nodes ko aise order in arrange do ki har edge u→v in u, v se pehle aaye.

### Real-World Uses
\`\`\`
Build systems      ← compile A before B (A depends on B)
Course prerequisites ← Math pehle, then Physics
Package manager   ← npm/pip install order
Task scheduling   ← dependency-respecting order
\`\`\`

### Topological Sort — DFS Based (Kahn's Algorithm variant)

\`\`\`c
// Method 1: DFS + finish time stack
int topoStack[MAXV], topoTop = -1;
int visited[MAXV];

void topoDFS(Graph *g, int v) {
    visited[v] = 1;
    for (Node *n = g->head[v]; n; n = n->next)
        if (!visited[n->vertex])
            topoDFS(g, n->vertex);
    topoStack[++topoTop] = v;  // push after all descendants
}

void topologicalSort(Graph *g) {
    memset(visited, 0, sizeof(visited));
    topoTop = -1;
    for (int v = 0; v < g->V; v++)
        if (!visited[v]) topoDFS(g, v);

    printf("Topological Order: ");
    while (topoTop >= 0) printf("%d ", topoStack[topoTop--]);
    printf("\\n");
}

// Method 2: Kahn's BFS (in-degree based)
void kahnTopSort(Graph *g) {
    int inDegree[MAXV] = {0};
    // Calculate in-degrees
    for (int v = 0; v < g->V; v++)
        for (Node *n = g->head[v]; n; n = n->next)
            inDegree[n->vertex]++;

    // Queue: all nodes with in-degree 0
    int queue[MAXV], front = 0, rear = 0;
    for (int v = 0; v < g->V; v++)
        if (inDegree[v] == 0) queue[rear++] = v;

    int count = 0;
    printf("Kahn's Topological Order: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        count++;
        for (Node *n = g->head[u]; n; n = n->next) {
            if (--inDegree[n->vertex] == 0)
                queue[rear++] = n->vertex;
        }
    }
    printf("\\n");
    if (count != g->V) printf("CYCLE DETECTED! Not a DAG.\\n");
}
\`\`\`

### Minimum Spanning Tree — Prim's Algorithm

\`\`\`c
// MST: minimum weight tree that connects all vertices
// Use case: cheapest way to connect all cities with roads

void primMST(int graph[][MAXV], int V) {
    int parent[MAXV];   // MST parent
    int key[MAXV];      // minimum weight edge for each vertex
    int inMST[MAXV];    // is vertex in MST?

    for (int i = 0; i < V; i++) {
        key[i] = INF; inMST[i] = 0;
    }
    key[0] = 0; parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        // Find min key vertex not in MST
        int u = -1;
        for (int v = 0; v < V; v++)
            if (!inMST[v] && (u == -1 || key[v] < key[u]))
                u = v;

        inMST[u] = 1;

        // Update adjacent vertices
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v]    = graph[u][v];
            }
        }
    }

    // Print MST
    int totalCost = 0;
    printf("MST edges:\\n");
    for (int i = 1; i < V; i++) {
        printf("  %d - %d (weight: %d)\\n", parent[i], i, graph[parent[i]][i]);
        totalCost += graph[parent[i]][i];
    }
    printf("Total MST cost: %d\\n", totalCost);
}
\`\`\`

### Strongly Connected Components (Kosaraju's)

\`\`\`c
// SCC: maximal set where every node reachable from every other
// Kosaraju's: 2-pass DFS

// Pass 1: DFS on original graph, push finish order to stack
// Pass 2: DFS on TRANSPOSE graph in reverse finish order
// Each DFS in pass 2 = one SCC

void dfsFinish(Graph *g, int v, int *finish, int *finTop) {
    visited[v] = 1;
    for (Node *n = g->head[v]; n; n = n->next)
        if (!visited[n->vertex])
            dfsFinish(g, n->vertex, finish, finTop);
    finish[++(*finTop)] = v;
}

Graph* transposeGraph(Graph *g) {
    Graph *t = createGraph(g->V, 1);  // directed
    for (int v = 0; v < g->V; v++)
        for (Node *n = g->head[v]; n; n = n->next)
            addEdge(t, n->vertex, v, 1);  // reverse edge
    return t;
}

int kosarajuSCC(Graph *g) {
    int finish[MAXV], finTop = -1;
    memset(visited, 0, sizeof(visited));
    // Pass 1
    for (int v = 0; v < g->V; v++)
        if (!visited[v]) dfsFinish(g, v, finish, &finTop);

    // Pass 2 on transpose
    Graph *tr = transposeGraph(g);
    memset(visited, 0, sizeof(visited));
    int sccCount = 0;
    while (finTop >= 0) {
        int v = finish[finTop--];
        if (!visited[v]) {
            printf("SCC %d: ", ++sccCount);
            // DFS on transpose
            // (simplified — print component)
            dfsFinish(tr, v, finish, &finTop);  // reuse for printing
            printf("\\n");
        }
    }
    freeGraph(tr);
    return sccCount;
}
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXV 10

typedef struct Node{int v,w;struct Node*n;}Node;
typedef struct{Node*h[MAXV];int V,dir;}Graph;
Graph*newG(int V,int d){Graph*g=calloc(1,sizeof(Graph));g->V=V;g->dir=d;return g;}
void ae(Graph*g,int u,int v,int w){Node*n=malloc(sizeof*n);n->v=v;n->w=w;n->n=g->h[u];g->h[u]=n;if(!g->dir){Node*m=malloc(sizeof*m);m->v=u;m->w=w;m->n=g->h[v];g->h[v]=m;}}
int vis[MAXV],stk[MAXV],top=-1;

void tdfs(Graph*g,int v){
    vis[v]=1;
    for(Node*n=g->h[v];n;n=n->n) if(!vis[n->v]) tdfs(g,n->v);
    stk[++top]=v;
}
void topoSort(Graph*g){
    memset(vis,0,sizeof(vis));top=-1;
    for(int v=0;v<g->V;v++) if(!vis[v]) tdfs(g,v);
    printf("Topo order: ");
    while(top>=0) printf("%d ",stk[top--]);
    printf("\\n");
}

void kahn(Graph*g,char**names){
    int ind[MAXV]={0},q[MAXV],f=0,r=0,cnt=0;
    for(int v=0;v<g->V;v++) for(Node*n=g->h[v];n;n=n->n) ind[n->v]++;
    for(int v=0;v<g->V;v++) if(!ind[v]) q[r++]=v;
    printf("Build order: ");
    while(f<r){
        int u=q[f++]; cnt++;
        if(names) printf("%s ",names[u]); else printf("%d ",u);
        for(Node*n=g->h[u];n;n=n->n) if(!--ind[n->v]) q[r++]=n->v;
    }
    if(cnt!=g->V) printf("\\n⚠️  CYCLE DETECTED!");
    printf("\\n");
}

// Prim's MST
#define INF 99999
void prim(int g[][MAXV],int V,char**names){
    int par[MAXV],key[MAXV],inM[MAXV];
    for(int i=0;i<V;i++){key[i]=INF;inM[i]=0;}
    key[0]=0;par[0]=-1;
    for(int c=0;c<V-1;c++){
        int u=-1;
        for(int v=0;v<V;v++) if(!inM[v]&&(u==-1||key[v]<key[u]))u=v;
        inM[u]=1;
        for(int v=0;v<V;v++) if(g[u][v]&&!inM[v]&&g[u][v]<key[v]){par[v]=u;key[v]=g[u][v];}
    }
    int cost=0;
    printf("MST edges:\\n");
    for(int i=1;i<V;i++){
        printf("  %s — %s (cost=%d)\\n",names?names[par[i]]:"?",names?names[i]:"?",g[par[i]][i]);
        cost+=g[par[i]][i];
    }
    printf("Total MST cost: %d\\n",cost);
}

int main(){
    // ── Course Prerequisite System ──
    // 0=Math, 1=Physics, 2=CS101, 3=Algorithms, 4=OS, 5=Networks
    char *courses[]={"Math","Physics","CS101","Algorithms","OS","Networks"};
    Graph *prereq=newG(6,1);  // directed
    ae(prereq,0,2,1);  // Math → CS101
    ae(prereq,0,1,1);  // Math → Physics
    ae(prereq,1,2,1);  // Physics → CS101
    ae(prereq,2,3,1);  // CS101 → Algorithms
    ae(prereq,2,4,1);  // CS101 → OS
    ae(prereq,3,5,1);  // Algorithms → Networks
    ae(prereq,4,5,1);  // OS → Networks

    printf("=== Course Prerequisite Order ===\\n");
    printf("Dependencies: Math→CS101, Physics→CS101, CS101→{Algorithms,OS}, {Alg,OS}→Networks\\n");
    kahn(prereq,courses);

    // ── Build System ──
    printf("\\n=== Build System (Task Dependencies) ===\\n");
    char *tasks[]={"main.c","utils.c","lib.a","server.o","client.o","app"};
    Graph *build=newG(6,1);
    ae(build,0,3,1); ae(build,1,3,1); ae(build,1,4,1);
    ae(build,2,4,1); ae(build,3,5,1); ae(build,4,5,1);
    kahn(build,tasks);

    // ── Cycle detection ──
    printf("\\n=== Cycle Detection ===\\n");
    Graph *cyclic=newG(4,1);
    ae(cyclic,0,1,1);ae(cyclic,1,2,1);ae(cyclic,2,3,1);ae(cyclic,3,1,1); // 1→2→3→1
    kahn(cyclic,NULL);

    // ── MST: Minimum network infrastructure cost ──
    printf("\\n=== Minimum Network Cost (Prim's MST) ===\\n");
    char *servers[]={"Server-A","Server-B","Server-C","Server-D","Server-E"};
    int net[5][MAXV]={
        {0,4,0,0,8},
        {4,0,8,0,11},
        {0,8,0,7,0},
        {0,0,7,0,9},
        {8,11,0,9,0},
    };
    prim(net,5,servers);

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MV 8
typedef struct N{int v;struct N*n;}N;
typedef struct{N*h[MV];int V,d;}G;
G*newG(int V,int d){G*g=calloc(1,sizeof(G));g->V=V;g->d=d;return g;}
void ae(G*g,int u,int v){N*n=malloc(sizeof*n);n->v=v;n->n=g->h[u];g->h[u]=n;}

void kahn(G*g){
    int ind[MV]={0},q[MV],f=0,r=0,cnt=0;
    for(int v=0;v<g->V;v++) for(N*n=g->h[v];n;n=n->n) ind[n->v]++;
    for(int v=0;v<g->V;v++) if(!ind[v]) q[r++]=v;
    while(f<r){int u=q[f++];printf("%d ",u);cnt++;for(N*n=g->h[u];n;n=n->n)if(!--ind[n->v])q[r++]=n->v;}
    if(cnt!=g->V) printf("\\nCYCLE!");
}

int main(){
    G*g=newG(6,1);
    ae(g,5,2);ae(g,5,0);ae(g,4,0);ae(g,4,1);ae(g,2,3);ae(g,3,1);
    printf("Topological sort: "); kahn(g); printf("\\n");
    return 0;
}`,

      task: {
        description: "Topological sort practice: (1) 'Recipe Manager' — ingredients aur steps ka dependency graph banao, topological sort se correct preparation order nikalo. (2) 'Kruskal's MST' implement karo — Union-Find (Disjoint Set Union) use karo edges greedily add karne ke liye. (3) 'Critical Path' in project management — longest path in DAG find karo (project completion time). (4) 'Course Schedule II' — k courses hain, prerequisites given, kya possible hai sab complete karna? Order return karo.",
        description_en: "Topological sort practice: (1) 'Recipe Manager' — build a dependency graph of ingredients and steps, extract the correct preparation order using topological sort. (2) Implement 'Kruskal's MST' — use Union-Find (Disjoint Set Union) to greedily add edges. (3) 'Critical Path' in project management — find the longest path in a DAG (project completion time). (4) 'Course Schedule II' — given k courses and prerequisites, is it possible to complete all? Return the order.",
        hint: "Kruskal: sort edges by weight, for each edge check if union(u,v) creates cycle (find(u)==find(v)), if not add to MST. DSU: parent[i]=i initially, find with path compression, union by rank. Critical path: longest path = topological sort + DP relaxation.",
        hint_en: "Kruskal: sort edges by weight; for each edge check if union(u,v) creates a cycle (find(u)==find(v)); if not, add to MST. DSU: parent[i]=i initially, find with path compression, union by rank. Critical path: longest path = topological sort + DP relaxation.",
      },
      quiz: [
        {
          q: 'Topological sort sirf DAG pe kyun kaam karta hai?',
          options: [
            'Implementation limitation',
            'Cyclic graph mein: A→B→C→A. A pehle hona chahiye (A→B ke liye), lekin C ke baad bhi hona chahiye (C→A ke liye) — impossible! DAG guarantee karta hai consistent ordering exists.',
            'Undirected graphs pe bhi kaam karta hai',
            'Weighted graphs pe nahi kaam karta',
          ],
          correct: 1,
          explanation: 'Topological order: u, v se pehle jab u→v edge ho. Cycle: A→B→A. A should come before B (A→B) AND B should come before A (B→A) — contradiction. Kahn\'s algorithm detects cycle: if after processing, count < V nodes, cycle exists (some nodes never got in-degree 0). DFS approach: back edge (gray→gray) = cycle.',
          q_en: 'Why does topological sort only work on a DAG?',
          options_en: [
            'An implementation limitation',
            'In a cyclic graph: A→B→C→A. A must come before B (A→B), but also after C (C→A) — impossible! A DAG guarantees a consistent ordering exists.',
            'It also works on undirected graphs',
            'It does not work on weighted graphs',
          ],
          explanation_en: 'Topological order: u comes before v when there is an edge u→v. Cycle: A→B→A. A should come before B (A→B) AND B should come before A (B→A) — contradiction! Kahn\'s algorithm detects the cycle: if after processing, count < V nodes, a cycle exists (some nodes never reached in-degree 0). DFS approach: a back edge (gray→gray) = cycle.',
        },
        {
          q: "Prim's aur Kruskal's MST algorithms mein kya main difference hai?",
          options: [
            'Same algorithm hai',
            "Prim's: ek vertex se grow karo MST, nearest vertex add karo (greedy, like Dijkstra). Kruskal's: sab edges sort karo by weight, cycle na bane toh add karo (Union-Find). Both O(E logV) with heap/sort.",
            "Kruskal's sirf undirected ke liye",
            "Prim's dense, Kruskal's sparse graphs ke liye",
          ],
          correct: 1,
          explanation: "Both find MST (same result). Prim's: grows from one vertex, uses priority queue. Better for dense graphs (adjacency matrix). Kruskal's: considers global minimum edge, uses Union-Find DSU. Better for sparse graphs (edge list). Kruskal's easy to implement with sorted edges. Both O(E logV). Real use: Prim's in network design, Kruskal's in clustering.",
          q_en: "What is the main difference between Prim's and Kruskal's MST algorithms?",
          options_en: [
            'They are the same algorithm',
            "Prim's: grow the MST from one vertex, add the nearest vertex (greedy, like Dijkstra). Kruskal's: sort all edges by weight, add if it doesn't form a cycle (Union-Find). Both O(E logV) with heap/sort.",
            "Kruskal's is only for undirected graphs",
            "Prim's for dense, Kruskal's for sparse",
          ],
          explanation_en: "Both find the MST (same result). Prim's: grows from one vertex, uses a priority queue. Better for dense graphs (adjacency matrix). Kruskal's: considers the global minimum edge, uses Union-Find DSU. Better for sparse graphs (edge list). Kruskal's is easy to implement with sorted edges. Both O(E logV). Real use: Prim's in network design, Kruskal's in clustering.",
        },
        {
          q: "Kahn's algorithm cycle kyun detect kar leta hai topological sort mein?",
          options: [
            'Separate cycle check hai',
            'Cyclic node ka in-degree kabhi 0 nahi hoga (cycle mein ek node hamesha ek predecessor hai). Queue mein add nahi hoga. Final count < V → cycle proved.',
            'DFS use karta hai internally',
            'Adjacency matrix use karta hai',
          ],
          correct: 1,
          explanation: 'Kahn\'s: queue starts with in-degree=0 nodes. As we process, we reduce in-degrees. In a cycle A→B→C→A: A needs B to reduce its in-degree, B needs C, C needs A — deadlock! None of them ever reach in-degree 0 → never enqueued → final count < V. This is an elegant cycle detection embedded in topological sort!',
          q_en: "Why does Kahn's algorithm detect cycles in topological sorting?",
          options_en: [
            'There is a separate cycle check',
            "A node in a cycle will never have in-degree 0 (it always has a predecessor in the cycle). It never gets added to the queue. Final count < V → cycle proved.",
            'It uses DFS internally',
            'It uses an adjacency matrix',
          ],
          explanation_en: "Kahn's: the queue starts with in-degree=0 nodes. As we process nodes, we reduce in-degrees. In a cycle A→B→C→A: A needs B to reduce its in-degree, B needs C, C needs A — deadlock! None of them ever reach in-degree 0 → never enqueued → final count < V. This is an elegant cycle detection embedded in topological sort!",
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w11-s4',
      title: 'Week 11 Project — Complete Graph Library',
      title_en: 'Week 11 Project — Complete Graph Library',
      emoji: '🌐',
      content: `## Week 11 Project — Real-World Graph Applications!

### Project: StudyEarn Social + Route System

\`\`\`c
// ── Unified Graph System ──
// 1. Social Network Analysis
//    - Friend recommendations (BFS 2-hop)
//    - Influencer detection (degree centrality)
//    - Community detection (connected components)
//
// 2. Route Finder (Dijkstra)
//    - Shortest distance path
//    - Fastest time path (different weights)
//    - Alternative routes
//
// 3. Task Scheduler (Topological Sort)
//    - Build system simulation
//    - Course planner
//    - Project timeline
//
// 4. Network Reliability (MST)
//    - Minimum cost to connect all nodes
//    - Critical edges (bridge detection)
\`\`\`

### Graph Complete API

\`\`\`c
// graph.h — complete graph library interface
typedef struct Graph Graph;

// Creation
Graph* graph_create(int vertices, int directed, int weighted);
void   graph_destroy(Graph *g);
void   graph_add_edge(Graph *g, int u, int v, int weight);
void   graph_remove_edge(Graph *g, int u, int v);

// Traversal
void graph_dfs(Graph *g, int start, void (*visit)(int));
void graph_bfs(Graph *g, int start, void (*visit)(int));

// Algorithms
int*  graph_dijkstra(Graph *g, int src);     // shortest distances
int*  graph_topo_sort(Graph *g);              // topological order (NULL if cycle)
int** graph_mst_prim(Graph *g);              // MST edge list
int   graph_components(Graph *g);            // count of connected components
int   graph_has_cycle(Graph *g);             // 0 or 1
int   graph_is_bipartite(Graph *g);          // 0 or 1

// Analysis
int   graph_degree(Graph *g, int v);         // degree of vertex
int   graph_diameter(Graph *g);              // longest shortest path
int   graph_is_connected(Graph *g);
\`\`\`

### Month 3 Near-Completion!

\`\`\`
Month 3 (Weeks 9-12):
  ✅ Week 9:  Binary Trees, BST, AVL
  ✅ Week 10: Sorting Algorithms Master Class
  ✅ Week 11: Graphs — DFS, BFS, Dijkstra, MST, Topo Sort
  📚 Week 12: Final Capstone + CERTIFICATE! 🎓

Total C Course:
  ✅ Month 1 (W1-4):  C Foundation — syntax, functions, pointers, memory
  ✅ Month 2 (W5-8):  Data Structures — struct, files, macros, DS
  ✅ Month 3 (W9-11): Advanced DS — trees, sorting, graphs
  📚 Week 12:         Final Project + Certificate
\`\`\``,

      content_en: `## Week 11 Project — Real-World Graph Applications!

### Project: StudyEarn Social + Route System

\`\`\`c
// ── Unified Graph System ──
// 1. Social Network Analysis
//    - Friend recommendations (BFS 2-hop)
//    - Influencer detection (degree centrality)
//    - Community detection (connected components)
//
// 2. Route Finder (Dijkstra)
//    - Shortest distance path
//    - Fastest time path (different weights)
//    - Alternative routes
//
// 3. Task Scheduler (Topological Sort)
//    - Build system simulation
//    - Course planner
//    - Project timeline
//
// 4. Network Reliability (MST)
//    - Minimum cost to connect all nodes
//    - Critical edges (bridge detection)
\`\`\`

### Graph Complete API

\`\`\`c
// graph.h — complete graph library interface
typedef struct Graph Graph;

// Creation
Graph* graph_create(int vertices, int directed, int weighted);
void   graph_destroy(Graph *g);
void   graph_add_edge(Graph *g, int u, int v, int weight);
void   graph_remove_edge(Graph *g, int u, int v);

// Traversal
void graph_dfs(Graph *g, int start, void (*visit)(int));
void graph_bfs(Graph *g, int start, void (*visit)(int));

// Algorithms
int*  graph_dijkstra(Graph *g, int src);     // shortest distances
int*  graph_topo_sort(Graph *g);              // topological order (NULL if cycle)
int** graph_mst_prim(Graph *g);              // MST edge list
int   graph_components(Graph *g);            // count of connected components
int   graph_has_cycle(Graph *g);             // 0 or 1
int   graph_is_bipartite(Graph *g);          // 0 or 1

// Analysis
int   graph_degree(Graph *g, int v);         // degree of vertex
int   graph_diameter(Graph *g);              // longest shortest path
int   graph_is_connected(Graph *g);
\`\`\`

### Month 3 Near-Completion!

\`\`\`
Month 3 (Weeks 9-12):
  ✅ Week 9:  Binary Trees, BST, AVL
  ✅ Week 10: Sorting Algorithms Master Class
  ✅ Week 11: Graphs — DFS, BFS, Dijkstra, MST, Topo Sort
  📚 Week 12: Final Capstone + CERTIFICATE! 🎓

Total C Course:
  ✅ Month 1 (W1-4):  C Foundation — syntax, functions, pointers, memory
  ✅ Month 2 (W5-8):  Data Structures — struct, files, macros, DS
  ✅ Month 3 (W9-11): Advanced DS — trees, sorting, graphs
  📚 Week 12:         Final Project + Certificate
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXV 10
#define INF  99999

typedef struct Node{int v,w;struct Node*n;}Node;
typedef struct{Node*h[MAXV];int V,dir;}Graph;

Graph*newG(int V,int d){Graph*g=calloc(1,sizeof(Graph));g->V=V;g->dir=d;return g;}
void ae(Graph*g,int u,int v,int w){Node*n=malloc(sizeof*n);n->v=v;n->w=w;n->n=g->h[u];g->h[u]=n;if(!g->dir){Node*m=malloc(sizeof*m);m->v=u;m->w=w;m->n=g->h[v];g->h[v]=m;}}

int vis[MAXV];

// ── BFS friend suggestions ──
void friendSuggest(Graph*g,int user,char**names){
    int dist[MAXV],q[MAXV],f=0,r=0;
    memset(dist,-1,sizeof(dist));
    dist[user]=0; q[r++]=user;
    while(f<r){
        int v=q[f++];
        for(Node*n=g->h[v];n;n=n->n)
            if(dist[n->v]==-1){dist[n->v]=dist[v]+1;q[r++]=n->v;}
    }
    printf("Friend suggestions for %s:\\n",names[user]);
    for(int i=0;i<g->V;i++){
        if(i!=user&&dist[i]==2) printf("  → %s (friend-of-friend)\\n",names[i]);
    }
    if(dist[user+1]==-1) printf("  (no suggestions)\\n");
}

// ── Dijkstra ──
void dijkstra(Graph*g,int src,int*dist,int*par){
    int vis2[MAXV]={0};
    for(int i=0;i<g->V;i++){dist[i]=INF;par[i]=-1;}
    dist[src]=0;
    for(int c=0;c<g->V-1;c++){
        int u=-1;
        for(int i=0;i<g->V;i++) if(!vis2[i]&&(u==-1||dist[i]<dist[u]))u=i;
        if(u==-1||dist[u]==INF)break; vis2[u]=1;
        for(Node*n=g->h[u];n;n=n->n)
            if(!vis2[n->v]&&dist[u]+n->w<dist[n->v]){dist[n->v]=dist[u]+n->w;par[n->v]=u;}
    }
}

// ── Topological sort (Kahn) ──
int topoSort(Graph*g,int*order){
    int ind[MAXV]={0},q[MAXV],f=0,r=0,cnt=0;
    for(int v=0;v<g->V;v++) for(Node*n=g->h[v];n;n=n->n) ind[n->v]++;
    for(int v=0;v<g->V;v++) if(!ind[v]) q[r++]=v;
    while(f<r){
        int u=q[f++]; order[cnt++]=u;
        for(Node*n=g->h[u];n;n=n->n) if(!--ind[n->v]) q[r++]=n->v;
    }
    return cnt==g->V;  // 1=success, 0=cycle
}

int main(){
    // ── Social Network ──
    printf("=== Social Network Analysis ===\\n");
    char*users[]={"Rahul","Priya","Aryan","Sneha","Vikram","Anita","Raj"};
    Graph*social=newG(7,0);
    ae(social,0,1,1);ae(social,0,2,1);ae(social,1,3,1);
    ae(social,2,4,1);ae(social,3,5,1);ae(social,4,6,1);
    ae(social,1,4,1);
    friendSuggest(social,0,users);
    friendSuggest(social,1,users);

    // ── Route Finder ──
    printf("\\n=== City Route Finder ===\\n");
    char*cities[]={"Mumbai","Pune","Nashik","Aurangabad","Nagpur"};
    Graph*routes=newG(5,0);
    ae(routes,0,1,150); ae(routes,0,2,190);
    ae(routes,1,2,210); ae(routes,1,3,230);
    ae(routes,2,3,105); ae(routes,3,4,250);
    ae(routes,0,4,840);
    int dist[MAXV],par[MAXV];
    dijkstra(routes,0,dist,par);
    printf("Shortest routes from %s:\\n",cities[0]);
    for(int i=1;i<5;i++){
        int p[MAXV],pl=0,c=i;
        while(c!=-1){p[pl++]=c;c=par[c];}
        printf("  To %-15s: %dkm via ",cities[i],dist[i]);
        for(int j=pl-1;j>=0;j--) printf("%s%s",cities[p[j]],j>0?"→":"\\n");
    }

    // ── Task Scheduler ──
    printf("\\n=== Project Task Scheduler ===\\n");
    char*tasks[]={"Design","Backend","Frontend","DB","Testing","Deploy"};
    Graph*proj=newG(6,1);
    ae(proj,0,1,1);ae(proj,0,2,1);ae(proj,1,3,1);
    ae(proj,2,3,1);ae(proj,1,4,1);ae(proj,2,4,1);
    ae(proj,3,5,1);ae(proj,4,5,1);
    int order[MAXV];
    if(topoSort(proj,order)){
        printf("Execution order: ");
        for(int i=0;i<6;i++) printf("%s%s",tasks[order[i]],i<5?"→":"\\n");
    }

    return 0;
}`,

      codeExample_en: `/* See above — unified graph system demo */`,

      task: {
        description: "Week 11 Final Project — Complete Graph System: (1) 'Metro Route Planner' — metro stations graph mein, BFS se minimum stops path, Dijkstra se minimum time path (different line speeds), display transfers. (2) 'Dependency Resolver' (like npm/pip) — package A depends on B, C; B depends on D — topological sort se install order nikalo, circular dependency detect karo. (3) 'Social Network Stats' — degree centrality, betweenness centrality (approximate), clustering coefficient. (4) Implement Union-Find (DSU) with path compression and union by rank.",
        description_en: "Week 11 Final Project — Complete Graph System: (1) 'Metro Route Planner' — metro stations in a graph, BFS for minimum stops, Dijkstra for minimum time (different line speeds), show transfers. (2) 'Dependency Resolver' (like npm/pip) — package A depends on B, C; B depends on D — topological sort for install order, detect circular dependencies. (3) 'Social Network Stats' — degree centrality, approximate betweenness centrality, clustering coefficient. (4) Implement Union-Find (DSU) with path compression and union by rank.",
        hint: "DSU: find(x): if parent[x]!=x return parent[x]=find(parent[x]). union(x,y): if rank[x]<rank[y] swap; parent[y]=x; if rank equal rank[x]++. Betweenness: run BFS from each node, count how many shortest paths pass through each node.",
        hint_en: 'DSU: find(x): if parent[x]!=x return parent[x]=find(parent[x]). union(x,y): if rank[x]<rank[y] swap; parent[y]=x; if ranks equal, rank[x]++. Betweenness: run BFS from each node, count how many shortest paths pass through each node.',
      },
      quiz: [
        {
          q: 'MST (Minimum Spanning Tree) ka real-world use kya hai?',
          options: [
            'Sorting ke liye',
            'Minimum cost network connection — telecom cables, power grid, water pipes. V cities ko minimum total cost mein connect karo. MST = optimal solution. E.g.: minimum fiber cable to connect all offices.',
            'Shortest path ke liye',
            'Cycle detection ke liye',
          ],
          correct: 1,
          explanation: 'MST connects all V nodes with V-1 edges of minimum total weight. Real: (1) Cable TV minimum network. (2) Electrical grid. (3) Water distribution. (4) Clustering (Kruskal\'s gives dendogram). (5) Maze generation. Note: MST ≠ shortest path! MST minimizes total edge weight. Shortest path minimizes specific source-destination distance.',
          q_en: 'What is the real-world use of an MST (Minimum Spanning Tree)?',
          options_en: [
            'For sorting',
            'Minimum-cost network connection — telecom cables, power grids, water pipes. Connect V cities with minimum total cost. MST = optimal solution. E.g., minimum fibre cable to connect all offices.',
            'For shortest paths',
            'For cycle detection',
          ],
          explanation_en: 'MST connects all V nodes with V-1 edges of minimum total weight. Real uses: (1) Cable TV minimum network. (2) Electrical grid. (3) Water distribution. (4) Clustering (Kruskal\'s gives a dendrogram). (5) Maze generation. Note: MST ≠ shortest path! MST minimises total edge weight. Shortest path minimises a specific source-destination distance.',
        },
        {
          q: 'Graph theory ka computer science mein sabse important application kya hai?',
          options: [
            'Sirf social networks',
            'Ubiquitous: Internet routing (BGP), web search (PageRank uses graph), compiler dependency, OS scheduling (resource allocation graph), database query optimization (join order = graph problem), GPS navigation.',
            'Sirf gaming',
            'Sirf database',
          ],
          correct: 1,
          explanation: 'Graphs model any relationship: (1) Internet = graph of routers (routing algorithms). (2) Web = graph of pages (PageRank, web crawling). (3) Social = users/friendships. (4) Program = control flow graph (compiler optimization). (5) Database = entity-relationship. (6) AI = knowledge graphs, neural networks (DAG). (7) CPU = instruction dependency (instruction scheduling). Almost every CS problem has a graph formulation!',
          q_en: 'What is the most important application of graph theory in computer science?',
          options_en: [
            'Only social networks',
            'Ubiquitous: Internet routing (BGP), web search (PageRank uses a graph), compiler dependencies, OS scheduling (resource allocation graph), database query optimisation (join order = graph problem), GPS navigation.',
            'Only gaming',
            'Only databases',
          ],
          explanation_en: 'Graphs model any relationship: (1) Internet = graph of routers (routing algorithms). (2) Web = graph of pages (PageRank, web crawling). (3) Social = users/friendships. (4) Program = control flow graph (compiler optimisation). (5) Database = entity-relationship. (6) AI = knowledge graphs, neural networks (DAG). (7) CPU = instruction dependency (instruction scheduling). Almost every CS problem has a graph formulation!',
        },
        {
          q: 'Union-Find (Disjoint Set Union) kyun important hai graph algorithms mein?',
          options: [
            'Sirf debugging ke liye',
            "O(α(n)) ≈ O(1) cycle detection — Kruskal's MST mein critical. Do nodes ka same component check karna O(n) DFS ki jagah O(1) with path compression. α = inverse Ackermann function — practically constant.",
            'Memory save karta hai',
            'Topological sort ke liye',
          ],
          correct: 1,
          explanation: 'DSU operations: find(x) = root of x\'s component, union(x,y) = merge components. Path compression + union by rank = O(α(n)) per operation where α = inverse Ackermann — slower than O(1) but faster than any realistic input. Kruskal\'s without DSU: O(V) cycle check per edge = O(EV). With DSU: O(E α(V)) ≈ O(E). Also used: network connectivity, image segmentation, percolation theory.',
          q_en: 'Why is Union-Find (Disjoint Set Union) important in graph algorithms?',
          options_en: [
            'Only for debugging',
            "O(α(n)) ≈ O(1) cycle detection — critical for Kruskal's MST. Checking if two nodes are in the same component is O(n) with DFS but O(1) with path compression. α = inverse Ackermann function — practically constant.",
            'It saves memory',
            'For topological sort',
          ],
          explanation_en: 'DSU operations: find(x) = root of x\'s component, union(x,y) = merge components. Path compression + union by rank = O(α(n)) per operation where α = inverse Ackermann — slower than O(1) but faster than any realistic input. Kruskal\'s without DSU: O(V) cycle check per edge = O(EV). With DSU: O(E α(V)) ≈ O(E). Also used in: network connectivity, image segmentation, percolation theory.',
        },
      ],
    },
  ],
};