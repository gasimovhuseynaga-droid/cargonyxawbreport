import { Role } from '@/types/warehouse'

export function canReceive(role: Role) {
    return ['admin', 'receiver'].includes(role)
}

export function canPick(role: Role) {
    return ['admin', 'picker'].includes(role)
}

export function canShip(role: Role) {
    return ['admin', 'shipper'].includes(role)
}