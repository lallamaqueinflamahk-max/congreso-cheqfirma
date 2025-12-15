"""
Script principal de procesamiento diario
Ejecuta reglas de negocio, genera Excel y envía email
"""

import sys
import yaml
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any
import logging

from report.policy import PolicyEngine, SeatStatus
from report.metrics import MetricsCalculator
from report.excel_report import ExcelReportGenerator
from report.emailer import EmailSender
from report.datasources.factory import create_data_adapter


# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('report.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


def load_config(config_path: str = "config/config.yaml") -> Dict[str, Any]:
    """Cargar configuración desde YAML"""
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def process_daily_report(config_path: str = "config/config.yaml"):
    """
    Procesar reporte diario completo
    
    Pasos:
    1. Cargar configuración
    2. Conectar a fuente de datos
    3. Aplicar reglas de negocio (liberar reservas vencidas)
    4. Calcular métricas
    5. Generar Excel
    6. Enviar email
    """
    logger.info("=" * 60)
    logger.info("INICIANDO PROCESAMIENTO DIARIO")
    logger.info("=" * 60)
    
    try:
        # 1. Cargar configuración
        logger.info("Cargando configuración...")
        config = load_config(config_path)
        
        # 2. Conectar a fuente de datos
        logger.info("Conectando a fuente de datos...")
        adapter = create_data_adapter(config["datasource"])
        seats = adapter.get_all_seats()
        logger.info(f"Cargados {len(seats)} asientos")
        
        # 3. Aplicar reglas de negocio
        logger.info("Aplicando reglas de negocio...")
        event_date = datetime.fromisoformat(config["event"]["date"])
        policy = PolicyEngine(event_date)
        
        # Liberar reservas vencidas
        audit_log = policy.check_expired_reservations(seats)
        logger.info(f"Liberadas {len(audit_log)} reservas vencidas")
        
        # Guardar cambios
        for entry in audit_log:
            seat = adapter.get_seat(entry["asiento"])
            if seat:
                adapter.update_seat(seat)
                adapter.save_audit_log(entry)
        
        # Identificar riesgos
        risk_seats = policy.check_pending_balances(seats)
        if risk_seats:
            logger.warning(f"Identificados {len(risk_seats)} asientos en riesgo de liberación")
        
        # 4. Calcular métricas
        logger.info("Calculando métricas...")
        calculator = MetricsCalculator(total_capacity=config.get("capacity", 100))
        metrics = calculator.calculate_all_metrics(seats)
        
        # 5. Generar Excel
        logger.info("Generando reporte Excel...")
        today = datetime.now()
        output_dir = Path(config.get("output_dir", "reports"))
        output_dir.mkdir(parents=True, exist_ok=True)
        
        excel_filename = f"reporte_adn_humano_{today.strftime('%Y-%m-%d')}.xlsx"
        excel_path = output_dir / excel_filename
        
        generator = ExcelReportGenerator()
        generator.generate(seats, metrics, audit_log, str(excel_path))
        logger.info(f"Excel generado: {excel_path}")
        
        # 6. Enviar email
        if config.get("email", {}).get("enabled", False):
            logger.info("Enviando email...")
            email_config = config["email"]
            sender = EmailSender(
                sender_email=email_config["sender_email"],
                app_password=email_config["app_password"]
            )
            
            recipients = email_config.get("recipients", [])
            success = sender.send_daily_report(
                recipients=recipients,
                excel_path=str(excel_path),
                metrics=metrics,
                date=today
            )
            
            if success:
                logger.info(f"Email enviado a {len(recipients)} destinatarios")
            else:
                logger.error("Error al enviar email")
        else:
            logger.info("Email deshabilitado en configuración")
        
        logger.info("=" * 60)
        logger.info("PROCESAMIENTO COMPLETADO EXITOSAMENTE")
        logger.info("=" * 60)
        
        return True
        
    except Exception as e:
        logger.error(f"Error en procesamiento diario: {e}", exc_info=True)
        return False


if __name__ == "__main__":
    config_path = sys.argv[1] if len(sys.argv) > 1 else "config/config.yaml"
    success = process_daily_report(config_path)
    sys.exit(0 if success else 1)

