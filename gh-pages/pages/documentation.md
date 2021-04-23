# lite  

## basic usage
At its most basic, lite is about attaching text or html content to a container HTMLElement in a predictable and customizable way. 

```javascript 
let view = lite.extend({
    container : 'base-demo',
    content : '<span>Basic usage test.</span>'
});

new view().attach();
```
<div id='base-demo'></div>

## .extend(options = {})
.extend creates a clone of the base lite object with all its defaults. It accepts an object as a parameter. The clone will contain all of the property:value pairings of the parameter object, which is used to overwrite default values or to add custom functionality to the view.

```javascript 
let view = lite.extend({
    container : 'extend-demo',
    content : '<b>Default Content :</b> ',
    customProperty : 'custom text',
    onContentLoaded : function() { 
        this.content = this.content + this.customProperty;
    }
});

new view().attach();
```
<div id='extend-demo'></div>

## .container 
Each lite view needs a container element to attach to. The container can be defined either as part of the .extend({}) parameter object, or as a parameter to the .attach() function. In either case, the container can be a reference to an HTMLElement, or it can be an id to look up the element with. 

```javascript
let view = lite.extend({
    // Container can be set in the .extend object. It can be an ID or an HTMLElement
    container : document.getElementById('container-demo') || 'container-demo',
    content : '<b>Container demo</b>'
});

// Container can also be a parameter of .attach(container); */
new view().attach('container-demo-1');
```
<div id='container-demo'></div>

## .content 
.content represents what will become the .innerHTML value of the .container. Typically it will be some form of stringified HTML, but there are no limitations on it.

```javascript
let view = lite.extend({
    container : 'content-demo',
    content : '<div><span style="background:#555; color:#fff;">HTML content: </span><span style="border:solid thin #555; padding:0em .2em;">Typical content will be a HTML string</span></div>'
});

new view().attach();
```
<div id='content-demo'></div>

## .contentUrl
An alternative to setting content is setting a .contentUrl. In this case, the text of the specified file will be loaded via XMLHttpRequest.

```javascript
let view = lite.extend({
    container : 'contentUrl-demo',
    // We can load the markdown source for this page.
    contentUrl : './documentation.md'
});

new view().attach();
```
<div id='contentUrl-demo' style='max-height:100px; overflow:scroll;'></div>

## .setContent(content = '');
Content can be explicitly set via the .setContent() function. Doing so will trigger the normal view lifecycle.


```javascript
let view = lite.extend({
    onContentLoaded : function(content) { this.content = marked(content); },
});
view = new view();
view.attach('setContent-demo')

view.setContent('**Setting via .setContent**: Content is set and view lifecycle is triggered');
```
<div id='setContent-demo'></div>

## .setData()

## .bindData()

## view lifecycle

## .loadStyleSheet(path)

## .loadScript(path)



# Router

## initialization

## .paths[]

# XHR

## .get(url, args)

## .then(callback)

## .error(handler)