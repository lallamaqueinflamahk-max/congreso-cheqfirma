"""
Tests de cálculo de métricas
"""

import pytest
from datetime import datetime
from report.policy import Seat, SeatStatus, VentaOrigen
from report.metrics import MetricsCalculator


@pytest.fixture
def calculator():
    return MetricsCalculator(total_capacity=100)


@pytest.fixture
def sample_seats():
    """Generar asientos de prueba"""
    seats = []
    
    # 5 vendidos WhatsApp
    for i in range(1, 6):
        seats.append(Seat(
            seat_id=i,
            seat_number=i,
            status=SeatStatus.VENDIDO,
            venta_origen=VentaOrigen.WHATSAPP_CALIENTE,
            amount_paid=150000.0
        ))
    
    # 3 vendidos Virtual
    for i in range(6, 9):
        seats.append(Seat(
            seat_id=i,
            seat_number=i,
            status=SeatStatus.VENDIDO,
            venta_origen=VentaOrigen.VIRTUAL_FRIO,
            amount_paid=150000.0
        ))
    
    # 2 reservados WhatsApp
    for i in range(9, 11):
        seats.append(Seat(
            seat_id=i,
            seat_number=i,
            status=SeatStatus.RESERVADO,
            venta_origen=VentaOrigen.WHATSAPP_CALIENTE,
            amount_paid=75000.0,
            deposit_amount=75000.0
        ))
    
    # Resto vacantes
    for i in range(11, 101):
        seats.append(Seat(
            seat_id=i,
            seat_number=i,
            status=SeatStatus.VACANTE
        ))
    
    return seats


def test_calculate_total_metrics(calculator, sample_seats):
    """Calcular métricas totales"""
    metrics = calculator.calculate_all_metrics(sample_seats)
    
    assert metrics["total"]["capacidad_total"] == 100
    assert metrics["total"]["vendidos"] == 8
    assert metrics["total"]["reservados"] == 2
    assert metrics["total"]["vacantes"] == 90


def test_calculate_whatsapp_metrics(calculator, sample_seats):
    """Calcular métricas WhatsApp"""
    metrics = calculator.calculate_all_metrics(sample_seats)
    
    whatsapp = metrics["whatsapp_caliente"]
    assert whatsapp["vendidos"] == 5
    assert whatsapp["reservados"] == 2
    assert whatsapp["ingresos_cobrados"] == 1125000.0  # 5*150000 + 2*75000


def test_calculate_virtual_metrics(calculator, sample_seats):
    """Calcular métricas Virtual"""
    metrics = calculator.calculate_all_metrics(sample_seats)
    
    virtual = metrics["virtual_frio"]
    assert virtual["vendidos"] == 3
    assert virtual["reservados"] == 0
    assert virtual["ingresos_cobrados"] == 450000.0  # 3*150000

