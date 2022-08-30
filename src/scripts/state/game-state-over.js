import { CELL_RADIUS } from "../constants";
import { GameStateType } from "../enum/game-state-type";
import { InputUtils } from "../util/input";
import { LocaleUtils } from "../util/locale";
import { TextUtils } from "../util/text";
import { Main } from "./../main";
import { GameState } from "./game-state";

export class GameStateOver extends GameState {

	/**
	 * @param {Main} game
	 */
	constructor(game) {
		super();

		this.game = game;
	}

	update(deltaTime) {
		if (InputUtils.isAnyKeyDown()) {
			this.game.reset();
			this.game.statePlaying.reset();
			this.game.state = GameStateType.PLAYING;
		}
	}

	preRender(ctx) {
		// Blurs the canvas
		ctx.save();
		ctx.filter = "blur(2px)";
	}

	render(ctx) {
		// Draw the board
		this.game.board.render(ctx);

		// Draw the panels
		for (const panel of this.game.uiPanels) panel.render(ctx);

		// Draw the particles
		this.game.particleController.render(ctx);

		// Dims the canvas
		ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		ctx.fillRect(0, 0, this.game.board.width, this.game.board.height);

		// Restore the canvas filters
		ctx.restore();

		// Draw title
		TextUtils.drawCRT({
			ctx,
			text: LocaleUtils.get("gameover"),
			x: this.game.board.width / 2,
			y: this.game.board.height / 2 - 25,
			fontFamily: "Nintendoid1",
			fontSize: 30.5 * window.fontScale,
			color: "#fefefe",
		});

		// Draw subtitle
		TextUtils.drawCRT({
			ctx,
			text: LocaleUtils.get("press_any_key_to_restart"),
			x: this.game.board.width / 2,
			y: this.game.board.height / 2 + 10,
			fontFamily: "Nintendoid1",
			fontSize: 8 * window.fontScale,
			color: "#fefefe",
		});
	}

}