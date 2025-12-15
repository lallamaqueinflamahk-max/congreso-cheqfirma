-- Schema PostgreSQL para sistema de gestión de asientos
-- Congreso ADN Humano

-- Tabla de asientos
CREATE TABLE IF NOT EXISTS seats (
    seat_id SERIAL PRIMARY KEY,
    seat_number INTEGER NOT NULL UNIQUE,
    section VARCHAR(50),
    row INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'VACANTE',
    buyer_name VARCHAR(255),
    buyer_email VARCHAR(255),
    buyer_phone VARCHAR(50),
    venta_origen VARCHAR(20),  -- WHATSAPP_CALIENTE | VIRTUAL_FRIO
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    deposit_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) DEFAULT 150000,
    payment_status VARCHAR(20),
    reserved_at TIMESTAMP,
    expires_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    cancellation_reason TEXT,
    refund_amount DECIMAL(12, 2) DEFAULT 0,
    refunded BOOLEAN DEFAULT FALSE
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(100) NOT NULL,
    asiento INTEGER NOT NULL,
    motivo TEXT,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);
CREATE INDEX IF NOT EXISTS idx_seats_venta_origen ON seats(venta_origen);
CREATE INDEX IF NOT EXISTS idx_seats_expires_at ON seats(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_fecha ON audit_log(fecha);
CREATE INDEX IF NOT EXISTS idx_audit_asiento ON audit_log(asiento);

-- Comentarios
COMMENT ON TABLE seats IS 'Asientos del congreso ADN Humano';
COMMENT ON COLUMN seats.venta_origen IS 'Origen de venta: WHATSAPP_CALIENTE o VIRTUAL_FRIO';
COMMENT ON COLUMN seats.status IS 'Estado: VENDIDO, RESERVADO, VACANTE';

