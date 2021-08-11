import { TextUtils } from "../util/text.js";
import { InputUtils } from "../util/input.js";
import { GameState } from "../enum/game-state.js";

export class PauseController {

	constructor(game) {
		this.game = game;
	}

	loop(deltaTime) {
		if (InputUtils.isAnyKeyDown()) {
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

		// Renders the current piece
		this.game.gamePlay.currentPiece.render(ctx, this.game.cellSize);

		// Renders the ghost piece
		this.game.gamePlay.ghostPiece.render(ctx, this.game.cellSize);

		// Dims the canvas
		ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Restore the canvas filters
		ctx.restore();

		// Define the string to be drawn
		const title = "PAUSED";
		const subtitle = "Press any key to resume";

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