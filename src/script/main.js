import "./util/extensions.js";
import "./level/index.js";
import { GameController } from "./controller/game.js";
import { InputUtils } from "./util/input.js";

window.game = new GameController();

// Re-calculate the canvas size whenever the window changes it's size
window.addEventListener("resize", () => {
	window.game.calculateSizing();
});

// After the window load, starts the game controller
window.addEventListener("load", () => {
	// Attach the key listeners
	InputUtils.attachListeners();

	// Setup the game controller
	window.game.setup();
});

// When the window loses focus, reset all the key presses
document.addEventListener("visibilitychange", () => {
	InputUtils.resetAllKeys();

	window.game.onFocus();
});