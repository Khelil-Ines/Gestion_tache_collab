"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password) {
        setError("All fields are necessary.");
        return;
      }
    
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
          }),
        });
    
        if (res.ok) {
          const form = e.target;
          form.reset();
          router.push("/");
        } else {
          const errorData = await res.json(); 
          if (errorData.user) {
            console.log("User registration failed:", errorData.user);
            setError("User registration failed: " + errorData.user);
          } else {
            console.log("User registration failed. No user data available.");
            setError("User registration failed. No user data available.");
          }
        }
      } catch (error) {
        console.log("Error during registration:", error);
        setError("Error during registration. Please try again.");
      }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-blue-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setFirstname(e.target.value)}
            type="text"
            placeholder="First Name"
          />
          <input
            onChange={(e) => setLastname(e.target.value)}
            type="text"
            placeholder="Last Name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/login"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}