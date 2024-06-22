import CONTACT from './contact.js';
import THEME from './theme.js';
import TOAST from './toast.js';

const APP = {
	mode: null,
	isHome: null,
	footer: null,
	toTop: null,
	isHome: location.pathname.includes('index.html') || location.pathname === '/',
	version: 'v1.0',

	init() {
		this.footer = this.isHome
			? document.querySelector('#home footer')
			: document.querySelector('#projects footer');

		this.footer.querySelector('.version').textContent = this.version;

		this.toTop = document.querySelector('.to-top');

		THEME.init();
		TOAST.init();

		this.mode = THEME.getMode();

		this.observeThemeChange();

		this.observeScrollDistance();

		if (this.isHome) {
			CONTACT.init(this.mode);
		}
	},

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
};

document.addEventListener('DOMContentLoaded', () => {
	APP.init();
});
