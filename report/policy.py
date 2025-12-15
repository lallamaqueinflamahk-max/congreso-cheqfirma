"""
Política de Ventas, Reservas y Gestión de Cupos
Reglas de negocio del congreso ADN Humano
"""

from enum import Enum
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dataclasses import dataclass


class SeatStatus(Enum):
    """Estados válidos de los asientos"""
    VENDIDO = "VENDIDO"
    RESERVADO = "RESERVADO"
    VACANTE = "VACANTE"


class VentaOrigen(Enum):
    """Origen de venta (campo obligatorio)"""
    WHATSAPP_CALIENTE = "WHATSAPP_CALIENTE"  # Venta manual asistida
    VIRTUAL_FRIO = "VIRTUAL_FRIO"  # Venta automática


@dataclass
class Seat:
    """Modelo de asiento con toda su información"""
    seat_id: int
    seat_number: int
    section: Optional[str] = None
    row: Optional[int] = None
    status: SeatStatus = SeatStatus.VACANTE
    buyer_name: Optional[str] = None
    buyer_email: Optional[str] = None
    buyer_phone: Optional[str] = None
    venta_origen: Optional[VentaOrigen] = None
    amount_paid: float = 0.0
    deposit_amount: float = 0.0
    total_amount: float = 150000.0  # Precio base
    payment_status: Optional[str] = None
    reserved_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    refund_amount: float = 0.0
    refunded: bool = False


