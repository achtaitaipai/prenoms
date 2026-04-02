import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Prenoms de France</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Explorez les prenoms attribues aux enfants nes en France entre 1900 et
        2024. Les donnees couvrent le niveau national et regional, et
        comprennent tous les prenoms attribues au moins 3 fois par an.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Source :{" "}
        <a
          href="https://www.insee.fr/fr/statistiques/8205621"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Insee, Fichier des prenoms
        </a>
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/statistiques"
          className="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h2 className="font-medium">Statistiques</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Evolution temporelle d'un ou plusieurs prenoms
          </p>
        </Link>
        <Link
          to="/classement"
          className="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h2 className="font-medium">Classement</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Top des prenoms par periode et par sexe
          </p>
        </Link>
        <Link
          to="/repartition"
          className="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h2 className="font-medium">Repartition</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribution regionale d'un prenom
          </p>
        </Link>
      </div>
    </div>
  );
}
