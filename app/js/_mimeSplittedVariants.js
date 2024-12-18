/**
 * MIME SPLITTED VARIANTS
 * Zobrazí volbu variant v podobě tlačítek
 *
 * @param {Array} soldoutArray - Pole s názvy nedostupných variant
 */
function mimeSplittedVariants(soldoutArray, error) {
	// Pokud nejsme na stránce produktu, nevykonávat funkci
	const isOnProductDetail = document.body.classList.contains('type-product')

	if (!isOnProductDetail) return

	/**
	 * Získá konfiguraci pořadí variant z selectu
	 *
	 * @param {string} selector - ID nebo class selectu
	 * @returns {Array} - Pole s pořadím variant
	 */
	const getVariantsOrderConfiguration = (selector) => {
		const select = document.querySelector(selector)
		let order = []

		if (select) {
			const options = select.querySelectorAll('option')

			if (options) {
				options.forEach((option) => {
					if (option.value !== '') {
						order.push(option.value)
					}
				})
			}
		}
		return order
	}

	/**
	 * Vytvoří HTML tlačítka z variant
	 *
	 * @param {string} selector - ID nebo class selectu
	 * @returns {Array} - Pole s HTML tlačítky
	 */
	const getButtons = (selector) => {
		const element = document.querySelector(selector)
		let buttons = []

		if (!element) return

		const elements = document.querySelectorAll('.hidden-split-parameter')
		const elementsCount = elements.length
		const isSingleElement = elementsCount === 1

		// Pokud jsou na výběr jen varianty jednoho parametru
		if (isSingleElement) {
			const id = element.getAttribute('data-parameter-id')
			const variants = shoptet.variantsSplit.necessaryVariantData

			const isSelect = element.tagName === 'SELECT'

			// Pokud je parametr typu select
			if (isSelect) {
				const options = element.querySelectorAll('option')

				if (!options) return

				options.forEach((option) => {
					const value = option.value
					const hasNoValue = option.value === ''

					if (hasNoValue) return

					const optionId = id + '-' + value
					const isAvailable = variants[optionId].isNotSoldOut && !soldoutArray.includes(variants[optionId].availabilityName)

					let classes = option.getAttribute('class') ?? ''
					const title = option.innerText

					if (value === element.value) {
						classes += ' active'
					}

					buttons.push(`
                            <div onclick="mimeSplittedVariantsClick(this, true)" class="select-option available-${isAvailable} ${classes}" data-parameter-id="${id}" data-option-value="${value.trim()}">
                                ${title}
                            </div>
                        `)
				})

				const buttonOrder = getVariantsOrderConfiguration(selector)
				const regex = /data-option-value="(.*?)"/

				let finalButtons = []

				buttons.forEach((button) => {
					const result = regex.exec(button.toString())
					buttonOrder.forEach((order) => {
						if (result && result[1] === order) {
							finalButtons.push(button)
						}
					})
				})

				buttons = finalButtons
			} else {
				// Pokud je parametr typu radio
				const options = element.querySelectorAll('.advanced-parameter')
				element.classList.add('radio')

				if (!options) return

				options.forEach((option) => {
					const value = option.querySelector('input').value
					const hasNoValue = option.querySelector('input').value === ''
					const style = option.querySelector('.advanced-parameter-inner').getAttribute('style')

					if (hasNoValue) return

					const optionId = id + '-' + value
					const isAvailable = variants[optionId].isNotSoldOut

					let classes = option.getAttribute('class') ?? ''
					const title = option.querySelector('.parameter-value').innerText

					if (option.querySelector('input').checked) {
						classes += ' active'
					}

					buttons.push(`
                            <div onclick="mimeSplittedVariantsClick(this, true)" class="select-option available-${isAvailable} ${classes} isRadio" data-parameter-id="${id}" data-option-value="${value.trim()}" style="${style}">
                                ${title}
                            </div>
                        `)
				})
			}
		} else {
			// Pokud jsou na výběr varianty více parametrů
			const id = element.getAttribute('data-parameter-id')
			const availableVariants = shoptet.variantsSplit.necessaryVariantData
			const isSelect = element.tagName === 'SELECT'

			// Pokud je parametr typu select
			if (isSelect) {
				const options = element.querySelectorAll('option')

				if (!options) return

				options.forEach((option) => {
					const value = option.value
					const hasNoValue = option.value === ''
					const optionId = id + '-' + value

					if (hasNoValue) return

					let isAvailable = false

					for (const key in availableVariants) {
						if (key.includes(optionId)) {
							if (availableVariants[key].isNotSoldOut) {
								isAvailable = true
								break
							}
						}
					}

					let classes = option.getAttribute('class') ?? ''
					const title = option.innerText

					if (value === element.value) {
						classes += ' active'
					}

					buttons.push(`
                            <div onclick="mimeSplittedVariantsClick(this, true)" class="select-option available-${isAvailable} ${classes}" data-parameter-id="${id}" data-option-value="${value.trim()}">
                                ${title}
                            </div>
                        `)
				})

				const buttonOrder = getVariantsOrderConfiguration(selector)
				const regex = /data-option-value="(.*?)"/
				let finalButtons = []

				buttons.forEach((button) => {
					const result = regex.exec(button.toString())
					buttonOrder.forEach((order) => {
						if (result && result[1] === order) {
							finalButtons.push(button)
						}
					})
				})

				buttons = finalButtons
			} else {
				// Pokud je parametr typu radio
				const options = element.querySelectorAll('.advanced-parameter')
				element.classList.add('radio')

				if (!options) return

				options.forEach((option) => {
					const value = option.querySelector('input').value
					const hasNoValue = option.querySelector('input').value === ''
					const style = option.querySelector('.advanced-parameter-inner').getAttribute('style')
					const optionId = id + '-' + value

					if (hasNoValue) return

					let isAvailable = false

					for (const key in availableVariants) {
						if (key.includes(optionId)) {
							if (availableVariants[key].isNotSoldOut) {
								isAvailable = true
								break
							}
						}
					}

					let classes = option.getAttribute('class') ?? ''
					const title = option.querySelector('.parameter-value').innerText

					if (option.querySelector('input').checked) {
						classes += ' active'
					}

					buttons.push(`
                            <div onclick="mimeSplittedVariantsClick(this, true)" class="select-option available-${isAvailable} ${classes} isRadio" data-parameter-id="${id}" data-option-value="${value.trim()}" style="${style}">
                                ${title}
                            </div>
                        `)
				})
			}
		}

		return buttons
	}

	/**
	 * Přidá tlačítka do DOM
	 *
	 * @param {string} selector - ID nebo class selectu
	 */
	const addSelectButtons = (selector) => {
		if (selector === '' || selector === null) return

		const element = document.querySelector(selector)

		if (element && !element.classList.contains('hide')) {
			element.classList.add('hide')
		}

		const parent = element ? element.parentElement : null
		const buttons = getButtons(selector)

		if (parent && buttons) {
			const variantList = parent.closest('.variant-list')

			if (variantList) {
				const buttonsContent = variantList.querySelector('.selectButtonsContent')

				if (buttonsContent) {
					buttonsContent.remove()
				}

				const newButtonsContent = document.createElement('div')
				newButtonsContent.classList.add('selectButtonsContent')
				newButtonsContent.setAttribute('data', selector.replace('#', ''))

				parent.append(newButtonsContent)

				buttons.forEach((button) => {
					newButtonsContent.innerHTML += button
				})

				const message = document.querySelector('.msg.msg-error')?.innerText
				const errorMessage = error

				if (message === errorMessage) {
					const activeParamBtn = newButtonsContent.querySelector('.select-option.active')

					if (activeParamBtn) {
						activeParamBtn.classList.add('available-false')
					}
				}
			}
		}
	}

	const parameters = document.querySelectorAll('.hidden-split-parameter')

	parameters.forEach((parameter) => {
		addSelectButtons(`#${parameter.getAttribute('id')}`)
	})
}

