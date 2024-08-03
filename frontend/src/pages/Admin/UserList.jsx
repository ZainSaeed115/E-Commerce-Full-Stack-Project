import { useEffect ,useState} from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useGetUsersQuery,useDeleteUserMutation,useUpdateUserMutation} from '../../redux/api/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message.jsx';
import {toast} from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser]=useDeleteUserMutation();
  const[updateUser]=useUpdateUserMutation();
  
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);
  

  // delete user by Id

  const deleteHandler=async (userId)=>{
    if(window.confirm('Are you sure?')){
      try {
        await deleteUser(userId)
      } catch (error) {
        toast.error(error?.data.message || error.message)
      }
    }
  }

  //
  const toggleEdit=async (id,name,email)=>{
     setEditableUserId(id)
     setEditableUserName(name)
     setEditableUserEmail(email)
  }

  const updateHandler=async(id)=>{
     try {
       await updateUser(
       {
        userId:id,
        userName:editableUserName,
        userEmail:editableUserEmail,
       },
      
       )
       setEditableUserId(null);
       refetch();
     } catch (error) {
      toast.error(error?.data.message || error.message)
     }
  }
  return (
    <div className="p-4">
      <h1 className="text-7xl font-semibold mb-4 text-white">User</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-white text-left">ID</th>
                <th className="px-4 py-2 text-white text-left">NAME</th>
                <th className="px-4 py-2 text-white text-left">EMAIL</th>
                <th className="px-4 py-2 text-white text-left">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-white">{user._id}</td>
                  <td className="px-4 py-2 text-white">{
                    editableUserId===user._id?(
                      <div className='flex items-center'>
                        <input type="text" 
                        value={editableUserName}
                         onChange={e=>  setEditableUserName(e.target.value)}
                         className='w-full p-2 border rounded-lg  bg-gray-600'
                        />
                        <button 
                        className='ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg'
                        onClick={()=>updateHandler(user._id)}>
                          <FaCheck/>
                        </button>
                      </div>
                    ):(
                      <div className='flex items-center'>
                        {user.userName} {" "}
                        <button onClick={()=>toggleEdit(user._id,user.userName,user.email)}>
                          <FaEdit className='ml-[1rem]'/>
                        </button>
                      </div>
                    )
                  }</td>


                  <td className="px-4 py-2 text-white">{
                    editableUserId===user._id? (
                      <div className='flex items-center'>
                       <input
                        type="text"
                        value={editableUserEmail}
                        onChange={e=>setEditableUserEmail(e.target.value)}
                        className='w-full p-2 border rounded-lg bg-gray-700'
                        
                       />
                       <button    
                       onClick={()=>updateHandler(user._id)}
                       className='ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg'
                       >
                        <FaCheck/>
                       </button>
                      </div>
                    ):(
                      <div className='flex items-center'>
                         <p>
                          {user.email}
                         </p>
                         <button onClick={()=>toggleEdit(user._id,user.userName,user.email)}>
                          <FaEdit className='ml-[1rem]'/>
                        </button>
                      </div>
                    )
                  }</td>


                  <td className="px-4 py-2 text-white">{
                  user.isAdmin ? 
                  (<FaCheck style={{color:"green"}}/>):(<FaTimes style={{color:"red"}}/>)
                  }</td>

                 <td className='px-4 py-2'>
                  {
                    !user.isAdmin&&(
                      <div className='flex'>
                      <button onClick={()=>deleteHandler(user._id)}
                      className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                      >
                       <FaTrash/>
                      </button>
                      </div>
                    )
                  }
                 </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
