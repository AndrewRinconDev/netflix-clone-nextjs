import "./CarouselSkeleton.styles.css";

interface CarouselSkeletonProps {
  cards?: number;
  category?: string;
}

function CarouselSkeleton({ cards = 6, category = "Loading..." }: CarouselSkeletonProps) {
  return (
    <div className="carousel-skeleton-container">
      <h2 className="carousel-skeleton-title">{category}</h2>
      
      <div className="carousel-skeleton-wrapper">
        <div className="carousel-skeleton-card-list">
          {Array.from({ length: cards }, (_, index) => (
            <div className="carousel-skeleton-card" key={index}>
              <div className="carousel-skeleton-image"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarouselSkeleton;
