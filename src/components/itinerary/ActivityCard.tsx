import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItineraryActivity } from "@/types";
import { cn, formatCurrency, formatTime, formatDuration } from "@/lib/utils";
import {
  Clock,
  MapPin,
  ExternalLink,
  Calendar,
  Ticket,
  Camera,
  Utensils,
  Landmark,
  Church,
  ShoppingBag,
  TreePine,
  Music,
  Palette,
} from "lucide-react";
import { EstimatedCost } from "./EstimatedCost";
import { OpeningHours } from "./OpeningHours";

const categoryIcons: Record<string, React.ElementType> = {
  museu: Palette,
  monumento: Landmark,
  restaurante: Utensils,
  igreja: Church,
  compras: ShoppingBag,
  parque: TreePine,
  "show/espetáculo": Music,
  fotografia: Camera,
};

const categoryColors: Record<string, string> = {
  museu: "bg-purple-100 text-purple-800",
  monumento: "bg-blue-100 text-blue-800",
  restaurante: "bg-orange-100 text-orange-800",
  igreja: "bg-indigo-100 text-indigo-800",
  compras: "bg-pink-100 text-pink-800",
  parque: "bg-green-100 text-green-800",
  "show/espetáculo": "bg-red-100 text-red-800",
  fotografia: "bg-yellow-100 text-yellow-800",
};

type ActivityCardProps = {
  activity: ItineraryActivity;
  isDemo?: boolean;
};

export function ActivityCard({ activity, isDemo }: ActivityCardProps) {
  const CategoryIcon = categoryIcons[activity.category] || Ticket;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image or placeholder */}
          <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-lg bg-muted items-center justify-center overflow-hidden">
            {activity.imageUrl ? (
              <img
                src={activity.imageUrl}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <CategoryIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name and demo badge */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-sm leading-tight">
                {activity.name}
              </h4>
              {isDemo && (
                <span className="text-[10px] text-yellow-600 shrink-0">
                  [Demonstração]
                </span>
              )}
            </div>

            {/* Time and duration */}
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatTime(activity.suggestedStartTime)} —{" "}
                {formatTime(activity.suggestedEndTime)}
              </span>
              <span className="text-muted-foreground/60">
                ({formatDuration(activity.estimatedDurationMinutes)})
              </span>
            </div>

            {/* Category badge */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] capitalize",
                  categoryColors[activity.category]
                )}
              >
                {activity.category}
              </Badge>
              {activity.bookingRecommended && (
                <Badge className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200">
                  <Calendar className="h-2.5 w-2.5 mr-0.5" />
                  Reserva recomendada
                </Badge>
              )}
            </div>

            {/* Description */}
            {activity.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {activity.description}
              </p>
            )}

            {/* Cost */}
            <div className="mt-2">
              <EstimatedCost
                cost={activity.estimatedCostPerPerson}
                perPerson
                className="text-xs"
              />
            </div>

            {/* Address */}
            {activity.address && (
              <div className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{activity.address}</span>
              </div>
            )}

            {/* Opening hours */}
            {activity.openingHours && activity.openingHours.length > 0 && (
              <OpeningHours
                hours={activity.openingHours}
                className="mt-1.5"
              />
            )}

            {/* Website */}
            {activity.website && (
              <a
                href={activity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Visitar site
              </a>
            )}

            {/* Notes */}
            {activity.notes && activity.notes.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                {activity.notes.map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
