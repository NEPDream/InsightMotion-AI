import "./index.css";
import { Composition } from "remotion";
import {
  MyComposition,
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
} from "./Composition";
import { CYBER_HEIGHT, CYBER_WIDTH } from "./cyber-impact/data";
import {
  CyberImpactVideo,
  CYBER_IMPACT_DURATION_IN_FRAMES,
} from "./cyber-impact/CyberImpactVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={VIDEO_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="CyberImpactVideo"
        component={CyberImpactVideo}
        durationInFrames={CYBER_IMPACT_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={CYBER_WIDTH}
        height={CYBER_HEIGHT}
      />
    </>
  );
};
