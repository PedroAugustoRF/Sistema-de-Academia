# GymControl

Documentação completa (arquitetura, execução, MySQL, endpoints, autenticação, cargos e limitações): **[docs/GYMCONTROL.md](docs/GYMCONTROL.md)**.

---

## Briefing original

Create a complete, modern and functional **front-end gym management system** called **GymControl**.

The project must be designed with the idea that, in the future, a backend and database will be implemented. Therefore, the front-end architecture, file organization, components, naming conventions and data structures must be clean, modular, scalable and easy to connect to APIs later.

## General Concept

Build a professional gym management dashboard focused on three main areas:

1. **Gym Equipment**
2. **Workout Builder**
3. **Students**

The application should currently use **fictional/mock data**, but the code must be structured so that these static data sources can easily be replaced by API/database requests in the future.

Use a **single-page dashboard experience** where clicking items in the sidebar dynamically changes the main content without unnecessarily reloading the entire page.

## Technologies

Use:

* HTML5
* CSS3
* Vanilla JavaScript
* Bootstrap 5 if useful
* Font Awesome or another lightweight icon library if necessary
* No backend
* No database
* No React/Vue/Angular
* No unnecessary frameworks

Keep the code separated into logical files:

* `index.html`
* `css/style.css`
* `js/app.js`
* `js/data.js`

If additional JavaScript modules improve the architecture, they can be created.

The code should be clean, readable and well organized.

## Layout

Create a responsive dashboard layout.

### Sidebar

On the left side, create a modern fixed sidebar containing:

* GymControl logo/name
* Dashboard
* Machines
* Workouts
* Students
* Settings

The sidebar should have icons and labels.

The currently selected section must have a clear active state.

On smaller screens, the sidebar should become collapsible or transform into a mobile navigation menu.

The sidebar should have a professional gym/fitness aesthetic without looking exaggerated.

## Main Content

The main content area should occupy the rest of the screen.

At the top, include a clean header with:

* Page title
* Short description
* Search field when relevant
* User/profile area
* Notification icon

The content below should dynamically change depending on the selected sidebar item.

---

# Dashboard

Create a dashboard home screen with useful summary cards:

* Total Students
* Active Students
* Gym Machines
* Workout Plans

Include a few additional dashboard elements such as:

* Recent students
* Recently created workouts
* Machine availability/status
* Small statistics cards

Use fictional data.

The dashboard should immediately communicate that this is a real gym management system.

---

# Machines Page

Create a complete machine/equipment management interface.

Display a list/grid of gym machines using fictional data.

Each machine should contain:

* Machine name
* Category
* Description
* Muscle group
* Status
* Location
* Image
* Number of available units

Example machines:

* Leg Press
* Chest Press
* Lat Pulldown
* Smith Machine
* Cable Crossover
* Leg Extension
* Seated Row
* Shoulder Press

Use realistic fictional information.

Include:

* Search machines
* Category filter
* Status filter
* Machine cards or a modern table
* "View Details" button

When clicking a machine, open a modal or details panel showing more information.

Machine statuses could include:

* Available
* Maintenance
* Occupied

Use subtle visual indicators for these statuses.

---

# Workout Builder

Create a functional **Workout Builder**.

The user should be able to create a fictional workout plan by selecting exercises/machines.

Include fields such as:

* Workout name
* Student
* Workout objective
* Training day
* Exercises

The exercise builder should allow the user to add exercises dynamically.

Each exercise can contain:

* Exercise name
* Machine
* Sets
* Repetitions
* Rest time
* Weight
* Notes

Example:

Workout:
"Hypertrophy A"

Exercises:

1. Chest Press

   * 4 sets
   * 10 reps
   * 60 seconds rest

2. Lat Pulldown

   * 4 sets
   * 12 reps
   * 60 seconds rest

3. Leg Press

   * 4 sets
   * 10 reps
   * 90 seconds rest

Add buttons such as:

* Add Exercise
* Remove Exercise
* Save Workout
* Clear Workout

The functionality should work entirely on the front-end using JavaScript and mock data.

When saving, show a pleasant success notification/toast.

Structure the workout data in a way that can later easily be sent to a REST API.

---

# Students Page

Create a professional student management interface.

Display fictional students with:

* Profile photo/avatar
* Full name
* Email
* Phone
* Membership type
* Status
* Registration date
* Assigned workout

Example students:

* Lucas Almeida
* Gabriel Santos
* Mariana Oliveira
* João Henrique
* Ana Beatriz

Include:

* Search students
* Filter by status
* Filter by membership
* View student
* Edit student
* Add student

The "Add Student" button should open a modal containing a form.

The form should include:

* Name
* Email
* Phone
* Birth date
* Membership
* Status

For now, save the new student only in the front-end state/mock data.

Do not pretend that data is being saved to a real database.

---

# Settings

Create a simple settings page with sections such as:

