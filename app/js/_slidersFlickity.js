function homepageSlidersFlickity() {
	const mimeSlider1El = document.querySelector(`.products-${sliderHP1_id}`)
	if (mimeSlider1El) {
		var mimeSlider1 = new Flickity(mimeSlider1El, {
			cellAlign: 'left',
			contain: true,
			freeScroll: true,
			pageDots: false,
			adaptiveHeight: false,
			lazyLoad: true,
			wrapAround: false,
			groupCells: true,
			imagesLoaded: true,
		})
	}

	const mimeSlider2El = document.querySelector(`.products-${sliderHP2_id}`)
	if (mimeSlider2El) {
		var mimeSlider2 = new Flickity(mimeSlider2El, {
			cellAlign: 'left',
			contain: true,
			freeScroll: true,
			pageDots: false,
			adaptiveHeight: false,
			lazyLoad: true,
			groupCells: true,
			imagesLoaded: true,
		})
	}
}

function relateProductsFlickity() {
	const mimeSliderEl = document.querySelector('.products-block--mime')

	if (mimeSliderEl) {
		var mimeRelatedProducts = new Flickity(mimeSliderEl, {
			cellAlign: 'left',
			contain: true,
			freeScroll: true,
			pageDots: false,
			adaptiveHeight: false,
			lazyLoad: true,
			wrapAround: false,
			groupCells: true,
			imagesLoaded: true,
		})
	}
}
