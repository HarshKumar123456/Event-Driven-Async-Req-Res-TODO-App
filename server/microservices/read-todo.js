import "dotenv/config";
import { kafka } from "../config/kafka.js";
import connectDB from "../config/db.js";
import Todo from "../models/todoModel.js";

const group = process.argv[2];

async function init() {
  try {

    // Connect to DB
    await connectDB();

    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();

    await consumer.subscribe({ topics: ["todo.read"], });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(
          `${group}: [${topic}]: PART:${partition}:`,
          message.value.toString()
        );

        const info = JSON.parse(message.value);
        const { data, metadata } = info;
        // const data = {
        //   userId: userId,
        //   filter: filter,
        // };

        const todo = await Todo.find(data.filter);
        if (!todo) {
          console.log("Todos With Filters: ", data.filter, " don't exists....");
        }


        // Handle Sending response back to the user
        console.log("Successfully Got the Todos", todo);


      },
    });
  } catch (error) {
    console.log("Error: ", error);
    console.log("Something went wrong while consuming the Creating event....");
  }
}

init();