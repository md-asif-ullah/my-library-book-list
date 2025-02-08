"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("mdasifullah334@gmail.com");
  const [password, setPassword] = useState("12345678");

  const router = useRouter();

  const handleSingUp = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.log(result.error);
      toast("invalid email or password");
    } else {
      router.push("/book");
    }
  };

  return (
    <div className="bg-white min-h-screen w-full flex justify-center items-center px-4 lg:px-0">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Section - Form */}
        <div className="w-full flex justify-center items-center">
          <section className="w-[500px] bg-white p-6 rounded-lg shadow-lg lg:shadow-none pt-10">
            <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900 mb-6">
              Sign in
            </h1>
            <form onSubmit={handleSingUp} className="space-y-5 mt-10">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex items-center text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2">Show Password</span>
                </label>
                <button className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-3 text-white border border-black bg-black rounded-lg"
              >
                Sign in
              </button>
            </form>
          </section>
        </div>
        {/* Right Section - Image */}

        <div className="relative w-full h-screen hidden lg:block">
          <Image
            src="/login-image.jpg"
            alt="Login side-image"
            fill
            priority
            sizes="(max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
