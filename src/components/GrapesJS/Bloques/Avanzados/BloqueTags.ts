export const BloqueTags = {
  id: 'bloque-tags',
  label: 'Etiquetas / Tags',
  attributes: {
    class: 'fa fa-tags',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="tags-container" style="font-family: sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;">
  <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Etiquetas populares</h4>
  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #e3f2fd; color: #0066cc; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #bbdefb; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#bbdefb'" onmouseout="this.style.background='#e3f2fd'">React <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #f3e5f5; color: #9c27b0; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #e1bee7; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e1bee7'" onmouseout="this.style.background='#f3e5f5'">Vue.js <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #e8f5e9; color: #4caf50; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #c8e6c9; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#c8e6c9'" onmouseout="this.style.background='#e8f5e9'">Angular <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #fff3e0; color: #ff9800; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #ffe0b2; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#ffe0b2'" onmouseout="this.style.background='#fff3e0'">Node.js <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #fce4ec; color: #e91e63; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #f8bbd0; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8bbd0'" onmouseout="this.style.background='#fce4ec'">Python <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #e0f7fa; color: #00bcd4; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #b2ebf2; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#b2ebf2'" onmouseout="this.style.background='#e0f7fa'">Docker <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span></span>
  </div>

  <!-- Add new tag input -->
  <div style="display: flex; gap: 8px;">
    <input type="text" placeholder="Añadir nueva etiqueta..." style="flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0066cc'" onblur="this.style.borderColor='#ddd'">
    <button onclick="addTag(this)" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#0052a3'" onmouseout="this.style.background='#0066cc'">Añadir</button>
  </div>
</div>

<script>
function addTag(button) {
  const input = button.previousElementSibling;
  const tagText = input.value.trim();
  if (tagText) {
    const container = button.parentElement.parentElement.querySelector('.tags-container > div:first-child');
    const colors = [
      {bg: '#e3f2fd', border: '#bbdefb', color: '#0066cc'},
      {bg: '#f3e5f5', border: '#e1bee7', color: '#9c27b0'},
      {bg: '#e8f5e9', border: '#c8e6c9', color: '#4caf50'},
      {bg: '#fff3e0', border: '#ffe0b2', color: '#ff9800'},
      {bg: '#fce4ec', border: '#f8bbd0', color: '#e91e63'},
      {bg: '#e0f7fa', border: '#b2ebf2', color: '#00bcd4'}
    ];
    const colorSet = colors[Math.floor(Math.random() * colors.length)];
    const span = document.createElement('span');
    span.style = 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: ' + colorSet.bg + '; color: ' + colorSet.color + '; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid ' + colorSet.border + '; cursor: pointer; transition: all 0.2s;';
    span.onmouseover = function() { this.style.background = colorSet.border; };
    span.onmouseout = function() { this.style.background = colorSet.bg; };
    span.innerHTML = tagText + ' <span style="cursor: pointer; margin-left: 2px;" onclick="this.parentElement.remove()">×</span>';
    container.appendChild(span);
    input.value = '';
  }
}
</script>`
}
