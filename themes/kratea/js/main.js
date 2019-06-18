const ngApp = angular.module('KrateaApp', ['ngFitText']);

ngApp.controller('mainController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {
  new WOW({
    offset: 150,
  }).init();
  angular.element($window)
      .bind("load", calculateHeader)
      .bind("scroll", calculateHeader);

  function calculateHeader() {
    let header = angular.element('header');
    if ($window.innerWidth <= 769) {/*mobile check*/
      header.addClass('scrolled');
    }
    else {
      $window.pageYOffset > 10
          ? header.addClass('scrolled')
          : header.removeClass('scrolled');
    }
  }

  angular.element(window).scroll(function () {
    if (angular.element(window).scrollTop() + angular.element(window).height() === angular.element(document).height()) {
      angular.element('.footer').addClass('opened');
    }
    else {
      angular.element('.footer').removeClass('opened');
    }
  });
  if (angular.element('.infoPageWrapper').length > 0 || angular.element('.cardPageContainer').length > 0) {
    window.addEventListener('wheel', function (e) {
      if (e.target.className === 'videoOverlay') {
        if (e.deltaY < 0) {
          angular.element('.footer').removeClass('opened');
        }
        if (e.deltaY > 0) {
          angular.element('.footer').addClass('opened');
        }
      }
    });
  }

  $scope.openFooter = () => {
    angular.element('.footer').addClass('opened');
  };
  $scope.closeFooter = () => {
    angular.element('.footer').removeClass('opened');
  };
  $timeout(() => {
    angular.element('#overlay').fadeOut();
  }, 500, false);
  $scope.openNav = function () {
    angular.element("#sidenavOverlay").addClass('sidenavOverlayShow');
    angular.element("#sidenavOverlay").removeClass('sidenavOverlayHide');
    angular.element("#Sidenav").removeClass('sidenavClosed');
    angular.element("#Sidenav").addClass('sidenavOpened');
  };
  $scope.closeNav = function () {
    angular.element("#sidenavOverlay").addClass('sidenavOverlayHide');
    angular.element("#sidenavOverlay").removeClass('sidenavOverlayShow');
    angular.element("#Sidenav").removeClass('sidenavClosed');
    angular.element("#Sidenav").removeClass('sidenavOpened');
  };
  $scope.openMap = function () {
    angular.element('.modalMap').css({display: 'block'})
  };
  $scope.closeMap = function () {
    angular.element('.modalMap').css({display: ''})
  };
  $scope.openImage = (event) => {
    console.log(angular.element(event.target));
  };
}])
;

ngApp.controller('cardsController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.cards = new Array(18);
  /*todo: refactor ASAP!!!*/
  requestAnimationFrame(function () {
    angular.element('.cardContainer').hover(function () {
      angular.element(this).find('.cardInfoWrapper').css({paddingLeft: 0});
      angular.element(this).find('.propertyImages').css({boxShadow: "0px 10px 30px 0px black"});
    }, function () {
      angular.element(this).find('.cardInfoWrapper').css({paddingLeft: 15});
      angular.element(this).find('.propertyImages').css({boxShadow: ""});
    });
  })
}]);

ngApp.controller('customScroll', ['$scope', function ($scope) {
  let knob = document.querySelector('.customScrollbar__knob');
  let bar = document.querySelector('.customScrollbar__bar');
  let container = document.querySelector('.customScrollbarContent');
// When the container is scrolled
  container.addEventListener('scroll', function () {
    // If we are dragging the knob, do nothing
    if (dragging) {
      return;
    }
    // Otherwise, set the knob position based on the scroll position
    knob.style.top = container.scrollTop / (container.scrollHeight - container.offsetHeight) * 100 + '%';
  });
  let dragging = false;
  knob.addEventListener('mousedown', function (event) {
    dragging = {
      x: event.clientX,
      y: event.clientY
    };
  });
  window.addEventListener('mousemove', function (event) {
    if (dragging) {
      // When dragging
      event.preventDefault();
      let diff = {
        x: event.clientX - dragging.x,
        y: event.clientY - dragging.y
        // Clamp the position of the knob to be a maximum of
        // the knobs container, and a minimum of 0
      };
      let newTop = Math.max(0, Math.min(knob.offsetTop + diff.y, bar.offsetHeight));
      knob.style.top = newTop + 'px';
      // Base the scroll offset on the knobs position
      // in relation to the knobs container
      container.scrollTop = newTop / bar.offsetHeight * (container.scrollHeight - container.offsetHeight);
      dragging = {
        x: event.clientX,
        y: event.clientY
      };
    }
  });
  window.addEventListener('mouseup', function () {
    dragging = false;
  });
}]);

ngApp.controller('propertyCarouselController', ['$scope', function ($scope) {
  var sync1 = angular.element('#mainCarousel'),
      sync2 = angular.element('#thumbnailCarousel');

  sync1.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '#thumbnailCarousel'
  });
  sync2.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '#mainCarousel',
    focusOnSelect: true,
    /*    centerMode: true,
        centerPadding: '60px',*/
  });
}]);

$(document).ready(function () {
  {/*Image modal*/
    // Get the modal
    var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a
// caption
    var img = document.getElementById('myImg');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    if (img) {
      img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
      };

    }
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    if (span) {
      span.onclick = function () {
        modal.style.display = "none";
      }
    }
  }
});