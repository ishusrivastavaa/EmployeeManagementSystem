import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      await API.post("/auth/register",{
        name,
        email,
        password
      });

      alert("Registration successful");

      navigate("/");

    }catch(err){
      const errorMsg = err.response?.data?.error 
        ? err.response.data.error.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Registration failed";
      alert(errorMsg);
    }

  };

  return(

    <div>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button type="submit">Register</button>

      </form>

    </div>

  );

}

export default Register;