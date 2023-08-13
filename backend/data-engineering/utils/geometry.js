// Idea from: https://gist.github.com/id-ilych/8630fb273e5c5a0b64ca1dc080d68b63
import math from "./math.js";

const geometry = {};

// Builds minimum bounding box based on minimum area given set of points
geometry.minBoundingBox = ({ points }) => {
  // To avoid out of bounds indexes later on
  if (points.length < 3) {
    return {
      width: 0,
      height: 0,
      vertices: points,
      convexHull: points,
    };
  }
  const convexHull = grahamScan(points);

  let minArea = Number.MAX_VALUE;
  let result = null;
  for (let i = 0; i < convexHull.length; ++i) {
    const { vertices, width, height } = bestBox(
      convexHull,
      i,
      (i + 1) % convexHull.length
    );
    const area = width * height;
    if (area < minArea) {
      minArea = area;
      result = { vertices, width, height, convexHull };
    }
  }
  return result;
};

// Graham scan algorithm returns the given points convex hull
function grahamScan(points) {
  // Get origin to start building the convex hull with
  const origin = findOrigin(points);

  // Get sorted points counter-clockwise relative to origin
  const sortedPoints = sortPoints(origin, points);

  // Initialize stack with the first three points
  const stack = [sortedPoints[0], sortedPoints[1], sortedPoints[2]];

  // Iterate over the remaining points
  for (let i = 3; i < sortedPoints.length; i++) {
    let top = stack.length - 1;

    // Remove points that fall inside the convex hull
    while (
      top > 0 &&
      getCrossValue(stack[top - 1], stack[top], sortedPoints[i]) >= 0
    ) {
      stack.pop();
      top--;
    }
    stack.push(sortedPoints[i]);
  }

  return stack;
}

// Finds most lowest, then, most left point (for counter-clockwise movement)
const findOrigin = (points) => {
  let origin = points[0];
  for (let [x, y] of points) {
    if (y < origin[1] || (y === origin[1] && x < origin[0])) {
      origin = [x, y];
    }
  }
  return origin;
};

// Sorts points in counter-clockwise order relative to the origin
const sortPoints = (origin, points) =>
  points.slice().sort((a, b) => {
    const val = getCrossValue(origin, a, b);
    if (val === 0) {
      // If two points make the same angle with the origin, choose the closer one
      return math.distance(origin, a) - math.distance(origin, b);
    }
    return val;
  });

// Determines where the new point is with respect to the vector
// connection origin to the previous point
function getCrossValue(o, a, b) {
  // Evaluates sign of cross product o -> a (AO) and a -> b (BA) which are displacement vectors,
  // |AO × BA| = |AO_x * BA_y - AO_y * BA_x| for clockwise vs counter-clockwise position of b
  // negative value means inwards direction (with right hand) therefore clockwise
  const AO = [a[0] - o[0], a[1] - o[1]];
  const BA = [b[0] - a[0], b[1] - a[1]];
  return AO[0] * BA[1] - AO[1] * BA[0];
}

// builds a box with one of the edges being coincident with the edge
// between hull's points i and j (expected to be neighbors)
function bestBox(convexHull, i, j) {
  // a difference between two points (vector that connects them)
  const diff = (a, b) => [a[0] - b[0], a[1] - b[1]];
  // a dot product of two vectors
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  // a length of a vector
  const len = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]);
  // adds two vectors
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  // multiplies a vector by a given magnitude
  const mult = (a, n) => [a[0] * n, a[1] * n];
  // divides a vector by a given magnitude
  const div = (a, n) => [a[0] / n, a[1] / n];
  // builds a unit vector (one having a length of 1) with the same direction as a given one
  const unit = (a) => div(a, len(a));

  let origin = convexHull[i];
  // build base vectors for a new system of coordinates
  // where the x-axis is coincident with the i-j edge
  let baseX = unit(diff(convexHull[j], origin));
  // and the y-axis is orthogonal (90 degrees rotation counter-clockwise)
  let baseY = [baseX[1], -baseX[0]];

  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  // for every point of a hull
  for (const p of convexHull) {
    // calculate position relative to the origin
    const n = [p[0] - origin[0], p[1] - origin[1]];
    // calculate position in new axis (rotate)
    const v = [dot(baseX, n), dot(baseY, n)];
    // apply trivial logic for calculating the bounding box
    // as rotation is out of consideration at this point
    left = Math.min(v[0], left);
    top = Math.min(v[1], top);
    right = Math.max(v[0], right);
    bottom = Math.max(v[1], bottom);
  }

  // calculate bounding box vertices back in original screen space
  const vertices = [
    add(add(mult(baseX, left), mult(baseY, top)), origin),
    add(add(mult(baseX, left), mult(baseY, bottom)), origin),
    add(add(mult(baseX, right), mult(baseY, bottom)), origin),
    add(add(mult(baseX, right), mult(baseY, top)), origin),
  ];

  return {
    vertices,
    width: right - left,
    height: bottom - top,
  };
}

geometry.roundness = (polygon) => {
  const perimeter = geometry.perimeter(polygon);
  const area = geometry.area(polygon);
  const R = perimeter / (2 * Math.PI); // P = 2*PI*R
  const circleArea = Math.PI * R ** 2; // A = PI*R**2
  // Area at most will be circle area as circle has the largest area with a given perimeter
  const roundness = area / circleArea;
  if (isNaN(roundness)) {
    return 0;
  }
  return roundness;
};

// Determines polygon area by dividing it to smaller triangles
geometry.area = (polygon) => {
  let area = 0;
  for (let i = 1; i < polygon.length - 1; i++) {
    area += geometry.triangleArea(polygon[0], polygon[i], polygon[i + 1]);
  }
  return area;
};

geometry.perimeter = (polygon) => {
  let perimeter = 0;
  for (let i = 0; i < polygon.length; i++) {
    let j = i + 1;
    if (i == polygon.length - 1) {
      j = 0;
    }
    perimeter += math.distance(polygon[i], polygon[j]);
  }
  return perimeter;
};

geometry.triangleArea = (a, b, c) => {
  const ab = math.distance(a, b);
  const bc = math.distance(b, c);
  const ca = math.distance(c, a);

  // Heron's formula
  const p = (ab + bc + ca) / 2;
  return (p * (p - ab) * (p - bc) * (p - ca)) ** 0.5;
};

export default geometry;
