// Get the body element
const bodyEl = document.querySelector('body')

// Check what type of page is loaded
const isProductDetail = bodyEl.classList.contains('type-product')
const isBlog = bodyEl.classList.contains('type-posts-listing')
const isCategory = bodyEl.classList.contains('type-category')
const isRating = bodyEl.classList.contains('in-hodnoceni-obchodu')

const infoWrapper = document.querySelector('.p-data-wrapper')
const imageWrapper = document.querySelector('.p-image-wrapper')
const watchdogBtn = document.querySelector('.watchdog.link-icon')

const mainImage = document.querySelector('.p-main-image img')
const video = document.querySelector('#productVideos')
const videoIframe = video?.querySelector('iframe')

const isHome = bodyEl.classList.contains('in-index')
const imgElements = document.querySelectorAll('img')

// Check viewport width
let minMd = window.matchMedia('(min-width: 768px)')
let minLg = window.matchMedia('(min-width: 992px)')
let minXl = window.matchMedia('(min-width: 1200px)')

let isMobile = window.innerWidth < 768

window.addEventListener('resize', () => {
	minMd = window.matchMedia('(min-width: 768px)')
	minLg = window.matchMedia('(min-width: 992px)')
	minXl = window.matchMedia('(min-width: 1200px)')

	isMobile = window.innerWidth < 768
})
