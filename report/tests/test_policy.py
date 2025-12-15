"""
Tests de reglas de negocio
"""

import pytest
from datetime import datetime, timedelta
from report.policy import PolicyEngine, Seat, SeatStatus, VentaOrigen


@pytest.fixture
def event_date():
    return datetime(2025, 12, 19, 8, 0)


@pytest.fixture
def policy(event_date):
    return PolicyEngine(event_date)


@pytest.fixture
def empty_seat():
    return Seat(
        seat_id=1,
        seat_number=1,
        status=SeatStatus.VACANTE
    )


def test_can_reserve_vacant_seat(policy, empty_seat):
    """Puede reservar asiento vacante"""
    can_reserve, msg = policy.can_reserve(empty_seat)
    assert can_reserve is True


def test_cannot_reserve_sold_seat(policy, empty_seat):
    """No puede reservar asiento vendido"""
    empty_seat.status = SeatStatus.VENDIDO
    can_reserve, msg = policy.can_reserve(empty_seat)
    assert can_reserve is False


def test_confirm_reservation_full_payment(policy, empty_seat):
    """Pago total → VENDIDO"""
    seat = policy.confirm_reservation(
        empty_seat,
        buyer_name="Test User",
        buyer_email="test@test.com",
        venta_origen=VentaOrigen.VIRTUAL_FRIO,
        amount_paid=150000.0
    )
    assert seat.status == SeatStatus.VENDIDO
    assert seat.payment_status == "paid"


def test_confirm_reservation_50_percent_deposit(policy, empty_seat):
    """Seña 50% → RESERVADO"""
    seat = policy.confirm_reservation(
        empty_seat,
        buyer_name="Test User",
        buyer_email="test@test.com",
        venta_origen=VentaOrigen.WHATSAPP_CALIENTE,
        amount_paid=0.0,
        deposit_amount=75000.0
    )
    assert seat.status == SeatStatus.RESERVADO
    assert seat.payment_status == "partial"


def test_confirm_reservation_no_payment(policy, empty_seat):
    """Sin pago → RESERVADO (24h)"""
    seat = policy.confirm_reservation(
        empty_seat,
        buyer_name="Test User",
        buyer_email="test@test.com",
        venta_origen=VentaOrigen.VIRTUAL_FRIO,
        amount_paid=0.0
    )
    assert seat.status == SeatStatus.RESERVADO
    assert seat.expires_at is not None
    # Verificar que expira en ~24 horas
    time_diff = seat.expires_at - datetime.now()
    assert 23 <= time_diff.total_seconds() / 3600 <= 25


def test_check_expired_reservations(policy):
    """Liberar reservas vencidas"""
    expired_seat = Seat(
        seat_id=1,
        seat_number=1,
        status=SeatStatus.RESERVADO,
        expires_at=datetime.now() - timedelta(hours=1)
    )
    
    audit_log = policy.check_expired_reservations([expired_seat])
    
    assert len(audit_log) == 1
    assert expired_seat.status == SeatStatus.VACANTE
    assert audit_log[0]["accion"] == "LIBERACION_AUTOMATICA"


def test_refund_eligibility_2_days_before(policy, event_date):
    """Reembolso elegible si avisa 2+ días antes"""
    seat = Seat(
        seat_id=1,
        seat_number=1,
        status=SeatStatus.VENDIDO,
        amount_paid=150000.0
    )
    
    cancellation_date = event_date - timedelta(days=3)
    is_eligible, refund, reason = policy.calculate_refund_eligibility(
        seat, cancellation_date, seat_resold=False
    )
    
    assert is_eligible is True
    assert refund == 75000.0  # 50%


def test_refund_eligibility_seat_resold(policy, event_date):
    """Reembolso elegible si asiento revendido"""
    seat = Seat(
        seat_id=1,
        seat_number=1,
        status=SeatStatus.VENDIDO,
        amount_paid=150000.0
    )
    
    cancellation_date = event_date - timedelta(days=1)  # Menos de 2 días
    is_eligible, refund, reason = policy.calculate_refund_eligibility(
        seat, cancellation_date, seat_resold=True
    )
    
    assert is_eligible is True
    assert refund == 75000.0

