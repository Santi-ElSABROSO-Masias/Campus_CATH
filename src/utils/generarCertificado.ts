import logoChUrl from '../assets/logo ch.png';

export const generarCertificadoHTML = ({ nombre, apellido, dni, fechaAprobacion, codigoUnico, cursoTitulo }: any) => {
    // Es necesario usar una URL absoluta para que la imagen cargue dentro de un Blob URL generado por URL.createObjectURL
    const baseUrl = window.location.origin;
    const absoluteLogoUrl = new URL(logoChUrl, baseUrl).href;

    return `
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Montserrat', sans-serif;
                    background: #f8fafc;
                }
                .certificado-page {
                    width: 297mm;
                    height: 210mm;
                    background: white;
                    margin: auto;
                    position: relative;
                    box-sizing: border-box;
                    padding: 80px;
                    border: 15px solid #00A064;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .logo-container {
                    width: 120px;
                    height: 120px;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    margin-bottom: 30px;
                    padding: 10px;
                }
                .logo-container img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                .title {
                    font-size: 36px;
                    color: #145A52;
                    font-weight: 900;
                    margin: 0 0 20px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    line-height: 1.3;
                    max-width: 900px;
                }
                .subtitle {
                    font-size: 24px;
                    color: #64748b;
                    margin-bottom: 40px;
                }
                .name {
                    font-size: 48px;
                    color: #00A064;
                    font-weight: 700;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 10px;
                    display: inline-block;
                    min-width: 600px;
                }
                .details {
                    font-size: 20px;
                    color: #475569;
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto 60px auto;
                }
                .course-name {
                    font-weight: 700;
                    color: #145A52;
                }
                .footer {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 800px;
                    margin-top: auto;
                    font-size: 14px;
                    color: #94a3b8;
                }
                .footer-item {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }
                .label {
                    font-weight: 700;
                    color: #475569;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .value {
                    color: #00A064;
                    font-weight: 700;
                }
                
                @media print {
                    @page { size: A4 landscape; margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="certificado-page">
                <div class="logo-container">
                    <img src="${absoluteLogoUrl}" alt="Logo CH" />
                </div>
                <h1 class="title">Inducción de trabajos temporales para<br />Catalina Huanca Sociedad Minera</h1>
                <div class="subtitle">Otorgado orgullosamente a</div>
                <div class="name">${nombre} ${apellido}</div>
                <div class="details">
                    Por haber completado satisfactoriamente y demostrado competencia en la inducción de seguridad y salud:
                    <br><br>
                    <span class="course-name">"${cursoTitulo}"</span>
                </div>
                
                <div class="footer">
                    <div class="footer-item">
                        <span class="label">Documento Identidad (DNI)</span>
                        <span class="value">${dni}</span>
                    </div>
                    <div class="footer-item">
                        <span class="label">Fecha de Finalización</span>
                        <span class="value">${fechaAprobacion}</span>
                    </div>
                    <div class="footer-item">
                        <span class="label">Código de Verificación</span>
                        <span class="value" style="font-family: monospace;">${codigoUnico}</span>
                    </div>
                </div>
            </div>
            
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                }
            </script>
        </body>
    </html>
    `;
};
