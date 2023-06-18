class Pad {
  constructor(container, size, realTimeChartUpdate) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    container.appendChild(this.canvas);

    this.buttonRow = document.createElement("div");
    this.buttonRow.classList.add("button-row");
    container.appendChild(this.buttonRow);

    this.undo = document.createElement("button");
    this.undo.classList.add("button-53");
    this.undo.innerHTML = "UNDO";
    this.undo.id = "undo-btn";
    this.buttonRow.appendChild(this.undo);

    this.clear = document.createElement("button");
    this.clear.classList.add("button-53");
    this.clear.id = "clear-btn";
    this.clear.innerHTML = "CLEAR";
    this.buttonRow.appendChild(this.clear);

    this.ctx = this.canvas.getContext("2d");
    this.color = "black";
    this.drawing = [];
    this.isDrawing = false;
    this.#addListener();

    this.realTimeChartUpdate = realTimeChartUpdate;
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

    this.triggerChartUpdate();
  }

  triggerChartUpdate() {
    if (this.realTimeChartUpdate) {
      this.realTimeChartUpdate(this.drawing);
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

    // Undo and clear buttons
    this.undo.onclick = () => {
      if (this.drawing) {
        this.drawing.pop();
        this.#drawMultiple();
      }
      this.triggerChartUpdate();
    };
    this.clear.onclick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawing = [];
      this.triggerChartUpdate();
    };
  }
}
