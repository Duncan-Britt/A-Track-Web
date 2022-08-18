'use strict';

import { Dom } from "./dom.js";
import { keydown_handler, keyup_handler } from "./keypress.js";
import { Assignments } from "./assignments.js";
import { DateTime } from "./lib/luxon.js";

const mock_data = [
   { 
    id: 2,
    title: 'Ch 4 Hw', 
    description: 'Study U-Sub',    
    is_complete: false,
    class_name: 'Calc 1',
    due_date: "2022-09-25T09:24:15Z",
    available_date: "2022-09-08T03:00:00Z",
    subtasks: [],
  },
  { 
    id: 0,
    title: 'Ch 2 Hw', 
    description: 'Study U-Sub',    
    is_complete: false,
    class_name: 'Calc 1',
    due_date: "2022-09-15T09:24:15Z",
    available_date: "2022-09-08T03:00:00Z",
    subtasks: [],
  },
  { 
    id: 1,
    title: 'Ch 3 Hw', 
    description: 'Study Integrals',    
    is_complete: false,
    class_name: 'Calc 1',
    due_date: "2022-09-20T09:24:15Z",
    available_date: "2022-09-10T09:24:15Z",
    subtasks: [],
  },
];

const json = JSON.stringify(mock_data);
// console.log(json);
const data = JSON.parse(json);

Assignments.init(data);
console.log(Assignments);
Assignments.forEach(({ due_date }) => {
  console.log(due_date.toLocaleString(DateTime.DATE_SHORT));
});

// var d1 = DateTime.fromISO('2017-04-30');
// var d2 = DateTime.fromISO('2017-04-01');
// console.log(d1 > d2);

document.addEventListener('DOMContentLoaded', () => {
  Dom.init();
  document.addEventListener('keydown', keydown_handler);
  document.addEventListener('keyup', keyup_handler);
});


