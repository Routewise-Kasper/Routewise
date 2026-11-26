---
title: 意大利罚 Meta 8.05 亿欧元：一个相册权限引出的隐私问题
description: 意大利数据保护机构认定，Facebook 安卓版用一个笼统的相册权限读取了用户的照片、视频和元数据，没有取得专门的同意。罚单背后，是手机权限“一次授权、多处使用”的老问题。
date: 2026-11-17
section: news
category: security
key: meta-gallery-fine-italy
image: /images/meta-gallery-fine.jpg
sources:
  - title: The Next Web — Italy fines Meta €805m over Facebook's access to Android photos
    url: https://thenextweb.com/news/italy-fines-meta-805m-facebook-android-photos
  - title: CyberInsider — Italy fines Meta €805 million over Facebook gallery access
    url: https://cyberinsider.com/?p=348412
  - title: CTV News — Italy fines Meta for using Android gallery photos and videos on Facebook
    url: https://www.ctvnews.ca/sci-tech/article/italy-fines-meta-us887-for-using-android-gallery-photos-and-videos-on-facebook/
faq:
  - q: 中国用户的 Facebook 也受影响吗？
    a: 这次处罚只针对意大利用户，罚款和整改要求由意大利监管机构作出。不过“一个权限覆盖多个功能”的做法在很多 App 里都存在，值得所有人检查一下自己的权限设置。
  - q: Meta 怎么回应？
    a: 据报道，Meta 认为罚款不成比例，并表示打算上诉。截至目前这一决定仍可能在法律程序中被改变。
---

11 月 14 日，意大利数据保护机构 Garante 宣布对 Meta Platforms Ireland 处以 8.05 亿欧元罚款，约合 8.87 亿美元。理由是 Facebook 的安卓 App 在没有取得专门、知情同意的情况下，访问了用户手机相册里的照片、视频和相关元数据。

## 发生了什么

问题出在 Facebook 安卓版的一个功能：浏览 Facebook 时，从手机相册里推荐可以发布的照片。

据多家媒体援引 Garante 的决定，调查发现 Facebook 用**一个**安卓系统权限去访问相册，而这个权限同时服务于 App 里多个不同用途的功能。用户看到的是一个关于“访问照片”的通用提示，提示里并没有说明这些照片会被用来生成发帖建议。监管机构认为，这样的授权不构成有效同意。

另外，这个推荐功能是默认开启的。

## 罚款怎么算出来的

Garante 表示，罚款金额约占 Meta 集团全球营收的 0.47%。计算时考虑了涉及的用户规模：意大利约有 2000 万安卓用户。需要说明的是，这个数字是监管机构用来衡量影响范围的依据，并不等于确认了 2000 万人的相册都被实际读取过。

报道还提到，监管机构在决定中考虑了 2019 年对 Meta 的一项处罚，以及它认为 Meta 在调查中配合不足。

## Meta 需要做什么

Meta 被要求在 60 天内整改：这个相册推荐功能要默认关闭，即使用户以前已经给过相册权限也一样；如果要重新启用，必须单独、明确地请求同意，说清楚它会访问相册、用来做什么，以及怎么关掉。

据报道，Meta 认为罚款不成比例，打算提起上诉。

## 这件事和普通用户有什么关系

这张罚单针对的是意大利，但它揭示的问题很普遍：**手机上的一个权限，往往不只用于你以为的那个功能。**

你给某个 App 开了相册权限，可能只是为了发一张头像。但在技术上，这个权限一旦给出，App 里任何需要相册的功能都可以使用它。安卓和 iOS 近几年都在往“更细的权限”方向改，比如只允许访问选中的几张照片，就是为了缓解这个问题。

## 现在可以做的检查

**看看谁有相册权限。** 安卓一般在“设置 → 应用 → 选择 App → 权限 → 照片和视频”；iPhone 在“设置 → 隐私与安全性 → 照片”，可以逐个 App 查看。

**能选“部分照片”就别给全部。** iPhone 可以设为“受限访问”，只开放你选中的照片；较新的安卓版本也提供了类似选项。

**关掉用不上的推荐功能。** 社交 App 里“从相册推荐”“回忆”这类功能，如果你不需要，直接在 App 设置里关闭。

关于手机上的另一类隐私风险，也就是 AI 代理读取屏幕内容，可以看 [Signal 和苹果同一周收紧权限](/news/ai-agents-screen-privacy/)。
