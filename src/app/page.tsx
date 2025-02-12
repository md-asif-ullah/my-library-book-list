import Image from "next/image";
import loginImage from "@/assets/images/login-image.jpg";
import LoginForm from "@/components/form/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login To library",
};

const Home = () => {
  return (
    <div className="bg-white min-h-screen w-full flex justify-center items-center px-4 lg:px-0">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Section - Form */}
        <div className="w-full flex justify-center items-center">
          <section className="w-[500px] bg-white p-6 rounded-lg shadow-lg lg:shadow-none pt-10">
            <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900 mb-6">
              Sign in
            </h1>
            <LoginForm />
          </section>
        </div>
        {/* Right Section - Image */}

        <div className="relative w-full h-screen hidden lg:block">
          <Image
            src={loginImage}
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
