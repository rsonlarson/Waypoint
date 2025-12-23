import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  enlargeable?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

export function ProfileAvatar({ 
  userId, 
  avatarUrl, 
  name, 
  size = 'md', 
  clickable = true,
  enlargeable = false 
}: ProfileAvatarProps) {
  const navigate = useNavigate();
  const [imageOpen, setImageOpen] = useState(false);

  const handleClick = () => {
    if (clickable && !enlargeable) {
      navigate(`/user/${userId}`);
    }
  };

  const avatar = (
    <Avatar 
      className={`${sizeClasses[size]} ${clickable || enlargeable ? 'cursor-pointer hover:ring-2 hover:ring-primary transition-all' : ''}`}
      onClick={enlargeable ? undefined : handleClick}
    >
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );

  if (enlargeable) {
    return (
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogTrigger asChild>
          {avatar}
        </DialogTrigger>
        <DialogContent className="max-w-md p-0 bg-transparent border-none">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return avatar;
}
