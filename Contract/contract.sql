-- SQLite
SELECT id, IDContract, Name, Type, Address, DateCreated, DateRun, Price, Description, Customer_id, City
FROM Contract_contract
WHERE Address = 'Hanau';

UPDATE Contract_contract
SET Customer_id = 2340
WHERE Address = 'Friedberg';