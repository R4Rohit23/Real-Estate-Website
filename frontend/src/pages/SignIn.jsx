import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/user.slice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
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
        dispatch(signInFailure(data.message));
        return;
      }
      // if no error
      navigate("/");
    } catch (error) {
      // catch the error while fetching the signup page
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-800">
      <div className="p-3 max-w-lg mx-auto pt-20">
        <h1 className="text-3xl text-center font-semibold my-7 dark:text-white">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg dark:hover:shadow-slate-950 shadow-lg hover:shadow-slate-400"
            id="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg dark:hover:shadow-slate-950 shadow-lg hover:shadow-slate-400"
            id="password"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 dark:bg-slate-600 shadow-lg dark:shadow-slate-950"
          >
            {loading ? "Loading..." : "Sign IN"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5">
          <p className="dark:text-white">Don't have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700 dark:text-blue-400">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;
