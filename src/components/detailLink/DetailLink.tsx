import React from "react";
import Link from "next/link";

import "./DetailLink.styles.css";

interface DetailLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const DetailLink: React.FC<DetailLinkProps> = ({ href, children, className, onClick }) => {
  return (
    <Link href={href} className={`detail-link ${className || ''}`} onClick={onClick}>
      {children}
    </Link>
  );
};

export default DetailLink;