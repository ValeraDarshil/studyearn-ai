/**
 * StudyEarn AI — Python Week 10
 * Topic: Machine Learning Basics — scikit-learn se AI banao!
 */

export const PYTHON_WEEK_10 = {
  week: 10,
  title: 'Machine Learning — Python se AI Banao',
  description: 'scikit-learn se real ML models banao — classification, regression, clustering!',
  xpReward: 240,
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────
    {
      id: 'py-w10-s1',
      title: 'ML kya hai — Types aur Concepts',
      emoji: '🤖',
      content: `## Machine Learning — Computer Ko Seekhna Sikhao!

ML matlab computer ko examples se sikhana — bina explicit programming ke!

### ML ke 3 Types:
\`\`\`
1. Supervised Learning   → Data + Labels se seekhna
   Examples: Spam detection, price prediction

2. Unsupervised Learning → Sirf data, khud patterns dhundho
   Examples: Customer grouping, anomaly detection

3. Reinforcement Learning → Trial & error se seekhna
   Examples: Games, robotics
\`\`\`

### Install karo:
\`\`\`bash
pip install scikit-learn numpy pandas matplotlib seaborn
\`\`\`

### Basic ML Workflow:
\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# Step 1: Data prepare karo
X = features  # Input variables
y = labels    # Output (what we want to predict)

# Step 2: Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,    # 20% test data
    random_state=42   # Reproducible results
)

# Step 3: Scale karo (normalize)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Step 4: Model train karo
model.fit(X_train, y_train)

# Step 5: Predict karo
predictions = model.predict(X_test)

# Step 6: Evaluate karo
print("Accuracy:", accuracy_score(y_test, predictions))
\`\`\`

### Pehla ML Model — Iris Flower Classification:
\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

# Famous Iris dataset
iris = load_iris()
X, y = iris.data, iris.target  # 4 features, 3 species

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# K-Nearest Neighbors classifier
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, preds)*100:.1f}%")
print(classification_report(y_test, preds, target_names=iris.target_names))
\`\`\``,
      codeExample: `from sklearn.datasets import load_iris, load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

def compare_models(dataset_name='iris'):
    # Dataset load karo
    if dataset_name == 'iris':
        data = load_iris()
    else:
        data = load_wine()

    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # Multiple models compare karo
    models = {
        'KNN (k=3)': KNeighborsClassifier(n_neighbors=3),
        'KNN (k=5)': KNeighborsClassifier(n_neighbors=5),
        'KNN (k=7)': KNeighborsClassifier(n_neighbors=7),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
    }

    print(f"\\nDataset: {dataset_name} | {len(X)} samples | {X.shape[1]} features")
    print(f"Classes: {data.target_names}")
    print(f"Train: {len(X_train)}, Test: {len(X_test)}")
    print("\\n" + "="*45)
    print(f"{'Model':<20} {'Accuracy':>10} {'Result':>10}")
    print("="*45)

    for name, model in models.items():
        model.fit(X_train_s, y_train)
        acc = accuracy_score(y_test, model.predict(X_test_s))
        bar = "█" * int(acc * 20)
        print(f"{name:<20} {acc*100:>9.1f}% {bar}")

compare_models('iris')
compare_models('wine')`,
      task: {
        description: 'Titanic-style survival prediction banao! Fake dataset generate karo (200 passengers: age, fare, class, gender → survived). RandomForestClassifier use karo. Show karo: accuracy, kaunse features important hain (feature_importances_), 5 new passengers ke survival predict karo.',
        expectedOutput: null,
        hint: 'from sklearn.ensemble import RandomForestClassifier. np.random.seed(42) se reproducible data. pd.get_dummies() se gender column encode karo. model.feature_importances_ se importance dekho.',
      },
      quiz: [
        {
          q: 'train_test_split mein test_size=0.2 ka matlab?',
          options: ['20% train, 80% test', '80% train, 20% test', '20 samples test', 'Random 20 samples'],
          correct: 1,
          explanation: 'test_size=0.2 matlab 20% data test ke liye rakho, baaki 80% training ke liye. Standard practice hai yeh.',
        },
        {
          q: 'StandardScaler kyun use karte hain?',
          options: ['Data sort karne ke liye', 'Saare features ko same scale par laane ke liye', 'Missing values fill karne ke liye', 'Labels encode karne ke liye'],
          correct: 1,
          explanation: 'Agar ek feature 0-1000 mein ho aur doosra 0-1 mein toh model bias ho jaata hai. Scaling se sab features equal importance paate hain.',
        },
        {
          q: 'scaler.fit_transform(X_train) aur scaler.transform(X_test) alag kyun?',
          options: ['Koi fark nahi', 'Test data ka scale train data se seekhna chahiye — data leakage rokne ke liye', 'Test data faster process hota hai', 'Memory save hoti hai'],
          correct: 1,
          explanation: 'fit_transform train pe scaler seekhta hai. Test pe sirf transform karo — agar test pe bhi fit karo toh future data ke baare mein "cheat" ho jaata hai (data leakage).',
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────
    {
      id: 'py-w10-s2',
      title: 'Regression — Numbers Predict Karna',
      emoji: '📈',
      content: `## Regression — Continuous Values Predict Karo!

Classification mein category predict karte hain (spam/not spam). Regression mein number predict karte hain (price, temperature).

### Linear Regression:
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# House price prediction example
np.random.seed(42)
n = 200

data = pd.DataFrame({
    'area_sqft': np.random.randint(500, 3000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'age_years': np.random.randint(0, 30, n),
    'location_score': np.random.randint(1, 10, n),
})

# Price formula (with noise)
data['price_lakhs'] = (
    data['area_sqft'] * 0.05 +
    data['bedrooms'] * 5 +
    data['location_score'] * 8 -
    data['age_years'] * 0.5 +
    np.random.normal(0, 5, n)
).round(2)

X = data.drop('price_lakhs', axis=1)
y = data['price_lakhs']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
preds = model.predict(X_test)

print(f"R² Score: {r2_score(y_test, preds):.3f}")  # 1.0 = perfect
print(f"RMSE: {mean_squared_error(y_test, preds)**0.5:.2f} Lakhs")
\`\`\`

### Evaluation Metrics:
\`\`\`python
from sklearn.metrics import mean_absolute_error, r2_score

mae = mean_absolute_error(y_test, preds)
rmse = mean_squared_error(y_test, preds) ** 0.5
r2 = r2_score(y_test, preds)

print(f"MAE:  {mae:.2f}  (Average error)")
print(f"RMSE: {rmse:.2f}  (Penalizes big errors)")
print(f"R²:   {r2:.3f}  (1.0 = perfect fit)")
\`\`\`

### Feature Importance (Coefficients):
\`\`\`python
importance = pd.DataFrame({
    'Feature': X.columns,
    'Coefficient': model.coef_,
}).sort_values('Coefficient', ascending=False)
print(importance)
\`\`\`

### Polynomial Regression — Curved Lines:
\`\`\`python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

poly_model = Pipeline([
    ('poly', PolynomialFeatures(degree=2)),
    ('linear', LinearRegression())
])
poly_model.fit(X_train, y_train)
\`\`\``,
      codeExample: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler

# Student score predictor
np.random.seed(42)
n = 300

df = pd.DataFrame({
    'study_hours': np.random.uniform(1, 10, n),
    'sleep_hours': np.random.uniform(4, 10, n),
    'prev_score': np.random.uniform(40, 100, n),
    'attendance_pct': np.random.uniform(50, 100, n),
    'tuition': np.random.choice([0, 1], n),
})

df['final_score'] = (
    df['study_hours'] * 5 +
    df['sleep_hours'] * 2 +
    df['prev_score'] * 0.4 +
    df['attendance_pct'] * 0.2 +
    df['tuition'] * 8 +
    np.random.normal(0, 3, n)
).clip(0, 100).round(1)

X = df.drop('final_score', axis=1)
y = df['final_score']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_tr = scaler.fit_transform(X_train)
X_te = scaler.transform(X_test)

models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=1.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
}

print("Student Score Prediction Models\\n" + "="*50)
for name, model in models.items():
    model.fit(X_tr, y_train)
    preds = model.predict(X_te)
    print(f"{name:<22} R²={r2_score(y_test, preds):.3f}  MAE={mean_absolute_error(y_test, preds):.2f}")

# Predict new student
new_student = scaler.transform([[7, 8, 75, 90, 1]])
rf = models['Random Forest']
pred = rf.predict(new_student)[0]
print(f"\\nNew student prediction: {pred:.1f}/100")`,
      task: {
        description: 'House price predictor banao. Dataset mein: area, bedrooms, bathrooms, age, floors, parking, distance_from_city (km), amenities_score. RandomForestRegressor use karo. Show karo: R² score, top 3 important features, actual vs predicted prices (first 10 test samples comparison table).',
        expectedOutput: null,
        hint: 'rf.feature_importances_ se importance nikalo. pd.DataFrame({"Actual": y_test[:10].values, "Predicted": preds[:10].round(1)}) se comparison table banao.',
      },
      quiz: [
        {
          q: 'R² score 0.85 ka matlab kya hai?',
          options: ['85% errors', '85% data points correct', 'Model 85% variance explain kar sakta hai', '85% accuracy'],
          correct: 2,
          explanation: 'R² (R-squared) = model kitna variance explain karta hai. 0.85 = 85% variance explained — achha score hai! 1.0 = perfect, 0 = model kuch nahi seekha.',
        },
        {
          q: 'MAE aur RMSE mein kya fark hai?',
          options: ['Koi fark nahi', 'RMSE bade errors ko zyada penalize karta hai', 'MAE zyada accurate hai', 'RMSE always smaller hota hai'],
          correct: 1,
          explanation: 'MAE = average absolute error. RMSE = square root of mean squared error — iske squaring se bade errors ka zyada impact hota hai. Outliers pe sensitive hai RMSE.',
        },
        {
          q: 'Ridge regression Linear regression se kaise different hai?',
          options: ['Koi fark nahi', 'Ridge mein regularization hoti hai jo overfitting rokti hai', 'Ridge sirf classification ke liye', 'Ridge faster hota hai'],
          correct: 1,
          explanation: 'Ridge = Linear Regression + L2 regularization. Large coefficients ko penalize karta hai — overfitting (training pe achha, test pe bura) rokne ke liye.',
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────
    {
      id: 'py-w10-s3',
      title: 'Clustering aur Model Saving',
      emoji: '🔵',
      content: `## Clustering — Unsupervised Learning!

Labels nahi hote — model khud groups dhundta hai.

### K-Means Clustering:
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Customer data
np.random.seed(42)
n = 200

customers = pd.DataFrame({
    'age': np.random.randint(18, 70, n),
    'annual_income': np.random.randint(200000, 2000000, n),
    'spending_score': np.random.randint(1, 100, n),
    'purchase_frequency': np.random.randint(1, 50, n),
})

# Scale karo
scaler = StandardScaler()
X_scaled = scaler.fit_transform(customers)

# Optimal clusters dhundho (Elbow method)
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

# "Elbow" point pe optimal k milta hai

# K=4 use karo
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
customers['cluster'] = kmeans.fit_predict(X_scaled)

# Cluster profiles
print(customers.groupby('cluster').mean().round(0))
\`\`\`

### Model Save karo — Reuse ke liye:
\`\`\`python
import joblib
from sklearn.ensemble import RandomForestClassifier

# Train karo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save karo
joblib.dump(model, 'my_model.pkl')
joblib.dump(scaler, 'my_scaler.pkl')

print("Model saved! ✅")

# Load karo (dusri baar ya deployment mein)
loaded_model = joblib.load('my_model.pkl')
loaded_scaler = joblib.load('my_scaler.pkl')

# Use karo
new_data = [[5.1, 3.5, 1.4, 0.2]]
scaled = loaded_scaler.transform(new_data)
prediction = loaded_model.predict(scaled)
print("Prediction:", prediction)
\`\`\`

### Cross-Validation — Better Evaluation:
\`\`\`python
from sklearn.model_selection import cross_val_score

model = RandomForestClassifier(n_estimators=100, random_state=42)
scores = cross_val_score(model, X, y, cv=5)  # 5-fold CV

print(f"CV Scores: {scores.round(3)}")
print(f"Mean: {scores.mean():.3f} ± {scores.std():.3f}")
\`\`\``,
      codeExample: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

# Mall customer segmentation
np.random.seed(42)
n = 300

df = pd.DataFrame({
    'age': np.random.randint(18, 70, n),
    'income_k': np.random.randint(15, 150, n),
    'spending_score': np.random.randint(1, 100, n),
    'visits_per_month': np.random.randint(1, 20, n),
})

scaler = StandardScaler()
X = scaler.fit_transform(df)

# Optimal clusters
print("Finding optimal clusters...")
inertias = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append((k, km.inertia_))
    print(f"  k={k}: inertia={km.inertia_:.0f}")

# Use k=4
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['segment'] = kmeans.fit_predict(X)

# Segment names assign karo based on profile
segment_profiles = df.groupby('segment').mean().round(1)
print("\\nCluster Profiles:")
print(segment_profiles)

# Name them
names = {0: "Young Budget", 1: "High Earner VIP", 2: "Senior Casual", 3: "Young Spender"}
df['segment_name'] = df['segment'].map(names)
print("\\nSegment Distribution:")
print(df['segment_name'].value_counts())

# Save model
joblib.dump(kmeans, 'customer_segmentation.pkl')
joblib.dump(scaler, 'customer_scaler.pkl')
print("\\nModel saved!")

# Predict new customer
new_customer = scaler.transform([[25, 80, 75, 15]])
segment = kmeans.predict(new_customer)[0]
print(f"New customer segment: {names[segment]}")`,
      task: {
        description: 'Student performance clustering banao. Dataset: study_hours, sleep, attendance, extracurricular, final_score. K=3 clusters use karo. Har cluster ko meaningful naam do (e.g., "Dedicated Achiever", "Balanced Student", "At Risk"). Model save karo. Phir 3 new students ke segments predict karo!',
        expectedOutput: null,
        hint: 'cluster profiles (groupby mean) dekh ke naam decide karo. joblib.dump(model, "student_cluster.pkl") se save karo. new_student data ko scaler.transform() zaroor karo predict se pehle.',
      },
      quiz: [
        {
          q: 'K-Means mein K ka matlab kya hai?',
          options: ['Features ki count', 'Clusters ki number', 'Iterations count', 'Data points'],
          correct: 1,
          explanation: 'K = kitne groups mein data divide karna hai. K=3 matlab algorithm 3 clusters banayega.',
        },
        {
          q: 'joblib.dump() kab use karte hain?',
          options: ['Data dump karne ke liye', 'Trained model ko file mein save karne ke liye', 'Model delete karne ke liye', 'Model evaluate karne ke liye'],
          correct: 1,
          explanation: 'joblib.dump() trained model ko .pkl file mein serialize karta hai — baad mein load karke use kar sako bina retraining ke.',
        },
        {
          q: 'Cross-validation (CV=5) mein kya hota hai?',
          options: ['Data 5 baar train hota hai', 'Data 5 folds mein divide, har baar ek fold test, 4 train', '5 alag models train hote hain', '5% data test mein jaata hai'],
          correct: 1,
          explanation: '5-fold CV = data 5 parts mein divide. 5 rounds mein har baar ek part test, baaki train. 5 accuracy scores milti hain — zyada reliable evaluation.',
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────
    {
      id: 'py-w10-s4',
      title: 'Week 10 Project — Complete ML Pipeline',
      emoji: '🏆',
      content: `## Week 10 Project — End-to-End ML Pipeline!

Real world mein ML sirf model train karna nahi hai — puri pipeline banana hoti hai!

### Complete Pipeline Steps:
\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

# Numeric features
numeric_features = ['age', 'income', 'score']
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),  # Missing values
    ('scaler', StandardScaler()),                    # Scale karo
])

# Categorical features
categorical_features = ['city', 'education']
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
    ('encoder', OneHotEncoder(handle_unknown='ignore')),
])

