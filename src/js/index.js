import DOM from './dom.js';
import TOAST from './toast.js';

const APP = {
	init() {
		DOM.init();
		TOAST.init();
	},
};

document.addEventListener('DOMContentLoaded', () => {
	APP.init();
});
