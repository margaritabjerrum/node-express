create table users (
  id int1 unsigned primary key auto_increment,
  email varchar(64),
  password varchar(32),
  firstName varchar(64),
  lastName varchar(64),
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);
