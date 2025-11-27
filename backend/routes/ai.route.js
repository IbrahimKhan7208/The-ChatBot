import { textInputController } from "../controllers/ai.controller.js";
import express from "express"
const router = express.Router()

router.post('/ai', textInputController)

export default router