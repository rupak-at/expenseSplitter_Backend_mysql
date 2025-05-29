import { Router } from "express";
import { registerUser } from "../controllers/userControllers";

const route: Router = Router()

route.post("/user", registerUser)

export default route