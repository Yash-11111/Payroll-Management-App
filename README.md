# Payroll-Management-App

A simple web-based Employee Payroll System built with Node.js, Express, and EJS. It allows you to register, view, edit, and delete employee records, with automatic payroll calculations including tax deductions.

## live link
https://payroll-management-app.onrender.com

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Runtime    | Node.js             |
| Framework  | Express 5           |
| Templating | EJS                 |
| Storage    | JSON file           |
| Styling    | Custom CSS          |

## Project Structure

```
payroll-enrollment/
├── modules/
│   └── fileHandler.js   # Read/write helpers for employees.json
├── public/
│   └── style.css        # Global stylesheet
├── views/
│   ├── index.ejs        # Dashboard (employee list)
│   ├── add.ejs          # Add employee form
│   └── edit.ejs         # Edit employee form
├── employees.json       # JSON data store
├── server.js            # Express app & routes
└── package.json
```

## Routes

| Method | Route          | Description              |
|--------|----------------|--------------------------|
| GET    | `/`            | Dashboard — list all employees |
| GET    | `/add`         | Show add employee form   |
| POST   | `/add`         | Submit new employee      |
| GET    | `/edit/:id`    | Show edit form for employee |
| POST   | `/edit/:id`    | Submit updated employee  |
| GET    | `/delete/:id`  | Delete employee by ID    |

## Payroll Calculation

| Field        | Formula                  |
|--------------|--------------------------|
| Basic Salary | Entered by user (INR)    |
| Tax          | 12% of Basic Salary      |
| Net Salary   | Basic Salary - Tax       |
