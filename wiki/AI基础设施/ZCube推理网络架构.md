---
title: ZCube 推理网络架构
category: AI基础设施
tags: [推理网络, PD分离, 组网架构, 扁平拓扑, 智谱, SIGCOMM2025]
source: "[[raw/ai_native_infra/刚刚，智谱发布AI Infra新成果：ZCube重构大模型推理网络]]"
updated: 2026-05-20
status: stable
---

## 定义

ZCube 是智谱 AI、驭驯网络与清华大学联合提出的全扁平化 GPU 推理网络架构，专为 PD 分离推理场景设计，通过消除 Spine 层交换机 + 完全二部图互联，从架构层面消除结构性网络拥塞，在降低 1/3 交换机成本的同时提升推理吞吐与尾时延。发表于 ACM SIGCOMM 2025。

## 核心要点

**问题根源：ROFT 在 PD 分离场景的结构性失效**
- PD 分离使 KV Cache 跨节点传输呈现源-目的不对称性，不同 GPU/网卡负载差异显著
- 传统 ROFT（Rail-Optimized Fat-Tree）的静态 rail 映射把流量集中到少数 Leaf 交换机，形成热点
- 热点 Leaf 的出口队列频繁触发 PFC 反压，造成"总带宽宽裕、局部频繁拥塞"的结构性问题
- 实验验证：网络带宽从 100 Gbps 升至 200 Gbps，推理吞吐提升约 19%，TTFT 下降约 22%——网络已是推理瓶颈

**ZCube 架构设计**
- 取消 Spine 层交换机（对比 Clos 减少 1/3 交换机和光模块）
- Leaf 交换机按奇偶编号分为两组，两组之间以完全二部图方式全互联
- 每块 GPU 的双端口网卡：端口 1 以**单轨**方式接奇数组交换机（连续 GPU 编号），端口 2 以**多轨**方式接偶数组交换机（相同编号 GPU）
- 单/多轨混合接入使 AllReduce（训练）和不对称 KV Cache 传输（推理）均能实现全网负载均衡
- 任意两 GPU 只有一条最优路径（无多路径冲突），网络直径 2 跳

**规模与成本**
- 51.2T 交换机（128×400 Gbps 端口）可构建 16384 块 400 Gbps 网卡的 ZCube 网络
- 可扩展至数万至数十万 GPU
- 万卡集群节省网络硬件投资约 2.1～6.4 亿元

**生产实测（GLM-5.1 coding 千卡集群，ROFT→ZCube 升级）**
- GPU 平均推理吞吐提升 **+15%**
- TTFT P99 降低 **-40.6%**
- 交换机+光模块 CAPEX 降低 **-33%**
- GPU、软件栈、模型、应用保持不变，纯架构升级

**部署工程**：驭驯网络团队开发了 ZCube 控制器、机房布局设计工具和连线正确性检测程序，实现配置自动生成与批量下发，解决取消 Spine 层后 IP 编址/路由策略/布线全部需要重设计的挑战。

## 与其他概念的关系

- [[wiki/AI基础设施/MRC-超算网络协议|MRC]]：OpenAI×AMD 等联合提出的超算网络协议，走多平面拓扑 + 包喷洒 + SRv6 路线；ZCube 走扁平化拓扑 + 精确负载均衡路线，两者均是下一代 AI 超算网络方向
- [[wiki/AI基础设施/vLLM-V1迁移|vLLM]]：推理框架层；ZCube 在网络层释放的吞吐收益需要推理框架层（如 vLLM）的 PD 分离架构配合才能充分利用
- [[wiki/AI基础设施/自适应并行推理-APR|APR]]：自适应并行推理；网络带宽是 APR 多线程并行的基础设施前提，ZCube 的低延迟高吞吐网络是 APR 等高级推理范式的基础
- [[wiki/AI基础设施/GPU冷启动-Peer权重传输|GPU 冷启动 Peer 权重传输]]：Runway 的 GPU 互联加速权重传输；同属"让 GPU 互联网络成为推理一等公民"方向

## 参考来源

- [[raw/ai_native_infra/刚刚，智谱发布AI Infra新成果：ZCube重构大模型推理网络|智谱 ZCube 发布原文]]
- Blog 原文：https://z.ai/blog/zcube
- 论文：Yan et al., "From ATOP to ZCube: Automated topology optimization pipeline and a highly cost-effective network topology for large model training." ACM SIGCOMM 2025, pp. 861-881.
