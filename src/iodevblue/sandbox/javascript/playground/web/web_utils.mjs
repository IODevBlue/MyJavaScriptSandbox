'use_strict'

// import utils from '../utils.cjs'
let utils = {
     is_browser: typeof window !== 'undefined' && typeof document !== 'undefined'

}

export const img_dir = "/src/iodevblue/sandbox/javascript/playground/resources/images";
export const img_output_json = "image_list.json";
export const img_output_json_dir = `${img_dir}/${img_output_json}`

export let images = []

export default utils

