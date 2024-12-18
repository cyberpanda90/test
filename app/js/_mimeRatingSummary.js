async function mimeRatingSummary(options = {}) {
    const {
        type = 2,
        mimeTitle = 'Hodnotenie zákazníkov',
        mimeShowMoreText = 'Zobraziť ďalšie recenzie',
        customerReviewedUrl,
        ratingScoreType = 'number',
        dateType = 'date',
        reviewsUrl = '/hodnotenie-obchodu/',
        reviewsButtonBorderColor,
        showDate = true,
        fullwidth = false,
        containerPadding = '0',
        backgroundColor,
        backgroundImage,
        replaceName,
        nameIconUrl,
		appendBeforeSelector = '.welcome-wrapper'
    } = options;

	function percentage(partialValue, totalValue) {
		return (100 * partialValue) / totalValue;
	}

	function waitForElm(selector, parentNode = document.body) {
		return new Promise(resolve => {
			const existingElement = parentNode.querySelector(selector);
			if (existingElement) return resolve(existingElement);

			const observer = new MutationObserver(() => {
				const element = parentNode.querySelector(selector);
				if (element) {
					observer.disconnect();
					resolve(element);
				}
			});

			observer.observe(parentNode, { childList: true, subtree: true });
		});
	}

	async function mimeGetRatingInfo(cache = true) {
		const url = cache ? '/cache/hodnotenie-obchodu/?jsonFormat' : '/hodnotenie-obchodu/?jsonFormat';
		try {
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					'X-Store-Rating-Details': 'true',
				},
			});

			if (!response.ok) throw new Error('Failed to fetch rating information');

			const data = await response.json();
			return {
				averageScore: data.averageScore,
				count: data.count,
				ratings: data.ratings,
				percentage: percentage(data.averageScore, 5),
			};
		} catch (error) {
			console.error('Error fetching rating info:', error);
			return null; // Handle error gracefully
		}
	}

	function createRatingElement(rating, showDate, dateType, replaceName, nameIconUrl, ratingScoreType, type) {
		const fragment = document.createDocumentFragment();

		const scoreElement = document.createElement('div');
		scoreElement.classList.add('score');
		scoreElement.innerHTML = type === 3 ? '<div>″</div>' : `<div>${ratingScoreType === 'percentage' ? `${percentage(rating.score, 5)}%` : rating.score}</div>`;

		const starsContainer = document.createElement('span');
		starsContainer.classList.add('stars');
		for (let i = 0; i < 5; i++) {
			const star = document.createElement('span');
			star.classList.add('star', i < rating.score ? 'star-on' : 'star-off');
			starsContainer.appendChild(star);
		}
		scoreElement.appendChild(starsContainer);

		const ratingDiv = document.createElement('div');
		ratingDiv.classList.add('mime-rating-div');
		ratingDiv.innerHTML = `
			<div class='description'>${rating.description}</div>
			<div class='fullName'>${nameIconUrl ? `<img src='${nameIconUrl}'>` : ''}${replaceName || rating.fullName}</div>
			${showDate ? `<div class='date'>${formatDate(rating.created.date, dateType)}</div>` : ''}
		`;
		ratingDiv.prepend(scoreElement);

		fragment.appendChild(ratingDiv);
		return fragment;
	}

	function formatDate(dateString, dateType) {
		const date = new Date(dateString);
		if (dateType === 'ago') return timeAgo(date);

		return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	}

	const timeAgo = (date) => {
		const now = new Date();
		const secondsAgo = Math.floor((now - date) / 1000);
		
		const intervals = {
			rokem: 31536000,
			měsícem: 2592000,
			týdnem: 604800,
			dnem: 86400,
			hodinou: 3600,
			minutou: 60,
			vteřinou: 1
		};

		const intervalsMany = {
			roky: 31536000,
			měsíci: 2592000,
			týdny: 604800,
			dny: 86400,
			hodinami: 3600,
			minutami: 60,
			vteřinami: 1
		};

		for (let interval in intervals) {
			const count = Math.floor(secondsAgo / intervals[interval]);
			if (count > 0) {
				const intervalKey = count === 1 ? interval : Object.keys(intervalsMany).find(key => intervalsMany[key] === intervals[interval]);
				return `zakoupeno před ${count} ${intervalKey}`;
			}
		}

		return 'zakoupeno právě teď';
	}	

	const mimeRatingInfo = await mimeGetRatingInfo(true);
	if (!mimeRatingInfo) return;

	const mimeContent = document.querySelector('.content');
	const mimeRatingWrapper = document.createElement('div');
	mimeRatingWrapper.classList.add('mime-rating-wrapper');
	mimeRatingWrapper.classList.add(`type-${type}`);

	const mimeRatingsMax = type === 4 ? 8 : type === 1 || type === 3 ? 3 : 4;
	const averageScore = ratingScoreType === 'percentage'
		? `${Math.round(mimeRatingInfo.percentage)}%`
		: mimeRatingInfo.averageScore;

	// Apply full-width styling if necessary
	if (fullwidth) {
		mimeRatingWrapper.classList.add('mime-rating-fullwidth');
		mimeRatingWrapper.style.paddingRight = containerPadding;
		mimeRatingWrapper.style.paddingLeft = containerPadding;
	}

	// Apply background color or image if provided
	if (backgroundColor || backgroundImage) {
		if (type === 5) {
			mimeRatingWrapper.style.background = `linear-gradient(0deg, ${backgroundColor} 0%, ${backgroundColor} 90%, rgba(255,255,255,0) 90%)`;
			mimeRatingWrapper.style.backgroundImage = backgroundImage ? `url('${backgroundImage}')` : '';
			mimeRatingWrapper.style.backgroundSize = 'cover';
			mimeRatingWrapper.style.backgroundPosition = 'center 60px';
		} else {
			mimeRatingWrapper.style.backgroundColor = backgroundColor;
			mimeRatingWrapper.style.backgroundImage = backgroundImage ? `url('${backgroundImage}')` : '';
			mimeRatingWrapper.style.backgroundSize = 'cover';
			mimeRatingWrapper.style.backgroundPosition = 'center';
		}
	}

	// Create rating content based on the type
	mimeRatingWrapper.innerHTML = getRatingContent(type, {
		mimeTitle,
		averageScore,
		mimeShowMoreText,
		reviewsUrl,
		mimeRatingInfo,
		customerReviewedUrl,
	});

	if (reviewsButtonBorderColor) {
		const showMoreButton = mimeRatingWrapper.querySelector('.show-more-button')
		if (showMoreButton) {
			showMoreButton.style.borderColor = reviewsButtonBorderColor
		}
	}

	// Adjust for mobile view if necessary
	if (document.body.classList.contains('mobile') && type !== 4) {
		mimeRatingsMax = 1;
	}

	// Append the ratings list
	const mimeRatingList = document.createElement('div');
	mimeRatingList.classList.add('mime-rating-list');
	mimeRatingInfo.ratings.slice(0, mimeRatingsMax).forEach(rating => {
		mimeRatingList.appendChild(
			createRatingElement(rating, showDate, dateType, replaceName, nameIconUrl, ratingScoreType, type)
		);
	});

	waitForElm(appendBeforeSelector).then(elm => {
		const mimeRatingFooter = mimeRatingWrapper.querySelector('.mime-rating-footer');
		if (mimeRatingFooter) {
			mimeRatingWrapper.insertBefore(mimeRatingList, mimeRatingFooter);
		} else {
			mimeRatingWrapper.appendChild(mimeRatingList);
		}
		mimeContent.insertBefore(mimeRatingWrapper, elm);

		if (type === 4) {
			new Flickity(mimeRatingList, {
				cellAlign: 'left',
				wrapAround: true,
				freeScroll: true,
				contain: true,
				groupCells: true,
				imagesLoaded: true,
				pageDots: false,
			});
		}
	});

	// Update footer with rating summary
	appendRatingSummaryToFooter(mimeRatingInfo.averageScore, mimeRatingInfo.count);

	function getRatingContent(type, { mimeTitle, averageScore, mimeShowMoreText, reviewsUrl, mimeRatingInfo, customerReviewedUrl }) {
		const mimeSubtext = `Kvalita ověřená našimi zákazníky. Více než ${mimeRatingInfo.count - 1} pozitivních hodnocení.`;
	
		switch (type) {
			case 1:
				return `
					<div class="mime-rating-header">
						${customerReviewedUrl ? `<div class="customer-reviewed-wrapper"><img src="${customerReviewedUrl}" alt="customerReviewed"></div>` : ''}
						<div class="subtext">${mimeSubtext}</div>
					</div>
					${reviewsUrl ? `<div class="mime-rating-footer"><a class="show-more-button" href="${reviewsUrl}">${mimeShowMoreText}</a></div>` : ''}
				`;
			case 2:
				return `
					<div class="mime-rating-header">
						<div class="rating">${averageScore}</div>
						<div class="text">
							<div class="title">${mimeTitle}</div>
							<a href="${reviewsUrl}">${mimeShowMoreText}</a>
						</div>
					</div>
				`;
			case 3:
				return `
					<div class="mime-rating-header">
						<div class="rating">${averageScore}</div>
						<div class="text">
							<div class="title">${mimeTitle}</div>
						</div>
					</div>
				`;
			case 4:
				return `
					<div class="title">${mimeTitle}</div>
					<div class="mime-rating-header">
						${customerReviewedUrl ? `<div class="customer-reviewed-wrapper"><img src="${customerReviewedUrl}" alt="customerReviewed"></div>` : ''}
						<div class="rating">${averageScore}</div>
						<div class="subtext">${mimeSubtext}</div>
						<div class="text"><a href="${reviewsUrl}" class="show-more-button">${mimeShowMoreText}</a></div>
					</div>
				`;
			case 5:
				return `
					<div class="mime-rating-footer">
						${customerReviewedUrl ? `<div class="customer-reviewed-wrapper"><img src="${customerReviewedUrl}" alt="customerReviewed"></div>` : ''}
						<div class="text">
							<div class="title">${averageScore} ${mimeTitle}</div>
							<a href="${reviewsUrl}" class="show-more-button">${mimeShowMoreText}</a>
						</div>
					</div>
				`;
			default:
				console.error('Invalid type provided');
				return '';
		}
	}
	
	function appendRatingSummaryToFooter(averageScore, count) {
		const ratingSummary = document.createElement('div');
		ratingSummary.classList.add('mimeFooterRating');
		ratingSummary.innerHTML = `
			<div class="mimeFooterRating-image-div"></div>
			<div>
				<div class="mimeFooterRating-average-score">${averageScore} %</div>
				<div class="mimeFooterRating-alt-text">${count} zákazníkov by odporúčalo obchod svojim známym</div>
				<div class="mimeFooterRating-more-text">
					<a href="/hodnotenie-obchodu/" alt="Hodnotenie obchodu">Všetky hodnotenia</a>
				</div>
			</div>
		`;
	
		const footerWrapper = document.querySelector('.custom-footer__banner30 .footer__item');
		footerWrapper?.appendChild(ratingSummary);
	}	
}