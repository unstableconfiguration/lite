# Lite
Lite is a utility for building single page applications. It creates views that load and pair .html templates and .json data sources. I have written it mostly as an education project, but have used it to build my personal site. It is lightweight both in terms of being only a couple kilobytes in size, and in terms of having very minimalist features. 

## Example Usage

```
    let view = lite.extend({
        // Content can be provided as a html string
        content : '<div id="exampleDiv"></div>'
        // Content can be loaded by url
        , content_url : 'exampleTemplate.html'

        // Data can be declared and added directly
        , data : { message : 'hello world' }
        /* Data can be loaded as a file. If done this way, the file will be added to the header, but we will have to set the .data property in .onDataLoaded */ 
        , data_url : 'demo_data.js'

        , onContentLoaded : function(content){
            console.log('1a', 'content loaded', content);
        }
        , onDataLoaded : function(data){
            console.log('1b', 'data loaded', data)
        }
        , onContentBound : function(content){
            console.log('2', 'content bound');
        }
        , onDataBound : function(data){
            console.log('3', 'data bound', data);
        }
        
    });

    let container = document.createElement('div');
    document.body.appendChild(container);

    new view().attach(container);
```

## Public Interfaces

* .attach(container) : Initiates the view lifecycle, loading the content and data, and binding them to the page.
* .extend(options) : Creates a derived class with Lite as its base which is extended by the properties in the options object parameter. 
* .loadStyleSheet(uri) : Adds a <link> element to the page head if one does not already exist for the given uri

## View Lifecycle 
The view lifecycle contains 4 events. Content and data are loaded asynchronously, so there is not a guarantee of the order for onContentLoaded and onDataLoaded. Content is bound before data, so onContentBound will execute before onDataBound.

* onContentLoaded(content): Executes after content has been loaded but before it has been bound to the page.
* onDataLoaded: Executes after data has been loaded, but before it has been bound to the content. 
* onContentBound: Executes after .html content has been added to the page. 
* onDataBound: Executes after data has been bound to the page. 

## Features

#### require.js integration: 
When data_url points to a file utilizing require.js' define() function, .data will 
automatically be set using the results of that.

#### Data binding 
HTML elements in the content can be given a 'bind' attribute. If the value for bind matches a property in the data, the element's .value or .innerHTML will be set to the value from the data for that property. 

```
let view = lite.extend({
    content : "<span id='spanMessage' bind='message'></span>",
    data : { message : 'hi!' },
    onDataBound : function() { 
        let span = document.getElementById('spanMessage');
        console.log(span.innerHTML); // expect hi!
    }
});
let container = document.createElement('div');
document.body.appendChild(container);
new view().attach(container);
```



## Future plans
* Loading data by async function: For loading data from APIs. A promise-like function can be provided to load data asynchronously from external sources.
* Revisit xhr and please : These are small utilities that were developed as independent from lite, but that lite is dependent on. They may get revamped and either removed as dependencies or integrated more thoroughly into lite. 





