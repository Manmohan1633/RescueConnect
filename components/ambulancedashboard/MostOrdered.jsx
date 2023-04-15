import Link from 'next/link';
import React from 'react'
import Card from './Card'

export default function MostOrdered() {
  return (
    <div class="flex flex-col p-6 px-2 bg-gray-900 rounded-lg gap-y-4">
      <div class="flex px-6 justify-between items-center">
        <h2 class="text-xl font-semibold leading-loose text-white">
          Recent accidents
        </h2>
        <button class="flex gap-x-2.5 py-3 px-4 rounded-lg border border-gray-700">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.99976 13.3333C9.80976 13.3333 9.6206 13.2691 9.46643 13.1399L4.46643 8.97328C4.11309 8.67911 4.06476 8.15328 4.35976 7.79995C4.65393 7.44661 5.17893 7.39911 5.53309 7.69328L10.0089 11.4233L14.4773 7.82745C14.8356 7.53911 15.3606 7.59578 15.6489 7.95411C15.9373 8.31245 15.8806 8.83661 15.5223 9.12578L10.5223 13.1491C10.3698 13.2716 10.1848 13.3333 9.99976 13.3333"
              fill="white"
            />
          </svg>
          <span class="text-sm text-white">Today</span>
        </button>
      </div>
      <hr class="border-gray-700" />
      <div className="px-0">
        {" "}
        <Card />
          </div>
          <Link href="/ambulance/list">
      <button class="py-3.5  rounded-lg w-full border border-primary text-white text-primary text-sm font-semibold">
        View all
          </button>
          </Link>
    </div>
  );
}
