let currentIndex = 0;

function moveSlide(step) {
    const totalSlides = 2;

    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 2;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    const newTransformValue = -currentIndex * 100;
    document.querySelector(".slider").style.transform = `translateX(${newTransformValue}%)`;
}
