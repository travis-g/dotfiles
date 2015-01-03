// ==UserScript==
// @name        Reddit Comment Scroll Loader
// @author      sketch_
// @description autoload next set of comments as you reach bottom of reddit comments
// @include     http://www.reddit.com/r/*/comments/*
// @include     https://www.reddit.com/r/*/comments/*
// @version     1
// @grant   none
// ==/UserScript==

$( document ).ready(function() {

    var paused = false;
    var  scrolltrigger = 0.98;

    var scroll_top;
    var document_height;
    var window_height;
    var scroll_percent;

    $(window).scroll(function(){

        scroll_top = $(window).scrollTop();
        document_height = $(document).height();
        window_height = $(window).height();
        scroll_percent = scroll_top / (document_height-window_height);

        if  (  scroll_percent > scrolltrigger ) {
           load_more_comments();
        }

    });

    function load_more_comments() {
        if ( !paused ) {

            paused = true;

            if ( $('.sitetable > .morechildren .morecomments a:not(.comment .morecomments a)').length ) {
                $('.sitetable > .morechildren .morecomments a:not(.comment .morecomments a)').last().click();
            }

            setTimeout(function() {
                paused = false;
            }, 2000);

        }
    }

});
