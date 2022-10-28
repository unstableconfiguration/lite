import { Router } from './app/router.js'
import { Lite } from './app/lite.js'
import { XHR } from './app/xhr.js'
import { HeaderUtilities } from './app/header-utilities.js'

Lite.head = new HeaderUtilities();
Lite.xhr = new XHR();
Lite.Router = new Router();

export { Lite, Router, XHR }
