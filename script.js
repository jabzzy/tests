(function($) {

    $.fn.prsnttn = function(options) {
        
        var settings = {
            itemSelector: '.item',
            currentItemSelector: '.current-item',
            width: '200px',
            height: '200px',
            useNavLinks: true,
            navNextHtml: '&rarr;',
            navPrevHtml: '&larr;',
            useMouseScrollNav: true
        };

        if (options) {
            $.extend(settings, options);
        }

        settings.currentItemClass = settings.currentItemSelector.substr(1, settings.currentItemSelector.length)

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
            ]
        };
        

        function _switchItem($items, itemsLength, direction) {
            direction = direction || 'forward';

            var $current = $items.filter(settings.currentItemSelector);
                        
            $current.removeClass(settings.currentItemClass).hide();

            if(direction == 'backward') {

                if($items.index($current) == 0) { // first item
                    $items.last().addClass(settings.currentItemClass).show();
                } else { // navigating normally
                    $current.prev().show().addClass(settings.currentItemClass);
                }
                
            } else {

                if($items.index($current) == itemsLength - 1) { // last item
                    $items.eq(0).addClass(settings.currentItemClass).show();
                } else { // navigating normally
                    $current.next().show().addClass(settings.currentItemClass);
                }
                
            }

        };

        return this.each(function() {

            var $this = $(this),
                $items = $this.children(settings.itemSelector),
                itemsLength = $items.length,
                $navNext = $('<a href="#" />').addClass('nav-next').html(settings.navNextHtml),
                $navPrev = $('<a href="#" />').addClass('nav-prev').html(settings.navPrevHtml);


            // initial setup
            
            $this.css({
                'position': 'relative',
                'width': settings.width,
                'height': settings.height
            });

            $items.css({
                'position': 'absolute',
                'top': '0px',
                'left': '0px',
                'width': settings.width,
                'height': settings.height
            });

            $items.filter(':not(:eq(0))').hide();
            $items.eq(0).addClass(settings.currentItemClass);

            // links navigation
            if(settings.useNavLinks) {
                
                $navNext.css({
                    'position': 'absolute',
                    'right': '0',
                    'bottom': '-' + $navNext.outerHeight(true) + 'px'
                });
                $this.append($navNext);
                
                $navPrev.css({
                    'position': 'absolute',
                    'left': '0',
                    'bottom': '-' + $navPrev.outerHeight(true) + 'px'
                });
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
            if(settings.useMouseScrollNav) {

                $(document).on('DOMMouseScroll mousewheel', function (e) {
                    e.preventDefault();
                    var evt = e.originalEvent;

                    // scrolling up
                    if( (evt.wheelDelta && evt.wheelDelta >= 120) || (evt.detail && evt.detail <= -1) ) {
                        _switchItem($items, itemsLength, 'backward');
                    } else if ( (evt.wheelDelta && evt.wheelDelta <= -120) || (evt.detail && evt.detail >= 1) ) {
                        _switchItem($items, itemsLength);
                    }
                });
                
            }

            // keys navigation
            $('body').on({
                keydown: function (e) {
                    if(settings.keyCodes.forward.indexOf(e.keyCode) !== -1) {
                        _switchItem($items, itemsLength);
                        return false;
                    } else if (settings.keyCodes.backward.indexOf(e.keyCode) !== -1) {
                        _switchItem($items, itemsLength, 'backward');
                        return false;
                    }
                }
            });

            

        });

    };

})(jQuery);


$(function () {

    $('.p').prsnttn();

});