* Gym information
* User preferences
* Notifications
* Theme preference

This page can be mostly visual but should feel consistent with the rest of the application.

---

# WhatsApp Floating Button

In the bottom-right corner of the screen, add a **fixed WhatsApp button**.

It should remain visible while navigating through the application.

Use the official WhatsApp green visual style and a WhatsApp icon.

The button should have a subtle hover animation.

When clicked, it should open a WhatsApp conversation using a placeholder phone number.

Use a clearly identifiable placeholder such as:

`https://wa.me/5500000000000`

Do not use a real person's phone number.

On desktop, the button can display:

"Contact us"

On smaller screens, show only the WhatsApp icon.

---

# Visual Design

The design should be:

* Modern
* Minimalist
* Professional
* Premium
* Clean
* Responsive
* Elegant
* Easy to navigate

Use a gym-inspired visual identity without making the interface look like a stereotypical fitness website.

Use:

* Dark sidebar
* Neutral/light dashboard background
* Clean cards
* Subtle shadows
* Rounded corners
* Good spacing
* Strong typography hierarchy
* Professional icons
* High-quality imagery where appropriate

You may use subtle gym photography as backgrounds or visual accents.

Avoid excessive gradients, glowing effects, glassmorphism everywhere, neon colors, excessive animations or other design choices that make the website look obviously AI-generated.

The interface should look like something a professional UI/UX designer would actually build for a real SaaS product.

## Colors

Use a restrained color palette.

Primary colors can be based around:

* Black / charcoal
* White
* Light gray
* One accent color such as orange, red or green

Do not use too many colors.

Status colors should be used consistently:

* Green = Available/Active
* Yellow/Orange = Maintenance/Pending
* Red = Inactive/Unavailable

---

# Animations

Add subtle and natural animations:

* Sidebar transitions
* Card hover effects
* Button hover effects
* Modal opening/closing
* Page content transitions
* Toast notifications
* Loading states where appropriate

Animations should be fast and subtle.

Avoid exaggerated animations or effects that make the application feel artificial.

---

# UX Requirements

The application must actually work as a front-end prototype.

The following interactions must work:

* Sidebar navigation
* Search
* Filters
* Opening/closing modals
* Adding exercises
* Removing exercises
* Creating workouts
* Adding students
* Editing mock student data
* Toast notifications
* Responsive sidebar
* WhatsApp button
* Dashboard navigation

Use JavaScript state management in a simple and understandable way.

Avoid writing everything inside one huge JavaScript function.

Create reusable functions/components where appropriate.

---

# Future Backend Architecture

This is very important.

Design the project as if a backend will be connected later.

Separate:

### UI logic

From:

### Data/state logic

For example, create mock repositories/services such as:

* `studentService`
* `machineService`
* `workoutService`

These can currently return mock data.

Later, they should be easy to replace with:

`fetch('/api/students')`

`fetch('/api/machines')`

`fetch('/api/workouts')`

Do not hardcode the same data repeatedly throughout the HTML.

Store mock data in `data.js` or appropriate JavaScript modules.

Use IDs for entities rather than relying only on names.

Example conceptual structure:

```javascript
students = [
    {
        id: 1,
        name: "Lucas Almeida",
        email: "lucas@example.com",
        status: "active",
        workoutId: 101
    }
]
```

This will make future database integration much easier.

---

# Code Quality

The generated project must:

* Follow semantic HTML5
* Use accessible buttons and forms
* Use meaningful class names
* Avoid duplicated code
* Avoid inline CSS whenever possible
* Avoid inline JavaScript
* Keep JavaScript modular
* Use comments only where they provide real value
* Be easy for another developer to understand
* Be prepared for future REST API integration

Do not create fake backend functionality.

Clearly keep mock data separated from the UI.

---

# Final Result

The final result should look like a **real gym management SaaS dashboard**, not a simple student project.

It should feel similar in quality to modern administrative platforms such as:

* CRM dashboards
* SaaS management systems
* Fitness management platforms

The user should be able to open `index.html` and immediately interact with the entire front-end.

Make the application visually polished, responsive and realistic.

Most importantly, prioritize **good architecture and maintainability** over adding unnecessary visual effects.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7e6391a0-095c-4de0-96e9-026fe80280f3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Use Node.js 20.6 ou superior (a instalação oficial do Node já inclui o npm).
Na raiz do projeto:

```sh
npm install
npm run check
npm test
npm run check:db
npm run dev
```

Abra **http://localhost:3000/gym/**. A API fica em **http://localhost:3000/**.

Antes da primeira execução, copie `backend/.env.example` para `backend/.env` e
informe a senha do MySQL. `PORT=3000` pode permanecer como está. Em `JWT_SECRET`,
use uma sequência aleatória com pelo menos 32 caracteres; comentários iniciados
por `#` não fazem parte do valor.
