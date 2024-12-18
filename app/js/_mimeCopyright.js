/**
 * Mime Copyright v1.1.0
 * Vygeneruje a zobrazí copyright značky mime digital. Copyright zahrnuje
 * logo Shoptet a odkaz na web mime digital s logem společnosti.
 *
 * (c) mime digital s.r.o. 2023
 * https://mimedigital.cz
 * medard.huttenbach@mimedigital.cz
 **/

function mimeCopyright(premium, inverted) {
	const element = document.getElementById('signature')

	if (!element) return

	const url =
		'https://cdn.myshoptet.com/usr/mimedigital.myshoptet.com/user/documents/upload/'

	const logoShoptet = premium
		? `${url}shoptetPremiumLogo.svg`
		: `${url}shoptetLogo.svg`
	const isShoptetInverted = inverted
		? premium
			? 'style="filter: invert(1)"'
			: ''
		: ''

	const logoMime = `${url}mime-digital-logo.svg`
	const isMimeInverted = inverted ? 'style="filter: invert(1)"' : ''

	const html = `
        <span class="title">
            <img src="${logoShoptet}" alt="Shoptet" ${isShoptetInverted}>
            <span>Shoptet</span>
        </span>
        <span class="pipe">|</span>
        <a href="https://mimedigital.cz/" target="_blank">
            <span>mime digital</span>
            <img src="${logoMime}" alt="mime digital" ${isMimeInverted}>
        </a>
    `
	element.innerHTML = html
	element.removeAttribute('style')
}
