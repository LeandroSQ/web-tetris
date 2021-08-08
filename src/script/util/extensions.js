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