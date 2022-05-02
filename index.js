const inquirer = require("inquirer");
const mysql = require('mysql2');
const Department = require("./lib/department");
const Role = require("./lib/role");
const Employee = require("./lib/employee");
const employees = [];

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
        choices: ["view all employees", "add employee", "update employee role", "view all employee roles", "add role", "view all departments", "add department"],
    }
]).then(answer => {
    switch(answer.action) {
        case "view all employees":
        viewAllEmployees();
            break;
        case "add employee":
        addEmployee();
            break;
        case "update employee role":
        updateEmployeeRole();
            break;
        case "view all employee role":
        viewAllEmployeeRole();
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
    }
}).catch(err => {

})
}

// View all employees function
function viewAllEmployees() {
    db.promise().query('SELECT * FROM employee').then( function ([results, fields]) {
        console.table(results);
        console.log("=======================================")
        mainQuestion();
});
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "employeeFirstName",
            type: "input",
            message:"What is the employees's first name?"
        },
        {
            name: "employeeLastName",
            type: "input",
            message:"What is the employees's last name ?"
        },
        {
            name: "employeeSalary",
            type: "input",
            message:"What is the employee's salary?"
        },
        {
            name: "employeeManager",
            type: "input",
            message:"Who is the employee's manager?"
        ]).then(answer => {
            const newEmployee = new Employee(response.employeeFirstName,response.employeeLastName,response.employeeSalary,response.employeeManager)
            employees.push(newEmployee);
           mainQuestion()
        }).catch(err => {
    
        })
}

function updateEmployeeRole() {

}

function viewAllEmployeeRole() {

}

function addRole() {

}

function viewAllDepartments(){

}

function addDepartment() {

}


mainQuestion();