import { router } from './app/router.js'
import { Lite } from './app/lite.js'
import { xhr } from './app/xhr.js'
import { Utilities } from './app/utilities.js'

Lite.prototype.utilities = new Utilities();
// Lite.Router
// Lite.Xhr

// Lite.prototype.router
// Lite.prototype.xhr

// Lets not export class instances

export { Lite }
