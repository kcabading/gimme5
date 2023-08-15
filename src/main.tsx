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


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from '@/routes/home.tsx';
import Questions from '@/routes/questions.tsx';
import QuestionsCreate from '@/routes/questionsCreate.tsx';

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Settings from './routes/settings.tsx';

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
        path: 'questions',
        element: <RequireAuth><Questions /></RequireAuth>
      },
      {
        path: 'questions/create',
        element: <QuestionsCreate />
      },
      {
        path: "play",
        element: <Play />
      },
      {
        path: "settings",
        element: <RequireAuth><Settings /></RequireAuth>
      },
      {
        path: "leaderboards",
        element: <Leaderboards />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />    
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Authenticator.Provider>
  // </React.StrictMode>,
)
