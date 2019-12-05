

import './scss/app.scss';

import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';

import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/index';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/scrollspy';
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/tooltip';

window.$ = window.jQuery = require('jquery');

import metisMenu from 'metismenu';

$(function () {

   $('#main-menu, #admin-menu').metisMenu({
      activeClass: 'open'
   });


   $('#sidebar-collapse-btn').on('click', function(event){
      event.preventDefault();

      $("#app").toggleClass("sidebar-open");
   });

   $("#sidebar-overlay").on('click', function() {
      $("#app").removeClass("sidebar-open");
   });


   if ($.browser.mobile) {
      var $appContainer = $('#app ');
      var $mobileHandle = $('#sidebar-mobile-menu-handle ');

      $mobileHandle.swipe({
         swipeLeft: function() {
            if($appContainer.hasClass("sidebar-open")) {
               $appContainer.removeClass("sidebar-open");
            }
         },
         swipeRight: function() {
            if(!$appContainer.hasClass("sidebar-open")) {
               $appContainer.addClass("sidebar-open");
            }
         },
         // excludedElements: "button, input, select, textarea, .noSwipe, table",
         triggerOnTouchEnd: false
      });
   }

});

// $('#main-menu, #admin-menu').metisMenu(
//       {activeClass: 'open'}
// );