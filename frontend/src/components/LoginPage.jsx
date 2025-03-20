import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const LoginPage = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const {setUserInfo} = useContext(UserContext)

  const login =async(e) =>{
    e.preventDefault()
   try {
   const response =  await fetch('http://localhost:8800/login', {
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include'
    })
    if(response.ok){
      response.json().then(userInfo => {
        setUserInfo(userInfo)
        setRedirect(true)
      })
    } else {
      alert('Wrong credentials')
    }
    
   } catch (error) {
    alert('Login failed')
   }
  }

  if(redirect) {
    return <Navigate to={'/'}/>
  }

  return (
    <form className="flex justify-center items-center flex-col gap-10 mt-10 p-4 w-full"
    onSubmit={login}>
      <h2 className="text-3xl font-semibold">Login</h2>
      <div className="flex flex-col gap-6 w-3/4 lg:w-1/4">
        <input
          type="text"
          placeholder="Username"
          className="bg-transparent p-2 rounded-md border border-gray-600"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-transparent p-2 rounded-md border border-gray-600"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button className="bg-gray-800 text-white p-2 w-full rounded dark:hover:bg-gray-900 hover:bg-gray-700 cursor-pointer">
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginPage;
