function mimeMoveParameters() {
	const products = document.querySelectorAll('.product')

	products.forEach((product) => {
		const parametersEl = product.querySelector('.widget-parameter-wrapper')
		const flagsEl = product.querySelector('.p-in')

		if (parametersEl && flagsEl) {
			flagsEl.parentNode.insertBefore(parametersEl, flagsEl)
		}
	})
}
