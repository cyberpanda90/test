if ($('#category-header').length) {
	function mhfiltr() {
		$('.filters-unveil-button-wrapper a[data-text="Zavřít filtr"]').text(
			'Filtrování'
		)
		if (!$('#category-filter-hover').length) {
			$('.filter-sections').append(
				'<div id="category-filter-hover"></div>'
			)
		}
		$('#category-header form')
			.appendTo('.filters-wrapper')
			.wrap('<div id="category-header" class="category-header"></div>')
		if ($('.filter-title').length === 0) {
			$('.filter-sections').before('<div class="filter-title"><span class="title">Filtrování:</span><span class="triangle"></span></div>');
		}			
		// Přidá třídu 'filter-section' k prvku '.slider-wrapper', pokud už nebyla přidána
		$('.slider-wrapper').addClass('filter-section');

		// Přesune '.slider-wrapper' pouze pokud ještě není v cílovém elementu
		if ($('.filter-sections #category-filter-hover .slider-wrapper').length === 0) {
			$('.slider-wrapper').appendTo('.filter-sections #category-filter-hover');
		}

		// Přidá 'price-filter' pouze pokud ještě neexistuje
		if ($('.slider-wrapper .price-filter').length === 0) {
			$('.slider-wrapper').append('<div class="price-filter"></div>');
		}

		// Přesune '.slider-header' do '.price-filter', pokud ještě nebyl přesunut
		if ($('.price-filter .slider-header').length === 0) {
			$('.slider-wrapper .slider-header').appendTo('.price-filter');
		}

		// Přesune '.slider-content' do '.price-filter', pokud ještě nebyl přesunut
		if ($('.price-filter .slider-content').length === 0) {
			$('.slider-wrapper .slider-content').appendTo('.price-filter');
		}

		$('.filter-section h4').click(function () {
			$('.filter-section')
				.not($(this).closest('.filter-section'))
				.removeClass('open')
			$(this).closest('.filter-section').toggleClass('open')
		})
		$(function () {
			var loc = window.location.href
			if (/priceMin/.test(loc)) {
				$('body').addClass('cena-yes')
			}
		})

		// if window location contains "priceMin" add class "price-sorting" to body
		if (window.location.href.indexOf('priceMin') > -1) {
			$('.vybrane-filtry').addClass('aktivni-filtr')
		}
	}

	["ShoptetDOMContentLoaded", "ShoptetDOMPageMoreProductsLoaded", "ShoptetPageSortingChanged"].forEach((event) => {
        document.addEventListener(event, function () {
            mhfiltr();
        });
    });

	mhfiltr();
}

function appendSliderFilters() {
	const filterSections = document.querySelectorAll(
		'.filter-section.has-parametric-slider'
	)
	const activeFilters = document.querySelector('.vybrane-filtry')

	for (const section of filterSections) {
		const sectionLabels = section.querySelectorAll('.filter-label.active')

		if (sectionLabels.length) {
			const activeFilter = getActiveFilter(section)
			const { paramId, fromValue, toValue, paramName, unit } =
				activeFilter
			const filterTemplate = createActiveFilter(
				paramId,
				fromValue,
				toValue,
				paramName,
				unit
			)

			activeFilters.insertAdjacentHTML('afterbegin', filterTemplate)
		}
	}
}

function removeActiveSliderFilter() {
	const filters = document.querySelectorAll('.vybrane-filtry .slider-filter')

	if (filters.length) {
		for (const filter of filters) {
			filter.addEventListener('click', () => {
				const id = filter.getAttribute('data-id')
				// find param id and its every parameter until different param (&) or end of URL
				const regex = new RegExp(`${id}=[^&]*(&|$)`, 'g')
				const updatedUrl = window.location.href.replace(regex, '')
				document.location.href = updatedUrl
			})
		}
	}
}

function selectedFilters() {
	const selectedFiltersWrapper = $('.vybrane-filtry')
	if (innerWidth < 768) {
		$(selectedFiltersWrapper).appendTo('#filters-wrapper .filters-wrapper')
	} else {
		$(selectedFiltersWrapper).insertAfter(
			'#filters-wrapper .filters-wrapper'
		)
	}
}
