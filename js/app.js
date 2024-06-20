const APP = {
	mode: null,
	isHome: null,
	footer: null,
	toTop: null,
	isHome: location.pathname.includes('index.html') || location.pathname === '/',

	init() {
		console.log('App initialized');

		this.footer = this.isHome
			? document.querySelector('#home footer')
			: document.querySelector('#projects footer');

		this.toTop = document.querySelector('.to-top');

		THEME.init();
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
					console.log(`Mode changed to ${newMode}`);
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

const CONTACT = {
	isSubmitting: false,
	contactForm: null,
	inputs: null,

	init(mode) {
		this.contactForm = document.querySelector('.contact-form');
		this.inputs = document.querySelectorAll('.contact-form input');

		this.inputs.forEach((input) => {
			input.addEventListener(
				'invalid',
				(ev) => {
					input.classList.add('error');
				},
				false
			);
		});

		this.contactForm.addEventListener(
			'submit',
			this.submitContactForm.bind(this)
		);

		this.updateFormStyle(mode);
	},

	updateFormStyle(mode) {
		if (mode === 'dark') {
			this.contactForm.style.setProperty(
				'--font-color',
				'var(--background-color)'
			);
		} else {
			this.contactForm.style.setProperty('--font-color', 'var(--font-color)');
		}
	},

	isValidEmail(email) {
		if (email === '' || email.length > 320) return false;
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	},

	sanitize(input) {
		const div = document.createElement('div');
		div.textContent = input;
		return div.innerHTML;
	},

	validateFormData(data) {
		let isValid = true;
		for (let [key, value] of data.entries()) {
			if (key === 'name' && value === '') {
				isValid = false;
				break;
			}
			if (key === 'email' && !this.isValidEmail(value)) {
				isValid = false;
				break;
			}
			if (this.sanitize(value) !== value) {
				isValid = false;
				break;
			}
		}
		return isValid;
	},

	async submitContactForm(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		console.log('form submitted');

		if (this.isSubmitting) {
			alert('Please wait before submitting again.');
			return;
		}

		console.log(this.contactForm);
		this.isSubmitting = true;
		let success = false;
		const submitBtn = this.contactForm.querySelector('button[type=submit]');
		submitBtn.textContent = 'Sending...';
		submitBtn.disabled = true;
		console.log(submitBtn.disabled);

		const action =
			'https://script.google.com/macros/s/AKfycbzst69bx4uLqwVxdGel7Mtg5bk8lKp7VENSolbPLLXtwm0dwK_2tGAu6Pj9CzPp064_/exec';

		const data = new FormData(this.contactForm);

		if (!this.validateFormData(data)) {
			alert('Invalid input');
			return;
		}

		try {
			const response = await fetch(action, {
				method: 'POST',
				body: data,
			});
			if (!response.ok) throw Error(response.statusText);
			console.log(response);
			success = true;
			// TODO: create a snackbar message with success text
			alert('Success!'); // temporary;
		} catch (err) {
			// TODO: create a snackbar message with success text
			console.error(err);
		} finally {
			this.inputs.forEach((input) => {
				input.classList.remove('error');
				if (success) input.value = '';
			});

			setTimeout(() => {
				submitBtn.textContent = 'Send';
				submitBtn.disabled = false;
				this.isSubmitting = false;
			}, 500);
		}
	},
};

function init() {
	isDark = document.documentElement.dataset.theme === 'dark';
	let isHome =
		location.pathname.includes('index.html') || location.pathname === '/';

	main = isHome
		? document.querySelector('#home #main')
		: document.querySelector('#projects #main');

	toTop = document.querySelector('.to-top');
	lightDarkButton = document.querySelector('.toggle');
	if (isHome) {
		inputs = document.querySelectorAll(
			'.contact-form input, .contact-form textarea'
		);
		console.log(inputs);
		contactForm = document.querySelector('.contact-form');
		inputs.forEach((input) => {
			input.addEventListener(
				'invalid',
				(ev) => {
					input.classList.add('error');
				},
				false
			);
		});
	}

	lightDarkButton.setAttribute('aria-pressed', isDark ? true : false);
	document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
	lightDarkButton.addEventListener('click', sync);

	if (isDark) {
		console.log('is dark and home');
		contactForm.style.setProperty('--font-color', 'var(--background-color)');
	}

	if (!isDark) {
		contactForm.style.setProperty('--font-color', 'var(--font-color)');
	}

	const mainObserver = new IntersectionObserver(showToTop, {
		root: null,
		rootMargin: '50px',
		threshold: `${isHome ? 0.5 : 0.45}`,
	});

	mainObserver.observe(main);

	contactForm.addEventListener('submit', submitContactForm);
}

const sync = () => {
	const darkNow = lightDarkButton.matches('[aria-pressed=false]');
	isDark = !darkNow;
	console.log(`was ${document.documentElement.dataset.theme}`);
	document.documentElement.dataset.theme = darkNow ? 'light' : 'dark';
	console.log(`now ${document.documentElement.dataset.theme}`);
	console.log(`Now with ${darkNow ? 'Dark' : 'Light'} Mode.`);
	lightDarkButton.setAttribute('aria-pressed', darkNow ? true : false);
	lightDarkButton.textContent = darkNow ? 'DM' : 'LM';

	if (isDark) {
		console.log('is dark and home');
		contactForm.style.setProperty('--font-color', 'var(--background-color)');
	}

	if (!isDark) {
		contactForm.style.setProperty('--font-color', 'var(--font-color)');
	}
};

// function showToTop(entries) {
// 	// console.log('to top function');
// 	const [entry] = entries;
// 	if (!entry.isIntersecting) {
// 		toTop.classList.remove('visible');
// 		return;
// 	}

// 	toTop.classList.add('visible');
// }

function isValidEmail(email) {
	if (email === '' || email.length > 320) return false;
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(String(email).toLowerCase());
}

function sanitize(input) {
	const div = document.createElement('div');
	div.textContent = input;
	return div.innerHTML;
}

function validateFormData(data) {
	let isValid = true;
	for (let [key, value] of data.entries()) {
		if (key === 'name' && value === '') {
			isValid = false;
			break;
		}
		if (key === 'email' && !isValidEmail(value)) {
			isValid = false;
			break;
		}
		if (sanitize(value) !== value) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

async function submitContactForm(ev) {
	ev.preventDefault();
	ev.stopPropagation();

	if (isSubmitting) {
		alert('Please wait before submitting again.');
		return;
	}

	isSubmitting = true;
	let success = false;
	const submitBtn = contactForm.querySelector('button[type=submit]');
	submitBtn.textContent = 'Sending...';
	submitBtn.disabled = true;
	console.log(submitBtn.disabled);

	const action =
		'https://script.google.com/macros/s/AKfycbzst69bx4uLqwVxdGel7Mtg5bk8lKp7VENSolbPLLXtwm0dwK_2tGAu6Pj9CzPp064_/exec';

	const data = new FormData(contactForm);

	if (!validateFormData(data)) {
		alert('Invalid input');
		return;
	}

	try {
		const response = await fetch(action, {
			method: 'POST',
			body: data,
		});
		if (!response.ok) throw Error(response.statusText);
		console.log(response);
		success = true;
		// TODO: create a snackbar message with success text
		alert('Success!'); // temporary;
	} catch (err) {
		// TODO: create a snackbar message with success text
		console.error(err);
	} finally {
		inputs.forEach((input) => {
			input.classList.remove('error');
			if (success) input.value = '';
		});

		setTimeout(() => {
			submitBtn.textContent = 'Send';
			submitBtn.disabled = false;
			isSubmitting = false;
		}, 500);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	APP.init();
});
