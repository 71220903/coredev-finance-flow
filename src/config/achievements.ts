
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "trust" | "lending" | "community" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
  maxProgress: number;
  reward: string;
}

export const availableAchievements: Achievement[] = [
  {
    id: "first-loan",
    title: "First Steps",
    description: "Complete your first loan successfully",
    category: "milestone",
    rarity: "common",
    maxProgress: 1,
    reward: "Trust Score +5"
  },
  {
    id: "trust-builder",
    title: "Trust Builder",
    description: "Reach Trust Score of 80+",
    category: "trust",
    rarity: "rare",
    maxProgress: 80,
    reward: "Lower Interest Rates"
  },
  {
    id: "serial-borrower",
    title: "Serial Borrower",
    description: "Complete 5 successful loans",
    category: "lending",
    rarity: "epic",
    maxProgress: 5,
    reward: "Exclusive Borrower Badge"
  },
  {
    id: "community-champion",
    title: "Community Champion",
    description: "Help 10 developers with code reviews",
    category: "community",
    rarity: "rare",
    maxProgress: 10,
    reward: "Special Forum Badge"
  },
  {
    id: "whale-borrower",
    title: "Whale Borrower",
    description: "Borrow over $100,000 total",
    category: "lending",
    rarity: "legendary",
    maxProgress: 100000,
    reward: "VIP Support Access"
  }
];
