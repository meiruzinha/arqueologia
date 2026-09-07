// v7.4 — conteúdo revisado das 14 optativas.
// O PPP lista somente nome e carga horária dessas disciplinas; portanto, todo o conteúdo abaixo é apoio didático sugerido.
(function () {
  const STUDY = window.ARCHAEOLOGY_STUDY_CONTENT || {};
  const LESSONS = window.ARCHAEOLOGY_LESSON_CONTENT || (window.ARCHAEOLOGY_LESSON_CONTENT = { deep: {} });
  LESSONS.deep = LESSONS.deep || {};

  const packs = {};
  const deep = {};

  function C(term, definition) { return { term, definition }; }
  function T(points, explanation, deepDive, example, remember, mistakes, review) {
    return {
      points,
      lesson: {
        explanation,
        deepDive,
        example,
        remember,
        commonMistakes: mistakes,
        review: review || [],
        studySteps: [],
        reviewAnswers: []
      }
    };
  }
  function add(id, overview, category, tips, concepts, topics) {
    packs[id] = {
      overview,
      category,
      studyTips: tips,
      concepts,
      topicGuides: Object.entries(topics).map(([topic, data]) => ({ topic, points: data.points || [] }))
    };
    deep[id] = Object.fromEntries(Object.entries(topics).map(([topic, data]) => {
      const primary = data.points?.[0]?.term || 'conceito principal';
      const secondary = data.points?.[1]?.term || 'evidência';
      const tertiary = data.points?.[2]?.term || 'contexto';
      const lesson = { ...data.lesson };
      lesson.studySteps = [
        `Em “${topic}”, comece definindo “${primary}” e localize onde esse conceito aparece no problema estudado.`,
        `Depois, relacione “${secondary}” às evidências ou fontes pertinentes a “${topic}”, registrando também o que os dados não permitem afirmar.`,
        `Use “${tertiary}” para contextualizar “${topic}” e diferencie descrição, procedimento de análise e interpretação.`,
        `Feche o estudo de “${topic}” comparando a interpretação principal com uma alternativa e justificando qual é mais bem sustentada.`
      ];
      lesson.review = [
        `Em “${topic}”, o que significa “${primary}” e por que ele é importante para compreender o tema?`,
        `Como “${secondary}” ajuda a analisar “${topic}” sem transformar uma associação em conclusão automática?`,
        `Que evidência, fonte ou procedimento permitiria reconhecer “${tertiary}” ao investigar “${topic}”?`,
        `Usando o exemplo apresentado em “${topic}”, que interpretação você defenderia e qual erro de raciocínio deveria evitar?`
      ];
      lesson.reviewAnswers = [
        lesson.remember?.[0] || lesson.explanation,
        lesson.remember?.[1] || lesson.deepDive,
        lesson.remember?.[2] || lesson.deepDive,
        `${lesson.example} O erro que deve ser evitado é: ${lesson.commonMistakes?.[0] || 'concluir além do que as evidências permitem.'}`
      ];
      return [topic, lesson];
    }));
  }

  add(
    'opt-1-arte-egipcia',
    'Preparação para estudar a produção visual e arquitetônica do Egito antigo em relação a cronologia, religião, poder, técnica, materialidade e contexto arqueológico. Como o PPP apenas lista a optativa, este roteiro deve ser ajustado ao plano de ensino quando a disciplina for ofertada.',
    'material',
    [
      'Monte uma linha do tempo simples antes de comparar estilos ou monumentos.',
      'Descreva suporte, técnica, escala, localização e associação antes de propor significado.',
      'Evite ler imagens egípcias apenas com critérios estéticos modernos; considere função, convenção e contexto de uso.'
    ],
    [
      C('iconografia', 'Estudo de imagens, atributos e combinações visuais em relação a convenções e contextos culturais.'),
      C('programa decorativo', 'Organização planejada de imagens e inscrições em um espaço arquitetônico.'),
      C('cânone de representação', 'Conjunto de convenções que orienta proporções, poses e modos de representar figuras em determinados períodos.'),
      C('contexto funerário', 'Relações materiais e espaciais associadas a sepultamento, memória e culto aos mortos.'),
      C('proveniência', 'Informação documentada sobre a origem arqueológica e a trajetória de um objeto.')
    ],
    {
      'Periodização do Egito antigo': T(
        [C('periodização', 'Divisão analítica do tempo em fases; ajuda a organizar mudanças, mas não descreve toda a diversidade de modo absoluto.')],
        'A história do Egito antigo costuma ser organizada em grandes fases, como períodos pré-dinásticos, reinos e fases intermediárias. Essa divisão ajuda a localizar objetos, edifícios e estilos no tempo, mas não deve ser tratada como uma sequência rígida em que toda mudança acontece ao mesmo tempo em todo o território.',
        'Ao estudar arte egípcia, cronologia deve dialogar com proveniência, inscrições, técnica, estilo e contexto arqueológico. Uma imagem tardia pode retomar formas antigas de maneira consciente; por isso, estilo sozinho não é um relógio. Também é importante distinguir data de produção, período de uso e possíveis reutilizações.',
        'Compare duas estátuas de períodos diferentes registrando postura, material, inscrições, escala e local de achado. Depois avalie quais diferenças parecem cronológicas e quais podem decorrer da função ou do contexto.',
        ['Periodização é uma ferramenta de organização, não uma descrição perfeita da realidade.', 'Cronologia deve ser cruzada com contexto, técnica e inscrições.', 'Reuso e retomadas estilísticas podem confundir uma datação feita apenas pela aparência.'],
        ['Tratar cada período como bloco homogêneo.', 'Datar peça apenas pela aparência.', 'Ignorar reutilização de monumentos e objetos.']
      ),
      'Arquitetura, escultura, pintura e iconografia': T(
        [C('iconografia', 'Análise de temas, atributos, gestos e combinações visuais em relação ao contexto cultural.'), C('suporte', 'Material ou superfície em que uma imagem ou inscrição é realizada.')],
        'Arquitetura, escultura e pintura participavam de espaços sociais específicos, como templos, tumbas, palácios e assentamentos. O estudo arqueológico não separa automaticamente “arte” de arquitetura, escrita e ritual, porque imagens podiam organizar circulação, afirmar hierarquias e participar de ações religiosas ou memoriais.',
        'A análise iconográfica começa pela descrição: personagens, atributos, direção do olhar, gestos, escala relativa, inscrições, cores preservadas e relações entre cenas. Em seguida, compara-se repertório e contexto. A hierarquia de escala, por exemplo, pode comunicar importância social ou simbólica, e não tentativa de perspectiva naturalista.',
        'Em uma parede de tumba, registre primeiro a posição da cena, sua relação com a entrada e com outras imagens. Só depois interprete atividades, atributos e possíveis vínculos com práticas funerárias.',
        ['Forma visual e espaço arqueológico devem ser analisados juntos.', 'Descrição vem antes de interpretação iconográfica.', 'Conservação e fragmentação afetam aquilo que ainda podemos observar.'],
        ['Projetar critérios estéticos modernos como medida de qualidade.', 'Ignorar inscrições e posição da imagem.', 'Tratar a aparência atual como idêntica à original.']
      ),
      'Função religiosa e política da arte': T(
        [C('culto', 'Conjunto de práticas rituais e relações com divindades ou mortos.'), C('legitimação', 'Processos pelos quais autoridade e ordem social são apresentadas como válidas ou desejáveis.')],
        'Muitas produções visuais egípcias estavam inseridas em práticas religiosas e políticas ao mesmo tempo. Estátuas, relevos, inscrições e edifícios podiam participar de cultos, festivais, rituais funerários e afirmações de poder. Isso não significa que toda imagem seja simples “propaganda”.',
        'Função deve ser inferida a partir de localização, associação, inscrições, padrões de acesso, sinais de uso e trajetória do objeto. Um monumento em área pública e uma estatueta votiva em espaço restrito podem mobilizar repertórios semelhantes, mas operar de maneiras sociais muito diferentes.',
        'Compare um relevo de templo inserido em percurso ritual com uma pequena estatueta votiva. Pergunte quem interagia com cada peça, em que espaço e por meio de quais ações.',
        ['Função não se deduz apenas pelo tema representado.', 'Religião, poder e memória frequentemente se cruzam.', 'Acesso, localização e uso ajudam a compreender a atuação social das imagens.'],
        ['Chamar toda imagem de propaganda.', 'Separar religião e política de forma rígida.', 'Ignorar quem podia ou não acessar determinado espaço.']
      ),
      'Contexto arqueológico dos objetos': T(
        [C('proveniência', 'Origem documentada de um objeto e informações sobre onde e como ele foi recuperado.'), C('associação', 'Relação espacial e contextual entre objetos, estruturas, depósitos e outros vestígios.')],
        'Um objeto egípcio em vitrine pode parecer autossuficiente, mas sua interpretação muda radicalmente quando conhecemos local de achado, camada, associações e história de coleta. Sem proveniência, muitas perguntas sobre data, função e relações sociais se tornam mais frágeis.',
        'Além do contexto de deposição, é útil reconstruir a biografia do objeto: produção, uso, reparo, deposição, escavação, conservação e circulação em coleções. Restaurações antigas, saques e deslocamentos podem alterar o que vemos hoje e precisam ser registrados.',
        'Compare dois amuletos semelhantes: um recuperado em sepultamento documentado e outro sem procedência conhecida. O primeiro permite relacionar posição, indivíduo e conjunto funerário; o segundo sustenta comparações formais, mas oferece menos segurança contextual.',
        ['Proveniência é parte da informação científica.', 'Contexto inclui deposição e trajetória posterior.', 'Lacunas documentais precisam ser explicitadas.'],
        ['Tratar museu como contexto original.', 'Esconder incerteza de proveniência.', 'Confundir semelhança formal com mesma função.']
      ),
      'Métodos de análise visual e material': T(
        [C('análise visual', 'Descrição sistemática de forma, composição e atributos visuais.'), C('análise material', 'Investigação de matérias-primas, técnicas, alterações e propriedades físicas de um objeto.')],
        'A análise visual registra forma, composição e relações iconográficas; a análise material pergunta de que a peça é feita, como foi produzida e que transformações sofreu. Pigmentos, tipos de pedra, marcas de ferramenta e reparos podem revelar decisões técnicas que não aparecem numa leitura apenas visual.',
        'O método deve responder a uma pergunta. Fotografia controlada, microscopia, exames não destrutivos e análises químicas podem ser úteis, mas não substituem documentação básica nem justificam coleta invasiva sem necessidade. Resultado instrumental também precisa de contexto para ganhar significado arqueológico.',
        'Ao estudar uma estela pintada, combine fotografia controlada, descrição de pigmentos visíveis, marcas de preparação e leitura iconográfica. Se houver análise instrumental, use-a para responder uma pergunta definida, como técnica de pintura ou intervenção posterior.',
        ['Método deve responder a uma pergunta explícita.', 'Análise visual e material se complementam.', 'Resultado laboratorial precisa de contexto para ser interpretado.'],
        ['Usar tecnologia sem problema de pesquisa.', 'Tomar composição química como identidade cultural automática.', 'Omitir limites de amostragem e conservação.']
      )
    }
  );

  add(
    'opt-2-a-cidade-e-o-estado-grego',
    'Preparação para compreender a pólis grega como forma histórica diversa, articulando urbanismo, instituições, cidadania, práticas sociais e cultura material. O título é oficial da matriz; o detalhamento é um roteiro de apoio, pois o PPP não fornece ementa para a optativa.',
    'regional',
    [
      'Compare pólis diferentes em vez de usar Atenas como modelo universal.',
      'Relacione textos antigos com evidências arqueológicas sem tratar uma fonte como superior à outra.',
      'Use mapas e plantas urbanas para observar circulação, centralidade, áreas sagradas e espaços domésticos.'
    ],
    [
      C('pólis', 'Comunidade política e territorial do mundo grego antigo, com instituições, espaços e formas de pertencimento variáveis.'),
      C('ágora', 'Espaço urbano associado a circulação, comércio, encontro e atividades cívicas, com usos distintos conforme época e cidade.'),
      C('cidadania', 'Condição política definida localmente, com direitos e deveres restritos a determinados grupos.'),
      C('urbanismo', 'Organização material do assentamento, incluindo vias, áreas públicas, santuários, infraestrutura e habitação.'),
      C('cultura material urbana', 'Objetos, estruturas e resíduos que documentam práticas cotidianas, econômicas, religiosas e políticas na cidade.')
    ],
    {
      'Formação da pólis': T(
        [C('pólis', 'Comunidade política e territorial historicamente variável.')],
        'A formação da pólis não deve ser reduzida ao aparecimento repentino de uma “cidade-Estado” pronta. Diferentes regiões do mundo grego passaram por mudanças demográficas, redes de troca, cultos, organização territorial e formas de autoridade em ritmos próprios.',
        'Arqueologicamente, o processo pode ser discutido por mudanças em assentamentos, cemitérios, santuários, muralhas, espaços de reunião e distribuição de bens. Textos posteriores ajudam, mas não devem ser projetados automaticamente sobre períodos mais antigos.',
        'Compare a concentração de cultos e áreas comuns em dois assentamentos arcaicos. Em vez de procurar uma única data de “fundação da pólis”, avalie quais sinais indicam integração política e territorial.',
        ['Pólis é processo histórico, não modelo único.', 'Instituições e espaços se transformam em ritmos diferentes.', 'Evidência arqueológica e texto antigo precisam de crítica própria antes de serem cruzados.'],
        ['Tratar pólis como sinônimo simples de cidade.', 'Buscar uma origem única para todas as regiões.', 'Usar textos clássicos para explicar automaticamente o período arcaico.']
      ),
      'Urbanismo e espaços públicos': T(
        [C('ágora', 'Espaço de usos cívicos, econômicos e sociais.'), C('urbanismo', 'Organização física e funcional do assentamento.')],
        'O urbanismo grego pode incluir ruas, praças, santuários, edifícios cívicos, áreas de comércio, fortificações e habitações. Esses elementos não aparecem de maneira idêntica em todas as pólis; forma urbana resulta de história local, topografia e decisões políticas.',
        'Espaços chamados de públicos também tinham regras de acesso. Uma ágora podia reunir funções comerciais, administrativas, religiosas e performáticas. Plantas e fases construtivas precisam ser lidas junto a depósitos, inscrições e objetos para evitar atribuir função apenas pela forma arquitetônica.',
        'Em uma planta urbana, marque acessos, santuários, edifícios cívicos e áreas residenciais. Depois pergunte como cidadãos, mulheres, estrangeiros e pessoas escravizadas poderiam experimentar esses espaços de modos diferentes.',
        ['Forma urbana registra escolhas políticas e sociais.', 'Espaço público não significa acesso igual para todos.', 'Função arquitetônica deve ser sustentada por contexto e fases de uso.'],
        ['Atribuir função só pela planta.', 'Imaginar cidade grega padronizada.', 'Ignorar remodelações e reutilizações.']
      ),
      'Instituições e cidadania': T(
        [C('cidadania', 'Pertencimento político com critérios locais e excludentes.'), C('instituições cívicas', 'Órgãos e práticas que organizam decisões e administração comunitária.')],
        'Cidadania no mundo grego era uma condição histórica restrita e variável. Não correspondia à cidadania contemporânea nem incluía toda a população residente. Critérios de nascimento, sexo, status e pertencimento local podiam definir quem participava formalmente da vida política.',
        'A arqueologia contribui observando espaços de reunião, inscrições, moedas, monumentos e práticas cívicas. Esses dados não “provam democracia” sozinhos; ajudam a reconstruir como instituições eram materializadas e a distinguir regime formal de prática social.',
        'Use uma inscrição de decreto junto da localização do monumento e do espaço de exposição. Pergunte quem podia lê-la, que autoridade ela invocava e como tornava uma decisão pública.',
        ['Cidadania antiga era seletiva.', 'Instituições deixam marcas materiais, mas exigem interpretação contextual.', 'Regime formal e participação social não são a mesma coisa.'],
        ['Projetar cidadania moderna no passado.', 'Confundir democracia ateniense com experiência grega inteira.', 'Ignorar habitantes sem cidadania formal.']
      ),
      'Cultura material da vida urbana': T(
        [C('cultura material urbana', 'Vestígios ligados a habitação, alimentação, trabalho, circulação e descarte na cidade.')],
        'A vida urbana não é conhecida apenas por templos e edifícios monumentais. Casas, oficinas, poços, lixeiras, utensílios, cerâmicas de cozinha, pesos, moedas e restos de alimentos permitem estudar rotinas, trabalho e desigualdades.',
        'O valor interpretativo depende do processo de deposição. Um conjunto em piso de uso, um depósito de abandono e uma lixeira representam histórias diferentes. Distribuições dentro de casas também precisam de cautela, porque atividades mudam e objetos circulam antes do descarte.',
        'Compare uma casa com oficina anexa a outra residência sem evidência de produção. Use ferramentas, resíduos e distribuição espacial para discutir trabalho doméstico e especialização sem pressupor identidades dos moradores.',
        ['Cotidiano urbano aparece em vestígios modestos.', 'Contexto de deposição é indispensável.', 'Arquitetura doméstica e objetos devem ser analisados em conjunto.'],
        ['Valorizar apenas monumentos.', 'Ler uma casa como fotografia congelada.', 'Inferir gênero ou status apenas pelo tipo de objeto.']
      ),
      'Variação regional e cronológica': T(
        [C('variação regional', 'Diferenças históricas entre comunidades e áreas do mundo grego.'), C('cronologia', 'Ordenação temporal necessária para comparar mudanças e permanências.')],
        '“Mundo grego” reúne regiões, ilhas, colônias e comunidades com trajetórias próprias. Urbanismo, cerâmica, instituições e relações com populações vizinhas variam no espaço e no tempo. Comparações só são sólidas quando controlam cronologia.',
        'Mobilidade e colonização produziram situações híbridas. A presença de estilos gregos fora do Egeu não significa automaticamente migração em massa nem identidade única; produção local, consumo, redes de troca e contexto político precisam ser avaliados.',
        'Compare um assentamento do Egeu e uma fundação grega no sul da Itália na mesma faixa cronológica. Observe planejamento, materiais locais/importados e relações com territórios vizinhos.',
        ['A diversidade interna é central.', 'Comparação exige controle de tempo e escala.', 'Objeto de estilo grego não equivale automaticamente a identidade étnica.'],
        ['Usar Atenas como padrão universal.', 'Confundir estilo material com povo.', 'Comparar períodos diferentes como se fossem contemporâneos.']
      )
    }
  );

  add(
    'opt-3-desenho-de-pecas-arqueologicas',
    'Preparação técnica para registrar peças arqueológicas por desenho mensurável, legível e padronizado. O objetivo não é produzir ilustração artística, mas uma representação que preserve informação analítica e possa ser conferida por outras pessoas.',
    'method',
    [
      'Pratique com peças simples antes de objetos muito fragmentados.',
      'Sempre registre escala, orientação, identificação e convenções usadas.',
      'Compare desenho, fotografia e modelo digital: cada recurso evidencia informações diferentes.'
    ],
    [
      C('escala gráfica', 'Relação visual entre medida representada e medida real, mantida mesmo quando a imagem é redimensionada.'),
      C('perfil', 'Representação de seção ou contorno que evidencia espessura e forma.'),
      C('hachura', 'Convenção gráfica usada para indicar superfícies, cortes ou características específicas conforme protocolo adotado.'),
      C('orientação', 'Posicionamento padronizado da peça para facilitar comparação entre desenhos.'),
      C('vetorização', 'Produção ou conversão de desenho em elementos gráficos editáveis, preservando proporções e linhas técnicas.')
    ],
    {
      'Convenções de desenho arqueológico': T(
        [C('escala gráfica', 'Referência que permite recuperar dimensões do objeto.'), C('perfil', 'Vista técnica útil para forma e espessura.')],
        'O desenho arqueológico seleciona informações relevantes para análise: contorno, fraturas, superfícies, decoração, seção, negativos de lascamento ou outras feições. Convenções tornam o registro comparável, mas variam conforme material, laboratório e publicação. Por isso, o protocolo adotado deve ser conhecido e explicitado.',
        'Uma boa representação distingue observação de reconstrução. Partes ausentes não devem parecer preservadas, e linhas hipotéticas precisam ser sinalizadas. Número de inventário, escala e orientação acompanham o desenho para que ele não se torne uma imagem solta sem proveniência.',
        'Desenhe um fragmento cerâmico com borda preservada. Use uma convenção para o contorno observado e outra para reconstruir o diâmetro provável, indicando claramente o que é inferido.',
        ['Convenção gráfica precisa ser explícita.', 'Reconstrução não pode ser confundida com parte preservada.', 'Desenho técnico mantém vínculo com identificação e escala.'],
        ['Transformar desenho técnico em ilustração livre.', 'Omitir escala.', 'Esconder quais partes foram reconstruídas.']
      ),
      'Escala, orientação e vistas': T(
        [C('escala gráfica', 'Relação de medida incorporada ao desenho.'), C('vista', 'Representação do objeto a partir de uma direção definida.')],
        'Escala, orientação e escolha de vistas determinam se um desenho poderá ser comparado e medido. Objetos tridimensionais exigem decisões: qual face é principal, quando incluir perfil, seção, vista superior ou inferior e como alinhar elementos.',
        'Escala numérica pode ser útil, mas a escala gráfica é mais segura em arquivos que podem ser redimensionados. Uma indicação “1:1” perde sentido se a figura for reduzida; uma barra gráfica acompanha o redimensionamento. Medidas essenciais também devem ser registradas nos dados da peça.',
        'Fotografe e desenhe uma ponta lítica. Compare o que cada vista revela sobre espessura, simetria e retoques e escolha o conjunto mínimo capaz de representar a forma.',
        ['Vista deve responder a uma necessidade de documentação.', 'Escala gráfica acompanha redimensionamentos.', 'Orientação consistente facilita comparação.'],
        ['Excesso de vistas sem função.', 'Misturar orientações entre peças comparáveis.', 'Confiar apenas em escala numérica após edição gráfica.']
      ),
      'Cerâmica, lítico e outros materiais': T(
        [C('atributo diagnóstico', 'Característica selecionada porque ajuda a descrever, classificar ou comparar uma peça.'), C('seção', 'Corte representado para mostrar espessura e geometria interna.')],
        'Materiais diferentes exigem ênfases distintas. Em cerâmica, borda, base, espessura, tratamento de superfície e decoração podem ser prioritários. Em lítico, negativos de retirada, córtex, plataforma, retoques e seção ajudam a reconstruir tecnologia. Metal, osso e vidro pedem convenções adequadas a suas feições e conservação.',
        'O desenho não precisa copiar cada irregularidade, mas também não deve apagar dano relevante. A seleção depende da pergunta: publicação tipológica, inventário, estudo tecnológico ou conservação podem exigir produtos diferentes.',
        'Compare o desenho de uma borda cerâmica com o de uma lasca. Na cerâmica, perfil e curvatura ajudam a estimar forma; na lasca, face dorsal/ventral e negativos são fundamentais.',
        ['Material orienta os atributos a evidenciar.', 'Seleção gráfica deve ser coerente com a pergunta.', 'Danos podem precisar de registro próprio.'],
        ['Usar o mesmo padrão para todos os materiais.', 'Apagar fraturas porque “atrapalham” o desenho.', 'Representar detalhe sem indicar sua posição.']
      ),
      'Instrumentos de medição': T(
        [C('paquímetro', 'Instrumento para medir dimensões externas, internas e profundidades dentro da precisão do equipamento.')],
        'Medição sustenta o desenho técnico. Régua, paquímetro, compasso, esquadro e outros instrumentos ajudam a transferir dimensões e proporções, mas cada um possui resolução e limites. A escolha deve considerar tamanho, fragilidade e superfície da peça.',
        'Precisão não é o mesmo que excesso de casas decimais. Registre medidas compatíveis com o instrumento e com a pergunta. Em peças assimétricas, anotar onde a medida foi tomada é tão importante quanto o número obtido.',
        'Meça a espessura de um fragmento cerâmico em diferentes pontos. Se a variação for grande, não registre uma única medida sem indicar onde foi tomada.',
        ['Instrumento deve ser adequado à peça.', 'Local de medição precisa ser reproduzível.', 'Conservação vem antes da conveniência do desenho.'],
        ['Forçar instrumento em peça frágil.', 'Anotar números sem unidade.', 'Aparentar precisão maior que a capacidade do equipamento.']
      ),
      'Digitalização e finalização gráfica': T(
        [C('vetorização', 'Construção de linhas e formas escaláveis em ambiente digital.'), C('resolução', 'Quantidade de detalhe de uma imagem raster, relevante para digitalização e publicação.')],
        'A finalização digital organiza o desenho para análise, arquivo e publicação. Vetores permitem linhas escaláveis e ajustes controlados; imagens rasterizadas são úteis para digitalizar traços e texturas, mas dependem de resolução. A passagem para o digital não deve inventar feições nem apagar informação relevante.',
        'Um fluxo seguro mantém arquivo original, versão editável e exportações finais. Metadados, escala, número da peça e autoria precisam permanecer vinculados. Também é importante testar impressão, pois linhas muito finas podem desaparecer no tamanho final.',
        'Digitalize um desenho a lápis, alinhe-o pela escala conhecida, vetorize contornos e imprima a versão final para conferir legibilidade e proporção.',
        ['Digitalização não autoriza alterar o dado observado.', 'Arquivo editável e exportação final devem ser preservados separadamente.', 'Escala e identificação precisam sobreviver à diagramação.'],
        ['Redimensionar sem controlar escala.', 'Apagar irregularidades reais.', 'Guardar apenas a imagem final sem arquivo editável.']
      )
    }
  );

  add(
    'opt-4-roma-e-sua-historicidade',
    'Preparação para estudar Roma como processo histórico amplo e diverso, articulando cronologia, instituições, urbanismo, cotidiano, materialidade e experiências provinciais. O roteiro evita tratar “Roma” como uma cultura única e imutável.',
    'regional',
    [
      'Construa uma linha do tempo, mas associe cada fase a evidências concretas.',
      'Compare Roma, Itália e províncias sem usar a capital como padrão absoluto.',
      'Cruze textos, inscrições, arquitetura, cerâmica, moedas e restos cotidianos com crítica de fonte.'
    ],
    [
      C('romanização', 'Conceito historiográfico debatido; deve ser usado criticamente para evitar imaginar imposição cultural uniforme.'),
      C('província', 'Unidade político-administrativa do domínio romano, com trajetórias e relações locais diversas.'),
      C('epigrafia', 'Estudo de inscrições, importante para nomes, cargos, dedicatórias e práticas públicas.'),
      C('infraestrutura', 'Obras de circulação, água, abastecimento e comunicação que estruturavam territórios e cidades.'),
      C('cultura material cotidiana', 'Objetos e resíduos ligados a alimentação, produção, habitação, consumo e descarte.')
    ],
    {
      'Cronologia romana': T(
        [C('cronologia', 'Organização temporal usada para situar mudanças políticas, sociais e materiais.')],
        'A cronologia romana costuma ser organizada em monarquia, república, principado e fases posteriores do império, mas essas categorias políticas não explicam sozinhas a experiência arqueológica. Cerâmica, urbanismo, comércio e práticas funerárias podem mudar em ritmos diferentes.',
        'Datação combina moedas, inscrições, tipologias cerâmicas, técnicas construtivas, estratigrafia e métodos absolutos quando disponíveis. Uma moeda oferece limite cronológico, mas pode circular por décadas; estilo arquitetônico também pode ser retomado. A convergência de evidências é mais segura que um único marcador.',
        'Em uma camada com moeda do século II e cerâmica que circula até o século III, não date o depósito apenas pela moeda. Considere vida útil, intrusões e estratigrafia.',
        ['Períodos políticos são referência, não relógio para toda cultura material.', 'Datação robusta cruza diferentes indicadores.', 'Objetos podem permanecer em uso muito depois de produzidos.'],
        ['Datar camada por um único achado.', 'Supor mudanças simultâneas em todo o império.', 'Confundir data de produção com deposição.']
      ),
      'República e Império': T(
        [C('república', 'Fase e sistema político anteriores ao principado, com instituições e conflitos próprios.'), C('principado', 'Forma imperial iniciada com Augusto, preservando linguagem republicana ao mesmo tempo em que concentrava poder.')],
        'A passagem da república ao império envolve guerras civis, expansão territorial, reconfiguração de elites e novas formas de representar autoridade. Essas transformações aparecem em monumentos, moedas, programas urbanos, assentamentos militares e circulação de bens.',
        '“Império” não significa ruptura instantânea. Instituições e práticas republicanas continuaram e foram reinterpretadas. Programas visuais de Augusto, por exemplo, precisam ser confrontados com experiências locais e materiais do cotidiano.',
        'Compare uma moeda republicana e uma emissão de Augusto observando retrato, legenda e símbolos. Depois relacione essas escolhas ao público e à circulação do objeto.',
        ['Mudança política não apaga continuidades.', 'Representação imperial deve ser analisada como prática material.', 'Expansão e governo foram experimentados de maneira desigual.'],
        ['Reduzir história romana à sucessão de imperadores.', 'Usar propaganda como descrição literal da sociedade.', 'Ignorar conflitos internos e provinciais.']
      ),
      'Urbanismo e infraestrutura': T(
        [C('infraestrutura', 'Sistemas materiais de circulação, água, saneamento e abastecimento.'), C('urbanismo romano', 'Organização de cidades em contextos romanos, variável conforme topografia e história local.')],
        'Cidades do mundo romano podiam incluir fóruns, templos, termas, teatros, vias, redes de água, mercados e áreas residenciais. Porém, não existe uma planta romana universal; muitas cidades reaproveitaram assentamentos anteriores ou adaptaram modelos a condições locais.',
        'Infraestrutura permite estudar administração, investimento, manutenção e desigualdade. Um aqueduto depende de captação, distribuição e reparos; vias conectam mercados e territórios, mas também podem apoiar controle militar e fiscal.',
        'Em uma cidade provincial, mapeie fontes de água, termas e bairros. Pergunte quais áreas recebiam infraestrutura primeiro e quem financiava manutenção.',
        ['Urbanismo romano é diverso.', 'Infraestrutura tem dimensão social e política.', 'Construção, manutenção e acesso fazem parte da análise.'],
        ['Aplicar planta ideal a qualquer cidade.', 'Ignorar manutenção.', 'Tratar monumentalidade como benefício igual para todos.']
      ),
      'Vida cotidiana e cultura material': T(
        [C('cultura material cotidiana', 'Vestígios associados a habitar, produzir, comer, vestir, circular e descartar.')],
        'Cerâmicas, ânforas, lâmpadas, instrumentos, adornos, grafites, restos de alimentos e arquitetura doméstica ajudam a estudar consumo, trabalho, mobilidade e diferenças sociais. Esses vestígios ampliam a história para além da elite política.',
        'Distribuições e resíduos são especialmente importantes. Uma oficina pode ser reconhecida por ferramentas, matérias-primas e rejeitos; uma cozinha por conjuntos funcionais e resíduos de uso. Em cidades densas, descarte e limpeza também deslocam materiais.',
        'Compare conjuntos de duas casas sem assumir que tamanho arquitetônico equivale diretamente a riqueza. Observe reformas, áreas produtivas, armazenamento e padrões de descarte.',
        ['Cotidiano amplia a história para além das elites.', 'Conjunto e contexto são mais informativos que peça isolada.', 'Identidade social exige múltiplas linhas de evidência.'],
        ['Inferir status por um artefato.', 'Tratar casa como unidade estática.', 'Ignorar pessoas escravizadas e trabalhadores.']
      ),
      'Províncias, fronteiras e diversidade': T(
        [C('província', 'Território administrado sob domínio romano, sem apagar sociedades e tradições locais.'), C('fronteira', 'Zona dinâmica de contato, controle, circulação e negociação.')],
        'O império conectou territórios extensos, mas não produziu uniformidade cultural. Províncias combinaram instituições imperiais, práticas locais, mobilidade militar, comércio e novas identidades. O antigo conceito de “romanização” só é útil quando usado de modo crítico.',
        'Materiais de estilo romano em contexto local podem resultar de comércio, imitação, consumo seletivo ou deslocamento de pessoas. Fronteiras também não são apenas linhas militares; incluem assentamentos civis, vias e redes econômicas.',
        'Em um assentamento próximo a um forte, compare cerâmica local/importada, dieta e arquitetura. Em vez de perguntar se os moradores “viraram romanos”, investigue práticas específicas e redes de interação.',
        ['Império não significa homogeneidade.', 'Fronteiras são espaços de interação.', 'Identidades não podem ser lidas diretamente do estilo dos objetos.'],
        ['Imaginar difusão unilateral.', 'Chamar todo objeto romano de prova de colonização.', 'Ignorar agência e continuidade local.']
      )
    }
  );

  add(
    'opt-5-arqueologia-industrial',
    'Preparação para estudar vestígios da industrialização — fábricas, oficinas, sistemas de energia, transporte, moradia operária e paisagens produtivas — relacionando tecnologia, trabalho, memória e patrimônio.',
    'historical',
    [
      'Documente processos produtivos, não apenas edifícios isolados.',
      'Cruze plantas, fotografias, documentos empresariais, oralidade e cultura material.',
      'Trate memória do trabalho e conservação como questões sociais, não somente arquitetônicas.'
    ],
    [
      C('paisagem industrial', 'Conjunto de edifícios, infraestrutura, áreas de extração, transporte, moradia e relações espaciais produzidas pela atividade industrial.'),
      C('cadeia produtiva', 'Sequência de obtenção, transformação, transporte e distribuição de matérias-primas e produtos.'),
      C('patrimônio industrial', 'Bens e lugares associados à produção industrial e suas dimensões tecnológicas, sociais e memoriais.'),
      C('arqueologia do trabalho', 'Abordagem que investiga práticas, relações e experiências de trabalho por evidências materiais e documentais.'),
      C('reuso adaptativo', 'Nova utilização de estrutura histórica buscando compatibilizar uso contemporâneo e preservação de valores patrimoniais.')
    ],
    {
      'Industrialização e paisagens produtivas': T(
        [C('paisagem industrial', 'Sistema espacial formado por produção, energia, transporte e habitação.')],
        'A arqueologia industrial observa a industrialização como transformação de paisagens e relações sociais. Fábrica, mina, ferrovia, porto, vila operária e fonte de energia podem formar um sistema integrado. Analisar apenas a fachada da fábrica perde conexões entre produção, circulação e vida dos trabalhadores.',
        'Levantamento espacial, cartografia histórica, fotografias, documentos e prospecção ajudam a reconstruir fases da paisagem. Mudanças tecnológicas podem abandonar estruturas antigas ou reaproveitá-las; por isso é importante distinguir instalação, expansão, reforma e desativação.',
        'Mapeie uma antiga usina e seus canais, oficinas, depósitos, linha férrea e moradias. Pergunte como a distribuição espacial organizava fluxos de materiais e pessoas.',
        ['Paisagem industrial é sistema, não coleção de prédios.', 'Cronologia de reformas é essencial.', 'Produção e vida social ocupam o mesmo território.'],
        ['Focar apenas em arquitetura monumental.', 'Ignorar áreas de descarte.', 'Tratar abandono como fase sem informação.']
      ),
      'Fábricas, maquinário e infraestrutura': T(
        [C('cadeia produtiva', 'Encadeamento entre matéria-prima, máquinas, energia, produto e transporte.')],
        'Máquinas e edifícios industriais devem ser lidos em relação ao processo produtivo. Bases de equipamentos, eixos, caldeiras, dutos, trilhos, pisos reforçados e marcas de fixação podem indicar funções mesmo quando o maquinário desapareceu.',
        'Documentação técnica e catálogos ajudam, mas equipamentos podem ter sido modificados localmente. Medidas, fotografias, croquis e marcas de uso permitem testar a correspondência entre planta ideal e prática. Segurança é central em ruínas industriais.',
        'Em um galpão vazio, use fundações de máquinas, canaletas e portas para propor a sequência de produção; depois confronte com plantas históricas e resíduos.',
        ['Infraestrutura registra processo produtivo.', 'Ausência de máquina não significa ausência de informação.', 'Levantamento industrial requer atenção a riscos.'],
        ['Nomear máquina sem evidência suficiente.', 'Ignorar adaptações locais.', 'Entrar em estruturas inseguras sem avaliação.']
      ),
      'Trabalho e comunidades operárias': T(
        [C('arqueologia do trabalho', 'Estudo material das relações, rotinas e experiências de trabalhadores.'), C('vila operária', 'Conjunto residencial ligado a empreendimento produtivo, com relações variáveis de controle, serviço e comunidade.')],
        'A arqueologia industrial também investiga trabalhadores e famílias. Moradias, refeitórios, objetos pessoais, áreas de lazer, escolas, cercamentos e trajetos cotidianos ajudam a discutir disciplina, desigualdade, solidariedade e estratégias domésticas.',
        'Fontes empresariais podem enfatizar eficiência; memória oral pode revelar conflitos ausentes dos registros oficiais. Diferentes cargos, gênero, origem e raça podem produzir experiências distintas, por isso comunidades operárias não devem ser tratadas como homogêneas.',
        'Compare regulamento de uma vila operária com modificações feitas nas casas pelos moradores. As alterações podem indicar apropriação, necessidade e negociação do espaço.',
        ['Trabalho inclui experiência social além do chão de fábrica.', 'Documentos empresariais têm perspectiva própria.', 'Diferenças internas entre trabalhadores precisam ser consideradas.'],
        ['Romantizar comunidade.', 'Tratar operários como grupo homogêneo.', 'Usar memória oral sem contextualização.']
      ),
      'Documentação e levantamento de patrimônio industrial': T(
        [C('inventário', 'Registro sistemático de bens, características, localização, estado e valores associados.'), C('levantamento', 'Documentação métrica, fotográfica, histórica e descritiva de um lugar ou estrutura.')],
        'Documentar patrimônio industrial exige registrar escala do conjunto e detalhes técnicos. Plantas, fachadas, seções, fotografias, modelos 3D, fichas e mapas devem manter identificação e localização. O inventário também registra estado de conservação e intervenções.',
        'A documentação precisa ser orientada por objetivo. Um inventário para pesquisa pode enfatizar cronologia e processo; um diagnóstico de conservação precisa localizar patologias e riscos. Registro detalhado reduz perda de informação, mas não substitui preservação quando esta é possível e justificada.',
        'Crie ficha para uma chaminé industrial registrando dimensões, material, técnica, patologias, relação com caldeira e fotografias orientadas; depois vincule ao mapa do complexo.',
        ['Inventário combina descrição e localização.', 'Escalas geral e detalhada se complementam.', 'Registro não é desculpa automática para destruir.'],
        ['Fotografar sem escala ou legenda.', 'Documentar peças sem relação espacial.', 'Confundir inventário com avaliação final de valor.']
      ),
      'Conservação e reuso': T(
        [C('reuso adaptativo', 'Adaptação de bem histórico a nova função preservando valores relevantes.'), C('significância cultural', 'Conjunto de valores históricos, sociais, técnicos, estéticos ou memoriais atribuídos a um bem.')],
        'Conservar patrimônio industrial envolve escolhas. Nem toda estrutura pode ser mantida intacta, e usos novos podem ser necessários para viabilidade. Antes de intervir, deve-se identificar quais elementos expressam história tecnológica, social e espacial do complexo.',
        'Reuso adaptativo exige compatibilizar acessibilidade, segurança e função contemporânea com legibilidade das fases históricas. Remover toda pátina ou substituir materiais sem documentação pode apagar evidências. Comunidades ligadas ao local podem reconhecer valores que uma avaliação puramente arquitetônica não percebe.',
        'Ao transformar fábrica em centro cultural, mantenha e interprete parte das estruturas produtivas, documente intervenções novas e consulte ex-trabalhadores sobre espaços significativos.',
        ['Conservação começa pelo reconhecimento de valores.', 'Reuso deve permitir ler a história do lugar.', 'Memória social também orienta prioridades.'],
        ['“Higienizar” retirando marcas históricas.', 'Preservar apenas a fachada.', 'Excluir comunidades da decisão.']
      )
    }
  );

  add(
    'opt-6-arqueologia-e-arquitetura',
    'Preparação para analisar edifícios como documentos estratificados: materiais, técnicas, reformas, cicatrizes, usos e relações espaciais permitem reconstruir histórias construtivas que nem sempre aparecem em plantas ou textos.',
    'historical',
    [
      'Leia paredes e encontros construtivos antes de tentar reconstruir mentalmente o edifício.',
      'Registre unidades e relações de anterioridade/posterioridade.',
      'Cruze levantamento arquitetônico com arquivo, materiais e evidências de uso.'
    ],
    [
      C('arqueologia da arquitetura', 'Análise arqueológica de edifícios e espaços construídos, considerando fases, técnicas e usos.'),
      C('estratigrafia de paredes', 'Leitura das relações entre unidades construtivas para estabelecer sequência relativa.'),
      C('unidade estratigráfica murária', 'Trecho construtivo individualizado por material, técnica, limite e relação com outras unidades.'),
      C('levantamento arquitetônico', 'Registro métrico e gráfico de plantas, cortes, elevações e detalhes.'),
      C('fase construtiva', 'Conjunto de intervenções relacionadas a determinado momento de transformação.')
    ],
    {
      'Leitura arqueológica de edifícios': T(
        [C('arqueologia da arquitetura', 'Estudo do edifício como registro material de construção, uso e transformação.')],
        'Um edifício histórico raramente é produto de uma única obra. Portas fechadas, janelas abertas depois, mudanças de piso, emendas de alvenaria e marcas de telhado registram transformações. A leitura arqueológica começa descrevendo materiais e limites antes de atribuir data ou função.',
        'O objetivo é construir uma sequência: quais partes são contemporâneas, quais cortam ou encostam em outras e quais correspondem a reparos. Fontes documentais ajudam a datar fases, mas o prédio pode contradizer plantas idealizadas ou reformas que nunca foram registradas.',
        'Em uma parede, identifique uma porta entaipada e uma janela posterior. Registre as relações físicas antes de buscar datas em arquivo.',
        ['Edifício é registro estratificado.', 'Relação física pode estabelecer cronologia relativa.', 'Documento escrito e materialidade precisam ser comparados.'],
        ['Assumir que fachada atual é original.', 'Datar por estilo sem contexto.', 'Apagar reparos da documentação.']
      ),
      'Estratigrafia de paredes': T(
        [C('estratigrafia de paredes', 'Método para ordenar intervenções construtivas por relações de corte, encosto e continuidade.'), C('matriz estratigráfica', 'Diagrama das relações de anterioridade e posterioridade entre unidades.')],
        'A estratigrafia de paredes adapta princípios estratigráficos à arquitetura. Se uma abertura corta uma alvenaria, é posterior a ela; se um revestimento cobre duas unidades, é posterior a ambas. Essas relações formam cronologia relativa independentemente de datas absolutas.',
        'Nem toda junção é simples. Rebocos podem esconder limites, reparos podem imitar materiais antigos e desmontagens removem relações. Uma matriz ajuda a testar se a sequência proposta é logicamente coerente.',
        'Registre cinco unidades de uma fachada com duas aberturas e três revestimentos. Monte uma matriz e verifique se alguma relação contradiz a sequência proposta.',
        ['Corte implica posterioridade.', 'Matriz organiza relações, não datas.', 'Superfícies ocultas e reparos podem limitar a leitura.'],
        ['Inventar relação onde o contato não é visível.', 'Confundir fase com unidade.', 'Usar estilo como substituto da estratigrafia.']
      ),
      'Técnicas construtivas e materiais': T(
        [C('técnica construtiva', 'Modo de combinar materiais, ferramentas e conhecimentos para produzir estruturas.'), C('argamassa', 'Mistura usada em assentamento ou revestimento, com composição e função variáveis.')],
        'Pedra, tijolo, terra, madeira, argamassas e metais deixam características de fabricação e montagem. Dimensão dos tijolos, aparelho de alvenaria, marcas de ferramenta e composição de argamassa podem auxiliar comparação entre fases, mas não funcionam como marcadores cronológicos universais.',
        'Disponibilidade local, custo, mão de obra e tradição técnica influenciam escolhas. Reuso de elementos também é comum: uma peça antiga pode aparecer em parede posterior. Amostragem destrutiva deve ser justificada e documentada.',
        'Compare duas alvenarias do mesmo edifício registrando módulo do tijolo, junta, argamassa e modo de amarração; depois avalie se as diferenças sustentam fases distintas ou apenas técnicas diferentes.',
        ['Técnica combina material e prática.', 'Característica construtiva não é data automática.', 'Reuso pode deslocar materiais no tempo.'],
        ['Datar apenas pelo tijolo.', 'Ignorar reuso.', 'Coletar amostra sem pergunta e registro.']
      ),
      'Levantamento arquitetônico': T(
        [C('levantamento arquitetônico', 'Registro dimensional e gráfico de uma construção.'), C('ortofoto', 'Imagem corrigida geometricamente que permite medições dentro de limites conhecidos.')],
        'Plantas, cortes e elevações são bases para leitura arqueológica porque localizam unidades e relações. O levantamento pode combinar trena, estação total, fotogrametria, laser scanner e desenho manual. A tecnologia escolhida depende de escala, precisão necessária, acesso e recursos.',
        'Modelos 3D não substituem interpretação. É necessário indicar sistema de referência, resolução, áreas sem cobertura e data do registro. Em edifícios irregulares, medir apenas largura e comprimento pode ocultar deformações importantes para a história construtiva.',
        'Produza uma elevação ortorretificada de uma parede e sobreponha polígonos das unidades estratigráficas, mantendo a base geométrica separada da interpretação.',
        ['Levantamento precisa de referência e precisão conhecidas.', 'Modelo digital é dado, não interpretação final.', 'Registro deve permitir localizar cada unidade.'],
        ['Usar 3D como efeito visual.', 'Omitir escala e orientação.', 'Desenhar fases sem preservar a base documental.']
      ),
      'Transformações, usos e fases de ocupação': T(
        [C('fase construtiva', 'Agrupamento interpretativo de unidades relacionadas.'), C('mudança de uso', 'Transformação funcional de espaço que pode ocorrer com ou sem grande reforma física.')],
        'Edifícios mudam porque necessidades sociais mudam. Uma residência pode virar comércio; um convento pode ganhar novas divisões; uma fábrica pode ser adaptada a depósito. Fases construtivas registram intervenções físicas, mas mudança de uso também pode aparecer em instalações, desgaste e objetos.',
        'A interpretação final deve distinguir unidade observada, fase inferida e função proposta. É possível estabelecer que uma parede é posterior a outra sem saber exatamente seu uso. Datas absolutas podem vir de arquivo, inscrições ou materiais datáveis, sempre com limites.',
        'Em um cômodo com piso industrial sobre piso doméstico antigo, combine estratigrafia, instalações e documentação para discutir mudança de uso sem supor que todo o edifício mudou ao mesmo tempo.',
        ['Fase é síntese interpretativa de unidades.', 'Uso e construção não mudam necessariamente juntos.', 'Níveis de certeza precisam ser explicitados.'],
        ['Confundir fase com função.', 'Forçar sincronia em todo edifício.', 'Apresentar hipótese como data certa.']
      )
    }
  );

  add(
    'opt-7-arqueologia-publica',
    'Preparação para pensar a arqueologia como prática social: quem produz conhecimento, quem participa, quem é representado, como o patrimônio é comunicado e que conflitos éticos surgem quando diferentes grupos atribuem valores ao passado.',
    'heritage',
    [
      'Mapeie atores e relações de poder em cada estudo de caso.',
      'Diferencie divulgação unilateral, consulta e participação efetiva.',
      'Trate comunidade como interlocutora com conhecimento e direitos, não como público-alvo genérico.'
    ],
    [
      C('arqueologia pública', 'Campo que examina relações entre arqueologia, sociedade, políticas, comunidades, comunicação e usos públicos do passado.'),
      C('participação', 'Envolvimento de grupos interessados em decisões, produção de conhecimento ou gestão, com diferentes níveis de poder real.'),
      C('multivocalidade', 'Reconhecimento de que diferentes grupos podem produzir interpretações e valores distintos sobre o patrimônio.'),
      C('devolutiva', 'Retorno acessível e responsável de resultados e decisões às pessoas e grupos envolvidos.'),
      C('ética colaborativa', 'Princípios de respeito, negociação, consentimento e responsabilidade em pesquisas feitas com comunidades.')
    ],
    {
      'Arqueologia e sociedade': T(
        [C('arqueologia pública', 'Relação crítica entre prática arqueológica e sociedade.')],
        'Arqueologia produz narrativas sobre o passado no presente. Escolhas de pesquisa, escavação, exposição e linguagem podem reforçar ou questionar identidades e desigualdades. Arqueologia pública pergunta quem se beneficia do conhecimento e como decisões profissionais afetam comunidades.',
        'O “público” não é uma massa única. Moradores, povos indígenas, comunidades quilombolas, proprietários, gestores, estudantes e visitantes podem ter interesses distintos. Um projeto responsável identifica esses atores antes de planejar comunicação ou participação.',
        'Em um sítio próximo a uma comunidade, compare objetivos acadêmicos, interesses dos moradores e exigências de gestão. Crie um mapa de atores e pontos de convergência ou conflito.',
        ['Arqueologia tem efeitos sociais.', 'Públicos são diversos.', 'Produção de conhecimento envolve escolhas e poder.'],
        ['Tratar divulgação como fim único.', 'Supor consenso comunitário.', 'Separar pesquisa de suas consequências sociais.']
      ),
      'Comunicação pública': T(
        [C('comunicação pública', 'Tradução e diálogo sobre conhecimento arqueológico em formatos acessíveis e responsáveis.'), C('devolutiva', 'Retorno de resultados a interlocutores e comunidades.')],
        'Comunicar arqueologia não é simplificar até perder precisão. Textos, exposições, vídeos, redes sociais e atividades educativas precisam definir público, objetivo e mensagem. Termos técnicos podem ser explicados sem infantilizar, e incertezas também devem ser comunicadas.',
        'Comunicação pode ser dialógica: resultados preliminares podem ser discutidos e formatos construídos em conjunto. Acessibilidade envolve linguagem, recursos visuais, legendas e atenção a barreiras físicas e digitais.',
        'Transforme um relatório técnico de escavação em painel para escola, mantendo evidências e incertezas e mostrando como as conclusões foram produzidas.',
        ['Precisão e acessibilidade podem coexistir.', 'Incerteza também deve ser comunicada.', 'Devolutiva é parte da relação de pesquisa.'],
        ['Sensacionalizar achados.', 'Usar jargão sem explicação.', 'Comunicar apenas no fim sem diálogo.']
      ),
      'Participação comunitária': T(
        [C('participação', 'Envolvimento com poder variável sobre decisões.'), C('coautoria', 'Reconhecimento de contribuição intelectual na produção e comunicação do conhecimento.')],
        'Participação pode variar de informação e consulta até construção conjunta de perguntas, métodos, interpretação e gestão. Chamar qualquer reunião de “participativa” esconde diferenças de poder. É preciso dizer em que decisões a comunidade realmente influencia.',
        'Colaboração exige tempo, escuta e negociação. Grupos internos podem discordar entre si, e representantes formais não falam necessariamente por todos. Consentimento também não é um evento único: mudanças no projeto podem exigir nova conversa.',
        'Antes de documentar um lugar de memória, combine com interlocutores quais informações podem ser publicadas, que nomes devem ser protegidos e como os resultados serão usados.',
        ['Participação tem graus de poder.', 'Comunidade não é homogênea.', 'Consentimento e negociação são processos.'],
        ['Usar participação só para legitimar decisão pronta.', 'Escolher um porta-voz como se representasse todos.', 'Publicar informação sensível sem acordo.']
      ),
      'Patrimônio, identidade e conflito': T(
        [C('multivocalidade', 'Existência de interpretações e valores diversos sobre o passado.'), C('dissonância patrimonial', 'Conflito entre narrativas, memórias e interesses associados a um bem ou lugar.')],
        'Patrimônio pode ser fonte de pertencimento e também de conflito. Monumentos, sítios e coleções podem representar orgulho para alguns grupos e violência para outros. A arqueologia pública não resolve essas diferenças declarando uma narrativa neutra; ela documenta argumentos e relações de poder.',
        'Identidade não deve ser deduzida mecanicamente de artefatos. Relações entre passado arqueológico e grupos atuais podem envolver memória, ancestralidade e território, mas precisam ser tratadas com respeito e base histórica.',
        'Em um monumento ligado à colonização, reúna diferentes narrativas sobre o lugar e proponha mediação que explicite o conflito em vez de apagá-lo.',
        ['Patrimônio não tem valor único.', 'Conflito é dado social relevante.', 'Identidade contemporânea não é tradução automática de tipologia arqueológica.'],
        ['Forçar consenso.', 'Apagar memórias de violência.', 'Usar arqueologia para validar identidade de modo simplista.']
      ),
      'Ética e colaboração': T(
        [C('ética colaborativa', 'Prática baseada em respeito, negociação, reciprocidade e responsabilidade.'), C('dados sensíveis', 'Informações cuja divulgação pode causar dano ou violar acordos.')],
        'Ética vai além de cumprir autorização administrativa. Inclui relações com pessoas vivas, tratamento de restos humanos, proteção de locais sensíveis, autoria, imagens, propriedade intelectual e consequências da divulgação. Uma decisão tecnicamente possível pode ser socialmente inadequada.',
        'Colaboração exige combinar usos de imagem e dados e reconhecer contribuições. Em alguns casos, não publicar localização exata de sítio ou informação cultural pode ser a decisão responsável. Leis e normas são piso mínimo; diálogo e contexto orientam escolhas adicionais.',
        'Antes de publicar mapa de sítio considerado sensível por uma comunidade, discuta nível de detalhe, riscos e alternativas de representação.',
        ['Legalidade não esgota ética.', 'Dados arqueológicos podem ser sensíveis.', 'Colaboração inclui autoria, retorno e responsabilidade.'],
        ['Publicar porque “é científico”.', 'Confundir autorização estatal com consentimento comunitário.', 'Prometer participação sem compartilhar decisões.']
      )
    }
  );

  add(
    'opt-8-restauracao-ceramica',
    'Preparação introdutória para conservação e restauração de cerâmica arqueológica, priorizando diagnóstico, mínima intervenção, documentação, compatibilidade de materiais e possibilidade de retratamento. Procedimentos reais devem ser conduzidos em laboratório e por profissional qualificado.',
    'material',
    [
      'Nunca aplique adesivo ou produto antes de documentar e diagnosticar.',
      'Diferencie limpeza, estabilização, remontagem e reintegração: cada ação responde a um problema diferente.',
      'Em conservação arqueológica, aparência estética não é o principal critério; preservar informação e estabilidade vem primeiro.'
    ],
    [
      C('conservação preventiva', 'Ações para reduzir deterioração sem intervir diretamente no objeto, como controle de manuseio, acondicionamento e ambiente.'),
      C('diagnóstico', 'Avaliação sistemática de materiais, danos, causas e riscos antes de decidir intervenção.'),
      C('compatibilidade', 'Adequação física e química entre material original e produto ou intervenção.'),
      C('retratabilidade', 'Possibilidade de revisar, remover ou substituir uma intervenção futura sem dano desproporcional ao original.'),
      C('reintegração', 'Tratamento de perdas com objetivo estrutural ou de leitura, tecnicamente justificado e documentado.')
    ],
    {
      'Diagnóstico do estado de conservação': T(
        [C('diagnóstico', 'Identificação de materiais, danos, causas e riscos.'), C('conservação preventiva', 'Controle de condições para reduzir deterioração.')],
        'O diagnóstico vem antes de qualquer limpeza ou colagem. Registra tipo de cerâmica, superfície, depósitos, sais, fissuras, perdas, adesivos antigos e estabilidade. Fotografias e mapa de danos criam uma linha de base para acompanhar alterações.',
        'Dano visível e causa não são a mesma coisa. Uma fissura pode resultar de impacto, pressão, cristalização de sais ou variação ambiental. Intervir apenas no sintoma pode agravar o problema. Depósitos superficiais também podem carregar informação arqueológica e não devem ser removidos automaticamente.',
        'Diante de um fragmento com crosta e descamação, documente antes de tentar limpar e verifique se há pigmento ou resíduo sob o depósito.',
        ['Diagnóstico precede intervenção.', 'Causa e sintoma precisam ser diferenciados.', 'Depósitos podem ter valor informativo.'],
        ['Limpar para “ver melhor” antes de diagnosticar.', 'Chamar toda sujeira de dano.', 'Omitir tratamento antigo.']
      ),
      'Limpeza e estabilização': T(
        [C('limpeza', 'Remoção controlada de materiais indesejados quando segura e justificada.'), C('estabilização', 'Ação para reduzir risco de perda ou progressão de deterioração.')],
        'Limpeza deve começar pelo método menos invasivo. Água, solvente ou detergente não são escolhas automáticas: cerâmicas porosas, sais solúveis, pigmentos e tratamentos antigos podem reagir de forma indesejada. Testes locais e documentação são essenciais.',
        'Estabilização pode significar apoio físico, controle ambiental, consolidação de superfície ou tratamento de sais, dependendo do diagnóstico. Nem toda peça precisa ficar “limpa”. Fuligem, resíduos de uso e depósitos podem ser dados científicos.',
        'Em uma vasilha com fuligem externa, não remova o resíduo apenas por estética; ele pode informar uso culinário e servir a análises futuras.',
        ['Limpeza é decisão analítica e conservativa.', 'Método menos invasivo vem primeiro.', 'Estabilização pode dispensar restauração estética.'],
        ['Mergulhar cerâmica sem avaliar porosidade e sais.', 'Remover resíduo de uso.', 'Confundir limpeza completa com conservação.']
      ),
      'Remontagem e adesivos': T(
        [C('remontagem', 'Reconexão de fragmentos cuja relação é demonstrável.'), C('adesivo', 'Material de união selecionado por compatibilidade, estabilidade e possibilidade de tratamento futuro.')],
        'Antes da colagem, fragmentos devem ser testados a seco e sua posição confirmada. A sequência de montagem importa: uma união feita cedo demais pode impedir encaixes posteriores. Bordas de fratura não devem ser lixadas para “caber”.',
        'A escolha do adesivo considera resistência necessária, envelhecimento, aparência, compatibilidade e possibilidade de retratamento. Produto doméstico de alta resistência não é automaticamente adequado. Excesso deve ser evitado e toda intervenção documentada.',
        'Organize os fragmentos de uma vasilha por encaixes e planeje a sequência de montagem antes de aplicar qualquer adesivo.',
        ['Encaixe deve ser demonstrável.', 'Sequência de montagem precisa ser planejada.', 'Adesivo é escolha técnica, não conveniência.'],
        ['Forçar encaixe.', 'Lixar borda original.', 'Usar cola doméstica sem avaliação.']
      ),
      'Preenchimentos e reintegração': T(
        [C('reintegração', 'Tratamento de lacunas com finalidade estrutural ou de leitura.'), C('distinguibilidade', 'Capacidade de reconhecer a intervenção sem que ela domine visualmente o original.')],
        'Preenchimentos podem dar suporte, proteger bordas ou melhorar leitura da forma, mas não são obrigatórios. A decisão depende de estabilidade, uso museológico e documentação disponível. Reconstruir partes sem evidência suficiente cria uma aparência enganosa.',
        'Materiais de preenchimento devem ser compatíveis e, idealmente, retratáveis. Reintegração cromática pode ser usada em alguns contextos, mas precisa permanecer identificável e não deve inventar decoração ausente.',
        'Em uma vasilha com grande lacuna, um preenchimento estrutural pode completar o perfil quando há evidência geométrica suficiente, sem reconstruir pintura desconhecida.',
        ['Lacuna não precisa ser preenchida por estética.', 'Reconstrução exige evidência.', 'Intervenção deve ser documentada e reconhecível.'],
        ['Completar desenho que não existe.', 'Imitar original de modo indistinguível.', 'Usar material incompatível com a cerâmica.']
      ),
      'Documentação e princípios éticos de conservação': T(
        [C('retratabilidade', 'Possibilidade de revisão futura da intervenção.'), C('documentação de conservação', 'Registro dos materiais, decisões, métodos e resultados de tratamento.')],
        'Conservação passa a integrar a história do objeto; por isso todo tratamento deve deixar registro. Ficha, fotografias, mapa de danos, produtos utilizados e áreas tratadas permitem que outra pessoa compreenda o que foi feito.',
        'Princípios como mínima intervenção, compatibilidade e retratabilidade orientam decisões, mas precisam ser aplicados ao caso concreto. O objetivo é preservar matéria e informação, reduzir riscos e evitar que a restauração crie falsificações visuais ou impeça estudos futuros.',
        'Antes e depois de restaurar uma peça, produza fotografias comparáveis e anote cada material aplicado; esse registro deve acompanhar o objeto no acervo.',
        ['Tratamento sem documentação é perda de informação.', 'Intervenção deve ser proporcional ao problema.', 'Decisões atuais precisam permitir revisão futura.'],
        ['Esconder intervenção.', 'Priorizar estética sobre evidência.', 'Separar ficha de conservação do número de inventário.']
      )
    }
  );

  add(
    'opt-9-registro-grafico-nordestino',
    'Preparação para estudar registros rupestres do Nordeste brasileiro com atenção a técnica, suporte, contexto arqueológico, documentação, conservação e debates classificatórios. Termos como “tradição” e “estilo” são ferramentas analíticas, não nomes automáticos de povos.',
    'material',
    [
      'Descreva painel e suporte antes de atribuir tradição ou significado.',
      'Registre escala, orientação, superposições e estado de conservação.',
      'Trate classificações regionais como hipóteses históricas que podem ser revistas por novos dados.'
    ],
    [
      C('registro rupestre', 'Pinturas, gravuras e outras marcas humanas em suporte rochoso.'),
      C('superposição', 'Relação em que um grafismo cobre outro, útil para construir sequências relativas.'),
      C('painel', 'Conjunto espacial de grafismos em uma superfície delimitada para documentação.'),
      C('tradição rupestre', 'Categoria classificatória usada para agrupar recorrências formais ou técnicas; não equivale automaticamente a etnia.'),
      C('conservação rupestre', 'Avaliação de processos naturais e antrópicos que afetam suporte e pigmentos.')
    ],
    {
      'Tradições e estilos rupestres do Nordeste': T(
        [C('tradição rupestre', 'Categoria analítica histórica e discutível, não povo identificável por si só.')],
        'Pesquisas no Nordeste criaram classificações para organizar recorrências de motivos, técnicas e composições. Essas categorias ajudam a comparar conjuntos, mas não devem ser tratadas como grupos étnicos definidos. O mesmo rótulo pode reunir variação interna e ser revisado conforme novas datações e contextos aparecem.',
        'Uma classificação robusta explicita quais atributos foram usados: técnica, cor, forma, tema, composição, superposição e distribuição espacial. Comparação também precisa controlar conservação, porque perda de pigmento pode alterar a aparência dos motivos.',
        'Ao comparar dois painéis, monte uma tabela de técnica, motivos, tamanho, sobreposição e localização. Só depois avalie se faz sentido aproximá-los em uma mesma categoria estilística.',
        ['Tradição é ferramenta classificatória.', 'Estilo precisa de critérios explícitos.', 'Categoria visual não identifica etnia automaticamente.'],
        ['Rotular antes de descrever.', 'Confundir tradição com povo.', 'Ignorar variação interna.']
      ),
      'Técnicas de documentação': T(
        [C('painel', 'Unidade espacial de documentação.'), C('ficha de registro', 'Instrumento padronizado para anotar localização, suporte, técnica, conservação e contexto.')],
        'Documentação rupestre deve permitir que outra pessoa compreenda localização, escala e características do painel sem depender da memória do pesquisador. Fichas, croquis, fotografia, coordenadas, orientação do suporte e descrição do ambiente formam um conjunto integrado.',
        'Contato físico com pigmentos e superfícies deve ser evitado quando pode causar dano. Métodos digitais ampliam visualização, mas qualquer realce precisa preservar o arquivo original e registrar os parâmetros empregados. Imagem processada é produto interpretativo, não substituto do original.',
        'Registre um painel com fotografia geral, detalhes, escala não invasiva, croqui de localização e ficha de conservação; mantenha originais e versões processadas separadas.',
        ['Documentação reúne imagem, espaço e contexto.', 'Arquivo original deve ser preservado.', 'A técnica não pode aumentar risco ao sítio.'],
        ['Molhar pintura para destacar cor.', 'Publicar imagem processada sem informar.', 'Fotografar sem escala ou orientação quando elas são necessárias.']
      ),
      'Levantamento fotográfico e desenho': T(
        [C('escala fotográfica', 'Referência métrica inserida de modo a não ocultar ou tocar indevidamente o grafismo.'), C('ortomosaico', 'Composição geometricamente corrigida de múltiplas imagens, quando técnica e controle permitem.')],
        'Fotografia e desenho respondem a finalidades diferentes. Fotografia registra tonalidade, textura e estado visível; desenho analítico pode destacar relações, motivos e superposições, mas envolve seleção do pesquisador. O vínculo entre desenho interpretado e imagem de base precisa permanecer claro.',
        'Iluminação, balanço de branco, lente e posição alteram aparência. Em fotogrametria, cobertura e pontos de controle determinam a qualidade geométrica; um modelo visualmente bonito não é necessariamente mensurável.',
        'Produza fotografia ortogonal de um pequeno painel e um desenho interpretativo em camada separada. Marque em legenda quais linhas são observadas e quais foram reconstruídas.',
        ['Fotografia e desenho não são equivalentes.', 'Desenho interpretativo precisa de base verificável.', 'Qualidade visual não garante precisão métrica.'],
        ['Desenhar de memória.', 'Realçar sem guardar original.', 'Tratar fotogrametria sem controle como levantamento métrico.']
      ),
      'Análise de contexto e conservação': T(
        [C('contexto rupestre', 'Relação entre painel, abrigo, paisagem, depósitos arqueológicos e outros vestígios.'), C('intemperismo', 'Alteração do suporte por processos físicos, químicos e biológicos.')],
        'Grafismos não existem fora da paisagem. Orientação do abrigo, visibilidade, acesso, água, depósitos de ocupação e outros vestígios podem ajudar a formular perguntas sobre uso do lugar. Porém, proximidade espacial não garante contemporaneidade entre pintura e depósito arqueológico.',
        'Conservação registra fraturas, descamação, sais, água, microrganismos, fuligem, toque e vandalismo. Intervenções devem ser especializadas: limpeza inadequada pode remover pigmento ou alterar o suporte. Monitoramento fotográfico padronizado permite acompanhar mudanças sem contato.',
        'Em um abrigo com pinturas e fogueiras no solo, não conclua que as fogueiras foram produzidas pelos autores das pinturas sem datação e relação estratigráfica suficiente.',
        ['Contexto espacial não equivale automaticamente a contemporaneidade.', 'Conservação integra processos naturais e humanos.', 'Monitoramento precisa ser repetível.'],
        ['Associar qualquer depósito à arte.', 'Limpar superfície sem especialista.', 'Confundir mudança de iluminação com perda de pigmento.']
      ),
      'Debates interpretativos regionais': T(
        [C('analogia', 'Uso controlado de comparações para formular interpretações, com limites explicitados.'), C('significado', 'Dimensão interpretativa que não pode ser deduzida unicamente da semelhança visual.')],
        'Interpretar registro rupestre envolve debates sobre cronologia, autoria, função e significado. Sem textos produzidos pelos autores, imagens não possuem tradução automática. Comparações etnográficas podem gerar hipóteses, mas exigem justificativa histórica e não devem transformar povos atuais em equivalentes diretos do passado remoto.',
        'Análises regionais também podem focar distribuição, composição, escolha de lugares, técnicas e mudanças ao longo do tempo. Em vez de buscar uma única mensagem das pinturas, é possível investigar práticas de marcação da paisagem e relações entre conjuntos.',
        'Compare a posição de motivos semelhantes em diferentes abrigos e pergunte se padrões de visibilidade ou acesso são recorrentes, sem assumir que o motivo possui o mesmo significado em todos.',
        ['Significado não é leitura direta da forma.', 'Analogia precisa de justificativa e limite.', 'Perguntas espaciais e tecnológicas podem ser mais controláveis que traduções simbólicas.'],
        ['Inventar narrativa simbólica.', 'Usar povos atuais como equivalentes automáticos do passado remoto.', 'Confundir semelhança com mesmo significado.']
      )
    }
  );

  add(
    'opt-10-sambaquis-e-sua-contextualizacao',
    'Preparação para estudar sambaquis como sítios construídos por grupos humanos, frequentemente associados a ambientes costeiros e fluviais, combinando conchas, fauna, estruturas, artefatos e sepultamentos. A análise integra formação do sítio, cronologia, dieta, ritual e organização social.',
    'science',
    [
      'Não trate sambaqui como simples lixeira de conchas.',
      'Diferencie alimentação, construção intencional e processos pós-deposicionais.',
      'Integre zooarqueologia, bioarqueologia, estratigrafia, datação e paisagem.'
    ],
    [
      C('sambaqui', 'Sítio com acúmulos expressivos de conchas e outros materiais, construído por atividades humanas ao longo do tempo.'),
      C('malacologia arqueológica', 'Estudo de moluscos em contextos arqueológicos.'),
      C('incremento construtivo', 'Episódio de deposição que contribui para crescimento e arquitetura do sítio.'),
      C('prática funerária', 'Ações relacionadas ao tratamento e deposição de mortos e materiais associados.'),
      C('paleoambiente', 'Reconstrução de condições ambientais passadas a partir de múltiplas evidências.')
    ],
    {
      'Formação e distribuição de sambaquis': T(
        [C('sambaqui', 'Sítio construído por deposições humanas, não mero acúmulo natural.'), C('formação do sítio', 'Processos humanos e naturais que criam e transformam depósitos.')],
        'Sambaquis variam em tamanho, composição e duração. Conchas podem funcionar como restos de consumo, material construtivo e componente de espaços funerários. Estratigrafia revela episódios de deposição, pisos, fogueiras, estruturas e interrupções, mostrando que o crescimento pode ser organizado e repetido.',
        'Distribuição em paisagens costeiras e fluviais precisa ser lida junto a mudanças do nível do mar, dinâmica sedimentar e disponibilidade de recursos. A posição atual da costa não é necessariamente a mesma da época de ocupação.',
        'Em um perfil de sambaqui, diferencie lentes compactas, camadas ricas em fauna e áreas funerárias; trate cada unidade como episódio potencialmente distinto.',
        ['Sambaqui é sítio antropogênico complexo.', 'Estratigrafia registra episódios de construção e uso.', 'Paisagem costeira mudou ao longo do Holoceno.'],
        ['Chamar tudo de lixo alimentar.', 'Usar litoral atual como cenário antigo.', 'Datar o sítio inteiro por uma única amostra.']
      ),
      'Subsistência e ambientes costeiros/fluviais': T(
        [C('malacologia arqueológica', 'Análise de moluscos e sua exploração humana.'), C('subsistência', 'Práticas de obtenção, produção, processamento e consumo de recursos.')],
        'Conchas, peixes, mamíferos, aves e plantas podem informar exploração de ambientes aquáticos e terrestres. Quantidade de restos não corresponde diretamente à importância alimentar: preservação, tamanho, descarte e identificação afetam o registro. Moluscos também podem ter usos além da alimentação.',
        'Zooarqueologia, isótopos, microvestígios e ferramentas ajudam a reconstruir dieta e mobilidade. Mudanças ambientais podem alterar disponibilidade de recursos; por isso subsistência deve ser discutida em escala temporal.',
        'Compare abundância de conchas e ossos de peixe com evidências isotópicas de dieta. Se os indicadores divergirem, investigue formação do depósito e representatividade de cada dado.',
        ['Abundância arqueológica não equivale a porcentagem da dieta.', 'Múltiplos ambientes podiam ser explorados.', 'Dieta precisa de linhas de evidência complementares.'],
        ['Contar fragmentos como indivíduos.', 'Ignorar coleta sazonal.', 'Assumir que concha possui função exclusivamente alimentar.']
      ),
      'Práticas funerárias': T(
        [C('prática funerária', 'Conjunto de gestos e escolhas no tratamento dos mortos.'), C('contexto funerário', 'Relações entre corpo, posição, estrutura, objetos e depósito.')],
        'Sepultamentos em sambaquis permitem estudar tratamento dos mortos, memória e organização de espaços. Posição do corpo, orientação, pigmentos, acompanhamentos e reaberturas de covas são observações importantes, mas não devem ser convertidas automaticamente em status social.',
        'Bioarqueologia acrescenta estimativas de idade, sexo biológico, saúde e mobilidade, sempre com incerteza e respeito ético. Escavação de restos humanos exige protocolos, autorização e atenção às comunidades relacionadas quando aplicável.',
        'Compare dois sepultamentos: um com estrutura cuidadosamente construída e outro perturbado. Antes de inferir diferença social, avalie conservação, cronologia e processos posteriores.',
        ['Ritual funerário é reconstruído por gestos materiais.', 'Acompanhamento não equivale automaticamente a riqueza.', 'Restos humanos exigem ética e protocolo.'],
        ['Hierarquizar indivíduos pelo número de objetos.', 'Ignorar tafonomia.', 'Tratar restos humanos como objetos comuns.']
      ),
      'Zooarqueologia e cronologia': T(
        [C('NISP', 'Número de espécimes identificados, medida quantitativa com limites próprios.'), C('datação radiocarbônica', 'Método para estimar idade de materiais orgânicos dentro de sua faixa de aplicação, exigindo calibração e avaliação de contexto.')],
        'Zooarqueologia identifica espécies, partes anatômicas, marcas de processamento, queima e fraturas. NISP, MNI e outras medidas respondem a perguntas diferentes e são afetadas por fragmentação. Em sambaquis, o grande volume de material torna a estratégia de amostragem especialmente importante.',
        'Cronologia por radiocarbono precisa selecionar amostras com relação clara ao evento estudado. Em ambientes marinhos, efeitos de reservatório podem alterar idades aparentes e devem ser considerados na calibração. Uma única data não representa automaticamente toda a construção do sítio.',
        'Date diferentes níveis com amostras contextualizadas e compare a sequência estratigráfica. Se as datas estiverem invertidas, investigue mistura, material antigo reutilizado ou problemas de amostra.',
        ['Quantificação zooarqueológica tem pressupostos.', 'Data precisa estar ligada a contexto específico.', 'Efeito reservatório marinho pode ser relevante.'],
        ['Usar NISP como número de animais.', 'Ignorar efeito reservatório.', 'Generalizar uma data para o sítio inteiro.']
      ),
      'Debates sobre complexidade social': T(
        [C('complexidade social', 'Conceito analítico sobre diferenciação, organização e integração social, que não deve ser reduzido à escala monumental.'), C('monumentalidade', 'Produção material de escala ou investimento marcante, cujo significado depende do contexto social.')],
        'Grandes sambaquis desafiaram modelos antigos que associavam grupos costeiros apenas a mobilidade simples e baixa densidade. Construção cumulativa, cemitérios persistentes, territorialidade e especialização técnica podem indicar formas complexas de organização sem exigir estados ou hierarquias rígidas.',
        '“Complexidade” precisa ser definida antes de ser medida. Tamanho do sítio, diferenciação funerária, redes de troca e permanência territorial são indicadores possíveis, mas cada um admite explicações alternativas. Comparar regiões e longas sequências cronológicas ajuda a testar modelos.',
        'Um sambaqui monumental pode resultar de práticas comunitárias repetidas por séculos; volume sozinho não prova existência de elite dirigente.',
        ['Complexidade não é uma escala linear de simples a avançado.', 'Monumentalidade pode emergir de ação coletiva.', 'Indicadores precisam de hipóteses alternativas.'],
        ['Equacionar grande sítio a Estado.', 'Aplicar evolução social linear.', 'Ignorar a duração acumulada da construção.']
      )
    }
  );

  add(
    'opt-11-indios-e-sua-trajetoria-de-500-anos',
    'Preparação para estudar histórias dos povos indígenas do Brasil desde o período colonial até o presente, valorizando diversidade, continuidade, transformação, territorialidade e protagonismo. O título da matriz é preservado, mas o material didático prefere “povos indígenas” e evita tratá-los como um grupo único.',
    'historical',
    [
      'Use o nome do povo quando a fonte permitir, evitando generalizações.',
      'Cruze documentação colonial com arqueologia, oralidade e produção intelectual indígena.',
      'Diferencie mudança cultural de desaparecimento: incorporação de novos objetos ou práticas não elimina identidade.'
    ],
    [
      C('territorialidade indígena', 'Relações históricas, sociais, cosmológicas e materiais entre povos e seus territórios.'),
      C('etnogênese', 'Processos históricos de formação, reorganização e afirmação de identidades coletivas.'),
      C('agência indígena', 'Capacidade de povos e indivíduos atuarem, negociarem e transformarem situações históricas.'),
      C('política indigenista', 'Ações e normas estatais dirigidas aos povos indígenas, distintas das políticas produzidas pelos próprios povos.'),
      C('arqueologia colaborativa', 'Pesquisa construída com participação e negociação com comunidades, incluindo perguntas, métodos, interpretação e circulação dos resultados.')
    ],
    {
      'História indígena no período colonial e contemporâneo': T(
        [C('agência indígena', 'Ação histórica de povos indígenas em contextos de contato, conflito e negociação.'), C('etnogênese', 'Reorganização histórica de coletividades e identidades.')],
        'Histórias indígenas não começam em 1500 e não terminam com o período colonial. Povos diferentes responderam à invasão, missões, epidemias, escravização e expansão territorial por guerra, aliança, fuga, negociação, reorganização e manutenção de práticas próprias. Fontes coloniais precisam ser lidas criticamente.',
        'Arqueologia pode reconhecer continuidade e transformação em aldeias, cerâmicas, alimentação, espaços domésticos e paisagens. Objetos europeus em contexto indígena não significam automaticamente assimilação; podem ter sido apropriados e usados em lógicas locais. Para períodos recentes, história oral e produção intelectual indígena são fundamentais.',
        'Em uma aldeia com contas de vidro e ferramentas metálicas, pergunte como esses objetos foram selecionados e usados, em vez de concluir que a comunidade abandonou sua cultura.',
        ['Povos indígenas são sujeitos históricos.', 'Contato produz múltiplas respostas.', 'Mudança material não equivale a perda automática de identidade.'],
        ['Falar de “o índio” no singular.', 'Tratar 1500 como início da história.', 'Usar adoção de objetos como prova de assimilação total.']
      ),
      'Territorialidade e resistência': T(
        [C('territorialidade indígena', 'Relação dinâmica entre território, memória, mobilidade, uso e reprodução sociocultural.'), C('resistência', 'Ações diversas contra expropriação e dominação, incluindo formas abertas e negociações cotidianas.')],
        'Território indígena não é apenas área econômica. Lugares de moradia, roça, coleta, pesca, circulação, ritual e memória formam paisagens históricas. Expulsões e confinamentos podem alterar padrões de ocupação sem romper vínculos territoriais.',
        'Resistência pode incluir confrontos, deslocamentos estratégicos, petições, retomadas, alianças e manutenção de práticas. Arqueologia da paisagem pode documentar antigos caminhos e aldeias, mas dados territoriais sensíveis precisam ser tratados com consentimento e segurança.',
        'Ao mapear antigo local de aldeia citado em memória comunitária, não publique coordenadas automaticamente; combine finalidade, acesso e riscos com os interlocutores.',
        ['Territorialidade inclui dimensão histórica e cultural.', 'Deslocamento forçado não apaga vínculo.', 'Informação espacial pode ser sensível.'],
        ['Reduzir território a propriedade privada.', 'Confundir ausência atual com ausência histórica.', 'Divulgar sítios sensíveis sem acordo.']
      ),
      'Cultura material e memória': T(
        [C('memória social', 'Processos coletivos de lembrar, silenciar, transmitir e reinterpretar o passado.'), C('apropriação material', 'Incorporação seletiva de objetos e tecnologias em práticas locais.')],
        'Cultura material indígena inclui objetos de longa tradição e bens incorporados em contextos de contato. Cerâmica, cestaria, metal, vidro, vestuário e arquitetura podem ser ressignificados. Classificar como “autêntico” apenas o que parece antigo cria uma visão congelada de cultura.',
        'Memórias associadas a objetos e lugares ajudam a compreender trajetórias, mas não são simples legendas para achados. Diferentes gerações podem lembrar de formas distintas. Pesquisa colaborativa aproxima conhecimento arqueológico e saberes comunitários sem exigir que um valide o outro.',
        'Uma panela industrial usada em ritual contemporâneo pode ter importância cultural tão real quanto um objeto feito por técnica antiga; contexto de uso é central.',
        ['Cultura é dinâmica.', 'Autenticidade não depende de ausência de mudança.', 'Memória e arqueologia são fontes distintas que podem dialogar.'],
        ['Chamar objeto incorporado de aculturação automática.', 'Exigir continuidade formal perfeita.', 'Usar memória como prova literal sem contexto.']
      ),
      'Políticas indigenistas': T(
        [C('política indigenista', 'Ações e normas do Estado em relação aos povos indígenas.'), C('demarcação', 'Processo administrativo de identificação e reconhecimento dos limites de terras tradicionalmente ocupadas, conforme legislação vigente.')],
        'Políticas indigenistas mudaram ao longo da história, passando por missões, tutela, assimilação e, no marco constitucional contemporâneo, reconhecimento de direitos originários e diversidade. É essencial distinguir política indigenista estatal de política indígena: povos e organizações produzem agendas próprias.',
        'Questões territoriais e normas são atualizadas e devem ser conferidas em fontes oficiais. Para arqueologia, políticas afetam consulta, pesquisa em territórios, proteção patrimonial e interpretação de lugares. Conhecer o histórico institucional ajuda a ler documentos e conflitos atuais.',
        'Ao usar um relatório estatal antigo sobre um povo, identifique o órgão, a política vigente e a linguagem da época antes de tratar suas classificações como neutras.',
        ['Estado produziu políticas diferentes em épocas distintas.', 'Política indígena não é sinônimo de política indigenista.', 'Normas atuais devem ser verificadas em fonte oficial.'],
        ['Repetir categorias tutelares sem crítica.', 'Tratar legislação histórica como vigente.', 'Apagar organizações indígenas contemporâneas.']
      ),
      'Arqueologia colaborativa e decolonial': T(
        [C('arqueologia colaborativa', 'Pesquisa com participação substantiva de comunidades.'), C('decolonialidade', 'Conjunto de críticas às continuidades coloniais na produção de conhecimento e poder; não é um método único.')],
        'Abordagens colaborativas questionam a ideia de que arqueólogos possuem autoridade exclusiva sobre perguntas e interpretações. Comunidades podem participar da definição de objetivos, trabalho de campo, tratamento de informações, curadoria e autoria.',
        'Perspectivas decoloniais analisam como categorias acadêmicas, museus e coleções foram moldados por relações coloniais. Isso não significa rejeitar método científico, mas revisar quem define problemas, quem controla acervos e quem recebe benefícios. Colaboração precisa ser concreta, não apenas linguagem de projeto.',
        'Antes de estudar uma coleção vinculada a um povo, discuta acesso, imagens, terminologia e possibilidades de retorno ou gestão compartilhada com os interlocutores pertinentes.',
        ['Colaboração envolve poder real.', 'Decolonialidade é crítica a estruturas de poder, não slogan.', 'Curadoria e dados também fazem parte da relação ética.'],
        ['Chamar consulta pontual de colaboração.', 'Usar “decolonial” sem mudar prática.', 'Presumir que toda comunidade quer participar da mesma forma.']
      )
    }
  );

  add(
    'opt-12-quilombos-e-suas-trajetorias',
    'Preparação para estudar quilombos e comunidades quilombolas em perspectiva histórica e contemporânea, articulando escravidão, resistência, parentesco, território, cultura material, memória e direitos. Quilombo não é entendido apenas como esconderijo de fugitivos, mas como formação histórica diversa.',
    'historical',
    [
      'Compare diferentes experiências quilombolas em tempo e região.',
      'Cruze arqueologia, arquivo, oralidade e paisagem sem privilegiar automaticamente uma fonte.',
      'Ao tratar comunidades atuais, respeite autoidentificação, direitos territoriais e protocolos de participação.'
    ],
    [
      C('quilombo', 'Formação histórica diversa associada a comunidades negras e estratégias de autonomia e resistência; o conceito possui usos históricos e jurídicos específicos.'),
      C('território quilombola', 'Território ligado à reprodução física, social, econômica e cultural de comunidade quilombola, reconhecido em processos próprios.'),
      C('autoidentificação', 'Princípio pelo qual a própria comunidade se reconhece como quilombola, elemento central nas políticas contemporâneas.'),
      C('paisagem de resistência', 'Leitura de lugares, caminhos, recursos e assentamentos em relação a estratégias de autonomia e proteção.'),
      C('memória quilombola', 'Conhecimento e narrativas comunitárias sobre ancestralidade, território e experiências históricas.')
    ],
    {
      'Escravidão, fuga e formação de quilombos': T(
        [C('quilombo', 'Formação histórica de resistência e autonomia em contextos de escravidão e pós-emancipação.')],
        'Quilombos históricos surgiram em contextos variados e não obedecem a um único modelo. Fuga da escravidão é componente importante, mas comunidades também estabeleceram agricultura, comércio, alianças, parentesco e relações com outras populações. Algumas foram móveis; outras se consolidaram por longos períodos.',
        'Documentos coloniais frequentemente foram produzidos por autoridades repressivas e podem exagerar ameaça ou reduzir comunidades a criminosos. Arqueologia ajuda a investigar assentamentos, alimentação, produção e redes, tornando visíveis dimensões pouco registradas nos documentos oficiais.',
        'Ao ler um relatório militar sobre quilombo, compare a linguagem repressiva com localização, cultura material e indícios de produção encontrados arqueologicamente.',
        ['Quilombos foram diversos.', 'Fontes repressivas possuem perspectiva própria.', 'Autonomia envolvia relações econômicas e sociais complexas.'],
        ['Definir quilombo apenas como esconderijo.', 'Confiar literalmente em documento policial ou militar.', 'Imaginar isolamento total.']
      ),
      'Território e paisagem': T(
        [C('território quilombola', 'Espaço de reprodução social e cultural ligado à comunidade.'), C('paisagem de resistência', 'Organização espacial relacionada a proteção, subsistência, mobilidade e memória.')],
        'Território reúne moradia, roça, água, caminhos, matas, cemitérios, lugares sagrados e relações de parentesco. Em contextos históricos, escolha de relevo e rotas pode participar de estratégias de proteção, mas nenhum padrão espacial deve ser generalizado para todos os quilombos.',
        'Para comunidades contemporâneas, território é também direito e base da reprodução social. A investigação arqueológica precisa dialogar com memória e uso atual, evitando transformar mapa acadêmico em definição unilateral do território vivido.',
        'Mapeie antigos caminhos e áreas de cultivo indicadas por moradores e compare com fotografias aéreas e vestígios, mantendo distinção entre dado cartográfico e significado comunitário.',
        ['Território não é apenas polígono.', 'Paisagem combina uso, memória e relações.', 'Pesquisa não substitui autoidentificação nem procedimentos oficiais.'],
        ['Definir território só por sítio arqueológico.', 'Ignorar uso contemporâneo.', 'Publicar informação sensível sem consentimento.']
      ),
      'Cultura material afro-brasileira': T(
        [C('cultura material afro-brasileira', 'Objetos, espaços e práticas materiais produzidos em experiências negras no Brasil, com grande diversidade histórica.'), C('diáspora africana', 'Deslocamentos forçados e voluntários de populações africanas e formação de comunidades em diferentes contextos.')],
        'Cultura material de comunidades negras pode incluir cerâmica, objetos domésticos, arquitetura, adornos, práticas alimentares e materiais incorporados de mercados regionais. Não existe uma “peça quilombola” universal; identificação depende de contexto histórico, associação e comparação.',
        'Buscar origem africana direta em cada forma pode gerar essencialismo. Continuidades, inovações e encontros com tradições indígenas e europeias fazem parte da diáspora. Uma abordagem mais segura investiga práticas e redes apoiadas por contextos bem datados.',
        'Em um conjunto cerâmico, compare técnicas locais, formas de uso e distribuição doméstica antes de atribuir uma peça a identidade étnica específica.',
        ['Identidade não está codificada automaticamente no objeto.', 'Diáspora envolve continuidade e criação.', 'Conjunto contextual é mais informativo que item isolado.'],
        ['Buscar africanidade por semelhança visual isolada.', 'Homogeneizar populações africanas.', 'Ignorar intercâmbios locais.']
      ),
      'Memória e identidade': T(
        [C('memória quilombola', 'Narrativas e práticas de transmissão sobre ancestralidade e território.'), C('identidade quilombola', 'Identificação coletiva produzida historicamente e reconhecida pela própria comunidade.')],
        'Memória comunitária pode preservar nomes, deslocamentos, lugares, festas, trabalho e relações de parentesco que não aparecem em arquivo. Ela não precisa coincidir palavra por palavra com documentação oficial para ser historicamente relevante; responde a formas próprias de lembrar e transmitir.',
        'Identidade quilombola contemporânea não deve ser julgada por critérios externos de pureza cultural. Autoidentificação e trajetória histórica são centrais. Pesquisa pode contribuir com documentação de lugares e processos, mas não substitui a voz da comunidade.',
        'Compare relatos de duas gerações sobre um antigo cemitério. Diferenças podem indicar transformações na memória, e não simplesmente que uma versão é falsa.',
        ['Memória é fonte situada.', 'Identidade não exige imutabilidade.', 'Arqueologia não certifica autenticidade cultural.'],
        ['Usar divergência oral como prova de falsidade.', 'Exigir tradição sem mudança.', 'Falar pela comunidade.']
      ),
      'Reconhecimento territorial e patrimônio': T(
        [C('autoidentificação', 'Reconhecimento da própria comunidade como quilombola.'), C('regularização territorial', 'Conjunto de procedimentos administrativos relacionados ao reconhecimento e titulação de territórios quilombolas, que deve ser consultado em fontes oficiais atuais.')],
        'No presente, comunidades quilombolas possuem direitos territoriais e políticas específicas. O Incra relaciona esses territórios à reprodução física, social, econômica e cultural das comunidades e conduz procedimentos federais de regularização. Como normas e etapas podem ser atualizadas, o app não substitui consulta às fontes oficiais.',
        'Patrimônio arqueológico em território quilombola exige diálogo entre proteção legal, pesquisa e direitos comunitários. Um sítio pode ter valor científico e, ao mesmo tempo, integrar memória ou uso local. Projetos precisam planejar participação, acesso a resultados e tratamento dos materiais de forma responsável.',
        'Antes de realizar levantamento em território quilombola, identifique interlocutores, autorizações e protocolos pertinentes e combine como dados e materiais serão tratados.',
        ['Direitos contemporâneos devem ser tratados com informação atualizada.', 'Autoidentificação é central.', 'Patrimônio e território não podem ser separados da comunidade afetada.'],
        ['Usar informação jurídica desatualizada.', 'Tratar comunidade como obstáculo ao projeto.', 'Confundir sítio arqueológico com totalidade do território.']
      )
    }
  );

  add(
    'opt-13-arte-plumagem-e-cestarias-indigenas',
    'Preparação para estudar plumária, cestaria e sistemas visuais indígenas como tecnologias e conhecimentos vivos, ligados a matérias-primas, estética, corpo, ritual, circulação e direitos culturais. O material evita tratar esses objetos como artesanato decorativo isolado de seus produtores.',
    'material',
    [
      'Quando possível, use terminologia e autoria indicadas pelos próprios povos.',
      'Relacione objeto a matéria-prima, técnica, uso, circulação e conhecimento associado.',
      'Em coleções museológicas, investigue proveniência e condições de coleta, inclusive contextos coloniais.'
    ],
    [
      C('plumária', 'Conjunto de técnicas e objetos que utilizam penas e outros materiais em sistemas estéticos e sociais específicos.'),
      C('cestaria', 'Tecnologias de entrelaçamento de fibras e outros materiais para objetos com usos variados.'),
      C('grafismo', 'Sistema visual organizado por formas, padrões e regras culturalmente situadas.'),
      C('conhecimento tradicional', 'Conhecimentos transmitidos e atualizados por comunidades, com dimensões técnicas, sociais e territoriais.'),
      C('proveniência museológica', 'História documentada de coleta, circulação e incorporação de um objeto a uma coleção.')
    ],
    {
      'Tecnologias e matérias-primas': T(
        [C('plumária', 'Tecnologia de seleção e montagem de penas.'), C('cestaria', 'Tecnologia de preparo e entrelaçamento de fibras.')],
        'Produzir plumária ou cestaria envolve conhecimento de espécies, coleta, preparo, conservação, cor, flexibilidade e técnicas de montagem. A matéria-prima não é apenas recurso natural: sua seleção é parte de conhecimento técnico e territorial.',
        'Análise deve documentar fibras, penas, amarrações, tramas e reparos sem retirar amostras desnecessariamente. Identificação biológica pode ser útil, mas não substitui conhecimento dos produtores. Mudanças ambientais e restrições de acesso a espécies também afetam continuidade tecnológica.',
        'Compare dois cestos visualmente semelhantes, registrando fibra, direção da trama, início, borda e reforços. Diferenças técnicas podem ser mais informativas que o formato geral.',
        ['Matéria-prima é conhecimento técnico e territorial.', 'Técnica precisa ser descrita passo a passo.', 'Identificação científica e conhecimento indígena podem dialogar.'],
        ['Chamar tudo de fibra natural.', 'Coletar amostra sem necessidade.', 'Separar tecnologia de território.']
      ),
      'Grafismos e sistemas estéticos': T(
        [C('grafismo', 'Conjunto de formas e relações visuais culturalmente organizadas.'), C('sistema estético', 'Princípios locais de composição, percepção e valor, que não se reduzem a gosto individual.')],
        'Grafismos podem aparecer em cestaria, pintura corporal, cerâmica e outros suportes, mas o mesmo motivo não precisa ter função idêntica em todos. Descrição inclui repetição, simetria, sequência, contraste e relação com a forma do objeto. Significados específicos não devem ser inventados a partir da aparência.',
        'Estética é prática social. Padrões podem relacionar corpo, parentesco, gênero, ritual ou conhecimentos cosmológicos, dependendo do povo e do contexto. Fontes produzidas com artistas e especialistas indígenas são preferíveis a catálogos antigos que generalizam ou anonimizaram autores.',
        'Ao documentar um grafismo em cesto, descreva sua estrutura antes de buscar significado. Se houver explicação de artista ou comunidade, registre autoria e contexto em que a interpretação foi compartilhada.',
        ['Grafismo é sistema, não enfeite aleatório.', 'Significado é culturalmente situado.', 'Autoria e contexto da interpretação importam.'],
        ['Inventar simbolismo.', 'Misturar grafismos de povos distintos.', 'Apagar autoria indígena.']
      ),
      'Plumária e cestaria como cultura material': T(
        [C('biografia do objeto', 'Trajetória de produção, uso, circulação, coleta e transformação de um objeto.'), C('cultura material', 'Objetos e ambientes em relação às práticas e relações sociais.')],
        'Plumária e cestaria podem participar de vestuário, transporte, armazenamento, ritual, troca, brincadeira e política. Função não é fixa: um objeto pode mudar de uso ou ganhar nova importância ao entrar em mercado ou museu. Marcas de desgaste e reparo ajudam a reconstruir sua biografia.',
        'A categoria museológica “arte indígena” pode separar objetos dos usos que lhes davam sentido. Arqueologia e antropologia da materialidade procuram recuperar relações com pessoas, espaços e práticas, sem reduzir o objeto a estética ou utilidade.',
        'Uma peça plumária guardada em museu pode apresentar substituição de penas feita antes da coleta. Esse reparo faz parte de sua história e não deve ser automaticamente corrigido como defeito.',
        ['Objeto tem trajetória.', 'Uso social pode mudar.', 'Coleção museológica é etapa da biografia, não contexto original.'],
        ['Separar objeto de seus usuários.', 'Restaurar para aparência ideal sem documentação.', 'Tratar categoria de museu como categoria indígena automática.']
      ),
      'Uso social e ritual': T(
        [C('contexto ritual', 'Situação social em que objetos, pessoas, lugares e ações participam de práticas cerimoniais.'), C('restrição de acesso', 'Regras culturais sobre quem pode ver, produzir, usar ou divulgar determinados objetos e conhecimentos.')],
        'Objetos podem marcar idade, papel social, evento ritual ou relação entre grupos. A mesma peça pode ser cotidiana em um contexto e cerimonial em outro. Por isso, função deve ser documentada com fontes específicas do povo e do período, evitando generalizações pan-indígenas.',
        'Alguns conhecimentos e imagens possuem restrições de circulação. Pesquisa e museus não devem presumir que tudo pode ser fotografado ou publicado. Consentimento e protocolos locais orientam documentação, especialmente em acervos associados a práticas vivas.',
        'Se uma comunidade informa que determinado objeto não deve ser exibido publicamente, a instituição precisa considerar a restrição e revisar políticas de imagem e exposição.',
        ['Uso depende do contexto.', 'Povos indígenas possuem regras próprias de circulação de conhecimento.', 'Acesso acadêmico não significa autorização irrestrita de divulgação.'],
        ['Chamar toda plumária de ritual.', 'Publicar imagens sem acordo.', 'Supor significado apenas pela forma.']
      ),
      'Museus, coleções e direitos culturais': T(
        [C('proveniência museológica', 'História de coleta e circulação do objeto.'), C('repatriação', 'Processos de retorno de bens ou restos a comunidades ou países de origem, com bases éticas e jurídicas diversas.'), C('gestão compartilhada', 'Participação de comunidades de origem em decisões sobre acervos.')],
        'Coleções indígenas foram formadas em expedições científicas, missões, trocas, compras e contextos coloniais. Proveniência precisa investigar quem coletou, com quem, em que condições e que informações foram apagadas. A ausência de nome do artista ou da comunidade é parte da história institucional da coleção.',
        'Museus contemporâneos discutem consulta a comunidades, restrição de imagens, repatriação, acesso e gestão compartilhada. Não existe solução única: decisões dependem de documentação, legislação e vontade dos grupos relacionados. Digitalizar coleção também envolve direitos culturais.',
        'Ao catalogar um cesto identificado apenas como “índio brasileiro”, pesquise documentação original e dialogue com especialistas e comunidades para refinar a atribuição sem inventar proveniência.',
        ['Coleção tem história política.', 'Catálogo antigo pode conter categorias inadequadas.', 'Acesso e digitalização também envolvem direitos.'],
        ['Presumir posse institucional como autorização ética total.', 'Inventar autoria para preencher lacuna.', 'Disponibilizar tudo online sem avaliar sensibilidade.']
      )
    }
  );

  add(
    'opt-14-metodos-e-tecnicas-em-fotografia-e-filmagem',
    'Preparação para documentação fotográfica, audiovisual e gestão de arquivos em arqueologia. O foco é produzir registros tecnicamente consistentes, contextualizados e preserváveis, distinguindo fotografia técnica de imagem meramente ilustrativa.',
    'method',
    [
      'Defina a finalidade antes de escolher equipamento ou enquadramento.',
      'Mantenha escala, identificação, iluminação e metadados consistentes em séries técnicas.',
      'Preserve arquivos originais e organize cópias de trabalho e versões derivadas.'
    ],
    [
      C('exposição', 'Controle da quantidade de luz registrada, relacionado a abertura, tempo de exposição e sensibilidade.'),
      C('balanço de branco', 'Ajuste de referência de cor para as condições de iluminação.'),
      C('escala fotográfica', 'Referência métrica incluída em fotografia técnica quando necessária.'),
      C('metadados', 'Informações sobre arquivo, autoria, data, equipamento, localização e contexto.'),
      C('preservação digital', 'Práticas para manter arquivos íntegros, identificáveis, redundantes e acessíveis ao longo do tempo.')
    ],
    {
      'Exposição, foco e composição': T(
        [C('exposição', 'Relação entre luz, abertura, tempo e sensibilidade.'), C('foco', 'Plano ou região de nitidez selecionada conforme objetivo.')],
        'Fotografia técnica precisa registrar detalhe suficiente sem distorcer cor, forma ou textura de maneira enganosa. Exposição controla luminosidade; abertura influencia profundidade de campo; tempo de exposição afeta borrão; sensibilidade elevada pode aumentar ruído. O objetivo é escolher uma combinação adequada ao registro.',
        'Composição técnica favorece legibilidade: fundo neutro quando apropriado, câmera alinhada, objeto identificado e ausência de elementos que confundam escala. Em campo, contexto pode ser mais importante que fundo limpo. Fotografias gerais, médias e de detalhe formam sequência documental.',
        'Fotografe um fragmento cerâmico com tripé, escala e luz difusa; compare com uma foto oblíqua e observe como a perspectiva altera proporções.',
        ['Parâmetros dependem da finalidade.', 'Perspectiva pode distorcer medidas.', 'Série documental combina diferentes escalas de enquadramento.'],
        ['Usar filtro estético em registro técnico.', 'Cortar escala ou identificação.', 'Confundir fundo bonito com documentação suficiente.']
      ),
      'Documentação de campo e laboratório': T(
        [C('registro contextual', 'Fotografia que preserva relação entre objeto, unidade, perfil, estrutura ou etapa de trabalho.'), C('sequência documental', 'Conjunto ordenado de imagens que registra antes, durante e depois de uma intervenção.')],
        'No campo, fotografia registra unidades, perfis, estruturas, etapas e proveniência; no laboratório, registra estado, atributos e tratamento. Toda imagem precisa ser vinculada a ficha, unidade ou número de objeto. Sem legenda e identificação, uma boa fotografia perde grande parte do valor científico.',
        'Sequência antes-durante-depois é especialmente importante em ações irreversíveis, como escavação e conservação. Quadro de identificação pode ser útil, mas deve ser legível e não ocultar evidências. O nome do arquivo também precisa ser relacionado ao diário ou banco de dados.',
        'Antes de remover uma estrutura, faça foto geral, ortogonal e detalhes com identificação; depois registre o nível após remoção usando o mesmo sistema de referência.',
        ['Imagem deve estar vinculada ao contexto.', 'Processos irreversíveis exigem sequência.', 'Legenda faz parte do registro.'],
        ['Fotos sem legenda.', 'Registrar apenas achados visualmente chamativos.', 'Apagar imagens intermediárias que documentam o processo.']
      ),
      'Escala e padronização de fotografias técnicas': T(
        [C('escala fotográfica', 'Referência métrica posicionada no mesmo plano do objeto quando a finalidade exige comparação dimensional.'), C('padronização', 'Uso consistente de parâmetros e enquadramentos para permitir comparação.')],
        'Séries técnicas funcionam melhor quando posição, fundo, iluminação, escala e resolução são consistentes. A escala deve ficar no mesmo plano do elemento medido para reduzir erro de perspectiva. Ela não corrige distorção de lente ou inclinação da câmera.',
        'Cartas de cor podem ser úteis quando reprodução cromática é importante, mas dependem de fluxo calibrado. Para inventário, padronizar nomes, ângulos e sequência acelera comparação. O protocolo deve dizer quando a escala é obrigatória.',
        'Fotografe dez bordas cerâmicas com mesma distância e enquadramento. A padronização permite comparar forma e superfície sem reinterpretar a escala em cada imagem.',
        ['Escala precisa estar geometricamente bem posicionada.', 'Padronização melhora comparação.', 'Cor técnica depende de controle de fluxo, não apenas de uma carta visível.'],
        ['Escala fora do plano.', 'Misturar orientações.', 'Aplicar correção de cor diferente em cada foto.']
      ),
      'Captação de vídeo e áudio': T(
        [C('plano de captação', 'Planejamento de cenas, áudio, duração e finalidade antes da gravação.'), C('som direto', 'Áudio captado no momento da gravação, incluindo fala e ambiente.')],
        'Vídeo arqueológico pode documentar procedimento, entrevista, paisagem e divulgação. O planejamento define o que precisa ser demonstrado e evita gravar muitas horas sem contexto. Estabilidade e áudio claro são frequentemente mais importantes que resolução extrema.',
        'Em entrevistas, consentimento, identificação e direitos de uso precisam ser combinados. Áudio ruim pode inutilizar um relato. Arquivo bruto deve ser preservado separadamente da edição final e associado a metadados.',
        'Para registrar uma demonstração técnica, grave plano geral da pessoa, detalhes das mãos e explicação em áudio, mantendo continuidade e identificação do procedimento.',
        ['Vídeo precisa de objetivo documental.', 'Áudio é parte central do registro.', 'Consentimento e direitos de imagem devem ser planejados.'],
        ['Filmar sem monitorar áudio.', 'Editar o único arquivo sem guardar original.', 'Publicar entrevista sem autorização combinada.']
      ),
      'Organização, metadados e preservação digital': T(
        [C('metadados', 'Dados que identificam e contextualizam arquivo.'), C('preservação digital', 'Práticas para reduzir risco de perda, corrupção e obsolescência.'), C('backup 3-2-1', 'Estratégia de manter múltiplas cópias em tipos e localizações diferentes; é referência prática, não garantia absoluta.')],
        'Arquivos sem nome, data ou contexto tornam-se difíceis de usar mesmo quando tecnicamente perfeitos. Convenção de nomenclatura deve ser consistente. Metadados conectam imagem a projeto, autor, local, objeto e direitos de uso.',
        'Preservação digital inclui cópias redundantes, verificação de integridade, formatos adequados e migração. Cartão de memória não é arquivo permanente. Também é importante separar original, versão editada e exportação para publicação, evitando sobrescrever o único registro.',
        'Após trabalho de campo, copie imagens para localizações diferentes, mantenha estrutura por data ou unidade e gere banco que relacione nome do arquivo à ficha arqueológica.',
        ['Arquivo digital precisa de contexto e redundância.', 'Original não deve ser sobrescrito.', 'Preservação é processo contínuo.'],
        ['Guardar tudo apenas no celular ou cartão.', 'Renomear arquivos sem manter vínculo com ficha.', 'Excluir brutos após editar vídeo.']
      )
    }
  );

  Object.entries(packs).forEach(([id, pack]) => { STUDY[id] = pack; });
  Object.entries(deep).forEach(([id, content]) => { LESSONS.deep[id] = content; });
})();
