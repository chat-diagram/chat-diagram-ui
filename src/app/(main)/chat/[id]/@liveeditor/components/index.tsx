import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/i18n";
import { Download } from "lucide-react";

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

export const DownloadButton = ({
  handleDownloadPNG,
}: {
  handleDownloadPNG: () => void;
}) => {
  const t = useI18n();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="h5" variant="ghost" onClick={handleDownloadPNG}>
          <Download className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("diagram.downloadPNG")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
