import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export function Home() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleForm = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const handleSubmit = () => {};
  return (
    <section className="w-50 h-70 border border-white border-4 rounded m-auto p-5 text-white mt-5">
      <h1 className="text-center fs-1">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={form.email}
            onChange={(e) => handleForm(e)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={form.password}
            onChange={(e) => handleForm(e)}
          />
        </div>
        <section className="d-flex flex-column">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link to="/" className="mt-2">
            If you don't have an account click here
          </Link>
        </section>
      </form>
    </section>
  );
}
