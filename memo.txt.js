function rotateCoordinates(x, y, centerX, centerY, angle) {
    // Translate the point to the origin (centerX, centerY -> 0, 0)
    const translatedX = x - centerX;
    const translatedY = y - centerY;

    // Apply rotation
    const rotatedX = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
    const rotatedY = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);

    // Translate the point back
    const finalX = rotatedX + centerX;
    const finalY = rotatedY + centerY;

    return { x: finalX, y: finalY };
}

// Example usage:
const x = 100; // Original x coordinate
const y = 50;  // Original y coordinate
const centerX = 75; // Center x coordinate
const centerY = 75; // Center y coordinate
const angle = 0.25 * Math.PI; // Rotation angle in radians

const result = rotateCoordinates(x, y, centerX, centerY, angle);
console.log(`New coordinates: x = ${result.x}, y = ${result.y}`);
