import { useRouteError } from "react-router-dom";
import logo from '@/assets/gimme5-logo.png'
import { Link } from "react-router-dom";

type ErrorProps = {
  status: number,
  statusText: string,
  message: string
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorProps;
  console.log('error: ', error)
  return (
    <div id="error-page" className="flex flex-col text-center h-screen justify-center">
      <Link to={'/'}><img src={logo} alt="gimme5 logo" width={200} className="mx-auto"/></Link>
      <h1 className="font-bold text-4xl">{error.status}</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}