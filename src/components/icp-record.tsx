import { cn } from "@/lib/utils";

interface ICPRecordProps {
  // ICP备案号
  icpNo?: string;
  // 公安备案号
  psb?: string;
  className?: string;
}

export function ICPRecord({
  icpNo = "沪ICP备16042764号-2", // 替换为你的实际备案号
  psb = "沪ICP备16042764号-2", // 替换为你的实际公安备案号
  className,
}: ICPRecordProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground",
        className
      )}
    >
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {icpNo}
      </a>
      {/* {psb && (
        <a
          href="http://www.beian.gov.cn/portal/index.do"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <img
            src="/images/police-badge.png"
            alt="公安备案图标"
            className="h-4 w-4"
          />
          {psb}
        </a>
      )} */}
    </div>
  );
}
