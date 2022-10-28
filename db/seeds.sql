USE ChandlerCon;

INSERT INTO department
(department_name)
VALUES
('Executive'),
('Management'),
('Estimating'),
('HR'),
('Accounting');

INSERT INTO role 
(title, salary, department_id)
VALUES 
('President', '5000000.00', 1),
('Division Manager', '400000.00', 2),
('Lead Estimator', '300000.00', 3),
('HR Manager', '200000.00', 4),
('Accounts Payable', '100000.00', 5);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('Shane', 'Brinkley', 1, NULL),
('Patrick', 'Hobson', 2, 1),
('Todd', 'Holley', 3, 2),
('Ashley', 'Guay', 4, NULL),
('Katie', 'Numbers', 5, 1);