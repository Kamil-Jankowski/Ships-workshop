import { Injectable } from '@angular/core';

/**
 * Provides methods for adding new messages to the website and clearing the log
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  /**
   * Adds new message to the array
   * @param message - messsage to be added (of type string)
   */
  add(message: string) {
    this.messages.push(message);
  }

  /**
   * Deletes all the messages from the array
   */
  clear() {
    this.messages = [];
  }
}