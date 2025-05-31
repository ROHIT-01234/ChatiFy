import express from "express";
import { checkAuth, login, logout, signup, update } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router  = express.Router()

// clean code ke liye body controller folder me hai
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)

router.put('/update', protectRoute ,update) // protectRoute(ek authentication middleware hai) -> ensure karega ki user logged in mtlb authenticted hai ki nahi 

router.get("/check", protectRoute,checkAuth); // checks if user is authenticated or not

export default router;