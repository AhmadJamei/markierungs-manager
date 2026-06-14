-- SQLite
SELECT RegisterNumber, Model, Kind, Fuel, Image, Description, insurance_expiry, mileage, purchase_date, responsible_id, technical_expiry
FROM Vehicle_vehicle
WHERE RegisterNumber LIKE '%E'



UPDATE Vehicle_vehicle
SET Model = 9 
WHERE RegisterNumber LIKE '%E'