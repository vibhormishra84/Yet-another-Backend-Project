import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path:'./env'
})
connectDB()
.then(
    app.listend(process.env.PORT||8080,()=>{
        console.log(`Server is running on port ${process.env.PORT||8080}`);
    })
)
.catch((error)=>{console.log("DB Connection Failed",error)});
// ;(async()=>{
//     try{
//         await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
//     }
//     catch(error){
//         console.error(error)
//     }
// })()