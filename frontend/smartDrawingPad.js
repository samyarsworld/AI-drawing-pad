class Pad {
  constructor(size) {
    this.canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext("2d");
    this.color = "black";
    this.drawing = [];
    this.isDrawing = false;
    this.#addListener();

    this.undo = this.undo.bind(this);
    this.clear = this.clear.bind(this);
  }

  #drawEach(segment) {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.moveTo(segment[0][0], segment[0][1]);
    for (let i = 1; i < segment.length; i++) {
      this.ctx.lineTo(segment[i][0], segment[i][1]);
    }
    this.ctx.stroke();
  }

  #drawMultiple() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const segment of this.drawing) {
      this.#drawEach(segment);
    }
  }

  #addListener() {
    this.canvas.onmousedown = (e) => {
      // Getting canvas boundaries
      const canvasBoundaries = this.canvas.getBoundingClientRect();
      console.log(
        canvasBoundaries.left,
        canvasBoundaries.top,
        e.clientX,
        e.clientY
      );
      const mouse = [
        Math.round(e.clientX - canvasBoundaries.left),
        Math.round(e.clientY - canvasBoundaries.top),
      ];
      this.drawing.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (e) => {
      if (this.isDrawing) {
        const canvasBoundaries = this.canvas.getBoundingClientRect();
        const mouse = [
          Math.round(e.clientX - canvasBoundaries.left),
          Math.round(e.clientY - canvasBoundaries.top),
        ];
        let lastSegment = this.drawing[this.drawing.length - 1];
        lastSegment.push(mouse);

        this.#drawMultiple();
      }
    };
    document.onmouseup = () => {
      this.isDrawing = false;
    };

    // Relevant for touch devices
    this.canvas.ontouchstart = (e) => {
      // Getting the first touch
      const touch = e.touches[0];
      this.canvas.onmousedown(touch);
    };
    this.canvas.ontouchmove = (e) => {
      const touch = e.touches[0];
      this.canvas.onmousemove(touch);
    };
    document.ontouchend = () => {
      document.onmouseup();
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawing = [];
  }

  undo() {
    if (this.drawing) {
      this.drawing.pop();
      this.#drawMultiple();
    }
  }
}
