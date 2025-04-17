import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import SignUp ,{action as signupAction} from "./Pages/SignUp";
import Chat,{action as chatAction} from "./Pages/Chat";
// import Login from "./Pages/Login";
import Login, { action as loginAction } from "./Pages/Login";
import { loader as chatLoader } from "./Pages/Chat";
// define routes with actions
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction, // this is important if you're using <Form method="post" />
  },
  {
    path: "/signup",
    element: <SignUp />,
    action : signupAction
  },
  {
    path: "/chat/:userr",
    element: <Chat />,
    action : chatAction,
    loader : chatLoader
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
