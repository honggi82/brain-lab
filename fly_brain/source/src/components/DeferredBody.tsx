import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { Posture, Summary } from '../lib/api';
import { useT } from '../lib/i18n';

const Body = lazy(() => import('./FlyBody3D').then(module => ({ default: module.FlyBody3D })));

export function DeferredBody(props: { summary: Summary | null; posture: Posture | null; direction: string }) {
  const { t } = useT();
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(max-width: 760px)').matches || !host.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEnabled(true);
        observer.disconnect();
      }
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className="body-deferred">
    {enabled
      ? <Suspense fallback={<p role="status">{t('body.loading')}</p>}><Body {...props} /></Suspense>
      : <div className="body-placeholder">
          <p>{t('body.loadNote')}</p>
          <button onClick={() => setEnabled(true)}>{t('body.loadModel')}</button>
        </div>}
  </div>;
}
