const TOAST = {
	visible: false,
	toast: null,
	message: null,
	close: null,
	timeout: 2000,
	error: false,

	init() {
		this.toast = document.getElementById('toast');
		this.message = this.toast.querySelector('.toast-message');

		this.toast.addEventListener('click', (ev) => {
			if (ev.target.classList.contains('toast-button')) {
				this.hide().bind(this);
			}
		});
	},

	show(messageTxt, error = false) {
		error = error || false;

		if (!this.visible) this.toast.classList.add('show');

		if (error) {
			this.toast.classList.add('error');
			this.toast.style.setProperty('--toast-accent', 'var(--pink)');
		}

		if (messageTxt.length > 100)
			this.message.classList.add('toast-message-long');

		this.message.textContent = messageTxt;
		this.visible = true;

		this.close = setTimeout(() => {
			this.hide();
		}, this.timeout);
	},

	hide() {
		this.toast.classList.remove('show');

		if (this.error) {
			this.error = false;
			this.toast.classList.remove('error');
			this.toast.style.setProperty('--toast-accent', 'var(--green)');
		}

		this.message.textContent = '';
		this.visible = false;

		clearTimeout(this.close);
	},
};

export default TOAST;
