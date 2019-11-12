const OSCILATOR_TYPES = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
];

export default class Matrix {
  constructor(rows, cols) {
    this._columns = [];
    this._defaultOscillatorType = "sine";
    this._maxNote = rows - 1;
    this._currentCol = -1;
    this._numbers = {
      rows,
      cols,
    };
    this._matrix = document.getElementById("matrix");

    this._createCols();
    this._setupEvents();
  }

  getNotes(index = 0) {
    if (index >= this._columns.length) return [];

    return this._columns[index].filter((i) => !!i);
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

  _toggleCell(target, type) {
    const enabled = target.classList.toggle("enabled");
    if (enabled) {
      target.dataset.type = type || this._defaultOscillatorType;
    } else {
      target.dataset.type = "";
    }
    this._updateModel(target, enabled);
  }

  _updateModel(target, enabled) {
    const col = target.parentElement.dataset.col;
    const row = target.dataset.row;

    this._columns[col][row] = !enabled ? null : {
      note: this._maxNote - row,
      type: target.dataset.type,
    };
  }

  _createCols() {
    const {cols, rows} = this._numbers;

    for (let i = 0; i < cols; ++i) {
      this._columns.push(Array(rows).fill(null));
      const col = document.createElement("span");
      col.className = "matrix__column";
      col.dataset.col = i;
      this._createRows(col);
      this._matrix.appendChild(col);
    }
  }

  _createRows(col) {
    const {rows} = this._numbers;

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

    this._updateModel(target, true);
  }

  save() {
    const data = {
      rows: this._numbers.rows,
      cols: this._numbers.cols,
      notes: this._columns.map((_, i) => {
        return this.getNotes(i);
      }),
    };
    return JSON.stringify(data);
  }

  load(json) {
    try {
      const data = JSON.parse(json);
      this._numbers.cols = data.cols;
      this._numbers.rows = data.rows;
      this._maxNote = this._numbers.rows - 1;

      this._columns.length = 0;
      while (this._matrix.firstChild) {
        this._matrix.removeChild(this._matrix.firstChild);
      }
      this._createCols();

      data.notes.forEach((rows, col) => {
        rows.forEach((item) => {
          const row = this._maxNote - item.note;
          this._columns[col][row] = item;
          const colElement = this._matrix.getElementsByClassName("matrix__column")[col];
          const rowElement = colElement.getElementsByClassName("matrix__row")[row];
          rowElement.dataset.type = item.type;
          rowElement.classList.add("enabled");
        });
      });
    } catch (e) {
      alert("Invalid save data"); // eslint-disable-line no-alert
    }
  }

  setDefaultOscillatorType(type) {
    this._defaultOscillatorType = type;
  }

  randomize() {
    const cellsToEnable = Math.random() * 20 + 10;
    for (let i = 0; i < cellsToEnable; ++i) {
      const col = Math.floor(Math.random() * this._numbers.cols);
      const row = Math.floor(Math.random() * this._numbers.rows);
      const colElement = this._matrix.getElementsByClassName("matrix__column")[col];
      const rowElement = colElement.getElementsByClassName("matrix__row")[row];
      const freqType = Math.floor(Math.random() * OSCILATOR_TYPES.length);
      const type = OSCILATOR_TYPES[freqType];

      this._toggleCell(rowElement, type);
    }
  }
}
