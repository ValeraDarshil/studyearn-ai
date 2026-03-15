/**
 * StudyEarn AI — Python Week 8
 * Topic: Data Analysis with Pandas + Matplotlib
 * Month 2 Finale!
 */

export const PYTHON_WEEK_8 = {
  week: 8,
  title: 'Pandas & Data Analysis — Data Se Stories Nikalo',
  description: 'Pandas se data clean karo, analyze karo aur Matplotlib se visualize karo!',
  xpReward: 200,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w8-s1',
      title: 'Pandas Basics — DataFrames Samjho',
      emoji: '🐼',
      content: `## Pandas — Python ka Excel on Steroids!

Pandas data analysis ke liye sabse powerful library hai. Data Science, AI — sab jagah use hota hai!

### Install karo:
\`\`\`bash
pip install pandas openpyxl
\`\`\`

### DataFrame banana
\`\`\`python
import pandas as pd

# Dictionary se DataFrame
data = {
    'naam': ['Rahul', 'Priya', 'Arjun', 'Neha', 'Vikram'],
    'class': [10, 11, 10, 12, 11],
    'math': [85, 92, 78, 95, 88],
    'science': [90, 88, 82, 97, 85],
    'english': [75, 95, 70, 88, 80],
}

df = pd.DataFrame(data)
print(df)
print("\\nShape:", df.shape)  # (rows, columns)
print("Columns:", list(df.columns))
print("Types:\\n", df.dtypes)
\`\`\`

Output:
\`\`\`
    naam  class  math  science  english
0  Rahul     10    85       90       75
1  Priya     11    92       88       95
...
Shape: (5, 5)
\`\`\`

### Basic Operations
\`\`\`python
# Column select karo
print(df['naam'])             # Single column → Series
print(df[['naam', 'math']])   # Multiple columns → DataFrame

# Row select karo
print(df.iloc[0])             # Index by position
print(df.loc[0])              # Index by label
print(df[df['math'] > 85])    # Filter rows!

# Stats
print(df['math'].mean())      # Average
print(df['math'].max())       # Maximum
print(df.describe())          # Full stats summary
\`\`\`

### CSV File Se Load Karo
\`\`\`python
import pandas as pd

# CSV load karo
df = pd.read_csv('students.csv')

# Basic info
print(df.head(5))     # Pehle 5 rows
print(df.tail(3))     # Aakhri 3 rows
print(df.info())      # Column info + null counts
print(df.describe())  # Stats summary

# Save karo
df.to_csv('output.csv', index=False)
\`\`\``,
      codeExample: `import pandas as pd

# Sample student data banao aur analyze karo
data = {
    'naam': ['Rahul', 'Priya', 'Arjun', 'Neha', 'Vikram', 'Anjali', 'Rohan'],
    'class': [10, 11, 10, 12, 11, 12, 10],
    'math': [85, 92, 78, 95, 88, 72, 91],
    'science': [90, 88, 82, 97, 85, 78, 93],
    'english': [75, 95, 70, 88, 80, 85, 77],
}

df = pd.DataFrame(data)

# Total aur percentage calculate karo
df['total'] = df['math'] + df['science'] + df['english']
df['percentage'] = (df['total'] / 300 * 100).round(2)
df['grade'] = df['percentage'].apply(lambda x: 
    'A+' if x >= 90 else 'A' if x >= 80 else 'B' if x >= 70 else 'C')

# Results
print("=== Student Results ===")
print(df[['naam', 'total', 'percentage', 'grade']].to_string(index=False))

print(f"\\nClass Average: {df['percentage'].mean():.1f}%")
print(f"Highest: {df.loc[df['percentage'].idxmax(), 'naam']} ({df['percentage'].max():.1f}%)")
print(f"Lowest:  {df.loc[df['percentage'].idxmin(), 'naam']} ({df['percentage'].min():.1f}%)")

print("\\nClass-wise Average:")
print(df.groupby('class')['percentage'].mean().round(1))`,
      task: {
        description: 'CSV file banao (ya dict se) 20 students ki data ke saath (naam, age, gender, math, science, english, computer). Pandas se: (1) Class topper kaun hai, (2) Subject-wise average, (3) Gender-wise comparison, (4) Pass/fail count (60% passing marks), (5) Top 5 aur bottom 5 students. describe() bhi print karo.',
        expectedOutput: null,
        hint: 'df.groupby("gender")["percentage"].mean() gender comparison ke liye. df[df["percentage"] >= 60].shape[0] pass count ke liye. df.nlargest(5, "percentage") top 5 ke liye.',
      },
      quiz: [
        {
          q: 'df.iloc[2] aur df.loc[2] mein kya fark hai?',
          options: ['Koi fark nahi', 'iloc = position by number, loc = label by index', 'iloc faster hai', 'loc sirf named index ke liye'],
          correct: 1,
          explanation: 'iloc = integer location (0,1,2...), loc = label-based (jo bhi index naam ho). Default integer index pe same result aata hai.',
        },
        {
          q: 'df[df["marks"] > 80] kya karta hai?',
          options: ['marks > 80 wali rows delete karta hai', 'marks > 80 wali rows filter karke return karta hai', 'marks update karta hai', 'Count return karta hai'],
          correct: 1,
          explanation: 'Boolean masking — condition True hone par row include hoti hai. Result ek filtered DataFrame hota hai.',
        },
        {
          q: 'df.describe() kya show karta hai?',
          options: ['Column names', 'Data types', 'Statistical summary (mean, std, min, max etc)', 'Null values count'],
          correct: 2,
          explanation: 'describe() count, mean, std, min, 25%, 50%, 75%, max — saari key statistics ek saath dikhata hai.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w8-s2',
      title: 'Data Cleaning — Messy Data Fix Karna',
      emoji: '🧹',
      content: `## Data Cleaning — Real World Data ka Sabse Bada Kaam!

Real data HAMESHA messy hota hai — null values, duplicates, wrong formats, typos. Cleaning sikhna zaroori hai!

### Missing Values Handle Karna
\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'naam': ['Rahul', 'Priya', None, 'Arjun', 'Neha'],
    'age': [20, 22, 19, None, 21],
    'score': [85, None, 78, 92, None],
})

print("Null values:\\n", df.isnull().sum())
# naam     1
# age      1
# score    2

# Options:
df['score'].fillna(df['score'].mean(), inplace=True)  # Mean se fill karo
df['age'].fillna(df['age'].median(), inplace=True)    # Median se fill
df['naam'].fillna('Unknown', inplace=True)             # Default value
df.dropna()  # Null wali rows hata do (destructive!)
\`\`\`

### Duplicates Handle Karna
\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'email': ['a@x.com', 'b@x.com', 'a@x.com', 'c@x.com'],
    'naam': ['Rahul', 'Priya', 'Rahul', 'Arjun'],
})

print("Duplicates:", df.duplicated().sum())  # 1

df_clean = df.drop_duplicates()  # Remove duplicates
df_clean = df.drop_duplicates(subset=['email'])  # Email pe check karo
\`\`\`

### Data Type Conversion
\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'price': ['₹100', '₹250', '₹180', '₹320'],
    'date': ['2024-01-15', '2024-01-20', '2024-01-25', '2024-01-30'],
    'sold': ['True', 'False', 'True', 'True'],
})

# Clean aur convert karo
df['price'] = df['price'].str.replace('₹', '').astype(float)
df['date'] = pd.to_datetime(df['date'])
df['sold'] = df['sold'].map({'True': True, 'False': False})
df['month'] = df['date'].dt.month  # Month nikalo

print(df.dtypes)
print(df['price'].sum())  # Now math works!
\`\`\`

### String Cleaning
\`\`\`python
df['naam'] = df['naam'].str.strip()        # Spaces hataao
df['naam'] = df['naam'].str.title()        # Title Case
df['email'] = df['email'].str.lower()     # Lowercase
df['phone'] = df['phone'].str.replace(r'[^\\d]', '', regex=True)  # Sirf digits
\`\`\``,
      codeExample: `import pandas as pd
import numpy as np

# Messy data banao
messy_data = {
    'naam': ['  rahul  ', 'PRIYA', 'arjun', None, 'neha kumar', 'VIKRAM'],
    'email': ['Rahul@Gmail.COM', 'priya@yahoo.com', None, 'arjun@gmail.com', 'neha@gmail.com', 'vikram@gmail.com'],
    'phone': ['+91-9876543210', '87654 32109', '765.432.1098', '9000000000', None, '8888888888'],
    'age': [20, 22, None, 21, 19, 200],   # 200 = outlier!
    'score': [85, None, 78, 92, 95, 70],
}

df = pd.DataFrame(messy_data)
print("Before cleaning:")
print(df)
print("\\nIssues:", df.isnull().sum().sum(), "nulls")

# ─ Clean step by step ─
df['naam'] = df['naam'].fillna('Unknown').str.strip().str.title()
df['email'] = df['email'].fillna('').str.lower()
df['phone'] = df['phone'].fillna('').str.replace(r'[^\\d]', '', regex=True)
df['phone'] = df['phone'].str[-10:]  # Last 10 digits
df['score'] = df['score'].fillna(df['score'].mean())
df['age'] = df['age'].fillna(df['age'].median())
df.loc[df['age'] > 100, 'age'] = df['age'].median()  # Outlier fix

print("\\nAfter cleaning:")
print(df)`,
      task: {
        description: 'Ek employee dataset banao 15+ records ke saath (name, department, salary, joining_date, email, experience_years) — kuch missing values aur outliers dalo jaan bujhkar. Phir complete cleaning pipeline likho: nulls handle, duplicates remove, salary outliers (>50L) fix, dates proper format mein, email lowercase, aur clean report print karo.',
        expectedOutput: null,
        hint: 'df["salary"].quantile(0.99) se 99th percentile nikalo outlier threshold ke liye. df.loc[df["salary"] > threshold, "salary"] = df["salary"].median().',
      },
      quiz: [
        {
          q: 'df.fillna(df.mean()) kab use karna chahiye?',
          options: ['Hamesha', 'Numeric columns ke liye jahan mean meaningful ho', 'Sirf string columns ke liye', 'Kabhi nahi'],
          correct: 1,
          explanation: 'Mean se fill tab karo jab distribution roughly normal ho. Skewed data mein median better hai.',
        },
        {
          q: 'df.drop_duplicates(subset=["email"]) kya karta hai?',
          options: ['Saari duplicate rows remove karta hai', 'Sirf email column pe duplicates check karta hai', 'Email column delete karta hai', 'Duplicate emails count karta hai'],
          correct: 1,
          explanation: 'subset parameter batata hai ki duplicates kaunse columns pe check karein. Yahan sirf email match hone par duplicate maana jayega.',
        },
        {
          q: 'pd.to_datetime("2024-01-15") kya return karta hai?',
          options: ['String', 'Integer', 'Pandas Timestamp object', 'Float'],
          correct: 2,
          explanation: 'to_datetime() string ko Pandas Timestamp mein convert karta hai — phir .dt.year, .dt.month etc. use kar sakte ho.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w8-s3',
      title: 'Data Visualization — Matplotlib se Graphs Banao',
      emoji: '📊',
      content: `## Matplotlib — Data Ko Visually Dikhao!

### Install karo:
\`\`\`bash
pip install matplotlib seaborn
\`\`\`

### Basic Plots
\`\`\`python
import matplotlib.pyplot as plt
import pandas as pd

subjects = ['Math', 'Science', 'English', 'Hindi', 'CS']
scores = [85, 92, 78, 88, 95]

# Bar chart
plt.figure(figsize=(8, 5))
bars = plt.bar(subjects, scores, color=['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#4f46e5'])
plt.title('Student Score Report', fontsize=14, fontweight='bold')
plt.ylabel('Score')
plt.ylim(0, 100)

# Value labels on bars
for bar, score in zip(bars, scores):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             str(score), ha='center', fontsize=10)

plt.tight_layout()
plt.savefig('scores.png')  # Save karo
plt.show()
\`\`\`

### Line Chart — Trends Dikhao
\`\`\`python
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
users = [1200, 1450, 1800, 2100, 2800, 3500]

plt.figure(figsize=(10, 5))
plt.plot(months, users, 'o-', color='#6366f1', linewidth=2, markersize=8)
plt.fill_between(months, users, alpha=0.1, color='#6366f1')
plt.title('Monthly User Growth')
plt.ylabel('Users')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
\`\`\`

### Pie Chart, Histogram, Scatter
\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Pie chart
labels = ['A+', 'A', 'B', 'C', 'F']
sizes = [15, 30, 35, 15, 5]
axes[0].pie(sizes, labels=labels, autopct='%1.0f%%')
axes[0].set_title('Grade Distribution')

# Histogram
scores = np.random.normal(75, 10, 100)
axes[1].hist(scores, bins=15, color='#6366f1', edgecolor='white')
axes[1].set_title('Score Distribution')

# Scatter plot
x = np.random.randint(60, 100, 50)
y = x + np.random.randint(-10, 10, 50)
axes[2].scatter(x, y, color='#8b5cf6', alpha=0.7)
axes[2].set_title('Study Hours vs Score')

plt.tight_layout()
plt.show()
\`\`\``,
      codeExample: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Complete student analysis dashboard
data = {
    'naam': ['Rahul', 'Priya', 'Arjun', 'Neha', 'Vikram', 'Anjali', 'Rohan', 'Kavya'],
    'math': [85, 92, 78, 95, 88, 72, 91, 68],
    'science': [90, 88, 82, 97, 85, 78, 93, 75],
    'english': [75, 95, 70, 88, 80, 85, 77, 90],
}

df = pd.DataFrame(data)
df['total'] = df[['math', 'science', 'english']].sum(axis=1)
df['pct'] = (df['total'] / 300 * 100).round(1)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.suptitle('Class Performance Dashboard', fontsize=16, fontweight='bold')

# 1. Bar chart — individual scores
axes[0,0].bar(df['naam'], df['pct'], color='#6366f1', edgecolor='white')
axes[0,0].axhline(y=df['pct'].mean(), color='red', linestyle='--', label=f'Avg: {df["pct"].mean():.1f}%')
axes[0,0].set_title('Individual Percentage')
axes[0,0].legend()

# 2. Subject comparison
subjects = ['math', 'science', 'english']
avgs = [df[s].mean() for s in subjects]
axes[0,1].bar(subjects, avgs, color=['#8b5cf6', '#a78bfa', '#c4b5fd'])
axes[0,1].set_title('Subject Averages')

# 3. Distribution
axes[1,0].hist(df['pct'], bins=5, color='#6366f1', edgecolor='white')
axes[1,0].set_title('Score Distribution')

# 4. Scatter — math vs science
axes[1,1].scatter(df['math'], df['science'], color='#8b5cf6', s=100)
for _, row in df.iterrows():
    axes[1,1].annotate(row['naam'], (row['math'], row['science']), textcoords='offset points', xytext=(5,5), fontsize=8)
axes[1,1].set_title('Math vs Science')

plt.tight_layout()
plt.savefig('dashboard.png', dpi=150)
print("Dashboard saved as dashboard.png!")`,
      task: {
        description: 'Monthly sales data banao 12 mahine ka (ya CSV se load karo). Matplotlib se 4 charts banao: (1) Line chart — monthly revenue trend, (2) Bar chart — top 5 products by sales, (3) Pie chart — revenue by category, (4) Scatter — units sold vs revenue. Sab ek figure mein 2x2 grid mein — save karo PNG mein!',
        expectedOutput: null,
        hint: 'plt.subplots(2, 2, figsize=(14,10)) se grid banao. axes[0,0], axes[0,1] etc se individual plots. fig.suptitle() se overall title. plt.savefig("sales_report.png", dpi=150) se save karo.',
      },
      quiz: [
        {
          q: 'plt.savefig("chart.png") kab call karna chahiye?',
          options: ['plt.show() ke baad', 'plt.show() se pehle', 'plt.figure() ke baad', 'Koi bhi order chalega'],
          correct: 1,
          explanation: 'plt.show() ke baad figure clear ho jaata hai — savefig() hamesha show() se pehle call karo warna empty file save hogi!',
        },
        {
          q: 'plt.subplots(2, 2) kya return karta hai?',
          options: ['4 alag figures', 'Figure aur 2x2 axes array', 'Sirf axes', 'Figure aur single axes'],
          correct: 1,
          explanation: 'subplots(rows, cols) = (fig, axes) — axes ek 2D NumPy array hota hai. axes[0,0] = top-left plot.',
        },
        {
          q: 'alpha=0.7 scatter plot mein kya karta hai?',
          options: ['Point size set karta hai', '70% transparency — overlapping points visible hote hain', 'Color intensity set karta hai', 'Border width set karta hai'],
          correct: 1,
          explanation: 'alpha = opacity/transparency. 0 = completely transparent, 1 = fully opaque. 0.7 = 70% visible — overlapping points dono dikhte hain.',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w8-s4',
      title: 'Month 2 Capstone — Sales Analytics Dashboard',
      emoji: '🏆',
      content: `## Month 2 Capstone Project — Complete Data Analytics!

Month 2 ka grand finale — ek real data analytics project banao jo portfolio-worthy ho!

### Project: E-Commerce Sales Analyzer

**Dataset generate karo ya download karo:**
- 1000+ orders
- Multiple products
- Multiple customers
- 6+ months of data

### Features to Build:
\`\`\`
1. Data Loading & Cleaning
   ├── CSV load karo
   ├── Missing values handle
   └── Data types fix karo

2. Exploratory Data Analysis (EDA)
   ├── Basic stats
   ├── Data distribution
   └── Outliers identify karo

3. Business Insights
   ├── Monthly revenue trend
   ├── Top 10 products
   ├── Customer segments (RFM)
   └── Peak sales hours/days

4. Visualization Dashboard
   ├── 6-panel dashboard
   ├── Save as high-res PNG
   └── Auto-generate report
\`\`\`

### Synthetic Data Generator:
\`\`\`python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_sales_data(n=500):
    products = [('Laptop', 45000), ('Phone', 15000), ('Earbuds', 2000),
                ('Tablet', 25000), ('Watch', 8000), ('Camera', 35000)]
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']
    
    data = []
    start = datetime(2024, 1, 1)
    
    for i in range(n):
        product, base_price = random.choice(products)
        price = base_price + random.randint(-2000, 5000)
        qty = random.randint(1, 5)
        data.append({
            'order_id': f'ORD{i+1000:04d}',
            'date': start + timedelta(days=random.randint(0, 180)),
            'product': product,
            'city': random.choice(cities),
            'quantity': qty,
            'price': price,
            'revenue': price * qty,
            'customer_id': f'CUST{random.randint(1, 200):04d}',
        })
    
    return pd.DataFrame(data)

df = generate_sales_data(500)
print(df.head())
print(f"Total Revenue: ₹{df['revenue'].sum():,.0f}")
\`\`\`

**Complete karo aur screenshot share karo — +300 XP + Month 2 Badge! 🎖️**`,
      codeExample: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
import random

# Data generate karo
random.seed(42)
products = [('Laptop', 45000), ('Phone', 15000), ('Earbuds', 2000), ('Tablet', 25000)]
cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']
start = datetime(2024, 1, 1)

rows = []
for i in range(300):
    prod, price = random.choice(products)
    qty = random.randint(1, 4)
    rows.append({
        'date': start + timedelta(days=random.randint(0, 150)),
        'product': prod, 'city': random.choice(cities),
        'quantity': qty, 'revenue': price * qty,
        'customer': f'C{random.randint(1,100):03d}'
    })

df = pd.DataFrame(rows)
df['month'] = df['date'].dt.strftime('%b')
df['month_num'] = df['date'].dt.month

# Dashboard
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.suptitle('E-Commerce Analytics Dashboard', fontsize=16, fontweight='bold')

# 1. Monthly revenue
monthly = df.groupby('month_num')['revenue'].sum().reset_index()
axes[0,0].plot(monthly['month_num'], monthly['revenue']/1000, 'o-', color='#6366f1', lw=2)
axes[0,0].set_title('Monthly Revenue (₹K)'); axes[0,0].grid(alpha=0.3)

# 2. Product pie
prod_rev = df.groupby('product')['revenue'].sum()
axes[0,1].pie(prod_rev, labels=prod_rev.index, autopct='%1.0f%%')
axes[0,1].set_title('Revenue by Product')

# 3. City bar
city_rev = df.groupby('city')['revenue'].sum().sort_values()
axes[0,2].barh(city_rev.index, city_rev/1000, color='#8b5cf6')
axes[0,2].set_title('City Revenue (₹K)')

# 4. Top customers
top_cust = df.groupby('customer')['revenue'].sum().nlargest(8)
axes[1,0].bar(top_cust.index, top_cust/1000, color='#a78bfa')
axes[1,0].set_title('Top Customers (₹K)'); axes[1,0].tick_params(axis='x', rotation=45)

# 5. Quantity distribution
axes[1,1].hist(df['quantity'], bins=4, color='#6366f1', edgecolor='white', rwidth=0.8)
axes[1,1].set_title('Quantity Distribution')

# 6. Product quantity
prod_qty = df.groupby('product')['quantity'].sum()
axes[1,2].bar(prod_qty.index, prod_qty, color=['#6366f1','#8b5cf6','#a78bfa','#c4b5fd'])
axes[1,2].set_title('Units Sold by Product')

plt.tight_layout()
plt.savefig('ecommerce_dashboard.png', dpi=150, bbox_inches='tight')
print(f"Dashboard saved! Total Revenue: ₹{df['revenue'].sum():,.0f}")`,
      task: {
        description: 'Upar diya starter code extend karo — 6 charts wala pura dashboard complete karo PLUS ek text report generate karo: "Top selling product: X with ₹Y revenue. Best city: Z. Busiest month: M. Total orders: N. Average order value: ₹P." Ye sab automatically calculate hone chahiye data se!',
        expectedOutput: null,
        hint: 'df["revenue"].sum() total. df.groupby("product")["revenue"].sum().idxmax() top product. df.groupby("month_num")["revenue"].sum().idxmax() busiest month. df["revenue"].mean() avg order value.',
      },
      quiz: [
        {
          q: 'df.groupby("city")["revenue"].sum() kya karta hai?',
          options: ['City column sum karta hai', 'Har city ke total revenue calculate karta hai', 'City se filter karta hai', 'City count karta hai'],
          correct: 1,
          explanation: 'groupby() data ko groups mein split karta hai, phir .sum() har group ki revenue add karta hai — result: city → total revenue.',
        },
        {
          q: '.nlargest(5) kya karta hai?',
          options: ['Top 5 smallest values', 'Top 5 largest values wali rows', 'Column ko sort karta hai', '5 random rows'],
          correct: 1,
          explanation: '.nlargest(n) top n largest values return karta hai — top customers, best products dhundhne ke liye perfect.',
        },
        {
          q: 'figsize=(16, 10) plt.subplots mein kya set karta hai?',
          options: ['Resolution DPI', 'Figure width aur height in inches', 'Subplot spacing', 'Font size'],
          correct: 1,
          explanation: 'figsize=(width, height) inches mein figure ka physical size set karta hai. Bada figsize = clearer charts jab save karo.',
        },
      ],
    },
  ],
};