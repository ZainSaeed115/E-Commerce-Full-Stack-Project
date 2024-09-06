import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

// add product
const addProduct = asyncHandler(async (req, res) => {
   try {
     const { name, description, price, category, quantity, brand, countInStock } = req.body;
    
     console.log("Files Object:", req.files);
     const imageLocalPath = req.files?.image[0]?.path;
     console.log("Image Local Path:", imageLocalPath);
 
     const convertedPrice = parseFloat(price);
     const convertedQuantity = parseInt(quantity);
     const convertedStock=parseInt(countInStock);
 
     switch (true) {
       case !name:
         return res.status(400).json({ error: "Name is required" });
       case !description:
         return res.status(400).json({ error: "Description is required" });
       case isNaN(convertedPrice):
         return res.status(400).json({ error: "Valid price is required" });
       case !category:
         return res.status(400).json({ error: "Category is required" });
       case isNaN(convertedQuantity):
         return res.status(400).json({ error: "Valid quantity is required" });
       case !brand:
         return res.status(400).json({ error: "Brand is required" });
       case !countInStock:
         return res.status(400).json({error:"countInStock is required"});
     
     }
 
     const imageUrl = await uploadFileOnCloudinary(imageLocalPath);
     console.log(imageUrl)
     if (!imageUrl) {
       return res.status(404).json({ error: "Image upload failed" });
     }
 
     const product = new Product({
       ...req.body,
       image: imageUrl.url,
       price: convertedPrice,
       quantity: convertedQuantity,
       countInStock:convertedStock,
     });
 
     await product.save();
     return res.status(200).json(product);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: error?.message });
   }
 });
 

// update product

const updateProductDetails = asyncHandler(async (req, res) => {
   try {
     const { name, description, price, category, quantity, brand, countInStock } = req.body;
     const imageLocalPath = req.files?.image?.[0]?.path;
 
     if (!Object.keys(req.body).length && !imageLocalPath) {
       return res.status(400).json({ error: "At least one field is required to update" });
     }
 
     const updateData = {};
 
     if (name) updateData.name = name;
     if (description) updateData.description = description;
     if (price) updateData.price = parseFloat(price);
     if (category) updateData.category = category;
     if (quantity) updateData.quantity = parseInt(quantity);
     if (brand) updateData.brand = brand;
     if(countInStock) updateData.countInStock=countInStock;
     
     if (imageLocalPath) {
       const imageUrl = await uploadFileOnCloudinary(imageLocalPath);
       if (!imageUrl) {
         return res.status(404).json({ error: "Image update failed" });
       }
       updateData.image = imageUrl.url;
     }
 
     const product = await Product.findByIdAndUpdate(
       req.params.productId,
       { $set: updateData },
       { new: true }
     );
 
     if (!product) {
       return res.status(404).json({ error: "Product Not Found" });
     }
 
     return res.status(200).json({ product });
   } catch (error) {
     console.error(error);
     res.status(400).json({ error: error?.message });
   }
 });
 

// delete product

const deleteProduct= asyncHandler(async (req,res)=>{
   try {
      
      const product= await Product.findByIdAndDelete(req.params.productId);
      
      if(!product){
        return  res.status(404).json({error:"Product Not Found"})
      }

       return  res.status(200).json({
         error:"Product deleted Successfully",
         product
       })
   } catch (error) {
      console.error(error)
      res.status(400).json(error?.message);
   }
});


// get all product

const fetchProducts= asyncHandler(async (req,res)=>{
 try {
   
     const pageSize=6;
     const keyword =req.query.keyword?{name:{$regex:req.query.keyword, $options:"i"}}:{}

     const count= await Product.countDocuments({...keyword})
     const products= await Product.find({...keyword}).limit(pageSize)

     res.json(
      {
         products,
         page:1,
         pages:Math.ceil(count/pageSize),
         hasMore:false
      },
      

   )

 } catch (error) {
   console.error(error)
   res.status(400).json(error?.message);
 }
});

// fetch product by id

const fetchProductById= asyncHandler(async (req,res)=>{
   try {
      
      const product= await Product.findById(req.params.productId);
      if(!product){
         return res.status(404).json({message:"Product not found"})
      }
      return res.status(200).json(product);
   } catch (error) {
      console.error(error)
      res.status(400).json(error?.message);
   }
})

// fetch all products

const fetchAllProducts=asyncHandler(async (req,res)=>{

  try {
    const product= await Product.find({}).populate("category").limit(12).sort({createdAt:-1})
 
    if(product){
      return  res.status(200).json(product)
    }
 
   return res.status(404).json({error:"No Product Found"})
  } catch (error) {
   console.error(error)
   res.status(400).json(error?.message);
  }
});


// add product review

const addProductReview =asyncHandler(async (req,res)=>{
  
   try {

      const {rating,comment}=req.body;
      const product = await Product.findById(req.params.id);

      if(product){
         const alreadyReviewed=product.reviews.find(
            r=>r.user.toString()===req.user._id.toString()
         );

         if(alreadyReviewed){
            return res.status(400).json({message:"Product Already Reviewed"});
         }


         const review={
            name:req.user.userName,
            rating:Number(rating),
            comment,
            user:req.user._id
         }

         product.reviews.push(review);
         product.numReviews=product.reviews.length;

         product.rating=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length;

         await product.save();
         return res.status(201).json({message:"Review added"})


      }
      else{
         return res.status(400).json({error:"Product Not Found"})

      }
      
   } catch (error) {
      console.error(error)
      return res.status(400).json(error?.message);
   }
});

const fetchTopProducts= asyncHandler(async (req,res)=>{
   try {

      const products = await Product.find({}).sort({rating:-1}).limit(4);
      return res.status(200).json(products);
      
   } catch (error) {
      console.error(error)
      res.status(400).json(error?.message);
   }
});


const fetchNewProducts= asyncHandler(async (req,res)=>{
   try {
      
      const products= await Product.find({}).sort({_id:-1}).limit(5);
      return res.status(200).json(products);
   } catch (error) {
      console.error(error)
      res.status(400).json(error?.message);
   }
})



export {
    addProduct,
    updateProductDetails,
    deleteProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
};