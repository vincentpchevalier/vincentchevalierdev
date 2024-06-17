let main;
let toTop;

function init() {
	let isHome =
		location.pathname.includes('index.html') || location.pathname === '/';

	main = isHome
		? document.querySelector('#home main')
		: document.querySelector('#projects main');
	toTop = document.querySelector('.to-top');

	const mainObserver = new IntersectionObserver(showToTop, {
		root: null,
		rootMargin: '50px',
		threshold: `${isHome ? 0.5 : 0.45}`,
	});

	mainObserver.observe(main);
}

function showToTop(entries) {
	// console.log('to top function');
	const [entry] = entries;
	if (!entry.isIntersecting) {
		toTop.classList.remove('visible');
		return;
	}

	toTop.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', () => {
	init();
});
