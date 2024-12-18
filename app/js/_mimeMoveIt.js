/**
 * Mime Move It v1.0.0
 * Funkce umožňující přemístění obsahu na jiné místo na webové stránce
 * s možností vybrat si metodu umístění a sběr obsahu i výsledný HTML kód.
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

/**
 *
 * @param {string} selector - Element určující pozici nového umístění
 * @param {string} method - Metoda umístění: before, after, prepend, append
 * @param {string} html - HTML se značkou `[val]` určující pozici obsahu v HTML
 * @param {string} original - Element s obsahem, který je potřeba získat
 * @param {string} type - Typ získávané hodnoty: attr, html, text
 * @param {string} value - Název attributu - nepovinné
 */
function mimeMoveIt(selector, method, html, original, type, value, remove) {
	let content

	const originalElement = document.querySelector(original)

	switch (type) {
		case 'attr':
			content = originalElement.getAttribute(value)
			break
		case 'html':
			content = originalElement.innerHTML
			break
		case 'text':
			content = originalElement.textContent
			break
	}

	content = html.replace(/\[val\]/g, content)

	const targetElement = document.querySelector(selector)

	switch (method) {
		case 'before':
			targetElement.insertAdjacentHTML('beforebegin', content)
			break
		case 'after':
			targetElement.insertAdjacentHTML('afterend', content)
			break
		case 'prepend':
			targetElement.insertAdjacentHTML('afterbegin', content)
			break
		case 'append':
			targetElement.insertAdjacentHTML('beforeend', content)
			break
	}

	if (remove) {
		originalElement.remove()
	}
}
