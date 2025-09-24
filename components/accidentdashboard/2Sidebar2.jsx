import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext.js";
import AddDistress from "../button/AddDistress.jsx";


export default function Sidebaruser() {
  const router = useRouter();
      const { user, logout } = useAuth();

  const [open, setOpen] = React.useState(false);

  const opening = () => {
    setOpen(!open);
  };


  return (
    <div className="flex bg-gray-900 rounded-2xl flex-col items-center  gap-10 justify-items-stretch w-20 h-screen min-h-10 overflow-hidden text-gray-800  border-grey-500 p-0  ">
      <div className=" hidden sm:flex flex-col  py-0 items-center w-full mt-3 m-0 transition-all transform duration-500">
        <Link
          className="flex items-center w-full h-12 py-9 justify-center mt-2 m-0 p-0  hover:bg-gray-700  text-red-600 bg-rose-100 hover:text-gray-300 border-l-4 rounded-l-xl border-red-600"
          href="/dashboard"
        >
          <svg
            className="w-8 h-8 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {/* <span className="ml-2 text-sm font-medium">Home</span> */}
        </Link>

        <Link
          className="flex items-center w-full h-12 py-9 justify-center mt-2 m-0 p-0   hover:text-red-600 hobver:bg-rose-100 text-gray-500 hover:border-l-4 rounded-l-xl border-red-600"
          href="/list"
        >
          <svg
            className="w-7 h-7  stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={0.1}
          >
            <path d="M11,8H9V6h2V4h2V6h2V8H13v2H11ZM4,23a1,1,0,0,1-1-1V7A1,1,0,0,1,4,6H6.09A5.993,5.993,0,0,1,17.91,6H20a1,1,0,0,1,1,1V22a1,1,0,0,1-1,1Zm9-2V17H11v4ZM8,7a4,4,0,1,0,4-4A4,4,0,0,0,8,7ZM5,21H9V16a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v5h4V8H17.91A5.993,5.993,0,0,1,6.09,8H5Z" />
          </svg>
          {/* <span className="ml-2 text-sm font-medium">Home</span> */}
        </Link>

        <Link
          className="flex items-center w-full h-12 py-9 justify-center mt-2 m-0 p-0   hover:text-red-600 hobver:bg-rose-100 text-gray-500 hover:border-l-4 rounded-l-xl border-red-600"
          href="/list"
        >
          <svg
            className=" w-7 h-7  stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              d="M4 21V19.5C4 16.4624 6.46243 14 9.5 14H14.5C17.5376 14 20 16.4624 20 19.5V21M8 21V18.5M16 21V18.3333M8.5 6.5C10.514 8.22631 13.486 8.22631 15.5 6.5M16 7V4.92755L17.4657 2.78205C17.6925 2.45018 17.4548 2 17.0529 2H6.94712C6.5452 2 6.30755 2.45018 6.53427 2.78205L8 4.92755V7M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8V5.5H16V8Z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.4"
            />
          </svg>
          {/* <span className="ml-2 text-sm font-medium">Home</span> */}
        </Link>
      </div>

      <div className="d">
        <Link href="/distressForm">
          <button className="h-fit">
            <img className="w-[90%] ml-1 -mt-2" src="/emerge.png"></img>
          </button>
        </Link>
      </div>
    </div>
  );
}
