let main;
let toTop;
let lightDarkButton;
let contactForm;

function init() {
	let isDark =
		document.documentElement.dataset.theme === 'dark' ||
		matchMedia('(prefers-color-scheme: dark)').matches;
	let isHome =
		location.pathname.includes('index.html') || location.pathname === '/';
	main = isHome
		? document.querySelector('#home #main')
		: document.querySelector('#projects #main');

	toTop = document.querySelector('.to-top');
	lightDarkButton = document.querySelector('.toggle');
	if (isHome) {
		contactForm = document.querySelector('.contact-form');
		contactForm.querySelectorAll('input, textarea').forEach((input) => {
			input.addEventListener(
				'invalid',
				(ev) => {
					input.classList.add('error');
				},
				false
			);
		});
	}

	lightDarkButton.setAttribute('aria-pressed', isDark ? false : true);
	document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
	lightDarkButton.addEventListener('click', sync);
	if (isDark) {
		console.log('is dark and home');
		contactForm.style.setProperty('--font-color', 'var(--background-color)');
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
	console.log(`was ${document.documentElement.dataset.theme}`);
	document.documentElement.dataset.theme = darkNow ? 'light' : 'dark';
	console.log(`now ${document.documentElement.dataset.theme}`);
	console.log(`Now with ${darkNow ? 'Dark' : 'Light'} Mode.`);
	lightDarkButton.setAttribute('aria-pressed', darkNow ? true : false);
	lightDarkButton.textContent = darkNow ? 'DM' : 'LM';
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

function submitContactForm(ev) {
	ev.preventDefault();
	console.log('form submitted');
}

// Form validation
// if empty / invalid, change --focus-visible in contact class to --red
// check email with regex, must have @ and .
// name >= 2 characters
// message >= 10 characters and <= 300
// show message describing errors underneath the inputs
// if valid, change --focus-visible in contact class to --green

document.addEventListener('DOMContentLoaded', () => {
	init();
});
