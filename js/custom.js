
function feedGrab(link_to_rss,max_count,appendTo_thisDiv,shown_feed_items,speed){
    var fnSettings;
    fnSettings = {
        feed: link_to_rss,
        max: max_count,
        element: appendTo_thisDiv,
        shownItems: shown_feed_items,
        transitionSpeed: speed
    };
    jFeedFunction( fnSettings );
}
function jFeedFunction( settings ) {
    $(settings.element).feeds({
        feeds : {
            thisFeed : settings.feed
        },
        max: settings.max,
        ssl: 'auto',
        xml: true,
        onComplete: function (entries) {
            var shownFeedItems = settings.shownItems;
            var feedItemCount = $('.rss-feeds-entry').length;
            var heights =  [];
            $('.rss-feeds-entry').each(function() {
               heights.push(parseInt($(this).height())+2);
            });
            var i;
            var sumHeights = 0;
            for (i = 0; i < shownFeedItems ; ++i) {
              sumHeights += (heights[i]);
            }
            console.log(sumHeights)
            if (feedItemCount > shownFeedItems) {
                var sumHeightsTwo = 0;
                for (i = shownFeedItems; i < shownFeedItems * 2 ; ++i) {
                    sumHeightsTwo += (heights[i]);
                }
                console.log(sumHeightsTwo)
            }
            if (feedItemCount > shownFeedItems * 2) {
                var sumHeightsThree = 0;
                for (i = shownFeedItems * 2; i < shownFeedItems * 3 ; ++i) {
                    sumHeightsThree += (heights[i]);
                }
                console.log(sumHeightsThree)
            }
            $('.rss-feed-plugin').height(sumHeights+'px');
           setInterval(function() {
               if(sumHeightsTwo > 0 && $('.rss-feed-list').css('margin-top')== '0px' ) {
                   $('.rss-feed-list').animate({'margin-top': '-'+sumHeights+'px'},600);
                   $('.rss-feed-plugin').animate({height :sumHeightsTwo+'px'},600);
               } else if(sumHeightsThree > 0 && $('.rss-feed-list').css('margin-top')== '-'+sumHeights+'px' ) {
                   $('.rss-feed-list').animate({'margin-top': '-'+(sumHeights+sumHeightsTwo)+'px'},600);
                   $('.rss-feed-plugin').animate({height :sumHeightsThree+'px'},600);
               } else {
                   $('.rss-feed-list').animate({'margin-top': 0},600);
                   $('.rss-feed-plugin').animate({height :sumHeights+'px'},600);
               }
           },settings.transitionSpeed)

        },
        preprocess: function ( feed ) {
            var original = new Date(this.publishedDate);
            if(moment(this.publishedDate) > 0) {
                var fromNow = moment(this.publishedDate).format('MMMM Do, YYYY');
                this.publishedDate = fromNow;
            }
        },
        loadingTemplate: '<h3>Feed is in the process of being loaded...</h3>',
        entryTemplate: function(entry) {
            var template = '';
            if (entry.source == 'thisFeed') {
                template =  '<li class="rss-feeds-entry feeds-source-<!=source!>">' +
                    '<div>' +
                    '<small><!=publishedDate!></small>' +
                    '<a target="_blank" href="<!=link!>"><!=title!></a>' +
                    //'<div class="feed-entry-content"><!=content!></div>' +
                    '</div>'+
                    '</li>'
            }
            return this.tmpl(template, entry);
        }
    });
}