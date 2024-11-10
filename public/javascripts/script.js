const main = document.querySelector('.main');
const main_ele = document.querySelectorAll('.main-ele');
const card = document.querySelector('.card');
const card_img = document.querySelector('.card-img');
const card_p = document.querySelector('.card p');
const next_btn = document.querySelector('.next-btn');
const prev_btn = document.querySelector('.prev-btn');
const gt_start = document.querySelector('.gt-start');

const phrases = [
    "Hi! Are you currently preparing for a big exam or working hard towards a life goal that demands your full dedication?",
    "Do you often feel overwhelmed by the pressure of competitive exams? or Does the thought of facing an exam result make your heart race with anxiety?",
    "Do you feel like you have lost touch with your friends while preparing for exams?  or s your study schedule affecting your social life, making you feel lonely or isolated?",
    "Do you wish you had someone to talk to, who could help you stay positive and focused? or Would you like a friend who could guide you, motivate you, and help you overcome your fears during your preparation?"
];
const mainbg = ["#fffbe7", "#DCFFB7", "#CAF4FF", "#f1eaff"];
const cardbg = ["#fff7d1", "#94FFD8", "#CDC1FF", "#e5d4ff"];

let count = 1;

function updateContent() {
    // Updating images, background, and text based on the current count
    main_ele[0].setAttribute('src', `../images/a${count}1.svg`);
    main_ele[1].setAttribute('src', `../images/a${count}2.svg`);
    card.style.background = cardbg[count - 1];
    card_p.classList.add('fade-out');
    setTimeout(() => {
        card_p.textContent = phrases[count - 1];
        card_p.classList.remove('fade-out');
    }, 300); // Adjust the timeout duration as needed
    main.style.background = mainbg[count - 1];
    card_img.setAttribute('src', `/images/i${count}.png`);

    // Updating button visibility
    prev_btn.style.opacity = count > 1 ? '100' : '0';

    next_btn.style.display = count < phrases.length ? "block" : "none";
    gt_start.style.display = count === phrases.length ? "block" : "none";
}

next_btn.addEventListener('click', () => {
    if (count < phrases.length) {
        count++;
        updateContent();
    }
});

prev_btn.addEventListener('click', () => {
    if (count > 1) {
        count--;
        updateContent();
    }
});

gt_start.addEventListener('click', () => {
    window.location.href = '/register';
});

// Initial content update
updateContent();
