import { stats } from '@/data/mockData';
import { Car, Users, Leaf, School } from 'lucide-react';

const statItems = [
  { label: 'Rides Shared', value: stats.totalRidesShared.toLocaleString(), icon: Car },
  { label: 'Students Connected', value: stats.studentsConnected.toLocaleString(), icon: Users },
  { label: 'CO₂ Saved', value: stats.co2Saved, icon: Leaf },
  { label: 'Active Schools', value: stats.activeSchools, icon: School },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-card border border-border/50 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
