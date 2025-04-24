'use client'
import React, { useState } from "react";
import Image from "next/image";

import logo from "@/assets/logo.png";
import { login, signup } from "@/firebase/firebase";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

import "./page.style.css";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signState = isSignUp ? "Sign Up" : "Sign In";

  const user_auth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (isSignUp) {
      await signup(name, email, password);
    } else {
      await login(email, password, () => router.push("/"));
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="login">
      <Image src={logo} className="login-logo" alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form>
          {isSignUp && (
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
          />
          <button onClick={user_auth} type="submit">
            {signState}
          </button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>
        <div className="form-switch">
          <p>
            {isSignUp ? "Already have an account?" : "New to Netflix?"}{" "}
            <span
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
            >
              Sign {isSignUp ? 'In' : 'Up'} Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
