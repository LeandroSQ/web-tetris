import { BaseParticle } from "./base-particle.js";

export class ComboParticle extends BaseParticle {

	constructor({ x, y, multiplier, game }) {
		super();

		this.x = x;
		this.y = y;
		this.text = `COMBO ${multiplier}x`;
		this.#handlesTextOverflow(game);

		this.size = 1;
		this.timeToLive = Math.random() * 2.750 + 17.500;
	}

	#handlesTextOverflow(game) {
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

	loop(deltaTime) {
		super.loop(deltaTime);

		// Increase the size
		this.size += deltaTime * 0.15;
		// Translates vertically
		this.y -= deltaTime * 0.45;
	}

	#setFontStyle(ctx) {
		ctx.fontFamily = `${parseInt(8 * this.size)}px Nintendoid1`;
	}

	render(ctx, cellSize) {
		// Draws green text
		ctx.fillStyle = `#fefefe${parseInt(this.alpha).toString(16)}`;
		this.#setFontStyle(ctx);
		ctx.fillTextCentered("COMBO", this.x, this.y);
	}

	get alpha() {
		return (1 - Math.min(this.timeAlive, this.timeToLive) / this.timeToLive) * 255;
	}

}