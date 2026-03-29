
# StillSpace: Mental Wellness Web Application
Final Year Project Documentation

Prepared by: <Your Name>
University/College: <Your College Name>
Department: <Your Department>
Guide/Supervisor: <Guide Name>
Academic Year: 2025-2026

---

## Certificate
This is to certify that the project titled "StillSpace: Mental Wellness Web Application" is a bonafide work carried out by <Your Name>, bearing roll number <Roll Number>, under the guidance of <Guide Name>, in partial fulfillment of the requirements for the degree of <Degree Name>. The work presented in this report is original and has not been submitted elsewhere for any other degree or diploma.

Guide Signature: ________________________
Head of Department: _____________________
Date: _________________________________

---

## Declaration
I hereby declare that the project titled "StillSpace: Mental Wellness Web Application" is a bonafide record of work done by me under the guidance of my supervisor. The project work has not been submitted elsewhere for any degree or diploma.

Signature: ___________________
Date: ________________________

---

## Acknowledgement
I would like to express my sincere gratitude to my project guide for continuous support, valuable feedback, and encouragement throughout the development of this project. I also thank my department and peers for constructive discussions and motivation. Special thanks to my family for their patience and support during the completion of this project.

---

## Abstract
StillSpace is a mental wellness web application designed to provide users with a calm and supportive digital environment. The application allows users to log in, maintain a private journal, track daily moods, view mood analytics, practice breathing exercises, and receive supportive AI reflections. The interface follows modern mindfulness product design principles such as glassmorphism, soft gradients, generous whitespace, and a minimal dashboard layout. The backend is built with Node.js and Express, while data is stored in MongoDB. The system includes a fallback reflection engine when external AI services are unavailable. The application is deployed as a live web service so it can be accessed from any device with a browser. This document explains the purpose, architecture, design, implementation, testing, and deployment of StillSpace in detail.

---

## Table of Contents
1. Introduction
2. Literature Survey
3. System Analysis
4. System Design
5. Implementation
6. Testing
7. Deployment
8. Results and Discussion
9. Conclusion and Future Work
10. References
11. Appendices

---

## List of Figures
Figure 1: System Architecture Overview
Figure 2: Application Navigation Flow
Figure 3: Data Flow Diagram (Level 0)
Figure 4: Entity Relationship Diagram
Figure 5: Mood Trend Chart (Sample)
Figure 6: Breathing Animation Cycle
Figure 7: Dashboard Layout (Conceptual)
Figure 8: Journal Interaction Flow

---

## List of Tables
Table 1: Functional Requirements
Table 2: Non-Functional Requirements
Table 3: Hardware and Software Requirements
Table 4: Test Cases and Results
Table 5: API Endpoints
Table 6: Database Schema Summary
Table 7: Risk Register

---

## Abbreviations
AI  - Artificial Intelligence
API - Application Programming Interface
DB  - Database
DFD - Data Flow Diagram
ER  - Entity Relationship
UI  - User Interface
UX  - User Experience

---
# 1. Introduction

## 1.1 Background
Mental wellness is increasingly recognized as a daily practice rather than a once-in-a-while activity. People manage school, work, family responsibilities, and constant digital notifications. This creates a need for small, repeatable habits that can be completed in a few minutes without overwhelming the user. A digital wellness tool should feel calm and supportive rather than demanding or complex.

StillSpace is positioned as a lightweight space for reflection. It is not a clinical product; it is a gentle companion for daily check-ins. The goal is to remove friction so users can focus on the habit itself instead of learning a complicated interface.

## 1.2 Need for the Project
Many users want to journal or track moods, but they abandon apps when features feel heavy or when the interface is visually noisy. A simple web application can provide consistent access on phones, tablets, and laptops. A focused feature set encourages daily use. By offering only the essential tools, StillSpace reduces decision fatigue and helps users build a consistent routine.

## 1.3 Problem Statement
There is a gap between feature-rich wellness platforms and quick, everyday self-care. Users need a digital space that allows them to:
- Pause and reflect without distractions.
- Record mood and thoughts quickly.
- View simple trends for self-awareness.
- Receive supportive guidance without clinical language.

The challenge is to design a web application that is visually calm, technically reliable, and safe in how it delivers AI-driven text.

## 1.4 Objectives
The objectives of the project are:
- Design a calming, minimal interface with light and dark themes.
- Implement a secure and simple login and profile flow.
- Provide a journal with prompts and a clean editor.
- Store entries in a database with delete and retrieval features.
- Track daily moods and show a chart of trends.
- Provide a breathing exercise with clear guidance.
- Integrate AI reflections with safety guidelines.
- Ensure the system is beginner-friendly and easy to modify.

## 1.5 Scope
The project covers the following scope:
- Frontend pages: landing, login, dashboard, journal, mood tracker, breathing, and profile.
- Backend server with REST APIs.
- MongoDB database with three collections: users, journals, moods.
- AI reflection endpoint with fallback logic.
- Deployment readiness for both local and cloud hosting.

The scope excludes medical diagnosis, crisis management, or professional therapy features.

## 1.6 Constraints and Assumptions
Constraints include limited development time and use of free hosting tiers. The application assumes users have modern browsers with JavaScript enabled. User authentication is intentionally lightweight for simplicity; full-scale enterprise authentication is out of scope for this academic project.

## 1.7 Methodology
The project followed a structured process:
- Requirements: feature list, UI goals, and data requirements.
- Design: wireframes and visual system decisions.
- Development: frontend layout and component styling.
- Backend: API design and data modeling.
- Integration: connecting UI to backend APIs.
- Testing and deployment.

## 1.8 Organization of the Report
The report is organized into chapters covering research, analysis, design, implementation, testing, deployment, results, and future work. Appendices provide additional user and technical documentation.

---
## 1.9 Project Motivation
The motivation behind StillSpace is personal and practical. Many students and professionals experience stress but do not want a complicated app. A web tool that opens quickly, feels peaceful, and offers a few meaningful actions can encourage daily reflection. The project also demonstrates how design and engineering can work together to create a user experience that feels safe and welcoming.

## 1.10 Ethical Considerations
Because the application handles personal reflections, privacy and tone are important. StillSpace avoids making medical or diagnostic claims. The AI reflection system is constrained to provide supportive language only. The design avoids anxiety-inducing visuals or aggressive notifications. This approach respects user wellbeing and avoids misleading advice.

---
# 2. Literature Survey

## 2.1 Digital Mental Wellness Tools
Digital wellness tools range from meditation apps and guided audio to journaling and habit trackers. Research and practice in this area emphasize frequent small actions rather than occasional long sessions. A common pattern is a short morning or evening check-in, which supports awareness and consistency.

Many products succeed because they reduce cognitive load. When users are stressed, they need an interface that is calm and predictable. This project draws on that principle by keeping the navigation simple and limiting the number of actions on each screen.

## 2.2 Mood Tracking and Self-Reflection
Mood tracking provides a daily record of emotional states. Instead of detailed classification, many systems use a small set of moods to reduce friction. This also makes charts simpler and easier to interpret. Consistency is more valuable than precision for personal insight.

StillSpace uses five moods with clear labels. This strikes a balance between expressiveness and usability. The mood streak feature encourages daily engagement without turning the experience into a high-pressure goal.

## 2.3 Journaling for Emotional Regulation
Journaling helps individuals process events and emotions. Many digital journals provide prompts such as "What challenged you today?" or "What are you grateful for?" Prompts reduce the blank-page problem and are more approachable for first-time users.

StillSpace includes a rotating set of prompts and a clean writing area. The purpose is to create a safe space for self-expression without distractions.

## 2.4 Mindfulness and Breathing Techniques
Guided breathing is a common method for short-term calming. A 4-4-4 breathing cycle is easy to remember and has a stable rhythm. Visual animations reinforce the timing without requiring audio.

The breathing module in StillSpace uses a simple expanding and shrinking circle with text instructions. This keeps the guidance intuitive and accessible.

## 2.5 Design Patterns for Calm Interfaces
Calm interfaces use gentle colors, soft gradients, and ample whitespace. Typography tends to be clean and readable. Rounded shapes and subtle shadows create a friendly visual tone. Harsh contrast or overly saturated colors are avoided.

StillSpace adopts glassmorphism, soft blues and lavender, and a minimalist layout to support a peaceful user experience.

## 2.6 AI Reflection in Wellness Applications
AI reflection features can summarize user sentiment and provide supportive suggestions. However, there is a clear boundary between supportive reflection and medical advice. Systems should avoid diagnosis and keep language empathetic.

StillSpace includes an AI reflection endpoint with strict prompting and a fallback response generator when the AI is unavailable. This ensures continuity and safety.

## 2.7 Privacy and Trust Considerations
Users are more likely to share honest reflections if they trust the system. For personal journals, clarity about data usage is essential. While this academic prototype uses basic storage, the design decisions aim to be respectful of privacy and minimize data exposure.

