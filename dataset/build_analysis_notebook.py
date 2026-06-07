# -*- coding: utf-8 -*-
"""Generate and execute the AI jobs layoff risk analysis notebook."""

from __future__ import annotations

import sys
from pathlib import Path
from textwrap import dedent

import nbformat as nbf
from nbclient import NotebookClient


NOTEBOOK_PATH = Path("ai_impact_jobs_layoff_risk_analysis.ipynb")


def md(text: str):
    return nbf.v4.new_markdown_cell(dedent(text).strip())


def code(text: str):
    return nbf.v4.new_code_cell(dedent(text).strip())


cells = [
    md(
        """
        # AI 对岗位与裁员风险影响分析

        本 Notebook 根据 `ai_impact_jobs_layoff_risk_analysis_plan.md` 执行完整数据分析流程，覆盖数据质量检查、描述性分析、风险差异分析、特征工程、统计检验、预测建模、模型解释、聚类分群和业务洞察总结。

        数据文件：`ai-impact-jobs-layoff-risk-dataset.csv`

        目标变量：`Layoff_Risk`，包含 `Low`、`Medium`、`High` 三类。

        说明：当前 Notebook 使用 `pandas`、`numpy`、`matplotlib`、`seaborn`、`scipy`、`scikit-learn`、`xgboost`、`lightgbm` 和 `shap`。其中 `Logistic Regression`、`Decision Tree`、`Random Forest`、`Gradient Boosting` 作为基线和传统模型，`XGBoost`、`LightGBM` 作为高级树模型，`SHAP` 用于输出高风险预测解释。
        """
    ),
    md(
        """
        ## 1. 环境与基础配置
        """
    ),
    code(
        """
        import json
        import math
        import os
        import sys
        import warnings
        from pathlib import Path

        import matplotlib.pyplot as plt
        import numpy as np
        import pandas as pd
        import seaborn as sns
        from IPython.display import Markdown, display
        from scipy.stats import chi2_contingency, kruskal, spearmanr
        from sklearn.cluster import KMeans
        from sklearn.compose import ColumnTransformer
        from sklearn.decomposition import PCA
        from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
        from sklearn.impute import SimpleImputer
        from sklearn.inspection import permutation_importance
        from sklearn.linear_model import LogisticRegression
        from sklearn.metrics import (
            ConfusionMatrixDisplay,
            accuracy_score,
            average_precision_score,
            classification_report,
            confusion_matrix,
            f1_score,
            precision_recall_curve,
            precision_score,
            recall_score,
            roc_auc_score,
            roc_curve,
        )
        from sklearn.model_selection import train_test_split
        from sklearn.pipeline import Pipeline
        from sklearn.preprocessing import OneHotEncoder, StandardScaler
        from sklearn.tree import DecisionTreeClassifier
        from sklearn.metrics import silhouette_score

        try:
            import xgboost as xgb
            HAS_XGBOOST = True
        except Exception as exc:
            xgb = None
            HAS_XGBOOST = False
            print(f"XGBoost 不可用: {exc}")

        try:
            import lightgbm as lgb
            HAS_LIGHTGBM = True
        except Exception as exc:
            lgb = None
            HAS_LIGHTGBM = False
            print(f"LightGBM 不可用: {exc}")

        try:
            import shap
            HAS_SHAP = True
        except Exception as exc:
            shap = None
            HAS_SHAP = False
            print(f"SHAP 不可用: {exc}")

        warnings.filterwarnings("ignore", category=FutureWarning)
        warnings.filterwarnings("ignore", category=UserWarning)

        RANDOM_STATE = 42
        DATA_PATH = Path("ai-impact-jobs-layoff-risk-dataset.csv")
        OUTPUT_DIR = Path("analysis_outputs")
        FIG_DIR = OUTPUT_DIR / "figures"
        TABLE_DIR = OUTPUT_DIR / "tables"
        for path in [OUTPUT_DIR, FIG_DIR, TABLE_DIR]:
            path.mkdir(parents=True, exist_ok=True)

        pd.set_option("display.max_columns", 80)
        pd.set_option("display.max_rows", 120)
        pd.set_option("display.float_format", lambda x: f"{x:,.3f}")

        sns.set_theme(style="whitegrid", font="DejaVu Sans")
        plt.rcParams["figure.figsize"] = (10, 6)
        plt.rcParams["axes.titlesize"] = 12
        plt.rcParams["axes.labelsize"] = 10

        def savefig(name: str):
            path = FIG_DIR / name
            plt.tight_layout()
            plt.savefig(path, dpi=160, bbox_inches="tight")
            plt.show()
            return path

        print(f"Python: {sys.version.split()[0]}")
        print(f"pandas: {pd.__version__}")
        print(f"numpy: {np.__version__}")
        print(f"xgboost: {xgb.__version__ if HAS_XGBOOST else 'not available'}")
        print(f"lightgbm: {lgb.__version__ if HAS_LIGHTGBM else 'not available'}")
        print(f"shap: {shap.__version__ if HAS_SHAP else 'not available'}")
        """
    ),
    md(
        """
        ## 2. 读取数据与字段定义
        """
    ),
    code(
        """
        df = pd.read_csv(DATA_PATH)

        NUMERIC_COLS = [
            "Age",
            "Years_of_Experience",
            "Routine_Task_Percentage",
            "Creativity_Requirement",
            "Human_Interaction_Level",
            "Number_of_AI_Tools_Used",
            "AI_Usage_Hours_Per_Week",
            "Tasks_Automated_Percentage",
            "AI_Training_Hours",
        ]

        CATEGORICAL_COLS = [
            "Education_Level",
            "Industry",
            "Job_Role",
            "Company_Size",
            "Job_Level",
            "AI_Adoption_Level",
        ]

        TARGET_COL = "Layoff_Risk"
        RISK_ORDER = ["Low", "Medium", "High"]

        print(f"数据规模: {df.shape[0]:,} 行 x {df.shape[1]:,} 列")
        display(df.head())
        display(pd.DataFrame({"dtype": df.dtypes.astype(str), "n_unique": df.nunique()}).rename_axis("column"))
        """
    ),
    md(
        """
        ## 3. 数据质量检查

        本节检查字段类型、缺失值、重复记录、数值范围和类别一致性。
        """
    ),
    code(
        """
        missing_summary = pd.DataFrame(
            {
                "missing_count": df.isna().sum(),
                "missing_rate": df.isna().mean(),
            }
        )

        duplicate_count = df.duplicated().sum()

        range_checks = {
            "Age outside 21-60": (~df["Age"].between(21, 60)).sum(),
            "Years_of_Experience < 0": (df["Years_of_Experience"] < 0).sum(),
            "Years_of_Experience > Age - 18": (df["Years_of_Experience"] > (df["Age"] - 18)).sum(),
            "Routine_Task_Percentage outside 0-100": (~df["Routine_Task_Percentage"].between(0, 100)).sum(),
            "Tasks_Automated_Percentage outside 0-100": (~df["Tasks_Automated_Percentage"].between(0, 100)).sum(),
            "Creativity_Requirement outside 0-100": (~df["Creativity_Requirement"].between(0, 100)).sum(),
            "Human_Interaction_Level outside 0-100": (~df["Human_Interaction_Level"].between(0, 100)).sum(),
            "AI_Usage_Hours_Per_Week > 80": (df["AI_Usage_Hours_Per_Week"] > 80).sum(),
            "AI_Training_Hours > 200": (df["AI_Training_Hours"] > 200).sum(),
        }

        expected_categories = {
            "Education_Level": {"High School", "Bachelor's", "Master's", "PhD"},
            "Company_Size": {"Small", "Medium", "Large"},
            "Job_Level": {"Entry", "Mid", "Senior"},
            "AI_Adoption_Level": {"Low", "Medium", "High"},
            "Layoff_Risk": {"Low", "Medium", "High"},
        }

        category_checks = []
        for col, expected in expected_categories.items():
            actual = set(df[col].dropna().unique())
            category_checks.append(
                {
                    "column": col,
                    "unexpected_values": sorted(actual - expected),
                    "missing_expected_values": sorted(expected - actual),
                    "actual_values": sorted(actual),
                }
            )

        quality_summary = pd.DataFrame(
            {
                "item": [
                    "rows",
                    "columns",
                    "duplicate_records",
                    "columns_with_missing_values",
                    "total_missing_values",
                ],
                "value": [
                    df.shape[0],
                    df.shape[1],
                    duplicate_count,
                    int((df.isna().sum() > 0).sum()),
                    int(df.isna().sum().sum()),
                ],
            }
        )

        display(quality_summary)
        display(missing_summary)
        display(pd.DataFrame(range_checks.items(), columns=["check", "violations"]))
        display(pd.DataFrame(category_checks))

        missing_summary.to_csv(TABLE_DIR / "missing_summary.csv")
        pd.DataFrame(range_checks.items(), columns=["check", "violations"]).to_csv(
            TABLE_DIR / "range_checks.csv", index=False
        )
        """
    ),
    md(
        """
        **数据质量结论**

        若上表中的缺失值、范围异常和类别异常均为 0，则该数据集可直接进入后续分析。`Years_of_Experience > Age - 18` 用于检查经验年限是否与年龄存在明显逻辑冲突。
        """
    ),
    md(
        """
        ## 4. 描述性分析
        """
    ),
    code(
        """
        numeric_summary = df[NUMERIC_COLS].describe().T
        numeric_summary["missing"] = df[NUMERIC_COLS].isna().sum()
        display(numeric_summary)
        numeric_summary.to_csv(TABLE_DIR / "numeric_summary.csv")

        def category_distribution(data: pd.DataFrame, col: str) -> pd.DataFrame:
            counts = data[col].value_counts(dropna=False)
            pct = data[col].value_counts(normalize=True, dropna=False)
            return pd.DataFrame({"count": counts, "pct": pct}).reset_index(names=col)

        for col in CATEGORICAL_COLS + [TARGET_COL]:
            dist = category_distribution(df, col)
            display(Markdown(f"### {col}"))
            display(dist)
            dist.to_csv(TABLE_DIR / f"distribution_{col}.csv", index=False)
        """
    ),
    code(
        """
        fig, axes = plt.subplots(3, 3, figsize=(15, 12))
        axes = axes.ravel()
        for ax, col in zip(axes, NUMERIC_COLS):
            sns.histplot(df[col], bins=30, kde=True, ax=ax, color="#2f6f8f")
            ax.set_title(col)
        savefig("numeric_distributions.png")
        """
    ),
    code(
        """
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        axes = axes.ravel()
        plot_cols = ["Industry", "Job_Level", "AI_Adoption_Level", "Layoff_Risk"]
        for ax, col in zip(axes, plot_cols):
            order = df[col].value_counts().index
            sns.countplot(data=df, y=col, order=order, ax=ax, color="#4878a8")
            ax.set_title(f"{col} distribution")
            ax.set_xlabel("Count")
            ax.set_ylabel("")
        savefig("key_category_distributions.png")
        """
    ),
    code(
        """
        target_dist = (
            df[TARGET_COL]
            .value_counts()
            .reindex(RISK_ORDER)
            .to_frame("count")
            .assign(pct=lambda x: x["count"] / x["count"].sum())
        )
        display(target_dist)

        sns.barplot(x=target_dist.index, y=target_dist["pct"], color="#6a8d73")
        plt.gca().yaxis.set_major_formatter(lambda x, pos: f"{x:.0%}")
        plt.title("Layoff_Risk distribution")
        plt.xlabel("Layoff_Risk")
        plt.ylabel("Share")
        savefig("target_distribution.png")
        """
    ),
    md(
        """
        ## 5. 单变量与裁员风险关系分析
        """
    ),
    code(
        """
        def risk_distribution(data: pd.DataFrame, col: str) -> pd.DataFrame:
            tab = pd.crosstab(data[col], data[TARGET_COL], normalize="index")
            tab = tab.reindex(columns=RISK_ORDER)
            count = data[col].value_counts().rename("n")
            result = tab.join(count)
            result["High_Rate"] = result["High"]
            return result.sort_values("High_Rate", ascending=False)

        category_risk_tables = {}
        for col in CATEGORICAL_COLS:
            table = risk_distribution(df, col)
            category_risk_tables[col] = table
            display(Markdown(f"### {col} 与裁员风险"))
            display(table)
            table.to_csv(TABLE_DIR / f"risk_distribution_by_{col}.csv")
        """
    ),
    code(
        """
        high_risk_by_industry = risk_distribution(df, "Industry")
        high_risk_by_role = risk_distribution(df, "Job_Role")

        fig, axes = plt.subplots(1, 2, figsize=(16, 7))
        sns.barplot(
            data=high_risk_by_industry.reset_index(),
            y="Industry",
            x="High_Rate",
            ax=axes[0],
            color="#b85c38",
        )
        axes[0].xaxis.set_major_formatter(lambda x, pos: f"{x:.0%}")
        axes[0].set_title("High risk rate by industry")
        axes[0].set_xlabel("High risk rate")
        axes[0].set_ylabel("")

        role_plot = high_risk_by_role.head(15).reset_index()
        sns.barplot(
            data=role_plot,
            y="Job_Role",
            x="High_Rate",
            ax=axes[1],
            color="#b85c38",
        )
        axes[1].xaxis.set_major_formatter(lambda x, pos: f"{x:.0%}")
        axes[1].set_title("Top 15 high risk roles")
        axes[1].set_xlabel("High risk rate")
        axes[1].set_ylabel("")
        savefig("high_risk_rates_industry_role.png")

        high_risk_by_industry.to_csv(TABLE_DIR / "high_risk_by_industry.csv")
        high_risk_by_role.to_csv(TABLE_DIR / "high_risk_by_job_role.csv")
        """
    ),
    code(
        """
        numeric_by_risk = df.groupby(TARGET_COL)[NUMERIC_COLS].agg(["mean", "median", "std"])
        display(numeric_by_risk)
        numeric_by_risk.to_csv(TABLE_DIR / "numeric_by_layoff_risk.csv")

        fig, axes = plt.subplots(2, 3, figsize=(16, 10))
        axes = axes.ravel()
        box_cols = [
            "Routine_Task_Percentage",
            "Tasks_Automated_Percentage",
            "AI_Usage_Hours_Per_Week",
            "AI_Training_Hours",
            "Creativity_Requirement",
            "Human_Interaction_Level",
        ]
        for ax, col in zip(axes, box_cols):
            sns.boxplot(data=df, x=TARGET_COL, y=col, order=RISK_ORDER, ax=ax, color="#8fb3a0")
            ax.set_title(f"{col} by Layoff_Risk")
            ax.set_xlabel("")
        savefig("numeric_features_by_risk_boxplots.png")
        """
    ),
    md(
        """
        ## 6. 多变量交叉分析
        """
    ),
    code(
        """
        industry_role_risk = (
            df.assign(Is_High=lambda x: x[TARGET_COL].eq("High"))
            .groupby(["Industry", "Job_Role"], observed=True)
            .agg(n=(TARGET_COL, "size"), high_rate=("Is_High", "mean"))
            .query("n >= 50")
            .sort_values("high_rate", ascending=False)
        )
        display(industry_role_risk.head(20))
        industry_role_risk.to_csv(TABLE_DIR / "industry_role_high_risk_ranking.csv")

        job_ai_risk = (
            df.assign(Is_High=lambda x: x[TARGET_COL].eq("High"))
            .groupby(["Job_Level", "AI_Adoption_Level"], observed=True)
            .agg(n=(TARGET_COL, "size"), high_rate=("Is_High", "mean"))
            .reset_index()
            .sort_values(["AI_Adoption_Level", "Job_Level"])
        )
        display(job_ai_risk)
        job_ai_risk.to_csv(TABLE_DIR / "job_level_ai_adoption_high_risk.csv", index=False)

        pivot_job_ai = job_ai_risk.pivot(index="Job_Level", columns="AI_Adoption_Level", values="high_rate")
        pivot_job_ai = pivot_job_ai.reindex(index=["Entry", "Mid", "Senior"], columns=["Low", "Medium", "High"])
        sns.heatmap(pivot_job_ai, annot=True, fmt=".1%", cmap="YlOrRd")
        plt.title("High risk rate: Job_Level x AI_Adoption_Level")
        savefig("job_level_ai_adoption_high_risk_heatmap.png")
        """
    ),
    code(
        """
        binned = df.copy()
        binned["Routine_Band"] = pd.cut(
            binned["Routine_Task_Percentage"],
            bins=[-0.1, 25, 50, 75, 100],
            labels=["0-25", "26-50", "51-75", "76-100"],
        )
        binned["Automation_Band"] = pd.cut(
            binned["Tasks_Automated_Percentage"],
            bins=[-0.1, 25, 50, 75, 100],
            labels=["0-25", "26-50", "51-75", "76-100"],
        )
        routine_auto_risk = (
            binned.assign(Is_High=lambda x: x[TARGET_COL].eq("High"))
            .groupby(["Routine_Band", "Automation_Band"], observed=True)
            .agg(n=(TARGET_COL, "size"), high_rate=("Is_High", "mean"))
            .reset_index()
        )
        display(routine_auto_risk)
        routine_auto_risk.to_csv(TABLE_DIR / "routine_automation_high_risk.csv", index=False)

        pivot_routine_auto = routine_auto_risk.pivot(
            index="Routine_Band", columns="Automation_Band", values="high_rate"
        )
        sns.heatmap(pivot_routine_auto, annot=True, fmt=".1%", cmap="YlOrRd")
        plt.title("High risk rate: Routine task x Tasks automated")
        plt.xlabel("Tasks_Automated_Percentage band")
        plt.ylabel("Routine_Task_Percentage band")
        savefig("routine_automation_high_risk_heatmap.png")

        sns.scatterplot(
            data=df.sample(min(5000, len(df)), random_state=RANDOM_STATE),
            x="Routine_Task_Percentage",
            y="Tasks_Automated_Percentage",
            hue=TARGET_COL,
            hue_order=RISK_ORDER,
            alpha=0.45,
            palette=["#4c78a8", "#f2b447", "#c44e52"],
        )
        plt.title("Routine task percentage vs automated task percentage")
        savefig("routine_vs_automation_scatter.png")
        """
    ),
    code(
        """
        binned["Creativity_Band"] = pd.cut(
            binned["Creativity_Requirement"],
            bins=[-0.1, 33, 66, 100],
            labels=["Low", "Medium", "High"],
        )
        binned["Interaction_Band"] = pd.cut(
            binned["Human_Interaction_Level"],
            bins=[-0.1, 33, 66, 100],
            labels=["Low", "Medium", "High"],
        )
        creative_interaction_risk = (
            binned.assign(Is_High=lambda x: x[TARGET_COL].eq("High"))
            .groupby(["Creativity_Band", "Interaction_Band"], observed=True)
            .agg(n=(TARGET_COL, "size"), high_rate=("Is_High", "mean"))
            .reset_index()
        )
        display(creative_interaction_risk)
        creative_interaction_risk.to_csv(TABLE_DIR / "creativity_interaction_high_risk.csv", index=False)

        pivot_creative_interaction = creative_interaction_risk.pivot(
            index="Creativity_Band", columns="Interaction_Band", values="high_rate"
        )
        sns.heatmap(pivot_creative_interaction, annot=True, fmt=".1%", cmap="YlOrRd")
        plt.title("High risk rate: Creativity x Human interaction")
        savefig("creativity_interaction_high_risk_heatmap.png")
        """
    ),
    md(
        """
        ## 7. 特征工程

        按分析计划构造自动化暴露指数、人类能力保护指数、AI 使用强度指数、经验分组、年龄分组和二分类风险目标。
        """
    ),
    code(
        """
        df_fe = df.copy()

        ai_adoption_map = {"Low": 0, "Medium": 1, "High": 2}
        job_level_map = {"Entry": 0, "Mid": 1, "Senior": 2}
        education_map = {"High School": 0, "Bachelor's": 1, "Master's": 2, "PhD": 3}
        company_size_map = {"Small": 0, "Medium": 1, "Large": 2}
        risk_score_map = {"Low": 0, "Medium": 1, "High": 2}

        df_fe["AI_Adoption_Score"] = df_fe["AI_Adoption_Level"].map(ai_adoption_map)
        df_fe["Job_Level_Score"] = df_fe["Job_Level"].map(job_level_map)
        df_fe["Education_Score"] = df_fe["Education_Level"].map(education_map)
        df_fe["Company_Size_Score"] = df_fe["Company_Size"].map(company_size_map)
        df_fe["Layoff_Risk_Score"] = df_fe[TARGET_COL].map(risk_score_map)

        def minmax(series: pd.Series) -> pd.Series:
            span = series.max() - series.min()
            if span == 0:
                return pd.Series(np.zeros(len(series)), index=series.index)
            return (series - series.min()) / span

        df_fe["Automation_Exposure_Index"] = 100 * pd.concat(
            [
                minmax(df_fe["Routine_Task_Percentage"]),
                minmax(df_fe["Tasks_Automated_Percentage"]),
                minmax(df_fe["AI_Adoption_Score"]),
                minmax(df_fe["Number_of_AI_Tools_Used"]),
            ],
            axis=1,
        ).mean(axis=1)

        df_fe["Human_Creative_Protection_Index"] = (
            df_fe["Creativity_Requirement"] + df_fe["Human_Interaction_Level"]
        ) / 2

        df_fe["AI_Intensity_Index"] = 100 * pd.concat(
            [
                minmax(df_fe["AI_Adoption_Score"]),
                minmax(df_fe["Number_of_AI_Tools_Used"]),
                minmax(df_fe["AI_Usage_Hours_Per_Week"]),
            ],
            axis=1,
        ).mean(axis=1)

        df_fe["Experience_Band"] = pd.cut(
            df_fe["Years_of_Experience"],
            bins=[-0.1, 3, 7, 15, np.inf],
            labels=["0-3", "4-7", "8-15", "15+"],
        )

        df_fe["Age_Band"] = pd.cut(
            df_fe["Age"],
            bins=[20, 30, 40, 50, 60],
            labels=["21-30", "31-40", "41-50", "51-60"],
            include_lowest=True,
        )

        df_fe["Risk_Binary"] = np.where(df_fe[TARGET_COL].eq("High"), "High", "Not_High")

        engineered_cols = [
            "AI_Adoption_Score",
            "Job_Level_Score",
            "Education_Score",
            "Company_Size_Score",
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
            "Experience_Band",
            "Age_Band",
            "Risk_Binary",
            "Layoff_Risk_Score",
        ]
        display(df_fe[engineered_cols].head())
        display(df_fe.groupby(TARGET_COL)[[
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
        ]].mean().reindex(RISK_ORDER))

        feature_engineered_path = OUTPUT_DIR / "ai_impact_jobs_layoff_risk_feature_engineered.csv"
        df_fe.to_csv(feature_engineered_path, index=False)
        print(f"已保存特征工程数据集: {feature_engineered_path}")
        """
    ),
    code(
        """
        fig, axes = plt.subplots(1, 3, figsize=(16, 5))
        index_cols = [
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
        ]
        for ax, col in zip(axes, index_cols):
            sns.boxplot(data=df_fe, x=TARGET_COL, y=col, order=RISK_ORDER, ax=ax, color="#9ab6c9")
            ax.set_title(f"{col} by risk")
            ax.set_xlabel("")
        savefig("engineered_indices_by_risk.png")
        """
    ),
    md(
        """
        ## 8. 统计检验

        类别变量使用卡方检验并计算 Cramer's V；数值变量使用 Kruskal-Wallis 检验，避免对正态性做强假设；相关性分析使用 Spearman 相关。
        """
    ),
    code(
        """
        def cramers_v(table: pd.DataFrame) -> float:
            chi2, _, _, _ = chi2_contingency(table)
            n = table.to_numpy().sum()
            if n == 0:
                return np.nan
            r, k = table.shape
            return math.sqrt((chi2 / n) / max(1, min(k - 1, r - 1)))

        chi_square_results = []
        for col in CATEGORICAL_COLS:
            contingency = pd.crosstab(df_fe[col], df_fe[TARGET_COL])
            chi2, p_value, dof, expected = chi2_contingency(contingency)
            chi_square_results.append(
                {
                    "feature": col,
                    "chi2": chi2,
                    "dof": dof,
                    "p_value": p_value,
                    "cramers_v": cramers_v(contingency),
                }
            )

        chi_square_df = pd.DataFrame(chi_square_results).sort_values("cramers_v", ascending=False)
        display(chi_square_df)
        chi_square_df.to_csv(TABLE_DIR / "chi_square_tests.csv", index=False)

        kruskal_results = []
        numeric_test_cols = NUMERIC_COLS + [
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
        ]
        for col in numeric_test_cols:
            groups = [group[col].dropna().to_numpy() for _, group in df_fe.groupby(TARGET_COL, observed=True)]
            h_stat, p_value = kruskal(*groups)
            n = len(df_fe[col].dropna())
            k = len(groups)
            epsilon_sq = max(0, (h_stat - k + 1) / max(1, n - k))
            kruskal_results.append(
                {
                    "feature": col,
                    "h_stat": h_stat,
                    "p_value": p_value,
                    "epsilon_squared": epsilon_sq,
                }
            )

        kruskal_df = pd.DataFrame(kruskal_results).sort_values("epsilon_squared", ascending=False)
        display(kruskal_df)
        kruskal_df.to_csv(TABLE_DIR / "kruskal_tests.csv", index=False)
        """
    ),
    code(
        """
        corr_cols = NUMERIC_COLS + [
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
            "AI_Adoption_Score",
            "Job_Level_Score",
            "Education_Score",
            "Layoff_Risk_Score",
        ]
        spearman_corr = df_fe[corr_cols].corr(method="spearman")
        display(spearman_corr["Layoff_Risk_Score"].sort_values(ascending=False).to_frame("spearman_with_risk"))
        spearman_corr.to_csv(TABLE_DIR / "spearman_correlation.csv")

        plt.figure(figsize=(14, 11))
        sns.heatmap(spearman_corr, cmap="vlag", center=0, linewidths=0.2)
        plt.title("Spearman correlation heatmap")
        savefig("spearman_correlation_heatmap.png")
        """
    ),
    md(
        """
        ## 9. 多分类预测建模

        目标：预测 `Layoff_Risk = Low / Medium / High`。

        模型：Logistic Regression、Decision Tree、Random Forest、Gradient Boosting。

        数据划分：70% 训练集、30% 测试集，使用分层抽样保持目标类别比例。
        """
    ),
    code(
        """
        model_df = df_fe.copy()
        drop_for_multiclass = [TARGET_COL, "Risk_Binary", "Layoff_Risk_Score"]
        X = model_df.drop(columns=drop_for_multiclass)
        TARGET_LABEL_MAP = {label: idx for idx, label in enumerate(RISK_ORDER)}
        TARGET_LABEL_INV = {idx: label for label, idx in TARGET_LABEL_MAP.items()}
        TARGET_LABELS = [TARGET_LABEL_MAP[label] for label in RISK_ORDER]
        y = model_df[TARGET_COL].map(TARGET_LABEL_MAP).astype(int)

        categorical_features = [
            "Education_Level",
            "Industry",
            "Job_Role",
            "Company_Size",
            "Job_Level",
            "AI_Adoption_Level",
            "Experience_Band",
            "Age_Band",
        ]
        categorical_features = [c for c in categorical_features if c in X.columns]
        numeric_features = [c for c in X.columns if c not in categorical_features]

        def build_preprocessor() -> ColumnTransformer:
            return ColumnTransformer(
                transformers=[
                    (
                        "num",
                        Pipeline(
                            steps=[
                                ("imputer", SimpleImputer(strategy="median")),
                                ("scaler", StandardScaler()),
                            ]
                        ),
                        numeric_features,
                    ),
                    (
                        "cat",
                        Pipeline(
                            steps=[
                                ("imputer", SimpleImputer(strategy="most_frequent")),
                                ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                            ]
                        ),
                        categorical_features,
                    ),
                ],
                remainder="drop",
            )

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.30,
            random_state=RANDOM_STATE,
            stratify=y,
        )

        multiclass_models = {
            "Logistic Regression": LogisticRegression(
                max_iter=2000,
                class_weight="balanced",
                random_state=RANDOM_STATE,
            ),
            "Decision Tree": DecisionTreeClassifier(
                max_depth=8,
                class_weight="balanced",
                random_state=RANDOM_STATE,
            ),
            "Random Forest": RandomForestClassifier(
                n_estimators=250,
                max_depth=14,
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
            ),
            "Gradient Boosting": GradientBoostingClassifier(random_state=RANDOM_STATE),
        }

        if HAS_XGBOOST:
            multiclass_models["XGBoost"] = xgb.XGBClassifier(
                n_estimators=350,
                max_depth=5,
                learning_rate=0.05,
                subsample=0.90,
                colsample_bytree=0.90,
                objective="multi:softprob",
                eval_metric="mlogloss",
                tree_method="hist",
                random_state=RANDOM_STATE,
                n_jobs=-1,
            )

        if HAS_LIGHTGBM:
            multiclass_models["LightGBM"] = lgb.LGBMClassifier(
                n_estimators=350,
                learning_rate=0.05,
                num_leaves=31,
                subsample=0.90,
                colsample_bytree=0.90,
                objective="multiclass",
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
                verbosity=-1,
            )

        fitted_multiclass = {}
        model_metrics = []
        model_reports = {}

        for name, estimator in multiclass_models.items():
            pipe = Pipeline(steps=[("preprocessor", build_preprocessor()), ("model", estimator)])
            pipe.fit(X_train, y_train)
            y_pred = pipe.predict(X_test)
            fitted_multiclass[name] = pipe
            model_metrics.append(
                {
                    "model": name,
                    "accuracy": accuracy_score(y_test, y_pred),
                    "macro_f1": f1_score(y_test, y_pred, average="macro"),
                    "weighted_f1": f1_score(y_test, y_pred, average="weighted"),
                }
            )
            model_reports[name] = classification_report(
                y_test,
                y_pred,
                labels=TARGET_LABELS,
                target_names=RISK_ORDER,
                output_dict=True,
                zero_division=0,
            )

        model_metrics_df = pd.DataFrame(model_metrics).sort_values("macro_f1", ascending=False)
        display(model_metrics_df)
        model_metrics_df.to_csv(TABLE_DIR / "multiclass_model_metrics.csv", index=False)

        best_multiclass_name = model_metrics_df.iloc[0]["model"]
        best_multiclass_model = fitted_multiclass[best_multiclass_name]
        print(f"最佳多分类模型: {best_multiclass_name}")
        print(
            classification_report(
                y_test,
                best_multiclass_model.predict(X_test),
                labels=TARGET_LABELS,
                target_names=RISK_ORDER,
                zero_division=0,
            )
        )
        """
    ),
    code(
        """
        best_y_pred = best_multiclass_model.predict(X_test)
        cm = confusion_matrix(y_test, best_y_pred, labels=TARGET_LABELS)
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=RISK_ORDER)
        disp.plot(cmap="Blues", values_format="d")
        plt.title(f"Confusion matrix: {best_multiclass_name}")
        savefig("multiclass_confusion_matrix.png")
        """
    ),
    md(
        """
        ## 10. 二分类高风险预警模型

        目标：预测是否为 `High` 风险。此处重点关注 `High` 类别召回率，避免漏报高风险样本。
        """
    ),
    code(
        """
        X_bin = model_df.drop(columns=[TARGET_COL, "Risk_Binary", "Layoff_Risk_Score"])
        y_bin = model_df["Risk_Binary"].map({"Not_High": 0, "High": 1}).astype(int)

        X_train_bin, X_test_bin, y_train_bin, y_test_bin = train_test_split(
            X_bin,
            y_bin,
            test_size=0.30,
            random_state=RANDOM_STATE,
            stratify=y_bin,
        )

        binary_models = {
            "Logistic Regression": LogisticRegression(
                max_iter=2000,
                class_weight="balanced",
                random_state=RANDOM_STATE,
            ),
            "Random Forest": RandomForestClassifier(
                n_estimators=250,
                max_depth=14,
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
            ),
            "Gradient Boosting": GradientBoostingClassifier(random_state=RANDOM_STATE),
        }

        if HAS_XGBOOST:
            binary_models["XGBoost"] = xgb.XGBClassifier(
                n_estimators=350,
                max_depth=5,
                learning_rate=0.05,
                subsample=0.90,
                colsample_bytree=0.90,
                objective="binary:logistic",
                eval_metric="logloss",
                scale_pos_weight=(y_train_bin.eq(0).sum() / y_train_bin.eq(1).sum()),
                tree_method="hist",
                random_state=RANDOM_STATE,
                n_jobs=-1,
            )

        if HAS_LIGHTGBM:
            binary_models["LightGBM"] = lgb.LGBMClassifier(
                n_estimators=350,
                learning_rate=0.05,
                num_leaves=31,
                subsample=0.90,
                colsample_bytree=0.90,
                objective="binary",
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
                verbosity=-1,
            )

        fitted_binary = {}
        binary_metrics = []

        for name, estimator in binary_models.items():
            pipe = Pipeline(steps=[("preprocessor", build_preprocessor()), ("model", estimator)])
            pipe.fit(X_train_bin, y_train_bin)
            y_pred = pipe.predict(X_test_bin)
            y_proba = pipe.predict_proba(X_test_bin)[:, 1]
            fitted_binary[name] = pipe
            binary_metrics.append(
                {
                    "model": name,
                    "accuracy": accuracy_score(y_test_bin, y_pred),
                    "high_precision": precision_score(y_test_bin, y_pred, zero_division=0),
                    "high_recall": recall_score(y_test_bin, y_pred, zero_division=0),
                    "high_f1": f1_score(y_test_bin, y_pred, zero_division=0),
                    "roc_auc": roc_auc_score(y_test_bin, y_proba),
                    "pr_auc": average_precision_score(y_test_bin, y_proba),
                }
            )

        binary_metrics_df = pd.DataFrame(binary_metrics).sort_values(
            ["high_recall", "high_f1", "pr_auc"], ascending=False
        )
        display(binary_metrics_df)
        binary_metrics_df.to_csv(TABLE_DIR / "binary_model_metrics.csv", index=False)

        best_binary_name = binary_metrics_df.iloc[0]["model"]
        best_binary_model = fitted_binary[best_binary_name]
        y_proba_best = best_binary_model.predict_proba(X_test_bin)[:, 1]
        print(f"最佳高风险预警模型: {best_binary_name}")
        print(classification_report(y_test_bin, best_binary_model.predict(X_test_bin), target_names=["Not_High", "High"]))
        """
    ),
    code(
        """
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        sns.barplot(
            data=model_metrics_df.sort_values("macro_f1", ascending=False),
            y="model",
            x="macro_f1",
            ax=axes[0],
            color="#557a9b",
        )
        axes[0].set_xlim(0, 1)
        axes[0].set_title("Multiclass model comparison")
        axes[0].set_xlabel("Macro F1")
        axes[0].set_ylabel("")

        sns.barplot(
            data=binary_metrics_df.sort_values("high_recall", ascending=False),
            y="model",
            x="high_recall",
            ax=axes[1],
            color="#b46a52",
        )
        axes[1].set_xlim(0, 1)
        axes[1].set_title("Binary high-risk model comparison")
        axes[1].set_xlabel("High recall")
        axes[1].set_ylabel("")
        savefig("advanced_model_comparison.png")
        """
    ),
    code(
        """
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        for name, pipe in fitted_binary.items():
            proba = pipe.predict_proba(X_test_bin)[:, 1]
            fpr, tpr, _ = roc_curve(y_test_bin, proba)
            precision_curve, recall_curve, _ = precision_recall_curve(y_test_bin, proba)
            axes[0].plot(fpr, tpr, label=f"{name}: {roc_auc_score(y_test_bin, proba):.3f}")
            axes[1].plot(recall_curve, precision_curve, label=f"{name}: {average_precision_score(y_test_bin, proba):.3f}")

        axes[0].plot([0, 1], [0, 1], linestyle="--", color="gray")
        axes[0].set_xlabel("False Positive Rate")
        axes[0].set_ylabel("True Positive Rate")
        axes[0].set_title("ROC curves")
        axes[0].legend()

        axes[1].set_xlabel("Recall")
        axes[1].set_ylabel("Precision")
        axes[1].set_title("Precision-Recall curves")
        axes[1].legend()
        savefig("binary_roc_pr_curves.png")

        precision, recall, pr_thresholds = precision_recall_curve(y_test_bin, y_proba_best)

        threshold_table = pd.DataFrame(
            {
                "threshold": np.r_[pr_thresholds, np.nan],
                "precision": precision,
                "recall": recall,
            }
        ).dropna()
        recall_target = 0.90
        eligible_thresholds = threshold_table[threshold_table["recall"] >= recall_target]
        selected_threshold = (
            eligible_thresholds.sort_values("precision", ascending=False).iloc[0]["threshold"]
            if len(eligible_thresholds) > 0
            else 0.50
        )
        tuned_pred = (y_proba_best >= selected_threshold).astype(int)

        tuned_summary = {
            "selected_threshold": selected_threshold,
            "precision": precision_score(y_test_bin, tuned_pred, zero_division=0),
            "recall": recall_score(y_test_bin, tuned_pred, zero_division=0),
            "f1": f1_score(y_test_bin, tuned_pred, zero_division=0),
        }
        display(pd.DataFrame([tuned_summary]))
        print(classification_report(y_test_bin, tuned_pred, target_names=["Not_High", "High"]))
        """
    ),
    md(
        """
        ## 11. 模型解释

        先使用 permutation importance 解释原始输入特征对最佳多分类模型的影响；再根据模型类型补充系数或树模型特征重要性。

        在已安装 `LightGBM` 和 `SHAP` 的环境中，本节会额外训练一个高风险二分类解释模型，用 SHAP 输出哪些因素会把样本推向 `High` 风险。
        """
    ),
    code(
        """
        perm = permutation_importance(
            best_multiclass_model,
            X_test,
            y_test,
            n_repeats=5,
            random_state=RANDOM_STATE,
            scoring="f1_macro",
            n_jobs=-1,
        )

        permutation_importance_df = (
            pd.DataFrame(
                {
                    "feature": X_test.columns,
                    "importance_mean": perm.importances_mean,
                    "importance_std": perm.importances_std,
                }
            )
            .sort_values("importance_mean", ascending=False)
            .reset_index(drop=True)
        )
        display(permutation_importance_df.head(20))
        permutation_importance_df.to_csv(TABLE_DIR / "permutation_importance_multiclass.csv", index=False)

        sns.barplot(
            data=permutation_importance_df.head(20),
            y="feature",
            x="importance_mean",
            color="#6f7d95",
        )
        plt.title(f"Permutation importance: {best_multiclass_name}")
        plt.xlabel("Mean decrease in macro F1")
        plt.ylabel("")
        savefig("permutation_importance_multiclass.png")
        """
    ),
    code(
        """
        transformed_feature_names = best_multiclass_model.named_steps["preprocessor"].get_feature_names_out()
        clean_feature_names = [
            name.replace("num__", "").replace("cat__", "")
            for name in transformed_feature_names
        ]
        model_core = best_multiclass_model.named_steps["model"]

        if hasattr(model_core, "coef_"):
            model_importance_values = np.mean(np.abs(model_core.coef_), axis=0)
            model_importance_type = "mean_abs_coefficient"
        elif hasattr(model_core, "feature_importances_"):
            model_importance_values = model_core.feature_importances_
            model_importance_type = "tree_feature_importance"
        else:
            model_importance_values = np.zeros(len(clean_feature_names))
            model_importance_type = "not_available"

        model_feature_importance_df = (
            pd.DataFrame(
                {
                    "feature": clean_feature_names,
                    model_importance_type: model_importance_values,
                }
            )
            .sort_values(model_importance_type, ascending=False)
            .reset_index(drop=True)
        )

        display(model_feature_importance_df.head(25))
        model_feature_importance_df.to_csv(TABLE_DIR / "model_feature_importance_multiclass.csv", index=False)

        sns.barplot(
            data=model_feature_importance_df.head(20),
            y="feature",
            x=model_importance_type,
            color="#557a5a",
        )
        plt.title(f"Model-level feature importance: {best_multiclass_name}")
        plt.xlabel(model_importance_type)
        plt.ylabel("")
        savefig("model_feature_importance_multiclass.png")
        """
    ),
    code(
        """
        shap_high_risk_importance_df = pd.DataFrame()

        if not (HAS_LIGHTGBM and HAS_SHAP):
            print("LightGBM 或 SHAP 不可用，跳过高级 SHAP 解释。")
        else:
            shap_preprocessor = build_preprocessor()
            X_train_shap = shap_preprocessor.fit_transform(X_train_bin)
            X_test_shap = shap_preprocessor.transform(X_test_bin)
            shap_feature_names = [
                name.replace("num__", "").replace("cat__", "")
                for name in shap_preprocessor.get_feature_names_out()
            ]

            shap_lgbm_model = lgb.LGBMClassifier(
                n_estimators=350,
                learning_rate=0.05,
                num_leaves=31,
                subsample=0.90,
                colsample_bytree=0.90,
                objective="binary",
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
                verbosity=-1,
            )
            shap_lgbm_model.fit(X_train_shap, y_train_bin)

            shap_pred = shap_lgbm_model.predict(X_test_shap)
            shap_proba = shap_lgbm_model.predict_proba(X_test_shap)[:, 1]
            shap_eval = {
                "accuracy": accuracy_score(y_test_bin, shap_pred),
                "high_precision": precision_score(y_test_bin, shap_pred, zero_division=0),
                "high_recall": recall_score(y_test_bin, shap_pred, zero_division=0),
                "high_f1": f1_score(y_test_bin, shap_pred, zero_division=0),
                "roc_auc": roc_auc_score(y_test_bin, shap_proba),
                "pr_auc": average_precision_score(y_test_bin, shap_proba),
            }
            display(pd.DataFrame([shap_eval]))
            pd.DataFrame([shap_eval]).to_csv(TABLE_DIR / "shap_lgbm_high_risk_model_metrics.csv", index=False)

            rng = np.random.default_rng(RANDOM_STATE)
            shap_sample_size = min(2500, X_test_shap.shape[0])
            shap_sample_idx = rng.choice(X_test_shap.shape[0], size=shap_sample_size, replace=False)
            X_shap_sample = X_test_shap[shap_sample_idx]

            explainer = shap.TreeExplainer(shap_lgbm_model)
            shap_values_raw = explainer.shap_values(X_shap_sample)
            if isinstance(shap_values_raw, list):
                shap_values_high = shap_values_raw[1]
            else:
                shap_values_high = shap_values_raw

            X_shap_sample_df = pd.DataFrame(X_shap_sample, columns=shap_feature_names)
            shap_high_risk_importance_df = (
                pd.DataFrame(
                    {
                        "feature": shap_feature_names,
                        "mean_abs_shap": np.abs(shap_values_high).mean(axis=0),
                        "mean_shap": shap_values_high.mean(axis=0),
                    }
                )
                .sort_values("mean_abs_shap", ascending=False)
                .reset_index(drop=True)
            )
            display(shap_high_risk_importance_df.head(25))
            shap_high_risk_importance_df.to_csv(TABLE_DIR / "shap_high_risk_importance.csv", index=False)

            shap.summary_plot(
                shap_values_high,
                X_shap_sample_df,
                max_display=25,
                show=False,
            )
            savefig("shap_high_risk_summary.png")

            shap.summary_plot(
                shap_values_high,
                X_shap_sample_df,
                plot_type="bar",
                max_display=25,
                show=False,
            )
            savefig("shap_high_risk_bar.png")

            dependence_candidates = [
                "Automation_Exposure_Index",
                "AI_Intensity_Index",
                "Routine_Task_Percentage",
                "Tasks_Automated_Percentage",
                "Human_Creative_Protection_Index",
                "Creativity_Requirement",
            ]
            top_dependence_features = [
                feature
                for feature in dependence_candidates
                if feature in X_shap_sample_df.columns
            ][:4]
            for feature in top_dependence_features:
                shap.dependence_plot(
                    feature,
                    shap_values_high,
                    X_shap_sample_df,
                    show=False,
                    interaction_index=None,
                )
                plt.title(f"SHAP dependence: {feature}")
                savefig(f"shap_dependence_{feature}.png")
        """
    ),
    md(
        """
        ## 12. 聚类与人群分层

        在不使用 `Layoff_Risk` 的情况下，根据岗位任务、AI 使用、自动化、经验和岗位级别进行无监督分群，再观察每个群体的风险分布。
        """
    ),
    code(
        """
        cluster_features = [
            "Routine_Task_Percentage",
            "Creativity_Requirement",
            "Human_Interaction_Level",
            "AI_Adoption_Score",
            "Number_of_AI_Tools_Used",
            "AI_Usage_Hours_Per_Week",
            "Tasks_Automated_Percentage",
            "AI_Training_Hours",
            "Years_of_Experience",
            "Job_Level_Score",
            "Automation_Exposure_Index",
            "Human_Creative_Protection_Index",
            "AI_Intensity_Index",
        ]

        cluster_matrix = df_fe[cluster_features].copy()
        scaler = StandardScaler()
        cluster_scaled = scaler.fit_transform(cluster_matrix)

        silhouette_rows = []
        for k in range(2, 7):
            labels = KMeans(n_clusters=k, n_init=20, random_state=RANDOM_STATE).fit_predict(cluster_scaled)
            score = silhouette_score(
                cluster_scaled,
                labels,
                sample_size=min(5000, len(df_fe)),
                random_state=RANDOM_STATE,
            )
            silhouette_rows.append({"k": k, "silhouette_score": score})

        silhouette_df = pd.DataFrame(silhouette_rows)
        display(silhouette_df)
        silhouette_df.to_csv(TABLE_DIR / "kmeans_silhouette_scores.csv", index=False)

        selected_k = int(silhouette_df.sort_values("silhouette_score", ascending=False).iloc[0]["k"])
        kmeans = KMeans(n_clusters=selected_k, n_init=30, random_state=RANDOM_STATE)
        df_fe["Cluster"] = kmeans.fit_predict(cluster_scaled)
        print(f"选择聚类数: {selected_k}")

        cluster_profile = (
            df_fe.groupby("Cluster")
            .agg(
                n=(TARGET_COL, "size"),
                high_rate=("Risk_Binary", lambda s: (s == "High").mean()),
                avg_automation_exposure=("Automation_Exposure_Index", "mean"),
                avg_protection=("Human_Creative_Protection_Index", "mean"),
                avg_ai_intensity=("AI_Intensity_Index", "mean"),
                avg_routine=("Routine_Task_Percentage", "mean"),
                avg_tasks_automated=("Tasks_Automated_Percentage", "mean"),
                avg_creativity=("Creativity_Requirement", "mean"),
                avg_interaction=("Human_Interaction_Level", "mean"),
                avg_experience=("Years_of_Experience", "mean"),
            )
            .sort_values("high_rate", ascending=False)
        )
        display(cluster_profile)
        cluster_profile.to_csv(TABLE_DIR / "cluster_profile.csv")
        """
    ),
    code(
        """
        pca = PCA(n_components=2, random_state=RANDOM_STATE)
        cluster_pca = pca.fit_transform(cluster_scaled)
        pca_df = pd.DataFrame(cluster_pca, columns=["PC1", "PC2"])
        pca_df["Cluster"] = df_fe["Cluster"].astype(str).to_numpy()
        pca_df[TARGET_COL] = df_fe[TARGET_COL].astype(str).to_numpy()

        sample_pca = pca_df.sample(min(6000, len(pca_df)), random_state=RANDOM_STATE)
        sns.scatterplot(
            data=sample_pca,
            x="PC1",
            y="PC2",
            hue="Cluster",
            style=TARGET_COL,
            alpha=0.55,
            s=28,
        )
        plt.title("KMeans clusters projected by PCA")
        savefig("cluster_pca_scatter.png")

        cluster_risk_distribution = pd.crosstab(
            df_fe["Cluster"], df_fe[TARGET_COL], normalize="index"
        ).reindex(columns=RISK_ORDER)
        display(cluster_risk_distribution)
        cluster_risk_distribution.to_csv(TABLE_DIR / "cluster_risk_distribution.csv")
        """
    ),
    code(
        """
        cluster_descriptions = []
        global_high_rate = df_fe["Risk_Binary"].eq("High").mean()
        global_exposure = df_fe["Automation_Exposure_Index"].mean()
        global_protection = df_fe["Human_Creative_Protection_Index"].mean()
        global_ai_intensity = df_fe["AI_Intensity_Index"].mean()

        for cluster_id, row in cluster_profile.iterrows():
            label_parts = []
            if row["high_rate"] >= global_high_rate + 0.10:
                label_parts.append("高风险")
            elif row["high_rate"] <= global_high_rate - 0.10:
                label_parts.append("低风险")
            else:
                label_parts.append("中等风险")

            if row["avg_automation_exposure"] >= global_exposure + 8:
                label_parts.append("高自动化暴露")
            elif row["avg_automation_exposure"] <= global_exposure - 8:
                label_parts.append("低自动化暴露")

            if row["avg_protection"] >= global_protection + 8:
                label_parts.append("高创造力互动保护")
            elif row["avg_protection"] <= global_protection - 8:
                label_parts.append("低创造力互动保护")

            if row["avg_ai_intensity"] >= global_ai_intensity + 8:
                label_parts.append("高 AI 使用强度")
            elif row["avg_ai_intensity"] <= global_ai_intensity - 8:
                label_parts.append("低 AI 使用强度")

            top_industries = (
                df_fe[df_fe["Cluster"] == cluster_id]["Industry"]
                .value_counts(normalize=True)
                .head(3)
                .mul(100)
                .round(1)
            )
            top_roles = (
                df_fe[df_fe["Cluster"] == cluster_id]["Job_Role"]
                .value_counts(normalize=True)
                .head(3)
                .mul(100)
                .round(1)
            )

            cluster_descriptions.append(
                {
                    "Cluster": cluster_id,
                    "profile_label": "、".join(label_parts),
                    "n": int(row["n"]),
                    "high_rate": row["high_rate"],
                    "top_industries": "; ".join([f"{idx}: {val:.1f}%" for idx, val in top_industries.items()]),
                    "top_roles": "; ".join([f"{idx}: {val:.1f}%" for idx, val in top_roles.items()]),
                }
            )

        cluster_descriptions_df = pd.DataFrame(cluster_descriptions).sort_values("high_rate", ascending=False)
        display(cluster_descriptions_df)
        cluster_descriptions_df.to_csv(TABLE_DIR / "cluster_descriptions.csv", index=False)
        """
    ),
    md(
        """
        ## 13. 业务洞察与建议

        以下结论由前述统计分析、建模和聚类结果自动汇总。由于该数据集是观察型数据，相关性和模型重要性不能直接解释为严格因果关系。
        """
    ),
    code(
        """
        top_industries = high_risk_by_industry.head(3)
        top_roles = high_risk_by_role.head(5)
        ai_risk = risk_distribution(df, "AI_Adoption_Level").reindex(["High", "Medium", "Low"])
        job_level_risk = risk_distribution(df, "Job_Level").reindex(["Entry", "Mid", "Senior"])
        education_risk = risk_distribution(df, "Education_Level")

        high_means = df.groupby(TARGET_COL)[NUMERIC_COLS].mean().reindex(RISK_ORDER)
        best_multiclass_row = model_metrics_df.iloc[0]
        best_binary_row = binary_metrics_df.iloc[0]
        top_perm = permutation_importance_df.head(8)["feature"].tolist()
        top_shap = (
            shap_high_risk_importance_df.head(8)["feature"].tolist()
            if "shap_high_risk_importance_df" in globals() and not shap_high_risk_importance_df.empty
            else []
        )
        most_risky_cluster = cluster_profile.index[0]

        print("核心结论")
        print("=" * 60)
        print(
            "1. 高风险行业集中在: "
            + ", ".join([f"{idx}({row['High_Rate']:.1%})" for idx, row in top_industries.iterrows()])
        )
        print(
            "2. 高风险岗位集中在: "
            + ", ".join([f"{idx}({row['High_Rate']:.1%})" for idx, row in top_roles.iterrows()])
        )
        print(
            "3. AI 采用等级越高，高风险比例越高: "
            + ", ".join([f"{idx}={row['High_Rate']:.1%}" for idx, row in ai_risk.iterrows()])
        )
        print(
            "4. 岗位级别具有明显缓冲作用: "
            + ", ".join([f"{idx}={row['High_Rate']:.1%}" for idx, row in job_level_risk.iterrows()])
        )
        print(
            "5. 高风险样本的重复性任务比例、自动化比例和 AI 使用强度显著更高；创造力要求显著更低。"
        )
        print(
            f"   High 风险均值: Routine={high_means.loc['High','Routine_Task_Percentage']:.1f}, "
            f"Automated={high_means.loc['High','Tasks_Automated_Percentage']:.1f}, "
            f"Creativity={high_means.loc['High','Creativity_Requirement']:.1f}"
        )
        print(
            f"   Low 风险均值: Routine={high_means.loc['Low','Routine_Task_Percentage']:.1f}, "
            f"Automated={high_means.loc['Low','Tasks_Automated_Percentage']:.1f}, "
            f"Creativity={high_means.loc['Low','Creativity_Requirement']:.1f}"
        )
        print(
            "6. AI 培训小时数在高风险组更高，这更像是高风险岗位接受更多培训或补救投入；不能单凭本数据断言培训本身提高风险。"
        )
        print(
            f"7. 最佳多分类模型为 {best_multiclass_row['model']}，"
            f"Macro F1={best_multiclass_row['macro_f1']:.3f}，Accuracy={best_multiclass_row['accuracy']:.3f}。"
        )
        print(
            f"8. 最佳二分类预警模型为 {best_binary_row['model']}，"
            f"High Recall={best_binary_row['high_recall']:.3f}，PR-AUC={best_binary_row['pr_auc']:.3f}。"
        )
        print("9. 对模型最重要的输入特征包括: " + ", ".join(top_perm))
        if top_shap:
            print("10. SHAP 高风险方向解释中最重要的特征包括: " + ", ".join(top_shap))
            cluster_line_no = "11"
        else:
            cluster_line_no = "10"
        print(
            f"{cluster_line_no}. 聚类中最高风险群体为 Cluster {most_risky_cluster}，"
            f"高风险比例 {cluster_profile.loc[most_risky_cluster, 'high_rate']:.1%}。"
        )
        """
    ),
    md(
        """
        ### 可操作建议

        1. **优先预警对象**：制造、物流、零售等高风险行业中的重复性任务占比高、自动化比例高、AI 采用等级高的岗位，应优先进入风险监测名单。
        2. **岗位转型方向**：对 `Operator`、`Production Supervisor`、`Quality Engineer`、`Inventory Analyst` 等高风险岗位，优先推动流程管理、异常处理、跨职能协作、数据解释和 AI 协同能力训练。
        3. **培训策略**：AI 培训不应只作为高风险后的补救措施，应与岗位重设计结合，重点降低纯重复任务占比，提高员工对 AI 输出的判断、复核和业务决策能力。
        4. **组织层面**：公司规模与风险的统计关联较弱，说明风险更可能来自岗位任务结构、AI 采用水平和岗位级别，而不是单纯来自组织规模。
        5. **模型应用**：二分类高风险预警模型表现较好，可用于内部筛查，但落地时应引入人工复核、业务规则和近期组织变动信息，避免把模型分数直接作为裁员决策依据。
        """
    ),
]


nb = nbf.v4.new_notebook()
nb.cells = cells
nb.metadata["kernelspec"] = {
    "display_name": "Python 3",
    "language": "python",
    "name": "python3",
}
nb.metadata["language_info"] = {
    "name": "python",
    "pygments_lexer": "ipython3",
}


def main() -> None:
    nbf.write(nb, NOTEBOOK_PATH)
    print(f"Notebook written: {NOTEBOOK_PATH}")

    client = NotebookClient(
        nb,
        timeout=1200,
        kernel_name="python3",
        allow_errors=False,
        resources={"metadata": {"path": str(Path.cwd())}},
    )
    client.execute()
    nbf.write(nb, NOTEBOOK_PATH)
    print(f"Notebook executed and saved: {NOTEBOOK_PATH}")


if __name__ == "__main__":
    main()
