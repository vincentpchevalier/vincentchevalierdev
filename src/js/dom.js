const DOM = {
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

	observeScrollDistance() {
		const footerObserver = new IntersectionObserver(this.showToTop.bind(this), {
			root: null,
			rootMargin: '50px',
			threshold: 0.1,
		});

		footerObserver.observe(this.footer);
	},
};
