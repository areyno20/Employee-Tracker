//dependencies
const inquirer = require('inquirer'); 
const mysql = require('mysql2');


// Connect to database
const db = mysql.createConnection(
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

db.connect(function(err) {
  if (err){
   throw err;
  }
  console.log("Connected!");
});

const employeetracker = function() {
  inquirer.prompt([{
      type: 'list',
      name: 'employeetracker',
      message: 'What would you like to do?',
      choices: ['View all employees', 'View all departments', 'View all positions', 'Add employee', 'Add department', 'Add position', 'Update Employee Position','Quit']
  }])
  .then((answers) => {
    if (answers.prompt === 'View all employees') {
      db.query('SELECT * FROM employee', function(err, results) {
        console.table(results);
        employeetracker();
      });
    } 
    else if (answers.prompt === 'View all departments') {
      db.query('SELECT * FROM department', function(err, results) {
        console.table(results);
        employeetracker();
      });
    }
    else if (answers.prompt === 'View all positions') {
      db.query('SELECT * FROM role', function(err, results) {
        console.table(results);
        employeetracker();
      });
    }
    else if (answers.prompt === 'Add employee') {
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstname',
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
          name: 'lastname',
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
          name: 'position',
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
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, position.id, answers.manager.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
            employee_tracker();
        });
    })
  }
  else if (answers.prompt === 'Add department') {
    inquirer.prompt([
      {
        type: 'input',
        name: 'department',
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
      db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
        if (err) throw err;
        console.log(`Added ${answers.department} to the database.`)
        employee_tracker();
      });
    })
  }
  else if (answers.prompt === 'Add position') {
    db.query('SELECT * FROM department', function(err, results) {
          inquirer.prompt ([
            {
              type: 'input',
              name: 'position',
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
              name: 'department',
              message: 'Department for this position?',
              choices: () => {
                const department = [];
                for (var i = 0; i < results.length; i++) {
                  department.push(results[i].name);
                }              
              }
            }
          ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === answers.department) {
                    var department = results[i];
                }
            }
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.position, answers.salary, department.id], (err) => {
                if (err) throw err;
                console.log(`Added ${answers.position} to the database.`)
                employee_tracker();
            });
        })
      })
  } 
  else if (answers.prompt === "Update an employee Position") {
    db.query('SELECT * FROM employee', function(err, results) {
      inquirerer.prompt([
        {
          type: 'input',
          name: 'employee',
          message: 'Which employee would you like to update?',
          choices: () => {
            const employee = [];
            for (var i = 0; i < results.length; i++) {
              employee.push(results[i].first_name);
            }
            return employee;
          }
        },
        {
          type: 'input',
          name: 'position',
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
                var role = result[i];
            }
        }
        db.query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [role.id, answers.employee], (err) => {
            if (err) throw err;
            console.log(`Updated ${answers.employee}'s position to ${answers.position}.`)
            employee_tracker();
          });
        })
      })
    }  
    else if (answers.prompt === 'Quit') {
    db.end();
    console.log("Good-Bye!");
    }
  })
};

