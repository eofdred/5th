
'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import { MarkersPlugin } from 'photo-sphere-viewer/dist/plugins/markers';
import 'photo-sphere-viewer/dist/plugins/markers.css';
import { GyroscopePlugin } from 'photo-sphere-viewer/dist/plugins/gyroscope';
import { useToast } from '@/hooks/use-toast';
import type { Marker } from '@/lib/topics';

interface PhotoViewerProps {
  imageSrc: string;
  markers?: Marker[];
}

export interface PhotoViewerRef {
  toggleGyroscope: () => void;
}

const PhotoViewer = forwardRef<PhotoViewerRef, PhotoViewerProps>(({ imageSrc, markers }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    toggleGyroscope() {
      const gyroscopePlugin = viewerRef.current?.getPlugin(GyroscopePlugin);
      if (gyroscopePlugin) {
        // The library seems to return an object where `isStarted` is a property,
        // not a function, causing a runtime error. This checks the property directly.
        if ((gyroscopePlugin as any).isStarted) {
          (gyroscopePlugin as any).stop();
        } else {
          (gyroscopePlugin as any).start().catch(() => {
            toast({
              variant: 'destructive',
              title: 'Gyroscope Error',
              description:
                'Could not activate motion controls. Please ensure your device supports it and permissions are granted.',
            });
          });
        }
      }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    
    // Use a timeout to delay initialization. This ensures the container element
    // is fully rendered and sized by the browser, especially inside an animated
    // dialog. This avoids race conditions that cause initialization errors.
    const initTimeout = setTimeout(() => {
      if (container && !viewerRef.current) {
        try {
          // The 'any' cast is a workaround for a type mismatch issue between
          // 'three' and the viewer's plugin system. It is safe in this context.
          viewerRef.current = new Viewer({
            container: container,
            panorama: imageSrc,
            loadingTxt: 'Loading...',
            navbar: ['zoom', 'fullscreen', 'caption'],
            defaultZoomLvl: 30,
            plugins: [
              [MarkersPlugin as any, {}],
              [GyroscopePlugin as any, {}],
            ]
          });

          const markersPlugin = viewerRef.current.getPlugin(MarkersPlugin);

          if (markersPlugin && markers) {
            markersPlugin.clearMarkers();
            for (const marker of markers) {
              markersPlugin.addMarker(marker);
            }
          }

          // Log click coordinates to the console
          viewerRef.current.on('click', (e, data) => {
            console.log(
              `User clicked at: latitude ${data.latitude}, longitude ${data.longitude}`
            );
          });

          viewerRef.current.on('error', (e) => {
            console.error('Photo Sphere Viewer error:', e);
            toast({
              variant: 'destructive',
              title: 'Failed to load image',
              description: 'The image could not be loaded. Please ensure the file path is correct and the file is not corrupt.',
            });
          });
        } catch (e) {
           console.error('Photo Sphere Viewer initialization error:', e);
           toast({
                variant: 'destructive',
                title: 'Viewer Error',
                description: 'The 360-degree viewer failed to start.',
            });
        }
      }
    }, 150); // 150ms delay is sufficient for the DOM to settle.

    // The cleanup function is critical for preventing memory leaks and errors.
    // It runs when the component unmounts.
    return () => {
      clearTimeout(initTimeout);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Photo Sphere Viewer cleanup error:', e);
        } finally {
          viewerRef.current = null;
        }
      }
    };
    // By including imageSrc and markers in the dependency array, we ensure that if the source
    // changes while the component is mounted, the old viewer is destroyed and
    // a new one is created with the new markers.
  }, [imageSrc, markers, toast]);

  return <div ref={containerRef} className="w-full h-full" />;
});

PhotoViewer.displayName = 'PhotoViewer';

export default PhotoViewer;
