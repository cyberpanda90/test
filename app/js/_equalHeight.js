function equalHeight() {
	const name = document.querySelectorAll('.product .name')

	if (!name) return

	if (isMobile) {
		mimeEqualHeightInRow('.products-block', '.product .name', 2)
	} else {
		if (minLg) {
			mimeEqualHeightInRow('.products-block', '.product .name', 3)
		}

		if (minXl) {
			mimeEqualHeightInRow('.products-block', '.product .name', 4)
		}
	}
}
