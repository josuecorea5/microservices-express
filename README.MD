# Microservices Express Assignment

### Steps to run app

1. Download the app from this repository.
2. Import collection to Postman **Microservices-Express.postman_collection.json***
3. Go to microservices folder and run the next command for each microservice

This command will install all necessary dependencies required by each microservice.
```shell
npm install
``` 

4. After that we need to create the containers that are defined in docker-compose

This command will start to build each container
```shell
docker-compose up --build
```


We have a file call **language-codes.csv** that is already in the repository. When you run the above command, will convert that file to JSON if the .json file does not exist.