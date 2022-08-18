'use strict';

import { color } from "./color.js";
import { DateTime } from "./lib/luxon.js";

export { DateTime } from "./lib/luxon.js";

export function parse_date(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) &&
      !/^\d{2}-\d{2}$/.test(text))
    return [ false, null ];

  const date = /^\d{4}-\d{2}-\d{2}$/.test(text) ? DateTime.fromISO(text) : DateTime.fromFormat(text, "LL-dd");
  if (date.isValid) {
    return [ date, null ];
  } else {
    return [null, color('red', 'Invalid date: ') + color('yellow', text) + ". Expected " + color('yellow', 'YYYY-MM-DD') + ' or ' + color('yellow', 'MM-DD')];
  }
}
