import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Droplets,
  MessageCircle,
  RotateCcw,
  Ruler,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { waLink } from "@/lib/contact";
import {
  formatGrams,
  formatKg,
  formatLiters,
  litersFromInput,
  type DepthInput,
} from "@/lib/calculations/volume";
import {
  MANUFACTURER_NOTICE,
  RECOMMENDED_FILTRATION_HOURS,
  evaluateSalt,
  shockChlorineGrams,
} from "@/lib/calculations/chemicals";
import { DIAGNOSES, getDiagnosis, type DiagnosisId } from "@/lib/diagnostics";
import { PARAMETERS, classifyPh, type ParameterKey } from "@/lib/pool-parameters";
import { buildGreenWaterProtocol } from "@/lib/protocols/green-water";
import { analyzeChlorinator } from "@/lib/chlorinator";
import {
  CHLORINATOR_MODELS,
  MODEL_TARGET_SALINITY_PPM,
  findErrorCode,
  type ChlorinatorModel,
} from "@/lib/chlorinator/codes";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "PoolHaus SmartPool — Calculadora de piscinas | Uruguay" },
      {
        name: "description",
        content:
          "Calculá el volumen de tu piscina, el cloro shock, la sal y seguí el protocolo PoolHaus para agua verde. Asistente gratuito de PoolHaus Uruguay.",
      },
      { property: "og:title", content: "PoolHaus SmartPool — Calculadora de piscinas" },
      {
        property: "og:description",
        content:
          "Volumen, cloro shock, sal, diagnósticos y protocolo de agua verde. Asistente gratuito de PoolHaus Uruguay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartPool,
});

const STEPS = ["Volumen", "Diagnóstico", "Parámetros", "Resultado"] as const;

type Values = Partial<Record<ParameterKey, string>>;

