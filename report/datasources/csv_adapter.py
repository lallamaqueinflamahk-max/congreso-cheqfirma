"""
Adaptador CSV para datos de asientos
Mapping flexible por config.yaml
"""

import csv
from typing import List, Optional, Dict, Any
from datetime import datetime
from pathlib import Path
from report.policy import Seat, SeatStatus, VentaOrigen


class CSVAdapter:
    """Adaptador para CSV con mapping flexible"""
    
    def __init__(self, csv_path: str, column_mapping: Dict[str, str]):
        """
        Args:
            csv_path: Ruta al archivo CSV
            column_mapping: Mapeo de columnas CSV a campos de Seat
                Ej: {"seat_id": "ID", "buyer_name": "Nombre", ...}
        """
        self.csv_path = Path(csv_path)
        self.column_mapping = column_mapping
        self._seats_cache: Optional[List[Seat]] = None
    
    def get_all_seats(self) -> List[Seat]:
        """Obtener todos los asientos desde CSV"""
        if self._seats_cache is not None:
            return self._seats_cache
        
        seats = []
        
        if not self.csv_path.exists():
            return seats
        
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                seat = self._row_to_seat(row)
                if seat:
                    seats.append(seat)
        
        self._seats_cache = seats
        return seats
    
    def get_seat(self, seat_id: int) -> Optional[Seat]:
        """Obtener un asiento por ID"""
        seats = self.get_all_seats()
        for seat in seats:
            if seat.seat_id == seat_id:
                return seat
        return None
    
    def update_seat(self, seat: Seat) -> bool:
        """Actualizar un asiento (reescribe CSV completo)"""
        seats = self.get_all_seats()
        
        # Actualizar o agregar asiento
        found = False
        for i, s in enumerate(seats):
            if s.seat_id == seat.seat_id:
                seats[i] = seat
                found = True
                break
        
        if not found:
            seats.append(seat)
        
        # Reescribir CSV
        self._write_seats_to_csv(seats)
        self._seats_cache = seats
        return True
    
    def save_audit_log(self, audit_entry: Dict[str, Any]) -> bool:
        """Guardar entrada de auditoría (append a CSV)"""
        audit_file = self.csv_path.parent / "audit_log.csv"
        
        # Crear archivo si no existe
        file_exists = audit_file.exists()
        
        with open(audit_file, 'a', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=[
                "fecha", "accion", "asiento", "motivo",
                "estado_anterior", "estado_nuevo"
            ])
            
            if not file_exists:
                writer.writeheader()
            
            writer.writerow({
                "fecha": audit_entry["fecha"].isoformat(),
                "accion": audit_entry["accion"],
                "asiento": audit_entry["asiento"],
                "motivo": audit_entry["motivo"],
                "estado_anterior": audit_entry["estado_anterior"],
                "estado_nuevo": audit_entry["estado_nuevo"]
            })
        
        return True
    
    def _row_to_seat(self, row: Dict[str, str]) -> Optional[Seat]:
        """Convertir fila CSV a objeto Seat usando mapping"""
        try:
            # Mapear columnas
            def get_field(field_name: str, default=None):
                csv_col = self.column_mapping.get(field_name)
                if csv_col and csv_col in row:
                    return row[csv_col].strip() if row[csv_col] else default
                return default
            
            # Parsear valores
            seat_id = int(get_field("seat_id", "0"))
            if seat_id == 0:
                return None
            
            # Estado
            status_str = get_field("status", "VACANTE")
            try:
                status = SeatStatus(status_str.upper())
            except ValueError:
                status = SeatStatus.VACANTE
            
            # Origen de venta
            origen_str = get_field("venta_origen")
            venta_origen = None
            if origen_str:
                try:
                    venta_origen = VentaOrigen(origen_str.upper())
                except ValueError:
                    pass
            
            # Fechas
            def parse_date(date_str: Optional[str]) -> Optional[datetime]:
                if not date_str:
                    return None
                try:
                    return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                except:
                    try:
                        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                    except:
                        return None
            
            return Seat(
                seat_id=seat_id,
                seat_number=int(get_field("seat_number", str(seat_id))),
                section=get_field("section"),
                row=int(get_field("row")) if get_field("row") else None,
                status=status,
                buyer_name=get_field("buyer_name"),
                buyer_email=get_field("buyer_email"),
                buyer_phone=get_field("buyer_phone"),
                venta_origen=venta_origen,
                amount_paid=float(get_field("amount_paid", "0") or 0),
                deposit_amount=float(get_field("deposit_amount", "0") or 0),
                total_amount=float(get_field("total_amount", "150000") or 150000),
                payment_status=get_field("payment_status"),
                reserved_at=parse_date(get_field("reserved_at")),
                expires_at=parse_date(get_field("expires_at")),
                paid_at=parse_date(get_field("paid_at")),
                created_at=parse_date(get_field("created_at")),
                updated_at=parse_date(get_field("updated_at")) or datetime.now(),
                notes=get_field("notes"),
                cancellation_reason=get_field("cancellation_reason"),
                refund_amount=float(get_field("refund_amount", "0") or 0),
                refunded=get_field("refunded", "false").lower() == "true"
            )
        except Exception as e:
            print(f"Error parseando fila CSV: {e}")
            return None
    
    def _write_seats_to_csv(self, seats: List[Seat]):
        """Escribir asientos a CSV"""
        # Crear directorio si no existe
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Obtener todas las columnas posibles
        fieldnames = [
            "seat_id", "seat_number", "section", "row",
            "status", "buyer_name", "buyer_email", "buyer_phone",
            "venta_origen", "amount_paid", "deposit_amount", "total_amount",
            "payment_status", "reserved_at", "expires_at", "paid_at",
            "created_at", "updated_at", "notes",
            "cancellation_reason", "refund_amount", "refunded"
        ]
        
        with open(self.csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for seat in seats:
                writer.writerow({
                    "seat_id": seat.seat_id,
                    "seat_number": seat.seat_number,
                    "section": seat.section or "",
                    "row": seat.row or "",
                    "status": seat.status.value,
                    "buyer_name": seat.buyer_name or "",
                    "buyer_email": seat.buyer_email or "",
                    "buyer_phone": seat.buyer_phone or "",
                    "venta_origen": seat.venta_origen.value if seat.venta_origen else "",
                    "amount_paid": seat.amount_paid,
                    "deposit_amount": seat.deposit_amount,
                    "total_amount": seat.total_amount,
                    "payment_status": seat.payment_status or "",
                    "reserved_at": seat.reserved_at.isoformat() if seat.reserved_at else "",
                    "expires_at": seat.expires_at.isoformat() if seat.expires_at else "",
                    "paid_at": seat.paid_at.isoformat() if seat.paid_at else "",
                    "created_at": seat.created_at.isoformat() if seat.created_at else "",
                    "updated_at": seat.updated_at.isoformat() if seat.updated_at else "",
                    "notes": seat.notes or "",
                    "cancellation_reason": seat.cancellation_reason or "",
                    "refund_amount": seat.refund_amount,
                    "refunded": "true" if seat.refunded else "false"
                })

