# 配图库

所有配图放在 `public/images/`，16:9，抽象、科技感，整体偏冷色，可以有少量暖色点缀，和页面放在一起要和谐。

规则：
- 每个主题（key）用一张独有的图，中英文同主题共用一张。构建脚本会检查，不同主题共用同一张图会直接报错。
- 新文章优先从下表“未使用”的图里挑最贴合的；挑完把这一行的“使用者”改成文章的 key。
- 没有未使用的图时，用 `python3 tools/gen_image.py public/images/<文件名>.jpg --style <nodes|flow|rings|wave|bars> --seed <文章 key> --tint <blue|teal|violet|amber>` 生成一张，并在下表登记，画面描述前写“（代码生成）”。
- 替换配图时必须用新文件名，不要覆盖旧文件，否则浏览器和 CDN 缓存会继续显示旧图。
- 每周的生图任务会往这里补充新的未使用图片。

| 文件 | 画面 | 使用者 |
| --- | --- | --- |
| ai-agents-privacy.jpg | 手机上方悬浮的扫描光圈，像机械眼 | ai-agents-screen-privacy |
| ai-troubleshoot-prompts.jpg | （代码生成）紫色调光流在中心汇聚 | ai-troubleshoot-prompts |
| black-friday-deals.jpg | 线框价签与玻璃卡片在暗处翻落 | black-friday-vpn-deals-guide |
| china-travel.jpg | 夜间飞机舷窗俯瞰城市灯光网格与连接弧线 | china-travel-internet |
| choose-vpn.jpg | 光点沿多条发光路径汇聚成一条亮线，低机位 | how-to-choose-vpn |
| dns-leak.jpg | 玻璃管裂缝渗出一线光，光点洒落 | dns-leak |
| free-vs-paid.jpg | 由粒子组成的半透明锁，右侧消散成尘埃 | free-vs-paid-vpn |
| how-vpn-works.jpg | 同心光环构成的隧道，光点在其中穿行 | how-vpn-works |
| internet-disruptions.jpg | 点阵世界地图，部分区域熄灭、连线断裂 | internet-disruptions-q3-2026 |
| meta-gallery-fine.jpg | 玻璃方块内的照片缩略图被橙色激光扫描 | meta-gallery-fine-italy |
| microsoft-365-outage.jpg | 倾斜的邮件图标墙，一片片熄灭成噪点 | microsoft-365-outage-nov-2026 |
| patch-tuesday-vpn.jpg | 电路板裂纹上覆盖盾形光斑 | patch-tuesday-vpn-nov-2026 |
| public-wifi.jpg | 深夜机场候机厅，虚化光斑与淡淡 Wi‑Fi 弧线 | public-wifi-safety |
| smart-vs-global.jpg | 光束射入棱镜节点，分成两道，下方线框网格 | smart-vs-global-mode |
| troubleshooting-fiber.jpg | 一束发光光纤中间断裂，断口有暖色火花 | vpn-troubleshooting |
| vpn-extension-ai-prompts.jpg | 模糊的聊天气泡从浏览器窗口涌出，汇入一束光 | free-vpn-extension-ai-prompts |
| vpn-protocols.jpg | 三条质感不同的光轨延伸向消失点 | vpn-protocols |
