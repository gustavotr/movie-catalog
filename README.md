# Movie Catalog

## Considerations
a. This is a movie catalog created using MEAN stack that allows the user to create, edit, list, and see details
for each movie. This repository also include a docker-compose file to easily create a development environment using Docker.

```
MEAN stack uses MongoDB for the database, Express for the backend, 
AngularJs for the frontend and Node.js to execute the Javascript.
```
b. I am not very familiar with automated testing on the frontend so this is a learning experience.

c. With more time this project can be refined and upgraded but I think it has a solid foundation.

## Instalation

Rename the config_example.json file to config.json and set your omdbKey

## Deployment

```
docker-compose up
```

## Testing
After deploying run the following comands

Backend
```
docker-compose run express npm run test
```

Frontend
```
npm run test
```