import React from "react";
import {Form, Link, redirect} from 'react-router-dom'
import customFetch from '../utils/customFetch'
export const action =async ({request}) =>{
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
try {
  await customFetch.post('/register',data)
  return redirect('/login')
} catch (error) {
  console.log(error);
  throw new Error('Invalid credentials')
}
}
const SignUp = () => {
  return (
    <>
      <div className="w-full h-full color-4">
        <div className="grid grid-cols-2">
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
                Username
              </h1>
              <input
                type="text"
                name="username"
                placeholder="Please enter your name...."
                id="username"
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
                Already have a account? <Link to={'/login'} className="text-[#696767]" >Login..</Link>
              </h1>
              <button
                type="submit"
                className="text-2xl px-2 py-2 bg-black text-white mt-7 cursor-pointer "
              >
                Sign up
              </button>
            </Form>
          </div>
          <div className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1549241520-425e3dfc01cb?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="abstract"
              className="w-[50vw] h-[100vh]"
            />
          </div>
          {/* 2 */}
        </div>
      </div>
    </>
  );
};

export default SignUp;
