const inquirer = require("inquirer");
const { up } = require("inquirer/lib/utils/readline");
const db = require("./db/connection");

const startMenu = {
  name: "functionality",
  message: "Hello, welcome to employee manager, what would you like to do?",
  type: "list",
  choices: [
    "Show All Employees",
    "Add Employee",
    "Update Employee Role",
    "Add a Department",
    "Show All Departments",
    "Add a Role",
    "Show All Roles",
    "Exit",
  ]
}

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
  db.query(`SELECT * FROM role`).then(results => {
    console.log(results)
    const roleChoices = results.map(role => {
      return {name: role.title, value: role.id}
    })
    db.query(`SELECT * FROM employee`).then(results => {
      console.log(results);
      const managerChoices = results.map(manager => {
        return  {name: manager.first_name +' '+ manager.last_name, value: manager.id}
      })
      const addEmployeePrompt = [
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
          name: "manager_id",
          message: "Who is this employee's manager?",
          type: "list",
          choices: managerChoices
        }
      ]
      
      inquirer.prompt(addEmployeePrompt).then((results) => {
        console.log("RESULTS ---", results);
        db.query("INSERT INTO employee SET ?", {first_name: results.first_name, last_name: results.last_name, role_id: results.role_id, manager_id: results.manager})
        .then((results) => {
          console.log("THE NEW EMPLOYEE HAS BEEN ADDED");
          setTimeout(start, 3000);       
        })
      })
    })
  })
}


//Update employee
const updateEmployee = () => {
  db.query(`SELECT * FROM employee`).then((results) => {
    console.log(results)
    const employeeArray = results.map((employee) => {
      return {
        name: employee.first_name +' '+ employee.last_name,
        value: employee.id,
      };
    });
    db.query(`SELECT * FROM role`).then((results) => {
      console.log(results)
      const roleArray = results.map((role) => {
        return { name: role.title, value: role.id };
      });
      const updateEmployeePrompt = [
          {
            name: "selectedEmployee",
            message: "Which employee would you like to update?",
            type: 'list',
            choices: employeeArray,
          },
          {
            name: "selectedRole",
            message: "What should employees new title be?",
            type: 'list',
            choices: roleArray,
          },
        ]
        inquirer.prompt(updateEmployeePrompt).then((results) => {
          console.log(results);
          db.query("UPDATE employee SET role_id =? WHERE id=?", [
            results.selectedRole,
            results.selectedEmployee,
          ]).then((results) => {
            console.log("Employee has been updated!!")
            setTimeout(start, 3000);
          });
        });
    });
  });
};

//Add a Department
const addDepartment = () => {
  const addDepartmentPrompt = 
      {
      name: "department_name",
      message: "What is the department name you want to add?",
    }
    inquirer.prompt(addDepartmentPrompt).then((results) => {
      console.log(results);
      db.query("INSERT INTO department SET ?", {
        name: results.department_name,
      }).then((results) => {
        console.log("THE DEPARTMENT HAS BEEN ADDED");
        setTimeout(start, 3000);
      });
    });
};

//Show All Departments
const showAllDepartments = ()=> {
  db.query('SELECT * FROM department').then(results => {
    console.log('----------- DEPARTMENTS -----------')
    console.table(results)
    console.log('----------- DEPARTMENTS -----------')
    setTimeout(start, 3000)
  })
} 
//Add a Role
const addRole = () => {
  db.query('SELECT * FROM department').then(results => {
    console.log(results)
    const departmentChoices = results.map(department => {
      return {name: department.name, 
        value: department.id}
    })
    const addRolePrompt = [
    {
      name: 'role_name',
      message: 'What role you want to add?'
    },
    {
      name: 'role_salary',
      message: 'What is the salary for this role?'
    },
    {
      name: 'role_department',
      message: 'What is the department for this role?',
      type: 'list',
      choices: departmentChoices
    }
  ]
  inquirer.prompt(addRolePrompt).then(results => {
  console.log(results)
  db.query('INSERT INTO role SET ?', {title: results.role_name, salary: results.role_salary, department_id: results.role_department}).then(results => {
    console.log("THE ROLE HAS BEEN ADDED!!!");
        setTimeout(start, 3000);
   })
  })
 })
}
//Show All Roles
const showAllRoles = ()=> {
  db.query('SELECT title as Job_Title, role.id as Role_ID, department.name as Department, salary FROM role LEFT JOIN department ON role.department_id=department.id').then(results => {
    console.log('----------- Roles -----------')
    console.table(results)
    console.log('----------- Roles -----------')
    setTimeout(start, 5000)
  })
}

function start() {
  inquirer.prompt(startMenu).then((answers) => {
    switch (answers.functionality) {
      case "Show All Employees":
        return showAllEmployees();
      case "Add Employee":
        return addEmployee();
      case "Update an employee role":
        return updateEmployee();
      case "Add a Department":
        return addDepartment();
      case "Show All Departments":
        return showAllDepartments();
      case "Add a Role":
        return addRole();
      case "Show All Roles":
        return showAllRoles();
    }
  });
}

start();
