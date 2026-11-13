/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const workerUrl = "https://lorealchatbotworker.pcapcapca1.workers.dev/";
const systemPrompt =
  "You are a helpful L’Oréal beauty assistant. Only answer questions about L’Oréal products, skincare, makeup, haircare, fragrances, routines, and recommendations. If a question is unrelated, politely explain that you can only help with L’Oréal beauty topics.";
const conversationHistory = [{ role: "system", content: systemPrompt }];

function addMessage(text, sender) {
  const messageBubble = document.createElement("div");
  messageBubble.className = `msg ${sender}`;
  messageBubble.textContent = text;
  chatWindow.appendChild(messageBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show the assistant's first message when the chatbot opens.
addMessage("👋 Hello! How can I help you today?", "ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();

  if (!message) {
    return;
  }

  // Keep the user's question in the conversation and display it immediately.
  conversationHistory.push({ role: "user", content: message });
  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });
    addMessage(reply, "ai");
  } catch (error) {
    console.error("Could not get a chatbot response:", error);
    addMessage(
      "Sorry, I could not connect to the chatbot. Check the Cloudflare Worker URL and try again.",
      "ai",
    );
  }
});
