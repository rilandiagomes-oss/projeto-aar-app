
const params = new URLSearchParams(window.location.search);

params.forEach((value, name) => {
  const elements = document.querySelectorAll(`[name="${name}"]`);
  
  elements.forEach(element => {
    if ((element.type === 'checkbox' || element.type === 'radio') && value === '') {
      element.checked = true;
    }
    else if (element.type === 'radio' && element.value === value) {
      element.checked = true;
    }
    else if (element.type === 'checkbox' && element.value === value) {
      element.checked = true;
    }
    else if (!['checkbox', 'radio'].includes(element.type)) {
      element.value = value;
    }
  });
});

