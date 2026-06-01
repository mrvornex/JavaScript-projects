let history = [];

function rollDice() {
    const diceCount = parseInt(document.getElementById('diceCount').value) || 2;
    const diceContainer = document.getElementById('diceContainer');
    diceContainer.innerHTML = '';
    
    let total = 0;
    const results = [];
    
    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        total += roll;
        results.push(roll);
        
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = roll;
        dice.style.animation = 'none';
        setTimeout(() => {
            dice.style.animation = 'roll 0.5s ease';
        }, 10);
        
        diceContainer.appendChild(dice);
    }
    
    document.getElementById('total').textContent = total;
    
    history.push({
        dice: diceCount,
        results: results,
        total: total,
        time: new Date().toLocaleTimeString()
    });
    
    if (history.length > 10) history.shift();
}

function rollHistory() {
    if (history.length === 0) {
        alert('No rolls yet! Roll some dice first.');
        return;
    }
    
    let historyText = 'Last 10 Rolls:\n\n';
    history.forEach((roll, index) => {
        historyText += `${index + 1}. ${roll.dice} dice: [${roll.results.join(', ')}] = ${roll.total} (${roll.time})\n`;
    });
    
    alert(historyText);
}

document.getElementById('diceCount').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') rollDice();
});

window.onload = rollDice;