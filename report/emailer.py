"""
Enviador de emails por Gmail SMTP
Usa App Password de Gmail
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional
from pathlib import Path
from datetime import datetime


class EmailSender:
    """Enviador de emails por Gmail SMTP"""
    
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    
    def __init__(self, sender_email: str, app_password: str):
        """
        Args:
            sender_email: Email del remitente (Gmail)
            app_password: App Password de Gmail (no la contraseña normal)
        """
        self.sender_email = sender_email
        self.app_password = app_password
    
    def send_daily_report(
        self,
        recipients: List[str],
        excel_path: str,
        metrics: dict,
        date: datetime
    ) -> bool:
        """
        Enviar reporte diario por email
        
        Args:
            recipients: Lista de emails destinatarios
            excel_path: Ruta al archivo Excel
            metrics: Métricas para el resumen
            date: Fecha del reporte
            
        Returns:
            True si se envió correctamente
        """
        try:
            # Crear mensaje
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = ", ".join(recipients)
            msg['Subject'] = f"[ADN Humano] Reporte diario {date.strftime('%Y-%m-%d')}"
            
            # Body HTML
            html_body = self._generate_html_body(metrics, date)
            msg.attach(MIMEText(html_body, 'html'))
            
            # Adjuntar Excel
            if Path(excel_path).exists():
                with open(excel_path, "rb") as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
                
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {Path(excel_path).name}'
                )
                msg.attach(part)
            
            # Enviar
            server = smtplib.SMTP(self.SMTP_SERVER, self.SMTP_PORT)
            server.starttls()
            server.login(self.sender_email, self.app_password)
            server.send_message(msg)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Error enviando email: {e}")
            return False
    
    def _generate_html_body(self, metrics: dict, date: datetime) -> str:
        """Generar body HTML del email"""
        total = metrics["total"]
        whatsapp = metrics["whatsapp_caliente"]
        virtual = metrics["virtual_frio"]
        alertas = metrics.get("alertas", [])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .header {{ background-color: #4472C4; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .metric {{ margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #4472C4; }}
                .alert {{ margin: 10px 0; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107; }}
                .alert-high {{ background-color: #f8d7da; border-left-color: #dc3545; }}
                table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #4472C4; color: white; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Reporte Diario - Congreso ADN Humano</h1>
                <p>Fecha: {date.strftime('%Y-%m-%d')}</p>
            </div>
            
            <div class="content">
                <h2>Resumen Ejecutivo</h2>
                
                <div class="metric">
                    <strong>Capacidad Total:</strong> {total['capacidad_total']} asientos
                </div>
                
                <div class="metric">
                    <strong>Vendidos:</strong> {total['vendidos']} 
                    (WhatsApp: {whatsapp['vendidos']}, Virtual: {virtual['vendidos']})
                </div>
                
                <div class="metric">
                    <strong>Reservados:</strong> {total['reservados']}
                    (WhatsApp: {whatsapp['reservados']}, Virtual: {virtual['reservados']})
                </div>
                
                <div class="metric">
                    <strong>Vacantes:</strong> {total['vacantes']}
                </div>
                
                <h2>Ingresos por Canal</h2>
                <table>
                    <tr>
                        <th>Canal</th>
                        <th>Ingresos Cobrados</th>
                    </tr>
                    <tr>
                        <td>WhatsApp Caliente</td>
                        <td>Gs. {whatsapp['ingresos_cobrados']:,.0f}</td>
                    </tr>
                    <tr>
                        <td>Virtual Frío</td>
                        <td>Gs. {virtual['ingresos_cobrados']:,.0f}</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>Gs. {total['ingresos_cobrados']:,.0f}</strong></td>
                    </tr>
                </table>
                
                <div class="metric">
                    <strong>Señado Total:</strong> Gs. {total['senado_total']:,.0f}
                </div>
                
                <div class="metric">
                    <strong>Saldo Pendiente:</strong> Gs. {total['saldo_pendiente']:,.0f}
                </div>
        """
        
        if alertas:
            html += """
                <h2>Alertas Automáticas</h2>
            """
            for alert in alertas:
                severity_class = "alert-high" if alert['severidad'] == 'alta' else "alert"
                html += f"""
                <div class="{severity_class}">
                    <strong>{alert['tipo']}</strong> ({alert['severidad']})
                    <br>Cantidad: {alert.get('cantidad', 'N/A')}
                </div>
                """
        
        html += """
                <p><em>Ver detalles completos en el archivo Excel adjunto.</em></p>
            </div>
        </body>
        </html>
        """
        
        return html

