import express from "express";
import { 
    createUser,
    userLogin,
    userLoggedOut,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
} from "../controllers/userController.js";
import {verifyJwt ,authorized} from "../middlewares/authMiddleware.js"
const router=express.Router();

router.route('/register').post(createUser).get(verifyJwt,authorized,getAllUsers)
router.route('/login').post(userLogin)
router.route('/logOut').post(verifyJwt,userLoggedOut)
router.route('/profile').get(verifyJwt ,getCurrentUserProfile)
router.route('/update').put(verifyJwt,updateCurrentUserProfile)

// admin routes
router.route('/:id').delete(verifyJwt,authorized,deleteUserById)
.get(verifyJwt,authorized,getUserById)
.put(verifyJwt,authorized,updateUserById)
router.route('/').get(verifyJwt,authorized,getAllUsers)

export default router;