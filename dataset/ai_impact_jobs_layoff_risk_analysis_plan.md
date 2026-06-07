# AI 对岗位与裁员风险影响数据集分析计划

## 1. 数据集概况

文件：`ai-impact-jobs-layoff-risk-dataset.csv`

数据规模：

- 样本量：约 20,000 条
- 字段数：16 个
- 目标变量：`Layoff_Risk`
- 目标类别：`Low`、`Medium`、`High`

初步观察：

- 数据无缺失值。
- `Layoff_Risk` 三类分布较均衡，适合进行多分类建模。
- 字段覆盖人口背景、职业属性、任务特征、AI 使用情况和裁员风险，适合做描述分析、交叉分析、预测建模和人群分层。

## 2. 核心分析目标

1. 识别影响裁员风险的关键因素。
2. 比较不同行业、岗位、公司规模、岗位级别的裁员风险差异。
3. 分析 AI 采用程度、AI 使用强度、任务自动化比例与裁员风险之间的关系。
4. 挖掘典型高风险岗位画像。
5. 构建裁员风险预测模型。
6. 通过模型解释方法识别最重要的风险驱动因素。
7. 形成可操作的岗位转型、培训和风险预警建议。

## 3. 字段分组

### 3.1 人口与职业背景

- `Age`：年龄
- `Education_Level`：教育水平
- `Years_of_Experience`：工作经验年限

### 3.2 岗位与组织特征

- `Industry`：行业
- `Job_Role`：岗位角色
- `Company_Size`：公司规模
- `Job_Level`：岗位级别

### 3.3 工作任务属性

- `Routine_Task_Percentage`：重复性任务比例
- `Creativity_Requirement`：创造力要求
- `Human_Interaction_Level`：人际互动水平

### 3.4 AI 使用与自动化特征

- `AI_Adoption_Level`：AI 采用等级
- `Number_of_AI_Tools_Used`：使用的 AI 工具数量
- `AI_Usage_Hours_Per_Week`：每周 AI 使用小时数
- `Tasks_Automated_Percentage`：任务自动化比例
- `AI_Training_Hours`：AI 培训小时数

### 3.5 目标变量

- `Layoff_Risk`：裁员风险等级

## 4. 第一阶段：数据质量检查

### 4.1 字段类型检查

确认每个字段的数据类型是否合理：

- 数值型字段：年龄、经验年限、任务比例、AI 使用小时数、AI 培训小时数等。
- 类别型字段：教育水平、行业、岗位、公司规模、岗位级别、AI 采用等级、裁员风险。

### 4.2 缺失值检查

检查每个字段是否存在缺失值，并统计缺失比例。

当前初步结果显示无缺失值，但仍建议在正式分析脚本中保留该检查步骤。

### 4.3 异常值检查

重点检查：

- `Age` 是否处于合理工作年龄范围。
- `Years_of_Experience` 是否与年龄逻辑冲突。
- `Routine_Task_Percentage` 是否在 0 到 100 范围。
- `Tasks_Automated_Percentage` 是否在 0 到 100 范围。
- `AI_Usage_Hours_Per_Week` 是否存在极端值。
- `AI_Training_Hours` 是否存在异常高值。

### 4.4 类别一致性检查

检查以下字段是否只有预期类别：

- `Education_Level`
- `Industry`
- `Company_Size`
- `Job_Level`
- `AI_Adoption_Level`
- `Layoff_Risk`

### 4.5 重复记录检查

检查是否存在完全重复记录。

如果存在重复记录，需要判断是合理重复样本还是数据生成/采集过程中的重复问题。

## 5. 第二阶段：描述性分析

### 5.1 数值变量分布

对以下字段计算均值、中位数、标准差、最小值、最大值、四分位数，并绘制分布图：

- `Age`
- `Years_of_Experience`
- `Routine_Task_Percentage`
- `Creativity_Requirement`
- `Human_Interaction_Level`
- `Number_of_AI_Tools_Used`
- `AI_Usage_Hours_Per_Week`
- `Tasks_Automated_Percentage`
- `AI_Training_Hours`

