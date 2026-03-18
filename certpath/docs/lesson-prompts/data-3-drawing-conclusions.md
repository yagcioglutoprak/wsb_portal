# Gemini Prompt: "Drawing Conclusions" (data-3)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Drawing Conclusions"** — the third and final Data Analysis lesson. Students can read data and visualize it. Now they learn the hardest part: interpreting results without fooling themselves. Brilliant.org energy — interactive, thought-provoking.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "Correlation is not causation"**

Intro: "Ice cream sales and drowning deaths both go up in summer. Does ice cream cause drowning? Obviously not. But data can make you believe weird things if you're not careful."

Show a scatter plot with two variables that are clearly correlated: "Number of Nicolas Cage movies per year" vs "People who drowned in swimming pools." The correlation line looks strong. Below: "Correlation: 0.87 — strong positive."

The user sees this and is asked: "Does this mean Nicolas Cage movies cause drowning?" Two buttons: "Yes, clearly!" and "No, that's ridiculous." When they click "No" (correct), a third variable fades in: "Both happen more in summer — warm weather is the real cause."

Then show a real example: "Students who eat breakfast score higher on exams." Ask: "Does breakfast cause better scores, or could something else explain it?" Show 3 possible explanations as clickable cards:
- "Breakfast directly improves brain function" (possible)
- "Students who eat breakfast have more organized routines overall" (confounding variable)
- "Wealthier families can afford breakfast and tutoring" (confounding variable)

The lesson: "Correlation shows a relationship. Only controlled experiments prove causation."

---

**Scene 2 — "The power of sample size"**

Teaching text: "Flip a coin 3 times and get 3 heads? That doesn't mean the coin is rigged. Flip it 1000 times and get 800 heads? Now we're talking."

Show an interactive coin flipper. The user sets the number of flips: 5, 10, 50, 100, 500, 1000. A "Flip" button runs the simulation. The results appear as a bar chart (heads vs tails).

At 5 flips: results are wild — could be 4 heads, 1 tail. The bars look uneven.
At 1000 flips: results converge to ~50/50. The bars are nearly equal.

Show the "percentage of heads" updating with each sample size. A lesson card: "Small samples are noisy and unreliable. Bigger samples give more stable, trustworthy results."

Then a practical exercise: "A startup claims '80% of users love our product!' How many users did they survey?" Options: 5 users (unreliable), 50 users (okay), 5000 users (very reliable). The user picks and sees how the confidence level changes.

---

**Scene 3 — "Bias in data"**

Teaching text: "The biggest danger in data analysis isn't bad math — it's bad data. If your data is biased, your conclusions will be too."

Show 4 types of bias as interactive scenarios:

**Selection bias:** "You survey students about campus parking — but you only survey students who drive to campus." Show a crowd of students, some highlighted (drivers), some grayed out (bus/walk/bike). The user sees how the sample is skewed.

**Survivorship bias:** "You study successful startups to learn what makes a business work. But you're ignoring all the failed startups that did the same things." Show a battlefield metaphor — planes returning with bullet holes. "You armor where the returning planes are hit. But you should armor where the missing planes were hit — because they didn't come back."

**Confirmation bias:** "You believe your new feature increased sales. So you look at the data... and only focus on the numbers that support your belief." Show a data table where the user is asked to find evidence "for" and "against" a claim. Highlight how easy it is to cherry-pick.

**Response bias:** "You ask students 'Don't you think the cafeteria food is terrible?' vs 'How would you rate the cafeteria food?'" Show both questions side by side and the user sees how leading questions distort responses.

After exploring all 4, a quiz: show 4 mini-scenarios and match each to the correct bias type.

---

**Scene 4 — "Averages lie"**

Teaching text: "Bill Gates walks into a bar with 9 regular people. The average net worth in the room is $10 billion. Is everyone rich?"

Show a visual of 10 people with their incomes displayed. 9 people earn $40K-$60K. One earns $100 billion. Show three measures of center side by side:
- **Mean (average):** ~$10 billion — completely misleading
- **Median (middle value):** ~$50K — much more representative
- **Mode (most common):** ~$45K — also reasonable

The user has a slider that controls the outlier's income ($60K to $100B). As they drag, the mean wildly swings while the median barely moves. The visual makes it obvious: "When outliers exist, the median tells a better story than the mean."

Interactive quiz: show 3 datasets and for each one, the user picks which measure of center (mean, median, mode) best represents the data:
1. House prices in a city (with mansions) → Median
2. Shoe sizes at a shoe store → Mode
3. Test scores in a class (normal distribution) → Mean

---

**Scene 5 — "Real World: Analyze the experiment"**

Scenario: "WSB Merito tested whether a new study app improves exam scores. 100 students used the app for a month, 100 didn't. Here are the results."

Show two groups' data:
- App group: mean score 78, median 76, std dev 12
- Control group: mean score 74, median 73, std dev 14

Questions for the user:
1. "Is the difference (4 points) meaningful or could it be random noise?" → Show a visual overlap of the two distributions. The user adjusts a "confidence threshold" slider and sees the p-value concept simplified: "If there's less than 5% chance this difference is random, we call it 'statistically significant.'"

2. "The app group also studied 2 more hours per week on average. Does the app work, or did they just study more?" → Identify confounding variable.

3. "15% of the app group dropped out mid-study but none from the control group. Does this affect the results?" → Survivorship bias — the remaining app users might be more motivated.

4. "What would you recommend to the dean?" → Pick from: "Launch the app for all students" / "Run a larger, controlled study" / "Abandon the app" (Answer: run a larger study).

---

**Scene 6 — "Challenge: Spot the bad conclusion"**

Final challenge. Show 5 claims with data. For each, the user must decide: "Valid conclusion" or "Flawed reasoning" — and if flawed, identify why.

1. "Students who sit in the front row get higher grades, therefore sitting in the front causes better grades." → Flawed: correlation, not causation. Motivated students choose the front.

2. "Our survey of 5,000 university students shows 62% prefer online classes." → Valid: large sample, straightforward survey.

3. "We tested our drug on 8 patients and 7 improved. The drug works!" → Flawed: sample too small, no control group.

4. "Average salary of our graduates is $85,000" — but 5% are tech CEOs earning $2M+. → Flawed: mean is skewed by outliers. Median would be more honest.

5. "Crime went up after the new mayor took office. The mayor is bad for the city." → Flawed: post hoc fallacy. Crime trends have many causes.

Each correct identification earns a point. A brief explanation appears after each answer. Get 4/5 or 5/5 to complete.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- For any charts/distributions, use pure SVG rendered in React — no chart libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
