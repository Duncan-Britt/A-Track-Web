'use strict';

export const Dom = {
  init() {
    this.command_buffer = document.querySelector('#command-input-area');
    this.command_overlay = document.querySelector('#command-overlay');
    this.cli_feedback = document.querySelector('#cli-feedback');
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
	  case 'cli_feedback':
	    this.cli_feedback.innerHTML = options[option];
	    this.cli_feedback.style.display = 'block';
	    break;
	  case 'clear_feedback':
	    this.cli_feedback.textContent = '';
	    this.cli_feedback.style.display = 'none';	    
	    break;	 
        }
      }
    }
  },
};
