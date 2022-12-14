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
    // In macos the keyup doesn't fire on the Meta key (command) after certain key combinations
    // in the browser, such as
    //   M-Q : shutdown computer 
    //   M-p : print page 
    //   M-o : opens files 
    //   M-t : new tab 
    //   M-y : opens history
    // and possibly others. So, to be able to detect when this has happened, on keydown
    // ask if the metakey is pressed using e.meta and query this.pressed_keys to see if
    // the key up event has fired. If meta isn't pressed by the keyup event hasn't fired
    // set all pressed_keys to false.
    if (!e.metaKey && (this.pressed_keys['MetaLeft'] || this.pressed_keys['MetaRight'])) {
      Object.keys(this.pressed_keys).forEach(key => { this.pressed_keys[key] = false; });
    }
    this.pressed_keys[e.code] = true;    
    this.handlers[this.mode].keydown.call(this, e);
  },
  keyup(e) {
    this.pressed_keys[e.code] = false;
    // In macos the keyup event doesn't fire when the Meta key is held down. So, when Meta key
    // is lifted, assume other keys have also been lifted as well. There is a bug introduced:
    // If the user is quick, they can hit meta-c, lift the meta key and then hit alt-x very quickly
    // thereafter, and in this case they will be able to toggle the command prompt while holding
    // down some other key. This is unlikely to occur and in the event that it does, it doesn't
    // cause problems for the application.
    if (e.key == 'Meta') {
      Object.keys(this.pressed_keys).forEach(key => { this.pressed_keys[key] = false; });
    }
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

// M-q : quit
// M-w : close tab
// M-e : nothing
// M-r : reload
// M-u : nothing
// M-i : nothing in Brave, in Safari, opens my outlook email in Brave!
// M-{ : go backword in history of tab
// M-} : go forward in history of tab
// M-\ : nothing
// M-W : close all tabs
// M-E : nothing

// M-| : nothing in Brave, expands view of tabs in safari (problem?)

// M-Q : shutdown computer (causes problems)
// M-p : print page (causes problems)
// M-o : opens files (causes problems)
// M-t : new tab (causes problem)
// M-y : opens history (causes problem)
