"""
Adaptador PostgreSQL para datos de asientos
"""

import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Optional, Dict, Any
from datetime import datetime
from report.policy import Seat, SeatStatus, VentaOrigen


class PostgreSQLAdapter:
    """Adaptador para PostgreSQL"""
    
    def __init__(self, connection_string: str):
        """
        Args:
            connection_string: String de conexión PostgreSQL
                Ej: "host=localhost dbname=congreso user=postgres password=pass"
        """
        self.connection_string = connection_string
        self._connection = None
    
    def connect(self):
        """Establecer conexión"""
        if not self._connection or self._connection.closed:
            self._connection = psycopg2.connect(self.connection_string)
        return self._connection
    
    def disconnect(self):
        """Cerrar conexión"""
        if self._connection and not self._connection.closed:
            self._connection.close()
    
    def get_all_seats(self) -> List[Seat]:
        """Obtener todos los asientos"""
        conn = self.connect()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                seat_id,
                seat_number,
                section,
                row,
                status,
                buyer_name,
                buyer_email,
                buyer_phone,
                venta_origen,
                amount_paid,
                deposit_amount,
                total_amount,
                payment_status,
                reserved_at,
                expires_at,
                paid_at,
                created_at,
                updated_at,
                notes,
                cancellation_reason,
                refund_amount,
                refunded
            FROM seats
            ORDER BY seat_number
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        
        seats = []
        for row in rows:
            seat = self._row_to_seat(row)
            seats.append(seat)
        
        return seats
    
    def get_seat(self, seat_id: int) -> Optional[Seat]:
        """Obtener un asiento por ID"""
        conn = self.connect()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT * FROM seats WHERE seat_id = %s
        """
        
        cursor.execute(query, (seat_id,))
        row = cursor.fetchone()
        cursor.close()
        
        if row:
            return self._row_to_seat(row)
        return None
    
    def update_seat(self, seat: Seat) -> bool:
        """Actualizar un asiento"""
        conn = self.connect()
        cursor = conn.cursor()
        
        query = """
            UPDATE seats SET
                status = %s,
                buyer_name = %s,
                buyer_email = %s,
                buyer_phone = %s,
                venta_origen = %s,
                amount_paid = %s,
                deposit_amount = %s,
                payment_status = %s,
                reserved_at = %s,
                expires_at = %s,
                paid_at = %s,
                updated_at = %s,
                notes = %s,
                cancellation_reason = %s,
                refund_amount = %s,
                refunded = %s
            WHERE seat_id = %s
        """
        
        try:
            cursor.execute(query, (
                seat.status.value,
                seat.buyer_name,
                seat.buyer_email,
                seat.buyer_phone,
                seat.venta_origen.value if seat.venta_origen else None,
                seat.amount_paid,
                seat.deposit_amount,
                seat.payment_status,
                seat.reserved_at,
                seat.expires_at,
                seat.paid_at,
                datetime.now(),
                seat.notes,
                seat.cancellation_reason,
                seat.refund_amount,
                seat.refunded,
                seat.seat_id
            ))
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            conn.rollback()
            cursor.close()
            raise e
    
    def save_audit_log(self, audit_entry: Dict[str, Any]) -> bool:
        """Guardar entrada de auditoría"""
        conn = self.connect()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO audit_log (
                fecha, accion, asiento, motivo, 
                estado_anterior, estado_nuevo
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        try:
            cursor.execute(query, (
                audit_entry["fecha"],
                audit_entry["accion"],
                audit_entry["asiento"],
                audit_entry["motivo"],
                audit_entry["estado_anterior"],
                audit_entry["estado_nuevo"]
            ))
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            conn.rollback()
            cursor.close()
            raise e
    
    def _row_to_seat(self, row: Dict[str, Any]) -> Seat:
        """Convertir fila de BD a objeto Seat"""
        return Seat(
            seat_id=row['seat_id'],
            seat_number=row['seat_number'],
            section=row.get('section'),
            row=row.get('row'),
            status=SeatStatus(row['status']) if row['status'] else SeatStatus.VACANTE,
            buyer_name=row.get('buyer_name'),
            buyer_email=row.get('buyer_email'),
            buyer_phone=row.get('buyer_phone'),
            venta_origen=VentaOrigen(row['venta_origen']) if row.get('venta_origen') else None,
            amount_paid=float(row.get('amount_paid', 0) or 0),
            deposit_amount=float(row.get('deposit_amount', 0) or 0),
            total_amount=float(row.get('total_amount', 150000) or 150000),
            payment_status=row.get('payment_status'),
            reserved_at=row.get('reserved_at'),
            expires_at=row.get('expires_at'),
            paid_at=row.get('paid_at'),
            created_at=row.get('created_at'),
            updated_at=row.get('updated_at'),
            notes=row.get('notes'),
            cancellation_reason=row.get('cancellation_reason'),
            refund_amount=float(row.get('refund_amount', 0) or 0),
            refunded=bool(row.get('refunded', False))
        )
    
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.disconnect()

