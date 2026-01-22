import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  language: 'uz' | 'en';
  childName: string;
  childBirthYear: number | null;
  childGender: 'boy' | 'girl' | null;
  parentName: string;
  parentGender: 'male' | 'female' | null;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({
    language: 'uz',
    childName: '',
    childBirthYear: null,
    childGender: null,
    parentName: '',
    parentGender: null,
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
