import React, { useState, useMemo } from 'react';

// Standalone Scenario Simulator Component
// Can be embedded in the chat or shown as a separate mode

export default function ScenarioSimulator() {
    const [scenarios, setScenarios] = useState({
        leanAdoption: 30,        // % of firms adopting lean
        techInvestment: 500,     // $M invested in I4.0
        localizationTarget: 35,  // % import substitution
        workforceTraining: 5000, // workers trained
    });

    const [timeHorizon, setTimeHorizon] = useState(5); // years
    const [showBreakdown, setShowBreakdown] = useState(false);

    // GDP Impact Calculations (based on mock data methodology)
    const impacts = useMemo(() => {
        const baseManufacturingGDP = 62.3; // QAR Billion

        // Lean Manufacturing Impact
        // 23% productivity gain per firm, 2.0x multiplier
        // Average firm revenue ~QAR 50M, 1247 total firms
        const leanFirms = Math.round(1247 * (scenarios.leanAdoption / 100));
        const leanProductivityGain = 0.23;
        const leanMultiplier = 2.0;
        const avgFirmRevenue = 0.05; // QAR Billion
        const leanImpact = leanFirms * avgFirmRevenue * leanProductivityGain * leanMultiplier;

        // Technology Investment Impact
        // $1M investment = ~QAR 3.6M, with 2.2x multiplier
        // ROI of ~15% productivity gain
        const techInvestmentQAR = scenarios.techInvestment * 3.6 / 1000; // Convert to QAR Billion
        const techROI = 0.15;
        const techMultiplier = 2.2;
        const techImpact = techInvestmentQAR * techROI * techMultiplier * timeHorizon;

        // Localization Impact
        // Total imports ~QAR 45B, 2.8x multiplier
        const totalImports = 45; // QAR Billion
        const localizationImpact = totalImports * (scenarios.localizationTarget / 100) * 0.4 * 2.8;

        // Workforce Impact
        // Each trained worker adds ~QAR 50K productivity, 2.0x multiplier
        const productivityPerWorker = 0.00005; // QAR Billion
        const workforceMultiplier = 2.0;
        const workforceImpact = scenarios.workforceTraining * productivityPerWorker * workforceMultiplier * timeHorizon;

        const totalImpact = leanImpact + techImpact + localizationImpact + workforceImpact;
        const percentageIncrease = (totalImpact / baseManufacturingGDP) * 100;

        // Job creation estimate
        const jobsPerBillionGDP = 3000;
        const jobsCreated = Math.round(totalImpact * jobsPerBillionGDP);

        return {
            lean: { value: leanImpact, firms: leanFirms },
            tech: { value: techImpact, investment: scenarios.techInvestment },
            localization: { value: localizationImpact, percent: scenarios.localizationTarget },
            workforce: { value: workforceImpact, trained: scenarios.workforceTraining },
            total: totalImpact,
            percentageIncrease,
            jobsCreated,
            newGDP: baseManufacturingGDP + totalImpact,
            targetGDP: 93.5, // 15% of projected non-hydrocarbon GDP by 2030
        };
    }, [scenarios, timeHorizon]);

    const Slider = ({ label, value, onChange, min, max, step, unit, description }) => (
        <div className="mb-8 group">
            <div className="flex justify-between mb-3 items-end">
                <span className="font-medium text-foreground text-sm">{label}</span>
                <span className="font-bold text-primary text-xl tracking-tight">{value.toLocaleString()}<span className="text-sm text-primary/70 ml-0.5">{unit}</span></span>
            </div>
            <div className="relative h-2 w-full">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-2 rounded-lg bg-white/10 outline-none appearance-none cursor-pointer z-20 opacity-0"
                />
                <div className="absolute inset-0 rounded-lg bg-white/10 overflow-hidden pointer-events-none">
                     <div 
                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-lg transition-all duration-100 ease-out"
                        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                     />
                </div>
                <div 
                    className="absolute h-4 w-4 bg-white rounded-full shadow-lg shadow-black/50 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100 ease-out group-hover:scale-110"
                    style={{ left: `${((value - min) / (max - min)) * 100}%`, transform: `translate(-50%, -50%)` }}
                />
            </div>
            <div className="text-xs text-muted-foreground mt-2.5 font-medium">{description}</div>
        </div>
    );

    const ImpactBar = ({ label, value, maxValue, color, icon }) => {
        const percentage = Math.min((value / maxValue) * 100, 100);
        return (
            <div className="mb-6 last:mb-0">
                <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-lg p-2 bg-white/5 rounded-xl">{icon}</span>
                    <span className="flex-1 text-sm font-medium text-muted-foreground">{label}</span>
                    <span className="font-bold text-white text-[15px] tabular-nums">+QAR {value.toFixed(1)}B</span>
                </div>
                <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${percentage}%`, background: color }}
                    >
                         <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full p-6 sm:p-8 animate-fadeIn">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                        <path d="M12 2v20M2 12h20M2 12l10-10 10 10M2 12l10 10 10-10" />
                        <path d="M3 3l18 18M3 21L21 3" strokeOpacity="0.0" /> {/* Abstract grid icon */}
                        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" />
                        <line x1="2" y1="9" x2="22" y2="9" />
                        <line x1="9" y1="22" x2="9" y2="2" />
                    </svg>
                </div>
                <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mb-3 tracking-tight">GDP Impact Scenario Simulator</h1>
                <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">Adjust parameters below to model the economic impact of manufacturing interventions in Qatar over time.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-8">
                         <div className="text-xs uppercase tracking-[2px] font-bold text-muted-foreground/70">Intervention Parameters</div>
                         <div className="flex bg-black/20 rounded-xl p-1 border border-white/5">
                            {[3, 5, 7, 10].map(years => (
                                <button
                                    key={years}
                                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200
                      ${timeHorizon === years ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}
                    `}
                                    onClick={() => setTimeHorizon(years)}
                                >
                                    {years}y
                                </button>
                            ))}
                        </div>
                    </div>

                    <Slider
                        label="Lean Manufacturing Adoption"
                        value={scenarios.leanAdoption}
                        onChange={(v) => setScenarios(s => ({ ...s, leanAdoption: v }))}
                        min={0}
                        max={80}
                        step={5}
                        unit="%"
                        description={`${Math.round(1247 * (scenarios.leanAdoption / 100))} of 1,247 firms implementing lean practices`}
                    />

                    <Slider
                        label="Industry 4.0 Investment"
                        value={scenarios.techInvestment}
                        onChange={(v) => setScenarios(s => ({ ...s, techInvestment: v }))}
                        min={0}
                        max={2000}
                        step={50}
                        unit="M USD"
                        description="IoT, AI/ML, predictive maintenance, digital twins"
                    />

                    <Slider
                        label="Import Substitution Target"
                        value={scenarios.localizationTarget}
                        onChange={(v) => setScenarios(s => ({ ...s, localizationTarget: v }))}
                        min={0}
                        max={60}
                        step={5}
                        unit="%"
                        description="Percentage of substitutable imports produced locally"
                    />

                    <Slider
                        label="Workforce Upskilling"
                        value={scenarios.workforceTraining}
                        onChange={(v) => setScenarios(s => ({ ...s, workforceTraining: v }))}
                        min={0}
                        max={20000}
                        step={500}
                        unit=" workers"
                        description="Workers trained in digital manufacturing skills"
                    />
                </div>

                <div className="glass-panel rounded-3xl p-8 bg-black/20 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

                    <div className="text-xs uppercase tracking-[2px] font-bold text-muted-foreground/70 mb-8">Projected Impact</div>

                    <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-2xl p-8 text-center mb-8 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10">
                            <div className="text-xs uppercase tracking-[2px] text-primary/80 font-bold mb-3">Total GDP Impact ({timeHorizon} years)</div>
                            <div className="font-display font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 mb-4 tracking-tighter">
                                +{impacts.total.toFixed(1)}<span className="text-3xl text-white/50 ml-2 font-normal">B QAR</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                                <span>▲</span>
                                {impacts.percentageIncrease.toFixed(0)}% increase in manufacturing GDP
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1">{impacts.jobsCreated.toLocaleString()}</div>
                            <div className="text-xs font-medium text-muted-foreground">New Jobs Created</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1">{impacts.newGDP.toFixed(1)}B</div>
                            <div className="text-xs font-medium text-muted-foreground">New Total Sector GDP</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImpactBar
                            label="Lean Manufacturing"
                            value={impacts.lean.value}
                            maxValue={15}
                            color="linear-gradient(90deg, #10b981, #34d399)"
                            icon="⚙️"
                        />

                        <ImpactBar
                            label="Technology Investment"
                            value={impacts.tech.value}
                            maxValue={15}
                            color="linear-gradient(90deg, #6366f1, #818cf8)"
                            icon="🤖"
                        />

                        <ImpactBar
                            label="Supply Chain Localization"
                            value={impacts.localization.value}
                            maxValue={15}
                            color="linear-gradient(90deg, #f59e0b, #fbbf24)"
                            icon="🔗"
                        />

                        <ImpactBar
                            label="Workforce Development"
                            value={impacts.workforce.value}
                            maxValue={15}
                            color="linear-gradient(90deg, #ec4899, #f472b6)"
                            icon="👥"
                        />
                    </div>

                    <div className="mt-8 p-6 bg-black/20 rounded-2xl border border-white/5">
                        <div className="flex justify-between mb-4 text-sm font-medium">
                            <span className="text-muted-foreground">Progress to QNV 2030 Target</span>
                            <span className="text-yellow-400">Target: 15%</span>
                        </div>
                        <div className="h-4 bg-black/40 rounded-full overflow-hidden relative border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((impacts.newGDP / impacts.targetGDP) * 100, 100)}%` }}
                            />
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 box-content border-x-[1px] border-black/50 z-10"
                                style={{ left: '100%' }} // Adjusted to correct percentage if needed, but keeping simple relative to this bar
                            />
                        </div>
                         <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                            <span>Current + Impact: QAR {impacts.newGDP.toFixed(1)}B</span>
                            <span>Target: QAR {impacts.targetGDP}B (Non-oil GDP)</span>
                        </div>
                    </div>

                    <button
                        className="w-full p-4 mt-6 bg-transparent border border-dashed border-white/10 rounded-2xl text-muted-foreground/70 text-xs font-medium cursor-pointer hover:border-primary/30 hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                    >
                        {showBreakdown ? '▼ Hide' : '▶ Show'} calculation methodology
                    </button>

                    {showBreakdown && (
                        <div className="mt-4 p-5 bg-black/30 rounded-2xl text-xs text-muted-foreground leading-loose border border-white/5 font-mono animate-fadeIn">
                            <strong className="text-primary block mb-2 font-sans text-sm">Methodology:</strong>
                            • Lean: {impacts.lean.firms} firms × QAR 50M avg revenue × 23% productivity gain × 2.0 multiplier<br />
                            • Tech: ${scenarios.techInvestment}M × 15% ROI × 2.2 multiplier × {timeHorizon} years<br />
                            • Localization: QAR 45B imports × {scenarios.localizationTarget}% × 40% value capture × 2.8 multiplier<br />
                            • Workforce: {scenarios.workforceTraining} workers × QAR 50K/worker × 2.0 multiplier × {timeHorizon} years
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
