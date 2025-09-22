import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image"; // Using Next.js Image component for better performance

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Using an array for navigation items makes the code cleaner and easier to update
  const navItems = [
    { href: "/loginp", text: "Police" },
    { href: "/logina", text: "Ambulance" },
    { href: "/loginf", text: "Fire Brigade" },
    { href: "/loginn", text: "NGOs" },
  ];

  return (
    <>
      <Head>
        <title>RescueConnect - Next-Gen Emergency Response</title>
        <meta name="description" content="Building safer communities through education and preparation." />
      </Head>

      <div className="w-full">
        <header className="absolute inset-x-0 top-0 z-10 w-full">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between lg:h-20">
              
              <div className="flex-shrink-0">
                <Link href="/" title="Home" className="flex items-center rounded-full bg-white px-5 py-3 shadow-sm mt-3">
                  {/* --- THIS IS THE FIX --- */}
                  {/* The height is increased from h-12 to h-16. Adjust as needed. */}
                  <Image className="h-16 w-auto" src="/logof.png" alt="RescueConnect Logo" width={200} height={64} />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="inline-flex rounded-md p-2 text-black transition-all duration-200 hover:bg-gray-100 focus:bg-gray-100 lg:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                )}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-10">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">{item.text}</Link>
                ))}
                <div className="w-px h-5 bg-black/20"></div>
                <Link href="/login" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">Log in</Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border-2 border-black px-5 py-2.5 text-base font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white" role="button">
                  Add Accident
                </Link>
              </div>
            </div>
          </div>
          
           {/* Mobile menu panel, shows when isMenuOpen is true */}
           {isMenuOpen && (
               <div className="lg:hidden">
                   <nav className="flex flex-col space-y-4 rounded-md bg-white p-6 shadow-lg mx-4">
                       {navItems.map((item) => (
                           <Link key={item.href} href={item.href} className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">{item.text}</Link>
                       ))}
                       <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-4">
                           <Link href="/login" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">Log in</Link>
                           <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border-2 border-black px-5 py-2.5 text-base font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white" role="button">
                               Add Accident
                           </Link>
                       </div>
                   </nav>
               </div>
           )}
        </header>
        
        {/* Hero Section */}
        <section className="bg-red-50 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[800px]">
            <div className="relative flex w-full items-center justify-center lg:order-2 lg:w-7/12">
              <div className="relative px-4 pt-24 pb-16 text-center sm:px-6 md:px-24 2xl:px-32 lg:py-24 lg:text-left">
                <h1 className="text-4xl font-bold text-blue-600 sm:text-5xl xl:text-6xl">
                  RescueConnect
                </h1>
                <h2 className="mt-4 text-4xl font-bold text-black sm:text-5xl xl:text-6xl">
                  Next-Gen Emergency Response Ecosystem
                </h2>
                <p className="mt-8 text-xl text-black">
                  Building safer communities through education and preparation. Protecting what matters most - you and your loved ones.
                </p>
                <div className="mt-10">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600"
                    role="button"
                  >
                    Add accident
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative w-full overflow-hidden lg:order-1 h-96 lg:h-auto lg:w-5/12">
              <div className="absolute inset-0">
                <Image
                  className="object-cover w-full h-full"
                  src="/images/bg.png"
                  alt="Emergency response illustration"
                  fill
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}