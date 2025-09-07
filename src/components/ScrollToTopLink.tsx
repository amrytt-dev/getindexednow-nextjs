import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

interface ScrollToTopLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export const ScrollToTopLink = ({
  children,
  className,
  to,
  onClick,
}: ScrollToTopLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hasHash = typeof to === "string" && to.includes("#");
    if (!hasHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  return (
    <Link href={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};
