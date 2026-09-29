import { notFound } from "next/navigation";

// Unknown paths under a locale render that locale's not-found page (inside
// the header/footer) instead of the bare global 404.
export default function CatchAll() {
  notFound();
}
