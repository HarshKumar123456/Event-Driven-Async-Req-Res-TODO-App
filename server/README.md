# This is The Backend Of the Event Driven TODO App 

To Start Please run this by following Commands:

<br />
<br />

## Running Steps

- First of all run the zookeeper by the command:
```

 docker run --name zookeeper-container -d -p 2181:2181 zookeeper
 sleep 10s

```

<br />
<br />

- Then after 10 seconds Run the Kafka Instance by this command:
```

docker run --name kafka-container -d -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.4.0
sleep 10s

```

and don't forget to replace the PRIVATE_IP with your Computer's Private IP Or Internal IP Address like this below:
```

docker run --name kafka-container -d -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.169.216:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.169.216:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.4.0
sleep 10s

```

<br />
<br />

- and then Run the Redis Instance by this Command:
```

docker run --name redis-container -d -p 6379:6379 -p 8001:8001 redis/redis-stack
sleep 10s

```

<br />
<br />

<b>NOTE</b>: From here Every Command Should be run by opening a new Terminal for the Purpose of Observability of the System and you can see things running seperately.

<br />
<br />

- Install Packages Required in the '<b>server</b>' folder via this Command
```

cd server
npm install 
```

<br />
<br />



- Then After 10 seconds Run the Admin from by running the commands:
```
cd server
node utils/kafkaAdmin.js

```

Why we haven't ran by going directly into the utils folder because in that case we have to paste our .env file in utils folder too as it only gets the .env file from the directory we are running the node


<br />
<br />


- Then After 10 seconds Run the server.js by the commands:
```
cd server
node index.js

```

<br />
<br />


- Then After 10 seconds Run the workers or kafka consumers or we say them microservices by the commands:
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
<b>URL:</b> http://localhost:8000/api/v1/todo/todos
<br />
<b>Method:</b> POST
<br />
<b>Headers:</b> { "client-id": "Websocket Connection Id String 'clientId' get from the '/' route in the event's type 'connected' in the first Websocket Message from the server as soon as connection is established" }
<br />
<b>Req.body:</b>
```
{
  "userId": "007", 
  "name": "Buy Milk", 
  "priority": "low", 
  "status": "pending"
}

```

<br />
<br />


# Read Todo
<b>URL:</b> http://localhost:8000/api/v1/todo/todos
<br />
<b>Method:</b> GET
<br />
<b>Headers:</b> { "client-id": "Websocket Connection Id String 'clientId' get from the '/' route in the event's type 'connected' in the first Websocket Message from the server as soon as connection is established" }
<br />

<br />
<br />


# Update Todo
<b>URL:</b> http://localhost:8000/api/v1/todo/todos
<br />
<b>Method:</b> PUT
<br />
<b>Headers:</b> { "client-id": "Websocket Connection Id String 'clientId' get from the '/' route in the event's type 'connected' in the first Websocket Message from the server as soon as connection is established" }
<br />
<b>Req.body:</b>
```
{
 "name": "Buy Milk",
  "priority": "high",
  "status": "pending",
  "id": "347ac016-9935-4fb9-b65d-735b8b17646a",  
  "userId": "007"
}

```

<br />
<br />


# Delete Todo
<b>URL:</b> http://localhost:8000/api/v1/todo/todos
<br />
<b>Method:</b> DELETE
<br />
<b>Headers:</b> { "client-id": "Websocket Connection Id String 'clientId' get from the '/' route in the event's type 'connected' in the first Websocket Message from the server as soon as connection is established" }
<br />
<b>Req.body:</b>
```
{
  "userId": "007", 
  "id": "347ac016-9935-4fb9-b65d-735b8b17646a"
}

```