## 2.8 Summary of Findings
The survey indicates that the most effective wellness tools prioritize simplicity, calm visual design, and consistency. StillSpace incorporates these principles into its product scope and interface design.

---
# 3. System Analysis

## 3.1 Existing Systems
Existing wellness solutions typically fall into three categories:
- Meditation-first apps focusing on guided sessions and audio.
- Journal-first apps centered on writing and note storage.
- Mood-tracking apps focusing on data visualization.

While each category provides value, many users want a small set of features that work together without complexity. A user who wants to journal may also want to track mood, and a mood tracker is more meaningful when paired with reflection.

## 3.2 Limitations of Existing Systems
Key limitations observed in popular solutions include:
- Overly complex onboarding flows.
- Limited customization of daily prompts.
- Heavy emphasis on notifications or gamification.
- Interfaces that feel clinical rather than calming.
- Lack of a single space combining mood, reflection, and breathing.

## 3.3 Proposed System Overview
StillSpace integrates journaling, mood tracking, breathing, and AI reflection in one minimal experience. The system is designed to be used for 5 to 10 minutes a day. Instead of a feature-heavy dashboard, the user sees gentle prompts and a few clear actions.

## 3.4 User Personas
Persona 1: College Student
- Needs a quick way to check in during busy schedules.
- Wants a calming interface without distractions.

Persona 2: Working Professional
- Wants simple mood tracking and short breathing exercises.
- Prefers a low-commitment daily routine.

Persona 3: First-time Wellness User
- Needs a friendly, gentle introduction to reflection.
- Prefers prompts and minimal text input.

## 3.5 Use Case Analysis
Use Case 1: Login and Save Profile
- Actor: User
- Precondition: User opens login page.
- Flow: Enter email and nickname -> Submit -> Redirect to dashboard.
- Postcondition: Profile is stored and session is created.

Use Case 2: Write Journal Entry
- Actor: User
- Precondition: User is logged in.
- Flow: Open journal -> Read prompt -> Write entry -> Save.
- Postcondition: Entry is stored in DB.

Use Case 3: Analyze with AI
- Actor: User
- Precondition: Journal entry exists.
- Flow: Click Analyze -> Server processes -> Response shown.
- Postcondition: Supportive reflection displayed.

Use Case 4: Log Mood
- Actor: User
- Flow: Select mood -> Submit -> Data stored.
- Postcondition: Mood appears in chart and streak updated.

Use Case 5: Use Breathing Exercise
- Actor: User
- Flow: Open breathing page -> Follow animated cycle.
- Postcondition: User completes relaxation cycle.

## 3.6 Functional Requirements
Table 1: Functional Requirements
1. Create and store user profile.
2. Provide secure API for journals.
3. Provide delete option for journals.
4. Display daily prompts.
5. Record and display moods.
6. Compute mood streak.
7. Render mood chart.
8. Provide breathing guidance.
9. Enable light and dark themes.
10. Delete account and associated data.

## 3.7 Non-Functional Requirements
Table 2: Non-Functional Requirements
- Usability: Simple navigation and minimal learning curve.
- Performance: Smooth transitions and fast API responses.
- Reliability: Data persistence for entries.
- Security: Basic validation and safe AI output.
- Maintainability: Clean code structure and comments.
- Scalability: Ability to add features later.

## 3.8 Constraints
- Limited time for development.
- Use of free-tier hosting for deployment.
- Simple authentication without complex passwords.

## 3.9 Feasibility Study
### Technical Feasibility
The project uses established technologies. Node.js and MongoDB are suitable for a small-scale application and have extensive community support.

### Economic Feasibility
The project is low-cost because it uses open-source tools and free cloud tiers. Optional AI usage is limited and can be disabled.

### Operational Feasibility
The system is easy to operate with minimal training. The UI is straightforward for new users.

### Schedule Feasibility
The project scope aligns with the academic timeline and can be completed in phases.

### Legal and Ethical Feasibility
The project avoids medical claims and focuses on supportive language. User data is handled with basic privacy considerations.

---
## 3.10 Requirement Prioritization
The requirements were categorized using a simple priority model:
- Must Have: Login, journal, mood tracking, database storage, dashboard, dark mode.
- Should Have: Mood streak, chart visualization, AI reflection.
- Could Have: Daily focus ritual, motivational quotes, affirmations.
- Won't Have (in this version): Notifications, multi-language, social sharing.

## 3.11 Assumptions
- Users are comfortable using a browser-based application.
- Users will access the system on modern devices.
- Internet connectivity is available for cloud deployment.
- The AI feature is optional and can be turned off.

## 3.12 System Limitations
- The application uses simple login without password-based authentication.
- AI reflections are general and non-clinical.
- Offline usage is not supported.
- The system is designed for individual personal use.

---
# 4. System Design

## 4.1 Design Goals
The design goals for StillSpace focus on calmness, clarity, and minimal friction. The system should feel supportive and gentle. Key design goals include:
- Minimal steps to complete tasks.
- Soft visuals with consistent spacing.
- A dashboard that summarizes the day without clutter.
- Clear feedback for user actions.

## 4.2 Architectural Design
StillSpace follows a classic client-server architecture. The browser renders the user interface and sends requests to the backend. The backend processes data and communicates with MongoDB.

Figure 1: System Architecture Overview
Client (HTML/CSS/JS) -> Express API -> MongoDB
                           |
                           -> AI Reflection Service (optional)

## 4.3 Module Design
The system is divided into modules:
- UI Module: static pages, navigation, and theme.
- Journal Module: prompt, entry saving, AI analysis.
- Mood Module: mood logging, streak computation, chart.
- Breathing Module: animated guidance.
- Profile Module: nickname storage and account deletion.

## 4.4 Data Flow Diagram
A DFD describes the flow of information between the user and the system.
- User enters journal entry -> API saves journal -> DB stores entry -> UI fetches list.
- User logs mood -> API saves mood -> DB stores record -> Chart fetches data.
- User requests AI reflection -> API sends entry -> AI or fallback -> UI displays text.

## 4.5 Entity Relationship Diagram
Entities:
- User: email, nickname, createdAt.
- Journal: userEmail, prompt, entry, createdAt.
- Mood: userEmail, mood, dateKey, createdAt.

Relationships:
- One user to many journal entries.
- One user to many mood records.

## 4.6 UI Design System
The UI uses a shared design system:
- Colors: soft lavender, light blue, pastel purple, white.
- Typography: Playfair Display for headings, Plus Jakarta Sans for body.
- Surfaces: glassmorphism cards with blur and soft borders.
- Spacing: generous padding for calmness.
- Motion: subtle hover lift and smooth transitions.

## 4.7 Layout Design
The layout is organized as:
- Sidebar navigation on the left.
- Main content on the right with cards.
- Cards grouped in logical sections.
- Consistent margins and rounded corners.

## 4.8 Color Palette
The palette uses light gradients to create depth:
- Primary: #6e7cff
- Accent: #69b7ff
- Background: #f3f6ff, #e9f4ff, #f3ecff
- Dark mode background: #101733

## 4.9 Typography
Typography choices focus on calm readability:
- Headings: Playfair Display (serif for elegance).
- Body: Plus Jakarta Sans (clean and modern).
- Font sizes scaled for clarity without overwhelming.

## 4.10 Responsive Design
The layout adjusts for small screens:
- Sidebar collapses into a stacked layout.
- Cards become full-width.
- Buttons and inputs scale for touch interaction.

## 4.11 Security Design
Although the project is academic, it includes basic security practices:
- Input validation on server side.
- Clear separation between client and server.
- No medical or clinical advice in AI responses.
- Account deletion removes user data.

## 4.12 Algorithm Design
Mood streak algorithm (simplified):
1. Collect unique date keys.
2. Sort by most recent.
3. If latest is today or yesterday, start streak.
4. Continue until a gap is found.

AI reflection fallback algorithm:
1. Check for keywords (stress, tired, calm).
2. Map keywords to supportive response templates.
3. Return gentle suggestion.

## 4.13 Accessibility Considerations
- Sufficient color contrast for readability.
- Clear focus states on inputs.
- Large touch targets for mood buttons.
- Avoids flashing or aggressive animations.

---
## 4.14 Data Validation Rules
- Email is normalized to lowercase and trimmed.
- Nickname is trimmed and stored as plain text.
- Journal entries are required to have non-empty text.
- Mood entries are limited to the predefined mood list.
- Date keys follow YYYY-MM-DD format for consistency.

## 4.15 Error Handling Design
- API responses include a message field for errors.
- Client displays toast notifications for failures.
- Silent fallback is used for AI reflections when external requests fail.

## 4.16 UX Micro-Interactions
- Cards lift slightly on hover to indicate interactivity.
- Buttons show subtle glow to confirm action availability.
- Page transitions fade smoothly to reduce abrupt changes.

