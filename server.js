//dependencies
const inquirer = require('inquirer'); 
const mysql = require("mysql2");


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
  console.log(`Connected to the employeetracker_db database.`)
);

connection.connect(function(err) {
  if (err){
   throw err;
  }
  console.log("Connected!");
  postConnection()
});

postConnection = () => {
  console.log("***********************************")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("***********************************")
  employeetracker()
};


const employeetracker=() => {
  inquirer.prompt([{
      type: 'list',
      name: 'employeetracker',
      message: 'What would you like to do?',
      choices: [
      'View all employees', 
      'View all departments', 
      'View all positions', 
      'Add employee', 
      'Add department', 
      'Add position', 
      'Update employee position',
      'Quit'
      ]
  }])
  .then((answers) => {
    if(answers === 'View all employees') {
      showEmployees();
    }
    if(answers === 'View all departments') {
      showDepartments();
    }
    if(answers === 'View all positions') {
      showPositions();
    }
    if(answers === 'Add employee') {
      addEmployee();
    }
    if(answers === 'Add department') {
      addDepartment();
    }
    if(answers === 'Add position') {
      addPosition();
    }
    if(answers === 'Update employee position') {
      updateEmployeePosition();
    }
    if(answers === 'Quit') {
      quit();
    }
  })
};
  
showEmployees=() => {
  connection.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    console.log("Viewing all employees: ");
    console.table(result);
    employeetracker();
  });
}

showDepartments=() => { 
  connection.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err; 
    console.table(result);
    employeetracker();
  });
}

showPositions=() => {
  connection.query('SELECT * FROM position', (err, result) => {
    if (err) throw err; 
    console.table(result);
    employeetracker();
  });
}

addEmployee=() => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employees first name that you want to add?',
      validate: employeeadd => {
        if (employeeadd) {
          return true;
        } else {
          console.log('Please enter the employees first name correctly');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the employees last name that you want to add?',
      validate: employeeadd => {
        if (employeeadd) {
          return true;
        } else {
          console.log('Please enter the employees last name correctly');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'position_id',
      message: 'What is the employees position in the company?',
      choices: () => {
        const position = [];
          for (var i = 0; i < result.length; i++) {
          position.push(result[i].title);
        }
        var newPosition = [...new Set(array)];
          return newPosition;
      }
    },
    {
      type: 'input',
      name: 'manager_id',
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
          if (result[i].title === answers.position) {
              var position = result[i];
          }
      }
      connection.query(`INSERT INTO employee (first_name, last_name, position_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, position.id, answers.manager.id], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
          employeetracker();
      });
  })
}
  
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
      employeetracker();
    });
  })
}

addPosition=() => {
  connection.query('SELECT * FROM department', (err, result) => {
    if (err) throw err;
        inquirer.prompt ([
          {
            type: 'input',
            name: 'position_id',
            message: 'What position would you like to add?',
            validate: positionadd => {
              if (positionadd) {
                return true; 
              } else {
                console.log('Please enter the position correctly');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this position?',
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
            message: 'Department for this position?',
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
          connection.query(`INSERT INTO position (title, salary, department_id) VALUES (?, ?, ?)`, [answers.position, answers.salary, department.id], (err) => {
              if (err) throw err;
              console.log(`Added ${answers.position} to the database.`)
              employeetracker();
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
        name: 'position_id',
        message: 'What is the employees new position?',
        choices: () => {
          const position = [];
          for (var i = 0; i < result.length; i++) {
            position.push(result[i].title);
          }
          return position;
        }
      }
      ]).then(() => {
        for (var i = 0; i < result.length; i++) {
          if (result[i].title === answers.position) {
              var position = result[i];
          }
      }
      connection.query(`UPDATE employee SET position_id = ? WHERE first_name = ?`, [position.id, answers.employee], (err) => {
          if (err) throw err;
          console.log(`Updated ${answers.employee}'s position to ${answers.position}.`)
          employeetracker();
        });
      })
    })
  }  
  
  quit=() => {
  connection.end();
  console.log("Good-Bye!");
  }


