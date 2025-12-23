
const selectedPparams = new URLSearchParams(window.location.search);
const formCaso = document.getElementById('caso');

selectedPparams.forEach((value, name) => {
  const element = formCaso.querySelectorAll(`[name="${name}"]`);
  
  element.forEach(element => {
    if ((element.type === 'checkbox' || element.type === 'radio') && value === '') {
      element.checked = true;
    }
    else if (element.type === 'radio' && element.value === value) {
      element.checked = true;
    }
    else if (element.type === 'checkbox' && element.value === value) {
      element.checked = true;
    }
    else if (!['checkbox', 'radio'].includes(element.type)) {
      element.value = value;
    }
  });

});





function calcularSoro() {
  const pesoElement = document.querySelector('#peso');
  const tipoSoroElement = document.querySelector('#calculo-soro input[name="tipo-soro"]:checked');
  const resultadoSoro = document.querySelector('#resultado-soro');
  const observacaoSoro = document.querySelector('#obs-soro')

  if(!pesoElement || !tipoSoroElement){
    resultadoSoro.textContent = "Por favor, preencha os campos.";
    return;
  }

  const peso = parseFloat(pesoElement.value);
  const tipoSoro = tipoSoroElement.value;

  if (!peso || peso <= 0) {
      resultadoSoro.textContent = "Por favor, informe o peso.";
      return;
  }

  let doseUI, volumeML;

  if (tipoSoro === "heterologo") {
      doseUI = peso * 40;
      volumeML = doseUI / 200;
  } else if (tipoSoro === "homologo") {
      doseUI = peso * 20;
      volumeML = doseUI / 150;
  }

  const tipoTexto = tipoSoro === "heterologo" ? "Heterólogo" : "Homólogo";
  
  resultadoSoro.innerHTML = 
    `<div><small>Tipo de Soro: <b>${tipoTexto}</b></small></div>` +
    `<div><small>Peso do Paciente: <b>${peso} kg</b></small></div>` +
    `<p>Dose necessária: <b>${doseUI.toFixed(0)} UI</b></p>` +
    `<p>Volume a ser administrado: <b>${volumeML.toFixed(1)} mL</b></p>`;

  observacaoSoro.classList.remove('hidden');  
}

formCaso.addEventListener('input', ()=>{
  if(!formCaso.checkValidity()){
    return;
  }
  const oldScrollInput = formCaso.querySelector('input[name="scroll"]');
  if(oldScrollInput) oldScrollInput.remove();

  const scrollInput = document.createElement('input');
  scrollInput.type = 'hidden';
  scrollInput.name = 'scroll';
  scrollInput.value = window.scrollY;
  formCaso.appendChild(scrollInput);

  formCaso.submit()
})

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const scrollPos = params.get('scroll');
  
  if(scrollPos) {
    window.scrollTo(0, parseInt(scrollPos));
    
    window.addEventListener('load', () => {
      window.scrollTo(0, parseInt(scrollPos));
    });
  }
});