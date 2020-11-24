import { lite } from '../lite.js';

export let LiteTest = function() { 
    let assert = chai.assert;

    describe('Lite Tests', function() { 

        it('should overwrite defaults with provided options', function() { 

            assert(true);
        });
        // extensibility, overwrites defaults

        // View lifecycle 
            // init
            // oncontentloaded
            // oncontentbound
            // ondataloaded
            // ondatabound

        // content loading and binding 
            // loads content from files 
            // attaches content to element

        // data loading and binding 
            // setdata 
            // data binding with 'bind' attribute

        // utilities
            // load stylesheet 
            // load script 


    });
}