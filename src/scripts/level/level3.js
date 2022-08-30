import { Level } from "../model/level";

const background = [
	"#a1efe4", // I
	"#65d9ef", // J
	"#fd971e", // L
	"#e6db74", // O
	"#a7e22d", // S
	"#f92572", // Z
	"#fd5fef", // T
];

const border = [
	"#75e8d7", // I
	"#37ceea", // J
	"#e67e02", // L
	"#ded049", // O
	"#8bc11b", // S
	"#e50657", // Z
	"#fc2cea", // T
];

const level = new Level({
	speed: 3.75,
	shape: "circle",
	fillShape: true,
	pieces: { background, border },
	page: {
		background: "#272822",
		foreground: "#f8f8f2",
	},
});

Level.list.push(level);