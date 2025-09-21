import CameraCapture from '../components/CameraCapture';
import { useState, useEffect } from "react";


import { app, database, db, storage } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";

import { uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";
import Sidebar from "../components/sidebar/Sidebar";
import Loader from "../components/loader/Loader";

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Title is required.";
  }
  if (!values.description) {
    errors.description = "Description is required.";
  }
  return errors;
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState(null);

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
    title: "",
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

  // This is the new handleSubmit function with logs
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("STEP 1: Submit button clicked.");

  const errors = validate(formValues);
  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    console.log("STEP 2: Form has validation errors. Submission stopped.", errors);
    return;
  }

  console.log("STEP 3: Validation passed. Starting submission process...");
  setIsSubmitting(true);

  try {
    let imageUrl = "";
    if (file) {
      console.log("STEP 4: File found. Uploading to Firebase Storage...");
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
      console.log("STEP 5: File upload successful. URL:", imageUrl);
    }

    const dataToSend = {
      ...formValues,
      imageurl: imageUrl,
      location: currentLocation,
      datetime: Timestamp.now(),
      status: "NEW",
    };
    console.log("STEP 6: Data prepared. Saving to Firestore...");

    await addDoc(collection(database, "fire"), dataToSend);
    console.log("STEP 7: Data saved to Firestore successfully!");

    console.log("STEP 8: Redirecting to dashboard...");
    router.push("/dashboard");

  } catch (error) {
    console.error("!!! SUBMISSION FAILED WITH AN ERROR:", error);
    setIsSubmitting(false);
  }
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
    <div className="bg-white flex gap-4 h-screen rounded shadow-lg p-4 px-4 md:p-8 mb-6">
      <div className="w-36 m-0 p-0">
        <Sidebar />
      </div>

      <form onSubmit={handleSubmit} className="grid px-20 mt-10 gap-4 gap-y-2 ml-10 text-sm grid-cols-1 lg:grid-cols-3 w-full">
        <div className="text-gray-600">
          <p className="font-medium text-xl">Report accident form</p>
          <p>Please fill out all the fields.</p>
        </div>

        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-5">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={formValues.title}
                onChange={handleChange}
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
            </div>

            <div className="md:col-span-5">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={formValues.description}
                onChange={handleChange}
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
              {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
            </div>
            
            <div className="md:col-span-3">
              <label htmlFor="intensity">Intensity: {formValues.intensity}</label>
              <input
                type="range"
                name="intensity"
                id="intensity"
                value={formValues.intensity}
                onChange={handleChange}
                min="1"
                max="10"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
            </div>

            <div className="flex gap-4 md:col-span-5 bg-red-100 px-5 py-4 rounded-xl">
              <div className="flex flex-col items-center">
                <label className="text-lg mb-2">Police</label>
                <input
                  type="checkbox"
                  name="policehelp"
                  checked={formValues.policehelp}
                  onChange={handlecheck}
                  className="p-3 border-2 border-black"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-lg mb-2">Fire</label>
                <input
                  type="checkbox"
                  name="firehelp"
                  checked={formValues.firehelp}
                  onChange={handlecheck}
                  className="p-3 border-2 border-black"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-lg mb-2">Ambulance</label>
                <input
                  type="checkbox"
                  name="ambulancehelp"
                  checked={formValues.ambulancehelp}
                  onChange={handlecheck}
                  className="p-3 border-2 border-black"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-lg mb-2">Other help</label>
                <input
                  type="checkbox"
                  name="otherhelp"
                  checked={formValues.otherhelp}
                  onChange={handlecheck}
                  className="p-3 border-2 border-black"
                />
              </div>
            </div>

            {/* THIS IS THE NEW CAMERA SECTION */}
            <div className="md:col-span-5 mt-4">
              <label className="block text-lg mb-2">Capture Evidence</label>
              <CameraCapture onCapture={setFile} />
            </div>

            <div className="md:col-span-5 text-left mt-2">
              <div className="inline-flex items-start">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 px-6 py-3 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? <Loader /> : "Submit"}
                </button>
              </div>
            </div>
            {locationError && <p className="text-red-500 text-sm mt-2 md:col-span-5">Location Error: {locationError}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}

