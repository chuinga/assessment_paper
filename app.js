let atual = 0;
let revisaoAtual = 0;

function baralharArray(array){
  const novo = [...array];

  for(let i = novo.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [novo[i], novo[j]] = [novo[j], novo[i]];
  }

  return novo;
}

const perguntasTeste = baralharArray(perguntas).map(p => ({
  ...p,
  op: baralharArray(p.op)
}));

let respostas = Array(perguntasTeste.length).fill(null);

const valor = 100 / perguntasTeste.length;

function mostrar(){
  const perguntaAtual = perguntasTeste[atual];

  document.getElementById("contador").innerText =
    `Exercício ${atual + 1} de ${perguntasTeste.length}`;

  const percentagem = Math.round(((atual + 1) / perguntasTeste.length) * 100);
  const fill = document.getElementById("fill");
  fill.style.width = percentagem + "%";
  fill.innerText = percentagem + "%";

  const tipo = perguntaAtual.t === "single" ? "radio" : "checkbox";

  document.getElementById("pergunta").innerHTML = `
    <h2>Exercício ${atual + 1}</h2>
    <p><strong>${perguntaAtual.q}</strong></p>

    ${perguntaAtual.op.map(opcao => {
      const checked = respostas[atual]?.includes(opcao) ? "checked" : "";
      return `
        <label class="opcao">
          <input type="${tipo}" name="resp" value="${opcao}" ${checked}>
          ${opcao}
        </label>
      `;
    }).join("")}

    <div class="nav">
      <button class="secondary" onclick="guardar(); anterior();" ${atual === 0 ? "disabled" : ""}>
        ⬅ Anterior
      </button>

      ${
        atual === perguntasTeste.length - 1
          ? `<button class="submit" onclick="submeter()">✅ Submeter teste</button>`
          : `<button class="primary" onclick="guardar(); seguinte();">Seguinte ➡</button>`
      }
    </div>
  `;
}

function guardar(){
  respostas[atual] = [...document.querySelectorAll("input[name='resp']:checked")]
    .map(input => input.value);
}

function seguinte(){
  if(!respostas[atual] || respostas[atual].length === 0){
    alert(`Falta responder ao exercício ${atual + 1}.`);
    return;
  }

  atual++;
  mostrar();
}

function anterior(){
  if(atual > 0){
    atual--;
    mostrar();
  }
}

function iguais(a,b){
  return Array.isArray(a) &&
         a.length === b.length &&
         a.every(x => b.includes(x));
}

function calcularPontosPergunta(resposta, corretas){
  if(!Array.isArray(resposta) || resposta.length === 0) return 0;

  const certasSelecionadas = resposta.filter(r => corretas.includes(r)).length;
  const erradasSelecionadas = resposta.filter(r => !corretas.includes(r)).length;

  if(erradasSelecionadas > 0) return 0;

  if(corretas.length === 1){
    return certasSelecionadas === 1 ? valor : 0;
  }

  return Math.round((valor / corretas.length) * certasSelecionadas * 10) / 10;
}

function calcularTotal(){
  let total = 0;

  perguntasTeste.forEach((pergunta, i) => {
    total += calcularPontosPergunta(respostas[i], pergunta.c);
  });

  return Math.round(total * 10) / 10;
}

function obterNota(total){
  if(total < 50) return "Insuficiente";
  if(total < 70) return "Suficiente";
  if(total < 90) return "Bom";
  return "Muito Bom";
}

function submeter(){
  guardar();

  const nome = document.getElementById("nome").value.trim();
  const numero = document.getElementById("numero").value.trim();

  if(!nome){
    alert("Falta preencher o nome do aluno.");
    return;
  }

  if(!numero){
    alert("Falta preencher o número do aluno.");
    return;
  }

  const primeiraFalta = respostas.findIndex(r => !r || r.length === 0);

  if(primeiraFalta !== -1){
    alert(`Falta responder ao exercício ${primeiraFalta + 1}.`);
    atual = primeiraFalta;
    mostrar();
    return;
  }

  const total = calcularTotal();
  const nota = obterNota(total);

  document.getElementById("pergunta").style.display = "none";
  document.getElementById("resultado").style.display = "block";

  document.getElementById("total").innerHTML =
    `<strong>${nome}</strong>, N.º ${numero}<br>
     <strong>Pontuação total:</strong> ${total} / 100 pontos`;

  document.getElementById("nota").innerHTML =
    `<strong>Classificação:</strong> ${nota}`;

  document.getElementById("certificado").innerHTML =
    total >= 90
      ? `<div class="cert">
          <h2>🏆 Certificado de Excelente Resultado</h2>
          <p>Parabéns, ${nome}! Obtiveste ${total}/100 pontos.</p>
        </div>`
      : "";

  document.getElementById("botoesRev").innerHTML =
    perguntasTeste.map((_, i) =>
      `<button onclick="ver(${i})">Ex. ${i + 1}</button>`
    ).join("");

  ver(0);

  setTimeout(exportarPDF, 500);
}

