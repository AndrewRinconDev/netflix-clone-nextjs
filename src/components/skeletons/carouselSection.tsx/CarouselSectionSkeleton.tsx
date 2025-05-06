import CardSkeleton from "../card/CardSkeleton";

function CarouselSectionSkeleton({rows = 1}: {rows?: number}) {
  return (
    <>
    {Array.from({ length: rows }, (_, index) => (
      <CardSkeleton key={`card-skeleton-${index}`} cards={6}  />
    ))}
    </>
  );
}

export default CarouselSectionSkeleton;
