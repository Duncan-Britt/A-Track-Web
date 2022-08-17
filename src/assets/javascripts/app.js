'use strict';

import { Dom } from "./dom.js";
import { keydown_handler, keyup_handler } from "./keypress.js";

document.addEventListener('DOMContentLoaded', () => {
  Dom.init();
  // Need to wait until assignment data has been retrieved before
  // allowing commands which can acess Assignments
  document.addEventListener('keydown', keydown_handler);
  document.addEventListener('keyup', keyup_handler);
});


