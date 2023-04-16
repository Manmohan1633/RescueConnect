import { useState, useEffect } from "react";

import { app, database, db, storage } from "../config/firebase";
import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";
import Sidebar from "../components/sidebar/Sidebar";
import Loader from "../components/loader/Loader";

export default function AddDistressForm() {
  const [file, setFile] = useState(null);
  const [urlkey, seturlkey] = useState("");

  // const [todos, setTodos] = useState([]);
  // const db = getFirestore();

  // const fetchPost = async () => {

  //     await getDocs(collection(db, "accidents"))
  //         .then((querySnapshot)=>{
  //             const newData = querySnapshot.docs
  //                 .map((doc) => ({...doc.data(), id:doc.id }));
  //             setTodos(newData);
  //             // console.log(todos, newData);
  //         })

  // }

  // useEffect(()=>{
  //     fetchPost();
  // }, [])

  function getCurrentDate() {
    const currentDate = new Date();
    return currentDate.toISOString(); // return date in ISO format (e.g. "2023-03-06T12:30:00.000Z")
  }

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get the user's current location using the Geolocation API
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
    });
  }, []);

  //   console.log(currentLocation); // output the constant

  const router = useRouter();

  const initialValues = {
    tittle: "",
    description: "",
    intensity: "",
    location: "",
    image: "",
    datetime: getCurrentDate(),
    policehelp: false,
    firehelp: false,
    ambulancehelp: false,
    otherhelp: false,
    imageurl: "",
    status: "NEW",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlecheck = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const formhandler = () => {
    const dbInstance = collection(database, "fire");

    console.log(formValues);
    addDoc(dbInstance, {
      ...formValues,
      location: currentLocation,
    });
    router.push("/dashboard");
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      console.log(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClick = (file) => {
    const accidentImagesRef = ref(storage, `images/${file.name}`);
    console.log("uploading:");
    setLoading(true);

    console.log(file);
    uploadBytes(accidentImagesRef, file).then((snapshot) => {
      getDownloadURL(accidentImagesRef)
        .then((url) => {
          console.log(url);
          seturlkey(url);
          setLoading(false);
          setFormValues({ ...formValues, imageurl: url });
        })
        .catch((error) => {
          console.log(error);
                    setLoading(false);

        });
    });
  };

  return (
    <div className=" flex flex-col justify-center items-center m-auto h-full w-full ">
      {/* {Object.keys(formErrors).length === 0 && isSubmit ? (
                <div className="ui message success">Signed in successfully</div>
              ) : (
                <pre className=" w-[70%]   text-lg ">
                  {JSON.stringify(formValues, undefined, 2)}
                </pre>
              )}
              <form className="w-[70%]  text-lg p-20 border-1 border-slate-300 rounded bg-slate-100 justify-center items-center">
                <h1>report accident form</h1>
                <div className="ui divider"></div>
                <div className="ui form">
                  <div className="field">
                    <label>Tittle</label>
                    <input
                      type="text"
                      name="tittle"
                      placeholder="Tittle"
                      value={formValues.tittle}
                      onChange={handleChange}
                    />
                  </div>
                  <p>{formErrors.username}</p>
                  <div className="field">
                    <label>description</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="description"
                      value={formValues.description}
                      onChange={handleChange}
                    />
                  </div>
                  <p>{formErrors.email}</p>
                  <div className="field">
                    <label>Intensity</label>
                    <input
                      type="range"
                      name="intensity"
                      placeholder="Tittle"
                      value={formValues.intensity}
                      onChange={handleChange}
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="flex">
                    <div className="flex flex-col">
                      <label>Police</label>
                      <input
                        type="checkbox"
                        checked={formValues.policehelp}
                        name="policehelp"
                        onChange={handlecheck}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label>Ambulance</label>
                      <input
                        type="checkbox"
                        checked={formValues.ambulancehelp}
                        name="ambulancehelp"
                        onChange={handlecheck}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label>Other help</label>
                      <input
                        type="checkbox"
                        checked={formValues.otherhelp}
                        name="otherhelp"
                        value={formValues.otherhelp}
                        onChange={handlecheck}
                      />
                    </div>
             
                  </div>{" "}
                </div>
              </form>{" "}
              <div>
                <input
                  type="file"
                  onChange={(event) => handleFileInputChange(event)}
                />
                <button onClick={() => handleUploadClick(file)}>Upload</button>
              </div>
              <button onClick={formhandler} className=" bg-blue-300">
                Submit
              </button> */}
      <div className="bg-white flex gap-4 h-screen rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="w-36 m-0 p-0">
          {" "}
          <Sidebar />
        </div>
        <div className="grid px-20 mt-10 gap-4 gap-y-2 ml-10 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="text-gray-600">
            <p className="font-medium text-xl">Report accident form</p>
            <p>Please fill out all the fields.</p>
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <label for="full_name">Title</label>
                <input
                  type="text"
                  name="tittle"
                  placeholder="Tittle"
                  value={formValues.tittle}
                  onChange={handleChange}
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div className="md:col-span-5">
                <p>{formErrors.username}</p>

                <label for="email">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="description"
                  value={formValues.description}
                  onChange={handleChange}
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div className="md:col-span-3">
                <p>{formErrors.email}</p>

                <label for="address">Intencity</label>
                <input
                  type="range"
                  name="intensity"
                  placeholder="Tittle"
                  value={formValues.intensity}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div className="flex gap-4  md:col-span-5 bg-red-100 px-5 py-4 rounded-xl">
                <div className="flex flex-col">
                  <label className="text-lg mb-2">Police</label>
                  <input
                    type="checkbox"
                    checked={formValues.policehelp}
                    name="policehelp"
                    onChange={handlecheck}
                    className="p-3 border-2 border-black"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-lg mb-2">Ambulance</label>
                  <input
                    type="checkbox"
                    checked={formValues.ambulancehelp}
                    name="ambulancehelp"
                    onChange={handlecheck}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-lg mb-2">Other help</label>
                  <input
                    type="checkbox"
                    checked={formValues.otherhelp}
                    name="otherhelp"
                    value={formValues.otherhelp}
                    onChange={handlecheck}
                  />
                </div>
              </div>{" "}
              <div className="md:col-span-2 mt-4 bg-slate-200 px-5 py-5 rounded-xl">
                <div>
                  <input
                    type="file"
                    className="w-full p-4"
                    onChange={(event) => handleFileInputChange(event)}
                  />
                  <button
                    className="bg-slate-700 px-3 py-2 rounded-xl text-white ml-4"
                    onClick={() => handleUploadClick(file)}
                  >
                    {loading ? <Loader /> :"Upload"}

                  </button>
                </div>
              </div>
              <div className="md:col-span-5 text-left mt-2">
                <div className="inline-flex items-start">
                  <button
                    onClick={formhandler}
                    className=" bg-red-600 px-6 py-3 text-white rounded-xl"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
