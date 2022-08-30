import { ParticleController } from "../controller/particle-controller";
import { Piece } from "../model/piece";
import { Particle } from "./particle";

export class ExplosionParticle extends Particle {

	constructor({ x, y, color, angle }) {
		super();
		this.timeToLive = Math.randomRange(0.083, 0.15);

		this.x = x;
		this.y = y;

		this.angle = angle;
		this.speed = Math.random() * 270 + 120;
		this.color = color;
	}

	update(deltaTime) {
		super.update(deltaTime);

		this.x += Math.cos(this.angle) * deltaTime * this.speed;
		this.y += Math.sin(this.angle) * deltaTime * this.speed;
	}

	render(ctx) {
		ctx.fillStyle = this.color + this.alpha;
		ctx.fillRect(this.x, this.y, window.devicePixelRatio * 2, window.devicePixelRatio * 2);
	}

	get alpha() {
		return parseInt((1 - Math.min(this.timeAlive, this.timeToLive) / this.timeToLive) * 255)
			.toString(16)
			.padStart(2, "0");
	}

	/**
	 * @param {ParticleController} particleController
	 * @param {number} cellSize
	 * @param {Piece} piece
	 */
	static create(particleController, cellSize, piece) {
		const position = {
			x: piece.x * cellSize,
			y: (piece.y + piece.height) * cellSize,
		};

		const width = piece.width * cellSize;

		const amount = Math.randomIntRange(20, 40);

		for (let i = 0; i < amount; i++) {
			const particle = new ExplosionParticle({
				x: position.x + (1 - i / amount) * width,
				y: position.y,
				color: piece.color.background,
				angle: (i / amount) * Math.PI,
			});

			particleController.add(particle);
		}
	}

}