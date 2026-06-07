# AI 对岗位与裁员风险影响视频分镜设计

## 1. 视频定位

本视频基于 `dataset/ai_impact_jobs_layoff_risk_final_report.md` 的分析结果制作，建议定位为数据解释型短视频。

- 视频主题：AI 影响裁员风险的关键并不是“是否使用 AI”，而是岗位任务结构是否容易被自动化。
- 建议时长：约 90 到 145 秒。
- 建议比例：16:9。
- 建议分辨率：1280 x 720。
- 建议帧率：30 fps。
- 视觉风格：企业分析报告风格，深色背景，克制高亮，数据图形动效为主。

## 2. 整体叙事结构

1. 从 20,000 条岗位样本进入，建立数据可信度。
2. 展示裁员风险三类基本均衡。
3. 找出高风险行业和岗位。
4. 解释 AI 采用、岗位级别、重复性任务、自动化比例的叠加效应。
5. 用模型结果和解释性分析说明关键变量。
6. 落到业务建议：筛查、重设计、转型路径、人工复核。

核心观点：

> AI 对岗位裁员风险的影响主要通过任务结构和自动化暴露体现。高重复性、高自动化、高 AI 使用强度、低创造力要求、低岗位级别构成最典型的高风险画像。

## 3. 分镜设计

| 时间 | 镜头 | 画面设计 | 关键文案 |
|---:|---|---|---|
| 0-6s | 片头 | 深色网格背景，20,000 个点阵快速汇聚成标题；右侧出现 Low / Medium / High 三色图例。 | AI 对岗位与裁员风险的影响 |
| 6-13s | 数据概况 | 数字卡片依次入场：20,000 样本、16 字段、0 缺失、0 重复；底部标注报告日期 2026-06-07。 | 数据质量良好，可直接建模 |
| 13-21s | 风险分布 | 三段环形图或横向堆叠条：Low 33.0%、Medium 33.0%、High 34.0%，三段几乎等宽。 | 风险等级分布基本均衡 |
| 21-33s | 高风险行业 | 横向柱状图从左侧增长：Manufacturing 48.2%、Logistics 41.5%、Retail 40.7%；前三名用红橙色突出。 | 高风险集中在流程标准化行业 |
| 33-43s | 高风险岗位 | 岗位列表卡片按风险排序滑入：Operator 50.2%、Production Supervisor 48.3%、Quality Engineer 46.0%、Inventory Analyst 44.6%、Dispatcher 42.1%。 | 运营与流程岗位更容易暴露 |
| 43-54s | AI 采用等级 | 三列对比图：Low AI 高风险 9.2%、Medium 58.2%、High 80.8%；High 列高度冲到顶部。 | AI 高采用场景中，高风险比例显著升高 |
| 54-64s | 岗位级别保护 | Entry / Mid / Senior 阶梯图：44.5%、30.7%、11.5%；Senior 旁添加“保护缓冲”标签。 | 岗位级别越高，风险越低 |
| 64-75s | 核心交叉热力图 | 复刻 `routine_automation_high_risk_heatmap.png`：横轴自动化比例，纵轴重复性任务比例，右上角 94.9% 发光强调。 | 高重复性 + 高自动化 = 最高风险画像 |
| 75-84s | 保护因素 | 创造力、人际互动、岗位级别、教育、经验五个盾牌或指标条；创造力要求从 23.8 到 71.9 的对比动画。 | 创造力和复杂判断是最强保护因素 |
| 84-96s | 模型表现 | 模型排行榜：Logistic Regression 多分类 Accuracy 0.962；二分类 High Recall 0.982、PR-AUC 0.997。 | 模型适合用于高风险筛查 |
| 96-108s | 模型解释 | SHAP 或特征重要性条形图：Routine Task、Tasks Automated、Job Level、Protection Index 依次展开。 | 关键不是行业标签，而是任务结构 |
| 108-120s | 聚类画像 | 两个群体对照：Cluster 0 高风险 62.8%，Cluster 1 高风险 8.9%；左右分屏表示“高自动化暴露”与“高保护能力”。 | 风险来自任务结构、AI 强度与保护能力的组合 |
| 120-135s | 业务建议 | 四步流程横向时间线：识别高风险岗位、业务复核、培训与岗位重设计、持续更新模型。 | 模型用于筛查，而不是直接决策 |
| 135-145s | 结尾 | 标题回归，背景点阵从红橙逐渐转为蓝绿；保留一句结论。 | 不是简单替代，而是重新设计岗位价值 |

