import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  // useRef is used to store a mutable value that does not cause a re-render when updated.
  // It can be used to access a DOM element directly.
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(formData);
  console.log(fileUploadProgress);
  console.log(fileUploadError);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // get the storage access from firebase
    const storage = getStorage(app);

    // create a unique fileName so that user can upload same file having same name
    const fileName = new Date().getTime() + file.name;

    // ref is the storage reference for the firebase
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadProgress(Math.round(progress));
      },
      (err) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="p-4 mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="relative inline-block mx-auto">
          <img
            className="rounded-full h-24 w-24 shadow-xl object-cover self-center mt-2"
            src={formData.avatar || currentUser.avatar}
            alt="profile_image"
          />
          <div
            onClick={() => fileRef.current.click()}
            className="absolute bottom-0 right-0 bg-gray-100 cursor-pointer shadow-xl p-2 rounded-full"
          >
            <FaPencilAlt />
          </div>
        </div>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Uploading Image</span>
          ) : fileUploadProgress > 0 && fileUploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileUploadProgress}%`}</span>
          ) : fileUploadProgress === 100 ? (
            <span className="text-green-500">File Uploaded Successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg mt-3"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg mt-3"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg mt-3"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
