import React, { useEffect, useState } from "react";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import customFetch from '../utils/customFetch' 
export const action = async({request}) =>{
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
   const res= await customFetch.post("/login",data)
    return redirect(`/chat/${res.data.userr}`)
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed. Please check your credentials.");
    
  }
}
const Login = () => {
  const navigate = useNavigate();

  // 👇 Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await customFetch.get('/check'); // backend checks JWT from cookie
        if (res?.data?.isLoggedIn) {
          navigate(`/chat/${res.data.user.id}`); // redirect if already logged in
        }
      } catch (err) {
         return navigate('/login')
        // console.log("No valid session:", err.message);
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <>
      <div className="w-full h-full color-4">
        <div className="grid grid-cols-2">
          <div className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="abstract"
              className="w-[50vw] h-[100vh]"
            />
          </div>
          {/* 2 */}
          <div className="flex items-center justify-center px-4 ">
            <Form method="post" className="w-[40vw] h-[60vh]  flex flex-col justify-center px-4  rounded-2xl">
              <h1 className="text-2xl font-medium leading-4 ">Email</h1>
              <input
                type="email"
                name="email"
                
                placeholder="Please enter your email...."
                id="email"
                className=" bg-[#dddddd] px-2 py-2 mt-5 text-[#696767] "
              />
              <h1 className="text-2xl font-medium leading-4  mt-7 ">
                Password
              </h1>
              <input
                type="password"
                name="password"
            
                placeholder="Please enter your password...."
                id="password"
                className=" bg-[#dddddd] px-2 py-2 mt-5 text-[#696767] "
              />
              <h1 className="text-[15px] font-medium leading-4  mt-7 ">
                              Don't have a account? <Link to={'/signup'} className="text-[#696767]" >Signup..</Link>
                            </h1>
              <button
                type="submit" 
                className="text-2xl px-2 py-2 bg-black text-white mt-7 cursor-pointer "
              >
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
