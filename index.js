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

function playNotes(notes) {
  if (!Array.isArray(notes)) return;//throw `Notes is not an array: ${notes}`;
  // const notes = m.getNotes(0);
  console.log("XXX notes", notes); // eslint-disable-line no-console
  notes.forEach((note) => {
    oscillator.playNote(FREQ[note], duration / 1000);
  });

}
