import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1080px] flex-col items-center justify-center border-line border-x px-6 text-center">
      <p className="font-mono text-muted text-xs">404</p>
      <h1 className="mt-3 font-semibold text-3xl tracking-[-0.04em]">
        Cette page n'existe pas.
      </h1>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-full bg-fg px-4 font-medium text-bg text-sm transition-opacity hover:opacity-85"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
