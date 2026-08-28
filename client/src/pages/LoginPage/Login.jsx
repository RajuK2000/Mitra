import React from 'react';
import "./Login.css"
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [data, setdata] = useState({})
  const navigate = useNavigate();
  const handlechnage = (event) => {
    const { name, value } = event.target;
    setdata((prevdata) => ({ ...prevdata, [name]: value }))
  }
  const formsubmit = async (e) => {
    e.preventDefault();
    try {
      const Daata = await axios.post("https://mitra-lyao.onrender.com/api/login", data)
      console.log(Daata.status, "DaataDaata");
      if(Daata.status === 200){
      sessionStorage.setItem("user", JSON.stringify(Daata))
      navigate("/chats")
      }
    } catch (err) {
      console.log(err,"error");
    }
  }
  const register =()=>{
    navigate("/register")
  }
  return (
    <div className="Main_form">
  <form className="form_container" onSubmit={formsubmit}>
    <label htmlFor="usermail">User mail</label>

    <input
      id="usermail"
      name="email"
      value={data.email}
      onChange={handlechnage}
    />

    <button type="submit">Submit</button>

    <button
      type="button"
      className="register_btn"
      onClick={register}
    >
      Register
    </button>
  </form>
</div>
  )
}
