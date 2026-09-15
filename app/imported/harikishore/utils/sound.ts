class SoundManager {
  private isMuted: boolean = true; // Default muted to ensure silent navigation

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playClick() {
    // Navigation sound removed as requested
  }

  public playMatch() {
    // Silent
  }

  public playSnap() {
    // Silent
  }

  public playSuccess() {
    // Silent
  }
}

export const sound = new SoundManager();
