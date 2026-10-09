/**
 * Puts the visitor's own system first among the download buttons. The built HTML already
 * holds both buttons, equal and linked, so with this script off — or on any other system —
 * nothing changes.
 */

/** Emphasised button variant → its plain counterpart, per button group. */
const PLAIN = {
  "button--primary": "button--secondary",
  "button--light": "button--ghost",
};

/** "mac", "windows", or null when neither installer runs on the visitor's system. */
export function pickPlatform(userAgent) {
  // iOS user agents say "like Mac OS X" but cannot open a .dmg.
  if (/iPhone|iPad|iPod/.test(userAgent)) return null;
  if (/Macintosh|Mac OS X/.test(userAgent)) return "mac";
  if (/Windows NT/.test(userAgent)) return "windows";
  return null;
}

/** Moves the picked platform's button first in each group and demotes the others to the plain variant. */
export function applyPlatform(document, userAgent) {
  const platform = pickPlatform(userAgent);
  if (!platform) return;
  for (const group of document.querySelectorAll(".buttons")) {
    const picked = group.querySelector(`a[data-platform="${platform}"]`);
    if (!picked) continue;
    group.prepend(picked);
    for (const other of group.querySelectorAll("a[data-platform]")) {
      if (other === picked) continue;
      for (const [emphasised, plain] of Object.entries(PLAIN))
        other.classList.replace(emphasised, plain);
    }
  }
}

// Through globalThis: the repo lints *.js with node globals, and the tests import this file.
if (globalThis.document)
  applyPlatform(globalThis.document, globalThis.navigator.userAgent);
