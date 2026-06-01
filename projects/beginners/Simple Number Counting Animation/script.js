const numbers = document.querySelectorAll(".number");

numbers.forEach(number => {
    const target = +number.getAttribute("data-target");
    let count = 0;
    const increment = target / 200;

    const updateCount = () => {
        count += increment;
        if (count < target) {
            number.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
        } else {
            number.textContent = target;
        }
    }

    updateCount();
});
