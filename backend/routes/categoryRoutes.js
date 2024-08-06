import express from "express"
import {authorized,verifyJwt} from "../middlewares/authMiddleware.js"
import 
{
    createCategory,
    updateCategory,
    deleteCategory,
    listCategory,
    readCategoryById
} 
    from "../controllers/categoryController.js"

const router=express.Router()

router.route('/create').post(verifyJwt,authorized,createCategory)
router.route('/:categoryId').put(verifyJwt,authorized,updateCategory)
router.route('/:categoryId').delete(verifyJwt,authorized,deleteCategory);
router.route('/categories').get(listCategory);
router.route('/:categoryId').get(readCategoryById);
export default router




