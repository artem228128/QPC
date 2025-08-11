import React from 'react';
import { GlassCard, GlassButton } from '../glass';
import { NeuralGlow } from '../neural';
import { Level } from '../../types';

interface LevelCardProps {
  level: Level;
  onActivate?: (levelNumber: number) => void;
  isLoading?: boolean;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, onActivate, isLoading = false }) => {
  const progressPercentage = level.isUnlocked ? (level.earnings / level.price) * 100 : 0;

  return (
    <NeuralGlow
      color={level.isUnlocked ? 'cyan' : 'purple'}
      intensity="medium"
      pulsing={level.isUnlocked}
    >
      <GlassCard className="h-full">
        <div className="p-6 space-y-4">
          {/* Level Header */}
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">Level {level.number}</div>
            <div className="text-xl text-white font-semibold">{level.price} ETH</div>
          </div>

          {/* Level Status */}
          <div className="text-center">
            {level.isUnlocked ? (
              <div className="glass-badge glass-badge-success">✓ Unlocked</div>
            ) : (
              <div className="glass-badge">🔒 Locked</div>
            )}
          </div>

          {/* Progress Bar */}
          {level.isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Progress</span>
                <span className="text-cyan-400">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="glass-progress">
                <div
                  className="glass-progress-fill transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Earnings */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Earnings:</span>
              <span className="text-green-400 font-semibold">{level.earnings.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Max Positions:</span>
              <span className="text-purple-400 font-semibold">{level.maxPositions}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            {level.isUnlocked ? (
              <GlassButton variant="neural" size="md" className="w-full" disabled={true}>
                Active
              </GlassButton>
            ) : (
              <GlassButton
                variant="primary"
                size="md"
                className="w-full"
                glow
                loading={isLoading}
                onClick={() => onActivate?.(level.number)}
              >
                Activate Level
              </GlassButton>
            )}
          </div>

          {/* Level Benefits */}
          <div className="pt-2 text-xs text-gray-400 text-center">
            {level.isUnlocked
              ? `Earning potential: ${(level.price * 2).toFixed(1)} ETH`
              : `Unlock to start earning from ${level.maxPositions} positions`}
          </div>
        </div>
      </GlassCard>
    </NeuralGlow>
  );
};

export default LevelCard;
