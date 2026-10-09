export const CURRENT_APP_VERSION = '1.0.1';
export const GITHUB_REPO = 'shahinprpl-sketch/quran-app';

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseName: string;
  releaseNotes: string;
  downloadUrl: string;
  publishedAt?: string;
}

// Compare semantic version strings like "1.0.2" vs "1.0.1"
export const isVersionNewer = (remote: string, current: string): boolean => {
  const cleanRemote = remote.replace(/^v/i, '').trim();
  const cleanCurrent = current.replace(/^v/i, '').trim();

  const remoteParts = cleanRemote.split('.').map(p => parseInt(p, 10) || 0);
  const currentParts = cleanCurrent.split('.').map(p => parseInt(p, 10) || 0);

  const maxLen = Math.max(remoteParts.length, currentParts.length);
  for (let i = 0; i < maxLen; i++) {
    const r = remoteParts[i] || 0;
    const c = currentParts[i] || 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
};

export const checkForAppUpdate = async (force: boolean = false): Promise<UpdateInfo | null> => {
  try {
    // If not forced, avoid spamming the GitHub API if checked in last 12 hours
    const lastCheck = localStorage.getItem('last_update_check_timestamp');
    const now = Date.now();
    if (!force && lastCheck && now - parseInt(lastCheck, 10) < 12 * 60 * 60 * 1000) {
      const cached = localStorage.getItem('cached_update_info');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore cache parse error
        }
      }
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const tagName = data.tag_name || '';
    const cleanTag = tagName.replace(/^v/i, '');

    const hasUpdate = isVersionNewer(cleanTag, CURRENT_APP_VERSION);

    // Look for signed release apk first, then any apk
    let downloadUrl = data.html_url;
    if (Array.isArray(data.assets) && data.assets.length > 0) {
      const releaseApk = data.assets.find((a: any) => a.name && a.name.includes('release.apk'));
      const anyApk = data.assets.find((a: any) => a.name && a.name.endsWith('.apk'));
      if (releaseApk?.browser_download_url) {
        downloadUrl = releaseApk.browser_download_url;
      } else if (anyApk?.browser_download_url) {
        downloadUrl = anyApk.browser_download_url;
      }
    }

    const updateInfo: UpdateInfo = {
      hasUpdate,
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: cleanTag || CURRENT_APP_VERSION,
      releaseName: data.name || `Version ${cleanTag}`,
      releaseNotes: data.body || '',
      downloadUrl,
      publishedAt: data.published_at
    };

    localStorage.setItem('last_update_check_timestamp', now.toString());
    localStorage.setItem('cached_update_info', JSON.stringify(updateInfo));

    return updateInfo;
  } catch (error) {
    console.warn('Update check failed:', error);
    return null;
  }
};
