// Lazy loading for all images except carousel images
// (lazy loading in carousel has negative effect on pagespeed insights)
if (isHome) {
	Array.from(imgElements).forEach((img) => {
		if (!img.closest('#carousel') && !img.closest('.banner-wrapper')) {
			img.setAttribute('loading', 'lazy')
		}
	})
}
