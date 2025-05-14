import React from 'react';

const Login = () => {
  return (
    <div className="h-screen flex justify-center items-center text-black">
      <div>
        <p className="text-center w-[30vw] bg-purple-300 py-[2vw] px-[1vw] rounded-t-[10px] text-2xl font-[Verdana]">
          Login Form
        </p>

        <form className="text-center flex flex-col mx-auto w-[30vw] py-[2vw] px-[1vw] bg-pink-200 rounded-b-[10px]">
          <input
            type="text"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
            placeholder="Username"
          />
          <input
            type="email"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
            placeholder="Email"
          />
          <input
            type="password"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
            placeholder="Password"
          />
          <input
            type="submit"
            value="Register"
            className="rounded-[10px] p-[1vw] m-[5px] cursor-pointer"
            style={{ backgroundColor: "#a1eafb" }}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
