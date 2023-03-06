create table users (
  id int4 unsigned primary key auto_increment,
  email varchar(64) not null unique,
  password varchar(32) not null,
  firstname varchar(64) not null,
  lastname varchar(64) not null,
  role enum ('USER', 'ADMIN') default ('USER'),
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);
