create database todolist;

\c todolist;

create table list
(
    id serial primary key,
    text varchar(200),
    concluded boolean
);

select * from list;

\conninfo;