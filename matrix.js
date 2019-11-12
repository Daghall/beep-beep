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

    return this._columns[index].map((value, i) => {
      return value ? (this._maxNote - i) : false;
    }).filter((i) => i !== false);
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
        this._toggleCell(target);
      }
    });
  }

  _toggleCell(target) {
    const col = target.parentElement.dataset.col;
    const row = target.dataset.row;
    this._columns[col][row] = this._columns[col][row] ? undefined : true;
    target.classList.toggle("enabled");
  }

  _createCols(rows, cols) {
    for (let i = 0; i < cols; ++i) {
      this._columns.push(Array(rows).fill(false));
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

  randomize() {
    const cellsToEnable = Math.random() * 20 + 10;
    for (let i = 0; i < cellsToEnable; ++i) {
      const col = Math.floor(Math.random() * this._numbers.cols);
      const row = Math.floor(Math.random() * this._numbers.rows);
      const colElement = this._matrix.getElementsByClassName("matrix__column")[col];
      const rowElement = colElement.getElementsByClassName("matrix__row")[row];

      this._toggleCell(rowElement);
    }
  }
}
