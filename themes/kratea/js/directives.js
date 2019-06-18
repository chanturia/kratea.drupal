ngApp.directive('dropDown', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.click(function () {
                angular.element(this).attr('tabindex', 1).focus();
                angular.element(this).toggleClass('active');
                angular.element(this).find('.dropdown-menu').slideToggle(300);
            });
            element.focusout(function () {
                angular.element(this).removeClass('active');
                angular.element(this).find('.dropdown-menu').slideUp(300);
            });
            angular.element('.dropdown .dropdown-menu li').click(function () {
                let span = angular.element(this).parents('.dropdown').find('span');
                let input = angular.element(this).parents('.dropdown').find('input');
                span.text($(this).text());
                input.val($(this).attr('id'));
                input.trigger('input');
            });
        }
    }
});

ngApp.directive('slickCarousel', function ($rootScope, $http) {
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            {
                let owl = element;
                owl.on('init', function (event, slick, currentSlide, nextSlide) {
                    setTimeout(() => {
                        let animationDelayMultiplier = 0.1;
                        owl.find('.slick-active')
                            .find('[data-animate-class]')
                            .each((index, element) => {
                                element = $(element);
                                let animateDelay = element.data('animate-delay');
                                element.css({"animation-delay": `${animateDelay + (index * animationDelayMultiplier)}s`}).addClass(`animated ${element.data('animate-class')}`);
                            });
                    }, 1, owl);
                });
                owl.slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: false,
                    prevArrow: "<button type=\"button\" role=\"presentation\" class=\"owl-prev\"><svg width=\"32\" height=\"139\" viewBox=\"0 0 32 139\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <g filter=\"url(#filter0_d)\"> <path d=\"M26 4L7 67.5L26 131\" stroke=\"#21C0B5\" stroke-width=\"2\"/> </g> <defs> <filter id=\"filter0_d\" x=\"0.956177\" y=\"0.713318\" width=\"31.0018\" height=\"137.573\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"> <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/> <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/> <feOffset dy=\"2\"/> <feGaussianBlur stdDeviation=\"2.5\"/> <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"/> <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"/> <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"/> </filter> </defs> </svg></button>",
                    nextArrow: "<button type=\"button\" role=\"presentation\" class=\"owl-next\"><svg width=\"32\" height=\"139\" viewBox=\"0 0 32 139\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g filter=\"url(#filter0_d)\"><path d=\"M6 131L25 67.5L6 4\" stroke=\"#21C0B5\" stroke-width=\"2\"/></g><defs><filter id=\"filter0_d\" x=\"0.0419922\" y=\"0.713318\" width=\"31.0018\" height=\"137.573\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset dy=\"2\"/><feGaussianBlur stdDeviation=\"2.5\"/><feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"/><feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"/><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"/></filter></defs></svg></button>",
                    responsive: [
                        {
                            breakpoint: 1201,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 769,
                            settings: {
                                centerMode: true,
                                centerPadding: '0px',
                                prevArrow: "<button type=\"button\" role=\"presentation\" class=\"owl-prev\"><svg width=\"61\" height=\"18\" viewBox=\"0 0 61 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M12 1L1 9L12 17\" stroke=\"#21C0B5\"/> <line x1=\"1\" y1=\"8.5\" x2=\"61\" y2=\"8.5\" stroke=\"#21C0B5\"/> </svg></button>",
                                nextArrow: "<button type=\"button\" role=\"presentation\" class=\"owl-next\"><svg width=\"61\" height=\"18\" viewBox=\"0 0 61 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M49 17L60 9L49 1\" stroke=\"#21C0B5\"/> <line y1=\"8.5\" x2=\"60\" y2=\"8.5\" stroke=\"#21C0B5\"/> </svg></button>",
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            }
                        }
                    ]
                }).on('mousewheel', function (e) {
                    e.preventDefault();
                    if (e.deltaY > 0) {
                        owl.slick('slickPrev');
                    } else {
                        owl.slick('slickNext');
                    }
                }).on('afterChange', function (event, slick, currentSlide, nextSlide) {
                    owl.find('.slick-active')
                        .find('[data-animate-class]')
                        .each((index, element) => {
                            element = $(element);
                            element.removeClass(`animated ${element.data('animate-class')}`);
                        });

                }).on('afterChange', function (event, slick, currentSlide, nextSlide) {
                    setTimeout(() => {
                        let animationDelayMultiplier = 0.1;
                        owl.find('.slick-active')
                            .find('[data-animate-class]')
                            .each((index, element) => {
                                element = $(element);
                                let animateDelay = element.data('animate-delay');
                                element.css({"animation-delay": `${animateDelay + (index * animationDelayMultiplier)}s`}).addClass(`animated ${element.data('animate-class')}`);
                            });
                    }, 1, owl);
                });
                $rootScope.propertySearch = (searchData) => {
                    console.log(searchData);
                    let lang = document.documentElement.lang;
                    angular.element('HTML').css({opacity: 0.6});
                    $http({
                        method: 'GET',
                        url: `/${lang}/get/properties?_format=json&field_property_price_value[min]=${searchData.price_from}&field_property_price_value[max]=${searchData.price_to}&field_property_type_target_id=${searchData.property_type}&term_node_tid_depth=${searchData.region}`
                    }).then(function successCallback(response) {
                        console.log(response);
                        angular.element('HTML').css({opacity: 1});
                        element.slick('slickRemove', null, null, true);
                        response.data.forEach(item => {
                            element.slick('slickAdd', item.propertie);
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
        }
    }
});

ngApp.directive('imageOwlCarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            let owl = element;
            owl.owlCarousel({
                items: 1,
            });
            owl.on('mousewheel', '.owl-stage', function (e) {
                if (e.deltaY > 0) {
                    owl.trigger('prev.owl');
                } else {
                    owl.trigger('next.owl');
                }
                e.preventDefault();
            });
            owl.on('change.owl.carousel', function () {
                owl.find('.active')
                    .find('[data-animate-class]')
                    .each((index, element) => {
                        element = $(element);
                        element.removeClass(`animated ${element.data('animate-class')}`);
                    });
            });
            owl.on('changed.owl.carousel', function () {
                setTimeout(() => {
                    let animationDelayMultiplier = 0.1;
                    owl.find('.active')
                        .find('[data-animate-class]')
                        .each((index, element) => {
                            element = $(element);
                            let animateDelay = element.data('animate-delay');
                            element.css({"animation-delay": `${animateDelay + (index * animationDelayMultiplier)}s`}).addClass(`animated ${element.data('animate-class')}`);
                        });
                }, 1, owl);
            });

            function owlOnInitialize() {
                setTimeout(() => {
                    let animationDelayMultiplier = 0.1;
                    owl.find('.active')
                        .find('[data-animate-class]')
                        .each((index, element) => {
                            element = $(element);
                            let animateDelay = element.data('animate-delay');
                            element.css({"animation-delay": `${animateDelay + (index * animationDelayMultiplier)}s`}).addClass(`animated ${element.data('animate-class')}`);
                        });
                }, 1, owl);
            }
        }
    }
});

ngApp.directive('localizeLink', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.ready(function () {
                element.attr('href', `/${document.documentElement.lang}` + attr.href);
            });
        }
    }
});

ngApp.directive('onlyNumber', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.keyup(function (e) {
                angular.element(element).val(angular.element(element).val().replace(/\D/g, ''));
            })
        }
    }
});
ngApp.directive('videoSpeed', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            let videoSpeed = attr.videoSpeed;
            element.ready(function (e) {
                angular.element(element)[0].playbackRate = videoSpeed;
            })
        }
    }
});