function mimeMobileProductGallery() {
	if (!isMobile) return

	// Get references to the image and thumbnails
	const image = document.querySelector('.p-image img')
	const thumbnails = document.querySelectorAll('.p-thumbnail')

	// Initialize the current index
	let currentIndex = 0

	// const classes is "single" if there are no thumbnails, otherwise it's "grid"
	const classes = thumbnails.length > 1 ? ['grid'] : ['single']
	image.closest('.p-image').classList.add(...classes)

	// Attach click event listeners to the left and right halves of the image
	image.addEventListener('click', (e) => {
		// Get the width of the image
		const imageWidth = image.clientWidth

		// Calculate the click position relative to the image
		const clickX = e.clientX - image.getBoundingClientRect().left

		// Determine whether the click occurred on the left or right half
		if (clickX < imageWidth / 2) {
			// Clicked on the left half, show the previous image
			currentIndex =
				(currentIndex - 1 + thumbnails.length) % thumbnails.length
		} else {
			// Clicked on the right half, show the next image
			currentIndex = (currentIndex + 1) % thumbnails.length
		}

		// Update the image source
		image.src = thumbnails[currentIndex].href

		e.preventDefault() // Prevent the default behavior of the anchor (lightbox or navigation)
		e.stopPropagation() // Prevent event propagation (prevent bubbling up in the DOM tree)
	})

	// Attach click event listeners to thumbnail anchor elements
	thumbnails.forEach((thumbnail, index) => {
		thumbnail.closest('.p-thumbnail').addEventListener('click', (e) => {
			// Update the current index and image source
			currentIndex = index
			image.src = thumbnail.href

			// Prevent the default behavior of the anchor (lightbox or navigation)
			e.preventDefault()
		})
	})
}
