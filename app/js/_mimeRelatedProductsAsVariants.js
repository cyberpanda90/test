/**
 * Mime Related Products As Variants v2.1.0
 * Zobrazuje podobné produkty jako varianty produktu v určené oblasti stránky detailu produktu.
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

/**
 *
 * @param {string} theme - Název používané šablony
 * @param {selector} target - Element, do kterého přemístí podobné produkty jako poslední child
 * @param {string} wrapClass - Název třídy pro nově vznijící div obalující nadpis a div s podobnými produkty
 * @param {string} innerClass - Název třídy pro nově vznikající div, přímý parent podobných produktů uvnitř wrapClass
 * @param {string} heading - Nadpis zobrazený nad podobnými produkty
 */
function mimeRelatedProductsAsVariants(
	theme,
	target,
	wrapClass,
	innerClass,
	heading
) {
	// kontroluje, zda se uživatel nachází na stránce detailu produktu
	const mrpav_isOnProductPage =
		document.body.classList.contains('type-detail')
	if (!mrpav_isOnProductPage) return

	// deklarace proměnných
	let mrpav_wrap = null
	let mrpav_remove = null

	// určuje selektor obalového divu a elementy, které mají být odstraněny, na základě používané šablony
	switch (theme) {
		case 'Classic':
		case 'Step':
		case 'Tango':
		case 'Waltz':
		case 'Techno':
			mrpav_wrap = document.querySelector(
				'#productsAlternative .products-alternative'
			)
			mrpav_remove = document.querySelectorAll(
				'.p-detail-tabs [data-testid="tabAlternativeProducts"], #productsAlternative'
			)
			break
		case 'Samba':
		case 'Disco':
			mrpav_wrap = document.querySelector(
				'.products-alternative-wrapper .products-block'
			)
			mrpav_remove = document.querySelectorAll(
				'.products-alternative-header.products-header, .products-alternative-wrapper'
			)
			break
	}

	// ukončí funkci, pokud obalový div neexistuje
	if (!mrpav_wrap) return

	// získá HTML obalového divu
	const html = mrpav_wrap.innerHTML

	// vytvoří nový div pro vložení obsahu
	const wrap = document.createElement('div')
	wrap.className = wrapClass
	wrap.innerHTML = `
        <strong>${heading}</strong>
        <div class="${innerClass}">
            ${html}
        </div>
    `

	// připojí nový div k cílovému elementu
	document.querySelector(target).appendChild(wrap)

	// vytvoří prázdné sety pro odstranění duplikátů
	const uniqueProductIds = new Set()
	const uniqueProducts = new Set()

	// odstraní duplikáty a nepotřebné elementy
	const products = document.querySelectorAll(`.${wrapClass} .product .p`)

	products.forEach((product) => {
		const productId = product.getAttribute('data-micro-product-id')

		// zkontroluje, zda se jedná o duplikát
		if (uniqueProductIds.has(productId)) {
			return
		}

		uniqueProductIds.add(productId)

		// přidá unikátní element do setu
		const productEl = product.parentNode

		uniqueProducts.add(productEl)
	})

	// vloží unikátní elementy do DOMu
	wrap.innerHTML = `<div class="${innerClass}"></div>`
	const inner = document.querySelector(`.${innerClass}`)

	uniqueProducts.forEach((product) => {
		inner.appendChild(product)
	})

	// odstraní zbytečné originální elementy
	for (var i = 0; i < mrpav_remove.length; i++) {
		mrpav_remove[i].remove()
	}
}
