function appendMessage(role, text) {
  const output = document.getElementById('chat-output');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (role.toLowerCase() === 'you') {
    messageElement.classList.add('you');
  } else if (role.toLowerCase() === 'gemini') {
    messageElement.classList.add('gemini');
  } else {
    messageElement.style.color = 'red';
  }

  const escapedText = escapeHtml(text);

  // Wrap code blocks with a copy button container
  const formattedText = escapedText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div class="code-block">
        <button class="copy-btn" title="Copy code">Copy</button>
        <pre><code class="language-${lang || ''}">${code}</code></pre>
      </div>
    `;
  }).replace(/\n/g, '<br>');

  messageElement.innerHTML = formattedText;
  output.appendChild(messageElement);
  output.scrollTop = output.scrollHeight;

  // Attach click event listener to all copy buttons inside this message
  const copyButtons = messageElement.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const code = button.nextElementSibling.querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => (button.textContent = 'Copy'), 2000);
      }).catch(() => {
        button.textContent = 'Failed';
        setTimeout(() => (button.textContent = 'Copy'), 2000);
      });
    });
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = '';

  try {
      const response = await fetch('https://ai-studio-3neo.onrender.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });


    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    appendMessage("Gemini", data.reply);
  } catch (error) {
    appendMessage("Error", "Failed to connect to backend");
    console.error("Error in sendMessage:", error);
  }
}
