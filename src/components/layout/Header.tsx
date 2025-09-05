import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};