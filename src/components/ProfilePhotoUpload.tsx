import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2 } from 'lucide-react';

interface ProfilePhotoUploadProps {
  currentAvatar: string;
  userName: string;
  userId: string;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export function ProfilePhotoUpload({ currentAvatar, userName, userId, onAvatarChange }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      onAvatarChange(publicUrl);
      setDialogOpen(false);
      toast({
        title: 'Photo updated!',
        description: 'Your profile photo has been changed.',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className="h-20 w-20 border-4 border-primary/20 transition-all group-hover:ring-2 group-hover:ring-primary">
            <AvatarImage src={currentAvatar} />
            <AvatarFallback className="text-2xl">{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-foreground" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Preview */}
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={currentAvatar} />
              <AvatarFallback className="text-3xl">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Upload options */}
          <div className="grid grid-cols-2 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col gap-2 h-auto py-4"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
              <span className="text-xs">Upload Photo</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col gap-2 h-auto py-4"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
              <span className="text-xs">Take Photo</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
