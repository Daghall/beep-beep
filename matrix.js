const OSCILATOR_TYPES = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
];

export default class Matrix {
  constructor(rows, cols) {
    this._columns = [];
    this._maxNote = rows - 1;
    this._currentCol = -1;
    this._numbers = {
      rows,
      cols,
    };
    this._matrix = document.getElementById("matrix");

    this._createCols(rows, cols);
    this._setupEvents();
  }

  getNotes(index = 0) {
    if (index >= this._columns.length) return [];

    return this._columns[index].filter((i) => i !== undefined);
  }

  _setActive() {
    const active = document.getElementsByClassName("active")[0];
    if (active) {
      active.classList.remove("active");
    }
    const cols = this._matrix.getElementsByClassName("matrix__column");
    cols[this._currentCol].classList.add("active");
  }

  next() {
    this._currentCol = (this._currentCol + 1) % this._columns.length;
    this._setActive();
    return this.getNotes(this._currentCol);
  }

  _setupEvents() {
    this._matrix.addEventListener("click", (evt) => {
      const target = evt.target;

      if (target.dataset.grid !== undefined) {
        if (evt.shiftKey) {
          this._cycleType(target);
          target.classList.add("enabled");
        } else {
          this._toggleCell(target);
        }
      }
    });
  }

  _toggleCell(target) {
    const enabled = target.classList.toggle("enabled");
    if (!enabled) {
      target.textContent = "";
    }
    this._updateModel(target, enabled);
  }

  _updateModel(target, enabled) {
    const col = target.parentElement.dataset.col;
    const row = target.dataset.row;

    this._columns[col][row] = !enabled ? undefined : {
      note: this._maxNote - row,
      type: target.dataset.type,
    };
  }

  _createCols(rows, cols) {
    for (let i = 0; i < cols; ++i) {
      this._columns.push(Array(rows).fill(undefined));
      const col = document.createElement("span");
      col.className = "matrix__column";
      col.dataset.col = i;
      this._createRows(rows, col);
      this._matrix.appendChild(col);
    }
  }

  _createRows(rows, col) {
    for (let i = 0; i < rows; ++i) {
      const row = document.createElement("span");
      row.className = "matrix__row";
      row.dataset.grid = true;
      row.dataset.row = i;
      col.appendChild(row);
    }
  }

  _cycleType(target) {
    const type = target.dataset.type || "sine";
    const nextTypeIndex = (OSCILATOR_TYPES.indexOf(type) + 1) % OSCILATOR_TYPES.length;
    const nextType = OSCILATOR_TYPES[nextTypeIndex];
    target.dataset.type = nextType;
    target.textContent = this._oscillatorTypeToSymbol(nextType);

    this._updateModel(target, true);
  }

  _oscillatorTypeToSymbol(type) {
    switch (type) {
      case "square":
        return "◻";
      case "sawtooth":
        return "◿";
      case "triangle":
        return "△";
    }
  }

  randomize() {
    const cellsToEnable = Math.random() * 20 + 10;
    for (let i = 0; i < cellsToEnable; ++i) {
      const col = Math.floor(Math.random() * this._numbers.cols);
      const row = Math.floor(Math.random() * this._numbers.rows);
      const colElement = this._matrix.getElementsByClassName("matrix__column")[col];
      const rowElement = colElement.getElementsByClassName("matrix__row")[row];
      const freqType = Math.floor(Math.random() * OSCILATOR_TYPES.length);
      rowElement.dataset.type = OSCILATOR_TYPES[freqType];
      rowElement.textContent = this._oscillatorTypeToSymbol(rowElement.dataset.type);

      this._toggleCell(rowElement);
    }
  }
}
