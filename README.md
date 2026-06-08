# AI 全自动数据分析与视频生成

把数据集放进 `dataset/`，执行一条命令，项目会自动完成从数据分析到视频制作代码生成的完整流程。

> 自动读取数据集 -> 制定分析计划 -> 生成 Notebook -> 输出中文分析报告 -> 生成图表与表格 -> 设计视频分镜 -> 生成两种 Remotion 数据分析视频

如果你想快速把一个数据集变成一份能读、能看、还能做成视频展示的数据分析项目，这个仓库就是为这个场景准备的。

## 项目亮点

- **执行简单**：准备好环境后，只需要运行 `uv run run_codex.py`。
- **全自动链路**：从理解数据、规划分析、执行建模，到写报告、做图表、生成视频代码，全程由 AI 自动推进。
- **报告完整**：自动产出中文数据分析报告，覆盖数据质量、描述性分析、统计检验、预测建模、模型解释、聚类分群和业务建议。
- **图表丰富**：自动生成分布图、热力图、散点图、模型对比图、SHAP 解释图等可直接用于报告的可视化图表。
- **视频可视化**：根据分析报告自动生成 Remotion 视频项目，内置两种风格：
  - `MyComp`：通用数据分析视频，适合报告展示、课程作业、业务汇报。
  - `CyberImpactVideo`：赛博科技风视频，适合技术演示、短视频、项目展示。
- **适合二次开发**：分析流程、Prompt 编排、视频分镜和 Remotion 组件都保留在项目中，方便继续改造成自己的数据分析自动化工具。

## 效果预览

本项目内置了一个 **AI 对岗位与裁员风险的影响** 示例数据集，数据集来源于 Kaggle：

[AI Impact on Jobs and Layoff Risk Dataset](https://www.kaggle.com/datasets/shivasingh4945/ai-impact-on-jobs-and-layoff-risk-dataset)

通过本项目自动生成的数据分析报告可见：

[dataset/ai_impact_jobs_layoff_risk_final_report.md](dataset/ai_impact_jobs_layoff_risk_final_report.md)

通过本项目自动制作的两种风格的数据分析视频示例如下：

[通用风格数据分析视频](output/MyComp.mp4)

[赛博朋克风格数据分析视频](output/CyberImpactVideo.mp4)

## 示例分析样例

仓库自带的示例数据集包含 20,000 条岗位样本。自动分析报告已经覆盖：

- 数据质量检查与缺失值检查
- 行业、岗位、岗位级别、AI 采用等级等维度的风险差异
- 重复性任务比例、自动化比例、AI 使用强度等变量分析
- 卡方检验、Kruskal-Wallis 检验、Spearman 相关分析
- 多分类裁员风险模型与高风险二分类预警模型
- Permutation Importance 与 SHAP 模型解释
- KMeans 聚类分群与业务画像
- 面向业务决策的可操作建议

示例报告中的关键结论包括：

- 高风险行业集中在制造、物流、零售。
- 高风险岗位集中在操作员、生产主管、质量工程师、库存分析师、调度员等流程型岗位。
- AI 采用等级越高，高风险比例越高，但这更可能反映 AI 优先进入可标准化、可自动化场景。
- 重复性任务比例和任务自动化比例是高风险预测中的核心变量。
- 模型结果适合用于风险筛查，不应直接作为裁员决策依据。

## 一分钟上手

### 1. 准备环境

需要的环境和依赖如下，安装由使用者自行完成：

| 环境 | 建议版本 | 用途 |
| --- | --- | --- |
| uv | 最新稳定版 | 管理 Python 环境与依赖 |
| Codex / OpenAI Codex 访问能力 | 可用账号或凭证 | 驱动自动分析与代码生成 |

安装命令示例：

```console
uv sync
```

### 2. 放入你的数据集

把需要分析的数据放到 `dataset/` 目录中。

支持的输入可以是 CSV、Excel、Markdown 等数据资料。结构化数据越清晰，自动分析和图表生成效果通常越好。

示例：

```text
dataset/
  your-dataset.csv
```

### 3. 启动全自动流程

```console
uv run run_codex.py
```

然后就可以把剩下的工作交给 AI。脚本会按顺序自动执行多个任务：

1. 读取 `dataset/` 下的数据文件，生成数据分析计划。
2. 根据计划执行数据分析，生成 Jupyter Notebook。
3. 根据 Notebook 写出完整中文数据分析报告。
4. 生成分析过程中的图表、表格和特征工程数据。
5. 基于报告自动设计两种视频分镜。
6. 根据分镜生成 Remotion 视频代码。

## 自动生成的产物

运行完成后，你会在项目中看到类似下面的结果：

```text
dataset/
  *_analysis_plan.md              # 数据分析计划
  *_analysis.ipynb                # 自动生成的数据分析 Notebook
  *_final_report.md               # 中文数据分析报告
  analysis_outputs/
    figures/                      # 自动生成的数据分析图表
    tables/                       # 自动生成的统计表格和模型结果
    *_feature_engineered.csv      # 特征工程后的数据

visualization/
  remotion_storyboard_design.md                 # 通用风格视频分镜
  remotion_storyboard_design_cyber_impact.md    # 赛博科技风视频分镜

src/
  Composition.tsx                  # 通用数据分析视频
  cyber-impact/                    # 赛博科技风视频
```

## 查看和导出视频

启动 Remotion Studio：

```console
npm run dev
```

打开 Studio 后可以看到两个 Composition：

- `MyComp`：通用数据分析视频
- `CyberImpactVideo`：赛博科技风数据分析视频

如果想直接渲染视频，可以使用：

```console
npx remotion render src/index.ts MyComp out/my-comp.mp4
npx remotion render src/index.ts CyberImpactVideo out/cyber-impact-video.mp4
```


## 为什么值得 Star

这个项目不是只生成一份简单图表，而是把完整的数据分析交付流程串起来：

- 对使用者来说，只需要准备数据和执行命令。
- 对展示来说，可以同时得到报告、图表、表格和视频。
- 对开发者来说，可以继续扩展 Prompt、替换数据集、增加视频风格、接入更多分析模板。

如果这个项目对你有帮助，欢迎点一个 Star。你的 Star 会让我继续把它做成更通用、更稳定、更好看的 AI 数据分析自动化工具。

## 注意事项

- 自动生成结果建议人工复核后再用于正式场景。
- 如果数据涉及裁员、绩效、薪酬、医疗、金融等敏感决策，请务必加入人工审核、公平性评估和合规流程。
- 不同数据集的字段结构差异较大，首次运行后可以根据生成的分析计划和报告继续微调 Prompt。
