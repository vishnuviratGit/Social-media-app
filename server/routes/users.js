import express from "express"
import { verifyToken } from "../middlewares/auth.js"
import { addRemoveFriend, getUser, getUserFriends } from "../controllers/users.js";

const router = express.Router()

/*Read*/
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/*update*/
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router
