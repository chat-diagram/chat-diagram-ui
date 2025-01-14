import { Sender } from "@ant-design/x";
import { Badge, Button } from "antd";
import { Sparkles, X } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { Button as CustomButtom } from "./ui/button";

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
  const [showUpgrade, setShowUpgrade] = React.useState(true);
  {
    /* <div className="flex items-center justify-center w-[14px] h-[22px]">
        <Sparkles style={{ color: "#1890FF", width: "14px", height: "22px" }} />
      </div> */
  }
  const enhanceNode = (
    <Badge dot={false}>
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
  // const [recording, setRecording] = React.useState(false);

  // const headerNode = (
  //   <Sender.Header
  //     open={showUpgrade}
  //     title={
  //       <div className="px-2">
  //         <span className="text-sm font-medium text-gray-900 ">
  //           Upgrade to Pro to unlock all features
  //         </span>
  //       </div>
  //     }
  //     onOpenChange={setShowUpgrade}
  //   />
  // );

  return (
    <div className="relative flex flex-col gap-4">
      <div
        className={`flex w-full ${
          showUpgrade ? " flex-col right-0 left-0" : ""
        }`}
      >
        {showUpgrade && (
          <div
            className="absolute w-full flex mb-2 items-center justify-between rounded-lg  bg-gray-50 py-2 px-4 shadow-sm dark:bg-gray-900"
            style={{ paddingTop: "0px", minHeight: "40px" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium ">
                Upgrade to Pro to unlock all features
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/payment"
                className="text-sm font-medium text-gray-900"
              >
                <CustomButtom variant="link" size="sm">
                  Upgrade
                </CustomButtom>
              </Link>
              <button
                className="rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setShowUpgrade(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <Sender
          value={content}
          // header={headerNode}
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
            width: "100%",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginTop: showUpgrade ? "26px" : "0",
          }}
          classNames={{
            input: "placeholder:text-gray-400 dark:text-white",
          }}
          placeholder="Type your message here..."
          className="bg-background border-border "
        />
      </div>
    </div>
  );
};
