$(document).ready(function () {
	const myCarousels = $('.carousel')

	myCarousels.each(function (index, element) {
		const myCarousel = $('#' + $(element).attr('id'))
		myCarousel.append("<ol class='carousel-indicators'></ol>")

		const indicators = $(
			'#' + $(element).attr('id') + ' .carousel-indicators'
		)
		$('#' + $(element).attr('id') + ' .carousel-inner')
			.children('.item')
			.each(function (index) {
				index === 0
					? indicators.append(
							"<li data-target='#" +
								$(element).attr('id') +
								"' data-slide-to='" +
								index +
								"' class='active'></li>"
					  )
					: indicators.append(
							"<li data-target='#" +
								$(element).attr('id') +
								"' data-slide-to='" +
								index +
								"'></li>"
					  )
			})
	})
})
