'use strict';

import { Dom } from "./dom.js";
import { keydown_handler, keyup_handler } from "./keypress.js";

class Assignment {
    constructor(id, completion_status, title, description, class_name, due_date, available_date) {
        this.id = id; 
        this.completion_status = completion_status; 
        this.title = title;
        this.description = description;
        this.class_name = class_name;
        this.due_date = due_date;
        this.available_date = available_date;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Dom.init();
    document.addEventListener('keydown', keydown_handler);
    document.addEventListener('keyup', keyup_handler);
});


