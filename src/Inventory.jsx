import { useState, useEffect } from 'react';

function Inventory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState('');

  const historicalData = [
    { date: 'Nov 2024', sales: 4500, revenue: 225000, production: 2000, inventory: 4400 },
    { date: 'Dec 2024', sales: 5200, revenue: 260000, production: 1500, inventory: 700 },
    { date: 'Jan 2025', sales: 1200, revenue: 60000, production: 1500, inventory: 1000},
    { date: 'Feb 2025', sales: 1100, revenue: 55000, production: 1500, inventory: 1400},
    { date: 'Mar 2025', sales: 1400, revenue: 70000, production: 1600, inventory: 1600},
    { date: 'Apr 2025', sales: 1800, revenue: 90000, production: 2000, inventory: 1800},
    { date: 'May 2025', sales: 2200, revenue: 110000, production: 2200, inventory: 1800 },
    { date: 'Jun 2025', sales: 2500, revenue: 125000, production: 2000, inventory: 1300 },
    { date: 'Jul 2025', sales: 2100, revenue: 105000, production: 2500, inventory: 1700 },
    { date: 'Aug 2025', sales: 1900, revenue: 95000, production: 3000, inventory: 2800},
    { date: 'Sep 2025', sales: 2200, revenue: 110000, production: 3800, inventory: 4400 },
    { date: 'Oct 2025', sales: 2800, revenue: 140000, production: 4200, inventory: 5800 },
    { date: 'Nov 2025', sales: 4600, revenue: 230000, production: 2200, inventory: 3400 }
  ];

  // Convert Nov 2025 to weekly breakdown
  const nov2025Weekly = [
    { week: 'Week 1', production: 1150 },
    { week: 'Week 2', production: 1150 },
    { week: 'Week 3', production: 1150 },
    { week: 'Week 4', production: 1150 }
  ];

  const productionTrends = `
Month Season Target Harvest (MT) Actual Production (Dried Beans) Rejects/Shrinkage Net Supply Available Orders (Demand) Status
Nov 2025 Main Crop Start 150 142 3.5 138.5 160 Shortage
Dec 2025 Main Peak 180 175 4.2 170.8 180 Balanced
Jan 2025 Main Peak 180 168 5 163 185 Shortage
Feb 2025 Tapering Down 120 105 2.8 102.2 140 Shortage
Mar 2025 Lean Season 60 55 1.5 53.5 80 Shortage
Apr 2025 Lean Season 40 38 1.1 36.9 70 Critical Low
May 2025 Mid-Crop Start 80 75 2 73 90 Shortage
Jun 2025 Mid-Crop Peak 100 98 2.5 95.5 95 Balanced
Jul 2025 Mid-Crop End 90 85 2.2 82.8 90 Shortage
Aug 2025 Lean Season 50 45 1.4 43.6 75 Critical Low
Sep 2025 Pre-Harvest Prep 40 42 1 41 80 Critical Low
Oct 2025 Early Main Crop 100 92 2.8 89.2 120 Shortage
Nov 2025 Main Crop Start 160 155 4 151 170 Shortage
  `;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const prompt = `You are an inventory forecasting expert. Based on the following historical data (including sales, revenue, production, and inventory) along with production trends, predict weekly inventory (in units) for the next 4 weeks starting from December 2025.

Historical Data (Sales, Revenue, Production & Inventory):
${JSON.stringify(historicalData, null, 2)}

Production Trends:
${productionTrends}

Instructions:
1. Analyze the seasonal patterns (notice the spike in Nov-Dec and decline in Jan-Apr)
2. Consider that December 2025 is "Main Peak" season with balanced supply/demand
3. Consider inventory levels when making predictions
4. Provide EXACTLY 4 weekly predictions for December 2025
5. Return your response as a JSON object with this EXACT structure (no markdown, no extra text):
{
  "predictions": [
    {"week": "Week 1 (Dec 1-7)", "production": <number>},
    {"week": "Week 2 (Dec 8-14)", "production": <number>},
    {"week": "Week 3 (Dec 15-21)", "production": <number>},
    {"week": "Week 4 (Dec 22-31)", "production": <number>}
  ],
  "insights": "Brief explanation of the prediction reasoning based on production trends and inventory levels"
}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'x-ai/grok-4.1-fast',
            messages: [
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        const cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanResponse);
        
        setPredictions(parsedData.predictions);
        setAiInsights(parsedData.insights);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="inventorycontainer">
      <div className="greencontainer">
        <p className="graphtitle">Inventory</p>
        
        {/* Graph on the left */}
        <div className="graph" style={{ 
          position: 'absolute',
          top: '15%',
          left: '4%',
          width: '55%',
          height: '70%'
        }}>
          {loading && (
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ 
                fontSize: '16px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                ProVision is analyzing Inventory patterns...
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              backgroundColor: 'rgba(255,100,100,0.2)', 
              padding: '15px', 
              borderRadius: '8px',
              color: '#ffcccc',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '14px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && predictions.length > 0 && (
            <svg width="100%" height="100%" viewBox="0 0 800 450">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="60"
                  y1={40 + i * 70}
                  x2="750"
                  y2={40 + i * 70}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map((i) => {
                const allProduction = [...nov2025Weekly.map(d => d.production), ...predictions.map(p => p.production)];
                const maxProduction = Math.max(...allProduction);
                const value = Math.round(maxProduction - (i * maxProduction / 4));
                return (
                  <text
                    key={i}
                    x="50"
                    y={45 + i * 70}
                    textAnchor="end"
                    fontSize="20"
                    fill="rgba(255,255,255,0.7)"
                  >
                    {value.toLocaleString()}
                  </text>
                );
              })}

              {/* Historical line (Nov 2025) - BLUE */}
              {nov2025Weekly.map((data, idx) => {
                if (idx === 0) return null;
                const allProduction = [...nov2025Weekly.map(d => d.production), ...predictions.map(p => p.production)];
                const maxProduction = Math.max(...allProduction);
                const x1 = 120 + (idx - 1) * 160;
                const x2 = 120 + idx * 160;
                const y1 = 330 - (nov2025Weekly[idx - 1].production / maxProduction) * 280;
                const y2 = 330 - (data.production / maxProduction) * 280;
                
                return (
                  <line
                    key={`hist-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#4A90E2"
                    strokeWidth="3"
                  />
                );
              })}

              {/* Historical data points - BLUE */}
              {nov2025Weekly.map((data, idx) => {
                const allProduction = [...nov2025Weekly.map(d => d.production), ...predictions.map(p => p.production)];
                const maxProduction = Math.max(...allProduction);
                const x = 120 + idx * 160;
                const y = 330 - (data.production / maxProduction) * 280;
                
                return (
                  <g key={`hist-point-${idx}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#4A90E2"
                    />
                    <text
                      x={x}
                      y={y - 25}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#4A90E2"
                    >
                      {data.production.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Prediction line (Dec 2025) - GREEN */}
              {predictions.map((pred, idx) => {
                if (idx === 0) return null;
                const allProduction = [...nov2025Weekly.map(d => d.production), ...predictions.map(p => p.production)];
                const maxProduction = Math.max(...allProduction);
                const x1 = 120 + (idx - 1) * 160;
                const x2 = 120 + idx * 160;
                const y1 = 330 - (predictions[idx - 1].production / maxProduction) * 280;
                const y2 = 330 - (pred.production / maxProduction) * 280;
                
                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#4CAF50"
                    strokeWidth="3"
                  />
                );
              })}

              {/* Prediction data points - GREEN */}
              {predictions.map((pred, idx) => {
                const allProduction = [...nov2025Weekly.map(d => d.production), ...predictions.map(p => p.production)];
                const maxProduction = Math.max(...allProduction);
                const x = 120 + idx * 160;
                const y = 330 - (pred.production / maxProduction) * 280;
                
                return (
                  <g key={idx}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#4CAF50"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fontSize="20"
                      fontWeight="bold"
                      fill="white"
                    >
                      {pred.production.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {predictions.map((pred, idx) => (
                <text
                  key={idx}
                  x={120 + idx * 160}
                  y="370"
                  textAnchor="middle"
                  fontSize="20"
                  fill="rgba(255,255,255,0.8)"
                >
                  {pred.week.split(' ')[0] + ' ' + pred.week.split(' ')[1]}
                </text>
              ))}

              {/* Legend at the bottom */}
              <g transform="translate(250, 410)">
                {/* Historical data legend - BLUE */}
                <line x1="0" y1="0" x2="30" y2="0" stroke="#4A90E2" strokeWidth="3" />
                <circle cx="15" cy="0" r="4" fill="#4A90E2" />
                <text x="40" y="5" fontSize="15" fill="rgba(255,255,255,0.9)" fontFamily="Poppins">
                  Nov 2025 (Current)
                </text>
                
                {/* Prediction legend - GREEN */}
                <line x1="200" y1="0" x2="230" y2="0" stroke="#4CAF50" strokeWidth="3" />
                <circle cx="215" cy="0" r="4" fill="#4CAF50" />
                <text x="240" y="5" fontSize="15" fill="rgba(255,255,255,0.9)" fontFamily="Poppins">
                  Dec 2025 (Predicted)
                </text>
              </g>
            </svg>
          )}
        </div>

        {/* Vertical white line divider */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '61%',
          width: '1px',
          height: '70%',
          backgroundColor: 'white'
        }}></div>
        
        {/* AI Insights on the right */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '64%',
          width: '30%',
          height: '60%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          overflow: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {!loading && !error && aiInsights && (
            <div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#06231D',
                marginTop: '0',
                marginBottom: '15px',
                fontFamily: 'PoppinsSemiBold'
              }}>
                ProVision Insights
              </h3>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#333',
                margin: '0',
                fontFamily: 'Poppins'
              }}>
                {aiInsights}
              </p>
            </div>
          )}
          {loading && (
            <p style={{ 
              color: '#666',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '50%'
            }}>Loading ProVision insights...</p>
          )}
          {error && (
            <p style={{ 
              color: '#666',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '50%'
            }}>Unable to generate insights</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default Inventory;