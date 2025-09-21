import React from "react";
import mapboxgl from 'mapbox-gl';
import Link from "next/link";
import { format } from 'date-fns';

export default function AccidentsDetails({ title, loc, time, status ,imgurl}) {

//     const ACCESS_TOKEN = 'pk.eyJ1IjoiYWxhcGFub3NraSIsImEiOiJjbGVxMjhjbmowaTZpNDVvNWQ4NTBsc2JtIn0.LFIPoIEmYQJv5bfRPueMQQ';
// const geocoder = new MapboxGeocoder({
//     accessToken: ACCESS_TOKEN
// });



// // Reverse geocode a set of coordinates
// geocoder.reverseGeocode({
//     query: [-122.42, 37.78]
// }).then(function(result) {
//     // Extract the location information from the response
//     const location = result.features[0].place_name;
//     console.log(location);
//     // Output: 1550 Bryant St, San Francisco, California 94103, United States
// });


    const localTime = time ? format(new Date(time.seconds ? time.seconds * 1000 : time), 'p') : '';

    return (
      <Link href={imgurl ? imgurl : ""}>
        <button className="w-full px-3 py-2  ">
          <div className="border-l-8 py-2 px-2 hover:bg-slate-100 bg-slate-50 rounded-2xl border-grey-500 border-teal-200 border-2 m-0 p-0">
            <div className="  flex w-full   mt-2  mr-2 items-center   justify-center py-1 border-grey-500">
              <img src={imgurl} className="h-16 w-16 rounded-full"></img>
              <div className="flex flex-col px-3 gap-2 justify-start items-start  h-full w-full ">
                <h3 className="font-sans bg-green-500 rounded-lg px-2 py-1 text-xs  text-white font-normal tracking-wide ">
                  {status ? status : "NEW"}
                </h3>
                <h2 className="font-sans  text-slate-800 text-5lg content-start font-bold tracking-wide  pb-1 ">
                  {title ? title : "Accident"}
                </h2>
              </div>

              <div className="flex flex-col items-start w-full ">
                <div className="flex items-center justify-start flex-row">
                  <div>
                    {" "}
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1"
                    >
                      <path
                        d="M12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89472 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17294C11.99 2.82567 13.7996 3.0039 15.4442 3.68509C17.0887 4.36628 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.387 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21ZM12 4.5C10.5166 4.5 9.0666 4.93987 7.83323 5.76398C6.59986 6.58809 5.63856 7.75943 5.07091 9.12988C4.50325 10.5003 4.35473 12.0083 4.64411 13.4632C4.9335 14.918 5.64781 16.2544 6.6967 17.3033C7.7456 18.3522 9.08197 19.0665 10.5368 19.3559C11.9917 19.6453 13.4997 19.4968 14.8701 18.9291C16.2406 18.3614 17.4119 17.4001 18.236 16.1668C19.0601 14.9334 19.5 13.4834 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z"
                        fill="#808080"
                      />
                      <path
                        d="M15 12.75H12C11.8019 12.7474 11.6126 12.6676 11.4725 12.5275C11.3324 12.3874 11.2526 12.1981 11.25 12V7C11.25 6.80109 11.329 6.61032 11.4697 6.46967C11.6103 6.32902 11.8011 6.25 12 6.25C12.1989 6.25 12.3897 6.32902 12.5303 6.46967C12.671 6.61032 12.75 6.80109 12.75 7V11.25H15C15.1989 11.25 15.3897 11.329 15.5303 11.4697C15.671 11.6103 15.75 11.8011 15.75 12C15.75 12.1989 15.671 12.3897 15.5303 12.5303C15.3897 12.671 15.1989 12.75 15 12.75Z"
                        fill="#808080"
                      />
                    </svg>
                  </div>
                  <div className="flex-col items-center justify-between">
                    <h3 className="font-sans text-md font-semibold tracking-wide text-slate-600 ml-1 mt-1 text-start ">
                      Time
                    </h3>
                  </div>
                </div>
                {time && typeof time === "string" && (
                  <h2 className="font-sans font-semibold  tracking-wide text-slate-800 ml-1">
                    {localTime}
                  </h2>
                )}
              </div>

              <div className="flex  mx-3 ">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1"
                >
                  <path
                    d="M5 12V3L20 10L5 17V21"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="flex-col items-center justify-between">
                  <h3 className="font-sans text-md font-semibold tracking-wide text-slate-600  text-start ml-1">
                    Location
                  </h3>

                  <h2 className="font-sans  font-light  text-sm tracking-wide text-slate-800 ml-1">
                    {loc ? loc : "Unavailable"}
                  </h2>
                </div>
              </div>

              <svg
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3"
              >
                <path
                  d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z"
                  fill="#878787"
                ></path>
              </svg>
            </div>
          </div>
        </button>
      </Link>
    );

}