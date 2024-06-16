# Emphasoft Test Assignment

## Description

This project contains Cypress tests for a hotel contact form and room creation functionality. The tests include both positive and negative scenarios to ensure the form and room creation features work as expected.

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Project Structure](#project-structure)
5. [Test Content](#test-content)
6. [Used Libraries](#used-libraries)

## Installation

To set up the project, follow these steps:

1. Clone the repository:

```bash
git clone git@github.com:marblehands/emphasoft-test.git
cd emphasoft-test
```

2. Install the dependencies:

```bash
npm install
```

## Setup

Create a file `cypress.env.json` in the root of the project with the following content:

```json
{
  "adminUsername": "admin",
  "adminPassword": "password"
}
```

## Running Tests

### Using the Graphical Interface

To run the tests using the graphical interface:

```sh
npx cypress open
```

In the opened window, select the tests to run.

### Using the Command Line

To run the tests in the command line mode:

```sh
npx cypress run
```

## Project Structure

- `cypress/e2e/`: contains test files.
- `cypress.env.json`: file with environment variables such as admin credentials.
- `package.json`: file with project information and dependencies.
- `node_modules/`: directory with installed npm modules.

## Test Content

- **Form Submission Test**: tests form submission, validates required fields, and checks for error messages.
  - Filling and submitting the form with correct data.
  - Checking for errors when a required field is missing.
- **Room Creation Test**: tests adding new rooms by the admin.
  - Filling out the room addition form and checking successful creation.
  - Checking for errors when a required field is missing.

## Used Libraries

- [Cypress](https://www.cypress.io/): tool for end-to-end testing of web applications.
- [Faker](https://fakerjs.dev/): library for generating random data.
