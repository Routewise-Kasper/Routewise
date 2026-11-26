// Routewise 站点配置。换正式域名时只需改 SITE_URL。
export const SITE_URL = 'https://routewise.pages.dev';
export const BRAND = 'Routewise';

// 短链：/go/<key> → 目标地址。换成带渠道追踪的链接时只改这里。
export const GO_LINKS = {
  hifast: 'https://hifastvpn.com/?utm_source=routewise&utm_medium=referral&utm_campaign=seo',
};

export const LANGS = {
  zh: {
    code: 'zh-CN',
    prefix: '',
    name: '简体中文',
    tagline: '把网络这件事，讲清楚。',
    description: 'Routewise 是一份写给普通人的网络使用指南：跨境上网、VPN 选择、连接排错与隐私设置，用通俗的话讲清楚。',
    nav: { home: '首页', guides: '全部指南', about: '关于', disclosure: '合作披露' },
    latest: '最新指南',
    readMore: '阅读全文',
    minRead: '分钟阅读',
    updated: '更新于',
    related: '继续阅读',
    disclosureNote: '本文含合作推广链接。通过链接购买时我们可能获得佣金，这不会增加你的费用。',
    disclosureMore: '了解更多',
    footerAbout: '一份写给普通人的网络使用指南。',
    footerTeam: '由 Routewise Team 编写与维护',
    toc: '本文目录',
    switchLang: 'English',
    categories: { basics: '入门', howto: '教程', troubleshooting: '排错', privacy: '隐私', travel: '出行' },
    allGuides: '全部指南',
    notFound: '页面不存在',
    notFoundBody: '这条路好像走不通。回到首页看看其他指南吧。',
    backHome: '回到首页',
    faq: '常见问题',
  },
  en: {
    code: 'en',
    prefix: '/en',
    name: 'English',
    tagline: 'Internet access, explained plainly.',
    description: 'Routewise is a plain-language guide to getting online across borders: choosing a VPN, fixing connection problems, travel prep and everyday privacy.',
    nav: { home: 'Home', guides: 'All guides', about: 'About', disclosure: 'Disclosure' },
    latest: 'Latest guides',
    readMore: 'Read the guide',
    minRead: 'min read',
    updated: 'Updated',
    related: 'Keep reading',
    disclosureNote: 'This article contains affiliate links. We may earn a commission if you buy through them, at no extra cost to you.',
    disclosureMore: 'Learn more',
    footerAbout: 'A plain-language guide to getting online.',
    footerTeam: 'Written and maintained by the Routewise Team',
    toc: 'On this page',
    switchLang: '简体中文',
    categories: { basics: 'Basics', howto: 'How-to', troubleshooting: 'Troubleshooting', privacy: 'Privacy', travel: 'Travel' },
    allGuides: 'All guides',
    notFound: 'Page not found',
    notFoundBody: 'This route seems to be a dead end. Head back home for other guides.',
    backHome: 'Back to home',
    faq: 'FAQ',
  },
};