---
# 5. Implementation

## 5.1 Frontend Overview
The frontend is built using plain HTML, CSS, and JavaScript to keep the project beginner-friendly. Each page loads the shared stylesheet and the common JavaScript logic in `js/app.js`. This file manages theme selection, login session handling, dashboard loading, and shared UI utilities such as toast notifications.

## 5.2 HTML Pages
### Landing Page (index.html)
- Contains the hero section and feature highlights.
- Includes navigation links to login and feature sections.
- Uses the theme toggle button in the top-right.

### Login Page (login.html)
- Contains a simple form with email and nickname.
- Stores user profile in the database and localStorage.
- Redirects to dashboard after successful login.

### Dashboard Page (dashboard.html)
- Shows a welcome title, daily check-in card, and snapshot stats.
- Displays motivational quote and affirmation.
- Shows mood streak and a daily focus ritual list.

### Journal Page (journal.html)
- Displays a random prompt.
- Provides a textarea for writing entries.
- Includes buttons to save and analyze with AI.
- Lists recent entries with delete buttons.

### Mood Page (mood.html)
- Provides five mood buttons.
- Saves mood data with date key.
- Renders Chart.js line chart for history.

### Breathing Page (breathe.html)
- Shows animated breathing circle.
- Provides textual guidance for inhale, hold, exhale.

### Profile Page (profile.html)
- Displays nickname and email.
- Allows nickname update.
- Provides delete account option.

## 5.3 CSS Design System
The `css/style.css` file defines tokens and reusable classes:
- CSS variables for colors and typography.
- `.glass` class for frosted card effect.
- `.btn`, `.btn-primary`, `.btn-secondary` for buttons.
- `.icon-btn` for circular icon toggles.
- Layout utilities for dashboard grids and cards.

A theme toggle uses the `body.dark` class to switch variables and create a dark mode.

## 5.4 JavaScript Files
### app.js
Main client-side logic includes:
- Theme initialization and persistence.
- Session handling using localStorage.
- Fetch requests to backend APIs.
- Rendering dynamic dashboard content.
- Mood streak calculation and tip rotation.

### prompts.js
Contains the list of daily prompts used in the journal page. A random prompt is selected each time the page loads.

### chart.js
Configures the Chart.js line chart for mood history. It maps mood values to numeric scores for plotting.

### breathe.js
Controls the breathing animation cycle and updates the instruction text every 4 seconds.

### ai.js
Handles the AI reflection interaction on the journal page and displays responses.

## 5.5 Backend Implementation
The backend is implemented in `server/server.js`. It uses Express and Mongoose. Core responsibilities include:
- Routing for login, journal, mood, and AI reflection.
- Connecting to MongoDB.
- Validating request payloads.
- Returning JSON responses.

### Example Login Logic
- Receive email and nickname.
- Normalize email.
- Upsert user profile.
- Return success message.

### Example Journal Flow
- Receive entry text and prompt.
- Store entry with timestamp.
- Return updated entry list.

## 5.6 Database Schema
The project uses three collections.

Users:
- email (String, unique)
- nickname (String)
- createdAt (Date)

Journals:
- userEmail (String)
- prompt (String)
- entry (String)
- createdAt (Date)

Moods:
- userEmail (String)
- mood (String)
- dateKey (String)
- createdAt (Date)

## 5.7 API Endpoint Details
Table 5: API Endpoints
- POST /login
- GET /profile
- PUT /profile
- DELETE /account
- POST /journal
- GET /journal
- DELETE /journal/:id
- POST /mood
- GET /mood
- POST /ai-reflection

### Sample Request: POST /journal
{
  "userEmail": "user@example.com",
  "prompt": "What made you feel calm today?",
  "entry": "I felt calm after a short walk."
}

### Sample Response
{
  "message": "Entry saved",
  "entries": [ ... ]
}

## 5.8 AI Reflection Prompting
The AI reflection uses a system prompt to ensure safe and supportive text. The model is asked to:
- Detect emotional tone.
- Provide gentle suggestions.
- Avoid medical advice or diagnosis.

If the API key is missing, a fallback response is generated from a small template list.

## 5.9 Data Flow in the Client
1. Page loads and calls `initTheme`.
2. If protected page, `requireAuth` checks session.
3. Data fetch happens using `apiRequest` helper.
4. DOM updates based on responses.
5. Toast notifications show success or errors.

## 5.10 Error Handling and Edge Cases
- Empty journal entries are rejected.
- Duplicate mood for the same day overwrites the previous entry.
- Network errors trigger toast messages.

---
## 5.11 Mood Mapping for Charts
Moods are mapped to numeric values to plot trends:
- Happy: 5
- Calm: 4
- Neutral: 3
- Sad: 2
- Stressed: 1

This mapping makes the chart intuitive, showing higher values for more positive moods.

## 5.12 Theme Toggle Implementation
The theme toggle button stores the user preference in localStorage. When the page loads, the stored theme is applied. The button uses a sun or moon icon depending on the current theme. This provides a clear visual indicator without text.

## 5.13 Journal Streak Logic
A journal streak is calculated by examining entry dates, similar to the mood streak. This encourages users to write consistently but does not penalize them harshly for gaps.

## 5.14 Daily Focus Ritual
The dashboard includes a simple list of daily intentions. The user can add up to three items. The list is stored in localStorage so it remains private to the user device.

## 5.15 Accessibility Enhancements
- Buttons include aria-labels.
- Input fields have labels.
- Focus styles are visible in both light and dark mode.

---
# 6. Testing

## 6.1 Testing Environment
Testing was carried out on a Windows 11 system with Chrome and Edge. MongoDB was tested both locally and using Atlas. The server was run using Node.js with the development script.

## 6.2 Testing Strategy
A mixed strategy was used:
- Manual UI testing for layout and interaction.
- Integration testing for API routes and database persistence.
- Logic testing for streak calculations and date formatting.

## 6.3 Unit Testing (Manual)
Although formal unit test frameworks were not used, the following functions were manually verified with sample data:
- dateToKey and dateKeyToDate
- calculateMoodStreak
- calculateJournalStreak

## 6.4 Integration Testing
The following flows were tested end-to-end:
- Login -> Dashboard
- Journal save -> Entry list refresh
- Journal delete -> Entry removed
- Mood save -> Chart refresh
- Profile update -> New nickname shown
- Account delete -> Session cleared and data removed

## 6.5 UI and Responsiveness Testing
- Desktop layout tested at 1366x768 and 1920x1080.
- Mobile layout tested with browser dev tools at 360x640.
- The sidebar layout collapses properly and cards adjust to full width.

## 6.6 Error Handling Tests
- API called with empty journal entry returns error.
- Network error triggers toast message.
- Missing AI key triggers fallback reflection.

## 6.7 Test Cases and Results
Table 4: Test Cases and Results
1. Login with email and nickname -> Pass
2. Save journal entry -> Pass
3. Delete journal entry -> Pass
4. Mood log creation -> Pass
5. Mood chart displays -> Pass
6. AI reflection returns -> Pass
7. Dark mode toggle -> Pass
8. Profile update -> Pass
9. Account deletion -> Pass

## 6.8 Bug Fixes
During testing, the following issues were found and fixed:
- Theme toggle text overflow was replaced by a circular icon button.
- Journal entries were not saving when the API failed, which was fixed by error handling.
- Mood streak reset was incorrect when entries were missing, which was corrected by date comparison logic.

## 6.9 Performance Testing
- Average page load time under 1 second on local server.
- API response times under 200 ms in local environment.

---
# 7. Deployment

## 7.1 Local Deployment Steps
1. Install Node.js and npm.
2. Install MongoDB or use MongoDB Atlas.
3. Open terminal in project folder.
4. Run `npm install`.
5. Copy `.env.example` to `.env`.
6. Set `MONGODB_URI` inside `.env`.
7. Run `npm run dev`.
8. Open `http://localhost:3000` in the browser.

## 7.2 MongoDB Atlas Setup (Cloud)
1. Create a MongoDB Atlas account.
2. Create a new cluster (free tier).
3. Create a database user with username and password.
4. In Network Access, allow IP address (0.0.0.0/0 for testing).
5. Get the connection string from the Drivers option.
6. Replace `<db_password>` with your password and set in `.env`.

## 7.3 Render Deployment Steps
1. Push project to GitHub.
2. Create a new web service on Render.
3. Connect the GitHub repository.
4. Set the build command: `npm install`.
5. Set the start command: `node server/server.js`.
6. Add environment variables:
   - MONGODB_URI
   - OPENAI_API_KEY (optional)
7. Deploy and open the public URL.

## 7.4 Access from Multiple Devices
- On local network, use your machine's IP address and port.
- Example: `http://192.168.x.x:3000`.
- For worldwide access, use the deployed Render URL.

