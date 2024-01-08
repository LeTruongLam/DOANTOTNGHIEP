import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import image from "../../img/login_2.jpg";
import "./login.scss";
import Button from "@mui/material/Button";
import { message } from "antd";
const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.username || !inputs.password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      await login(inputs);
      navigate("/course");
      message.success("Đăng nhập thành công!");
    } catch (err) {
      message.error(err.response.data);

      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <div className="image">
        <img src={image} alt="" />
      </div>
      <div className="content">
        <h1>Login</h1>
        <h2>Welcome to BK-Elearning!</h2>
        <div className="login-form">
          <form>
            <h6>User name</h6>
            <input
              required
              type="text"
              placeholder="Enter your User name"
              name="username"
              onChange={handleChange}
            />
            <h6>Password</h6>
            <input
              required
              type="password"
              placeholder="Enter your Password"
              name="password"
              onChange={handleChange}
            />
            <a href="/">Forgot password</a>
            <Button variant="contained" onClick={handleSubmit}>
              Login
            </Button>
            <span>
              Don't you have an account? <Link to="/register">Register</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
