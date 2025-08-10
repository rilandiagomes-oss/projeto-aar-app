
const params = new URLSearchParams(window.location.search);

params.forEach((value, name) => {
  const elements = document.querySelectorAll(`[name="${name}"]`);
  
  elements.forEach(element => {
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
  const peso = parseFloat(document.querySelector('#peso').value);
  const tipoSoro = document.querySelector('#calculo-soro input[name="tipo-soro"]:checked').value;
  const resultadoSoro = document.querySelector('#resultado-soro');

  if (!peso || peso <= 0) {
      resultadoSoro.textContent = "Por favor, preencha o peso corretamente (deve ser maior que 0).";
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
  
  resultadoSoro.textContent = 
      `Tipo de Soro: ${tipoTexto}\n` +
      `Peso do Paciente: ${peso} kg\n\n` +
      `Dose necessária: ${doseUI.toFixed(0)} UI\n` +
      `Volume a ser administrado: ${volumeML.toFixed(1)} mL`;
}