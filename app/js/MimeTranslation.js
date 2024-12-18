/**
 * Mime Translation v3.0.0
 * Překlad textů do různých jazyků.
 *
 * (c) mime digital s.r.o. 2024
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 */

class MimeTranslation {
	static getString(keyString, language = null) {
		const keys = keyString.split('.')
		const lang = language || this.getLocal()

		return this.getNestedTranslation(TRANS, keys, lang)
	}

	static getNestedTranslation(translations, keys, lang) {
		let result = translations

		for (const key of keys) {
			if (!result || !result[key]) {
				return ''
			}

			result = result[key]
		}

		return result[lang] || ''
	}

	static getLocal() {
		try {
			return document.querySelector('html').lang.toUpperCase()
		} catch (e) {
			console.error(e)
			return 'CS'
		}
	}
}

function trans(keyString) {
	return MimeTranslation.getString(keyString)
}
