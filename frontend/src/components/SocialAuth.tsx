import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCall";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store/index";

type PropType = {
  setLoading: (type: boolean) => void;
  isLoading: boolean | undefined;
};

type TypeUser = {
  name: string | null | undefined;
  email: string | null | undefined;
  provider: string | null | undefined;
  uid: string | null | undefined;
};

export default function SocialAuth({ isLoading, setLoading }: PropType) {
  const [user] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState<string>("google");

  const { setCredentials } = useStore((state: any) => state);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    setSelectedProvider("google");
    try {
      const res = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signin with Google", error);
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setSelectedProvider("github");
    try {
      const res = await signInWithPopup(auth, provider);
      return res;
    } catch (error) {
      console.error("Error signin with Github", error);
    }
  };

  useEffect(() => {
    const saveUserToDb = async () => {
      try {
        const userData = {
          name: user?.displayName,
          email: user?.email,
          provider: selectedProvider,
          uid: user?.uid,
        };
        setLoading(true);
        const { data: res } = await api.post("/signin", userData);
        console.log(res);

        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res?.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);

          setTimeout(() => {
            navigate("/overview");
          }, 1500);
        }
      } catch (error: any) {
        console.error("Something went wrong", error);
        toast.error(error?.response?.data.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      saveUserToDb();
    }
  }, [user?.uid]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="w-full flex text-sm font-normal dark:bg-transparent py-2 px-2 border rounded-md dark:border-gray-800 dark:text-gray-400"
        type="submit"
      >
        <FcGoogle className="mr-2 size-5" />
        Continue with Google
      </button>
      {/* <button
        onClick={signInWithGithub}
        disabled={isLoading}
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="submit"
      >
        <FcGoogle className="mr-2 size-5" />
        SignIn with Github
      </button> */}
    </div>
  );
}
