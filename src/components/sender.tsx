import { CloudUploadOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Attachments, Sender } from "@ant-design/x";
import { message, Badge, Button, GetProp } from "antd";
import { Sparkles, X } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const CustomSender = ({
  content,
  onSubmit,
  setContent,
  loading,
  setLoading,
  onEnhance,
}: {
  content: string;
  onSubmit: () => void;
  setContent: (content: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onEnhance: () => void;
}) => {
  const handleFileChange: GetProp<typeof Attachments, "onChange"> = (info) =>
    setAttachedFiles(info.fileList);
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, "items">
  >([]);
  const senderHeader1 = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === "drop"
            ? { title: "Drop file here" }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
      />
    </Sender.Header>
  );
  const senderHeader = (
    <div className="flex items-center justify-between rounded-lg border bg-gray-50 py-2 px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">
          Upgrade to Pro to unlock all features
        </span>
      </div>
      <button
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setShowUpgrade(false)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );
  const [showUpgrade, setShowUpgrade] = React.useState(true);
  {
    /* <div className="flex items-center justify-center w-[14px] h-[22px]">
        <Sparkles style={{ color: "#1890FF", width: "14px", height: "22px" }} />
      </div> */
  }
  const enhanceNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="text"
            onClick={() => onEnhance()}
            icon={
              <Sparkles
                style={{ color: "#1890FF", width: "14px", height: "22px" }}
              />
            }
          />
        </TooltipTrigger>
        <TooltipContent>enhance your message</TooltipContent>
      </Tooltip>
    </Badge>
  );
  const [recording, setRecording] = React.useState(false);

  const headerNode = (
    <Sender.Header
      open={showUpgrade}
      title={
        <div className="px-2">
          <span className="text-sm font-medium text-gray-900 ">
            Upgrade to Pro to unlock all features
          </span>
        </div>
      }
      onOpenChange={setShowUpgrade}
    />
  );

  return (
    <div className="relative flex flex-col gap-4">
      <div
        className={`flex w-full ${
          showUpgrade ? " flex-col right-0 left-0" : ""
        }`}
      >
        {/* {showUpgrade && (
          <div className="flex mb-2 items-center justify-between rounded-lg border bg-gray-50 py-2 px-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">
                Upgrade to Pro to unlock all features
              </span>
            </div>
            <button
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setShowUpgrade(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )} */}
        <Sender
          value={content}
          header={headerNode}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={enhanceNode}
          loading={loading}
          onCancel={() => {
            setLoading(false);
          }}
          readOnly={loading}
          //   allowSpeech={
          //     loading
          //       ? false
          //       : {
          //           // When setting `recording`, the built-in speech recognition feature will be disabled
          //           recording,
          //           onRecordingChange: (nextRecording) => {
          //             message.info(`Mock Customize Recording: ${nextRecording}`);
          //             setRecording(nextRecording);
          //           },
          //         }
          //   }
          style={{
            backgroundColor: "white",
            width: "100%",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          placeholder="Type your message here..."
        />
      </div>
    </div>
  );
};
