// const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const util = require('util');
const inquirer = require('inquirer');
const consTable = require('console.table');


const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'Password',
        database: 'employees_db'
    }
);

db.query = util.promisify(db.query);

console.table("\n--------EMPLOYEE MANAGER--------\n")

function startApp() {
    inquirer.prompt({
        type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department'
        ],
    })
        .then(function (answer) {
            switch (answer.userChoice) {
                case 'View All Employees':
                    employeeView();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployee();
                    break;

                case 'View All Roles':
                    allRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    allDepartments();
                    break;

                case "Add Department":
                    addDepartment();
                    break;
            };
        });

};
startApp();

function allDepartments() {
    db.query(`SELECT id, department_name AS title FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        // 
        startApp();
    });
};

function allRoles() {
    const sql = `SELECT id, title, salary, department_id AS title FROM role`;
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.table(result);
        startApp();
    });
};

function employeeView() {
    const sql = `SELECT id, first_name, last_name, role_id, manager_id AS title FROM employee`;
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.table(result);
        startApp();
    });
};

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'department_name',
        message: 'What is the name of the department?'
    })
        .then((answer) => {
            const sql = `INSERT INTO department (department_name)
            VALUES (?)`;
            const params = [answer.department_name];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Added Service to the database');
                }
                console.table(result);
                startApp();
            });
        });
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'department_name',
            message: 'Which department does the role belong to?',
            choices: [
                'Engineering',
                'Finance',
                'Legal',
                'Sales'
            ],
        },
    ])
        .then((answer) => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
            const params = [answer.title, answer.salary, answer.department_name];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Added Role to the database');
                }
                console.table(result);
                startApp();
            });
        });
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employees last name?'
        },
        {
            type: 'list',
            name: 'title',
            message: 'What is the employees role?',
            choices: [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Software Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer'
            ],
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Who is the employees manager?'
        },
    ])
        .then((answer) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;
            const params = [answer.first_name, answer.last_name, answer.manager_id];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Added ${title} to the database');
                }
                console.table(result);
                startApp();
            });
        });
};

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeNames',
            message: 'Which employees role do you want to update?',
            choices: [
                'John Doe',
                'Mike Chan',
                'Ashley Rodriquez',
                'Kevin Tupik',
                'Kunal Singh',
                'Malia Brown',
                'Sarah Lourd',
                'Tom Allen'
            ]
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Which role do you want to assign to the selected employee?',
            choices: [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Software Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer'
            ],
        },
    ])
        .then((answer) => {
            const sql = `UPDATE employee SET role_id = ? WHERE name = ? (first_name, last_name, role_id)
            VALUES (?, ?, ?)`;
            const params = [answer.employeeNames, answer.role_id];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Updated ${employeeNames} role');
                }
                console.table(result);
                startApp();
            });
        });
};


// app.use((req, res) => {
//     res.status(404).json({
//         message: "Resource not found"
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });()