import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import SignUp ,{action as signupAction} from "./Pages/SignUp";
import Chat,{action as chatAction} from "./Pages/Chat";
// import Login from "./Pages/Login";
import {loader as HistoryLoader} from './components/History'
import Login, { action as loginAction } from "./Pages/Login";
import { loader as chatLoader } from "./Pages/Chat";
import History from "./components/History";
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
  {
    path: '/chat/history/:id',
    element : <History/>,
    loader : HistoryLoader
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
