import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loginleft from "../../Components/Login-Left/Loginleft";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [inform, setInform] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4040/register",
        inform
      );
      console.log(response.data);
      toast.success("User successfully created!");
      navigate("/dashboard");
    } catch (error) {
      console.log("There was an error in registering", error);
      toast.error("Error occurred!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <Loginleft className="w-full md:w-1/2 sm:h-[50vh] h-1/2 md:h-[100vh]" />
      <div className="flex flex-col justify-center w-full md:w-1/2 items-center  gap-12 h-1/2 md:h-[100vh]">
        <div className="w-96">
          <h1 className="text-[#459438] font-bold text-lg ">Welcome Back!!</h1>
          <p className="text-[#49881F] text-left text-sm ">
            Register again in order to access FMIS
          </p>
        </div>
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="border-2 border-[#184B05] h-12 md:h-[3.2rem] w-96 pl-4 placeholder-[#49881F] placeholder:text-sm rounded-lg text-sm"
            onChange={(e) => setInform({ ...inform, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-[#184B05] h-12 md:h-[3.2rem] w-96 pl-4 placeholder-[#49881F] placeholder:text-sm rounded-lg text-sm"
            onChange={(e) => setInform({ ...inform, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-[#184B05] h-12 md:h-[3.2rem] w-96 pl-4 placeholder-[#49881F] placeholder:text-sm rounded-lg text-sm"
            onChange={(e) => setInform({ ...inform, password: e.target.value })}
          />
          <p className="text-[#184B05] font-semibold text-right text-sm">
            Forgot Password?
          </p>
          <input
            type="submit"
            value="SignUp"
            className="bg-[#184B05] h-14 w-96 rounded-lg text-white text-sm "
          />
          <p className="text-[#49881F] text-center text-sm">
            Already on site.{" "}
            <Link to="/">
              <span className="text-[#184B05] font-semibold text-sm ">Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
