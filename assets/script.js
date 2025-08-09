const urlParams = new URLSearchParams(window.location.search);
const animalAgressor = urlParams.get('animal-agressor')
const exposicao = urlParams.get('exposicao')

// Objeto com o texto do caso
const casos = {
    'exposicao':{
        'contato-indireto': '<b>INDIRETO</b>',
        'leve': '<b>LEVE</b>',
        'grave': '<b>GRAVE</b>',
    },
    'animal-agressor':{
        'cao-gato-sem-sinais': '<b>CÃO OU GATO</b> - ANIMAL PASSÍVEL DE OBSERVAÇÃO POR 10 DIAS E SEM SINAIS SUGESTIVOS DE RAIVA',
        'cao-gato-com-sinais': '<b>CÃO OU GATO</b> - ANIMAL NÃO PASSÍVEL DE OBSERVAÇÃO POR 10 DIAS OU COM SINAIS SUGESTIVOS DE RAIVA',
        'interesse-economico': '<b>MAMÍFERO DOMÉSTICO DE INTERESSE ECONÔMICO</b> (bovídeos, equídeos, caprinos, suínos e ovinos)',
        'mamiferos-silvestres': '<b>MAMÍFEROS SILVESTRES</b> (ex.: raposa, macaco, sagui)',
        'morcegos': '<b>MORCEGOS</b>',
    }
}
// Condicionais
let vacina = false
let soro = false

if(animalAgressor && exposicao){
    const resposta = document.getElementById('resposta')

    const tituloResposta = document.createElement('h2')
    const caso = document.createElement('p')
    const protocolo = document.createElement('p')
    const textoVacina = document.createElement('p')
    const textoSoro = document.createElement('p')
    
    if(exposicao =='contato-indireto' && animalAgressor !='morcegos'){
        protocolo.innerHTML = `
            <ul>
                <li>Lavar com água e sabão.</li>
                <li>NÃO INDICAR PROFILAXIA</li>
            </ul>
        `

    }else if(
        (animalAgressor =='morcegos') || 
        (animalAgressor == 'mamiferos-silvestres' && exposicao != 'contato-indireto') ||
        (exposicao == 'grave' && (animalAgressor == 'cao-gato-com-sinais'|| animalAgressor =='interesse-economico'))

    ){
        protocolo.innerHTML = `
            <ul>
                <li>Lavar com água e sabão.</li>
                <li>INICIAR PROFILAXIA: VACINA* (dias 0, 3, 7 e 14) e SORO (SAR ou IGHAR)</li>
            </ul>
        `
        vacina = true
        soro = true

    }else if(
        (exposicao == 'leve' && (animalAgressor == 'cao-gato-com-sinais'|| animalAgressor =='interesse-economico'))
    ){
        protocolo.innerHTML = `
            <ul>
                <li>Lavar com água e sabão.</li>
                <li>INICIAR PROFILAXIA: VACINA* (dias 0, 3, 7 e 14)</li>
            </ul>
        `
        vacina = true

    }else if(
        (animalAgressor == 'cao-gato-sem-sinais' && exposicao == 'leve')
    ){
        protocolo.innerHTML = `
            <ul>
                <li>Lavar com água e sabão.</li>
                <li>NÃO INICIAR PROFILAXIA.</li>
                <li>Manter o animal em observação por 10 dias Se permanecer vivo e saudável, suspender a observação no 10° dia e encerrar o caso. Se
                morrer, desaparece ou apresentar sinais de raiva, indicar VACINA (dias 0, 3, 7 e 14)</li>
            </ul>
        `
        vacina = true
    }else if(
        (animalAgressor == 'cao-gato-sem-sinais' && exposicao == 'grave')
    ){
        protocolo.innerHTML = `
            <ul>
                <li>Lavar com água e sabão.</li>
                <li>NÃO INICIAR PROFILAXIA.</li>
                <li>Manter o animal em observação por 10 dias Se permanecer vivo e saudável, suspender a observação no 10° dia e encerrar o caso. Se
                morrer, desaparece ou apresentar sinais de raiva, indicar VACINA (dias 0, 3, 7 e 14) e SORO (SAR ou IGHAR)•</li>
            </ul>
        `
        vacina = true
        soro = true
    }


//Adicionando texto nos elementos
    textoVacina.innerHTML = `
    <p>
        <b>*VACINA</b> Quatro doses, nos dias 0, 3, 7 e 14
    </p>
    <p>
        A vacina deverá ser administrada por via intradérmica ou via intramuscular.
        Via intradérmica: volume da dose 0,2 ml. O volume da dose deve ser dividido em duas aplicações de 0,1 ml cada e
        administradas em dois sítios distintos, independente da apresentação da vacina, seja 0,5 ml ou 1,0 ml (dependendo do
        laboratório produtor). Local de aplicação: inserção do músculo deltoide ou no antebraço.
        Via intramuscular: dose total 0,5 ml ou 1,0 ml (dependendo do laboratório produtor). Administrar todo o volume do
        frasco. Local de aplicação: no músculo deltoide ou vasto lateral da coxa em crianças menores de 2 (dois) anos. Não
        aplicar no glúteo.
    </p>
    `
    textoSoro.innerHTML = `
    <p><b>SORO (SAR ou IGHAR)•</b></p>

    <p>O SAR, ou a IGHAR, deve ser administrado no dia 0. Caso não esteja disponível, aplicar o mais rápido possível até
    o 7° dia após a aplicação da 1° dose de vacina. Após esse prazo é contraindicado. Existindo clara identificação da
    localização da(s) lesão(ões), recentes ou cicatrizadas, deve-se infiltrar o volume total indicado, ou o máximo possível,
    dentro ou ao redor da(s) lesão(ões). Se não for possível, aplicar o restante por via IM, respeitando o volume máximo
    de cada grupo muscular mais próximo da lesão.
    Soro antirrábico (SAR): 40 UI/kg de peso.
    Imunoglobulina humana antirrábica (IGHAR): IGHAR 20 UI/kg de peso.</p>
    `

    tituloResposta.textContent = 'Protocolo recomendado'
    caso.innerHTML = `Caso: contato ${casos['exposicao'][exposicao]} com ${casos['animal-agressor'][animalAgressor]}`


    //Inserção no dom
    resposta.appendChild(caso)
    resposta.appendChild(tituloResposta)
    resposta.append(protocolo)
    if(vacina){
        resposta.append(textoVacina)
    }
    if(soro){
        resposta.append(textoSoro)
    }
}


