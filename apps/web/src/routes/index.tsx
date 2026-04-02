import { createFileRoute, Link } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className={container({ w: "full", px: "4", py: "12" })}>
      <h1 className={css({ fontSize: "4xl", fontWeight: "bold", letterSpacing: "tight" })}>
        Prenoms de France
      </h1>
      <p className={css({ mt: "4", fontSize: "lg", color: "muted.foreground" })}>
        Explorez les prenoms attribues aux enfants nes en France entre 1900 et 2024. Les donnees
        couvrent le niveau national et regional, et comprennent tous les prenoms attribues au moins
        3 fois par an.
      </p>
      <p className={css({ mt: "2", fontSize: "sm", color: "muted.foreground" })}>
        Source :{" "}
        <a
          href="https://www.insee.fr/fr/statistiques/8205621"
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            _hover: { color: "foreground" },
          })}
        >
          Insee, Fichier des prenoms
        </a>
      </p>
      <div
        className={css({
          mt: "8",
          display: "grid",
          gap: "4",
          gridTemplateColumns: { sm: "repeat(3, 1fr)" },
        })}
      >
        <Link
          to="/evolutions"
          className={css({
            rounded: "lg",
            borderWidth: "1px",
            p: "4",
            transition: "colors",
            _hover: { bg: "muted" },
          })}
        >
          <h2 className={css({ fontWeight: "medium" })}>Évolutions</h2>
          <p className={css({ mt: "1", fontSize: "sm", color: "muted.foreground" })}>
            Evolution temporelle d'un ou plusieurs prenoms
          </p>
        </Link>
        <Link
          to="/classement"
          className={css({
            rounded: "lg",
            borderWidth: "1px",
            p: "4",
            transition: "colors",
            _hover: { bg: "muted" },
          })}
        >
          <h2 className={css({ fontWeight: "medium" })}>Classement</h2>
          <p className={css({ mt: "1", fontSize: "sm", color: "muted.foreground" })}>
            Top des prenoms par periode et par sexe
          </p>
        </Link>
        <Link
          to="/repartition"
          className={css({
            rounded: "lg",
            borderWidth: "1px",
            p: "4",
            transition: "colors",
            _hover: { bg: "muted" },
          })}
        >
          <h2 className={css({ fontWeight: "medium" })}>Repartition</h2>
          <p className={css({ mt: "1", fontSize: "sm", color: "muted.foreground" })}>
            Distribution regionale d'un prenom
          </p>
        </Link>
      </div>
    </div>
  );
}
