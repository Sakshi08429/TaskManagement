import mongoose from "mongoose";

const connect = async () => {
    try {
        console.log("Attempting to connect to database...");
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Failed to connect to database...", error.message);
        process.exit(1); 
    }
};

export default connect;
