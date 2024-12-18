function removeNativeSliders() {
	// When all new sliders are created, remove all native sliders
	const productsWrappers = document.querySelectorAll('.product-slider-holder')
	productsWrappers.forEach((wrapper) => {
		wrapper.remove()
	})
}
