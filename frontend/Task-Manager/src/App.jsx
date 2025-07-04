import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTask from "./pages/Admin/ManageTask";
import CreatTask from "./pages/Admin/CreatTask";
import ManageUser from "./pages/Admin/ManageUser";

import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import PrivateRoute from "./routes/PrivatRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTask />} />
            <Route path="/admin/create-tasks" element={<CreatTask />} />
            <Route path="/admin/users" element={<ManageUser />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Default route */}
          <Route path="/" element={<Root/>}/>
        </Routes>
      </BrowserRouter>
    </div>

    <Toaster 
      toastOptions={{
        className:"",
        style:{fontSize: "13px"},
      }}
    />
    </UserProvider>
  );
};

export default App;

const Root =()=>{
  const {user , loading}= useContext(UserContext);
  if(loading) return<Outlet/>

  if(!user){
    return<Navigate to="login" />;
  }

  return user.role === "admin"? <Navigate to="/admin/dashboard"/>:<Navigate to="/user/dashboard"/>;
};