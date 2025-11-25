import "dotenv/config";
import { sendEvent } from "../utils/kafkaProducer.js";

const defaultNumberOfPartitions = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;


const getAllToDosController = async (req, res) => {

    try {
        // Extracting information from req.body
        const { userId, priority, status } = req.params;
        const filter = {};

        // If Priority is Given Filter on basis of priority
        if(priority) {
            filter.priority = priority;
        }
        
        // If Priority is Given Filter on basis of priority
        if(status) {
            filter.status = status;
        }

        // Push the Get Todo Event In Queue
        const data = {
            userId: userId,
            filter: filter,
        };
        const dateNow = new Date();
        const metadata = {
            operationToPerform: ("read").toLowerCase(),
            createdAt: dateNow.toISOString(),
            updateAt: dateNow.toISOString(),
        }
        const topicOnWhichToBePublished = "todo.read";
        const partitionOnWhichToBePublished = (userId) % defaultNumberOfPartitions;
        await sendEvent(topicOnWhichToBePublished, partitionOnWhichToBePublished, data, metadata);


        return res.status(202).json(
            {
                success: true,
                message: "Reading Todo Request is Accepted....",
            }
        )

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while sending the Reading event....");
        
        return res.status(500).json(
            {
                success: false,
                message: "Error Reading Todo....",
                error
            }
        )
    }
};


const createTodoController = async (req, res) => {
    try {
        // Extracting information from req.body
        const { userId, name, priority, status } = req.body;

        // Checking if all things are given 
        if (!name) {
            return res.send({
                success: false,
                message: "Todo Name is required....",
            });
        }
        if (!priority) {
            return res.send({
                success: false,
                message: "Todo priority is required....",
            });
        }
        if (!status) {
            return res.send({
                success: false,
                message: "Todo status is required....",
            });
        }


        // Push the Todo In Queue To Be Created
        const data = {
            todoName: name,
            todoPriority: priority,
            todoStatus: status,
        };
        const dateNow = new Date();
        const metadata = {
            operationToPerform: ("create").toLowerCase(),
            createdAt: dateNow.toISOString(),
            updateAt: dateNow.toISOString(),
        }
        const topicOnWhichToBePublished = "todo.create";
        const partitionOnWhichToBePublished = (userId) % defaultNumberOfPartitions;
        await sendEvent(topicOnWhichToBePublished, partitionOnWhichToBePublished, data, metadata);


        return res.status(202).json(
            {
                success: true,
                message: "Todo Creation Request is Accepted....",
            }
        );

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while sending the Creating event....");
        
        return res.status(500).json(
            {
                success: false,
                message: "Error Creating Todo....",
                error
            }
        )
    }
};


const updateTodoController = async (req, res) => {
    try {
        // Extracting information from req.body
        const { userId, id, name, priority, status } = req.body;

        // Checking if all things are given 
        if(!id) {
            return res.send({
                success: false,
                message: "Todo Id is required....",
            });
        }

        const updatedFields = {};

        if (name) {
            updatedFields.name = name;
        }
        if (priority) {
            updatedFields.priority = priority;
        }
        if (status) {
            updatedFields.status = status;
        }


        // Push the Todo In Queue To Be Updated
        const data = {
            filter: {
                id: id,
            },
            updatedFields: updatedFields,
        };
        const dateNow = new Date();
        const metadata = {
            operationToPerform: ("update").toLowerCase(),
            createdAt: dateNow.toISOString(),
            updateAt: dateNow.toISOString(),
        }
        const topicOnWhichToBePublished = "todo.update";
        const partitionOnWhichToBePublished = (userId) % defaultNumberOfPartitions;
        await sendEvent(topicOnWhichToBePublished, partitionOnWhichToBePublished, data, metadata);


        return res.status(202).json(
            {
                success: true,
                message: "Todo Updation Request is Accepted....",
            }
        );

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while sending the Updating event....");
        
        return res.status(500).json(
            {
                success: false,
                message: "Error Updating Todo....",
                error
            }
        )
    }
};


const deleteTodoController = async (req, res) => {
    try {
        // Extracting information from req.body
        const { userId, id } = req.body;

        // Checking if all things are given 
        if(!id) {
            return res.send({
                success: false,
                message: "Todo Id is required....",
            });
        }

        // Push the Todo In Queue To Be Deleted
        const data = {
            todoId: id,
        };
        const dateNow = new Date();
        const metadata = {
            operationToPerform: ("delete").toLowerCase(),
            createdAt: dateNow.toISOString(),
            updateAt: dateNow.toISOString(),
        }
        const topicOnWhichToBePublished = "todo.delete";
        const partitionOnWhichToBePublished = (userId) % defaultNumberOfPartitions;
        await sendEvent(topicOnWhichToBePublished, partitionOnWhichToBePublished, data, metadata);


        return res.status(202).json(
            {
                success: true,
                message: "Todo Deletion Request is Accepted....",
            }
        );

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while sending the Deleting event....");
        
        return res.status(500).json(
            {
                success: false,
                message: "Error Deleting Todo....",
                error
            }
        )
    }
};

export { getAllToDosController, updateTodoController, createTodoController, deleteTodoController };