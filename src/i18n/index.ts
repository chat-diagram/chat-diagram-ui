import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// 导入翻译文件
const resources = {
  en: {
    common: {
      editBtn: "Edit",
      deleteBtn: "Delete",
      createBtn: "Create",
      cancelBtn: "Cancel",
      account: {
        nav: {
          title: "My Account",
          upgrade: "Upgrade to Pro",
          settings: "Settings",
          billing: "Billing",
          preferences: "Preferences",
          theme: "Theme",
          language: "Language",
          zh: "中",
          en: "en",
          logout: "Log out",
          settingsDialog: {
            title: "Settings",
            common: "Common",
            account: "Account",
            email: "Email",
            subscription: "Subscription",
            upgrade: "Upgrade to Pro",
            cancel: "Cancel Account",
            cancelBtn: "Cancel",
          },
          subscription: {
            active: "Active",
            pro: "Pro",
            proMember: "Pro Member",
            upgradeToPro: "Upgrade to Pro",
          },
        },
      },
      siderBar: {
        toggleTooltipContent: "Toggle Sidebar",
      },
      sender: {
        placeholder: "Type your message here...",
        enhanceTool: "enhance your description",
        upgrade: "Upgrade to Pro to unlock all features",
        upgradeBtn: "Upgrade",
      },
      project: {
        title: "Projects",
        addBtn: "New Project",
        addDialog: {
          title: "Create a new project",
          name: "Name",
          namePlaceholder: "This is a project name",
          description: "Description",
          descriptionPlaceholder: "This is a description",
        },
        searchPlaceholder: "Search your projects",
        searchEmptyTitle: "No Projects",
        searchEmptyDesc: "To get started, create a new project.",
        siderBtn: {
          view: "View Project",
          share: "Share Project",
          delete: "Delete Project",
          addTooltip: "Add a new project",
        },
      },
      diagram: {
        generating: "Generating diagram",
        generated: "Generated diagram",
        previewBtn: "Preview",
        codeBtn: "Code",
        rollbackBtn: "Rollback",
        rollbackTooltip: "Rollback to the previous version",
        latestBadge: "Latest",
        latestTooltip: "The latest version",
        previousTooltip: "Previous version",
        laterTooltip: "Later version",
        share: "Share",
        syntaxError: "Syntax error, please check your Mermaid syntax",
        renameBtnTooltip: "Rename Diagram",
        renameDialogTitle: "Rename Diagram",
        renameDialogName: "Name",
        renameDialogNamePlaceholder: "This is a diagram name",
        renameDialogCancelBtn: "Cancel",
        renameDialogConfirmBtn: "Rename",
        selectPlaceholder: "Select a expire time",
        "7d": "7 days",
        "15d": "15 days",
        never: "Never",
        downloadPNG: "Download",
        shareExpireTime: "Select Share Expire Time",
      },
      welcome: "Welcome to Chat Diagram",
      features: {
        title: "Features",
        chat: "Generate charts through natural language",
        charts: "Support multiple chart types",
      },
      payment: {
        membershipPlans: "Membership Plans",
        membershipPlansDesc: "Choose the plan that suits you",
        startingAt: "Starting at",
        month: "month",
        monthUnit_one: "month",
        monthUnit_other: "months",
        oneMonth: "1 month",
        threeMonth: "3 months",
        sixMonth: "6 months",
        twelveMonth: "12 months",
        discount: "Discount",
        membershipBenefits: "Membership Benefits",
        unlimitedProjects: "Unlimited Projects",
        unlimitedDiagrams: "Unlimited Diagrams",
        unlimitedUsers: "Unlimited Users",
        unlimitedOptimize: "Unlimited Enhance Description",
        advancedStyle: "Advanced Style Configuration",
        unlimitedStorage: "Unlimited Storage",
        unlimitedChats: "Unlimited Chats",
        unlimitedGenerations: "Unlimited Generations",
        prioritySupport: "Priority Support",
        earlyAccess: "Early Access to New Features",
        exclusiveEvents: "Exclusive Events",
        exclusiveMerch: "Exclusive Merch",
        choosePaymentMethod: "Choose Payment Method",
        alipay: "Alipay",
        wechat: "Wechat",
        tradeName: "Trade Name",
        tradeNameDetail: "chat-diagram Pro",
        needPay: "Need to pay",
        payNow: "Pay Now",
        redirecting: "Redirecting to payment...",
        preparingPayment:
          "Please Wait,preparing payment environment for you...",
        confirmPayment: "Confirming payment...",
        confirmPaymentDesc: "Please wait, confirming your payment...",
        paySuccess: "Payment successful",
        paySuccessDesc:
          "Thank you for your purchase! Your membership rights have been activated",
        payFailed: "Payment failed",
        payFailedDesc: "Please try again later, or contact customer service",
        orderNumber: "Order Number",
        amount: "Amount",
        membershipDuration: "Membership Duration",
        membershipBenefitsHasBeenActivated: "Benefits have been activated",
        useTipsTitle: "Tips",
        useTipsDesc:
          "You can use the benefits of the membership plan immediately.If you need help,please contact customer service.",
        useTipsBtn: "Use Now",
        billings: {
          historyTitle: "Billing History",
          historyDesc: "View your billing history",
          historyEmptyTitle: "No Billing History",
          historyEmptyDesc:
            "You have no transaction records. Start using our services, and the bill will be displayed here.",
          historyEmptyBtn: "View Membership Plans",
          helpTips:
            "If you have any questions or need help, please contact our customer support team.",
          helpInfoEmail: "Email:",
          tradeNumber: "Trade Number",
          tradePaidAt: "Paid At",
          tradeAmount: "Amount",
          dayUnit: "days",
          tradeStatus: "Status",
          tradeDuration: "Plan",
          tradeDetailBtn: "Detail",
          tradeDetailTitle: "Trade Detail",
        },
      },
    },
  },
  zh: {
    common: {
      editBtn: "编辑",
      deleteBtn: "删除",
      createBtn: "创建",
      cancelBtn: "取消",
      account: {
        nav: {
          title: "我的账户",
          upgrade: "升级到专业版",
          settings: "设置",
          billing: "账单",
          logout: "登出",
          preferences: "偏好设置",
          theme: "主题",
          language: "语言",
          zh: "中",
          en: "en",
          settingsDialog: {
            title: "设置",
            common: "通用设置",
            account: "账户信息",
            email: "电子邮件",
            subscription: "订阅",
            upgrade: "升级到专业版",
            cancel: "注销账户",
            cancelBtn: "注销",
          },
          subscription: {
            active: "已激活",
            pro: "专业版",
            proMember: "专业版会员",
            upgradeToPro: "升级到专业版",
          },
        },
      },
      siderBar: {
        toggleTooltipContent: "折叠侧边栏",
      },
      sender: {
        placeholder: "在这里输入你的消息...",
        enhanceTool: "增强你的描述",
        upgrade: "升级到专业版以解锁所有功能",
        upgradeBtn: "升级",
      },
      project: {
        addBtn: "新建项目",
        addDialog: {
          title: "创建新项目",
          name: "名称",
          namePlaceholder: "项目名称",
          description: "描述",
          descriptionPlaceholder: "项目描述",
        },
        title: "项目",
        searchPlaceholder: "搜索项目",
        searchEmptyTitle: "没有项目",
        searchEmptyDesc: "开始创建一个新项目",
        siderBtn: {
          view: "查看项目",
          share: "分享项目",
          delete: "删除项目",
          addTooltip: "添加一个新项目",
        },
      },
      diagram: {
        generating: "正在生成图表",
        generated: "图表生成成功",
        previewBtn: "预览",
        codeBtn: "代码",
        rollbackBtn: "回滚",
        rollbackTooltip: "回滚到此版本，之后的版本会被删除",
        latestBadge: "最新版本",
        latestTooltip: "最新版本",
        previousTooltip: "上一个版本",
        laterTooltip: "下一个版本",
        share: "分享",
        syntaxError: "语法错误，请检查您的 Mermaid 语法",
        renameBtnTooltip: "重命名图表",
        renameDialogTitle: "重命名图表",
        renameDialogName: "名称",
        renameDialogNamePlaceholder: "图表名称",
        renameDialogCancelBtn: "取消",
        renameDialogConfirmBtn: "重命名",
        selectPlaceholder: "选择一个过期时间",
        "7d": "7天",
        "15d": "15天",
        never: "永久",
        downloadPNG: "下载",
        shareExpireTime: "选择分享有效期",
      },
      welcome: "欢迎使用 Chat Diagram",
      features: {
        title: "特性",
        chat: "通过自然语言描述生成图表",
        charts: "支持多种图表类型",
      },
      payment: {
        membershipPlans: "会员计划",
        membershipPlansDesc: "选择适合您的会员计划，享受更多AI智能服务",
        startingAt: "起价",
        month: "月",
        monthUnit: "个月",
        oneMonth: "1个月",
        threeMonth: "3个月",
        sixMonth: "6个月",
        twelveMonth: "12个月",
        discount: "优惠",
        membershipBenefits: "会员权益",
        unlimitedProjects: "无限项目",
        unlimitedDiagrams: "无限图表",
        unlimitedUsers: "无限用户",
        unlimitedOptimize: "无限优化描述",
        advancedStyle: "高级样式配置",
        unlimitedStorage: "无限存储",
        unlimitedChats: "无限聊天",
        unlimitedGenerations: "无限生成",
        prioritySupport: "优先支持",
        earlyAccess: "提前访问新功能",
        exclusiveEvents: "独家活动",
        exclusiveMerch: "独家商品",
        choosePaymentMethod: "选择支付方式",
        alipay: "支付宝",
        wechat: "微信",
        tradeName: "商品名称",
        tradeNameDetail: "chat-diagram Pro",
        needPay: "需要支付",
        payNow: "立即开通",
        redirecting: "正在跳转到支付...",
        preparingPayment: "请稍候，正在为您准备支付环境...",
        confirmPayment: "正在确认支付结果...",
        confirmPaymentDesc: "请耐心等待，正在处理您的支付",
        paySuccess: "支付成功",
        paySuccessDesc: "感谢您的订购！您的会员权益已经生效",
        payFailed: "支付失败",
        payFailedDesc: "请稍后再试，或联系客服",
        orderNumber: "订单编号",
        amount: "金额",
        membershipDuration: "会员时长",
        membershipBenefitsHasBeenActivated: "会员权益已激活",
        useTipsTitle: "使用提示",
        useTipsDesc:
          "您可以立即开始使用所有会员功能。如需帮助，请随时联系客服。",
        useTipsBtn: "开始使用",
        billings: {
          historyTitle: "账单记录",
          historyDesc: "查看您的所有交易记录和订单详情",
          historyEmptyTitle: "暂无账单记录",
          historyEmptyDesc:
            "您还没有任何交易记录。开始使用我们的服务，账单将会在这里显示。",
          historyEmptyBtn: "查看会员方案",
          helpTips: "如果您有任何问题或需要帮助，请联系我们的客户支持团队。",
          helpInfo: "邮箱: xxxxx@chatdiagram.com | 电话: xxxxx",
          helpInfoEmail: "邮箱：",
          tradeNumber: "订单编号",
          tradePaidAt: "支付时间",
          tradeAmount: "金额",
          tradeStatus: "状态",
          tradeDuration: "计划",
          tradeDetailBtn: "详情",
          tradeDetailTitle: "订单详情",
          dayUnit: "天",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // 默认语言
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    caches: ["localStorage"], // 将语言选择保存到 localStorage
  },
});

export const useI18n = () => {
  const { t } = useTranslation("common");
  return t;
};

export default i18n;
