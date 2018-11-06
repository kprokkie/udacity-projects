# Feed Reader Testing Project

It is a web-based application that reads RSS feeds.

Testing the Feed Reader app using Javascript testing framework `Jasmine`.

## Why Testing?

Testing is an important part of the development process and many organizations practice a standard of development known as `test-driven development`. This is when developers write tests first, before they ever start developing their application. All the tests initially fail and then they start writing application code to make these tests pass.

Whether you work in an organization that uses test-driven development or in an organization that uses tests to make sure future feature development doesn't break existing features, it's an important skill to have!


# Test Coverage
```
> Test Suite: RSS Feeds
```
- allFeeds variable has been defined and that it is not empty
- allFeeds object and ensures it has a URL defined and that the URL is not empty and type match
- allFeeds object and ensures it has a name defined and that the name is not empty and type match
```
> Test Suite: The Menu
```
- menu element is hidden by default
- menu changes visibility when the menu icon is clicked
```
> Test Suite: Initial Entries 
```
- loadFeed function is called to fetch and display the feed
- header title to display the feed name
```
> Test Suite: New Feed Selection 
```
- new feed is loaded by the loadFeed function that the content  and title actually changes
```
> Test Suite: Menu Selection
```
- when a new menu item selected slide menu will hide

## How to run test?

In order to run the test properly, consider the following steps:

- Clone or download this repository or [run here](https://kprokkie.github.io/feed-reader/).
- Open the index.html file in any modern browser to view.