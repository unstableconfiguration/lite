# lite.js 

Lightweight utility library for creating single-page web applications. 
Contains tools for template loading, data binding, routing, and http requests.

todo: 
    Two-way data binding with proxy wrapper


## lite
Basic template binding. Appends 'content' string to 'container' id/element.

## router
Holds a 'routes' collection of pattern-value pairings. 
Allows setting of a custom onHashChange event. 
When the window hash changes, the router finds a matching pattern in the routes collection and calls onHashChange with the corresponding value. 

## xhr
XMLHttprequest wrapper for simplified get/put/post/delete syntax. 

## bindings
wip - two way data bindings using Proxy object and html name attributes. 