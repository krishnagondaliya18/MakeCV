import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { IPasswordValidation } from '../types';

interface Props {
  password: string;
  onValidationChange?: (validation: IPasswordValidation) => void;
}

export const evaluatePassword = (password: string): IPasswordValidation => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase && hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;

  let strengthLabel: IPasswordValidation['strengthLabel'] = 'Too Weak';
  if (score === 1) strengthLabel = 'Weak';
  else if (score === 2) strengthLabel = 'Medium';
  else if (score === 3) strengthLabel = 'Strong';
  else if (score === 4) strengthLabel = 'Very Strong';

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
    strengthLabel,
  };
};

export const PasswordStrengthMeter: React.FC<Props> = ({ password, onValidationChange }) => {
  const validation = evaluatePassword(password);

  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation);
    }
  }, [password]);

  if (!password) return null;

  const getBarColor = (index: number) => {
    if (index >= validation.score) return 'bg-neutral-200';
    switch (validation.score) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-amber-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-emerald-500';
      default:
        return 'bg-neutral-200';
    }
  };

  const getTextColor = () => {
    switch (validation.score) {
      case 1:
        return 'text-red-600';
      case 2:
        return 'text-amber-600';
      case 3:
        return 'text-blue-600';
      case 4:
        return 'text-emerald-600';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className="mt-2 space-y-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium text-neutral-600 flex items-center gap-1.5">
          {validation.score === 4 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          )}
          Password Strength:
        </span>
        <span className={`font-semibold ${getTextColor()}`}>{validation.strengthLabel}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`h-full rounded-full transition-all duration-300 ${getBarColor(idx)}`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-neutral-600">
        <div className="flex items-center gap-1.5">
          {validation.hasMinLength ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <X className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          {validation.hasUppercase ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <X className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Uppercase letter (A-Z)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {validation.hasLowercase ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <X className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Lowercase letter (a-z)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {validation.hasNumber ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <X className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>One number (0-9)</span>
        </div>
        <div className="flex items-center gap-1.5 sm:col-span-2">
          {validation.hasSpecialChar ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <X className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Special symbol (!@#$%^&*...)</span>
        </div>
      </div>
    </div>
  );
};
