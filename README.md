# API for FindITJob - it job board

### Technologies:
- Express.js
- Postgres
- JWT

### Development server

Run development server `npm run dev`


### Database setup

```sql
create database finditjob

create table employer
(
    id            serial
        constraint employer_pk
            primary key,
    company_name  varchar                                          not null,
    company_image varchar default 'default.png'::character varying not null,
    user_id       integer                                          not null
);

alter table employer
    owner to postgres;

create unique index employer_user_id_uindex
    on employer (user_id);

create table job
(
    id          serial
        constraint job_pk
            primary key,
    name        varchar               not null,
    remote      boolean default false not null,
    salary      jsonb,
    description text                  not null,
    benefits    text[],
    skills      jsonb,
    employer_id integer               not null,
    experience  varchar
);

create unique index job_id_uindex
    on job (id);
    
create table job_application
(
    id      serial
        constraint job_application_pk
            primary key,
    user_id integer not null,
    job_id  integer not null
);

create unique index job_application_id_uindex
    on job_application (id);

create table "user"
(
    id       serial
        constraint user_pk
            primary key,
    email    varchar               not null,
    password varchar               not null,
    employer boolean default false not null
);

create unique index user_id_uindex
    on "user" (id);

create unique index user_email_uindex
    on "user" (email);
```
