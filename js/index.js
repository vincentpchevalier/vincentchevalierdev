let main;
let toTop;
let button;

function init() {
	let isDark =
		document.documentElement.dataset.theme === 'dark' ||
		matchMedia('(prefers-color-scheme: dark)').matches;
	let isHome =
		location.pathname.includes('index.html') || location.pathname === '/';

	button = document.querySelector('.toggle');

	button.setAttribute('aria-pressed', isDark ? false : true);
	document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

	button.addEventListener('click', sync);

	main = isHome
		? document.querySelector('#home #main')
		: document.querySelector('#projects #main');
	toTop = document.querySelector('.to-top');

	const mainObserver = new IntersectionObserver(showToTop, {
		root: null,
		rootMargin: '50px',
		threshold: `${isHome ? 0.5 : 0.45}`,
	});

	mainObserver.observe(main);
}

const sync = () => {
	const darkNow = button.matches('[aria-pressed=false]');
	console.log(`was ${document.documentElement.dataset.theme}`);
	document.documentElement.dataset.theme = darkNow ? 'light' : 'dark';
	console.log(`now ${document.documentElement.dataset.theme}`);
	console.log(`Now with ${darkNow ? 'Dark' : 'Light'} Mode.`);
	button.setAttribute('aria-pressed', darkNow ? true : false);
	button.textContent = darkNow ? 'DM' : 'LM';
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
