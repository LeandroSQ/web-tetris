export class ScoreController {

	constructor() {

	}

	addPoints(points) {
		const x = document.createElement("span");
		x.className = "floating-point";
		x.innerText = `+${points}`;

		const scoreElement = document.getElementById("score").parentElement;

		scoreElement.appendChild(x);

		setTimeout(() => {
			scoreElement.removeChild(x);
		}, 3000);
	}

	/**
	 * Retrieves an existing singleton instance of the ScoreController
	 * Or creates a new one
	 *
	 * @return {ScoreController} The singleton instance of the ScoreController
	 */
	static get instance() {
		if (!window.scoreControllerInstance) window.scoreControllerInstance = new ScoreController();

		return window.scoreControllerInstance;
	}

}