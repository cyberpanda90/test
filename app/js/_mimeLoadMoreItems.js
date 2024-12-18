function mimeLoadMoreItems(wrapper, pageClass, item, btnText, noItemsText, srTextNext, srTextPrev, pageSlug) {
	// Get current page number and current url
	let currentLocation = window.location.href
	let currentPage = extractPageNumber(currentLocation)
	let currentUrl = removeLastPart(currentLocation)

	// Get the first and the last page
	const paginationWrapperEl = document.querySelector('.pagination-wrapper')
	if (!paginationWrapperEl) return

	const paginationEl = paginationWrapperEl.querySelector('.pagination')
	if (!paginationEl) return

	const paginationLastNum = paginationEl.lastElementChild.textContent
	const isEnd = currentPage == paginationLastNum

	// Check if there should be the loadmore button
	const body = document.querySelector('body')
	const wrapperEl = document.querySelector(wrapper)
	const isEnabled = body.classList.contains(pageClass) && wrapperEl.querySelectorAll(item).length && !isEnd

	if (isEnabled) {
		// Create the button element
		const loadMoreButton = document.createElement('a')
		Object.assign(loadMoreButton, {
			href: '#',
			id: 'mime-load-more-items-button',
			className: 'btn btn-primary',
			textContent: btnText,
		})

		// Insert the button after the wrapperEl element
		wrapperEl.insertAdjacentElement('afterend', loadMoreButton)

		// Load the items
		function mimeLoadMoreItemsGetFc() {
			currentLocation = window.location.href
			currentPage = extractPageNumber(currentLocation)
			currentUrl = removeLastPart(currentLocation)

			const pageNext = currentPage + 1
			const url = `${currentUrl}/${pageSlug}-${pageNext}/`
			const xhr = new XMLHttpRequest()

			xhr.open('GET', url)
			xhr.onload = function () {
				// Get the items if the status is 200 OK
				if (xhr.status === 200) {
					const response = xhr.responseText

					// Create temporary element to store the response
					const tempDiv = document.createElement('div')
					tempDiv.innerHTML = response
					const posts = tempDiv.querySelectorAll(item)

					let page = currentPage

					// If there are some items in the response, append all inside the wrapper element
					if (posts.length > 0) {
						posts.forEach((post) => wrapperEl.appendChild(post))
						page++
						const newUrl = currentUrl + (page == 2 ? '' : '/') + pageSlug + '-' + page + '/'
						replaceURL(newUrl)
						updatePagination()
					} else {
						// If there are no items, show noItemsText and remove the button
						loadMoreButton.insertAdjacentHTML('afterend', `<p>${noItemsText}</p>`)
						loadMoreButton.remove()
					}
				} else {
					// Log error if status is not 200 OK
					console.error(trans('ERROR.LOADMORE'))
				}
			}

			// If has error
			xhr.onerror = function () {
				console.error(trans('ERROR.LOADMORE'))
			}

			xhr.send()
		}

		// Add listener to the loadMore button
		loadMoreButton.addEventListener('click', function (e) {
			mimeLoadMoreItemsGetFc()
			e.preventDefault()
		})
	}

	// Update pagination HTML
	function updatePagination() {
		currentLocation = window.location.href
		currentPage = extractPageNumber(currentLocation)
		currentUrl = removeLastPart(currentLocation)

		const pageNext = currentPage + 1
		const pagePrev = currentPage - 1
		const nextPage = currentUrl + '/' + pageSlug + '-' + pageNext + '/'
		const prevPage = currentUrl + '/' + pageSlug + '-' + pagePrev + '/'

		const isFirstPage = currentPage === 1
		const isLastPage = currentPage == paginationLastNum

		// Create HTML elements
		const prevButton = `
            <a class="prev pagination-link" href="${prevPage}">
                <span class="sr-only">${srTextPrev}</span>
            </a>
        `

		const nextButton = `
            <a class="next pagination-link" href="${nextPage}">
                <span class="sr-only">${srTextNext}</span>
            </a>
        `

		const firstButton = `
            <a href="${currentUrl}/${pageSlug}-1/">1</a>
        `

		const lastButton = `
            <a href="${currentUrl}/${pageSlug}-${paginationLastNum}/">
                ${paginationLastNum}
            </a>
        `

		const currentButton = `<strong class="current">${currentPage}</strong>`

		// Render the right elements for the current state
		if (isFirstPage) {
			paginationEl.innerHTML = `
                <strong class="current">1</strong>
                ${prevButton}
                ${lastButton}
            `
		}

		if (isLastPage) {
			paginationEl.innerHTML = `
                ${firstButton}
                ${prevButton}
                ${currentButton}
            `
		}

		if (!isFirstPage && !isLastPage) {
			paginationEl.innerHTML = `
                ${firstButton}
                ${prevButton}
                ${currentButton}
                ${nextButton}
                ${lastButton}
            `
		}
	}

	// Get the page number
	function extractPageNumber(url) {
		const regex = new RegExp(pageSlug + '-(\\d+)')
		const match = url.match(regex)

		if (match && match[1]) {
			return parseInt(match[1])
		} else {
			return 1
		}
	}

	// Ged the last part from the url
	function removeLastPart(url) {
		const parts = url.split('/')
		const lastPart = parts[parts.length - 2]

		if (lastPart.includes(pageSlug)) {
			parts.splice(-2, 2)
		}

		return parts.join('/')
	}

	// Replace URL without reloading
	function replaceURL(url) {
		const stateObj = { url: url }
		window.history.replaceState(stateObj, '', url)
	}
}
