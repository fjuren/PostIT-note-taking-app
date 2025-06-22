const dashboardService = require('../service/dashboard.service')

// Gets all user notes, includes filtering by tag categories
const getDashboard = async (req, res, next) => {
try {
  const user = req.user

  const stats = await dashboardService.getDashboard(user) 
  // calculate stats
    //   const stats = {
    //   // regular data
    //   totalNotes: notes.length,
    //   notesThisWeek: calculateNotesThisWeek(notes),
    //   longestStreak: calculateLongestStreak(notes),
    //   avgNotesPerWeek: calculateAvgNotesPerWeek(notes),
    //   totalCharacters: notes.reduce((sum, note) => sum + note.content.length, 0),
    //   avgNoteLength: calculateAvgWordCount(notes),
    //   totalUniqueTags: [...new Set(notes.flatMap(note => note.tags))].length,
    //   untaggedNotes: notes.filter(note => !note.tags || note.tags.length === 0).length,
    //   lastActivity: notes.length ? notes[notes.length - 1].createdAt : null,
      
    //   // Chart data
    //   monthlyLabels: generateMonthlyLabels(),
    //   monthlyData: generateMonthlyData(notes),
    //   dayOfWeekData: generateDayOfWeekData(notes),
    //   topTagLabels: getTopTagLabels(notes),
    //   topTagData: getTopTagData(notes)
    // };

    res.render('dashboard', {
      user,
      flash: req.session.flash || {}, // enables flash capability if needed in the future
      stats
    });

} catch (err) {
    console.error(err);
    next(err);
}
}

module.exports = { getDashboard }