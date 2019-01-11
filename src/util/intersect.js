export const isIntersect = (
  aXCoord,
  aYCoord,
  aWidth,
  aHeight,
  bXCoord,
  bYCoord,
  bWidth,
  bHeight
) =>
  aXCoord < bXCoord + bWidth &&
  bXCoord < aXCoord + aWidth &&
  aYCoord < bYCoord + bHeight &&
  bYCoord < aYCoord + aHeight;
