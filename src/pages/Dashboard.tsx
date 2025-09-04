import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCorpus } from '@/contexts/CorpusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Check, X, Edit, Calendar, User, Video } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { videos, updateVideoStatus } = useCorpus();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.metadata.signLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.contributorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    const matchesLanguage = languageFilter === 'all' || video.metadata.language === languageFilter;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const handleApprove = (videoId: string) => {
    updateVideoStatus(videoId, 'approved', reviewNotes);
    setSelectedVideo(null);
    setReviewNotes('');
    toast({
      title: "Video Approved",
      description: "The video has been approved and added to the corpus.",
    });
  };

  const handleReject = (videoId: string) => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please provide feedback when rejecting a video.",
        variant: "destructive"
      });
      return;
    }
    
    updateVideoStatus(videoId, 'rejected', reviewNotes);
    setSelectedVideo(null);
    setReviewNotes('');
    toast({
      title: "Video Rejected",
      description: "The video has been rejected with feedback provided.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'badge-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const uniqueLanguages = Array.from(new Set(videos.map(v => v.metadata.language)));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Review Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Review and annotate submitted sign language videos to help build the corpus.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-custom-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                  <p className="text-3xl font-bold text-foreground">{videos.length}</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-custom-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold text-warning">
                    {videos.filter(v => v.status === 'pending').length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-custom-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-success">
                    {videos.filter(v => v.status === 'approved').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-custom-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-destructive">
                    {videos.filter(v => v.status === 'rejected').length}
                  </p>
                </div>
                <X className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-custom-md mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search signs or contributors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {uniqueLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setLanguageFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="shadow-custom-md hover:shadow-custom-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{video.metadata.signLabel}</CardTitle>
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </div>
                <CardDescription className="space-y-1">
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-1" />
                    {video.contributorName}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {video.uploadDate}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      src={video.videoUrl}
                      poster={video.thumbnailUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Language:</span> {video.metadata.language}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {video.metadata.ageGroup}
                    </div>
                    <div>
                      <span className="font-medium">Handedness:</span> {video.metadata.handedness}
                    </div>
                  </div>
                  
                  {/* Review Notes */}
                  {video.reviewNotes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Review Notes:</p>
                      <p className="text-sm text-muted-foreground">{video.reviewNotes}</p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  {video.status === 'pending' && (
                    <div className="space-y-3">
                      {selectedVideo === video.id && (
                        <Textarea
                          placeholder="Add review notes (required for rejection)..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                      )}
                      
                      <div className="flex space-x-2">
                        {selectedVideo === video.id ? (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 bg-success hover:bg-success/90"
                              onClick={() => handleApprove(video.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleReject(video.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedVideo(null);
                                setReviewNotes('');
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedVideo(video.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <Card className="shadow-custom-md">
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || languageFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'No videos have been submitted yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;