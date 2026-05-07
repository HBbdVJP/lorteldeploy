"use client";

import { useState, useCallback } from "react";

export function useModal<T = any>(initialPayload: T | null = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<T | null>(initialPayload);

  const open = useCallback((value?: T) => {
    setPayload(value ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    payload,
    setPayload,
    open,
    close,
    toggle,
  };
}
