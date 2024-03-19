export const polarToCartesian = ({
  centerX,
  centerY,
  radius,
  angleInDegrees,
}: {
  centerX: number;
  centerY: number;
  radius: number;
  angleInDegrees: number;
}) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};
