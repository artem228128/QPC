import React from 'react';
import { GlassCard } from '../glass';
import { NeuralGlow } from '../neural';
import { Matrix } from '../../types';

interface MatrixGridProps {
  level: number;
  matrices: Matrix[];
  onPositionClick?: (position: number) => void;
  maxPositions?: number;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  level,
  matrices,
  onPositionClick,
  maxPositions = 9,
}) => {
  const positions = Array.from({ length: maxPositions }, (_, i) => i + 1);

  const getPositionStatus = (position: number) => {
    const matrix = matrices.find((m) => m.position === position && m.level === level);
    if (matrix) {
      return matrix.isActive ? 'active' : 'inactive';
    }
    return 'empty';
  };

  const getPositionColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'cyan';
      default:
        return 'purple';
    }
  };

  return (
    <GlassCard title={`Level ${level} Matrix`} className="w-full">
      <div className="grid grid-cols-3 gap-4 p-4">
        {positions.map((position) => {
          const status = getPositionStatus(position);
          const color = getPositionColor(status);

          return (
            <div key={position} className="relative" onClick={() => onPositionClick?.(position)}>
              <NeuralGlow color={color as any} intensity="medium" pulsing={status === 'active'}>
                <div className="glass-panel aspect-square flex items-center justify-center cursor-pointer hover-scale transition-all">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{position}</div>
                    <div className="text-xs text-gray-300 capitalize">{status}</div>
                    {status === 'active' && (
                      <div className="text-xs text-green-400 mt-1">✓ Active</div>
                    )}
                  </div>
                </div>
              </NeuralGlow>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <div className="glass-divider"></div>
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-300">
            Active: {matrices.filter((m) => m.level === level && m.isActive).length}/{maxPositions}
          </span>
          <span className="text-cyan-400">Level {level} - 0.1 ETH</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default MatrixGrid;
