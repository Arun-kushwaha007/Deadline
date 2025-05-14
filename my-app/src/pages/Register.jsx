import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate(); // 🚀 Initialize navigate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem(
      data.email,
      JSON.stringify({ name: data.name, password: data.password })
    );
    console.log("User registered:", JSON.parse(localStorage.getItem(data.email)));
    navigate('/login'); // ✅ Redirect to login after registration
  };

  return (
    <div className="h-screen flex justify-center items-center text-black">
      <div>
        <p className="text-center w-[30vw] bg-purple-300 py-[2vw] px-[1vw] rounded-t-[10px] text-2xl font-[Verdana]">
          Registration Form
        </p>

        <form
          className="text-center flex flex-col mx-auto w-[30vw] py-[2vw] px-[1vw] bg-pink-200 rounded-b-[10px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register("name")}
            placeholder="Name"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />

          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />
          {errors.email && (
            <span className="text-red-600 text-sm mb-2">*Email* is mandatory</span>
          )}

          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />
          {errors.password && (
            <span className="text-red-600 text-sm mb-2">*Password* is mandatory</span>
          )}

          <input
            type="submit"
            value="Register"
            className="rounded-[10px] p-[1vw] m-[5px] cursor-pointer"
            style={{ backgroundColor: "#a1eafb" }}
          />

          <p className="mt-4 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
