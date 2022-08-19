'use strict';

import { Splice } from "./lib/splice.js";

export const Dom = {
  init() {
    this.command_buffer = document.querySelector('#command-input-area');
    this.command_overlay = document.querySelector('#command-overlay');
    this.cli_feedback = document.querySelector('#cli-feedback');
    this.show_ids = localStorage.getItem('show_ids') == 'true' ? true : false;
    this.last_assignments = null;
    
    const splice_destination = document.querySelector('#splice-destination');
    Splice.registerPartial('recursive-assignments');
    const create_left_pane_html_from = Splice.compile(document.querySelector('#template').innerHTML);
    this.render_left_pane = data => splice_destination.innerHTML = create_left_pane_html_from(data);
  },

  update(options) {    
    for (let option in options) {
      if (Object.hasOwnProperty.call(options, option)) { 
        switch (option) {
        case 'command_buffer': 
          this.command_buffer.textContent = options.command_buffer;
          break;
        case 'command_mode':
          this.command_overlay.style.visibility = options.command_mode ? 'visible' : 'hidden';
          break;
	case 'cli_feedback':
	  this.cli_feedback.innerHTML = options.cli_feedback;
	  this.cli_feedback.style.display = 'block';
	  break;
	case 'clear_feedback':
	  this.cli_feedback.textContent = '';
	  this.cli_feedback.style.display = 'none';	    
	  break;
	case 'assignments':
	  this.render_left_pane({ Assignments: options.assignments, show_ids: this.show_ids });
	  this.bind_left_pane_handlers();
	  this.last_assignments = options.assignments;
	  break;
        }
      }
    }
  },

  bind_left_pane_handlers() {
    // enable drop down for subtasks on row click
    document.querySelectorAll('.assignment-row').forEach(row => {
      row.addEventListener('click', e => {
	e.stopPropagation();
	row.querySelector('.assignment-list').classList.toggle('hide');
      });
    });
  },

  toggle_show_ids() {
    this.show_ids = !this.show_ids;
    localStorage.setItem('show_ids', this.show_ids); // localStorage converts bool to string
    document.querySelectorAll('.assignment-id').forEach(span => span.classList.toggle('hidden'));
  },
};
