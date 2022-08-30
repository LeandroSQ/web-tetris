export class ImageUtils {

	static #cache = { };

	static load(filename) {
		return new Promise((resolve, reject) => {
			if (this.#cache.hasOwnProperty(filename)) {
				return resolve(this.#cache[filename]);
			}

			const image = new Image();

			image.onload = () => {
				this.#cache[filename] = image;
				resolve(image);
			};

			image.onerror = (e) => {
				reject(e);
			};

			image.src = `assets/images/${filename}`;
		});
	}

}