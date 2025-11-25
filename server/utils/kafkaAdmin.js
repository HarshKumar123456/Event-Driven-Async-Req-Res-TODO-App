import "dotenv/config";
import { kafka } from "../config/kafka.js";

/* 

This file is responsible for creating the Kafka Topics for more information read Kafkajs (Library We are using to connect, configure and play with Kafka) docs

. We have created topics in one go when connected to the Kafka Instance first time for now it is handled manually to configure topics in the Kafka 
. We are using by default 4 partitions as of now if the requirements goes up than it then we can always configure the partitions' count in specific topic and to know about how to do that head over to the Kafkajs docs


- PLEASE NOTE: We have to manually run this file to create topics in Kafka else unexpected behaviour may arise

*/


const defaultNumberOfPartitions = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;

async function init() {
    try {

        const admin = kafka.admin();
        console.log("Kafka Admin connecting...");
        admin.connect();
        console.log("Kafka Admin Connection Success...");

        console.log("Creating Topics [todo.read, todo.create, todo.update, todo.delete]");
        await admin.createTopics({
            topics: [
                {
                    topic: "todo.read",
                    numPartitions: defaultNumberOfPartitions,
                },
                {
                    topic: "todo.create",
                    numPartitions: defaultNumberOfPartitions,
                },
                {
                    topic: "todo.update",
                    numPartitions: defaultNumberOfPartitions,
                },
                {
                    topic: "todo.delete",
                    numPartitions: defaultNumberOfPartitions,
                },
            ],
        });
        console.log("Topic Created Success [todo.read, todo.create, todo.update, todo.delete]");

        console.log("Disconnecting Kafka Admin..");
        await admin.disconnect();
    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while creating topics in kafka");

    }
}

init();
