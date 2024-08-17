import express from "express";
import formidable from "express-formidable";
import {verifyJwt ,authorized, } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import uploadRoutes from "./uploadRoutes.js"
 
//controllers

import
 { 
    addProduct,
    updateProductDetails,
    deleteProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts
} from "../controllers/productController.js"



const router= express.Router();

// create and get product
router.route("/")
.post(verifyJwt,authorized,formidable(),addProduct)
.get(fetchProducts)


router.route("/allProducts").get(fetchAllProducts);
router.route("/:id/reviews").post(verifyJwt,authorized,checkId,addProductReview);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);


//update and delete product by Id

router.route("/:productId")
.get(fetchProductById)
.put(verifyJwt,authorized,formidable(),updateProductDetails)
.delete(verifyJwt,authorized,deleteProduct)

export default router;
