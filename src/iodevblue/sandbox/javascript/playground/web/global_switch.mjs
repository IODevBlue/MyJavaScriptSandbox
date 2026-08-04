'use_strict'

import utils from './web_utils.mjs'

class GlobalSwitch {

     ///////////////////////////////////////////////////////////////////////////
     // STATIC CONSTRUCTS
     ///////////////////////////////////////////////////////////////////////////
     static #_instance = null



     ///////////////////////////////////////////////////////////////////////////
     // PROPERTIES
     ///////////////////////////////////////////////////////////////////////////
     #_activate_DOM
     get activate_DOM() {
          return this.#_activate_DOM;
     }
     set activate_DOM(value) {
           if (typeof value !== 'boolean') {
               return
          }
          this.#_activate_DOM = value;
     }

     #_allow_scripting
     get allow_scripting() {
          return utils.is_browser && this.#_activate_DOM
     }



     ///////////////////////////////////////////////////////////////////////////
     // VARIABLES
     ///////////////////////////////////////////////////////////////////////////
     #_initialized



     ///////////////////////////////////////////////////////////////////////////
     // FUNCTIONS
     ///////////////////////////////////////////////////////////////////////////
     constructor() {
          // if(!this.#_initialized) {
               // this.#_instance = new GlobalSwitch()
               this.#_activate_DOM = true
               this.#_allow_scripting = true
               // this.#_initialized = true
          // }

          // return this.#_instance
     }

     print_this(value) {
          console.log("Global Switch is printing: ", value)
     }

};

const global_switch = new GlobalSwitch()

export default global_switch;
