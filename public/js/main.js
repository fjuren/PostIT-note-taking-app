// Handle delete confirmation
document.addEventListener('DOMContentLoaded', function() {
    const deleteForms = document.querySelectorAll('form[action^="/notes/"]');
    
    deleteForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!confirm('Are you sure you want to delete this note?')) {
          e.preventDefault();
        }
      });
    });
  });