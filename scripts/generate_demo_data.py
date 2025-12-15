"""
Script para generar datos de demostración
Crea CSV con asientos de ejemplo
"""

import csv
from datetime import datetime, timedelta
from pathlib import Path
from report.policy import SeatStatus, VentaOrigen


def generate_demo_data(output_path: str = "data/seats.csv", num_seats: int = 100):
    """Generar datos de demostración"""
    
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    
    fieldnames = [
        "seat_id", "seat_number", "section", "row",
        "status", "buyer_name", "buyer_email", "buyer_phone",
        "venta_origen", "amount_paid", "deposit_amount", "total_amount",
        "payment_status", "reserved_at", "expires_at", "paid_at",
        "created_at", "updated_at", "notes",
        "cancellation_reason", "refund_amount", "refunded"
    ]
    
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        now = datetime.now()
        
        # 20 vendidos (10 WhatsApp, 10 Virtual)
        for i in range(1, 21):
            origen = VentaOrigen.WHATSAPP_CALIENTE if i <= 10 else VentaOrigen.VIRTUAL_FRIO
            writer.writerow({
                "seat_id": i,
                "seat_number": i,
                "section": "General",
                "row": (i - 1) // 10 + 1,
                "status": SeatStatus.VENDIDO.value,
                "buyer_name": f"Cliente {i}",
                "buyer_email": f"cliente{i}@test.com",
                "buyer_phone": f"+595981234{i:04d}",
                "venta_origen": origen.value,
                "amount_paid": 150000.0,
                "deposit_amount": 0.0,
                "total_amount": 150000.0,
                "payment_status": "paid",
                "reserved_at": (now - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"),
                "expires_at": "",
                "paid_at": (now - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"),
                "created_at": (now - timedelta(days=10)).strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": (now - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"),
                "notes": "",
                "cancellation_reason": "",
                "refund_amount": 0.0,
                "refunded": "false"
            })
        
        # 10 reservados (5 WhatsApp, 5 Virtual)
        for i in range(21, 31):
            origen = VentaOrigen.WHATSAPP_CALIENTE if i <= 25 else VentaOrigen.VIRTUAL_FRIO
            expires_at = now + timedelta(hours=12) if i <= 25 else now + timedelta(days=2)
            writer.writerow({
                "seat_id": i,
                "seat_number": i,
                "section": "General",
                "row": (i - 1) // 10 + 1,
                "status": SeatStatus.RESERVADO.value,
                "buyer_name": f"Reserva {i}",
                "buyer_email": f"reserva{i}@test.com",
                "buyer_phone": f"+595981234{i:04d}",
                "venta_origen": origen.value,
                "amount_paid": 75000.0 if i <= 25 else 0.0,
                "deposit_amount": 75000.0 if i <= 25 else 0.0,
                "total_amount": 150000.0,
                "payment_status": "partial" if i <= 25 else "pending",
                "reserved_at": (now - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
                "expires_at": expires_at.strftime("%Y-%m-%d %H:%M:%S"),
                "paid_at": "",
                "created_at": (now - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": (now - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
                "notes": "Seña del 50%" if i <= 25 else "Reserva sin pago",
                "cancellation_reason": "",
                "refund_amount": 0.0,
                "refunded": "false"
            })
        
        # Resto vacantes
        for i in range(31, num_seats + 1):
            writer.writerow({
                "seat_id": i,
                "seat_number": i,
                "section": "General",
                "row": (i - 1) // 10 + 1,
                "status": SeatStatus.VACANTE.value,
                "buyer_name": "",
                "buyer_email": "",
                "buyer_phone": "",
                "venta_origen": "",
                "amount_paid": 0.0,
                "deposit_amount": 0.0,
                "total_amount": 150000.0,
                "payment_status": "",
                "reserved_at": "",
                "expires_at": "",
                "paid_at": "",
                "created_at": now.strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
                "notes": "",
                "cancellation_reason": "",
                "refund_amount": 0.0,
                "refunded": "false"
            })
    
    print(f"✅ Datos de demostración generados: {output_path}")
    print(f"   - 20 vendidos (10 WhatsApp, 10 Virtual)")
    print(f"   - 10 reservados (5 WhatsApp, 5 Virtual)")
    print(f"   - {num_seats - 30} vacantes")


if __name__ == "__main__":
    generate_demo_data()

