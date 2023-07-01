class Pad {
  constructor(container, size, realTimeChartUpdate = null) {
    // Create pad canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = size;
    this.canvas.height = size;
    container.appendChild(this.canvas);

    // Create pad undo and clear buttons
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

    this.#addListener(); // Add event listeners

    this.color = "black"; // Set default pen color
    this.drawing = []; // Drawing array of segments (with segments being array of points)
    this.isDrawing = false; // Flag true if mouse is down (drawing continues)

    // A function only included in the smartPad to dynamically update the chart associate with it
    this.realTimeChartUpdate = realTimeChartUpdate;
  }

  // Chart update occurs if there is an update (only relevant to the smartPad)
  triggerChartUpdate() {
    if (this.realTimeChartUpdate) {
      this.realTimeChartUpdate(this.drawing);
    }
  }

  // Draws each segment (array of points) of the drawing
  #drawSegment(segment) {
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

  // Draws the drawing by looping through segments
  #draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const segment of this.drawing) {
      this.#drawSegment(segment);
    }

    this.triggerChartUpdate();
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

        this.#draw();
      }
    };
    this.canvas.onmouseup = () => {
      this.isDrawing = false;
    };

    // Relevant for touch devices
    this.canvas.ontouchstart = (e) => {
      // Getting the first touch (basically only one finger)
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
        this.#draw();
      }
      this.triggerChartUpdate(); // Update chart on the smartPad page to reflect real time updates
    };
    this.clear.onclick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawing = [];
      this.triggerChartUpdate(); // Update chart on the smartPad page to reflect real time updates
    };
  }
}
