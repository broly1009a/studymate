'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useImageUpload } from '@/hooks/use-image-upload';
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  onboardingStep4Schema,
  type OnboardingStep1Data,
  type OnboardingStep2Data,
  type OnboardingStep3Data,
  type OnboardingStep4Data,
} from '@/lib/validations';
import {
  UNIVERSITIES,
  MAJORS_BY_UNIVERSITY,
  LEARNING_NEEDS,
  LEARNING_GOALS,
  STUDY_HABITS,
  MBTI_TYPES,
  GPA_RANGES,
  getMajorsByUniversity,
} from '@/lib/matching-constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;

interface ProfileImageData {
  url: string;
  publicId: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [profileImages, setProfileImages] = useState<ProfileImageData[]>([]);
  const router = useRouter();
  const { user, updateUser } = useAuth();

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

  const handleComplete = async (data: any) => {
    try {
      setIsLoading(true);
      const finalData = { ...onboardingData, ...data };

      // Prepare date of birth
      const { day, month, year } = finalData.dateOfBirth;
      const dateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Prepare API payload
      const payload = {
        fullName: finalData.fullName,
        gender: finalData.gender,
        dateOfBirth: dateOfBirth.toISOString(),
        profileImages: profileImages.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          order: index,
        })),
        education: {
          institution: finalData.university,
          major: finalData.major,
        },
        learningNeeds: finalData.learningNeeds,
        learningGoals: finalData.learningGoals,
        studyHabits: finalData.studyHabits,
        mbtiType: finalData.mbtiType,
        gpa: finalData.gpa,
        certificates: finalData.certificates || [],
        awards: finalData.awards || [],
      };

      // Call API to update profile
      const token = localStorage.getItem('studymate_auth_token');
      const response = await fetch('/api/profiles/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update user in context
      updateUser({ ...payload });

      toast.success('Thiết lập hồ sơ hoàn tất!');
      router.push('/home');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Tạo tài khoản
          </h1>

          {currentStep === 1 && (
            <Step1
              onNext={handleNext}
              defaultValues={onboardingData}
              profileImages={profileImages}
              setProfileImages={setProfileImages}
            />
          )}
          {currentStep === 2 && (
            <Step2 onNext={handleNext} onBack={handleBack} defaultValues={onboardingData} />
          )}
          {currentStep === 3 && (
            <Step3 onNext={handleNext} onBack={handleBack} defaultValues={onboardingData} />
          )}
          {currentStep === 4 && (
            <Step4
              onComplete={handleComplete}
              onBack={handleBack}
              isLoading={isLoading}
              defaultValues={onboardingData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Info + Profile Pictures
function Step1({ onNext, defaultValues, profileImages, setProfileImages }: any) {
  const { uploadImage, deleteImage, validateImage, isUploading } = useImageUpload();
  const fileInputRefs = Array(6)
    .fill(null)
    .map(() => ({ current: null as HTMLInputElement | null }));

  const form = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      fullName: defaultValues.fullName || '',
      dateOfBirth: defaultValues.dateOfBirth || { day: '', month: '', year: '' },
      gender: defaultValues.gender || undefined,
    },
  });

  const handleImageSelect = async (index: number, file: File) => {
    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Get old public ID if replacing
    const oldPublicId = profileImages[index]?.publicId;

    // Upload image
    const result = await uploadImage(file, index, oldPublicId);

    if (result) {
      const newImages = [...profileImages];
      newImages[index] = result;
      setProfileImages(newImages);
      toast.success('Ảnh đã được tải lên thành công!');
    }
  };

  const handleFileInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(index, file);
    }
  };

  const triggerFileInput = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(index, file);
      }
    };
    input.click();
  };

  const removeImage = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const image = profileImages[index];
    if (!image) return;

    // Delete from Cloudinary
    const success = await deleteImage(image.publicId);

    if (success) {
      const newImages = [...profileImages];
      newImages[index] = null as any;
      setProfileImages(newImages.filter((img) => img !== null));
      toast.success('Ảnh đã được xóa!');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tên"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Sinh nhật</Label>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="dateOfBirth.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="DD"
                          {...field}
                          maxLength={2}
                          className="text-center rounded-lg border-gray-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth.month"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="TT"
                          {...field}
                          maxLength={2}
                          className="text-center rounded-lg border-gray-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth.year"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="YYYY"
                          {...field}
                          maxLength={4}
                          className="text-center rounded-lg border-gray-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.dateOfBirth && (
                <p className="text-red-500 text-sm">Vui lòng nhập đầy đủ ngày sinh</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Giới tính</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Nam
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Nữ
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal cursor-pointer">
                          Thêm
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox id="showGender" />
              <Label htmlFor="showGender" className="text-sm text-gray-600 font-normal cursor-pointer">
                Hiển thị giới tính trên hồ sơ của tôi
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Quan tâm tới</Label>
              <RadioGroup defaultValue="all" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="interest-male" />
                  <Label htmlFor="interest-male" className="font-normal cursor-pointer">
                    Nam
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="interest-female" />
                  <Label htmlFor="interest-female" className="font-normal cursor-pointer">
                    Nữ
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="interest-all" />
                  <Label htmlFor="interest-all" className="font-normal cursor-pointer">
                    Mọi người
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Profile Pictures */}
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium block mb-3">Ảnh hồ sơ</Label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative aspect-square rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden group',
                      profileImages[index]
                        ? 'border-blue-500'
                        : 'border-gray-300 hover:border-blue-400',
                      isUploading && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !profileImages[index] && !isUploading && triggerFileInput(index)}
                  >
                    {profileImages[index] ? (
                      <>
                        <img
                          src={profileImages[index].url}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => removeImage(index, e)}
                          disabled={isUploading}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            !isUploading && triggerFileInput(index);
                          }}
                          disabled={isUploading}
                          className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <Upload className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                            <Upload className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Nhấp vào ô để tải ảnh lên. Nhấp vào ảnh đã có để thay thế.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tải lên 2 bức ảnh để bắt đầu. Thêm 4 bức ảnh hoặc nhiều hơn nữa để hồ sơ của bạn thật nổi bật.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-12 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Tiếp tục
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Step 2: Education & Learning Needs
function Step2({ onNext, onBack, defaultValues }: any) {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(defaultValues.learningNeeds || []);
  const [availableMajors, setAvailableMajors] = useState<readonly string[]>([]);

  const form = useForm<OnboardingStep2Data>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      university: defaultValues.university || '',
      major: defaultValues.major || '',
      learningNeeds: defaultValues.learningNeeds || [],
    },
  });

  const toggleNeed = (need: string) => {
    const updated = selectedNeeds.includes(need)
      ? selectedNeeds.filter((n) => n !== need)
      : [...selectedNeeds, need];
    setSelectedNeeds(updated);
    form.setValue('learningNeeds', updated);
  };

  const handleUniversityChange = (value: string) => {
    form.setValue('university', value);
    const majors = getMajorsByUniversity(value);
    setAvailableMajors(majors);
    form.setValue('major', ''); // Reset major when university changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Thông tin học tập</h3>
          <p className="text-gray-600">
            Cho chúng tôi biết bạn đang học ở đâu và bạn cần gì
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Trường đại học</FormLabel>
                <Select
                  onValueChange={handleUniversityChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue placeholder="Chọn trường" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(UNIVERSITIES).map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
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
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Chuyên ngành</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!availableMajors.length}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue placeholder="Chọn chuyên ngành" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMajors.map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="learningNeeds"
          render={() => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium text-lg">
                Nhu cầu học tập của bạn
              </FormLabel>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {LEARNING_NEEDS.map((need) => (
                  <div
                    key={need}
                    onClick={() => toggleNeed(need)}
                    className={cn(
                      'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md',
                      selectedNeeds.includes(need)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedNeeds.includes(need)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{need}</span>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6 rounded-full text-lg"
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-6 rounded-full text-lg font-semibold"
          >
            Tiếp tục
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Step 3: Learning Goals & Study Habits
function Step3({ onNext, onBack, defaultValues }: any) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(defaultValues.learningGoals || []);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(defaultValues.studyHabits || []);

  const form = useForm<OnboardingStep3Data>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      learningGoals: defaultValues.learningGoals || [],
      studyHabits: defaultValues.studyHabits || [],
      mbtiType: defaultValues.mbtiType || '',
    },
  });

  const toggleGoal = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(updated);
    form.setValue('learningGoals', updated);
  };

  const toggleHabit = (habit: string) => {
    const updated = selectedHabits.includes(habit)
      ? selectedHabits.filter((h) => h !== habit)
      : [...selectedHabits, habit];
    setSelectedHabits(updated);
    form.setValue('studyHabits', updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Mục tiêu & Thói quen</h3>
          <p className="text-gray-600">
            Giúp chúng tôi tìm bạn học phù hợp nhất với bạn
          </p>
        </div>

        <FormField
          control={form.control}
          name="learningGoals"
          render={() => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium text-lg">
                Mục tiêu học tập
              </FormLabel>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {LEARNING_GOALS.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md',
                      selectedGoals.includes(goal)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedGoals.includes(goal)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studyHabits"
          render={() => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium text-lg">
                Thói quen học tập
              </FormLabel>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {STUDY_HABITS.map((habit) => (
                  <div
                    key={habit}
                    onClick={() => toggleHabit(habit)}
                    className={cn(
                      'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md',
                      selectedHabits.includes(habit)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedHabits.includes(habit)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{habit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mbtiType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                MBTI (Không bắt buộc)
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <SelectValue placeholder="Chọn MBTI của bạn" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MBTI_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                Chưa biết MBTI của bạn?{' '}
                <a
                  href="https://www.16personalities.com/free-personality-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Làm bài test tại đây
                </a>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6 rounded-full text-lg"
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-6 rounded-full text-lg font-semibold"
          >
            Tiếp tục
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Step 4: Achievements (Optional)
function Step4({ onComplete, onBack, isLoading, defaultValues }: any) {
  const [certificates, setCertificates] = useState<string[]>(defaultValues.certificates || []);
  const [awards, setAwards] = useState<string[]>(defaultValues.awards || []);
  const [newCert, setNewCert] = useState('');
  const [newAward, setNewAward] = useState('');

  const form = useForm<OnboardingStep4Data>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      gpa: defaultValues.gpa || '',
      certificates: defaultValues.certificates || [],
      awards: defaultValues.awards || [],
    },
  });

  const addCertificate = () => {
    if (newCert.trim()) {
      const updated = [...certificates, newCert.trim()];
      setCertificates(updated);
      form.setValue('certificates', updated);
      setNewCert('');
    }
  };

  const removeCertificate = (index: number) => {
    const updated = certificates.filter((_, i) => i !== index);
    setCertificates(updated);
    form.setValue('certificates', updated);
  };

  const addAward = () => {
    if (newAward.trim()) {
      const updated = [...awards, newAward.trim()];
      setAwards(updated);
      form.setValue('awards', updated);
      setNewAward('');
    }
  };

  const removeAward = (index: number) => {
    const updated = awards.filter((_, i) => i !== index);
    setAwards(updated);
    form.setValue('awards', updated);
  };

  const handleSubmit = (data: OnboardingStep4Data) => {
    onComplete({ ...data, certificates, awards });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Thành tích của bạn</h3>
          <p className="text-gray-600">Không bắt buộc - Có thể bỏ qua</p>
        </div>

        <FormField
          control={form.control}
          name="gpa"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">GPA</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <SelectValue placeholder="Chọn khoảng GPA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GPA_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Chứng chỉ</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ví dụ: IELTS 7.5, AWS Certified..."
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificate())}
              className="rounded-lg border-gray-300"
            />
            <Button
              type="button"
              onClick={addCertificate}
              variant="outline"
              className="rounded-lg"
            >
              Thêm
            </Button>
          </div>
          {certificates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {cert}
                  <button
                    onClick={() => removeCertificate(index)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Giải thưởng</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ví dụ: Quán quân Bizcase 2024..."
              value={newAward}
              onChange={(e) => setNewAward(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
              className="rounded-lg border-gray-300"
            />
            <Button
              type="button"
              onClick={addAward}
              variant="outline"
              className="rounded-lg"
            >
              Thêm
            </Button>
          </div>
          {awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {award}
                  <button
                    onClick={() => removeAward(index)}
                    className="hover:bg-yellow-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6 rounded-full text-lg"
            disabled={isLoading}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-6 rounded-full text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Hoàn tất
          </Button>
        </div>
      </form>
    </Form>
  );
}