# Combine
preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features),
])

# Final pipeline
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100)),
])

# Seedha fit karo — sab kuch handle ho jaata hai!
full_pipeline.fit(X_train, y_train)
predictions = full_pipeline.predict(X_test)
\`\`\`

### Project: Loan Approval Predictor

**Features:**
- age, income, loan_amount, credit_score
- employment_type, education, marital_status
- existing_loans, assets_value

**Output:** Approved / Rejected

**Kya banana hai:**
1. Synthetic dataset generate karo (500 records)
2. EDA karo (distributions, correlations)
3. Preprocessing pipeline banao
4. 3 models compare karo
5. Best model save karo
6. CLI interface banao — user details enter kare, prediction mile

**+350 XP + ML Badge! 🤖**`,
      codeExample: `import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import joblib

np.random.seed(42)
n = 500

# Loan dataset
df = pd.DataFrame({
    'age': np.random.randint(21, 65, n),
    'income': np.random.randint(200000, 2000000, n),
    'loan_amount': np.random.randint(100000, 5000000, n),
    'credit_score': np.random.randint(300, 900, n),
    'employment_years': np.random.randint(0, 30, n),
    'existing_loans': np.random.randint(0, 5, n),
    'assets': np.random.randint(0, 10000000, n),
})

# Approval logic (business rules)
df['approved'] = (
    (df['credit_score'] >= 650) &
    (df['income'] >= df['loan_amount'] * 0.4) &
    (df['existing_loans'] <= 2) &
    (df['employment_years'] >= 1)
).astype(int)

# Add noise (real world mein sab rules nahi hote)
noise_idx = np.random.choice(n, int(n*0.1), replace=False)
df.loc[noise_idx, 'approved'] = 1 - df.loc[noise_idx, 'approved']

X = df.drop('approved', axis=1)
y = df['approved']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline with preprocessing
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)
preds = pipeline.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, preds, target_names=['Rejected', 'Approved']))

# Save
joblib.dump(pipeline, 'loan_predictor.pkl')

# Predict new applicant
def predict_loan(age, income, loan, credit, emp_years, loans, assets):
    pipeline = joblib.load('loan_predictor.pkl')
    data = pd.DataFrame([[age, income, loan, credit, emp_years, loans, assets]],
                         columns=X.columns)
    result = pipeline.predict(data)[0]
    prob = pipeline.predict_proba(data)[0][1]
    print(f"Decision: {'APPROVED ✅' if result else 'REJECTED ❌'}")
    print(f"Approval probability: {prob*100:.1f}%")

predict_loan(35, 800000, 1500000, 720, 8, 1, 2000000)`,
      task: {
        description: 'Loan predictor complete karo with CLI: user se inputs lo (age, income, loan amount, credit score, employment years, existing loans, assets). Pipeline predict karo aur show karo: decision (Approved/Rejected), probability %, aur reason (agar reject toh kaunsa factor main reason tha — credit score low? income low? etc.)',
        expectedOutput: null,
        hint: 'predict_proba() se probability nikalo. Rejection reasons ke liye individual thresholds check karo manually: if credit_score < 650: reasons.append("Low credit score"). Phir reasons join karke print karo.',
      },
      quiz: [
        {
          q: 'sklearn.pipeline.Pipeline ka main benefit kya hai?',
          options: ['Faster training', 'Preprocessing + model ek saath chain — data leakage prevention', 'Zyada features handle karna', 'Better accuracy'],
          correct: 1,
          explanation: 'Pipeline preprocessing aur model ko chain karta hai. fit() aur predict() ek hi call mein ho jaata hai — aur test data pe automatically correct transformation apply hoti hai bina leakage ke.',
        },
        {
          q: 'predict_proba() kya return karta hai?',
          options: ['Single prediction', 'Har class ki probability array', 'Confidence score 0-100', 'Boolean array'],
          correct: 1,
          explanation: 'predict_proba() har sample ke liye har class ki probability return karta hai. Binary classification mein [P(reject), P(approve)] — sum = 1.0.',
        },
        {
          q: 'Gradient Boosting aur Random Forest mein kya fark hai?',
          options: ['Koi fark nahi', 'GB sequential trees banata hai (errors fix karta), RF parallel independent trees', 'RF zyada accurate hota hai', 'GB sirf regression ke liye'],
          correct: 1,
          explanation: 'Random Forest = parallel independent trees ka average. Gradient Boosting = sequential trees jahan har tree pehle wale ki galtiyan fix karta hai — often more accurate but slower.',
        },
      ],
    },
  ],
};