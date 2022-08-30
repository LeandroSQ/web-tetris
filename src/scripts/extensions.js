import { CELL_RADIUS } from "./constants";

window.addLoadEventListener = function (handler, timeout = 1000) {
	let fired = false;

	const _func = () => {
		if (fired) return;
		fired = true;

		handler();
	};

	window.addEventListener("DOMContentLoaded", _func);
	window.addEventListener("load", _func);
	document.addEventListener("load", _func);
	window.addEventListener("ready", _func);
	setTimeout(_func, timeout);
};

window.addVisibilityChangeEventListener = function(handler) {
	const events = [
		"visibilitychange",
		"webkitvisibilitychange",
		"mozvisibilitychange",
		"msvisibilitychange",
	];

	let fired = false;

	const _func = () => {
		if (fired) return;
		fired = true;

		handler(!document.hidden);
	};

	events.forEach((event) => {
		window.addEventListener(event, _func);
	});
};

Math.clamp = function(x, min, max) {
	if (x > max) return max;
	else if (x < min) return min;
	else return x;
};

Math.lerp = function(current, target, speed) {
	const difference = target - current;

	if (difference > speed) return current + speed;
	else if (difference < -speed) return current - speed;
	else return current + difference;
};

Math.randomRange = function(min, max) {
	return Math.random() * (max - min) + min;
};

Math.randomIntRange = function(min, max) {
	return Math.floor(Math.randomRange(min, max));
};

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.transpose = function() {
	const matrix = this.slice(0);
	const rows = matrix.length;
	const cols = matrix[0].length;
	const grid = [];

	for (let j = 0; j < cols; j++) {
		grid[j] = Array(rows);
	}

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[j][i] = matrix[i][j];
		}
	}

	return grid;
};

Array.prototype.reverseColumns = function() {
	const matrix = this;

	for (let i = 0; i < matrix.length; i++) {
		matrix[i] = matrix[i].reverse();
	}

	return matrix;
};

Array.prototype.reverseRows = function() {
	let matrix = this;

	matrix = matrix.reverse();

	return matrix;
};

CanvasRenderingContext2D.prototype.fillTextCentered = function(str, x, y) {
	// Calculate the string boundaries, to center it correctly
	const measurement = this.measureText(str);

	// Draws the string at the center
	this.fillText(
		str,
		x - measurement.width / 2,
		y
	);
};

window.fillShape = true;
window.drawShape = "roundRect";
CanvasRenderingContext2D.prototype.drawShape = function(x, y, width, height) {
	const a = {
		"roundRect": () => this.roundRect(x, y, width, height, [CELL_RADIUS]),
		"rect": () => this.rect(x, y, width, height),
		"circle": () => {
			const r = (width + height) / 4;
			this.arc(x + r, y + r, r, 0, 2 * Math.PI);
		},
		"triangle": () => {
			this.moveTo(x, y);
			this.lineTo(x + width, y);
			this.lineTo(x + width / 2, y + height);
			this.lineTo(x, y);
		},
		"hexagon": () => {
			this.moveTo(x, y + height / 2);
			this.lineTo(x + width / 4, y + height);
			this.lineTo(x + width - width / 4, y + height);
			this.lineTo(x + width, y + height / 2);
			this.lineTo(x + width - width / 4, y);
			this.lineTo(x + width / 4, y);
			this.lineTo(x, y + height / 2);
		}
	};

	a[window.drawShape]();
};

CanvasRenderingContext2D.prototype.fillShape = function(x, y, width, height) {
	this.drawShape(x, y, width, height);
	this.fill();
};

if (!CanvasRenderingContext2D.prototype.hasOwnProperty("roundRect")) {
	// eslint-disable-next-line max-params
	CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
		let r = radius;
		if (Array.isArray(r)) {
			if (r.length <= 1) r = { tl: r[0], tr: r[0], br: r[0], bl: r[0] };
			else r = { tl: r[0] || 0, tr: r[1] || 0, br: r[2] || 0, bl: r[3] || 0 };
		} else if (typeof r === "number") {
			r = { tl: r, tr: r, br: r, bl: r };
		} else {
			r = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...r };
		}

		this.beginPath();
		this.moveTo(x + r.tl, y);
		this.lineTo(x + width - r.tr, y);
		this.quadraticCurveTo(x + width, y, x + width, y + r.tr);
		this.lineTo(x + width, y + height - r.br);
		this.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
		this.lineTo(x + r.bl, y + height);
		this.quadraticCurveTo(x, y + height, x, y + height - r.bl);
		this.lineTo(x, y + r.tl);
		this.quadraticCurveTo(x, y, x + r.tl, y);
		this.closePath();
	};
}

// eslint-disable-next-line max-params
CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, width, height, radius) {
	this.roundRect(x, y, width, height, radius);
	this.fill();
};

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}

	return this;
};

if (!ArrayBuffer.prototype.slice) {
	ArrayBuffer.prototype.slice = function(start, end) {
		const that = new Uint8Array(this);
		if (end == undefined) end = that.length;

		const result = new ArrayBuffer(end - start);
		const resultArray = new Uint8Array(result);
		for (let i = 0; i < resultArray.length; i++)
			resultArray[i] = that[i + start];

		return result;
	};
}

if (!Array.prototype.clear) {
	Array.prototype.clear = function() {
		this.splice(0, this.length);
	};
}
