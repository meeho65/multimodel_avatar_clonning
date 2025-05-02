"use client"
import { getHistory } from '@/actions/actions';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Avatars() {
  const {data:session} = useSession()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(session?.accessToken),
    enabled: !!session?.accessToken,
  });



  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Avatars</h2>

      {isLoading?(
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      ):isError?(
        <div className="alert alert-danger">Something went wrong</div>
      ):(
        
        <div className="row">
        {data?.avatars?.map((avatar, index) => (
          <Link href={`/history/${avatar.name}`} className="col-md-4 mb-4" key={index}>
            <div className="card h-100">
              <img src={avatar.image_url} className="card-img-top" alt={avatar.name} />
              <div className="card-body">
                <h5 className="card-title">{avatar.name}</h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
