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

export default CONTACT;
