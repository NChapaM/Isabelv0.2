document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatArea = document.getElementById('chatArea');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });

                if (response.ok) {
                    const data = await response.json();
                    addMessage('bot', data.response);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    function addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = content;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});