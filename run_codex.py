from __future__ import annotations

import argparse
import os
import re
from dataclasses import dataclass
from pathlib import Path

from openai_codex import Codex, Sandbox


PROJECT_ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL = "gpt-5.4"
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "codex_prompt_outputs"


@dataclass(frozen=True)
class PromptJob:
    """A single Codex prompt to run."""

    name: str
    prompt: str


PROMPTS = [
    PromptJob(
        name="review_project_structure",
        prompt="""
        读取并分析 dataset 文件夹下面的所有dateset数据文件，然后根据里面的数据内容，
        制定详细的数据分析计划，并把数据分析计划使用markdown格式保存在 dataset 文件夹中，
        要求文件名中必须包含plan。
        """,
    ),
    PromptJob(
        name="implement_changes",
        prompt="""
        认真阅读 dataset 目录下的名称包含plan的数据分析计划书，
        然后按照计划书中的内容，配置相关环境，并执行数据分析，
        数据分析后的结果，必须使用jupter notebook格式保存在 dataset 文件夹中，
        要求文件名中必须包含analysis。
        """,
    ),
    PromptJob(
        name="implement_changes",
        prompt="""
        认真阅读 dataset 目录下的名称包含analysis的数据分析报告，
        然后根据jupter notebook中的内容，使用中文，写成一篇详细深入
        的全中文数据分析报告，要求文件名必须包含 report。
        """,
    ),
    PromptJob(
        name="implement_changes",
        prompt="""
        为当前项目执行 `npm install`，并执行 `npm run dev`，确保没有任何报错
        """,
    ),
    PromptJob(
        name="implement_changes",
        prompt="""
        认真阅读 dataset 目录下的文件名包含report的数据分析报告，深入理解内容后，
        在 visualization 目录下生成两个markdown格式的分镜设计文件，要求一个是赛博朋克科技风，
        另一个是比较大众的视频风格，赛博朋克科技风的视频要求比较炫酷，大众风格的则不需要。
        在分镜脚本中，第一个画面都需要添加上“感谢Linux.do和Unity2.ai”的画面，相关的图片
        放在了public目录中。
        """,
    ),
    PromptJob(
        name="implement_changes",
        prompt="""
        按照visualization目录下面的两个分镜设计脚本，开始使用安装的nodejs的依赖进行视频制作，
        需要调用remotion的技能。制作完成后的代码必须保存在src目录中，不用对生成的视频进行渲染和
        导出，我自己觉得不错后，我自己会进行渲染和导出。
        """,
    ),
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run the prompts declared in PROMPTS with openai-codex.",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Codex model to use. Default: {DEFAULT_MODEL}",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Directory for final responses. Default: {DEFAULT_OUTPUT_DIR}",
    )
    parser.add_argument(
        "--separate-threads",
        action="store_true",
        help="Run each prompt in a fresh Codex thread instead of one shared thread.",
    )
    parser.add_argument(
        "--continue-on-error",
        action="store_true",
        help="Continue running later prompts if one prompt fails.",
    )
    return parser.parse_args()


def validate_prompts(prompts: list[PromptJob]) -> None:
    if not prompts:
        raise SystemExit("PROMPTS 为空。请先在 run_codex.py 中填写 PromptJob。")

    for index, job in enumerate(prompts, start=1):
        if not job.name.strip():
            raise SystemExit(f"第 {index} 个 PromptJob 的 name 为空。")
        if not job.prompt.strip():
            raise SystemExit(f"PromptJob {job.name!r} 的 prompt 为空。")


def safe_filename(name: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_.-]+", "_", name.strip())
    return cleaned.strip("._") or "prompt"


def final_response_text(result: object) -> str:
    final_response = getattr(result, "final_response", None)
    if final_response is None:
        return str(result)
    return str(final_response)


def write_response(output_dir: Path, index: int, job: PromptJob, text: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{index:02d}_{safe_filename(job.name)}.md"
    output_path.write_text(text.rstrip() + "\n", encoding="utf-8")
    return output_path


def run_prompts(args: argparse.Namespace) -> None:
    validate_prompts(PROMPTS)

    output_dir = args.output_dir.resolve()

    # Keep Codex's app-server rooted at this repository even if the script is
    # launched from a different working directory.
    os.chdir(PROJECT_ROOT)

    with Codex() as codex:
        thread = None

        for index, job in enumerate(PROMPTS, start=1):
            should_start_thread = args.separate_threads or thread is None

            try:
                if should_start_thread:
                    thread = codex.thread_start(
                        model=args.model,
                        sandbox=Sandbox.full_access,
                    )

                result = thread.run(job.prompt)
                response_text = final_response_text(result)
                output_path = write_response(output_dir, index, job, response_text)
                print(f"[{index}/{len(PROMPTS)}] {job.name}: {output_path}")
            except Exception as exc:
                print(f"[{index}/{len(PROMPTS)}] {job.name}: failed: {exc}")
                if not args.continue_on_error:
                    raise


def main() -> None:
    run_prompts(parse_args())


if __name__ == "__main__":
    main()
