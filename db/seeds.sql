INSERT into department (name) 
VALUES 
('Opperations'),
('Production'),
('Finance'),
('Legal'),
('Engineering');

INSERT into position (title, salary, department_id)
VALUES
('Cleaning Manager', 50000, 1),
('Production Manager', 65000, 2),
('Account Manager', 85000, 3),
('Lawyer', 100000, 4),
('Lead Engineer', 150000, 5);

insert into employee (first_name, last_name, position_id, manager_id)
VALUES
('Ricky ', 'Bobby', 3, null),
('Dale', 'Doback', 1, 2),
('Jackie', 'Moon', 5, 3),
('Ron', 'Burgundy', 3, null),
('Allen', 'Gamble', 4, 5);