### 5.2 类别变量分布

统计以下字段的频数和占比：

- `Education_Level`
- `Industry`
- `Job_Role`
- `Company_Size`
- `Job_Level`
- `AI_Adoption_Level`
- `Layoff_Risk`

### 5.3 目标变量分布

分析 `Layoff_Risk` 的类别分布。

重点关注：

- 三类是否均衡。
- 是否需要类别不平衡处理。
- 高风险样本占比是否足够支撑建模。

## 6. 第三阶段：单变量与裁员风险关系分析

### 6.1 行业与裁员风险

分析不同行业中 `Low`、`Medium`、`High` 风险的占比。

初步观察显示：

- `Manufacturing`、`Logistics`、`Retail` 的高风险比例较高。
- `Education`、`Healthcare` 的低风险比例较高。

### 6.2 岗位与裁员风险

分析不同 `Job_Role` 的裁员风险分布。

初步观察显示：

- 风险偏高岗位包括：`Operator`、`Production Supervisor`、`Quality Engineer`、`Inventory Analyst`。
- 风险偏低岗位包括：`Teacher`、`Nurse`、`Research Assistant`。

### 6.3 岗位级别与裁员风险

分析 `Job_Level` 与 `Layoff_Risk` 的关系。

重点关注：

- 初级岗位是否明显更容易处于高风险。
- 高级岗位是否具有更强的风险缓冲作用。

### 6.4 AI 采用等级与裁员风险

分析 `AI_Adoption_Level` 与 `Layoff_Risk` 的关系。

初步观察显示：

- `AI_Adoption_Level = High` 的样本中，高风险比例明显更高。
- `AI_Adoption_Level = Low` 的样本中，低风险比例明显更高。

### 6.5 教育水平与裁员风险

分析不同教育水平下的风险差异。

重点关注：

- 教育水平越高，是否整体裁员风险越低。
- 高中、本科、硕士、博士之间是否存在明显风险梯度。

### 6.6 数值变量与裁员风险

对不同风险等级下的数值变量进行比较。

重点字段：

- `Routine_Task_Percentage`
- `Creativity_Requirement`
- `Human_Interaction_Level`
- `AI_Usage_Hours_Per_Week`
- `Tasks_Automated_Percentage`
- `AI_Training_Hours`

## 7. 第四阶段：多变量交叉分析

### 7.1 行业、岗位与裁员风险

分析 `Industry × Job_Role × Layoff_Risk`。

目的：

- 找出每个行业内部风险最高的岗位。
- 避免只看行业平均水平而忽略岗位结构差异。

### 7.2 岗位级别、AI 采用等级与裁员风险

分析 `Job_Level × AI_Adoption_Level × Layoff_Risk`。

目的：

- 判断高 AI 采用环境下，初级、中级、高级岗位风险是否不同。
- 识别最容易受到 AI 替代压力影响的人群。

### 7.3 重复性任务、自动化比例与裁员风险

分析 `Routine_Task_Percentage × Tasks_Automated_Percentage × Layoff_Risk`。

目的：

- 验证高重复性任务是否更容易被自动化。
- 判断自动化比例是否直接推高裁员风险。

### 7.4 创造力、人际互动与裁员风险

分析 `Creativity_Requirement × Human_Interaction_Level × Layoff_Risk`。

目的：

- 判断创造力要求是否具有保护作用。
- 判断人际互动水平是否降低被自动化替代的风险。

### 7.5 AI 培训与裁员风险

分析 `AI_Training_Hours × Layoff_Risk`。

目的：

- 判断 AI 培训是否可能降低裁员风险。
- 区分“培训带来保护作用”和“高风险岗位接受更多培训”这两种解释。

## 8. 第五阶段：特征工程

### 8.1 自动化暴露指数

构造 `Automation_Exposure_Index`。

可综合以下字段：

- `Routine_Task_Percentage`
- `Tasks_Automated_Percentage`
- `AI_Adoption_Level`
- `Number_of_AI_Tools_Used`

用途：

