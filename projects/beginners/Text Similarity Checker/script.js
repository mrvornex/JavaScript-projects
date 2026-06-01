function checkSimilarity() {
    const text1 = document.getElementById('text1').value.trim();
    const text2 = document.getElementById('text2').value.trim();
    const progressFill = document.getElementById('progressFill');
    const similarityText = document.getElementById('similarityText');

    if (!text1 || !text2) {
        similarityText.textContent = "⚠️ Please enter both texts";
        progressFill.style.width = "0%";
        progressFill.textContent = "0%";
        return;
    }

    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const similarity = (intersection.size / union.size) * 100;
    const rounded = Math.round(similarity * 100) / 100;

    progressFill.style.width = `${rounded}%`;
    progressFill.textContent = `${rounded}%`;

    if (rounded === 100) {
        similarityText.textContent = "✅ Texts are IDENTICAL!";
        progressFill.style.background = "linear-gradient(to right, #4cd964, #2ecc71)";
    } else if (rounded > 70) {
        similarityText.textContent = `✅ High similarity: ${rounded}%`;
        progressFill.style.background = "linear-gradient(to right, #5ac8fa, #007aff)";
    } else if (rounded > 30) {
        similarityText.textContent = `⚠️ Moderate similarity: ${rounded}%`;
        progressFill.style.background = "linear-gradient(to right, #ffcc00, #ff9500)";
    } else {
        similarityText.textContent = `❌ Low similarity: ${rounded}%`;
        progressFill.style.background = "linear-gradient(to right, #ff3b30, #ff2d55)";
    }
}

document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            checkSimilarity();
        }
    });
});