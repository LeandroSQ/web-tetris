import { Particle } from "../particle/particle";

export class ParticleController {

	#particles = [];

	constructor(game) {
		this.game = game;

		this.#particles = [];
	}

	update(deltaTime) {
		for (let i = this.#particles.length - 1; i >= 0; i--) {
			// Updates and renders the particle
			const particle = this.#particles[i];
			particle.update(deltaTime);

			// If dead, remove from the list
			if (!particle.isAlive) this.#particles.splice(i, 1);
		}
	}

	render(ctx) {
		for (const particle of this.#particles) {
			particle.render(ctx);
		}
	}

	/**
	 * Resets the list of particles
	 */
	reset() {
		this.#particles = [];
	}

	/**
	 * Adds a particle to the list
	 *
	 * @param {Particle} particle
	 *
	 * @return {ParticleController} This instance for chaining
	 */
	add(particle) {
		this.#particles.push(particle);

		return this;
	}

}