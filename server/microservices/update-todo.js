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

    await consumer.subscribe({ topics: ["todo.update"], });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(
          `${group}: [${topic}]: PART:${partition}:`,
          message.value.toString()
        );

        const info = JSON.parse(message.value);
        const { data, metadata } = info;
        // const data = {
        //     filter: {
        //         todoId: id,
        //     },
        //     updatedFields: updatedFields,
        // };

        const todo = await Todo.findOneAndUpdate(data.filter, data.updatedFields);
        if (!todo) {
          console.log("Todos With Filters: ", data.filter, " don't exists....");
        }

        
        // Handle Sending response back to the user
        console.log("Successfully Updated the Todo", todo);


      },
    });
  } catch (error) {
    console.log("Error: ", error);
    console.log("Something went wrong while consuming the Creating event....");
  }
}

init();