/**
 * MIME ADD FAVOURITE ICON INTO HEADER
 * Vloží ikonu oblíbených do hlavičky
 *
 * @param {string} url - URL stránky oblíbených
 */
function mimeAddFavouriteIconIntoHeader(url) {
	// Vytvoří ikonu pro hlavičku
	const headerIcon = `<a href="${url}" class="favourite"><i class="favourite_icon"></i></a>`
	const navigationButtons = document.querySelector('.navigation-buttons')
	const headerPosition = navigationButtons.querySelector('a[data-target="search"]')

	// Zkontroluje, jestli už ikona v hlavičce je
	const isInHeader = navigationButtons.querySelector('.favourite')

	// Pokud ne, vloží ikonu do hlavičky
	if (!isInHeader) {
		headerPosition.insertAdjacentHTML('afterend', headerIcon)
	}

	mimeAddFavouriteCountIntoHeader()
}

/**
 * MIME ADD FAVOURITE COUNT INTO HEADER
 * Vloží počet produktů v oblíbených do ikony
 */
function mimeAddFavouriteCountIntoHeader() {
	// Načte informace z localstorage
	const localData = localStorage.getItem('mimeFavouriteProducts')
	const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
	const localLength = localArray ? localArray.length : 0

	// Pokud localData existuje a obsahuje alespoň jeden produkt, zobrazí počet produktů v oblíbených
	if (localLength > 0) {
		document.querySelector('.favourite_icon').innerHTML = `<span class="number">${localLength}</span>`
	} else {
		document.querySelector('.favourite_icon').innerHTML = ''
	}
}

/**
 * MIME ADD FAVOURITE ICON ON PRODUCT DETAIL
 * Vloží tlačítko Přidat do oblíbených na stránku produktu
 */
function mimeAddFavouriteIconOnProductDetail() {
	// Wrapper pro tlačítko Přidat do oblíbených
	const cartBtnBlockEl = document.querySelector('.p-data-wrapper .p-to-cart-block')

	// Tlačítko Přidat do oblíbených
	const favouriteIcon = `<div class="favourite-detail"><p class="btn_toggle"><span class="favourite"><i class="add_favourite"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17"><path d="M21.317,3.761a5.581,5.581,0,0,0-8.14,0L12,4.994l-1.177-1.23a5.581,5.581,0,0,0-8.14,0,6.211,6.211,0,0,0,0,8.5L3.862,13.5v0L12,22h0l8.138-8.5v0l1.177-1.23A6.211,6.211,0,0,0,21.317,3.761Z" data-id="317"></path></svg></i></span></p></div>`

	// Zkontroluje, zda cartBtnBlockEl již obsahuje tlačítko Přidat do oblíbených
	const hasFavouriteIcon = cartBtnBlockEl.querySelector('.favourite-detail')

	// Pokud ne, vloží tlačítko Přidat do oblíbených
	if (!hasFavouriteIcon) {
		cartBtnBlockEl.insertAdjacentHTML('beforeend', favouriteIcon)
	}

	// Data z localstorage
	const localData = localStorage.getItem('mimeFavouriteProducts')
	const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
	const localLength = localArray.length

	// Získá ID produktu
	const dataId = getShoptetDataLayer().product.id

	let index = -1

	// Projde všechny produkty v objektu oblíbených
	for (let i = 0; i < localLength; i++) {
		// Pokud je produkt v objektu oblíbených, nastaví index na index produktu
		if (localArray[i].id === dataId) {
			index = i

			// Přidá třídu pro aktivní tlačítko
			document.querySelector('.favourite-detail').classList.add('fav-yes')

			// Přeruší cyklus
			break
		}
	}

	// Přidá tlačítku Přidat do oblíbených event listener pro kliknutí
	mimeAddProductToFavouritesFromProductDetailPage()
}

/**
 * MIME ADD PRODUCT TO FAVOURITES FROM PRODUCT DETAIL PAGE
 * Umožní přidat produkt do oblíbených ze stránky produktu
 */
