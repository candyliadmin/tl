function init() {
	var myScroller = {};
	var startX = 0;
	var startY = 0;
	var startTranslateY = 0;
	var getTranslateY = function($ele) {
		var curTranslateY = $ele[0].style.transform || $ele[0].style.webkitTransform || "";
		curTranslateY = curTranslateY.split(",");
		curTranslateY = curTranslateY[1] ? +(curTranslateY[1].slice(0, -2)) : 0;
		return curTranslateY;
	};
	var touchendFn = function(e) {
		clearTimeout(myScroller.touchendTimer);
		var curTranslateY = getTranslateY(myScroller.$content);
		setTransitionDura(myScroller.$content, 0.6); // 设置位移时间
		// 如果是下拉刷新
		if (curTranslateY > 0) {
			setTransform(myScroller.$content, 'translate3d(0, 0, 0)');
		}
		// 如果是普通上拉
		else if (Math.abs(curTranslateY) > myScroller.maxScrollY) {
			setTransform(myScroller.$content, 'translate3d(0, ' + -myScroller.maxScrollY + 'px, 0)');
		}
		// 惯性滑动
		else if (Math.abs(myScroller.changeY) > 100) {
			if (Math.abs(curTranslateY + myScroller.changeY * 2) > myScroller.maxScrollY && curTranslateY + myScroller.changeY * 2 < 0) {
				setTransform(myScroller.$content, 'translate3d(0, ' + -myScroller.maxScrollY + 'px, 0)');
			} else if (curTranslateY + myScroller.changeY * 2 > 0) {
				setTransform(myScroller.$content, 'translate3d(0, 0, 0)');
			} else {
				setTransform(myScroller.$content, 'translate3d(0, ' + (curTranslateY + myScroller.changeY * 2) + 'px, 0)');
			}
		}
	};
	myScroller.refresh = function() {
		setTransitionDura(myScroller.$content, 0.6); // 设置位移时间
		var curTranslateY = getTranslateY(myScroller.$content);
		// 如果是下拉刷新
		if (curTranslateY > 0) {
			setTransform(myScroller.$content, 'translate3d(0, 0, 0)');
		}
	};
	myScroller.destroy = function() {
		myScroller = null;
		setTransform(myScroller.$content, 'translate3d(0, 0, 0)');
	};
	myScroller.$scroller = $(_pageId + " #scroller");
	myScroller.$content = $(_pageId + " #scroller").children(".content");
	myScroller.touchendTimer = null;
	myScroller.isTouching = false; // 是否正在触摸
	myScroller.visibleHeight = myScroller.$scroller.height();
	myScroller.contentHeight = myScroller.$content.height();
	myScroller.maxScrollY = myScroller.contentHeight - myScroller.visibleHeight;
	myScroller.changeY = 0;
	myScroller.$scroller.on("touchstart",
	function(e) {
		setTransitionDura(myScroller.$content, 0);
		startX = e.changedTouches[0].pageX;
		startY = e.changedTouches[0].pageY;
		startTranslateY = getTranslateY(myScroller.$content);
		myScroller.isTouching = true;
	});

	myScroller.$scroller.on("touchmove",
	function(e) {
		clearTimeout(myScroller.touchendTimer);
		myScroller.touchendTimer = setTimeout(touchendFn, 10500);
		var changeX = e.changedTouches[0].pageX - startX;
		var changeY = e.changedTouches[0].pageY - startY;
		myScroller.changeX = changeX;
		myScroller.changeY = changeY;
		// 下拉刷新
		if (startTranslateY == 0 && changeY - changeX > 0 && changeY > 10) {
			changeY /= 3;
			setTransform(myScroller.$content, 'translate3d(0, ' + changeY + 'px, 0)');
		}
		// 普通上拉
		else if (Math.abs(changeY) - Math.abs(changeX) > 0 && changeY < -10) {
			changeY += startTranslateY;
			if (Math.abs(changeY) < myScroller.maxScrollY + myScroller.visibleHeight * 0.5) {
				setTransform(myScroller.$content, 'translate3d(0, ' + changeY + 'px, 0)');
			}
		}
		// 普通下拉
		else if (startTranslateY != 0 && Math.abs(changeY) - Math.abs(changeX) > 0 && changeY > 10) {
			changeY += startTranslateY;
			if (changeY < myScroller.visibleHeight * 0.5) {
				setTransform(myScroller.$content, 'translate3d(0, ' + changeY + 'px, 0)');
			}
		}
		// 防止微信x5内核 touchmove 不持续触发的问题
		e.preventDefault();
	});

	myScroller.$scroller.on("touchend", touchendFn);
}

/**
 * 设置 transition-duration 值
 * @param $ele 待设置的 zepto 对象
 * @param duration 要设置的值，数字或者字符串，单位 s
 */
function setTransitionDura($ele, duration) {
	if ((duration + "").lastIndexOf("s") === -1) {
		duration = duration + 's';
	}
	for (var i = 0; i < $ele.length; i++) {
		var elStyle = $ele[i].style;
		elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
	}
	return this;
};

/**
 * 设置 transform 样式 
 * @param $ele 待设置的 zepto 对象
 * @param val transform 的值
 */
function setTransform($ele, val) {
	for (var i = 0; i < $ele.length; i++) {
		var elStyle = $ele[i].style;
		elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = val;
	}
}