import React from "react";
import { TbLayoutSidebar } from "react-icons/tb";
import { RiChatNewLine } from "react-icons/ri";
import { useChatContext } from "../Store/context";

const Sidebar = () => {
  const { toggleSidebar, showSidebar } = useChatContext();

  return (
    <div
      className={`fixed top-0 left-0 h-[100vh] bg-[#171717] transition-transform duration-500 ease-in-out ${
        showSidebar ? "translate-x-0 w-[22vw]" : "-translate-x-full w-[22vw]"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mt-4 px-4 text-white">
          <div onClick={toggleSidebar} className="cursor-pointer text-[22px]">
            <TbLayoutSidebar />
          </div>
          <div className="cursor-pointer text-[22px]">
            <RiChatNewLine />
          </div>
        </div>
        <div className="mt-5 flex justify-center items-center px-2">
          <input
            type="text"
            name="search"
            id="search"
            className="px-4 py-2 rounded-2xl bg-[#333333] border outline-none border-[#333333] text-white w-[18vw]"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
