import { ButtonStatus } from "./button-status.enum";

/**
 * Represents square on the grid map.
 */
export interface Square {
    id: number;
    status: ButtonStatus;
}
