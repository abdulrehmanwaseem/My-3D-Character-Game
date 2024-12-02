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

export const handleCharacterRespawn = (
  rigidBody: any,
  position: number[],
  respawnHeight: number
) => {
  if (!rigidBody) return;

  const characterPosition = rigidBody.translation();
  if (characterPosition.y < respawnHeight) {
    // Teleport to spawn position
    rigidBody.setTranslation(
      { x: position[0], y: position[1], z: position[2] },
      true
    );
    // Reset velocity
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }
};
