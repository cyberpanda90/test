function mimeWelcomeBg() {
	const welcomeWrapper = document.querySelector('.welcome-wrapper')
	const firstImage = welcomeWrapper.querySelector('img')

	if (firstImage) {
		const imageUrl = firstImage.src

		welcomeWrapper.style.backgroundImage = `url(${imageUrl})`
	}
}
