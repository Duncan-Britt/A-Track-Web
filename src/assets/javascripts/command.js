'use strict';

import { Dom } from "./dom.js";
import { Assignments } from "./assignments.js";

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

function color(color, text) {
  return '<span style="color:' + color + ';">' + text + '</span>';
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

  if (Assignments[command]) {
    Assignments[command](args);
  } else {
    Dom.update({ cli_feedback: color('red', 'Unkown command: ') + command });
  }
}
