export class ActivityService {
  private static activityTimeout: NodeJS.Timeout | null = null;
  private static shouldReconnect = false;
  private static actions: Set<() => void> = new Set();
  private static areListenersActive = false;
  private static readonly INACTIVITY_THRESHOLD = 5 * 60 * 1000;
  private static readonly ACTIVITY_EVENTS = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ];

  private constructor() {}

  static init(): void {
    this.setupVisibilityListeners();
    this.resetActivityTimer();
  }

  static cleanup(): void {
    this.removeActivityListeners();
    this.removeVisibilityListeners();
    this.clearActivityTimer();
    this.actions.clear();
  }

  static addActions(...actions: (() => void)[]): void {
    actions.forEach((action) => this.actions.add(action));
  }

  private static handleUserActivity = (): void => {
    if (this.shouldReconnect) {
      console.log('User is back - executing actions queue');
      this.actions.forEach((action) => {
        try {
          action();
        } catch (error) {
          console.error(`Error executing action: ${action.name}()`, error);
        }
      });
      this.shouldReconnect = false;
      this.removeActivityListeners();
      this.areListenersActive = false;
    }

    this.resetActivityTimer();
  };

  private static handleWindowBlur = (): void => {
    this.shouldReconnect = true;
    this.setupActivityListeners();
  };

  private static handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.shouldReconnect = true;
      this.setupActivityListeners();
    }
  };

  private static setupActivityListeners(): void {
    if (this.areListenersActive) return;

    this.ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, this.handleUserActivity, {
        passive: true,
      });
    });
    this.areListenersActive = true;
  }

  private static setupVisibilityListeners(): void {
    window.addEventListener('focus', this.handleUserActivity);
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private static removeActivityListeners(): void {
    if (!this.areListenersActive) return;

    this.ACTIVITY_EVENTS.forEach((event) => {
      document.removeEventListener(event, this.handleUserActivity);
    });

    this.areListenersActive = false;
  }

  private static removeVisibilityListeners(): void {
    window.removeEventListener('focus', this.handleUserActivity);
    window.removeEventListener('blur', this.handleWindowBlur);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
  }

  private static resetActivityTimer(): void {
    this.clearActivityTimer();

    this.activityTimeout = setTimeout(() => {
      this.shouldReconnect = true;
      this.setupActivityListeners();
    }, this.INACTIVITY_THRESHOLD);
  }

  private static clearActivityTimer(): void {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }
  }
}
