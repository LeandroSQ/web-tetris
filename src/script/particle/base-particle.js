export class BaseParticle {

	constructor() {
		this.alive = true;
		this.timeAlive = 0;
		this.timeToLive = Math.random() * 2.750 + 17.500;
	}

	loop(deltaTime) {
		this.timeAlive += deltaTime;

		// If the time alive has exceeded the time to live, die
		if (this.timeAlive >= this.timeToLive) {
			this.alive = false;
		}
	}

	render(ctx, cellSize) {

	}

}