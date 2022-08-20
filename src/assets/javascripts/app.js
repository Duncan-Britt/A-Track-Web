'use strict';

import { Dom } from "./dom.js";
import { keydown_handler, keyup_handler } from "./keypress.js";
import { Assignments } from "./assignments.js";

const mock_data = [
   { 
    id: 2,
    title: 'Robotics Program', 
    description: 'Use raspberry pi pico',    
    is_complete: false,
    class_name: 'Computer Architecture',
    due_date: "2022-09-25T09:24:15Z",
    available_date: "2022-09-08T03:00:00Z",
    subtasks: [{ 
      id: 3,
      title: 'Problem 1', 
      description: '',    
      is_complete: false,
      class_name: 'Computer Architecture',
      due_date: "2022-09-15T09:24:15Z",
      available_date: "2022-09-08T03:00:00Z",
      subtasks: [
	{
	  id: 4,
	  title: 'Get Pencil',
	  description: '',
	  is_complete: true,
	  class_name: 'Computer Architecture',
	  due_date: "2022-09-15T09:24:15Z",
	  available_date: "2022-09-08T03:00:00Z",
	  subtasks: [],
	},
	{
	  id: 5,
	  title: 'Get Paper',
	  description: '',
	  is_complete: false,
	  class_name: 'Computer Architecture',
	  due_date: "2022-09-15T09:24:15Z",
	  available_date: "2022-09-08T03:00:00Z",
	  subtasks: [],
	},	
      ],
    }],
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
const data = JSON.parse(json);


// TESTING
Assignments.init(data);
console.log(Assignments);

document.addEventListener('DOMContentLoaded', () => {
  Dom.init();
  Dom.update({ assignments: Assignments });
  document.addEventListener('keydown', keydown_handler);
  document.addEventListener('keyup', keyup_handler);
});


