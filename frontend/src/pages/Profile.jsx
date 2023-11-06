import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserError,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleterUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/user.slice";
import { useDispatch } from "react-redux";
import Listing from "../../../backend/models/listing.model";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const { error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useRef is used to store a mutable value that does not cause a re-render when updated.
  // It can be used to access a DOM element directly.
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserError(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateUserError(error.message));
    }
  };

  const handleUserDelete = async (e) => {
    const response = confirm("Do you want to delete your account?");

    if (response) {
      try {
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleterUserSuccess());
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  const handleSignOut = async (e) => {
    const response = confirm("Do you want to sign out?");

    if (response) {
      try {
        dispatch(signOutStart());

        const res = await fetch("/api/auth/signout");
        const data = await res.json();

        if (data.success === false) {
          dispatch(signOutFailure(data.message));
          return;
        }

        dispatch(signOutSuccess());
      } catch (error) {
        dispatch(signOutFailure(error.message));
      }
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  console.log(userListings);
  return (
    <div className="dark:bg-slate-600">
      <div className="p-4 mx-auto max-w-xl ">
        <h1 className="text-3xl font-semibold text-center my-7 dark:text-white">
          Profile
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />

          {/* Profile Image */}
          <div className="relative inline-block mx-auto">
            <img
              className="rounded-full h-24 w-24 shadow-2xl object-cover self-center mt-2"
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

          {/* Uploading or error bar */}
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">Error Uploading Image</span>
            ) : fileUploadProgress > 0 && fileUploadProgress < 100 ? (
              <span className="text-slate-700">{`Uploading ${fileUploadProgress}%`}</span>
            ) : fileUploadProgress === 100 ? (
              <span className="text-green-500">
                File Uploaded Successfully!
              </span>
            ) : (
              ""
            )}
          </p>
          <span></span>

          {/* User Data Section  */}
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            className="border p-3 rounded-lg mt-3 shadow-lg"
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
            className="border p-3 rounded-lg mt-3 shadow-lg"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="border p-3 rounded-lg mt-3 shadow-lg"
          />
          <button
            disabled={loading}
            className="bg-slate-700 dark:bg-slate-900 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 font-semibold hover:shadow-lg"
          >
            {loading ? "Loading..." : "Update"}
          </button>

          <Link
            className="bg-green-700 p-3 rounded-lg text-white uppercase text-center font-semibold hover:opacity-90 hover:shadow-lg"
            to={"/create-listing"}
          >
            Create Listing
          </Link>
        </form>

        <div className="flex justify-between mt-5">
          <span
            onClick={handleUserDelete}
            className="text-red-700 cursor-pointer dark:text-red-500"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-700 dark:text-red-500 cursor-pointer"
          >
            Sign Out
          </span>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}

        {success && <p className="text-green-500 mt-5">Updated Successfully</p>}

        <button onClick={handleShowListings} className="text-green-700 w-full dark:text-green-400">
          Show Listings
        </button>
        {showListingError && (
          <p className="text-red-700 mt-5 dark:text-red-500">Error Showing Listings</p>
        )}

        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-6 mt-10">
          <h1 className="text-center mt-7 text-2xl font-semibold dark:text-white">Your Listings</h1>
            {userListings.map((listing) => (
            <div key={listing._id} className="border p-3 rounded-lg flex justify-between items-center gap-4 hover:shadow-xl">
              <Link to={`/listings/${listing._id}`}>
                <img className='w-16 h-16 object-contain' src={listing.imageUrls[0]} alt="cover image" />
              </Link>
              <Link className="font-semibold text-slate-700 hover:underline truncate flex-1 dark:text-slate-300" to={`/listings/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button className="uppercase text-red-700 hover:underline dark:text-red-500">Delete</button>
                <button className="uppercase text-green-700 hover:underline dark:text-green-500">Edit</button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
