document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".colab-slide");
  let index = 0;

  if (slides.length === 0) return;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
  }

  showSlide(index);

  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 6000);
});
