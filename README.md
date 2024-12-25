# FreeCell

THis is a very basic implementation of the FreeCell Solitair game
as a local web application. The game uses Google Chrome's application
mode where no UI is shown except the web page content (I think this
used to be called "kiosk" mode). The app is built in a way such 
that it can run without a local web server by just clicking the
`index.html` file. To make this work the app has to skirt around
CORS rules, which for example means that JS modules do not work.
To start Chrome in app mode and maximized the game is started via
a batch script.

## Why?

My grandmother loves to play FreeCell Solitair on her computer. However,
when I wanted to re-install the game on a new machine I could not find
the version I previously used. After searching through the available
options on the internet and was unpleased, I decided to hack together
my own version without ads and stuff.

## Card textures

The texture map containing the images of the card faces was made
by Dmitry Formin and taken from [WikiCommons][wikiCommons] where
it is provided under " Creative Commons CC0 1.0 Universal Public Domain Dedication".

## Author

This game was made by [PreyMa][githubPage].

[wikiCommons]: https://commons.wikimedia.org/wiki/File:English_pattern_playing_cards_deck.svg
[githubPage]: https://github.com/PreyMa
