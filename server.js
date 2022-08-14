const inquirer = require("inquirer");
const db = require("./db");

const startMenu = {
  name: "functionality",
  message: "Hello, welcome to employee manager, what would you like to do?",
  type: "list",
  choices: [
    "Show All Employees",
    "Add Employee",
    "Update Employee",
    "Delete an Employee",
    "Add a Department",
    "Show All Departments",
    "Add a Role",
    "Show All Roles",
    "Exit",
  ],
};

//show all employees

const showAllEmployees = () => {
  db.query(
    `SELECT e1.id as EMP_ID, CONCAT(e1.first_name, ' ', e1.last_name) as Name, title as role, 
  salary, department.name as department, IFNULL(CONCAT(e2.first_name, ' ', e2.last_name), 'No Manager, Top Level') as Manager FROM employee e1 LEFT JOIN role 
  ON e1.role_id=role.id LEFT JOIN department ON role.department_id=department.id
  LEFT JOIN employee e2 ON e1.manager_id=e2.id `
  ).then((results) => {
    console.log("--------------  EMPLOYEES  --------------");
    console.table(results);
    console.log("--------------  EMPLOYEES  --------------");

    setTimeout(start, 3000);
  });
};

//Add employee
const addEmployee = () => {
  db.query("SELECT * FROM employee").then(results => {
    const managerChoices = results.map(manager => {
      return { name: manager.first_name +' '+ manager.last_name, value: manager.id }
    })

    db.query("SELECT * FROM role").then(results => {
      const roleChoices = results.map(role => {
        return { name: role.title, value: role.id }
      })

      inquirer.Prompt = ([
        {
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          name: "role_id",
          message: "What is the employee's title?",
          type: "list",
          choices: roleChoices
        },
        {
          name: "manager",
          message: "Who is this employee's manager?",
          type: "list",
          choices: managerChoices
        }
      ])

      .then(results => {
        console.log("RESULTS --- ", results);

        db.query("INSERT INTO employee SET ?", {first_name: results.first_name, last_name: results.last_name, role_id: results.role_id, manager_id: results.manager}).then(results => {
          console.log("THE NEW EMPLOYEE HAS BEEN ADDED!!")
          setTimeout(start, 3000)
        })
      })
    })
  })



//Update employee

const updateEmployee = () => {
  db.query(`SELECT id * FROM employee`).then(results => {
    const employeeArray = results.map(employee => {
      return {
        name: employee.first_name +' '+ employee.last_name,
        value: employee.id
      }})
  db.query(`SELECT id * FROM role`).then(results => {
    const roleArray = results.map(role => {
      const roleArray = results.map(role => {
        return {name: role.title, 
        value: role.id}
    })
    inquierer.prompt ([
      {
        name: "selectedEmployee",
        message: "Which employee would you like to update?",
        type: "list",
        choices: employeeArray,
      },
       {
          name: "selectedRole",
          message: "What should employees new title be?",
          type: "list",
          choices: roleArray,
        }
      ]).then(results => {
        console.log(results)
        db.query('UPDATE employee SET role_id =? WHERE id=?',[results.selectedRole, results.selectedEmployee]).then(results => {
          setTimeout(start, 3000)
        })
      })
    })
  })
}

//Add a Department
//Show All Departments
//Add a Role
//Show All Roles

function start(){
  inquirer.prompt(startMenu).then((answers) => {
    switch (answers.functionality) {
      case "Show All Employees":
        return showAllEmployees();
      case "Add Employee":
        return addEmployee();
      case "Update an employee role":
        return updateEmployee();
    
    }
  });
}


start();
