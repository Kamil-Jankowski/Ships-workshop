/**
 * Represents the notification to be handled by toastr.
 */

export class NotificationMessage {
    message: string;
    type: NotificationType
}

export enum NotificationType {
    success = 0,
    warning = 1, 
    error = 2,
    info = 3
}