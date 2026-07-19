"use client";
import { useState } from "react";
import { TripPreferences } from "@/types";

export type WizardStep = "dates" | "origin" | "destinations" | "profile" | "summary";

const STEPS: WizardStep[] = ["dates", "origin", "destinations", "profile", "summary"];

export function useTripWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("dates");
  const [formData, setFormData] = useState<Partial<TripPreferences>>({
    originCity: "Vitória",
    originAirport: "VIX",
    pace: "balanced",
    budgetLevel: "moderate",
    interests: [],
    transportationPreferences: [],
    countries: [],
    travelers: { adults: 2, children: 0 },
  });

  const stepIndex = STEPS.indexOf(currentStep);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  function next() {
    if (!isLast) setCurrentStep(STEPS[stepIndex + 1]);
  }
  function back() {
    if (!isFirst) setCurrentStep(STEPS[stepIndex - 1]);
  }
  function updateData(data: Partial<TripPreferences>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }
  function goToStep(step: WizardStep) {
    setCurrentStep(step);
  }

  return {
    currentStep,
    stepIndex,
    isFirst,
    isLast,
    formData,
    next,
    back,
    updateData,
    goToStep,
    totalSteps: STEPS.length,
  };
}
