import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      // height: 722px;
      height: 100%;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      // font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      // height: 100%;
      flex: 1;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-left: ${token.paddingLG}px;
      // gap: 16px;
      justify-content: space-between;
      min-height: 0;
    `,
    messages: css`
      flex: 1;
      shrink: 1;
      min-height: 0;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      padding: ${token.paddingLG}px;
      padding-left: 0;
      padding-top: 0;
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    loadingDots: css`
      display: inline-block;
      &::after {
        content: "...";
        animation: dots 1.5s steps(4, end) infinite;
        display: inline-block;
        width: 0;
        overflow: hidden;
        white-space: nowrap;
      }

      @keyframes dots {
        to {
          width: 1.25em;
        }
      }
    `,
  };
});
