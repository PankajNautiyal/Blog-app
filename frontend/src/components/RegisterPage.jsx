import { useSnackbar } from "notistack";
import React, { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {enqueueSnackbar} = useSnackbar()

  const register = async (e) => {
    e.preventDefault();

    const response = await fetch("https://blog-app-d760.onrender.com/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      enqueueSnackbar("Registeration successful", { variant: "success" });
      setUsername("")
      setPassword("")
    } else {
      enqueueSnackbar("Registration failed", { variant: "error" });
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    // Capitalize only the first letter if the user typed something
    if (value.length === 1) {
      setUsername(value.charAt(0).toUpperCase() + value.slice(1));
    } else {
      setUsername(value);
    }
  };
  return (
    <form
      className="flex justify-center items-center flex-col gap-10 mt-10 p-4 w-full"
      encType="multipart/form-data"
      onSubmit={register}
    >
      <h2 className="text-3xl font-semibold">Register</h2>
      <div className="flex flex-col gap-6 w-3/4 lg:w-1/4">
        <input
          type="text"
          placeholder="Username"
          className="bg-transparent p-2 rounded-md border border-gray-600 text-"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-transparent p-2 rounded-md border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-gray-800 text-white p-2 w-full rounded dark:hover:bg-gray-900 hover:bg-gray-700 cursor-pointer">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterPage;
