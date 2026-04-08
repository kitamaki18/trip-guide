
document.addEventListener("DOMContentLoaded", () => {


  /*-------------------------------

  // パスワード
  const password = prompt("パスワード");

  if (password !== "0211") {
    document.body.innerHTML = "閲覧できません";
    return; // ここで処理止めるの大事
  }

  
  ---------------------------------*/

  /*-------------------------------
  ハンバーガーメニュー
  ---------------------------------*/

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("header .nav");
  const navLinks = document.querySelectorAll(".menu a");

  // ハンバーガークリック
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  // ナビリンククリックで閉じる
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
    });
  });

  /*-------------------------------
  持ち物 アコーディオン テキスト切り替え
  ---------------------------------*/
  const itemsAccordion = document.querySelector('.items-accordion');
  const itemsToggle = itemsAccordion?.querySelector('.items-accordion__toggle');
  if (itemsAccordion && itemsToggle) {
    itemsAccordion.addEventListener('toggle', () => {
      itemsToggle.textContent = itemsAccordion.open ? 'リストを閉じる' : 'リストを見る';
    });
  }

  /*-------------------------------
  予約情報 タブフィルター
  ---------------------------------*/
  const filterBtns = document.querySelectorAll('#top-reservation .btn__area .btn4[data-filter]');
  const reservationItems = document.querySelectorAll('#top-reservation .contents .item');
  const noReservation = document.querySelector('#top-reservation .no-reservation');
  const hotelAulani = document.querySelector('#top-reservation .hotel-aulani');
  const hotelAlohi = document.querySelector('#top-reservation .hotel-alohi');

  const aulaniDays = ['day1', 'day2'];
  const alohiDays  = ['day3', 'day4', 'day5'];

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.dataset.filter;

      // アクティブ切り替え
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // ホテル表示切り替え
      if (hotelAulani) hotelAulani.style.display = aulaniDays.includes(filter) ? '' : 'none';
      if (hotelAlohi)  hotelAlohi.style.display  = alohiDays.includes(filter)  ? '' : 'none';

      // アイテム表示切り替え
      let visibleCount = 0;
      reservationItems.forEach(item => {
        if (item.classList.contains(filter)) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // 予約なしメッセージ
      if (noReservation) {
        noReservation.style.display = visibleCount === 0 ? '' : 'none';
      }
    });
  });

});


/*===============
  contents-visual | visual12-1
  スクロール固定で画像が切り替わるビジュアル
  全画面幅で有効
===============*/
(function () {
	// すべてのvisual12-1コンテナを取得
	const containers = document.querySelectorAll(".contents-visual.visual12-1");

	containers.forEach((container) => {
		const sections = container.querySelectorAll(".visual12__item");
		const innerElements = [];
		const scrollTriggers = [];
		let currentActiveIndex = -1;

		// すべてのitemを解除する関数
		function resetAllItems() {
			innerElements.forEach((inner) => {
				if (inner) {
					gsap.set(inner, { clearProps: "position,bottom,width,height" });
				}
			});
			currentActiveIndex = -1;
		}

		// 特定のitemを固定する関数（他のitemはすべて解除）
		function setItemFixed(inner, index) {
			if (!inner || currentActiveIndex === index) {
				return;
			}

			if (currentActiveIndex > index) {
				return;
			}

			resetAllItems();

			gsap.set(inner, {
				position: "fixed",
				bottom: 0,
				width: "100%",
				height: "100vh",
			});

			currentActiveIndex = index;
		}

		// 前のitemを固定する関数（上にスクロールするとき用）
		function setPreviousItemFixed(currentIndex) {
			if (currentIndex > 0 && innerElements[currentIndex - 1]) {
				const previousInner = innerElements[currentIndex - 1];
				resetAllItems();
				gsap.set(previousInner, {
					position: "fixed",
					bottom: 0,
					width: "100%",
					height: "100vh",
				});
				currentActiveIndex = currentIndex - 1;
			} else {
				resetAllItems();
			}
		}

		sections.forEach((section, index) => {
			const inner = section.querySelector(".visual12__item-wrap");
			innerElements.push(inner);

			if (inner && container) {
				const st = ScrollTrigger.create({
					trigger: section,
					start: "bottom bottom",
					end: "bottom bottom",
					endTrigger: container,
					onEnter: () => {
						setItemFixed(inner, index);
					},
					onLeave: () => {
						if (currentActiveIndex === index) {
							resetAllItems();
						}
					},
					onEnterBack: () => {
						let shouldSkip = false;
						for (let i = index + 1; i < scrollTriggers.length; i++) {
							if (scrollTriggers[i] && scrollTriggers[i].isActive) {
								shouldSkip = true;
								break;
							}
						}
						if (!shouldSkip) {
							setItemFixed(inner, index);
						}
					},
					onLeaveBack: () => {
						if (currentActiveIndex === index) {
							setPreviousItemFixed(index);
						}
					},
				});
				scrollTriggers.push(st);
			}
		});
	});
}());


