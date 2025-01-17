import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/i18n";

export const LatestVersionBadge = () => {
  const t = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="success" className="ml-4">
          {t("diagram.latestBadge")}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("diagram.latestTooltip")}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const RollbackVersionBadge = ({ onClick }: { onClick: () => void }) => {
  const t = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          onClick={onClick}
          variant="secondary"
          className="ml-4"
          style={{ cursor: "pointer" }}
        >
          {t("diagram.rollbackBtn")}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("diagram.rollbackTooltip")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
