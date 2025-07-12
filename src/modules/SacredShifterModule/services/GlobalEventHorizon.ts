import { GESemanticEvent } from '../types/ssos';

export class GlobalEventHorizon {
  private eventListeners: Map<string, Set<(event: GESemanticEvent) => void>> = new Map();
  private eventHistory: GESemanticEvent[] = [];
  private maxHistorySize = 1000;

  emit(event: GESemanticEvent): void {
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
  }

  subscribe(eventType: string, handler: (event: GESemanticEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(handler);
  }

  unsubscribe(eventType: string, handler: (event: GESemanticEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(handler);
      if (listeners.size === 0) {
        this.eventListeners.delete(eventType);
      }
    }
  }

  getEventHistory(filter?: {
    eventType?: string;
    essenceLabels?: string[];
    timeRange?: { start: Date; end: Date };
  }): GESemanticEvent[] {
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
  }

  clearHistory(): void {
    this.eventHistory = [];
  }

  getActiveListeners(): Map<string, number> {
    const listenerCounts = new Map<string, number>();
    this.eventListeners.forEach((listeners, eventType) => {
      listenerCounts.set(eventType, listeners.size);
    });
    return listenerCounts;
  }
}