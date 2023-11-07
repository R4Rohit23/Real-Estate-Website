import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // prevents the default behavior of the event
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      // if error occured while creating user
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        setSuccess(null);
        return;
      }
      // if no error
      setLoading(false);
      setError(null);
      setSuccess(true);
      navigate("/sign-in");
    } catch (error) {
      // catch the error while fetching the signup page
      setLoading(false);
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-600">
      <div className="p-3 max-w-lg mx-auto pt-20">
        <h1 className="text-3xl text-center font-semibold my-7 dark:text-white">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 dark:bg-slate-800"
          >
            {loading ? "Loading..." : "Sign UP"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5">
          <p className="dark:text-white">Already have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700 dark:text-blue-400">Sign In</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
        {success && (
          <p className="text-green-500 mt-5">Registered Successfully</p>
        )}
      </div>
    </div>
  );
}

export default SignUp;