## 7.5 Backup and Maintenance
- MongoDB Atlas provides automated backups for cluster data.
- The project can be updated by pushing new commits to GitHub.
- Render auto-deploys if enabled.

---
# 8. Results and Discussion

## 8.1 Feature Completion Summary
The final version of StillSpace includes:
- Full UI flow from login to profile.
- Journal and mood tracking with persistent storage.
- Chart analytics for mood trends.
- Breathing exercise with animation.
- AI reflection with fallback responses.
- Dark mode toggle with icon-based control.

## 8.2 UI Evaluation
The interface uses soft gradients, glass cards, and consistent spacing. User feedback indicated the UI felt calm and easy to understand. The focus on whitespace and large cards reduces visual clutter. The icon-based theme toggle improved aesthetics and usability.

## 8.3 Data Integrity
Journal entries and moods are stored reliably. The mood streak feature correctly counts consecutive days. Deleting entries updates the UI immediately.

## 8.4 Performance
The application performs smoothly on both desktop and mobile browsers. The chart updates quickly and animations are smooth.

## 8.5 Limitations
- Authentication is simplified for academic scope.
- AI reflections are limited to short supportive text.
- No offline mode.
- No push notifications or reminders.

---
# 9. Conclusion and Future Work

## 9.1 Conclusion
StillSpace demonstrates that a small, focused set of wellness tools can deliver meaningful daily support. By combining mood tracking, journaling, breathing exercises, and AI reflections in a calm interface, the application helps users build simple self-care routines. The system meets the academic objectives and provides a complete web-based product with a clear visual identity.

## 9.2 Future Enhancements
Possible future improvements include:
- Stronger authentication with passwords or OAuth.
- Export options for journals in PDF or text.
- Optional reminders and notifications.
- Multi-language support for wider accessibility.
- More advanced analytics, such as weekly summaries.
- Audio-guided meditation sessions.

---

# 10. References
1. General mindfulness and journaling resources.
2. Web development resources for Node.js, Express, and MongoDB.
3. UI/UX references for calm design systems.

---

# 11. Appendices

## Appendix A: User Manual (Detailed)
### A.1 Login
1. Open the login page.
2. Enter email and nickname.
3. Press Login.
4. You will be redirected to the dashboard.

### A.2 Dashboard
- View daily summary cards.
- Read quote and affirmation.
- Check mood streak.
- Open quick links to journal, mood, and breathing.

### A.3 Journal
1. Read the daily prompt.
2. Write your entry in the textarea.
3. Click Save Entry to store it.
4. Click Analyze with AI to receive reflection.
5. Use Delete to remove an entry.

### A.4 Mood Tracker
1. Select a mood button.
2. Your mood is saved with today's date.
3. View mood trend chart below.

### A.5 Breathing
1. Follow the inhale, hold, exhale cycle.
2. Repeat for a few minutes.

### A.6 Profile
1. View nickname and email.
2. Update nickname.
3. Delete account if needed.

## Appendix B: API Endpoints (Detailed)
- POST /login
  - Request: { "email": "...", "nickname": "..." }
  - Response: { "message": "Logged in" }

- GET /profile
  - Request: query param email
  - Response: { "email": "...", "nickname": "..." }

- PUT /profile
  - Request: { "email": "...", "nickname": "..." }
  - Response: { "message": "Profile updated" }

- DELETE /account
  - Request: { "email": "..." }
  - Response: { "message": "Account deleted" }

- POST /journal
  - Request: { "userEmail": "...", "entry": "...", "prompt": "..." }
  - Response: { "message": "Entry saved" }

- GET /journal
  - Request: query param userEmail
  - Response: { "entries": [ ... ] }

- DELETE /journal/:id
  - Response: { "message": "Entry deleted" }

- POST /mood
  - Request: { "userEmail": "...", "mood": "...", "dateKey": "..." }
  - Response: { "message": "Mood saved" }

- GET /mood
  - Request: query param userEmail
  - Response: { "moods": [ ... ] }

- POST /ai-reflection
  - Request: { "entry": "..." }
  - Response: { "reflection": "..." }

## Appendix C: Database Schema Summary
Users Collection:
- email: String (unique)
- nickname: String
- createdAt: Date

Journals Collection:
- userEmail: String
- prompt: String
- entry: String
- createdAt: Date

Moods Collection:
- userEmail: String
- mood: String
- dateKey: String
- createdAt: Date

## Appendix D: Project Plan and Timeline
Week 1-2: Requirements and UI planning.
Week 3-4: Database and backend APIs.
Week 5-6: Frontend development.
Week 7: Integration and testing.
Week 8: Deployment and documentation.

## Appendix E: Risk Register
Table 7: Risk Register
- Risk: AI API downtime -> Mitigation: fallback responses.
- Risk: Data loss -> Mitigation: backups and validation.
- Risk: User confusion -> Mitigation: simple UI and prompts.

## Appendix F: File Structure
/ (project root)
  index.html
  login.html
  dashboard.html
  journal.html
  mood.html
  breathe.html
  profile.html
  css/style.css
  js/app.js
  js/ai.js
  js/breathe.js
  js/chart.js
  js/prompts.js
  server/server.js
  package.json

## Appendix G: Glossary
- Mood Streak: consecutive days of mood logging.
- Reflection Prompt: a short question to guide journaling.
- Glassmorphism: UI style with frosted glass effects.
- Dashboard: main page showing summaries and actions.

---

## Appendix H: Detailed Installation Guide (Local)
This appendix provides a step-by-step guide that can be followed even by beginners.

Step 1: Install Node.js
- Download Node.js from the official website.
- Install the LTS version.
- Confirm installation using `node -v` and `npm -v`.

Step 2: Install MongoDB (or use Atlas)
- Option A: Install MongoDB Community Server locally.
- Option B: Use MongoDB Atlas for cloud storage.

Step 3: Project Setup
- Open terminal inside the project folder.
- Run `npm install` to install dependencies.

Step 4: Environment Variables
- Copy `.env.example` to `.env`.
- Set `MONGODB_URI` to your database connection string.
- Optionally set `OPENAI_API_KEY` for AI reflections.

Step 5: Run the Server
- Start the application using `npm run dev`.
- Visit `http://localhost:3000` in a browser.

## Appendix I: Cloud Deployment Guide (Detailed)
This guide explains how to make the project available online.

Step 1: GitHub Repository
- Initialize Git with `git init`.
- Commit all project files.
- Push to GitHub using `git remote add origin` and `git push`.

Step 2: Render Setup
- Create a Render account.
- Add a new Web Service.
- Connect your GitHub repository.
- Set build command to `npm install`.
- Set start command to `node server/server.js`.
- Add environment variables.

Step 3: Verify Deployment
- Open the Render service URL.
- Login and test all features.

## Appendix J: Data Dictionary (Detailed)
Users Collection
- email: String, required, unique, stored in lowercase.
- nickname: String, required, display name.
- createdAt: Date, auto-generated.

Journals Collection
- userEmail: String, required, references user.
- prompt: String, reflection prompt.
- entry: String, user text input.
- createdAt: Date, time of entry.

Moods Collection
- userEmail: String, required, references user.
- mood: String, one of [Happy, Calm, Neutral, Sad, Stressed].
- dateKey: String, formatted YYYY-MM-DD.
- createdAt: Date, time of log.

## Appendix K: User Stories and Acceptance Criteria
User Story 1: As a user, I want to log in quickly so I can start using the app.
- Acceptance: Login completes within one step and redirects to dashboard.

User Story 2: As a user, I want to write a journal entry and save it.
- Acceptance: Entry appears in list after saving.

User Story 3: As a user, I want to log my mood daily.
- Acceptance: Mood shows on chart and streak updates.

User Story 4: As a user, I want supportive AI feedback.
- Acceptance: Reflection appears within a few seconds.

User Story 5: As a user, I want to switch between dark and light mode.
- Acceptance: Theme persists after refresh.

## Appendix L: UI Walkthrough (Screen Descriptions)
Landing Page:
- Shows brand name, hero message, and feature highlights.

Login Page:
- Simple input fields for email and nickname.
- Theme toggle in the top-right corner.

Dashboard:
- Welcome header with theme icon.
- Daily check-in card with date and quick breathing link.
- Snapshot cards for mood and journal stats.
- Quotes and affirmations section.
- Daily focus ritual list.

Journal Page:
- Prompt at the top.
- Large textarea for writing.
- Buttons for Save and Analyze.
- Entry list with delete buttons.

Mood Page:
- Five mood buttons in a row.
- Chart showing mood trend over time.

Breathing Page:
- Animated circle with inhale, hold, exhale instructions.

Profile Page:
- Displays current nickname and email.
- Update nickname form.
- Delete account button.

