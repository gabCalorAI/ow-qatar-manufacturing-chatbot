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
    <div className="slider-container">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{value.toLocaleString()}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      <div className="slider-description">{description}</div>
    </div>
  );

  const ImpactBar = ({ label, value, maxValue, color, icon }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
      <div className="impact-bar-container">
        <div className="impact-bar-header">
          <span className="impact-bar-icon">{icon}</span>
          <span className="impact-bar-label">{label}</span>
          <span className="impact-bar-value">+QAR {value.toFixed(1)}B</span>
        </div>
        <div className="impact-bar-track">
          <div 
            className="impact-bar-fill" 
            style={{ width: `${percentage}%`, background: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="simulator-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        
        .simulator-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1c 0%, #1a1f35 50%, #0d1321 100%);
          font-family: 'DM Sans', -apple-system, sans-serif;
          color: #e8eaed;
          padding: 32px;
        }
        
        .simulator-header {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .simulator-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #fff;
          margin-bottom: 8px;
        }
        
        .simulator-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
        }
        
        .simulator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
        }
        
        .panel-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
        }
        
        .slider-container {
          margin-bottom: 28px;
        }
        
        .slider-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .slider-label {
          font-weight: 500;
          color: #e8eaed;
        }
        
        .slider-value {
          font-weight: 600;
          color: #00b4d8;
          font-size: 18px;
        }
        
        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 180, 216, 0.4);
        }
        
        .slider-description {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 8px;
        }
        
        .time-horizon {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }
        
        .time-btn {
          flex: 1;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e8eaed;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .time-btn.active {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00b4d8;
          color: #00b4d8;
        }
        
        .total-impact {
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 119, 182, 0.15));
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }
        
        .total-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
        }
        
        .total-value {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          color: #00b4d8;
          line-height: 1;
        }
        
        .total-unit {
          font-size: 24px;
          color: rgba(0, 180, 216, 0.7);
          margin-left: 4px;
        }
        
        .total-subtext {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-top: 12px;
        }
        
        .metrics-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .metric-card {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        
        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
        }
        
        .metric-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }
        
        .impact-bar-container {
          margin-bottom: 20px;
        }
        
        .impact-bar-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .impact-bar-icon {
          font-size: 16px;
        }
        
        .impact-bar-label {
          flex: 1;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }
        
        .impact-bar-value {
          font-weight: 600;
          color: #00b4d8;
        }
        
        .impact-bar-track {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .impact-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-to-target {
          margin-top: 24px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 13px;
        }
        
        .progress-track {
          height: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-current {
          height: 100%;
          background: linear-gradient(90deg, #0077b6, #00b4d8);
          border-radius: 6px;
          transition: width 0.3s ease;
        }
        
        .progress-target-marker {
          position: absolute;
          top: -4px;
          bottom: -4px;
          width: 3px;
          background: #ffd700;
          border-radius: 2px;
        }
        
        .breakdown-toggle {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
          margin-top: 16px;
        }
        
        .breakdown-toggle:hover {
          border-color: rgba(255,255,255,0.4);
          color: rgba(255,255,255,0.8);
        }
        
        @media (max-width: 900px) {
          .simulator-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="simulator-header">
        <h1 className="simulator-title">GDP Impact Scenario Simulator</h1>
        <p className="simulator-subtitle">Model the economic impact of manufacturing interventions in Qatar</p>
      </div>
      
      <div className="simulator-grid">
        <div className="panel">
          <div className="panel-title">Intervention Parameters</div>
          
          <div className="time-horizon">
            {[3, 5, 7, 10].map(years => (
              <button
                key={years}
                className={`time-btn ${timeHorizon === years ? 'active' : ''}`}
                onClick={() => setTimeHorizon(years)}
              >
                {years} Years
              </button>
            ))}
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
        
        <div className="panel">
          <div className="panel-title">Projected Impact</div>
          
          <div className="total-impact">
            <div className="total-label">Total GDP Impact ({timeHorizon} years)</div>
            <div className="total-value">
              +{impacts.total.toFixed(1)}<span className="total-unit">B QAR</span>
            </div>
            <div className="total-subtext">
              {impacts.percentageIncrease.toFixed(0)}% increase in manufacturing GDP
            </div>
          </div>
          
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-value">{impacts.jobsCreated.toLocaleString()}</div>
              <div className="metric-label">Jobs Created</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{impacts.newGDP.toFixed(1)}B</div>
              <div className="metric-label">New Manufacturing GDP</div>
            </div>
          </div>
          
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
          
          <div className="progress-to-target">
            <div className="progress-header">
              <span>Progress to QNV 2030 Target</span>
              <span style={{ color: '#ffd700' }}>Target: 15% of non-hydrocarbon GDP</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-current"
                style={{ width: `${Math.min((impacts.newGDP / impacts.targetGDP) * 100, 100)}%` }}
              />
              <div 
                className="progress-target-marker"
                style={{ left: '100%' }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Projected: QAR {impacts.newGDP.toFixed(1)}B / {impacts.targetGDP}B target
              ({((impacts.newGDP / impacts.targetGDP) * 100).toFixed(0)}%)
            </div>
          </div>
          
          <button className="breakdown-toggle" onClick={() => setShowBreakdown(!showBreakdown)}>
            {showBreakdown ? '▼ Hide' : '▶ Show'} calculation methodology
          </button>
          
          {showBreakdown && (
            <div style={{ marginTop: 16, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <strong style={{ color: '#00b4d8' }}>Methodology:</strong><br/>
              • Lean: {impacts.lean.firms} firms × QAR 50M avg revenue × 23% productivity gain × 2.0 multiplier<br/>
              • Tech: ${scenarios.techInvestment}M × 15% ROI × 2.2 multiplier × {timeHorizon} years<br/>
              • Localization: QAR 45B imports × {scenarios.localizationTarget}% × 40% value capture × 2.8 multiplier<br/>
              • Workforce: {scenarios.workforceTraining} workers × QAR 50K/worker × 2.0 multiplier × {timeHorizon} years
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
