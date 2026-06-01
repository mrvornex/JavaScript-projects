function toggleAnswer(index) {
    const answers = document.querySelectorAll('.answer');
    const questions = document.querySelectorAll('.question span');
    const answer = answers[index];
    const sign = questions[index];
    
    if (answer.classList.contains('show')) {
        answer.classList.remove('show');
        sign.textContent = '+';
    } else {
        answers.forEach((a, i) => {
            a.classList.remove('show');
            questions[i].textContent = '+';
        });

        answer.classList.add('show');
        sign.textContent = '−';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toggleAnswer(0);
});