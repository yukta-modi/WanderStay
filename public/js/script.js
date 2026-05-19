(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      let isValid = true;

      const ratings = document.getElementsByName("review[rating]");
      const ratingError = document.getElementById("ratingError");

      if (!form.checkValidity()) {
        isValid = false;
      }

      let ratingSelected = false;
      for (let r of ratings) {
        if (r.checked) {
            ratingSelected = true;
            break;
        }
      }
      if (!ratingSelected) {
        ratingError.style.display = "block";
        isValid = false;
      } else {
        ratingError.style.display = "none";
      }

      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated')
      }, 
      false);
  });
})();