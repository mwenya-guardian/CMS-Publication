import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Smile, Frown, Zap } from 'lucide-react';
import { ReactionType } from '../../types/Reaction';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const reactionIcons: Record<ReactionType, React.ComponentType<{ className?: string }>> = {
  LIKE: ThumbsUp,
  DISLIKE: ThumbsDown,
  COMMENT: MessageCircle,
  // LOVE: Heart,
  // ANGRY: Frown,
  // SAD: Frown,
  // WOW: Zap,
};

const reactionColors: Record<ReactionType, string> = {
  LIKE: 'text-blue-600',
  DISLIKE: 'text-red-600',
  // LOVE: 'text-red-600',
  // ANGRY: 'text-red-600',
  // SAD: 'text-gray-600',
  // WOW: 'text-yellow-600',
  COMMENT: 'text-green-600',
};

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  type,
  count,
  isActive,
  onClick,
  disabled = false,
}) => {
  const Icon = reactionIcons[type];
  const colorClass = reactionColors[type];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 ${
        isActive      
          ? `${colorClass} bg-opacity-10`
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Icon className={`h-4 w-4 ${isActive ? colorClass : ''}`} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
};
