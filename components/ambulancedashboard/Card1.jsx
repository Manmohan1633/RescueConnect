/* eslint-disable react/jsx-key */
import React from 'react'
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AccidentsDetails from "./accidentDetails1";
import Tabs from "../accidents/tabs";
import { app, database } from "../../config/firebase";
import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore";


export default function Card() {

       const [markerData, setmarkerData] = useState([{}]);
       const [Location, setLocation] = useState([]);
       const [corods, setcorods] = useState([]);

       const fetchPost = async () => {
         const db = getFirestore();
         await getDocs(collection(db, "fire")).then((querySnapshot) => {
           const newData = querySnapshot.docs.map((doc) => ({
             ...doc.data(),
             id: doc.id,
           }));
           setmarkerData(newData);
           setLocation(
             newData
               .filter((person) => person.location !== "")
               .map((person) => person.location)
           );
         });
       };

       useEffect(() => {
         fetchPost();
         console.log(markerData);

         // console.log(corods)
         // console.log(markerData)
       }, []);

    return (
      
        <div
          className=" h-full mr-0 mt-2 flex-flex-col bg-[#fff0] "
          style={{ flex: 3 }}
        >
          {markerData.map((obj) => (
            <AccidentsDetails
              tittle={obj.tittle}
              time={obj.datetime}
              status={obj.status}
              loc={[obj.location?.latitude, obj.location?.longitude]}
            />
          ))}
          {/* {markerData.map((obj) => console.log("hel",obj))} */}
        </div>
       
    );
}
