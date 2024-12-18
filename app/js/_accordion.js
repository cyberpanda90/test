const mimeAccordionItems = document.querySelectorAll('.accordion-item')

mimeAccordionItems.forEach((item) => {
	const trigger = item.querySelector('.accordion-trigger')
	const content = item.querySelector('.accordion-content')

	trigger.addEventListener('click', () => {
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			item.classList.remove('active')
		} else {
			content.style.maxHeight = content.scrollHeight + 'px'
			item.classList.add('active')
		}
	})
})
