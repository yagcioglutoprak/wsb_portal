# Gemini Prompt: "Functions" (python-4)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Functions"** — the fourth and final Python Basics lesson. Students know variables, conditionals, and loops. Now they learn to organize code into reusable functions. Brilliant.org energy — interactive, visual, game-like.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "The machine"**

Intro: "A function is a machine. You put something in, it does its thing, and gives you something back."

Show a visual machine in the center — a box with an input funnel on top, gears inside (animated, slowly turning), and an output chute at the bottom. On the left, show draggable inputs: the number `5`. The user drags `5` into the funnel. The machine label says `double(x)`. The gears spin, and out comes `10` from the chute.

Then show the code next to it:
```python
def double(x):
    return x * 2
```

Let the user try different inputs (3, 7, 12) by dragging them in. Each time the machine processes and outputs the result. The connection between input → code → output should feel tangible.

---

**Scene 2 — "Parameters and arguments"**

Teaching text: "When you define a function, the placeholders are called parameters. When you call it, the actual values are arguments."

Show a function definition at the top:
```python
def greet(name, greeting):
    return greeting + ", " + name + "!"
```

Below, show two labeled input fields: "name" and "greeting". The user types or selects values (e.g., name: "Kasia", greeting: "Hello"). A "Call function" button runs it and shows the output: `"Hello, Kasia!"`.

Then show the same thing as a code call: `greet("Kasia", "Hello")`. Draw visual arrows from each argument to its parameter in the function definition — `"Kasia"` → `name`, `"Hello"` → `greeting`. Let the user swap the argument order and see what happens (output becomes `"Kasia, Hello!"` — the arguments map by position).

---

**Scene 3 — "Return vs Print"**

Teaching text: "A common confusion: `print()` shows text on screen. `return` sends a value back to whoever called the function. They're completely different."

Show two side-by-side machines. Left machine uses `return`, right machine uses `print()`.

Left machine code:
```python
def add(a, b):
    return a + b

result = add(3, 4)
```

Right machine code:
```python
def add(a, b):
    print(a + b)

result = add(3, 4)
```

The user clicks "Run" on each. Left machine: `result` variable fills with `7`, shown in a memory box. Right machine: `7` appears in the terminal output but `result` is `None` — the memory box is empty. A clear visual contrast.

Then a quick 3-question quiz: "Which one lets you use the output later?", "Which one just displays text?", "What does `result` equal in the second version?" (answers: return, print, None).

---

**Scene 4 — "Functions calling functions"**

Teaching text: "Functions can call other functions. That's how you build complex programs from simple pieces."

Show a visual pipeline of 3 connected machines:
1. `get_grades()` → outputs a list `[85, 92, 78, 90]`
2. `calculate_average(grades)` → takes the list, outputs `86.25`
3. `assign_letter(average)` → takes the average, outputs `"B"`

The code:
```python
grades = get_grades()
avg = calculate_average(grades)
letter = assign_letter(avg)
```

The user clicks "Step" to execute each line. The output of each function visually flows (animated) into the input of the next function through a connecting pipe. The data transforms at each stage. The intermediate values are shown in memory boxes that update as execution progresses.

---

**Scene 5 — "Real World: Build a GPA calculator"**

Scenario: "The registrar's office needs a GPA calculator. You need to write 3 functions that work together."

Show 3 empty function skeletons on the left:

```python
def grade_to_points(grade):
    # Convert letter grade to points
    # A=4.0, B=3.0, C=2.0, D=1.0, F=0.0
    ___

def calculate_gpa(grades):
    # Sum all points and divide by number of grades
    total = ___
    for g in grades:
        total = total + grade_to_points(___)
    return total / ___

def get_status(gpa):
    # Dean's list if GPA >= 3.5, Probation if < 2.0, Good standing otherwise
    ___
```

On the right, show a student transcript card with grades: `["A", "B", "A", "C", "B"]`. The user fills in the blanks by dragging code snippets from a pool. As each function is completed, it "activates" and the transcript card updates — showing the GPA and the academic status. Final result: GPA 3.2, "Good standing."

---

**Scene 6 — "Challenge: Debug the broken calculator"**

Final challenge. Show a tip calculator with bugs:

```python
def calculate_tip(bill, tip_percent):
    tip = bill * tip_percent
    total = bill + tip
    print(total)

def split_bill(total, num_people):
    return bill / num_people

bill = 120
tip_rate = 0.18

final = calculate_tip(bill, tip_rate)
per_person = split_bill(final, 4)
print(f"Each person pays: {per_person}")
```

There are 3 bugs:
1. `calculate_tip` uses `print` instead of `return` — so `final` is `None`
2. `split_bill` references `bill` instead of `total` (wrong variable name)
3. `tip_percent` should be `tip_percent / 100` if percent is given as 18 — OR the call is fine since 0.18 is already decimal (this one is a trick — the user should identify that this is actually correct)

The user clicks on suspected bugs. For bugs 1 and 2, they pick the fix. For the trick one (the tip_rate), if they click it, the lesson explains why 0.18 is correct. Fix the real bugs and the calculator runs: "Each person pays: 35.40 PLN."

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
