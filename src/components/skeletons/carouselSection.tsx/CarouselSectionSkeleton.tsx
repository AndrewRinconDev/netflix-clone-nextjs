import CarouselSkeleton from "../carousel/CarouselSkeleton";

function CarouselSectionSkeleton({rows = 1}: {rows?: number}) {
  return (
    <>
    {Array.from({ length: rows }, (_, index) => (
      <CarouselSkeleton key={`carousel-skeleton-${index}`} cards={6}  />
    ))}
    </>
  );
}

export default CarouselSectionSkeleton;
