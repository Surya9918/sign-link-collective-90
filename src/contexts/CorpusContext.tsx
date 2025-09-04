import React, { createContext, useContext, useState } from 'react';

interface VideoMetadata {
  signLabel: string;
  language: string;
  ageGroup: 'child' | 'youth' | 'adult' | 'senior';
  handedness: 'left' | 'right' | 'both';
}

interface CorpusVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  metadata: VideoMetadata;
  contributorId: string;
  contributorName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

interface CorpusContextType {
  videos: CorpusVideo[];
  addVideo: (video: Omit<CorpusVideo, 'id' | 'uploadDate' | 'status'>) => void;
  updateVideoStatus: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  getVideosByContributor: (contributorId: string) => CorpusVideo[];
  getVideosByStatus: (status: 'pending' | 'approved' | 'rejected') => CorpusVideo[];
}

const CorpusContext = createContext<CorpusContextType | undefined>(undefined);

// Mock corpus data
const mockVideos: CorpusVideo[] = [
  {
    id: '1',
    videoUrl: '/mock-video-1.mp4',
    thumbnailUrl: '/placeholder.svg',
    metadata: {
      signLabel: 'Hello',
      language: 'ASL',
      ageGroup: 'adult',
      handedness: 'both'
    },
    contributorId: '1',
    contributorName: 'alex_signer',
    uploadDate: '2024-01-20',
    status: 'approved'
  },
  {
    id: '2',
    videoUrl: '/mock-video-2.mp4',
    thumbnailUrl: '/placeholder.svg',
    metadata: {
      signLabel: 'Thank You',
      language: 'ASL',
      ageGroup: 'adult',
      handedness: 'both'
    },
    contributorId: '2',
    contributorName: 'maria_asl',
    uploadDate: '2024-01-22',
    status: 'approved'
  },
  {
    id: '3',
    videoUrl: '/mock-video-3.mp4',
    thumbnailUrl: '/placeholder.svg',
    metadata: {
      signLabel: 'Goodbye',
      language: 'BSL',
      ageGroup: 'youth',
      handedness: 'right'
    },
    contributorId: '1',
    contributorName: 'alex_signer',
    uploadDate: '2024-01-25',
    status: 'pending'
  }
];

export const CorpusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<CorpusVideo[]>(mockVideos);

  const addVideo = (video: Omit<CorpusVideo, 'id' | 'uploadDate' | 'status'>) => {
    const newVideo: CorpusVideo = {
      ...video,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const updateVideoStatus = (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setVideos(prev => prev.map(video => 
      video.id === id 
        ? { ...video, status, reviewNotes: notes }
        : video
    ));
  };

  const getVideosByContributor = (contributorId: string) => {
    return videos.filter(video => video.contributorId === contributorId);
  };

  const getVideosByStatus = (status: 'pending' | 'approved' | 'rejected') => {
    return videos.filter(video => video.status === status);
  };

  return (
    <CorpusContext.Provider value={{
      videos,
      addVideo,
      updateVideoStatus,
      getVideosByContributor,
      getVideosByStatus
    }}>
      {children}
    </CorpusContext.Provider>
  );
};

export const useCorpus = () => {
  const context = useContext(CorpusContext);
  if (context === undefined) {
    throw new Error('useCorpus must be used within a CorpusProvider');
  }
  return context;
};