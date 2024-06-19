let main;
let toTop;

let lightDarkButton;
let contactForm;
let inputs;
let isSubmitting = false;
let isDark = true;

function init() {
	isDark = document.documentElement.dataset.theme === 'dark';
	console.log('is dark', isDark);
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

function showToTop(entries) {
	// console.log('to top function');
	const [entry] = entries;
	if (!entry.isIntersecting) {
		toTop.classList.remove('visible');
		return;
	}

	toTop.classList.add('visible');
}

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
	init();
});
