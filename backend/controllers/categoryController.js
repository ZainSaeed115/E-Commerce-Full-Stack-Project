import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";


// create Category
const createCategory=asyncHandler(async (req,res)=>{
       try {

        const {name}=req.body;

        if (!name){
            return res.json({error:"Name is required"})
        }

        const existingCategory= await Category.findOne({name});

        if(existingCategory){
            return res.json({error:"Already exists"})
        }

        const category= await new Category({name}).save();
        return res.json(category)
        
       } catch (error) {
        console.log(error)
        return res.status(400).json(error)
       }
})

// update the category
const updateCategory=asyncHandler(async (req,res)=>{
  try {
    
     const {name}= req.body;
     const {categoryId}= req.params;


     const updatedCategory= await Category.findByIdAndUpdate(
        categoryId,
        {
            $set:{name}
        },
        {
            new:true
        }
    )
    if(!updatedCategory){
        return res.status(404).json({
            error:"Category not found"
        })
     }
    return res.json(updatedCategory)

  } catch (error) {
     console.error(error)
     res.status(500).json({
        error:"Internal server error"
     })
  }
})


// delete the category
const deleteCategory=asyncHandler(async (req,res)=>{
   try {
    const deleted = await Category.findByIdAndDelete(req.params.categoryId) 
    return res.status(200).json(deleted)
   } catch (error) {
    console.error(error)
    return res.status(500).json({
        error:"Internal Server Error"
    })
   }
})


// get specific category by id

const readCategoryById=asyncHandler(async (req,res)=>{
   try {
   
    const {categoryId}= req.params
    const readCategory= await Category.findById(categoryId);
    
    if(!readCategory){
        return res.status(404).json({
            message:"Category not found"
        })
    }

    return res.status(200).json({
        category:readCategory
    })

    
   } catch (error) {
      console.error(error);
      return res.status(400).json(error.message)
   }
})
// get all category list

const listCategory= asyncHandler(async (req,res)=>{

    try {
        
        const category=await Category.find({});
        return res.status(200).json(category)
    } catch (error) {
        console.error(error)
        return res.status(400).json({
            message:error.message
        })
    }
})



export {
    createCategory,
    updateCategory,
    deleteCategory,
    listCategory,
    readCategoryById
}