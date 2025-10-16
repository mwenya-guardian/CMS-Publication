import { Workbox } from 'workbox-window';

class PWAService {
  private wb: Workbox | null = null;
  private updateAvailable = false;
  private updateCallbacks: (() => void)[] = [];

  constructor() {
    if ('serviceWorker' in navigator) {
      this.wb = new Workbox('/sw.js');
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    if (!this.wb) return;

    this.wb.addEventListener('waiting', () => {
      this.updateAvailable = true;
      this.notifyUpdateCallbacks();
    });

    this.wb.addEventListener('controlling', () => {
      window.location.reload();
    });
  }

  public register() {
    if (this.wb) {
      this.wb.register();
    }
  }

  public onUpdateAvailable(callback: () => void) {
    this.updateCallbacks.push(callback);
  }

  private notifyUpdateCallbacks() {
    this.updateCallbacks.forEach(callback => callback());
  }

  public isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  public update() {
    if (this.wb && this.updateAvailable) {
      this.wb.messageSkipWaiting();
    }
  }

  public dismissUpdate() {
    this.updateAvailable = false;
  }
}

export const pwaService = new PWAService();
