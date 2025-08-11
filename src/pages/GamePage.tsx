import React, { useState } from 'react';
import { AuthHeader, Sidebar } from '../components/layout';
import { MatrixGrid, LevelCard } from '../components/game';
import { NeuralBackground } from '../components/neural';
import { GlassCard } from '../components/glass';
import { FadeIn } from '../components/animations';
import type { Level, Matrix } from '../types';

const GamePage: React.FC = () => {
  // Mock data - would come from smart contract
  const [levels] = useState<Level[]>([
    { number: 1, price: 0.1, maxPositions: 3, isUnlocked: true, earnings: 0.05 },
    { number: 2, price: 0.2, maxPositions: 9, isUnlocked: true, earnings: 0.12 },
    { number: 3, price: 0.4, maxPositions: 27, isUnlocked: false, earnings: 0 },
    { number: 4, price: 0.8, maxPositions: 81, isUnlocked: false, earnings: 0 },
    { number: 5, price: 1.6, maxPositions: 243, isUnlocked: false, earnings: 0 },
    { number: 6, price: 3.2, maxPositions: 729, isUnlocked: false, earnings: 0 },
    { number: 7, price: 6.4, maxPositions: 2187, isUnlocked: false, earnings: 0 },
    { number: 8, price: 12.8, maxPositions: 6561, isUnlocked: false, earnings: 0 },
  ]);

  const [matrices] = useState<Matrix[]>([
    {
      id: '1',
      level: 1,
      position: 1,
      userId: 'user1',
      isActive: true,
      earnings: 0.025,
      uplineId: undefined,
      downlineIds: [],
    },
    {
      id: '2',
      level: 1,
      position: 2,
      userId: 'user2',
      isActive: true,
      earnings: 0.025,
      uplineId: '1',
      downlineIds: [],
    },
    {
      id: '3',
      level: 2,
      position: 1,
      userId: 'user1',
      isActive: true,
      earnings: 0.06,
      uplineId: undefined,
      downlineIds: [],
    },
    {
      id: '4',
      level: 2,
      position: 5,
      userId: 'user3',
      isActive: false,
      earnings: 0,
      uplineId: '3',
      downlineIds: [],
    },
  ]);

  const handleLevelActivation = async (levelNumber: number) => {
    console.warn(`Activating level ${levelNumber}`);
    // This would interact with the smart contract
  };

  const handlePositionClick = (position: number) => {
    console.warn(`Position ${position} clicked`);
    // Handle position selection/activation
  };

  const userStats = {
    level: Math.max(...levels.filter((l) => l.isUnlocked).map((l) => l.number)),
    totalEarnings: levels.reduce((sum, level) => sum + level.earnings, 0),
    activeMatrices: matrices.filter((m) => m.isActive).length,
  };

  return (
    <div className="min-h-screen">
      <NeuralBackground intensity={0.8} particleCount={30} />

      <AuthHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8">
          {/* Page Header */}
          <FadeIn delay={100}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Game Dashboard</h1>
                <p className="text-gray-300 mt-2">
                  Manage your matrix positions and level progression
                </p>
              </div>
              <button className="md:hidden glass-button" onClick={() => {}}>
                ☰
              </button>
            </div>
          </FadeIn>

          {/* Active Matrices Section */}
          <section>
            <FadeIn delay={200}>
              <h2 className="text-2xl font-semibold text-white mb-6">Active Matrices</h2>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-8">
              {levels
                .filter((level) => level.isUnlocked)
                .map((level, index) => (
                  <FadeIn key={level.number} delay={300 + index * 100}>
                    <MatrixGrid
                      level={level.number}
                      matrices={matrices}
                      onPositionClick={handlePositionClick}
                      maxPositions={Math.min(level.maxPositions, 9)}
                    />
                  </FadeIn>
                ))}
            </div>
          </section>

          {/* Levels Section */}
          <section>
            <FadeIn delay={600}>
              <h2 className="text-2xl font-semibold text-white mb-6">Available Levels</h2>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {levels.map((level, index) => (
                <FadeIn key={level.number} delay={700 + index * 50}>
                  <LevelCard level={level} onActivate={handleLevelActivation} isLoading={false} />
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Statistics */}
          <section>
            <FadeIn delay={1000}>
              <GlassCard title="Performance Statistics">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">
                      {userStats.totalEarnings.toFixed(3)}
                    </div>
                    <div className="text-gray-300 text-sm">Total Earnings (ETH)</div>
                  </div>

                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      {userStats.activeMatrices}
                    </div>
                    <div className="text-gray-300 text-sm">Active Positions</div>
                  </div>

                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      Level {userStats.level}
                    </div>
                    <div className="text-gray-300 text-sm">Current Level</div>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GamePage;
