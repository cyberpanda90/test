function replaceRelatedProductsSlider() {
	const originalEl = document.querySelector('.products-related-wrapper')

	if (!originalEl) return

	originalEl.id = 'original-related-products'

	const container = document.querySelector('.p-detail-full-width')
	const sliderEl = document.createElement('div')
	sliderEl.id = 'mime-related-products'

	container.insertAdjacentElement('beforeend', sliderEl)
	mimeReplaceSlider('original-related-products', ['products-block--mime'], 'mimeProductsRelated', '#mime-related-products')
	originalEl.remove()

	sliderEl.insertAdjacentHTML('afterbegin', `<h2 class="p-related-title">${trans('PRODUCT.RELATED')}</h2>`)
}
