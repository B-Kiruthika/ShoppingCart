import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login"); // Login or Sign Up
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [agree, setAgree] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    if (!agree) {
      alert("Please agree to the Terms and Privacy Policy");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  const signup = async () => {
    if (!agree) {
      alert("Please agree to the Terms and Privacy Policy");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error(error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}

          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />

          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>

        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <p>I agree to the Terms and Privacy Policy</p>
        </div>

        {state === "Login" ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={signup}>Sign Up</button>
        )}

        <p className="loginsignup-toggle">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setState("Sign Up")}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
