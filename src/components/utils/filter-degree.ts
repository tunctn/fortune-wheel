export const filterDegree = (d: number) => {
  while (d < 0) {
    d += 360;
  }
  return d % 360;
};
