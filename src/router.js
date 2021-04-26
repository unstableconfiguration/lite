
export let Router = function(options = {}) { 
    let router = this;
    router.paths = [
        // { pattern : /./, value : '' }
    ];

    /* User supplied. Executes when the window.location.hash changes 
        hash: the window.location.hash value 
        value: The value of the first router path to match the hash.
            Null if no path match
        args: URLSearchParams in object form. 
            example: ?key1=val1&key2=val2 gets converted to { key1 : val1, key2 : val2 }
    */
    let onHashChange = function(hash, pathValue, args) { }
    Object.defineProperty(router, 'onHashChange', {
        get : function() { return onHashChange; },
        set : function(val) { 
            onHashChange = val;
            window.onhashchange = router.__onHashChange;
        }
    });

    router.__onHashChange = function() { 
        let hash = location.hash || '#';
        
        let path = router.paths.find(path => {
            return path.pattern.test(hash);
        });        
        let value = path ? path.value : null;

        let search = /\?.+$/.exec(hash);
        search = search ? search[0] : location.search;
        let urlArgs = router.getSearchParams(search);
        
        onHashChange(hash, value, urlArgs);
    }
    router.onHashChange = options.onHashChange || onHashChange;
    

    router.getSearchParams = function(search) { 
        if(!search) { return null; }

        let params = new URLSearchParams(search);
        
        let objParams = {};
        for(const k of params.keys()) {
            objParams[k] = params.get(k);
        }
        
        return objParams;
    }

    /*
        path : { hash : '', value : any }
    */
    router.addPath = function(path) {
        if(path.hash instanceof RegExp) { 
            router.paths.push({ pattern : path.hash, value : path.value });
        }
        if(typeof(path.hash) !== 'string') { return; }
        let pattern = router.getHashRegex(path.hash);
        router.paths.push({ pattern : pattern, value : path.value });
        return router.paths;
    }

    const escapeSpecialChars = function(hash) {
        ['(', ')']
            .forEach(specialChar => {
                hash = hash.replace(specialChar, '\\' + specialChar);
            });
        return hash;
    }

    const escapeWildCard = function(hash) { 
        return hash.replace(/{.+}/, '.+');
    }

    router.getHashRegex = function(hash) {
        hash = escapeWildCard(hash);
        hash = escapeSpecialChars(hash);
        /* hash to match #location/hash
            with ?optional=true&parameters=1*/
        let pattern = new RegExp('^\#' + hash + '(\\?.*)?$');
        return pattern;
    }

    /*
        paths = [path, path]
    */
    router.addPaths = function(paths) { 
        for(let p in paths) {
            router.addPath(paths[p]);
        }
        return router.paths;
    }

    if(options.paths) { router.addPaths(options.paths); }
    return router;
}



