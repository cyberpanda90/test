function mimeHideBracesInSaleInfo() {
	$('.product .p .p-bottom > div .prices .price-save').each(function () {
		$(this).html(function () {
			return $(this).html().replace('(', '')
		})
		$(this).html(function () {
			return $(this).html().replace(')', '')
		})
	})
}

mimeHideBracesInSaleInfo()

window.addEventListener('ShoptetDOMContentLoaded', function () {
	mimeHideBracesInSaleInfo()
})
