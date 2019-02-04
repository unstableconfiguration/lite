
let please = new(function () {
    let _please = this;

    _please._handlers = {}
    _please.addHandler = function (type, comparer, resolver) {
        _please._handlers[type] = {
            compare: comparer,
            resolve: resolver
        }
    }

    let TaskList = function () {
        let _tl = this;
        _tl.id = 1; // number of requests
        _tl.active = 1; // unresolved requests
        _tl.results = []; // results/responses
        _tl.callback = () => {}; // final callback
        _tl.result = (id, v) => {
            _tl.active--; // decrement unresolved
            _tl.results[id - 1] = v; // add result
            _tl.resolve();
        };
        _tl.resolve = () => { // if none active callback(results)
            if (!_tl.active) _tl.callback.apply(_tl, _tl.results);
        }
        return _tl;
    }

    _please.do = function (req) {
        // does this instantiate itself automatically 
        let tl = this instanceof TaskList ? this : new TaskList();

        for (let h in _please._handlers) 
            if (_please._handlers[h].compare(req)) {
                _please._handlers[h].resolve(tl, req, tl.id);
                break;
            }

        return {
            and: (req) => {
                tl.id++;
                tl.active++;
                return _please.do.bind(tl)(req);
            },
            then: (func) => {
                tl.callback = func;
                tl.resolve();
                return _please;
            }
        }
    }
    return _please;
})()

please.addHandler('null',
    (req) => { return !req; },
    (tl, _, id) => { tl.result(id, undefined); } );

please.addHandler('xhr',
    (xhr) => { return xhr instanceof XMLHttpRequest; },
    (tl, xhr, id) => {
        if (xhr.status === 200)
            tl.result(id, xhr.response);
        else {
            let orsc = xhr.onreadystatechange.bind(xhr);
            xhr.onreadystatechange = () => {
                orsc();
                if (+xhr.readyState === 4 && +xhr.status === 200)
                    tl.result(id, xhr.response);
            }
        }
    }
);
please.addHandler('promise',
    (prm) => { return prm instanceof Promise; },
    (tl, prm, id) => { prm.then((res) => { tl.result(id, res); }); } );

// Unknown type, pass through
please.addHandler('zundefined',
    (udf) => { return true; },
    (tl, udf, id) => { tl.result(id, udf); } );

