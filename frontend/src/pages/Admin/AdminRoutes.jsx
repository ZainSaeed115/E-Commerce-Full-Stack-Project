import { useSelector } from "react-redux"
import { Navigate,Outlet } from "react-router-dom"
const AdminRoutes = () => {
    const {userInfo}=useSelector(state=>state.auth)
    
    return userInfo && userInfo.user.isAdmin? (<Outlet/>):(<Navigate to="/login" replace/>)
}

export default AdminRoutes