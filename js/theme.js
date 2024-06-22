const THEME = {
	mode: null,
	themeButton: null,

	init() {
		const storedMode = localStorage.getItem('mode');
		this.themeButton = document.querySelector('.toggle');

		if (storedMode) {
			this.mode = storedMode;
			document.documentElement.dataset.theme = storedMode;
		} else {
			this.mode =
				document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		}

		this.themeButton.addEventListener('click', this.toggleMode.bind(this));

		this.themeButton.setAttribute('aria-pressed', this.mode === 'dark');

		this.themeButton.setAttribute(
			'aria-label',
			`${
				this.mode.slice(0, 1).toUpperCase() + this.mode.slice(1).toLowerCase()
			} Mode`
		);
	},

	getMode() {
		return this.mode;
	},

	toggleMode() {
		const darkNow = this.mode === 'light';
		this.mode = darkNow ? 'dark' : 'light';
		document.documentElement.dataset.theme = this.mode;
		console.log(`Now with ${this.mode} Mode.`);

		localStorage.setItem('mode', this.mode);

		this.themeButton.setAttribute('aria-pressed', darkNow);
		this.themeButton.setAttribute(
			'aria-label',
			`${this.mode.toUpperCase()} Mode`
		);

	},
};

export default THEME;
