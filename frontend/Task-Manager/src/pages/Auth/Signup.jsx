import React, { useState } from "react";
import AuthLayout from "../../componanets/Layouts/AuthLayouts";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../componanets/Inputs/ProfilePhotoSelector";
import Input from "../../componanets/Inputs/Input";

const Signup = ()=>{
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, SetAdminInviteToken] = useState("");

    const [error, setError] = useState(null)

    //Handel signUp Form submit
    const handeleSignup = async(e) => {
        e.preventDefault();
       
        if(!fullName){
          setError("Please enter full name")
          return;
        }
        if(!validateEmail(email)){
          setError("Please enter a valid email Address")
          return;
        }
        if(!password){
          setError("Please enter the Password");
          return;
        }
    
        setError("");
        //SignUp Api Call
      }
    return(
        <>
        <AuthLayout>
          <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-black"> Create an Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below.</p>
            
            <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic} />
          

          <form onSubmit={handeleSignup}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target })=> setFullName(target.value)}
                label="Full Name"
                placeholder="John"
                type="text"
              />
              
              <Input 
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="john@gmail.com"
                type="text"
              />

              <Input 
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
              />
            </div>
          </form>
        </div>
        </AuthLayout>
        </>
    )
}
export default Signup;