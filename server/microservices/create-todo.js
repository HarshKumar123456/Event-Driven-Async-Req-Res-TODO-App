import "dotenv/config";
import { kafka } from "../config/kafka.js";
import connectDB from "../config/db.js";
import Todo from "../models/todoModel.js";

const group = process.argv[2];

async function init() {
  try {

    // Connect to DB
    connectDB();

    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();

    await consumer.subscribe({ topics: ["todo.create"], });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(
          `${group}: [${topic}]: PART:${partition}:`,
          message.value.toString()
        );

        const info = JSON.parse(message.value);
        const { data, metadata } = info;
        // const data = {
        //     todoName: name,
        //     todoPriority: priority,
        //     todoStatus: status,
        // };

        const todo = await new Todo({
          name: data.todoName,
          priority: data.todoPriority,
          status: data.todoStatus,
        }).save();


        // Handle Sending response back to the user
        console.log("Successfully Created the Todo", todo);
        

      },
    });
  } catch (error) {
    console.log("Error: ", error);
    console.log("Something went wrong while consuming the Creating event....");
  }
}

init();