CREATE DATABASE crypto_ii;
DROP DATABASE crypto_ii;

\c crypto_ii

CREATE TABLE IF NOT EXISTS email_server(
 id SERIAL UNIQUE PRIMARY KEY,
 sender VARCHAR(250) NOT NULL,
 mail_destination VARCHAR(250) NOT NULL,
 topic VARCHAR(250),
 mail_msg VARCHAR(250) NOT NULL
);

DROP TABLE email_server;

SELECT * FROM email_server;


