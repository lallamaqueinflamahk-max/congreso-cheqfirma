"""
Adaptador para Netlify Blobs (fuente principal de datos)
Accede a los datos de asientos almacenados en Netlify Blobs
"""

import json
import os
import requests
from typing import List, Optional, Dict, Any
from datetime import datetime
from report.policy import Seat, SeatStatus, VentaOrigen


class NetlifyBlobsAdapter:
    """Adaptador para Netlify Blobs vía API o archivo JSON exportado"""
    
    def __init__(self, api_url: Optional[str] = None, json_export_path: Optional[str] = None):
        """
        Args:
            api_url: URL de la función Netlify que expone los datos (ej: https://site.netlify.app/.netlify/functions/getSeats)
            json_export_path: Ruta a archivo JSON exportado (alternativa si no hay API)
        """
        self.api_url = api_url
        self.json_export_path = json_export_path
        self._seats_cache: Optional[List[Seat]] = None
    
    def get_all_seats(self) -> List[Seat]:
        """Obtener todos los asientos desde Netlify Blobs"""
        if self._seats_cache is not None:
            return self._seats_cache
        
        raw_data = self._fetch_data()
        seats = self._parse_seats(raw_data)
        self._seats_cache = seats
        return seats
    
    def get_seat(self, seat_number: int) -> Optional[Seat]:
        """Obtener un asiento por número"""
        seats = self.get_all_seats()
        for seat in seats:
            if seat.seat_number == seat_number:
                return seat
        return None
    
    def update_seat(self, seat: Seat) -> bool:
        """Actualizar asiento (solo en cache, no persiste en Blobs)"""
        seats = self.get_all_seats()
        found = False
        for i, s in enumerate(seats):
            if s.seat_number == seat.seat_number:
                seats[i] = seat
                found = True
                break
        if not found:
            seats.append(seat)
        self._seats_cache = seats
        return True
    
    def save_audit_log(self, audit_entry: Dict[str, Any]) -> bool:
        """Guardar entrada de auditoría (solo en memoria, no persiste)"""
        # En producción, esto debería escribir a un archivo o base de datos
        return True
    
    def _fetch_data(self) -> Dict[str, Any]:
        """Obtener datos desde API o archivo JSON"""
        if self.json_export_path and os.path.exists(self.json_export_path):
            # Leer desde archivo JSON exportado
            with open(self.json_export_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        elif self.api_url:
            # Obtener desde API
            token = os.getenv('NETLIFY_TOKEN') or os.getenv('REPORT_TOKEN', 'cheqfirma2025')
            headers = {'Authorization': f'Bearer {token}'}
            try:
                response = requests.get(self.api_url, headers=headers, timeout=30)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                raise Exception(f"Error obteniendo datos desde API: {e}")
        else:
            raise Exception("Se requiere api_url o json_export_path")
    
    def _parse_seats(self, data: Dict[str, Any]) -> List[Seat]:
        """Convertir datos de Netlify Blobs a objetos Seat"""
        seats = []
        
        # Netlify Blobs almacena asientos en formato:
        # { "all-seats": { "1": "SOLD", "2": "RESERVED", ... } }
        # Y cada asiento individual en "seat-{number}"
        
        all_seats_index = data.get('all-seats', {})
        if isinstance(all_seats_index, str):
            all_seats_index = json.loads(all_seats_index)
        
        # Obtener todos los asientos individuales
        seat_data_map = {}
        for key, value in data.items():
            if key.startswith('seat-'):
                seat_num = int(key.replace('seat-', ''))
                if isinstance(value, str):
                    seat_data_map[seat_num] = json.loads(value)
                else:
                    seat_data_map[seat_num] = value
        
        # Si no hay datos individuales, usar el índice
        if not seat_data_map and all_seats_index:
            # Crear asientos básicos desde el índice
            for seat_num_str, status_str in all_seats_index.items():
                seat_num = int(seat_num_str)
                seat = self._create_seat_from_status(seat_num, status_str)
                if seat:
                    seats.append(seat)
        else:
            # Usar datos completos
            for seat_num, seat_data in seat_data_map.items():
                seat = self._blob_data_to_seat(seat_num, seat_data)
                if seat:
                    seats.append(seat)
        
        return seats
    
    def _create_seat_from_status(self, seat_number: int, status_str: str) -> Optional[Seat]:
        """Crear asiento básico desde estado"""
        try:
            status = SeatStatus(status_str.upper())
        except ValueError:
            status = SeatStatus.VACANTE
        
        return Seat(
            seat_id=seat_number,
            seat_number=seat_number,
            status=status,
            total_amount=150000.0,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    def _blob_data_to_seat(self, seat_number: int, blob_data: Dict[str, Any]) -> Optional[Seat]:
        """Convertir datos de blob a objeto Seat"""
        try:
            # Mapear estados
            status_str = blob_data.get('status', 'AVAILABLE')
            try:
                status = SeatStatus(status_str.upper())
            except ValueError:
                # Mapear estados de Netlify a nuestros estados
                status_map = {
                    'SOLD': SeatStatus.VENDIDO,
                    'RESERVED': SeatStatus.RESERVADO,
                    'AVAILABLE': SeatStatus.VACANTE
                }
                status = status_map.get(status_str.upper(), SeatStatus.VACANTE)
            
            # Mapear origen de venta
            venta_origen = None
            origen_str = blob_data.get('venta_origen') or blob_data.get('seatType') or blob_data.get('ticketType')
            if origen_str:
                # Mapear a nuestros orígenes
                if 'whatsapp' in str(origen_str).lower() or 'caliente' in str(origen_str).lower():
                    venta_origen = VentaOrigen.WHATSAPP_CALIENTE
                elif 'virtual' in str(origen_str).lower() or 'frio' in str(origen_str).lower():
                    venta_origen = VentaOrigen.VIRTUAL_FRIO
            
            # Determinar si es físico o virtual
            seat_type = blob_data.get('seatType', 'presencial')
            ticket_type = blob_data.get('ticketType', 'general')
            is_virtual = 'virtual' in str(seat_type).lower() or 'virtual' in str(ticket_type).lower()
            
            # Parsear fechas
            def parse_date(date_str: Optional[str]) -> Optional[datetime]:
                if not date_str:
                    return None
                try:
                    # ISO format
                    return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                except:
                    try:
                        # Timestamp
                        return datetime.fromtimestamp(int(date_str) / 1000)
                    except:
                        return None
            
            # Montos
            paid_amount = float(blob_data.get('paidAmount', 0) or 0)
            total_amount = float(blob_data.get('totalAmount', 150000) or 150000)
            deposit_amount = paid_amount if paid_amount < total_amount else 0
            
            return Seat(
                seat_id=seat_number,
                seat_number=seat_number,
                status=status,
                buyer_name=blob_data.get('buyerName'),
                buyer_email=blob_data.get('buyerEmail'),
                buyer_phone=blob_data.get('buyerPhone'),
                venta_origen=venta_origen,
                amount_paid=paid_amount,
                deposit_amount=deposit_amount,
                total_amount=total_amount,
                payment_status=blob_data.get('paymentMethod') or blob_data.get('paymentStatus'),
                reserved_at=parse_date(blob_data.get('createdAt')) if status == SeatStatus.RESERVADO else None,
                expires_at=parse_date(blob_data.get('reservationExpiresAt')),
                paid_at=parse_date(blob_data.get('updatedAt')) if status == SeatStatus.VENDIDO else None,
                created_at=parse_date(blob_data.get('createdAt')) or datetime.now(),
                updated_at=parse_date(blob_data.get('updatedAt')) or datetime.now(),
                notes=blob_data.get('notes'),
                cancellation_reason=None,
                refund_amount=0.0,
                refunded=False
            )
        except Exception as e:
            print(f"Error parseando asiento {seat_number}: {e}")
            return None

