import "./index.css";
import { Composition } from "remotion";
import {
  MyComposition,
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
} from "./Composition";

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
    </>
  );
};
