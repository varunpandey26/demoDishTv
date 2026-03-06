export default function decorate(block) {

  const rows = block.querySelectorAll(':scope > div');

  const formRow = rows[0];
  if (formRow) formRow.classList.add('lead-form-input-container');
  
  const messageRow = rows[1];
  if (messageRow) {
    messageRow.classList.add('lead-form-message-container');
    const innerContent = messageRow.querySelector('div');
    if (innerContent) {
      innerContent.classList.add('lead-form-message-content');
      const paragraphs = innerContent.querySelectorAll('p');
      if (paragraphs.length > 0) paragraphs[0].classList.add('lead-form-or-text');
      if (paragraphs.length > 1) paragraphs[1].classList.add('lead-form-call-text');
    }
  }

  const form = document.createElement('form');
  form.classList.add('lead-form-element');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.placeholder = 'Name';
  nameInput.required = true;
  nameInput.classList.add('lead-form-input', 'lead-form-input-name');

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.name = 'phone';
  phoneInput.placeholder = 'Mob No';
  phoneInput.required = true;
  phoneInput.classList.add('lead-form-input', 'lead-form-input-phone');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Book New DishTV';
  submitBtn.classList.add('lead-form-submit-btn');

  form.append(nameInput, phoneInput, submitBtn);

  if (formRow) {
    formRow.textContent = '';
    formRow.append(form);
  }

  /* Mobile Sticky Toggle Button Logic */
  const mobileToggleBtn = document.createElement('button');
  mobileToggleBtn.classList.add('lead-form-mobile-toggle');
  mobileToggleBtn.textContent = 'Book New DishTV';
  
  // Append it to the main block so it sits outside the form row
  block.append(mobileToggleBtn);

  // Toggle open/close state on mobile
  mobileToggleBtn.addEventListener('click', () => {
    block.classList.toggle('is-open');
    if (block.classList.contains('is-open')) {
      mobileToggleBtn.textContent = 'Close';
    } else {
      mobileToggleBtn.textContent = 'Book New DishTV';
    }
  });

  /* API submission */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: nameInput.value,
      phone: phoneInput.value
    };

    try {

      const response = await fetch('https://your-api-url.com/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Thank you! We will contact you soon.');
        form.reset();
      } else {
        alert('Submission failed');
      }

    } catch (error) {
      console.error(error);
      alert('API error');
    }

  });

}