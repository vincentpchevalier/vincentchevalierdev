import THEME from './theme.js';
import CONTACT from './contact.js';

const DOM = {
	mode: null,
	isHome: null,
	footer: null,
	toTop: null,
	isHome: location.pathname.includes('index.html') || location.pathname === '/',

	init() {
		this.setDOMElements();
		this.setObservers();
	},

	// OBSERVERS
	// watches any changes to the THEME, stores choice in Local Storage, and updates the CONTACT form styles
	observeThemeChange() {
		let newMode;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-theme'
				) {
					newMode = mutation.target.dataset.theme;
					localStorage.setItem('mode', newMode);
					if (this.isHome) CONTACT.updateFormStyle(newMode);
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});
	},

	// watches for user to scroll down and intersect with the footer to show To Top button
	observeScrollDistance() {
		const footerObserver = new IntersectionObserver(this.showToTop.bind(this), {
			root: null,
			rootMargin: '50px',
			threshold: 0.1,
		});

		footerObserver.observe(this.footer);
	},

	showToTop(entries) {
		const [entry] = entries;
		if (!entry.isIntersecting) {
			this.toTop.classList.remove('visible');
			return;
		}
		this.toTop.classList.add('visible');
	},

	setObservers() {
		this.observeThemeChange();
		this.observeScrollDistance();
	},

	setDOMElements() {
		THEME.init();
		this.mode = THEME.getMode();

		this.footer = this.isHome
			? document.querySelector('#home footer')
			: document.querySelector('#projects footer');

		this.footer.querySelector('.current-year').textContent =
			new Date().getFullYear();

		this.toTop = document.querySelector('.to-top');

		if (this.isHome) {
			CONTACT.init(this.mode);
		}
	},
};

export default DOM;
