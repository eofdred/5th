'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { topics, type Topic } from '@/lib/topics';
import { Logo } from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { X, Loader2, Play, Pause } from 'lucide-react';
import type { PhotoViewerRef } from '@/components/photo-viewer';

const PhotoViewer = dynamic(() => import('@/components/photo-viewer'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full bg-muted" />,
});

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="#" className="flex items-center gap-2" aria-label="Vet-XR Home" onClick={() => window.location.reload()}>
          <div className="p-2 bg-primary rounded-lg">
            <Logo className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold font-headline text-foreground">Vet-XR</span>
        </Link>
      </div>
    </header>
  );
};

const TopicGrid = ({ topics, onTopicClick }: { topics: Topic[], onTopicClick: (topic: Topic) => void }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-6">
    {topics.map((topic, index) => (
      <div
        key={topic.slug}
        onClick={() => onTopicClick(topic)}
        className={`group block animate-in fade-in duration-500 ${topic.view360 ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
      >
        <Card className="h-full transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="items-center text-center p-6">
            <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors duration-300 group-hover:bg-primary/20">
              <topic.Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="font-headline text-lg text-foreground">{topic.title}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    ))}
  </div>
);

export default function Home() {
  const husbandryTopics = topics.filter((t) => t.category === 'animal-husbandry');
  const tradeTopics = topics.filter((t) => t.category === 'animal-trade');
  const barnTopics = topics.filter((t) => t.category === 'animal-barn');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const photoViewerRef = useRef<PhotoViewerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (selectedTopic && selectedTopic.audio) {
      if (audioRef.current) {
        audioRef.current.src = selectedTopic.audio;
        audioRef.current.play().catch(error => {
          console.error("Audio autoplay failed. This can happen if the user hasn't interacted with the page yet.", error);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [selectedTopic]);

  const handleTopicClick = (topic: Topic) => {
    if (topic.view360) {
      setSelectedTopic(topic);
    }
  };

  const handleDialogClose = () => {
    setSelectedTopic(null);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newProgress;
    setProgress(newProgress);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Accordion type="multiple" defaultValue={['animal-husbandry', 'animal-trade', 'animal-barn']} className="w-full space-y-4">
          <AccordionItem value="animal-husbandry" className="border-b rounded-lg bg-card/50">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline px-4">Koyun Yetiştiriciliği Uygulamaları</AccordionTrigger>
            <AccordionContent className="px-4">
              <TopicGrid topics={husbandryTopics} onTopicClick={handleTopicClick} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="animal-trade" className="border-b rounded-lg bg-card/50">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline px-4">Hayvan Ticaretinde Biyogüvenlik</AccordionTrigger>
            <AccordionContent className="px-4">
              <TopicGrid topics={tradeTopics} onTopicClick={handleTopicClick} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="animal-barn" className="border-b rounded-lg bg-card/50">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline px-4">Hayvan Barınakları</AccordionTrigger>
            <AccordionContent className="px-4">
              <TopicGrid topics={barnTopics} onTopicClick={handleTopicClick} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      <footer className="py-6 border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vet-XR. All rights reserved.</p>
        </div>
      </footer>

      <audio ref={audioRef} />

      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-0 bg-black [&>button:last-child]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>360-degree View: {selectedTopic?.title}</DialogTitle>
            <DialogDescription>
              An immersive 360-degree panoramic view. Use your mouse or touch to look around.
            </DialogDescription>
          </DialogHeader>
          {selectedTopic?.view360 && (
            <>
              <PhotoViewer
                ref={photoViewerRef}
                key={selectedTopic.slug}
                imageSrc={selectedTopic.view360.image}
                markers={selectedTopic.markers}
              />
              <button
                onClick={() => photoViewerRef.current?.toggleGyroscope()}
                className="absolute right-20 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-sm font-bold uppercase text-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Toggle Gyroscope"
              >
                vr
              </button>

              {selectedTopic.audio && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                  <div 
                    className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden relative cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-white/70 absolute left-0 top-0 transition-all duration-100 ease-linear pointer-events-none"
                      style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <button
                    onClick={togglePlay}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" fill="currentColor" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
          <DialogClose className="absolute right-6 top-6 z-50 rounded-full bg-black/50 p-1 text-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-8 w-8" strokeWidth={2.5} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
