const sendButton = document.querySelector('form button');
const userInput = document.querySelector('form input');
const messageArea = document.querySelector('.message-area');

sendButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const prompt = userInput.value;
    if(!prompt){
        return;
    }
    addMessageToUI(prompt, 'user');
    userInput.value = '';

    const response  = await fetch('/chat/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    })
    // .then(response => response.json())
    // .then(data => {
    //     addMessageToUI(data.response, 'bot');
    // })
    const data = await response.json();
    addMessageToUI(data.response, 'bot');
    // window.location.href = '/chat';
})

function addMessageToUI(message, sender){
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(`msg-${sender}`);
    messageDiv.textContent = message;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}