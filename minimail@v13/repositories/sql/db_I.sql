CREATE DATABASE crypto;
DROP DATABASE crypto;
\c crypto


CREATE TABLE IF NOT EXISTS client(
 id SERIAL UNIQUE PRIMARY KEY,
 name VARCHAR(250),
 email VARCHAR(250) UNIQUE NOT NULL,
 password VARCHAR(250) NOT NULL,
 role VARCHAR(250) NOT NULL
);
DROP TABLE client;


CREATE TABLE IF NOT EXISTS email_server(
 id SERIAL UNIQUE PRIMARY KEY,
 mail_destination VARCHAR(250) NOT NULL,
 topic VARCHAR(250),
 mail_msg VARCHAR(250) NOT NULL,
 client_id INT,
 FOREIGN KEY (client_id) REFERENCES client(id)
);
DROP TABLE email_server;


INSERT INTO client VALUES(1, 'Margot Robbie', 'harley@gmail.com', 12345678, 'user');
INSERT INTO email_server VALUES(1, 'pine@startrek.com.uk', 'movie make', 'We are working in the same movie my friend!!! I am so happy, yeahh!!', 1);


DELETE FROM client WHERE id=1;
DELETE FROM email_server WHERE id=1;


SELECT * FROM email_server;
SELECT * FROM client;


SELECT c.id, c.name, 
       c.email, c.role,
       e.id, e.mail_destination,
       e.topic, e.mail_msg
FROM client c
INNER JOIN email_server e
ON c.id=e.client_id
WHERE c.id=1;


ALTER TABLE client DROP COLUMN role;
ALTER TABLE email_server ADD COLUMN sender VARCHAR(250) NOT NULL;


SELECT c.id, c.name, 
       c.email, c.role,
       e.id, e.mail_destination,
       e.topic, e.mail_msg, e.sender
FROM client c
INNER JOIN email_server e
ON c.id=e.client_id
WHERE e.mail_destination='alura@gmail.com'; 