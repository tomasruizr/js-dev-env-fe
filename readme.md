# Front End Javascript development Environment

## Dependencies

### Http library

* Fetch (with whatwg-fetch polyfill)

## Development Enviroment Elements

### Sharing Work in progres:

* localtunnel
* surge
* Other options: (ngrok, now)

### Development Web Server

* Express

### Automation

* Npm Scripts

### Transpiling

* Babel
* babel-plugin-transform-es2015-modules-commonjs-simple: for noMangle

### Bundler

* WebPack

### Linting

* ESLint

### JS Error Logging:

* TrackJS

## Testing

###Framework

* Mocha

### Assertion Library

* Chai (assert)

### Helper Library

* JSDOM: Simulates browser's DOM, run DOM-related tests without a browser.
* Cheerio: jQuery selector for the server virtual DOM
* fetch-mock:Mocks Fetch library
* isomorphic-fetch: Provides Fetch functionality in node for testing


### CI

* Travis (Linux Based)
* Appveyor (Windows Based) 


## Project Organization (look at demo folder)

* Organize by feature instead of by file type.
* Place the tests in the same place as the features.

## Other useful libraries to consider

* moment.js: Time management
* numeral.js: Formats sumber strings.
