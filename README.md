# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Set-Up

In order to connect to both the development database and the test database and run the project locally, you must take the following steps:

1. Create a ".env.development" file. Inside this file should be the environment variable "PGDATABASE=nc_news".

2. Create a ".env.test" file. Inside this file should be the environment variable "PGDATABASE=nc_news_test".