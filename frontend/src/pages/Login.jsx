import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";


function Login(){


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      const res = await API.post("/auth/login",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");

    }
    catch(err)
    {
      const errorMsg = err.response?.data?.error 
        ? err.response.data.error.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Login failed";
      alert(errorMsg);
    }
  };

  return(

    <div>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

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

        <button type="submit">Login</button>

      </form>

      <p>
        Don't have account? <Link to="/register">Register</Link>
      </p>

    </div>

  );

}

export default Login;