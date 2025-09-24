import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext"; // Ensure this path is correct
import clsx from "clsx"; // A utility for conditionally joining class names. Install with: npm install clsx

// --- A Reusable Nav Item Component ---
// This component contains the logic for displaying a single link and its active state.
const NavItem = ({ href, icon, alt, isActive }) => {
  // The complex "scoop" effect styling is now in one place.
  const activeClasses = "bg-gray-800 before:shadow-inverse-top after:shadow-inverse-bottom";

  return (
    <div
      className={clsx(
        "relative rounded-l-xl transition-colors hover:bg-gray-800/50",
        // These classes create the "scoop" effect. You need the custom CSS below for them to work.
        "before:absolute before:right-0 before:-top-8 before:h-8 before:w-4 before:rounded-br-xl",
        "after:absolute after:right-0 after:-bottom-8 after:h-8 after:w-4 after:rounded-tr-xl",
        { [activeClasses]: isActive } // Apply active styles only if isActive is true
      )}
    >
      <Link href={href} className="block p-4 my-4 ml-3 mr-4 rounded-xl" title={alt}>
        <img src={icon} alt={alt} className="h-8 w-8" />
      </Link>
    </div>
  );
};

// --- THIS IS THE MAIN FIX ---
// The Sidebar now accepts a `menuItems` prop. It no longer has its own hardcoded links.
export default function Sidebar({ menuItems = [] }) {
  const { logout } = useAuth();
  const router = useRouter(); // Get the current path to determine the active link

  const logoutItem = {
    name: "Logout",
    action: logout,
    icon: "https://img.icons8.com/ios-filled/50/ffffff/logout-rounded.png",
  };

  return (
    <div className="flex h-screen w-24 flex-col items-center justify-between bg-gray-900 py-8">
      
      {/* Logo */}
      <Link href="/" className="p-2">
        <img src="/logo-icon.png" alt="Logo" className="w-full rounded-lg" />
      </Link>
      
      {/* Navigation Links are now built from the 'menuItems' prop passed by the parent page */}
      <nav className="flex flex-col gap-y-4">
        {menuItems.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              alt={item.name}
              isActive={router.pathname === item.href} // Automatically highlight the active link
            />
        ))}
      </nav>
      
      {/* Logout Button is separate to ensure it's always at the bottom */}
      <div className="hover:bg-gray-800/50 rounded-l-xl">
         <button onClick={logoutItem.action} className="p-4 my-4 ml-3 mr-4 rounded-xl" title={logoutItem.name}>
            <img src={logoutItem.icon} alt={logoutItem.name} className="h-8 w-8"/>
         </button>
      </div>
    </div>
  );
}