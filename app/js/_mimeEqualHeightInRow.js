/**
 * mimeEqualHeightInRow v1.0.1
 * Funkce slouží pro nastavení stejné výšky elementů v rámci skupin na řádku v určeném kontejneru.
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

/**
 *
 * @param {string} wrap - selektor kontejneru, v rámci kterého se mají hledat elementy
 * @param {string} item - selektor pro vybrání elementů, kterým je třeba nastavit stejnou výšku
 * @param {number} count - počet elementů v řádku
 */
function mimeEqualHeightInRow(wrap, item, count) {
	// najde všechny vybrané elementy v rámci kontejneru
	const mimeEqualHeightInRowWrap = document.querySelectorAll(wrap)
	const mimeEqualHeightInRow_items = Array.from(
		mimeEqualHeightInRowWrap
	).flatMap((container) => {
		return Array.from(container.querySelectorAll(item))
	})

	// projde každou skupinu elementů
	for (let i = 0; i < mimeEqualHeightInRow_items.length; i += count) {
		const mimeEqualHeightInRow_group = mimeEqualHeightInRow_items.slice(
			i,
			i + count
		)

		// získá maximální výšku elementů v rámci skupiny
		const mimeEqualHeightInRow_maxHeight = Math.max(
			...mimeEqualHeightInRow_group.map(function (element) {
				return element.clientHeight
			})
		)

		// nastaví maximální výšku elementů v rámci skupiny
		mimeEqualHeightInRow_group.forEach(function (element) {
			element.style.height = mimeEqualHeightInRow_maxHeight + 'px'
		})
	}
}
