import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
  useFetchAllCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Model from "../../components/Model.jsx"
import AdminMenu from "./AdminMenu.jsx";

const CategoryList = () => {
  const { data: categories } = useFetchAllCategoriesQuery();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName,setUpdatingName]=useState("")
  const [modelVisible, setModelVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryByIdMutation();
  const [deleteCategory] = useDeleteCategoryByIdMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
        toast.error("Category name is required");
        return;
    }

    try {
        const result = await createCategory({ name }).unwrap();
        setName("");
        toast.success(`${result.name} is created`);
    } catch (error) {
        console.error(error);
        toast.error(error?.data?.error || "Creating category failed, try again.");
    }
};


const handleUpdateCategory=async (e)=>{
 e.preventDefault()
 if(!updatingName){
  toast.error("Category name is required");
  return;
 }

 try {
   const result= await updateCategory({categoryId:selectedCategory._id,updatedCategory:{
    name:updatingName
   }}).unwrap();
   if (result.error) {
    toast.error(result.error);
  } else {
    toast.success(`${result.name} is updated`);
    setSelectedCategory(null);
    setUpdatingName("");
    setModelVisible(false);}
 } catch (error) {
  console.error(error);
  toast.error(error?.data?.error || "Updating category failed, try again.");
 }
}


const handleDeleteCategory=async (e)=>{
 e.preventDefault();
 try {
   const result= await deleteCategory(selectedCategory._id).unwrap();

   if(result.error){
    toast.error(result.error);
   }
   else{
    toast.success(`${result.name} is deleted`)
    setSelectedCategory(null)
    setModelVisible(false)
   }
 } catch (error) {
  console.error(error);
  toast.error(error?.data?.error || "Deleting category failed, try again.");
 }
}

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
     <AdminMenu/>
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-white">Manage Categories</div>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id} className="">
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg
                                 m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500
                                 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModelVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }
                }}
              >{category.name}</button>
            </div>
          ))}
        </div>
        <Model isOpen={modelVisible} onClose={()=>setModelVisible(false)}>
          <CategoryForm 
          value={updatingName} 
          setValue={(value)=>setUpdatingName(value)}
          handleSubmit={handleUpdateCategory}
          buttonText="Update"
          handleDelete={handleDeleteCategory}
          />
        </Model>
      </div>
    </div>
  );
};

export default CategoryList;
