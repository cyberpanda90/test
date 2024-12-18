function mimeAdvancedProductGallery() {
	if (isMobile) return

	const wrapper = document.querySelector('.p-image')

	if (!wrapper) return

	wrapper.classList.remove('p-image')
	wrapper.classList.add('p-image-mime')
	const thumbnails = document.querySelectorAll('.p-thumbnail')

	thumbnails.forEach((thumbnail) => {
		thumbnail.classList.add('p-main-image')
		thumbnail.classList.remove('p-thumbnail')
		const href = thumbnail.getAttribute('href')
		const img = thumbnail.querySelector('img')
		img.setAttribute('src', href)
		img.setAttribute('data-src', href)

		wrapper.appendChild(thumbnail)
	})

	const images = wrapper.querySelectorAll('.p-main-image')
	const classes =
		images.length > 1
			? images.length > 4
				? images.length > 7
					? ['grid']
					: ['grid', 'grid--less']
				: ['nogrid']
			: ['single']

	wrapper.classList.remove('grid', 'grid--multi', 'line')
	wrapper.classList.add(...classes)
}
