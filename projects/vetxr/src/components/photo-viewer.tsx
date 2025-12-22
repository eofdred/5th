
'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer } from 'photo-sphere-viewer';
import { MarkersPlugin } from 'photo-sphere-viewer/dist/plugins/markers';
import { GyroscopePlugin } from 'photo-sphere-viewer/dist/plugins/gyroscope';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import 'photo-sphere-viewer/dist/plugins/markers.css';
import { useToast } from '@/hooks/use-toast';
import { type Marker } from '@/lib/topics';

interface PhotoViewerProps {
  imageSrc: string | (() => Promise<{ default: string }>);
  markers?: Marker[];
}

export interface PhotoViewerRef {
  toggleGyroscope: () => void;
}

const PhotoViewer = forwardRef<PhotoViewerRef, PhotoViewerProps>(({ imageSrc, markers }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const { toast } = useToast();
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof imageSrc === 'function') {
      imageSrc().then(mod => {
        setResolvedImage(mod.default);
      });
    } else {
      setResolvedImage(imageSrc as string);
    }
  }, [imageSrc]);

  useImperativeHandle(ref, () => ({
    toggleGyroscope() {
      const gyroscopePlugin = viewerRef.current?.getPlugin(GyroscopePlugin);
      if (gyroscopePlugin) {
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

    // Only init if we have a resolved image data string
    if (!resolvedImage) return;

    const initTimeout = setTimeout(() => {
      if (container && !viewerRef.current) {
        try {
          viewerRef.current = new Viewer({
            container: container,
            panorama: resolvedImage, // Use resolved string
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

          viewerRef.current.on('click', (e: any, data: any) => {
            console.log(
              `User clicked at: latitude ${data.latitude}, longitude ${data.longitude}`
            );
          });

          viewerRef.current.on('error', (e: any) => {
            console.error('Photo Sphere Viewer error:', e);
            // Since we are using embedded images, file protocol error is unlikely for the image itself
            // but good to keep generic handler
            toast({
              variant: 'destructive',
              title: 'Viewer Error',
              description: 'Failed to render 360 image.',
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
    }, 150);

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
  }, [resolvedImage, markers, toast]); // Dependency on resolvedImage, not imageSrc

  return <div ref={containerRef} className="w-full h-full" />;
});

PhotoViewer.displayName = 'PhotoViewer';

export default PhotoViewer;
