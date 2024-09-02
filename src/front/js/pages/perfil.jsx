import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

function Perfil() {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState();
  const [mssg, setMssg] = useState("");

  const get_profile = async () => {
    const resp = await actions.profile();
    setUser(resp);
  };

  const handlePost = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const res = await actions.createPost(mssg);
      setMssg("");
      actions.getPost();
    }
  };

  const deletePost = async (id) => {
    await actions.delPost(id);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    get_profile();
    actions.getPost();
  }, []);

  return (
    <div className="text-white ">
      <header className="mb-5">
        <h1 className="text-center">Perfil {user?.email}</h1>
      </header>
      <div
        className="mb-3 border border-success-subtle p-3 text-white m-auto "
        style={{ width: "50%" }}
      >
        <label
          htmlFor="exampleFormControlTextarea1"
          className="form-label mb-3"
        >
          Post something!!
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="1"
          value={mssg}
          onChange={(e) => setMssg(e.target.value)}
          onKeyDown={handlePost}
        ></textarea>
      </div>
      <ul className="d-flex flex-column align-items-center list-group">
        {store.postUser.map((post) => {
          return (
            <li
              className="list-group-item list-group-item-primary m-2 p-1 fs-5"
              key={post.id}
              style={{ width: "50%" }}
            >
              {post.comment}
              <button
                className="btn btn-danger position-absolute top-0 end-0"
                onClick={() => deletePost(post.id)}
              >
                <i className="fa-solid fa-trash "></i>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Perfil;
