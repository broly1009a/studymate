'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatar: string | undefined) => void;
  userName: string;
}

export function AvatarUpload({ currentAvatar, onAvatarChange, userName }: AvatarUploadProps) {
  const [preview, setPreview] = useState(currentAvatar);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onAvatarChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setPreview(urlInput);
      onAvatarChange(urlInput);
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onAvatarChange(undefined);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview} alt={userName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleUrlSubmit();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleUrlSubmit}
          disabled={!urlInput}
        >
          Use URL
        </Button>
      </div>
    </div>
  );
}

