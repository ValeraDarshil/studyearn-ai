/**
 * StudyEarn AI — Python Week 7
 * Topic: APIs — Real World Data Connect Karna
 */

export const PYTHON_WEEK_7 = {
  week: 7,
  title: 'APIs — Real World Data Se Connect Karo',
  description: 'Weather, news, maps, payments — sab APIs se milta hai. Seekho kaise use karte hain!',
  xpReward: 180,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w7-s1',
      title: 'API kya hai — REST APIs Basics',
      emoji: '🔌',
      content: `## APIs — Internet ka Power Socket!

API = Application Programming Interface. Matlab ek website/service ka "backdoor" jo data deta hai — seedha code se!

### Real Life Analogy
Restaurant mein waiter API jaisa hai:
- Tum (client) food order karte ho
- Waiter (API) kitchen (server) se request le jaata hai
- Kitchen data wapas bhejta hai
- Waiter (API) tumhe result deta hai

### REST API — Sabse Common Type
\`\`\`
GET    /api/users        → Saare users
GET    /api/users/5      → User ID 5
POST   /api/users        → Naya user banao
PUT    /api/users/5      → User 5 update karo
DELETE /api/users/5      → User 5 delete karo
\`\`\`

### Free APIs — Bina Registration Ke
\`\`\`python
import requests

# Open Trivia DB — Free quiz questions
resp = requests.get("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
data = resp.json()
questions = data['results']

for q in questions:
    print("Q:", q['question'][:60])
    print("A:", q['correct_answer'])
    print()
\`\`\`

### API Key — Protected APIs
Kuch APIs ke liye registration + key chahiye:
\`\`\`python
import requests
import os

# .env file se API key lo (hardcode mat karo!)
API_KEY = os.getenv('OPENWEATHER_KEY', 'your_key_here')

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        'q': 'Mumbai',
        'appid': API_KEY,
        'units': 'metric',
    }
)
data = resp.json()
print(f"Mumbai temp: {data['main']['temp']}°C")
\`\`\`

### Query Parameters
\`\`\`python
# Manually
url = "https://api.example.com/search?q=python&page=1&limit=10"

# params dict se (cleaner!)
resp = requests.get(
    "https://api.example.com/search",
    params={'q': 'python', 'page': 1, 'limit': 10}
)
# requests automatically URL encode karega
\`\`\``,
      codeExample: `import requests

def get_trivia_quiz(category=18, difficulty='medium', amount=5):
    """
    Free trivia API se quiz questions fetch karo
    Category 18 = Science & Computers
    Categories: 9=General, 18=Science, 23=History, 27=Animals
    """
    url = "https://opentdb.com/api.php"
    params = {
        'amount': amount,
        'category': category,
        'difficulty': difficulty,
        'type': 'multiple',
    }
    
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        
        if data['response_code'] != 0:
            print("API Error:", data['response_code'])
            return []
        
        return data['results']
    except Exception as e:
        print(f"Error: {e}")
        return []

def play_quiz():
    print("Fetching Computer Science Quiz...\\n")
    questions = get_trivia_quiz(category=18, amount=3)
    
    score = 0
    for i, q in enumerate(questions, 1):
        print(f"Q{i}: {q['question']}")
        options = q['incorrect_answers'] + [q['correct_answer']]
        import random
        random.shuffle(options)
        for j, opt in enumerate(options, 1):
            print(f"  {j}. {opt}")
        
        answer = input("Your answer (1-4): ").strip()
        try:
            if options[int(answer)-1] == q['correct_answer']:
                print("Correct! +10 XP\\n")
                score += 10
            else:
                print(f"Wrong! Answer: {q['correct_answer']}\\n")
        except:
            print("Invalid input\\n")
    
    print(f"Final Score: {score}/30")

play_quiz()`,
      task: {
        description: 'https://restcountries.com/v3.1/all se saari countries fetch karo. Phir interactive menu banao: (1) Country by name search, (2) Countries by continent filter, (3) Top 10 most populated, (4) Top 10 largest area, (5) Countries with specific currency. Data ek baar fetch karo aur cache karo!',
        expectedOutput: null,
        hint: 'Pehle data fetch karke countries list mein store karo. Phir while True menu loop chalao. sorted() mein key=lambda c: c["population"] use karo.',
      },
      quiz: [
        {
          q: 'REST API mein GET request kab use karte hain?',
          options: ['Data create karne ke liye', 'Data fetch/read karne ke liye', 'Data delete karne ke liye', 'Data update karne ke liye'],
          correct: 1,
          explanation: 'GET = data read/fetch karna. POST = create, PUT = update, DELETE = delete — CRUD operations.',
        },
        {
          q: 'API key ko code mein hardcode kyun nahi karna chahiye?',
          options: ['Key kam hogi', 'Security risk — koi bhi dekh sakta hai', 'Slow ho jaata hai', 'API kaam nahi karti'],
          correct: 1,
          explanation: 'Hardcoded key GitHub pe ya kaheen bhi leak ho sakti hai — os.getenv() se environment variable se load karo.',
        },
        {
          q: 'requests.get(url, params={"q": "python"}) kya karta hai?',
          options: ['POST request bhejta hai', 'URL mein ?q=python append karta hai', 'Headers set karta hai', 'Timeout set karta hai'],
          correct: 1,
          explanation: 'params dict automatically URL-encoded query string ban jaata hai: url?q=python',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w7-s2',
      title: 'JSON Deep Dive — Complex Data Handle Karna',
      emoji: '📦',
      content: `## JSON — API ka Language!

Almost saari modern APIs JSON mein data bhejti hain. Deeply samjho!

### Nested JSON Navigate Karna
\`\`\`python
import requests

resp = requests.get("https://api.github.com/repos/python/cpython")
repo = resp.json()

# Nested data access
print("Name:", repo['name'])
print("Stars:", repo['stargazers_count'])
print("Language:", repo['language'])
print("Owner:", repo['owner']['login'])          # Nested!
print("Topics:", repo.get('topics', []))          # Safe access
print("Homepage:", repo.get('homepage', 'None'))
\`\`\`

### JSON List of Objects
\`\`\`python
import requests

# GitHub Python org ke saare public repos
resp = requests.get("https://api.github.com/orgs/python/repos?per_page=10")
repos = resp.json()  # List of repo objects

for repo in repos:
    stars = repo.get('stargazers_count', 0)
    print(f"{repo['name']:30} ⭐ {stars:6,}")
\`\`\`

### Error Handling — API Responses
\`\`\`python
import requests

def safe_api_call(url, params=None):
    try:
        resp = requests.get(url, params=params, timeout=10)
        
        # HTTP errors check karo
        resp.raise_for_status()  # 4xx/5xx pe exception
        
        data = resp.json()
        
        # API-level errors check karo
        if isinstance(data, dict) and data.get('error'):
            raise ValueError(f"API Error: {data['error']}")
        
        return data
        
    except requests.HTTPError as e:
        print(f"HTTP Error: {e.response.status_code}")
        return None
    except requests.Timeout:
        print("Request timed out!")
        return None
    except requests.JSONDecodeError:
        print("Invalid JSON response!")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

data = safe_api_call("https://api.github.com/users/gvanrossum")
if data:
    print("Python creator followers:", data['followers'])
\`\`\`

### Caching — Baar Baar API Call Mat Karo
\`\`\`python
import json, time, os

def get_cached_data(cache_file, fetch_func, max_age=3600):
    """Cache se data lo, expire hone par refresh karo"""
    if os.path.exists(cache_file):
        with open(cache_file) as f:
            cached = json.load(f)
        age = time.time() - cached['timestamp']
        if age < max_age:
            print(f"Cache hit! ({int(age)}s old)")
            return cached['data']
    
    print("Fetching fresh data...")
    data = fetch_func()
    with open(cache_file, 'w') as f:
        json.dump({'timestamp': time.time(), 'data': data}, f)
    return data
\`\`\``,
      codeExample: `import requests
import json

def explore_github_user(username):
    """GitHub user ka full profile explore karo"""
    
    base = "https://api.github.com"
    
    # User info
    user = requests.get(f"{base}/users/{username}", timeout=10).json()
    print(f"\\n{'='*50}")
    print(f"  {user.get('name', username)} (@{username})")
    print(f"{'='*50}")
    print(f"Bio: {user.get('bio', 'No bio')}")
    print(f"Location: {user.get('location', 'Unknown')}")
    print(f"Public Repos: {user.get('public_repos', 0)}")
    print(f"Followers: {user.get('followers', 0):,}")
    print(f"Following: {user.get('following', 0):,}")
    
    # Top repos
    repos = requests.get(
        f"{base}/users/{username}/repos",
        params={'sort': 'stars', 'per_page': 5},
        timeout=10
    ).json()
    
    if isinstance(repos, list) and repos:
        print(f"\\nTop 5 Repos (by stars):")
        for r in sorted(repos, key=lambda x: x.get('stargazers_count', 0), reverse=True)[:5]:
            lang = r.get('language', '—')
            stars = r.get('stargazers_count', 0)
            print(f"  {r['name']:25} {lang:12} ⭐{stars:,}")

explore_github_user("gvanrossum")  # Python ka creator!`,
      task: {
        description: 'Weather Dashboard banao using OpenWeatherMap FREE API (api.openweathermap.org — free account banao, 60 calls/minute free). 5 Indian cities ka weather fetch karo: Mumbai, Delhi, Bangalore, Chennai, Kolkata. Table format mein show karo: city, temp, feels_like, humidity, weather description, wind speed.',
        expectedOutput: null,
        hint: 'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric. data["main"]["temp"], data["weather"][0]["description"], data["wind"]["speed"].',
      },
      quiz: [
        {
          q: 'resp.raise_for_status() kya karta hai?',
          options: ['Status code print karta hai', '4xx/5xx codes pe exception raise karta hai', 'Response validate karta hai', '200 check karta hai'],
          correct: 1,
          explanation: 'raise_for_status() HTTP error codes (400-599) pe HTTPError exception raise karta hai — manually check nahi karna padta.',
        },
        {
          q: 'Caching kyun useful hai APIs ke saath?',
          options: ['Code fast hota hai', 'API rate limits se bachao + offline support', 'Data accurate hota hai', 'Security badhti hai'],
          correct: 1,
          explanation: 'Har baar API call karne se rate limit hit ho sakta hai. Cache se same data baar baar API call kiye bina mile!',
        },
        {
          q: 'data.get("key", default) aur data["key"] mein kya fark?',
          options: ['Koi fark nahi', 'get() KeyError nahi deta, default return karta hai', 'data["key"] faster hai', 'get() sirf nested keys ke liye'],
          correct: 1,
          explanation: '.get() key na milne par default value return karta hai (None by default) — crash nahi hota. API responses mein hamesha .get() use karo!',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w7-s3',
      title: 'POST Requests — Data Bhejo APIs Ko',
      emoji: '📤',
      content: `## POST Requests — APIs Ko Data Bhejo!

GET se data milta hai, POST se data bhejte hain (create karne ke liye).

### Basic POST Request
\`\`\`python
import requests

# httpbin.org ek testing API hai
resp = requests.post(
    "https://httpbin.org/post",
    json={                      # Python dict automatically JSON ban jaata hai
        'naam': 'Rahul',
        'message': 'Hello API!',
        'score': 95
    }
)

data = resp.json()
print("Status:", resp.status_code)
print("Received:", data['json'])  # Echo back karta hai
\`\`\`

### Authentication Headers
\`\`\`python
import requests

# Bearer token authentication (most common)
token = "your_api_token_here"

resp = requests.get(
    "https://api.example.com/profile",
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
)
\`\`\`

### Form Data POST
\`\`\`python
import requests

# Form data (like HTML form submit)
resp = requests.post(
    "https://httpbin.org/post",
    data={                  # data= for form, json= for JSON
        'username': 'rahul',
        'password': 'secret'
    }
)
print(resp.json()['form'])
\`\`\`

### Pagination — Multiple Pages Handle Karna
\`\`\`python
import requests

def get_all_results(base_url, params=None):
    """Automatically saare pages fetch karo"""
    all_results = []
    page = 1
    
    while True:
        p = {**(params or {}), 'page': page, 'per_page': 100}
        resp = requests.get(base_url, params=p, timeout=10)
        data = resp.json()
        
        if not data:  # Empty response = no more pages
            break
        
        all_results.extend(data if isinstance(data, list) else [data])
        
        # Check if there are more pages
        if len(data) < 100:  # Got less than requested = last page
            break
        
        page += 1
    
    return all_results
\`\`\``,
      codeExample: `import requests

# Practical: GitHub API se issue create karna (agar token ho)
# Demo mode: httpbin.org se POST test karte hain

def demo_post_requests():
    print("POST Request Demo using httpbin.org\\n")
    
    # 1. JSON POST
    print("1. JSON POST:")
    resp = requests.post(
        "https://httpbin.org/post",
        json={'user': 'Rahul', 'action': 'login', 'timestamp': '2024-01-15'}
    )
    print("  Sent:", resp.json()['json'])
    print("  Status:", resp.status_code)
    
    # 2. Headers check
    print("\\n2. Custom Headers:")
    resp = requests.get(
        "https://httpbin.org/headers",
        headers={'X-Custom-Header': 'StudyEarnAI', 'X-User': 'Rahul'}
    )
    custom = resp.json()['headers']
    print("  Custom headers received:", {k: v for k, v in custom.items() if k.startswith('X-')})
    
    # 3. Query params
    print("\\n3. Query Params:")
    resp = requests.get(
        "https://httpbin.org/get",
        params={'search': 'python', 'page': 1, 'limit': 10}
    )
    print("  URL was:", resp.json()['url'])

demo_post_requests()`,
      task: {
        description: 'Apna khud ka mock REST API client banao using JSONPlaceholder (jsonplaceholder.typicode.com — free fake API). Implement karo: (1) GET all posts, (2) GET specific post by ID, (3) POST new post (fake create), (4) Filter posts by userId. Menu-driven CLI app banao!',
        expectedOutput: null,
        hint: 'Base URL: https://jsonplaceholder.typicode.com. Endpoints: /posts, /posts/{id}, /posts?userId=1. POST ke liye json={"title": ..., "body": ..., "userId": 1} bhejo.',
      },
      quiz: [
        {
          q: 'requests.post() mein json= aur data= mein kya fark?',
          options: ['Koi fark nahi', 'json= JSON bhejta hai, data= form data bhejta hai', 'json= faster hai', 'data= larger data handle karta hai'],
          correct: 1,
          explanation: 'json= Content-Type: application/json set karta hai aur dict ko JSON string mein convert karta hai. data= form-urlencoded bhejta hai.',
        },
        {
          q: 'Bearer token authentication mein token kahan bhejte hain?',
          options: ['URL mein', 'Request body mein', 'Authorization header mein', 'Cookie mein'],
          correct: 2,
          explanation: 'Bearer tokens Authorization header mein bhejte hain: headers={"Authorization": "Bearer YOUR_TOKEN"}',
        },
        {
          q: 'API rate limiting se bachne ka best tarika?',
          options: ['Zyada servers use karo', 'Cache karo + requests ke beech delay rakho', 'Faster internet use karo', 'API key share karo'],
          correct: 1,
          explanation: 'Caching se repeat calls avoid karo, time.sleep() se requests throttle karo — responsible API usage.',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w7-s4',
      title: 'Week 7 Project — News Aggregator',
      emoji: '📰',
      content: `## Week 7 Project — Multi-Source News Aggregator!

Real news APIs se data fetch karke ek aggregator banao!

### Free News APIs:
1. **NewsAPI.org** — Free tier: 100 requests/day, account required
2. **GNews API** — Free: 10 requests/day
3. **TheNewsAPI** — Free tier available

### Project Features:
1. Multiple categories (tech, sports, business, science)
2. Country-wise news (India focus)
3. Keyword search
4. Top headlines
5. Article summary (first 200 chars)
6. Save favorites to JSON file
7. Read later list

### Architecture:
\`\`\`python
class NewsAggregator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2"
        self.saved_articles = self._load_saved()
    
    def get_top_headlines(self, country='in', category=None): ...
    def search_news(self, query, from_date=None): ...
    def get_sources(self, category=None, country='in'): ...
    def save_article(self, article): ...
    def display_articles(self, articles, limit=5): ...
    def interactive_menu(self): ...
\`\`\`

### Alternate: Free Public APIs
Agar signup nahi karna toh:
\`\`\`python
# Hacker News API — completely free!
top_stories = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json")
story_ids = top_stories.json()[:10]

for sid in story_ids:
    story = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json")
    s = story.json()
    print(f"{s.get('title')} ({s.get('score')} points)")
\`\`\`

**Complete karo — +250 XP! 🔥**`,
      codeExample: `import requests
import json
from datetime import datetime

class HackerNewsReader:
    """Hacker News API — Completely Free, No Key!"""
    BASE = "https://hacker-news.firebaseio.com/v0"
    
    def get_top_stories(self, limit=10):
        ids = requests.get(f"{self.BASE}/topstories.json", timeout=10).json()
        stories = []
        for sid in ids[:limit]:
            s = requests.get(f"{self.BASE}/item/{sid}.json", timeout=10).json()
            if s and s.get('title'):
                stories.append({
                    'id': sid,
                    'title': s.get('title', 'No title'),
                    'score': s.get('score', 0),
                    'by': s.get('by', 'unknown'),
                    'url': s.get('url', f'https://news.ycombinator.com/item?id={sid}'),
                    'comments': s.get('descendants', 0),
                })
        return sorted(stories, key=lambda x: x['score'], reverse=True)
    
    def display(self, stories):
        print(f"\\nHacker News — Top Stories ({datetime.now().strftime('%H:%M')})")
        print("=" * 65)
        for i, s in enumerate(stories, 1):
            print(f"\\n{i}. {s['title']}")
            print(f"   Score: {s['score']} | By: {s['by']} | Comments: {s['comments']}")
            print(f"   {s['url'][:60]}...")

hn = HackerNewsReader()
stories = hn.get_top_stories(limit=5)
hn.display(stories)`,
      task: {
        description: 'Hacker News se complete news app banao: (1) Top stories fetch karo, (2) Best stories fetch karo, (3) Search karo title mein keyword se, (4) Story ke comments count dekho, (5) Favorites JSON mein save karo. Interactive menu wala CLI app banana hai!',
        expectedOutput: null,
        hint: 'Endpoints: /topstories.json, /beststories.json, /newstories.json. Har story ka full data /item/{id}.json se milta hai. Search ke liye [s for s in stories if keyword.lower() in s["title"].lower()] use karo.',
      },
      quiz: [
        {
          q: 'Free public API use karne ka faida kya hai?',
          options: ['Zyada data milta hai', 'Registration nahi chahiye aur koi cost nahi', 'Faster response time', 'Better security'],
          correct: 1,
          explanation: 'Free public APIs jaise Hacker News, JSONPlaceholder, Open Trivia DB — no signup, no key, just use karo — practice ke liye perfect!',
        },
        {
          q: 'Multiple API calls efficiently karne ka tarika?',
          options: ['Ek ek karke wait karo', 'Sirf zaroori data fetch karo aur cache karo', 'Saare calls ek saath bhejo', 'Different devices use karo'],
          correct: 1,
          explanation: 'Cache kar lo baar baar same data fetch mat karo. Rate limits respect karo. Sirf zaroori fields fetch karo — efficient API usage.',
        },
        {
          q: 'sorted(list, key=..., reverse=True) kya karta hai?',
          options: ['Ascending order', 'Random order', 'Descending order (highest first)', 'Alphabetical'],
          correct: 2,
          explanation: 'reverse=True descending order deta hai — score by descending matlab highest score pehle.',
        },
      ],
    },
  ],
};