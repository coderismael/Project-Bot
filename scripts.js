document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');

    // Send message function
    function sendMessage() {
        const inputField = document.getElementById('chat-input');
        const userMessage = inputField.value;
        if (userMessage.trim() === '') return;

        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user';
        userMessageDiv.textContent = userMessage;
        chatBox.appendChild(userMessageDiv);

        // Handle bot response
        handleBotResponse(userMessage);

        // Clear input field
        inputField.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle bot responses
    function handleBotResponse(message) {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot';

        var myHeaders = new Headers();
        myHeaders.append("X-API-KEY", "6fd377b8d1d71d6e1f10f5aed47f51e5f2bd65ef");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "q": message // Pass the user's message as the query
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://google.serper.dev/search", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result && result.organic && result.organic.length > 0) {
                    result.organic.forEach(item => {
                        const resultDiv = document.createElement('div');
                        resultDiv.className = 'search-result';

                        resultDiv.innerHTML = `
                            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                            <p>${item.snippet}</p>
                            <p><strong>Source:</strong> ${item.source}</p>
                        `;
                        botMessageDiv.appendChild(resultDiv);
                    });
                } else {
                    botMessageDiv.textContent = 'Sorry, I couldn’t find any relevant information.';
                }
                chatBox.appendChild(botMessageDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            })
            .catch(error => {
                botMessageDiv.textContent = 'An error occurred while searching. Please try again later.';
                chatBox.appendChild(botMessageDiv);
            });

        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Event listener for send button
    document.querySelector('.chat-input button').addEventListener('click', sendMessage);

    // Event listener for enter key press
    document.getElementById('chat-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});

