create table locations (
  id int4 unsigned primary key auto_increment,
  country varchar(256) not null,
  city varchar(256) not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);

create table houses (
  id int4 unsigned primary key auto_increment,
  title varchar(256) not null,
  -- parašius UNIQ suvaržymą locationId savybei, įgalinamas ryšys "vienas su vienu" - "one-to-one" - 1:1
  locationId int4 unsigned not null unique,
  price float8 not null,
  rating float4 not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  -- Kad sukurti išorinį raktą, privaloma pirmiau sukurti lentelę su kuria sudaromas ryšys
  -- išorinio rakto locationId tipas privalo būti IDENTIŠKAS locations(id) tipui
  FOREIGN KEY (locationId) REFERENCES locations(id)
);