USE employees_db;

SELECT department.id, department.department_name AS department, role.title, role.salary
FROM role LEFT JOIN department 
ON role.department_id = department.id;

SELECT employee.first_name, employee.last_name, employee.manager_id AS employee, role.id, role.title, role.salary
FROM employee LEFT JOIN role
ON employee.role_id = role.id JOIN department ON department_id = department.id;
