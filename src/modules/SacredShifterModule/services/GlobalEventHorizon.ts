import { GESemanticEvent } from '../types/ssos';

export class GlobalEventHorizon {
  private eventListeners: Map<string, Set<(event: GESemanticEvent) => void>> = new Map();
  private eventHistory: GESemanticEvent[] = [];
  private maxHistorySize = 1000;

  emit(event: GESemanticEvent): void {
    try {
      // Add timestamp and source tracking
      const enhancedEvent: GESemanticEvent = {
        ...event,
        timestamp: new Date(),
        sourceModule: event.sourceModule || 'unknown'
      };

      // Store in history for Akashic Record
      this.eventHistory.push(enhancedEvent);
      if (this.eventHistory.length > this.maxHistorySize) {
        this.eventHistory.shift();
      }

      // Notify all subscribers
      const listeners = this.eventListeners.get(event.type);
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(enhancedEvent);
          } catch (error) {
            console.error(`Error in event listener for ${event.type}:`, error);
          }
        });
      }

      // Emit to wildcard listeners
      const wildcardListeners = this.eventListeners.get('*');
      if (wildcardListeners) {
        wildcardListeners.forEach(listener => {
          try {
            listener(enhancedEvent);
          } catch (error) {
            console.error('Error in wildcard event listener:', error);
          }
        });
      }

      console.log(`🌌 GEH Event: ${event.type}`, enhancedEvent);
    } catch (error) {
      console.error('Error emitting event:', error);
    }
  }

  subscribe(eventType: string, handler: (event: GESemanticEvent) => void): void {
    try {
      if (!this.eventListeners.has(eventType)) {
        this.eventListeners.set(eventType, new Set());
      }
      this.eventListeners.get(eventType)!.add(handler);
    } catch (error) {
      console.error(`Error subscribing to ${eventType}:`, error);
    }
  }

  unsubscribe(eventType: string, handler: (event: GESemanticEvent) => void): void {
    try {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(handler);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    } catch (error) {
      console.error(`Error unsubscribing from ${eventType}:`, error);
    }
  }

  getEventHistory(filter?: {
    eventType?: string;
    essenceLabels?: string[];
    timeRange?: { start: Date; end: Date };
  }): GESemanticEvent[] {
    try {
      let filteredHistory = [...this.eventHistory];

      if (filter) {
        if (filter.eventType) {
          filteredHistory = filteredHistory.filter(event => event.type === filter.eventType);
        }

        if (filter.essenceLabels && filter.essenceLabels.length > 0) {
          filteredHistory = filteredHistory.filter(event =>
            filter.essenceLabels!.some(label => event.essenceLabels.includes(label))
          );
        }

        if (filter.timeRange) {
          filteredHistory = filteredHistory.filter(event =>
            event.timestamp! >= filter.timeRange!.start &&
            event.timestamp! <= filter.timeRange!.end
          );
        }
      }

      return filteredHistory;
    } catch (error) {
      console.error('Error getting event history:', error);
      return [];
    }
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}