import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Globe, 
  Share2, 
  Copy, 
  ExternalLink, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Megaphone,
  Users,
  Star,
  Play,
  Languages,
  Monitor,
  Smartphone,
  Palette
} from 'lucide-react';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { GlassCard, GlassButton } from '../components/glass';

interface PromoMaterial {
  id: string;
  title: string;
  description: string;
  type: 'presentation' | 'video' | 'image' | 'document';
  language: string;
  languageCode: string;
  flag: string;
  downloadUrl: string;
  previewUrl?: string;
  size?: string;
}

const PROMO_MATERIALS: PromoMaterial[] = [
  // Presentations
  {
    id: 'pres-en',
    title: 'Official Presentation',
    description: 'Complete overview of Quantum Profit Chain platform and matrix system',
    type: 'presentation',
    language: 'English',
    languageCode: 'EN',
    flag: '🇺🇸',
    downloadUrl: '/downloads/qpc-presentation-en.pdf',
    size: '2.3 MB'
  },
  {
    id: 'pres-ru',
    title: 'Официальная Презентация',
    description: 'Полный обзор платформы Quantum Profit Chain и матричной системы',
    type: 'presentation',
    language: 'Русский',
    languageCode: 'RU',
    flag: '🇷🇺',
    downloadUrl: '/downloads/qpc-presentation-ru.pdf',
    size: '2.1 MB'
  },
  {
    id: 'pres-es',
    title: 'Presentación Oficial',
    description: 'Descripción completa de la plataforma Quantum Profit Chain y sistema matricial',
    type: 'presentation',
    language: 'Español',
    languageCode: 'ES',
    flag: '🇪🇸',
    downloadUrl: '/downloads/qpc-presentation-es.pdf',
    size: '2.2 MB'
  },
  {
    id: 'pres-fr',
    title: 'Présentation Officielle',
    description: 'Aperçu complet de la plateforme Quantum Profit Chain et du système matriciel',
    type: 'presentation',
    language: 'Français',
    languageCode: 'FR',
    flag: '🇫🇷',
    downloadUrl: '/downloads/qpc-presentation-fr.pdf',
    size: '2.4 MB'
  },
  {
    id: 'pres-de',
    title: 'Offizielle Präsentation',
    description: 'Vollständiger Überblick über die Quantum Profit Chain Plattform und das Matrix-System',
    type: 'presentation',
    language: 'Deutsch',
    languageCode: 'DE',
    flag: '🇩🇪',
    downloadUrl: '/downloads/qpc-presentation-de.pdf',
    size: '2.3 MB'
  },
  {
    id: 'pres-zh',
    title: '官方演示文稿',
    description: 'Quantum Profit Chain平台和矩阵系统的完整概述',
    type: 'presentation',
    language: '中文',
    languageCode: 'ZH',
    flag: '🇨🇳',
    downloadUrl: '/downloads/qpc-presentation-zh.pdf',
    size: '2.5 MB'
  }
];

const MEDIA_ASSETS = [
  {
    id: 'logo-pack',
    title: 'Logo Pack',
    description: 'High-resolution logos in various formats (PNG, SVG, AI)',
    type: 'image' as const,
    downloadUrl: '/downloads/qpc-logo-pack.zip',
    size: '5.2 MB'
  },
  {
    id: 'banner-pack',
    title: 'Banner Collection',
    description: 'Social media banners and web headers in multiple sizes',
    type: 'image' as const,
    downloadUrl: '/downloads/qpc-banners.zip',
    size: '12.1 MB'
  },
  {
    id: 'promo-video',
    title: 'Promotional Video',
    description: '2-minute overview video with subtitles in 6 languages',
    type: 'video' as const,
    downloadUrl: '/downloads/qpc-promo-video.mp4',
    size: '89.3 MB'
  },
  {
    id: 'whitepaper',
    title: 'Technical Whitepaper',
    description: 'Detailed technical documentation and tokenomics',
    type: 'document' as const,
    downloadUrl: '/downloads/qpc-whitepaper.pdf',
    size: '1.8 MB'
  }
];

const TEMPLATES = [
  {
    id: 'social-posts',
    title: 'Social Media Posts',
    description: 'Ready-to-use templates for Instagram, Twitter, Facebook',
    formats: ['Instagram Story', 'Twitter Post', 'Facebook Cover'],
    downloadUrl: '/downloads/qpc-social-templates.zip'
  },
  {
    id: 'email-templates',
    title: 'Email Templates',
    description: 'Professional email templates for invitations and updates',
    formats: ['Invitation', 'Newsletter', 'Welcome'],
    downloadUrl: '/downloads/qpc-email-templates.zip'
  },
  {
    id: 'web-widgets',
    title: 'Web Widgets',
    description: 'Embeddable widgets for websites and blogs',
    formats: ['Referral Banner', 'Stats Widget', 'Join Button'],
    downloadUrl: '/downloads/qpc-web-widgets.zip'
  }
];

const PromoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'presentations' | 'media' | 'templates'>('presentations');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filteredPresentations = selectedLanguage === 'all' 
    ? PROMO_MATERIALS 
    : PROMO_MATERIALS.filter(item => item.languageCode.toLowerCase() === selectedLanguage);

  const handleDownload = (url: string, title: string) => {
    // In real implementation, this would trigger actual download
    console.log(`Downloading: ${title} from ${url}`);
    // window.open(url, '_blank');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://quantumprofitchain.com?ref=YOUR_ID');
    // Add toast notification
  };

  const shareOnSocial = (platform: string) => {
    const url = 'https://quantumprofitchain.com';
    const text = 'Join Quantum Profit Chain - Revolutionary Matrix Gaming Protocol! 🚀';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation': return FileText;
      case 'video': return Video;
      case 'image': return ImageIcon;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground intensity={0.6} particleCount={30} />
      <ConnectedHeader />
      <DashboardSidebar />

      <main className="relative z-10 pt-16 pb-16 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            className="mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-cyberpunk mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    PROMO MATERIALS
                  </span>
                </h1>
                <p className="text-gray-300">Professional marketing materials and assets for promotion</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Share Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 border border-yellow-400/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Share2 className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Quick Share</h3>
                    <p className="text-yellow-400 text-sm">Share your referral link instantly</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Your Referral Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-white border border-white/10">
                      https://quantumprofitchain.com?ref=YOUR_ID
                    </div>
                    <GlassButton
                      variant="secondary"
                      onClick={copyReferralLink}
                      className="px-4"
                    >
                      <Copy size={16} />
                    </GlassButton>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Share on Social Media</label>
                  <div className="flex gap-2">
                    <GlassButton variant="secondary" onClick={() => shareOnSocial('twitter')} className="flex-1">
                      Twitter
                    </GlassButton>
                    <GlassButton variant="secondary" onClick={() => shareOnSocial('facebook')} className="flex-1">
                      Facebook
                    </GlassButton>
                    <GlassButton variant="secondary" onClick={() => shareOnSocial('telegram')} className="flex-1">
                      Telegram
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex gap-4 mb-6">
              {[
                { id: 'presentations', label: 'Presentations', icon: FileText },
                { id: 'media', label: 'Media Assets', icon: ImageIcon },
                { id: 'templates', label: 'Templates', icon: Palette }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <GlassButton
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-cyan-300' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </div>
                  </GlassButton>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'presentations' && (
              <motion.div
                key="presentations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Language Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Languages className="text-cyan-400" size={20} />
                      <span className="text-white">Filter by Language:</span>
                    </div>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="glass-panel-secondary px-4 py-2 rounded-lg text-white text-sm bg-transparent border-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="all">All Languages</option>
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPresentations.map((material, index) => {
                    const Icon = getTypeIcon(material.type);
                    return (
                      <motion.div
                        key={material.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GlassCard className="p-6 h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-cyan-500/20 rounded-lg">
                                <Icon className="text-cyan-400" size={20} />
                              </div>
                              <div className="text-2xl">{material.flag}</div>
                            </div>
                            <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                              {material.size}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-white mb-2">{material.title}</h4>
                            <p className="text-gray-300 text-sm mb-3">{material.description}</p>
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-cyan-400" />
                              <span className="text-cyan-400 text-sm font-medium">{material.language}</span>
                            </div>
                          </div>

                          <GlassButton
                            variant="primary"
                            onClick={() => handleDownload(material.downloadUrl, material.title)}
                            className="w-full py-3"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Download size={16} />
                              <span>Download</span>
                            </div>
                          </GlassButton>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MEDIA_ASSETS.map((asset, index) => {
                    const Icon = getTypeIcon(asset.type);
                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GlassCard className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Icon className="text-purple-400" size={24} />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-white">{asset.title}</h4>
                                <p className="text-gray-300 text-sm">{asset.description}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                              {asset.size}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <GlassButton
                              variant="primary"
                              onClick={() => handleDownload(asset.downloadUrl, asset.title)}
                              className="flex-1 py-3"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Download size={16} />
                                <span>Download</span>
                              </div>
                            </GlassButton>
                            {asset.type === 'video' && (
                              <GlassButton
                                variant="secondary"
                                onClick={() => {/* Preview video */}}
                                className="px-4"
                              >
                                <Play size={16} />
                              </GlassButton>
                            )}
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TEMPLATES.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                              <Palette className="text-green-400" size={20} />
                            </div>
                            <h4 className="text-lg font-semibold text-white">{template.title}</h4>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                          
                          <div className="space-y-2">
                            <span className="text-gray-400 text-xs">Includes:</span>
                            {template.formats.map((format, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-green-400 text-sm">{format}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <GlassButton
                          variant="primary"
                          onClick={() => handleDownload(template.downloadUrl, template.title)}
                          className="w-full py-3"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Download size={16} />
                            <span>Download Pack</span>
                          </div>
                        </GlassButton>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Usage Guidelines */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassCard className="p-6 border border-blue-400/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
              <h3 className="text-xl font-semibold text-white mb-4">Usage Guidelines</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-green-400 font-medium mb-2">✅ Allowed</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Use for promoting Quantum Profit Chain</li>
                    <li>• Share on social media platforms</li>
                    <li>• Include in presentations and websites</li>
                    <li>• Translate to other languages</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-red-400 font-medium mb-2">❌ Not Allowed</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Modify logos or brand elements</li>
                    <li>• Use for competing projects</li>
                    <li>• Claim ownership of materials</li>
                    <li>• Remove copyright notices</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PromoPage;
