const fs = require('fs');
let c = fs.readFileSync('frontend/src/components/MapCanvasEnhanced.js', 'utf8');
const replacement = `          <Popup>
            <div style={{ minWidth: "220px", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                🏥 {feature.properties.nama_faskes}
              </div>
              <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Tipe</td>
                    <td style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right" }}>{feature.properties.tipe}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Kapasitas</td>
                    <td style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right" }}>{feature.properties.kapasitas_bed} bed</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Status</td>
                    <td style={{ color: feature.properties.status_operasional === 'Aktif' ? '#22c55e' : '#ef4444', fontWeight: 600, textAlign: "right" }}>
                      {feature.properties.status_operasional === 'Aktif' ? '✅' : '❌'} {feature.properties.status_operasional}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: "8px", fontSize: "10px", color: "#94a3b8", lineHeight: 1.4 }}>
                📍 {feature.properties.alamat}
              </p>
            </div>
          </Popup>`;

c = c.replace(/<Popup>[\s\S]*?🏥 \{feature\.properties\.nama_faskes\}[\s\S]*?<\/Popup>/, replacement);
fs.writeFileSync('frontend/src/components/MapCanvasEnhanced.js', c);
