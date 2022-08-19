'use strict';

import { Splice } from "./lib/splice.js";

export const Dom = {
  init() {
    this.command_buffer = document.querySelector('#command-input-area');
    this.command_overlay = document.querySelector('#command-overlay');
    this.cli_feedback = document.querySelector('#cli-feedback');
    this.show_ids = localStorage.getItem('show_ids') == 'true' ? true : false;
    this.last_assignments = null;
    Splice.registerPartial('recursive-assignments');
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
	case 'assignments':
	  Splice.render({ Assignments: options[option], show_ids: this.show_ids });
	  this.bind_left_pane_handlers();
	  this.last_assignments = options[option];
	  break;
        }
      }
    }
  },

  bind_left_pane_handlers() {
    // enable drop down links for subtasks:
    document.querySelectorAll('.expand-link').forEach(link => {
      link.addEventListener('click', _ => {
	link.parentElement.querySelector('.assignment-list').classList.toggle('hide');
      });
    });
  },

  toggle_show_ids() {
    this.show_ids = !this.show_ids;
    localStorage.setItem('show_ids', this.show_ids); // localStorage converts bool to string
    document.querySelectorAll('.assignment-id').forEach(span => span.classList.toggle('hidden'));
  },
};
