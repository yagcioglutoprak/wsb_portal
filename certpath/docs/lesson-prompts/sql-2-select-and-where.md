# Gemini Prompt: "SELECT & WHERE" (sql-2)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"SELECT & WHERE"** — the second SQL lesson. Students understand tables, rows, columns, and data types. Now they learn to query data. Brilliant.org energy — interactive, visual.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "Asking questions"**

Intro: "A database is useless if you can't ask it questions. SQL is the language you use to ask. The most basic question: 'Show me this data.'"

Show a `students` table with 8 rows and 5 columns (id, name, email, department, gpa). All data is visible.

Below the table, show the query:
```sql
SELECT name FROM students;
```

When the user clicks "Run," all columns except `name` visually fade out, leaving only the name column highlighted. Then let them modify the query by clicking on column names to toggle them in/out of the SELECT. As they click `email`, the query updates to `SELECT name, email FROM students;` and the email column also highlights. Let them play with selecting different column combinations and see the visual result. `SELECT *` highlights everything.

---

**Scene 2 — "Filtering with WHERE"**

Teaching text: "SELECT chooses which columns to show. WHERE chooses which rows to show."

Same table. Now show a query builder with two parts:
- SELECT: dropdown/checkboxes for columns
- WHERE: a condition builder — column dropdown, operator dropdown (=, >, <, >=, <=, !=), value input

The user builds a query like `SELECT name, gpa FROM students WHERE gpa > 3.5`. As they adjust the WHERE condition, matching rows highlight in green and non-matching rows fade to gray in real-time. The filtered result appears below as a clean result table. Let them try different conditions: `department = "Computer Science"`, `id <= 4`, etc.

---

**Scene 3 — "Combining conditions"**

Teaching text: "You can combine multiple conditions with AND (both must be true) and OR (either can be true)."

Show the students table and a query:
```sql
SELECT name, department, gpa
FROM students
WHERE department = "Computer Science" AND gpa > 3.0
```

Visualize it with a Venn diagram overlay on the table: one circle for `department = "CS"`, another for `gpa > 3.0`. The intersection (AND) shows the matching rows. Let the user toggle between AND and OR — the Venn diagram updates to show intersection vs union, and the highlighted rows change accordingly.

Then a quick exercise: "How many students match each query?" Show 3 queries and the user predicts the count before running:
1. `WHERE department = "CS" AND gpa > 3.5` → ?
2. `WHERE department = "CS" OR gpa > 3.5` → ?
3. `WHERE NOT department = "CS"` → ?

---

**Scene 4 — "Sorting and limiting"**

Teaching text: "ORDER BY sorts your results. LIMIT controls how many rows you get back."

Show the students table and let the user build a query with:
- ORDER BY: pick a column and direction (ASC/DESC) using toggle buttons
- LIMIT: a slider from 1 to 8

As they change ORDER BY to `gpa DESC`, the rows visually rearrange with a smooth animation — cards sliding up and down. When they add `LIMIT 3`, only the top 3 rows remain visible and the rest fade away. Let them combine everything: `SELECT name, gpa FROM students WHERE gpa > 2.5 ORDER BY gpa DESC LIMIT 5`.

---

**Scene 5 — "Real World: University database queries"**

Scenario: "The dean needs answers from the student database. Write the SQL queries."

Show a full students table (10 rows) with columns: id, name, department, semester, gpa, scholarship (boolean).

Present 4 questions one at a time. For each, the user builds the query using the interactive builder:

1. "Which Computer Science students have a GPA above 3.5?"
   → `SELECT name, gpa FROM students WHERE department = 'Computer Science' AND gpa > 3.5`

2. "List all scholarship students, sorted by GPA highest to lowest"
   → `SELECT name, department, gpa FROM students WHERE scholarship = TRUE ORDER BY gpa DESC`

3. "Who are the top 3 students overall?"
   → `SELECT name, gpa FROM students ORDER BY gpa DESC LIMIT 3`

4. "Find students in semester 1 or semester 2 who don't have a scholarship"
   → `SELECT name, semester FROM students WHERE (semester = 1 OR semester = 2) AND scholarship = FALSE`

Each correct query runs and shows the result. A progress indicator shows 1/4, 2/4, etc.

---

**Scene 6 — "Challenge: Debug the queries"**

Final challenge. Show 4 broken SQL queries. The user fixes each one:

1. `SELCT name FROM students;` → Missing 'E' in SELECT
2. `SELECT name FROM students WHERE gpa = > 3.5;` → Space in operator, should be `>=`
3. `SELECT name FROM students WHERE department = Computer Science;` → Missing quotes around string value
4. `SELECT * FROM students ORDER BY gpa LIMIT 5 DESC;` → DESC should come before LIMIT

Each query has a highlighted error zone. The user clicks it and picks the fix from 2-3 options. Fixed queries run successfully and show results.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
