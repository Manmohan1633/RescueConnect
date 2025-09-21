/* eslint-disable react/jsx-key */
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState , useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AccidentsDetails from "./accidentDetails";
import Tabs from "./tabs";
import { app, database } from "../../config/firebase";
import { collection,  addDoc, getDocs,getFirestore } from "firebase/firestore";


export default function Accidents({}) {
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

      // useEffect(() => {
      //     setcorods( Location.map((item) => [item.longitude, item.latitude]));
      //   }, [Location]);

      console.log("koi", markerData);
      console.log(typeof markerData[0]?.location);

      const router = useRouter();
      const { user, logout } = useAuth();

      const [open, setOpen] = React.useState(false);

      const opening = () => {
        setOpen(!open);
      };

    return (
      <div className="flex flex-col h-full border-r-2 border-grey-500  mr-0">
        <div
          className=" h-full mr-2 mt-3 pt-2 flex-flex-col bg-white rounded-2xl"
          style={{ flex: 3 }}
        >
          {markerData.map((obj) => (
            <AccidentsDetails
              title={obj.title}
              time={obj.datetime}
              status={obj.status}
              loc={[obj.location?.latitude, obj.location?.longitude]}
              imgurl={obj.imageurl}
            />
          ))}
          {/* {markerData.map((obj) => console.log("hel",obj))} */}
        </div>
      </div>
    );
}
