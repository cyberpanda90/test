function addCurrentProductToVariants() {
	const productsWrapper = document.querySelector(
		'.products-alternative-wrapper .products-block'
	)

	if (!productsWrapper) return

	const currentProduct = `
        <div class = "product current-product">
          <div class='p'>
             <div class='image'>
              <img src='${mainImage.src}' alt='${mainImage.alt}'> 
            </div>
          </div>
        </div>
    `
	productsWrapper.insertAdjacentHTML('afterbegin', currentProduct)
}
