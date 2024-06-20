const THEME = {
	mode: null,
	themeButton: null,

	init() {
		this.themeButton = document.querySelector('.toggle');
		this.mode =
			document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

		this.themeButton.addEventListener('click', this.toggleMode.bind(this));

		this.themeButton.setAttribute('aria-pressed', this.mode === 'dark');
		this.themeButton.textContent = this.mode === 'dark' ? 'DM' : 'LM';
	},

	getMode() {
		return this.mode;
	},

	toggleMode() {
		const darkNow = this.mode === 'light';
		this.mode = darkNow ? 'dark' : 'light';
		document.documentElement.dataset.theme = this.mode;
		console.log(`Now with ${this.mode} Mode.`);
		this.themeButton.setAttribute('aria-pressed', darkNow);
		this.themeButton.textContent = this.mode === 'dark' ? 'DM' : 'LM';
	},
};

export default THEME;
