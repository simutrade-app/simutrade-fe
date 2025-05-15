import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const LoadingAnimation: React.FC = () => {
  const iconRef = useRef<HTMLImageElement>(null);

