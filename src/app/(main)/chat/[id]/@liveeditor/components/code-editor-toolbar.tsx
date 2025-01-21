import { Button } from "@/components/ui/button";
import { useChatContext } from "../../layout";
import { Copy } from "lucide-react";
import { message } from "antd";
import { useI18n } from "@/i18n";

export const CodeEditorToolbar = () => {
  const t = useI18n();
  const { mermaidCode } = useChatContext();
  return (
    <>
      <div className="flex justify-between p-1 " style={{ height: "36px" }}>
        <div></div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="mini"
            onClick={() => {
              navigator.clipboard.writeText(mermaidCode);
              message.success({ content: t("diagram.copySuccess") });
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* <Separator /> */}
    </>
  );
};
