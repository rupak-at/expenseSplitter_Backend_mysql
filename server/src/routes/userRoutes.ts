import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userControllers";

const route: Router = Router()

route.post("/user/register", registerUser)
route.post("/user/login", loginUser)

export default route