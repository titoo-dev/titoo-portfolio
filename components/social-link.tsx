import Link from "next/link";

const style: React.CSSProperties = {
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  borderBottom: "3px solid #000000",
  paddingBottom: 2,
  fontSize: "0.85rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

/** Thick-underline brutalist link. External URLs open in a new tab. */
export function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={style}
      className="text-black hover:bg-black hover:text-[#B2BDA0] hover:px-1"
    >
      {children}
    </Link>
  );
}
