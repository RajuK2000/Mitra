import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        age: "",
        isLogin: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            email: formData.email.toLowerCase(),
            name: formData.name.toLowerCase()
        };
        console.log(dataToSend, "datatisend");

        try {

            const Register = await axios.post("https://mitra-lyao.onrender.com/api/user", dataToSend)
            if (Register.status === 200) {
                setTimeout(() => {
                    navigate("/")

                }, 0)
            }

            alert("Registration successful!");

            setFormData({
                name: "",
                email: "",
                mobile: "",
                age: "",
            });
        }
        catch (err) {
            console.log(err);

        }
    };
    const logIn = () => {
        navigate("/")
    }
    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mobile</label>
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Register</button>
                <p
                    type="button"
                    className="loginText"
                    onClick={logIn}
                >
                    LogIn
                </p>
            </form>
        </div>
    );
}