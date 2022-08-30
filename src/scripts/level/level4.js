import { Level } from "../model/level";

const background = [
	"#03a9f4", // I
	"#304ffe", // J
	"#fb8c00", // L
	"#ffeb3b", // O
	"#4caf50", // S
	"#f44336", // Z
	"#ec407a", // T
];

const border = [
	"#0286c1", // I
	"#0127fa", // J
	"#c87000", // L
	"#ffe608", // O
	"#3d8b40", // S
	"#ea1c0d", // Z
	"#e2175b", // T
];

const level = new Level({
	speed: 5.75,
	shape: "hexagon",
	fillShape: true,
	pieces: { background, border },
	page: {
		background: "#263238",
		foreground: "#fafafa",
	},
});

Level.list.push(level);