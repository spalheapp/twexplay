import { useListEvents } from "@/nostr/useListEvents";
import { usePostComment } from "@/nostr/usePostComment";
import { Event, getPublicKey, generatePrivateKey, getEventHash, signEvent, UnsignedEvent } from "nostr-tools";
import { useEffect, useState } from "react";
import Comments from "./Comments";
import Player from "./Player";

const Comment: React.FC<{ comment: Event }> = ({ comment }) => (
  <div>
    {comment.content}
  </div>
)

const Wavman: React.FC<{}> = ({}) => {
  const { data: tracks, loading: tracksLoading } = useListEvents([{ kinds: [32123], limit: 10 }]);
  const [nowPlayingTrack, setNowPlayingTrack] = useState<Event>();
  const shouldSkipComments = !nowPlayingTrack;
  const { data: comments, loading: commentsLoading, mutate: addComment } = useListEvents([{ ['#e']: [nowPlayingTrack?.id || ''], limit: 20 }], shouldSkipComments);
  const [postComment, { data: postedComment, loading: postCommentLoading, error: postCommentError }] = usePostComment();

  const [trackIndex, setTrackIndex] = useState(0);

  const pickRandomTrack = (tracks: Event[]) => {
    setNowPlayingTrack(tracks[trackIndex]);
    setTrackIndex(trackIndex + 1);
    // setNowPlayingTrack(tracks[Math.floor(Math.random() * tracks.length)]);
  }

  useEffect(() => {
    if (tracks?.length) pickRandomTrack(tracks);
  }, [tracks]);

  const nextHandler = () => {
    if (tracks?.length) pickRandomTrack(tracks)
  };
  const submitCommentHandler = (content: string) => {
    if (nowPlayingTrack) {
      let sk = generatePrivateKey()
      let pk = getPublicKey(sk)
      let unsignedEvent: UnsignedEvent = {
        kind: 1,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", nowPlayingTrack.id, "wss://relay.wavlake.com/", "reply"]],
        content,
      }
      const signedEvent: Event = {
        ...unsignedEvent,
        id: getEventHash(unsignedEvent),
        sig: signEvent(unsignedEvent, sk),
      }

      postComment(signedEvent);
    }
  };
  return (
    <div className="flex-col">
      <Player loading={tracksLoading} nowPlayingTrack={nowPlayingTrack} nextHandler={nextHandler} />
      <Comments loading={commentsLoading} comments={comments} submitCommentHandler={submitCommentHandler} />
    </div>
  )
}

export default Wavman;