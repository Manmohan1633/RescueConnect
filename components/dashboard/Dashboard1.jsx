import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Accidents from "../accidents/accidents1";
import Link from "next/link";
import AddDistress from "../button/AddDistress";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { app, database, db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Map from "../map/map";
import { getDatabase, ref, onValue, child } from "firebase/database";

export default function Dashboard() {
  const { user, currentUser, logout } = useAuth();
  const router = useRouter();
  console.log(user.phonenumber);
  const dbInstance = collection(database, "users");

  const rootRef = ref(db);
  const temperatureRef = child(rootRef, "data");
  const temp = child(temperatureRef, "firee");
  const [tempr, setTempr] = useState(null);

  // useEffect(() => {
  //   onValue(temp, (snapshot) => {
  //     console.log(snapshot.val(),"onn work aayo")
  //     const tempVal = snapshot.val();
  //     const latestTemp =
  //       Object.values(tempVal)[Object.values(tempVal).length - 1];
  //     setTempr(latestTemp);
  //   });
  // }, [temp]);

  const initialValues = {
    tittle: "Fire accident",
    description: "A big building got large fire",
    intensity: "7",
    location: { latitude: 10.0261, longitude: 76.3125 },
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2022-05/13/full/1652462127-1638.jpg?im=Resize,width=480",
    datetime: getCurrentDate(),
    policehelp: true,
    firehelp: true,
    ambulancehelp: false,
    otherhelp: false,
    imageurl: "",
    status: "NEW",
  };
  function getCurrentDate() {
    const currentDate = new Date();
    return currentDate.toISOString(); // return date in ISO format (e.g. "2023-03-06T12:30:00.000Z")
  }

  const [cou, setCou] = useState(0);

  useEffect(() => {
    // if (tempr != null) {
    // setTempr(29.87)

    // console.log(tempInCelsius);
    console.log(tempr, "hello");

    // if ((tempr?.slice(0, 2)) === "28") {
    //   if (cou == 0) {
    //     console.log("fire");
    //     // // send sms to user
    //     const dbInstance = collection(database, "accidents");

    //     console.log(initialValues);
    //     addDoc(dbInstance, {
    //       ...initialValues,
    //     });
    //                 setCou(1);

    //   }
    // }
  }, [tempr]);

  return (
    <main className="flex flex-col m-0 p-0 bg-white h-screen">
      <header className="z-40 items-center w-full h-16  bg-white  border-b-0 border-gray-200  py-8">
        <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
          <div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0">
            <div className="container relative left-0 z-50 flex w-3/4 h-full">
              <Link href="/">
                {" "}
                <img src="/logof.png" alt="logo" className="w-48 mt-2 " />
              </Link>
            </div>

            <div className="relative flex gap-4 items-center justify-end w-1/4 p-1 ml-5 mr-4 sm:mr-0 sm:right-auto">
              {user ? (
                <button
                  className="inline-flex justify-end items-center px-4 py-2  bg-blue-100 shadow-sm hover:bg-red-200 hover:text-red-600 text-blue-600 text-sm  font-medium font-sans rounded-md"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/signup" passHref>
                    <button>Signup</button>
                  </Link>
                  <Link href="/login" passHref>
                    <button>Login</button>
                  </Link>
                </>
              )}
              {/* notification */}
              <button>
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                </svg>
              </button>

              <Link href="/dashboard" className="relative block">
                <img
                  alt="profil"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
                  className="mx-auto object-cover rounded-full h-8 w-8 "
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className=" flex mt-2 gap-2  min-h-full flex-col sm:flex-row  p-0.5">
        <div className="flex w-full sm:w-64 m-0 p-0" style={{ flex: 0.6 }}>
          <Sidebar />
        </div>

        <div className="flex relative  flex-col px-2 " style={{ flex: 4 }}>
          <Accidents></Accidents>
        </div>

        <div
          className=" relative flex flex-col  m-0 p-0  shadow-md  rounded-2xl "
          style={{ flex: 6 }}
        >
          <Map />
        </div>
      </div>
    </main>
  );
}
