import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { getTestesDaObra, obras, OBRA_PRINCIPAL } from '@/mocks/data'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'

export function Relatorio() {
  const { id = 'rel-2026-06' } = useParams()
  const { usuario, naoConformidades, vistorias } = useApp()
  const obra = obras.find((o) => o.id === OBRA_PRINCIPAL)!
  const testes = getTestesDaObra(obra.id)
  const ncs = naoConformidades.filter((n) => n.obraId === obra.id)
  const vistoriasObra = vistorias.filter((v) => v.obraId === obra.id)

  const baixar = () =>
    toast.success('Download iniciado', { description: `${id}.pdf · 24 páginas` })

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={`/obras/${obra.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar à obra
      </Link>

      <PageHeader
        number="09"
        title="Relatório de conformidade"
        subtitle={`${obra.nome} · documento ${id}`}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir
            </Button>
            <Button onClick={baixar}>
              <Download className="size-4" /> Baixar PDF
            </Button>
          </>
        }
      />

      <Tabs defaultValue="consolidado">
        <TabsList>
          <TabsTrigger value="pbqph">PBQP-H</TabsTrigger>
          <TabsTrigger value="nbr">NBR 15575</TabsTrigger>
          <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
        </TabsList>

        <TabsContent value="pbqph">
          <Pagina titulo="Dossiê de qualidade — PBQP-H / SiAC" obra={obra} responsavel={usuario.nome}>
            <Secao numero="1" titulo="Escopo do sistema de gestão da qualidade">
              <p>
                Este dossiê apresenta os registros de controle de execução dos serviços controlados do
                empreendimento {obra.nome}, mantidos conforme os requisitos do SiAC — Sistema de
                Avaliação da Conformidade de Empresas de Serviços e Obras da Construção Civil, no
                nível {obra.nivelPbqph}.
              </p>
            </Secao>

            <Secao numero="2" titulo="Controle de execução de serviços">
              <Tabela
                cabecalho={['Serviço', 'Unidade', 'Data', 'Responsável', 'Resultado']}
                linhas={vistoriasObra.slice(0, 8).map((v) => [
                  v.servico,
                  v.unidadeLabel,
                  formatDate(v.data),
                  v.engenheiro,
                  <StatusBadge key={v.id} status={v.conformidade} size="sm" />,
                ])}
              />
            </Secao>

            <Secao numero="3" titulo="Tratativa de não conformidades">
              <p className="mb-4">
                Foram registradas {ncs.length} não conformidades no período, das quais{' '}
                {ncs.filter((n) => n.status === 'fechada').length} já se encontram encerradas com
                evidência de ação corretiva.
              </p>
              <Tabela
                cabecalho={['Código', 'Descrição', 'Severidade', 'Prazo', 'Situação']}
                linhas={ncs
                  .filter((n) => n.familiaNorma === 'PBQP-H')
                  .map((n) => [
                    <span key={n.id} className="font-mono text-[11px]">{n.codigo}</span>,
                    n.titulo,
                    <SeveridadeBadge key={`${n.id}-s`} severidade={n.severidade} />,
                    formatDate(n.prazo),
                    n.status === 'fechada' ? 'Encerrada' : n.status === 'aberta' ? 'Aberta' : 'Em correção',
                  ])}
              />
            </Secao>

            <Secao numero="4" titulo="Conclusão">
              <p>
                O sistema de gestão da qualidade permanece aderente aos requisitos do SiAC. As
                não conformidades em aberto possuem plano de ação definido, responsável designado e
                prazo de tratativa registrado no sistema.
              </p>
            </Secao>
          </Pagina>
        </TabsContent>

        <TabsContent value="nbr">
          <Pagina titulo="Laudo de desempenho — NBR 15575" obra={obra} responsavel={usuario.nome}>
            <Secao numero="1" titulo="Objeto">
              <p>
                Verificação do atendimento aos requisitos de desempenho da ABNT NBR 15575 para os
                sistemas construtivos do empreendimento, abrangendo os eixos térmico, acústico, de
                estanqueidade e estrutural.
              </p>
            </Secao>

            <Secao numero="2" titulo="Ensaios executados">
              <Tabela
                cabecalho={['Código', 'Ensaio', 'Norma', 'Medido', 'Nível', 'Resultado']}
                linhas={testes.map((t) => [
                  <span key={t.id} className="font-mono text-[11px]">{t.codigo}</span>,
                  t.nome,
                  <NormaChip key={`${t.id}-n`} codigo={t.norma} />,
                  t.valorMedido !== undefined ? (
                    <span className="font-mono text-[11px]">
                      {t.valorMedido.toLocaleString('pt-BR')} {t.unidade}
                    </span>
                  ) : (
                    '—'
                  ),
                  t.nivel ?? '—',
                  t.resultado === 'aprovado'
                    ? 'Aprovado'
                    : t.resultado === 'reprovado'
                      ? 'Reprovado'
                      : 'Pendente',
                ])}
              />
            </Secao>

            <Secao numero="3" titulo="Análise dos resultados">
              <p className="mb-3">
                Dos {testes.length} ensaios previstos, {testes.filter((t) => t.resultado === 'aprovado').length}{' '}
                atenderam aos critérios normativos e{' '}
                {testes.filter((t) => t.resultado === 'reprovado').length} foram reprovados,
                demandando ação corretiva e reensaio.
              </p>
              <ul className="space-y-2">
                {testes
                  .filter((t) => t.justificativa)
                  .map((t) => (
                    <li key={t.id} className="border-l-2 border-emerald-400/40 pl-3">
                      <span className="font-mono text-[11px] text-muted-foreground">{t.codigo}</span>
                      <p className="mt-0.5">{t.justificativa}</p>
                    </li>
                  ))}
              </ul>
            </Secao>

            <Secao numero="4" titulo="Conclusão técnica">
              <p>
                Os sistemas ensaiados atendem majoritariamente aos níveis Mínimo e Intermediário da
                ABNT NBR 15575. Os ensaios reprovados possuem não conformidade aberta com prazo de
                correção e reensaio previsto antes da entrega das unidades.
              </p>
            </Secao>
          </Pagina>
        </TabsContent>

        <TabsContent value="consolidado">
          <Pagina titulo="Relatório consolidado de conformidade" obra={obra} responsavel={usuario.nome}>
            <Secao numero="1" titulo="Sumário executivo">
              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <Indicador valor={`${obra.conformidade}%`} label="Conformidade global" />
                <Indicador valor={String(ncs.filter((n) => n.status !== 'fechada').length)} label="NCs em aberto" />
                <Indicador
                  valor={`${testes.filter((t) => t.resultado === 'aprovado').length}/${testes.length}`}
                  label="Ensaios aprovados"
                />
              </div>
              <p>
                O empreendimento {obra.nome} apresenta {obra.conformidade}% de conformidade global no
                período, acima da meta contratual de 85%. O eixo estrutural é o de melhor desempenho e o
                eixo térmico concentra a maior parte das pendências.
              </p>
            </Secao>

            <Secao numero="2" titulo="Desempenho por eixo da NBR 15575">
              <div className="space-y-4">
                <Progress value={94} label="Estrutural" showValue />
                <Progress value={71} label="Acústico" showValue />
                <Progress value={68} label="Estanqueidade" showValue />
                <Progress value={62} label="Térmico" showValue />
              </div>
            </Secao>

            <Secao numero="3" titulo="Não conformidades por severidade">
              <Tabela
                cabecalho={['Severidade', 'Abertas', 'Em correção', 'Fechadas']}
                linhas={(['critica', 'alta', 'media', 'baixa'] as const).map((s) => [
                  <SeveridadeBadge key={s} severidade={s} />,
                  String(ncs.filter((n) => n.severidade === s && n.status === 'aberta').length),
                  String(ncs.filter((n) => n.severidade === s && n.status === 'em_correcao').length),
                  String(ncs.filter((n) => n.severidade === s && n.status === 'fechada').length),
                ])}
              />
            </Secao>

            <Secao numero="4" titulo="Recomendações">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Priorizar a correção das NCs críticas de estanqueidade antes do início do acabamento.</li>
                <li>Revisar o sistema de vedação da fachada oeste para atender à transmitância normativa.</li>
                <li>Reensaiar o isolamento acústico da parede geminada após o preenchimento das juntas.</li>
                <li>Manter o registro fotográfico obrigatório em todas as etapas de impermeabilização.</li>
              </ul>
            </Secao>
          </Pagina>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ------------------------------------------------------------- página A4 */

function Pagina({
  titulo,
  obra,
  responsavel,
  children,
}: {
  titulo: string
  obra: (typeof obras)[number]
  responsavel: string
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto max-w-3xl rounded-lg border bg-surface p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] sm:p-12">
      <header className="mb-8 flex items-start justify-between gap-6 border-b pb-6">
        <div className="flex items-center gap-3">
          <Logo className="size-9" />
          <div>
            <p className="text-lg font-extrabold tracking-tighter">ObraCheck</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              relatório de conformidade
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] text-muted-foreground">
          <p>emitido em {new Date().toLocaleDateString('pt-BR')}</p>
          <p className="mt-0.5">{obra.codigo} · {obra.nivelPbqph}</p>
        </div>
      </header>

      <h2 className="text-2xl font-extrabold tracking-tighter">{titulo}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {obra.nome} — {obra.endereco}, {obra.cidade}
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">{children}</div>

      <footer className="mt-12 border-t pt-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="h-10 w-56 border-b border-dashed" />
            <p className="mt-2 text-sm font-semibold">{responsavel}</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              responsável técnico · assinatura digital
            </p>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            documento gerado eletronicamente · página 1 de 24
          </p>
        </div>
      </footer>
    </article>
  )
}

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-baseline gap-2 text-base font-bold tracking-tight">
        <span className="font-mono text-emerald-400">{numero}.</span>
        {titulo}
      </h3>
      <div className="text-muted-foreground [&_p]:leading-relaxed">{children}</div>
    </section>
  )
}

function Tabela({
  cabecalho,
  linhas,
}: {
  cabecalho: string[]
  linhas: React.ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-left text-xs">
        <thead className="border-b bg-surface-2/50">
          <tr>
            {cabecalho.map((c) => (
              <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold uppercase tracking-wider text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i} className="border-b last:border-0">
              {linha.map((celula, j) => (
                <td key={j} className="px-3 py-2 align-middle text-foreground">
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Indicador({ valor, label }: { valor: string; label: string }) {
  return (
    <div className="rounded-md border p-4 text-center">
      <p className="font-mono text-2xl font-bold tracking-tighter text-emerald-400">{valor}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}
