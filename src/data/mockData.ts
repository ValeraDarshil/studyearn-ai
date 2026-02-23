export const leaderboardData = [
  { rank: 1, name: 'Arjun Patel', points: 12450, avatar: '🧑‍💻', streak: 32 },
  { rank: 2, name: 'Priya Singh', points: 11200, avatar: '👩‍🎓', streak: 28 },
  { rank: 3, name: 'Rahul Sharma', points: 10800, avatar: '🧑‍🎓', streak: 25 },
  { rank: 4, name: 'Sneha Gupta', points: 9500, avatar: '👩‍💻', streak: 21 },
  { rank: 5, name: 'Vikram Reddy', points: 8900, avatar: '🎓', streak: 19 },
  { rank: 6, name: 'Ananya Das', points: 8200, avatar: '📚', streak: 17 },
  { rank: 7, name: 'Karthik M.', points: 7600, avatar: '🏆', streak: 15 },
  { rank: 8, name: 'Divya Nair', points: 7100, avatar: '⭐', streak: 14 },
  { rank: 9, name: 'Rohan Kumar', points: 6800, avatar: '🔥', streak: 12 },
  { rank: 10, name: 'Meera Joshi', points: 6200, avatar: '💎', streak: 10 },
];

export const testimonials = [
  {
    name: 'Aarav M.',
    role: 'Class 12 Student',
    text: 'StudyEarn AI literally saved my board exams. The step-by-step explanations are incredible!',
    avatar: '🧑‍🎓',
  },
  {
    name: 'Isha K.',
    role: 'B.Tech Student',
    text: 'The PPT generator is a game changer. Made a 20-slide presentation in 30 seconds.',
    avatar: '👩‍💻',
  },
  {
    name: 'Dev S.',
    role: 'Class 10 Student',
    text: 'I earn points while studying? This app is addictive in the best way possible.',
    avatar: '🎓',
  },
];

export const achievements = [
  { id: 1, name: 'First Question', icon: '🎯', description: 'Asked your first question', unlocked: true },
  { id: 2, name: '7-Day Streak', icon: '🔥', description: 'Maintained a 7-day streak', unlocked: true },
  { id: 3, name: 'PPT Pro', icon: '📊', description: 'Generated 10 presentations', unlocked: true },
  { id: 4, name: 'PDF Master', icon: '📄', description: 'Converted 20 documents', unlocked: false },
  { id: 5, name: 'Knowledge Seeker', icon: '🧠', description: 'Asked 100 questions', unlocked: false },
  { id: 6, name: 'Top 10', icon: '🏆', description: 'Reached top 10 leaderboard', unlocked: false },
];

export const recentActivity = [
  { type: 'question', text: 'Asked: "Explain quantum entanglement"', points: 10, time: '2 min ago' },
  { type: 'ppt', text: 'Generated PPT: "Machine Learning Basics"', points: 25, time: '15 min ago' },
  { type: 'pdf', text: 'Converted PDF to Word', points: 5, time: '1 hour ago' },
  { type: 'streak', text: 'Daily streak bonus! 🔥', points: 50, time: '3 hours ago' },
  { type: 'question', text: 'Asked: "Solve: ∫x²dx"', points: 10, time: '5 hours ago' },
];

export const sampleAnswer = {
  question: 'Explain the concept of photosynthesis and its chemical equation.',
  answer: `**Photosynthesis** is the biological process by which green plants, algae, and some bacteria convert light energy (usually from the sun) into chemical energy stored in glucose.

## Chemical Equation

$$6CO_2 + 6H_2O \\xrightarrow{\\text{sunlight}} C_6H_{12}O_6 + 6O_2$$

## Step-by-Step Process

### Step 1: Light-Dependent Reactions
- Occur in the **thylakoid membranes** of chloroplasts
- Chlorophyll absorbs sunlight
- Water molecules are split (photolysis): **2H₂O → 4H⁺ + 4e⁻ + O₂**
- ATP and NADPH are produced

### Step 2: Calvin Cycle (Light-Independent Reactions)
- Takes place in the **stroma** of chloroplasts
- CO₂ is fixed by RuBisCO enzyme
- Uses ATP and NADPH from light reactions
- Produces **G3P** (glyceraldehyde-3-phosphate)
- G3P is used to build glucose

### Step 3: Glucose Production
- Two G3P molecules combine to form one glucose molecule
- Glucose is used for cellular respiration or stored as starch

## Key Points
- **Location:** Chloroplasts (in mesophyll cells of leaves)
- **Pigment:** Chlorophyll (absorbs red and blue light, reflects green)
- **Inputs:** CO₂, H₂O, Light energy
- **Outputs:** C₆H₁₂O₆ (glucose), O₂`,
};

export const pptTemplates = [
  {
    id: 1,
    title: 'Machine Learning Basics',
    slides: 12,
    style: 'Detailed',
    preview: 'A comprehensive overview of ML concepts, algorithms, and applications.',
  },
  {
    id: 2,
    title: 'Machine Learning Basics',
    slides: 8,
    style: 'Simple',
    preview: 'Clean and minimal presentation covering core ML topics.',
  },
  {
    id: 3,
    title: 'Machine Learning Basics',
    slides: 15,
    style: 'Creative',
    preview: 'Visually rich presentation with infographics and diagrams.',
  },
];
