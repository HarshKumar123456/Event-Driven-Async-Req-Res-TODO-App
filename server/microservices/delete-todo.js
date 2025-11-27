import "dotenv/config";
import { kafka } from "../config/kafka.js";
import connectDB from "../config/db.js";
import Todo from "../models/todoModel.js";
import { publishToRedisPubSub } from "../utils/redisPublisher.js";

const group = process.argv[2];

async function init() {
    try {

        // Connect to DB
        connectDB();

        const consumer = kafka.consumer({ groupId: group });
        await consumer.connect();

        await consumer.subscribe({ topics: ["todo.delete"], });

        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                console.log(
                    `${group}: [${topic}]: PART:${partition}:`,
                    message.value.toString()
                );

                const info = JSON.parse(message.value);
                const { data, metadata } = info;
                // const data = {
                //     todoId: id,
                // };

                // const metadata = {
                //     clientId: clientId,
                //     requestId: requestId,
                //     operationToPerform: ("delete").toLowerCase(),
                //     createdAt: dateNow.toISOString(),
                //     updateAt: dateNow.toISOString(),
                // }

                const todo = await Todo.findOneAndDelete({
                    id: data.todoId,
                },);

                if (!todo) {
                    console.log("Todo With id: ", data.todoId, " doesn't exists....");
                }

                // Handle Sending response back to the user
                console.log("Successfully Deleted the Todo", todo);


                // Publish the Final Response to the Redis Pub/Sub and Then Redis Pub/Sub & Websocket will handle the delivery of the final result to the respective client
                await publishToRedisPubSub("todo.delete.responses", JSON.stringify({ data: todo, metadata: metadata }));


            },
        });
    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while consuming the Creating event....");
    }
}

init();