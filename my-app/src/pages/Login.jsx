import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const storedUser = localStorage.getItem(data.email);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.password === data.password) {
        // ✅ Store logged-in user's identifier
        localStorage.setItem('loggedInUser', data.email);

        console.log(`${parsedUser.name}, you are successfully logged in.`);
        navigate('/'); // ✅ Redirect to dashboard/home
      } else {
        alert("Incorrect password.");
      }
    } else {
      alert("User not found. Please register first.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center text-black">
      <div>
        <p className="text-center w-[30vw] bg-purple-300 py-[2vw] px-[1vw] rounded-t-[10px] text-2xl font-[Verdana]">
          Login Form
        </p>

        <form
          className="text-center flex flex-col mx-auto w-[30vw] py-[2vw] px-[1vw] bg-pink-200 rounded-b-[10px]"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            value="Login"
            className="rounded-[10px] p-[1vw] m-[5px] cursor-pointer"
            style={{ backgroundColor: "#a1eafb" }}
          />

          <p className="mt-4 text-sm">
            Not registered yet?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
