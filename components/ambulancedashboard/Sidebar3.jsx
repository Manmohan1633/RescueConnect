import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";


export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Graph");
      const { user, logout } = useAuth();

  const menus = [
    { name: "Dashboard", icon: "/admin/home.svg" },
    { name: "Discounts", icon: "/admin/discount.svg" },
    { name: "Graph", icon: "/admin/graph.svg" },
    { name: "Messages", icon: "/admin/message.svg" },
    { name: "Notifications", icon: "/admin/notification.svg" },
    { name: "Settings", icon: "/admin/settings.svg" },
    { name: "Logout", icon: "/admin/logout.svg" },
  ];

  return (
    <div className="flex flex-col gap-y-4 items-center py-8 w-16 bg-gray-900">
      

          <div className="hover:bg-gray-800 rounded-l-xl relative before:absolute before:w-4 before:h-8 before:-top-8 before:rounded-br-xl before:right-0 before:shadow-inverse-top  after:absolute after:w-4 after:h-8 after:-bottom-8 after:rounded-tr-xl after:right-0 after:shadow-inverse-bottom">
            <button onClick={logout} className="p-4 my-4  rounded-xl hover:bg-gray-800 ">
              <img src="/logo-icon.png" />{" "}
            </button>
          </div>

          <div className="hover:bg-gray-800 rounded-l-xl relative before:absolute before:w-4 before:h-8 before:-top-8 before:rounded-br-xl before:right-0 before:shadow-inverse-top  after:absolute after:w-4 after:h-8 after:-bottom-8 after:rounded-tr-xl after:right-0 after:shadow-inverse-bottom">
            <button onClick={logout} className="p-4 my-4  rounded-xl hover:bg-gray-800 ">
              <img src="https://img.icons8.com/ios-glyphs/40/ffffff/home-page--v1.png" />{" "}
            </button>
          </div>
          <div className="hover:bg-gray-800 rounded-l-xl relative before:absolute before:w-4 before:h-8 before:-top-8 before:rounded-br-xl before:right-0 before:shadow-inverse-top  after:absolute after:w-4 after:h-8 after:-bottom-8 after:rounded-tr-xl after:right-0 after:shadow-inverse-bottom">
            <button onClick={logout} className="p-4 my-4  rounded-xl hover:bg-gray-800 ">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/traffic-accident.png" />{" "}
            </button>
          </div>
          
          <div className="hover:bg-gray-800 rounded-l-xl relative before:absolute before:w-4 before:h-8 before:-top-8 before:rounded-br-xl before:right-0 before:shadow-inverse-top  after:absolute after:w-4 after:h-8 after:-bottom-8 after:rounded-tr-xl after:right-0 after:shadow-inverse-bottom">
            <button onClick={logout} className="p-4 my-4  rounded-xl hover:bg-gray-800 ">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/logout-rounded.png" />{" "}
            </button>
          </div>

    </div>
  );
}
