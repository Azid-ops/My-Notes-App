import { useParams } from "react-router-dom";
import NotePage from "./NotePage";

export default function NotePageWrapper() {
  const { slug } = useParams<{ slug: string }>();

  // If slug is undefined, render null (should never happen if route is correct)
  if (!slug) return null;

  // Pass slug as prop and use it as key to force remount
  return <NotePage key={slug} slug={slug} />;
}
