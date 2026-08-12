import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Flame, Sparkles, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const sevColor = {
  low: "#4A6741",
  moderate: "#DDA76A",
  severe: "#D97757",
};

const sevIcon = {
  low: CheckCircle2,
  moderate: AlertTriangle,
  severe: Flame,
};

export default function DiagnosisResult({ data }) {
  if (!data) return null;
  const SevIcon = data.is_healthy ? CheckCircle2 : sevIcon[data.severity] || AlertTriangle;
  const color = data.is_healthy ? "#4A6741" : sevColor[data.severity] || "#4A6741";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-5 gap-6"
      data-testid="diagnosis-result"
    >
      {/* Left: hero result */}
      <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-botanical-forest/10 bg-white shadow-[0_8px_30px_rgba(30,63,32,0.05)]">
        <div className="relative aspect-square">
          <img src={data.image_data_url} alt="leaf" className="w-full h-full object-cover" data-testid="result-image" />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-botanical-ink" data-testid="result-plant-badge">
            {data.plant}
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs tracking-[0.25em] uppercase text-botanical-moss font-semibold">Diagnosis</p>
          <h3 className="font-serif text-3xl mt-2 text-botanical-ink" data-testid="result-disease-name">{data.disease_name}</h3>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5" style={{ color }}>
              <SevIcon className="w-4 h-4" />
              <span className="capitalize font-semibold" data-testid="result-severity-label">
                {data.is_healthy ? "Healthy" : data.severity}
              </span>
            </div>
            <span className="text-botanical-muted">·</span>
            <span className="text-botanical-muted" data-testid="result-confidence">{data.confidence}% confidence</span>
          </div>
        </div>
      </div>

      {/* Right: bento data */}
      <div className="lg:col-span-3 grid grid-rows-[auto_1fr] gap-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-botanical-forest/10 p-6 shadow-[0_8px_30px_rgba(30,63,32,0.04)]">
            <p className="text-xs tracking-[0.25em] uppercase text-botanical-moss font-semibold">Severity</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-serif text-5xl text-botanical-ink" data-testid="result-severity-score">{data.severity_score}</span>
              <span className="text-botanical-muted text-sm">/ 100</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-botanical-bg2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.severity_score}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-botanical-forest text-white p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-botanical-moss/50 blur-3xl" />
            <p className="text-xs tracking-[0.25em] uppercase text-botanical-sage font-semibold relative">Symptoms observed</p>
            <ul className="mt-4 space-y-2 text-sm text-white/90 relative">
              {(data.symptoms || []).map((s, i) => (
                <li key={i} className="flex gap-2" data-testid={`symptom-${i}`}>
                  <span className="text-botanical-sage">·</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-botanical-forest/10 p-6 shadow-[0_8px_30px_rgba(30,63,32,0.04)]">
          <Tabs defaultValue="treatment" className="w-full">
            <TabsList className="bg-botanical-bg2 rounded-full p-1">
              <TabsTrigger value="treatment" className="rounded-full px-5 data-[state=active]:bg-white data-[state=active]:text-botanical-forest" data-testid="tab-treatment">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Treatment
              </TabsTrigger>
              <TabsTrigger value="prevention" className="rounded-full px-5 data-[state=active]:bg-white data-[state=active]:text-botanical-forest" data-testid="tab-prevention">
                <Shield className="w-3.5 h-3.5 mr-1.5" /> Prevention
              </TabsTrigger>
            </TabsList>
            <TabsContent value="treatment" className="pt-6">
              <ol className="space-y-3">
                {(data.treatments || []).map((t, i) => (
                  <li key={i} className="flex gap-3" data-testid={`treatment-${i}`}>
                    <span className="w-6 h-6 rounded-full bg-botanical-sage/60 text-botanical-forest text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-botanical-ink leading-relaxed">{t}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="prevention" className="pt-6">
              <ol className="space-y-3">
                {(data.prevention || []).map((p, i) => (
                  <li key={i} className="flex gap-3" data-testid={`prevention-${i}`}>
                    <span className="w-6 h-6 rounded-full bg-botanical-sage/60 text-botanical-forest text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-botanical-ink leading-relaxed">{p}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
