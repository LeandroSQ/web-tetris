import "./util/extensions.js";
import { GameController } from "./controller/game.js";
import { InputController } from "./controller/input.js";

window.game = new GameController();

// Re-calculate the canvas size whenever the window changes it's size
window.addEventListener("resize", () => {
	window.game.calculateSizing();
});

// After the window load, starts the game controller
window.addEventListener("load", () => {
	window.game.setup();
});

// When the window loses focus, reset all the key presses
document.addEventListener("visibilitychange", () => {
	InputController.instance.resetAllKeys();
});