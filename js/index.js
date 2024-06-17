let main;
let toTop;

function init() {
	main = document.querySelector('main');
	toTop = document.querySelector('.to-top');

	let page = main.id.split('-')[1];

	const mainObserver = new IntersectionObserver(showToTop, {
		root: null,
		rootMargin: '50px',
		threshold: `${page === 'home' ? 0.5 : 0.45}`,
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
