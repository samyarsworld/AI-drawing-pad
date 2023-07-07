class DecisionMatrix {
  constructor(container, drawings) {
    this.drawings = drawings;
    this.matrix = [];
    this.container = container;

    this.#constructMatrix();
    this.#constructTable();
  }

  #constructMatrix() {
    for (let i = 0; i < LABELS.length + 1; i++) {
      const row = [];
      for (let j = 0; j < LABELS.length + 1; j++) {
        row.push(0);
      }
      this.matrix.push(row);
    }

    for (let drawing of this.drawings) {
      const indTrue = LABELS.indexOf(drawing.realLabel) + 1;
      const indRes = LABELS.indexOf(drawing.label) + 1;
      this.matrix[indTrue][indRes] += 1;
    }

    // Totals
    for (let i = 1; i < LABELS.length + 1; i++) {
      for (let j = 1; j < LABELS.length + 1; j++) {
        this.matrix[0][j] += this.matrix[i][j];
        this.matrix[i][0] += this.matrix[i][j];
      }
    }

    // Relative differences
    for (let i = 1; i < LABELS.length + 1; i++) {
      this.matrix[0][i] -= this.matrix[i][0];
      if (this.matrix[0][i] > 0) {
        this.matrix[0][i] = "+" + this.matrix[0][i];
      }
    }
    this.matrix[0][0] = "";
  }

  #constructTable() {
    const table = document.createElement("table");
    this.container.appendChild(table);

    const colsTitle = document.createElement("div");
    colsTitle.innerHTML = "Predicted Labels";
    colsTitle.id = "cols-title";
    table.appendChild(colsTitle);

    const rowsTitle = document.createElement("div");
    rowsTitle.innerHTML = "Real Labels";
    rowsTitle.id = "rows-title";
    table.appendChild(rowsTitle);

    for (let i = 0; i < LABELS.length + 1; i++) {
      const row = document.createElement("tr");
      table.appendChild(row);
      for (let j = 0; j < LABELS.length + 1; j++) {
        const cell = document.createElement("td");
        cell.innerText = this.matrix[i][j];

        if (i == 0 && j > 0) {
          cell.style.backgroundImage =
            "url(" + styles[classes[j - 1]].image.src + ")";
          cell.style.backgroundRepeat = "no-repeat";
          cell.style.backgroundPosition = "50% 20%";
          cell.style.verticalAlign = "bottom";
          cell.style.fontWeight = "bold";
          const p = (2 * this.matrix[i][j]) / this.matrix[j][i];
          const R = p >= 0 ? p * 255 : 0;
          const B = p <= 0 ? -p * 255 : 0;
          cell.style.color = `rgb(${R},0,${B})`;
        }

        if (j == 0 && i > 0) {
          cell.style.backgroundImage =
            "url(" + styles[classes[i - 1]].image.src + ")";
          cell.style.backgroundRepeat = "no-repeat";
          cell.style.backgroundPosition = "50% 20%";
          cell.style.verticalAlign = "bottom";
          cell.style.fontWeight = "bold";
        }

        if (i > 0 && j > 0) {
          const p = math.invLerp(min, max, matrix[i][j]);
          if (i == j) {
            cell.style.backgroundColor = `rgba(0, 0, 255, ${p})`;
          } else {
            cell.style.backgroundColor = `rgba(255, 0, 0, ${p})`;
          }
        }

        row.appendChild(cell);
      }
    }
  }
}
