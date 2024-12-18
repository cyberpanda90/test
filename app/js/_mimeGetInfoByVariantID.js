/**
 * Mime Get Info By Variant ID v.1.0.0
 * Získá objekt dat veškerých dostupných informací o produktové variantě daného ID.
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

/**
 *
 * @param {number} id - ID produktové varianty
 * @returns {object} - kompletní dostupná data produktové varianty
 */
function mimeGetInfoByVariantID(id) {
	for (var variant in shoptet.variantsSplit.necessaryVariantData) {
		if (variant.indexOf(id) !== -1) {
			return shoptet.variantsSplit.necessaryVariantData[variant]
		}
	}
	return null
}
