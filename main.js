import EXAMPLE_NOTES from "./example-notes.js";
import Oscillator from "./oscillator.js";
import Matrix from "./matrix.js";

let oscillator;
const m = new Matrix(8, 16);
const duration = 500;

const FREQ = [
  220.0000, // A3
  246.9417, // B3
  261.6256, // C4
  293.6648, // D4
  329.6276, // E4
  349.2282, // F4
  391.9954, // G4
  440.0000,	// A4
];

const playButton = document.getElementById("play");
playButton.addEventListener("click", async () => {
  oscillator = new Oscillator();

  setInterval(() => {
    const notes = m.next();
    playNotes(notes);
  }, duration);
});

const randomizeButton = document.getElementById("randomize");
randomizeButton.addEventListener("click", async () => {
  m.randomize();
});

const exampleButton = document.getElementById("example");
exampleButton.addEventListener("click", async () => {
  m.load(EXAMPLE_NOTES);
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", async () => {
  const data = m.save();
  prompt("JSON", data); // eslint-disable-line no-alert
});

const loadButton = document.getElementById("load");
loadButton.addEventListener("click", async () => {
  const data = prompt("Enter JSON"); // eslint-disable-line no-alert
  m.load(data);
});

const oscillatorType = document.getElementById("oscillator-type");
oscillatorType.addEventListener("click", (evt) => {
  const type = evt.target.dataset.type;
  const target = evt.target;

  if (type) {
    const enabled = oscillatorType.getElementsByClassName("enabled")[0];
    if (enabled) {
      enabled.classList.remove("enabled");
    }
    target.classList.add("enabled");
    m.setDefaultOscillatorType(type);
  }
});

function playNotes(notes) {
  if (!Array.isArray(notes)) throw `Notes is not an array: ${notes}`;

  notes.forEach((note) => {
    oscillator.playNote(FREQ[note.note], duration / 1000, note.type);
  });
}
