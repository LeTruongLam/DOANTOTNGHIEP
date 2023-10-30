import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../../img/register_2.jpg";
import "../login/Login";
import Button from "@mui/material/Button";
const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <div className="image">
        <img src={image} alt="" />
      </div>
      <div className="content">
        <h1>Register</h1>
        <div className="login-form">
          <form>
            <h6>User name</h6>

            <input
              required
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <h6>Email</h6>

            <input
              required
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <h6>Password</h6>

            <input
              required
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Register
            </Button>
            {err && <p>{err}</p>}
            <span>
              Do you have an account? <Link to="/login">Login</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
