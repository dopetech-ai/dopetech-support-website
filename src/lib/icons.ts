import {
  Rocket,
  Smartphone,
  Globe,
  Monitor,
  HelpCircle,
  FileText,
  Wrench,
  MessageCircleQuestion,
  BookOpen,
  CreditCard,
  UserCog,
  Shield,
  Puzzle,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Smartphone,
  Globe,
  Monitor,
  HelpCircle,
  FileText,
  Wrench,
  MessageCircleQuestion,
  BookOpen,
  CreditCard,
  UserCog,
  Shield,
  Puzzle,
  Megaphone,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FileText
}