- 衡量岗位暴露于 AI 自动化的程度。
- 用于风险排序、建模和分群。

### 8.2 人类能力保护指数

构造 `Human_Creative_Protection_Index`。

可综合以下字段：

- `Creativity_Requirement`
- `Human_Interaction_Level`

用途：

- 衡量岗位因创造力和人际互动带来的抗替代能力。

### 8.3 AI 使用强度指数

构造 `AI_Intensity_Index`。

可综合以下字段：

- `AI_Adoption_Level`
- `Number_of_AI_Tools_Used`
- `AI_Usage_Hours_Per_Week`

用途：

- 衡量员工或岗位环境中的 AI 使用强度。

### 8.4 经验分组

构造 `Experience_Band`：

- `0-3` 年
- `4-7` 年
- `8-15` 年
- `15+` 年

用途：

- 便于分析不同经验阶段的风险差异。

### 8.5 年龄分组

构造 `Age_Band`：

- `21-30`
- `31-40`
- `41-50`
- `51-60`

用途：

- 便于做群体比较。
- 降低年龄作为连续变量时解释难度。

### 8.6 二分类风险目标

构造 `Risk_Binary`：

- `High`：高风险
- `Not_High`：中低风险

用途：

- 支持高风险预警模型。
- 重点优化高风险类别召回率。

## 9. 第六阶段：统计检验

### 9.1 卡方检验

用于检验类别变量与 `Layoff_Risk` 是否显著相关。

适用字段：

- `Education_Level`
- `Industry`
- `Job_Role`
- `Company_Size`
- `Job_Level`
- `AI_Adoption_Level`

### 9.2 方差分析或非参数检验

用于比较不同 `Layoff_Risk` 等级下数值变量是否存在显著差异。

适用字段：

- `Age`
- `Years_of_Experience`
- `Routine_Task_Percentage`
- `Creativity_Requirement`
- `Human_Interaction_Level`
- `Number_of_AI_Tools_Used`
- `AI_Usage_Hours_Per_Week`
- `Tasks_Automated_Percentage`
- `AI_Training_Hours`

如果数据不满足正态性假设，可以使用 Kruskal-Wallis 检验。

### 9.3 相关性分析

对数值变量进行 Pearson 或 Spearman 相关分析。

重点关注：

- 重复性任务比例与自动化比例的关系。
- AI 使用强度与自动化比例的关系。
- 创造力要求、人际互动水平与裁员风险之间的负相关可能性。

## 10. 第七阶段：预测建模

### 10.1 建模目标

模型目标可以分为两类：

1. 多分类预测：预测 `Low`、`Medium`、`High`。
2. 二分类预警：预测是否为 `High` 风险。

### 10.2 基线模型

建议先建立简单模型作为基线：

- Logistic Regression
- Decision Tree

作用：

- 快速验证数据是否具备可预测性。
- 提供可解释的初始结果。

### 10.3 主力模型

建议进一步尝试：

- Random Forest
- Gradient Boosting
- XGBoost
- LightGBM

其中 XGBoost 和 LightGBM 需要额外依赖，是否使用取决于实际环境。

### 10.4 数据划分

建议使用：

- 训练集：70%
- 测试集：30%

或者：

- 训练集：60%
- 验证集：20%
- 测试集：20%

需要使用分层抽样，保持 `Layoff_Risk` 类别比例一致。

### 10.5 评估指标

多分类模型建议关注：

- Accuracy
- Macro F1
- Weighted F1
- Confusion Matrix
- Classification Report

二分类高风险预警模型建议重点关注：

- High 类别 Recall
- Precision
- F1-score
- ROC-AUC
- PR-AUC

### 10.6 模型解释

建议使用：

- 特征重要性
- Permutation Importance
- SHAP

重点回答：

- 哪些因素最容易把样本推向高风险。
- 哪些因素对低风险有保护作用。
- AI 使用和自动化相关字段是否是主要风险来源。

## 11. 第八阶段：聚类与人群分层

### 11.1 聚类目标

在不使用 `Layoff_Risk` 的情况下，根据员工或岗位特征进行无监督分群。

