const header = document.getElementById('header')

// Function to add the "fixed" class when scrolling down
function addFixedClass() {
	if (window.scrollY > 0) {
		header.classList.add('fixed')
	} else {
		header.classList.remove('fixed')
	}
}

// Add an event listener for the "scroll" event
window.addEventListener('scroll', addFixedClass)

// Initial check to apply the class if the page is not scrolled at the top on load
addFixedClass()
