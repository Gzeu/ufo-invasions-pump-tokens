'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface UFOShipProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  type?: 'scout' | 'battle' | 'mothership' | 'special';
  powerLevel?: number;
}

export const UFOShip: React.FC<UFOShipProps> = ({ 
  size = 'medium', 
  animated = false, 
  type = 'scout',
  powerLevel = 1 
}) => {
  const sizeConfig = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 100, height: 100 }
  };

  const typeColors = {
    scout: 'from-blue-400 to-cyan-500',
    battle: 'from-purple-400 to-pink-500', 
    mothership: 'from-yellow-400 to-orange-500',
    special: 'from-green-400 to-emerald-500'
  };

  const { width, height } = sizeConfig[size];
  const gradientClass = typeColors[type];

  return (
    <div className="relative flex items-center justify-center">
      {/* 🛸 Main UFO Body */}
      <motion.div
        className={`relative bg-gradient-to-br ${gradientClass} rounded-full shadow-2xl border-2 border-white/30`}
        style={{ width, height }}
        animate={animated ? {
          y: [-2, 2, -2],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Central Core */}
        <div className="absolute inset-2 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
        
        {/* Power Level Indicator */}
        {powerLevel > 1 && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {powerLevel}
          </div>
        )}
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-full blur-lg opacity-50 -z-10`} />
      </motion.div>
      
      {/* ⚡ Energy Beams (only for animated ships) */}
      {animated && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 w-1 bg-white/60 origin-center"
            style={{ 
              height: size === 'large' ? 30 : size === 'medium' ? 20 : 15,
              transform: 'translateX(-50%) translateY(-100%) rotate(-45deg)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 w-1 bg-white/60 origin-center"
            style={{ 
              height: size === 'large' ? 30 : size === 'medium' ? 20 : 15,
              transform: 'translateX(-50%) translateY(-100%) rotate(45deg)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.5
            }}
          />
        </>
      )}
    </div>
  );
};

export default UFOShip;