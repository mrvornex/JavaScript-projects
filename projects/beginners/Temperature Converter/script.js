function convert(from) {
    let celsius = document.getElementById('celsius');
    let fahrenheit = document.getElementById('fahrenheit');
    let kelvin = document.getElementById('kelvin');
    
    let c = parseFloat(celsius.value) || 0;
    let f = parseFloat(fahrenheit.value) || 0;
    let k = parseFloat(kelvin.value) || 0;
    
    if (from === 'C') {
        fahrenheit.value = (c * 9/5 + 32).toFixed(2);
        kelvin.value = (c + 273.15).toFixed(2);
    } else if (from === 'F') {
        celsius.value = ((f - 32) * 5/9).toFixed(2);
        kelvin.value = (((f - 32) * 5/9) + 273.15).toFixed(2);
    } else if (from === 'K') {
        celsius.value = (k - 273.15).toFixed(2);
        fahrenheit.value = ((k - 273.15) * 9/5 + 32).toFixed(2);
    }
}

function clearAll() {
    document.getElementById('celsius').value = '';
    document.getElementById('fahrenheit').value = '';
    document.getElementById('kelvin').value = '';
}