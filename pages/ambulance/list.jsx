import React from "react";
import Sidebar from "../../components/accidentdashboard/Sidebar1";
import StatsCard from "../../components/accidentdashboard/StatsCard";
import RecentAccidents from "../../components/accidentdashboard/RecentAccidents";

import Card from "../../components/accidentdashboard/Card1";

export default function list() {
        const date = Date();

  return (
    <div class="flex flex-col sm:flex-row w-full min-h-screen font-sans bg-gray-800">
      <Sidebar />
      <main class="flex flex-col flex-1 gap-6 p-4">
        <header className="h-[75%]">
          <div className="px-5">
            <h1 class="text-3xl ml-1 font-semibold leading-loose text-red-300">
              Ambulance Dashboard
            </h1>
            <div class="text-gray-200 ml-1 mb-6">{date}</div>
          </div>
          <div className="px-5">
            <StatsCard />
          </div>
          <div className="relative mt-6 h-full w-full px-20 justify-start flex m-0 p-0 shadow-md rounded-2xl">
            <Card />
          </div>
        </header>
      </main>
      <aside class="flex flex-col gap-y-6 pt-6 pr-6 w-96">
        <RecentAccidents />
      </aside>
    </div>
  );
}
