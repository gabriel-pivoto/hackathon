# ObraCheck — frontend navegável

Plataforma de gestão de qualidade e conformidade para construtoras de pequeno e médio porte,
cobrindo **PBQP-H** (processo) e **NBR 15575** (desempenho da edificação).

Esta é a **fase 1**: só frontend. Não existe backend, banco nem autenticação real. Todos os dados
vivem em `src/mocks/` e as chamadas de IA são simuladas com `setTimeout` sobre cenários pré-baked.

## Como rodar

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Qualquer e-mail e senha entram — a tela de login não valida nada.

Outros comandos:

```bash
npm run build     # tsc -b + vite build
npm run preview   # serve a build de produção
```

## Perfis

O seletor no header alterna entre três perfis. A identidade muda junto, o menu se
reorganiza e as ações operacionais são liberadas ou bloqueadas.

| Perfil | Quem é | O que vê |
| --- | --- | --- |
| 👨‍💼 Engenheiro | Carlos Silva | O app completo, mais a fila de mensagens do campo |
| 🏢 Gestor | Ana Rodrigues | Portfólio consolidado, sem executar nada em campo |

O operário **não tem perfil na plataforma**. Ele fala pelo WhatsApp do ObraCheck,
mandando foto, áudio ou texto, e a mensagem cai na fila de validação do
engenheiro em "Vindo do campo". A página `/reportar/:obraCode` é o destino do QR
code afixado no canteiro: identifica a obra e abre a conversa no WhatsApp já com
o código da obra na primeira mensagem.

O perfil fica em `localStorage` (`obracheck.role`) e o padrão é `engenheiro`.
As rotas de execução (nova vistoria, ensaio, checklist) são protegidas por
`<RequireRole allowed={['engenheiro']}>`: o gestor é redirecionado com um toast.
As demais rotas são comuns aos dois perfis e não têm guard, porque um guard que
nunca bloqueia engana quem lê o roteador.

A fila de mensagens vive apenas em memória, de propósito. Ela sobrevive à troca
de perfil, que é o que a demo precisa, e um F5 devolve o estado inicial com as
datas recalculadas. Persistir congelaria os "há 2 h" do seed no dia da gravação.

## Roteiro sugerido para o pitch

> **A transição que vende a solução:** abra `/reportar/VV-2024` no celular para
> mostrar como o operário entra pelo QR code do canteiro, direto no WhatsApp.
> Volte ao dashboard do Engenheiro e mostre as mensagens dele chegando em "Vindo
> do campo" — foto e áudio já transcrito —, com um clique para virar não
> conformidade. Troque para Gestor e mostre o portfólio com o ranking de risco.

1. **`/login`** — entrar (o usuário Eng. Carlos Silva já vem preenchido).
2. **`/`** — dashboard com KPIs, conformidade por eixo da NBR 15575 e feed de atividade.
3. **`/obras/obra-001/vistoria/nova`** — o coração da demo:
   - escolher unidade e serviço, iniciar a captura;
   - **Fotografar** → escolher "Fissura em alvenaria" → loading de ~2,5 s → card de análise
     com norma, severidade, ação sugerida e confiança;
   - **Gravar áudio** → a gravação para sozinha em 3 s → transcrição + estruturação em NC;
   - anexar as duas evidências e **Salvar vistoria** (leva ao detalhe da vistoria criada).
4. **`/obras/obra-001/testes/tst-001`** — o efeito visual mais forte: **Iniciar teste** dispara o
   sonômetro animado por 5 s, a leitura estabiliza em 42 dB, o campo de valor medido é preenchido
   sozinho e o **Validar com IA** reprova o ensaio citando a NBR 15575-3, gerando o laudo.
5. **`/obras/obra-001/nao-conformidades`** — kanban com drag & drop entre Aberta, Em correção e Fechada.
6. **`/notificacoes`** — prévia real da mensagem de WhatsApp que foi disparada.
7. **`/reportar/VV-2024`** — página pública do operário (abrir em tela estreita, é mobile-first).
8. **`/relatorios/rel-2026-06`** — relatório em três abas, com layout de página A4.

O toggle claro/escuro fica no header e persiste em `localStorage`.

## Rotas

| Rota | Página |
| --- | --- |
| `/login` | Login (sem validação) |
| `/` | Dashboard |
| `/obras` | Lista de obras |
| `/obras/:id` | Detalhe da obra (6 abas) |
| `/obras/:id/vistoria/nova` | Fluxo de nova vistoria |
| `/obras/:id/vistoria/:vid` | Detalhe da vistoria |
| `/obras/:id/checklist/:cid` | Checklist digital |
| `/obras/:id/testes` | Grade de ensaios NBR 15575 |
| `/obras/:id/testes/:tid` | Execução guiada do ensaio |
| `/obras/:id/nao-conformidades` | Kanban de NCs |
| `/notificacoes` | Central de notificações |
| `/reportar/:obraCode` | QR code do canteiro: leva o operário ao WhatsApp |
| `/relatorios/:id` | Visualizador de relatório |

## Estrutura

