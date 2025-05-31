import React, { useState } from "react";
import AuthLayout from "../../componanets/Layouts/AuthLayouts";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigation = useNavigate();

    // Handle Login from submit
    const handelLogin = async(e)=>{
        e.preventDefault();
    }

    return(
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">please enter your details to log in</p>
            </div>
        </AuthLayout>
        
    )
}
export default Login;