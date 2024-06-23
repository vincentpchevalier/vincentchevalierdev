import TOAST from './toast.js';

const CONTACT = {
	isSubmitting: false,
	contactForm: null,
	inputs: null,

	init(mode) {
		this.contactForm = document.querySelector('.contact-form');
		this.inputs = document.querySelectorAll(
			'.contact-form input, .contact-form textarea'
		);

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

		if (this.isSubmitting) {
			TOAST.show('Please wait before submitting again.');
			return;
		}

		this.isSubmitting = true;
		let success = false;
		const submitBtn = this.contactForm.querySelector('button[type=submit]');
		submitBtn.textContent = 'Sending...';
		submitBtn.disabled = true;

		const action =
			'https://script.google.com/macros/s/AKfycbzst69bx4uLqwVxdGel7Mtg5bk8lKp7VENSolbPLLXtwm0dwK_2tGAu6Pj9CzPp064_/exec';

		const data = new FormData(this.contactForm);

		if (!this.validateFormData(data)) {
			TOAST.show('Please fill out all required fields.', true);
			return;
		}

		try {
			const response = await fetch(action, {
				method: 'POST',
				body: data,
			});

			if (!response.ok) throw Error(response.statusText);

			success = true;

			TOAST.show('Thank you for sending a message!');
		} catch (err) {
			TOAST.show('Something went wrong. Please try again later.', true);
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

export default CONTACT;