/**
 * Funkce pro kliknutí na tlačítko
 *
 * @param {element} button - Kliknuté tlačítko
 */
function mimeSplittedVariantsClick(button) {
	const id = button.getAttribute('data-parameter-id')
	const value = button.getAttribute('data-option-value')
	const variant = id + '-' + value

	const otherOptions = document.querySelectorAll('.selectButtonsContent:not([data="parameter-id-' + id + '"]) .select-option')
	const availableVariants = shoptet.variantsSplit.necessaryVariantData
	const isRadio = button.classList.contains('isRadio')

	// Pokud je kliknutá varianta radio
	if (isRadio) {
		const radio = document.querySelector('.parameter-id-' + id + ' input[value="' + value + '"]')
		const otherActives = document.querySelectorAll('.selectButtonsContent:not([data="parameter-id-' + id + '"]) .select-option.active')

		if (radio) {
			radio.checked = true
		}

		otherActives.forEach((active) => {
			active.click()
		})
	} else {
		// Pokud je kliknutá varianta select
		const element = document.querySelector('.parameter-id-' + id)

		if (!element) return

		element.value = value

		const selectElement = document.querySelector('select[data-parameter-id="' + id + '"]')

		if (!selectElement) return

		const options = selectElement.querySelectorAll('option')

		options.forEach(function (option) {
			if (option.value == value) {
				option.selected = true
			}
		})

		const event = new Event('change', { bubbles: true })
		selectElement.dispatchEvent(event)
	}

	// Ošetření ostatních variant
	otherOptions.forEach((option) => {
		const optionId = option.getAttribute('data-option-value')
		const parameter = option.getAttribute('data-parameter-id')
		const checkValue = parameter + '-' + optionId

		let isAvailable = false

		for (const key in availableVariants) {
			if (key.includes(checkValue) && key.includes(variant)) {
				if (availableVariants[key].isNotSoldOut) {
					isAvailable = true
					break
				}
			}
		}

		option.classList.remove('available-true', 'available-false')
		option.classList.add('available-' + isAvailable)
	})

	// Zobrazení aktivního tlačítka
	const options = document.querySelectorAll('[data="parameter-id-' + id + '"] .select-option')

	options.forEach((option) => {
		option.classList.remove('active')
	})

	button.classList.add('active')
}
