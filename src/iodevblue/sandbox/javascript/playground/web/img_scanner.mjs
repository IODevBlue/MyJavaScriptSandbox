"use strict";


///////////////////////////////////////////////////////////////////////////
// IMPORTS
/////////////////////////////////////////////////////////////////////////
import fs from "fs";
import global_switch from "./global_switch.mjs";
import utils, {img_dir, img_output_json, img_output_json_dir, images} from './web_utils.mjs'



///////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////
// EXPORTED FUNCTIONS
///////////////////////////////////////////////////////////////////////////
export function load_test_img_dir() {
     let img_dir_updtd = img_dir.charAt(0) === '/' ? img_dir.slice(1, img_dir.length) : img_dir
     let img_dir_output_updtd = img_output_json_dir.charAt(0) === '/' ? img_output_json_dir.slice(1, img_output_json_dir.length) : img_output_json_dir

      if (fs.existsSync(img_dir_output_updtd)) {
               console.log(`${img_dir_output_updtd} exists. Deleting JSON file...`)
               fs.unlinkSync(img_dir_output_updtd)
          }
          try {
               const files = fs.readdirSync(img_dir_updtd);
               const img_files = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
               // images.
               Array.   
               images = Array.from(img_files)
               fs.writeFileSync(img_dir_output_updtd, JSON.stringify(img_files, null, 2));
               console.log(`JSON generated with ${img_files.length} images.`);

          } catch (err) {
               if(err) {
                    if(global_switch.allow_scripting && utils.is_browser) {
                         alert(`Unable to scan dir: ${img_dir_updtd}\nError: ${err}`)
                    } else {
                         console.log(`Unable to scan dir: ${img_dir_updtd}\nError: ${err}`)

                    }
               }
          }
     
}

