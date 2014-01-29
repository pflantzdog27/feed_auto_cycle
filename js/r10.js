function feedGrab(link_to_rss,max_count,appendTo_thisDiv,feed_item_height, shown_feed_items){
    var fnSettings;
    fnSettings = {
        feed: link_to_rss,
        max: max_count,
        element: appendTo_thisDiv,
        itemHeight: feed_item_height,
        shownItems: shown_feed_items
    };
    jFeedFunction( fnSettings );
}
function jFeedFunction( settings ) {
    //https://www.usajobs.gov/JobSearch/Search/RSSFeed/3379585
    $(settings.element).feeds({
        feeds : {
            thisFeed : settings.feed
        },
        max: settings.max,
        ssl: 'auto',
        xml: true,
        onComplete: function (entries) {
            var feedItemHeight = settings.itemHeight;
            var shownFeedItems = settings.shownItems;
            var feedItemCount = $('.rss-feeds-entry').length;
            var stopNav = ((feedItemCount * feedItemHeight) - (shownFeedItems * (shownFeedItems * feedItemHeight))+(shownFeedItems * feedItemHeight));

            $('.rss-feed-plugin').height(shownFeedItems*feedItemHeight+'px');
            // remove the navigation all together if all items are SHOWN
            if($('.rss-feed-plugin').height() == feedItemCount * feedItemHeight ){
                $('.feed-navigation').css('display','none');
            }

            $('.rss-feeds-entry').each(function() {
                $(this).height(feedItemHeight+'px');
                if($(this).index() == 0){
                    $(this).css('top',0);
                } else {
                    var prevPosition = $(this).prev().css('top');
                    var cleanPrevPosition = prevPosition.slice(0,-2);
                    console.log(cleanPrevPosition);
                    var topNumber = parseInt(cleanPrevPosition);
                    $(this).css('top',topNumber+feedItemHeight+'px');
                }
            });
            $('.down-feed-list').click(function() {
                if($('.rss-feeds-entry:eq(0)').css('top') == '-'+feedItemHeight*shownFeedItems+'px'){
                    $('.down-feed-list').css('visibility','hidden');
                    $('.up-feed-list').css('visibility','visible');
                } else {
                    $('.down-feed-list').css('visibility','visible');
                }
                $('.rss-feeds-entry').each(function() {
                    var topPosition= $(this).css('top');
                    var cleanTop = topPosition.slice(0,-2);
                    var cleanTopNumber = parseInt(cleanTop);
                    $(this).animate({top: cleanTopNumber+(feedItemHeight*shownFeedItems)+'px'},600);
                });
            })
            $('.up-feed-list').click(function() {
                if($('.rss-feeds-entry:eq(0)').css('top') == (feedItemHeight*shownFeedItems)+'px'){
                    $('.down-feed-list').css('visibility','hidden');
                } else {
                    $('.down-feed-list').css('visibility','visible');
                }
                $('.rss-feeds-entry').each(function() {
                    var topPosition= $(this).css('top');
                    var cleanTop = topPosition.slice(0,-2);
                    var cleanTopNumber = parseInt(cleanTop);
                    $(this).animate({top: cleanTopNumber-(feedItemHeight*shownFeedItems)+'px'},600);
                });
                var lastItem = $('.rss-feeds-entry:last-child').css('top');
                console.log(lastItem);
                var cleanLast = lastItem.slice(0,-2);
                var cleanLastNumber = parseInt(cleanLast);
                if(cleanLastNumber - $('.rss-feed-plugin').height() < $('.rss-feed-plugin').height()){
                    $('.up-feed-list').css('visibility','hidden');
                } else {
                    $('.up-feed-list').css('visibility','visible');
                }
            })

        },
				preprocess: function ( feed ) {
					//for gsablogs
					var theContent = this.content;
					if(theContent.indexOf('src="http:') >= 0) {
						var replaced = theContent.replace('src="http:','src="https:');
						this.contentSnippet = replaced;
					}

					//Long TITLE
					this.feedTitle = this.title
					
					// title character limit
					var feedTitle = this.title;
					if(feedTitle.length > 25) {
						var cutTitle = feedTitle.substring(0, feedTitle.indexOf(" ", 25));
						var lastCut = cutTitle + ' ...';
						this.title = lastCut;
					} else {
						this.title = feedTitle;
					}
				},
				loadingTemplate: '<h3>R10 Feed are in the process of being loaded...</h3>',
				entryTemplate: function(entry) {
					var template = '';
						if (entry.source == 'thisFeed') {
                            template =  '<li class="rss-feeds-entry feeds-source-<!=source!>">' +
                                '<div>' +
                                '<h6><a target="_blank" href="<!=link!>"><!=title!></a></h6>' +
                                '<small><!=publishedDate!></small>' +
                                '<div class="feed-entry-content"><!=content!></div>' +
                                '</div>'+
                                '</li>'
						}
						return this.tmpl(template, entry);
				}				
			});
}
