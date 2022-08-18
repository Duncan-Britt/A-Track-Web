'use strict';

import { Dom } from "./dom.js";
import { Assignments } from "./assignments.js";
import { DateTime, parse_date } from "./date.js";
import { color } from "./color.js";

function split_input(text) {
  text = text.trim();
  const chunks = [false];
  let begin = 0;
  for (let begin = 0; begin < text.length; begin++) {
    let end = begin;
      
    if (text[end] == '"') {
      end++;
      for (; end != text.length && text[end] != '"'; end++) {}

      if (end == text.length) {
        return [ 
	  color('red', 'Error:') + ' Expecting ' + color('yellow', '"') + ' in ' + color('yellow', text)
	].concat(chunks.slice(1));
      } else {
        chunks.push(text.slice(begin+1, end));
        begin = end + 1;
      }
    } else {

      while (end != text.length && text[end] != ' ') {
        end++;
      }

      if (end != begin) {
        chunks.push(text.slice(begin, end));
      }

      if (end == text.length) break;

      begin = end;
    }
  }

  return chunks;
}

function parse_list_args(args) {
  const options = {
    desc: false,
    past: false,
    done: true,
    todo: true,
    unavailable: true,
    courses: [],
    limit_date: null,
    limit: Infinity,
    offset: 0,
  };

  const unrecognized_args = [];

  for (let i = 0; i != args.length; i++) {
    const arg = args[i];
    const downcased = arg.toLowerCase();
    
    let [ date, error ] = parse_date(arg);
    if (error) return [ null, error ];

    if (date) {
      options.limit_date = date;
    } else if (/^\d+$/.test(arg)) { // if arg is number
      options.limit = parseInt(arg, 10);
    } else if (/^\-.+$/.test(arg)) { // if arg is a course name
      options.courses.push(arg.slice(1));
    } else {

      switch (downcased) {
      case 'past'     : options.past = true; break;
      case 'week'     : options.limit_date = DateTime.now().plus({ days: 7 }); break;
      case 'todo'     : options.done = false; break;
      case 'done'     : options.todo = false; break;
      case 'available': options.unavailable = false; break;
      case 'desc'     : options.desc = true; break;
      case 'asc'      : options.desc = false; break;
      case 'offset'   :
	const offset_amount = args[++i];
	if (/^\d+$/.test(offset_amount)) // if offset amount is number
	  options.offset = parseInt(offset_amount, 10);
	else
	  return [null, color('red', 'Invalid offset: ') + color('yellow', offset_amount)];
	break;
      default:
	unrecognized_args.push(arg);
      }
    } 
  }
  
  return [ options, null, ...unrecognized_args ];
}

const Commands = {
  list(args) {
    const [ options, error, ...unused ] = parse_list_args(args);
    if (error) {
      Dom.update({ cli_feedback: error });
      return;
    }

    if (unused.length != 0) {
      Dom.update({ cli_feedback: color('red', 'Unknown args: ') + `${unused.join(', ')} -> ` + color('yellow', 'ignored.') });
    }
    const assignments = Assignments.get(options);
    assignments.pretty_print(); // TESTING
    console.log(assignments);   // TESTING
    // Dom.update({ assignments });
  }
}

export function command_handler(input_text) {
  const [ error, command, ...args ] = split_input(input_text);
  if (error) {
    Dom.update({ cli_feedback: error });
    return;
  }

  Dom.update({ clear_feedback: true });

  if (/^\s*$/.test(input_text)) {
    return;
  }

  if (Commands.hasOwnProperty(command.toLowerCase())) {
    Commands[command.toLowerCase()](args);
  } else {
    Dom.update({ cli_feedback: color('red', 'Unkown command: ') + command });
  }
}
