# Gemini Prompt: "Lists & Loops" (python-3)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Lists & Loops"** — the third Python lesson. Students know variables, data types, and conditionals. Now they learn how to store collections of data and iterate through them. Brilliant.org energy — interactive, visual, alive.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "A row of boxes"**

Intro: "A variable holds one thing. A list holds many things — in order, side by side, like lockers in a hallway."

Show a visual row of 5 empty locker-style boxes, numbered 0 to 4 with index labels above them. Below, show this code building up:

```python
students = ["Kasia", "Tomek", "Ania", "Marek", "Zofia"]
```

As each name appears in the code, the corresponding locker fills in with an animation — the name slides into the box. After all 5 are filled, let the user click on any locker to "access" it. When they click locker #2, the code below updates to show `students[2]` and the output shows `"Ania"`. Let them click different indexes and see the result. Also let them try clicking index 5 — it should show a friendly `IndexError: list index out of range` with a visual "the locker doesn't exist" animation.

---

**Scene 2 — "Mutating the list"**

Teaching text: "Lists aren't frozen. You can add, remove, and change items whenever you want."

Show the same 5 lockers from Scene 1. Below, show 4 operation buttons:
- `append("Jakub")` — clicking adds a 6th locker with animation
- `remove("Tomek")` — clicking removes locker #1, others slide left to close the gap
- `students[0] = "Katarzyna"` — clicking changes "Kasia" to "Katarzyna" with a swap animation
- `insert(2, "Piotr")` — clicking slides lockers apart and inserts "Piotr" at index 2

The user clicks each operation and watches the list transform visually. The index numbers update dynamically. After trying all 4 operations, the current state of the list is shown and they proceed.

---

**Scene 3 — "Walking through the list"**

Teaching text: "A for loop walks through every item in a list, one at a time — like a teacher calling attendance."

Show the student list on the left as boxes. On the right, show the code:

```python
for student in students:
    print(student)
```

A visual cursor (highlighted box or pointer arrow) moves through the list. The user clicks "Step" to advance the cursor one position at a time. As it moves to each item, the current value of `student` updates in a memory display, and the `print()` output appends to a terminal below. Make the cursor movement smooth with a slight bounce. After stepping through all items, the scene completes.

---

**Scene 4 — "Counting with range"**

Teaching text: "Sometimes you don't have a list — you just want to count. That's what range() is for."

Show a number line from 0 to 9. Below, show code:

```python
for i in range(___):
    print(i)
```

The user fills in the blank with a number using a slider (1-10). As they adjust the slider, the number line highlights the corresponding range (e.g., slider at 5 highlights 0,1,2,3,4) and the terminal output updates. Then show a second exercise with `range(2, 7)` — the user drags two handles on the number line to set start and end, and the code and output update live. Finally show `range(0, 10, 2)` with a step parameter — the number line shows every other number highlighted.

---

**Scene 5 — "Real World: Student grade processor"**

Scenario: "You have a list of 8 student exam scores. Write a program that finds the highest score, the lowest score, and the class average."

Show a visual bar chart of 8 scores: `[78, 92, 65, 88, 71, 95, 83, 76]`. Below, show incomplete code:

```python
scores = [78, 92, 65, 88, 71, 95, 83, 76]

highest = ___
lowest = ___
total = ___

for score in scores:
    if score > highest:
        highest = ___
    if score < lowest:
        lowest = ___
    total = total + ___

average = total / len(scores)
```

The user drags values/expressions into the blanks from a pool: `scores[0]`, `scores[0]`, `0`, `score`, `score`, `score`. As they fill in each blank correctly, the bar chart animates — the highest bar turns green, the lowest turns red, and the average line draws across. A results card shows: Highest: 95, Lowest: 65, Average: 81.0.

---

**Scene 6 — "Challenge: Find the duplicates"**

Final challenge. Show a list of student IDs:

```python
ids = [101, 203, 305, 203, 412, 101, 507, 305]
```

The user sees the list visualized as cards. The task: "Some students registered twice. Find all the duplicate IDs."

Show incomplete code with 3 approaches. The user picks which approach is correct:

**Option A:**
```python
duplicates = []
for id in ids:
    if ids.count(id) > 1 and id not in duplicates:
        duplicates.append(id)
```

**Option B:**
```python
duplicates = []
for id in ids:
    if id > 1:
        duplicates.append(id)
```

**Option C:**
```python
duplicates = ids[0] + ids[1]
```

The user selects Option A (correct). The code then "runs" — the visual cards animate, duplicate pairs highlight and fly to a "duplicates" section. Final output: `[101, 203, 305]`. The wrong options show brief explanations of why they don't work.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
