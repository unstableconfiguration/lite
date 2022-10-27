import { Router } from './app/router.js'
import { Lite } from './app/lite.js'
import { XHR } from './app/xhr.js'
import { Utilities } from './app/utilities.js'

Lite.prototype.utilities = new Utilities();
Lite.prototype.xhr = new XHR();

export { Lite, Router, XHR, Utilities }
