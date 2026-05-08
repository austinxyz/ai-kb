---
title: MRC（Multipath Reliable Connection）
category: AI基础设施
tags: [网络协议, RoCE, SRv6, 万卡集群, OpenAI, OCP]
source: "[[raw/ai_native_infra/2026-05-05-unlocking-large-scale-ai-training-networks-with-mrc-multipath-reliable-connectio]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmotzg7v400lmslypclg3a9vo"
  aihot_url: ""
  series: S1_infra
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
MRC（Multipath Reliable Connection）是 OpenAI 联合 AMD、Broadcom、Intel、Microsoft、NVIDIA 共同设计、并通过 Open Compute Project（OCP）开源的下一代 AI 超算网络协议。它在 RoCE（RDMA over Converged Ethernet）基础上叠加 Ultra Ethernet Consortium 的多路径技术与 SRv6 源路由，把同步预训练在万卡集群中遇到的拥塞/链路抖动/路由失败问题压到微秒级恢复。已部署在 OpenAI 所有最大 GB200 超算上（包括 Oracle Cloud Abilene 站点、Microsoft Fairwater），并训练过多个前沿模型。

## 核心要点
- **解决的真实痛点**：同步预训练里 GPU 锁步运转，一次 link flap 或 switch 重启就让全集群 GPU 闲置；规模越大失败频率越高（"failure amplifier"），传统 fabric 重算路由要数秒到十几秒；MRC 把这一段压到微秒级。
- **多平面拓扑（Multi-Plane）**：把每张 800 Gb/s 网卡拆成 8×100 Gb/s 平行链路接 8 台不同交换机，等于建了 8 个独立平面；一台 64×800 Gb/s 的交换机变成 512×100 Gb/s，**仅 2 层交换机即可全互联约 131,000 GPU**，传统 800 Gb/s 单平面网络要 3–4 层。代价低、功耗低、路径冗余高；同时更多流量留在 Tier 0 内。
- **自适应包喷洒（Adaptive Packet Spraying）**：单次传输拆成数百条路径并行；每个 MRC 包带最终内存地址，到达可以乱序但 destination 直接落到正确内存；路径拥塞 → 切换到另一条；丢包 → 立即下线该路径并重传，再发探测包确认是否恢复。
- **包修剪（Packet Trimming）**：destination 拥塞时交换机不丢整包，剥掉 payload 只转发 header 触发显式重传，避免把"拥塞丢包"误判为"路径故障"。
- **SRv6 静态源路由替代 BGP**：发送方把交换机标识序列直接编进包目的地址；交换机匹配自己 ID 后右移地址露出下一跳，对照**配置时一次性写入、运行时不变**的静态路由表转发。整个网络去掉动态路由协议，消除一类"路由协议在边缘场景误算"的失败模式。
- **生产实测**：tier-0↔tier-1 每分钟多次 link flap，对同步预训练**无可测量的吞吐损失**，运维不再需要紧急修；训练某前沿模型期间重启了 4 台 tier-1 交换机也没和训练团队协调。8 端口网卡丢 1 端口只把上限降到 7/8，而非崩溃整 job——MRC 探测到后立刻重算并通知 peer 不要往这个 plane 发，故障恢复后再启用。
- **三项可量化优势**：① 用 2 层 Ethernet 交换机搭 10 万+ GPU 集群（vs 3–4 层 800 Gb/s）→ 省功耗、省零件、降故障面；② 包喷洒后**核心网络几乎无拥塞**，多 job 共享集群也互不影响；③ SRv6 静态控制面把"路由协议出错导致连不通"整类故障消除。
- **同行可复用**：OCP 规范公开（[OCP-MRC 1.0 PDF](https://www.opencompute.org/documents/ocp-mrc-1-0-pdf)），并发表论文 *Resilient AI Supercomputer Networking using MRC and SRv6*；NVIDIA、Broadcom、Arista、Microsoft Azure、OCI 都已参与部署。

## 与其他概念的关系
- [[wiki/AI基础设施/GPU冷启动-Peer权重传输|GPU 冷启动与 Peer 权重传输]]：同属"用网络物理层把训练/推理瓶颈压到秒/微秒级"案例集；NCCLBack 解决 GPU 启动后第一步的下载，MRC 解决训练每一步上百万次跨 GPU 传输。
- [[wiki/AI基础设施/vLLM-V1迁移|vLLM V0→V1 迁移]]：另一类大规模在线训练里的"被忽视的运行时正确性问题"——vLLM 关心的是 inference engine cache 的一致性，MRC 关心的是网络包路径与失败语义。两者都体现：万卡规模下边缘失败概率不再可忽略，需在协议层做出对称设计。
- [[wiki/AI基础设施/MCP|MCP（模型上下文协议）]]：相隔很远的两类标准，但同样反映"AI 行业开始把基础设施规范化、捐给中立组织（OCP / Linux 基金会）以扩大生态"的趋势。

## 参考来源
- [[raw/ai_native_infra/2026-05-05-unlocking-large-scale-ai-training-networks-with-mrc-multipath-reliable-connectio|Unlocking large scale AI training networks with MRC]]
