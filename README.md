## Lite
Lite is a self-education project. It is a single page application utility based loosely on 
Marionette.js, but much more stripped down and feature-light. It creates views that load 
.html templates and .json data sources and binds them together in a web page. 

### Usage

### Lifecycle 
There are four main events in the lite lifecycle:
* onContentLoaded: Executes after .html content has been loaded. Triggered automatically if 'content' is set. 
* onDataLoaded: Executes after .json data has been loaded. Triggered automatically if 'data' is set. 
* onContentBound: Executes after .html content has been added to the page. 
* onDataBound: Executes after data has been bound to the page. 


### please.js
please.js is an included promise resolution utility. It supports xmlhttprequests, native promises, 
and can be extended to include other asynchronous tasks. It is used as part of lite's event handling to 
trigger onloaded events once both the data and template have been loaded. 

### xhr.js
xhr.js is an included XMLHTTPRequest wrapper utility. It currently just wraps around GET 
calls and is used as part of lite's file loading.