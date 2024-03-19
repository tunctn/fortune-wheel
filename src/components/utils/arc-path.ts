import { polarToCartesian } from "./polar-to-cartesian";

export const arcPath = ({
  x,
  y,
  radius,
  endRadius,
  startAngle,
  endAngle,
}: {
  x: number;
  y: number;
  radius: number;
  endRadius: number;
  startAngle: number;
  endAngle: number;
}) => {
  const start = polarToCartesian({
    centerX: x,
    centerY: y,
    radius: radius,
    angleInDegrees: endAngle,
  });
  const end = polarToCartesian({
    centerX: x,
    centerY: y,
    radius: radius,
    angleInDegrees: startAngle,
  });

  const start2 = polarToCartesian({
    centerX: x,
    centerY: y,
    radius: endRadius,
    angleInDegrees: endAngle,
  });
  const end2 = polarToCartesian({
    centerX: x,
    centerY: y,
    radius: endRadius,
    angleInDegrees: startAngle,
  });

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    end2.x,
    end2.y,
    "A",
    endRadius,
    endRadius,
    0,
    largeArcFlag,
    1,
    start2.x,
    start2.y,
    "Z",
  ].join(" ");
  return d;
};
