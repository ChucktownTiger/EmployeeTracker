const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Clemson#2016',
        database: 'ChandlerCon',
        // socketPath: '/tmp/mysql.sock'
    }
)

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('connected to ChandlerCon Database')
    startPrompt()
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
                "Exit the Program"
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

            case 'Exit the Program':
                exitConnection()
            break;
    
            }
    })
}
    
function viewDepartments() {
    const sql = `SELECT id, department_name AS department FROM department`;
    connection.promise().query(sql)
    .then ((rows) => {
        console.table(rows[0])
        userPrompt()
    }) 
    .catch((err) => {
        if (err) {
        throw err
        }          
    })       
}


function viewRoles() {
    const sql = `SELECT role.id, title, salary, department_name AS department
    FROM role 
    INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql)
    .then((rows)=> {
        console.table(rows[0])
        userPrompt()
    })
    .catch((err) => {
        if (err) {
        throw err
        } 
        
    })  
}

function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary,
    department.department_name AS department, manager.first_name AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id` ;
    connection.promise().query(sql)
        .then((rows) => {
            console.table(rows[0])
            userPrompt()
        })
        .catch((err) => {
            if (err) {
            throw err
            } 
            
        })  
    }

function addDepartment() { 
    inquirer.prompt([
        {
            type: "input",
            name: "addDept",
            message: "What is the name of the new Department?"
        },
    ])
        .then ((answer) => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        connection.promise().query(sql, answer.addDept)
        .then(()=> {
            console.log(`${answer.addDept} department has been added`)
            viewDepts()
        })
        .catch((err) => {
            if (err) {
            throw err
            } 
    })      
})
}

function addRole() { 
    inquirer.prompt ([ {
        type: "input",
        name: "addRole",
        message: "What is the new role?"
    },

    {
        type: "input",
        name: "addRoleSalary",
        message: "What is the salary?"
    },

    {
        type: "input",
        name: "addRoleDept",
        message: "What department contains this role?"
    }
])

    .then((answer) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        const newValues = [answer.addRole, answer.addRoleSalary, answer.addRoleDept]
        connection.promise().query(sql, newValues)
        .then(()=> {
            console.log(`${answer.addRole} role has been added`)
            viewRoles()
        })
        .catch((err) => {
            if (err) {
            throw err
            }
    })

})}

addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "addEmployeeFN",
            message: "first name of employee?"
        },
        {
            type: "input",
            name: "addEmployeeLN",
            message: "last name of employee?"
        },
        {
            type: "input",
            name: "addEmployeeRole",
            message: "role of employee?"
        },

        {
            type: "input",
            name: "addEmployeeManager",
            message: "manager of employee?"
        }
    ])

    .then((answer) => {
        const sql =  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const newValues = [answer.addEmployeeFN, answer.addEmployeeLN, answer.addEmployeeRole, answer.addEmployeeManager]
        connection.promise().query(sql, newValues)
    .then(()=> {
    console.log(`${answer.addEmployeeFN} ${answer.addEmployeeLN} has been added as an employee`)
    viewEmployees()
        })
        .catch((err) => {
            if (err) {
            throw err
            }
        })
    })
}

exitConnection = () => {
    connection.end()
}

