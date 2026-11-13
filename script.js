/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const workerUrl = "https://loreal-chatbot.your-subdomain.workers.dev/";
const systemPrompt =
  "You are a helpful L’Oréal beauty assistant. Only answer questions about L’Oréal products, skincare, makeup, haircare, fragrances, routines, and recommendations. If a question is unrelated, politely explain that you can only help with L’Oréal beauty topics.";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();

  if (!message) {
    return;
  }

  // Show the user's message while waiting for the assistant's reply.
  chatWindow.textContent = message;
  userInput.value = "";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    chatWindow.textContent = data.choices[0].message.content;
  } catch (error) {
    console.error("Could not get a chatbot response:", error);
    chatWindow.textContent =
      "Sorry, I could not connect to the chatbot. Check the Cloudflare Worker URL and try again.";
  }
});