## Appendix M: Troubleshooting Guide
Problem: `npm` scripts blocked on Windows.
- Fix: Run PowerShell as admin and set execution policy to RemoteSigned, or use `npm.cmd`.

Problem: MongoDB connection error.
- Fix: Check `MONGODB_URI` and confirm Atlas IP whitelist includes your IP.

Problem: Charts not showing.
- Fix: Ensure Chart.js is loaded and mood data exists.

Problem: AI reflection not working.
- Fix: Add `OPENAI_API_KEY` or rely on fallback.

Problem: Page styles not applying.
- Fix: Ensure `css/style.css` path is correct in HTML.

## Appendix N: Ethics and Privacy Notes
StillSpace stores personal reflections and mood logs, so ethical handling is important. The project avoids claims of diagnosis or therapy. AI reflections are designed to be supportive and non-clinical. Users can delete their account and data at any time. In a production system, additional security measures such as encryption, strict authentication, and audit logs should be considered.

## Appendix O: Maintenance and Scaling Notes
If usage increases, the following improvements can be made:
- Add indexing to MongoDB collections for faster queries.
- Introduce authentication with hashed passwords.
- Add server-side rate limiting for API protection.
- Use CDN for static assets.
- Introduce caching for frequently used data.

## Appendix P: Sample Viva Questions
1. Why did you choose Node.js and MongoDB?
2. How is mood streak calculated?
3. What steps did you take to ensure safe AI responses?
4. How does the dark mode implementation work?
5. How would you scale this application for many users?

<<<<<<< HEAD
=======

>>>>>>> 3b80a05 (Refine report generation and shorten project documentation)
## Appendix Q: Expanded Literature Notes
This appendix adds deeper context from general digital wellness practices. Many wellness tools emphasize habit loops: cue, routine, reward. The cue might be a daily reminder, the routine is the journaling or mood log, and the reward is a gentle summary or affirmation. StillSpace uses soft prompts and a short flow so the routine feels achievable. A short flow increases the chance of repeating the habit daily.

Another theme in wellness tools is self-compassion. Interfaces that feel judgmental reduce usage. StillSpace avoids red alerts or aggressive metrics. Instead of showing a failure, it simply resets the streak. This aligns with a supportive approach that encourages users to return without guilt.

Digital journaling often benefits from prompts. Without prompts, many people do not know how to begin. This project provides prompts that are short, neutral, and open-ended. The prompts were selected to avoid medical or diagnostic content and to encourage reflection on feelings and actions.

Mood tracking is usually simplified to avoid overwhelming users with too many labels. A five-point mood set is commonly used. It can be easily visualized and interpreted. In StillSpace, the chart provides a trend rather than exact analysis. This is intentional to avoid over-interpretation.

Breathing tools often use time-based cycles. The 4-4-4 rhythm is simple enough for beginners but still effective for slowing the breath. The visual feedback is a common pattern because it can be used in quiet environments without audio.

## Appendix R: Requirement Traceability Matrix (Detailed)
This matrix shows how requirements map to design and implementation decisions.

Requirement: User login and profile storage.
Design: Simple login page and profile model.
Implementation: POST /login and localStorage session.

Requirement: Journal with prompts.
Design: Prompt banner and large textarea.
Implementation: prompts.js, POST /journal, GET /journal.

Requirement: Mood tracking and streak.
Design: Mood buttons and streak card.
Implementation: POST /mood, GET /mood, streak functions.

Requirement: Breathing exercise.
Design: Animated circle and cycle text.
Implementation: breathe.js animation loop.

Requirement: AI reflection.
Design: Analyze button with safe output.
Implementation: POST /ai-reflection with fallback.

Requirement: Dark mode.
Design: Icon toggle and CSS variables.
Implementation: theme toggle in app.js and CSS theme variables.

## Appendix S: Algorithm Walkthroughs
Mood streak algorithm walkthrough:
1. Convert all mood dates to date keys.
2. Remove duplicates to avoid multiple logs in one day.
3. Sort in descending order.
4. Check if latest is today or yesterday. If not, streak is 0.
5. Compare each consecutive date and count only when difference is one day.

Journal streak algorithm uses the same logic but based on journal entry dates. This keeps behavior consistent across features.

AI fallback algorithm walkthrough:
1. Convert entry to lowercase.
<<<<<<< HEAD
2. Search for keywords such as \"stressed\", \"tired\", \"calm\", \"happy\".
=======
2. Search for keywords such as "stressed", "tired", "calm", "happy".
>>>>>>> 3b80a05 (Refine report generation and shorten project documentation)
3. If a keyword is found, select a matching supportive response.
4. If none match, return a neutral encouragement.
5. Always return a short, gentle message without medical advice.

## Appendix T: Extended User Manual (Narrative Style)
When the user opens StillSpace for the first time, the landing page introduces the product in a calm and friendly way. The hero section invites the user to pause and explore. The visual design uses a soft gradient background to create a feeling of space and quiet. This first impression matters because it communicates that the app is safe and not overwhelming.

On the login page, the user enters an email and a nickname. The nickname becomes a personal greeting throughout the dashboard. This small personalization helps users feel connected to the space. After login, the dashboard provides a quick overview rather than a dense list of tasks. The daily check-in card is intentionally large and clear to encourage a small moment of reflection.

The user can choose to write a journal entry or log a mood. In the journal page, the prompt is shown above the text area so users are never faced with a blank page. The save button confirms storage and the entry appears in the list immediately. If the user selects Analyze with AI, a gentle reflection appears below. This reflection is short so it does not compete with the user's own writing.

In the mood tracker, the user selects one of five moods. The chart below updates and shows a trend line. This visual is not intended to diagnose, but to help users notice patterns. The mood streak reinforces daily consistency with a simple number rather than a complex metric.

The breathing page is a quiet space for short breaks. The circle expands and contracts, matching a 4-4-4 rhythm. This animation is intentionally slow and smooth. The text instructions are clear and do not require the user to do any calculations.

The profile page allows the user to update their nickname or delete their account. Account deletion removes data for privacy, which is important in mental wellness contexts. The entire flow is designed to be respectful of user agency.

## Appendix U: Sample Data and Expected Outputs
Sample Journal Entry:
Prompt: What made you feel calm today?
Entry: I felt calm after listening to music and taking a short walk.
AI Reflection (expected): It sounds like quiet routines helped you feel centered today. Returning to small calming activities can be a gentle way to reset your mood.

Sample Mood Logs:
2025-03-01: Calm
2025-03-02: Neutral
2025-03-03: Happy
2025-03-04: Stressed
2025-03-05: Calm

Expected Mood Trend:
The chart should show a drop on 2025-03-04 and rise on 2025-03-05. The streak should reflect consecutive entries if no days were skipped.

## Appendix V: Project Management and SDLC
The project followed a lightweight software development life cycle. The first phase focused on requirements and design, where user needs were collected and a minimal feature set was selected. The second phase focused on core development of the backend and database. The third phase added frontend pages and styling. The fourth phase integrated features together and added AI reflection. The final phase involved testing, bug fixes, and deployment.

Milestones included the completion of login flow, dashboard layout, journal module, mood tracking, and AI integration. Each milestone was followed by a small review and refinement before moving to the next. This staged approach helped keep the project manageable and reduced the risk of major rework.

## Appendix W: UI and UX Guidelines for Future Work
If future developers extend StillSpace, the following guidelines can help preserve the calm experience:
- Maintain generous spacing between sections.
- Avoid bright or highly saturated colors.
- Keep interaction feedback subtle and smooth.
- Use short, encouraging language in prompts and buttons.
- Ensure dark mode feels soft rather than harsh.

## Appendix X: Sample Feedback Form
1. How calm did the interface feel? (1-5)
2. Was the journal prompt helpful? (Yes/No)
3. Did the mood tracker feel easy to use? (Yes/No)
4. What feature was most useful to you?
5. What feature could be improved?
6. Would you use this tool daily? (Yes/No)

## Appendix Y: Extended Literature Review and Theoretical Background
This extended section summarizes general ideas from mental wellness practices and how they inform StillSpace. It is not a clinical review but a practical interpretation for a student project.

### Y.1 Habit Formation and Daily Rituals
Many behavior change models describe habits as a loop of cue, routine, and reward. A cue may be a time of day or a small visual reminder. The routine is the action itself, such as writing a short journal entry or selecting a mood. The reward is the feeling of completion or a gentle affirmation. A successful wellness product reduces the friction in this loop so the routine is easy to repeat. StillSpace supports this by offering one-click actions and a welcoming dashboard that can be completed in minutes.

A common issue in habit formation is inconsistency caused by complexity. When a tool requires too many steps or introduces too many options, users may stop using it. Simple prompts and limited choices reduce the burden of decision making. This is why StillSpace uses five moods and short prompts instead of complex classification.

