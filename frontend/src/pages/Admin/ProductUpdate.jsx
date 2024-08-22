import {useEffect, useState} from "react"
import { useNavigate,useParams } from "react-router-dom"

import {
     useUpdateProductMutation,
     useDeleteProductMutation,
     useGetProductByIdQuery,
     useUploadProductImageMutation
    } from "../../redux/api/productApiSlice"
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu.jsx"



const ProductUpdate = () => {

    const params= useParams();
    const {data:productData}=useGetProductByIdQuery(params._id);

    const [image,setImage]=useState(productData?.image || "")
    const [name,setName]=useState(productData?.name || "")
    const [description,setDescription]=useState(productData?.description||"");
    const [price,setPrice]=useState(productData?.price||"");
    const [category,setCategory]=useState(productData?.category._id||"");
    const [quantity,setQuantity]=useState(productData?.quantity ||"");
    const [brand,setBrand]=useState(productData?.brand||"");
    const [stock,setStock]=useState(productData?.countInStock||0);
   
    const navigate=useNavigate();

    const {data:categories=[]}=useFetchAllCategoriesQuery()
    const [uploadImageProduct]=useUploadProductImageMutation()
    const [updateProduct]=useUpdateProductMutation()
    const[deleteProduct]=useDeleteProductMutation()

    useEffect(()=>{
        if(productData&&productData._id){
            setName(productData.name)
            setDescription(productData.description)
            setPrice(productData.price)
            setCategory(productData.category?._id); 
            setQuantity(productData.quantity)
            setStock(productData.countInStock)
            setBrand(productData.brand)
            setImage(productData.image)
        }
    },[productData]);

    const uploadFileHandler=(e)=>{
      const file = e.target.files[0];
      setImage(file);
  
    }
    const handleUpdateData=async (e)=>{
      try {
        const formData= new FormData();
        
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('quantity', quantity);
        formData.append('brand', brand);
        formData.append('countInStock', stock);
        formData.append('image', image);

       const product= await updateProduct({
        productId:productData._id,
        formData}).unwrap();
       toast.success(`${product.product.name} updated successfully!`);
       navigate(`/admin/allProducts`); 
      } catch (error) {
        toast.error(`Product Updation failed. ${error?.data?.error || 'Try again.'}`);
      }
    }
    const handleDeleteData=async (e)=>{
       e.preventDefault();
      try {
           const product= await deleteProduct(productData._id).unwrap();
           toast.success(`${product.product.name} is deleted successfully`)
      } catch (error) {
        toast.error(`Product deletion failed. ${error?.data?.error || 'Try again.'}`);
      }
    }
    
  return (
    <div className="container xl:max-[10rem] sm:max-[0] mx-28">
    <div className="flex flex-col md:flex-row">
      <AdminMenu />

      <div className="md:w-3/4 p-4 text-white">
        <div className="h-12">Create Product</div>

        {image && (
          <div className="text-center">
            <img src={image} alt="product" className="block mx-auto max-h-[200px]" />
          </div>
        )}

        <div className="mb-3">
          <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
            {image ? image.name : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className={!image ? "hidden" : "text-white"}
            />
          </label>
        </div>

        <div className="p-4 mx-10">
          {/* block 1 */}
          <div className="flex flex-wrap">
            {/* Name */}
            <div className="one mr-2">
              <label htmlFor="name">Name</label> <br />
              <input
                type="text"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                placeholder="Enter product name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="two">
              <label htmlFor="name block">Price</label><br />
              <input
                type="number"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                placeholder="Enter product price"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* block 2 */}
          <div className="flex flex-wrap">
            {/* Quantity */}
            <div className="one mr-2">
              <label htmlFor="name">Quantity</label> <br />
              <input
                type="number"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                placeholder="Enter product quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>

            {/* Brand */}
            <div className="two">
              <label htmlFor="name block">Brand</label><br />
              <input
                type="text"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                placeholder="Enter product brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <label htmlFor="" className="my-5">Description</label>
          <textarea
            type="text"
            className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>

          {/* Stock */}
          <div className="flex justify-between">
            <div>
              <label htmlFor="name block">Count In Stock</label><br />
              <input
                type="number"
                value={stock}
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                onChange={e => setStock(e.target.value)}
              />
            </div>

            {/* Select category */}
            <div>
              <label htmlFor="">Category</label><br />
              <select
                placeholder="Choose Category"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                onChange={e => setCategory(e.target.value)}
              >
                {categories?.length > 0 ? (
                  categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>
          </div>

         <div className="flex flex-wrap justify-between">
         <button
            onClick={handleUpdateData}
            className="py-4 px-10 mt-5 rounded-lg border text-lg font-bold bg-green-600 hover:bg-pink-700"
          >
            Update
          </button>

          <button
            onClick={handleDeleteData}
            className="py-4 px-10 mt-5 rounded-lg border text-lg font-bold bg-pink-600 hover:bg-pink-700"
          >
            Delete
          </button>
         </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ProductUpdate