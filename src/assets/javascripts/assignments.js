'use strict'

import { DateTime } from "./lib/luxon.js";

class Assignment {
  constructor(id, title, description, is_complete, class_name, due_date, available_date, subtasks) {
    this.id = id; 
    this.is_complete = is_complete; 
    this.title = title;
    this.description = description;
    this.class_name = class_name;
    this.due_date = due_date;
    this.available_date = available_date;
    this.subtasks = subtasks;
  }

  static create({ id, title, description, is_complete, class_name, due_date, available_date }) {
    return new Assignment(id, title, description, is_complete, class_name, due_date, available_date, new AssignmentsType());
  }

  static _create_recursive({ id, title, description, is_complete, class_name, due_date, available_date, subtasks }) {
    const res_subtasks = new AssignmentsType();
    res_subtasks.init(subtasks);
    return new Assignment(id, title, description, is_complete, class_name, due_date, available_date, res_subtasks);
  }
}

class AssignmentsType extends Array {
  constructor(...args) {
    if (args.every(arg => arg instanceof Assignment)) {
      super(...args);
    } else {
      super();
    }
  }

  init(data) {
    data.forEach(assignment_info => {
      assignment_info.due_date = DateTime.fromISO(assignment_info.due_date, { zone: 'utc' });
      assignment_info.available_date = DateTime.fromISO(assignment_info.available_date, { zone: 'utc' });
      this.push(Assignment._create_recursive(assignment_info));
    });

    this.sort();
  }

  sort() {
    Array.prototype.sort.call(this, ((a, b) => {
      if (a.due_date < b.due_date) return -1;
      if (a.due_date > b.due_date) return 1;
      if (a.due_date == b.due_date) {
	if (!a.is_complete && b.is_complete) return -1;
	if (a.is_complete && !b.is_complete) return 1;
	return 0;
      }
    }));
  }

  get(options) {
    
  }
}

// Object.defineProperties(AssignmentsType, {
//   prototype: {
//     value: Object.create(Array.prototype),
//     writable: true,
//   },
// });

// AssignmentsType.prototype = Object.create(Array.prototype);
// AssignmentsType.prototype.constructor = AssignmentsType;

export const Assignments = new AssignmentsType();
