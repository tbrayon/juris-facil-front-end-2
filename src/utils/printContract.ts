export const printContract = (template: string) => {
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.body.insertAdjacentHTML("beforeend", `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Contrato de Honorários</title>
            <meta charset="UTF-8">
            <style>
              @page { margin: 2cm; }
              body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.8; margin: 0; color: #000; }
              .header-logo { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1.5px solid #a16535; display: flex; align-items: center; justify-content: center; gap: 15px; }
              .logo-coluna { flex-shrink: 0; }
              .logo-texto { text-align: left; }
              .logo-texto h1 { font-family: Georgia, serif; font-size: 16pt; margin: 0; letter-spacing: 0.08em; color: #2d1f16; }
              .logo-texto p { font-family: Georgia, serif; margin: 4px 0 0 0; color: #4a3629; }
              .logo-subtitle { font-size: 9pt; letter-spacing: 0.12em; }
              .logo-areas { font-size: 7pt; letter-spacing: 0.15em; color: #6b5544; }
              pre.contrato-texto { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.8; margin: 0; padding: 0; overflow-x: auto; text-align: justify; }
              @media print {
                body { margin: 0; }
                pre.contrato-texto { white-space: pre-wrap; overflow-x: visible; font-size: 12pt; }
              }
            </style>
          </head>
          <body>
            <div class="header-logo">
              <div class="logo-coluna">
                <svg width="50" height="60" viewBox="0 0 100 120" style="color: #a16535;">
                  <line x1="10" y1="5" x2="90" y2="5" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="9" x2="90" y2="9" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="13" x2="90" y2="13" stroke="currentColor" stroke-width="2"/>
                  <path d="M 15 20 Q 20 15, 25 20 Q 30 15, 35 20 Q 40 15, 45 20 Q 50 15, 55 20 Q 60 15, 65 20 Q 70 15, 75 20 Q 80 15, 85 20"
                        fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M 15 25 Q 20 22, 25 25 Q 30 22, 35 25 Q 40 22, 45 25 Q 50 22, 55 25 Q 60 22, 65 25 Q 70 22, 75 25 Q 80 22, 85 25"
                        fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="30" y1="30" x2="30" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="40" y1="30" x2="40" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="50" y1="30" x2="50" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="60" y1="30" x2="60" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="70" y1="30" x2="70" y2="100" stroke="currentColor" stroke-width="2"/>
                  <rect x="20" y="100" width="60" height="4" fill="currentColor"/>
                  <rect x="15" y="105" width="70" height="4" fill="currentColor"/>
                  <rect x="10" y="110" width="80" height="5" fill="currentColor"/>
                </svg>
              </div>
              <div class="logo-texto">
                <h1>ANNA LAURA ROCHA GOMES</h1>
                <p class="logo-subtitle">ADVOCACIA E CONSULTORIA</p>
                <p class="logo-areas">CÍVEL - CRIMINAL - FAMÍLIA</p>
              </div>
            </div>
            <pre class="contrato-texto">${template.replace(/<[^>]*>/g, '')}</pre>
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }
};
