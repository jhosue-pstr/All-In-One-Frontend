export const BloqueRating = {
  id: 'bloque-rating',
  label: 'Calificación con Estrellas',
  attributes: {
    class: 'fa fa-star',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="rating-container" style="font-family: sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
  <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Califica este producto</h4>
  <div class="star-rating" style="display: inline-flex; gap: 5px; font-size: 28px; line-height: 1;" data-rating="0">
    <span class="star" data-value="1" style="color: #ddd; cursor: pointer; transition: color 0.15s, transform 0.15s;" onmouseover="highlightStars(1)" onmouseout="resetStars()" onclick="setRating(1)">★</span>
    <span class="star" data-value="2" style="color: #ddd; cursor: pointer; transition: color 0.15s, transform 0.15s;" onmouseover="highlightStars(2)" onmouseout="resetStars()" onclick="setRating(2)">★</span>
    <span class="star" data-value="3" style="color: #ddd; cursor: pointer; transition: color 0.15s, transform 0.15s;" onmouseover="highlightStars(3)" onmouseout="resetStars()" onclick="setRating(3)">★</span>
    <span class="star" data-value="4" style="color: #ddd; cursor: pointer; transition: color 0.15s, transform 0.15s;" onmouseover="highlightStars(4)" onmouseout="resetStars()" onclick="setRating(4)">★</span>
    <span class="star" data-value="5" style="color: #ddd; cursor: pointer; transition: color 0.15s, transform 0.15s;" onmouseover="highlightStars(5)" onmouseout="resetStars()" onclick="setRating(5)">★</span>
  </div>
  <p id="rating-text" style="margin: 10px 0 0 0; font-size: 14px; color: #666; min-height: 20px;">Haz clic para calificar</p>
  <div id="rating-feedback" style="margin-top: 15px; padding: 10px; background: white; border-radius: 6px; border: 1px solid #e0e0e0; min-height: 40px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #999;"></div>
</div>

<script>
function highlightStars(rating) {
  const stars = document.currentScript.previousElementSibling.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#ffc107';
      star.style.transform = 'scale(1.15)';
    } else {
      star.style.color = '#ddd';
      star.style.transform = 'scale(1)';
    }
  });
}

function resetStars() {
  const container = document.currentScript.previousElementSibling;
  const currentRating = parseInt(container.dataset.rating || 0);
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < currentRating) {
      star.style.color = '#ffc107';
      star.style.transform = 'scale(1)';
    } else {
      star.style.color = '#ddd';
      star.style.transform = 'scale(1)';
    }
  });
}

function setRating(rating) {
  const container = document.currentScript.previousElementSibling;
  container.dataset.rating = rating;
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#ffc107';
      star.style.transform = 'scale(1.1)';
      setTimeout(() => star.style.transform = 'scale(1)', 150);
    }
  });
  const messages = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];
  document.getElementById('rating-text').textContent = 'Tu calificación: ' + messages[rating];
  document.getElementById('rating-feedback').innerHTML = '<strong style="color: #ffc107;">' + '★'.repeat(rating) + '</strong> <span style="margin-left: 8px;">' + messages[rating] + '</span>';
}
</script>`
}
