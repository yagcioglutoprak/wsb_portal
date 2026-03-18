# Gemini Prompt: "Tables & Data" (sql-1)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Tables & Data"** — the first lesson in the SQL & Databases skill track. Students have zero SQL knowledge. This introduces what databases are, how data is organized into tables, and what makes databases different from spreadsheets. Brilliant.org energy — interactive, visual, tactile.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "More than a spreadsheet"**

Intro: "You've used spreadsheets. A database is like a spreadsheet with superpowers — it can handle millions of rows, let hundreds of people use it at once, and never lose data."

Show a side-by-side comparison. Left: a messy spreadsheet with merged cells, random formatting, mixed data types in the same column, duplicate rows. Right: a clean database table with strict columns, consistent types, and unique IDs.

The user clicks on 4 problems in the messy spreadsheet (highlighted with subtle red outlines): a merged cell, a column with mixed numbers and text, a duplicate row, and a missing value. For each click, a tooltip shows why databases solve this problem ("Databases enforce data types — a number column only allows numbers").

---

**Scene 2 — "Anatomy of a table"**

Teaching text: "A database table has rows (records) and columns (fields). Each column has a name and a data type. Each row is one entry."

Show an interactive table — a `students` table with 5 rows and 4 columns: `id` (INT), `name` (VARCHAR), `email` (VARCHAR), `gpa` (FLOAT). The table is fully visible.

The user hovers over different parts and labels appear:
- Hover over a column header → "This is a column (field). It has a name and a type."
- Hover over a row → "This is a row (record). It represents one student."
- Hover over a single cell → "This is a cell. It holds one value."
- Hover over the `id` column → "This is the primary key. Every row has a unique ID."

After the user has explored all 4 elements (column, row, cell, primary key), the scene completes.

---

**Scene 3 — "Data types matter"**

Teaching text: "Every column has a data type that controls what values it can hold. Try to put the wrong type in — the database won't let you."

Show the `students` table with an "Add Row" form below it. The form has 4 fields: id, name, email, gpa. Pre-fill some values but include deliberate type mismatches:
- id: "abc" (should be a number)
- name: 12345 (should be text)
- email: "kasia@merito.pl" (correct)
- gpa: "excellent" (should be a number)

The user clicks "Insert" and the database rejects it — red highlights appear on the invalid fields with error messages: "Expected INT, got TEXT." The user fixes each field by clicking on it and selecting the correct value from options. Once all fields are valid, clicking "Insert" successfully adds the row with a satisfying slide-in animation.

---

**Scene 4 — "Primary keys and uniqueness"**

Teaching text: "A primary key is a column where every value must be unique. It's how the database identifies each row — like a student ID number."

Show the students table with 5 rows. Below, show an attempt to insert a new row with `id: 3` — but id 3 already exists. The user clicks "Insert" and sees the error: "Duplicate primary key." A visual duplicate highlight shows both rows with id=3.

Then present 3 options to fix it:
- Change the id to 6 (correct — next available)
- Delete the existing row with id 3 (valid but destructive)
- Remove the primary key constraint (bad idea)

The user picks the best option. Then a quick exercise: "Which of these could be a primary key?" Show 3 column options:
- Student name (no — names can repeat)
- Student email (maybe — but people change emails)
- Student ID number (yes — unique by design)

---

**Scene 5 — "Real World: Design the university database"**

Scenario: "WSB Merito needs a database for their student portal. You need to design 3 tables."

Show 3 empty table blueprints side by side: `students`, `courses`, `enrollments`. Below, show a pool of columns as draggable cards:
- student_id (INT), student_name (VARCHAR), email (VARCHAR), semester (INT)
- course_id (INT), course_name (VARCHAR), professor (VARCHAR), credits (INT)
- enrollment_id (INT), student_id (INT), course_id (INT), grade (VARCHAR), enrollment_date (DATE)

The user drags each column to the correct table. When a column is placed, it snaps into the table with the type shown. Primary keys are automatically highlighted when the `_id` columns are placed. When all columns are correctly distributed, draw relationship lines between tables (student_id links students to enrollments, course_id links courses to enrollments) — showing the foreign key concept visually.

---

**Scene 6 — "Challenge: Spot the schema errors"**

Final challenge. Show a database schema with 3 tables that have design problems:

**products table:**
| id | name | price | category |
| "one" | Widget | $9.99 | Electronics |

Problem: id is text, not a number. Price has a $ symbol (should be numeric).

**orders table:**
| order_id | customer_name | customer_email | customer_phone | product | quantity |
| 1 | Jan Kowalski | jan@mail.com | 555-1234 | Widget | 2 |

Problem: customer info should be in a separate table (normalization). Product should reference product_id, not the name.

**reviews table:**
| product_id | review | stars |
| 1 | "Great!" | 5 |
| 1 | "Okay" | 3 |

Problem: no primary key on the reviews table.

The user clicks on each problem (5 total) and picks the correct fix from multiple choices. Each fix earns points. Get all 5 to complete the lesson.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
