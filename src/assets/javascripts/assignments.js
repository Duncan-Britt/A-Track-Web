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

  get due() {
    return this.due_date.toLocaleString(DateTime.DATE_SHORT);
  }

  static create({ id, title, description, is_complete, class_name, due_date, available_date }) {
    return new Assignment(id, title, description, is_complete, class_name, due_date, available_date, new AssignmentsType());
  }

  static _create_recursive({ id, title, description, is_complete, class_name, due_date, available_date, subtasks }) {
    const res_subtasks = new AssignmentsType();
    res_subtasks.init(subtasks);
    return new Assignment(id, title, description, is_complete, class_name, due_date, available_date, res_subtasks);
  }

  past() {
    return this.due_date < DateTime.now();
  }

  available() {
    return this.available_date >= DateTime.now();
  }

  pretty_print() { // For Debugging & Convenience
    console.log(`${this.title} :: ${this.class_name} :: ${this.due_date.toLocaleString(DateTime.DATE_SHORT)}`);
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
    const inorder = this.slice();
    if (options.desc) inorder.reverse();

    const selected = new AssignmentsType();
    let count = 0;
    for (let i = 0; i < inorder.length && count < options.limit; i++) {
      const assignment = inorder[i];

      if (assignment.past() && !options.past) continue;
      if (!assignment.past() && options.past) continue;
      if (assignment.is_complete && !options.done) continue;
      if (!assignment.is_complete && !options.todo) continue;
      if (!assignment.available() && !options.unavailable) continue;
      if (options.limit_date) {
	if (!options.desc && options.limit_date < assignment.due_date) break;
	if (options.desc && options.limit_date < assignment.due_date) continue;
      }
      if (options.courses.length != 0 &&
	  !options.courses.some(crs => crs.toLowerCase() == assignment.class_name.toLowerCase()))
	continue;
      if (options.offset > 0) {
	options.offset--;
	continue;
      }

      selected.push(assignment);
      count++;
    }

    return selected;
  }

  pretty_print() { // For Debugging & Convenience
    this.forEach(assignment => assignment.pretty_print());
  }
}

// options = {
//   desc:
//   past:
//   done:
//   todo:
//   unavailable:
//   courses: []
//   limit_date:
//   limit:
//   offset:
// }

export const Assignments = new AssignmentsType();
