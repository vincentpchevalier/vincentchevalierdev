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

	// SET UP FUNCTIONS
	setObservers() {
		this.observeThemeChange();
		this.observeScrollDistance();
	},

	setDOMElements() {
		const hash = window.location.hash.replace(/^#/, '');
		const el = document.getElementById(hash);

		if (!document.referrer.includes(location.origin)) {
			this.focusOnElement(el);
		}

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

	// HELPERS
	showToTop(entries) {
		const [entry] = entries;
		if (!entry.isIntersecting) {
			this.toTop.classList.remove('visible');
			return;
		}
		this.toTop.classList.add('visible');
	},

	isFocusable(el) {
		const focusableEls =
			'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]),  button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const isFocusable = el.matches(focusableEls) && !el.matches(':hidden');

		return isFocusable;
	},

	focusOnElement(el) {
		// extra logic to focus on element if it is not focusable for Safari
		if (!el) return;
		if (!this.isFocusable(el)) {
			el.setAttribute('tabindex', '-1');
			el.addEventListener(
				'blur',
				() => {
					el.removeAttribute('tabindex');
				},
				{ once: true }
			);
		}
		el.focus();
	},
};

export default DOM;
