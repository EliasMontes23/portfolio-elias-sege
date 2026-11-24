document.getElementById('contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const subject = encodeURIComponent('Contact portfolio — ' + name);
  const body = encodeURIComponent(message + '\n\n— ' + name + '\nRépondre à : ' + email);
  window.location.href = `mailto:eliasmontesinosr@gmail.com?subject=${subject}&body=${body}`;
});
