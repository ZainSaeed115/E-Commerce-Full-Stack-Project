import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// add product
const addProduct=asyncHandler(async (req,res)=>{
 try {

    const {name,description,price,category,quantity,brand,image}=req.fields

    const convertedPrice=parseFloat(price);
    const convertedQuantity=parseInt(quantity);

     switch (true) {
      case !name:
             return res.json({error:"Name is required"})
      case !description:
             return res.json({error:"Description is required"});
      case !convertedPrice:
            return res.json({error:"Price is required"});
      case !category:
          return res.json({error:"Category is required"});
      case !convertedQuantity:
         return res.json({error:"Quantity is required"});    
      case !brand:
         return res.json({error:"Brand is required"});
      case !image:
            return res.json({error:"Image is required"});
     }

     const product= new Product({
      ...req.fields,
      price:convertedPrice,
      quantity:convertedQuantity
   });
     await product.save();
     return res.status(200).json({product});

 } catch (error) {
    console.error(error)
    res.status(400).json(error?.message);
 }
})

// update product

const updateProductDetails = asyncHandler(async (req, res) => {

   try {
      
      const {name,description,price,category,quantity,brand,image}=req.fields

      const convertedPrice=parseFloat(price);
      const convertedQuantity=parseInt(quantity);
  
       switch (true) {
        case !name:
               return res.json({error:"Name is required"})
        case !description:
               return res.json({error:"Description is required"});
        case !convertedPrice:
              return res.json({error:"Price is required"});
        case !category:
            return res.json({error:"Category is required"});
        case !convertedQuantity:
           return res.json({error:"Quantity is required"});    
        case !brand:
           return res.json({error:"Brand is required"});
        case !image:
              return res.json({error:"Image is required"});
       }


       const product= await Product.findByIdAndUpdate(
         req.params.productId,
         {
            $set:{
               name,
               description,
               price:convertedPrice,
               category,
               quantity:convertedQuantity,
               brand,
               image,
            }
         },
         {
            new:true
         }
       );

       if(!product){
         return res.status(404).json({error:"Product Not Found"})
       }

       return res.status(200).json({product})
  
   } catch (error) {
      console.error(error)
      res.status(400).json(error?.message);
   }
} );


// delete product

const deleteProduct= asyncHandler(async (req,res)=>{
   try {
      
      const product= await Product.findByIdAndDelete(req.params.productId);
      
      if(!product){
        return  res.status(404).json({error:"Product Not Found"})
      }

       return  res.status(200).json({error:"Product deleted Successfully"})
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
      res.status(400).json(error?.message);
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