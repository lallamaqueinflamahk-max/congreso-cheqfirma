"""
Métricas y estadísticas del congreso
Separadas por origen de venta (WhatsApp vs Virtual)
"""

from typing import Dict, List, Any
from datetime import datetime
from report.policy import Seat, SeatStatus, VentaOrigen


class MetricsCalculator:
    """Calculadora de métricas por origen de venta"""
    
    def __init__(self, total_capacity: int = 100):
        self.total_capacity = total_capacity
    
    def calculate_all_metrics(self, seats: List[Seat]) -> Dict[str, Any]:
        """
        Calcular todas las métricas separadas por origen
        
        Returns:
            Diccionario con todas las métricas
        """
        metrics = {
            "total": self._calculate_total_metrics(seats),
            "whatsapp_caliente": self._calculate_origin_metrics(seats, VentaOrigen.WHATSAPP_CALIENTE),
            "virtual_frio": self._calculate_origin_metrics(seats, VentaOrigen.VIRTUAL_FRIO)
        }
        
        # Agregar métricas adicionales
        metrics["alertas"] = self._calculate_alerts(seats)
        metrics["ingresos_detalle"] = self._calculate_income_detail(seats)
        
        return metrics
    
    def _calculate_total_metrics(self, seats: List[Seat]) -> Dict[str, Any]:
        """Métricas totales (sin separar por origen)"""
        vendidos = [s for s in seats if s.status == SeatStatus.VENDIDO]
        reservados = [s for s in seats if s.status == SeatStatus.RESERVADO]
        vacantes = [s for s in seats if s.status == SeatStatus.VACANTE]
        
        ingresos_cobrados = sum(s.amount_paid for s in vendidos + reservados)
        senado_total = sum(s.deposit_amount for s in reservados)
        saldo_pendiente = sum(
            (s.total_amount - s.amount_paid) 
            for s in reservados 
            if s.amount_paid < s.total_amount
        )
        
        return {
            "capacidad_total": self.total_capacity,
            "vendidos": len(vendidos),
            "reservados": len(reservados),
            "vacantes": len(vacantes),
            "ingresos_cobrados": ingresos_cobrados,
            "senado_total": senado_total,
            "saldo_pendiente": saldo_pendiente,
            "cancelaciones": len([s for s in seats if s.cancellation_reason])
        }
    
    def _calculate_origin_metrics(
        self, 
        seats: List[Seat], 
        origen: VentaOrigen
    ) -> Dict[str, Any]:
        """Métricas por origen de venta"""
        # Filtrar por origen
        seats_by_origin = [
            s for s in seats 
            if s.venta_origen == origen
        ]
        
        vendidos = [s for s in seats_by_origin if s.status == SeatStatus.VENDIDO]
        reservados = [s for s in seats_by_origin if s.status == SeatStatus.RESERVADO]
        
        ingresos = sum(s.amount_paid for s in vendidos + reservados)
        senado = sum(s.deposit_amount for s in reservados)
        saldo = sum(
            (s.total_amount - s.amount_paid) 
            for s in reservados 
            if s.amount_paid < s.total_amount
        )
        
        return {
            "vendidos": len(vendidos),
            "reservados": len(reservados),
            "ingresos_cobrados": ingresos,
            "senado_total": senado,
            "saldo_pendiente": saldo
        }
    
    def _calculate_alerts(self, seats: List[Seat]) -> List[Dict[str, Any]]:
        """Calcular alertas automáticas"""
        alerts = []
        
        # Reservas vencidas
        now = datetime.now()
        expired = [
            s for s in seats 
            if s.status == SeatStatus.RESERVADO 
            and s.expires_at 
            and s.expires_at < now
        ]
        if expired:
            alerts.append({
                "tipo": "RESERVAS_VENCIDAS",
                "cantidad": len(expired),
                "asientos": [s.seat_id for s in expired],
                "severidad": "alta"
            })
        
        # Saldos pendientes por vencer
        from report.policy import PolicyEngine
        # Necesitamos la fecha del evento, usar una por defecto
        event_date = datetime(2025, 12, 19)
        policy = PolicyEngine(event_date)
        risk_seats = policy.check_pending_balances(seats)
        if risk_seats:
            alerts.append({
                "tipo": "RIESGO_LIBERACION",
                "cantidad": len(risk_seats),
                "asientos": [s.seat_id for s in risk_seats],
                "severidad": "media"
            })
        
        # Baja ocupación
        total_ocupados = len([s for s in seats if s.status != SeatStatus.VACANTE])
        ocupacion_pct = (total_ocupados / self.total_capacity) * 100
        if ocupacion_pct < 30:
            alerts.append({
                "tipo": "BAJA_OCUPACION",
                "porcentaje": ocupacion_pct,
                "severidad": "baja"
            })
        
        return alerts
    
    def _calculate_income_detail(self, seats: List[Seat]) -> Dict[str, float]:
        """Detalle de ingresos por origen"""
        whatsapp_seats = [s for s in seats if s.venta_origen == VentaOrigen.WHATSAPP_CALIENTE]
        virtual_seats = [s for s in seats if s.venta_origen == VentaOrigen.VIRTUAL_FRIO]
        
        return {
            "whatsapp_caliente": sum(s.amount_paid for s in whatsapp_seats),
            "virtual_frio": sum(s.amount_paid for s in virtual_seats),
            "total": sum(s.amount_paid for s in seats if s.status != SeatStatus.VACANTE)
        }

