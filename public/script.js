document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatArea = document.getElementById('chatArea');
    const newConversationButton = document.getElementById('newConversation');

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

    newConversationButton.addEventListener('click', () => {
        chatArea.innerHTML = '';
        const startChatDiv = document.createElement('div');
        startChatDiv.className = 'start-chat';
        startChatDiv.innerHTML = `
            <img src="logo.png" alt="Contoso Logo" class="logo">
            <h2>Start chatting</h2>
            <p>This chatbot is configured to answer your questions</p>
        `;
        chatArea.appendChild(startChatDiv);
    });

    function addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = formatMessage(content);
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        if (sender === 'bot') {
            highlightCode();
        }
    }

    function formatMessage(content) {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const inlineCodeRegex = /`([^`]+)`/g;
        
        let formattedContent = content.replace(codeBlockRegex, (match, language, code) => {
            return `<pre><code class="language-${language || ''}">${escapeHtml(code.trim())}</code></pre>`;
        });
        
        formattedContent = formattedContent.replace(inlineCodeRegex, '<code>$1</code>');
        
        return formattedContent;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function highlightCode() {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
});