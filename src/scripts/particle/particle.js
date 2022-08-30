export class Particle {

	constructor() {
		// Define the time to live of the particle
		this.isAlive = true;
		this.timeAlive = 0;
		this.timeToLive = Math.randomRange(0.29, 0.337);
	}

	update(deltaTime) {
		// If the time alive has exceeded the time to live, die
		if (this.timeAlive >= this.timeToLive) {
			this.timeAlive = this.timeToLive;
			this.isAlive = false;
		} else {
			this.timeAlive += deltaTime;
		}
	}

	render(ctx) { }

}