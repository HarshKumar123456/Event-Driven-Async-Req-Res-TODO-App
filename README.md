# Event Driven TODO App 

This Project Tries to implement the <b>Asynchronous Reqeuest Response Model</b>.
<br />
Ok Ok In this Flashy World of Cool Projects maybe this is too simple to make the TODO app but it is not about features the Project have it is About the <b>Implementation</b> that project have and to quickly make you understand how is doing keeping probably it is good to have minimal What is it doing. 

<br />
<br />


## Note from Author

I i.e. Harsh Kumar Sincerely Accepts that it might not be best way out to implement the Asynchronous Request Response Model But it is among one of them. So I beforehand wants your kindness to me for forgiving me if this is not upto your expectations and say Thanks a lot to you for reading this project :)

Yours Dev Friend
<br />
Harsh Kumar


<br />
<br />



## How to Run

- <b> Prerequisite to Run: </b>

Clone This Repo by running:
```
git clone https://github.com/HarshKumar123456/Event-Driven-Async-Req-Res-TODO-App.git
```
First of all Head towards the '<b>.env.example</b>' file and then edit the '<b>.env</b>' file in '<b>server</b>' accordingly for Manual Setup way and If You Choose the Automatic Setup way then change the '<b>main.conf</b>' file as per instructions Written in that file.


<br />
<br />



- <b> Manually: </b>

To run this Project Manually First You will have to head towards '<b>server</b>' folder and from there you have to make sure you run backend successfully and then you will have to start the frontend by going into the '<b>client</b>' folder and Don't Worry there is also README file like this to help you out in running steps with ease.

<br />
<br />


- <b> Automatically: </b>

To run this Project Automatically Run these Commands and have a Coffee while all things set up :)
```

docker compose up -d zookeeper
sleep 20s
docker compose up -d redis kafka
sleep 20s
docker compose up -d api-gateway
sleep 20s
docker compose up -d
sleep 20s

```

<br />
<br />


## Links on which Applications are Running

- Client is Running on the: ```localhost:5173```
- Server is Running on the: ```localhost:8000```


<br />
<br />




## Approach behind Project

This project implements the Asynchronous Request Response (You be Like: How many times you will say that....) by adopting the Event Driven Architecture. It starts its flow as:

<br />

- <b> UI ----> Establish WebSocket Connection ----> Server </b>

<br />

- <b> UI ----> Make Operation Request via REST API Call ----> Server ----> Pushes the Relevant Event ----> Kafka Queue ----> Send Acknowledgement Got Event ----> Server ----> Send Response (201: Accepted) to the Initial REST API Call ----> UI </b>

<br />

- <b> Events Are Picked By the "Kafka Consumer Groups" and Processed and the final Response is Published to "Redis Pub/Sub" and that Channel is Subscribed by the "Server" and then it is Sent to the Relevant User's "UI" via the "WebSocket Connection" </b>