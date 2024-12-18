function filterBtn() {
	const filterEl = document.createElement('div')
	filterEl.className = 'show-filters btn'
	filterEl.textContent = 'Filtrování a řazení'

	const filterWrapper = document.querySelector('#filters-wrapper')

	if (!filterWrapper) return

	filterWrapper.prepend(filterEl)

	if ($('.vybrane-filtry').length == 0) {
		$('<div class="vybrane-filtry"></div>').insertBefore('#category-header')
		$('.filter-label.active').clone().appendTo('.vybrane-filtry')
		$('.vybrane-filtry .filter-label.active')
			.closest('div')
			.addClass('aktivni-filtr')
		$(
			'.vybrane-filtry .filter-section fieldset div:not(.aktivni-filtr)'
		).remove()
		$('#clear-filters').clone().appendTo('.vybrane-filtry')
		$('#clear-filters').on('click', function () {
			$('body').removeClass('cena-yes')
		})
		setTimeout(function () {
			$('.cena-yes .slider-wrapper').clone().prependTo('.vybrane-filtry')
			$('.vybrane-filtry .slider-wrapper').click(function () {
				document.location.href = String(document.location.href)
					.replace('priceMin', '')
					.replace('priceMax', '')
			})
		}, 10)
	}
}

function showFilters() {
	document.addEventListener('click', function (event) {
		if (event.target.classList.contains('show-filters')) {
			const parent = event.target.parentNode

			if (!parent) return

			parent.classList.toggle('show-filter-mobile')
		}
	})
}

if (isCategory) {
	filterBtn()
	showFilters()
	selectedFilters()
	appendSliderFilters()
	removeActiveSliderFilter()

	addEventListener('ShoptetDOMContentLoaded', function () {
		filterBtn()
		showFilters()
		selectedFilters()
		appendSliderFilters()
		removeActiveSliderFilter()
	})

	addEventListener('ShoptetPageSortingChanged', function () {
		filterBtn()
		showFilters()
		selectedFilters()
		appendSliderFilters()
		removeActiveSliderFilter()
	})
}
