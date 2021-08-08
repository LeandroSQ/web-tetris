import "./util/extensions.js";
import { GameController } from "./controller/game.js";

window.game = new GameController();

window.addEventListener("resize", () => {
	window.game.calculateSizing();
});

window.addEventListener("load", () => {
	window.game.setup();
});