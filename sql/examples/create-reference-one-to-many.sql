create table houses (
  id int4 unsigned primary key auto_increment,
  title varchar(256) not null,
  price float8 not null,
  rating float4 not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
);

create table images (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  -- neparašius UNIQ suvaržymo houseId savybei, įgalinamas ryšys "vienas su daug" - "one-to-many" - 1:M
  houseId int4 unsigned not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  -- Kad sukurti išorinį raktą, privaloma pirmiau sukurti lentelę su kuria sudaromas ryšys
  -- išorinio rakto houseId tipas privalo būti IDENTIŠKAS houses(id) tipui
  FOREIGN KEY (houseId) REFERENCES houses(id)
);