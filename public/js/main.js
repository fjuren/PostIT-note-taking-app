// handles delete confirmation
document.addEventListener('DOMContentLoaded', function () {
  const deleteForms = document.querySelectorAll(
    'form[action^="/notes/delete/"]'
  );

  deleteForms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      if (!confirm('Are you sure you want to delete this note?')) {
        e.preventDefault();
      }
    });
  });
});

// fetch unique note tags; used for selecting previously created tags
const getUniqueTags = async () => {
  const endpoint = '/notes/tags';
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return [];
  }
};

// handling of note tags on creating and editing notes
var input = document.querySelector('input[name="input-custom-dropdown"]'),
  // init Tagify script on the above inputs; start with empty array
  tagify = new Tagify(input, {
    whitelist: [],
    maxTags: 10,
    dropdown: {
      maxItems: 20, // <- max allowed rendered suggestions
      classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
      enabled: 0, // <- show suggestions on focus
      closeOnSelect: false, // <- do not hide the suggestions dropdown once an item has been selected
    },
  });

// Add unique tags to tagify whitelist array
getUniqueTags().then((tags) => {
  tagify.settings.whitelist = tags || [];
});

// For filtering (uses Choices library: https://github.com/Choices-js/Choices/tree/main for config)
document.addEventListener('DOMContentLoaded', () => {
  new Choices('#choices-multiple-remove-button', {
    removeItemButton: true, // adds little 'x' to remove items
    placeholderValue: 'Filter notes by category',
    searchEnabled: true,
  });

  // handles form submit each time filter option is changed
  const form = document.getElementById('filterSearchForm');
  const select = document.getElementById('choices-multiple-remove-button');
  select.addEventListener('change', () => {
    form.requestSubmit();
  });
});

// toggle dark mode
const toggleTheme = () => {
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Set the new theme
  html.setAttribute('data-bs-theme', newTheme);

  // Optional: Save to localStorage so the preference persists
  localStorage.setItem('preferred-theme', newTheme);
};

// Initialize theme from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.querySelector('html').setAttribute('data-bs-theme', savedTheme);
  }
});
