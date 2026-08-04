"use strict";

///////////////////////////////////////////////////////////////////////////
// IMPORTS
///////////////////////////////////////////////////////////////////////////
import global_switch from './global_switch.mjs';
// import { img_output_json_dir, images, load_test_img_dir } from './img_scanner.mjs'
// const web_utils = require('../utils.cjs')
import utils, {img_dir, img_output_json, img_output_json_dir, images} from './web_utils.mjs'



///////////////////////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////////////////////
let img_arr = []



///////////////////////////////////////////////////////////////////////////
// DOM
///////////////////////////////////////////////////////////////////////////

if(global_switch.allow_scripting) {
     // load_test_img_dir()
     fetch(img_output_json_dir)
     .then(response => response.json())
     .then(data => {
          img_arr = data
          console.log(`Images from ${img_output_json} loaded!`)
     })
     .catch(err => console.log("Error"))
     img_arr = Array.from(images)

     const btn = document.getElementById('toggle-btn');
     const title = document.getElementById('status-title');
     const show_alert_btn = document.getElementById("show_alert")
     const show_random_img_btn = document.getElementById("random_img_btn")
     const img_node = document.getElementById("image")

     let isProcessing = false;

     // Register an event listener (The Event Loop Hook)
     btn.addEventListener('click', () => {
          isProcessing = !isProcessing;

          if (isProcessing) {
               title.textContent = "System Status: Processing...";
               btn.textContent = "Halt Task";
          } else {
               title.textContent = "System Status: Idle";
               btn.textContent = "Execute Task";
          }
     });

     show_alert_btn.addEventListener('click', () => {
          show_window_alert("This is an alert")
          console.log("Alert Shown!")
     });

     show_random_img_btn.addEventListener(`click`, () => {
          if(img_arr.length === 0) {
               alert("Image array is empty or still loading!!")
          }

          const rand_index = Math.floor(Math.random() * img_arr.length);
          const rand_img_name = img_arr[rand_index]
          img_node.src = `${img_dir}/${rand_img_name}`
     })


}




///////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////
function show_window_alert(message) {
     if(utils.is_browser && typeof message != "undefined" && message ) {
          window.alert(message)
     }
}

export function main() {
     console.log("Image array from web is: ", img_arr)
}

