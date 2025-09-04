import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Search, Users, Award, Accessibility, Globe } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Sign Language Corpus Collection
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Building the world's most comprehensive sign language database through community collaboration. 
            Contribute your signs, help annotate data, and advance sign language research.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/contribute">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4 h-auto shadow-custom-lg">
                <Video className="mr-2 h-5 w-5" />
                Contribute Signs
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 h-auto shadow-custom-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Review Corpus
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold mb-2">2,847</div>
              <div className="text-lg opacity-90">Signs Collected</div>
            </div>
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold mb-2">156</div>
              <div className="text-lg opacity-90">Contributors</div>
            </div>
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold mb-2">23</div>
              <div className="text-lg opacity-90">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Our platform makes it easy to contribute to sign language research and help build 
            a comprehensive corpus for future generations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-custom-lg hover:shadow-custom-xl transition-all duration-300 border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Record Signs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use your webcam to record sign language videos directly in the browser. 
                  No additional software needed.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-custom-lg hover:shadow-custom-xl transition-all duration-300 border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Collaborate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Work with researchers and community members to review, annotate, 
                  and improve the quality of collected data.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-custom-lg hover:shadow-custom-xl transition-all duration-300 border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Earn Recognition</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your contributions, earn badges, and see your impact 
                  on the global sign language research community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            We believe that sign languages are rich, complex, and deserving of comprehensive documentation. 
            By crowdsourcing sign language data from native signers around the world, we're building 
            a resource that will benefit researchers, educators, and the deaf community for generations to come.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Accessibility className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-muted-foreground text-center">
                Making sign language resources more accessible to everyone
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p className="text-muted-foreground text-center">
                Supporting sign language communities worldwide
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground text-center">
                Building bridges between researchers and signers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community of contributors and help advance sign language research
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="font-semibold text-lg px-8 py-4 h-auto shadow-custom-lg">
                Sign Up Today
              </Button>
            </Link>
            <Link to="/explore">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-semibold text-lg px-8 py-4 h-auto shadow-custom-lg"
              >
                Explore Corpus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;