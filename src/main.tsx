import React from 'react'
import ReactDOM from 'react-dom/client'

import Root from "./routes/root";
import ErrorPage from "./error-page.tsx";
import Play from './routes/play.tsx';
import Leaderboards from './routes/leaderboards.tsx';

import { Amplify } from 'aws-amplify';
import awsExports from "@/aws-exports";
Amplify.configure(awsExports);

import "./index.css";


import { Authenticator } from '@aws-amplify/ui-react';
import { RequireAuth } from '@/components/auth/RequireAuth.tsx';
import Auth from './routes/auth.tsx';


import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from '@/routes/home.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'signin',
        element: <Auth />
      },
      {
        path: "play",
        element: <RequireAuth><Play /></RequireAuth>,
      },
      // {
      //   path: "play/:id",
      //   element: <Play />,
      // },
      {
        path: "leaderboards",
        element: <Leaderboards />
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <RouterProvider router={router} />
    </Authenticator.Provider>
  </React.StrictMode>,
)
