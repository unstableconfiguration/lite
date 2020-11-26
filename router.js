
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
    let onHashChange = function(hash, pathValue, args) {
        throw('lite.router.onHashChange not set')
    }
    router.onHashChange = options.onHashChange || onHashChange;
    
    router.__onHashChange - function() { 
        let hash = location.hash || '#';
        
        let path = router.paths.find(path => {
            return path.pattern.test(hash);
        });
        let value = path ? path.value : null;

        let urlArgs = router.getURLParams(hash);
        router.onHashChange(hash, value, urlArgs);
    }

    router.getURLParams = function(hash) { 
        let args = location.search;
        if(!args) { return null; }

        let params = new URLSearchParams(args);
        let objParams = {};
        for(let k in params.keys()) {
            objParams[k] = params.get(k);
        }
        
        return objParams;
    }

    router.addPath = function(hash, value) {
        if(hash instanceof RegExp) { 
            _router.paths.push({ pattern : hash, value : value });
        }
        if(typeof(hash) !== 'string') { return; }

        hash = hash.replace(/{.+}/, '.+');
        hash = hash.replace('/', '\/');
        /* hash to match #location/hash
            with ?optional=true&parameters=1*/
        let pattern = new RegExp('^\#' + hash + '(\\?.*)?$');
        
        _router.paths.push({ pattern : pattern, value : value });
        return _router.paths;
    }

    router.addPaths = function(paths) { 
        for(let p in paths) {
            _router.addPath(p, paths[p]);
        }
        return _router.paths;
    }

    window.onhashchange = router.__onHashChange;
    if(options.onHashChange) { window.onhashchange(); }
    if(options.paths) { router.addPath(paths); }
}



