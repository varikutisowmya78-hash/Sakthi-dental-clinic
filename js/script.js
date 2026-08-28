const form = document.getElementById("appointmentForm");
const message = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const submitButton = form.querySelector(".form-submit");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    grecaptcha.ready(function () {

        grecaptcha.execute("6LckVZMtAAAAAL_8QxUOaahJgqH5E-OD8LH0BYov", {
            action: "submit"
        }).then(async function (token) {

            const formData = new FormData(form);

            // Send the reCAPTCHA token to Formspree
            formData.set("g-recaptcha-response", token);

            try {
                const response = await fetch(
                    "https://formspree.io/f/xzepwkwd",
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                const result = await response.json().catch(() => ({}));

                console.log("Formspree response:", result);
                console.log("reCAPTCHA token generated:", !!token);

                if (response.ok) {
                    message.textContent =
                        "✅ Your appointment request has been submitted successfully! We will contact you soon.";

                    message.classList.remove("error");
                    message.classList.add("success");

                    form.reset();

                } else {
                    message.textContent =
                        "❌ Form submission failed. Please try again.";

                    message.classList.remove("success");
                    message.classList.add("error");

                    console.log("Formspree error:", result);
                }

            } catch (error) {

                console.error("Submission error:", error);

                message.textContent =
                    "❌ Unable to submit the form. Please try again.";

                message.classList.remove("success");
                message.classList.add("error");
            }

            submitButton.disabled = false;
            submitButton.textContent = "Request an Appointment";
        });
    });
});