console.log("Validation script loaded");
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      console.log("Submit event fired");

      let isValid = true;
      if (!form.checkValidity()) {
        isValid = false;
      }


      const ratings = document.getElementsByName("review[rating]");
      const ratingError = document.getElementById("ratingError");
      if (ratings.length > 0 && ratingError) {
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
      }

      
      console.log("checkValidity", form.checkValidity());
      if (!isValid) {
        console.log("Preventing submission");
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated')
      }, 
      false);
  });
})();