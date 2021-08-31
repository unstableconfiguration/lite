export let Router = function(options = {}){ 
    let router = this;
    router.routes = [ /* { pattern : /^xyz$/, value : any } */]

    /* onHashChange: 
        When hash is changed, will be called with the first matching route value
    */
    let onHashChange = function(value) { }
    Object.defineProperty(router, 'onHashChange', {
        get : function() { return onHashChange; },
        set : function(val) { 
            onHashChange = val;
            window.onhashchange = router.__onHashChange;
        }
    });

    router.__onHashChange = function() { 
        let hash = location.hash
            .slice(1) // Skip #
            .split('?')[0]; // Ignore query 

        let path = router.routes.find(route => {
            return route.pattern.test(hash);
        });        
        let value = path ? path.value : '404';

        onHashChange(value);
    }
    router.onHashChange = options.onHashChange || onHashChange;

    router.getSearchParams = function(search = location.search) { 
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

    router.addRoutes = function(routes) { 
        if(!Array.isArray(routes)) { return; }
        routes.forEach(route => router.addRoute(route));
    }

    /*
        route:  { route : '', value : '' } 
    */
    router.addRoute = function(route) {
        if(route.route instanceof RegExp) { 
            route.pattern = route.route;
            router.routes.push(route);
        }
        if(typeof(route.route) !== 'string') { return; }

        route.pattern = router.getPathRegex(route.route);

        router.routes.push(route);
        return router.routes;
    }

    const escapeSpecialChars = function(path) {
        ['(', ')', '/']
            .forEach(specialChar => {
                path = path.replace(specialChar, '\\' + specialChar);
            });
        return path;
    }

    /* Replaces syntax {wildcard} with .+ regex wildcard
        /route/{wildcard} -> /route/.+
    */
    const escapeWildCard = function(path) { 
        return path.replace(/{.+}/, '.+');
    }

    router.getPathRegex = function(path) {
        path = escapeWildCard(path);
        path = escapeSpecialChars(path);

        let pattern = new RegExp('^' + path + '$');
        return pattern;
    }

    return router;

}

export let router = new Router();





