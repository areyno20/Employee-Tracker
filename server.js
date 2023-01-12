//dependencies
const inquirer = require('inquirer'); 
const mysql = require("mysql2");
const cTable = require('console.table'); 

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: "mysqlpass20",
    database: 'employeetracker_db'
  },
  console.log(`Connecting to the employeetracker_db database.`)
);

connection.connect(function(err) {
  if (err){
   throw err;
  }
  console.log("Connected!");
  postConnection()
});

postConnection = () => {
  console.log("-----------------------------------")
  console.log("|        EMPLOYEE MANAGER         |")
  console.log("-----------------------------------")
  employeeTracker()
};

const employeeTracker = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'choices', 
      message: 'What would you like to do?',
      choices: [
                'View all employees', 
                'View all departments', 
                'View all roles', 
                'Add an employee', 
                'Add a department', 
                'Add a role', 
                'Update an employee role',
                'Quit'
              ]
    }
  ])
    .then((answers) => {
      const { choices } = answers; 
      if (choices === "View all employees") {
        showEmployees();
      }
      if (choices === "View all departments") {
        showDepartments();
      }
      if (choices === "View all roles") {
        showRoles();
      }
      if (choices === "Add an employee") {
        addEmployee();
      }
      if (choices === "Add a department") {
        addDepartment();
      }
      if (choices === "Add a role") {
        addRole();
      }
      if (choices === "Update an employee role") {
        updateEmployee();
      }
      if (choices === "Quit") {
        connection.end()
    };
  });
};
  
showEmployees=() => {
  connection.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    console.log("Viewing all employees: ");
    console.table(result);
    employeeTracker();
  });
}

showDepartments=() => { 
  connection.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err; 
    console.table(result);
    employeeTracker();
  });
}

showRoles=() => {
  connection.query('SELECT * FROM role', (err, result) => {
    if (err) throw err; 
    console.table(result);
    employeeTracker();
  });
}

addEmployee=() => {
  connection.query(`SELECT * FROM employee, role`, (err, result) => {
    if (err) throw err;
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employees first name that you want to add?',
      validate: firstNameInput => {
        if (firstNameInput) {
          return true;
        } else {
          console.log('Please enter the employees first name correctly');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employees last name that you want to add?',
      validate: lastNameInput => {
        if (lastNameInput) {
          return true;
        } else {
          console.log('Please enter the employees last name correctly');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the employees role in the company?',
      choices: () => {
        var array = [];
        for (var i = 0; i < result.length; i++) {
            array.push(result[i].title);
        }
        var newArray = [...new Set(array)];
        return newArray;
      }
    },
    {
      type: 'input',
      name: 'manager',
      message: 'Who is the employees manager?',
      validate: managerInput => {
          if (managerInput) {
            return true;
          } else {
            console.log('Please Add A Manager!');
            return false;
          }
      }
    }                
    ]).then((answers) => {
      for (var i = 0; i < result.length; i++) {
          if (result[i].title === answers.role) {
              var role = result[i];
          }
      }
      connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
        if (err) throw err;
        console.log(`Added employee to the database.`)
        employeeTracker();
      });
    })
  })
};
  
addDepartment=() =>{
  inquirer.prompt([
    {
      type: 'input',
      name: 'department_id',
      message: 'What department would you like to add?',
      validate: departmentadd => {
        if (departmentadd) {
          return true;
        } else {
          console.log('Please enter the department correctly');
          return false;
        }
      }
    }
  ]).then((answers) => {
    connection.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err) => {
      if (err) throw err;
      console.log(`Added ${answers.department} to the database.`)
      employeeTracker();
    });
  })
}

addRole=() => {
  connection.query('SELECT * FROM department', (err, result) => {
    if (err) throw err;
        inquirer.prompt ([
          {
            type: 'input',
            name: 'role_id',
            message: 'What role would you like to add?',
            validate: roleAdd => {
              if (roleAdd) {
                return true; 
              } else {
                console.log('Please enter the role correctly');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: salaryadd => {
              if (salaryadd) {
                return true;
              } else {
                console.log('Please enter the salary correctly');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'department_id',
            message: 'Department for this role?',
            choices: () => {
              const department = [];
              for (var i = 0; i < result.length; i++) {
                department.push(result[i].name);
              }              
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
              if (result[i].name === answers.department) {
                  var department = result[i];
              }
          }
          connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err) => {
              if (err) throw err;
              console.log(`Added ${answers.role} to the database.`)
              employeeTracker();
          });
      })
    })
} 

updateEmployee=() => {
  connection.query('SELECT * FROM employee', function(err, result) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: () => {
          const employee = [];
          for (var i = 0; i < result.length; i++) {
            employee.push(result[i].first_name);
          }
          return employee;
        }
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'What is the employees new role?',
        choices: () => {
          const role = [];
          for (var i = 0; i < result.length; i++) {
            role.push(result[i].title);
          }
          return role;
        }
      }
      ]).then(() => {
        for (var i = 0; i < result.length; i++) {
          if (result[i].title === answers.role) {
              var role = result[i];
          }
      }
      connection.query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [role.id, answers.employee], (err) => {
          if (err) throw err;
          console.log(`Updated ${answers.employee}'s role to ${answers.role}.`)
          employeeTracker();
        });
      })
    })
  }  
  
  quit=() => {
  connection.end();
  console.log("Good-Bye!");
  }


