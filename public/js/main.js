
// handles delete confirmation
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

// handling of note tags on creating and editing notes
var input = document.querySelector('input[name="input-custom-dropdown"]'),
    // init Tagify script on the above inputs
    tagify = new Tagify(input, {
        whitelist: ["A# .NET", "A# (Axiom)", "A-0 System", "A+", "A++", "ABAP", "ABC"],
        maxTags: 10,
        dropdown: {
            maxItems: 20,           // <- max allowed rendered suggestions
            classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
            enabled: 0,             // <- show suggestions on focus
            closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
        }
    })