## 4. 画面风格

### 4.1 色彩

建议使用以下色彩体系：

| 用途 | 颜色 |
|---|---|
| 背景主色 | `#0B1020` |
| 背景辅助 | `#111827` |
| 高风险 | `#F97316` / `#EF4444` |
| 中风险 | `#FACC15` |
| 低风险 | `#22C55E` |
| 信息蓝 | `#38BDF8` |
| 文字主色 | `#F8FAFC` |
| 次级文字 | `#94A3B8` |

### 4.2 图形语言

- 风险分布：使用横向堆叠条或环形图。
- 行业、岗位、模型指标：使用横向柱状图。
- 交叉变量：使用热力图。
- 保护因素：使用盾牌式指标条或反向柱状图。
- 聚类画像：使用左右对照卡片，不建议直接把 PCA 图作为主画面。

### 4.3 动效原则

- 所有动画应使用 Remotion 的 `useCurrentFrame()`、`interpolate()` 和 `Easing` 实现。
- 避免 CSS transitions 或 CSS animations。
- 数字指标使用递增计数动画。
- 柱状图使用宽度增长动画。
- 热力图使用单元格渐入和关键单元格高亮动画。
- 场景切换以淡入、轻微位移、遮罩滑动为主，避免过度炫技。

## 5. 关键数据点

### 5.1 数据概况

- 样本量：20,000。
- 字段数：16。
- 缺失值总数：0。
- 重复记录：0。
- 目标变量：`Layoff_Risk`，包含 `Low`、`Medium`、`High` 三类。

### 5.2 风险分布

| 风险等级 | 占比 |
|---|---:|
| Low | 33.0% |
| Medium | 33.0% |
| High | 34.0% |

### 5.3 高风险行业

| 行业 | 高风险比例 |
|---|---:|
| Manufacturing | 48.2% |
| Logistics | 41.5% |
| Retail | 40.7% |
| Finance | 37.7% |
| Telecom | 35.2% |
| IT | 28.0% |
| Healthcare | 20.8% |
| Education | 20.1% |

### 5.4 高风险岗位

| 岗位 | 高风险比例 |
|---|---:|
| Operator | 50.2% |
| Production Supervisor | 48.3% |
| Quality Engineer | 46.0% |
| Inventory Analyst | 44.6% |
| Dispatcher | 42.1% |

### 5.5 AI 采用等级与高风险比例

| AI 采用等级 | 高风险比例 |
|---|---:|
| High | 80.8% |
| Medium | 58.2% |
| Low | 9.2% |

### 5.6 岗位级别与高风险比例

| 岗位级别 | 高风险比例 |
|---|---:|
| Entry | 44.5% |
| Mid | 30.7% |
| Senior | 11.5% |

### 5.7 重复性任务与自动化比例叠加

| 重复性任务区间 | 自动化比例区间 | 高风险比例 |
|---|---|---:|
| 0-25 | 0-25 | 0.0% |
| 51-75 | 51-75 | 66.2% |
| 76-100 | 26-50 | 72.1% |
| 76-100 | 51-75 | 85.5% |
| 76-100 | 76-100 | 94.9% |

### 5.8 模型表现

- 最佳多分类模型：Logistic Regression。
- 多分类 Accuracy：0.962。
- 多分类 Macro F1：0.962。
- 最佳二分类高风险预警模型：Logistic Regression。
- High Recall：0.982。
- PR-AUC：0.997。

