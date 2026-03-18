COMPLETED

# Gemini Prompt: "Reading Data" (data-1)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Reading Data"** — the first lesson in the Data Analysis track. Students have zero data analysis background. This introduces what datasets are, how data is structured, and how to spot problems in raw data. Brilliant.org energy — interactive, visual, tactile.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "What does data look like?"**

Intro: "Data is everywhere — every time you scroll social media, order food, or check your grades, you're generating data. But raw data is just rows and columns until you learn to read it."

Show a dataset table: `student_survey` with 10 rows and 6 columns (student_id, name, age, department, hours_studied, exam_score). The data is initially blurred/scrambled. The user clicks "Load Dataset" and the data fills in row by row with a typewriter animation.

Then the user explores: clicking on any column header reveals a metadata card showing: column name, data type (numeric, text, boolean), number of unique values, min/max (for numbers), and a mini distribution preview. Click all 6 columns to fully understand the dataset.

---

**Scene 2 — "Rows, columns, and cells"**

Teaching text: "Every dataset follows the same structure: rows are observations (one per student), columns are variables (things you measured), and cells are individual values."

Show the same dataset. Interactive labeling exercise:
- The user clicks on a row → it highlights and a label says "This is one observation — everything we know about student #4"
- Clicks on a column → highlights and says "This is a variable — exam scores for all students"
- Clicks on a single cell → highlights and says "This is a value — student #4 scored 78"
- Clicks on the header row → "These are field names — they tell you what each column contains"

After clicking all 4 types, a summary card shows: "This dataset has 10 observations, 6 variables, and 60 values."

---

**Scene 3 — "Dirty data"**

Teaching text: "Real-world data is never perfect. Missing values, typos, and inconsistencies are everywhere. Learning to spot them is the first skill of a data analyst."

Show a new dataset with 8 rows that has deliberate problems. Each row is a card. Problems hidden in the data:
1. A missing age value (empty cell)
2. A typo in department: "Compter Science" instead of "Computer Science"
3. An impossible exam score: 150 (max is 100)
4. A duplicate row (same student_id appears twice)
5. An age value that's a string: "twenty" instead of 20

The user scans the dataset and clicks on cells they think have problems. Each correct find highlights green with a one-line explanation ("Missing value: age is blank for this student"). Each wrong click gives a gentle "this one looks fine." Find all 5 problems to proceed. A "data health" meter fills up as problems are found: 0% → 100%.

---

**Scene 4 — "Data types: the four families"**

Teaching text: "Not all data is the same. Understanding types helps you know what operations are possible."

Show 4 type cards: Numeric (continuous), Numeric (discrete), Categorical, Boolean. Each card has a brief description.

Below, show 10 examples the user sorts into the correct type:
- "exam_score: 87.5" → Numeric continuous
- "number_of_courses: 4" → Numeric discrete
- "department: Finance" → Categorical
- "is_scholarship: True" → Boolean
- "height: 175.3 cm" → Numeric continuous
- "semester: 3" → Numeric discrete
- "blood_type: A+" → Categorical
- "passed: False" → Boolean
- "temperature: 36.6" → Numeric continuous
- "number_of_siblings: 2" → Numeric discrete

Drag each to the correct category. Correct placements snap in with a count. After all 10, a summary shows why types matter: "You can calculate the average of exam_score (numeric) but not the average of department (categorical)."

---

**Scene 5 — "Real World: Clean the survey data"**

Scenario: "WSB Merito ran a student satisfaction survey. Before analyzing the results, you need to clean the data."

Show a messy survey dataset with 12 rows and 5 columns (student_id, satisfaction_1to5, department, response_date, comments).

Problems to fix (5 total):
1. satisfaction value of 7 (should be 1-5 scale) → User picks: "Remove row" or "Cap at 5" or "Leave it"
2. Department "IT" and "Information Technology" mixed → User picks: "Standardize to one name"
3. Missing response_date for 2 rows → User picks: "Remove rows" or "Fill with median date" or "Leave as missing"
4. Duplicate student_id → User picks: "Keep first entry" or "Keep latest" or "Keep both"
5. Comment field with HTML tags: "<b>Great!</b>" → User picks: "Strip tags" or "Remove column"

For each problem, the user picks the best approach. The dataset visually cleans up — bad cells transition from red-highlighted to clean green. After all 5 fixes, the cleaned dataset is shown side by side with the original. "Data quality: 43% → 100%."

---

**Scene 6 — "Challenge: Dataset detective"**

Final challenge. Show a mystery dataset with 15 rows — a sales report for a small shop. The user doesn't know what's wrong yet.

Questions:
1. "How many rows have missing values?" → Count and enter a number (answer: 3)
2. "Which column has the most inconsistent data?" → Click on the column (answer: the "category" column with spelling variations)
3. "Is there an outlier in the revenue column?" → Click on the suspicious value (answer: a revenue of -500, which is likely a refund but wasn't labeled as such)
4. "What's the correct data type for the 'date' column?" → Pick from: Numeric, Categorical, Date, Boolean (answer: Date)

Each correct answer earns a magnifying glass badge. Get all 4 to complete the lesson with a "Data Detective" achievement animation.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
