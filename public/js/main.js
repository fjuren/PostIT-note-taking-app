// helper for field validation
const validationMessage = (
  fieldValue,
  msgOne,
  charLimit,
  validationView,
  msgTwo
) => {
  if (fieldValue && validationView) {
    validationView.textContent = msgOne;

    fieldValue.addEventListener('input', () => {
      const submittedValue = fieldValue.value.trim();

      if (!submittedValue) {
        validationView.textContent = msgOne;
      } else if (submittedValue.length > charLimit) {
        validationView.textContent = msgTwo;
      }
    });
  }
};

// bootstrap client-side form validation
(() => {
  'use strict';

  // note creation & edit forms
  // title
  const titleField = document.getElementById('title');
  const titleValidationView = document.getElementById('title-validation');
  // content
  const contentField = document.getElementById('content');
  const contentValidationView = document.getElementById('content-validation');

  // title
  validationMessage(
    titleField,
    'Your note needs a title',
    200,
    titleValidationView,
    'Title cannot exceed 200 characters'
  );
  // content
  validationMessage(
    contentField,
    'Your note needs some content',
    10000,
    contentValidationView,
    'Content cannot exceed 10,000 characters'
  );

  // Fetch all the forms
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();

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
  if (document.querySelector('#choices-multiple-remove-button')) {
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
  }

});

// toggle dark mode
const toggleTheme = () => {
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Set the new theme
  html.setAttribute('data-bs-theme', newTheme);

  localStorage.setItem('preferred-theme', newTheme);
};

// Initialize theme from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.querySelector('html').setAttribute('data-bs-theme', savedTheme);
  }
});

// handle color reset button from user preferences (display)
document.addEventListener('DOMContentLoaded', () => {
  const defaultColor = '#7423D7';
  // preview color
  const colorInput = document.getElementById('primaryColor');
  const resetButton = document.getElementById('resetColorBtn');
  // fake preview
  const colorPreviewBtn = document.getElementById('colorPreviewBtn');

  if (resetButton) resetButton.addEventListener('click', () => {
    colorInput.value = defaultColor;
    colorPreviewBtn.style.backgroundColor = defaultColor;
  });
});


// handle spinner
const showSpinner = () => {
  // prevent spinner if form fails validation; otherwise show the spinner
  const formCheck = document.querySelector('form')
  if (formCheck) {
    const formValidCheck = formCheck.checkValidity();
    formValidCheck || formValidCheck === null ? spinner.show() : null;
  } else if (!formCheck) spinner.show()
};

const spinner = {
  show: () => {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.remove('visually-hidden');
  },
  hide: () => {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.add('visually-hidden');
  },
};

// handel the spinner on page load/navigation
window.addEventListener('load', () => {
  spinner.hide();
});

window.addEventListener('pageshow', () => {
  spinner.hide();
});

// handle spinner on modal op
document.addEventListener('DOMContentLoaded', () => {
  // Hide spinner whenever any modal opens
  document.addEventListener('shown.bs.modal', () => {
    spinner.hide();
  });

  // Attach spinner behavior to any element with .with-spinner class
  document.querySelectorAll('.with-spinner').forEach((el) => {
    el.addEventListener('click', showSpinner);
  });

  // Theme toggle
  document.querySelectorAll('.theme-toggle').forEach((el) => {
    el.addEventListener('click', toggleTheme);
  });
});

// handle toast
document.addEventListener('DOMContentLoaded', () => {
  const getToast = document.getElementById('liveToast');
  if (getToast && getToast.dataset.showToast === 'true')
    bootstrap.Toast.getOrCreateInstance(getToast).show();
});

// fake button preview on account page:
document.addEventListener('DOMContentLoaded', () => {
  const colorInput = document.getElementById('primaryColor');
  const previewBtn = document.getElementById('colorPreviewBtn');

  if (colorInput && previewBtn) {
    const updateColor = () => {
      previewBtn.style.backgroundColor = colorInput.value;
      previewBtn.style.color = '#fff';
      previewBtn.style.border = 'none';
    };

    updateColor();

    // handles color change on input change
    colorInput.addEventListener('input', updateColor);
  }
});
