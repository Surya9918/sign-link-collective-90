import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCorpus } from '@/contexts/CorpusContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Video, Trophy, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const { getVideosByContributor } = useCorpus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userVideos = getVideosByContributor(user.id);
  const approvedVideos = userVideos.filter(v => v.status === 'approved').length;
  const pendingVideos = userVideos.filter(v => v.status === 'pending').length;
  const rejectedVideos = userVideos.filter(v => v.status === 'rejected').length;

  // Calculate progress towards next milestone
  const nextMilestone = Math.ceil(user.contributionsCount / 10) * 10;
  const progressPercentage = (user.contributionsCount / nextMilestone) * 100;

  const badgeColors = {
    'First Contribution': 'bg-success text-success-foreground',
    'Video Master': 'bg-primary text-primary-foreground',
    'Community Helper': 'bg-accent text-accent-foreground',
    'Annotation Expert': 'bg-warning text-warning-foreground',
    'Top Contributor': 'bg-destructive text-destructive-foreground'
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="shadow-custom-lg border-0 gradient-card">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-card-foreground mb-2">
                  {user.username}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mb-4">
                  {user.email}
                </CardDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Contribution Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {user.contributionsCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Contributions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">
                      {approvedVideos}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-1">
                      {pendingVideos}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-destructive mb-1">
                      {rejectedVideos}
                    </div>
                    <div className="text-sm text-muted-foreground">Rejected</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress to next milestone</span>
                    <span className="text-sm text-muted-foreground">
                      {user.contributionsCount} / {nextMilestone}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-primary" />
                  Recent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userVideos.length > 0 ? (
                  <div className="space-y-4">
                    {userVideos.slice(0, 5).map((video) => (
                      <div key={video.id} 
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-muted rounded overflow-hidden">
                            <img 
                              src={video.thumbnailUrl} 
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-card-foreground">
                              {video.metadata.signLabel}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {video.metadata.language} • {video.uploadDate}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={
                            video.status === 'approved' ? 'badge-success' :
                            video.status === 'pending' ? 'badge-warning' :
                            'bg-destructive text-destructive-foreground'
                          }
                        >
                          {video.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No contributions yet</p>
                    <p className="text-sm">Start by recording your first sign!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Badges and Achievements */}
          <div className="space-y-6">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-primary" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Badges earned through your contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.badgesEarned.length > 0 ? (
                  <div className="space-y-3">
                    {user.badgesEarned.map((badge) => (
                      <div key={badge} 
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          badgeColors[badge as keyof typeof badgeColors] || 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No badges yet</p>
                    <p className="text-xs">Contribute to earn your first badge!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/contribute" 
                  className="block w-full p-3 text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Record New Sign
                </a>
                <a href="/explore" 
                  className="block w-full p-3 text-center bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  Explore Corpus
                </a>
                <a href="/dashboard" 
                  className="block w-full p-3 text-center bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  Review Videos
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;