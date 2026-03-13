import {
  Rocket,
  Settings,
  Bell,
  MessageCircleQuestion,
  Puzzle,
  TrendingUp,
  Shield,
  FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Settings,
  Bell,
  MessageCircleQuestion,
  Puzzle,
  TrendingUp,
  Shield,
  FileText,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FileText
}
