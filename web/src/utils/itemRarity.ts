import { SlotWithItem } from '../typings';

type RarityLevel = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique';

interface RarityStyles {
  borderColor: string;
  glowColor: string;
  gradientStart: string;
  gradientEnd: string;
  labelBackgroundColor: string;
}

// Rarity styling definitions
export const RARITY_STYLES: Record<RarityLevel, RarityStyles> = {
  common: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    glowColor: 'rgba(255, 255, 255, 0)',
    gradientStart: 'rgba(255, 255, 255, 0.03)',
    gradientEnd: 'rgba(255, 255, 255, 0)',
    labelBackgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  uncommon: {
    borderColor: 'rgba(75, 175, 80, 0.3)',
    glowColor: 'rgba(75, 175, 80, 0.1)',
    gradientStart: 'rgba(75, 175, 80, 0.05)',
    gradientEnd: 'rgba(75, 175, 80, 0)',
    labelBackgroundColor: 'rgba(75, 175, 80, 0.2)'
  },
  rare: {
    borderColor: 'rgba(33, 150, 243, 0.3)',
    glowColor: 'rgba(33, 150, 243, 0.15)',
    gradientStart: 'rgba(33, 150, 243, 0.07)',
    gradientEnd: 'rgba(33, 150, 243, 0)',
    labelBackgroundColor: 'rgba(33, 150, 243, 0.2)'
  },
  epic: {
    borderColor: 'rgba(156, 39, 176, 0.4)',
    glowColor: 'rgba(156, 39, 176, 0.2)',
    gradientStart: 'rgba(156, 39, 176, 0.1)',
    gradientEnd: 'rgba(156, 39, 176, 0)',
    labelBackgroundColor: 'rgba(156, 39, 176, 0.25)'
  },
  legendary: {
    borderColor: 'rgba(255, 152, 0, 0.5)',
    glowColor: 'rgba(255, 152, 0, 0.25)',
    gradientStart: 'rgba(255, 152, 0, 0.12)',
    gradientEnd: 'rgba(255, 152, 0, 0)',
    labelBackgroundColor: 'rgba(255, 152, 0, 0.3)'
  },
  unique: {
    borderColor: 'rgba(233, 30, 99, 0.5)',
    glowColor: 'rgba(233, 30, 99, 0.25)',
    gradientStart: 'rgba(233, 30, 99, 0.12)',
    gradientEnd: 'rgba(233, 30, 99, 0)',
    labelBackgroundColor: 'rgba(233, 30, 99, 0.3)'
  }
};

// Define rules for determining item rarity
export const determineItemRarity = (item: SlotWithItem): RarityLevel => {
  // Use metadata.rarity if it exists
  if (item.metadata?.rarity) {
    return item.metadata.rarity as RarityLevel;
  }
  
  // Check by item name patterns
  const name = item.name.toLowerCase();
  
  // Weapons are typically rare
  if (
    name.includes('weapon') || 
    name.includes('gun') || 
    name.includes('rifle') || 
    name.includes('pistol') || 
    name.includes('shotgun')
  ) {
    return item.metadata?.quality === 'illegal' ? 'legendary' : 'rare';
  }
  
  // Unique items
  if (
    name.includes('unique') || 
    name.includes('special') ||
    name.includes('collectible')
  ) {
    return 'unique';
  }
  
  // Valuables
  if (
    name.includes('gold') || 
    name.includes('diamond') || 
    name.includes('jewel')
  ) {
    return 'epic';
  }
  
  // Drugs and contraband
  if (
    name.includes('drug') || 
    name.includes('cocaine') || 
    name.includes('weed') || 
    name.includes('meth')
  ) {
    return 'legendary';
  }
  
  // Tools and crafting items
  if (
    name.includes('tool') || 
    name.includes('craft')
  ) {
    return 'uncommon';
  }
  
  // Check by item durability or metadata quality
  if (item.metadata?.quality) {
    const quality = item.metadata.quality.toLowerCase();
    if (quality === 'perfect' || quality === 'pristine') return 'epic';
    if (quality === 'high' || quality === 'excellent') return 'rare';
    if (quality === 'good' || quality === 'standard') return 'uncommon';
  }
  
  // Default to common
  return 'common';
};

// Get the CSS styles for an item based on its rarity
export const getItemRarityStyles = (item: SlotWithItem): RarityStyles => {
  const rarity = determineItemRarity(item);
  return RARITY_STYLES[rarity];
};

// Get animation definition for an item based on rarity
export const getItemRarityAnimation = (item: SlotWithItem): string => {
  const rarity = determineItemRarity(item);
  
  switch (rarity) {
    case 'legendary':
      return 'pulse-legendary 2s infinite';
    case 'epic':
      return 'pulse-epic 3s infinite';
    case 'rare':
      return 'subtle-glow 4s infinite';
    default:
      return 'none';
  }
};

// Export CSS classes for use in styled components
export const getRarityClass = (item: SlotWithItem): string => {
  return `rarity-${determineItemRarity(item)}`;
};