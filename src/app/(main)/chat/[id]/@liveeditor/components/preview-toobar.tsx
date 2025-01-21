import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useChatContext } from "../../layout";

export const PreviewToolbar = () => {
  const { editorState, setEditorState } = useChatContext();
  return (
    <>
      <div className="flex p-1 justify-between" style={{ height: "36px" }}>
        <div></div>
        <div className="flex items-center gap-2">
          <Label htmlFor="airplane-mode">Rough</Label>
          <Switch
            id="airplane-mode"
            checked={editorState.rough}
            onCheckedChange={(checked) =>
              setEditorState({ ...editorState, rough: checked })
            }
          />
        </div>
      </div>
      {/* <Separator /> */}
    </>
  );
};
