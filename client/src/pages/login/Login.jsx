import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import image from "../../img/login_2.jpg";
import "./login.scss"

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
    try {
      await login(inputs);
      navigate("/course");
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
            <button onClick={handleSubmit}>Login</button>
            {err && <p>{err}</p>}
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
