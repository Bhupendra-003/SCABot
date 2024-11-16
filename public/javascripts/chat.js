const userMessage = document.querySelector('.msg-user');
const botMessage = document.querySelector('.msg-bot');
const sendButton = document.querySelector('form button');
const userInput = document.querySelector('form input');

sendButton.addEventListener('click', async (e) => {
    const prompt = userInput.value;
    if(!prompt){
        return;
    }
    addMessageToUI(prompt, 'user');
    userInput.value = '';

    await fetch('/chat/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    })
    .then(response => response.json())
    .then(data => {
        addMessageToUI(data.response, 'bot');
    })
    window.location.href = '/chat';
})

function addMessageToUI(message, sender){
    const msgArea = document.querySelector('.message-area');
    const messageDiv = document.createElement('div');
    if(sender === 'user'){
        userMessage.innerHTML += message;
        messageDiv.classList.add('msg-user');
    }
    else{
        botMessage.innerHTML += message;
        messageDiv.classList.add('msg-bot');
    }
    msgArea.appendChild(messageDiv);
    msgArea.scrollTop = msgArea.scrollHeight;
}