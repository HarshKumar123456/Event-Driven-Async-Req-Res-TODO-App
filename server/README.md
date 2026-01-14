# This is The Backend Of the Event Driven TODO App 

To Start Please run this by following Commands:


## Running Steps

- First of all run the zookeeper by the command:
```

 docker run --name zookeeper-container -p 2181:2181 zookeeper

```

- Then after 10 seconds Run the Kafka Instance by this command:
```

docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.4.0

```

and don't forget to replace the PRIVATE_IP with your Computer's Private IP Address like this below:
```

docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.169.216:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.169.216:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.4.0

```


- Then After 10 seconds Run the Admin from by running the commands:
```
cd server
node utils/kafkaAdmin.js

```

Why we haven't ran by going directly into the utils folder because in that case we have to paste our .env file in utils folder too as it only gets the .env file from the directory we are running the node

- Then After 10 seconds Run the server.js by the commands:
```
cd server
node index.js

```

- Then After 10 seconds Run the workers or consumers or we say them microservices by the commands:
    - For Reading Events:
    ```
    cd server
    node microservices/read-todo.js todoRead

    ```

    - For Creating Events:
    ```
    cd server
    node microservices/create-todo.js todoCreate

    ```

    - For Updating Events:
    ```
    cd server
    node microservices/update-todo.js todoUpdate

    ```

    - For Deleting Events:
    ```
    cd server
    node microservices/delete-todo.js todoDelete

    ```




# Create Todo
POST: http://localhost:8000/api/v1/todo/todos
```
{
  "userId": "007", 
  "name": "Buy Milk", 
  "priority": "low", 
  "status": "pending"
}

```


# Read Todo
GET: http://localhost:8000/api/v1/todo/todos/1/high/pending


# Update Todo
PUT: http://localhost:8000/api/v1/todo/todos
```
{
 "name": "Buy Milk",
  "priority": "high",
  "status": "pending",
  "id": "347ac016-9935-4fb9-b65d-735b8b17646a",  
  "userId": "007"
}

```


# Delete Todo
DELETE: http://localhost:8000/api/v1/todo/todos
```
{
  "userId": "007", 
  "id": "347ac016-9935-4fb9-b65d-735b8b17646a"
}

```