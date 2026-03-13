import {
  Rocket,
  Smartphone,
  Globe,
  Monitor,
  HelpCircle,
  FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Smartphone,
  Globe,
  Monitor,
  HelpCircle,
  FileText,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FileText
}
