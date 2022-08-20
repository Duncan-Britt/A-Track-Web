'use strict';

// import { Splice } from "./lib/splice.js";

export const Dom = {
  init() {
    this.left_pane = document.getElementById('left-pane');
    this.command_buffer = document.querySelector('#command-input-area');
    this.command_overlay = document.querySelector('#command-overlay');
    this.cli_feedback = document.querySelector('#cli-feedback');
    this.show_ids = localStorage.getItem('show_ids') == 'true' ? true : false;
    this.last_assignments = null;
    
    // const splice_destination = document.querySelector('#splice-destination');
    // Splice.registerPartial('recursive-assignments');
    // const create_left_pane_html_from = Splice.compile(document.querySelector('#template').innerHTML);
    // this.render_left_pane = data => splice_destination.innerHTML = create_left_pane_html_from(data);
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
	  this.render_left_pane(options.assignments);
	  this.last_assignments = options.assignments;
	  this.bind_left_pane_handlers();
	  break;
        }
      }
    }
  },

  render_left_pane(assignments) {
    const existing_dom = this.left_pane.querySelector('.assignment-list');
    if (existing_dom) existing_dom.remove();
    
    this.left_pane.appendChild(
      elt('ul', {'class': 'assignment-list'}, '',
	  ...this.tree_of(assignments, 0)
	 )
      );
  },

  bind_left_pane_handlers() {
    // enable drop down for subtasks on row click
    document.querySelectorAll('.assignment-row').forEach(row => {
      row.addEventListener('click', e => {
	e.stopPropagation();
	row.querySelector('.assignment-list').classList.toggle('hidden');
      });
    });
  },

  toggle_show_ids() {
    this.show_ids = !this.show_ids;
    localStorage.setItem('show_ids', this.show_ids); // localStorage converts bool to string
    document.querySelectorAll('[data-field="id"]').forEach(span => span.classList.toggle('hidden'));
  },
};

function elt(tagname, attributes, text, ...children) {
  const element = document.createElement(tagname);
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
  if (text !== undefined) element.textContent = text;
  children.forEach(child => element.appendChild(child));
  return element;
}

function width(element) {
  const copy = element.cloneNode(true);
  copy.style.visibility = 'hidden';
  copy.style.position = 'absolute';
  document.body.appendChild(copy);
  const offset_width = copy.offsetWidth;
  copy.remove();
  return offset_width;
}

function max_by(arr, fn, max) {
  if (arr.length == 0) return max;
  const [ head, ...tail ] = arr;
  return tail.length == 0 ? fn(max, head) : max_by(tail, fn, fn(max, head));
}

Dom.tree_of = function(assignments, depth) {
  // AND NOW FOR THE TRICKY BIT!

  // const spacers = (function f(arr, count) {
  //   if (count == depth) return arr;
  //   return f(arr.concat([elt('span', {'class': 'spacer'})]), count + 1);
  // }([], 0));
  
  const row_field_widths_map = assignments.map(a => {
    const row = elt('li', {'class': 'assignment-row'}, '',
		    elt('div', {'class': 'fields'}, '',
			elt('span', {'data-field': 'indent'}),
			elt('span', {'data-field': 'id'}, a.id),
			elt('span', {'data-field': 'title'}, a.title),
			elt('span', {'data-field': 'class_name'}, a.class_name),
			elt('span', {'data-field': 'due'}, a.due)
		       )
		   );
    
    const field_widths = Array.from(row.querySelector('.fields').children).map(child => {
      return width(child);
    });

    return [row, field_widths, a.subtasks];
  });

  const ID_INDEX = 1;
  const TITLE_INDEX = 2;
  const CLASS_INDEX = 3;
  const DUE_INDEX = 4;

  const max_id_width = max_by(row_field_widths_map, (max, [ row, field_widths ]) => {
    return Math.max(max, field_widths[ID_INDEX]);
  }, 0);

  const max_title_width = max_by(row_field_widths_map, (max, [ row, field_widths ]) => {
    return Math.max(max, field_widths[TITLE_INDEX]);
  }, 0);

  const max_class_width = max_by(row_field_widths_map, (max, [ row, field_widths ]) => {
    return Math.max(max, field_widths[CLASS_INDEX]);
  }, 0);

  const max_due_width = max_by(row_field_widths_map, (max, [ row, field_widths ]) => {
    return Math.max(max, field_widths[DUE_INDEX]);
  }, 0);

  const SPACE_BETWEEN = 10;
  const INDENT_SIZE = 15;

  row_field_widths_map.forEach(([ row, field_widths ]) => {
    const fields_div = row.firstElementChild;
    const indent_span = fields_div.querySelector('[data-field="indent"]');
    const id_span = fields_div.querySelector('[data-field="id"]');
    const title_span = fields_div.querySelector('[data-field="title"]');
    const class_span = fields_div.querySelector('[data-field="class_name"]');
    const due_span = fields_div.querySelector('[data-field="due"]');
    indent_span.style.paddingLeft = String(INDENT_SIZE * depth) + 'px';
    id_span.style.paddingLeft = String(max_id_width - width(id_span)) + 'px';
    id_span.style.paddingRight = String(SPACE_BETWEEN) + 'px';
    title_span.style.paddingRight = String(max_title_width - width(title_span) + SPACE_BETWEEN) + 'px';
    class_span.style.paddingRight = String(max_class_width - width(class_span) + SPACE_BETWEEN) + 'px';
    due_span.style.paddingRight = String(max_due_width - width(due_span) + SPACE_BETWEEN) + 'px';
    
    if (!this.show_ids) id_span.classList.add('hidden');
  });

  return row_field_widths_map.map(([ row, _, subtasks ]) => {
    row.appendChild(
      elt('ul', {'class': 'assignment-list hidden'}, '',
	  ...this.tree_of(subtasks, depth + 1)
	 )
    );
    return row;
  });
}
