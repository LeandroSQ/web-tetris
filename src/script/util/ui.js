import { UIElement } from "../enum/ui-element.js";

export class UIUtils {

	static setVisibility(visible = false) {
		const infoWrapper = document.getElementById("info-wrapper");

		if (visible) {
			infoWrapper.classList.add("visible");
		} else {
			infoWrapper.classList.remove("visible");
		}
	}

	static reset(value="0") {
		// Iterates trough every UI item
		for (const property in UIElement) {
			if (!UIElement.hasOwnProperty(property)) continue;

			// Set it's value
			this.set(UIElement[property], value);
		}
	}

	static set(id, value) {
		const element = document.getElementById(id);
		element.innerText = value.toString();
	}

	static addPoints(newPoints, totalPoints) {
		// Creates a new element to hold the added points
		const x = document.createElement("span");
		x.className = "floating-point";
		x.innerText = `+${newPoints}`;

		// Gets the score element and update it's value
		const scoreElement = document.getElementById(UIElement.SCORE);
		scoreElement.innerText = totalPoints.toString();

		// Append the element to DOM
		// And after 3s remove it
		const infoWrapperScore = scoreElement.parentElement;
		infoWrapperScore.appendChild(x);
		setTimeout(() => {
			infoWrapperScore.removeChild(x);
		}, 3000);
	}

}
