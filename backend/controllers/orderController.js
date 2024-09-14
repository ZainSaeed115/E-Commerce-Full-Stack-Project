import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

//utility function

function calcPrices(orderItems){
    const itemsPrice=orderItems.reduce((acc,item)=>acc+item.price*item.qty,0)

    const shippingPrice=itemsPrice>100? 0:10;
    const taxRate=0.15;
    const taxPrice=(itemsPrice*taxRate).toFixed(2);
    const totalPrice=(itemsPrice+shippingPrice+parseFloat(taxPrice)).toFixed(2)

    return {
      itemsPrice:itemsPrice.toFixed(2),
      shippingPrice:shippingPrice.toFixed(2),
      taxPrice,
      totalPrice
    }
}

// createOrder
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    // Fetch products from the DB based on orderItems IDs
    const itemsFromDb = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Map the orderItems from client to itemsFromDb and check if they exist
    const dbOrderItems = orderItems.map((itemsFromClient) => {
      const matchingItemFromDb = itemsFromDb.find(
        (itemFromDb) => itemFromDb._id.toString() === itemsFromClient._id
      );

      if (!matchingItemFromDb) {
        throw new Error(`Product Not Found: ${itemsFromClient._id}`);
      }

      return {
        ...itemsFromClient,
        product: itemsFromClient._id,
        price: matchingItemFromDb.price,
        _id: undefined, // Removing _id to avoid conflicts
      };
    });

    // Calculate prices
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(dbOrderItems);

    // Create new order in the database
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});



// get all Orders details

const getAllOrders=asyncHandler(async(req,res)=>{
  try {
       const order= await Order.find({}).populate('user',"id userName");
       if(!order){
        throw new Error("Order Not Found");
       }

       return res.status(200).json(order);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
})

// get sepecific user order detail

const getUserOrders=asyncHandler(async (req,res)=>{
  try {
    const order=await Order.find({user:req.user._id});
    return res.json(order)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
})


// count Total Number of orders
const countTotalOrders=asyncHandler(async (req,res)=>{
 try {
   const NumberOfOrders= await Order.countDocuments({});
   return res.json({NumberOfOrders});
 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
 }
});

// calculate total sales
const calculateTotalSales=asyncHandler(async (req,res)=>{
 try {
   const order= await Order.find({});
   const totalSales=order.reduce((acc,item)=>acc+item.totalPrice,0)
   return res.json({toatSales:totalSales});
 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
 }
});

// calculate total sales by date

const calculateTotalSalesByDate=asyncHandler(async(req,res)=>{
   try {
      const salesByDate=await Order.aggregate([
        {
          $match:{
            isPaid:true,
          }
        },
        {
          $group:{
            _id:{
              $dateToString:{format:"%Y-%m-%d",date:"$paidAt"}
            },
            totalSales:{$sum:"$totalPrice"}
          }
        }
      ]);

      return res.json({salesByDate});
   } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
   }
});


const findOrderById=asyncHandler(async (req,res)=>{
 try {
   const order= await Order.findById( req.params._id).populate("user","userName email");
   if(!order){
    throw new Error("Order Not Found");
   }
   return res.json({order});
 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
 }
  
})


// if user has paid his amount then status will be updated as paid
const markOrderAsPaid=asyncHandler(async (req,res)=>{
 try {
  
  const order= await Order.findById(req.params._id);

  if(order){
    order.isPaid=true;
    order.paidAt=Date.now();
    order.paymentResult={
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email_address:req.body.payer.email_address,

    }

    const updateOrder= await order.save();
    return res.status(200).json(updateOrder)
  }
  else{
    return res.status(404)
    throw new Error("Order Not Found")
  }
 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
 }
});

const markAsDelivered=asyncHandler(async (req,res)=>{
  try {
    const order= await Order.findById(req.params._id);
    
    if(order){
      order.isDelivered=true,
      order.deliveredAt=Date.now()
      const updateOrder= await order.save();
      return res.status(200).json(updateOrder)
    }
    else{
      return res.status(404)
      throw new Error("Order Not Found")
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markAsDelivered,
}