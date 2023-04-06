import ReactPlayerWrapper from "../ReactPlayerWrapper";
import {
  COMMENTS_VIEW,
  PageView,
  PLAYER_VIEW,
  SPLASH_VIEW,
  ZAP_VIEW,
  OFF_VIEW,
} from "../shared";
import CommentsScreen from "./CommentsScreen";
import NowPlayingScreen from "./NowPlayingScreen";
import OnScreenActions from "./OnScreenActions";
import { WavlakeEventContent } from "@/nostr";
import { Event } from "nostr-tools";
import { FormProvider, useForm } from "react-hook-form";

const Screen: React.FC<{
  isPlaying: boolean;
  submitHandler: (data: any) => void;
  commentsLoading: boolean;
  comments: Event[];
  pageView: PageView;
  selectedActionIndex: number;
  nowPlayingTrack?: Event;
}> = ({
  isPlaying,
  submitHandler,
  commentsLoading,
  comments,
  pageView,
  selectedActionIndex,
  nowPlayingTrack,
}) => {
  const methods = useForm({
    defaultValues: {
      comment: "",
    },
  });
  const getScreenColor = () => {
    switch (pageView) {
      case PLAYER_VIEW:
        return "bg-wavgreen";
      case COMMENTS_VIEW:
      case ZAP_VIEW:
        return "bg-wavpurple";
      case OFF_VIEW:
      case SPLASH_VIEW:
      default:
        return "bg-emerald-800";
    }
  };

  return (
    <div className={`h-80 w-80 ${getScreenColor()}`}>
      {(() => {
        if (!nowPlayingTrack) return <div>Track Loading Screen</div>;
        const trackContent: WavlakeEventContent = JSON.parse(
          nowPlayingTrack.content
        );

        return (
          <FormProvider {...methods}>
            <ReactPlayerWrapper
              url={trackContent.enclosure}
              isPlaying={isPlaying}
            />
            <form onSubmit={methods.handleSubmit(submitHandler)}>
              {(() => {
                switch (pageView) {
                  case COMMENTS_VIEW:
                    return (
                      <CommentsScreen
                        loading={commentsLoading}
                        comments={comments || []}
                      />
                    );
                  case PLAYER_VIEW:
                    return (
                      <NowPlayingScreen
                        trackContent={trackContent}
                        isPlaying={isPlaying}
                      />
                    );
                  case ZAP_VIEW:
                    return <>zap</>;
                  case SPLASH_VIEW:
                    return <>splash</>;
                  default:
                    return <>default</>;
                }
              })()}
              <OnScreenActions
                selectedActionIndex={selectedActionIndex}
                pageView={pageView}
              />
            </form>
          </FormProvider>
        );
      })()}
    </div>
  );
};

export default Screen;