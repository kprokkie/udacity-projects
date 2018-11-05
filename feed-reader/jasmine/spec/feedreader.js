/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('should have url defined for all feeds and non empty', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.trim().length).not.toBe(0);
                expect(typeof feed.url).toMatch('string');
            });
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('should have name defined for all feeds and non empty', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.trim().length).not.toBe(0);
                expect(typeof feed.name).toMatch('string');
            });
        });
    });


    /* TODO: Write a new test suite named "The Menu" */
    describe('The Menu', function () {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('should be hidden by default', function () {
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('should change its visibility when menu icon clicked', function () {
            let menuIconElement = $('.menu-icon-link');

            // check menu is hidden
            expect($('body').hasClass('menu-hidden')).toBe(true);

            // click menu icon to view menu
            menuIconElement.click();
            // check menu is visible
            expect($('body').hasClass('menu-hidden')).toBe(false);

            // click menu icon to hide menu
            menuIconElement.click();
            // check menu is hidden
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function () {

        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        });

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('should load feed and display the entry', function () {
            expect($('.feed .entry').length).not.toBe(0);
        });


        /* ADDITIONAL: Test that ensures header title to display the feed name.
		 */
        it('should display the feed heading', function () {
            expect($('.header-title').text()).toMatch(allFeeds[0].name);
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function () {

        let initialFeedHtml, nextFeedHtml, initialFeedHeader, nextFeedHeader;

        beforeEach(function (done) {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            // load initial feed
            loadFeed(0, function () {
                initialFeedHtml = $('.feed').html();
                initialFeedHeader = $('.header-title').text();

                // load next feed
                loadFeed(1, function () {
                    nextFeedHtml = $('.feed').html();
                    nextFeedHeader = $('.header-title').text();
                    done();
                });
            });
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('should check content actually changes', function (done) {
            // feed content
            expect(initialFeedHtml).not.toBe(nextFeedHtml);
            // feed title
            expect(initialFeedHeader).not.toBe(nextFeedHeader);
            done();
        });

    });

    /* ADDITIONAL: New test suite named "Menu Selection" */
    describe('Menu Selection', function () {

        /* ADDITIONAL: Test that ensures when a new menu item
         * selected slide menu will hide.
         */
        it('should hide the slide menu on item selection', function () {
            let menuIconElement = $('.menu-icon-link');
            let menuItemElement = $('.slide-menu > .feed-list > li:first > a');

            // check menu is hidden
            expect($('body').hasClass('menu-hidden')).toBe(true);

            // click menu icon to view menu
            menuIconElement.click();
            // check menu is visible
            expect($('body').hasClass('menu-hidden')).toBe(false);

            // click menu item to load feed
            menuItemElement.click();
            // check menu is hidden
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

    });

}());
