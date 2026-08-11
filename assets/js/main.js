(function ($) {
  'use strict';
  /*=================================
      JS Index Here
  ==================================*/
  /*
    01. On Load Function
    02. Preloader
    03. Mobile Menu Active
    04. Sticky fix
    05. Scroll To Top
    06. Set Background Image
    07. Hero Slider Active 
    08. Global Slider
    09. Ajax Contact Form
    10. Popup Side Menu   
    11. Magnific Popup
    12. Section Position
    13. Filter
    14. One Page Nav
    15. WOW.js Animation
  */
  /*=================================
      JS Index End
  ==================================*/
  /*

  /*---------- 01. On Load Function ----------*/
  $(window).on('load', function () {
    $('.preloader').fadeOut();
  });

  /*---------- 02. Preloader ----------*/
  if ($('.preloader').length > 0) {
    $('.preloaderCls').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        $('.preloader').css('display', 'none');
      });
    });
  }

  /**************************************
   ***** 00. Lenis Library Support and Sticky Header *****
   **************************************/
  const lenis = new Lenis({
    lerp: 0.1, // animation smoothness (between 0 & 1)
    touchMultiplier: 0, // scrolling speed for touch events
    smoothWheel: true, // smooth scrolling for while events
    smoothTouch: false, // smooth scrolling for touche events
    mouseWheel: false, // smooth scrolling for mouse events
    autoResize: true,
    smooth: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    syncTouch: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  let lastScrollY = 0; // To track the previous scroll position

  // Sticky header logic
  function handleStickyHeader(scrollY) {
    const header = $('.vs-sticky-header');
    const stickyPlaceholder = $('#sticky-placeholder');
    const menu = $('#navbar-wrap');

    if (menu.length === 0) {
      console.error(
        '#navbar-wrap element not found. Please ensure it exists in the DOM.'
      );
      return;
    }

    const menuHeight = menu.outerHeight();
    const topbarHeight = $('#topbar-wrap').outerHeight(true) || 0; // Include margins
    const targetScroll = topbarHeight;

    // Basic sticky logic
    if (scrollY > targetScroll) {
      if (!header.hasClass('sticky')) {
        header.addClass('sticky');
        stickyPlaceholder.height(menuHeight); // Maintain page layout
      }
    } else {
      if (header.hasClass('sticky')) {
        header.removeClass('sticky');
        stickyPlaceholder.height(0); // Remove placeholder height
      }
    }

    // Add or remove `sticky-hold` when scrolling up
    const scrollDelta = scrollY - lastScrollY; // Positive for down, negative for up
    const windowHeight = $(window).height();
    const docHeight = $(document).height();

    if (
      scrollDelta < 0 && // Scrolling up
      scrollY > 700 &&
      scrollY < docHeight - windowHeight - 700 // 700px below top or bottom
    ) {
      if (!header.hasClass('sticky-hold')) {
        header.addClass('sticky-hold');
      }
    } else {
      if (header.hasClass('sticky-hold')) {
        header.removeClass('sticky-hold');
      }
    }

    // Add `stickyon` class when scrolling down 700px from the top
    if (scrollY > 700) {
      if (!header.hasClass('stickyon')) {
        header.addClass('stickyon');
      }
    } else {
      if (header.hasClass('stickyon')) {
        header.removeClass('stickyon');
      }
    }

    lastScrollY = scrollY; // Update last scroll position
  }

  // Lenis scroll event
  lenis.on('scroll', (e) => {
    handleStickyHeader(e.scroll); // Pass Lenis scroll position
  });

  // Request animation frame for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  /*---------- 03. Mobile Menu Active ----------*/
  $.fn.vsmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: '.vs-menu-toggle',
        bodyToggleClass: 'vs-body-visible',
        subMenuClass: 'vs-submenu',
        subMenuParent: 'vs-item-has-children',
        subMenuParentToggle: 'vs-active',
        meanExpandClass: 'vs-mean-expand',
        appendElement: '<span class="vs-mean-expand"></span>',
        subMenuToggleClass: 'vs-open',
        toggleSpeed: 400,
      },
      options
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = '.' + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css('display', 'none');
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }

      // Class Set Up for every submenu
      menu.find('li').each(function () {
        var submenu = $(this).find('ul');
        submenu.addClass(opt.subMenuClass);
        submenu.css('display', 'none');
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev('a').append(opt.appendElement);
        submenu.next('a').append(opt.appendElement);
      });

      // Toggle Submenu
      function toggleDropDown($element) {
        if ($($element).next('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next('ul').slideToggle(opt.toggleSpeed);
          $($element).next('ul').toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev('ul').slideToggle(opt.toggleSpeed);
          $($element).prev('ul').toggleClass(opt.subMenuToggleClass);
        }
      }

      // Submenu toggle Button
      var expandToggler = '.' + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          toggleDropDown($(this).parent());
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on('click', function () {
          menuToggle();
        });
      });

      // Hide Menu On out side click
      menu.on('click', function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find('div').on('click', function (e) {
        e.stopPropagation();
      });
    });
  };

  $('.vs-menu-wrapper').vsmobilemenu();

  /*---------- 06.Set Background Image ----------*/
  if ($('[data-bg-src]').length > 0) {
    $('[data-bg-src]').each(function () {
      var src = $(this).attr('data-bg-src');
      $(this).css('background-image', 'url(' + src + ')');
      $(this).removeAttr('data-bg-src').addClass('background-image');
    });
  }

  /*----------- 07. Global Slider ----------*/
  $(".vs-carousel").each(function () {
    var asSlide = $(this);

    // Collect Data
    function d(data) {
      return asSlide.data(data);
    }

    // ✅ Helper: Get validated slide-show value
    function getValidSlideCount(value, centerMode) {
      let num = parseFloat(value);
      if (isNaN(num)) return 1;
      if (centerMode) return Math.round(num); // ❗ Fix for center mode: only allow integers
      return num;
    }

    // ... keep all your arrow & click setup here ...
    $("[data-slick-next]").on("click", function (e) {
      e.preventDefault();
      var target = $(this).data("slick-next");
      if ($(target).length) {
        $(target).slick("slickNext");
      }
    });

    $("[data-slick-prev]").on("click", function (e) {
      e.preventDefault();
      var target = $(this).data("slick-prev");
      if ($(target).length) {
        $(target).slick("slickPrev");
      }
    });

    asSlide.slick({
      dots: d("dots") ? true : false,
      fade: d("fade") ? true : false,
      arrows: d("arrows") ? true : false,
      speed: d("speed") ? d("speed") : 1000,
      asNavFor: d("asnavfor") ? d("asnavfor") : false,
      autoplay: d("autoplay") == false ? false : false,
      infinite: d("infinite") == false ? false : true,
      slidesToShow: getValidSlideCount(d("slide-show"), d("center-mode")),
      adaptiveHeight: d("adaptive-height") ? true : false,
      centerMode: d("center-mode") ? true : false,
      autoplaySpeed: d("autoplay-speed") ? d("autoplay-speed") : 8000,
      centerPadding: d("center-padding") ? d("center-padding") : "0",
      focusOnSelect: d("focuson-select") == false ? false : true,
      pauseOnFocus: d("pauseon-focus") ? true : false,
      pauseOnHover: d("pauseon-hover") ? true : false,
      variableWidth: d("variable-width") ? true : false,
      vertical: d("vertical") ? true : false,
      verticalSwiping: d("vertical") ? true : false,
      prevArrow: d("prev-arrow")
        ? '<button type="button" class="slick-prev"><i class="' + d("prev-arrow") + '"></i></button>'
        : '<button type="button" class="slick-prev"><i class="far fa-chevron-left"></i></button>',
      nextArrow: d("next-arrow")
        ? '<button type="button" class="slick-next"><i class="' + d("next-arrow") + '"></i></button>'
        : '<button type="button" class="slick-next"><i class="far fa-chevron-right"></i></button>',
      rtl: $("html").attr("dir") == "rtl" ? true : false,

      responsive: [
        {
          breakpoint: 1600,
          settings: {
            arrows: d("xl-arrows") ? true : false,
            dots: d("xl-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("xl-slide-show") || d("slide-show"), d("xl-center-mode")),
            centerMode: d("xl-center-mode") ? true : false,
            centerPadding: d("xl-center-padding") || "0",
          },
        },
        {
          breakpoint: 1400,
          settings: {
            arrows: d("ml-arrows") ? true : false,
            dots: d("ml-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("ml-slide-show") || d("slide-show"), d("ml-center-mode")),
            centerMode: d("ml-center-mode") ? true : false,
            centerPadding: d("ml-center-padding") || "0",
          },
        },
        {
          breakpoint: 1200,
          settings: {
            arrows: d("lg-arrows") ? true : false,
            dots: d("lg-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("lg-slide-show") || d("slide-show"), d("lg-center-mode")),
            centerMode: d("lg-center-mode") ? true : false,
            centerPadding: d("lg-center-padding") || "0",
          },
        },
        {
          breakpoint: 992,
          settings: {
            arrows: d("md-arrows") ? true : false,
            dots: d("md-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("md-slide-show") || 1, d("md-center-mode")),
            centerMode: d("md-center-mode") ? true : false,
            centerPadding: d("md-center-padding") || "0",
          },
        },
        {
          breakpoint: 767,
          settings: {
            arrows: d("sm-arrows") ? true : false,
            dots: d("sm-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("sm-slide-show") || 1, d("sm-center-mode")),
            centerMode: d("sm-center-mode") ? true : false,
            centerPadding: d("sm-center-padding") || "0",
            vertical: d("sm-vertical") ? true : false,
            verticalSwiping: d("sm-vertical") ? true : false,
          },
        },
        {
          breakpoint: 576,
          settings: {
            arrows: d("xs-arrows") ? true : false,
            dots: d("xs-dots") ? true : false,
            slidesToShow: getValidSlideCount(d("xs-slide-show") || 1, d("xs-center-mode")),
            centerMode: d("xs-center-mode") ? true : false,
            centerPadding: 0,
            vertical: d("xs-vertical") ? true : false,
            verticalSwiping: d("xs-vertical") ? true : false,
          },
        },
      ],
    });

    // Function to get actual total slides (ignoring clones)
    function getActualTotalSlides(slick) {
      return slick.$slides.filter(":not(.slick-cloned)").length;
    }

    // Custom Dots Implementation
    function createCustomDots() {
      var customDotsContainer = $('.vs-custom-dots');
      if (customDotsContainer.length) {
        var slickInstance = asSlide.slick("getSlick");
        var totalSlides = getActualTotalSlides(slickInstance);
        customDotsContainer.empty();

        // Create dots
        for (var i = 0; i < totalSlides; i++) {
          var dotButton = $('<button type="button" data-slide="' + i + '"></button>');
          if (i === 0) {
            dotButton.addClass('active');
          }
          customDotsContainer.append(dotButton);
        }
      }
    }

    // Function For Custom Dots Navigation
    function updateCustomDots(currentSlide) {
      $('.vs-custom-dots button').removeClass('active');
      $('.vs-custom-dots button[data-slide="' + currentSlide + '"]').addClass('active');
    }

    // Bind custom dots events
    function bindCustomDotsEvents() {
      $(document).off('click.customDots-' + asSlide.attr('class')).on('click.customDots-' + asSlide.attr('class'), '.vs-custom-dots button', function (e) {
        e.preventDefault();
        var slideIndex = parseInt($(this).data('slide'));
        var targetCarousel = $(this).closest('.container, .row, .section').find('.vs-carousel');

        if (targetCarousel.length === 0) {
          targetCarousel = asSlide;
        }

        targetCarousel.slick('slickGoTo', slideIndex);
      });
    }

    // Status Update Element
    var $status = $(".slick-status");

    // Function to set initial status
    function setInitialStatus(slick) {
      var totalSlides = getActualTotalSlides(slick);
      $status.find(".slick-status__active").text("01");
      $status.find(".slick-status__total").text(totalSlides < 10 ? "0" + totalSlides : totalSlides);
    }

    // Dynamically populate initial slide status (on "init")
    asSlide.on("init", function (event, slick) {
      setInitialStatus(slick);
      createCustomDots();
      bindCustomDotsEvents();
    });

    // Update the slide status and custom dots dynamically after slide change
    asSlide.on("afterChange", function (event, slick, currentSlide) {
      var totalSlides = getActualTotalSlides(slick);
      var currentIndex = currentSlide + 1;
      $status
        .find(".slick-status__active")
        .text(currentIndex < 10 ? "0" + currentIndex : currentIndex);
      $status
        .find(".slick-status__total")
        .text(totalSlides < 10 ? "0" + totalSlides : totalSlides);

      // Update custom dots
      updateCustomDots(currentSlide);
    });

    // Trigger init manually to ensure status is set immediately
    setTimeout(function () {
      var slickInstance = asSlide.slick("getSlick");
      setInitialStatus(slickInstance);
      createCustomDots();
      bindCustomDotsEvents();
    }, 0);

  });


  // Tabe
  $(".nav-link").on("shown.bs.tab", function (e) {
    $(".vs-carousel").slick("setPosition");
  });

  /*----------- 08. Ajax Contact Form ----------*/
  function ajaxContactForm(selectForm) {
    var form = selectForm;
    var invalidCls = 'is-invalid';
    var $email = '[name="email"]';
    var $validation =
      '[name="name"],[name="email"],[name="phone"],[name="message"]'; // Remove [name="subject"]
    var formMessages = $(selectForm).next('.form-messages');

    function sendContact() {
      var formData = $(form).serialize();
      var valid;
      valid = validateContact();
      if (valid) {
        jQuery
          .ajax({
            url: $(form).attr('action'),
            data: formData,
            type: 'POST',
          })
          .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            formMessages.removeClass('error');
            formMessages.addClass('success');
            // Set the message text.
            formMessages.text(response);
            // Clear the form.
            $(form + ' input:not([type="submit"]),' + form + ' textarea').val(
              ''
            );
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            formMessages.removeClass('success');
            formMessages.addClass('error');
            // Set the message text.
            if (data.responseText !== '') {
              formMessages.html(data.responseText);
            } else {
              formMessages.html(
                'Oops! An error occurred and your message could not be sent.'
              );
            }
          });
      }
    }

    function validateContact() {
      var valid = true;
      var formInput;
      function unvalid($validation) {
        $validation = $validation.split(',');
        for (var i = 0; i < $validation.length; i++) {
          formInput = form + ' ' + $validation[i];
          if (!$(formInput).val()) {
            $(formInput).addClass(invalidCls);
            valid = false;
          } else {
            $(formInput).removeClass(invalidCls);
            valid = true;
          }
        }
      }
      unvalid($validation);

      if (
        !$(form + ' ' + $email).val() ||
        !$(form + ' ' + $email)
          .val()
          .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
      ) {
        $(form + ' ' + $email).addClass(invalidCls);
        valid = false;
      } else {
        $(form + ' ' + $email).removeClass(invalidCls);
        valid = true;
      }
      return valid;
    }

    $(form).on('submit', function (element) {
      element.preventDefault();
      sendContact();
    });
  }
  ajaxContactForm('.ajax-contact');

  /*---------- 09. Popup Side Menu ----------*/
  function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
    // Sidebar Popup
    $($sideMunuOpen).on('click', function (e) {
      e.preventDefault();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenu).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
    var sideMenuChild = $sideMenu + ' > div';
    $(sideMenuChild).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenuCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
  }
  popupSideMenu(
    '.sidemenu-wrapper',
    '.sideMenuToggler',
    '.sideMenuCls',
    'show'
  );

  /*----------- 10. Magnific Popup ----------*/
  /* magnificPopup img view */
  $('.popup-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
    },
  });

  /* magnificPopup video view */
  $('.popup-video').magnificPopup({
    type: 'iframe',
  });

  /*---------- 11. Section Position ----------*/
  // Interger Converter
  function convertInteger(str) {
    return parseInt(str, 10);
  }

  $.fn.sectionPosition = function (mainAttr, posAttr, getPosValue) {
    $(this).each(function () {
      var section = $(this);

      function setPosition() {
        var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
          posValue = convertInteger(section.attr(getPosValue)), // positioning value
          posData = section.attr(mainAttr), // how much to position
          posFor = section.attr(posAttr), // On Which section is for positioning
          parentPT = convertInteger($(posFor).css('padding-top')), // Default Padding of  parent
          parentPB = convertInteger($(posFor).css('padding-bottom')); // Default Padding of  parent

        if (posData === 'top-half') {
          $(posFor).css('padding-bottom', parentPB + sectionHeight + 'px');
          section.css('margin-top', '-' + sectionHeight + 'px');
        } else if (posData === 'bottom-half') {
          $(posFor).css('padding-top', parentPT + sectionHeight + 'px');
          section.css('margin-bottom', '-' + sectionHeight + 'px');
        } else if (posData === 'top') {
          $(posFor).css('padding-bottom', parentPB + posValue + 'px');
          section.css('margin-top', '-' + posValue + 'px');
        } else if (posData === 'bottom') {
          $(posFor).css('padding-top', parentPT + posValue + 'px');
          section.css('margin-bottom', '-' + posValue + 'px');
        }
      }
      setPosition(); // Set Padding On Load
    });
  };

  var postionHandler = '[data-sec-pos]';
  if ($(postionHandler).length) {
    $(postionHandler).imagesLoaded(function () {
      $(postionHandler).sectionPosition(
        'data-sec-pos',
        'data-pos-for',
        'data-pos-amount'
      );
    });
  }

  /*----------- 12. Filter ----------*/
  $('.filter-active, .filter-active2').imagesLoaded(function () {
    var $filter = '.filter-active',
      $filter2 = '.filter-active2',
      $filterItem = '.filter-item',
      $filterMenu = '.filter-menu-active';

    if ($($filter).length > 0) {
      var $grid = $($filter).isotope({
        itemSelector: $filterItem,
        filter: '*',
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: 1,
        },
      });
    }

    if ($($filter2).length > 0) {
      var $grid = $($filter2).isotope({
        itemSelector: $filterItem,
        filter: '*',
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: $filterItem,
        },
      });
    }

    // Menu Active Class
    $($filterMenu).on('click', 'button', function (event) {
      event.preventDefault();
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({
        filter: filterValue,
      });
      $(this).addClass('active');
      $(this).siblings('.active').removeClass('active');
    });
  });

  /** Porfolio Custom using
   * GSAP
   * Vanila JavaScript
   */
  // portfolio active

  $('.vs-project').imagesLoaded(function () {
    let grid = $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-sizer'
      }
    })

    $('.vs-portfolio__tabs').on('click', 'button', function () {
      let filterValue = $(this).attr('data-filter');
      grid.isotope({ filter: filterValue });
    });
    function moveIndicator($el, animate = true) {
      const $indicator = $('.vs-portfolio__indicator');
      const offset = $el.position();
      const width = $el.outerWidth();
      const height = $el.outerHeight();

      if (animate) {
        gsap.to($indicator, {
          duration: 0.4,
          x: offset.left,
          y: offset.top,
          width: width,
          height: height,
          scale: 1,
          transformOrigin: 'center center',
          ease: 'power2.out',
          opacity: 1
        });
      } else {
        // On page load: center scale animation
        gsap.set($indicator, {
          x: offset.left,
          y: offset.top,
          width: width,
          height: height,
          scale: 0,
          opacity: 0,
        });

        gsap.to($indicator, {
          duration: 0.5,
          scale: 1,
          opacity: 1,
          transformOrigin: 'center center',
          ease: 'back.out(1.4)',
          delay: 0.001
        });
      }
    }

    $('.vs-portfolio__tabs .vs-portfolio__tab').on('click', function (event) {
      event.preventDefault();

      $('.vs-portfolio__tabs .vs-portfolio__tab').removeClass('active');
      $(this).addClass('active');

      moveIndicator($(this), true);
    });

    $(window).on('load resize', function () {
      const $active = $('.vs-portfolio__tabs .vs-portfolio__tab.active');
      if ($active.length) {
        moveIndicator($active, false); // ⬅️ Animate from center on load
      }
    });

  });


  /*----------- 14. WOW.js Animation ----------*/
  var wow = new WOW({
    boxClass: 'wow', // animated element css class (default is wow)
    animateClass: 'wow-animated', // animation css class (default is animated)
    offset: 0, // distance to the element when triggering the animation (default is 0)
    mobile: false, // trigger animations on mobile devices (default is true)
    live: true, // act on asynchronously loaded content (default is true)
    scrollContainer: null, // optional scroll container selector, otherwise use window,
    resetAnimation: false, // reset animation on end (default is true)
  });
  wow.init();

  /*----------- 15. Indicator Position ----------*/
  function setPos(element) {
    var indicator = element.siblings('.indicator'),
      btnWidth = element.css('width'),
      btnHiehgt = element.css('height'),
      btnLeft = element.position().left,
      btnTop = element.position().top;
    element.addClass('active').siblings().removeClass('active');
    indicator.css({
      left: btnLeft + 'px',
      top: btnTop + 'px',
      width: btnWidth,
      height: btnHiehgt,
    });
  }

  $('.login-tab a').each(function () {
    var link = $(this);
    if (link.hasClass('active')) setPos(link);
    link.on('mouseover', function () {
      setPos($(this));
    });
  });

  /*----------- 16. Color Plate Js ----------*/
  if ($('.vs-color-plate').length) {
    var oldValue = $('#plate-color').val();
    $('#plate-color').on('change', function (e) {
      var color = e.target.value;
      $('body').css('--theme-color', color);
    });

    $('#plate-reset').on('click', function () {
      $('body').css('--theme-color', '');
      $('#plate-color').val(oldValue);
    });

    $('#plate-toggler').on('click', function () {
      $('.vs-color-plate').toggleClass('open');
    });
  }

  /**************************************
   ***** 14. Counter Activation
   **************************************/
  // Counter Animation
  function animateCounter(counter) {
    const targetValue = parseInt(counter.getAttribute('data-counter'));
    const animationDuration = 1000; // Set the desired animation duration in milliseconds
    const startTimestamp = performance.now();

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);

      const currentValue = Math.floor(targetValue * progress);
      counter.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function startCounterAnimation(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector('.counter-number');
        animateCounter(counter);
        // observer.unobserve(entry.target);
      }
    });
  }

  const counterObserver = new IntersectionObserver(startCounterAnimation, {
    rootMargin: '0px',
    threshold: 0.2, // Adjust the threshold value as needed (0.2 means 20% visibility)
  });

  const counterBlocks = document.querySelectorAll('.counter-style');
  counterBlocks.forEach((counterBlock) => {
    counterObserver.observe(counterBlock);
  });

  /*---------- 16. Search Box Popup ----------*/
  function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    $($searchOpen).on('click', function (e) {
      e.preventDefault();
      $($searchBox).addClass($toggleCls);
    });
    $($searchBox).on('click', function (e) {
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
    $($searchBox)
      .find('form')
      .on('click', function (e) {
        e.stopPropagation();
        $($searchBox).addClass($toggleCls);
      });
    $($searchCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
  }
  popupSarchBox(
    '.popup-search-box',
    '.searchBoxTggler',
    '.searchClose',
    'show'
  );

  /*---------- 18. Skill Progressbar ----------*/
  document.addEventListener('DOMContentLoaded', function () {
    const progressBoxes = document.querySelectorAll('.progress-box');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Intersection observer threshold
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    progressBoxes.forEach((progressBox) => {
      observer.observe(progressBox);
    });

    function animateProgressBar(progressBox) {
      try {
        const progressBar = progressBox.querySelector('.progress-box__bar');
        const progressNumber = progressBox.querySelector(
          '.progress-box__number'
        );

        // Retrieve target width from data attribute
        const targetWidth = parseInt(progressBar.dataset.width, 10);
        let width = 0;

        const countInterval = setInterval(() => {
          width++;
          progressBar.style.width = width + '%';

          // Safely update the progress number
          if (progressNumber) {
            progressNumber.textContent = width + '%';
          }

          if (width >= targetWidth) {
            clearInterval(countInterval);
          }
        }, 20);
      } catch (error) {
        console.error('Error animating progress bar:', error);
      }
    }
  });

  /**************************************
   ***** 02. Back To Top *****
   **************************************/
  const btt = document.querySelector(".scrollToTop");

  // Add click functionality to scroll to the top
  btt.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    gsap.to(window, { duration: 1, scrollTo: 0 });
  });

  // Set initial styles
  gsap.set(btt, { autoAlpha: 0, y: 50 });

  // Animate the button visibility on scroll
  gsap.to(btt, {
    autoAlpha: 1,
    y: 0,
    scrollTrigger: {
      trigger: "body",
      start: "top -20%",
      end: "top -20%",
      toggleActions: "play none reverse none",
    },
  });

  // end
  // end
  // end
})(jQuery);
