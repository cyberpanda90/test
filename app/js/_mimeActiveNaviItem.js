/**
 * Mime Active Navi Item v1.0.0
 * Na úrovni kategorie, subkategorie či produktu označí aktivní položku v hlavní navigaci
 * třídou .active
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

function mimeActiveNaviItem() {
	const items = document.querySelectorAll('.menu-level-1 > li > a')
	const url = window.location.href
	const breadcrumb = document.querySelector('#navigation-1 a')
	const breadcrumbLink = breadcrumb ? breadcrumb.href : ''

	items.forEach((item) => {
		let isActive = false

		const currentUrl = item.href

		if (url.includes(currentUrl) || breadcrumbLink.includes(currentUrl)) {
			isActive = true
		}

		if (!isActive) return

		item.closest('li').classList.add('active')

		// Add special class for underlining
		// NOT a part of the original function !!
		item.closest('.menu-level-1').classList.add('underlined')
	})
}
