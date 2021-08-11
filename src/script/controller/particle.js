export class ParticleController {

	#particles = [];

	constructor(game) {
		this.game = game;

		this.#particles = [];
	}

	loopAndRender(deltaTime, ctx, cellSize) {
		const particleList = this.#particles.slice(0);
		for (const particle of particleList) {
			// Updates and renders the particle
			particle.loop(deltaTime);
			particle.render(ctx, cellSize);

			// If not alive, remove from the list
			if (!particle.alive) {
				const index = this.#particles.findIndex((x) => x == particle);
				this.#particles.splice(index, 1);
			}
		}
	}

	reset() {
		this.#particles = [];
	}

	add(particle) {
		this.#particles.push(particle);
	}

}