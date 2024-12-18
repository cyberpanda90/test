// Event listener for click on element with id 'watchdog-submit'
document.querySelector('html').addEventListener('click', function (event) {
	if (event.target.id === 'watchdog-submit') {
		document.body.innerHTML += '<div class="messages-whatchdog"><div class="message"><div class="container">Váš produkt byl uložen ke sledování.</div></div></div>'
		setTimeout(function () {
			document.querySelector('.messages-whatchdog').style.display = 'none'
		}, 2500)
	}
})

function updateAddToCart() {
	const availabilityLabels = document.querySelectorAll('.availability-label')

	availabilityLabels.forEach((label) => {
		if (label && label.textContent.includes('Vyprodáno')) {
			const addToCartButton = document.querySelector('.add-to-cart button')
			if (addToCartButton) {
				addToCartButton.remove()
			}
			const watchdogLinkIcon = document.querySelector('.link-icons .link-icon.watchdog')

			const btnWrapper = document.querySelector('.add-to-cart') ? document.querySelector('.add-to-cart') : document.querySelector('.p-to-cart-block')
			btnWrapper.appendChild(watchdogLinkIcon)
		}
	})
}

const variantList = document.querySelector('.variant-list')
const parLength = document.querySelectorAll('.variant-list td .advanced-parameter').length

if (variantList) {
	if (variantList.children.length === 1 && parLength === 1) {
		updateAddToCart()
	} else {
		const watchdogLinkIcon = document.querySelector('.link-icons .link-icon.watchdog')
		document.querySelector('.add-to-cart')?.appendChild(watchdogLinkIcon)
		watchdogLinkIcon.style.display = 'none'

		document.addEventListener('ShoptetSplitVariantParameterChange', function () {
			setTimeout(function () {
				const availabilityLabels = document.querySelectorAll('.parameter-dependent:not(.noDisplay):not(.no-display) .availability-label')
				let isSewing = false,
					isSoldOut = false
				availabilityLabels.forEach((label) => {
					if (label.textContent.match('Právě šijeme')) {
						isSewing = true
					} else if (label.textContent.match('Vyprodáno')) {
						isSoldOut = true
					}
				})

				const addToCartButton = document.querySelector('.add-to-cart button')
				const quantityDisplay = document.querySelector('.p-info-wrapper .add-to-cart .quantity')
				if (isSewing || isSoldOut) {
					if (addToCartButton) {
						addToCartButton.style.display = 'none'
						addToCartButton.classList.add('notclick')
					}
					if (quantityDisplay) {
						quantityDisplay.style.display = 'none'
					}
					watchdogLinkIcon.style.display = 'block'
					watchdogLinkIcon.classList.remove('notclick')
				} else {
					if (addToCartButton) {
						addToCartButton.style.display = 'block'
						addToCartButton.classList.remove('notclick')
					}
					if (quantityDisplay) {
						quantityDisplay.style.display = 'inline-block'
					}
					watchdogLinkIcon.style.display = 'none'
					watchdogLinkIcon.classList.add('notclick')
				}
			}, 10)
		})
	}
} else {
	updateAddToCart()
}
