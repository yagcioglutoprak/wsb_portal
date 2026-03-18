# Gemini Prompt: "JOINs & Relationships" (sql-3)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"JOINs & Relationships"** — the third and final SQL lesson. Students can query single tables with SELECT/WHERE. Now they learn to combine data from multiple tables. Brilliant.org energy — interactive, visual.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "Why multiple tables?"**

Intro: "Imagine storing everything in one giant table — student name, email, course name, professor, grade, all in one row. Every time Kasia takes a new course, you'd repeat her name, email, and ID. That's wasteful and error-prone."

Show a single bloated table with lots of repeated data (student info duplicated across rows). Red highlights show the repetition. Then show the "split" — an animated transition where the one big table breaks apart into 3 clean tables: `students`, `courses`, `enrollments`. The repeated data vanishes, replaced by ID references. The user watches this transformation and then clicks on the ID references to see how they link back to the source table (a visual line draws from `student_id: 3` in enrollments to `id: 3` in students).

---

**Scene 2 — "The foreign key link"**

Teaching text: "A foreign key is a column in one table that points to a primary key in another table. It's how tables know they're related."

Show two tables side by side: `students` (id, name) and `enrollments` (id, student_id, course_id, grade). Draw visual connection lines from each `student_id` in enrollments to the matching `id` in students.

Interactive exercise: show 4 enrollment rows with student_id values. The user clicks on each student_id and the matching student row highlights in the students table. Then add a `courses` table and do the same for course_id. The point: "Following the links lets you reconstruct the full picture."

---

**Scene 3 — "INNER JOIN: only matches"**

Teaching text: "An INNER JOIN combines rows from two tables — but only where there's a match. No match, no row."

Show `students` (5 rows) and `enrollments` (7 rows) side by side. Some students have no enrollments, some have multiple.

The query:
```sql
SELECT students.name, enrollments.grade
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id
```

When the user clicks "Run," animate the join: matching rows from both tables slide toward the center and merge into result rows. Students with no enrollments fade away (they have no match). Students with multiple enrollments appear multiple times in the result. Show the result table below.

Let the user hover over each result row to see which source rows it came from (highlight both the student row and enrollment row).

---

**Scene 4 — "LEFT JOIN: keep everyone"**

Teaching text: "A LEFT JOIN keeps ALL rows from the left table, even if there's no match in the right table. Missing values become NULL."

Same tables. Now change the query to:
```sql
SELECT students.name, enrollments.grade
FROM students
LEFT JOIN enrollments ON students.id = enrollments.student_id
```

The user clicks "Run" and watches the animation again — but this time, students with no enrollments DON'T disappear. Instead, they appear in the result with `NULL` in the grade column (shown as an empty cell with a dotted border).

Show a toggle that switches between INNER JOIN and LEFT JOIN so the user can flip back and forth and see the difference instantly. The result table updates with a smooth transition — rows appearing and disappearing.

---

**Scene 5 — "Real World: The student transcript"**

Scenario: "The registrar needs to generate a complete transcript for each student — showing their name, every course they took, and their grade."

Show three tables: `students` (5 rows), `courses` (6 rows), `enrollments` (10 rows — linking students to courses with grades).

The user needs to build a query that joins all 3 tables. Show a visual query builder where they:
1. Start with `SELECT students.name, courses.course_name, enrollments.grade`
2. Pick `FROM students`
3. Add first JOIN: `JOIN enrollments ON students.id = enrollments.student_id`
4. Add second JOIN: `JOIN courses ON enrollments.course_id = courses.id`

Each step is a drag-and-drop or click-to-select action. As each JOIN is added, the visual connection between tables draws and the result table builds up. The final result shows a complete transcript for all students.

Bonus: "The dean only wants to see students with a GPA above 3.0" — the user adds a WHERE clause to filter.

---

**Scene 6 — "Challenge: Answer the dean's questions"**

Final challenge. Given the 3 tables, answer 3 questions by writing the correct JOIN query (pick from multiple choice):

1. "Which students have NOT enrolled in any course?"
   → `SELECT name FROM students LEFT JOIN enrollments ON students.id = enrollments.student_id WHERE enrollments.id IS NULL`

2. "How many students are in each course?"
   → `SELECT courses.course_name, COUNT(enrollments.student_id) FROM courses JOIN enrollments ON courses.id = enrollments.course_id GROUP BY courses.course_name`

3. "Which student has the highest grade in 'Database Systems'?"
   → A multi-table join with WHERE and ORDER BY LIMIT 1

For each question, show 3 query options. The user picks the correct one. The query runs and shows the result. Wrong answers show what they WOULD return and why it's not right.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
