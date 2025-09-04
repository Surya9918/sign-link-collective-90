import React, { useState } from 'react';
import { useCorpus } from '@/contexts/CorpusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Video, Calendar, User, Play, Grid, List } from 'lucide-react';

const Explore = () => {
  const { videos } = useCorpus();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [handednessFilter, setHandednessFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Only show approved videos in the public corpus
  const approvedVideos = videos.filter(video => video.status === 'approved');

  // Filter videos based on search and filters
  const filteredVideos = approvedVideos.filter(video => {
    const matchesSearch = video.metadata.signLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.contributorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || video.metadata.language === languageFilter;
    const matchesAgeGroup = ageGroupFilter === 'all' || video.metadata.ageGroup === ageGroupFilter;
    const matchesHandedness = handednessFilter === 'all' || video.metadata.handedness === handednessFilter;
    
    return matchesSearch && matchesLanguage && matchesAgeGroup && matchesHandedness;
  });

  const uniqueLanguages = Array.from(new Set(approvedVideos.map(v => v.metadata.language)));
  const uniqueAgeGroups = Array.from(new Set(approvedVideos.map(v => v.metadata.ageGroup)));
  const uniqueHandedness = Array.from(new Set(approvedVideos.map(v => v.metadata.handedness)));

  const clearFilters = () => {
    setSearchTerm('');
    setLanguageFilter('all');
    setAgeGroupFilter('all');
    setHandednessFilter('all');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Corpus Explorer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our growing collection of sign language videos. 
            Search by sign, filter by language or contributor, and discover the richness of sign languages.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-custom-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">{approvedVideos.length}</div>
              <div className="text-sm text-muted-foreground">Total Signs</div>
            </CardContent>
          </Card>
          <Card className="shadow-custom-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">{uniqueLanguages.length}</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </CardContent>
          </Card>
          <Card className="shadow-custom-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">
                {Array.from(new Set(approvedVideos.map(v => v.contributorName))).length}
              </div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </CardContent>
          </Card>
          <Card className="shadow-custom-md text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-warning mb-2">
                {Array.from(new Set(approvedVideos.map(v => v.metadata.signLabel))).length}
              </div>
              <div className="text-sm text-muted-foreground">Unique Signs</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-custom-md mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-primary" />
                Search & Filter
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search signs or contributors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {uniqueLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  {uniqueAgeGroups.map(age => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={handednessFilter} onValueChange={setHandednessFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Handedness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Handedness</SelectItem>
                  {uniqueHandedness.map(hand => (
                    <SelectItem key={hand} value={hand}>{hand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVideos.length} of {approvedVideos.length} signs
          </p>
        </div>

        {/* Video Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="shadow-custom-md hover:shadow-custom-lg transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Video Thumbnail */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                      <video
                        src={video.videoUrl}
                        poster={video.thumbnailUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Sign Info */}
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {video.metadata.signLabel}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <User className="h-3 w-3 mr-1" />
                        {video.contributorName}
                      </div>
                    </div>
                    
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {video.metadata.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.metadata.ageGroup}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.metadata.handedness}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="shadow-custom-md hover:shadow-custom-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    {/* Video Thumbnail */}
                    <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative group">
                      <video
                        src={video.videoUrl}
                        poster={video.thumbnailUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="h-4 w-4 text-primary ml-0.5" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Sign Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-foreground mb-2">
                        {video.metadata.signLabel}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {video.contributorName}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {video.uploadDate}
                        </div>
                        <div>
                          <span className="font-medium">Language:</span> {video.metadata.language}
                        </div>
                        <div>
                          <span className="font-medium">Age:</span> {video.metadata.ageGroup}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{video.metadata.language}</Badge>
                        <Badge variant="outline">{video.metadata.ageGroup}</Badge>
                        <Badge variant="outline">{video.metadata.handedness}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <Card className="shadow-custom-md">
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No signs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || languageFilter !== 'all' || ageGroupFilter !== 'all' || handednessFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No approved signs are available yet.'}
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Explore;