/*===============
  firstview-contents03-2 専用Swiper初期化
  ===============
  ■ 概要
	フルスクリーン背景スライダー
	フェード切替 + スケールアウトアニメーション
===============*/
document.addEventListener('DOMContentLoaded', function () {
	const swiperEl = document.querySelector('.firstview-contents03-2 .firstview__visual .swiper');
	if (!swiperEl) return;

	// is-zoomingクラスの遅延削除用タイマー
	let zoomingTimeouts = new Map();

	new Swiper(swiperEl, {
		loop: true,
		effect: 'fade',
		speed: 2000,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		fadeEffect: {
			crossFade: true,
		},
		on: {
			// 初期化時：最初のアクティブスライドにis-zoomingを追加
			init: function () {
				const activeSlide = this.slides[this.activeIndex];
				if (activeSlide) {
					activeSlide.classList.add('is-zooming');
				}
			},

			// スライド変更開始時
			slideChangeTransitionStart: function () {
				const activeSlide = this.slides[this.activeIndex];
				const prevSlide = this.slides[this.previousIndex];

				// 新しいアクティブスライドにis-zoomingを追加
				if (activeSlide) {
					activeSlide.classList.add('is-zooming');
				}

				// 前のスライドのタイマーを設定（フェード完了後にis-zooming削除）
				if (prevSlide) {
					// 既存のタイマーがあればクリア
					if (zoomingTimeouts.has(prevSlide)) {
						clearTimeout(zoomingTimeouts.get(prevSlide));
					}

					const timeoutId = setTimeout(() => {
						prevSlide.classList.remove('is-zooming');
						zoomingTimeouts.delete(prevSlide);
					}, 2000); // フェード完了後に削除

					zoomingTimeouts.set(prevSlide, timeoutId);
				}
			}
		}
	});
});

/*===============
 slide03-02 カードスライダー
===============*/
(function () {
	function getEndOffset() {
		var swiperEl = document.querySelector('.slide03-02__swiper');
		if (!swiperEl) return 0;
		// swiperのmargin-leftと同じ値を右端にも適用
		return parseFloat(getComputedStyle(swiperEl).marginLeft) || 0;
	}

	var isMobile = window.innerWidth <= 768;

	var swiperSlide0301 = new Swiper(".slide03-02__swiper", {
		slidesPerView: 'auto',
		spaceBetween: 40,
		speed: 600,
		slidesOffsetAfter: getEndOffset(),
		centeredSlides: isMobile,
		navigation: {
			nextEl: ".slide03-02__next",
			prevEl: ".slide03-02__prev",
		},
		breakpoints: {
			0: {
				spaceBetween: 15,
			},
			769: {
				spaceBetween: 40,
			}
		}
	});

	// リサイズ時に再計算
	window.addEventListener('resize', function () {
		swiperSlide0301.params.slidesOffsetAfter = getEndOffset();
		swiperSlide0301.update();
	});
})();

/*===============
  contents-header04-1 専用Swiper初期化
  ===============
  ■ 概要
	フルスクリーンスライダー（フェード切替）
	スライド切替時に画像がスケールダウンするアニメーション（is-zoomingクラス制御）
===============*/
document.addEventListener('DOMContentLoaded', function () {
	const swiperEl = document.querySelector('.contents-header04-1 .swiper');
	if (!swiperEl) return;

	// is-zoomingクラスの遅延削除用タイマー
	let zoomingTimeouts = new Map();

	new Swiper(swiperEl, {
		loop: true,
		effect: 'fade',
		speed: 2000,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: '.contents-header04-1 .swiper-button-next',
			prevEl: '.contents-header04-1 .swiper-button-prev',
		},
		fadeEffect: {
			crossFade: true,
		},
		on: {
			// 初期化時：最初のアクティブスライドにis-zoomingを追加
			init: function () {
				const activeSlide = this.slides[this.activeIndex];
				if (activeSlide) {
					activeSlide.classList.add('is-zooming');
				}
			},

			// スライド変更開始時
			slideChangeTransitionStart: function () {
				const activeSlide = this.slides[this.activeIndex];
				const prevSlide = this.slides[this.previousIndex];

				// 新しいアクティブスライドにis-zoomingを追加
				if (activeSlide) {
					activeSlide.classList.add('is-zooming');
				}

				// 前のスライドのタイマーを設定（フェード完了後にis-zooming削除）
				if (prevSlide) {
					// 既存のタイマーがあればクリア
					if (zoomingTimeouts.has(prevSlide)) {
						clearTimeout(zoomingTimeouts.get(prevSlide));
					}

					const timeoutId = setTimeout(() => {
						prevSlide.classList.remove('is-zooming');
						zoomingTimeouts.delete(prevSlide);
					}, 2000); // フェード完了後に削除（speedと同じ値）

					zoomingTimeouts.set(prevSlide, timeoutId);
				}
			}
		}
	});
});




