export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  distanceTo(vec: Vector2) {
    return Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
  }

  add(vec: Vector2) {
    this.x += vec.x;
    this.y += vec.y;
  }

  divideScalar(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
  }

  copy(vec: Vector2) {
    this.x = vec.x;
    this.y = vec.y;
  }
}

export class Centroid extends Vector2 {
  cluster: Vector2[] = [];
  oldCluster: Vector2[] = [];

  constructor(vec: Vector2) {
    super(vec.x, vec.y);
  }

  hasChanged() {
    for (let i = 0; i < this.cluster.length; i++) {
      if (!this.oldCluster.includes(this.cluster[i])) return true;
    }
    return false;
  }

  resetCluster() {
    this.oldCluster = this.cluster;
    this.cluster = [];
  }
}
