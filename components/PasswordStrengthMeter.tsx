"use client";

import React, { useMemo } from "react";

interface Props {
  password: string;
}

export function PasswordStrengthMeter({ password }: Props) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length > 7) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthColor = () => {
    switch (strength) {
      case 0:
        return "bg-gray-200";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const strengthText = () => {
    switch (strength) {
      case 0:
        return "Trivial";
      case 1:
        return "Weak";
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">
          Strength: {strengthText()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthColor()} transition-all duration-300`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <ul className="text-xs text-gray-400 mt-2 space-y-1">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          • At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
          • Uppercase letter
        </li>
        <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
          • Lowercase letter
        </li>
        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
          • Number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>
          • Special character
        </li>
      </ul>
    </div>
  );
}
