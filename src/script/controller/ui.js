export class UIController {

	constructor() {

	}

	setVisibility(visible = false) {
		const infoWrapper = document.getElementById("info-wrapper");

		if (visible) {
			infoWrapper.classList.add("visible");
		} else {
			infoWrapper.classList.remove("visible");
		}
	}

	reset() {
		// Iterates trough every UI item
		for (const property in UI) {
			if (!UI.hasOwnProperty(property)) continue;

			// Set it's value to 0
			this.set(UI[property], "0");
		}
	}

	set(id, value) {
		const element = document.getElementById(id);
		element.innerText = value.toString();
	}

	addPoints(newPoints, totalPoints) {
		// Creates a new element to hold the added points
		const x = document.createElement("span");
		x.className = "floating-point";
		x.innerText = `+${newPoints}`;

		// Gets the score element and update it's value
		const scoreElement = document.getElementById(UI.SCORE);
		scoreElement.innerText = totalPoints.toString();

		// Append the element to DOM
		// And after 3s remove it
		const infoWrapperScore = scoreElement.parentElement;
		infoWrapperScore.appendChild(x);
		setTimeout(() => {
			infoWrapperScore.removeChild(x);
		}, 3000);
	}

	/**
	 * Retrieves an existing singleton instance of the UIController
	 * Or creates a new one
	 *
	 * @return {UIController} The singleton instance of the UIController
	 */
	static get instance() {
		if (!window.uiControllerInstance) window.uiControllerInstance = new UIController();

		return window.uiControllerInstance;
	}

}

export const UI = {
	"SCORE": "score",
	"LINES": "lines",
	"PIECES": "pieces"
};