目的：

- 找到自然形成的岗位画像。
- 再观察不同群体的裁员风险分布。

### 11.2 聚类变量

建议使用：

- `Routine_Task_Percentage`
- `Creativity_Requirement`
- `Human_Interaction_Level`
- `AI_Adoption_Level`
- `Number_of_AI_Tools_Used`
- `AI_Usage_Hours_Per_Week`
- `Tasks_Automated_Percentage`
- `AI_Training_Hours`
- `Years_of_Experience`
- `Job_Level`

### 11.3 聚类方法

可尝试：

- KMeans
- 层次聚类
- PCA 降维后聚类

### 11.4 可能形成的群体

可能得到以下类型：

- 高自动化暴露型
- 高 AI 使用但高技能保护型
- 低 AI 暴露稳定型
- 初级重复任务高风险型
- 高互动、高创造力低风险型

### 11.5 聚类结果解释

每个群体需要输出：

- 样本数量
- 行业分布
- 岗位分布
- AI 使用特征
- 自动化暴露程度
- 裁员风险分布
- 典型画像描述

## 12. 第九阶段：可视化设计

建议制作以下图表：

### 12.1 基础分布图

- 年龄分布直方图
- 工作经验分布直方图
- AI 使用小时数分布图
- 任务自动化比例分布图

### 12.2 类别占比图

- 行业分布柱状图
- 岗位级别分布柱状图
- AI 采用等级分布柱状图
- 裁员风险分布柱状图

### 12.3 风险对比图

- 不同行业的高风险比例
- 不同岗位的高风险比例
- 不同岗位级别的风险分布
- 不同 AI 采用等级的风险分布

### 12.4 关系图

- 自动化比例与重复性任务比例散点图
- 自动化比例与 AI 使用小时数散点图
- 创造力要求与裁员风险箱线图
- 人际互动水平与裁员风险箱线图

### 12.5 建模图

- 混淆矩阵
- 特征重要性条形图
- SHAP summary plot
- ROC 曲线
- PR 曲线

## 13. 第十阶段：业务洞察输出

最终报告应重点回答以下问题：

1. 哪些行业裁员风险最高？
2. 哪些岗位裁员风险最高？
3. AI 采用程度是否显著提高裁员风险？
4. 任务自动化比例是否是高风险的核心驱动因素？
5. 重复性任务比例是否会增加风险？
6. 创造力和人际互动是否能降低风险？
7. 教育水平和工作经验是否具有保护作用？
8. AI 培训能否缓解裁员风险？
9. 哪些员工或岗位应优先进行技能转型？
10. 是否可以建立有效的高风险预警模型？

## 14. 最终交付物

建议最终形成以下成果：

1. 数据质量检查报告
2. 探索性数据分析报告
3. 行业与岗位风险排行榜
4. 高风险岗位画像
5. 特征工程数据集
6. 裁员风险预测模型
7. 模型评估报告
8. 模型解释报告
9. 聚类分群报告
10. 业务建议总结

## 15. 推荐执行顺序

1. 数据质量检查
2. 基础描述性统计
3. 单变量风险分析
4. 多变量交叉分析
5. 特征工程
6. 统计检验
7. 预测建模
8. 模型解释
9. 聚类分群
10. 业务洞察总结

## 16. 推荐环境与依赖

根据项目要求，此处仅列出建议环境和安装命令，不执行实际安装。

建议环境：

- Python 3.10 或更高版本
- Jupyter Notebook 或 JupyterLab

基础依赖安装命令：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install pandas numpy matplotlib seaborn scikit-learn scipy statsmodels jupyter
```

高级建模与模型解释依赖：

```bash
pip install xgboost lightgbm shap
```

## 17. 后续建议

建议下一步创建一个 Jupyter Notebook 或 Python 分析脚本，按以下结构推进：

1. 读取数据
2. 数据质量检查
3. EDA 可视化
4. 交叉分析
5. 特征工程
6. 模型训练与评估
7. 模型解释
8. 输出结论和图表