```
src/
├── components/
│   ├── ui/         Button, Card, Dialog, Tabs, Input, Select, Progress, Badge,
│   │               Skeleton, Tooltip
│   ├── guards/     RequireRole (rota), AcaoRestrita (controle desabilitado + tooltip)
│   ├── layout/     AppLayout (sidebar + header), PublicLayout, Logo
│   ├── shared/     StatusBadge, NormaChip, SeveridadeBadge, KPICard, PageHeader,
│   │               BlueprintBackground, SmartImage, MetaRow, EmptyState
│   └── features/   AIAnalysisCard, EvidenceItem, TestCard, SoundMeter, AudioWaveform,
│                   WhatsAppPreview, KanbanNC, FilaReportes, VisaoConsolidada
├── pages/          uma por rota
├── mocks/
│   ├── data.ts     obras, unidades, vistorias, NCs, ensaios, checklists, notificações, feed
│   ├── ai.ts       cenários pré-baked de análise + `analisarFoto`, `transcreverAudio`, `validarTeste`
│   ├── photos.ts   banco de imagens
│   ├── envios.ts   fila inicial de mensagens recebidas no WhatsApp
│   └── users.ts    equipe e os 3 perfis do seletor
├── types/          tipos de todo o domínio
├── context/        AppContext (tema, obra ativa, NCs, checklists, notificações,
│                   fila de envios) e RoleContext (perfil e identidade)
└── lib/utils.ts    cn, formatação de datas
```

## Dados mockados

Obra principal: **Residencial Vista Verde**, Santa Rita do Sapucaí/MG, 2 torres e 40 unidades.
Mais 3 obras aparecem na listagem. O conjunto tem 20 vistorias, 15 não conformidades em estados e
severidades variados, 8 ensaios NBR 15575 cobrindo as 4 categorias (3 aprovados, 2 reprovados,
3 pendentes), 12 notificações, 2 checklists e 5 mensagens de WhatsApp na fila
do engenheiro (foto e áudio transcrito).

As datas são geradas relativas ao momento de execução, então a demo nunca parece velha.

## Simulação da IA

`src/mocks/ai.ts` traz 10 cenários de foto, entre eles os 5 oferecidos na tela de captura:

| Foto | Resultado | Norma | Severidade |
| --- | --- | --- | --- |
| Fissura em alvenaria | não conforme | NBR 15575-4 | alta |
| Infiltração em banheiro | não conforme | NBR 15575-6 | crítica |
| Assentamento cerâmico | conforme (nível I) | NBR 15575-3 | baixa |
| Instalação elétrica exposta | não conforme | PBQP-H / SiAC 4.2 | média |
| Reboco irregular | requer análise | NBR 15575-1 | baixa |

Para áudio há 3 transcrições com a estruturação completa já pronta.

`validarTeste` é o único helper que de fato calcula: compara o valor medido com os três critérios
do ensaio, respeita a direção do critério (maior-melhor ou menor-melhor) e devolve o nível M/I/S
com a justificativa citando a norma.

## Linguagem visual

A tela é densa por natureza (norma, severidade, prazo, evidência), então a
hierarquia faz o trabalho pesado:

- **Caixa alta e `font-mono` são reservadas.** Mono só para valor técnico —
  código de norma, medição, ID, timestamp. Caixa alta só para chrome de
  instrumento (o sonômetro) e de documento (o relatório). Legenda comum usa as
  classes `.label` e `.label-sm`, que separam por peso e cor em vez de gritar.
- **Um sinal por indicador.** O `KPICard` mostra a variação ou a barra de
  progresso, nunca as duas: elas diziam a mesma coisa duas vezes.
- **O embasamento normativo fica a um clique.** O `AIAnalysisCard` abre com o
  que é, se está conforme e o que fazer; requisito, item da norma e tags vivem
  atrás de "Embasamento normativo".
- **Borda é o último recurso.** Cartão e chip se separam por fundo e espaço;
  a borda entrou só onde o agrupamento não se lê sem ela.

## Notas de implementação

- Os componentes de `ui/` seguem a API do shadcn/ui, mas foram escritos à mão sobre Radix para
  evitar o passo de geração do CLI. Trocar por componentes do shadcn depois é direto.
- As fotos vêm do Unsplash. `<SmartImage />` troca por uma placa técnica se a imagem não carregar,
  então uma rede ruim no dia do pitch não deixa ícone quebrado na tela.
- O sonômetro em `SoundMeter.tsx` é animação pura: converge do ruído inicial para o valor final do
  cenário. Não mede áudio de verdade.
- O drag & drop do kanban usa a API nativa de HTML5, sem biblioteca.
- `color-scheme` é declarado nos dois temas. Sem isso o Chromium desenha
  `select`, `input` e barra de rolagem com o tema claro do sistema, abrindo
  caixas brancas no meio do layout escuro.
- As imagens do Unsplash foram conferidas uma a uma (todas respondem 200). Se
  alguma morrer, o `SmartImage` cobre — e a legenda do fallback só aparece
  quando há espaço, via container query em `.img-fallback`.