function mimeAddProductToFavouritesFromProductDetailPage() {
	// Tlačítko Přidat do oblíbených
	const btn = document.querySelector('.favourite-detail')

	// Přidá event listener pro kliknutí
	btn.addEventListener('click', () => {
		// Získá ID produktu
		const dataId = getShoptetDataLayer().product.id

		// Data z localstorage
		const localData = localStorage.getItem('mimeFavouriteProducts')
		const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
		const localLength = localArray.length

		let index = -1

		// Projde všechny produkty v objektu oblíbených
		for (let i = 0; i < localLength; i++) {
			// Pokud je produkt v objektu oblíbených, nastaví index na index produktu
			if (localArray[i].id === dataId) {
				index = i

				// Přeruší cyklus
				break
			}
		}

		// Pokud je produkt v oblíbených
		if (index !== -1) {
			// Odstraní produkt z objektu oblíbených
			localArray.splice(index, 1)

			// Odebere třídu pro aktivní tlačítko
			document.querySelector('.favourite-detail').classList.remove('fav-yes')
		} else {
			// Pokud není produkt v oblíbených, přidá ho do objektu oblíbených
			const id = getShoptetDataLayer().product.id
			const link = window.location.href
			const name = getShoptetDataLayer().product.name
			const image = document.querySelector('.p-image-mime > .p-main-image:first-child img').getAttribute('src')

			// Vytvoří objekt produktu
			const productObject = {
				id: id,
				title: name,
				slug: link,
				image: image,
			}

			// Přidá objekt produktu do objektu oblíbených
			localArray.push(productObject)

			// Přidá třídu pro aktivní tlačítko
			document.querySelector('.favourite-detail').classList.add('fav-yes')
		}

		// Uloží aktualizovaný objekt oblíbených do localstorage
		localStorage.setItem('mimeFavouriteProducts', JSON.stringify(localArray))

		// Aktualizuje číslovku v ikoně oblíbených v hlavičce
		mimeAddFavouriteCountIntoHeader()
	})
}

/**
 * MIME ADD FAVOURITE ICON ON PRODUCT CARDS
 * Vloží tlačítko Přidat do oblíbených na kartu produktu
 */
function mimeAddFavouriteIconOnProductCards() {
	// Všechny .product elementy
	const products = document.querySelectorAll('.product')

	// Data z localstorage
	const localData = localStorage.getItem('mimeFavouriteProducts')
	const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
	const localLength = localArray.length

	// Projde všechny .product elementy
	products.forEach((product) => {
		const cartBtnBlockEl = product.querySelector('.p')

		// Získá ID produktu
		const dataId = parseInt(cartBtnBlockEl.getAttribute('data-micro-product-id'))

		// Tlačítko Přidat do oblíbených
		const favouriteIcon = `<span class="favourite"><i class="add_favourite"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M21.317,3.761a5.581,5.581,0,0,0-8.14,0L12,4.994l-1.177-1.23a5.581,5.581,0,0,0-8.14,0,6.211,6.211,0,0,0,0,8.5L3.862,13.5v0L12,22h0l8.138-8.5v0l1.177-1.23A6.211,6.211,0,0,0,21.317,3.761Z" class="btn_toggle" onClick="mimeAddProductToFavouritesFromProductCard(this)" data-id="317"></path></svg></i></span>`

		// Zkontroluje, zda cartBtnBlockEl již obsahuje tlačítko Přidat do oblíbených
		const hasFavouriteIcon = cartBtnBlockEl.querySelector('.favourite')

		// Pokud ne, vloží tlačítko Přidat do oblíbených
		if (!hasFavouriteIcon) {
			cartBtnBlockEl.insertAdjacentHTML('beforeend', favouriteIcon)
		}

		let index = -1

		// Projde všechny produkty v objektu oblíbených
		for (let i = 0; i < localLength; i++) {
			// Pokud je produkt v objektu oblíbených, nastaví index na index produktu
			if (localArray[i].id === dataId) {
				index = i

				// Přidá třídu pro aktivní tlačítko
				product.classList.add('fav-active')

				// Přeruší cyklus
				break
			}
		}
	})
}

/**
 * MIME ADD PRODUCT TO FAVOURITES FROM PRODUCT CARD
 * Umožní přidat produkt do oblíbených z karty produktu
 */
