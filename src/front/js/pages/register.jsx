import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const handleForm = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLogged = await actions.register(form.email, form.password);
    if (isLogged) {
      navigate("/profile");
    }
  };
  return (
    <section className="w-50 h-70 border border-white border-4 rounded m-auto p-5 text-white mt-5">
      <h1 className="text-center fs-1">Register</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
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
        </section>
      </form>
    </section>
  );
}
