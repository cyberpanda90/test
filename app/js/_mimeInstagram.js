/**
 * Mime Instagram v1.0.0
 * Zobrazí Instagramový widget nad patičkou v našem originálním designu
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

/**
 *
 * @param {string} headline - Nadpis widgetu, zobrazuje se vlevo nad widgetem
 * @param {string} headlineUser - Uživatelské jméno Instagramu, doplní se jím URL odkaz na konci nadpisu
 * @param {string} headlineLinkText - Text odkazu, který je na konci nadpisu
 * @param {string} btnText - Text tlačítka "Zobrazit profil", zobrazuje se vpravo nad widgetem
 */

function mimeInstagram(user, headline, linkText, btnText) {
	// Vytvoří nadpis widgetu
	const headlineHtml = `<div>${headline} <a href="https://www.instagram.com/${user}/" target="_blank">${linkText}</a></div>`

	// Ověří, zda je Instagram na stránce dostupný, pokud ne, funkce se ukončí
	const hasInstagram = document.querySelector('.custom-footer__instagram')
	if (!hasInstagram) return

	// Vytvoří element pro vložení nadpisu a vloží ho do widgetu
	const headlineEl = document.createElement('div')
	headlineEl.innerHTML = headlineHtml

	const headlineTitle = document.querySelector('.custom-footer__instagram > h4')
	headlineTitle?.appendChild(headlineEl)

	// Vytvoří sloupcový layout pro widget
	function splitInstagramWrapIntoContainers() {
		// Vyhledá původní kontejner widgetu, nebo ukončí funkci
		const originalContainer = document.querySelector('.instagram-widget')
		if (!originalContainer) return

		// Sesbírá všechny Instagramové obrázky
		const elements = originalContainer.querySelectorAll('a:not(.instagram-follow-btn a)')

		// Vytvoří kontejnery, do kterých se obrázky vloží
		const containerClasses = ['ig-container-1', 'ig-container-2', 'ig-container-3', 'ig-container-4']

		const containers = []

		containerClasses.forEach((className) => {
			const container = document.createElement('div')
			container.classList.add(className)
			originalContainer.appendChild(container)
			containers.push(container)
		})

		// Rozdělí obrázky do kontejnerů
		elements.forEach((element, index) => {
			const containerIndex = Math.floor(index / 2)
			containers[containerIndex]?.appendChild(element)
		})
	}

	// Přemístí widget nad patičku
	function moveInstagramBanner() {
		const instagramEl = document.querySelector('.custom-footer__instagram')
		const contentWrapperEl = document.getElementById('content')

		const followParentEl = document.querySelector('.instagram-widget')
		const followEl = document.querySelector('.instagram-follow-btn')
		const followTextEl = document.querySelector('.instagram-follow-btn a')

		if (instagramEl && contentWrapperEl && followParentEl && followEl && followTextEl) {
			contentWrapperEl.appendChild(instagramEl)
			followParentEl.parentNode.insertBefore(followEl, followParentEl)
			followTextEl.textContent = btnText
		}
	}

	splitInstagramWrapIntoContainers()
	moveInstagramBanner()
}
