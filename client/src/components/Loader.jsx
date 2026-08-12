import { useEffect, useState } from 'react';

/**
 * FPlus-inspired Page Entrance Loader/Splash Screen.
 * Runs on initial mount, displays custom branding and loading animation,
 * and fades out smoothly to reveal the main website.
 */
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    // Start fade out after 2.0s
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // Completely unmount after fade animation completes (0.6s)
    const removeTimer = setTimeout(() => {
      setRender(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!render) return null;

  return (
    <div className={`loader ${!visible ? 'loader--hidden' : ''}`} aria-hidden="true">
      <div className="loader__aura"></div>
      <div className="loader__stage">
        <div className="loader__logo">
          CWF<span>.</span>
        </div>
        <div className="loader__tag">Diagnose · Waterproof · Protect</div>
        <div className="loader__bar">
          <div className="loader__comet"></div>
        </div>
      </div>
    </div>
  );
}
