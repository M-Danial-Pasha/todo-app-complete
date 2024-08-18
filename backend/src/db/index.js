import mongoose from "mongoose";

// This is the function to connect to the Database - (MONGODB)
const connectionToDB = async () => {
    try {
        let connectionInstance;

        if(process.env.MONGODB_PRODUCTION_URL !== '') {
            connectionInstance = await mongoose.connect(`${process.env.MONGODB_PRODUCTION_URL}`);
        } else if (process.env.MONGODB_STAGING_URL !== '') {
            connectionInstance = await mongoose.connect(`${process.env.MONGODB_STAGING_URL}`);
        } else {         
            connectionInstance = await mongoose.connect(`${process.env.MONGODB_DEV_URL}/${process.env.MONGODB_DATABASE_NAME}`);
        }
        console.log(`MONGODB CONNECTED!! -- DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error);
        process.exit(1);
        
    }
}

export default connectionToDB