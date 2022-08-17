'use strict'

export const Assignments = {
  list(args) {
    console.log(args);
  }
};

const mock_data = [
  { 
    id: 0,
    title: 'Ch 2 Hw', 
    description: 'Study U-Sub',    
    is_complete: false,
    class_name: 'Calc 1',
    due_date: '09-20-2022',
    available_date: '08-20-2022',
  },
  { 
    id: 1,
    title: 'Ch 3 Hw', 
    description: 'Study Integrals',    
    is_complete: false,
    class_name: 'Calc 1',
    due_date: '09-25-2022',
    available_date: '09-10-2022',
  },
]

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

const json = JSON.stringify(mock_data);
console.log(json);
const data = JSON.parse(json);
console.log(data);
