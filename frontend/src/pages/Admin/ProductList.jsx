import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice.js";
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";
import Loader from "../../components/Loader.jsx"

const ProductList = () => {
  const [image, setImage] = useState(null); // Keep the image as File object
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchAllCategoriesQuery();

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmitData = async () => {
    if (!name || !description || !price || !category || !quantity || !brand || !image) {
      toast.error("Please fill in all fields and select an image.");
      return;
    }
 
  
    setLoading(true);
    try {

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('quantity', quantity);
      formData.append('brand', brand);
      formData.append('countInStock', stock);
      formData.append('image', image); // Image file
     
      const product = await createProduct(formData).unwrap();
      toast.success(`${product.name} created successfully!`);
      navigate(`/admin/allProducts`);
    } catch (error) {
      toast.error(`Product creation failed. ${error?.data?.error || 'Try again.'}`);
    }finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container xl:max-[10rem] sm:max-[0] mx-28">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />

        <div className="md:w-3/4 p-4 text-white">
          <div className="h-12">Create Product</div>

         {
          loading?
          (
            <div className="flex justify-center fixed inset-0 items-center mb-5">
            <Loader />
          </div>
          ):
          ( <>
          {imageUrl && (
            <div className="text-center">
              <img src={imageUrl} alt="product" className="block mx-auto max-h-[200px]" />
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
              className="p-2 mb-3 bg-[#101011] border rounded-lg  w-[96.1%] text-white"
              value={description}
              onChange={e => setDescription(e.target.value)}
            ></textarea>

            {/* Stock */}
            <div className="flex flex-wrap">
              <div className="one mr-2">
                <label htmlFor="name block">Count In Stock</label><br />
                <input
                  type="number"
                  value={stock}
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  onChange={e => setStock(e.target.value)}
                />
              </div>

              {/* Select category */}
              <div className="two">
                <label htmlFor="">Category</label><br />
                <select
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
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

            <button
              onClick={handleSubmitData}
              className="py-4 px-10 mt-5 rounded-lg border text-lg font-bold bg-pink-600 hover:bg-pink-700"
            >
              {loading? "Creating":"Submit"}
            </button>
          </div>
          </>)
         }
         
        </div>
      </div>
    </div>
  );
};

export default ProductList;
