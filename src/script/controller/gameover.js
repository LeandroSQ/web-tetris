import { TextUtils } from "../util/text.js";
import { InputUtils } from "../util/input.js";
import { GameState } from "../enum/game-state.js";

export class GameOverController {

	constructor(game) {
		this.game = game;
	}

	loop(deltaTime) {
		if (InputUtils.isAnyKeyDown()) {
			this.game.reset();

			this.game.state = GameState.PLAYING;
		}
	}

	render() {
		const ctx = this.game.ctx;
		const canvas = this.game.canvas;

		// Blurs the canvas
		ctx.save();
		ctx.filter = "blur(2px)";

		// Renders the grid
		this.game.renderGrid();

		// Dims the canvas
		ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Restore the canvas filters
		ctx.restore();

		// Define the string to be drawn
		const title = "GAME-OVER";
		const subtitle = "Press any key to restart";

		TextUtils.drawCRT({
			ctx,
			text: title,
			x: canvas.width / 2,
			y: canvas.height / 2 - 25,
			fontFamily: "Nintendoid1",
			fontSize: 30.5,
			color: "#fefefe"
		});

		TextUtils.drawCRT({
			ctx,
			text: subtitle,
			x: canvas.width / 2,
			y: canvas.height / 2 + 10,
			fontFamily: "Nintendoid1",
			fontSize: 8,
			color: "#fefefe"
		});
	}

}