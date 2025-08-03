import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, Users } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-neon-primary">
              Med Track
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-neon"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 px-6 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 text-glow">
              Welcome to{' '}
              <span className="text-neon-primary">Med Track</span>
            </h1>
            
            <div className="text-lg md:text-xl text-neon-secondary/80 mb-8 font-light tracking-wide">
              AWS Cloud Enabled Healthcare Management System
            </div>
            
            <p className={`text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-in-up animate-delay-200`}>
              Experience the future of digital marketing with our cutting-edge platform. 
              Join thousands of marketers who trust us to amplify their brand presence.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-up animate-delay-300`}>
              <Link
                to="/signup"
                className="btn-neon text-lg px-12 py-4"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="btn-secondary-neon text-lg px-12 py-4"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Why Choose <span className="text-neon-primary">Med Track</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful features that make us the preferred choice for modern marketers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`glass-card group hover:scale-105 transition-all duration-500 animate-slide-in-up`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:animate-pulse-glow">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass-card text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Ready to <span className="text-neon-secondary">Transform</span> Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of successful marketers and take your business to the next level with our innovative solutions.
            </p>
            <Link
              to="/signup"
              className="btn-neon text-xl px-16 py-5 inline-flex items-center animate-pulse-glow"
            >
              <Zap className="w-6 h-6 mr-3" />
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold text-neon-primary mb-4">
            Med Track
          </div>
          <p className="text-muted-foreground">
            © 2025 Med Track. All rights reserved. Building the future of healthcare management.
          </p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    id: 1,
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Deploy campaigns in seconds with our optimized infrastructure and real-time analytics dashboard.'
  },
  {
    id: 2,
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is protected with advanced encryption.'
  },
  {
    id: 3,
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamlessly work with your team using our collaborative tools and real-time communication features.'
  }
];

export default Home;