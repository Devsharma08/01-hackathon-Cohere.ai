import React from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
const Hero = () => {
  return (
    <>
      <div className="w-full min-h-full">
        <div className="flex items-center hello flex-col text-white justify-center mt-12">
          <h1 className="text-[16px] font-medium leading-2 ">Cohere Ai</h1>
          <div className="flex justify-center flex-col h-full items-center mt-20">
            <h1 className="text-7xl leading-2.5 tracking-wide font-bold">
              Get answers. Find
            </h1>
            <h1 className="text-7xl leading-2.5 tracking-wide mt-[70px] font-bold">
              inspiration. Be{" "}
            </h1>
            <h1 className="text-7xl leading-2.5 tracking-wide mt-[70px] font-bold">
              more productive.
            </h1>
            <h1 className="text-[20px] leading-2.5 tracking-tight mt-[70px] font-normal">
              Free to use. Easy to try. Just ask and Cohere Ai can
            </h1>
            <h1 className="text-[20px] leading-2.5 tracking-tight mt-[20px] font-normal">
              help with writing, learning, brainstorming, and more.
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center mt-12">
          <Link
            to={"/signup"}
            className="rounded-2xl color text-white  px-4 flex items-center gap-2 justify-center font-semibold py-2  text-[16px] border-none "
          >
            Start now <MdArrowOutward className="color mt-[2px]" />
          </Link>
        </div>
        <h1 className="flex flex-wrap text-white  text-4xl font-semibold leading-12 text-center px-7 mt-24 " >"Powered by cutting-edge AI, optimized for real-time context retention and lightning-fast interactions — your own intelligent assistant, without the limitations."</h1>
        {/* marquee.. */}
        {/* after marquee section */}
        <div className="w-full flex justify-center flex-col mt-28 text-white items-center h-full">
          <h1 className="text-[25px] leading-2.5   tracking-wider font-normal">
            Writes, brainstorms, edits, and explores ideas with you
          </h1>
          <Link to={'/login'} className="text-[15px] leading-2.5 flex hover:text-[#333333]  transition-all duration-500justify-center items-center mt-7 tracking-wider font-semibold">
          Learn more about writing with Cohere Ai <MdKeyboardArrowRight className="mt-[1px]" />
          </Link>
        </div>
        {/* images section */}
        <div className="w-full h-full mt-24 flex justify-center items-center " >
<img src="https://images.ctfassets.net/kftzwdyauwt9/5d0o0XSRBbAh7FFEvGySVy/50bee64b3832ae7fc04d7fe8fc3a296c/Brainstorm.jpg?w=1920&q=90&fm=webp" alt="images" className="mt-8 w-[70vw] rounded-2xl h-[80vh] " />
        </div>
        <h1 className="text-[25px] leading-2.5 mt-24 text-white text-center tracking-wider font-normal">
        Summarize meetings. Find new insights.
          </h1>
          <h1 className="text-[25px] leading-2.5 mt-8 text-white text-center tracking-wider font-normal">
          Increase productivity.
          </h1>
          <div className="w-full h-full flex justify-center mt-24 items-center " >
<img src="https://images.ctfassets.net/kftzwdyauwt9/2TGxQkhDFLiCHyxUZZKzC/5c0aa7b1c3424a6c3f1ab291c3e7b8f7/Summarize.jpg?w=1920&q=90&fm=webp" alt="images" className="mt-8 w-[70vw] rounded-2xl h-[80vh] " />
        </div>
        <h1 className="text-[25px] leading-2.5 mt-24 text-white text-center tracking-wider font-normal">
        Generate and debug code. Automate repetitive tasks.
          </h1>
          <h1 className="text-[25px] leading-2.5 mt-8 text-white text-center tracking-wider font-normal">
          Learn new APIs.
          </h1>
          <div className="w-full h-full flex justify-center mt-24 items-center " >
<img src="https://images.ctfassets.net/kftzwdyauwt9/01qGC80lAevPov5jhoBQ6a/ee908608f8b93a9b90ad47b01d459f83/Generate.jpg?w=1920&q=90&fm=webp" alt="images" className="mt-8 w-[70vw] rounded-2xl h-[80vh] " />
        </div>
        <h1 className="text-[25px] leading-2.5 mt-24 text-white text-center tracking-wider font-normal">
        Learn something new. Dive into a hobby. Answer
          </h1>
          <h1 className="text-[25px] leading-2.5 mt-8 text-white text-center tracking-wider font-normal">
          complex questions.
          </h1>
          <div className="w-full h-full flex justify-center mt-24 items-center " >
<img src="https://images.ctfassets.net/kftzwdyauwt9/dj3TUYzcObBHupmeNKuoT/9e801190aa325f2f1886721c752bc365/Learn.jpg?w=1920&q=90&fm=webp" alt="images" className="mt-8 w-[70vw] rounded-2xl h-[80vh] " />
        </div>
        {/* footer last above */}
        <h1 className="text-[25px] leading-2.5 mt-24 text-white text-center tracking-wider font-normal">
          Get started with cohere Ai today
          </h1>
        <div className="w-full h-full flex justify-center mt-24 items-center " >
        <div className="w-[80vw] min-h-[50vh] flex gap-2.5 items-center flex-col rounded-2xl text-white justify-center color-2" >
        <h1 className="text-5xl leading-2.5 mt-24  color-2 text-center  font-semibold">
        Join hundreds of millions of
          </h1>
          <h1 className="text-5xl leading-2.5 mt-12 color-2 text-center  font-semibold">
          users and try Cohere Ai today.
          </h1>
          <Link
            to={"/signup"}
            className="rounded-2xl color-1 text-white mt-12  px-4 flex items-center gap-2 justify-center font-semibold py-2  text-[16px] border-none "
          >
            Try Cohere Ai now <MdArrowOutward className="color-1 mt-[2px]" />
          </Link>
    </div>
        </div>   
      </div>
    </>
  );
};

export default Hero;