### 5.9 模型解释重点

重要特征包括：

- `Routine_Task_Percentage`
- `Tasks_Automated_Percentage`
- `Job_Level_Score`
- `Industry`
- `Education_Score`
- `Human_Creative_Protection_Index`
- `Automation_Exposure_Index`
- `Creativity_Requirement`

### 5.10 聚类画像

| Cluster | 样本数 | 高风险比例 | 画像 |
|---:|---:|---:|---|
| 0 | 9,307 | 62.8% | 高自动化暴露、低创造力互动保护、高 AI 使用强度 |
| 1 | 10,693 | 8.9% | 低自动化暴露、高创造力互动保护、低 AI 使用强度 |

## 6. Remotion 实现建议

### 6.1 推荐组件拆分

建议将视频拆成以下场景组件：

- `TitleScene`
- `MetricCardsScene`
- `RiskDistributionScene`
- `RankedBarScene`
- `AiAdoptionScene`
- `JobLevelProtectionScene`
- `HeatmapScene`
- `ProtectionFactorsScene`
- `ModelPerformanceScene`
- `FeatureImportanceScene`
- `ClusterScene`
- `RecommendationTimelineScene`
- `ClosingScene`

### 6.2 时间轴建议

如果采用 145 秒版本，30 fps 下总帧数为：

```txt
145 * 30 = 4350 frames
```

`src/Root.tsx` 中的 `durationInFrames` 建议设置为 `4350`。

如果采用 90 秒版本，30 fps 下总帧数为：

```txt
90 * 30 = 2700 frames
```

### 6.3 图表资源使用

报告中提到的图表实际位于：

```txt
dataset/analysis_outputs/figures/
```

可直接复用的图片：

- `target_distribution.png`
- `high_risk_rates_industry_role.png`
- `routine_automation_high_risk_heatmap.png`
- `shap_high_risk_bar.png`
- `cluster_pca_scatter.png`

建议复制到 Remotion 的 `public/figures/` 后，通过 `staticFile()` 引用。

示例：

```tsx
import { Img, staticFile } from "remotion";

export const FigureImage = () => {
  return (
    <Img
      src={staticFile("figures/routine_automation_high_risk_heatmap.png")}
      style={{ width: 960, height: "auto" }}
    />
  );
};
```

更适合用 Remotion 原生图形重画的画面：

- 风险三分类分布。
- 高风险行业排行榜。
- 高风险岗位排行榜。
- AI 采用等级对比。
- 岗位级别保护阶梯。
- 业务建议时间线。

### 6.4 代码动画原则

使用 `useCurrentFrame()` 和 `interpolate()` 控制动画。

```tsx
import { Easing, interpolate, useCurrentFrame } from "remotion";

export const AnimatedBar = ({ value }: { value: number }) => {
  const frame = useCurrentFrame();

  const width = interpolate(frame, [0, 30], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        width: `${width}%`,
        height: 18,
        background: "#F97316",
        borderRadius: 6,
      }}
    />
  );
};
```

## 7. 业务建议镜头内容

结尾建议用四步流程表达模型应用边界：

1. 模型识别潜在高风险岗位。
2. 业务部门复核岗位实际职责和近期组织变化。
3. HR 与管理者评估培训、转岗、岗位重设计可能性。
4. 定期更新数据和模型，监测风险变化。

需要强调：

- 模型适合用于高风险筛查。
- 模型结果不应直接作为裁员依据。
- 干预重点不是简单增加 AI 培训，而是岗位重设计、能力迁移和 AI 协同流程改造。

## 8. 环境与依赖

当前项目已包含 Remotion 项目配置。建议环境和安装命令如下：

```bash
node --version
npm install
npm run dev
```

依赖版本以项目 `package.json` 为准：

- `remotion`: `4.0.473`
- `@remotion/cli`: `4.0.473`
- `react`: `19.2.3`
- `react-dom`: `19.2.3`
- `typescript`: `5.9.3`

