const perguntas = [
  {
    q:"Quais são fatores essenciais para a vida dos seres vivos?",
    op:["Ar","Água","Luz","Televisão"],
    c:["Ar","Água","Luz"],
    t:"multi"
  },
  {
    q:"As plantas produzem o seu próprio alimento.",
    op:["Verdadeiro","Falso"],
    c:["Verdadeiro"],
    t:"single"
  },
  {
    q:"O produtor numa cadeia alimentar é geralmente:",
    op:["Uma planta","Uma raposa","Um leopardo","Um consumidor final"],
    c:["Uma planta"],
    t:"single"
  },
  {
    q:"Qual é a cadeia alimentar correta?",
    op:["Plantas → coelho → raposa","Raposa → plantas → coelho","Coelho → plantas → raposa","Raposa → coelho → plantas"],
    c:["Plantas → coelho → raposa"],
    t:"single"
  },
  {
    q:"A gazela que come plantas é:",
    op:["Produtor","Consumidor primário","Consumidor final","Decompositor"],
    c:["Consumidor primário"],
    t:"single"
  },
  {
    q:"O leopardo que come a gazela é:",
    op:["Produtor","Consumidor final","Planta","Semente"],
    c:["Consumidor final"],
    t:"single"
  },
  {
    q:"Se uma espécie desaparecer, a cadeia alimentar pode ser afetada.",
    op:["Verdadeiro","Falso"],
    c:["Verdadeiro"],
    t:"single"
  },
  {
    q:"As plantas podem reproduzir-se:",
    op:["Por semente","Por estaca","Por ovos","Por leite"],
    c:["Por semente","Por estaca"],
    t:"multi"
  },
  {
    q:"O feijoeiro reproduz-se por:",
    op:["Semente","Estaca","Ovo","Ventre materno"],
    c:["Semente"],
    t:"single"
  },
  {
    q:"A roseira pode reproduzir-se por:",
    op:["Estaca","Ovo","Ventre materno","Penas"],
    c:["Estaca"],
    t:"single"
  },
  {
    q:"Os animais vivíparos:",
    op:["Nascem de ovos","Desenvolvem-se no ventre materno","Nascem de sementes","São sempre aves"],
    c:["Desenvolvem-se no ventre materno"],
    t:"single"
  },
  {
    q:"Os animais ovíparos:",
    op:["Nascem de ovos","Nascem do ventre materno","São plantas","Produzem sementes"],
    c:["Nascem de ovos"],
    t:"single"
  },
  {
    q:"Seleciona animais ovíparos.",
    op:["Galinha","Pato","Cão","Cobra"],
    c:["Galinha","Pato","Cobra"],
    t:"multi"
  },
  {
    q:"Seleciona animais vivíparos.",
    op:["Ser humano","Gato","Elefante","Galinha"],
    c:["Ser humano","Gato","Elefante"],
    t:"multi"
  },
  {
    q:"Os oceanos são importantes porque:",
    op:["Produzem oxigénio","Fornecem alimentos","Ajudam a regular o clima","Não servem para nada"],
    c:["Produzem oxigénio","Fornecem alimentos","Ajudam a regular o clima"],
    t:"multi"
  },
  {
    q:"A poluição dos oceanos prejudica os seres vivos.",
    op:["Verdadeiro","Falso"],
    c:["Verdadeiro"],
    t:"single"
  },
  {
    q:"São tipos de poluição:",
    op:["Poluição do solo","Poluição da água","Poluição do ar","Poluição da amizade"],
    c:["Poluição do solo","Poluição da água","Poluição do ar"],
    t:"multi"
  },
  {
    q:"São exemplos de poluição da água:",
    op:["Derrames de petróleo","Descargas de resíduos","Plantar árvores","Plásticos no mar"],
    c:["Derrames de petróleo","Descargas de resíduos","Plásticos no mar"],
    t:"multi"
  },
  {
    q:"São consequências da poluição:",
    op:["Doenças","Aquecimento global","Desaparecimento de espécies","Ar mais limpo"],
    c:["Doenças","Aquecimento global","Desaparecimento de espécies"],
    t:"multi"
  },
  {
    q:"São medidas para proteger o ambiente:",
    op:["Reciclar","Reduzir plástico","Usar transportes públicos","Atirar lixo ao chão"],
    c:["Reciclar","Reduzir plástico","Usar transportes públicos"],
    t:"multi"
  },
  {
    q:"Quem produz o seu próprio alimento?",
    op:["Planta","Coelho","Raposa","Leopardo"],
    c:["Planta"],
    t:"single"
  },
  {
    q:"O consumidor primário alimenta-se de:",
    op:["Plantas","Carne","Pedras","Plástico"],
    c:["Plantas"],
    t:"single"
  },
  {
    q:"Uma cadeia alimentar mostra:",
    op:["Relações de alimentação entre seres vivos","Os planetas","Os rios","As profissões"],
    c:["Relações de alimentação entre seres vivos"],
    t:"single"
  },
  {
    q:"Seleciona produtores.",
    op:["Carvalho","Erva","Raposa","Coelho"],
    c:["Carvalho","Erva"],
    t:"multi"
  },
  {
    q:"As plantas precisam de:",
    op:["Água","Luz","Solo","Telemóvel"],
    c:["Água","Luz","Solo"],
    t:"multi"
  },
  {
    q:"Seleciona animais vivíparos.",
    op:["Baleia","Cavalo","Galinha","Cobra"],
    c:["Baleia","Cavalo"],
    t:"multi"
  },
  {
    q:"Seleciona animais ovíparos.",
    op:["Tartaruga","Pato","Cão","Gato"],
    c:["Tartaruga","Pato"],
    t:"multi"
  },
  {
    q:"A reprodução permite:",
    op:["A continuação das espécies","A produção de lixo","A poluição","A extinção imediata"],
    c:["A continuação das espécies"],
    t:"single"
  },
  {
    q:"A estaca é usada na reprodução de algumas:",
    op:["Plantas","Rochas","Nuvens","Montanhas"],
    c:["Plantas"],
    t:"single"
  },
  {
    q:"Os oceanos:",
    op:["Cobrem grande parte da Terra","Não têm seres vivos","São de água doce","Não influenciam o clima"],
    c:["Cobrem grande parte da Terra"],
    t:"single"
  },
  {
    q:"Seleciona benefícios dos oceanos.",
    op:["Produzem oxigénio","Fornecem alimentos","Regulam o clima","Produzem plástico"],
    c:["Produzem oxigénio","Fornecem alimentos","Regulam o clima"],
    t:"multi"
  },
  {
    q:"A poluição marinha pode causar:",
    op:["Morte de animais","Água mais limpa","Mais oxigénio","Aumento de lixo"],
    c:["Morte de animais","Aumento de lixo"],
    t:"multi"
  },
  {
    q:"O petróleo derramado no mar provoca:",
    op:["Poluição da água","Reciclagem","Fertilização","Produção de oxigénio"],
    c:["Poluição da água"],
    t:"single"
  },
  {
    q:"São fontes de poluição do ar:",
    op:["Fumo das fábricas","Automóveis","Árvores","Flores"],
    c:["Fumo das fábricas","Automóveis"],
    t:"multi"
  },
  {
    q:"O uso excessivo de pesticidas pode poluir:",
    op:["Solo","Lua","Sol","Estrelas"],
    c:["Solo"],
    t:"single"
  },
  {
    q:"Seleciona consequências ambientais da poluição.",
    op:["Doenças","Aquecimento global","Desaparecimento de espécies","Ar limpo"],
    c:["Doenças","Aquecimento global","Desaparecimento de espécies"],
    t:"multi"
  },
  {
    q:"Reciclar ajuda a:",
    op:["Reduzir resíduos","Produzir mais lixo","Poluir rios","Destruir florestas"],
    c:["Reduzir resíduos"],
    t:"single"
  },
  {
    q:"Seleciona atitudes amigas do ambiente.",
    op:["Plantar árvores","Poupar água","Atirar lixo ao chão","Desperdiçar energia"],
    c:["Plantar árvores","Poupar água"],
    t:"multi"
  },
  {
    q:"Os transportes públicos ajudam a:",
    op:["Reduzir a poluição do ar","Aumentar o lixo","Poluir rios","Destruir oceanos"],
    c:["Reduzir a poluição do ar"],
    t:"single"
  },
  {
    q:"Para proteger os oceanos devemos:",
    op:["Não deitar lixo no mar","Reduzir plástico","Reciclar","Deitar óleo na água"],
    c:["Não deitar lixo no mar","Reduzir plástico","Reciclar"],
    t:"multi"
  }
];