import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  console.log(formData);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% completed`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageUpload = () => {
    // Max number of image uploaded at a time
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      // Array to store the image urls
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      // Wait for the promises to be completly resolve or reject
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failes (Max size should be 2MB)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 image per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      if (formData.imageUrls.length < 1) {
        setError('You must upload at least one image');
        setLoading(false);
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setError('Regular Price must be greater than discount price');
        setLoading(false);
        return;
      }

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        setSuccess(false);
      }
      console.log(data.listingData);
      setSuccess(data.message);
      setLoading(false);
      navigate(`/listing/${data.listingData._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-slate-600">
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7 dark:text-white">
          Create a Listing
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex flex-col gap-6 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg shadow-lg"
              id="name"
              maxLength={"10000"}
              minLength={"10"}
              required
              onChange={handleChange}
              value={formData.name}
            />

            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg shadow-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />

            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg shadow-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            {/* CheckBoxes  */}
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span className="dark:text-white">Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span className="dark:text-white">Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className="dark:text-white">Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className="dark:text-white">Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className="dark:text-white">Offer</span>
              </div>
            </div>

            {/* Counters  */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min={"1"}
                  max={"10"}
                  className="p-3 border border-gray-300 rounded-lg shadow-lg"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p className="dark:text-white">Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min={"1"}
                  max={"10"}
                  className="p-3 border border-gray-300 rounded-lg shadow-lg"
                  onChange={handleChange}
                  value={formData.bathrooms}
                  required
                />
                <p className="dark:text-white">Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min={"50"}
                  max={"100000"}
                  className="p-3 border border-gray-300 rounded-lg shadow-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                  required
                />
                <div className="flex flex-col items-center">
                  <p className="dark:text-white">Regular Price</p>
                  <span className="text-xs dark:text-white">($ / month)</span>
                </div>
              </div>

              {formData.offer && (
                <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min={"10"}
                  max={"100000"}
                  className="p-3 border border-gray-300 rounded-lg shadow-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  required
                />
                <div className="flex flex-col items-center">
                  <p className="dark:text-white">Discounted Price</p>
                  <span className="text-xs dark:text-white">($ / month)</span>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Image Upload Area  */}
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold dark:text-white">
              Images:
              <span className="font-normal text-gray-600 dark:text-slate-300 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full shadow-lg"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                disabled={uploading}
                onClick={handleImageUpload}
                type="button"
                className="p-3 bg-green-600 text-white rounded uppercase hover:opacity-90 hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-sm dark:text-red-400">
              {imageUploadError && imageUploadError}
            </p>

            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border shadow-lg items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 dark:text-red-400 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white dark:bg-slate-800 rounded-lg uppercase hover:shadow-lg hover:opacity-90 disabled:opacity-80">
              {loading ? "Creating..." : "Create Listing"}
            </button>
            {error && <p className="text-red-700 dark:text-red-400">{error}</p>}
            {success && <p className="text-green-700 dark:text-grren-400">{success}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
