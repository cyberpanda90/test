// Replace the native Shoptet slider with static HTML
function mimeReplaceSlider(id, classes, storage, element) {
	const productContainer = document.getElementById(id)

	if (!productContainer) return

	const productElements = productContainer.querySelectorAll('.product')

	if (!productElements.length) return

	// Create new element to store the filtered products
	const newElement = document.createElement('div')
	newElement.classList.add(...classes, id)

	// Prepare localStorage for products
	localStorage.setItem(storage, JSON.stringify({}))

	// Create an object to store unique product IDs
	const uniqueProductIds = {}

	// Loop through each product element
	productElements.forEach((product) => {
		const productIdEl = product.querySelector('.p')
		const productId = productIdEl.getAttribute('data-micro-product-id')

		// Check if the product ID is unique
		if (!uniqueProductIds[productId]) {
			uniqueProductIds[productId] = true // Mark the product ID as seen

			product.removeAttribute('style') // Remove inline styles from the product element
			product.classList.remove('active', 'inactive') // Remove classes from the product element

			const image = product.querySelector('a img')
			image.setAttribute('src', image.getAttribute('data-src'))
			image.removeAttribute('loading')

			// Push current product to localStorage
			const storageData = JSON.parse(localStorage.getItem(storage))
			storageData[productId] = product.outerHTML
			localStorage.setItem(storage, JSON.stringify(storageData))
			newElement.innerHTML += storageData[productId]
		}
	})

	// Insert the new element after the position element
	const positionElement = document.querySelector(element)

	if (!positionElement) return

	positionElement.appendChild(newElement)
}
