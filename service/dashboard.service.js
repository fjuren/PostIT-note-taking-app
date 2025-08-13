const mongoose = require('mongoose');
const Note = require('../models/Note');
const miscHelpers = require('../utils/misc');

// HELPERS
// determines the current week (starts on sunday)
const today = new Date();

// Get Sunday (start of week)
const startOfWeek = new Date(today);
startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // recall: getDay() returns the day of the week (0 = Sunday, 1 = Monday, etc.) | getDate() returns the day of the month (1-31)
startOfWeek.setUTCHours(0, 0, 0, 0);

// Get Saturday (end of week)
const endOfWeek = new Date(today);
endOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay() + 6);
endOfWeek.setUTCHours(23, 59, 59, 999);

const getLongestStreak = async (user) => {
  const streakDays = await Note.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(user.id) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
      },
    },
    { $sort: { date: 1 } },
  ]);

  // return non-consecutive days
  if (streakDays.length === 0) return 0;
  if (streakDays.length === 1) return 1;

  let consecutiveDays = 1;
  let longestStreak = 1;
  // calculate consecutive days if >= 2
  for (let i = 0; i < streakDays.length - 1; i++) {
    // O(n)
    const currentDay = new Date(streakDays[i].date);
    const nextDay = new Date(streakDays[i + 1].date);
    // calculates difference for # days between.
    const diff = (nextDay - currentDay) / (1000 * 60 * 60 * 24); // recall: divides by days, in milliseconds
    if (diff === 1) {
      consecutiveDays++;
      longestStreak = Math.max(longestStreak, consecutiveDays); // update longestStream to whatever value is largest to get maximum streak length
    } else {
      consecutiveDays = 1; // reset
    }
  }
  return longestStreak;
};

// -------------------------------------------------------------------------------------------------
// Chart Data Generation Functions

function generateMonthlyLabels() {
  const months = [];
  const now = new Date();

  // Get last 6 months including current month
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }

  return months;
}

function generateMonthlyData(notes) {
  const now = new Date();
  const monthlyData = [];

  // Get last 6 months including current month
  for (let i = 5; i >= 0; i--) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const notesInMonth = notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      return noteDate >= startOfMonth && noteDate <= endOfMonth;
    });

    monthlyData.push(notesInMonth.length);
  }

  return monthlyData;
}

function generateDayOfWeekData(notes) {
  // Initialize array for each day [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  const dayData = [0, 0, 0, 0, 0, 0, 0];

  notes.forEach((note) => {
    const noteDate = new Date(note.createdAt);
    let dayOfWeek = noteDate.getDay(); // Sunday = 0, Monday = 1, etc.

    // Convert to Monday = 0, Sunday = 6 format
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    dayData[dayOfWeek]++;
  });

  return dayData;
}

function getTopTagLabels(notes, limit = 5) {
  const tagCounts = getTagCounts(notes);
  return Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, limit);
}

function getTopTagData(notes, limit = 5) {
  const tagCounts = getTagCounts(notes);
  return Object.values(tagCounts)
    .sort((a, b) => b - a)
    .slice(0, limit);
}

// Helper function to count tag usage
function getTagCounts(notes) {
  const tagCounts = {};

  notes.forEach((note) => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach((tag) => {
        if (tag && tag.trim()) {
          // Only count non-empty tags
          const cleanTag = tag.trim().toLowerCase();
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
        }
      });
    }
  });

  return tagCounts;
}

// Alternative: MongoDB Aggregation Queries (more efficient for large datasets)

// Monthly data aggregation query
const getMonthlyDataAggregation = (userId) => [
  {
    $match: {
      user: userId,
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
      },
    },
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1 },
  },
];

