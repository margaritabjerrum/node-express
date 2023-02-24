create table stats (
  id int4 unsigned primary key auto_increment,
  engine varchar(256) not null,
  power varchar(256) not null,
  seat_height varchar(256) not null,
  weight varchar(256) not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);

create table bikes (
  id int4 unsigned primary key auto_increment,
  brand varchar(256) not null,
  model varchar(256) not null,
  year int4 not null,
  price float8 not null,
  statsId int4 unsigned not null unique,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (statsId) REFERENCES stats(id)
);

create table images (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  bikeId int4 unsigned not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (bikeId) REFERENCES bikes(id)
);
