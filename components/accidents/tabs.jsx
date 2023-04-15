import React from "react";

export default function Tabs() {
    return(
        
<ul class="flex w-full flex-wrap text-sm mt-0 mx-1 py-2 font-medium  bg-gray-100 text-gray-500 dark:text-gray-400 w-100 justify-between rounded-lg">
    <li >
        <a href="#" class="inline-block px-6 py-2 text-white bg-red-600 rounded-lg active m-0 ml-2" aria-current="page">All</a>
    </li>
    <li >
        <a href="#"  class="inline-block px-6 py-2 rounded-lg hover:text-white hover:bg-red-600">New</a>
    </li>
    <li >
    <a href="#"  class="inline-block px-6 py-2 rounded-lg hover:text-white hover:bg-red-600">Pending</a>
    </li>
    <li >
    <a href="#"  class="inline-block px-6 py-2 rounded-lg hover:text-white hover:bg-red-600 mr-2">Completed</a>
    </li>
   
</ul>

    )
}