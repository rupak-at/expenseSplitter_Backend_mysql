import { Router } from "express";
import { makeGroup } from "../controllers/groupControllers";
import { verifyLogin } from "../middleware/veriflylogin";

const route:Router = Router()

route.use(verifyLogin)
route.post("/group", makeGroup)

export default route