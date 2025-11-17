import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation presets for consistent animations throughout the app
const animationPresets = {
  // Fade in from bottom
  fadeInUp: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },

  // Fade in from left
  fadeInLeft: {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },

  // Fade in from right
  fadeInRight: {
    x: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },

  // Scale in
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)"
  },

  // Stagger configuration
  stagger: {
    stagger: 0.1,
    duration: 0.6
  }
};

// Common animation functions
const animateElement = (element, animationType) => {
  if (element) {
    const animation = animationPresets[animationType];
    if (animation) {
      gsap.fromTo(element, { opacity: 0, y: 50 }, { ...animation, duration: 0.8 });
    }
  }
};

const animateMultipleElements = (elements, animationType, stagger = 0.1) => {
  if (elements && elements.length > 0) {
    const animation = animationPresets[animationType];
    if (animation) {
      gsap.fromTo(elements, 
        { opacity: 0, y: 50 }, 
        { 
          ...animation, 
          stagger: stagger,
          duration: 0.8
        }
      );
    }
  }
};

const animateOnScroll = (element, animationType, triggerOffset = "top 80%") => {
  if (element) {
    const animation = animationPresets[animationType];
    if (animation) {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          ...animation,
          scrollTrigger: {
            trigger: element,
            start: triggerOffset,
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }
};

// Predefined animation sequences
const createAnimationSequence = (elements, sequenceType = 'fadeInUp') => {
  const tl = gsap.timeline();
  
  if (sequenceType === 'fadeInUp') {
    tl.fromTo(elements, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2,
        ease: "power3.out"
      }
    );
  }
  
  return tl;
};

// Cleanup function to kill all scroll triggers
const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

export {
  animationPresets,
  animateElement,
  animateMultipleElements,
  animateOnScroll,
  createAnimationSequence,
  cleanupAnimations
};