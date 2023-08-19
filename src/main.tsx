
import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

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


const Root = lazy(() => import('@/routes/root.tsx'))
const Home = lazy(() => import('@/routes/home.tsx'))
const Play = lazy(() => import('@/routes/play.tsx'))
const ErrorPage = lazy(() => import('@/error-page.tsx'))
const Questions = lazy(() => import('@/routes/questions.tsx'))
const QuestionsCreate = lazy(() => import('@/routes/questionsCreate.tsx'))
const Leaderboards = lazy(() => import('@/routes/leaderboards.tsx'))
const Settings = lazy(() => import('@/routes/settings.tsx'))


// import Root from "./routes/root";
// import ErrorPage from "./error-page.tsx";
// import Play from './routes/play.tsx';

// import Home from '@/routes/home.tsx';
// import Questions from '@/routes/questions.tsx';
// import QuestionsCreate from '@/routes/questionsCreate.tsx';

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoadingHenyo from './components/LoadingHenyo.tsx';


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
        <Suspense fallback={<LoadingHenyo/>}>
          <RouterProvider router={router} />    
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Authenticator.Provider>
  // </React.StrictMode>,
)
