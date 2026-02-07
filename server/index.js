import "dotenv/config";
import express from "express";
import http from "http";
import path, { resolve } from "path";

import cors from "cors";

import todoRouter from "./routes/todoRoutes.js";
import { connectProducer } from "./utils/kafkaProducer.js";

import { clientToWebSocketMap, createWebSocketServer } from "./utils/webSocket.js";
import { createRedisPubSubSubscribers } from "./utils/redisSubscriber.js";
import { initializeTopics } from "./utils/kafkaAdmin.js";

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);


const initialConfigurations = async () => {
  try {

    // Kafka Admin Initialize Topics
    initializeTopics();

    // Connect the Producer
    connectProducer();

  } catch (error) {
    console.log("Error has occured while setting up the things....", error);
  }

};




// Middlewares -----------------------

// For Cross Origin Resource Sharing
app.use(cors());

// To access req.body
app.use(express.json());


// Web Socket Connection Configuration
// WS server
const wss = createWebSocketServer(server);
app.set("wss", wss);


// Create the Redis Pub/Sub Subscribers so that final response of the Query of REST API Endpoints can be sent
createRedisPubSubSubscribers(["todo.read.responses", "todo.create.responses", "todo.update.responses", "todo.delete.responses"], (channel, msg) => {
  console.log("Got message: ", msg, " from the channel: ", channel);

  const messageFromChannel = JSON.parse(msg);
  console.log("Got Parsed the Message: ", messageFromChannel);
  // const againParsedMessageFromChannel = JSON.parse(messageFromChannel);
  // console.log("Got Again Parsed the Message: ", againParsedMessageFromChannel);

  const { data, metadata } = messageFromChannel;
  console.log("We have got the data: ", data, "and the metadata: ", metadata);

  const { requestId, clientId } = metadata;

  const socket = clientToWebSocketMap.get(clientId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("Client is Connected thus sending the response: ", JSON.stringify(({ requestId, data, metadata })));
    socket.send(JSON.stringify({ type: channel, data, metadata }));
  }
  else {
    console.log("Client is Not Connected thus not sending the response: ", JSON.stringify(({ requestId, data, metadata })));
  }

});



// Routes

// To access & Modify To Do Routes
app.use("/api/v1/todo", todoRouter);


// By Default Send this index.html as a response if no routes above matched 
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

server.listen(PORT, async () => {
  // Please do not log your secrets 
  // console.log(process.env);

  console.log('listening on *:', PORT);
  await initialConfigurations();
});