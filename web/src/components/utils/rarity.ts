export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';

export const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: '#9CA3AF',
    borderColor: '#9CA3AF',
    glowColor: '#9CA3AF40',
    textColor: '#9CA3AF',
  },
  uncommon: {
    label: 'Uncommon',
    color: '#10B981',
    borderColor: '#10B981',
    glowColor: '#10B98140',
    textColor: '#10B981',
  },
  rare: {
    label: 'Rare',
    color: '#3B82F6',
    borderColor: '#3B82F6',
    glowColor: '#3B82F640',
    textColor: '#3B82F6',
  },
  epic: {
    label: 'Epic',
    color: '#8B5CF6',
    borderColor: '#8B5CF6',
    glowColor: '#8B5CF640',
    textColor: '#8B5CF6',
  },
  legendary: {
    label: 'Legendary',
    color: '#F59E0B',
    borderColor: '#F59E0B',
    glowColor: '#F59E0B40',
    textColor: '#F59E0B',
  },
  mythic: {
    label: 'Mythic',
    color: '#EF4444',
    borderColor: '#EF4444',
    glowColor: '#EF444440',
    textColor: '#EF4444',
  },
  divine: {
    label: 'Divine',
    color: '#EC4899',
    borderColor: '#EC4899',
    glowColor: '#EC489940',
    textColor: '#EC4899',
  },
} as const;

export const getRarityConfig = (rarity: ItemRarity = 'common') => {
  return RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
};

export const getRarityFromMetadata = (metadata?: any): ItemRarity => {
  if (!metadata?.rarity) return 'common';
  
  const rarity = metadata.rarity.toLowerCase();
  if (rarity in RARITY_CONFIG) {
    return rarity as ItemRarity;
  }
  
  return 'common';
};

export const getRarityOrder = (rarity: ItemRarity): number => {
  const order = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6,
    divine: 7,
  };
  return order[rarity] || 0;
};