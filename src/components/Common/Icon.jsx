import {
  Heart,
  GraduationCap,
  Utensils,
  Users,
  Stethoscope,
  Sparkles,
  Map,
  Briefcase,
  Sprout,
  HandHeart,
} from "lucide-react"

const ICONS = {
  heart: Heart,
  graduation: GraduationCap,
  utensils: Utensils,
  users: Users,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  map: Map,
  briefcase: Briefcase,
  sprout: Sprout,
  hand: HandHeart,
}

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Heart
  return <Cmp {...props} />
}
