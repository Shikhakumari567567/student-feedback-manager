const feedbackForm = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(feedbackForm);

  const feedback = {
    name: formData.get("name").trim(),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment").trim()
  };

  // Clear the previous message
  message.textContent = "";
  message.className = "";

  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(feedback)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to submit feedback."
      );
    }

    message.textContent = result.message;
    message.className = "success";

    feedbackForm.reset();
  } catch (error) {
    message.textContent =
      error.message || "Something went wrong. Please try again.";

    message.className = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Feedback";
  }
});
