# VNS Refinement POC

This repository contains a Proof of Concept (POC) for refining the assignment management and grading interface for the "VNS" platform (Moodle-based system). It features a modern, responsive frontend built with React, TypeScript, and Material UI.

## Overview

The project is designed to integrate into a PHP-based environment (/mod/assign/) while providing a high-performance, interactive experience for instructors. It includes two primary views:

1. **Students Table Page:** A comprehensive dashboard to view, filter, and search through student assignment submissions.
2. **Grading Page:** A split-view interface allowing instructors to view submitted PDFs side-by-side with a grading form and student information.

## Features

- **Interactive Student Dashboard:** Uses material-react-table for advanced filtering (by group, status, submission date), global search, and pagination.
- **Split-Screen Grading:** Integrated PDF viewer allowing immediate review of student work without leaving the page.
- **Comprehensive Grading Form:** Support for numeric grades, text feedback, and automated student notifications.
- **Dynamic Routing:** Handles view switching via URL parameters (action=grading or action=grader) within a unified PHP entry point.
- **PHP Service Integration:** Includes a backend mock (service.php) that demonstrates how to serve participant data to the React frontend.

## Technologies Used

- Frontend: React 19, TypeScript, Vite
- UI Framework: Material UI (MUI) 7
- Tables: Material React Table (MRT)
- Styling: CSS Modules and Emotion
- Backend Support: PHP (for Moodle module integration)

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm
- A local PHP server (like XAMPP or Docker) to run the mod/ directory

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/noqtisnox/vns-refinement-poc.git
   cd vns-refinement-poc
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Build & Deploy

The project is configured to build directly into the PHP module structure:
```bash
npm run build
```

This will output the production assets to ./mod/assign/dist, which are then linked by view.php.

### Running All Together

To run the application locally, follow these steps:

1. Ensure you have a local PHP server running.
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Access the application in your browser at `http://localhost:3000`.

### Running All Together

To run the application locally, follow these steps from the root directory:

1. Start the frontend:
   ```bash
   npm run build --watch
   ```
2. Start the backend:
   ```bash
   php -S localhost:8000 -t .
   ```
3. Access the application in your browser at `localhost:8000/mod/assign/view.php?id=12345&action=grading`.
