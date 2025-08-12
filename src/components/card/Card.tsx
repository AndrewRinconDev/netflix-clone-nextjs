import Link from "next/link";

interface ICardProps {
  linkUrl: string;
  imageSource: string;
  title: string;
}

const Card = ({ linkUrl, imageSource, title }: ICardProps) => {
  return (
    <Link href={linkUrl} className="card">
      <img src={imageSource} alt={title} />
    </Link>
  );
};

export default Card;
