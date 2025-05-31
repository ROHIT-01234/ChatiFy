import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsers, sendMessages } from "../controllers/message.controller.js";

const router = express.Router();

// protectRoute -> next method me jump hone se pehle authenticate karenge user ko
router.get("/users",protectRoute, getUsers); // get users that will be shown in the sidebar except the authenticated user itself
router.get("/:id",protectRoute, getMessages); // fetch the messages

router.post("/send/:id", protectRoute, sendMessages); // method to send messages

export default router;