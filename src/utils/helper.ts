export const lerpAngle = (start: number, end: number, t: number): number => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

// Assuming normalizeAngle is also in this file, add its type definition:
export const normalizeAngle = (angle: number): number => {
  return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
};
