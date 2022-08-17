'use strict';

export const Dom = {
  init() {
    this.command_buffer = document.querySelector('#command-input-area');
    this.command_overlay = document.querySelector('#command-overlay');
  },

  update(options) {
    for (let option in options) {
      if (Object.hasOwnProperty.call(options, option)) {        
        switch (option) {
          case 'command_buffer': 
            this.command_buffer.textContent = options.command_buffer;
            break;
          case 'command_mode':
            this.command_overlay.style.visibility = options[option] ? 'visible' : 'hidden';
            break;
          default:

        }
      }
    }
  },
};