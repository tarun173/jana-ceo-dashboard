import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
  MOCK DATA (replace with live APIs)
------------------------------------------------------------------ */

const l0Metrics = [
  { title: "CASA Inflow (₹ Cr)", value: "+94", delta: "+13% vs yesterday", spark: [94, 85, 88, 83] },
  { title: "Disbursements (₹ Cr)", value: "212", delta: "+7%", spark: [212, 198, 205, 190] },
  { title: "Gross NPA (%)", value: "1.84", delta: "↘ -2 bps", spark: [1.86, 1.85, 1.84, 1.85] },
  { title: "Liquidity Coverage (%)", value: "132", delta: "+4 ppt", spark: [128, 126, 129, 132] },
  { title: "Digital Txn Success (%)", value: "99.1", delta: "↗ +0.2%", spark: [98.9, 99.0, 99.05, 99.1] },
];

const ceoInsights = [
  "Micro‑loan demand spike in Uttar Pradesh → potential ₹150 Cr disbursement in Q2.",
  "Deposit outflow risk of ₹300 Cr after competitor rate hike; retention campaign suggested.",
  "Proposed RBI leverage cap could shave 80 bps off ROE by FY‑27; capital buffer plan needed.",
];

const marketIntel = [
  "🛠️ 15 % tariff on finished solar panels – domestic makers scaling → term‑lending window ₹500 Cr/12 mo.",
  "🚜 Weak monsoon forecast – agri‑input suppliers likely to need higher working‑capital by Q3.",
  "🌐 Relaxed fintech IPO norms – advisory pipeline could boost fee income by 8 %.",
];

const salesIntel = [
  { id: 1, quote: "Two‑wheeler loan interest surging in tier‑2 cities, EV models driving buzz.", sentiment: +0.72 },
  { id: 2, quote: "MSME clients complain trade‑finance TAT 5 days; risk attrition to fintechs.", sentiment: -0.41 },
  { id: 3, quote: "WhatsApp onboarding praised; referral intent up 18 % among micro‑loan borrowers.", sentiment: +0.6 },
];

const actionQueue = [
  { id: 1, task: "Approve 7.9 % limited‑period deposit offer for top‑tier savers" },
  { id: 2, task: "Kick‑off capital‑buffer roadmap vs. leverage cap scenario" },
  { id: 3, task: "Launch micro‑loan WhatsApp campaign in UP" },
];

/* ------------------------------------------------------------------
  REUSABLE COMPONENTS
------------------------------------------------------------------ */

const SparkLine = ({ data }) => (
  <ResponsiveContainer>
    <LineChart
      data={data.map((v, i) => ({ idx: i, val: typeof v === "number" ? v : parseFloat(v) }))}
      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
    >
      <Line type="monotone" dataKey="val" strokeWidth={2} stroke="currentColor" dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const MetricCard = ({ metric }) => (
  <Card className="w-full bg-white border border-gray-200 rounded-2xl hover:shadow-md">
    <CardHeader className="pb-1">
      <CardTitle className="text-xs text-gray-500 flex justify-between">
        {metric.title}
        <span className="italic opacity-60 text-[10px]">{metric.delta}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex items-end gap-2">
      <span className="text-xl font-semibold text-gray-800">{metric.value}</span>
      <div className="flex-1 h-8 text-indigo-600">
        <SparkLine data={metric.spark} />
      </div>
    </CardContent>
  </Card>
);

const QuoteCard = ({ quote, sentiment }) => (
  <Card className="bg-white border border-gray-200 rounded-2xl p-4">
    <p className="text-sm text-gray-800">“{quote}”</p>
    <p className={`text-xs font-mono ${sentiment >= 0 ? "text-emerald-600" : "text-red-600"}`}>Sentiment {sentiment}</p>
  </Card>
);

const IntelCard = ({ text }) => (
  <Card className="bg-white border border-gray-200 rounded-2xl p-4">
    <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: text }} />
  </Card>
);

const ActionCard = ({ task }) => (
  <Card className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
    <p className="text-sm text-gray-800 mr-4 flex-1">{task}</p>
    <Button size="sm">Approve</Button>
  </Card>
);

