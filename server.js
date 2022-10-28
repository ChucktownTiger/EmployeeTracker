const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'company',
        socketPath: '/tmp/mysql.sock'
    }
)

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('connected to ChandlerCon Database')
})

function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What is your task?",
    name: "choice",
    choices: [
                "View Departments",
                "View Roles",
                "View Employees?",  
                "Add a Department?",
                "Add a Role?",
                "Add an Employee?",
            ]
    }
    ]).then(function(val) {
        switch (val.choice) {
            case "View Deparments":
                viewDepartments();
            break;
    
            case "View Roles?":
                viewRoles();
            break;

            case "View Employees?":
                viewEmployees();
            break;

            case "Add a Department?":
                addDepartment();
            break;

            case "Add a Role?":
                addRole();
            break;

            case "Add an Employee?":
                addEmployee();
            break;
    
            }
    })
}
    
function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

function viewRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

function addDepartment() { 
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the Department name you would like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}

function addRole() { 
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
        inquirer.prompt([
            {
            name: "Title",
            type: "input",
            message: "What is the title of the role?"
            },
            {
            name: "Salary",
            type: "input",
            message: "What is the salary of the role??"
            } 
        ]).then(function(res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )
        });
    });
}

function addEmployee() { 
        inquirer.prompt([
            {
                name: "firstname",
                type: "input",
                message: "What is the employees first name? "
            },
            {
                name: "lastname",
                type: "input",
                message: "What is the employees last name? "
            },
            {
                name: "role",
                type: "list",
                message: "What is the employees role?",
                choices: selectRole()
            },
            {
                name: "choice",
                type: "rawlist",
                message: "Whats their managers name?",
                choices: selectManager()
            }
        ]).then(function (val) {
            var roleId = selectRole().indexOf(val.role) + 1
            var managerId = selectManager().indexOf(val.choice) + 1
            connection.query("INSERT INTO employee SET ?", 
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId
            
            }, function(err){
                if (err) throw err
                console.table(val)
                startPrompt()
            })

    })
}