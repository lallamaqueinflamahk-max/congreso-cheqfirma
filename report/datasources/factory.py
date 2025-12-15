"""
Factory para crear adaptadores de datos según configuración
"""

from typing import Dict, Any, Optional
from report.datasources.postgresql import PostgreSQLAdapter
from report.datasources.csv_adapter import CSVAdapter


def create_data_adapter(config: Dict[str, Any]):
    """
    Crear adaptador de datos según configuración
    
    Args:
        config: Configuración del datasource desde config.yaml
        
    Returns:
        Adaptador (PostgreSQLAdapter o CSVAdapter)
    """
    datasource_type = config.get("type", "csv").lower()
    
    if datasource_type == "postgresql":
        connection_string = config.get("connection_string")
        if not connection_string:
            # Construir desde parámetros individuales
            host = config.get("host", "localhost")
            port = config.get("port", 5432)
            dbname = config.get("dbname", "congreso")
            user = config.get("user", "postgres")
            password = config.get("password", "")
            
            connection_string = f"host={host} port={port} dbname={dbname} user={user} password={password}"
        
        return PostgreSQLAdapter(connection_string)
    
    elif datasource_type == "csv":
        csv_path = config.get("csv_path", "data/seats.csv")
        column_mapping = config.get("column_mapping", {
            "seat_id": "seat_id",
            "seat_number": "seat_number",
            "status": "status",
            "buyer_name": "buyer_name",
            "buyer_email": "buyer_email",
            "venta_origen": "venta_origen",
            "amount_paid": "amount_paid",
            "deposit_amount": "deposit_amount"
        })
        
        return CSVAdapter(csv_path, column_mapping)
    
    else:
        raise ValueError(f"Tipo de datasource no soportado: {datasource_type}")