### Y.2 Journaling and Emotional Processing
Journaling is often used as a way to process thoughts and reduce mental clutter. In a digital context, the key is to make journaling feel safe and private. Prompts encourage users to start writing without fear of judgment. Short prompts also allow users to respond quickly without needing to compose a long narrative. The StillSpace prompts are designed to be neutral and open-ended, allowing many types of responses.

Another aspect of journaling is reflection. Many users do not revisit their entries, so a small supportive reflection can help them see patterns or feel acknowledged. This is why a short AI response is included, but with careful safety constraints to avoid inappropriate advice.

### Y.3 Mood Awareness and Self-Regulation
Mood tracking helps users notice changes over time. The value is not in perfect accuracy but in visibility. When a user sees a simple chart, they may connect mood changes with daily routines or life events. This supports self-regulation by making patterns visible. StillSpace keeps the chart simple and avoids technical analytics to maintain a gentle experience.

Some systems use emotion wheels or long lists of moods, but that can overwhelm users. A simplified list helps daily consistency and encourages steady usage. The goal is to reduce friction rather than provide a clinical tool.

### Y.4 Mindfulness and Breathing Practice
Mindfulness practices often emphasize focusing on the present moment. Breathing exercises are a practical way to guide attention. The 4-4-4 rhythm used in StillSpace is simple for beginners. The visual animation allows the user to follow the cycle without counting. This is important because the goal is to reduce mental load, not increase it.

Short breathing sessions are more likely to be used regularly. A quick, calming loop can help users during study breaks or stressful moments. StillSpace provides this in a simple, lightweight page without additional distractions.

### Y.5 Positive Psychology and Supportive Language
Positive psychology emphasizes small improvements in wellbeing through gratitude, reflection, and kindness. StillSpace includes daily affirmations and motivational quotes to encourage this perspective. The content is not overly inspirational or intense. It is designed to feel realistic and gentle, aligning with the calm aesthetic.

Supportive language is also key in AI reflections. The system prompts the AI to be empathetic and non-clinical. This avoids overstepping into therapy or diagnosis. The fallback responses follow the same tone to ensure consistency.

### Y.6 Digital Product Design for Calm Experiences
Wellness products often use soft gradients, rounded corners, and minimal text. These design choices are not only aesthetic. They influence how users feel. Strong contrast, sharp angles, and loud colors can create tension. StillSpace intentionally uses muted palettes and glass cards to provide a quiet, modern look.

Motion design also plays a role. Subtle animations can create a feeling of smoothness and care. However, too much motion can distract users. StillSpace uses small hover lifts and soft transitions between pages. The breathing animation is the only strong motion element, and it is slow and controlled.

### Y.7 Privacy and Trust
For journaling and mood tracking, privacy is central. Even in a student project, it is important to allow users to delete their account and remove data. StillSpace provides this feature in the profile page. In real-world use, stronger security would be required, but the project demonstrates awareness of privacy principles.

<<<<<<< HEAD
---
=======
>>>>>>> 3b80a05 (Refine report generation and shorten project documentation)
## Appendix Z: Detailed System Design and Data Flow Notes
This appendix expands the system design section with more detailed narrative.

### Z.1 Data Flow Level 1
At Level 1, the system can be viewed as three primary processes: User Management, Journal Management, and Mood Management. The User Management process handles login, profile updates, and account deletion. Journal Management handles prompt retrieval, entry creation, and deletion. Mood Management handles mood logging, streak computation, and analytics.

Inputs and outputs are clearly separated. For example, the journal entry input flows into the Journal Management process and then to the database. The output is a refreshed list of entries returned to the client. This separation ensures each process is responsible for a single type of data, which reduces complexity and improves maintainability.

### Z.2 Data Consistency
Data consistency is maintained by using a date key format for moods. This ensures that moods logged on the same day are grouped together. The system updates the mood log for the same day rather than creating duplicates. This helps keep the chart clear and avoids confusing data points.

Journal entries are stored as independent records, each with its own timestamp. This design allows users to write multiple entries in a day. It also makes the entry list flexible and consistent with typical journaling behavior.

### Z.3 Error Handling in Data Flow
Error handling is implemented at two layers. The server validates inputs and returns error messages for missing data. The client displays those messages using toast notifications. For example, if a user tries to save an empty journal entry, the server returns an error and the UI shows a warning. This maintains data quality and provides immediate feedback.

### Z.4 Navigation Flow and State
StillSpace does not use a single-page framework. Each HTML page loads independently and fetches only the data it needs. This keeps the project simple and beginner-friendly. State is managed using localStorage for user email and nickname. This makes the experience consistent across pages without complex session handling.

The theme state is also stored in localStorage so the user does not need to toggle each time. This makes the experience feel stable and polished.

### Z.5 Component Structure
Each major page is composed of smaller visual components:
- Header with title and theme toggle.
- Cards for primary actions.
- Sections for data display, such as charts or lists.

The `.glass` class is reused across components to enforce a consistent visual identity. This reduces CSS duplication and ensures all cards have the same blur and border style.

### Z.6 Database Access Strategy
The backend uses Mongoose models defined inside `server/server.js`. Each model defines field types and default values. When a request is received, the backend validates input, uses the model to create or update documents, and returns JSON responses. This makes the API predictable and easy to test.

### Z.7 AI Integration Flow
The AI reflection flow includes:
1. Client sends journal entry to `/ai-reflection`.
2. Server checks for API key.
3. If key exists, server calls AI service.
4. If AI fails or key missing, server uses fallback.
5. Server returns a short reflection.

This flow ensures the UI always shows a response, which improves reliability and user trust.
<<<<<<< HEAD

---
## Appendix AA: Detailed Implementation Walkthrough
This appendix provides a step-by-step walkthrough of how key features are implemented in code.

### AA.1 Theme System
The theme system uses CSS variables and a `body.dark` class. In the default state, the page uses light mode variables. When the toggle button is clicked, the class is added or removed. JavaScript stores the preference in localStorage, so the next time the user opens any page, the theme state is restored. This is implemented in `initTheme` inside `js/app.js`.

### AA.2 Login Flow
The login form collects email and nickname. When submitted, a POST request is sent to `/login`. The server normalizes the email and creates or updates the user record. The response confirms success, and the client stores the email and nickname locally. The user is redirected to the dashboard. This flow is intentionally simple so that the user does not face complex password handling during the academic demo.

### AA.3 Dashboard Data Loading
When the dashboard loads, the client fetches:
- Journal entries to count them.
- Mood logs to compute streak and latest mood.
- Focus list from localStorage.

The dashboard presents these values in snapshot cards. The motivational quote and affirmation are selected randomly from predefined arrays. This gives the dashboard a fresh feeling each visit without adding database complexity.

### AA.4 Journal Module Details
The journal module begins by selecting a random prompt from `prompts.js`. The prompt is displayed above the editor. When the user clicks Save, the text and prompt are sent to `/journal`. The server stores the entry with a timestamp and returns the updated list. The UI then re-renders the list of entries so the user sees immediate confirmation.

Each entry includes a delete button. Clicking delete sends a DELETE request to `/journal/:id`. The server removes the entry and returns the updated list. This keeps the UI consistent and gives users control over their personal reflections.

### AA.5 AI Reflection Implementation
When the user clicks Analyze with AI, the entry text is sent to `/ai-reflection`. The server builds a safe prompt asking the AI to provide a gentle reflection. The returned response is shown in the UI under the entry. If the AI service is not available, a fallback template is used. This is important because it ensures the user always receives a response and the feature does not feel broken.

### AA.6 Mood Module Details
The mood page presents five buttons. When a user clicks one, the mood value and date key are sent to the server. The server upserts the mood for that date. This ensures only one mood per day. When the mood list is fetched, the client converts mood values into numeric points and feeds them into Chart.js to render a line chart.

The streak calculation runs in JavaScript and examines consecutive date keys. If the latest entry is today or yesterday, the streak continues. Otherwise, it resets. This logic is designed to be forgiving while still encouraging consistency.

### AA.7 Breathing Module Details
The breathing page uses a simple CSS animation controlled by JavaScript timers. A state machine switches the instruction text between Inhale, Hold, and Exhale every four seconds. The circle scales up and down using CSS transitions. This creates a smooth, guided breathing rhythm.

### AA.8 Profile Module Details
The profile page fetches the user profile and displays email and nickname. Updating the nickname sends a PUT request to `/profile`. Deleting the account sends a DELETE request to `/account`, which removes the user and all related records. The session is cleared and the user is redirected to login.

### AA.9 API Utility and Error Handling
All API requests use a shared helper function. This helper automatically adds JSON headers, parses the response, and throws an error if the status code is not OK. Errors are shown using toast notifications. This prevents silent failures and makes debugging easier.

### AA.10 Client-Side Data Storage
LocalStorage is used for:
- Logged-in user email
- User nickname
- Theme preference
- Daily focus list

