COMPLETED

# Gemini Prompt: "Conditionals & Logic" (python-2)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Conditionals & Logic"** — the second Python lesson. Students already know variables and data types. Now they learn how programs make decisions with if/else and boolean logic. Brilliant.org energy — everything interactive and visual.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "The fork in the road"**

Intro: "Programs make decisions constantly. Every time you see 'if your password is correct, log in — otherwise, show an error,' that's a conditional."

Show an animated character (a simple avatar or dot) walking along a path that splits into two roads at a fork. Above the fork, show a condition: `age >= 18`. On the left road, a sign says "Access granted." On the right, "Access denied." Below the fork, show a slider or number input where the user sets the value of `age` (range 1-30). As they drag the slider, the character smoothly takes the left or right path depending on whether the condition is true or false. The matching Python code updates live below:

```python
if age >= 18:
    print("Access granted")
else:
    print("Access denied")
```

The currently executing branch highlights. Let the user play with different values and watch the path change.

---

**Scene 2 — "True or False?"**

Teaching text: "Conditions boil down to one thing: is this True or False? Python evaluates every condition into a boolean."

Show 8 expressions on screen as clickable cards:
- `5 > 3` → True
- `10 == 11` → False
- `"hello" == "hello"` → True
- `7 < 2` → False
- `True and False` → False
- `True or False` → True
- `not True` → False
- `3 != 3` → False

Each card shows the expression and two buttons: "True" and "False". The user taps their answer. Correct answers flip the card to green and show a one-word confirmation. Wrong answers give a gentle red flash and let them try again. Score tracker at the top: "6/8 correct."

---

**Scene 3 — "Building blocks of logic"**

Teaching text: "You can combine conditions using `and`, `or`, and `not` — just like building with logical LEGO blocks."

Show a visual logic gate builder. Two inputs on the left (A and B), each with a toggle switch (True/False). In the middle, a selector to choose the operator: `and`, `or`, `not A`. On the right, the output lights up green (True) or stays dim (False).

The user toggles A and B, switches operators, and watches the output change. Below, a truth table fills in automatically as they explore each combination. Once they've discovered all combinations for all 3 operators (the truth table is complete), the scene completes.

---

**Scene 4 — "Nested decisions"**

Teaching text: "Sometimes one decision leads to another. That's nesting — an if inside an if."

Show a decision tree that builds as the user adds conditions. Start with a real scenario: "University ticket pricing." The tree asks:
1. Is the person a student? (yes/no)
2. If student: is their age under 26? (yes/no)
3. Based on the path: the price is 0 PLN (student under 26), 10 PLN (student 26+), or 20 PLN (non-student)

Show the visual tree on the left. On the right, show the Python code being built as the user clicks through the tree:

```python
if is_student:
    if age < 26:
        price = 0
    else:
        price = 10
else:
    price = 20
```

Let the user input different values for `is_student` and `age`, and watch the tree highlight the path taken and the code highlight the executing branch.

---

**Scene 5 — "Real World: Grade calculator"**

Scenario: "The university needs a program that converts numeric grades (0-100) to letter grades. Build the logic."

Show a code editor on the left with blanks:

```python
score = ___

if score >= ___:
    grade = "A"
elif score >= ___:
    grade = "B"
elif score >= ___:
    grade = "C"
elif score >= ___:
    grade = "D"
else:
    grade = "F"
```

Below, show draggable values: `90`, `80`, `70`, `60`, and a score input slider (0-100).

The user drags the threshold values into the blanks and uses the slider to test different scores. On the right, show a visual grade card that updates in real-time — it shows the score, the letter grade, and highlights which branch was taken in the code. The grade card should feel like a real report card.

---

**Scene 6 — "Challenge: Fix the login system"**

Final challenge. Show broken login code:

```python
username = "admin"
password = "secure123"
attempts = 3

entered_user = "admin"
entered_pass = "wrong"

if entered_user = username:
    if entered_pass == password:
        print("Welcome!")
    else:
        print("Wrong password")
else:
    print("User not found")
```

There are 2 bugs:
1. `=` should be `==` on the first if (assignment vs comparison)
2. The code doesn't use the `attempts` variable — there's no lockout logic

For bug 1: click the broken line and pick the fix from options.
For bug 2: after fixing bug 1, the code "runs" but the user is prompted: "What happens if someone tries 1000 wrong passwords?" Then they add a while loop around the login check with an attempts counter (pick the right code block from 3 options).

Fix both to complete the lesson.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
