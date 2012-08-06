(function ($) {

    $.fn.prsnttn = function (options) {

        var settings = {
            itemSelector: '.item',
            currentItemSelector: '.current-item',
            useNavLinks: true,
            navNextHtml: '&rarr;',
            navPrevHtml: '&larr;',
            navNextClass: 'nav-next',
            navPrevClass: 'nav-prev',
            useMouseScrollNav: true,
            hiddenClass: 'hidden'
        };

        if (options) {
            $.extend(settings, options);
        }

        // private settings
        settings.currentItemClass = settings.currentItemSelector.substr(1, settings.currentItemSelector.length);
        settings.keyCodes = {
            forward: [
                32, // space
                39, // right arrow
                38, // up arrow
                34, // page down
                68, // 'd'
                87 // 'w'
            ],
            backward: [
                8, // backspace
                37, // left arrow
                40, // down arrow
                33, // page up
                83, // 's'
                65 // 'a'
            ],
            fullscreen: [
                13, // enter
                70 // f
            ]
        };

        function _switchItem($items, itemsLength, direction) {
            direction = direction || 'forward';

            var $current = $items.filter(settings.currentItemSelector);

            $current.removeClass(settings.currentItemClass).addClass(settings.hiddenClass);

            if (direction === 'backward') {

                if ($items.index($current) === 0) { // first item
                    $items.last().addClass(settings.currentItemClass).removeClass(settings.hiddenClass);
                } else { // navigating normally
                    $current.prev().removeClass(settings.hiddenClass).addClass(settings.currentItemClass);
                }

            } else {

                if ($items.index($current) === itemsLength - 1) { // last item
                    $items.eq(0).addClass(settings.currentItemClass).removeClass(settings.hiddenClass);
                } else { // navigating normally
                    $current.next().removeClass(settings.hiddenClass).addClass(settings.currentItemClass);
                }

            }

        }

        function _goFullScreen(self) {
            if ('requestFullScreen' in self) {
                self.requestFullScreen();
            } else if ('mozRequestFullScreen' in self) {
                self.mozRequestFullScreen();
            } else if ('webkitRequestFullScreen' in self) {
                self.webkitRequestFullScreen();
            }
        }

        return this.each(function () {

            var self = this,
                $this = $(this),
                $items = $this.children(settings.itemSelector),
                itemsLength = $items.length,
                $navNext = $('<a href="#" />').addClass(settings.navNextClass).html(settings.navNextHtml),
                $navPrev = $('<a href="#" />').addClass(settings.navPrevClass).html(settings.navPrevHtml);

            // initial setup
            $items.filter(':not(:eq(0))').addClass(settings.hiddenClass);
            $items.eq(0).addClass(settings.currentItemClass);

            // links navigation
            if (settings.useNavLinks) {

                $this.append($navNext);
                $this.append($navPrev);

                $navNext.click(function () {
                    _switchItem($items, itemsLength);
                    return false;
                });

                $navPrev.click(function () {
                    _switchItem($items, itemsLength, 'backward');
                    return false;
                });

            }

            // mouse scrolling navigation
            if (settings.useMouseScrollNav) {

                $(document).on('DOMMouseScroll mousewheel', function (e) {
                    e.preventDefault();
                    var evt = e.originalEvent;

                    // scrolling up
                    if ((evt.wheelDelta && evt.wheelDelta >= 120) || (evt.detail && evt.detail <= -1)) {
                        _switchItem($items, itemsLength, 'backward');
                    } else if ((evt.wheelDelta && evt.wheelDelta <= -120) || (evt.detail && evt.detail >= 1)) {
                        _switchItem($items, itemsLength);
                    }
                });

            }

            // keys navigation
            $('body').on({
                keydown: function (e) {
                    if (settings.keyCodes.forward.indexOf(e.keyCode) !== -1) {
                        _switchItem($items, itemsLength);
                        return false;
                    } else if (settings.keyCodes.backward.indexOf(e.keyCode) !== -1) {
                        _switchItem($items, itemsLength, 'backward');
                        return false;
                    } else if (settings.keyCodes.fullscreen.indexOf(e.keyCode) !== -1) {
                        _goFullScreen(self);
                    }
                }
            });

        });

    };

})(jQuery);


$(function () {

    $('.p').prsnttn();

});