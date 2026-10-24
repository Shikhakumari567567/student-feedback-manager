const feedbackList = document.getElementById("feedbackList");
const listMessage = document.getElementById("listMessage");

async function loadFeedback() {
  try {
    const response = await fetch("/api/feedback");

    if (!response.ok) {
      throw new Error("Failed to load feedback.");
    }

    const feedbacks = await response.json();
    feedbackList.replaceChildren();

    if (feedbacks.length === 0) {
      listMessage.textContent = "No feedback found. Please submit feedback first.";
      return;
    }

    listMessage.textContent = "Feedback loaded successfully.";

    feedbacks.forEach((feedback) => {
      const card = document.createElement("div");
      card.className = "feedback-item";

      const name = document.createElement("h3");
      name.textContent = feedback.name;

      const rating = document.createElement("p");
      rating.textContent = `Rating: ${feedback.rating}/5`;

      const comment = document.createElement("p");
      comment.textContent = feedback.comment;

      card.append(name, rating, comment);
      feedbackList.appendChild(card);
    });
  } catch (error) {
    listMessage.textContent = error.message;
    console.error("Feedback error:", error);
  }
}

loadFeedback();
