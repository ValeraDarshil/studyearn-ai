/**
 * StudyEarn AI — C Programming Course
 * Week 6: File I/O — Disk pe Data Store Karo
 * Hinglish + English bilingual, 4 sections, Noob to Pro
 */

export const C_WEEK_6 = {
  week: 6,
  title: 'File I/O — Data ko Permanently Store Karo',
  title_en: 'File I/O — Store Data Permanently',
  description: 'fopen, fread, fwrite, fprintf, fscanf, binary files, CSV handling — program band ho tab bhi data save rahe!',
  description_en: 'fopen, fread, fwrite, fprintf, fscanf, binary files, CSV handling — keep data saved even after the program exits!',
  xpReward: 230,
  sections: [
    {
      id: 'c-w6-s1',
      title: 'File Basics — fopen, fclose, Text Files',
      title_en: 'File Basics — fopen, fclose, Text Files',
      emoji: '📂',
      content: `## File I/O — Program ke baad bhi Data Zinda Rahe!

Abhi tak: program band hua, sab data gone!
File I/O ke saath: disk pe save karo — hamesha ke liye!

### File Kya Hai?

\`\`\`
Computer Storage:
┌─────────────────────────────────────────┐
│  RAM (volatile — power off = data gone) │
│  ┌─────────────────────────────────┐    │
│  │  Your C Program runs here       │    │
│  │  Variables, arrays, pointers    │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Disk (non-volatile — permanent!)       │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  students.txt │  │  data.bin    │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
\`\`\`

### fopen — File Kholo

\`\`\`c
#include <stdio.h>

FILE *fp;  // FILE = opaque struct, file pointer

// fopen(filename, mode) → FILE* or NULL on error
fp = fopen("data.txt", "r");   // read only
fp = fopen("data.txt", "w");   // write (create/overwrite)
fp = fopen("data.txt", "a");   // append (add to end)
fp = fopen("data.txt", "r+");  // read + write (file must exist)
fp = fopen("data.txt", "w+");  // read + write (create/overwrite)
fp = fopen("data.txt", "a+");  // read + append

// Binary modes
fp = fopen("data.bin", "rb");  // read binary
fp = fopen("data.bin", "wb");  // write binary
fp = fopen("data.bin", "ab");  // append binary

// ALWAYS check for NULL!
if (fp == NULL) {
    perror("File open karne mein error");  // prints OS error message
    return 1;
}
\`\`\`

### File Modes Table

\`\`\`
Mode  | Read | Write | Create | Truncate | Position
──────────────────────────────────────────────────────
"r"   |  ✅  |  ❌   |  ❌    |    ❌    | Beginning
"w"   |  ❌  |  ✅   |  ✅    |    ✅    | Beginning
"a"   |  ❌  |  ✅   |  ✅    |    ❌    | End always
"r+"  |  ✅  |  ✅   |  ❌    |    ❌    | Beginning
"w+"  |  ✅  |  ✅   |  ✅    |    ✅    | Beginning
"a+"  |  ✅  |  ✅   |  ✅    |    ❌    | Read:free, Write:end
\`\`\`

### Text File Write — fprintf aur fputs

\`\`\`c
FILE *fp = fopen("students.txt", "w");
if (!fp) { perror("fopen"); return 1; }

// fprintf — printf jaisa, lekin file mein
fprintf(fp, "Roll,Name,Marks\\n");
fprintf(fp, "%d,%s,%.1f\\n", 101, "Rahul", 85.5f);
fprintf(fp, "%d,%s,%.1f\\n", 102, "Priya", 92.0f);

// fputs — string write
fputs("Hello, File!\\n", fp);

// fputc — single char write
fputc('A', fp);
fputc('\\n', fp);

fclose(fp);  // ALWAYS close! Flush buffer to disk
fp = NULL;   // good practice
\`\`\`

### Text File Read — fscanf aur fgets

\`\`\`c
FILE *fp = fopen("students.txt", "r");
if (!fp) { perror("fopen"); return 1; }

// Method 1: fscanf — formatted read
int roll; char name[50]; float marks;
while (fscanf(fp, "%d,%49[^,],%f\\n", &roll, name, &marks) == 3) {
    printf("Roll: %d, Name: %s, Marks: %.1f\\n", roll, name, marks);
}

// Method 2: fgets — line by line (safer!)
char line[256];
while (fgets(line, sizeof(line), fp) != NULL) {
    line[strcspn(line, "\\n")] = '\\0';  // remove newline
    printf("Line: %s\\n", line);
}

// Method 3: fgetc — char by char
int c;
while ((c = fgetc(fp)) != EOF) {
    putchar(c);  // print to stdout
}

fclose(fp);
\`\`\`

### EOF aur Error Checking

\`\`\`c
FILE *fp = fopen("data.txt", "r");

// Check EOF
while (!feof(fp)) {        // feof = end of file reached?
    char ch = fgetc(fp);
    if (ferror(fp)) {      // ferror = read/write error?
        printf("Error reading file!\\n");
        clearerr(fp);      // clear error flags
        break;
    }
    if (ch != EOF) putchar(ch);
}

// Better pattern — check return value
char buf[256];
while (fgets(buf, sizeof(buf), fp)) {  // NULL = EOF or error
    // process buf
}
if (ferror(fp)) { printf("Read error!\\n"); }

fclose(fp);

// ftell — current position
long pos = ftell(fp);    // returns byte offset from start

// fseek — move to position
fseek(fp, 0, SEEK_SET);  // go to beginning
fseek(fp, 0, SEEK_END);  // go to end
fseek(fp, -10, SEEK_CUR); // 10 bytes back from current

// File size
fseek(fp, 0, SEEK_END);
long size = ftell(fp);
fseek(fp, 0, SEEK_SET);  // rewind

// rewind — go to beginning
rewind(fp);  // same as fseek(fp, 0, SEEK_SET)
\`\`\`

### Standard Streams

\`\`\`c
// 3 pre-opened FILE* streams
FILE *stdin  // keyboard (read)
FILE *stdout // screen   (write)
FILE *stderr // screen   (error output — unbuffered)

// printf = fprintf(stdout, ...)
// scanf  = fscanf(stdin, ...)
printf("Hello\\n");           // stdout
fprintf(stderr, "Error!\\n"); // stderr — not redirected with >

// Redirect file to/from stdin/stdout
// program < input.txt > output.txt
\`\`\``,

      content_en: `## File I/O — Data Persists After Program Exits!

### fopen Modes

\`\`\`c
FILE *fp;
fp = fopen("file.txt", "r");  // read
fp = fopen("file.txt", "w");  // write (create/overwrite)
fp = fopen("file.txt", "a");  // append
fp = fopen("file.bin", "rb"); // binary read
if (!fp) { perror("fopen"); return 1; }
\`\`\`

### Write

\`\`\`c
FILE *fp = fopen("out.txt","w");
fprintf(fp, "%d,%s,%.1f\\n", 101, "Rahul", 85.5f);
fputs("line\\n", fp);
fputc('A', fp);
fclose(fp);  // always!
\`\`\`

### Read

\`\`\`c
FILE *fp = fopen("out.txt","r");
char line[256];
while(fgets(line, sizeof(line), fp)) {
    line[strcspn(line,"\\n")] = '\\0';
    printf("%s\\n", line);
}
fclose(fp);
\`\`\`

### Seek and Tell

\`\`\`c
fseek(fp, 0, SEEK_END);  long size = ftell(fp);  // file size
fseek(fp, 0, SEEK_SET);  // go to beginning
rewind(fp);               // same as above
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define LOG_FILE  "app.log"
#define DATA_FILE "contacts.csv"

// ── Logger — writes to log file with timestamp ──
void logMsg(const char *level, const char *msg) {
    FILE *fp = fopen(LOG_FILE, "a");
    if (!fp) return;

    time_t t = time(NULL);
    struct tm *tm = localtime(&t);
    fprintf(fp, "[%04d-%02d-%02d %02d:%02d:%02d] [%-5s] %s\\n",
            tm->tm_year+1900, tm->tm_mon+1, tm->tm_mday,
            tm->tm_hour,      tm->tm_min,   tm->tm_sec,
            level, msg);
    fclose(fp);
}

#define LOG_INFO(m)  logMsg("INFO",  m)
#define LOG_ERROR(m) logMsg("ERROR", m)
#define LOG_WARN(m)  logMsg("WARN",  m)

// ── Contact structure ──
typedef struct {
    int  id;
    char name[50];
    char phone[15];
    char email[60];
    char city[30];
} Contact;

// ── Write contacts to CSV ──
int saveContacts(Contact *arr, int n, const char *filename) {
    FILE *fp = fopen(filename, "w");
    if (!fp) { LOG_ERROR("Cannot open file for writing"); return 0; }

    fprintf(fp, "id,name,phone,email,city\\n");  // CSV header
    for (int i = 0; i < n; i++) {
        fprintf(fp, "%d,\"%s\",\"%s\",\"%s\",\"%s\"\\n",
                arr[i].id, arr[i].name, arr[i].phone,
                arr[i].email, arr[i].city);
    }
    fclose(fp);

    char logbuf[100];
    snprintf(logbuf, sizeof(logbuf), "Saved %d contacts to %s", n, filename);
    LOG_INFO(logbuf);
    return 1;
}

// ── Read contacts from CSV ──
int loadContacts(Contact *arr, int maxN, const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (!fp) { LOG_WARN("File not found — starting fresh"); return 0; }

    char line[256];
    fgets(line, sizeof(line), fp);  // skip header

    int count = 0;
    while (count < maxN && fgets(line, sizeof(line), fp)) {
        line[strcspn(line, "\\n")] = '\\0';
        Contact *c = &arr[count];
        sscanf(line, "%d,\"%49[^\"]\",\"%14[^\"]\",\"%59[^\"]\",\"%29[^\"]\"",
               &c->id, c->name, c->phone, c->email, c->city);
        count++;
    }
    fclose(fp);

    char logbuf[100];
    snprintf(logbuf, sizeof(logbuf), "Loaded %d contacts from %s", count, filename);
    LOG_INFO(logbuf);
    return count;
}

// ── File statistics ──
void fileStats(const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (!fp) { printf("File not found: %s\\n", filename); return; }

    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    rewind(fp);

    int lines = 0, words = 0, chars = 0;
    int inWord = 0;
    int c;
    while ((c = fgetc(fp)) != EOF) {
        chars++;
        if (c == '\\n') lines++;
        if (c == ' ' || c == '\\n' || c == '\\t') inWord = 0;
        else if (!inWord) { words++; inWord = 1; }
    }
    fclose(fp);

    printf("File: %s\\n", filename);
    printf("  Size:  %ld bytes\\n", size);
    printf("  Lines: %d\\n", lines);
    printf("  Words: %d\\n", words);
    printf("  Chars: %d\\n", chars);
}

int main() {
    LOG_INFO("Application started");

    // Create sample contacts
    Contact contacts[] = {
        {1, "Rahul Sharma",  "9876543210", "rahul@email.com",  "Mumbai"},
        {2, "Priya Patel",   "9876543211", "priya@email.com",  "Surat"},
        {3, "Aryan Singh",   "9876543212", "aryan@email.com",  "Delhi"},
        {4, "Sneha Nair",    "9876543213", "sneha@email.com",  "Kochi"},
        {5, "Vikram Rao",    "9876543214", "vikram@email.com", "Hyderabad"},
    };
    int n = sizeof(contacts)/sizeof(contacts[0]);

    // Save to CSV
    printf("=== Saving Contacts ===\\n");
    saveContacts(contacts, n, DATA_FILE);

    // Load back
    printf("\\n=== Loading Contacts ===\\n");
    Contact loaded[50];
    int count = loadContacts(loaded, 50, DATA_FILE);
    printf("Loaded %d contacts:\\n", count);
    for (int i = 0; i < count; i++) {
        printf("  %d. %-20s %s %s\\n",
               loaded[i].id, loaded[i].name,
               loaded[i].phone, loaded[i].city);
    }

    // File stats
    printf("\\n=== File Statistics ===\\n");
    fileStats(DATA_FILE);

    // Print log
    printf("\\n=== Application Log ===\\n");
    FILE *log = fopen(LOG_FILE, "r");
    if (log) {
        char line[256];
        while (fgets(line, sizeof(line), log))
            printf("  %s", line);
        fclose(log);
    }

    LOG_INFO("Application finished");
    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef struct { int id; char name[50]; float marks; } Student;

int saveCSV(Student *arr, int n, const char *f) {
    FILE *fp=fopen(f,"w"); if(!fp) return 0;
    fprintf(fp,"id,name,marks\\n");
    for(int i=0;i<n;i++) fprintf(fp,"%d,%s,%.1f\\n",arr[i].id,arr[i].name,arr[i].marks);
    fclose(fp); return 1;
}

int loadCSV(Student *arr, int max, const char *f) {
    FILE *fp=fopen(f,"r"); if(!fp) return 0;
    char line[256]; fgets(line,256,fp); // skip header
    int c=0;
    while(c<max && fgets(line,256,fp)){
        line[strcspn(line,"\\n")]='\\0';
        sscanf(line,"%d,%49[^,],%f",&arr[c].id,arr[c].name,&arr[c].marks);
        c++;
    }
    fclose(fp); return c;
}

int main(){
    Student s[]={{1,"Alice",90.5f},{2,"Bob",75.0f},{3,"Carol",88.5f}};
    saveCSV(s,3,"data.csv");
    Student loaded[10];
    int n=loadCSV(loaded,10,"data.csv");
    for(int i=0;i<n;i++) printf("%d %s %.1f\\n",loaded[i].id,loaded[i].name,loaded[i].marks);
    return 0;
}`,

      task: {
        description: 'File basics practice: (1) "Word Count Tool" — text file lo (command line argument), words, lines, chars, sentences count karo. (2) "File Copier" — source file char by char ya block by block copy karo destination mein. (3) "Config File Parser" — "key=value" format ka config file likho aur padho (like .ini files). Example: host=localhost, port=8080, debug=true.',
        description_en: 'File basics practice: (1) "Word Count Tool" — take a text file (command-line argument), count words, lines, chars, and sentences. (2) "File Copier" — copy a source file char-by-char or block-by-block to a destination. (3) "Config File Parser" — write and read a "key=value" format config file (like .ini files). Example: host=localhost, port=8080, debug=true.',
        hint: 'Word count: fgetc loop, count spaces/newlines/punctuation. File copy: fread/fwrite with buffer (8KB chunks) is fastest. Config: fgets each line, sscanf(line,"%[^=]=%[^\\n]",key,value) to split.',
        hint_en: 'Word count: loop with fgetc, count spaces/newlines/punctuation. File copy: fread/fwrite with a buffer (8KB chunks) is fastest. Config: fgets each line, then sscanf(line,"%[^=]=%[^\\n]",key,value) to split.',
      },
      quiz: [
        {
          q: '"w" mode se file kholine ke kya consequences hote hain?',
          options: [
            'Sirf read kar sakte ho',
            'File create hoti hai agar nahi hai. Agar hai toh PURI contents delete ho jaati hain (truncate) aur naya likhna shuru hota hai. Purana data permanently lost!',
            'File ke end mein add hota hai',
            'File protected ho jaati hai',
          ],
          correct: 1,
          explanation: '"w" = write mode: (1) File nahi hai → create. (2) File hai → TRUNCATE (sab delete) then write. Dangerous! Append ke liye "a" use karo. Existing file read + write ke liye "r+" use karo. Production code mein: pehle backup lo, phir "w" mode use karo.',
          q_en: 'What happens when you open a file in "w" mode?',
          options_en: [
            'You can only read it',
            'The file is created if it does not exist. If it does exist, ALL contents are deleted (truncated) and writing starts fresh. Old data is permanently lost!',
            'Data is added to the end',
            'The file becomes protected',
          ],
          explanation_en: '"w" = write mode: (1) File does not exist → create it. (2) File exists → TRUNCATE (delete everything) then write. Dangerous! Use "a" for appending. Use "r+" to read and write an existing file. In production code: take a backup first, then use "w" mode.',
        },
        {
          q: 'fclose() kyun zaruri hai hamesha?',
          options: [
            'Zaruri nahi — OS automatically close karta hai',
            'fclose() flush karta hai buffer ko disk pe, OS resources release karta hai (file descriptor), aur data corruption prevent karta hai. Bina fclose ke: data buffer mein reh sakta hai — file incomplete!',
            'fclose() file delete karta hai',
            'Sirf write mode mein zaruri hai',
          ],
          correct: 1,
          explanation: 'C file I/O buffered hai — fprintf ka data pehle memory buffer mein jaata hai, phir OS disk pe likhta hai (efficient!). fclose(): (1) Buffer flush (force write to disk). (2) File descriptor free. (3) FILE struct memory free. Bina fclose: program crash pe buffer data lost! OS eventually close karta hai program exit pe lekin explicitly karna best practice hai.',
          q_en: 'Why must you always call fclose()?',
          options_en: [
            'Not necessary — the OS closes it automatically',
            'fclose() flushes the buffer to disk, releases OS resources (file descriptor), and prevents data corruption. Without fclose(), data may stay in the buffer — incomplete file!',
            'fclose() deletes the file',
            'Only necessary in write mode',
          ],
          explanation_en: 'C file I/O is buffered — fprintf data goes into a memory buffer first, then the OS writes to disk (efficient!). fclose(): (1) Flushes the buffer (forces write to disk). (2) Frees the file descriptor. (3) Frees FILE struct memory. Without fclose: if the program crashes, buffer data is lost! The OS eventually closes it on program exit, but calling it explicitly is best practice.',
        },
        {
          q: 'fscanf vs fgets — kaunsa better hai text file read karne ke liye aur kyun?',
          options: [
            'fscanf hamesha better hai',
            'fgets safer hai — puri line padhti hai, buffer overflow protect karta hai. fscanf format mismatch pe stuck ho sakta hai. fgets + sscanf combination best practice hai.',
            'fgetc best hai',
            'Koi difference nahi',
          ],
          correct: 1,
          explanation: 'fscanf risk: agar file format expected se alag hai, fscanf partial read karta hai ya wrong position pe reh jaata hai — infinite loop possible! fgets: puri line padhti hai (newline tak), guaranteed progress. phir sscanf se parse karo. Production pattern: fgets(buf, sizeof(buf), fp) then sscanf(buf, format, ...). fgets return NULL = EOF ya error — safe loop.',
          q_en: 'fscanf vs fgets — which is better for reading text files and why?',
          options_en: [
            'fscanf is always better',
            'fgets is safer — reads the whole line, protects against buffer overflow. fscanf can get stuck on format mismatches. The fgets + sscanf combination is best practice.',
            'fgetc is the best',
            'No difference',
          ],
          explanation_en: 'fscanf risk: if the file format differs from expected, fscanf may do a partial read or get stuck at the wrong position — infinite loop possible! fgets: reads the whole line (up to newline), guaranteed progress. Then parse with sscanf. Production pattern: fgets(buf, sizeof(buf), fp) then sscanf(buf, format, ...). fgets returning NULL = EOF or error — safe loop.',
        },
      ],
    },

    // ── SECTION 2 ──────────────────────────────────────────────────────
    {
      id: 'c-w6-s2',
      title: 'Binary Files — fread aur fwrite se Efficient Storage',
      title_en: 'Binary Files — Efficient Storage with fread and fwrite',
      emoji: '💾',
      content: `## Binary Files — Raw Memory to Disk!

Text file: human readable, bigger size, slower parse.
Binary file: exact memory copy, compact, instant read/write — perfect for structs!

### fwrite aur fread

\`\`\`c
// fwrite(ptr, size_per_element, count, file)
// fread (ptr, size_per_element, count, file)

typedef struct {
    int   id;
    char  name[50];
    float marks;
} Student;

// ── Write binary ──
Student s = {101, "Rahul", 85.5f};
FILE *fp = fopen("data.bin", "wb");  // 'b' = binary!
if (!fp) { perror("fopen"); return 1; }

fwrite(&s, sizeof(Student), 1, fp);   // write 1 Student
fclose(fp);

// ── Read binary ──
Student loaded;
fp = fopen("data.bin", "rb");
fread(&loaded, sizeof(Student), 1, fp);
printf("ID:%d Name:%s Marks:%.1f\\n", loaded.id, loaded.name, loaded.marks);
fclose(fp);

// ── Write array of structs ──
Student batch[3] = {
    {101, "Rahul", 85.5f},
    {102, "Priya", 92.0f},
    {103, "Aryan", 78.5f},
};
fp = fopen("batch.bin", "wb");
fwrite(batch, sizeof(Student), 3, fp);  // write 3 students at once!
fclose(fp);

// ── Read array ──
Student readBatch[10];
fp = fopen("batch.bin", "rb");
int count = fread(readBatch, sizeof(Student), 10, fp);  // returns elements read
printf("Read %d students\\n", count);  // 3
fclose(fp);
\`\`\`

### Random Access in Binary Files

\`\`\`c
// Seek to specific record — O(1) access!
void readRecord(FILE *fp, int index, Student *s) {
    fseek(fp, index * sizeof(Student), SEEK_SET);
    fread(s, sizeof(Student), 1, fp);
}

void updateRecord(FILE *fp, int index, const Student *s) {
    fseek(fp, index * sizeof(Student), SEEK_SET);
    fwrite(s, sizeof(Student), 1, fp);
}

int getRecordCount(FILE *fp) {
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    return size / sizeof(Student);
}

// Usage
FILE *fp = fopen("students.bin", "r+b");  // read+write binary

Student s;
readRecord(fp, 2, &s);  // read 3rd student (index 2)
printf("Student 2: %s\\n", s.name);

s.marks = 95.0f;
updateRecord(fp, 2, &s);  // update in place!

int total = getRecordCount(fp);
printf("Total records: %d\\n", total);
fclose(fp);
\`\`\`

### Text vs Binary — Comparison

\`\`\`c
// ── Write same data both ways ──
Student s = {101, "Rahul Sharma", 87.5f};

// Text — human readable, larger
FILE *t = fopen("student.txt", "w");
fprintf(t, "%d,%s,%.1f\\n", s.id, s.name, s.marks);
// File size: ~25 bytes
// Content: "101,Rahul Sharma,87.5\\n"
fclose(t);

// Binary — compact, not human readable
FILE *b = fopen("student.bin", "wb");
fwrite(&s, sizeof(Student), 1, b);
// File size: sizeof(Student) = ~58 bytes (with padding)
// But: instant read/write! No parsing needed!
fclose(b);

// Real comparison for 100,000 records:
// Text write: ~150ms (formatting + string conversion)
// Binary write: ~10ms (direct memory copy)
// Text read: ~200ms (parsing)
// Binary read: ~15ms (direct memory copy)
\`\`\`

### Endianness aur Portability

\`\`\`c
// Binary files are NOT portable by default!
// x86 (little-endian) vs ARM/Network (big-endian)

// int 0x01020304:
// Little-endian: 04 03 02 01 (least significant byte first)
// Big-endian:    01 02 03 04 (most significant byte first)

// Portable write: convert to network byte order
#include <arpa/inet.h>  // Linux/Mac
uint32_t hostVal = 12345;
uint32_t netVal  = htonl(hostVal);  // host to network long
fwrite(&netVal, sizeof(netVal), 1, fp);

// Read back
uint32_t readNet;
fread(&readNet, sizeof(readNet), 1, fp);
uint32_t readHost = ntohl(readNet);  // network to host
\`\`\`

### File Header — Custom File Format

\`\`\`c
// Professional way: header with magic bytes + version + metadata

#define MAGIC   0x5354444E  // "STDN" — our custom format
#define VERSION 1

typedef struct {
    uint32_t magic;     // identify file type
    uint16_t version;   // format version
    uint32_t count;     // number of records
    uint64_t timestamp; // creation time
    uint8_t  reserved[12]; // future use — padding
} FileHeader;  // 32 bytes exactly

// Write file with header
void writeStudentFile(const char *path, Student *arr, int n) {
    FILE *fp = fopen(path, "wb");
    if (!fp) { perror("fopen"); return; }

    FileHeader hdr = {
        .magic     = MAGIC,
        .version   = VERSION,
        .count     = n,
        .timestamp = (uint64_t)time(NULL),
    };
    fwrite(&hdr, sizeof(FileHeader), 1, fp);
    fwrite(arr, sizeof(Student), n, fp);
    fclose(fp);
}

// Read with validation
int readStudentFile(const char *path, Student *arr, int maxN) {
    FILE *fp = fopen(path, "rb");
    if (!fp) return -1;

    FileHeader hdr;
    fread(&hdr, sizeof(FileHeader), 1, fp);

    if (hdr.magic != MAGIC) {
        printf("Not a valid student file!\\n");
        fclose(fp); return -1;
    }
    if (hdr.version != VERSION) {
        printf("Incompatible version: %d\\n", hdr.version);
        fclose(fp); return -1;
    }

    int toRead = hdr.count < maxN ? hdr.count : maxN;
    fread(arr, sizeof(Student), toRead, fp);
    fclose(fp);
    return toRead;
}
\`\`\``,

      content_en: `## Binary Files — Raw Memory to Disk!

### fwrite and fread

\`\`\`c
// Write struct directly
Student s = {101, "Rahul", 85.5f};
FILE *fp = fopen("data.bin", "wb");
fwrite(&s, sizeof(Student), 1, fp);
fclose(fp);

// Write array of structs
Student batch[3] = {{101,"Rahul",85},{102,"Priya",92},{103,"Aryan",78}};
fwrite(batch, sizeof(Student), 3, fp);  // all at once!

// Read back
Student loaded;
fp = fopen("data.bin","rb");
fread(&loaded, sizeof(Student), 1, fp);
\`\`\`

### Random Access — O(1)!

\`\`\`c
void readRecord(FILE *fp, int idx, Student *s) {
    fseek(fp, idx * sizeof(Student), SEEK_SET);
    fread(s, sizeof(Student), 1, fp);
}
void updateRecord(FILE *fp, int idx, const Student *s) {
    fseek(fp, idx * sizeof(Student), SEEK_SET);
    fwrite(s, sizeof(Student), 1, fp);
}
int count(FILE *fp) {
    fseek(fp, 0, SEEK_END);
    return ftell(fp) / sizeof(Student);
}
\`\`\`

### File Header — Custom Format

\`\`\`c
typedef struct {
    uint32_t magic;    // 0x5354444E "STDN"
    uint16_t version;  // format version
    uint32_t count;    // record count
} FileHeader;
// Always write header first — validate before reading!
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdint.h>

#define DB_FILE   "employees.bin"
#define MAGIC     0x454D5059U  // "EMPY"
#define DB_VER    1

typedef struct {
    uint32_t magic;
    uint16_t version;
    uint32_t count;
    uint32_t nextId;
    uint8_t  pad[18];  // pad to 32 bytes
} DBHeader;

typedef struct {
    int   id;
    char  name[50];
    char  dept[20];
    float salary;
    int   active;
} Employee;

// ── DB operations ──
int dbCreate(const char *path) {
    FILE *fp = fopen(path, "wb");
    if (!fp) return 0;
    DBHeader h = {MAGIC, DB_VER, 0, 1001, {0}};
    fwrite(&h, sizeof(h), 1, fp);
    fclose(fp);
    printf("Database created: %s\\n", path);
    return 1;
}

int dbGetHeader(const char *path, DBHeader *h) {
    FILE *fp = fopen(path, "rb");
    if (!fp) return 0;
    fread(h, sizeof(*h), 1, fp);
    fclose(fp);
    return h->magic == MAGIC;
}

void dbUpdateHeader(const char *path, DBHeader *h) {
    FILE *fp = fopen(path, "r+b");
    if (!fp) return;
    fwrite(h, sizeof(*h), 1, fp);
    fclose(fp);
}

int dbAdd(const char *path, Employee *e) {
    DBHeader h;
    if (!dbGetHeader(path, &h)) return 0;

    e->id = h.nextId;
    FILE *fp = fopen(path, "ab");
    if (!fp) return 0;
    fwrite(e, sizeof(Employee), 1, fp);
    fclose(fp);

    h.count++; h.nextId++;
    dbUpdateHeader(path, &h);
    printf("Added: %s (ID:%d)\\n", e->name, e->id);
    return e->id;
}

int dbReadAll(const char *path, Employee *arr, int max) {
    FILE *fp = fopen(path, "rb");
    if (!fp) return 0;
    fseek(fp, sizeof(DBHeader), SEEK_SET);  // skip header
    int n = fread(arr, sizeof(Employee), max, fp);
    fclose(fp);
    return n;
}

int dbFindById(const char *path, int id, Employee *out) {
    Employee arr[200];
    int n = dbReadAll(path, arr, 200);
    for (int i = 0; i < n; i++) {
        if (arr[i].id == id) { *out = arr[i]; return 1; }
    }
    return 0;
}

int dbUpdateById(const char *path, int id, Employee *updated) {
    FILE *fp = fopen(path, "r+b");
    if (!fp) return 0;
    fseek(fp, sizeof(DBHeader), SEEK_SET);
    Employee e;
    int pos = 0;
    while (fread(&e, sizeof(e), 1, fp) == 1) {
        if (e.id == id) {
            updated->id = id;
            fseek(fp, -(long)sizeof(e), SEEK_CUR);
            fwrite(updated, sizeof(e), 1, fp);
            fclose(fp);
            printf("Updated employee ID:%d\\n", id);
            return 1;
        }
        pos++;
    }
    fclose(fp);
    return 0;
}

void dbPrintAll(const char *path) {
    Employee arr[200];
    int n = dbReadAll(path, arr, 200);
    printf("\\n%-6s %-20s %-12s %10s %s\\n",
           "ID","Name","Dept","Salary","Status");
    printf("──────────────────────────────────────────────────\\n");
    for (int i = 0; i < n; i++) {
        if (arr[i].active) {
            printf("%-6d %-20s %-12s Rs%-9.0f Active\\n",
                   arr[i].id, arr[i].name, arr[i].dept, arr[i].salary);
        }
    }

    DBHeader h;
    dbGetHeader(path, &h);
    printf("\\nTotal records: %d | DB size: ~%lu bytes\\n",
           h.count, sizeof(DBHeader) + h.count * sizeof(Employee));
}

int main() {
    // Create fresh DB
    dbCreate(DB_FILE);

    // Add employees
    Employee emps[] = {
        {0,"Rahul Sharma","Tech",   85000.0f, 1},
        {0,"Priya Patel", "Tech",   92000.0f, 1},
        {0,"Aryan Singh", "HR",     55000.0f, 1},
        {0,"Sneha Nair",  "Sales",  67000.0f, 1},
        {0,"Vikram Rao",  "Tech",  120000.0f, 1},
    };
    printf("\\n=== Adding Employees ===\\n");
    for (int i = 0; i < 5; i++) dbAdd(DB_FILE, &emps[i]);

    printf("\\n=== Current Database ===\\n");
    dbPrintAll(DB_FILE);

    // Update salary
    printf("\\n=== Updating Salary ===\\n");
    Employee updated;
    dbFindById(DB_FILE, 1001, &updated);
    updated.salary = 95000.0f;
    dbUpdateById(DB_FILE, 1001, &updated);

    printf("\\n=== After Update ===\\n");
    dbPrintAll(DB_FILE);

    // Random access demo
    printf("\\n=== Random Access ===\\n");
    Employee found;
    for (int id = 1001; id <= 1003; id++) {
        if (dbFindById(DB_FILE, id, &found))
            printf("ID:%d → %s, Rs%.0f\\n", found.id, found.name, found.salary);
    }

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <string.h>
#include <stdint.h>

#define MAGIC 0x53544442U // "STDB"

typedef struct { uint32_t magic; uint32_t count; } Hdr;
typedef struct { int id; char name[40]; float val; } Record;

void write_db(const char *f, Record *arr, int n) {
    FILE *fp=fopen(f,"wb");
    Hdr h={MAGIC,(uint32_t)n};
    fwrite(&h,sizeof(h),1,fp);
    fwrite(arr,sizeof(Record),n,fp);
    fclose(fp);
}

int read_db(const char *f, Record *arr, int max) {
    FILE *fp=fopen(f,"rb"); if(!fp) return 0;
    Hdr h; fread(&h,sizeof(h),1,fp);
    if(h.magic!=MAGIC){fclose(fp);return -1;}
    int n=fread(arr,sizeof(Record),h.count<max?h.count:max,fp);
    fclose(fp); return n;
}

int main(){
    Record data[]={{1,"Alice",90},{2,"Bob",85},{3,"Carol",92}};
    write_db("test.bin",data,3);
    Record loaded[10];
    int n=read_db("test.bin",loaded,10);
    for(int i=0;i<n;i++) printf("%d %s %.1f\\n",loaded[i].id,loaded[i].name,loaded[i].val);
    return 0;
}`,

      task: {
        description: 'Binary files practice: (1) "Image Metadata" — BMP ya custom image format ka header parse karo (width, height, bit depth) — binary read karo. (2) "Simple Database" with index — student records binary mein store karo + separate index file (.idx) mein ID→offset mapping rakho. Fast O(1) lookup karo. (3) "File Diff" — do binary files byte-by-byte compare karo, differences report karo (offset, expected, got).',
        description_en: 'Binary files practice: (1) "Image Metadata" — parse a BMP or custom image format header (width, height, bit depth) — read it as binary. (2) "Simple Database" with index — store student records in binary + keep an ID→offset mapping in a separate index file (.idx). Achieve fast O(1) lookup. (3) "File Diff" — compare two binary files byte by byte and report differences (offset, expected, got).',
        hint: 'BMP header: first 2 bytes = "BM", offset 18 = width (4 bytes), offset 22 = height (4 bytes). Index file: struct{int id; long offset;}. File diff: fread blocks, memcmp, report differing positions.',
        hint_en: 'BMP header: first 2 bytes = "BM", offset 18 = width (4 bytes), offset 22 = height (4 bytes). Index file: struct{int id; long offset;}. File diff: fread blocks, memcmp, report differing byte positions.',
      },
      quiz: [
        {
          q: '"rb" aur "r" modes mein kya difference hota hai?',
          options: [
            'Koi difference nahi',
            '"r" = text mode (OS newline conversion hoti hai — Windows \\r\\n → \\n). "rb" = binary mode (no conversion, exact bytes). Binary files ke liye hamesha "rb"/"wb" use karo — corruption avoid karo.',
            '"rb" faster hai',
            '"r" sirf Linux pe kaam karta hai',
          ],
          correct: 1,
          explanation: 'Windows: text file mein newline = "\\r\\n" (2 bytes). "r" mode: \\r\\n → \\n automatically. Binary data pe yeh disastrous hai! 0x0D 0x0A binary sequence kisi aur data ke beech mein? "r" mode se silently modified! "rb": no translation, exact bytes. Linux pe dono same, Windows pe different. Rule: binary data hamesha "rb"/"wb".',
          q_en: 'What is the difference between "rb" and "r" mode?',
          options_en: [
            'No difference',
            '"r" = text mode (OS newline conversion — Windows \\r\\n → \\n). "rb" = binary mode (no conversion, exact bytes). Always use "rb"/"wb" for binary files — avoid corruption.',
            '"rb" is faster',
            '"r" only works on Linux',
          ],
          explanation_en: 'Windows: text file newline = "\\r\\n" (2 bytes). "r" mode: \\r\\n → \\n automatically. On binary data this is disastrous! A 0x0D 0x0A sequence buried in binary data? "r" mode silently modifies it! "rb": no translation, exact bytes. On Linux both are the same; on Windows they differ. Rule: always use "rb"/"wb" for binary data.',
        },
        {
          q: 'Binary file mein random access (O(1)) kaise possible hai?',
          options: [
            'Searching karke',
            'Fixed-size records ke saath: fseek(fp, index * sizeof(Record), SEEK_SET). Record n ka offset exactly known hai — seedha wahan jaao, O(1)!',
            'Index file se',
            'RAM mein load karke',
          ],
          correct: 1,
          explanation: 'Fixed-size struct binary file: record 0 = offset 0, record 1 = offset sizeof(R), record n = offset n*sizeof(R). fseek directly wahan jaata hai — O(1)! Array indexing jaisa. Variable-size records (like text) mein yeh possible nahi — scan karna padta hai. Isliye databases fixed-size pages use karti hain internally.',
          q_en: 'How is O(1) random access possible in a binary file?',
          options_en: [
            'By searching',
            'With fixed-size records: fseek(fp, index * sizeof(Record), SEEK_SET). The offset of record n is exactly known — jump straight there, O(1)!',
            'Using an index file',
            'By loading into RAM',
          ],
          explanation_en: 'Fixed-size struct binary file: record 0 = offset 0, record 1 = offset sizeof(R), record n = offset n*sizeof(R). fseek jumps directly there — O(1)! Just like array indexing. With variable-size records (like text) this is not possible — you have to scan. This is why databases use fixed-size pages internally.',
        },
        {
          q: 'File header mein magic bytes kyun rakhe jaate hain?',
          options: [
            'File compress karne ke liye',
            'File type identify karne ke liye — wrong file pe apna program accidentally run hone se protect karo. JPEG = 0xFFD8FF, PNG = 0x89PNG. Custom format mein apne magic bytes define karo.',
            'Encryption ke liye',
            'Padding ke liye',
          ],
          correct: 1,
          explanation: 'Magic bytes = file signature. Examples: JPEG = FF D8 FF, PNG = 89 50 4E 47, PDF = 25 50 44 46 ("%PDF"), ZIP = 50 4B 03 04. Program ko file padne se pehle magic check karo — wrong file type pe graceful error. Version field: backward/forward compatibility. Custom format: apna magic define karo (company/app specific). Tools: file command (Linux) magic se file type detect karta hai.',
          q_en: 'Why are magic bytes put in a file header?',
          options_en: [
            'To compress the file',
            'To identify the file type — protect against accidentally running your program on the wrong file. JPEG = 0xFFD8FF, PNG = 0x89PNG. Define your own magic bytes for a custom format.',
            'For encryption',
            'For padding',
          ],
          explanation_en: 'Magic bytes = file signature. Examples: JPEG = FF D8 FF, PNG = 89 50 4E 47, PDF = 25 50 44 46 ("%PDF"), ZIP = 50 4B 03 04. Check magic before reading — give a graceful error for the wrong file type. Version field: backward/forward compatibility. Custom format: define your own magic (company/app specific). Tools: the Linux file command detects file types from magic bytes.',
        },
      ],
    },

    // ── SECTION 3 ──────────────────────────────────────────────────────
    {
      id: 'c-w6-s3',
      title: 'Error Handling aur Robust Code',
      title_en: 'Error Handling and Writing Robust Code',
      emoji: '🛡️',
      content: `## Error Handling — Production-Ready C Code!

Beginner ka code: assume karo sab kuch work karega.
Professional ka code: assume karo kuch bhi fail ho sakta hai!

### errno — C ka Error System

\`\`\`c
#include <errno.h>
#include <string.h>

FILE *fp = fopen("nonexistent.txt", "r");
if (!fp) {
    // errno = OS error code
    printf("Error code: %d\\n",    errno);         // e.g. 2
    printf("Error string: %s\\n",  strerror(errno)); // "No such file or directory"
    perror("Custom prefix");  // "Custom prefix: No such file or directory\\n"
}

// Common errno values
// ENOENT  = 2  — No such file or directory
// EACCES  = 13 — Permission denied
// ENOMEM  = 12 — Out of memory
// EEXIST  = 17 — File exists
// EINVAL  = 22 — Invalid argument
// ERANGE  = 34 — Result out of range
\`\`\`

### Custom Error Codes aur Return Values

\`\`\`c
// Method 1: Return codes (C standard approach)
typedef enum {
    ERR_OK       = 0,
    ERR_NULL_PTR = -1,
    ERR_NO_MEMORY = -2,
    ERR_FILE_NOT_FOUND = -3,
    ERR_INVALID_INPUT  = -4,
    ERR_OVERFLOW       = -5,
} ErrorCode;

const char* errStr(ErrorCode e) {
    switch (e) {
        case ERR_OK:             return "Success";
        case ERR_NULL_PTR:       return "Null pointer";
        case ERR_NO_MEMORY:      return "Out of memory";
        case ERR_FILE_NOT_FOUND: return "File not found";
        case ERR_INVALID_INPUT:  return "Invalid input";
        case ERR_OVERFLOW:       return "Overflow";
        default:                 return "Unknown error";
    }
}

ErrorCode processFile(const char *path, int *outCount) {
    if (!path || !outCount) return ERR_NULL_PTR;

    FILE *fp = fopen(path, "r");
    if (!fp) return ERR_FILE_NOT_FOUND;

    *outCount = 0;
    char line[256];
    while (fgets(line, sizeof(line), fp)) (*outCount)++;

    fclose(fp);
    return ERR_OK;
}

// Usage
int count;
ErrorCode err = processFile("data.txt", &count);
if (err != ERR_OK) {
    fprintf(stderr, "Error: %s\\n", errStr(err));
    return err;  // propagate up
}
printf("Lines: %d\\n", count);
\`\`\`

### Defensive Programming Patterns

\`\`\`c
// ── 1. NULL checks ──
Student* createStudent(const char *name, float marks) {
    if (!name) {
        fprintf(stderr, "createStudent: name is NULL\\n");
        return NULL;
    }
    if (marks < 0 || marks > 100) {
        fprintf(stderr, "createStudent: invalid marks %.1f\\n", marks);
        return NULL;
    }

    Student *s = (Student*)malloc(sizeof(Student));
    if (!s) {
        fprintf(stderr, "createStudent: malloc failed\\n");
        return NULL;
    }

    strncpy(s->name, name, sizeof(s->name)-1);
    s->name[sizeof(s->name)-1] = '\\0';  // ensure null termination
    s->marks = marks;
    return s;
}

// ── 2. Array bounds ──
int safeGet(int *arr, int size, int index, int *out) {
    if (!arr || !out)      return ERR_NULL_PTR;
    if (index < 0 || index >= size) return ERR_INVALID_INPUT;
    *out = arr[index];
    return ERR_OK;
}

// ── 3. Integer overflow check ──
int safeAdd(int a, int b, int *result) {
    // check if a + b would overflow
    if (b > 0 && a > INT_MAX - b) return ERR_OVERFLOW;
    if (b < 0 && a < INT_MIN - b) return ERR_OVERFLOW;
    *result = a + b;
    return ERR_OK;
}

// ── 4. String safety ──
int safeCopy(char *dst, size_t dstSize, const char *src) {
    if (!dst || !src || dstSize == 0) return ERR_NULL_PTR;
    strncpy(dst, src, dstSize - 1);
    dst[dstSize - 1] = '\\0';  // ALWAYS null-terminate
    return ERR_OK;
}
\`\`\`

### assert — Debug-time Checks

\`\`\`c
#include <assert.h>

// assert aborts program agar condition false ho
// (ONLY in debug builds — NDEBUG macro se disable hoti hai)
void divideArray(int *arr, int n, int divisor) {
    assert(arr != NULL);    // should never be null
    assert(n > 0);          // need at least 1 element
    assert(divisor != 0);   // no division by zero!

    for (int i = 0; i < n; i++) arr[i] /= divisor;
}

// Compile with: gcc -DNDEBUG prog.c  → asserts disabled (release)
// Compile with: gcc prog.c           → asserts enabled (debug)
\`\`\`

### Cleanup Patterns — goto for Error Handling!

\`\`\`c
// C mein proper cleanup using goto (NOT bad style for error handling!)
int processData(const char *inputPath, const char *outputPath) {
    int result = ERR_OK;
    FILE *in = NULL, *out = NULL;
    char *buffer = NULL;

    in = fopen(inputPath, "r");
    if (!in) { result = ERR_FILE_NOT_FOUND; goto cleanup; }

    out = fopen(outputPath, "w");
    if (!out) { result = ERR_FILE_NOT_FOUND; goto cleanup; }

    buffer = (char*)malloc(1024);
    if (!buffer) { result = ERR_NO_MEMORY; goto cleanup; }

    // ... actual processing ...
    while (fgets(buffer, 1024, in)) {
        fputs(buffer, out);
    }

cleanup:
    free(buffer);    // free(NULL) is safe!
    if (in)  fclose(in);
    if (out) fclose(out);
    return result;
}
\`\`\``,

      content_en: `## Error Handling — Production-Ready C Code!

### errno

\`\`\`c
#include <errno.h>
FILE *fp = fopen("nofile.txt","r");
if (!fp) {
    perror("fopen");          // prints OS error
    printf("%s\\n", strerror(errno));  // "No such file or directory"
}
\`\`\`

### Custom Error Codes

\`\`\`c
typedef enum {
    OK=0, ERR_NULL=-1, ERR_MEM=-2, ERR_FILE=-3, ERR_INPUT=-4
} Err;

Err processFile(const char *path, int *out) {
    if (!path||!out) return ERR_NULL;
    FILE *f=fopen(path,"r"); if(!f) return ERR_FILE;
    *out=0; char buf[256];
    while(fgets(buf,sizeof(buf),f)) (*out)++;
    fclose(f); return OK;
}
\`\`\`

### Defensive Patterns

\`\`\`c
// NULL checks, bounds checks, overflow checks
if (!ptr)        return ERR_NULL;
if (i<0||i>=n)   return ERR_INPUT;
if (a>INT_MAX-b) return ERR_OVERFLOW;

// Always null-terminate strings
strncpy(dst, src, size-1); dst[size-1]='\\0';

// Cleanup with goto (accepted C idiom)
cleanup:
    free(buf); if(fp) fclose(fp);
    return result;
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <limits.h>
#include <assert.h>

typedef enum {
    OK=0, E_NULL=-1, E_MEM=-2, E_FILE=-3,
    E_INPUT=-4, E_OVERFLOW=-5, E_RANGE=-6
} Err;

const char* errMsg(Err e){
    switch(e){
        case OK:         return "OK";
        case E_NULL:     return "Null pointer";
        case E_MEM:      return "Out of memory";
        case E_FILE:     return "File error";
        case E_INPUT:    return "Invalid input";
        case E_OVERFLOW: return "Integer overflow";
        case E_RANGE:    return "Out of range";
        default:         return "Unknown";
    }
}

#define CHECK(e) if((e)!=OK){fprintf(stderr,"ERROR [%s:%d]: %s\\n",__FILE__,__LINE__,errMsg(e));return(e);}
#define CHECK_NULL(p) if(!(p)){fprintf(stderr,"NULL [%s:%d]\\n",__FILE__,__LINE__);return E_NULL;}

// Safe integer addition
Err safeAdd(int a, int b, int *out){
    CHECK_NULL(out);
    if(b>0&&a>INT_MAX-b) return E_OVERFLOW;
    if(b<0&&a<INT_MIN-b) return E_OVERFLOW;
    *out=a+b; return OK;
}

// Safe string copy
Err safeCpy(char *dst, size_t dstSz, const char *src){
    CHECK_NULL(dst); CHECK_NULL(src);
    if(dstSz==0) return E_INPUT;
    strncpy(dst,src,dstSz-1); dst[dstSz-1]='\\0';
    return OK;
}

// Safe array get
Err safeGet(int *arr, int n, int i, int *out){
    CHECK_NULL(arr); CHECK_NULL(out);
    if(i<0||i>=n) return E_RANGE;
    *out=arr[i]; return OK;
}

// File processor with full error handling
typedef struct { int lines, words, chars; } FileStats;

Err analyzeFile(const char *path, FileStats *stats){
    CHECK_NULL(path); CHECK_NULL(stats);

    FILE *fp=fopen(path,"r");
    if(!fp){
        fprintf(stderr,"fopen(%s): %s\\n",path,strerror(errno));
        return E_FILE;
    }

    memset(stats,0,sizeof(*stats));
    int c, inWord=0;
    while((c=fgetc(fp))!=EOF){
        stats->chars++;
        if(c=='\\n') stats->lines++;
        if(c==' '||c=='\\n'||c=='\\t') inWord=0;
        else if(!inWord){ stats->words++; inWord=1; }
    }
    if(ferror(fp)){fclose(fp);return E_FILE;}
    fclose(fp);
    return OK;
}

// Generate test file + analyze
Err runAnalysis(const char *path){
    // Write test file
    FILE *fp=fopen(path,"w");
    if(!fp) return E_FILE;
    fprintf(fp,"Hello World!\\n");
    fprintf(fp,"This is a test file for error handling demo.\\n");
    fprintf(fp,"C programming mein error handling bahut important hai.\\n");
    fprintf(fp,"Always check return values!\\n");
    fclose(fp);

    FileStats stats;
    Err e=analyzeFile(path,&stats);
    if(e!=OK) return e;

    printf("File: %s\\n",path);
    printf("  Lines: %d\\n  Words: %d\\n  Chars: %d\\n",
           stats.lines, stats.words, stats.chars);
    return OK;
}

int main(){
    printf("=== Error Handling Demo ===\\n\\n");

    // Safe addition
    int result;
    Err e;
    e=safeAdd(100,200,&result);
    printf("100+200 = %d [%s]\\n",result,errMsg(e));

    e=safeAdd(INT_MAX,1,&result);
    printf("INT_MAX+1 = ? [%s]\\n",errMsg(e));

    // Safe array access
    int arr[]={10,20,30,40,50}; int val;
    e=safeGet(arr,5,2,&val);
    printf("arr[2] = %d [%s]\\n",val,errMsg(e));
    e=safeGet(arr,5,10,&val);
    printf("arr[10] = ? [%s]\\n",errMsg(e));

    // File analysis
    printf("\\n=== File Analysis ===\\n");
    e=runAnalysis("test.txt");
    if(e!=OK) fprintf(stderr,"Analysis failed: %s\\n",errMsg(e));

    // Error on nonexistent file
    FileStats s;
    e=analyzeFile("nonexistent_xyz.txt",&s);
    printf("Nonexistent file: [%s]\\n",errMsg(e));

    // assert demo
    printf("\\n=== Assert Demo ===\\n");
    int x=42;
    assert(x>0);  // passes
    printf("assert(x>0) passed for x=%d\\n",x);
    // assert(x<0);  // would abort!

    return 0;
}`,

      codeExample_en: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <limits.h>

typedef enum { OK=0,E_NULL=-1,E_MEM=-2,E_FILE=-3,E_RANGE=-4,E_OVER=-5 } Err;
const char*em(Err e){switch(e){case OK:return"OK";case E_NULL:return"Null";case E_MEM:return"OOM";case E_FILE:return"File err";case E_RANGE:return"Range";case E_OVER:return"Overflow";default:return"?";}};

Err safeAdd(int a,int b,int*r){if(!r)return E_NULL;if(b>0&&a>2147483647-b)return E_OVER;if(b<0&&a<-2147483648-b)return E_OVER;*r=a+b;return OK;}
Err safeGet(int*a,int n,int i,int*r){if(!a||!r)return E_NULL;if(i<0||i>=n)return E_RANGE;*r=a[i];return OK;}

int main(){
    int result; Err e;
    e=safeAdd(2000000000,2000000000,&result);
    printf("2e9+2e9: [%s]\\n",em(e));
    e=safeAdd(100,200,&result);
    printf("100+200=%d [%s]\\n",result,em(e));
    int arr[]={1,2,3};
    e=safeGet(arr,3,5,&result);
    printf("arr[5]: [%s]\\n",em(e));
    return 0;
}`,

      task: {
        description: 'Error handling practice: (1) "Robust Calculator" — division, sqrt, log ke liye error handling add karo (division by zero, negative sqrt, negative log). Custom error codes return karo. (2) "Safe String Library" — safeStrlen, safestrcpy, safeStrcat, safeStrfind banao — NULL check, buffer size check sab. (3) "Input Validator" — email format, phone number (10 digits), age (1-150), salary (>0) ke liye validators banao jo detailed error messages dein. (4) Cleanup pattern practice: ek function banao jo 3 files aur 2 mallocs use kare — kisi bhi step pe failure pe sab properly cleanup karo.',
        description_en: 'Error handling practice: (1) "Robust Calculator" — add error handling for division, sqrt, log (division by zero, negative sqrt, negative log). Return custom error codes. (2) "Safe String Library" — build safeStrlen, safeStrcpy, safeStrcat, safeStrfind — with NULL checks and buffer size checks. (3) "Input Validator" — build validators for email format, phone number (10 digits), age (1-150), salary (>0) that return detailed error messages. (4) Cleanup pattern practice: write a function that uses 3 files and 2 mallocs — properly clean up everything on failure at any step.',
        hint: 'Calculator errors: if(b==0) return ERR_DIV_ZERO; if(x<0) return ERR_DOMAIN. Validators: isdigit loop for phone. Cleanup goto: label at end, free/fclose in reverse order. Safe strcat: check dst has enough space (strlen(dst)+strlen(src)<dstSize).',
        hint_en: 'Calculator errors: if(b==0) return ERR_DIV_ZERO; if(x<0) return ERR_DOMAIN. Validators: isdigit loop for phone. Cleanup goto: label at end, free/fclose in reverse order. Safe strcat: check dst has enough space (strlen(dst)+strlen(src)<dstSize).',
      },
      quiz: [
        {
          q: 'C mein error handling ke liye exception (try/catch) kyun nahi hai?',
          options: [
            'Hai — try/catch kaam karta hai',
            'C minimal language hai — no exceptions. Har function explicitly error code return karta hai ya errno set karta hai. Verbose lekin explicit aur fast — no hidden control flow, no overhead.',
            'Performance problem hai',
            'Compiler support nahi hai',
          ],
          correct: 1,
          explanation: 'C philosophy: explicit > implicit. Exceptions = hidden control flow, stack unwinding overhead, C runtime. Return codes = predictable, zero overhead, explicit. "Zero-cost abstractions" C++ mein exceptions possible (with overhead). C: Linux kernel, embedded systems — exceptions not suitable. Pattern: every function returns error code, caller checks, propagates up.',
          q_en: 'Why are there no exceptions (try/catch) in C for error handling?',
          options_en: [
            'There are — try/catch works in C',
            'C is a minimal language — no exceptions. Every function explicitly returns an error code or sets errno. Verbose but explicit and fast — no hidden control flow, no overhead.',
            'It is a performance problem',
            'Compiler support is lacking',
          ],
          explanation_en: 'C philosophy: explicit > implicit. Exceptions = hidden control flow, stack unwinding overhead, C runtime. Return codes = predictable, zero overhead, explicit. "Zero-cost abstractions" make exceptions possible in C++ (with overhead). C: Linux kernel, embedded systems — exceptions are not suitable. Pattern: every function returns an error code, the caller checks it and propagates upward.',
        },
        {
          q: 'goto C mein generally bad practice hai — lekin error handling mein kyun acceptable hai?',
          options: [
            'Goto C mein kabhi use nahi karna chahiye',
            'Error cleanup mein: multiple resources (files, memory) allocate karo, failure pe sab cleanup karo — goto cleanup: ek cleanest pattern hai. Deep nesting avoid hoti hai. Linux kernel extensively uses this pattern.',
            'goto fastest hai',
            'Compiler optimize karta hai',
          ],
          correct: 1,
          explanation: 'Spaghetti code mein goto = bad. Error cleanup mein goto = good pattern! Alternative bina goto: deeply nested if/else → unreadable. goto cleanup: (1) Resources allocate karo. (2) Any failure → goto cleanup. (3) cleanup: label pe sab free/close karo. Linux kernel source code mein yeh pattern 1000s times hai. Structured exit point — single cleanup code.',
          q_en: 'goto is generally bad practice in C — but why is it acceptable for error handling?',
          options_en: [
            'goto should never be used in C',
            'For error cleanup: allocate multiple resources (files, memory), then if anything fails, clean up everything — goto cleanup: is the cleanest pattern. Avoids deep nesting. The Linux kernel uses this pattern extensively.',
            'goto is the fastest',
            'The compiler optimises it',
          ],
          explanation_en: 'goto in spaghetti code = bad. goto for error cleanup = good pattern! Alternative without goto: deeply nested if/else → unreadable. goto cleanup: (1) Allocate resources. (2) Any failure → goto cleanup. (3) cleanup: label — free/close everything. The Linux kernel source uses this pattern thousands of times. Single structured exit point — single cleanup code.',
        },
        {
          q: 'assert() aur if(condition) return ERROR mein kya fark hai?',
          options: [
            'Same hain',
            'assert() = programmer errors catch karo (should never happen in correct code) — debug builds mein. if/return = expected failure conditions handle karo — always present. Release builds mein assert disabled hoti hain.',
            'assert() slower hai',
            'if/return compile nahi hota',
          ],
          correct: 1,
          explanation: 'assert(ptr != NULL): "yeh NULL kabhi nahi hona chahiye — agar hua toh programming mistake hai". NDEBUG define karo → assert removed. Production code mein no overhead! if(!ptr) return ERR: "user invalid input de sakta hai — handle karo gracefully". Dono alag purpose: assert = invariants check, if/return = expected errors. Google guideline: assert for bugs, error codes for expected failures.',
          q_en: 'What is the difference between assert() and if(condition) return ERROR?',
          options_en: [
            'They are the same',
            'assert() = catch programmer errors (should never happen in correct code) — in debug builds only. if/return = handle expected failure conditions — always present. assert is disabled in release builds.',
            'assert() is slower',
            'if/return does not compile',
          ],
          explanation_en: 'assert(ptr != NULL): "this should never be NULL — if it is, it is a programming mistake". Define NDEBUG → assert removed. No overhead in production! if(!ptr) return ERR: "the user might give invalid input — handle it gracefully". Both serve different purposes: assert = check invariants, if/return = handle expected errors. Google guideline: assert for bugs, error codes for expected failures.',
        },
      ],
    },

    // ── SECTION 4 ──────────────────────────────────────────────────────
    {
      id: 'c-w6-s4',
      title: 'Week 6 Project — Complete File-Based Database',
      title_en: 'Week 6 Project — Complete File-Based Database',
      emoji: '🗄️',
      content: `## Week 6 Project — Sab Kuch Ek Robust System Mein!

Is hafte seekha:
- Text files (fopen, fclose, fprintf, fgets, fscanf)
- Binary files (fread, fwrite, random access, file header)
- Error handling (errno, custom codes, defensive programming)

Ab ek **Complete File-Based Database System** banao!

### Project Architecture

\`\`\`
Database Files:
├── studyearn.hdr    ← Binary header (magic, version, record count)
├── studyearn.dat    ← Binary data (fixed-size records)
├── studyearn.idx    ← Binary index (id → file offset mapping)
└── studyearn.log    ← Text log (all operations)

Features:
1. CREATE — new student record add karo
2. READ   — by ID ya name search karo
3. UPDATE — marks, city update karo
4. DELETE — soft delete (active flag = 0)
5. LIST   — sab active records print karo
6. STATS  — analytics (avg, top, dept breakdown)
7. BACKUP — .dat file copy karo .bak mein
8. IMPORT — CSV file se records load karo
9. EXPORT — records ko CSV mein save karo
\`\`\`

### Index Structure — Fast Lookup

\`\`\`c
typedef struct {
    int   id;      // student ID
    long  offset;  // byte offset in .dat file
    int   active;  // 1=valid, 0=deleted
} IndexEntry;

// Index file operations
void buildIndex(const char *datPath, const char *idxPath);
long lookupOffset(const char *idxPath, int id);
void addToIndex(const char *idxPath, int id, long offset);
void deleteFromIndex(const char *idxPath, int id);

// Lookup by ID: O(n) scan of index (small) vs O(n) scan of data (large)
// For large databases: B-tree or hash index
\`\`\`

### CSV Import/Export

\`\`\`c
// Import from CSV
int importCSV(Database *db, const char *csvPath) {
    FILE *fp = fopen(csvPath, "r");
    if (!fp) return ERR_FILE;

    char line[256];
    fgets(line, sizeof(line), fp);  // skip header

    int imported = 0;
    while (fgets(line, sizeof(line), fp)) {
        Student s = {0};
        // Parse CSV line: id,name,dept,marks,city
        int parsed = sscanf(line,
            "%d,\"%49[^\"]\",\"%19[^\"]\",\"%19[^\"]\",%.1f,\"%29[^\"]\"",
            &s.id, s.name, s.dept, s.section, &s.marks, s.city);
        if (parsed == 6) {
            addStudent(db, s);
            imported++;
        }
    }
    fclose(fp);
    return imported;
}
\`\`\`

### Month 2 Preview

\`\`\`
Month 2 (Weeks 5-8) — Current:
  ✅ Week 5: Structures, Unions, Enums, Linked Lists
  ✅ Week 6: File I/O, Binary files, Error Handling

  Week 7 (coming): Preprocessor, Macros, Advanced C
    - #define, #ifdef, #pragma
    - Variadic functions (printf-like)
    - Bitwise operations deep dive
    - inline functions, restrict keyword

  Week 8 (coming): Stack, Queue, Hash Table
    - Stack implementation (array + linked list)
    - Queue (circular buffer)
    - Hash table (chaining + open addressing)
    - Basic Graph representation
\`\`\``,

      content_en: `## Week 6 Project — Everything in One Robust System!

### Database Architecture

\`\`\`
studyearn.hdr  ← Binary header (magic, version, count)
studyearn.dat  ← Binary data (fixed-size records)
studyearn.idx  ← Binary index (id → file offset)
studyearn.log  ← Text operation log
\`\`\`

### Index for Fast Lookup

\`\`\`c
typedef struct { int id; long offset; int active; } IdxEntry;

// Build on startup by scanning .dat
// Lookup: scan index (small) instead of data (large)
// Future: B-tree or hash for O(log n) / O(1)
\`\`\``,

      codeExample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdint.h>

#define DB_MAGIC  0x53454442U  // "SEDB"
#define DB_VER    2
#define LOG_FILE  "sedb.log"
#define HDR_FILE  "sedb.hdr"
#define DAT_FILE  "sedb.dat"
#define IDX_FILE  "sedb.idx"
#define CSV_FILE  "export.csv"

typedef struct {
    uint32_t magic;
    uint16_t version;
    uint32_t totalRecords;
    uint32_t activeRecords;
    uint32_t nextId;
    uint8_t  padding[14];
} DBHdr;  // exactly 32 bytes

typedef struct {
    uint32_t id;
    char     name[50];
    char     dept[20];
    float    marks[5];
    float    gpa;
    char     city[30];
    uint8_t  active;
    uint8_t  grade;
    uint8_t  _pad[2];
} Record;  // fixed size

typedef struct {
    uint32_t id;
    long     offset;
    uint8_t  active;
    uint8_t  _pad[3];
} IdxEntry;

// ── Logging ──
void sedb_log(const char *op, const char *detail) {
    FILE *f = fopen(LOG_FILE, "a");
    if (!f) return;
    time_t t = time(NULL);
    struct tm *tm = localtime(&t);
    fprintf(f, "%04d-%02d-%02d %02d:%02d:%02d | %-10s | %s\\n",
            tm->tm_year+1900, tm->tm_mon+1, tm->tm_mday,
            tm->tm_hour, tm->tm_min, tm->tm_sec, op, detail);
    fclose(f);
}

// ── Header ──
int sedb_initHdr() {
    FILE *f = fopen(HDR_FILE, "wb");
    if (!f) return 0;
    DBHdr h = {DB_MAGIC, DB_VER, 0, 0, 1001, {0}};
    fwrite(&h, sizeof(h), 1, f);
    fclose(f);
    sedb_log("INIT", "Database created");
    return 1;
}

int sedb_getHdr(DBHdr *h) {
    FILE *f = fopen(HDR_FILE, "rb");
    if (!f) return 0;
    fread(h, sizeof(*h), 1, f);
    fclose(f);
    return h->magic == DB_MAGIC;
}

void sedb_saveHdr(const DBHdr *h) {
    FILE *f = fopen(HDR_FILE, "wb");
    if (!f) return;
    fwrite(h, sizeof(*h), 1, f);
    fclose(f);
}

// ── Compute grade ──
char computeGrade(float gpa) {
    if (gpa >= 90) return 'A';
    if (gpa >= 75) return 'B';
    if (gpa >= 60) return 'C';
    if (gpa >= 45) return 'D';
    return 'F';
}

// ── INSERT ──
int sedb_insert(const char *name, const char *dept,
                float marks[], const char *city) {
    DBHdr h;
    if (!sedb_getHdr(&h)) { sedb_log("INSERT","FAIL: bad header"); return -1; }

    Record r = {0};
    r.id = h.nextId;
    strncpy(r.name, name, 49);
    strncpy(r.dept, dept, 19);
    strncpy(r.city, city, 29);
    r.active = 1;
    float sum = 0;
    for (int i = 0; i < 5; i++) { r.marks[i] = marks[i]; sum += marks[i]; }
    r.gpa   = sum / 5.0f;
    r.grade = computeGrade(r.gpa);

    // Append to .dat
    FILE *df = fopen(DAT_FILE, "ab");
    if (!df) { sedb_log("INSERT","FAIL: cannot open dat"); return -1; }
    long offset = 0;
    fseek(df, 0, SEEK_END); offset = ftell(df);
    fwrite(&r, sizeof(r), 1, df);
    fclose(df);

    // Append to .idx
    IdxEntry ie = {r.id, offset, 1, {0}};
    FILE *xf = fopen(IDX_FILE, "ab");
    if (xf) { fwrite(&ie, sizeof(ie), 1, xf); fclose(xf); }

    h.totalRecords++;
    h.activeRecords++;
    h.nextId++;
    sedb_saveHdr(&h);

    char buf[80]; snprintf(buf, 80, "ID:%u %s %.1f%%", r.id, r.name, r.gpa);
    sedb_log("INSERT", buf);
    return r.id;
}

// ── FIND by ID ──
int sedb_findById(uint32_t id, Record *out) {
    FILE *xf = fopen(IDX_FILE, "rb");
    if (!xf) return 0;
    IdxEntry ie;
    while (fread(&ie, sizeof(ie), 1, xf) == 1) {
        if (ie.id == id && ie.active) {
            fclose(xf);
            FILE *df = fopen(DAT_FILE, "rb");
            if (!df) return 0;
            fseek(df, ie.offset, SEEK_SET);
            fread(out, sizeof(*out), 1, df);
            fclose(df);
            return 1;
        }
    }
    fclose(xf);
    return 0;
}

// ── LIST ALL ──
void sedb_listAll() {
    FILE *df = fopen(DAT_FILE, "rb");
    if (!df) { puts("No data"); return; }
    printf("\\n%-6s %-20s %-10s %6s %5s %-12s\\n",
           "ID","Name","Dept","GPA","Gr","City");
    printf("──────────────────────────────────────────────────────\\n");
    Record r;
    int cnt = 0;
    while (fread(&r, sizeof(r), 1, df) == 1) {
        if (r.active) {
            printf("%-6u %-20s %-10s %6.1f  %c   %-12s\\n",
                   r.id, r.name, r.dept, r.gpa, r.grade, r.city);
            cnt++;
        }
    }
    fclose(df);
    printf("(%d records)\\n", cnt);
}

// ── EXPORT CSV ──
void sedb_exportCSV() {
    FILE *df = fopen(DAT_FILE, "rb");
    FILE *cf = fopen(CSV_FILE, "w");
    if (!df||!cf){if(df)fclose(df);if(cf)fclose(cf);return;}
    fprintf(cf, "id,name,dept,gpa,grade,city\\n");
    Record r;
    while (fread(&r, sizeof(r), 1, df) == 1)
        if (r.active)
            fprintf(cf, "%u,\"%s\",\"%s\",%.1f,%c,\"%s\"\\n",
                    r.id, r.name, r.dept, r.gpa, r.grade, r.city);
    fclose(df); fclose(cf);
    sedb_log("EXPORT", CSV_FILE);
    printf("Exported to %s\\n", CSV_FILE);
}

int main() {
    sedb_initHdr();

    float m1[]={85,90,88,92,87}, m2[]={92,95,91,94,98};
    float m3[]={70,68,72,65,75}, m4[]={55,60,50,58,62};
    float m5[]={88,85,90,87,92};

    printf("=== Inserting Records ===\\n");
    sedb_insert("Rahul Sharma",  "Tech",    m1, "Mumbai");
    sedb_insert("Priya Patel",   "Tech",    m2, "Surat");
    sedb_insert("Aryan Singh",   "HR",      m3, "Delhi");
    sedb_insert("Sneha Nair",    "Finance", m4, "Kochi");
    sedb_insert("Vikram Rao",    "Tech",    m5, "Hyderabad");

    sedb_listAll();

    printf("\\n=== Find by ID ===\\n");
    Record r;
    if (sedb_findById(1001, &r))
        printf("Found: %s, GPA:%.1f, Grade:%c\\n", r.name, r.gpa, r.grade);

    sedb_exportCSV();

    DBHdr h; sedb_getHdr(&h);
    printf("\\nDB: %u total, %u active, next ID: %u\\n",
           h.totalRecords, h.activeRecords, h.nextId);
    printf("Record size: %lu bytes\\n", sizeof(Record));
    printf("5 records = %lu bytes\\n", 5*sizeof(Record));

    return 0;
}`,

      codeExample_en: `/* See above — complete database system */`,

      task: {
        description: 'Final project — Complete Database upgrade: (1) UPDATE operation: student ke marks update karo aur GPA recalculate karo, index mein bhi update karo. (2) DELETE (soft): active flag 0 karo, activeRecords count update karo, INDEX mein bhi mark karo. (3) SEARCH by name: partial match (strstr) se saare matching records list karo. (4) STATS: department-wise average GPA, topper list, grade distribution bar chart (A:####, B:##, etc). (5) COMPACT: soft-deleted records permanently hatao — new .dat file banao sirf active records ke saath, index rebuild karo.',
        description_en: 'Final project — Complete Database upgrade: (1) UPDATE: update a student\'s marks, recalculate GPA, update the index too. (2) DELETE (soft): set active flag to 0, update activeRecords count, mark in INDEX too. (3) SEARCH by name: list all records matching a partial name (strstr). (4) STATS: department-wise average GPA, topper list, grade distribution bar chart (A:####, B:##, etc). (5) COMPACT: permanently remove soft-deleted records — build a new .dat with only active records, rebuild the index.',
        hint: 'UPDATE: fseek to offset from index, fwrite updated record. Soft delete: same but set active=0. COMPACT: read all, filter active, write to .dat.new, rename. Stats: array of dept averages, loop once.',
        hint_en: 'UPDATE: fseek to offset from index, fwrite the updated record. Soft delete: same but set active=0. COMPACT: read all, filter active records, write to .dat.new, rename. Stats: array of dept averages, single loop.',
      },
      quiz: [
        {
          q: 'Soft delete kyun use karte hain hard delete ki jagah databases mein?',
          options: [
            'Faster hai',
            'Soft delete: active flag = 0. Hard delete: physical removal + reindex. Soft benefits: undo possible, audit trail, no fragmentation, faster delete O(1). Compact periodically.',
            'Memory save hoti hai',
            'Hard delete complicated hai',
          ],
          correct: 1,
          explanation: 'Soft delete real-world pattern hai: active=0 set karo — O(1) operation, no file modification. Benefits: (1) "Undo delete" possible (active=1 wapas). (2) Audit trail — deleted records history ke saath. (3) No immediate fragmentation. (4) Foreign key references intact. (5) Periodic COMPACT operation se physical cleanup. Real databases (MySQL, PostgreSQL) bhi similar patterns use karte hain.',
          q_en: 'Why use soft delete instead of hard delete in databases?',
          options_en: [
            'It is faster',
            'Soft delete: active flag = 0. Hard delete: physical removal + reindex. Soft benefits: undo possible, audit trail, no fragmentation, O(1) delete. Compact periodically.',
            'It saves memory',
            'Hard delete is complicated',
          ],
          explanation_en: 'Soft delete is a real-world pattern: set active=0 — O(1) operation, no file modification needed. Benefits: (1) "Undo delete" is possible (set active=1 again). (2) Audit trail — deleted records preserved with history. (3) No immediate fragmentation. (4) Foreign key references remain intact. (5) Periodic COMPACT cleans up physically. Real databases (MySQL, PostgreSQL) use similar patterns.',
        },
        {
          q: 'Binary database index (.idx file) kyun maintain karte hain?',
          options: [
            'Zaruri nahi',
            'Index file (id → offset) se ID se lookup O(n_index) possible — index chota hai data se. Bina index: poori .dat scan karni padegi O(n_data). Large databases mein: critical performance difference.',
            'Index backup ke liye hai',
            'Compression ke liye',
          ],
          correct: 1,
          explanation: 'Index = secondary data structure for fast lookup. .dat mein 1 million records = 1M * sizeof(Record) scan. .idx mein sirf {id, offset} pairs — much smaller! Binary search on sorted index: O(log n). Hash index: O(1). Real DBMS: B-tree index (balanced, O(log n)), covering index, composite index. Our simple index: O(n) scan of smaller file — still faster than full .dat scan.',
          q_en: 'Why maintain a binary database index (.idx file)?',
          options_en: [
            'Not necessary',
            'An index file (id → offset) enables O(n_index) lookup by ID — the index is much smaller than the data. Without it, you must scan the entire .dat — O(n_data). For large databases: a critical performance difference.',
            'The index is for backups',
            'For compression',
          ],
          explanation_en: 'Index = secondary data structure for fast lookups. 1 million records in .dat = scan 1M * sizeof(Record) bytes. .idx only has {id, offset} pairs — much smaller! Binary search on a sorted index: O(log n). Hash index: O(1). Real DBMS: B-tree index (balanced, O(log n)), covering index, composite index. Our simple index: O(n) scan of a much smaller file — still faster than a full .dat scan.',
        },
        {
          q: 'File-based database aur full DBMS (MySQL) mein main differences kya hain?',
          options: [
            'Koi difference nahi',
            'File DB: simple, no concurrent access, no transactions, no query language, no network. DBMS: ACID transactions, concurrent access (locking), SQL query language, network protocol, crash recovery, indexes, joins.',
            'File DB faster hai hamesha',
            'DBMS sirf web apps ke liye hai',
          ],
          correct: 1,
          explanation: 'Hamara file DB = learning tool + small applications. Production: SQLite (file-based DBMS) — saare DBMS features, ek file, no server. Larger: MySQL/PostgreSQL — client-server, concurrent access, replication. C mein directly: SQLite library embed karo (sqlite3.h) — real SQL queries, ACID transactions, automatic indexing. Ek file, zero configuration!',
          q_en: 'What are the main differences between a file-based database and a full DBMS (MySQL)?',
          options_en: [
            'No difference',
            'File DB: simple, no concurrent access, no transactions, no query language, no networking. DBMS: ACID transactions, concurrent access (locking), SQL, network protocol, crash recovery, indexes, joins.',
            'File DB is always faster',
            'DBMS is only for web apps',
          ],
          explanation_en: 'Our file DB = a learning tool + suitable for small applications. For production: SQLite (a file-based DBMS) — all DBMS features, one file, no server. For larger scale: MySQL/PostgreSQL — client-server, concurrent access, replication. In C: embed the SQLite library (sqlite3.h) — real SQL queries, ACID transactions, automatic indexing. One file, zero configuration!',
        },
      ],
    },
  ],
};