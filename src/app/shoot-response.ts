import { ShootMapCellStatus } from "./shoot-map-cell-status.enum";

/**
 * Represents the response obtained from GameService after Shoot
 */
export interface ShootResponse {
    shootMapCellStatus : ShootMapCellStatus;
    winner : boolean;
} 
