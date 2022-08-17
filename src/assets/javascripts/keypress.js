'use strict';

import { Dom } from "./dom.js";
import { command_handler } from "./command.js";

const CONTROL_KEYS = [
  'Backspace', 'Tab', 'Enter', 'Shift', 'Shift', 'Control', 'Alt', 'Pause', 'CapsLock', 
  'Escape', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 
  'ArrowDown', 'PrintScreen', 'Insert', 'Delete', 'Meta', 'ContextMenu', 'F1', 'F2',
  'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'NumLock', 'ScrollLock',
  'AudioVolumeMute', 'AudioVolumeDown', 'AudioVolumeUp', 'LaunchMediaPlayer',
  'LaunchApplication1', 'LaunchApplication2',
];

const COMMAND = 'command';
const DEFAULT = 'default';

const Input_Handler = {
  pressed_keys: {},
  mode: 'default',
  command_buffer: '',

  handlers: {
    default: {
      keydown(e) {        
        if (this.has_entered_alt_x(e)) {
          Dom.update({ command_mode: true });
          this.mode = COMMAND;
        }  
      },
      keyup(e) {
        // NOTHING YET
      },
    },
    command: {
      keydown(e) {
        e.preventDefault();

        if (this.has_entered_alt_x(e)) {
          Dom.update({ command_mode: false });
          this.mode = DEFAULT;
          return;
        } 

        if (e.key == 'Enter') {
          command_handler(this.command_buffer);
          
          this.command_buffer = '';          
          Dom.update({
            command_buffer: this.command_buffer,
          });
        }

        if (e.key == 'Backspace') {
          this.command_buffer = this.command_buffer.slice(0, -1);
          Dom.update({ command_buffer: this.command_buffer });
        }

        if (!e.ctrKey && !e.metaKey && !e.altKey && !CONTROL_KEYS.includes(e.key)) {
          this.command_buffer += e.key;
          Dom.update({ command_buffer: this.command_buffer });
        }
      },
      keyup(e) {
        // NOTHING YET
      },
    },
  },

  keydown(e) {
    this.pressed_keys[e.code] = true;    
    this.handlers[this.mode].keydown.call(this, e);
  },
  keyup(e) {
    this.pressed_keys[e.code] = false;
    // this.handlers[this.mode].keyup.call(this, e);
  },

  has_entered_alt_x(e) {
    if (!(e.altKey && e.code == 'KeyX')) return false;

    for (const key in this.pressed_keys) {
      if (Object.hasOwnProperty.call(this.pressed_keys, key)) {
        if (!['AltLeft', 'AltRight', 'KeyX', 'CapsLock'].includes(key) && this.pressed_keys[key]) {
          return false;
        }                    
      }
    }
  
    return true;
  },
};

export const keydown_handler = Input_Handler.keydown.bind(Input_Handler);
export const keyup_handler = Input_Handler.keyup.bind(Input_Handler);