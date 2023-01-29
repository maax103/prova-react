import { useRouteError } from "react-router-dom";

export default function ErrorPage() {

  interface IError {
    statusText?: string,
    message?: string
  }

  const error = useRouteError() as IError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Desculpe, ocorreu um erro inesperado.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}