import "dotenv/config";
import express from "express";
import http from "http";
import path, { resolve } from "path";
import { Server } from "socket.io";
import cors from "cors";

import todoRouter from "./routes/todoRoutes.js";
import { connectProducer } from "./utils/kafkaProducer.js";

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const initialConfigurations = async () => {
  try {

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
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});



// Routes

// To access & Modify To Do Routes
app.use("/api/v1/todo", todoRouter);


// By Default Send this index.html as a response if no routes above matched 
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

server.listen(PORT, async () => {
  console.log(process.env);
  
  console.log('listening on *:', PORT);
  await initialConfigurations();
});