document.addEventListener('DOMContentLoaded', function() {
    // Swiperライブラリの読み込み確認
    if (typeof Swiper === 'undefined') {
        console.warn('Swiperライブラリが読み込まれていません');
        return;
    }
    // ブレイクポイント設定
    const BREAKPOINT = {
        MOBILE: 768,
        TABLET: 1024
    };

    // スクリーンサイズに応じてbodyクラスを設定
    function setBodyClass() {
        const screenWidth = window.innerWidth;
        const body = document.body;
        
        body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
        
        if (screenWidth <= BREAKPOINT.MOBILE) {
            body.classList.add('is-mobile');
        } else if (screenWidth <= BREAKPOINT.TABLET) {
            body.classList.add('is-tablet');
        } else {
            body.classList.add('is-desktop');
        }
    }

    // 初期化時に一度bodyクラスを設定
    setBodyClass();


    //===========================================
    // slide-infinity1 (無限スライダー)
    //===========================================
    (function() {
        const swiperInstances = {};

        // 初期化関数
        function init() {
            // すべてのslide-infinity1 swiperコンテナを検索
            const infinityContainers = document.querySelectorAll('.slide-infinity1');
            if (infinityContainers.length === 0) return;

            infinityContainers.forEach((container, index) => {
                // スワイパーコンテナを取得
                const swiperContainer = container.querySelector('.swiper');
                if (!swiperContainer) {
                    console.warn('slide-infinity1: .swiper要素が見つかりません');
                    return;
                }
                
                // インスタンスID生成（セクションIDがあればそれを使用、なければユニークIDを生成）
                const section = container.closest('section');
                const prefix = section && section.id ? section.id : 'infinity';
                const uniqueIndex = section && section.id ? index : Math.floor(Math.random() * 10000);
                const instanceId = `${prefix}-infinity-${uniqueIndex}`;
                
                // カスタムオプションの取得（コンテナ要素から）
                const pcSpeed = container.dataset.swiperSpeed ? parseInt(container.dataset.swiperSpeed) : 6000;
                const pcSpace = container.dataset.swiperSpace ? parseInt(container.dataset.swiperSpace) : 20;
                const mobileSpeed = container.dataset.mobileSpeed ? parseInt(container.dataset.mobileSpeed) : 9000;
                const mobileSpace = container.dataset.mobileSpace ? parseInt(container.dataset.mobileSpace) : 60;
                // 逆方向かどうかを判定
                const isReverse = container.classList.contains('reverse');
                
                // 既存のインスタンスがあれば破棄
                if (swiperInstances[instanceId]) {
                    try {
                        swiperInstances[instanceId].destroy(true, true);
                        swiperInstances[instanceId] = null;
                    } catch (error) {
                        console.error(`slide-infinity1: Swiper破棄に失敗しました`, error);
                    }
                }
                
                try {
                    // Swiperインスタンス作成
                    swiperInstances[instanceId] = new Swiper(swiperContainer, {
                        loop: true,
                        loopedSlides: 15,
                        slidesPerView: 'auto',
                        spaceBetween: pcSpace,
                        speed: pcSpeed,
                        autoplay: {
                            delay: 0,
                            disableOnInteraction: false,
                            reverseDirection: isReverse, // 逆方向設定
                        },
                        breakpoints: {
                            767: {
                                spaceBetween: mobileSpace,
                                speed: mobileSpeed,
                            }
                        }
                    });
                    
                    // transitionTimingFunctionを設定
                    const wrapper = swiperContainer.querySelector('.swiper-wrapper');
                    if (wrapper) {
                        wrapper.style.transitionTimingFunction = 'linear';
                    }
                    
                    console.log(`slide-infinity1: ${instanceId} のSwiperを初期化しました`);
                } catch (error) {
                    console.error(`slide-infinity1: ${instanceId} のSwiper初期化に失敗しました`, error);
                    swiperInstances[instanceId] = null;
                }
            });
        }
        
        // 初期化実行
        init();
        
        // リサイズイベント
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                init();
            }, 250);
        });
    })();
    console.log('全てのスライダーが初期化されました');
});

/*===============
  food-contents タブ切り替え
===============*/
document.addEventListener('DOMContentLoaded', function () {
    const foodContents = document.querySelector('#food-contents');
    if (!foodContents) return;

    const tabBtns = foodContents.querySelectorAll('.btn__area .btn2[data-tab]');
    const allItems = foodContents.querySelectorAll('.contents-column__item');

    // 初期表示：is-activeのタブに合わせてアイテムを出し分け
    const activeBtn = foodContents.querySelector('.btn__area .btn2.is-active');
    if (activeBtn) {
        allItems.forEach(item => {
            if (!item.classList.contains(activeBtn.dataset.tab)) {
                item.classList.add('is-hidden');
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            allItems.forEach(item => {
                if (item.classList.contains(target)) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });
});