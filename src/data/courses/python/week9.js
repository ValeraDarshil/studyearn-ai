/**
 * StudyEarn AI — Python Week 9
 * Topic: Django Web Framework — Web Apps Banao!
 * Month 3 Start — Advanced Level
 */

export const PYTHON_WEEK_9 = {
  week: 9,
  title: 'Django — Python se Web Apps Banao',
  description: 'Django se puri website banao — backend, database, templates sab ek jagah!',
  xpReward: 220,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w9-s1',
      title: 'Django Setup aur First Project',
      emoji: '🌐',
      content: `## Django — Python ka #1 Web Framework!

Instagram, Pinterest, Disqus — sab Django se bane hain. Seekho kaise!

### Install karo:
\`\`\`bash
pip install django
django-admin --version  # Version check
\`\`\`

### Naya Project Banao:
\`\`\`bash
django-admin startproject myblog
cd myblog
python manage.py runserver
# Browser mein kholo: http://127.0.0.1:8000
\`\`\`

### Django Project Structure:
\`\`\`
myblog/
├── manage.py          ← Commands run karne ka tool
├── myblog/
│   ├── settings.py    ← Saari settings yahan
│   ├── urls.py        ← URL routing
│   ├── wsgi.py        ← Deployment ke liye
│   └── asgi.py
\`\`\`

### Pehla App Banao:
\`\`\`bash
python manage.py startapp posts
\`\`\`

App structure:
\`\`\`
posts/
├── models.py     ← Database tables
├── views.py      ← Logic (what to show)
├── urls.py       ← App-level URL routes
├── admin.py      ← Admin panel config
└── templates/    ← HTML files
\`\`\`

### settings.py mein App Register Karo:
\`\`\`python
# myblog/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    # ... existing apps
    'posts',  # ← yeh add karo
]
\`\`\`

### Django ka MVT Pattern:
\`\`\`
Request → URL → View → Model (DB) → Template → Response
\`\`\`

- **Model** — Database ka structure
- **View** — Logic (Python function/class)
- **Template** — HTML jo user ko dikhta hai`,
      codeExample: `# posts/views.py — Pehla view banao
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return HttpResponse("<h1>Welcome to My Blog! 🎉</h1>")

def about(request):
    context = {
        'name': 'Rahul Kumar',
        'skills': ['Python', 'Django', 'React'],
        'experience': 2,
    }
    return render(request, 'posts/about.html', context)

# posts/urls.py — URL routing
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
]

# myblog/urls.py — Main URL file mein include karo
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls')),  # posts app ke URLs
]`,
      task: {
        description: 'Django project banao "mystudysite" naam se. Ek app "pages" banao. Teen pages create karo: home (welcome message + tumhara naam), about (tumhari info), contact (fake contact form HTML). Teeno ke liye proper views aur URLs setup karo. Server run karo aur browser mein check karo!',
        expectedOutput: null,
        hint: 'django-admin startproject mystudysite → cd mystudysite → python manage.py startapp pages → settings.py mein "pages" add karo → views.py mein functions banao → urls.py setup karo.',
      },
      quiz: [
        {
          q: 'Django mein naya app create karne ka command kya hai?',
          options: ['django-admin createapp', 'python manage.py startapp', 'django new app', 'pip install app'],
          correct: 1,
          explanation: 'python manage.py startapp appname — manage.py Django ka management tool hai jo saari commands handle karta hai.',
        },
        {
          q: 'Django ka MVT pattern mein V kya stand karta hai?',
          options: ['Variable', 'View', 'Virtual', 'Version'],
          correct: 1,
          explanation: 'MVT = Model (database), View (logic), Template (HTML). MVC ka Django version hai — Controller ki jagah View hai.',
        },
        {
          q: 'render(request, template, context) mein context kya hai?',
          options: ['URL ka naam', 'Python dict jo template ko data bhejta hai', 'Database query', 'HTTP method'],
          correct: 1,
          explanation: 'context ek Python dict hai — iske keys template mein variables ban jaate hain. {"naam": "Rahul"} → template mein {{ naam }} se access.',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w9-s2',
      title: 'Django Models — Database Tables Python Se',
      emoji: '🗄️',
      content: `## Models — SQL Likhe Bina Database Use Karo!

Django mein Python class likhte hain — Django khud SQL banata hai!

### Model Define Karna:
\`\`\`python
# posts/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']  # Newest first
\`\`\`

### Migration — DB Table Banao:
\`\`\`bash
python manage.py makemigrations  # Changes detect karo
python manage.py migrate         # Database mein apply karo
\`\`\`

### Django ORM — Python se DB Queries:
\`\`\`python
from posts.models import Post

# CREATE
post = Post.objects.create(
    title="Mera pehla post",
    content="Django bahut maza deta hai!",
    author="Rahul",
    is_published=True,
)

# READ — saare posts
all_posts = Post.objects.all()

# FILTER
published = Post.objects.filter(is_published=True)
rahul_posts = Post.objects.filter(author="Rahul")
recent = Post.objects.filter(views__gte=100)  # views >= 100

# GET single post
post = Post.objects.get(id=1)
# .get() raises exception if not found — use carefully!

# UPDATE
Post.objects.filter(id=1).update(views=500)

# DELETE
Post.objects.filter(is_published=False).delete()

# ORDER & LIMIT
top_posts = Post.objects.order_by('-views')[:5]
\`\`\`

### Field Types:
| Field | Use |
|-------|-----|
| CharField | Short text (max_length required) |
| TextField | Long text |
| IntegerField | Numbers |
| BooleanField | True/False |
| DateTimeField | Date + time |
| ForeignKey | Relationship |
| ImageField | Image upload |`,
      codeExample: `# posts/models.py — Blog models
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='posts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

# posts/views.py — ORM use karo
from django.shortcuts import render
from .models import Post, Category

def post_list(request):
    posts = Post.objects.filter(is_published=True)
    categories = Category.objects.all()
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': categories,
    })

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    post.views += 1
    post.save()
    return render(request, 'posts/detail.html', {'post': post})`,
      task: {
        description: 'Blog ke liye 3 models banao: Category (name, description), Post (title, content, author, category FK, created_at, is_published, views), Comment (post FK, author_name, text, created_at). Migrations run karo. Phir Django shell mein (python manage.py shell) 3 categories, 5 posts, kuch comments create karo aur ORM se filter/query karo!',
        expectedOutput: null,
        hint: 'python manage.py makemigrations → python manage.py migrate → python manage.py shell → from posts.models import Post → Post.objects.create(...)',
      },
      quiz: [
        {
          q: 'makemigrations aur migrate mein kya fark hai?',
          options: ['Koi fark nahi', 'makemigrations = changes detect, migrate = DB mein apply', 'makemigrations = DB banata hai', 'migrate = Python file banata hai'],
          correct: 1,
          explanation: 'makemigrations models.py mein changes dekh ke migration files banata hai. migrate un files ko actually database pe apply karta hai.',
        },
        {
          q: 'Post.objects.filter(views__gte=100) kya return karta hai?',
          options: ['Exactly 100 views wale posts', '100 se kam views wale', '100 ya zyada views wale posts', 'Views == 100 wale'],
          correct: 2,
          explanation: '__gte = greater than or equal to. Django ORM mein double underscore (__) field lookups ke liye use hota hai.',
        },
        {
          q: 'ForeignKey mein on_delete=models.CASCADE kya karta hai?',
          options: ['Parent delete hone par child bhi delete ho jaata hai', 'Parent protect hota hai', 'Child NULL ho jaata hai', 'Error aata hai'],
          correct: 0,
          explanation: 'CASCADE = parent (Category) delete karo toh saare related posts bhi delete ho jaayenge. SET_NULL = posts remain but category NULL ho jaati hai.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w9-s3',
      title: 'Django Templates aur Admin Panel',
      emoji: '🎨',
      content: `## Templates — Django ka HTML Engine!

### Template Setup:
\`\`\`python
# settings.py mein TEMPLATES config:
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],  # Global templates folder
    'APP_DIRS': True,  # App ke templates/ folder bhi dhundho
    ...
}]
\`\`\`

Folder structure:
\`\`\`
myblog/
└── templates/
    └── base.html          ← Base template
posts/
└── templates/
    └── posts/
        ├── list.html      ← Post list
        └── detail.html    ← Single post
\`\`\`

### Base Template (base.html):
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Blog{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">Home</a>
        <a href="{% url 'post_list' %}">Blog</a>
    </nav>

    <main>
        {% block content %}
        {% endblock %}
    </main>
</body>
</html>
\`\`\`

### Child Template:
\`\`\`html
{% extends 'base.html' %}

{% block title %}All Posts{% endblock %}

{% block content %}
<h1>Blog Posts</h1>

{% for post in posts %}
<div class="post-card">
    <h2>{{ post.title }}</h2>
    <p>By {{ post.author }} | {{ post.created_at|date:"d M Y" }}</p>
    <p>{{ post.content|truncatewords:30 }}</p>
    <a href="{% url 'post_detail' post.pk %}">Read More</a>
</div>
{% empty %}
<p>Koi post nahi hai abhi.</p>
{% endfor %}
{% endblock %}
\`\`\`

### Django Template Tags:
\`\`\`
{{ variable }}            ← Variable print karo
{% if condition %}        ← If condition
{% for item in list %}    ← Loop
{% url 'view_name' %}     ← URL generate karo
{{ text|truncatewords:20 }} ← Filter — first 20 words
{{ date|date:"d M Y" }}   ← Date format
\`\`\`

### Django Admin — Free Admin Panel!
\`\`\`python
# posts/admin.py
from django.contrib import admin
from .models import Post, Category

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'is_published', 'views']
    list_filter = ['is_published', 'category']
    search_fields = ['title', 'content']

admin.site.register(Category)
\`\`\`

\`\`\`bash
python manage.py createsuperuser  # Admin user banao
# http://127.0.0.1:8000/admin/  ← Admin panel
\`\`\``,
      codeExample: `# Pura blog app with templates

# posts/views.py
from django.shortcuts import render, get_object_or_404
from .models import Post, Category

def post_list(request):
    category_slug = request.GET.get('category')
    posts = Post.objects.filter(is_published=True)
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': Category.objects.all(),
        'current_category': category_slug,
    })

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk, is_published=True)
    post.views += 1
    post.save()
    related = Post.objects.filter(
        category=post.category,
        is_published=True
    ).exclude(pk=pk)[:3]
    return render(request, 'posts/detail.html', {
        'post': post,
        'related_posts': related,
    })

# posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
]`,
      task: {
        description: 'Pura blog banao with templates: base.html (navbar with links), list.html (saare posts cards mein, category filter), detail.html (full post + related posts). Admin mein superuser banao aur kuch posts add karo. CSS bhi add karo — simple styling se achha dikhana chahiye!',
        expectedOutput: null,
        hint: 'templates/ folder project root mein banao. settings.py mein DIRS mein add karo. base.html mein {% block content %}{% endblock %} rakho. Child templates mein {% extends "base.html" %} use karo.',
      },
      quiz: [
        {
          q: 'Django template mein URL generate karne ka tarika?',
          options: ['"http://localhost/post/1"', '{% url "post_detail" post.pk %}', '{{ url post_detail }}', 'href="/post/1"'],
          correct: 1,
          explanation: '{% url "view_name" args %} Django ka URL tag hai — hardcode mat karo, views ke naam se URL generate karo. URL change ho toh sab jagah automatically update hoga.',
        },
        {
          q: 'get_object_or_404(Post, pk=pk) kya karta hai?',
          options: ['Post create karta hai', 'Post dhundta hai, nahi mila toh 404 page dikhata hai', 'Saare posts return karta hai', 'Post delete karta hai'],
          correct: 1,
          explanation: 'get_object_or_404 = Post.objects.get() wrapper — object nahi mila toh Http404 exception raise karta hai jo 404 page dikhata hai.',
        },
        {
          q: '{{ post.content|truncatewords:30 }} kya karta hai?',
          options: ['Content ka 30th word show karta hai', 'Content ke pehle 30 words show karta hai', 'Content 30 chars tak trim karta hai', 'Content 30 baar repeat karta hai'],
          correct: 1,
          explanation: 'truncatewords:30 filter content ke pehle 30 words dikhata hai aur "..." add karta hai — preview ke liye perfect!',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w9-s4',
      title: 'Week 9 Project — Django Blog with Forms',
      emoji: '🏆',
      content: `## Week 9 Project — Full Featured Blog!

Ab ek complete blog banao — forms, user input, database — sab kuch!

### Django Forms:
\`\`\`python
# posts/forms.py
from django import forms
from .models import Post, Comment

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content', 'category', 'is_published']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Post ka title...'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 8
            }),
        }

class CommentForm(forms.Form):
    author_name = forms.CharField(max_length=100, label='Aapka Naam')
    text = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}))
\`\`\`

### Form View (POST handle karna):
\`\`\`python
from django.shortcuts import redirect
from .forms import PostForm

def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'posts/create.html', {'form': form})
\`\`\`

### Template mein Form:
\`\`\`html
<form method="post">
    {% csrf_token %}  <!-- Security! Zaroor likhna hai -->
    {{ form.as_p }}   <!-- Automatic form render -->
    <button type="submit">Post Publish Karo</button>
</form>
\`\`\`

### Project Final Features:
1. Post list (home page)
2. Post detail with comment section
3. New post create form
4. Category filter
5. Search (title mein keyword)
6. Admin panel
7. Basic CSS styling

**Complete karo — +300 XP + Month 3 Week 1 Badge! 🏆**`,
      codeExample: `# Complete blog views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from .models import Post, Category, Comment
from .forms import PostForm, CommentForm

def post_list(request):
    query = request.GET.get('q', '')
    category_slug = request.GET.get('category', '')
    posts = Post.objects.filter(is_published=True)
    if query:
        posts = posts.filter(Q(title__icontains=query) | Q(content__icontains=query))
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    return render(request, 'posts/list.html', {
        'posts': posts,
        'categories': Category.objects.all(),
        'query': query,
    })

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.views += 1
    post.save()
    comments = post.comments.all()
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            Comment.objects.create(
                post=post,
                author_name=form.cleaned_data['author_name'],
                text=form.cleaned_data['text'],
            )
            return redirect('post_detail', pk=pk)
    else:
        form = CommentForm()
    return render(request, 'posts/detail.html', {
        'post': post, 'comments': comments, 'form': form
    })

def create_post(request):
    form = PostForm(request.POST or None)
    if form.is_valid():
        post = form.save()
        return redirect('post_detail', pk=post.pk)
    return render(request, 'posts/create.html', {'form': form})`,
      task: {
        description: 'Upar ka complete blog banao with: (1) Post list page with search bar aur category filter, (2) Post detail page with comment form, (3) New post create page, (4) Admin panel mein saari models registered. CSS se cards, buttons properly style karo. 5 real posts add karo content ke saath!',
        expectedOutput: null,
        hint: 'Q objects OR search ke liye: Q(title__icontains=q) | Q(content__icontains=q). Comments ke liye Post model mein related_name="comments" set karo ForeignKey mein.',
      },
      quiz: [
        {
          q: 'Django forms mein {% csrf_token %} kyun zaroori hai?',
          options: ['Form styling ke liye', 'Cross-Site Request Forgery attacks se bachane ke liye', 'Form validation ke liye', 'Database connection ke liye'],
          correct: 1,
          explanation: 'CSRF token security feature hai — bina iske koi bhi site tumhare users ki taraf se form submit kar sakti hai. Django isko automatically validate karta hai.',
        },
        {
          q: 'form.is_valid() ke baad form.cleaned_data kya hota hai?',
          options: ['Original form data', 'Validated aur cleaned Python data dict', 'Empty dict', 'Database object'],
          correct: 1,
          explanation: 'cleaned_data form fields ki validated values ka dict hai — strings properly typed, dates datetime objects etc. is_valid() ke baad hi accessible hota hai.',
        },
        {
          q: 'Q(title__icontains=q) | Q(content__icontains=q) kya karta hai?',
          options: ['Title AND content dono mein search', 'Title OR content mein search (case-insensitive)', 'Exact match search', 'Sirf title search'],
          correct: 1,
          explanation: 'Q objects complex queries ke liye. | = OR, & = AND. __icontains = case-insensitive "contains" search.',
        },
      ],
    },
  ],
};