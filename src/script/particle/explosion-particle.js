import { ParticleController } from "../controller/particle.js";
import { BaseParticle } from "./base-particle.js";

export class ExplosionParticle extends BaseParticle {

	constructor({ x, y, color, angle }) {
		super();

		this.x = x;
		this.y = y;

		this.angle = angle;
		this.speed = Math.random() * 4.5 + 2;
		this.color = color;

		this.timeToLive = Math.random() * 4 + 5;
	}

	loop(deltaTime) {
		super.loop(deltaTime);

		this.x += Math.cos(this.angle) * deltaTime * this.speed;
		this.y += Math.sin(this.angle) * deltaTime * this.speed;
	}

	render(ctx, cellSize) {
		ctx.fillStyle = this.color + this.alpha;
		ctx.fillRect(this.x, this.y, window.devicePixelRatio * 2, window.devicePixelRatio * 2);
	}

	get alpha() {
		return parseInt((1 - Math.min(this.timeAlive, this.timeToLive) / this.timeToLive) * 255).toString(16).padStart(2, "0");
	}

	/**
	 * @param {ParticleController} particleController
	 * @param {Object} position
	 * @param {Number} position.x
	 * @param {Number} position.y
	 * @param {string} color
	 * @param {Number} width
	 */
	static create(particleController, cellSize, piece) {
		const position = {
			x: piece.x * cellSize,
			y: (piece.y + piece.height) * cellSize
		};

		const width = piece.width * cellSize;

		const amount = Math.random() * 20 + 20;

		for (let i = 0; i < amount; i++) {
			particleController.add(new ExplosionParticle({
				x: position.x + (1 - i / amount) * width,
				y: position.y,
				color: piece.color.background,
				angle: (i / amount) * Math.PI
			}));
		}
	}

}