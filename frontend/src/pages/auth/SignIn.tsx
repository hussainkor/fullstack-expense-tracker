import React, { FormEvent, useEffect, useState } from "react";
import SocialAuth from "../../components/SocialAuth";
import { BiLoader } from "react-icons/bi";
import api from "../../libs/apiCall";

import useStore from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AccountType = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { user, setCredentials } = useStore((state: any) => state);
  const [loading, setLoading] = useState<boolean>();
  const [userData, setUserData] = useState<AccountType>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const clearInput = () => {
    setUserData({
      email: "",
      password: "",
    });
  };

  const handleSignIn = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const { data: res } = await api.post("/signin", userData);

      if (res?.user) {
        toast.success("Login successful");
        const userInfo = { ...res?.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setCredentials(userInfo);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
      clearInput();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
      <form
        onSubmit={handleSignIn}
        className="space-y-4 w-1/3 flex flex-col p-5 bg-white"
      >
        <h2 className="text-center dark:text-gray-600">Login</h2>
        <SocialAuth isLoading={loading} setLoading={setLoading} />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md dark:text-gray-600"
          type="text"
          placeholder="Enter email"
          onChange={handleChange}
          name="email"
          value={userData.email}
          disabled={loading}
          required
        />
        <input
          className="py-1 p-3 border border-gray-400 rounded-md dark:text-gray-600"
          type="password"
          placeholder="Enter password"
          onChange={handleChange}
          name="password"
          value={userData.password}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-900 text-white py-1"
        >
          {loading ? (
            <BiLoader className="text-2xl text-white animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
        <p className="text-sm text-gray-400">
          Don't have an account?
          <Link to="/sign-up" className="text-slate-950">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
}
