export const BloqueCarousel = {
  id: 'bloque-carousel',
  label: 'Carrusel de Imágenes',
  attributes: {
    class: 'fa fa-images',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="carousel-container" style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <div class="carousel-slides" style="display: flex; transition: transform 0.5s ease-in-out; width: 300%;">
    <div class="carousel-slide" style="min-width: 33.333%; position: relative; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      Slide 1
    </div>
    <div class="carousel-slide" style="min-width: 33.333%; position: relative; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      Slide 2
    </div>
    <div class="carousel-slide" style="min-width: 33.333%; position: relative; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      Slide 3
    </div>
  </div>
  <button class="carousel-prev" style="position: absolute; top: 50%; left: 15px; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,1)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">‹</button>
  <button class="carousel-next" style="position: absolute; top: 50%; right: 15px; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,1)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">›</button>
  <div class="carousel-dots" style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
    <span class="dot active" style="width: 12px; height: 12px; background: rgba(255,255,255,0.6); border-radius: 50%; cursor: pointer; transition: background 0.2s;" onclick="this.parentElement.parentElement.parentElement.querySelector('.carousel-dots').querySelectorAll('.dot')[0].style.background='rgba(255,255,255,1)'; this.parentElement.parentElement.parentElement.querySelectorAll('.dot')[1].style.background='rgba(255,255,255,0.6)'"></span>
    <span class="dot" style="width: 12px; height: 12px; background: rgba(255,255,255,0.6); border-radius: 50%; cursor: pointer; transition: background 0.2s;" onclick="this.parentElement.parentElement.parentElement.querySelector('.carousel-dots').querySelectorAll('.dot')[1].style.background='rgba(255,255,255,1)'; this.parentElement.parentElement.parentElement.querySelectorAll('.dot')[0].style.background='rgba(255,255,255,0.6)'"></span>
    <span class="dot" style="width: 12px; height: 12px; background: rgba(255,255,255,0.6); border-radius: 50%; cursor: pointer; transition: background 0.2s;" onclick="this.parentElement.parentElement.parentElement.querySelector('.carousel-dots').querySelectorAll('.dot')[2].style.background='rgba(255,255,255,1)'; this.parentElement.parentElement.parentElement.querySelectorAll('.dot')[0].style.background='rgba(255,255,255,0.6)'"></span>
  </div>
</div>

<script>
(function() {
  let currentIndex = 0;
  const container = document.currentScript.previousElementSibling;
  const slides = container.querySelectorAll('.carousel-slide');
  const dots = container.querySelectorAll('.dot');
  const totalSlides = slides.length;

  function goToSlide(index) {
    container.querySelector('.carousel-slides').style.transform = 'translateX(-' + (index * 33.333) + '%)';
    dots.forEach((dot, i) => {
      dot.style.background = i === index ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)';
    });
    currentIndex = index;
  }

  container.querySelector('.carousel-next').addEventListener('click', () => {
    goToSlide((currentIndex + 1) % totalSlides);
  });

  container.querySelector('.carousel-prev').addEventListener('click', () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  });

  // Auto-play
  setInterval(() => goToSlide((currentIndex + 1) % totalSlides), 4000);
})();
</script>`
}