class PolicyEngine:
    """Motor de reglas de negocio"""
    
    # Configuración de tiempos
    RESERVA_SIN_PAGO_HOURS = 24
    SALDO_COMPLETAR_DAYS = 2  # Días antes del evento
    REEMBOLSO_AVISO_DAYS = 2
    
    def __init__(self, event_date: datetime):
        """
        Args:
            event_date: Fecha del evento (para calcular vencimientos)
        """
        self.event_date = event_date
    
    def can_reserve(self, seat: Seat, deposit_amount: float = 0.0) -> tuple[bool, str]:
        """
        Verificar si un asiento puede ser reservado
        
        Returns:
            (puede_reservar, mensaje)
        """
        if seat.status == SeatStatus.VENDIDO:
            return False, "Asiento ya vendido"
        
        if seat.status == SeatStatus.RESERVADO:
            if seat.expires_at and seat.expires_at > datetime.now():
                return False, "Asiento ya reservado (reserva activa)"
        
        return True, "Puede reservar"
    
    def confirm_reservation(
        self, 
        seat: Seat, 
        buyer_name: str,
        buyer_email: str,
        venta_origen: VentaOrigen,
        amount_paid: float = 0.0,
        deposit_amount: float = 0.0
    ) -> Seat:
        """
        Confirmar una reserva según reglas de negocio
        
        Reglas:
        - Pago total → VENDIDO
        - Seña 50% → RESERVADO
        - Sin pago → RESERVADO (24h)
        """
        seat.buyer_name = buyer_name
        seat.buyer_email = buyer_email
        seat.venta_origen = venta_origen
        seat.amount_paid = amount_paid
        seat.deposit_amount = deposit_amount
        seat.updated_at = datetime.now()
        
        # Determinar estado según pago
        if amount_paid >= seat.total_amount:
            # Pago total → VENDIDO
            seat.status = SeatStatus.VENDIDO
            seat.payment_status = "paid"
            seat.paid_at = datetime.now()
            seat.expires_at = None
        elif deposit_amount >= (seat.total_amount * 0.5):
            # Seña 50% → RESERVADO
            seat.status = SeatStatus.RESERVADO
            seat.payment_status = "partial"
            seat.reserved_at = datetime.now()
            # Vencimiento: 2 días antes del evento
            expires_at = self.event_date - timedelta(days=self.SALDO_COMPLETAR_DAYS)
            seat.expires_at = expires_at
        elif amount_paid > 0:
            # Pago parcial < 50% → RESERVADO (24h)
            seat.status = SeatStatus.RESERVADO
            seat.payment_status = "partial"
            seat.reserved_at = datetime.now()
            seat.expires_at = datetime.now() + timedelta(hours=self.RESERVA_SIN_PAGO_HOURS)
        else:
            # Sin pago → RESERVADO (24h)
            seat.status = SeatStatus.RESERVADO
            seat.payment_status = "pending"
            seat.reserved_at = datetime.now()
            seat.expires_at = datetime.now() + timedelta(hours=self.RESERVA_SIN_PAGO_HOURS)
        
        return seat
    
    def check_expired_reservations(self, seats: list[Seat]) -> list[Dict[str, Any]]:
        """
        Verificar y liberar reservas vencidas
        
        Returns:
            Lista de acciones de auditoría
        """
        audit_log = []
        now = datetime.now()
        
        for seat in seats:
            if seat.status == SeatStatus.RESERVADO and seat.expires_at:
                if seat.expires_at < now:
                    # Liberar asiento
                    old_status = seat.status
                    seat.status = SeatStatus.VACANTE
                    seat.updated_at = now
                    
                    # Registrar en audit
                    audit_log.append({
                        "fecha": now,
                        "accion": "LIBERACION_AUTOMATICA",
                        "asiento": seat.seat_id,
                        "motivo": f"Reserva vencida (expiró: {seat.expires_at})",
                        "estado_anterior": old_status.value,
                        "estado_nuevo": seat.status.value
                    })
        
        return audit_log
    
    def check_pending_balances(self, seats: list[Seat]) -> list[Seat]:
        """
        Identificar reservas con saldo pendiente por vencer
        
        Returns:
            Lista de asientos en riesgo
        """
        now = datetime.now()
        risk_seats = []
        
        for seat in seats:
            if seat.status == SeatStatus.RESERVADO:
                # Verificar si tiene seña pero falta saldo
                if seat.deposit_amount > 0 and seat.amount_paid < seat.total_amount:
                    remaining = seat.total_amount - seat.amount_paid
                    days_until_event = (self.event_date - now).days
                    
                    if days_until_event <= self.SALDO_COMPLETAR_DAYS:
                        risk_seats.append(seat)
        
        return risk_seats
    
    def calculate_refund_eligibility(
        self, 
        seat: Seat, 
        cancellation_date: datetime,
        seat_resold: bool = False
    ) -> tuple[bool, float, str]:
        """
        Calcular elegibilidad de reembolso
        
        Returns:
            (es_elegible, monto_reembolso, razon)
        """
        if seat.status != SeatStatus.VENDIDO and seat.amount_paid == 0:
            return False, 0.0, "No hay pago para reembolsar"
        
        days_before_event = (self.event_date - cancellation_date).days
        
        # Condición 1: Aviso ≥ 2 días antes
        if days_before_event >= self.REEMBOLSO_AVISO_DAYS:
            refund_amount = seat.amount_paid * 0.5
            return True, refund_amount, f"Aviso con {days_before_event} días de anticipación"
        
        # Condición 2: Asiento revendido
        if seat_resold:
            refund_amount = seat.amount_paid * 0.5
            return True, refund_amount, "Asiento revendido"
        
        return False, 0.0, f"Aviso insuficiente ({days_before_event} días, mínimo {self.REEMBOLSO_AVISO_DAYS})"
    
    def cancel_seat(
        self, 
        seat: Seat, 
        reason: str,
        cancellation_date: datetime,
        seat_resold: bool = False
    ) -> tuple[Seat, Dict[str, Any]]:
        """
        Cancelar un asiento y calcular reembolso
        
        Returns:
            (asiento_actualizado, info_reembolso)
        """
        is_eligible, refund_amount, refund_reason = self.calculate_refund_eligibility(
            seat, cancellation_date, seat_resold
        )
        
        # Actualizar asiento
        seat.cancellation_reason = reason
        seat.refund_amount = refund_amount if is_eligible else 0.0
        seat.refunded = False  # Reembolso no automático
        seat.updated_at = datetime.now()
        
        # Si no es elegible o no se revendió, liberar asiento
        if not seat_resold:
            seat.status = SeatStatus.VACANTE
            seat.buyer_name = None
            seat.buyer_email = None
            seat.buyer_phone = None
            seat.venta_origen = None
        
        refund_info = {
            "es_elegible": is_eligible,
            "monto_reembolso": refund_amount,
            "razon": refund_reason,
            "reembolsado": False
        }
        
        return seat, refund_info

