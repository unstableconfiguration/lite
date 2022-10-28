

export class Router {
    /* { pattern : RegExp, value : any } */
    routes = [];

    initialize() {

        window.onhashchange = this.#onHashChange.bind(this);
    }

    /* onHashChange - user supplied event
        When locatino.hash is changed, is called with first matching route value. */
    onHashChange(value) { }

    #onHashChange() {
        let hash = location.hash
            .slice(1) // skip # symbol
            .split('?')[0]; // ignore query
            
        let path = this.routes.find(route => 
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
        search = search.replace('&amp;', '&')

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
