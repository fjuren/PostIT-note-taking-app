const { DateTime } = require('luxon');
const Note = require('../models/Note')

// converts a tag object {value: 'tagname'} to just the tag value
const getTagValues = (rawTags) => {
  // handles case where no tags are added to a note
  if (!rawTags) return;
  return JSON.parse(rawTags).map((tags) => tags.value.toLowerCase());
};


// handle date/time conversions from user preferences
const formatDateWithPreferences = (userProfile, originalDate) => {
  const { timeZone, dateFormat } = userProfile.preferences || {};

  const parsed = typeof originalDate === 'string'
    ? DateTime.fromISO(originalDate, { zone: 'utc' })
    : DateTime.fromJSDate(originalDate, { zone: 'utc' });

  if (!parsed.isValid) {
    return 'Invalid Date';
  }

  return parsed.setZone(timeZone || 'utc').toFormat(dateFormat || 'yyyy-MM-dd');
};

module.exports = {
  getTagValues,
  formatDateWithPreferences
};
