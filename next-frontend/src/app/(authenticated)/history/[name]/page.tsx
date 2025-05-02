import AvatarVideoPage from '@/components/AvatarVideoPage';
import React from 'react'
type Props = {
    params: {
      name: string;
    };
  };

const Page = async({params}:Props) => {
    const name = params.name;
  return (
    <AvatarVideoPage name={name}/>
  )
}

export default Page
