const MIMEPROJECTID = getShoptetDataLayer().projectId
const MIMEPROJECTMAP = {
	532989: 'DEV_CZ', // testovačka CZ
	532989: 'PROD_CZ', // produkce CZ
}

function isMimeProject(name) {
	for (const [key, val] of Object.entries(MIMEPROJECTMAP)) {
		if (val === name) {
			return parseInt(key) === MIMEPROJECTID
		}
	}
	return false
}

function getMimeProject() {
	return MIMEPROJECTMAP[MIMEPROJECTID]
}
