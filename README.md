# lite.js 
Lightweight, single-page, javascript framework. 

## lite
Basic template + data binder. Attaches string/html content to a container element and performs logic-less data binding. 

```
import { lite } from 'lite'

var vm = lite.extend({
    container : document.getElementById('main'),
    content : '<span data-bind="propertyA"></span><span data-bind="nested.propertyB"></span>',
    data = { propertyA : 'test', nested : { propertyB : 'test2' } },
    initialize : function() { 
        console.log('initializing')
    }
});
vm = new vm();
```

## router
Creates a collection of pattern-value pairs to be handled by a custom onHashChange event. 

The example below pairs with bundlers that utilize dynamic imports. 
```
import { router } from 'lite';

let main = document.getElementById('main');
let load = (page) => new page.vm({ container : main });
router.addRoutes([
    { route : 'path1', value : () => { import('./pages/path1.js').then(load); } },
    { route : 'paths/path2', value : () => { import('./pages/paths/path2.js').then(load); } }
]);

router.onHashChange = function(value) { 
    if(value == '404') { /* Not found handler */ } 
    if(typeof(value) === 'function') { value(); }
}
```

## xhr
Syntax wrapper for xmlhttprequests for easy promise-like requests. 

```
import { xhr } from 'lite'

xhr.get('http://example.com/')
    .then(res => { /* ... */ });

xhr.post('http://someapi.com/endpoint', { some : 'data' })
    .then(res => { /* ... */})

```