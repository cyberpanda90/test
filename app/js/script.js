function init() {
	mimeCopyright(false, false)
	equalHeight()
	mimeMoveParameters()
	mimeSplittedVariants(['Vyprodáno', 'Není skladem'], trans('MODULE.VARIANTS.SOLDOUT'))

	if (window.innerWidth < 576) {
		window.addEventListener('scroll', lazyLoadCookieBar)

		function lazyLoadCookieBar() {
			const cookieBarEl = document.querySelectorAll('.siteCookies')
			Array.from(cookieBarEl).forEach((bar) => {
				bar.style.display = 'block'
			})
		}
	}

	if (isHome) {
		mimeReplaceSlider(`products-${sliderHP1_id}`, ['products-block--mime'], `mimeProducts${sliderHP1_id}`, `#${sliderHP1_wrapper}`)
		mimeReplaceSlider(`products-${sliderHP2_id}`, ['products-block--mime'], `mimeProducts${sliderHP2_id}`, `#${sliderHP2_wrapper}`)
		removeNativeSliders()
		homepageSlidersFlickity()
		mimeInstagram('mime_digital', trans('MODULE.INSTAGRAM.TITLE'), trans('MODULE.INSTAGRAM.LINK'), trans('MODULE.INSTAGRAM.BTN'))
		mimeWelcomeBg()
		// mimeRatingSummary({
		// 	type: 1, 
		// 	fullwidth: true, 
		// 	containerPadding: '82px', 
		// 	customerReviewedUrl: '/user/documents/mime/src/img/logo-overeno-gold.png', 
		// 	reviewsButtonBorderColor: '#2847CA', 
		// 	dateType: 'ago'
		// })
		// mimeRatingSummary({type: 2})
		// mimeRatingSummary({type: 3, 
		// 	fullwidth: true, 
		// 	containerPadding: '82px', 
		// 	showDate: false,
		// 	backgroundImage: '/user/documents/mime/src/img/hodnoceni_bg.png'
		// })
		// mimeRatingSummary({
		// 	type: 4, 
		// 	ratingScoreType: 'percentage', 
		// 	showDate: false, 
		// 	customerReviewedUrl: '/user/documents/mime/src/img/logo-overeno-gold.png'
		// })
		// mimeRatingSummary({
		// 	type: 5, 
		// 	fullwidth: true, 
		// 	containerPadding: '82px', 
		// 	customerReviewedUrl: '/user/documents/mime/src/img/logo-overeno-gold.png', 
		// 	nameIconUrl: '/user/documents/mime/src/icon/profile-circle.svg',
		// 	replaceName: 'Ověřený zákazník',
		// 	ratingScoreType: 'percentage',
		// 	backgroundImage: '/user/documents/mime/src/img/hodnoceni_bg5.png'
		// })
	}

	if (isCategory || isProductDetail) {
		mimeActiveNaviItem()
	}

	if (isProductDetail) {
		mimeMobileProductGallery()
		mimeAdvancedProductGallery()

		let resizeTimer

		function handleProductGalleryOnWindowResize() {
			clearTimeout(resizeTimer)

			resizeTimer = setTimeout(function () {
				mimeMobileProductGallery()
				mimeAdvancedProductGallery()
			}, 200)
		}

		window.addEventListener('resize', handleProductGalleryOnWindowResize)

		addCurrentProductToVariants()
		mimeRelatedProductsAsVariants('Samba', '.p-detail-inner .pr-action', 'variants-wrapper', 'variants-wrapper__list', trans('PRODUCT.VARIANTS'))
		replaceRelatedProductsSlider()
		relateProductsFlickity()
	}

	if (isBlog) {
		mimeLoadMoreItems(
			'#newsWrapper',
			'template-14',
			'.news-item',
			trans('BLOG.BTN.LOADMORE'),
			trans('BLOG.NOITEMS'),
			trans('BLOG.BTN.NEXT'),
			trans('BLOG.BTN.PREV'),
			trans('BLOG.SLUG')
		)

		if (innerWidth > 768) {
			$('#mime-load-more-items-button').insertBefore('.pagination')
		}

		document.addEventListener('ShoptetDOMContentLoaded', function () {
			mimeLoadMoreItems(
				'#newsWrapper',
				'template-14',
				'.news-item',
				trans('BLOG.BTN.LOADMORE'),
				trans('BLOG.NOITEMS'),
				trans('BLOG.BTN.NEXT'),
				trans('BLOG.BTN.PREV'),
				trans('BLOG.SLUG')
			)
		})
	}

	window.onload = function () {
		const header = document.getElementById('header')
		const wrapper = document.getElementById('content-wrapper')

		header.classList.add('loaded')
		wrapper.classList.add('loaded')
	}

	mimeFavouriteProducts(favURL, favClass, favText)
}

init()

document.addEventListener('ShoptetDOMContentLoaded', init)
