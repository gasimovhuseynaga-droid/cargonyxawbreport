export type Role = 'admin' | 'receiver' | 'picker' | 'shipper'
export type DeclarationStatus = 'yes' | 'no' | 'pending'
export type BoxStatus = 'in_stock' | 'hold' | 'shipped'

export interface Employee {
    id: string
    full_name: string
    pin_code: string
    role: Role
}

export interface Box {
    id: string
    box_code: string
    pis: string
    order_code?: string
    items_count: number
    declaration_status: DeclarationStatus
    picked: boolean
    status: BoxStatus
    warehouse_zone?: string
    warehouse_location?: string
    notes?: string
}

export interface Courier {
    id: string
    code: string
    display_name: string
}

export interface AirWaybill {
    id: string
    courier_id: string
    airwaybill_number: string
    total_boxes: number
    total_weight_kg: number
}