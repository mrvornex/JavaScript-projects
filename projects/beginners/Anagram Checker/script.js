function checkAnagram() {
    const word1 = document.getElementById('word1').value.toLowerCase().replace(/\s/g, '');
    const word2 = document.getElementById('word2').value.toLowerCase().replace(/\s/g, '');
    const result = document.getElementById('result');
    
    if (!word1 || !word2) {
        result.textContent = "⚠️ Please enter both words";
        result.className = "";
        return;
    }
    
    const sorted1 = word1.split('').sort().join('');
    const sorted2 = word2.split('').sort().join('');
    const isAnagram = sorted1 === sorted2;
    
    result.textContent = isAnagram 
        ? `✅ "${word1}" and "${word2}" are ANAGRAMS!` 
        : `❌ "${word1}" and "${word2}" are NOT anagrams`;
    
    result.className = isAnagram ? "true" : "false";
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnagram();
    });
});