import { any } from "prop-types";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      postUser: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
      register: async (email, password) => {
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await resp.json();
          localStorage.setItem("token", data.token);
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      login: async (email, password) => {
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await resp.json();
          localStorage.setItem("token", data.token);
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      profile: async () => {
        try {
          const token = localStorage.getItem("token");
          const resp = await fetch(process.env.BACKEND_URL + "/api/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await resp.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      createPost: async (comment) => {
        const token = localStorage.getItem("token");
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/post", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ comment }),
          });
          if (!resp.ok) {
            return false;
          }
          const data = await resp.json();

          return data;
        } catch (error) {
          console.log(error);
        }
      },
      getPost: async () => {
        const token = localStorage.getItem("token");
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/get", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!resp.ok) {
            return false;
          }
          const data = await resp.json();
          setStore({ postUser: data.post });
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      delPost: async (post_id) => {
        const token = localStorage.getItem("token");
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/post/delete",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ post_id }),
            }
          );
          if (!resp.ok) {
            return false;
          }
          const data = await resp.json();
          getActions().getPost();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;