function ver(i){
  revisaoAtual = i;

  const pergunta = perguntasTeste[i];
  const resposta = respostas[i] || [];
  const correto = iguais(resposta, pergunta.c);
  const pontos = calcularPontosPergunta(resposta, pergunta.c);

  document.getElementById("comparacao").innerHTML = `
    <h3>Exercício ${i + 1}</h3>
    <p><strong>Pergunta:</strong> ${pergunta.q}</p>
    <p><strong>A tua resposta:</strong> ${resposta.join(", ")}</p>
    <p><strong>Solução:</strong> ${pergunta.c.join(", ")}</p>
    <p><strong>Pontuação:</strong> ${pontos.toFixed(1)} / ${valor.toFixed(1)}</p>
    <p class="${correto ? "certo" : pontos > 0 ? "certo" : "errado"}">
      ${correto ? "Correto ✅" : pontos > 0 ? "Parcialmente correto 🟡" : "Incorreto ❌"}
    </p>

    <div class="nav">
      <button class="secondary" onclick="verAnterior()" ${i === 0 ? "disabled" : ""}>
        ⬅ Exercício anterior
      </button>

      <button class="primary" onclick="verSeguinte()" ${i === perguntasTeste.length - 1 ? "disabled" : ""}>
        Exercício seguinte ➡
      </button>
    </div>
  `;
}

function verAnterior(){
  if(revisaoAtual > 0){
    ver(revisaoAtual - 1);
  }
}

function verSeguinte(){
  if(revisaoAtual < perguntasTeste.length - 1){
    ver(revisaoAtual + 1);
  }
}

function exportarPDF(){
  try{
    const { jsPDF } = window.jspdf;

    if(!jsPDF){
      alert("Não foi possível gerar o PDF. Verifica se tens ligação à internet.");
      return;
    }

    const pdf = new jsPDF();
    const nome = document.getElementById("nome").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const total = calcularTotal();
    const nota = obterNota(total);

    pdf.setFontSize(22);
    pdf.text("Ficha Final - Estudo do Meio", 105, 30, {align:"center"});

    pdf.setFontSize(14);
    pdf.text("3.º Ano - 3.º Período", 105, 42, {align:"center"});

    pdf.setFontSize(12);
    pdf.text(`Aluno: ${nome}`, 20, 65);
    pdf.text(`N.º: ${numero}`, 20, 75);
    pdf.text("Data: 19/06/2026", 20, 85);
    pdf.text(`Pontuação: ${total}/100`, 20, 100);
    pdf.text(`Classificação: ${nota}`, 20, 110);

    if(total >= 90){
      pdf.setFontSize(18);
      pdf.text("Certificado de Excelente Resultado", 105, 140, {align:"center"});
      pdf.setFontSize(12);
      pdf.text(`Parabéns, ${nome}! Obtiveste uma classificação de Muito Bom.`, 105, 152, {align:"center"});
    }

    pdf.addPage();

    let y = 15;
    pdf.setFontSize(16);
    pdf.text("Correção completa", 20, y);
    y += 12;

    pdf.setFontSize(9);

    perguntasTeste.forEach((pergunta, i) => {
      const resposta = respostas[i] || [];
      const pontos = calcularPontosPergunta(resposta, pergunta.c);
      const correto = iguais(resposta, pergunta.c);

      const bloco = [
        `Ex. ${i + 1}: ${pontos.toFixed(1)} / ${valor.toFixed(1)}`,
        `Pergunta: ${pergunta.q}`,
        `Resposta do aluno: ${resposta.join(", ")}`,
        `Solução: ${pergunta.c.join(", ")}`,
        `Resultado: ${correto ? "Correto" : pontos > 0 ? "Parcialmente correto" : "Incorreto"}`
      ];

      bloco.forEach(linha => {
        const linhas = pdf.splitTextToSize(linha, 170);
        pdf.text(linhas, 20, y);
        y += linhas.length * 5;
      });

      y += 5;

      if(y > 270){
        pdf.addPage();
        y = 15;
      }
    });

    const nomeSeguro = nome.replaceAll(" ","_").replace(/[^\wÀ-ÿ_-]/g,"");
    const nomeFicheiro = `correcao_estudo_meio_${nomeSeguro}_n${numero}.pdf`;

    pdf.save(nomeFicheiro);

  }catch(e){
    alert("Erro ao criar o PDF. O navegador pode estar a bloquear o download automático.");
    console.error(e);
  }
}

mostrar();