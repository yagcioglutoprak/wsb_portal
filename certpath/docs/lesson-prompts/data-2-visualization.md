# Gemini Prompt: "Visualization" (data-2)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Visualization"** — the second Data Analysis lesson. Students understand datasets and data types. Now they learn how to turn numbers into visuals that tell a story. Brilliant.org energy — interactive, visual. This lesson should have lots of live chart rendering.

Brilliant.org screenshots attached as style inspiration — especially the histogram with sliders and the scatter plot with toggles.

---

**Scene 1 — "Why visualize?"**

Intro: "Staring at a table of 1000 numbers tells you nothing. One chart tells you everything."

Show a raw data table with 20 rows of student exam scores (numbers between 40-100). It's dense and hard to read. Below, a button: "Show as chart." The user clicks and the numbers fly out of the table cells and arrange themselves into a bar chart — each number becoming a bar, sorted and grouped. Suddenly the pattern is obvious: most students scored between 70-85, with a few outliers.

Then show the same data as 3 different charts side by side (bar chart, line chart, pie chart). One of them is clearly wrong for this data (pie chart — makes no sense for continuous scores). The user clicks which chart is "wrong" and explains why (pick from options: "Pie charts are for parts of a whole, not individual scores").

---

**Scene 2 — "The chart family"**

Teaching text: "Different data stories need different chart types. Using the wrong chart is like using a hammer to turn a screw."

Show 4 chart types as interactive demos the user can play with:

**Bar chart:** Show department enrollment data. The user can toggle between horizontal and vertical bars. Hover on any bar to see the exact value. Best for: comparing categories.

**Line chart:** Show monthly website visits over 12 months. The user can drag a point to see how it changes the trend. Best for: trends over time.

**Scatter plot:** Show height vs weight for 30 students. Each dot is interactive — hover to see the student. Best for: relationships between two numbers.

**Pie chart:** Show budget allocation (5 categories). The user can click a slice to "pull it out" and see the percentage. Best for: parts of a whole (but usually avoid — bar charts are better).

After exploring all 4, a quick quiz: "Which chart for...?" Show 4 scenarios and the user matches each to a chart type.

---

**Scene 3 — "Reading a chart"**

Teaching text: "A chart without labels is just art. Every good chart has: a title, labeled axes, a legend, and a source."

Show a scatter plot that's missing all labels. It's just dots on a white background — meaningless. The user drags labels into the correct positions:
- Title: "Student GPA vs Hours Studied per Week" → drag to top
- X-axis label: "Hours Studied" → drag to bottom
- Y-axis label: "GPA" → drag to left side
- Legend: "Department: CS (blue), Business (orange)" → drag to corner
- Source: "WSB Merito Survey 2026" → drag to bottom-right

As each label is placed, the chart becomes more readable. After all labels, the chart transforms from "meaningless dots" to "clear story" — and a trendline appears showing the positive correlation.

---

**Scene 4 — "Lying with charts"**

Teaching text: "Charts can mislead — sometimes on purpose. Learn to spot the tricks."

Show 4 misleading charts, one at a time. For each, the user identifies what's wrong:

1. **Truncated Y-axis:** A bar chart showing Company A at 98% and Company B at 95%, but the Y-axis starts at 94%. Looks like A is twice as big as B. The user drags the Y-axis start point to 0 and sees the real difference is tiny.

2. **Cherry-picked time range:** A line chart showing "Revenue is crashing!" — but the time range is just the last 2 weeks of a noisy but overall upward trend. The user drags a slider to expand the time range and reveals the full picture.

3. **3D pie chart:** A pie chart where the 3D perspective makes the front slice look much bigger than it actually is. The user clicks "Flatten to 2D" and sees the real proportions.

4. **Missing context:** A bar chart: "Our product was rated #1!" — but rated #1 out of only 3 products, with scores of 4.1, 4.0, and 3.9. The user clicks to reveal the missing context.

After finding all 4 tricks, a summary card: "Always check: axis ranges, time periods, dimensions, and context."

---

**Scene 5 — "Real World: Visualize the survey"**

Scenario: "WSB Merito surveyed 200 students. The dean wants to see the results in a presentation. Build the right visualizations."

Show the survey dataset with columns: department, satisfaction (1-5), year, hours_studied, gpa.

Present 4 visualization tasks:
1. "Show satisfaction ratings by department" → User builds a bar chart by selecting the right chart type and mapping department to X and satisfaction average to Y
2. "Show the distribution of GPAs" → User builds a histogram by selecting bin size with a slider (0.5 intervals)
3. "Is there a relationship between hours studied and GPA?" → User builds a scatter plot
4. "What percentage of students are in each department?" → User picks between pie chart and bar chart (either works, but bar chart is better — explain why)

For each task, the user selects chart type from options and configures it. The chart renders live. When the choices are correct, the chart becomes the "final version" with proper labels and styling.

---

**Scene 6 — "Challenge: Dashboard builder"**

Final challenge. The user is given a dataset of 100 e-commerce orders (product, category, price, quantity, date, region). Their task: build a 3-chart dashboard to answer the CEO's questions.

1. "Which category sells the most?" → Build a bar chart of total revenue by category
2. "How are sales trending this month?" → Build a line chart of daily revenue
3. "Where are our customers?" → Build a horizontal bar chart of orders by region

For each chart, the user selects: chart type, X variable, Y variable, and any filters. Show 3 options for each choice. Only the correct combination produces a meaningful chart. Wrong combinations show a "this doesn't make sense" preview with an explanation.

Complete all 3 charts and the dashboard assembles into a final polished view.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- Render charts using pure SVG/Canvas + React state — no chart libraries (Recharts, Chart.js). Keep it lightweight with hand-drawn SVG elements for that Brilliant.org tactile feel.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
