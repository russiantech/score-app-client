
// v2
// src/components/auth/OTPInput.tsx

import type { OTPInputProps } from '@/types/auth';
import React, { useEffect, useRef, useState } from 'react';

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const next = Array(length).fill('');
    value.split('').forEach((c, i) => {
      if (i < length) next[i] = c;
    });
    setDigits(next);
  }, [value, length]);

  const update = (next: string[]) => {
    setDigits(next);
    onChange(next.join(''));
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!char) return;

    const next = [...digits];
    next[index] = char[0];
    update(next);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        inputsRef.current[index - 1]?.focus();
      }
      update(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, length);

    const next = Array(length).fill('');
    pasted.split('').forEach((c, i) => (next[i] = c));
    update(next);

    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="d-flex justify-content-center gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={digit}
          disabled={disabled}
          inputMode="text"
          maxLength={1}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="form-control text-center"
          style={{
            width: 44,
            height: 48,
            fontSize: '1.2rem',
            fontWeight: 600,
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;