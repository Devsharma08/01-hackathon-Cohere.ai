import React from "react";
import { TbLayoutSidebar } from "react-icons/tb";
import { RiChatNewLine } from "react-icons/ri";
import { useChatContext } from "../Store/context";
import { NavLink, useLoaderData, useParams } from "react-router";
import customFetch from "../utils/customFetch";
export const loader = async ({params})=>{
  try {
    const { userr } = params;
    const { data } = await customFetch.get(`/chat/history/${userr}`);
    console.log(data);
    return data
  } catch (error) {
    console.log(error);
    throw new Error('Check you code....')
  }
} 
const Sidebar = ({id}) => {
  const { toggleSidebar, showSidebar } = useChatContext();
const data = useLoaderData()
console.log(data);
const {userr} = useParams()
console.log(userr);
  return (
    <div
      className={`fixed top-0 left-0 h-[100vh] bg-[#171717] transition-transform overflow-hidden duration-500 ease-in-out ${
        showSidebar ? "translate-x-0 w-[22vw]" : "-translate-x-full w-[22vw]"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mt-4 px-4 text-white">
          <div onClick={toggleSidebar} className="cursor-pointer text-[22px]">
            <TbLayoutSidebar />
          </div>
          {/* <div className="cursor-pointer text-[22px]">
            <RiChatNewLine />
          </div> */}
        </div>
        {/* <div className="mt-5 flex justify-center items-center px-2">
          <input
            type="text"
            name="search"
            id="search"
            className="px-4 py-2 rounded-2xl bg-[#333333] border outline-none border-[#333333] text-white w-[18vw]"
          />
        </div> */}
<div className="mt-10" >
<h1 className="leading-5 font-bold px-4 text-white text-2xl " >Chat History</h1>
<div className="mt-4 text-white"  >
  {/* <h1>Current Session</h1> */}
  <NavLink to={`/chat/history/${userr}`}  >History</NavLink  >
</div>
</div>
      </div>
    </div>
  );
};

export default Sidebar;
