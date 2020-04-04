# Lite
Lite is a utility for building single page applications. It creates views that load and pair .html templates and .json data sources. I have written it mostly as an education project, but have used it to build my personal site. It is lightweight both in terms of being only a couple kilobytes in size, and in terms of having very minimalist features. 

## Example Usage
From the demo page of this project. 
```
    let view = lite.extend({
        content_url : 'demo_template.html'
        , data_url : 'demo_data.js'
        , onContentLoaded : function(content){
            console.log('content loaded');
        }
        , onContentBound : function(content){
            console.log('content bound');
        }
        , onDataLoaded : function(data){
            console.log('data loaded', data)
            this.data = demo_data;
            this.content += ' ' + this.data.message;
        }
        , onDataBound : function(data){
            console.log('data bound', data);
        }
        
    });
    new view().attach(document.getElementById('container'));
```

## Public Interfaces

* .attach(container) : Initializes the view lifecycle and attaches the content to the container (an HTML element).
* .extend(options) : Creates a derived class with Lite as its base which is extended by the properties in the options object parameter. 
* .loadStyleSheet(uri) : Adds a <link> element to the page head if one does not already exist for the given uri

## View Lifecycle 
The view lifecycle contains 4 events. Content and data are loaded asynchronously, so there is not a guarantee of the order for onContentLoaded and onDataLoaded. Content is bound before data, so onContentBound will execute before onDataBound.

* onContentLoaded(content): Executes after content has been loaded but before it has been bound to the page.
* onDataLoaded: Executes after data has been loaded, but before it has been bound to the content. 
* onContentBound: Executes after .html content has been added to the page. 
* onDataBound: Executes after data has been bound to the page. 

### please.js
please.js is an included promise resolution utility. It supports xmlhttprequests, native promises, and can be extended to include other asynchronous tasks. It is used as part of lite's event handling to trigger onloaded events once both the data and template have been loaded. 

### xhr.js
xhr.js is an included XMLHTTPRequest wrapper utility. It currently just wraps around GET 
calls and is used as part of lite's file loading.