import express from "express";
import "dotenv/config"
import db from "./dbConnection/db"

import userRoutes from "./routes/userRoutes"
import groupRoutes from "./routes/groupRoutes"
import { hashPassword } from "./utils/bcrypt";

const port = process.env.PORT
const app = express()


app.use(express.json())


app.use("/api/v1", userRoutes)
app.use("/api/v1", groupRoutes)


async function startServer():Promise<void> {
    try {
        await db.query('SELECT 1 + 1 AS solution')
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
        
    } catch (error) {
        console.log("Error connecting to the MYSQL: ", error)
        process.exit(1)
    }
}

startServer()