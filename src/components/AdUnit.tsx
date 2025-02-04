'use client';

import { useEffect, useRef } from 'react';

type AdUnitProps = {
  slotId: string;
  dimensions: [number, number];
  targeting?: Record<string, string>;
  className?: string;
};

export default function AdUnit({
  slotId,
  dimensions,
  targeting,
  className,
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.googletag || !adRef.current) return;

    const googletag = window.googletag;
    googletag.cmd.push(() => {
      const slot = googletag
        .defineSlot(slotId, dimensions, adRef.current!)
        .addService(googletag.pubads());

      if (targeting) {
        slot.setTargeting(Object.keys(targeting), Object.values(targeting));
      }

      googletag.enableServices();
      googletag.display(adRef.current!);
    });

    return () => {
      googletag.cmd.push(() => {
        googletag.destroySlots([adRef.current!]);
      });
    };
  }, [slotId, dimensions, targeting]);

  return (
    <div className={className}>
      <div ref={adRef} />
    </div>
  );
}