/* ------------------------------------------------------------------
  SCENARIO BUILDER (simple mock)
------------------------------------------------------------------ */

function ScenarioBuilder() {
  const [revenueShift, setRevenueShift] = useState(-5); // % change
  const [interestShift, setInterestShift] = useState(+50); // bps change
  // simple illustrative outcome
  const netImpact = ((revenueShift * -20) + (interestShift * -0.5)).toFixed(0);

  return (
    <Card className="bg-white border border-indigo-200 rounded-2xl p-6 space-y-4">
      <CardTitle className="text-gray-700 font-semibold mb-2">Scenario Builder</CardTitle>
      <div className="space-y-3">
        <label className="block text-xs text-gray-600">
          Revenue change (%)
          <input
            type="range"
            min="-20"
            max="20"
            value={revenueShift}
            onChange={(e) => setRevenueShift(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-gray-800 font-medium">{revenueShift}%</span>
        </label>
        <label className="block text-xs text-gray-600">
          Interest‑rate change (bps)
          <input
            type="range"
            min="-100"
            max="100"
            value={interestShift}
            onChange={(e) => setInterestShift(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-gray-800 font-medium">{interestShift} bps</span>
        </label>
        <p className="text-sm text-gray-700">🧮 Estimated PAT impact: <span className="font-semibold">₹{netImpact} Cr</span></p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------
  MAIN DASHBOARD COMPONENT
------------------------------------------------------------------ */

export default function JanaCEODashboard() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Market Intelligence");

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 text-gray-800">
      {/* Search + Headline */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        <Input
          placeholder="Ask GenAI… ex: /compare NIM vs peers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-300 placeholder:text-gray-400"
        />
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded"
        >
          <h1 className="text-sm md:text-base font-medium text-indigo-900">
            PAT hits ₹670 Cr (+162 % YoY) – liquidity headroom widens, CASA ratio soft; GenAI suggests deposit retention action.
          </h1>
        </motion.div>
      </div>

      {/* L0 Metrics */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-gray-600 text-sm mb-2">Daily Pulse (L0)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {l0Metrics.map((m, idx) => (
            <MetricCard key={idx} metric={m} />
          ))}
        </div>
      </div>

      {/* CEO Insights */}
      <div className="max-w-5xl mx-auto space-y-3">
        <h2 className="text-gray-600 text-sm">GenAI CEO Insights</h2>
        {ceoInsights.map((ins, idx) => (
          <IntelCard key={idx} text={ins} />
        ))}
      </div>

      {/* Intelligence Tabs */}
      <div className="max-w-5xl mx-auto">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex justify-start gap-2 bg-white border border-gray-200 rounded-xl mb-4 p-1">
            {[
              "Market Intelligence",
              "Sales Insights",
              "Scenario Builder",
            ].map((label) => (
              <TabsTrigger
                key={label}
                value={label}
                className="text-xs md:text-sm px-3 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Market Intelligence" className="outline-none grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketIntel.map((intel, idx) => (
              <IntelCard key={idx} text={intel} />
            ))}
          </TabsContent>

          <TabsContent value="Sales Insights" className="outline-none grid grid-cols-1 sm:grid-cols-2 gap-4">
            {salesIntel.map((s) => (
              <QuoteCard key={s.id} quote={s.quote} sentiment={s.sentiment} />
            ))}
          </TabsContent>

          <TabsContent value="Scenario Builder" className="outline-none">
            <ScenarioBuilder />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Queue */}
      <div className="max-w-5xl mx-auto space-y-3">
        <h2 className="text-gray-600 text-sm">Action Queue</h2>
        {actionQueue.map((a) => (
          <ActionCard key={a.id} task={a.task} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
  BASIC RENDER TESTS
------------------------------------------------------------------ */
export function __tests__() {
  if (ceoInsights.length === 0) throw new Error("CEO insights should not be empty");
  if (!marketIntel.length) throw new Error("Market intel tab must have at least one card");
  if (!salesIntel.length) throw new Error("Sales insights tab must have at least one quote card");
  if (!actionQueue.length) throw new Error("Action queue must not be empty");
  return "All static tests passed";
}
