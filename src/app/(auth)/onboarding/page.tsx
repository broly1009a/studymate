'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { vi } from '@/lib/i18n/vi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  type OnboardingStep1Data,
  type OnboardingStep2Data,
  type OnboardingStep3Data,
} from '@/lib/validations';
import { SUBJECTS, INTERESTS, STUDY_STYLES, PREFERRED_TIMES, GROUP_SIZES, SESSION_DURATIONS } from '@/lib/constants';
import { toast } from 'sonner';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const router = useRouter();
  const { updateUser } = useAuth();

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = (data: any) => {
    setOnboardingData({ ...onboardingData, ...data });
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleComplete = async (data: any) => {
    try {
      setIsLoading(true);
      const finalData = { ...onboardingData, ...data };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      updateUser({ ...finalData });
      
      toast.success('Thiết lập hồ sơ hoàn tất!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Hoàn tất onboarding thất bại. Vui lòng thử lại.');
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Hoàn thiện hồ sơ</h2>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Bỏ qua
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Bước {currentStep} / {TOTAL_STEPS}
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep === 1 && (
        <Step1 onNext={handleNext} defaultValues={onboardingData} />
      )}
      {currentStep === 2 && (
        <Step2 onNext={handleNext} onBack={handleBack} defaultValues={onboardingData} />
      )}
      {currentStep === 3 && (
        <Step3 onNext={handleNext} onBack={handleBack} defaultValues={onboardingData} />
      )}
      {currentStep === 4 && (
        <Step4 onComplete={handleComplete} onBack={handleBack} isLoading={isLoading} defaultValues={onboardingData} />
      )}
    </div>
  );
}

// Step 1: Basic Info
function Step1({ onNext, defaultValues }: any) {
  const form = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      fullName: defaultValues.fullName || '',
      bio: defaultValues.bio || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Giới thiệu về bạn</h3>
          <p className="text-sm text-muted-foreground">
            Thông tin này sẽ hiển thị trên hồ sơ của bạn
          </p>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (Optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us a bit about yourself..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description about yourself (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}

// Step 2: Subjects & Interests
function Step2({ onNext, onBack, defaultValues }: any) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(defaultValues.subjects || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(defaultValues.interests || []);

  const form = useForm<OnboardingStep2Data>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      subjects: defaultValues.subjects || [],
      interests: defaultValues.interests || [],
    },
  });

  const toggleSubject = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    setSelectedSubjects(updated);
    form.setValue('subjects', updated);
  };

  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);
    form.setValue('interests', updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">What do you want to learn?</h3>
          <p className="text-sm text-muted-foreground">
            Select your subjects and interests to find the best study partners
          </p>
        </div>

        <FormField
          control={form.control}
          name="subjects"
          render={() => (
            <FormItem>
              <FormLabel>Subjects</FormLabel>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((subject) => (
                  <Badge
                    key={subject}
                    variant={selectedSubjects.includes(subject) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Step 3: Learning Preferences
function Step3({ onNext, onBack, defaultValues }: any) {
  const form = useForm<OnboardingStep3Data>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      studyStyle: defaultValues.studyStyle || undefined,
      preferredTime: defaultValues.preferredTime || undefined,
      sessionDuration: defaultValues.sessionDuration || 60,
      groupSize: defaultValues.groupSize || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Learning Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Help us match you with compatible study partners
          </p>
        </div>

        <FormField
          control={form.control}
          name="studyStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your study style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STUDY_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-muted-foreground">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Study Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PREFERRED_TIMES.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      <div>
                        <div className="font-medium">{time.label}</div>
                        <div className="text-xs text-muted-foreground">{time.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sessionDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Duration (minutes)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SESSION_DURATIONS.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Group Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GROUP_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div>
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-muted-foreground">{size.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Step 4: Availability Schedule (Simplified)
function Step4({ onComplete, onBack, isLoading }: any) {
  const [availability, setAvailability] = useState<string[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    onComplete({ availability });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">When are you available?</h3>
        <p className="text-sm text-muted-foreground">
          Select the days you&apos;re typically available for study sessions
        </p>
      </div>

      <div className="space-y-3">
        {days.map((day) => (
          <div
            key={day}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              availability.includes(day)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleDay(day)}
          >
            <span className="font-medium">{day}</span>
            {availability.includes(day) && (
              <Badge variant="default">Available</Badge>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Setup
        </Button>
      </div>
    </div>
  );
}

