import { useHoverContext } from "@/contexts/HoverContext";
import Link from "next/link";

interface ILinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkButton = ({ href, children, className }: ILinkButtonProps) => {
  const { hideHover } = useHoverContext();
  
  return (
    <Link href={href} onClick={hideHover} className={className}>
      {children}
    </Link>
  );
};

export default LinkButton;