import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import store from "../reduxStore";
import Login from "./components/Login/Login";
import Task from "./components/Task/Task";


// Layout component to wrap pages
const AppLayout = () => {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
};

// Routes configuration
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/landingPage",
        element: <Task />,
      },
    ],
  },
]);

// Root rendering
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