// Day of week aggregation query
const getDayOfWeekAggregation = (userId) => [
  {
    $match: { user: userId },
  },
  {
    $group: {
      _id: { $dayOfWeek: '$createdAt' },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { _id: 1 },
  },
];

// Top tags aggregation query
const getTopTagsAggregation = (userId, limit = 5) => [
  {
    $match: { user: userId },
  },
  {
    $unwind: '$tags',
  },
  {
    $match: { tags: { $ne: '' } },
  },
  {
    $group: {
      _id: { $toLower: '$tags' },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: limit,
  },
];

module.exports = {
  //   generateMonthlyLabels,
  //   generateMonthlyData,
  //   generateDayOfWeekData,
  //   getTopTagLabels,
  //   getTopTagData,
  //   getTagCounts,
  // Aggregation queries for better performance
  //   getMonthlyDataAggregation,
  //   getDayOfWeekAggregation,
  //   getTopTagsAggregation
};
// -------------------------------------------------------------------------------------------------

const getDashboard = async (user) => {
  const statsQuery = await Note.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(user.id) } },
    {
      $facet: {
        //   totalNotes: notes.length,
        totalNotes: [{ $count: 'count' }],
        //   notesThisWeek: calculateNotesThisWeek(notes),
        notesThisWeek: [
          {
            $match: {
              createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek,
              },
            },
          },
          { $count: 'count' },
        ],
        //   longestStreak: calculateLongestStreak(notes),
        //   -> From getLongestStreak(user) fcn

        //   avgNotesPerWeek: calculateAvgNotesPerWeek(notes),
        avgNotesPerWeek: [
          {
            // counts notes per week, grouped by iso week/year
            $group: {
              _id: {
                year: { $isoWeekYear: '$createdAt' },
                week: { $isoWeek: '$createdAt' },
              },
              noteCount: { $sum: 1 },
            },
          },
          {
            // count total # of weeks from first grouping and count all notes from all weeks
            $group: {
              _id: null,
              totalWeeks: { $sum: 1 },
              totalNotes: { $sum: '$noteCount' },
            },
          },
          {
            // calculate avgNotesPerWeekResult
            $project: {
              avgNotesPerWeekResult: {
                $divide: ['$totalNotes', '$totalWeeks'],
              },
            },
          },
        ],

        //   totalUniqueTags: [...new Set(notes.flatMap(note => note.tags))].length,
        totalUniqueTags: [
          { $unwind: '$tags' },
          { $group: { _id: '$tags' } },
          { $count: 'count' },
        ],

        //   untaggedNotes: notes.filter(note => !note.tags || note.tags.length === 0).length,
        untaggedNotes: [
          {
            $match: {
              tags: {
                $size: 0,
              },
            },
          },
          {
            $count: 'count',
          },
        ],

        //   lastActivity: notes.length ? notes[notes.length - 1].createdAt : null,
        lastActivity: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              createdAt: 1,
            },
          },
        ],

        // get Notes for chart functions
        notes: [
          {
            $match: {},
          },
        ],
      },
    },
  ]);

  const stats = statsQuery[0];

  const statsFinal = {
    totalNotes: stats?.totalNotes[0]?.count,
    notesThisWeek: stats?.notesThisWeek[0]?.count,
    longestStreak: await getLongestStreak(user),
    avgNotesPerWeek: stats?.avgNotesPerWeek[0]?.avgNotesPerWeekResult,
    totalUniqueTags: stats?.totalUniqueTags[0]?.count,
    untaggedNotes: stats?.untaggedNotes[0]?.count,
    lastActivity: miscHelpers.formatDateWithPreferences(
      user.userProfile,
      stats?.lastActivity[0].createdAt
    ),

    // Chart data
    monthlyLabels: generateMonthlyLabels(),
    monthlyData: generateMonthlyData(stats?.notes),
    dayOfWeekData: generateDayOfWeekData(stats?.notes),
    topTagLabels: getTopTagLabels(stats?.notes),
    topTagData: getTopTagData(stats?.notes),
  };
  return statsFinal;
};

module.exports = { getDashboard };
