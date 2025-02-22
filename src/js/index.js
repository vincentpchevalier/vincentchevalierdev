import CONTACT from './contact.js';
import THEME from './theme.js';
import TOAST from './toast.js';

const APP = {
	mode: null,
	isHome: null,
	footer: null,
	toTop: null,
	isHome: location.pathname.includes('index.html') || location.pathname === '/',

	init() {
		const versionMeta = document.querySelector('meta[name="site-version"]');
		versionMeta.setAttribute('content', VERSION);

		const buildDateMeta = document.querySelector(
			'meta[name="site-build-date"]'
		);
		buildDateMeta.setAttribute('content', `Last updated: ${LAST_UPDATED}`);

		const hash = window.location.hash.replace(/^#/, '');
		const el = document.getElementById(hash);
		this.focusOnElement(el);

		this.footer = this.isHome
			? document.querySelector('#home footer')
			: document.querySelector('#projects footer');

		this.footer.querySelector('.current-year').textContent =
			new Date().getFullYear();

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
