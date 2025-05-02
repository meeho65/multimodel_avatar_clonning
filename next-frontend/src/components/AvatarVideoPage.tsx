"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getVideos } from "@/actions/actions";

interface Props {
  name: string;
}



export default function AvatarVideoPage({ name }: Props) {
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["videos", name],
    queryFn: () => getVideos(session?.accessToken as string, name),
    enabled: !!session?.accessToken,
  });

  useEffect(() => {
    if (data) {
      console.log("Videos: ", data);
    }
  }, [data]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Videos for {name}</h2>

      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : isError ? (
        <div className="alert alert-danger">
          {typeof error === "string" ? error : "Failed to fetch videos."}
        </div>
      ) : (
        <div className="row">
          {Object.entries(data || {}).map(([videoName, videoUrl]) => (
            <div className="col-md-6 mb-4" key={videoName}>
              <div className="card">
                <video className="card-img-top" controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="card-body">
                  <h5 className="card-title">{videoName}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
