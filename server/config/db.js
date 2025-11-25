import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@<mongodb_url>/eventDrivenTODO";

const connectDB = async () => {
    try {
        console.log(process.env);
        
        console.log(MONGODB_URI);
        
        await mongoose.connect(`${MONGODB_URI}`);
        console.log("MongoDB is connected....");  
    } catch (error) {
        console.log(`Error connecting MongoDB ${error}`);
    }
};

export default connectDB;