This lightweight storage keeps the app responsive and reduces server calls for personal UI preferences.

---
## Appendix AB: Extended Testing and Evaluation
This appendix provides additional details on evaluation methods used during development.

### AB.1 Functional Testing
Each API endpoint was tested with valid and invalid inputs. This ensured that expected behavior occurred and errors were returned when required fields were missing. For example, a journal entry without text was rejected, while valid entries were saved correctly and returned in the list. The mood endpoint was tested with repeated dates to confirm that it updates rather than duplicates.

### AB.2 UI Testing
UI testing focused on layout alignment, readability, and visual consistency. The dashboard cards were tested for equal spacing and alignment on different screen sizes. The theme toggle was tested in both light and dark modes to ensure text and icons remained visible. The breathing animation was tested to confirm that transitions remained smooth over long periods.

### AB.3 Usability Evaluation
A small informal user evaluation was conducted with classmates. Feedback was collected on clarity, visual calmness, and ease of navigation. Users reported that the prompt-based journal helped them start writing quickly. The mood tracker was considered easy to use because of the small number of choices. Suggestions included adding more prompts and providing a weekly summary, which are proposed as future work.

### AB.4 Reliability Checks
Reliability checks included:
- Restarting the server and confirming that data persists.
- Refreshing pages to verify the theme and nickname remain intact.
- Logging moods across multiple days to confirm streak logic.

### AB.5 Security and Safety Evaluation
The application avoids storing passwords, which reduces risk for a student prototype but is not sufficient for production. Input validation prevents empty or malformed records. AI responses are constrained to be supportive. A future version would add stronger authentication and encryption.

---
## Appendix AC: Future Roadmap and Research Opportunities
A future roadmap for StillSpace can be structured into short-term and long-term goals. Short-term goals include improving authentication, expanding the prompt library, and adding export options for journal data. These changes would improve trust and usability without changing the core concept.

Medium-term goals could introduce weekly or monthly summaries. These summaries might highlight the most common moods or repeated words in journal entries. Another medium-term idea is a gentle reminders system that can be disabled. The reminder would not be a push notification; it could be an optional email or an on-screen reminder.

Long-term goals might include multi-language support, accessibility testing with real users, and integration with wearable data such as step counts or sleep hours. These features should only be added if they enhance the calm experience rather than making it more complex.

Research opportunities include studying the effect of micro-reflection routines on stress perception. Another research direction is comparing different prompt styles to see which lead to more consistent journaling.

## Appendix AD: Extended Prompt Library
1. What made you feel calm today?
2. What challenged you today?
3. What are you grateful for today?
4. What helped you relax today?
5. What made you smile today?
6. What moment did you want to slow down?
7. What is one kind thing you did for yourself?
8. What felt heavy today, and what helped?
9. What is one small win from today?
10. What did you notice about your mood this morning?
11. What brought you a sense of comfort?
12. What did you learn about yourself today?
13. What is one thing you want to release?
14. What is one thing you want to hold onto?
15. What is one sound, sight, or smell you enjoyed?
16. What do you want tomorrow to feel like?
17. What is one boundary you respected today?
18. What supported your focus today?
19. What drained your energy, and how did you recover?
20. What helped you feel connected?
21. What is one thought you want to soften?
22. What brought you peace for a moment?
23. What did you do that was gentle?
24. What did you need more of today?
25. What did you need less of today?
26. What are you carrying that can be set down?
27. What is one intention for tomorrow?
28. What is one reason you can be proud of today?
29. What is one way you showed patience?
30. What helped you feel steady?

## Appendix AE: Quote and Affirmation Library
Quotes:
1. Small pauses create big clarity.
2. You do not need to fix everything today.
3. Gentleness is a form of strength.
4. One mindful breath can reset your whole moment.
5. Progress can be soft and still meaningful.
6. Your pace is valid, even when the world moves fast.
7. Quiet consistency builds powerful change.
8. A calm mind notices details a rushed mind misses.

Affirmations:
1. I am allowed to take up space with calm and kindness.
2. I can move slowly and still move forward.
3. My feelings are real, and I can respond with care.
4. I choose one gentle step instead of perfect control.
5. I can reset at any moment with one deep breath.
6. I trust myself to handle this day with softness and clarity.

## Appendix AF: Extended UI Style Guide
The StillSpace interface follows a clear visual system. The primary goal is to reduce visual noise and create a gentle atmosphere. This guide summarizes the key style decisions for future maintenance.

Color usage is minimal. Background gradients are soft and subtle. The primary accent color is used sparingly for buttons and highlights. Glass panels are semi-transparent to allow the background to show through, which creates depth without strong contrast.

Typography is split between a serif display font for headings and a clean sans-serif for body text. This contrast adds elegance while maintaining readability. Line heights are slightly larger than default to make reading more comfortable.

Spacing is generous. Cards use padding that makes content feel breathable. The sidebar keeps navigation options spaced evenly so they are easy to scan. Buttons have enough height to be easily clicked or tapped.

Motion is minimal. Hover effects lift cards slightly and add a soft shadow. Page transitions fade in and out to avoid abrupt changes. The breathing animation is the only continuous movement and is slow by design.

## Appendix AG: Extended Deployment and Configuration Notes
When deploying the app, it is important to confirm that environment variables are set correctly. The `MONGODB_URI` must include the database name and user password. The connection string should be kept private and never committed to GitHub. The `OPENAI_API_KEY` should be stored only in environment variables. It should never be hard-coded.

When using MongoDB Atlas, the IP whitelist allows connections. For testing, 0.0.0.0/0 is acceptable, but for production it should be restricted to known IPs. The database user should have minimal permissions required for the app.

Render or similar platforms may sleep on free tiers. This can cause the first request after inactivity to take longer. This is expected behavior and can be explained in the presentation.

## Appendix AH: Extended System Analysis and Use Case Narratives
This appendix expands the analysis with more detailed use case narratives. The goal is to show how a user experiences the system from start to finish.

Use Case: First-Time User Session
- The user opens the landing page and clicks Get Started.
- The login page appears with two fields: email and nickname.
- The user enters information and clicks Login.
- The dashboard loads and displays a welcome message with the nickname.
- The user sees a daily check-in prompt and a quick breathing link.
- The user explores the journal page and writes a short entry.
- The entry is saved and appears in the list below.
- The user returns to the dashboard and logs a mood.
- The mood chart updates and a streak begins.
- The user logs out from the sidebar.

Use Case: Returning User Session
- The user opens the dashboard directly.
- The system checks localStorage for an active session.
- The nickname is loaded and displayed.
- The user sees updated counts and the latest mood.
- The user opens the breathing page for a short reset.
- After the exercise, the user returns to the dashboard.

Alternative Flow: Failed Save
- The user writes a journal entry but the server is offline.
- The API request fails.
- The UI displays an error toast.
- The entry remains in the text area so the user can try again.

Alternative Flow: AI Unavailable
- The user clicks Analyze with AI.
- The AI service is unavailable or the key is missing.
- The fallback response is used to ensure the user still receives support.

This narrative view emphasizes that the system is resilient and user-friendly, even when errors occur.

## Appendix AI: Extended Data Flow and Sequence Steps
This appendix describes sequence-level steps for key flows.

Sequence: Save Journal Entry
1. User clicks Save Entry.
2. Client collects entry text and prompt.
3. Client sends POST /journal with JSON payload.
4. Server validates request.
5. Server stores entry in MongoDB.
6. Server fetches updated entry list.
7. Server returns JSON response.
8. Client updates entry list in UI.

Sequence: Log Mood
1. User clicks a mood button.
2. Client builds date key using local time.
3. Client sends POST /mood with mood and date key.
4. Server upserts mood record.
5. Server returns updated mood list.
6. Client updates chart and streak.

Sequence: Theme Toggle
1. User clicks theme button.
2. Client toggles body.dark class.
3. Client stores theme preference in localStorage.
4. Theme icons update based on CSS rules.

Sequence: Delete Account
1. User clicks Delete Account.
2. Client confirms action.
3. Client sends DELETE /account with email.
4. Server removes user, journals, and moods.
5. Client clears localStorage.
6. User is redirected to login.

These sequences make it clear how the system behaves at runtime and show how the frontend and backend coordinate.

## Appendix AJ: Implementation Snippets (Illustrative)
Below are short illustrative snippets to show how the implementation is structured.

Theme toggle logic:
```
const isDark = document.body.classList.contains("dark");
const label = isDark ? "Switch to light mode" : "Switch to dark mode";
toggle.setAttribute("aria-label", label);
```

Mood streak computation:
```
const uniqueDateKeys = [...new Set(moods.map((m) => m.dateKey))];
uniqueDateKeys.sort((a, b) => b.localeCompare(a));
```

