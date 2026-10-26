import { ButtonLink, Eyebrow } from "../components/UI";
export function NotFoundPage() {
  return (
    <div className="container not-found">
      <Eyebrow>Error 404</Eyebrow>
      <h1 tabIndex={-1}>
        Este camino no lleva
        <br />a una página.
      </h1>
      <p>
        El enlace puede haber cambiado o la dirección no existe. Vuelve al
        inicio para encontrar lo que buscas.
      </p>
      <ButtonLink to="/web/">Volver al inicio</ButtonLink>
    </div>
  );
}
