import { RequestHandler } from "express"
import db from "../dbConnection/db"
import { hashPassword } from "../utils/bcrypt"

const registerUser:RequestHandler = async(req, res) => {
    try {

        const {fullName, userName, email, password} = req.body

        const hasdPassword = await hashPassword(password)

        await db.query(`insert into users (full_name, user_name, email, password) values(?,?,?,?)`, [fullName, userName, email, hasdPassword])

        res.status(201).json({sucess: true, message: "Register Successfully"})

        
    } catch (error) {
        console.error(error)
        res.status(500).json({sucess:false, message: "Internal Server Failure"})
        return
    }
}

export {registerUser}