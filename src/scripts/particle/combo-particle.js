import { LocaleUtils } from "../util/locale";
import { Particle } from "./particle";

export class ComboParticle extends Particle {

	constructor({ x, y, multiplier, game }) {
		super();

		this.x = x;
		this.y = y;
		this.text = `COMBO ${multiplier}x`;
		this.#handleTextOverflow(game);

		this.size = 1;
	}

	#handleTextOverflow(game) {
		// Measure the string width
		this.#setFontStyle(game.ctx);

		// Measures the text
		const measurement = game.ctx.measureText(this.text);
		const width = measurement.width;
		const height = measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent;

		// Clamps the particle position
		this.x = Math.floor(Math.clamp(this.x, width / 4, game.canvas.width - width / 4));
		this.y = Math.floor(Math.clamp(this.y, height / 2, game.canvas.height - height * 1.5));
	}

	update(deltaTime) {
		super.update(deltaTime);

		// Increase the size
		this.size += deltaTime * 0.15 * 60;
		// Translates vertically
		this.y -= deltaTime * 0.45 * 60;
	}

	#setFontStyle(ctx) {
		ctx.fontFamily = `${parseInt(8 * this.size)}px Nintendoid1`;
	}

	render(ctx) {
		// Draws green text
		ctx.fillStyle = `#fefefe${parseInt(this.alpha).toString(16)}`;
		this.#setFontStyle(ctx);
		ctx.fillTextCentered(LocaleUtils.get("combo"), this.x, this.y);
	}

	get alpha() {
		return (1 - Math.min(this.timeAlive, this.timeToLive) / this.timeToLive) * 255;
	}

}