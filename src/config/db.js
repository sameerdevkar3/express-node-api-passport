import mongoose from 'mongoose'

const connectDB = async (URI)=>{
    try {
        var options = {
            dbName:process.env.DB_NAME
        }
        await mongoose.connect(URI,options);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;