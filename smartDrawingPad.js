class Pad {
  constructor(size) {
    this.canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext("2d");
    this.color = "black";
    this.drawings = [];
    this.isDrawing = false;
    this.#addListener();

    this.undo = this.undo.bind(this);
    this.clear = this.clear.bind(this);
  }

  #drawEach(drawing) {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.moveTo(drawing[0][0], drawing[0][1]);
    for (let i = 1; i < drawing.length; i++) {
      this.ctx.lineTo(drawing[i][0], drawing[i][1]);
    }
    this.ctx.stroke();
  }

  #drawMultiple() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const drawing of this.drawings) {
      this.#drawEach(drawing);
    }
  }

  #addListener() {
    this.canvas.onmousedown = (e) => {
      // Getting canvas boundaries
      const canvasBoundaries = this.canvas.getBoundingClientRect();
      const mouse = [
        Math.round(e.clientX - canvasBoundaries.left),
        Math.round(e.clientY - canvasBoundaries.top),
      ];
      this.drawings.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (e) => {
      if (this.isDrawing) {
        const canvasBoundaries = this.canvas.getBoundingClientRect();
        const mouse = [
          Math.round(e.clientX - canvasBoundaries.left),
          Math.round(e.clientY - canvasBoundaries.top),
        ];
        let lastDrawing = this.drawings[this.drawings.length - 1];
        lastDrawing.push(mouse);

        this.#drawMultiple();
      }
    };
    this.canvas.onmouseup = () => {
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
    this.canvas.ontouchend = () => {
      this.canvas.onmouseup();
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawings = [];
  }

  undo() {
    if (this.drawings) {
      this.drawings.pop();
      this.#drawMultiple();
    }
  }
}
