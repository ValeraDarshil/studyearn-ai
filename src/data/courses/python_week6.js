/**
 * StudyEarn AI — Python Week 6
 * Topic: Web Scraping with requests + BeautifulSoup
 */

export const PYTHON_WEEK_6 = {
  week: 6,
  title: 'Web Scraping — Websites Se Data Nikalo',
  description: 'requests + BeautifulSoup se kisi bhi website ka data Python mein lao!',
  xpReward: 170,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w6-s1',
      title: 'requests Library — HTTP Requests Bhejo',
      emoji: '🌐',
      content: `## requests — Python se Internet Use Karo!

\`requests\` library se Python seedha internet se baat karta hai — kisi bhi website ka data fetch kar sakte ho!

### Install karo:
\`\`\`bash
pip install requests
\`\`\`

### Basic GET Request
\`\`\`python
import requests

# Website se data fetch karo
response = requests.get("https://api.github.com/users/python")

print("Status Code:", response.status_code)  # 200 = OK
print("Content Type:", response.headers['content-type'])
print("Response Size:", len(response.text), "bytes")
\`\`\`

### Status Codes Samjho
| Code | Matlab |
|------|--------|
| 200 | OK — Success! |
| 404 | Not Found |
| 403 | Forbidden — Access nahi |
| 500 | Server Error |
| 429 | Rate Limited — Slow down! |

### JSON Response Handle Karo
\`\`\`python
import requests

# GitHub API se public user data
response = requests.get("https://api.github.com/users/torvalds")

if response.status_code == 200:
    data = response.json()  # JSON → Python dict
    print("Name:", data['name'])
    print("Public Repos:", data['public_repos'])
    print("Followers:", data['followers'])
    print("Location:", data.get('location', 'Not specified'))
else:
    print(f"Error: {response.status_code}")
\`\`\`

### Headers aur Timeout
\`\`\`python
import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Python learning bot)',
    'Accept': 'application/json',
}

try:
    response = requests.get(
        "https://httpbin.org/get",
        headers=headers,
        timeout=10  # 10 second mein response nahi aaya to error
    )
    print(response.json())
except requests.Timeout:
    print("Request timed out!")
except requests.ConnectionError:
    print("Internet connection error!")
\`\`\``,
      codeExample: `import requests
import json

def fetch_joke():
    """Random programming joke fetch karo"""
    try:
        resp = requests.get(
            "https://official-joke-api.appspot.com/jokes/programming/random",
            timeout=10
        )
        if resp.status_code == 200:
            jokes = resp.json()
            joke = jokes[0] if isinstance(jokes, list) else jokes
            print("Setup:", joke['setup'])
            print("Punchline:", joke['punchline'])
        else:
            print(f"Error fetching joke: {resp.status_code}")
    except Exception as e:
        print(f"Error: {e}")
        print("(Offline hoge — internet check karo)")

def fetch_ip_info():
    """Apna public IP aur location fetch karo"""
    try:
        resp = requests.get("https://ipapi.co/json/", timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            print(f"IP: {data.get('ip')}")
            print(f"Country: {data.get('country_name')}")
            print(f"City: {data.get('city')}")
    except Exception as e:
        print(f"Error: {e}")

fetch_joke()
print()
fetch_ip_info()`,
      task: {
        description: 'Free public API use karo — https://restcountries.com/v3.1/name/{country} — user se country name lo, uska: capital, population, area, currency, languages, flag emoji print karo. Proper error handling karo agar country nahi mili toh!',
        expectedOutput: null,
        hint: 'requests.get(f"https://restcountries.com/v3.1/name/{country}"). Response ek list hai — pehla element lo [0]. Keys: capital, population, area, currencies, languages.',
      },
      quiz: [
        {
          q: 'response.status_code == 200 ka matlab?',
          options: ['Error aaya', 'Request successful', 'Not found', 'Server error'],
          correct: 1,
          explanation: 'HTTP 200 = OK — request successful raha aur response aaya.',
        },
        {
          q: 'response.json() kya return karta hai?',
          options: ['JSON string', 'Python dict/list', 'HTML text', 'Bytes'],
          correct: 1,
          explanation: '.json() JSON response ko Python dict ya list mein convert karta hai — directly use kar sakte ho.',
        },
        {
          q: 'requests.get() mein timeout=10 kya karta hai?',
          options: ['10 requests per second limit', '10 second baad request cancel', '10 retries karta hai', '10MB limit set karta hai'],
          correct: 1,
          explanation: 'timeout=10 matlab agar 10 seconds mein response nahi aaya toh Timeout exception raise hoga.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w6-s2',
      title: 'BeautifulSoup — HTML Parse Karna',
      emoji: '🍜',
      content: `## BeautifulSoup — HTML ka Matlab Nikalo!

\`requests\` se HTML fetch karo, \`BeautifulSoup\` se usme se data nikalo!

### Install karo:
\`\`\`bash
pip install beautifulsoup4 lxml
\`\`\`

### Basic HTML Parsing
\`\`\`python
from bs4 import BeautifulSoup

html = """
<html>
<body>
  <h1 id="title">StudyEarn AI</h1>
  <p class="desc">Python seekhne ki best jagah!</p>
  <ul id="features">
    <li>AI Q&A</li>
    <li>PPT Generator</li>
    <li>Code Learn</li>
  </ul>
  <a href="https://studyearnai.tech">Visit Now</a>
</body>
</html>
"""

soup = BeautifulSoup(html, 'lxml')

# Alag alag tarike se data nikalo
print(soup.find('h1').text)              # "StudyEarn AI"
print(soup.find('p', class_='desc').text) # "Python seekhne..."

# Saari list items
for li in soup.find_all('li'):
    print("-", li.text)

# Link nikalo
link = soup.find('a')
print("URL:", link['href'])
print("Text:", link.text)
\`\`\`

### CSS Selectors — Powerful Way
\`\`\`python
from bs4 import BeautifulSoup
import requests

response = requests.get("https://books.toscrape.com/")
soup = BeautifulSoup(response.text, 'lxml')

# CSS selector use karo
titles = soup.select('h3 a')          # h3 ke andar saare a tags
prices = soup.select('.price_color')  # class="price_color"
ratings = soup.select('.star-rating') # class="star-rating"

for title, price, rating in zip(titles[:5], prices[:5], ratings[:5]):
    print(f"{title['title'][:40]} | {price.text} | {rating['class'][1]}")
\`\`\`

### Important Methods
\`\`\`python
soup.find('tag')              # Pehla match
soup.find_all('tag')          # Saare matches (list)
soup.find('tag', id='xyz')    # ID se dhundho
soup.find('tag', class_='abc') # Class se (class_ — Python keyword conflict)
soup.select('div.card h2')    # CSS selector
element.text                  # Text content
element['href']               # Attribute value
element.get('src', 'default') # Safe attribute access
\`\`\``,
      codeExample: `from bs4 import BeautifulSoup
import requests

def scrape_quotes():
    """quotes.toscrape.com se quotes nikalo"""
    print("Fetching quotes...\\n")
    
    try:
        resp = requests.get("https://quotes.toscrape.com/", timeout=15)
        soup = BeautifulSoup(resp.text, 'lxml')
        
        quotes = soup.find_all('div', class_='quote')
        
        print(f"Found {len(quotes)} quotes:\\n")
        print("=" * 60)
        
        for i, quote in enumerate(quotes[:5], 1):
            text = quote.find('span', class_='text').text
            author = quote.find('small', class_='author').text
            tags = [t.text for t in quote.find_all('a', class_='tag')]
            
            print(f"\\n{i}. {text}")
            print(f"   — {author}")
            print(f"   Tags: {', '.join(tags)}")
        
        print("\\n" + "=" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        print("(quotes.toscrape.com ek practice site hai — free to scrape!)")

scrape_quotes()`,
      task: {
        description: 'https://books.toscrape.com/ se pehle 20 books scrape karo. Har book ke liye: title, price, rating (One/Two/Three/Four/Five), availability. Results ko price ke hisaab se sort karo aur print karo. Sabse sasta aur mehenga book bhi batao!',
        expectedOutput: null,
        hint: 'soup.select("article.product_pod") se books nikalo. title = article.find("h3").find("a")["title"]. price = article.select_one(".price_color").text. rating = article.find("p", class_="star-rating")["class"][1].',
      },
      quiz: [
        {
          q: 'soup.find_all("p") kya return karta hai?',
          options: ['Pehla p tag', 'Saare p tags ki list', 'p tag ka text', 'p tag ka HTML'],
          correct: 1,
          explanation: 'find_all() saare matching elements ki list return karta hai. find() sirf pehla element return karta hai.',
        },
        {
          q: 'CSS selector "div.card h2" kya select karega?',
          options: ['Saare div tags', 'class="card" wale div ke andar saare h2', 'Sirf h2 tags', 'div aur h2 dono alag alag'],
          correct: 1,
          explanation: '"div.card h2" = div element jo class "card" ho, uske andar saare h2 elements.',
        },
        {
          q: 'element["href"] aur element.get("href") mein kya fark hai?',
          options: ['Koi fark nahi', 'get() safer hai — KeyError nahi aata', '["href"] zyada fast hai', 'get() string return karta hai'],
          correct: 1,
          explanation: 'element["href"] KeyError throw karta hai agar attribute nahi mila. element.get("href") None return karta hai — crash nahi hota.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w6-s3',
      title: 'Scraping Ethics aur Advanced Techniques',
      emoji: '⚖️',
      content: `## Responsible Scraping — Sahi Tarike Se Karo!

### robots.txt — Rules Check Karo
\`\`\`python
import requests

# Hamesha pehle robots.txt check karo
resp = requests.get("https://books.toscrape.com/robots.txt")
print(resp.text)
# Agar "Disallow: /" ho toh scraping mat karo!
\`\`\`

### Rate Limiting — Server Pe Load Mat Dalo
\`\`\`python
import requests
import time
from bs4 import BeautifulSoup

def polite_scraper(urls):
    results = []
    for url in urls:
        try:
            resp = requests.get(url, timeout=10)
            soup = BeautifulSoup(resp.text, 'lxml')
            results.append(soup.title.text if soup.title else 'No title')
            time.sleep(1)  # 1 second wait — polite hai!
        except Exception as e:
            print(f"Error: {url} — {e}")
    return results
\`\`\`

### Multiple Pages Scrape Karna (Pagination)
\`\`\`python
import requests
from bs4 import BeautifulSoup
import time

all_quotes = []
page = 1

while True:
    url = f"https://quotes.toscrape.com/page/{page}/"
    resp = requests.get(url, timeout=15)
    soup = BeautifulSoup(resp.text, 'lxml')
    
    quotes = soup.find_all('div', class_='quote')
    if not quotes:
        break  # No more pages!
    
    for q in quotes:
        all_quotes.append({
            'text': q.find('span', class_='text').text,
            'author': q.find('small', class_='author').text,
        })
    
    print(f"Page {page}: {len(quotes)} quotes fetched")
    page += 1
    time.sleep(0.5)  # Polite delay
    
    if page > 3:  # Max 3 pages for practice
        break

print(f"\\nTotal quotes scraped: {len(all_quotes)}")
\`\`\`

### Data Save Karna — CSV Format
\`\`\`python
import csv

def save_to_csv(data, filename):
    if not data: return
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print(f"Saved {len(data)} records to {filename}")
\`\`\``,
      codeExample: `import requests
from bs4 import BeautifulSoup
import csv
import time

def scrape_books_to_csv(pages=2):
    """books.toscrape.com se books scrape karke CSV mein save karo"""
    all_books = []
    
    for page in range(1, pages + 1):
        url = f"https://books.toscrape.com/catalogue/page-{page}.html"
        print(f"Scraping page {page}...")
        
        try:
            resp = requests.get(url, timeout=15)
            soup = BeautifulSoup(resp.text, 'lxml')
            
            for book in soup.select('article.product_pod'):
                title = book.find('h3').find('a')['title']
                price = book.select_one('.price_color').text.strip()
                rating = book.find('p', class_='star-rating')['class'][1]
                avail = book.select_one('.availability').text.strip()
                
                all_books.append({
                    'title': title,
                    'price': price,
                    'rating': rating,
                    'availability': avail,
                })
            
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error on page {page}: {e}")
    
    # CSV mein save karo
    with open('books.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['title', 'price', 'rating', 'availability'])
        writer.writeheader()
        writer.writerows(all_books)
    
    print(f"\\nDone! {len(all_books)} books saved to books.csv")
    
    # Stats
    print(f"Five-star books: {sum(1 for b in all_books if b['rating'] == 'Five')}")

scrape_books_to_csv(pages=2)`,
      task: {
        description: 'Multi-page scraper banao: quotes.toscrape.com ke pehle 5 pages scrape karo. Har author ki saari quotes collect karo. Phir batao: (1) Sabse zyada quotes kiska hai? (2) "life" word kaunse quotes mein aata hai? (3) Sabse common tags kaunse hain (top 5)?',
        expectedOutput: null,
        hint: 'authors = {} dictionary mein author: [quotes] store karo. max(authors, key=lambda x: len(authors[x])) se top author nikalo. tags ki list banao aur Counter use karo top 5 ke liye.',
      },
      quiz: [
        {
          q: 'Web scraping mein time.sleep() kyun use karte hain?',
          options: ['Code slow karne ke liye', 'Server pe zyada load nahi dene ke liye', 'Data save karne ke liye', 'Error handle karne ke liye'],
          correct: 1,
          explanation: 'Har request ke beech delay dene se server overload nahi hota — responsible scraping ka rule hai yeh.',
        },
        {
          q: 'robots.txt file kya batati hai?',
          options: ['Website ka sitemap', 'Konse pages scrape karne allowed hain', 'Server ka password', 'HTML structure'],
          correct: 1,
          explanation: 'robots.txt = website owner ke rules — Disallow: / matlab us path ko scrape mat karo.',
        },
        {
          q: 'Pagination handle karne ka sahi approach?',
          options: ['Sirf pehla page scrape karo', 'While loop mein page number badhao aur empty page par break karo', 'Random pages scrape karo', 'Sirf last page scrape karo'],
          correct: 1,
          explanation: 'while True loop mein page increment karo, jab koi data nahi mile (empty page) tab break — yahi standard pagination approach hai.',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w6-s4',
      title: 'Week 6 Project — Price Tracker',
      emoji: '💰',
      content: `## Week 6 Project — Price Comparison Tool!

Real e-commerce jaisa price tracking tool banao!

### Target Site: books.toscrape.com
(Real sites legally scrape karne ke liye permission chahiye — practice ke liye yeh use karo)

### Features:
1. Books search karo by category
2. Price comparison (top 10 cheapest books)
3. Rating filter (sirf 4+ star books)
4. Daily price history save karo (JSON file mein)
5. Price drop alert — agar price change ho toh notify karo

### Project Structure:
\`\`\`python
import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

class PriceTracker:
    def __init__(self, base_url="https://books.toscrape.com"):
        self.base_url = base_url
        self.history_file = "price_history.json"
        self.load_history()
    
    def load_history(self): ...
    def save_history(self): ...
    def scrape_category(self, category_url): ...
    def get_cheapest(self, n=10): ...
    def filter_by_rating(self, min_rating=4): ...
    def check_price_drops(self): ...
    def generate_report(self): ...
\`\`\`

### Rating String to Number Convert:
\`\`\`python
rating_map = {
    'One': 1, 'Two': 2, 'Three': 3,
    'Four': 4, 'Five': 5
}
\`\`\`

**Complete karo — +200 XP! 🔥**`,
      codeExample: `import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

class BookPriceTracker:
    RATING_MAP = {'One':1, 'Two':2, 'Three':3, 'Four':4, 'Five':5}
    
    def __init__(self):
        self.books = []
        self.history = self._load_history()
    
    def _load_history(self):
        try:
            with open('price_history.json') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_history(self):
        with open('price_history.json', 'w') as f:
            json.dump(self.history, f, indent=2)
    
    def scrape_all(self, max_pages=3):
        for page in range(1, max_pages + 1):
            url = f"https://books.toscrape.com/catalogue/page-{page}.html"
            resp = requests.get(url, timeout=15)
            soup = BeautifulSoup(resp.text, 'lxml')
            for book in soup.select('article.product_pod'):
                title = book.find('h3').find('a')['title']
                price = float(book.select_one('.price_color').text.replace('£','').replace('Â',''))
                rating = self.RATING_MAP.get(book.find('p', class_='star-rating')['class'][1], 0)
                self.books.append({'title': title, 'price': price, 'rating': rating})
                # History update
                if title not in self.history:
                    self.history[title] = []
                self.history[title].append({'date': str(datetime.now().date()), 'price': price})
            time.sleep(0.3)
        self._save_history()
        print(f"Scraped {len(self.books)} books")
    
    def cheapest(self, n=5):
        return sorted(self.books, key=lambda x: x['price'])[:n]
    
    def top_rated(self, min_rating=4):
        return [b for b in self.books if b['rating'] >= min_rating]

tracker = BookPriceTracker()
tracker.scrape_all(max_pages=2)
print("\\nTop 5 Cheapest:")
for b in tracker.cheapest(): print(f"  £{b['price']:.2f} — {b['title'][:50]}")
print(f"\\n4+ Star Books: {len(tracker.top_rated())}")`,
      task: {
        description: 'PriceTracker complete karo — generate_report() method add karo jo: total books, avg price, price distribution (£0-10, £10-20, £20+), top 5 cheapest, top 5 highest rated — sab ek formatted report mein print kare. Aur check_price_drops() method banao jo price_history.json mein price changes dhundhe!',
        expectedOutput: null,
        hint: 'Price distribution ke liye list comprehension use karo: cheap = [b for b in books if b["price"] < 10]. Report mein f-strings se formatting karo.',
      },
      quiz: [
        {
          q: 'float(price_str.replace("£","")) kyun karte hain?',
          options: ['String ko integer banane ke liye', 'Currency symbol hatake float number banane ke liye', 'Price validate karne ke liye', 'Sorting ke liye'],
          correct: 1,
          explanation: 'Scraped price "£12.99" jaisi string hoti hai. Float ke liye currency symbol hata ke float() mein dalna padta hai.',
        },
        {
          q: 'sorted(books, key=lambda x: x["price"]) kya karta hai?',
          options: ['Books ka naam sort karta hai', 'Price ke hisaab se ascending sort karta hai', 'Rating se sort karta hai', 'Random order mein sort karta hai'],
          correct: 1,
          explanation: 'key=lambda x: x["price"] batata hai ki "price" field ko comparison ke liye use karo. Default ascending order.',
        },
        {
          q: 'try-except ke saath json.load() use karne ka faida?',
          options: ['Faster parsing', 'File na milne par crash nahi hota', 'Bada JSON handle hota hai', 'Encoding fix hoti hai'],
          correct: 1,
          explanation: 'Agar history file exist nahi karti, json.load() FileNotFoundError throw karega — try-except se gracefully handle karo aur empty dict return karo.',
        },
      ],
    },
  ],
};