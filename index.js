import { Router } from './app/router.js'
import { Lite } from './app/lite.js'
import { XHR } from './app/xhr.js'
import { HeaderUtilities } from './app/header-utilities.js'
import { DataBinding } from './app/data-binding.js'

Lite.head = new HeaderUtilities();
Lite.xhr = new XHR();
Lite.router = new Router();
Lite.bindings = new DataBinding();

export { Lite, Router, XHR }