function mimeAddProductToFavouritesFromProductCard(e) {
	// Kliknutý produkt wrapper
	const product = e.closest('.product')

	// Získá ID produktu
	const dataId = parseInt(product.querySelector('.p').getAttribute('data-micro-product-id'))

	// Data z localstorage
	const localData = localStorage.getItem('mimeFavouriteProducts')
	const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
	const localLength = localArray.length

	let index = -1

	// Projde všechny produkty v objektu oblíbených
	for (let i = 0; i < localLength; i++) {
		// Pokud je produkt v oblíbených, odstraní ho z objektu oblíbených
		if (localArray[i].id === dataId) {
			index = i

			// Přeruší cyklus
			break
		}
	}

	// Pokud je produkt v oblíbených
	if (index !== -1) {
		// Odstraní produkt z objektu oblíbených
		localArray.splice(index, 1)

		// Odebere třídu pro aktivní tlačítko
		product.classList.remove('fav-active')
	} else {
		// Pokud není produkt v oblíbených, přidá ho do objektu oblíbených
		const id = parseInt(product.querySelector('.p').getAttribute('data-micro-product-id'))
		const link = product.querySelector('.p a').getAttribute('href')
		const name = product.querySelector('.p a.name').textContent.trim()
		const image = product.querySelector('.image img').getAttribute('src')

		// Vytvoří objekt produktu
		const productObject = {
			id: id,
			title: name,
			slug: link,
			image: image,
		}

		// Přidá objekt produktu do objektu oblíbených
		localArray.push(productObject)

		// Přidá třídu pro aktivní tlačítko
		product.classList.add('fav-active')
	}

	// Uloží aktualizovaný objekt oblíbených do localstorage
	localStorage.setItem('mimeFavouriteProducts', JSON.stringify(localArray))

	// Aktualizuje číslovku v ikoně oblíbených v hlavičce
	mimeAddFavouriteCountIntoHeader()
}

/**
 * MIME FAVOURITES PAGE
 * Vytvoří stránku oblíbených produktů
 */
function mimeFavouritesPage(emptyText) {
	// Data z localstorage
	const localData = localStorage.getItem('mimeFavouriteProducts')
	const localArray = JSON.parse(localData) ? JSON.parse(localData) : []
	const localLength = localArray.length

	// Wrapper pro produkty
	const wrapper = document.querySelector('.content-inner article > div')
	const wrapperBox = `<div class="products-block"></div>`

	// Vloží wrapper pro produkty
	wrapper.insertAdjacentHTML('beforeend', wrapperBox)

	const wrapperProducts = document.querySelector('.products-block')

	// Pokud je v localstorage alespoň jeden produkt
	if (localLength > 0) {
		// Projde všechny produkty v objektu oblíbených
		for (let i = 0; i < localLength; i++) {
			// Získá data produktu
			const id = localArray[i].id
			const link = localArray[i].slug
			const name = localArray[i].title
			const image = localArray[i].image

			// Vytvoří HTML pro produkt
			const productHTML = `
				<div class="product">
					<div class="p" data-micro-product-id="${id}">
						<a href="${link}" title="${name}">
							<img src="${image}" alt="${name}">
						</a>
						<div class="p-in">
							<div class="p-in-in">
								<a href="${link}" title="${name}" class="name">
									${name}
								</a>
							</div>
						</div>
					</div>
				</div>`

			// Vloží produkt do stránky
			wrapperProducts.insertAdjacentHTML('beforeend', productHTML)
		}

		// Vloží tlačítko Přidat do košíku na kartu produktu
		mimeAddFavouriteIconOnProductCards()
	} else {
		// Pokud v localstorage nejsou žádné produkty, vypíše hlášku
		wrapperProducts.innerHTML = `<p class="no-favourites">${emptyText}</p>`
	}
}

/**
 * MIME FAVOURITE
 * Přidá do projektu možnost ukládání oblíbených produktů a jejich zobrazování
 *
 * @param {string} url - URL stránky oblíbených
 * @param {string} url_class - Třída stránky oblíbených
 * @param {string} emptyText - Text, který se zobrazí, pokud uživatel nemá žádné oblíbené produkty
 */
function mimeFavouriteProducts(url, url_class, emptyText) {
	// Zkontroluje, na jaké stránce se uživatel nachází
	const isOnProductDetail = document.body.classList.contains('type-detail')
	const isOnFavouritesPage = document.body.classList.contains(url_class)

	// Vloží ikonu oblíbených do hlavičky
	mimeAddFavouriteIconIntoHeader(url)

	// Vloží tlačítko Přidat do oblíbených na karty produktu
	mimeAddFavouriteIconOnProductCards()

	// Pokud je uživatel na stránce produktu
	if (isOnProductDetail) {
		// Vloží tlačítko Přidat do oblíbených k prohlíženému produktu
		mimeAddFavouriteIconOnProductDetail()
	}

	// Pokud je uživatel na stránce oblíbených
	if (isOnFavouritesPage) {
		// Vytvoří stránku oblíbených produktů
		mimeFavouritesPage(emptyText)
	}

	// Odebere produkt z oblíbených na stránce Oblíbené
	if (isOnFavouritesPage) {
		const products = document.querySelectorAll('.product');
		products.forEach(product => {
			const favouriteIcon = product.querySelector('.favourite');
			favouriteIcon.addEventListener('click', () => {
				product.remove();
			});
		});
	}
}
