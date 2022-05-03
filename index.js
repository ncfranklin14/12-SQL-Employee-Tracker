const inquirer = require("inquirer");
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
);

function mainQuestion() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ["view all employees", "add employee", "update employee role", "view all roles", "add role", "view all departments", "add department", "quit"],
        }
    ]).then(answer => {
        switch (answer.action) {
            case "view all employees":
                viewAllEmployees();
                break;
            case "add employee":
                addEmployee();
                break;
            case "update employee role":
                updateEmployeeRole();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "add role":
                addRole();
                break;
            case "view all departments":
                viewAllDepartments();
                break;
            case "add department":
                addDepartment();
                break;
            default:
                    console.log("Good bye!")
                    break;
        }
    }).catch(err => {

    })
}

// View all employees function
function viewAllEmployees() {
    db.promise().query('SELECT * FROM employee').then(function ([results, fields]) {
        console.table(results);
        console.log("=======================================")
        mainQuestion();
    });
}

function addEmployee() {
    db.promise().query('SELECT first_name, last_name, id FROM employee').then(function ([results, fields]) {
        const managers = results.map(employee => { return { name: employee.first_name + " " + employee.last_name, value: employee.id } })
        db.promise().query('SELECT title, id FROM role').then(function ([roleResults, fields]) {
            const roles = roleResults.map(role => { return { name: role.title, value: role.id } })
            inquirer.prompt([
                {
                    name: "employeeFirstName",
                    type: "input",
                    message: "What is the employees's first name?"
                },
                {
                    name: "employeeLastName",
                    type: "input",
                    message: "What is the employees's last name ?"
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roles
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ]).then(function (response) {
                db.promise().query('INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)', [response.employeeFirstName, response.employeeLastName, response.employeeRole, response.employeeManager]).then(function ([results, fields]) {
                    console.log("=======================================")
                    mainQuestion()
                })
            })
        })
    })
}

function updateEmployeeRole() {
    db.promise().query('SELECT first_name, last_name, id FROM employee').then(function ([results, fields]) {
        const employees = results.map(employee => { return { name: employee.first_name + " " + employee.last_name, value: employee.id } })
        db.promise().query('SELECT title, id FROM role').then(function ([roleResults, fields]) {
            const roles = roleResults.map(role => { return { name: role.title, value: role.id } })
            inquirer.prompt([
                {
                    name: "employeeName",
                    type: "list",
                    message: "Who is the employee?",
                    choices: employees
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "Who is the employee's new role?",
                    choices: roles
                }
            ]).then(function (response) {
                db.promise().query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [response.employeeRole, response.employeeName]).then(function ([results, fields]) {
                    console.log("=======================================")
                    mainQuestion()
                })
            })
        })
    })
}

function viewAllRoles() {
    db.promise().query('SELECT * FROM role').then(function ([results, fields]) {
        console.table(results);
        console.log("=======================================")
        mainQuestion();
    });
}

function addRole() {
    db.promise().query('SELECT title, salary, id FROM role').then(function ([roleResults, fields]) {
        const role = roleResults.map(role => { return { name: role.title, value: role.salary, value: role.id } })
        db.promise().query('SELECT name, id FROM department').then(function ([deptResults, fields]) {
            const departments = deptResults.map(departments => { return { name: departments.name, value: departments.id } })
            inquirer.prompt([
                {
                    name: "roleName",
                    type: "input",
                    message: "What is the name of the role?"
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "what is the salary for this role?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department does this role belong to?",
                    choices: departments
                },
            ]).then(function (response) {
                db.promise().query('INSERT INTO role (title,salary,department_id)VALUES(?,?,?)', [response.roleName, response.roleSalary, response.department]).then(function ([results, fields]) {
                    console.log("=======================================")
                    mainQuestion()
                })
            })
        })
    })
}

function viewAllDepartments() {
    db.promise().query('SELECT * FROM department').then(function ([results, fields]) {
        console.table(results);
        console.log("=======================================")
        mainQuestion();
    });
}

function addDepartment() {
    db.promise().query('SELECT name, id FROM department').then(function ([deptResults, fields]) {
        const departments = deptResults.map(departments => { return { name: departments.name, value: departments.id } })
            inquirer.prompt([
                {
                    name: "departmentName",
                    type: "input",
                    message: "What is the name of the department?"
                },
            ]).then(function (response) {
                db.promise().query('INSERT INTO department (name)VALUES(?)', [response.departmentName]).then(function ([results, fields]) {
                    console.log("=======================================")
                    mainQuestion()
                })
            })
        })
}


mainQuestion();