function SmartPool() {
  const [step, setStep] = useState(0);

  // Paso 1 — volumen
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depthMode, setDepthMode] = useState<"uniforme" | "variable">("uniforme");
  const [depth, setDepth] = useState("");
  const [minDepth, setMinDepth] = useState("");
  const [maxDepth, setMaxDepth] = useState("");

  // Paso 2 — diagnóstico
  const [diagnosisId, setDiagnosisId] = useState<DiagnosisId | null>(null);

  // Paso 3 — parámetros
  const [values, setValues] = useState<Values>({});

  // Herramientas
  const [targetPpm, setTargetPpm] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState<ChlorinatorModel>("EC08");
  const [code, setCode] = useState("");
  const [decanted, setDecanted] = useState<boolean | null>(null);

  const num = (v: string) => {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const depthInput: DepthInput =
    depthMode === "uniforme"
      ? { mode: "uniforme", depth: num(depth) }
      : { mode: "variable", minDepth: num(minDepth), maxDepth: num(maxDepth) };

  const liters = useMemo(() => {
    const l = num(length);
    const w = num(width);
    const d =
      depthMode === "uniforme"
        ? num(depth)
        : (num(minDepth) + num(maxDepth)) / 2;
    if (!l || !w || !d || [l, w, d].some((x) => Number.isNaN(x) || x <= 0)) return 0;
    return litersFromInput(l, w, depthInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, width, depth, minDepth, maxDepth, depthMode]);

  const volumeReady = liters > 0;
  const diagnosis = diagnosisId ? getDiagnosis(diagnosisId) : null;

  const ph = values.ph ? num(values.ph) : NaN;
  const phReading = Number.isFinite(ph) && values.ph ? classifyPh(ph) : null;

  const shockGrams = volumeReady ? shockChlorineGrams(liters) : 0;

  const currentPpm = values.salinidad ? num(values.salinidad) : NaN;
  const target = targetPpm ? num(targetPpm) : NaN;
  const saltResult =
    volumeReady && Number.isFinite(currentPpm) && Number.isFinite(target) && targetPpm !== ""
      ? evaluateSalt(liters, currentPpm, target)
      : null;

  const chlorinator =
    diagnosis?.tool === "clorador"
      ? analyzeChlorinator({
          brand,
          model,
          code,
          liters,
          currentPpm: Number.isFinite(currentPpm) && values.salinidad ? currentPpm : null,
          targetPpm: Number.isFinite(target) && targetPpm !== "" ? target : null,
        })
      : null;

  const errorInfo =
    diagnosis?.tool === "clorador" && code.trim() !== "" ? findErrorCode(model, code) : null;

  const protocol =
    diagnosis?.protocol === "agua-verde" && volumeReady
      ? buildGreenWaterProtocol({ liters, ph: Number.isFinite(ph) ? ph : undefined })
      : null;

  const waMessage = () => {
    const lines = [
      "Hola PoolHaus, usé SmartPool y estos son mis datos:",
      `Volumen: ${formatLiters(liters)}`,
      diagnosis ? `Situación: ${diagnosis.label}` : null,
      ...(Object.keys(values) as ParameterKey[])
        .filter((k) => values[k])
        .map((k) => `${PARAMETERS[k].label}: ${values[k]}${PARAMETERS[k].unit ? " " + PARAMETERS[k].unit : ""}`),
      volumeReady ? `Cloro shock calculado: ${formatGrams(shockGrams)}` : null,
      saltResult?.kind === "agregar" ? `Sal a agregar: ${formatKg(saltResult.kg)}` : null,
      "¿Me ayudan a confirmar el tratamiento?",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const reset = () => {
    setStep(0);
    setLength("");
    setWidth("");
    setDepth("");
    setMinDepth("");
    setMaxDepth("");
    setDepthMode("uniforme");
    setDiagnosisId(null);
    setValues({});
    setTargetPpm("");
    setBrand("");
    setModel("EC08");
    setCode("");
    setDecanted(null);
  };

  const canNext =
    step === 0 ? volumeReady : step === 1 ? diagnosisId !== null : true;

  const params = diagnosis?.parameters ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Calculator className="h-3.5 w-3.5" /> PoolHaus SmartPool
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Calculadora y asistente de piscinas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Volumen, cloro shock, sal, diagnósticos y protocolo de agua verde.
          </p>
        </div>

        {/* PROGRESO */}
        <div className="mt-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step + 1) / STEPS.length) * 100}%`,
                background: "var(--gradient-violet)",
              }}
            />
          </div>
          <ol className="mt-3 grid grid-cols-4 gap-1 text-[11px] sm:text-xs">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={`flex items-center justify-center gap-1 rounded-md px-1 py-1 text-center font-semibold ${
                  i === step
                    ? "bg-primary/15 text-primary"
                    : i < step
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {i < step && <Check className="h-3 w-3 shrink-0" />}
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-violet)] sm:p-7">
          {/* PASO 1 */}
          {step === 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Ruler className="h-5 w-5 text-primary" /> Medidas de tu piscina
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingresá las medidas en metros del espejo de agua.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Largo (m)" value={length} onChange={setLength} placeholder="7" />
                <Field label="Ancho (m)" value={width} onChange={setWidth} placeholder="3" />
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-sm font-semibold">Profundidad</span>
                <div className="grid grid-cols-2 gap-2">
                  {(["uniforme", "variable"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDepthMode(m)}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition ${
                        depthMode === m
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {depthMode === "uniforme" ? (
                  <Field label="Profundidad (m)" value={depth} onChange={setDepth} placeholder="1.4" />
                ) : (
                  <>
                    <Field label="Profundidad mínima (m)" value={minDepth} onChange={setMinDepth} placeholder="1.2" />
                    <Field label="Profundidad máxima (m)" value={maxDepth} onChange={setMaxDepth} placeholder="1.6" />
                  </>
                )}
              </div>

              <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Volumen estimado
                </p>
                <p className="mt-1 text-3xl font-black">
                  {volumeReady ? formatLiters(liters) : "—"}
                </p>
                {depthMode === "variable" && volumeReady && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Calculado con profundidad promedio.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* PASO 2 */}
          {step === 1 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Stethoscope className="h-5 w-5 text-primary" /> ¿Qué le pasa al agua?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Elegí la situación más parecida a la de tu piscina.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {DIAGNOSES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDiagnosisId(d.id);
                      setValues({});
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      diagnosisId === d.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-bold">
                      <span className="mr-1.5">{d.emoji}</span>
                      {d.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{d.summary}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* PASO 3 */}
          {step === 2 && diagnosis && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Droplets className="h-5 w-5 text-primary" /> Parámetros del agua
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {params.length > 0
                  ? "Completá solo lo que puedas medir. Podés continuar sin todos los datos."
                  : "Esta situación no requiere parámetros. Continuá al resultado."}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {params.map((k) => (
                  <Field
                    key={k}
                    label={`${PARAMETERS[k].label}${PARAMETERS[k].unit ? ` (${PARAMETERS[k].unit})` : ""}`}
                    value={values[k] ?? ""}
                    onChange={(v) => setValues((s) => ({ ...s, [k]: v }))}
                    placeholder={PARAMETERS[k].placeholder}
                    help={PARAMETERS[k].help}
                  />
                ))}
              </div>

              {diagnosis.tool === "sal" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Salinidad objetivo del fabricante (ppm)"
                    value={targetPpm}
                    onChange={setTargetPpm}
                    placeholder="3000"
                    help="Lo indica el manual de tu clorador."
                  />
                </div>
              )}

              {diagnosis.tool === "clorador" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Marca del clorador" value={brand} onChange={setBrand} placeholder="Marca" type="text" />
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Modelo</label>
                    <div className="flex gap-2">
                      {CHLORINATOR_MODELS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setModel(m)}
                          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                            model === m
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Salinidad objetivo de referencia: {MODEL_TARGET_SALINITY_PPM} ppm.
                    </p>
                  </div>
                  <Field label="Código de error" value={code} onChange={setCode} placeholder="E4" type="text" />
                  <Field
                    label="Salinidad objetivo del fabricante (ppm)"
                    value={targetPpm}
                    onChange={setTargetPpm}
                    placeholder="3000"
                  />
                </div>
              )}

              {phReading && (
                <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
                  <p className="text-sm font-bold">pH: {phReading.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{phReading.advice}</p>
                </div>
              )}
            </section>
          )}

          {/* PASO 4 */}
          {step === 3 && diagnosis && (
            <section>
              <h2 className="text-xl font-bold">
                {diagnosis.emoji} {diagnosis.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{diagnosis.summary}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Stat label="Volumen" value={formatLiters(liters)} />
                <Stat label="Cloro shock (100 g / 10.000 L)" value={formatGrams(shockGrams)} />
              </div>

              {phReading && (
                <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
                  <p className="text-sm font-bold">pH {values.ph}: {phReading.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{phReading.advice}</p>
                </div>
              )}

              {protocol && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Protocolo PoolHaus paso a paso</h3>
                  <ol className="mt-3 space-y-3">
                    {protocol.map((s) => (
                      <li key={s.n} className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm font-bold">
                          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {s.n}
                          </span>
                          {s.title}
                        </p>
                        {s.body.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {s.body.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                        {s.question && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold">{s.question.text}</p>
                            <div className="mt-2 flex gap-2">
                              {[
                                { l: "Sí", v: true },
                                { l: "No", v: false },
                              ].map((o) => (
                                <button
                                  key={o.l}
                                  type="button"
                                  onClick={() => setDecanted(o.v)}
                                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    decanted === o.v
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  {o.l}
                                </button>
                              ))}
                            </div>
                            {decanted !== null && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {decanted ? s.question.yes : s.question.no}
                              </p>
                            )}
                          </div>
                        )}
                        {s.notice && (
                          <p className="mt-3 flex gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                            <TriangleAlert className="h-4 w-4 shrink-0 text-primary" />
                            {s.notice}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {diagnosis.guidance && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Qué hacer</h3>
                  <ul className="mt-3 space-y-2">
                    {diagnosis.guidance.map((g) => (
                      <li key={g} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Filtración recomendada: aproximadamente {RECOMMENDED_FILTRATION_HOURS} horas.
                  </p>
                </div>
              )}

              {diagnosis.tool === "sal" && (
                <div className="mt-6 rounded-xl border border-border bg-background p-4">
                  <h3 className="text-lg font-bold">Cálculo de sal</h3>
                  {saltResult ? (
                    <p className="mt-2 text-sm">
                      {saltResult.kind === "agregar" && (
                        <>
                          Agregá aproximadamente <strong>{formatKg(saltResult.kg)}</strong> de sal.
                        </>
                      )}
                      {saltResult.kind === "en-rango" &&
                        "La salinidad ya está en el objetivo indicado: no agregues sal."}
                      {saltResult.kind === "excedido" && (
                        <>
                          Estás <strong>{formatKg(saltResult.kg)}</strong> por encima del objetivo. No
                          agregues sal: corregí diluyendo con agua.
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ingresá la salinidad actual y la objetivo del fabricante para calcular la sal.
                    </p>
                  )}
                </div>
              )}

              {chlorinator && (
                <div className="mt-6 rounded-xl border border-border bg-background p-4">
                  <h3 className="text-lg font-bold">Error del clorador</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{chlorinator.message}</p>
                  {chlorinator.salt?.kind === "agregar" && (
                    <p className="mt-2 text-sm">
                      Sal a agregar: <strong>{formatKg(chlorinator.salt.kg)}</strong>
                    </p>
                  )}
                  {errorInfo ? (
                    <div className="mt-4 rounded-xl border border-primary/40 bg-secondary/40 p-4">
                      <p className="text-sm font-black text-primary">
                        {model} · Código {errorInfo.code}
                      </p>
                      <dl className="mt-3 space-y-2 text-sm">
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Causa</dt>
                          <dd className="font-medium">{errorInfo.meaning}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Valor normal</dt>
                          <dd className="font-medium">{errorInfo.normal}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Solución</dt>
                          <dd className="font-medium">{errorInfo.solution}</dd>
                        </div>
                      </dl>
                      {errorInfo.manual && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Este código suele requerir servicio técnico: escribinos por WhatsApp si persiste.
                        </p>
                      )}
                    </div>
                  ) : (
                    code.trim() !== "" && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        No encontramos el código “{code}” en la tabla de {model}. Verificá el manual del equipo.
                      </p>
                    )
                  )}
                  <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    {chlorinator.disclaimer}
                  </p>
                </div>
              )}

              <p className="mt-6 flex gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                <TriangleAlert className="h-4 w-4 shrink-0 text-primary" />
                {MANUFACTURER_NOTICE}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink(waMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <MessageCircle className="h-5 w-5" /> Enviar diagnóstico por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-4 text-sm font-semibold transition hover:border-primary"
                >
                  <RotateCcw className="h-4 w-4" /> Empezar de nuevo
                </button>
              </div>
            </section>
          )}

          {/* NAV */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:border-primary disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
            {step < STEPS.length - 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
              >
                Continuar <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Querés una piscina PoolHaus?{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">
            Ver modelos e instalación
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  help,
  type = "number",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  help?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
      />
      {help && <p className="mt-1 text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
