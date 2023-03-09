insert into users (email, password, firstname, lastname) values
('testuser@gmail.com', '$2b$05$XpAbe6hvlL9ObmADeO1Dd.089uztgQvUEy4kJMqobxJLnp61.9pPK', 'TestUser', 'TestUser');

SET @temp_user_id = LAST_INSERT_ID();

alter table bikes
add ownerId int4 unsigned,
add foreign key (ownerId) references users(id);

update bikes
set ownerId = @temp_user_id;

alter table bikes 
modify ownerId int4 unsigned not null;