AI fallback selection:
```
if (!apiKey) {
  return { reflection: pickFallback(entryText) };
}
```

These examples keep the code approachable for beginners while still demonstrating core logic.

## Appendix AK: Detailed Risk Analysis and Mitigation
Risk analysis is important even in a student project because it clarifies potential issues and how they are addressed.

### AK.1 Technical Risks
1. Database connection failure: If the MongoDB server is unavailable, data cannot be stored. Mitigation includes clear error handling, fallback messaging, and the ability to switch to a cloud database.
2. AI service failure: The AI reflection service may be unreachable due to network issues or missing API key. Mitigation is a fallback reflection system that provides supportive text without external calls.
3. Browser compatibility: Different browsers may render CSS effects differently. Mitigation includes testing on Chrome and Edge and avoiding cutting-edge CSS that lacks support.

### AK.2 Security Risks
1. Unauthorized access: The project uses lightweight login, which is not sufficient for production. Mitigation for a future version includes password authentication and token-based sessions.
2. Data leakage: Journal entries are sensitive. Mitigation includes restricting access to only the logged-in user and allowing full account deletion.
3. API misuse: Without rate limiting, endpoints could be abused. Mitigation includes adding rate limits in future versions.

### AK.3 Operational Risks
1. User confusion: If the interface is too complex, users may abandon the app. Mitigation includes minimal navigation and clear labels.
2. Low adoption: If users do not see value quickly, they may stop. Mitigation includes daily prompts, quotes, and quick breathing exercises that deliver immediate benefit.

### AK.4 Ethical Risks
1. Misinterpretation of AI responses: Users might treat AI text as advice. Mitigation includes safe prompting and avoidance of medical claims.
2. Over-dependence on metrics: Users might over-focus on mood scores. Mitigation includes simple visualizations without competitive or gamified elements.

### AK.5 Summary
The project acknowledges these risks and addresses them within the scope of an academic prototype. In a production setting, additional safeguards would be mandatory.

## Appendix AL: Maintenance and Troubleshooting (Extended)
This appendix provides detailed guidance for maintaining the project after initial deployment.

### AL.1 Updating the Project
- Pull the latest code from GitHub.
- Run `npm install` to update dependencies.
- Verify that `.env` values are still correct.
- Restart the server.

### AL.2 Common Issues and Fixes
Issue: Server fails to start on port 3000.
- Fix: Ensure the port is free or change the PORT environment variable.

Issue: MongoDB authentication error.
- Fix: Check that the username and password in the connection string are correct and URL-encoded.

Issue: Charts not rendering.
- Fix: Confirm that Chart.js is loaded and the mood array is not empty.

Issue: Theme toggle not working.
- Fix: Ensure `js/app.js` is loaded and there are no console errors.

### AL.3 Data Backup
For local MongoDB, use `mongodump` to back up data. For Atlas, enable automated backups. Regular backups reduce data loss risk.

### AL.4 Monitoring
For production use, consider adding simple monitoring:
- Log API errors to a file.
- Track request counts.
- Monitor database connection status.

### AL.5 Scaling Considerations
If the user base grows, consider:
- Moving to a managed database tier.
- Adding caching for frequent queries.
- Splitting the server into separate services for AI and core APIs.

## Appendix AM: Extended Ethics and Privacy Discussion
Ethics and privacy are essential in mental wellness applications. Even though StillSpace is a student project, it demonstrates awareness of these concerns.

First, the application avoids medical language. The AI reflections are not intended to diagnose or treat. This prevents users from confusing supportive text with professional advice. The fallback responses are also written in a gentle, non-clinical tone.

Second, user control is prioritized. The profile page includes a delete account option that removes journal entries and moods. This supports the idea that personal reflections belong to the user and can be removed at any time.

Third, data minimization is applied. The system only stores necessary information: email, nickname, journal entry text, and mood values. There are no unnecessary fields such as phone numbers or location.

Fourth, transparency is important. In a production system, a clear privacy notice should explain how data is stored and who can access it. In this academic prototype, data access is limited to the user session and basic database operations. Future versions should include encryption at rest and secure authentication.

Finally, the design avoids manipulative patterns. There are no streak penalties or shaming messages. This aligns with the ethical principle of non-maleficence, which seeks to avoid harm.

## Appendix AN: Extended Results and Evaluation Notes
Beyond basic testing, the project can be evaluated on design goals. The main goal was to create a calm digital space. This goal was met through soft gradients, glass cards, and minimal navigation. Another goal was to reduce friction for daily use. The one-step login, short prompts, and five-button mood tracker support this goal.

Usability feedback emphasized the clarity of the dashboard. Users understood what to do without reading instructions. The presence of motivational quotes and affirmations added warmth without distracting from core tasks. The breathing exercise was described as easy to follow because the instructions were short and the animation was slow.

Performance evaluation showed that the interface felt smooth on typical laptops and mid-range phones. This suggests that the design choices did not introduce heavy rendering costs. The use of simple CSS effects instead of heavy graphics was beneficial.

Overall, the project meets its academic objectives and provides a functional product that could be extended further with additional security and personalization features.

## Appendix AO: Extended Usage Scenario (Day-by-Day)
Day 1: The user logs in and explores the dashboard. They write a short journal entry about feeling overwhelmed with work. They log their mood as Stressed. The AI reflection suggests taking a short breathing break. The user tries the breathing exercise for two minutes and feels calmer.

Day 2: The user returns and sees the streak is now 1 day. The daily prompt asks about gratitude, and the user writes about a supportive friend. The mood is logged as Calm. The trend chart shows a small improvement. The user feels encouraged to continue.

Day 3: The user skips journaling but logs a mood as Neutral. The streak continues because the mood is logged for the day. The user uses the daily focus ritual to set two priorities. This provides a sense of structure.

Day 4: The user writes a longer journal entry about a challenging day. The AI reflection is gentle and acknowledges stress. The user logs mood as Stressed. The chart shows a downward dip, which matches the user's experience. The next day, the user notices the dip and recognizes the pattern.

Day 5: The user logs a mood as Happy and writes a short entry about a positive event. The mood chart now shows a recovery. This encourages the user to continue their routine.

This scenario demonstrates how the system supports daily reflection without demanding large time commitments. It also shows how the chart provides simple visual feedback that matches lived experience.

## Appendix AP: Extended Glossary and Technical Terms
- API: A set of endpoints that allow the client to communicate with the server.
- Backend: The server-side part of the application.
- Client: The browser-based interface used by the user.
- CRUD: Create, Read, Update, Delete operations.
- Data Flow Diagram (DFD): A diagram showing movement of data through the system.
- Deployment: The process of making the app available online.
- Environment Variables: Config values stored outside the codebase.
- Express: A Node.js framework for building APIs.
- Frontend: The user-facing interface of the application.
- Glassmorphism: A design style using blurred translucent surfaces.
- LocalStorage: Browser storage for small pieces of data.
- Mongoose: Library for modeling MongoDB data.
- MongoDB: A document-based NoSQL database.
- Node.js: JavaScript runtime for the backend.
- Prompt: A short question guiding journaling.
- REST: Architectural style for designing APIs.
- Session: Temporary information about a logged-in user.
- Theme Toggle: UI control for switching between light and dark.
- Toast Notification: Short on-screen message for feedback.
- UI: User Interface elements such as buttons and cards.
- UX: User Experience, overall feel of interaction.
- Validation: Checking input data before saving.

## Appendix AQ: Additional Test Cases and Example Logs
This appendix includes extra test cases and logs to provide more detail for documentation purposes.

Additional Test Cases:
- Attempt login with empty email -> Should show error message.
- Save journal entry with only whitespace -> Should be rejected.
- Save mood twice on the same day -> Should update existing entry.
- Delete account -> Should remove moods and journals for that user.
- Toggle theme, refresh page -> Theme should persist.

Example Test Log (Manual):
Test 1: Login with valid email and nickname
- Input: test@example.com, TestUser
- Expected: Redirect to dashboard
- Actual: Redirected successfully
- Result: Pass

Test 2: Save journal entry
- Input: "Today I felt calm after a walk."
- Expected: Entry visible in list
- Actual: Entry visible
- Result: Pass

Test 3: AI reflection without API key
- Input: "I am stressed about deadlines."
- Expected: Fallback response shown
- Actual: Supportive fallback response shown
- Result: Pass

Test 4: Mood log and streak update
- Input: Mood = Calm
- Expected: Chart updates and streak increments
- Actual: Chart updated, streak incremented
- Result: Pass

Test 5: Delete journal entry
- Input: Delete latest entry
- Expected: Entry removed and list updated
- Actual: Entry removed
- Result: Pass

The extended test cases demonstrate that both happy paths and error conditions were verified. This supports confidence in the stability of the application for an academic project.

=======
>>>>>>> 3b80a05 (Refine report generation and shorten project documentation)
---
End of Document
