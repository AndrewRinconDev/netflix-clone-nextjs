import "./CardSkeleton.styles.css";

function CarouselSkeleton({ cards = 1 }: { cards?: number }) {
  return (
    <div className="title-cards-skeleton">
      <h2>Load</h2>
      <div className="card-list-skeleton">
        {Array.from({ length: cards }, (_, index) => (
          <div className="card-skeleton" key={index}></div>
        ))}
      </div>
    </div>
  );
}

export default CarouselSkeleton;
