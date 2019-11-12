export default class Oscillator {
  constructor() {
    this._context = new window.AudioContext();
  }

  playNote(freq, endTime = 0, startTime = 0) {
    const oscillator = this._context.createOscillator();
    const gain = this._context.createGain();
    oscillator.connect(gain);
    gain.connect(this._context.destination);

    oscillator.frequency.value = freq;
    oscillator.frequency.type = "square";
    oscillator.start(this._context.currentTime + startTime);
    gain.gain.setTargetAtTime(0, this._context.currentTime + endTime, 0.1);
  }
}
