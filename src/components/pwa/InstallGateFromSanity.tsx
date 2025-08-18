import { client } from "@/sanity";
import { appSettingsQuery } from "@/sanity/queries";
import InstallGate from "./InstallGate";

export default async function InstallGateFromSanity() {
  const data = await client.fetch<{
    brandName?: string;
    themeTint?: string;
    logoUrl?: string;
    splash?: {
      useVideo?: boolean;
      bgImageUrl?: string;
      posterUrl?: string;
      webmUrl?: string;
      mp4Url?: string;
    };
  }>(appSettingsQuery, {}, { next: { revalidate: 60 } });

  if (!data) return null;

  const tint = data.themeTint?.trim();
  const tintStyle = tint ? (
    // set the CSS var once for the whole app
    <style dangerouslySetInnerHTML={{ __html: `:root{--tint:${tint}}` }} />
  ) : null;

  const videoSources = data.splash?.useVideo
    ? [
        ...(data.splash?.webmUrl
          ? [{ src: data.splash.webmUrl, type: "video/webm" as const }]
          : []),
        ...(data.splash?.mp4Url
          ? [{ src: data.splash.mp4Url, type: "video/mp4" as const }]
          : []),
      ]
    : [];

  return (
    <>
      {tintStyle}
      <InstallGate
        brand={data.brandName || "Your App"}
        logoSrc={data.logoUrl || "/brand/logo.png"}
        bgImage={data.splash?.bgImageUrl || "/brand/bg.jpg"}
        videoPoster={
          data.splash?.posterUrl || data.splash?.bgImageUrl || "/brand/bg.jpg"
        }
        videoSources={videoSources}
      />
    </>
  );
}
