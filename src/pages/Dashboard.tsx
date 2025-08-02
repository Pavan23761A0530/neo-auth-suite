import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Settings, LogOut, BarChart3, Users, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-neon-primary">
              Pavan Marketing
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl glass hover:bg-muted/50 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl glass hover:bg-muted/50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl glass hover:bg-destructive/20 text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">
            Welcome back, <span className="text-neon-primary">{user?.user_metadata?.name || 'User'}</span>!
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to supercharge your marketing campaigns today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`glass-card group hover:scale-105 transition-all duration-300 animate-slide-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-xs ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}% from last month
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:animate-pulse-glow`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-6 text-glow">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="w-full flex items-center space-x-4 p-4 rounded-xl glass hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-6 text-glow">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const stats = [
  {
    id: 1,
    label: 'Total Campaigns',
    value: '24',
    change: 12,
    icon: BarChart3,
    gradient: 'from-primary/80 to-primary'
  },
  {
    id: 2,
    label: 'Active Users',
    value: '1,234',
    change: 8,
    icon: Users,
    gradient: 'from-secondary/80 to-secondary'
  },
  {
    id: 3,
    label: 'Conversion Rate',
    value: '3.2%',
    change: 15,
    icon: TrendingUp,
    gradient: 'from-accent/80 to-accent'
  },
  {
    id: 4,
    label: 'Performance',
    value: '94%',
    change: 5,
    icon: Zap,
    gradient: 'from-green-500/80 to-green-600'
  }
];

const quickActions = [
  {
    id: 1,
    title: 'Create Campaign',
    description: 'Launch a new marketing campaign',
    icon: Zap,
    gradient: 'from-primary/80 to-primary'
  },
  {
    id: 2,
    title: 'View Analytics',
    description: 'Check your performance metrics',
    icon: BarChart3,
    gradient: 'from-secondary/80 to-secondary'
  },
  {
    id: 3,
    title: 'Manage Audience',
    description: 'Update your target audience',
    icon: Users,
    gradient: 'from-accent/80 to-accent'
  }
];

const activities = [
  {
    id: 1,
    title: 'New campaign "Summer Sale" launched',
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'Performance report generated',
    time: '4 hours ago'
  },
  {
    id: 3,
    title: 'Audience segment updated',
    time: '6 hours ago'
  },
  {
    id: 4,
    title: 'New user registered',
    time: '8 hours ago'
  }
];

export default Dashboard;