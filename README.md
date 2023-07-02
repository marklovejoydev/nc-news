# NC-News
NC-News is a server project which will be a hosted API. This repository serves as the source code for a web-based project acting as a database server to allow access of the API. 

You can try it out yourself by following the instructions below.

## Demo
To see a live demo of the project, you can visit the hosted version here.
//link
Look at endpoints.json to see available endpoints
These endpoints will provide:
Description,
Available queries,
Example response.

## Installation and Usage
To get started with the project, follow these steps:

### Clone the repository:

git clone https://github.com/your-username/your-repo.git

### Install dependencies:
npm install

### Set up the database:
npm run setup-dbs
(will only need to do this once)

### Seed the local database:
npm run seed

### Create the .env files:
Users will need to create .env for development environment and .env for testing
    file containing for example:
    PGDATABASE=database_name_here
Look in setup.sql to get the names of the databases
If needed, create a .env.production file for the production environment with appropriate configurations.

#### Minimum versions:

Node.js version: [minimum version]
Postgres version: [minimum version]

#### Tests ran on JEST

Run tests:
npm test

#### Project created and tested on Ubuntu Linux

#### Contributing
If you would like to contribute to this project, you can follow these guidelines:

Fork the repository.
Create a new branch for your feature/bug fix.
Commit your changes and push them to your branch.
Submit a pull request detailing your changes.

Check that you have added the necessary files to your ignore file when pushing to GIT:
    node modules
    .env*

##### Contact
If you have any questions or suggestions, feel free to reach out to me at [your contact information].

Thank you for checking out my project!