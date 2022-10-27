/* 
*/
class Router {
    /* { pattern : RegExp, value : any } */
    routes = [];

    constructor(options = {}) {
        if(options.onHashChange) this.onHashChange = options.onHashChange;
        window.onhashchange = this.#onHashChange;
    }

    /* onHashChange - user supplied event
        When locatino.hash is changed, is called with first matching route value. */
    onHashChange(value) { }

    #onHashChange() {
        let hash = location.hash
            .slice(1) // skip # symbol
            .split('?')[0]; // ignore query
            
        let path = router.routes.find(route => 
            route.pattern.test(hash));
        let value = path ? path.value : '404';

        this.onHashChange(value);
    }

    /* Parse url search into JSON object */
    getSearchParams(search = location.search) {
        if(!search) {
            search = /\?.+$/.exec(location.hash);
            if(search) { search = search[0]; }
        }
        if(!search) { return; }
        search = search.replace('&amp;', '&');

        let params = new URLSearchParams(search);
        
        let objParams = {};
        for(const k of params.keys()) {
            objParams[k] = params.get(k);
        }
        
        return objParams;
    }

    addRoutes(routes) {
        if(!Array.isArray(routes)) return;
        routes.forEach(route => this.addRoute(route));
    }

    addRoute(route) {
        if(route.route instanceof RegExp) {
            route.pattern = route.route;
            this.routes.push(route);
        }

        if(typeof(route.route) !== 'string') return; 

        route.pattern = this.#getPathRegex(route.route);

        this.routes.push(route);
        return this.routes;
    }

    #getPathRegex(path) {
        path = this.#escapeWildCard(path);
        path = this.#escapeSpecialChars(path);

        let pattern = new RegExp('^' + path + '$');
        return pattern;

    }
    
    /* Replaces syntax {wildcard} with .+ regex wildcard
        /route/{wildcard} -> /route/.+
    */
    #escapeWildCard(path) {
        return path.replace(/{.+}/g, '.+');
    }
    
    /* Escapes regex special characters when building pattern.*/
    #escapeSpecialChars(path) {
        ['(', ')', '/']
        .forEach(specialChar => {
            path = path.replace(specialChar, '\\' + specialChar);
        });
        return path;
    }
}

class Lite {
    /* Container: 
        Can be set as an id for an html element
        Can be set as a query selector for an html element
        Can be set as a reference to an html element
    */
    container = '';
    /* Content
        String value to set as the container's innerHTML
    */
    content = '';

    constructor(options = {}) { 
        Object.assign(this, options);
        
        this.container = this.#getContainer();
        if(!this.container instanceof HTMLElement)
            throw `could not parse container to html element. value is ${this.container}`;
    
        this.#appendContent();
        this.onContentBound();
    }

    /* onContentBound
        Overridable. Is called after content is appended to the container
    */
    onContentBound() { }

    #getContainer() { 
        let element = this.container;
        if(typeof(element) == 'string') {
            element = document.getElementById(element);
            if(!element)
                element = document.querySelector(element);
        }

        return element instanceof HTMLElement
            ? element
            : this.container;
    }

    #appendContent() { 
        while(this.container.firstChild)
            this.container.removeChild(this.container.firstChild);
        this.container.insertAdjacentHTML('afterbegin', this.content);
    }
}

class XHR {

    open(url, args = {}) {
        args = this.#setDefaultArgs(args);

        let xhr = new XMLHttpRequest();
        xhr.open(args.method, url, args.async);

        xhr = this.#setEvents(xhr, args);
        xhr = this.#setCallbackChains(xhr);
        xhr = this.#setHeaders(xhr, args);

        Object.assign(args, xhr);

        return xhr;
    }

    get(url, args) { return this.open(url, args); }

    post(url, data, args = {}) {
        args.method = 'POST';
        args.data = data;
        return this.open(url, args);
    }

    put(url, data, args = {}) {
        args.method = 'PUT';
        args.data = data;
        return this.open(url, args);
    }

    delete(url, args = {}) {
        args.method = 'DELETE';
        return this.open(url, args);
    }
    
    defaultArgs = { 
        method : 'GET',
        async : true,
        responseType : 'text'
    }

    #setDefaultArgs = function(args = {}) {
        for(let k in this.defaultArgs) { 
            args[k] = args[k] || this.defaultArgs[k];
        }
        return args;
    }

    #events = [ 
        'abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'timeout'
    ];

    #setEvents = function(xhr, args = {}) { 
        this.#events.forEach(e => { 
            let ev = args[e] || args['on' + e];
            if(ev) { 
                xhr.addEventListener(e, (e) => ev(e));
            }
        });
        return xhr;
    }

    #setCallbackChains = function(xhr) { 
        xhr.load = function(onLoad) {
            xhr.addEventListener('load', (r) => onLoad(xhr.response));
            xhr.send(xhr.data);
            return xhr;
        };

        xhr.error = function(onError) { 
            xhr.addEventListener('error', onError);   
            return xhr;
        };

        xhr.then = xhr.load;
        xhr.catch = xhr.error;
        return xhr;
    }

    #setHeaders = function(xhr, args = {}) {
        if(!Array.isArray(args.headers)) { return xhr; }
        args.headers.forEach(header => { 
            if(!header.header || !header.value) {  
                console.log('Header must be in form { header : "ABC", value : "XYZ" }');
                return;
            }
            xhr.setRequestHeader(header.header, header.value);
        });

        return xhr;
    }
}

// how much does it make sense to even have these here 
// They are unscoped, just useful things to have around 
// probably make them part of the client, not here. 
class Utilities {
    addCss(uri) {
        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = uri;
       
        let links = document.getElementsByTagName('link');
        let hasLink = Array.from(links).some((link) => { 
            return link.href == css.href;
        });
        if(hasLink) { return; }
  
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(css);
        return css;    
    }

    addScript(uri) { 
        let script = document.createElement('script');
        script.src = uri;

        let scripts = document.getElementsByTagName('script');
        let hasScript = Array.from(scripts).some((s) => {
            return s.src == script.src;
        });
        if(hasScript) { return; }

        let head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
        return script;
    }
}

Lite.prototype.utilities = new Utilities();
Lite.prototype.xhr = new XHR();

export { Lite, Router, Utilities, XHR };
