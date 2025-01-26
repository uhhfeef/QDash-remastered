import { useEffect, useRef } from 'react';

export function ArtifactIframe({ code }: { code: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
  