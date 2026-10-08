/* Acessibilidade: ampliação e alto contraste com preferência salva no navegador. */
(function () {
  'use strict';
  var escala = 1;
  var contraste = false;
  try {
    var valor = Number(localStorage.getItem('salao_escala'));
    if ([0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5].some(function(v){return Math.abs(v-valor)<0.001;})) escala=valor;
    contraste = localStorage.getItem('salao_contraste') === 'sim';
  } catch (e) { /* O site continua funcionando sem armazenamento local. */ }
  var btnContraste = document.getElementById('alternar-contraste');
  function aplicar() {
    document.body.style.setProperty('--escala-acessibilidade', String(escala));
    document.body.classList.toggle('modo-alto-contraste', contraste);
    btnContraste.setAttribute('aria-pressed', String(contraste));
    btnContraste.textContent = contraste ? 'Desativar alto contraste' : 'Alto contraste';
    try {
      localStorage.setItem('salao_escala', String(escala));
      localStorage.setItem('salao_contraste', contraste ? 'sim' : 'nao');
    } catch(e) {}
  }
  document.getElementById('fonte-maior').addEventListener('click', function(){ escala=Math.min(1.5, Math.round((escala+0.1)*10)/10); aplicar(); });
  document.getElementById('fonte-menor').addEventListener('click', function(){ escala=Math.max(0.9, Math.round((escala-0.1)*10)/10); aplicar(); });
  document.getElementById('fonte-padrao').addEventListener('click', function(){ escala=1; aplicar(); });
  btnContraste.addEventListener('click', function(){ contraste=!contraste; aplicar(); });
  aplicar();
})();
