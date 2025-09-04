import React, { useState, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCorpus } from '@/contexts/CorpusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Video, Play, Square, RotateCcw, Upload, Camera } from 'lucide-react';

const Contribute = () => {
  const { user, isLoading } = useAuth();
  const { addVideo } = useCorpus();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const [metadata, setMetadata] = useState({
    signLabel: '',
    language: '',
    ageGroup: '' as 'child' | 'youth' | 'adult' | 'senior' | '',
    handedness: '' as 'left' | 'right' | 'both' | ''
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setIsPreviewMode(true);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, [stream, stopCamera]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setIsPreviewMode(false);
    setUploadedFile(null);
    startCamera();
  }, [recordedUrl, startCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setRecordedUrl(url);
      setIsPreviewMode(true);
      setRecordedBlob(file);
      stopCamera();
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid video file.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!recordedBlob && !uploadedFile) {
      toast({
        title: "No Video",
        description: "Please record or upload a video first.",
        variant: "destructive"
      });
      return;
    }

    if (!metadata.signLabel || !metadata.language || !metadata.ageGroup || !metadata.handedness) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all metadata fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate video upload and processing
    const videoUrl = recordedUrl || URL.createObjectURL(uploadedFile!);
    
    addVideo({
      videoUrl,
      thumbnailUrl: '/placeholder.svg', // In a real app, generate thumbnail
      metadata: metadata as any,
      contributorId: user.id,
      contributorName: user.username
    });

    toast({
      title: "Video Submitted!",
      description: "Your sign has been submitted for review. Thank you for contributing!",
    });

    // Reset form
    setMetadata({
      signLabel: '',
      language: '',
      ageGroup: '',
      handedness: ''
    });
    resetRecording();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Contribute Signs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help build the corpus by recording or uploading sign language videos. 
            Your contributions make a real difference!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Recording/Upload Section */}
          <Card className="shadow-custom-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary" />
                Record or Upload Video
              </CardTitle>
              <CardDescription>
                Use your webcam to record a sign or upload a pre-recorded video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Display */}
                <div className="aspect-video bg-muted rounded-lg overflow-hidden video-container">
                  {!stream && !isPreviewMode && (
                    <div className="video-overlay">
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Camera not active</p>
                        <Button onClick={startCamera} className="mb-2">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <video
                    ref={videoRef}
                    autoPlay
                    muted={!isPreviewMode}
                    controls={isPreviewMode}
                    className="w-full h-full object-cover"
                    src={isPreviewMode ? recordedUrl || undefined : undefined}
                  />
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center space-x-4">
                  {stream && !isRecording && !isPreviewMode && (
                    <Button onClick={startRecording} className="bg-success hover:bg-success/90">
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  )}
                  
                  {isRecording && (
                    <Button onClick={stopRecording} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  {isPreviewMode && (
                    <Button onClick={resetRecording} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Re-record
                    </Button>
                  )}
                </div>

                {/* File Upload Option */}
                <div className="border-t pt-4">
                  <Label htmlFor="video-upload" className="block text-sm font-medium mb-2">
                    Or upload a video file
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('video-upload')?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Form */}
          <Card className="shadow-custom-lg">
            <CardHeader>
              <CardTitle>Video Metadata</CardTitle>
              <CardDescription>
                Provide information about the sign being recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signLabel">Sign Label *</Label>
                  <Input
                    id="signLabel"
                    placeholder="e.g., Hello, Thank you, Goodbye"
                    value={metadata.signLabel}
                    onChange={(e) => setMetadata(prev => ({ ...prev, signLabel: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language/Dialect *</Label>
                  <Select value={metadata.language} onValueChange={(value) => setMetadata(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="BSL">British Sign Language (BSL)</SelectItem>
                      <SelectItem value="LSF">French Sign Language (LSF)</SelectItem>
                      <SelectItem value="DGS">German Sign Language (DGS)</SelectItem>
                      <SelectItem value="JSL">Japanese Sign Language (JSL)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group *</Label>
                  <Select value={metadata.ageGroup} onValueChange={(value: any) => setMetadata(prev => ({ ...prev, ageGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Child (0-12)</SelectItem>
                      <SelectItem value="youth">Youth (13-17)</SelectItem>
                      <SelectItem value="adult">Adult (18-64)</SelectItem>
                      <SelectItem value="senior">Senior (65+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handedness">Handedness *</Label>
                  <Select value={metadata.handedness} onValueChange={(value: any) => setMetadata(prev => ({ ...prev, handedness: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select handedness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right">Right-handed</SelectItem>
                      <SelectItem value="left">Left-handed</SelectItem>
                      <SelectItem value="both">Both hands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full h-12 text-lg font-semibold"
                  disabled={!recordedBlob && !uploadedFile}
                >
                  Submit Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contribute;