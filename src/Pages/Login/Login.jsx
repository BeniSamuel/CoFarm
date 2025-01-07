import React, { useState } from "react";
import axios from "axios";
import Loginleft from "../../Components/Login-Left/Loginleft";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [inform, setInform] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Ensure navigate is initialized correctly

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.BACKEND_URL, inform);
      console.log(response.data);
      toast.success("Successfully logged in");
      navigate("/dashboard"); // Navigate to dashboard
    } catch (error) {
      console.error("There was an error logging in!", error);
      toast.error("Login failed. Please check your credentials."); // Add error toast for better user feedback
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <Loginleft className=" w-full md:w-1/2 sm:h-[50vh]" />
      <div className="p-12 w-full  md:w-1/2 md:h-[100vh] flex flex-col items-center justify-center gap-12">
        <div className="w-96">
          <h1 className="text-[#459438] font-bold text-xl">Welcome Back!!</h1>
          <p className="text-[#49881F] text-left">
            Register again in order to access FMIS
          </p>
        </div>
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-[#184B05] h-12 w-96 md:h-14 md:w-96 pl-4 placeholder-[#49881F] rounded-lg"
            onChange={(e) => setInform({ ...inform, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-[#184B05] h-12 w-96 md:h-14 md:w-96 pl-4 placeholder-[#49881F] rounded-lg"
            onChange={(e) => setInform({ ...inform, password: e.target.value })}
          />
          <p className="text-[#184B05] font-semibold text-right">
            Forgot Password?
          </p>
          <input
            type="submit"
            value="Login"
            className="bg-[#184B05] h-12 w-96 md:h-14 md:w-96 rounded-lg text-white"
          />
          <p className="text-[#49881F] text-center">
            New to the site?{" "}
            <Link to="/signup">
              <span className="text-[#184B05] font-semibold">Sign Up</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
