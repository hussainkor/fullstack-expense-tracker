import React, { FormEvent, useEffect, useState } from "react";
import SocialAuth from "../../components/SocialAuth";
import { BiLoader } from "react-icons/bi";
import api from "../../libs/apiCall";

import useStore from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AccountType = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

export default function SignUp() {
  const { user } = useStore((state: any) => state);
  const [loading, setLoading] = useState<boolean>();
  const [userData, setUserData] = useState<AccountType>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const clearInput = () => {
    setUserData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
  };

  const handleSignUp = async (e: FormEvent) => {
    try {
      e.preventDefault();
      console.log(userData);
      const { data: res } = await api.post("/signup", userData);

      if (res?.user) {
        toast.success("Account created succesfully, now you can login");
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      }
      clearInput();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    user && navigate("/");
  }, [user, navigate]);
  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
      <form
        onSubmit={handleSignUp}
        className="space-y-4 w-1/3 flex flex-col p-5 bg-white"
      >
        <h2 className="text-center dark:text-gray-600">Create Account</h2>
        <SocialAuth isLoading={loading} setLoading={setLoading} />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md"
          type="text"
          placeholder="Enter firstname"
          onChange={handleChange}
          name="firstname"
          value={userData.firstname}
          disabled={loading}
        />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md"
          type="text"
          placeholder="Enter lastname"
          onChange={handleChange}
          name="lastname"
          value={userData.lastname}
          disabled={loading}
        />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md"
          type="text"
          placeholder="Enter email"
          onChange={handleChange}
          name="email"
          value={userData.email}
          disabled={loading}
        />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md"
          type="password"
          placeholder="Enter password"
          onChange={handleChange}
          name="password"
          value={userData.password}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-900 text-white py-1"
        >
          {loading ? (
            <BiLoader className="text-2xl text-white animate-spin" />
          ) : (
            "Create an account"
          )}
        </button>
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-slate-950">
            SignIn
          </Link>
        </p>
      </form>
    </div>
  );
}
